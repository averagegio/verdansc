import ApiServicePage from "../components/ApiServicePage";

export default function BrokerServicesPage() {
  return (
    <ApiServicePage
      eyebrow="API Service - Advisory"
      title="Broker Services API"
      summary="Match clients with qualified brokers, benchmark local market conditions, and generate offer guidance based on live neighborhood activity."
      features={[
        "Broker ranking by specialty, area, and performance",
        "Local market snapshot with velocity indicators",
        "Offer strategy suggestions per competition profile",
        "Engagement routing to CRM and scheduling systems",
      ]}
      workflow={[
        "Provide client preferences, budget, and target zones.",
        "Ranking engine filters and scores broker candidates.",
        "Return recommendations and action-ready intro data.",
      ]}
      endpoint="/api/broker-services"
    />
  );
}
