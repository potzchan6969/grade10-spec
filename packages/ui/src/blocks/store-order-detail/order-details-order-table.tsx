import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import { TableHead } from "@grade10/design-system/components/display/table-head";
import { TableHeader } from "@grade10/design-system/components/display/table-header";
import { cn } from "@grade10/design-system/lib/utils";
import { ORDER_TABLE_LAYOUT } from "./columns";
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
  return (
    <Table
      className={cn("w-full min-w-0", ORDER_TABLE_LAYOUT.table, className)}
      data-slot="order-details-order-table"
    >
      <TableHeader
        className={ORDER_TABLE_LAYOUT.row}
        data-slot="order-details-order-table-header"
      >
        <TableHead className="min-w-0">{copy.items}</TableHead>
        <TableHead align="end">{copy.subtotal}</TableHead>
        <TableHead align="end">{copy.quantity}</TableHead>
        <TableHead align="end">{copy.total}</TableHead>
      </TableHeader>
      <TableBody className={ORDER_TABLE_LAYOUT.body}>
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
  );
}

export type { OrderDetailsOrderTableProps };
export { OrderDetailsOrderTable };
