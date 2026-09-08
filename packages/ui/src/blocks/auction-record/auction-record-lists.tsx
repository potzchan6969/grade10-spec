import { VStack } from "@grade10/design-system/components/layout/vstack";
import { AuctionRecordEmpty } from "./auction-record-empty";
import { AuctionRecordRow } from "./auction-record-row";
import type { BiddingListProps, WatchingListProps } from "./types";

function RecordList({
  items,
  empty,
  className,
}: {
  items: WatchingListProps["items"];
  empty: WatchingListProps["empty"];
  className?: string;
}) {
  if (items.length === 0 && empty) return <AuctionRecordEmpty {...empty} />;
  return (
    <VStack className={className} gap="sm" hAlign="stretch">
      {items.map((item) => (
        <AuctionRecordRow key={item.href ?? item.title} {...item} />
      ))}
    </VStack>
  );
}

function WatchingList({ items, empty, className }: WatchingListProps) {
  return <RecordList className={className} empty={empty} items={items} />;
}

function BiddingList({ items, empty, className }: BiddingListProps) {
  return <RecordList className={className} empty={empty} items={items} />;
}

export { BiddingList, WatchingList };
