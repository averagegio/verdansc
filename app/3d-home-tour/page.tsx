import ApiServicePage from "../components/ApiServicePage";

export default function HomeTourPage() {
  return (
    <ApiServicePage
      eyebrow="API Service - Visualization"
      title="3D Home Tour API"
      summary="Convert floorplans and image sets into guided virtual tours with room anchors, measurement overlays, and shareable walkthrough links."
      features={[
        "Scene stitching with camera path smoothing",
        "Room labels, hotspots, and measurement overlays",
        "Optional virtual staging layer for empty properties",
        "Embeddable viewer configuration per listing",
      ]}
      workflow={[
        "Upload property media and structured room metadata.",
        "Tour engine generates connected scenes and route hints.",
        "Publish a signed URL for portal and CRM integrations.",
      ]}
      endpoint="/api/3d-home-tour"
    />
  );
}
