import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

type ChargeRequest = {
  email?: string;
  username?: string;
  amount?: number;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ChargeRequest;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!body.email || !body.username || !body.amount) {
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

  if (!stripeSecretKey) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Stripe checkout is unavailable because STRIPE_SECRET_KEY is missing.",
      },
      { status: 500 },
    );
  }

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
      },
      success_url: `${origin}/credit-check/success?source=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/credit-check?payment=cancel`,
    });

    if (!session.url) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Stripe session created without a checkout URL. Verify hosted checkout settings.",
        },
        { status: 500 },
      );
    }

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
        message:
          "Stripe checkout session failed. Verify STRIPE_SECRET_KEY and your Stripe dashboard settings.",
      },
      { status: 500 },
    );
  }
}
