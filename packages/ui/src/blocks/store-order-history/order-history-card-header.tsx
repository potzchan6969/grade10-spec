import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { OrderHistoryStatus } from "./order-history-status";
import type { OrderHistoryFulfillmentStatus } from "./types";

type OrderHistoryCardHeaderCopy = {
  trackOrder: string;
  viewDetails: string;
};

type OrderHistoryCardHeaderProps = {
  copy: OrderHistoryCardHeaderCopy;
  orderId: ReactNode;
  status: OrderHistoryFulfillmentStatus;
  statusLabel: ReactNode;
  date: ReactNode;
  total: ReactNode;
  /** Figma BOOLEAN `trackOrder` — show Track Order (shipped orders). */
  trackOrder?: boolean;
  onTrackOrder?: () => void;
  onViewDetails?: () => void;
  className?: string;
};

/**
 * Header row for an order summary card. Displays order ID, status badge,
 * placement date, total amount, and action buttons.
 *
 * Figma `Product / Order / Order Item Header` (`4863:8260`). Properties:
 * `orderId`, `date`, `total` (text); `trackOrder` (boolean). Status uses
 * `Product / Order / Order Status`. Track Order opens via consumer callback
 * (carrier page in a new tab). View Details navigates via consumer callback.
 */
function OrderHistoryCardHeader({
  copy,
  orderId,
  status,
  statusLabel,
  date,
  total,
  trackOrder = false,
  onTrackOrder,
  onViewDetails,
  className,
}: OrderHistoryCardHeaderProps) {
  const showTrack = trackOrder && onTrackOrder != null;

  return (
    <HStack
      className={cn("w-full overflow-hidden bg-muted px-6 py-4", className)}
      data-slot="order-history-card-header"
      gap="md"
      vAlign="center"
    >
      <VStack className="min-w-0 flex-1" gap="xs" hAlign="stretch">
        <HStack className="w-full" gap="sm" vAlign="center">
          <p className="shrink-0 text-base leading-6 font-medium whitespace-nowrap text-foreground">
            {orderId}
          </p>
          <OrderHistoryStatus status={status}>{statusLabel}</OrderHistoryStatus>
        </HStack>
        <HStack
          className="text-sm leading-5 whitespace-nowrap text-secondary-foreground"
          gap="md"
          vAlign="center"
        >
          <p className="shrink-0">{date}</p>
          <p className="shrink-0">{total}</p>
        </HStack>
      </VStack>
      <HStack className="shrink-0" gap="sm" vAlign="center">
        {showTrack ? (
          <Button
            size="md"
            trailing={<ArrowUpRight aria-hidden size={14} weight="bold" />}
            onClick={onTrackOrder}
          >
            {copy.trackOrder}
          </Button>
        ) : null}
        {onViewDetails != null ? (
          <Button size="md" variant="outline" onClick={onViewDetails}>
            {copy.viewDetails}
          </Button>
        ) : null}
      </HStack>
    </HStack>
  );
}

export type { OrderHistoryCardHeaderCopy, OrderHistoryCardHeaderProps };
export { OrderHistoryCardHeader };
