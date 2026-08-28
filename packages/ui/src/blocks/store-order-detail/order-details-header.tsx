import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { OrderHistoryStatus } from "../store-order-history/order-history-status";
import type { OrderDetailsFulfillmentStatus } from "./types";

type OrderDetailsHeaderProps = {
  orderId: ReactNode;
  status: OrderDetailsFulfillmentStatus;
  statusLabel: ReactNode;
  /** Pre-formatted placement date; wrapped in `<time>`. */
  placedOn: ReactNode;
  /** ISO date for the `<time datetime>` attribute. */
  placedOnDateTime?: string;
  needHelp?: {
    href: string;
    label: ReactNode;
    onClick?: () => void;
  };
  className?: string;
};

/**
 * Header bar for the order details page.
 *
 * Figma set `Product / Order / Order Details Header` (`5057:6691`). Renders
 * the order number as `<h1>`, a `Product / Order / Order Status` badge, a
 * `<time>` placement date, and an optional help link.
 */
function OrderDetailsHeader({
  orderId,
  status,
  statusLabel,
  placedOn,
  placedOnDateTime,
  needHelp,
  className,
}: OrderDetailsHeaderProps) {
  return (
    <VStack
      className={cn("w-full justify-center", className)}
      data-slot="order-details-header"
      gap="sm"
      hAlign="stretch"
    >
      <HStack className="w-full" gap="sm" vAlign="center">
        <h1 className="shrink-0 text-3xl leading-9 font-semibold whitespace-nowrap text-foreground">
          {orderId}
        </h1>
        <OrderHistoryStatus className="items-center" status={status}>
          {statusLabel}
        </OrderHistoryStatus>
      </HStack>
      <HStack className="w-full" gap="xs" vAlign="baseline">
        <time
          className="shrink-0 text-sm leading-5 whitespace-nowrap text-secondary-foreground"
          dateTime={placedOnDateTime}
        >
          {placedOn}
        </time>
        {needHelp ? (
          <Link
            href={needHelp.href}
            size="sm"
            variant="secondary"
            onClick={needHelp.onClick}
          >
            {needHelp.label}
          </Link>
        ) : null}
      </HStack>
    </VStack>
  );
}

export type { OrderDetailsHeaderProps };
export { OrderDetailsHeader };
