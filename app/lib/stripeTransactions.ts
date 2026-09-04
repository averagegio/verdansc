import Stripe from "stripe";
import { detectStripeSecretMode, getStripe } from "./stripeClient";

export type StripeProductKind =
  | "credit_check"
  | "rental_application"
  | "membership"
  | "other";

export type StripeMonitorRow = {
  id: string;
  object: "payment_intent" | "checkout_session";
  paymentIntentId?: string;
  checkoutSessionId?: string;
  amountCents: number;
  currency: string;
  status: string;
  created: number;
  customerEmail: string | null;
  description: string;
  product: StripeProductKind;
};

export type StripeMonitorResult = {
  ok: boolean;
  configured: boolean;
  mode: "live" | "test" | "unknown";
  message: string;
  transactions: StripeMonitorRow[];
  fetchedAt: string;
};

const PRODUCT_LABELS: Record<StripeProductKind, string> = {
  credit_check: "Credit check $19",
  rental_application: "Rental application",
  membership: "Membership",
  other: "Other",
};

type ClassifyInput = {
  metadata?: Stripe.Metadata | null;
  description?: string | null;
  amountCents?: number | null;
  mode?: string | null;
};

function blobOf(input: ClassifyInput) {
  return [
    input.description ?? "",
    input.mode ?? "",
    input.metadata?.planId ?? "",
    input.metadata?.applicationId ?? "",
    input.metadata?.username ?? "",
    input.metadata?.product ?? "",
    input.metadata?.listingId ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export function classifyStripeProduct(input: ClassifyInput): StripeProductKind {
  const metadata = input.metadata ?? undefined;
  const text = blobOf(input);

  if (
    metadata?.planId ||
    input.mode === "subscription" ||
    text.includes("rental ready") ||
    text.includes("landlord growth") ||
    text.includes("landlord pro") ||
    text.includes("membership")
  ) {
    return "membership";
  }

  if (
    metadata?.applicationId ||
    metadata?.listingId ||
    text.includes("application fee") ||
    text.includes("rental application")
  ) {
    return "rental_application";
  }

  if (
    metadata?.product === "credit_check" ||
    metadata?.username ||
    text.includes("credit check") ||
    text.includes("credit-check")
  ) {
    return "credit_check";
  }

  if (input.amountCents === 1900 && input.mode !== "subscription") {
    return "credit_check";
  }

  return "other";
}

export function stripeProductLabel(product: StripeProductKind) {
  return PRODUCT_LABELS[product];
}

function asCustomer(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): Stripe.Customer | undefined {
  if (!customer || typeof customer === "string") return undefined;
  if ("deleted" in customer && customer.deleted) return undefined;
  return customer as Stripe.Customer;
}

function asCharge(
  charge: string | Stripe.Charge | null | undefined,
): Stripe.Charge | undefined {
  if (!charge || typeof charge === "string") return undefined;
  return charge;
}

function sessionPaymentIntentId(session: Stripe.Checkout.Session) {
  if (typeof session.payment_intent === "string") return session.payment_intent;
  return session.payment_intent?.id;
}

function emailFromSession(session: Stripe.Checkout.Session) {
  return (
    session.customer_details?.email ??
    session.customer_email ??
    session.metadata?.email ??
    session.metadata?.applicantEmail ??
    asCustomer(session.customer)?.email ??
    null
  );
}

function emailFromPaymentIntent(
  intent: Stripe.PaymentIntent,
  session?: Stripe.Checkout.Session,
) {
  const charge = asCharge(intent.latest_charge);
  return (
    (session ? emailFromSession(session) : null) ??
    asCustomer(intent.customer)?.email ??
    charge?.billing_details?.email ??
    charge?.receipt_email ??
    intent.receipt_email ??
    intent.metadata?.email ??
    null
  );
}

function descriptionFromSession(session: Stripe.Checkout.Session) {
  const product = classifyStripeProduct({
    metadata: session.metadata,
    description: session.metadata?.planId ?? session.client_reference_id,
    amountCents: session.amount_total,
    mode: session.mode,
  });
  if (session.metadata?.planId) {
    return `${stripeProductLabel(product)} (${session.metadata.planId})`;
  }
  if (session.metadata?.applicationId) {
    return `Rental application ${session.metadata.applicationId}`;
  }
  if (product === "credit_check") return stripeProductLabel(product);
  return session.client_reference_id || stripeProductLabel(product);
}

function descriptionFromPaymentIntent(
  intent: Stripe.PaymentIntent,
  session?: Stripe.Checkout.Session,
) {
  const charge = asCharge(intent.latest_charge);
  const raw =
    intent.description ||
    charge?.description ||
    (session ? descriptionFromSession(session) : "") ||
    "";
  if (raw) return raw;
  return stripeProductLabel(
    classifyStripeProduct({
      metadata: {
        ...(session?.metadata ?? {}),
        ...intent.metadata,
      },
      description: raw,
      amountCents: intent.amount,
      mode: session?.mode,
    }),
  );
}

function rowFromPaymentIntent(
  intent: Stripe.PaymentIntent,
  session?: Stripe.Checkout.Session,
): StripeMonitorRow {
  const metadata = {
    ...(session?.metadata ?? {}),
    ...intent.metadata,
  };
  const description = descriptionFromPaymentIntent(intent, session);
  return {
    id: intent.id,
    object: "payment_intent",
    paymentIntentId: intent.id,
    checkoutSessionId: session?.id,
    amountCents: intent.amount_received || intent.amount,
    currency: intent.currency || "usd",
    status: intent.status,
    created: intent.created,
    customerEmail: emailFromPaymentIntent(intent, session),
    description,
    product: classifyStripeProduct({
      metadata,
      description,
      amountCents: intent.amount,
      mode: session?.mode,
    }),
  };
}

function rowFromCheckoutSession(session: Stripe.Checkout.Session): StripeMonitorRow {
  const description = descriptionFromSession(session);
  return {
    id: session.id,
    object: "checkout_session",
    paymentIntentId: sessionPaymentIntentId(session),
    checkoutSessionId: session.id,
    amountCents: session.amount_total ?? 0,
    currency: session.currency || "usd",
    status: session.payment_status || session.status || "unknown",
    created: session.created,
    customerEmail: emailFromSession(session),
    description,
    product: classifyStripeProduct({
      metadata: session.metadata,
      description,
      amountCents: session.amount_total,
      mode: session.mode,
    }),
  };
}

export async function listRecentStripeTransactions(
  limit = 40,
): Promise<StripeMonitorResult> {
  const fetchedAt = new Date().toISOString();
  const mode = detectStripeSecretMode();
  const stripe = getStripe();

  if (!stripe) {
    return {
      ok: false,
      configured: false,
      mode,
      message:
        "Stripe is not configured on this server. Transactions appear here from the Stripe list API once STRIPE_SECRET_KEY is set.",
      transactions: [],
      fetchedAt,
    };
  }

  try {
    const [intents, sessions] = await Promise.all([
      stripe.paymentIntents.list({
        limit,
        expand: ["data.customer", "data.latest_charge"],
      }),
      stripe.checkout.sessions.list({
        limit,
        expand: ["data.customer"],
      }),
    ]);

    const sessionByPaymentIntent = new Map<string, Stripe.Checkout.Session>();
    for (const session of sessions.data) {
      const paymentIntentId = sessionPaymentIntentId(session);
      if (paymentIntentId) sessionByPaymentIntent.set(paymentIntentId, session);
    }

    const rows: StripeMonitorRow[] = [];
    const seenPaymentIntents = new Set<string>();

    for (const intent of intents.data) {
      seenPaymentIntents.add(intent.id);
      rows.push(
        rowFromPaymentIntent(intent, sessionByPaymentIntent.get(intent.id)),
      );
    }

    for (const session of sessions.data) {
      const paymentIntentId = sessionPaymentIntentId(session);
      if (paymentIntentId && seenPaymentIntents.has(paymentIntentId)) continue;
      rows.push(rowFromCheckoutSession(session));
    }

    rows.sort((left, right) => right.created - left.created);

    return {
      ok: true,
      configured: true,
      mode,
      message: `Loaded ${rows.length} Stripe objects from PaymentIntents and Checkout Sessions.`,
      transactions: rows.slice(0, limit),
      fetchedAt,
    };
  } catch {
    return {
      ok: false,
      configured: true,
      mode,
      message:
        "Stripe list API request failed. Check STRIPE_SECRET_KEY and Stripe dashboard access.",
      transactions: [],
      fetchedAt,
    };
  }
}

export function formatStripeAmount(amountCents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export function formatStripeTimestamp(epochSeconds: number) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Denver",
  }).format(new Date(epochSeconds * 1000));
}
