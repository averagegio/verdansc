import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "rental-application",
    status: "ok",
    generatedAt: new Date().toISOString(),
    application: {
      applicationId: "ra_3102",
      propertyId: "prop_221",
      applicantName: "Taylor Morgan",
      requestedMoveIn: "2026-04-15",
      submissionState: "ready-for-review",
    },
    checklist: {
      identityProvided: true,
      incomeProofProvided: true,
      referencesProvided: 2,
      consentSigned: true,
    },
  });
}
