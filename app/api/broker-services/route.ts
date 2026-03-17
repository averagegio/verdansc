import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "broker-services",
    status: "ok",
    generatedAt: new Date().toISOString(),
    match: {
      brokerId: "brk_770",
      name: "Jordan Patel",
      specialty: "Residential Negotiations",
      localMarketScore: 0.89,
      responseTimeHours: 2,
    },
    recommendations: [
      "Offer 1.8% over list in high-demand zone.",
      "Include 21-day close timeline for competitiveness.",
    ],
  });
}
