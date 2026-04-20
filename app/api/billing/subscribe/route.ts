import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateUserByEmail } from "../../../lib/mockUsers";
import { findPlanById, isPlanForAudience } from "../../../lib/subscriptionPlans";

type SubscribeBody = {
  planId?: string;
};

const PLAN_PRICE_ENV_KEYS: Record<string, string> = {
  "renter-ready": "STRIPE_PRICE_RENTER_READY",
  "renter-plus": "STRIPE_PRICE_RENTER_PLUS",
  "landlord-growth": "STRIPE_PRICE_LANDLORD_GROWTH",
  "landlord-pro": "STRIPE_PRICE_LANDLORD_PRO",
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as SubscribeBody;
  const planId = body.planId?.trim();
  const session = request.cookies.get("verdansc_session")?.value;
  const role = request.cookies.get("verdansc_role")?.value as
    | "renter"
    | "landlord"
    | undefined;
  const email = request.cookies.get("verdansc_email")?.value;

  if (!session || !role || !email) {
    return NextResponse.json(
      { ok: false, message: "Please log in before starting subscription checkout." },
      { status: 401 },
    );
  }

  if (!planId) {
    return NextResponse.json(
      { ok: false, message: "Plan selection is required." },
      { status: 400 },
    );
  }

  const plan = findPlanById(planId);
  if (!plan || !isPlanForAudience(planId, role)) {
    return NextResponse.json(
      { ok: false, message: "Selected plan does not match your account type." },
      { status: 400 },
    );
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Stripe is not configured. Add STRIPE_SECRET_KEY to enable subscription checkout.",
      },
      { status: 500 },
    );
  }

  const envKey = PLAN_PRICE_ENV_KEYS[planId];
  const priceId = envKey ? process.env[envKey] : undefined;
  if (!priceId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Stripe price is missing for this plan. Set ${envKey} in environment variables.`,
      },
      { status: 500 },
    );
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const origin = request.nextUrl.origin;
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      client_reference_id: email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        planId,
        role,
        email,
      },
      subscription_data: {
        metadata: {
          planId,
          role,
          email,
        },
      },
      success_url: `${origin}/dashboard?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard?subscription=cancelled`,
    });

    await updateUserByEmail(email, {
      planId,
      subscriptionStatus: "checkout_pending",
      onboardingStatus: "plan_selected",
      stripeCustomerId:
        typeof checkout.customer === "string" ? checkout.customer : undefined,
      stripeSubscriptionId:
        typeof checkout.subscription === "string"
          ? checkout.subscription
          : undefined,
      subscriptionUpdatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      message: "Subscription checkout created.",
      checkoutUrl: checkout.url,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Could not create Stripe subscription checkout session. Verify Stripe API keys, price IDs, and customer email format.",
      },
      { status: 500 },
    );
  }
}
