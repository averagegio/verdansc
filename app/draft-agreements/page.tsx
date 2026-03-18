import ApiServicePage from "../components/ApiServicePage";

export default function DraftAgreementsPage() {
  return (
    <ApiServicePage
      eyebrow="Legal Document Service"
      title="Draft Agreements"
      summary="Prepare clean, transaction-ready real estate agreements with faster turnaround and fewer manual revisions."
      features={[
        "Smart templates by transaction type",
        "Property-aware clause recommendations",
        "Version-ready document updates",
        "E-sign and download friendly format support",
      ]}
    />
  );
}
