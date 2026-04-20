import { NextResponse } from "next/server";

const REQUIRED_ENV_KEYS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_RENTER_READY",
  "STRIPE_PRICE_RENTER_PLUS",
  "STRIPE_PRICE_LANDLORD_GROWTH",
  "STRIPE_PRICE_LANDLORD_PRO",
] as const;

function detectKeyMode(key: string | undefined): "live" | "test" | "unknown" {
  if (!key) return "unknown";
  if (key.startsWith("sk_live_")) return "live";
  if (key.startsWith("sk_test_")) return "test";
  return "unknown";
}

export async function GET() {
  const missing = REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);
  const configured = REQUIRED_ENV_KEYS.filter((key) => Boolean(process.env[key]));
  const secretMode = detectKeyMode(process.env.STRIPE_SECRET_KEY);
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const publishableMode: "live" | "test" | "unknown" = publishableKey.startsWith(
    "pk_live_",
  )
    ? "live"
    : publishableKey.startsWith("pk_test_")
      ? "test"
      : "unknown";
  const modeMismatch =
    secretMode !== "unknown" &&
    publishableMode !== "unknown" &&
    secretMode !== publishableMode;

  return NextResponse.json({
    ok: missing.length === 0 && !modeMismatch,
    summary:
      missing.length > 0
        ? "Stripe integration is partially configured."
        : modeMismatch
          ? `Stripe key mismatch: secret is ${secretMode}, publishable is ${publishableMode}.`
          : `Stripe integration is configured in ${secretMode} mode.`,
    mode: secretMode,
    publishableMode,
    modeMismatch,
    configured,
    missing,
  });
}
