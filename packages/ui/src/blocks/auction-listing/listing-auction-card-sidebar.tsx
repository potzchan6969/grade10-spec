import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";
import type { ShippedLocale } from "../../lib/format-datetime";
import type { ListingAuctionBidCardCopy } from "./listing-auction-bid-card";
import { ListingAuctionBidCard } from "./listing-auction-bid-card";
import { LISTING_LOT_SIDEBAR_CLASS } from "./listing-lot-layout";
import type {
  ListingLotMarketComps,
  ListingLotMetaCopy,
  ListingLotMetaFact,
} from "./listing-lot-meta";
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
  bidEnrollment?: BidEnrollment;
  onPlaceBid: () => void;
  onCommitMaximum: (amountMinor: number) => void;
  onCompletePurchase?: () => void;
  onViewOrderDetails?: () => void;
  badges: readonly ListingLotMetaBadge[];
  description: string;
  vaultShippingBody: string;
  recentBidsAccessory?: ReactNode;
  /** Renders directly under the bid card (e.g. linked payment method). */
  bidCardFooter?: ReactNode;
  facts?: readonly ListingLotMetaFact[];
  marketComps?: ListingLotMarketComps;
  locale: ShippedLocale;
  timeZone: string;
};

function ListingAuctionCardSidebar({
  copy,
  view,
  history,
  historyResetKey,
  bidEnrollment,
  onPlaceBid,
  onCommitMaximum,
  onCompletePurchase,
  onViewOrderDetails,
  badges,
  description,
  vaultShippingBody,
  recentBidsAccessory,
  bidCardFooter,
  facts,
  marketComps,
  locale,
  timeZone,
}: ListingAuctionCardSidebarProps) {
  return (
    <VStack
      className={LISTING_LOT_SIDEBAR_CLASS}
      data-variant="auction-card"
      gap="lg"
    >
      <VStack className="w-full" gap="sm">
        <ListingAuctionBidCard
          bidEnrollment={bidEnrollment}
          copy={copy}
          history={history}
          historyResetKey={historyResetKey}
          locale={locale}
          onCommitMaximum={onCommitMaximum}
          onCompletePurchase={onCompletePurchase}
          onPlaceBid={onPlaceBid}
          onViewOrderDetails={onViewOrderDetails}
          recentBidsAccessory={recentBidsAccessory}
          timeZone={timeZone}
          view={view}
        />
        {bidCardFooter ? <div className="mt-1">{bidCardFooter}</div> : null}
      </VStack>
      <ListingLotMeta
        badges={badges}
        copy={copy}
        description={description}
        facts={facts}
        marketComps={marketComps}
        vaultShippingBody={vaultShippingBody}
      />
    </VStack>
  );
}

export type { ListingAuctionCardSidebarCopy, ListingAuctionCardSidebarProps };
export { ListingAuctionCardSidebar };
