import { neon } from "@neondatabase/serverless";

export type MoveInChecklistItem = {
  id: string;
  label: string;
  complete: boolean;
  note: string;
};

export type MoveInPlan = {
  email: string;
  moveInDate?: string;
  address?: string;
  utilitiesReady: boolean;
  insuranceReady: boolean;
  depositPaid: boolean;
  notes?: string;
  evidenceImages: string[];
  checklist: MoveInChecklistItem[];
  createdAt: string;
  updatedAt: string;
};

export type MoveInPlanInsight = {
  readinessScore: number;
  completeCount: number;
  totalCount: number;
  nextActions: MoveInChecklistItem[];
  riskWarning?: string;
};

type MoveInPlanStore = Map<string, MoveInPlan>;

const databaseUrl = process.env.POSTGRES_URL;
const hasPostgres = Boolean(databaseUrl);
const sqlClient = hasPostgres ? neon(databaseUrl as string) : null;

declare global {
  var verdanscMoveInPlanStore: MoveInPlanStore | undefined;
}

const store: MoveInPlanStore = globalThis.verdanscMoveInPlanStore ?? new Map();
if (!globalThis.verdanscMoveInPlanStore) {
  globalThis.verdanscMoveInPlanStore = store;
}

function normalizeChecklist(value: unknown): MoveInChecklistItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      return {
        id: String(row.id ?? ""),
        label: String(row.label ?? ""),
        complete: Boolean(row.complete),
        note: String(row.note ?? ""),
      };
    })
    .filter((item): item is MoveInChecklistItem => Boolean(item?.id && item?.label));
}

function normalizeImageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item : ""))
    .filter((item) => item.length > 0);
}

function fromRow(row: Record<string, unknown>): MoveInPlan {
  const updatedAtRaw = row.updated_at;
  const createdAtRaw = row.created_at;
  return {
    email: String(row.email ?? "").toLowerCase(),
    moveInDate: typeof row.move_in_date === "string" ? row.move_in_date : undefined,
    address: typeof row.address === "string" ? row.address : undefined,
    utilitiesReady: Boolean(row.utilities_ready),
    insuranceReady: Boolean(row.insurance_ready),
    depositPaid: Boolean(row.deposit_paid),
    notes: typeof row.notes === "string" ? row.notes : undefined,
    evidenceImages: normalizeImageUrls(row.evidence_images),
    checklist: normalizeChecklist(row.checklist),
    createdAt:
      typeof createdAtRaw === "string"
        ? createdAtRaw
        : createdAtRaw instanceof Date
          ? createdAtRaw.toISOString()
          : new Date().toISOString(),
    updatedAt:
      typeof updatedAtRaw === "string"
        ? updatedAtRaw
        : updatedAtRaw instanceof Date
          ? updatedAtRaw.toISOString()
          : new Date().toISOString(),
  };
}

async function ensureMoveInPlansTable() {
  if (!hasPostgres) return;
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  await sql`
    CREATE TABLE IF NOT EXISTS verdansc_move_in_plans (
      email TEXT PRIMARY KEY,
      move_in_date TEXT,
      address TEXT,
      utilities_ready BOOLEAN NOT NULL DEFAULT FALSE,
      insurance_ready BOOLEAN NOT NULL DEFAULT FALSE,
      deposit_paid BOOLEAN NOT NULL DEFAULT FALSE,
      notes TEXT,
      evidence_images JSONB NOT NULL DEFAULT '[]'::jsonb,
      checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export function buildMoveInChecklist(input: {
  moveInDate?: string;
  address?: string;
  utilitiesReady: boolean;
  insuranceReady: boolean;
  depositPaid: boolean;
}): MoveInChecklistItem[] {
  return [
    {
      id: "address_confirmed",
      label: "Confirm move-in address details",
      complete: Boolean(input.address && input.address.trim().length > 5),
      note: input.address
        ? "Address on file."
        : "Add full address to keep move-in documents accurate.",
    },
    {
      id: "utilities_setup",
      label: "Set up utilities before move-in day",
      complete: input.utilitiesReady,
      note: input.utilitiesReady
        ? "Utilities marked as scheduled."
        : "Confirm electric, water, and internet transfer dates.",
    },
    {
      id: "insurance_proof",
      label: "Confirm renter insurance",
      complete: input.insuranceReady,
      note: input.insuranceReady
        ? "Insurance marked complete."
        : "Upload or confirm policy proof before key handoff.",
    },
    {
      id: "deposit_confirmed",
      label: "Verify deposit payment",
      complete: input.depositPaid,
      note: input.depositPaid
        ? "Deposit marked paid."
        : "Pay and confirm deposit to avoid move-in delays.",
    },
    {
      id: "timeline_check",
      label: "Review move-in timeline",
      complete: Boolean(input.moveInDate && input.moveInDate.trim().length > 0),
      note: input.moveInDate
        ? `Target move-in date: ${input.moveInDate}.`
        : "Set a move-in date to get timeline reminders.",
    },
  ];
}

export async function getMoveInPlanByEmail(email: string) {
  const key = email.toLowerCase().trim();
  if (!key) return undefined;

  if (!hasPostgres) {
    return store.get(key);
  }

  await ensureMoveInPlansTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    SELECT * FROM verdansc_move_in_plans
    WHERE email = ${key}
    LIMIT 1
  `;
  return result[0] ? fromRow(result[0]) : undefined;
}

