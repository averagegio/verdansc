import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const STRIPE_OPS_COOKIE = "verdansc_stripe_ops";
const OPS_COOKIE_TTL_SECONDS = 60 * 60 * 12;
const OPS_COOKIE_PAYLOAD = "verdansc-stripe-ops-v1";

export type OpsAuthResult =
  | { ok: true; method: "ops_secret" | "founder_session"; email?: string }
  | { ok: false };

function opsSecret() {
  return process.env.STRIPE_OPS_SECRET?.trim() ?? "";
}

export function founderOpsEmails() {
  return (process.env.STRIPE_OPS_EMAIL ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isOpsAccessConfigured() {
  return Boolean(opsSecret() || founderOpsEmails().length);
}

export function isOpsSecretConfigured() {
  return Boolean(opsSecret());
}

function hashesEqual(left: string, right: string) {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

export function expectedOpsCookieValue() {
  const secret = opsSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(OPS_COOKIE_PAYLOAD).digest("hex");
}

export function providedSecretMatches(candidate: string) {
  const secret = opsSecret();
  if (!secret || !candidate) return false;
  return hashesEqual(secret, candidate);
}

export function opsCookieMatches(value: string | undefined) {
  const expected = expectedOpsCookieValue();
  if (!expected || !value) return false;
  return hashesEqual(expected, value);
}

export function founderEmailAllowed(email: string | undefined) {
  if (!email) return false;
  return founderOpsEmails().includes(email.trim().toLowerCase());
}

function fromSessionAndCookie(input: {
  opsCookie?: string;
  session?: string;
  email?: string;
}): OpsAuthResult {
  if (opsCookieMatches(input.opsCookie)) {
    return { ok: true, method: "ops_secret" };
  }
  if (input.session && founderEmailAllowed(input.email)) {
    return { ok: true, method: "founder_session", email: input.email };
  }
  return { ok: false };
}

export async function readOpsAuthFromCookies(): Promise<OpsAuthResult> {
  const store = await cookies();
  return fromSessionAndCookie({
    opsCookie: store.get(STRIPE_OPS_COOKIE)?.value,
    session: store.get("verdansc_session")?.value,
    email: store.get("verdansc_email")?.value,
  });
}

export function readOpsAuthFromRequest(request: NextRequest): OpsAuthResult {
  const headerSecret =
    request.headers.get("x-stripe-ops-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";
  if (providedSecretMatches(headerSecret)) {
    return { ok: true, method: "ops_secret" };
  }
  return fromSessionAndCookie({
    opsCookie: request.cookies.get(STRIPE_OPS_COOKIE)?.value,
    session: request.cookies.get("verdansc_session")?.value,
    email: request.cookies.get("verdansc_email")?.value,
  });
}

export function applyOpsCookie(response: NextResponse) {
  const value = expectedOpsCookieValue();
  if (!value) return response;
  response.cookies.set(STRIPE_OPS_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: OPS_COOKIE_TTL_SECONDS,
  });
  return response;
}

export function clearOpsCookie(response: NextResponse) {
  response.cookies.set(STRIPE_OPS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
