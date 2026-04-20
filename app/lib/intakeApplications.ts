import { neon } from "@neondatabase/serverless";
import { findIntakeListingById } from "./intakeListings";

export type IntakeApplicationStatus =
  | "draft"
  | "payment_pending"
  | "submitted"
  | "under_review"
  | "approved"
  | "declined";

export type IntakeApplication = {
  id: string;
  listingId: string;
  applicantName: string;
  email: string;
  phone: string;
  moveInDate?: string;
  monthlyIncome?: number;
  occupants?: number;
  notes?: string;
  status: IntakeApplicationStatus;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  submittedAt?: string;
  createdAt: string;
};

export type LandlordApplicationQueueItem = {
  applicationId: string;
  listingId: string;
  propertyTitle: string;
  propertyAddress: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  status: IntakeApplicationStatus;
  submittedAt?: string;
  createdAt: string;
};

type IntakeApplicationStore = Map<string, IntakeApplication>;

const databaseUrl = process.env.POSTGRES_URL;
const hasPostgres = Boolean(databaseUrl);
const sqlClient = hasPostgres ? neon(databaseUrl as string) : null;

declare global {
  var verdanscIntakeApplicationStore: IntakeApplicationStore | undefined;
}

const store: IntakeApplicationStore =
  globalThis.verdanscIntakeApplicationStore ?? new Map();
if (!globalThis.verdanscIntakeApplicationStore) {
  globalThis.verdanscIntakeApplicationStore = store;
}