export async function upsertMoveInPlanByEmail(
  email: string,
  updates: {
    moveInDate?: string;
    address?: string;
    utilitiesReady: boolean;
    insuranceReady: boolean;
    depositPaid: boolean;
    notes?: string;
    evidenceImages?: string[];
  },
) {
  const key = email.toLowerCase().trim();
  const checklist = buildMoveInChecklist(updates);
  const now = new Date().toISOString();

  const normalized: MoveInPlan = {
    email: key,
    moveInDate: updates.moveInDate?.trim() || undefined,
    address: updates.address?.trim() || undefined,
    utilitiesReady: updates.utilitiesReady,
    insuranceReady: updates.insuranceReady,
    depositPaid: updates.depositPaid,
    notes: updates.notes?.trim() || undefined,
    evidenceImages: updates.evidenceImages ?? [],
    checklist,
    createdAt: now,
    updatedAt: now,
  };

  if (!hasPostgres) {
    const existing = store.get(key);
    const next = {
      ...normalized,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    store.set(key, next);
    return next;
  }

  await ensureMoveInPlansTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    INSERT INTO verdansc_move_in_plans (
      email,
      move_in_date,
      address,
      utilities_ready,
      insurance_ready,
      deposit_paid,
      notes,
      evidence_images,
      checklist,
      created_at,
      updated_at
    ) VALUES (
      ${key},
      ${normalized.moveInDate ?? null},
      ${normalized.address ?? null},
      ${normalized.utilitiesReady},
      ${normalized.insuranceReady},
      ${normalized.depositPaid},
      ${normalized.notes ?? null},
      ${JSON.stringify(normalized.evidenceImages)}::jsonb,
      ${JSON.stringify(checklist)}::jsonb,
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
      move_in_date = EXCLUDED.move_in_date,
      address = EXCLUDED.address,
      utilities_ready = EXCLUDED.utilities_ready,
      insurance_ready = EXCLUDED.insurance_ready,
      deposit_paid = EXCLUDED.deposit_paid,
      notes = EXCLUDED.notes,
      evidence_images = EXCLUDED.evidence_images,
      checklist = EXCLUDED.checklist,
      updated_at = NOW()
    RETURNING *
  `;
  return result[0] ? fromRow(result[0]) : normalized;
}

function daysUntil(dateValue: string) {
  const today = new Date();
  const target = new Date(dateValue);
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const targetUtc = Date.UTC(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );
  return Math.floor((targetUtc - todayUtc) / (1000 * 60 * 60 * 24));
}

export function getMoveInPlanInsight(plan: MoveInPlan | undefined): MoveInPlanInsight {
  const checklist = plan?.checklist ?? [];
  const totalCount = checklist.length;
  const completeCount = checklist.filter((item) => item.complete).length;
  const readinessScore =
    totalCount === 0 ? 0 : Math.round((completeCount / totalCount) * 100);
  const nextActions = checklist.filter((item) => !item.complete).slice(0, 2);

  let riskWarning: string | undefined;
  if (plan?.moveInDate) {
    const days = daysUntil(plan.moveInDate);
    const missingCritical = !plan.utilitiesReady || !plan.depositPaid;
    if (days <= 7 && days >= 0 && missingCritical) {
      riskWarning =
        "Move-in date is within 7 days and key requirements are incomplete.";
    }
  }

  return {
    readinessScore,
    completeCount,
    totalCount,
    nextActions,
    riskWarning,
  };
}

