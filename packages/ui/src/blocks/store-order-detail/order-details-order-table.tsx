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
 * If an item needs partial processing (refund, cancel, or separate shipment),
 * the consumer splits it into a separate row with line status set.
 */
function OrderDetailsOrderTable({
  copy,
  lines,
  statusLabels,
  className,
}: OrderDetailsOrderTableProps) {
  return (
    <Table className={cn(className)} data-slot="order-details-order-table">
      <TableHeader data-slot="order-details-order-table-header">
        <TableHead className="min-w-0 flex-1">{copy.items}</TableHead>
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
          />
        ))}
      </TableBody>
    </Table>
  );
}

export type { OrderDetailsOrderTableProps };
export { OrderDetailsOrderTable };
