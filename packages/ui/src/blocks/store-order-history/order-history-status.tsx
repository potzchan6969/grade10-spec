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
  /** A second fact about the order beside its status, e.g. `Partially
   * refunded`, already worded. Omit it and only the status shows. */
  note?: ReactNode;
  className?: string;
};

/**
 * Shows the order status the consumer chooses, with its label.
 *
 * Figma set `Product / Order / Order Status` (`4872:8537`). Axis `status`:
 * `completed` · `shipped` · `processing` · `pickup` · `canceled` · `refunded`.
 * Each rung composes design-system `Badge` `sm`: `outline` for completed /
 * canceled / refunded, `info` for shipped and pickup, `warning` for processing.
 * A `note` follows the status as an `outline` badge of its own.
 */
function OrderHistoryStatus({
  status,
  children,
  note,
  className,
}: OrderHistoryStatusProps) {
  return (
    <span
      className={cn("inline-flex flex-wrap items-start gap-1", className)}
      data-slot="order-history-status"
      data-status={status}
    >
      <Badge size="sm" variant={STATUS_BADGE_VARIANT[status]}>
        {children}
      </Badge>
      {note != null ? (
        <Badge
          data-slot="order-history-status-note"
          size="sm"
          variant="outline"
        >
          {note}
        </Badge>
      ) : null}
    </span>
  );
}

export type { OrderHistoryStatusProps };
export { OrderHistoryStatus, STATUS_BADGE_VARIANT };
