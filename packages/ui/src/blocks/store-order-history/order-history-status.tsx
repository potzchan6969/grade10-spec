import { Badge } from "@grade10/design-system/components/display/badge";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import type { OrderHistoryFulfillmentStatus } from "./types";

const STATUS_BADGE_VARIANT: Record<
  OrderHistoryFulfillmentStatus,
  "outline" | "info" | "warning"
> = {
  completed: "outline",
  shipped: "info",
  processing: "warning",
  pickup: "info",
  canceled: "outline",
  refunded: "outline",
};

type OrderHistoryStatusProps = {
  status: OrderHistoryFulfillmentStatus;
  /** Consumer-supplied label for this status. */
  children: ReactNode;
  className?: string;
};

/**
 * Visual status badge for order tracking. Displays the current fulfillment
 * state of an order. Supports both online and in-store order channels.
 *
 * Figma set `Product / Order / Order Status` (`4872:8537`). Axis `status`:
 * `completed` · `shipped` · `processing` · `pickup` · `canceled` · `refunded`.
 * Each rung composes design-system `Badge` `sm`: `outline` for completed /
 * canceled / refunded, `info` for shipped and pickup, `warning` for processing.
 */
function OrderHistoryStatus({
  status,
  children,
  className,
}: OrderHistoryStatusProps) {
  return (
    <span
      className={cn("inline-flex items-start", className)}
      data-slot="order-history-status"
      data-status={status}
    >
      <Badge size="sm" variant={STATUS_BADGE_VARIANT[status]}>
        {children}
      </Badge>
    </span>
  );
}

export type { OrderHistoryStatusProps };
export { OrderHistoryStatus, STATUS_BADGE_VARIANT };
