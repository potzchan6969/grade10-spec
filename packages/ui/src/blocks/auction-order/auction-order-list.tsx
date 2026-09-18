import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { AuctionOrderEmpty } from "./auction-order-empty";
import { AuctionOrderRow } from "./auction-order-row";
import type { AuctionOrderListProps } from "./types";

function AuctionOrderList({ items, empty, className }: AuctionOrderListProps) {
  if (items.length === 0) {
    return <AuctionOrderEmpty {...empty} className={className} />;
  }

  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="auction-order-list"
      gap="md"
      hAlign="stretch"
    >
      {items.map((item, index) => (
        <AuctionOrderRow
          key={item.lotHref ?? `${String(item.title)}-${index}`}
          {...item}
        />
      ))}
    </VStack>
  );
}

export type { AuctionOrderListProps };
export { AuctionOrderList };
