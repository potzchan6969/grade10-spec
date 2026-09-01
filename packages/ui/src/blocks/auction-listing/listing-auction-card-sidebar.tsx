import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";
import type { ShippedLocale } from "../../lib/format-datetime";
import type { ListingAuctionBidCardCopy } from "./listing-auction-bid-card";
import { ListingAuctionBidCard } from "./listing-auction-bid-card";
import { LISTING_LOT_SIDEBAR_CLASS } from "./listing-lot-layout";
import type { ListingLotMetaCopy } from "./listing-lot-meta";
import { ListingLotMeta } from "./listing-lot-meta";
import type {
  BidEnrollment,
  ListingAuctionBidView,
  ListingBidHistoryRow,
  ListingLotMetaBadge,
} from "./types";

type ListingAuctionCardSidebarCopy = ListingAuctionBidCardCopy &
  ListingLotMetaCopy;

type ListingAuctionCardSidebarProps = {
  copy: ListingAuctionCardSidebarCopy;
  view: ListingAuctionBidView;
  history: readonly ListingBidHistoryRow[];
  historyResetKey?: string;
  bidMode: "manual" | "auto";
  bidEnrollment?: BidEnrollment;
  onBidModeChange: (mode: "manual" | "auto") => void;
  onPlaceBid: () => void;
  onCommitMaximum: () => void;
  badges: readonly ListingLotMetaBadge[];
  description: string;
  showMoreHref?: string;
  vaultShippingBody: string;
  authenticationBody: string;
  recentBidsAccessory?: ReactNode;
  locale: ShippedLocale;
  timeZone: string;
};

function ListingAuctionCardSidebar({
  copy,
  view,
  history,
  historyResetKey,
  bidMode,
  bidEnrollment,
  onBidModeChange,
  onPlaceBid,
  onCommitMaximum,
  badges,
  description,
  showMoreHref,
  vaultShippingBody,
  authenticationBody,
  recentBidsAccessory,
  locale,
  timeZone,
}: ListingAuctionCardSidebarProps) {
  return (
    <VStack
      className={LISTING_LOT_SIDEBAR_CLASS}
      data-variant="auction-card"
      gap="lg"
    >
      <ListingAuctionBidCard
        bidEnrollment={bidEnrollment}
        bidMode={bidMode}
        copy={copy}
        history={history}
        historyResetKey={historyResetKey}
        locale={locale}
        onBidModeChange={onBidModeChange}
        onCommitMaximum={onCommitMaximum}
        onPlaceBid={onPlaceBid}
        recentBidsAccessory={recentBidsAccessory}
        timeZone={timeZone}
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
