import { neon } from "@neondatabase/serverless";

export type IntakeListing = {
  id: string;
  ownerEmail: string;
  propertyTitle: string;
  propertyAddress: string;
  applicationFeeCents: number;
  requirements?: string;
  createdAt: string;
};

type IntakeListingStore = Map<string, IntakeListing>;

const databaseUrl = process.env.POSTGRES_URL;
const hasPostgres = Boolean(databaseUrl);
const sqlClient = hasPostgres ? neon(databaseUrl as string) : null;

declare global {
  var verdanscIntakeListingStore: IntakeListingStore | undefined;
}

const store: IntakeListingStore = globalThis.verdanscIntakeListingStore ?? new Map();
if (!globalThis.verdanscIntakeListingStore) {
  globalThis.verdanscIntakeListingStore = store;
}

function fromRow(row: Record<string, unknown>): IntakeListing {
  return {
    id: String(row.id ?? ""),
    ownerEmail: String(row.owner_email ?? ""),
    propertyTitle: String(row.property_title ?? ""),
    propertyAddress: String(row.property_address ?? ""),
    applicationFeeCents: Number(row.application_fee_cents ?? 0),
    requirements:
      typeof row.requirements === "string" ? row.requirements : undefined,
    createdAt:
      typeof row.created_at === "string"
        ? row.created_at
        : row.created_at instanceof Date
          ? row.created_at.toISOString()
          : new Date().toISOString(),
  };
}

async function ensureIntakeListingsTable() {
  if (!hasPostgres) return;
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  await sql`
    CREATE TABLE IF NOT EXISTS verdansc_intake_listings (
      id TEXT PRIMARY KEY,
      owner_email TEXT NOT NULL,
      property_title TEXT NOT NULL,
      property_address TEXT NOT NULL,
      application_fee_cents INTEGER NOT NULL,
      requirements TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS verdansc_intake_owner_email_idx
    ON verdansc_intake_listings (owner_email)
  `;
}

function newListingId() {
  return `lst_${Math.random().toString(36).slice(2, 10)}`;
}

export async function createIntakeListing(input: {
  ownerEmail: string;
  propertyTitle: string;
  propertyAddress: string;
  applicationFeeCents: number;
  requirements?: string;
}) {
  const listing: IntakeListing = {
    id: newListingId(),
    ownerEmail: input.ownerEmail.toLowerCase(),
    propertyTitle: input.propertyTitle.trim(),
    propertyAddress: input.propertyAddress.trim(),
    applicationFeeCents: input.applicationFeeCents,
    requirements: input.requirements?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  if (!hasPostgres) {
    store.set(listing.id, listing);
    return listing;
  }

  await ensureIntakeListingsTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    INSERT INTO verdansc_intake_listings (
      id,
      owner_email,
      property_title,
      property_address,
      application_fee_cents,
      requirements,
      created_at,
      updated_at
    ) VALUES (
      ${listing.id},
      ${listing.ownerEmail},
      ${listing.propertyTitle},
      ${listing.propertyAddress},
      ${listing.applicationFeeCents},
      ${listing.requirements ?? null},
      ${listing.createdAt},
      NOW()
    )
    RETURNING *
  `;
  return result[0] ? fromRow(result[0]) : listing;
}

export async function findIntakeListingById(listingId: string) {
  const key = listingId.trim();
  if (!key) return undefined;

  if (!hasPostgres) {
    return store.get(key);
  }

  await ensureIntakeListingsTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    SELECT * FROM verdansc_intake_listings
    WHERE id = ${key}
    LIMIT 1
  `;
  return result[0] ? fromRow(result[0]) : undefined;
}

export async function listIntakeListings() {
  if (!hasPostgres) {
    return [...store.values()].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1,
    );
  }

  await ensureIntakeListingsTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    SELECT * FROM verdansc_intake_listings
    ORDER BY created_at DESC
    LIMIT 100
  `;
  return result.map((row) => fromRow(row as Record<string, unknown>));
}

