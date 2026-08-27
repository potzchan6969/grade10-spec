import type { ReactNode } from "react";

/** Figma Product / Order / Order Status axis (`4872:8537`). */
type OrderHistoryFulfillmentStatus =
  | "completed"
  | "shipped"
  | "pending"
  | "canceled"
  | "refunded";

/** One product line inside an order card. */
type OrderHistoryLineSummary = {
  id: string;
  /** Product name including quantity suffix, e.g. `Name × 2`. */
  product: ReactNode;
  /** Pre-formatted line total, e.g. `HK$210`. */
  total: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
};

/** One order row for Active or Past lists. */
type OrderHistoryOrderSummary = {
  id: string;
  /** Display order id, e.g. `Order #G10-10391`. */
  orderId: ReactNode;
  status: OrderHistoryFulfillmentStatus;
  /** Pre-formatted placement date, e.g. `Placed on Aug 26, 2026`. */
  date: ReactNode;
  /** Pre-formatted order total, e.g. `Total: HK$1,770`. */
  total: ReactNode;
  /** Show Track Order (typically shipped). */
  trackOrder?: boolean;
  lines: readonly OrderHistoryLineSummary[];
};

export type {
  OrderHistoryFulfillmentStatus,
  OrderHistoryLineSummary,
  OrderHistoryOrderSummary,
};
