import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Package } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { OrderHistoryCard } from "./order-history-card";
import type { OrderHistoryCardHeaderCopy } from "./order-history-card-header";
import { OrderHistoryLineItem } from "./order-history-line-item";
import type {
  OrderHistoryFulfillmentStatus,
  OrderHistoryOrderSummary,
} from "./types";

type OrderHistoryCopy = {
  title: string;
  activeHeading: string;
  pastHeading: string;
  emptyTitle: string;
  emptyDescription: string;
  shopNow: string;
  cardHeader: OrderHistoryCardHeaderCopy;
  /** Labels keyed by fulfillment status. */
  status: Record<OrderHistoryFulfillmentStatus, string>;
};

type OrderHistoryProps = {
  copy: OrderHistoryCopy;
  /** Breadcrumb trail; typically design-system `Breadcrumbs`. */
  breadcrumbs?: ReactNode;
  /** Consumer-split active orders, already latest → oldest. */
  activeOrders?: readonly OrderHistoryOrderSummary[];
  /** Consumer-split past orders, already latest → oldest. */
  pastOrders?: readonly OrderHistoryOrderSummary[];
  onTrackOrder?: (orderId: string) => void;
  onViewDetails?: (orderId: string) => void;
  onShopNow?: () => void;
  className?: string;
};

function OrderSection({
  heading,
  orders,
  copy,
  onTrackOrder,
  onViewDetails,
}: {
  heading: string;
  orders: readonly OrderHistoryOrderSummary[];
  copy: OrderHistoryCopy;
  onTrackOrder?: (orderId: string) => void;
  onViewDetails?: (orderId: string) => void;
}) {
  return (
    <VStack className="w-full" gap="lg" hAlign="stretch">
      <h2 className="w-full text-xl leading-7 font-semibold text-foreground">
        {heading}
      </h2>
      <VStack className="w-full" gap="md" hAlign="stretch">
        {orders.map((order) => (
          <OrderHistoryCard
            key={order.id}
            copy={copy.cardHeader}
            date={order.date}
            orderId={order.orderId}
            status={order.status}
            statusLabel={copy.status[order.status]}
            total={order.total}
            trackOrder={order.trackOrder}
            onTrackOrder={
              order.trackOrder && onTrackOrder
                ? () => onTrackOrder(order.id)
                : undefined
            }
            onViewDetails={
              onViewDetails ? () => onViewDetails(order.id) : undefined
            }
          >
            {order.lines.map((line) => (
              <OrderHistoryLineItem
                key={line.id}
                imageAlt={line.imageAlt}
                imageSrc={line.imageSrc}
                product={line.product}
                total={line.total}
              />
            ))}
          </OrderHistoryCard>
        ))}
      </VStack>
    </VStack>
  );
}

/**
 * Your Orders page body: breadcrumbs, title, Active/Past sections, or empty.
 *
 * Figma frames `Order History` (`4835:1534`) and `Order History (Empty)`
 * (`4923:3424`). Annotation: hide a section with no orders; if there are no
 * orders at all, show empty state. Lists are sorted by the consumer
 * (latest → oldest). Site chrome (Nav/Footer) stays outside this compound.
 */
function OrderHistory({
  copy,
  breadcrumbs,
  activeOrders = [],
  pastOrders = [],
  onTrackOrder,
  onViewDetails,
  onShopNow,
  className,
}: OrderHistoryProps) {
  const hasActive = activeOrders.length > 0;
  const hasPast = pastOrders.length > 0;
  const isEmpty = !hasActive && !hasPast;

  return (
    <VStack
      className={cn(
        "w-full max-w-7xl gap-12 overflow-hidden px-8 pt-8 pb-16",
        className,
      )}
      data-slot="order-history"
      hAlign="stretch"
    >
      {breadcrumbs}
      <h1 className="w-full text-3xl leading-9 font-bold text-foreground">
        {copy.title}
      </h1>
      {isEmpty ? (
        <EmptyState
          actions={
            onShopNow != null ? (
              <Button size="md" variant="secondary" onClick={onShopNow}>
                {copy.shopNow}
              </Button>
            ) : undefined
          }
          description={copy.emptyDescription}
          icon={<Package aria-hidden size={24} weight="regular" />}
          title={copy.emptyTitle}
        />
      ) : (
        <>
          {hasActive ? (
            <OrderSection
              copy={copy}
              heading={copy.activeHeading}
              orders={activeOrders}
              onTrackOrder={onTrackOrder}
              onViewDetails={onViewDetails}
            />
          ) : null}
          {hasPast ? (
            <OrderSection
              copy={copy}
              heading={copy.pastHeading}
              orders={pastOrders}
              onTrackOrder={onTrackOrder}
              onViewDetails={onViewDetails}
            />
          ) : null}
        </>
      )}
    </VStack>
  );
}

export type { OrderHistoryCopy, OrderHistoryProps };
export { OrderHistory };
