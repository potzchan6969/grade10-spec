import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import {
  REVEAL_HIDDEN_CLASS,
  REVEAL_REDUCED_MOTION_CLASS,
  REVEAL_TRANSITION_CLASS,
  REVEAL_VISIBLE_CLASS,
  revealStaggerDelayMs,
  useFirstPaintReveal,
} from "../shared/use-first-paint-reveal";
import { OrderDetailsDeliveryStatus } from "./order-details-delivery-status";
import { OrderDetailsHeader } from "./order-details-header";
import { OrderDetailsOrderTable } from "./order-details-order-table";
import { OrderDetailsSidebar } from "./order-details-sidebar";
import type {
  OrderDetailsAddress,
  OrderDetailsCopy,
  OrderDetailsDelivery,
  OrderDetailsFulfillmentStatus,
  OrderDetailsLineItem,
  OrderDetailsPayment,
  OrderDetailsSummary,
} from "./types";

type OrderDetailsProps = {
  copy: OrderDetailsCopy;
  breadcrumbs?: ReactNode;
  orderId: ReactNode;
  status: OrderDetailsFulfillmentStatus;
  placedOn: ReactNode;
  placedOnDateTime?: string;
  needHelp?: {
    href: string;
    label?: ReactNode;
    onClick?: () => void;
  };
  delivery?: OrderDetailsDelivery;
  lines: readonly OrderDetailsLineItem[];
  summary: OrderDetailsSummary;
  payment: OrderDetailsPayment;
  shippingAddress?: OrderDetailsAddress;
  pickupAddress?: OrderDetailsAddress;
  loyaltyPoints?: ReactNode;
  onTrackOrder?: () => void;
  className?: string;
};

function RevealGroup({
  children,
  className,
  revealed,
  staggerIndex,
}: {
  children: ReactNode;
  className?: string;
  revealed: boolean;
  staggerIndex: number;
}) {
  return (
    <div
      className={cn(
        REVEAL_HIDDEN_CLASS,
        REVEAL_TRANSITION_CLASS,
        REVEAL_REDUCED_MOTION_CLASS,
        revealed && REVEAL_VISIBLE_CLASS,
        className,
      )}
      style={{
        transitionDelay: revealStaggerDelayMs(staggerIndex, revealed),
      }}
    >
      {children}
    </div>
  );
}

/**
 * Order Details page body: breadcrumbs, header, delivery progress, line-item
 * table, and sidebar summary.
 *
 * Figma frame `Order Details` (`4835:1654`). Site chrome (Nav/Footer) stays
 * outside this compound. Delivery status is hidden when `delivery` is omitted
 * (offline in-store payment orders).
 *
 * First paint: header, delivery card (when present), table, and sidebar stagger
 * in (opacity + translateY). Settles immediately under reduced motion.
 */
function OrderDetails({
  copy,
  breadcrumbs,
  orderId,
  status,
  placedOn,
  placedOnDateTime,
  needHelp,
  delivery,
  lines,
  summary,
  payment,
  shippingAddress,
  pickupAddress,
  loyaltyPoints,
  onTrackOrder,
  className,
}: OrderDetailsProps) {
  const revealed = useFirstPaintReveal();
  const hasDelivery = delivery != null;
  const tableStaggerIndex = hasDelivery ? 2 : 1;
  const sidebarStaggerIndex = hasDelivery ? 3 : 2;

  const needHelpConfig =
    needHelp != null
      ? {
          href: needHelp.href,
          label: needHelp.label ?? copy.needHelp,
          onClick: needHelp.onClick,
        }
      : undefined;

  return (
    <VStack
      className={cn(
        "w-full max-w-7xl gap-12 overflow-hidden px-8 pt-8 pb-16",
        className,
      )}
      data-revealed={revealed || undefined}
      data-slot="order-details"
      hAlign="stretch"
    >
      {breadcrumbs}
      <RevealGroup revealed={revealed} staggerIndex={0}>
        <OrderDetailsHeader
          needHelp={needHelpConfig}
          orderId={orderId}
          placedOn={placedOn}
          placedOnDateTime={placedOnDateTime}
          status={status}
          statusLabel={copy.status[status]}
        />
      </RevealGroup>
      <div className="grid w-full grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start gap-12">
        <VStack className="min-w-0" gap="lg" hAlign="stretch">
          {delivery ? (
            <RevealGroup revealed={revealed} staggerIndex={1}>
              <OrderDetailsDeliveryStatus
                copy={copy.delivery}
                steps={delivery.steps}
                trackOrder={delivery.trackOrder}
                onTrackOrder={onTrackOrder}
              />
            </RevealGroup>
          ) : null}
          <RevealGroup revealed={revealed} staggerIndex={tableStaggerIndex}>
            <OrderDetailsOrderTable
              copy={copy.table}
              lines={lines}
              statusLabels={copy.status}
            />
          </RevealGroup>
        </VStack>
        <RevealGroup
          className="min-w-0"
          revealed={revealed}
          staggerIndex={sidebarStaggerIndex}
        >
          <OrderDetailsSidebar
            copy={copy.sidebar}
            loyaltyPoints={loyaltyPoints}
            payment={payment}
            pickupAddress={pickupAddress}
            shippingAddress={shippingAddress}
            summary={summary}
          />
        </RevealGroup>
      </div>
    </VStack>
  );
}

export type { OrderDetailsCopy, OrderDetailsProps };
export { OrderDetails };
