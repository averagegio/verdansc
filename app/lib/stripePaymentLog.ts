import { neon } from "@neondatabase/serverless";
import Stripe from "stripe";
import { classifyStripeProduct, StripeProductKind } from "./stripeTransactions";

export type StripePaymentLogRow = {
  eventId: string;
  eventType: string;
  paymentIntentId?: string;
  checkoutSessionId?: string;
  amountCents: number;
  currency: string;
  status: string;
  customerEmail: string | null;
  description: string;
  product: StripeProductKind;
  createdAt: string;
};

type LogStore = Map<string, StripePaymentLogRow>;

const databaseUrl = process.env.POSTGRES_URL;
const hasPostgres = Boolean(databaseUrl);
const sqlClient = hasPostgres ? neon(databaseUrl as string) : null;

declare global {
  var verdanscStripePaymentLog: LogStore | undefined;
}

const memoryStore: LogStore =
  globalThis.verdanscStripePaymentLog ?? new Map();
if (!globalThis.verdanscStripePaymentLog) {
  globalThis.verdanscStripePaymentLog = memoryStore;
}

async function ensureLogTable() {
  if (!hasPostgres) return;
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  await sql`
    CREATE TABLE IF NOT EXISTS verdansc_stripe_payment_log (
      event_id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      payment_intent_id TEXT,
      checkout_session_id TEXT,
      amount_cents INTEGER,
      currency TEXT,
      status TEXT,
      customer_email TEXT,
      description TEXT,
      product TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

async function insertLog(row: StripePaymentLogRow) {
  if (!hasPostgres) {
    if (memoryStore.has(row.eventId)) return { inserted: false };
    memoryStore.set(row.eventId, row);
    return { inserted: true };
  }

  await ensureLogTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`
    INSERT INTO verdansc_stripe_payment_log (
      event_id,
      event_type,
      payment_intent_id,
      checkout_session_id,
      amount_cents,
      currency,
      status,
      customer_email,
      description,
      product
    ) VALUES (
      ${row.eventId},
      ${row.eventType},
      ${row.paymentIntentId ?? null},
      ${row.checkoutSessionId ?? null},
      ${row.amountCents},
      ${row.currency},
      ${row.status},
      ${row.customerEmail},
      ${row.description},
      ${row.product}
    )
    ON CONFLICT (event_id) DO NOTHING
    RETURNING event_id
  `;
  return { inserted: result.length > 0 };
}

export async function countLoggedStripePayments() {
  if (!hasPostgres) return memoryStore.size;
  await ensureLogTable();
  const sql = sqlClient as NonNullable<typeof sqlClient>;
  const result = await sql`SELECT COUNT(*)::int AS count FROM verdansc_stripe_payment_log`;
  return Number(result[0]?.count ?? 0);
}

export async function recordStripePaymentEvent(event: Stripe.Event) {
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const description = intent.description || "PaymentIntent succeeded";
    return insertLog({
      eventId: event.id,
      eventType: event.type,
      paymentIntentId: intent.id,
      amountCents: intent.amount_received || intent.amount,
      currency: intent.currency || "usd",
      status: intent.status,
      customerEmail:
        intent.receipt_email ??
        intent.metadata?.email ??
        intent.metadata?.applicantEmail ??
        null,
      description,
      product: classifyStripeProduct({
        metadata: intent.metadata,
        description,
        amountCents: intent.amount,
        mode: "payment",
      }),
      createdAt: new Date().toISOString(),
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid" && session.mode !== "subscription") {
      return { inserted: false };
    }
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;
    const description =
      session.metadata?.planId
        ? `Membership ${session.metadata.planId}`
        : session.metadata?.applicationId
          ? `Rental application ${session.metadata.applicationId}`
          : session.metadata?.username
            ? "Credit check $19"
            : session.mode === "subscription"
              ? "Membership"
              : "Checkout completed";
    return insertLog({
      eventId: event.id,
      eventType: event.type,
      paymentIntentId,
      checkoutSessionId: session.id,
      amountCents: session.amount_total ?? 0,
      currency: session.currency || "usd",
      status: session.payment_status || "paid",
      customerEmail:
        session.customer_details?.email ??
        session.customer_email ??
        session.metadata?.email ??
        session.metadata?.applicantEmail ??
        null,
      description,
      product: classifyStripeProduct({
        metadata: session.metadata,
        description,
        amountCents: session.amount_total,
        mode: session.mode,
      }),
      createdAt: new Date().toISOString(),
    });
  }

  return { inserted: false };
}
