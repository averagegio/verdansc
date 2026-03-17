import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "credit-check",
    status: "ok",
    generatedAt: new Date().toISOString(),
    applicant: {
      applicantId: "app_2048",
      score: 742,
      tier: "A",
      debtToIncome: 0.31,
      riskFlags: ["none"],
    },
    recommendation: {
      decision: "approve",
      confidence: 0.93,
      notes: "Strong repayment profile with stable utilization.",
    },
  });
}
