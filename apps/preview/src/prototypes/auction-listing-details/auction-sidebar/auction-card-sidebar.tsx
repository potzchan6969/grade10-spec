import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { BidMode, BiddingState } from "../types";
import { SIDEBAR_COLUMN_CLASS } from "../page-shell";
import { LotMeta } from "./lot-meta";
import { AuctionBidCard } from "./auction-bid-card";

type AuctionCardSidebarProps = {
  state: BiddingState;
  bidMode: BidMode;
  onBidModeChange: (mode: BidMode) => void;
  onPlaceBid: () => void;
};

function AuctionCardSidebar({
  state,
  bidMode,
  onBidModeChange,
  onPlaceBid,
}: AuctionCardSidebarProps) {
  return (
    <VStack className={SIDEBAR_COLUMN_CLASS} data-variant="auction-card" gap="lg">
      <AuctionBidCard
        bidMode={bidMode}
        onBidModeChange={onBidModeChange}
        onPlaceBid={onPlaceBid}
        state={state}
      />
      <LotMeta state={state} />
    </VStack>
  );
}

export { AuctionCardSidebar };
