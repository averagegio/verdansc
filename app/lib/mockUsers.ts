import { neon } from "@neondatabase/serverless";
import { Audience } from "./subscriptionPlans";

export type SubscriptionStatus =
  | "inactive"
  | "checkout_pending"
  | "checkout_completed"
  | "trialing"
  | "active"
  | "past_due"
  | "unpaid"
  | "incomplete"
  | "canceled";

export type OnboardingStatus = "new" | "plan_selected" | "subscription_active";

export type MockUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Audience;
  planId: string;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionUpdatedAt?: string;
  onboardingStatus?: OnboardingStatus;
  createdAt: string;
};

type UserStore = Map<string, MockUser>;
const databaseUrl = process.env.POSTGRES_URL;
const hasPostgres = Boolean(databaseUrl);
const sqlClient = hasPostgres ? neon(databaseUrl as string) : null;

declare global {
  var verdanscUserStore: UserStore | undefined;
}

const store: UserStore = globalThis.verdanscUserStore ?? new Map();
if (!globalThis.verdanscUserStore) {
  globalThis.verdanscUserStore = store;
}

function fromRow(row: Record<string, unknown>): MockUser {
  return {
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    email: String(row.email ?? ""),
    password: String(row.password ?? ""),
    role: (row.role as Audience) ?? "renter",
    planId: String(row.plan_id ?? ""),
    subscriptionStatus: (row.subscription_status as SubscriptionStatus) ?? "inactive",
    stripeCustomerId:
      typeof row.stripe_customer_id === "string" ? row.stripe_customer_id : undefined,
    stripeSubscriptionId:
      typeof row.stripe_subscription_id === "string"
        ? row.stripe_subscription_id
        : undefined,
    subscriptionUpdatedAt:
      typeof row.subscription_updated_at === "string"
        ? row.subscription_updated_at
        : row.subscription_updated_at instanceof Date
          ? row.subscription_updated_at.toISOString()
          : undefined,
    onboardingStatus:
      (row.onboarding_status as OnboardingStatus | undefined) ?? "new",
    createdAt:
      typeof row.created_at === "string"
        ? row.created_at
        : row.created_at instanceof Date
          ? row.created_at.toISOString()
          : new Date().toISOString(),
  };
}

async function ensureUsersTable() {
  if (!hasPostgres) return;
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  await sql`
    CREATE TABLE IF NOT EXISTS verdansc_users (
      email TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      subscription_status TEXT NOT NULL DEFAULT 'inactive',
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      subscription_updated_at TIMESTAMPTZ,
      onboarding_status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS verdansc_users_stripe_customer_idx
    ON verdansc_users (stripe_customer_id)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS verdansc_users_stripe_subscription_idx
    ON verdansc_users (stripe_subscription_id)
  `;
}

export async function findUserByEmail(email: string) {
  const key = email.toLowerCase();
  if (!hasPostgres) return store.get(key);

  await ensureUsersTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`SELECT * FROM verdansc_users WHERE email = ${key} LIMIT 1`;
  return result[0] ? fromRow(result[0]) : undefined;
}

export async function createUser(user: MockUser) {
  const key = user.email.toLowerCase();
  const normalized: MockUser = { ...user, email: key };
  if (!hasPostgres) {
    store.set(key, normalized);
    return normalized;
  }

  await ensureUsersTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    INSERT INTO verdansc_users (
      email,
      first_name,
      last_name,
      password,
      role,
      plan_id,
      subscription_status,
      stripe_customer_id,
      stripe_subscription_id,
      subscription_updated_at,
      onboarding_status,
      created_at,
      updated_at
    ) VALUES (
      ${normalized.email},
      ${normalized.firstName},
      ${normalized.lastName},
      ${normalized.password},
      ${normalized.role},
      ${normalized.planId},
      ${normalized.subscriptionStatus},
      ${normalized.stripeCustomerId ?? null},
      ${normalized.stripeSubscriptionId ?? null},
      ${normalized.subscriptionUpdatedAt ?? null},
      ${normalized.onboardingStatus ?? "new"},
      ${normalized.createdAt},
      NOW()
    )
    RETURNING *
  `;
  return result[0] ? fromRow(result[0]) : undefined;
}

export async function updateUserByEmail(email: string, updates: Partial<MockUser>) {
  const key = email.toLowerCase();
  if (!hasPostgres) {
    const existing = store.get(key);
    if (!existing) return undefined;
    const next = { ...existing, ...updates };
    store.set(key, next);
    return next;
  }

  await ensureUsersTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    UPDATE verdansc_users
    SET
      first_name = COALESCE(${updates.firstName ?? null}, first_name),
      last_name = COALESCE(${updates.lastName ?? null}, last_name),
      password = COALESCE(${updates.password ?? null}, password),
      role = COALESCE(${updates.role ?? null}, role),
      plan_id = COALESCE(${updates.planId ?? null}, plan_id),
      subscription_status = COALESCE(${updates.subscriptionStatus ?? null}, subscription_status),
      stripe_customer_id = COALESCE(${updates.stripeCustomerId ?? null}, stripe_customer_id),
      stripe_subscription_id = COALESCE(${updates.stripeSubscriptionId ?? null}, stripe_subscription_id),
      subscription_updated_at = COALESCE(${updates.subscriptionUpdatedAt ?? null}, subscription_updated_at),
      onboarding_status = COALESCE(${updates.onboardingStatus ?? null}, onboarding_status),
      updated_at = NOW()
    WHERE email = ${key}
    RETURNING *
  `;
  return result[0] ? fromRow(result[0]) : undefined;
}

export async function findUserByStripeRefs({
  stripeCustomerId,
  stripeSubscriptionId,
}: {
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}) {
  if (!hasPostgres) {
    for (const user of store.values()) {
      const customerMatch =
        stripeCustomerId && user.stripeCustomerId === stripeCustomerId;
      const subscriptionMatch =
        stripeSubscriptionId && user.stripeSubscriptionId === stripeSubscriptionId;
      if (customerMatch || subscriptionMatch) {
        return user;
      }
    }
    return undefined;
  }

  await ensureUsersTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  if (stripeCustomerId && stripeSubscriptionId) {
    const result = await sql`
      SELECT * FROM verdansc_users
      WHERE stripe_customer_id = ${stripeCustomerId}
         OR stripe_subscription_id = ${stripeSubscriptionId}
      LIMIT 1
    `;
    return result[0] ? fromRow(result[0]) : undefined;
  }

  if (stripeCustomerId) {
    const result = await sql`
      SELECT * FROM verdansc_users
      WHERE stripe_customer_id = ${stripeCustomerId}
      LIMIT 1
    `;
    return result[0] ? fromRow(result[0]) : undefined;
  }

  if (stripeSubscriptionId) {
    const result = await sql`
      SELECT * FROM verdansc_users
      WHERE stripe_subscription_id = ${stripeSubscriptionId}
      LIMIT 1
    `;
    return result[0] ? fromRow(result[0]) : undefined;
  }

  return undefined;
}

export function getUserStorageMode() {
  return hasPostgres ? "postgres" : "in-memory";
}

export function getMissingStorageEnv() {
  const missing: string[] = [];
  if (!process.env.POSTGRES_URL) missing.push("POSTGRES_URL");
  return missing;
}

export async function clearInMemoryStoreForTests() {
  if (!hasPostgres) {
    store.clear();
  }
}
