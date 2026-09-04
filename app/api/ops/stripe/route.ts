import { NextRequest, NextResponse } from "next/server";
import { readOpsAuthFromRequest } from "../../../lib/stripeOpsAuth";
import { listRecentStripeTransactions } from "../../../lib/stripeTransactions";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = readOpsAuthFromRequest(request);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, message: "Stripe ops access required." },
      { status: 401 },
    );
  }

  const result = await listRecentStripeTransactions();
  return NextResponse.json(
    {
      ok: result.ok,
      message: result.message,
      mode: result.mode,
      configured: result.configured,
      fetchedAt: result.fetchedAt,
      transactions: result.transactions,
    },
    {
      status: result.ok || !result.configured ? 200 : 502,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
