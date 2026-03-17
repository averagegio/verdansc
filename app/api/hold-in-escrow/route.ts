import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "hold-in-escrow",
    status: "ok",
    generatedAt: new Date().toISOString(),
    escrow: {
      escrowId: "esc_1123",
      amount: 32500,
      currency: "USD",
      milestone: "Inspection Complete",
      releaseState: "pending-approval",
    },
    audit: {
      entries: 11,
      lastEvent: "Buyer approved milestone release request.",
    },
  });
}
