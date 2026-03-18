import ApiServicePage from "../components/ApiServicePage";

export default function HoldInEscrowPage() {
  return (
    <ApiServicePage
      eyebrow="Transaction Security Service"
      title="Escrow Services"
      summary="Protect buyer and seller funds with guided escrow milestones, approval checkpoints, and transparent release tracking."
      features={[
        "Escrow setup tied to property and transaction terms",
        "Milestone-based payment release approvals",
        "Clear status timeline for all stakeholders",
        "Dispute and hold handling with audit history",
      ]}
    />
  );
}
