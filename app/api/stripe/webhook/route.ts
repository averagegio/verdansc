import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateIntakeApplicationById } from "../../../lib/intakeApplications";
import { findUserByStripeRefs, updateUserByEmail } from "../../../lib/mockUsers";

const SUBSCRIPTION_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return undefined;
  return new Stripe(secret);
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret || !signature) {
    return NextResponse.json(
      { ok: false, message: "Stripe webhook is not fully configured." },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  if (!SUBSCRIPTION_EVENTS.has(event.type)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const applicationId = session.metadata?.applicationId;
    const listingId = session.metadata?.listingId;

    if (session.mode === "payment" && applicationId && listingId) {
      const stripePaymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : undefined;
      const stripeCustomerId =
        typeof session.customer === "string" ? session.customer : undefined;

      await updateIntakeApplicationById(applicationId, {
        status: "submitted",
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId,
        stripeCustomerId,
        submittedAt: new Date().toISOString(),
      });

      return NextResponse.json({ ok: true });
    }

    if (session.mode === "subscription") {
      const email =
        session.customer_email ??
        session.customer_details?.email ??
        session.metadata?.email;
      const stripeCustomerId =
        typeof session.customer === "string" ? session.customer : undefined;
      const stripeSubscriptionId =
        typeof session.subscription === "string" ? session.subscription : undefined;
      const planId = session.metadata?.planId;

      if (email) {
        await updateUserByEmail(email, {
          planId: planId ?? undefined,
          stripeCustomerId,
          stripeSubscriptionId,
          subscriptionStatus: "checkout_completed",
          onboardingStatus: "plan_selected",
          subscriptionUpdatedAt: new Date().toISOString(),
        });
      }
    }
    return NextResponse.json({ ok: true });
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const stripeCustomerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;
    const stripeSubscriptionId = subscription.id;
    const email = subscription.metadata?.email;
    const planId = subscription.metadata?.planId;

    const status = (event.type === "customer.subscription.deleted"
      ? "canceled"
      : subscription.status) as
      | "trialing"
      | "active"
      | "past_due"
      | "unpaid"
      | "incomplete"
      | "canceled";

    if (email) {
      await updateUserByEmail(email, {
        planId: planId ?? undefined,
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStatus: status,
        onboardingStatus:
          status === "active" || status === "trialing"
            ? "subscription_active"
            : "plan_selected",
        subscriptionUpdatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true });
    }

    const matched = await findUserByStripeRefs({
      stripeCustomerId,
      stripeSubscriptionId,
    });
    if (matched) {
      await updateUserByEmail(matched.email, {
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStatus: status,
        onboardingStatus:
          status === "active" || status === "trialing"
            ? "subscription_active"
            : "plan_selected",
        subscriptionUpdatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
