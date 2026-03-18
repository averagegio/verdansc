import ApiServicePage from "../components/ApiServicePage";

export default function HomeTourPage() {
  return (
    <ApiServicePage
      eyebrow="Home Marketing Service"
      title="3D Home Tours"
      summary="Show properties with immersive walkthroughs that help renters and buyers decide faster before scheduling in-person visits."
      features={[
        "Interactive room-by-room walk-through experience",
        "Listing-ready media links for faster lead engagement",
        "Virtual staging options for empty properties",
        "Shareable tour links for agents and landlords",
      ]}
    />
  );
}
