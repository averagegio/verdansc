import { NextRequest, NextResponse } from "next/server";
import { createIntakeListing, listIntakeListings } from "../../../lib/intakeListings";

type CreateListingBody = {
  propertyTitle?: string;
  propertyAddress?: string;
  applicationFeeUsd?: number;
  requirements?: string;
};

export async function POST(request: NextRequest) {
  const session = request.cookies.get("verdansc_session")?.value;
  const email = request.cookies.get("verdansc_email")?.value;
  const role = request.cookies.get("verdansc_role")?.value;

  if (!session || !email) {
    return NextResponse.json(
      { ok: false, message: "Please log in to create an intake link." },
      { status: 401 },
    );
  }

  if (role !== "landlord") {
    return NextResponse.json(
      {
        ok: false,
        message: "Only landlord accounts can create applicant intake links.",
      },
      { status: 403 },
    );
  }

  const body = (await request.json()) as CreateListingBody;
  const propertyTitle = body.propertyTitle?.trim() ?? "";
  const propertyAddress = body.propertyAddress?.trim() ?? "";
  const applicationFeeUsd = Number(body.applicationFeeUsd ?? 0);
  const requirements = body.requirements?.trim();

  if (!propertyTitle || !propertyAddress) {
    return NextResponse.json(
      {
        ok: false,
        message: "Property title and property address are required.",
      },
      { status: 400 },
    );
  }

  if (!Number.isFinite(applicationFeeUsd) || applicationFeeUsd <= 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "Application fee must be greater than zero.",
      },
      { status: 400 },
    );
  }

  const listing = await createIntakeListing({
    ownerEmail: email,
    propertyTitle,
    propertyAddress,
    applicationFeeCents: Math.round(applicationFeeUsd * 100),
    requirements,
  });

  const applyPath = `/apply/${listing.id}`;
  const applyUrl = `${request.nextUrl.origin}${applyPath}`;

  return NextResponse.json({
    ok: true,
    message: "Intake link created.",
    listingId: listing.id,
    applyPath,
    applyUrl,
    propertyTitle: listing.propertyTitle,
    applicationFeeUsd: (listing.applicationFeeCents / 100).toFixed(2),
  });
}

export async function GET() {
  const listings = await listIntakeListings();

  return NextResponse.json({
    ok: true,
    listings: listings.map((listing) => ({
      id: listing.id,
      propertyTitle: listing.propertyTitle,
      propertyAddress: listing.propertyAddress,
      requirements: listing.requirements,
      applicationFeeUsd: Number((listing.applicationFeeCents / 100).toFixed(2)),
      applyPath: `/apply/${listing.id}`,
      createdAt: listing.createdAt,
    })),
  });
}

