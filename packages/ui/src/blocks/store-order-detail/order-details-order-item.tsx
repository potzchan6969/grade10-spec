import { TableCell } from "@grade10/design-system/components/display/table-cell";
import { TableRow } from "@grade10/design-system/components/display/table-row";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Tag } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { OrderHistoryStatus } from "../store-order-history/order-history-status";
import { ORDER_TABLE_LAYOUT } from "./columns";
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
  couponCode?: ReactNode;
  className?: string;
};

/**
 * A single line item row in the Order Details table.
 *
 * Figma set `Product / Order / Order Details Order Item` (`5010:6440`).
 * Default rows show product thumbnail, name, subtotal, qty, and total. Rows
 * with an item-level coupon show the code under the title; subtotal and total
 * are the discounted amounts and that promo must not also appear in the order
 * summary. Flagged rows (`status=true` in Figma) show a status badge with a custom message and strike through subtotal
 * and total. Qty on a split row reflects the partial quantity being
 * refunded/canceled.
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
  couponCode,
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
      className={cn(ORDER_TABLE_LAYOUT.row, className)}
      data-slot="order-details-order-item"
      data-struck-through={struckThrough || undefined}
    >
      <TableCell className="min-w-0">
        <HStack className="min-w-0 flex-1" gap="md" vAlign="center">
          <div
            aria-hidden={imageSrc ? undefined : true}
            className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-gradient-to-b from-background-subtle to-muted sm:size-12"
            data-slot="order-details-order-item-image"
          >
            {imageSrc ? (
              <img
                alt={imageAlt}
                className="absolute inset-0 size-full object-contain"
                src={imageSrc}
              />
            ) : null}
          </div>
          <VStack className="min-w-0 flex-1" gap="xs" hAlign="stretch">
            <p className="w-full break-words text-sm leading-5 font-medium text-foreground">
              {product}
            </p>
            {couponCode != null ? (
              <HStack className="w-full" gap="xs" vAlign="center">
                <span
                  aria-hidden
                  className="shrink-0 text-secondary-foreground"
                >
                  <Tag size={14} weight="bold" />
                </span>
                <span className="text-xs leading-4 text-secondary-foreground">
                  {couponCode}
                </span>
              </HStack>
            ) : null}
            {lineStatus != null ? (
              <HStack className="w-full flex-wrap" gap="xs" vAlign="center">
                <OrderHistoryStatus status={lineStatus}>
                  {statusLabel}
                </OrderHistoryStatus>
                {statusMessage ? (
                  <p className="min-w-0 basis-full text-xs leading-4 text-secondary-foreground sm:basis-auto sm:flex-1">
                    {statusMessage}
                  </p>
                ) : null}
              </HStack>
            ) : null}
          </VStack>
        </HStack>
      </TableCell>
      <TableCell align="end">
        <p className={cn(priceClass, "whitespace-nowrap")}>{subtotal}</p>
      </TableCell>
      <TableCell align="end">
        <p className="text-sm leading-5 whitespace-nowrap text-foreground">
          {quantity}
        </p>
      </TableCell>
      <TableCell align="end">
        <p className={cn(totalClass, "whitespace-nowrap")}>{total}</p>
      </TableCell>
    </TableRow>
  );
}

export type { OrderDetailsOrderItemProps };
export { OrderDetailsOrderItem };
