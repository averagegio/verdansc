import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "../../../lib/mockUsers";
import {
  getDefaultPlanIdForAudience,
  isPlanForAudience,
} from "../../../lib/subscriptionPlans";

type LoginBody = {
  email?: string;
  password?: string;
  role?: "renter" | "landlord";
  planId?: string;
};

function resolveRole(email: string, requestedRole?: "renter" | "landlord") {
  if (requestedRole) return requestedRole;
  if (email.toLowerCase().includes("landlord")) return "landlord";
  return "renter";
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LoginBody;
  const email = body.email?.trim();
  const password = body.password?.trim();

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Email and password are required." },
      { status: 400 },
    );
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);
  let role: "renter" | "landlord";
  let planId: string | undefined;

  if (existingUser) {
    if (existingUser.password !== password) {
      return NextResponse.json(
        { ok: false, message: "Invalid login credentials." },
        { status: 401 },
      );
    }
    role = existingUser.role;
    planId = existingUser.planId;
  } else {
    return NextResponse.json(
      { ok: false, message: "Invalid login credentials." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    message: "Login successful.",
    role,
    planId,
    redirectTo: "/dashboard",
  });

  response.cookies.set("verdansc_session", "active", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  response.cookies.set("verdansc_email", normalizedEmail, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  response.cookies.set("verdansc_role", role, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  if (planId) {
    response.cookies.set("verdansc_plan", planId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
  }

  return response;
}
