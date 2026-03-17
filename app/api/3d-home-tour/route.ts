import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "3d-home-tour",
    status: "ok",
    generatedAt: new Date().toISOString(),
    tour: {
      tourId: "tour_987",
      propertyId: "prop_221",
      totalScenes: 14,
      durationEstimateMinutes: 6,
      publishedUrl: "https://viewer.verdansc.local/tour/tour_987",
    },
    overlays: ["room-labels", "measurements", "furniture-staging"],
  });
}
