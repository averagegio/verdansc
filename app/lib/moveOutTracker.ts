import { neon } from "@neondatabase/serverless";

export type MoveOutChecklistItem = {
  id: string;
  label: string;
  complete: boolean;
  note: string;
};

export type MoveOutPlan = {
  email: string;
  caseLabel?: string;
  propertyAddress?: string;
  noticeDate?: string;
  leaseEndDate?: string;
  ledgerReady: boolean;
  noticeServed: boolean;
  communicationLogReady: boolean;
  notes?: string;
  evidenceImages: string[];
  checklist: MoveOutChecklistItem[];
  createdAt: string;
  updatedAt: string;
};

export type MoveOutPlanInsight = {
  readinessScore: number;
  completeCount: number;
  totalCount: number;
  nextActions: MoveOutChecklistItem[];
  riskWarning?: string;
};

type MoveOutPlanStore = Map<string, MoveOutPlan>;

const databaseUrl = process.env.POSTGRES_URL;
const hasPostgres = Boolean(databaseUrl);
const sqlClient = hasPostgres ? neon(databaseUrl as string) : null;

declare global {
  var verdanscMoveOutPlanStore: MoveOutPlanStore | undefined;
}

const store: MoveOutPlanStore = globalThis.verdanscMoveOutPlanStore ?? new Map();
if (!globalThis.verdanscMoveOutPlanStore) {
  globalThis.verdanscMoveOutPlanStore = store;
}

function normalizeChecklist(value: unknown): MoveOutChecklistItem[] {
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
    .filter((item): item is MoveOutChecklistItem => Boolean(item?.id && item?.label));
}

function normalizeImageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item : ""))
    .filter((item) => item.length > 0);
}

