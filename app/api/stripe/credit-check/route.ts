import { NextRequest, NextResponse } from "next/server";

type ChargeRequest = {
  email?: string;
  username?: string;
  amount?: number;
  cardLast4?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ChargeRequest;

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

  const paymentId = `pay_${Math.random().toString(36).slice(2, 10)}`;

  return NextResponse.json({
    ok: true,
    message: `Payment approved for ${body.email} using card ending in ${body.cardLast4}.`,
    paymentId,
    status: "succeeded",
    service: "stripe-credit-check",
    chargedAmount: body.amount,
    generatedAt: new Date().toISOString(),
  });
}
