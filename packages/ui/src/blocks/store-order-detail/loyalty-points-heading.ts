import type {
  OrderDetailsFulfillmentStatus,
  OrderDetailsSidebarCopy,
} from "./types";

function loyaltyPointsHeading(
  copy: OrderDetailsSidebarCopy,
  status: OrderDetailsFulfillmentStatus,
): string | null {
  if (status === "canceled" || status === "refunded") {
    return null;
  }
  if (status === "completed") {
    return copy.loyaltyPointsEarned;
  }
  return copy.loyaltyPointsToEarn;
}

export { loyaltyPointsHeading };
