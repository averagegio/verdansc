import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

type ChargeRequest = {
  email?: string;
  username?: string;
  amount?: number;
  cardLast4?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ChargeRequest;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!body.email || !body.username || !body.amount || !body.cardLast4) {
    return NextResponse.json(
      {
        ok: false,
        message: "Missing required payment fields.",
      },
      { status: 400 },
    );
  }

  if (body.amount <= 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "Amount must be greater than zero.",
      },
      { status: 400 },
    );
  }

  if (stripeSecretKey) {
    try {
      const stripe = new Stripe(stripeSecretKey);
      const origin = request.nextUrl.origin;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: body.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Verdansc Credit Check",
                description: "Single credit-check report access",
              },
              unit_amount: Math.round(body.amount * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          username: body.username,
          cardLast4: body.cardLast4,
        },
        success_url: `${origin}/credit-check/success?source=stripe&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/credit-check?payment=cancel`,
      });

      return NextResponse.json({
        ok: true,
        message: "Stripe checkout session created.",
        checkoutUrl: session.url,
        paymentId: session.id,
        mode: "stripe-checkout",
        generatedAt: new Date().toISOString(),
      });
    } catch {
      return NextResponse.json(
        {
          ok: false,
          message: "Stripe checkout session failed. Verify STRIPE_SECRET_KEY.",
        },
        { status: 500 },
      );
    }
  }

  const paymentId = `pay_${Math.random().toString(36).slice(2, 10)}`;

  return NextResponse.json({
    ok: true,
    message: `Payment approved for ${body.email} using card ending in ${body.cardLast4}.`,
    paymentId,
    status: "succeeded",
    service: "stripe-credit-check",
    chargedAmount: body.amount,
    mode: "mock",
    stripeConfigured: false,
    generatedAt: new Date().toISOString(),
  });
}
