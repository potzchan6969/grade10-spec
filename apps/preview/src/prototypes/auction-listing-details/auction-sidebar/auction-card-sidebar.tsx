import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { BidMode, BiddingState } from "../types";
import { SIDEBAR_COLUMN_CLASS } from "../page-shell";
import { LotDescription, LotMeta } from "./lot-meta";
import { AuctionBidCard } from "./auction-bid-card";
import { SidebarHeader } from "./sidebar-header";

type AuctionCardSidebarProps = {
  state: BiddingState;
  bidMode: BidMode;
  onBidModeChange: (mode: BidMode) => void;
  onPlaceBid: () => void;
  watched?: boolean;
  onWatchToggle?: () => void;
};

function AuctionCardSidebar({
  state,
  bidMode,
  onBidModeChange,
  onPlaceBid,
  watched,
  onWatchToggle,
}: AuctionCardSidebarProps) {
  return (
    <VStack className={SIDEBAR_COLUMN_CLASS} data-variant="auction-card" gap="lg">
      <SidebarHeader onWatchToggle={onWatchToggle} watched={watched} />
      <AuctionBidCard
        bidMode={bidMode}
        onBidModeChange={onBidModeChange}
        onPlaceBid={onPlaceBid}
        state={state}
      />
      <LotDescription />
      <LotMeta state={state} />
    </VStack>
  );
}

export { AuctionCardSidebar };
