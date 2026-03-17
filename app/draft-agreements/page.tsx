import ApiServicePage from "../components/ApiServicePage";

export default function DraftAgreementsPage() {
  return (
    <ApiServicePage
      eyebrow="API Service - Legal"
      title="Draft Agreements API"
      summary="Generate transaction-ready agreement drafts with jurisdiction templates, clause recommendations, and clean exports for signature workflows."
      features={[
        "Template selection by state and transaction type",
        "Dynamic clause insertion from property context",
        "Version history with redline comparison metadata",
        "Output bundles for e-sign and archival systems",
      ]}
      workflow={[
        "Send party data, listing terms, and jurisdiction.",
        "Draft engine composes base template plus clause set.",
        "Return editable document and signature packet payload.",
      ]}
      endpoint="/api/draft-agreements"
    />
  );
}
