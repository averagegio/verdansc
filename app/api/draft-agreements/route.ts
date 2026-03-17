import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "draft-agreements",
    status: "ok",
    generatedAt: new Date().toISOString(),
    draft: {
      documentId: "doc_5544",
      agreementType: "Purchase Agreement",
      jurisdiction: "WA",
      clausesIncluded: 28,
      signatureReady: true,
    },
    outputs: ["pdf", "docx", "esign-packet"],
  });
}
