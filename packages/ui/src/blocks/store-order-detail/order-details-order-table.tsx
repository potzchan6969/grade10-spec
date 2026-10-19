import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import { TableHead } from "@grade10/design-system/components/display/table-head";
import { TableHeader } from "@grade10/design-system/components/display/table-header";
import { cn } from "@grade10/design-system/lib/utils";
import { OrderDetailsOrderItem } from "./order-details-order-item";
import type { OrderDetailsLineItem, OrderDetailsTableCopy } from "./types";

type OrderDetailsOrderTableProps = {
  copy: OrderDetailsTableCopy;
  lines: readonly OrderDetailsLineItem[];
  /** Labels keyed by fulfillment status for line-level badges. */
  statusLabels: Record<string, string>;
  className?: string;
};

/**
 * Order line items table within Order Details.
 *
 * Figma set `Product / Order / Order Details Order Table` (`5010:6293`).
 * Item-level promos use `couponCode` on the line with discounted amounts on
 * that row. Order-level promos use `summary.discount` with the code in the
 * label; lines stay at list price. The same promotion is never shown in both
 * places. If an item needs partial processing (refund, cancel, or separate
 * shipment), the consumer splits it into a separate row with line status set.
 */
function OrderDetailsOrderTable({
  copy,
  lines,
  statusLabels,
  className,
}: OrderDetailsOrderTableProps) {
  /* The fixed money columns cannot share a narrow viewport with the
   * product cell, so the table scrolls sideways under sm — the same rail
   * as Winner Order's Order Progress. */
  return (
    <div
      className="w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      data-slot="order-details-order-table-rail"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the rail scrolls sideways on a narrow screen, and a scroll container takes focus so a keyboard can scroll it.
      tabIndex={0}
    >
      <Table
        className={cn("w-max min-w-full", className)}
        data-slot="order-details-order-table"
      >
        <TableHeader data-slot="order-details-order-table-header">
          <TableHead className="min-w-32 flex-1">{copy.items}</TableHead>
          {/* biome-ignore lint/plugin: column width matches Figma Table Head 88px */}
          <TableHead align="end" className="w-[88px] shrink-0">
            {copy.subtotal}
          </TableHead>
          <TableHead align="end" className="w-14 shrink-0">
            {copy.quantity}
          </TableHead>
          {/* biome-ignore lint/plugin: column width matches Figma Table Head 83px */}
          <TableHead align="end" className="w-[83px] shrink-0">
            {copy.total}
          </TableHead>
        </TableHeader>
        <TableBody>
          {lines.map((line) => (
            <OrderDetailsOrderItem
              key={line.id}
              imageAlt={line.imageAlt}
              imageSrc={line.imageSrc}
              lineStatus={line.lineStatus}
              product={line.product}
              quantity={line.quantity}
              statusLabel={
                line.lineStatus != null
                  ? statusLabels[line.lineStatus]
                  : undefined
              }
              statusMessage={line.statusMessage}
              struckThrough={line.struckThrough}
              subtotal={line.subtotal}
              total={line.total}
              couponCode={line.couponCode}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export type { OrderDetailsOrderTableProps };
export { OrderDetailsOrderTable };
