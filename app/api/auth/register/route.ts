import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "../../../lib/mockUsers";
import {
  Audience,
  isPlanForAudience,
} from "../../../lib/subscriptionPlans";

type RegisterBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: Audience;
  planId?: string;
  acceptedTerms?: boolean;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RegisterBody;
  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();
  const confirmPassword = body.confirmPassword?.trim();
  const role = body.role ?? "renter";
  const planId = body.planId?.trim();

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { ok: false, message: "All required fields must be completed." },
      { status: 400 },
    );
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, message: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { ok: false, message: "Password confirmation does not match." },
      { status: 400 },
    );
  }

  if (!body.acceptedTerms) {
    return NextResponse.json(
      { ok: false, message: "You must accept the terms to continue." },
      { status: 400 },
    );
  }

  if (!planId || !isPlanForAudience(planId, role)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Please choose a valid plan for your account type before creating your account.",
      },
      { status: 400 },
    );
  }

  if (await findUserByEmail(email)) {
    return NextResponse.json(
      { ok: false, message: "An account with this email already exists." },
      { status: 409 },
    );
  }

  await createUser({
    firstName,
    lastName,
    email,
    password,
    role,
    planId,
    subscriptionStatus: "inactive",
    onboardingStatus: "plan_selected",
    createdAt: new Date().toISOString(),
  });

  const response = NextResponse.json(
    {
      ok: true,
      message: "Account created.",
      role,
      planId,
      redirectTo: "/dashboard?welcome=1",
    },
    { status: 201 },
  );

  response.cookies.set("verdansc_session", "active", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  response.cookies.set("verdansc_email", email, {
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
  response.cookies.set("verdansc_plan", planId, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
