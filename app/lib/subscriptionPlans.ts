export type Audience = "renter" | "landlord";

export type PlanCard = {
  id: string;
  name: string;
  audience: Audience;
  price: string;
  description: string;
  highlights: string[];
  recommended?: boolean;
};

export const SUBSCRIPTION_PLANS: PlanCard[] = [
  {
    id: "renter-ready",
    name: "Rental Ready Club",
    audience: "renter",
    price: "$15/mo",
    description: "For renters and buyers who apply often and want faster approvals.",
    highlights: [
      "Reusable renter profile",
      "Monthly readiness check perks",
      "Priority support and reminders",
    ],
    recommended: true,
  },
  {
    id: "renter-plus",
    name: "Rental Ready Plus",
    audience: "renter",
    price: "$29/mo",
    description: "For active movers who need frequent submissions and support.",
    highlights: [
      "Everything in Club",
      "Extra application credits",
      "Priority queue for support",
    ],
  },
  {
    id: "landlord-growth",
    name: "Landlord Growth",
    audience: "landlord",
    price: "$99/mo",
    description: "For individual landlords and small managers handling recurring screening.",
    highlights: [
      "Applicant pipeline dashboard",
      "Rental application intake links",
      "Member-rate credit-check volume",
    ],
    recommended: true,
  },
  {
    id: "landlord-pro",
    name: "Landlord Pro",
    audience: "landlord",
    price: "$249/mo",
    description: "For multi-property teams that need higher volume and faster operations.",
    highlights: [
      "Everything in Growth",
      "Higher monthly usage limits",
      "Priority onboarding support",
    ],
  },
];

export function findPlanById(planId?: string) {
  if (!planId) return undefined;
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId);
}

export function isPlanForAudience(planId: string, audience: Audience) {
  const plan = findPlanById(planId);
  return Boolean(plan && plan.audience === audience);
}

export function getDefaultPlanIdForAudience(audience: Audience) {
  const recommended = SUBSCRIPTION_PLANS.find(
    (plan) => plan.audience === audience && plan.recommended,
  );
  if (recommended) return recommended.id;
  const first = SUBSCRIPTION_PLANS.find((plan) => plan.audience === audience);
  return first?.id;
}