function fromRow(row: Record<string, unknown>): IntakeApplication {
  return {
    id: String(row.id ?? ""),
    listingId: String(row.listing_id ?? ""),
    applicantName: String(row.applicant_name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    moveInDate: typeof row.move_in_date === "string" ? row.move_in_date : undefined,
    monthlyIncome:
      typeof row.monthly_income === "number"
        ? row.monthly_income
        : typeof row.monthly_income === "string"
          ? Number(row.monthly_income)
          : undefined,
    occupants:
      typeof row.occupants === "number"
        ? row.occupants
        : typeof row.occupants === "string"
          ? Number(row.occupants)
          : undefined,
    notes: typeof row.notes === "string" ? row.notes : undefined,
    status: (row.status as IntakeApplicationStatus) ?? "draft",
    stripeCheckoutSessionId:
      typeof row.stripe_checkout_session_id === "string"
        ? row.stripe_checkout_session_id
        : undefined,
    stripePaymentIntentId:
      typeof row.stripe_payment_intent_id === "string"
        ? row.stripe_payment_intent_id
        : undefined,
    stripeCustomerId:
      typeof row.stripe_customer_id === "string"
        ? row.stripe_customer_id
        : undefined,
    submittedAt:
      typeof row.submitted_at === "string"
        ? row.submitted_at
        : row.submitted_at instanceof Date
          ? row.submitted_at.toISOString()
          : undefined,
    createdAt:
      typeof row.created_at === "string"
        ? row.created_at
        : row.created_at instanceof Date
          ? row.created_at.toISOString()
          : new Date().toISOString(),
  };
}

async function ensureIntakeApplicationsTable() {
  if (!hasPostgres) return;
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  await sql`
    CREATE TABLE IF NOT EXISTS verdansc_intake_applications (
      id TEXT PRIMARY KEY,
      listing_id TEXT NOT NULL,
      applicant_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      move_in_date TEXT,
      monthly_income NUMERIC,
      occupants INTEGER,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      stripe_checkout_session_id TEXT,
      stripe_payment_intent_id TEXT,
      stripe_customer_id TEXT,
      submitted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS verdansc_intake_applications_listing_idx
    ON verdansc_intake_applications (listing_id)
  `;
}

function newApplicationId() {
  return `app_${Math.random().toString(36).slice(2, 10)}`;
}

export async function createIntakeApplicationDraft(input: {
  listingId: string;
  applicantName: string;
  email: string;
  phone: string;
  moveInDate?: string;
  monthlyIncome?: number;
  occupants?: number;
  notes?: string;
}) {
  const record: IntakeApplication = {
    id: newApplicationId(),
    listingId: input.listingId.trim(),
    applicantName: input.applicantName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    moveInDate: input.moveInDate?.trim() || undefined,
    monthlyIncome: input.monthlyIncome,
    occupants: input.occupants,
    notes: input.notes?.trim() || undefined,
    status: "draft",
    createdAt: new Date().toISOString(),
  };

  if (!hasPostgres) {
    store.set(record.id, record);
    return record;
  }

  await ensureIntakeApplicationsTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    INSERT INTO verdansc_intake_applications (
      id,
      listing_id,
      applicant_name,
      email,
      phone,
      move_in_date,
      monthly_income,
      occupants,
      notes,
      status,
      stripe_checkout_session_id,
      stripe_payment_intent_id,
      stripe_customer_id,
      submitted_at,
      created_at,
      updated_at
    ) VALUES (
      ${record.id},
      ${record.listingId},
      ${record.applicantName},
      ${record.email},
      ${record.phone},
      ${record.moveInDate ?? null},
      ${record.monthlyIncome ?? null},
      ${record.occupants ?? null},
      ${record.notes ?? null},
      ${record.status},
      ${record.stripeCheckoutSessionId ?? null},
      ${record.stripePaymentIntentId ?? null},
      ${record.stripeCustomerId ?? null},
      ${record.submittedAt ?? null},
      ${record.createdAt},
      NOW()
    )
    RETURNING *
  `;
  return result[0] ? fromRow(result[0]) : record;
}

export async function findIntakeApplicationById(applicationId: string) {
  const key = applicationId.trim();
  if (!key) return undefined;

  if (!hasPostgres) {
    return store.get(key);
  }

  await ensureIntakeApplicationsTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    SELECT * FROM verdansc_intake_applications
    WHERE id = ${key}
    LIMIT 1
  `;
  return result[0] ? fromRow(result[0]) : undefined;
}

export async function updateIntakeApplicationById(
  applicationId: string,
  updates: Partial<IntakeApplication>,
) {
  const key = applicationId.trim();
  if (!key) return undefined;

  if (!hasPostgres) {
    const existing = store.get(key);
    if (!existing) return undefined;
    const next = { ...existing, ...updates };
    store.set(key, next);
    return next;
  }

  await ensureIntakeApplicationsTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    UPDATE verdansc_intake_applications
    SET
      applicant_name = COALESCE(${updates.applicantName ?? null}, applicant_name),
      email = COALESCE(${updates.email ?? null}, email),
      phone = COALESCE(${updates.phone ?? null}, phone),
      move_in_date = COALESCE(${updates.moveInDate ?? null}, move_in_date),
      monthly_income = COALESCE(${updates.monthlyIncome ?? null}, monthly_income),
      occupants = COALESCE(${updates.occupants ?? null}, occupants),
      notes = COALESCE(${updates.notes ?? null}, notes),
      status = COALESCE(${updates.status ?? null}, status),
      stripe_checkout_session_id = COALESCE(${updates.stripeCheckoutSessionId ?? null}, stripe_checkout_session_id),
      stripe_payment_intent_id = COALESCE(${updates.stripePaymentIntentId ?? null}, stripe_payment_intent_id),
      stripe_customer_id = COALESCE(${updates.stripeCustomerId ?? null}, stripe_customer_id),
      submitted_at = COALESCE(${updates.submittedAt ?? null}, submitted_at),
      updated_at = NOW()
    WHERE id = ${key}
    RETURNING *
  `;
  return result[0] ? fromRow(result[0]) : undefined;
}

export async function listApplicationsForLandlord(ownerEmail: string) {
  const key = ownerEmail.trim().toLowerCase();
  if (!key) return [] as LandlordApplicationQueueItem[];

  if (!hasPostgres) {
    const queue: LandlordApplicationQueueItem[] = [];
    for (const application of store.values()) {
      if (application.status !== "submitted" && application.status !== "under_review") {
        continue;
      }
      const listing = await findIntakeListingById(application.listingId);
      if (!listing || listing.ownerEmail.toLowerCase() !== key) {
        continue;
      }
      queue.push({
        applicationId: application.id,
        listingId: application.listingId,
        propertyTitle: listing.propertyTitle,
        propertyAddress: listing.propertyAddress,
        applicantName: application.applicantName,
        applicantEmail: application.email,
        applicantPhone: application.phone,
        status: application.status,
        submittedAt: application.submittedAt,
        createdAt: application.createdAt,
      });
    }
    return queue.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  await ensureIntakeApplicationsTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    SELECT
      app.id AS application_id,
      app.listing_id AS listing_id,
      app.applicant_name AS applicant_name,
      app.email AS applicant_email,
      app.phone AS applicant_phone,
      app.status AS status,
      app.submitted_at AS submitted_at,
      app.created_at AS created_at,
      listing.property_title AS property_title,
      listing.property_address AS property_address
    FROM verdansc_intake_applications app
    JOIN verdansc_intake_listings listing
      ON listing.id = app.listing_id
    WHERE listing.owner_email = ${key}
      AND app.status IN ('submitted', 'under_review')
    ORDER BY app.created_at DESC
    LIMIT 200
  `;

  return result.map((row) => ({
    applicationId: String(row.application_id ?? ""),
    listingId: String(row.listing_id ?? ""),
    propertyTitle: String(row.property_title ?? ""),
    propertyAddress: String(row.property_address ?? ""),
    applicantName: String(row.applicant_name ?? ""),
    applicantEmail: String(row.applicant_email ?? ""),
    applicantPhone: String(row.applicant_phone ?? ""),
    status: (row.status as IntakeApplicationStatus) ?? "submitted",
    submittedAt:
      typeof row.submitted_at === "string"
        ? row.submitted_at
        : row.submitted_at instanceof Date
          ? row.submitted_at.toISOString()
          : undefined,
    createdAt:
      typeof row.created_at === "string"
        ? row.created_at
        : row.created_at instanceof Date
          ? row.created_at.toISOString()
          : new Date().toISOString(),
  }));
}

