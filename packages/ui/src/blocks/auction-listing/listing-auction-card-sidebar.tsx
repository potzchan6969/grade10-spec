import { VStack } from "@grade10/design-system/components/layout/vstack";
import { ListingAuctionBidCard } from "./listing-auction-bid-card";
import type { ListingAuctionBidCardCopy } from "./listing-auction-bid-card";
import { ListingLotMeta } from "./listing-lot-meta";
import type { ListingLotMetaCopy } from "./listing-lot-meta";
import { LISTING_LOT_SIDEBAR_CLASS } from "./listing-lot-layout";
import type { ListingAuctionBidView, ListingBidHistoryRow, ListingLotMetaBadge } from "./types";

type ListingAuctionCardSidebarCopy = ListingAuctionBidCardCopy & ListingLotMetaCopy;

type ListingAuctionCardSidebarProps = {
  copy: ListingAuctionCardSidebarCopy;
  view: ListingAuctionBidView;
  history: readonly ListingBidHistoryRow[];
  historyResetKey?: string;
  bidMode: "manual" | "auto";
  onBidModeChange: (mode: "manual" | "auto") => void;
  onPlaceBid: () => void;
  badges: readonly ListingLotMetaBadge[];
  description: string;
  showMoreHref?: string;
  vaultShippingBody: string;
  authenticationBody: string;
};

function ListingAuctionCardSidebar({
  copy,
  view,
  history,
  historyResetKey,
  bidMode,
  onBidModeChange,
  onPlaceBid,
  badges,
  description,
  showMoreHref,
  vaultShippingBody,
  authenticationBody,
}: ListingAuctionCardSidebarProps) {
  return (
    <VStack
      className={LISTING_LOT_SIDEBAR_CLASS}
      data-variant="auction-card"
      gap="lg"
    >
      <ListingAuctionBidCard
        bidMode={bidMode}
        copy={copy}
        history={history}
        historyResetKey={historyResetKey}
        onBidModeChange={onBidModeChange}
        onPlaceBid={onPlaceBid}
        view={view}
      />
      <ListingLotMeta
        authenticationBody={authenticationBody}
        badges={badges}
        copy={copy}
        description={description}
        resultFact={view.resultFact}
        showMoreHref={showMoreHref}
        vaultShippingBody={vaultShippingBody}
      />
    </VStack>
  );
}

export type { ListingAuctionCardSidebarCopy, ListingAuctionCardSidebarProps };
export { ListingAuctionCardSidebar };