function fromRow(row: Record<string, unknown>): MoveOutPlan {
  const createdAtRaw = row.created_at;
  const updatedAtRaw = row.updated_at;

  return {
    email: String(row.email ?? "").toLowerCase(),
    caseLabel: typeof row.case_label === "string" ? row.case_label : undefined,
    propertyAddress:
      typeof row.property_address === "string" ? row.property_address : undefined,
    noticeDate: typeof row.notice_date === "string" ? row.notice_date : undefined,
    leaseEndDate:
      typeof row.lease_end_date === "string" ? row.lease_end_date : undefined,
    ledgerReady: Boolean(row.ledger_ready),
    noticeServed: Boolean(row.notice_served),
    communicationLogReady: Boolean(row.communication_log_ready),
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

async function ensureMoveOutPlansTable() {
  if (!hasPostgres) return;
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  await sql`
    CREATE TABLE IF NOT EXISTS verdansc_move_out_plans (
      email TEXT PRIMARY KEY,
      case_label TEXT,
      property_address TEXT,
      notice_date TEXT,
      lease_end_date TEXT,
      ledger_ready BOOLEAN NOT NULL DEFAULT FALSE,
      notice_served BOOLEAN NOT NULL DEFAULT FALSE,
      communication_log_ready BOOLEAN NOT NULL DEFAULT FALSE,
      notes TEXT,
      evidence_images JSONB NOT NULL DEFAULT '[]'::jsonb,
      checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export function buildMoveOutChecklist(input: {
  caseLabel?: string;
  propertyAddress?: string;
  noticeDate?: string;
  leaseEndDate?: string;
  ledgerReady: boolean;
  noticeServed: boolean;
  communicationLogReady: boolean;
}): MoveOutChecklistItem[] {
  return [
    {
      id: "case_context",
      label: "Document case and property context",
      complete: Boolean(
        input.caseLabel?.trim().length && input.propertyAddress?.trim().length,
      ),
      note:
        input.caseLabel && input.propertyAddress
          ? "Case and property details are recorded."
          : "Add case label and property address for clear documentation.",
    },
    {
      id: "notice_timeline",
      label: "Record notice and lease timeline",
      complete: Boolean(input.noticeDate && input.leaseEndDate),
      note:
        input.noticeDate && input.leaseEndDate
          ? "Notice date and lease end date are tracked."
          : "Set notice and lease dates to avoid deadline issues.",
    },
    {
      id: "rent_ledger",
      label: "Prepare rent ledger summary",
      complete: input.ledgerReady,
      note: input.ledgerReady
        ? "Ledger is marked ready."
        : "Compile balances and payment history before filing steps.",
    },
    {
      id: "notice_delivery",
      label: "Confirm notice delivery status",
      complete: input.noticeServed,
      note: input.noticeServed
        ? "Notice service marked complete."
        : "Track service completion and method for records.",
    },
    {
      id: "comms_history",
      label: "Compile communication log",
      complete: input.communicationLogReady,
      note: input.communicationLogReady
        ? "Communication history marked ready."
        : "Collect relevant communication timeline and records.",
    },
  ];
}

export async function getMoveOutPlanByEmail(email: string) {
  const key = email.toLowerCase().trim();
  if (!key) return undefined;

  if (!hasPostgres) {
    return store.get(key);
  }

  await ensureMoveOutPlansTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    SELECT * FROM verdansc_move_out_plans
    WHERE email = ${key}
    LIMIT 1
  `;
  return result[0] ? fromRow(result[0]) : undefined;
}

export async function upsertMoveOutPlanByEmail(
  email: string,
  updates: {
    caseLabel?: string;
    propertyAddress?: string;
    noticeDate?: string;
    leaseEndDate?: string;
    ledgerReady: boolean;
    noticeServed: boolean;
    communicationLogReady: boolean;
    notes?: string;
    evidenceImages?: string[];
  },
) {
  const key = email.toLowerCase().trim();
  const checklist = buildMoveOutChecklist(updates);
  const now = new Date().toISOString();

  const normalized: MoveOutPlan = {
    email: key,
    caseLabel: updates.caseLabel?.trim() || undefined,
    propertyAddress: updates.propertyAddress?.trim() || undefined,
    noticeDate: updates.noticeDate?.trim() || undefined,
    leaseEndDate: updates.leaseEndDate?.trim() || undefined,
    ledgerReady: updates.ledgerReady,
    noticeServed: updates.noticeServed,
    communicationLogReady: updates.communicationLogReady,
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

  await ensureMoveOutPlansTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    INSERT INTO verdansc_move_out_plans (
      email,
      case_label,
      property_address,
      notice_date,
      lease_end_date,
      ledger_ready,
      notice_served,
      communication_log_ready,
      notes,
      evidence_images,
      checklist,
      created_at,
      updated_at
    ) VALUES (
      ${key},
      ${normalized.caseLabel ?? null},
      ${normalized.propertyAddress ?? null},
      ${normalized.noticeDate ?? null},
      ${normalized.leaseEndDate ?? null},
      ${normalized.ledgerReady},
      ${normalized.noticeServed},
      ${normalized.communicationLogReady},
      ${normalized.notes ?? null},
      ${JSON.stringify(normalized.evidenceImages)}::jsonb,
      ${JSON.stringify(checklist)}::jsonb,
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
      case_label = EXCLUDED.case_label,
      property_address = EXCLUDED.property_address,
      notice_date = EXCLUDED.notice_date,
      lease_end_date = EXCLUDED.lease_end_date,
      ledger_ready = EXCLUDED.ledger_ready,
      notice_served = EXCLUDED.notice_served,
      communication_log_ready = EXCLUDED.communication_log_ready,
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

export function getMoveOutPlanInsight(
  plan: MoveOutPlan | undefined,
): MoveOutPlanInsight {
  const checklist = plan?.checklist ?? [];
  const totalCount = checklist.length;
  const completeCount = checklist.filter((item) => item.complete).length;
  const readinessScore =
    totalCount === 0 ? 0 : Math.round((completeCount / totalCount) * 100);
  const nextActions = checklist.filter((item) => !item.complete).slice(0, 2);

  let riskWarning: string | undefined;
  if (plan?.leaseEndDate) {
    const days = daysUntil(plan.leaseEndDate);
    const missingCritical = !plan.ledgerReady || !plan.communicationLogReady;
    if (days <= 7 && days >= 0 && missingCritical) {
      riskWarning =
        "Lease end date is within 7 days and key documentation remains incomplete.";
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

