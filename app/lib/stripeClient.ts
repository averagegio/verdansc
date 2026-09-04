import Stripe from "stripe";

export function getStripe(): Stripe | undefined {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return undefined;
  return new Stripe(secret);
}

export function detectStripeSecretMode(): "live" | "test" | "unknown" {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  if (key.startsWith("sk_live_")) return "live";
  if (key.startsWith("sk_test_")) return "test";
  return "unknown";
}
