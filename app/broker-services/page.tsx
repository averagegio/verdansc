import ApiServicePage from "../components/ApiServicePage";

export default function BrokerServicesPage() {
  return (
    <ApiServicePage
      eyebrow="Local Advisory Service"
      title="Broker Services"
      summary="Connect renters, buyers, and owners with local brokers who match budget, goals, and neighborhood priorities."
      features={[
        "Broker matching by area, specialty, and performance",
        "Local market pace and competition snapshot",
        "Offer and negotiation guidance recommendations",
        "Quick handoff into scheduling and follow-up tools",
      ]}
    />
  );
}
