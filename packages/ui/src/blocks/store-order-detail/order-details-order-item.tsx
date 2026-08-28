import { TableCell } from "@grade10/design-system/components/display/table-cell";
import { TableRow } from "@grade10/design-system/components/display/table-row";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { OrderHistoryStatus } from "../store-order-history/order-history-status";
import type { OrderDetailsFulfillmentStatus } from "./types";

type OrderDetailsOrderItemProps = {
  product: ReactNode;
  subtotal: ReactNode;
  quantity: ReactNode;
  total: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  lineStatus?: OrderDetailsFulfillmentStatus;
  statusLabel?: ReactNode;
  statusMessage?: ReactNode;
  struckThrough?: boolean;
  className?: string;
};

/**
 * A single line item row in the Order Details table.
 *
 * Figma set `Product / Order / Order Details Order Item` (`5010:6440`).
 * Default rows show product thumbnail, name, subtotal, qty, and total.
 * Flagged rows (`status=true` in Figma) show a status badge with a custom
 * message and strike through subtotal and total. Qty on a split row reflects
 * the partial quantity being refunded/canceled.
 */
function OrderDetailsOrderItem({
  product,
  subtotal,
  quantity,
  total,
  imageSrc,
  imageAlt = "",
  lineStatus,
  statusLabel,
  statusMessage,
  struckThrough = false,
  className,
}: OrderDetailsOrderItemProps) {
  const priceClass = struckThrough
    ? "text-sm leading-5 line-through text-foreground"
    : "text-sm leading-5 text-foreground";
  const totalClass = struckThrough
    ? "text-sm leading-5 font-medium line-through text-foreground"
    : "text-sm leading-5 font-medium text-foreground";

  return (
    <TableRow
      className={className}
      data-slot="order-details-order-item"
      data-struck-through={struckThrough || undefined}
    >
      <TableCell className="min-w-0 flex-1">
        <HStack className="min-w-0 flex-1" gap="md" vAlign="center">
          <div
            aria-hidden={imageSrc ? undefined : true}
            className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-gradient-to-b from-background-subtle to-muted"
            data-slot="order-details-order-item-image"
          >
            {imageSrc ? (
              <img
                alt={imageAlt}
                className="absolute inset-0 size-full object-cover"
                src={imageSrc}
              />
            ) : null}
          </div>
          {lineStatus != null ? (
            <VStack className="min-w-0 flex-1" gap="xs" hAlign="stretch">
              <p className="w-full text-sm leading-5 font-medium text-foreground">
                {product}
              </p>
              <HStack className="w-full flex-wrap" gap="xs" vAlign="center">
                <OrderHistoryStatus status={lineStatus}>
                  {statusLabel}
                </OrderHistoryStatus>
                {statusMessage ? (
                  <p className="min-w-0 flex-1 text-xs leading-4 text-secondary-foreground">
                    {statusMessage}
                  </p>
                ) : null}
              </HStack>
            </VStack>
          ) : (
            <p className="min-w-0 flex-1 text-sm leading-5 font-medium text-foreground">
              {product}
            </p>
          )}
        </HStack>
      </TableCell>
      {/* biome-ignore lint/plugin: column width matches Figma Table Head 88px */}
      <TableCell align="end" className="w-[88px] shrink-0">
        <p className={cn(priceClass, "whitespace-nowrap")}>{subtotal}</p>
      </TableCell>
      <TableCell align="end" className="w-14 shrink-0">
        <p className="text-sm leading-5 whitespace-nowrap text-foreground">
          {quantity}
        </p>
      </TableCell>
      {/* biome-ignore lint/plugin: column width matches Figma Table Head 83px */}
      <TableCell align="end" className="w-[83px] shrink-0">
        <p className={cn(totalClass, "whitespace-nowrap")}>{total}</p>
      </TableCell>
    </TableRow>
  );
}

export type { OrderDetailsOrderItemProps };
export { OrderDetailsOrderItem };
