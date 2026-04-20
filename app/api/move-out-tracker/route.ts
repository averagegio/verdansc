import { NextRequest, NextResponse } from "next/server";
import {
  getMoveOutPlanByEmail,
  upsertMoveOutPlanByEmail,
} from "../../lib/moveOutTracker";

type SaveMoveOutBody = {
  caseLabel?: string;
  propertyAddress?: string;
  noticeDate?: string;
  leaseEndDate?: string;
  ledgerReady?: boolean;
  noticeServed?: boolean;
  communicationLogReady?: boolean;
  notes?: string;
  evidenceImages?: string[];
};

function requireLandlordSession(request: NextRequest) {
  const session = request.cookies.get("verdansc_session")?.value;
  const email = request.cookies.get("verdansc_email")?.value;
  const role = request.cookies.get("verdansc_role")?.value;

  if (!session || !email) {
    return { ok: false as const, status: 401, message: "Please log in first." };
  }
  if (role !== "landlord") {
    return {
      ok: false as const,
      status: 403,
      message: "Move-out tracker is currently available for landlord accounts.",
    };
  }

  return { ok: true as const, email: email.toLowerCase() };
}

export async function GET(request: NextRequest) {
  const auth = requireLandlordSession(request);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, message: auth.message },
      { status: auth.status },
    );
  }

  const plan = await getMoveOutPlanByEmail(auth.email);
  return NextResponse.json({
    ok: true,
    plan: plan ?? null,
  });
}

export async function POST(request: NextRequest) {
  const auth = requireLandlordSession(request);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, message: auth.message },
      { status: auth.status },
    );
  }

  const body = (await request.json()) as SaveMoveOutBody;
  const saved = await upsertMoveOutPlanByEmail(auth.email, {
    caseLabel: body.caseLabel,
    propertyAddress: body.propertyAddress,
    noticeDate: body.noticeDate,
    leaseEndDate: body.leaseEndDate,
    ledgerReady: Boolean(body.ledgerReady),
    noticeServed: Boolean(body.noticeServed),
    communicationLogReady: Boolean(body.communicationLogReady),
    notes: body.notes,
    evidenceImages: Array.isArray(body.evidenceImages) ? body.evidenceImages : [],
  });

  return NextResponse.json({
    ok: true,
    message: "Move-out tracker saved.",
    plan: saved,
  });
}

