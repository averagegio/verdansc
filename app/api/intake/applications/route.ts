import { NextRequest, NextResponse } from "next/server";
import { createIntakeApplicationDraft } from "../../../lib/intakeApplications";
import { findIntakeListingById } from "../../../lib/intakeListings";

type CreateApplicationBody = {
  listingId?: string;
  applicantName?: string;
  email?: string;
  phone?: string;
  moveInDate?: string;
  monthlyIncome?: number;
  occupants?: number;
  notes?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateApplicationBody;
  const listingId = body.listingId?.trim() ?? "";
  const applicantName = body.applicantName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";

  if (!listingId || !applicantName || !email || !phone) {
    return NextResponse.json(
      {
        ok: false,
        message: "Listing, applicant name, email, and phone are required.",
      },
      { status: 400 },
    );
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const listing = await findIntakeListingById(listingId);
  if (!listing) {
    return NextResponse.json(
      {
        ok: false,
        message: "This listing link is not active.",
      },
      { status: 404 },
    );
  }

  const monthlyIncome =
    body.monthlyIncome && Number(body.monthlyIncome) > 0
      ? Number(body.monthlyIncome)
      : undefined;
  const occupants =
    body.occupants && Number(body.occupants) > 0 ? Number(body.occupants) : undefined;

  const application = await createIntakeApplicationDraft({
    listingId,
    applicantName,
    email,
    phone,
    moveInDate: body.moveInDate,
    monthlyIncome,
    occupants,
    notes: body.notes,
  });

  return NextResponse.json({
    ok: true,
    message: "Application draft saved. Next step: pay application fee to submit.",
    applicationId: application.id,
    listingId: application.listingId,
    status: application.status,
  });
}

