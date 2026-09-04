import { NextRequest, NextResponse } from "next/server";
import {
  applyOpsCookie,
  isOpsSecretConfigured,
  providedSecretMatches,
} from "../../../lib/stripeOpsAuth";

export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  if (!isOpsSecretConfigured()) {
    return NextResponse.redirect(new URL("/ops/stripe?error=unconfigured", origin), 303);
  }

  const form = await request.formData();
  const secret = String(form.get("secret") ?? "");
  if (!providedSecretMatches(secret)) {
    return NextResponse.redirect(new URL("/ops/stripe?error=invalid", origin), 303);
  }

  const response = NextResponse.redirect(new URL("/ops/stripe", origin), 303);
  applyOpsCookie(response);
  return response;
}
