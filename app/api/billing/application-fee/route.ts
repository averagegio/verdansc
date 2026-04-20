import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  findIntakeApplicationById,
  updateIntakeApplicationById,
} from "../../../lib/intakeApplications";
import { findIntakeListingById } from "../../../lib/intakeListings";

type ApplicationFeeBody = {
  applicationId?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ApplicationFeeBody;
  const applicationId = body.applicationId?.trim();

  if (!applicationId) {
    return NextResponse.json(
      { ok: false, message: "Application ID is required." },
      { status: 400 },
    );
  }

  const application = await findIntakeApplicationById(applicationId);
  if (!application) {
    return NextResponse.json(
      { ok: false, message: "Application not found." },
      { status: 404 },
    );
  }

  const listing = await findIntakeListingById(application.listingId);
  if (!listing) {
    return NextResponse.json(
      { ok: false, message: "Listing not found for this application." },
      { status: 404 },
    );
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Stripe is not configured. Add STRIPE_SECRET_KEY to enable application fee checkout.",
      },
      { status: 500 },
    );
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const origin = request.nextUrl.origin;
    const successUrl = `${origin}/apply/${listing.id}?payment=success&application_id=${encodeURIComponent(
      application.id,
    )}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/apply/${listing.id}?payment=cancelled&application_id=${encodeURIComponent(
      application.id,
    )}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: application.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Application Fee - ${listing.propertyTitle}`,
              description: `Rental application fee for ${listing.propertyAddress}`,
            },
            unit_amount: listing.applicationFeeCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        applicationId: application.id,
        listingId: listing.id,
        applicantEmail: application.email,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    await updateIntakeApplicationById(application.id, {
      status: "payment_pending",
    });

    return NextResponse.json({
      ok: true,
      message: "Application fee checkout created.",
      checkoutUrl: session.url,
      applicationId: application.id,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Could not create Stripe application fee checkout session. Verify Stripe API keys and dashboard settings.",
      },
      { status: 500 },
    );
  }
}

