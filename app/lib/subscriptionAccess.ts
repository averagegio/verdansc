import { SubscriptionStatus } from "./mockUsers";

export const ACTIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  "active",
  "trialing",
];

export function hasActiveSubscription(
  status: SubscriptionStatus | undefined,
): boolean {
  if (!status) return false;
  return ACTIVE_SUBSCRIPTION_STATUSES.includes(status);
}
