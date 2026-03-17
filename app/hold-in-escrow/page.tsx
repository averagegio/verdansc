import ApiServicePage from "../components/ApiServicePage";

export default function HoldInEscrowPage() {
  return (
    <ApiServicePage
      eyebrow="API Service - Compliance"
      title="Hold In Escrow API"
      summary="Manage secure transaction funds through programmable milestones, release approvals, and full audit trails for buyers, sellers, and brokers."
      features={[
        "Escrow account creation with beneficiary mapping",
        "Milestone-based release policies and approval gates",
        "Disbursement ledger with immutable event history",
        "Dispute state handling and notification webhooks",
      ]}
      workflow={[
        "Create an escrow record tied to transaction terms.",
        "Attach milestone triggers and signer approvals.",
        "Execute release events with complete audit output.",
      ]}
      endpoint="/api/hold-in-escrow"
    />
  );
}
