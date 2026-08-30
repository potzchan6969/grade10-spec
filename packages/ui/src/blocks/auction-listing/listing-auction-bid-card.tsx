import { Card } from "@grade10/design-system/components/display/card";
import { StatusIndicator } from "@grade10/design-system/components/display/status-indicator";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { ChartLineUp } from "@phosphor-icons/react";
import {
  BidActions,
  type ListingAuctionBidFieldsCopy,
  PriceBlock,
  StandingBanner,
  TimeBlock,
} from "./listing-auction-bid-fields";
import { ListingBidHistoryList } from "./listing-bid-history-list";
import type { ListingAuctionBidView, ListingBidHistoryRow } from "./types";

type ListingAuctionBidCardCopy = ListingAuctionBidFieldsCopy & {
  recentBids: string;
  bidHistory: {
    leading?: string;
    you?: string;
    empty?: string;
  };
};

type ListingAuctionBidCardProps = {
  copy: ListingAuctionBidCardCopy;
  view: ListingAuctionBidView;
  history: readonly ListingBidHistoryRow[];
  historyResetKey?: string;
  bidMode: "manual" | "auto";
  onBidModeChange: (mode: "manual" | "auto") => void;
  onPlaceBid: () => void;
};

function ListingAuctionBidCard({
  copy,
  view,
  history,
  historyResetKey,
  bidMode,
  onBidModeChange,
  onPlaceBid,
}: ListingAuctionBidCardProps) {
  return (
    <Card
      className="w-full gap-0"
      data-slot="listing-auction-bid-card"
      padding={false}
    >
      <HStack
        className="w-full border-b border-border px-4 py-2"
        gap="sm"
        vAlign="center"
      >
        {view.live ? <LiveAuctionDot /> : <StatusIndicator variant="default" />}
        <Text size="sm" weight="medium">
          {view.headerLabel}
        </Text>
      </HStack>

      <StandingBanner copy={copy} view={view} />

      <div className="grid w-full grid-cols-2 border-b border-border">
        <div className="border-r border-border px-4 py-3">
          <PriceBlock copy={copy} view={view} />
        </div>
        <div className="px-4 py-3">
          <TimeBlock copy={copy} view={view} />
        </div>
      </div>

      {history.length > 0 ? (
        <VStack
          className="max-h-56 w-full overflow-y-auto border-b border-border px-4 py-4"
          gap="sm"
        >
          <HStack gap="xs" vAlign="center">
            <span className="text-secondary-foreground">
              <ChartLineUp aria-hidden size={14} />
            </span>
            <Text
              className="text-secondary-foreground"
              size="sm"
              tone="secondary"
              weight="medium"
            >
              {copy.recentBids}
            </Text>
          </HStack>
          <ListingBidHistoryList
            copy={copy.bidHistory}
            heading=""
            resetKey={historyResetKey}
            rows={history}
          />
        </VStack>
      ) : null}

      <div className="px-4 py-4">
        <BidActions
          bidMode={bidMode}
          copy={copy}
          onBidModeChange={onBidModeChange}
          onPlaceBid={onPlaceBid}
          view={view}
        />
      </div>
    </Card>
  );
}

function LiveAuctionDot() {
  return (
    <span
      aria-hidden
      className="relative flex size-4 shrink-0 items-center justify-center"
    >
      <span className="absolute size-2 rounded-full bg-success opacity-35 animate-ping motion-reduce:animate-none" />
      <span className="size-2 rounded-full bg-success" />
    </span>
  );
}

export type { ListingAuctionBidCardCopy, ListingAuctionBidCardProps };
export { ListingAuctionBidCard };
