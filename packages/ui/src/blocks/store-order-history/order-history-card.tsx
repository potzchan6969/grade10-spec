import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import type { OrderHistoryCardHeaderCopy } from "./order-history-card-header";
import { OrderHistoryCardHeader } from "./order-history-card-header";
import type { OrderHistoryFulfillmentStatus } from "./types";

type OrderHistoryCardProps = {
  copy: OrderHistoryCardHeaderCopy;
  orderId: ReactNode;
  status: OrderHistoryFulfillmentStatus;
  statusLabel: ReactNode;
  date: ReactNode;
  total: ReactNode;
  trackOrder?: boolean;
  onTrackOrder?: () => void;
  onViewDetails?: () => void;
  /** Horizontally scrollable line items (`OrderHistoryLineItem`). */
  children?: ReactNode;
  className?: string;
};

/**
 * An order summary card. Displays order metadata (ID, status, date, total),
 * action buttons, and a horizontally-scrollable list of ordered product items
 * via a slot.
 *
 * Figma set `Product / Order / Order Item` (`4872:8325`). Body annotation:
 * when items overflow, apply scroll-fade on the edges and enable horizontal
 * scroll (`scroll-fade-x` — the default `scroll-fade` is vertical only).
 */
function OrderHistoryCard({
  copy,
  orderId,
  status,
  statusLabel,
  date,
  total,
  trackOrder,
  onTrackOrder,
  onViewDetails,
  children,
  className,
}: OrderHistoryCardProps) {
  return (
    <VStack
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-border bg-card",
        className,
      )}
      data-slot="order-history-card"
      gap="none"
      hAlign="stretch"
    >
      <OrderHistoryCardHeader
        copy={copy}
        date={date}
        orderId={orderId}
        status={status}
        statusLabel={statusLabel}
        total={total}
        trackOrder={trackOrder}
        onTrackOrder={onTrackOrder}
        onViewDetails={onViewDetails}
      />
      <div
        className="scroll-fade-x w-full overflow-x-auto px-6 py-5"
        data-slot="order-history-card-body"
      >
        <div
          className="flex w-max min-w-full items-center gap-4"
          data-slot="order-history-card-slot"
        >
          {children}
        </div>
      </div>
    </VStack>
  );
}

export type { OrderHistoryCardProps };
export { OrderHistoryCard };
