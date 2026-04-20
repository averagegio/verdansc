import { NextRequest, NextResponse } from "next/server";
import {
  getMoveInPlanByEmail,
  upsertMoveInPlanByEmail,
} from "../../lib/moveInPlanner";

type SaveMoveInBody = {
  moveInDate?: string;
  address?: string;
  utilitiesReady?: boolean;
  insuranceReady?: boolean;
  depositPaid?: boolean;
  notes?: string;
  evidenceImages?: string[];
};

function requireRenterSession(request: NextRequest) {
  const session = request.cookies.get("verdansc_session")?.value;
  const email = request.cookies.get("verdansc_email")?.value;
  const role = request.cookies.get("verdansc_role")?.value;

  if (!session || !email) {
    return { ok: false as const, status: 401, message: "Please log in first." };
  }
  if (role && role !== "renter") {
    return {
      ok: false as const,
      status: 403,
      message: "Move-in planner is currently available for renter accounts.",
    };
  }

  return { ok: true as const, email: email.toLowerCase() };
}

export async function GET(request: NextRequest) {
  const auth = requireRenterSession(request);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, message: auth.message },
      { status: auth.status },
    );
  }

  const plan = await getMoveInPlanByEmail(auth.email);
  return NextResponse.json({
    ok: true,
    plan: plan ?? null,
  });
}

export async function POST(request: NextRequest) {
  const auth = requireRenterSession(request);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, message: auth.message },
      { status: auth.status },
    );
  }

  const body = (await request.json()) as SaveMoveInBody;
  const saved = await upsertMoveInPlanByEmail(auth.email, {
    moveInDate: body.moveInDate,
    address: body.address,
    utilitiesReady: Boolean(body.utilitiesReady),
    insuranceReady: Boolean(body.insuranceReady),
    depositPaid: Boolean(body.depositPaid),
    notes: body.notes,
    evidenceImages: Array.isArray(body.evidenceImages) ? body.evidenceImages : [],
  });

  return NextResponse.json({
    ok: true,
    message: "Move-in plan saved.",
    plan: saved,
  });
}

