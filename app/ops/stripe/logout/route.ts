import { NextRequest, NextResponse } from "next/server";
import { clearOpsCookie } from "../../../lib/stripeOpsAuth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/ops/stripe", request.nextUrl.origin),
    303,
  );
  clearOpsCookie(response);
  return response;
}
