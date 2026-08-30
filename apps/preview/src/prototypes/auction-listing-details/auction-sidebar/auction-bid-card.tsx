import { ChartLineUp } from "@phosphor-icons/react";
import { Card } from "@grade10/design-system/components/display/card";
import { StatusIndicator } from "@grade10/design-system/components/display/status-indicator";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { useEffect, useState } from "react";
import { BidHistoryList } from "../bid-history-list";
import {
  appendSimulatedBid,
  bidHistoryForState,
  stateMeta,
} from "../fixtures";
import { auctionHeaderLabel } from "../state-utils";
import type { BidHistoryRow, BidMode, BiddingState } from "../types";
import {
  BidActions,
  PriceBlock,
  TimeBlock,
} from "./shared-fields";

const LIVE_BID_INTERVAL_MS = 8_000;

type AuctionBidCardProps = {
  state: BiddingState;
  bidMode: BidMode;
  onBidModeChange: (mode: BidMode) => void;
  onPlaceBid: () => void;
};

function AuctionBidCard({
  state,
  bidMode,
  onBidModeChange,
  onPlaceBid,
}: AuctionBidCardProps) {
  const meta = stateMeta(state);
  const [history, setHistory] = useState<readonly BidHistoryRow[]>(() =>
    bidHistoryForState(state),
  );

  useEffect(() => {
    setHistory(bidHistoryForState(state));
  }, [state]);

  useEffect(() => {
    if (!meta.live) return;

    const timer = window.setInterval(() => {
      setHistory((rows) => {
        if (rows.length === 0) return rows;
        return appendSimulatedBid(rows);
      });
    }, LIVE_BID_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [meta.live]);

  return (
    <Card className="w-full gap-0" data-slot="auction-bid-card" padding={false}>
      <HStack
        className="w-full border-b border-border px-4 py-2"
        gap="sm"
        vAlign="center"
      >
        {meta.live ? (
          <LiveAuctionDot />
        ) : (
          <StatusIndicator variant="default" />
        )}
        <Text size="sm" weight="medium">
          {auctionHeaderLabel(state)}
        </Text>
      </HStack>

      <div className="grid w-full grid-cols-2 border-b border-border">
        <div className="border-r border-border px-4 py-3">
          <PriceBlock state={state} />
        </div>
        <div className="px-4 py-3">
          <TimeBlock state={state} />
        </div>
      </div>

      {history.length > 0 ? (
        <VStack
          className="max-h-56 w-full overflow-y-auto border-b border-border px-4 py-4"
          gap="sm"
        >
          <HStack gap="xs" vAlign="center">
            <ChartLineUp
              aria-hidden
              className="text-secondary-foreground"
              size={14}
            />
            <Text
              className="text-secondary-foreground"
              size="sm"
              tone="secondary"
              weight="medium"
            >
              Recent Bids
            </Text>
          </HStack>
          <BidHistoryList heading="" resetKey={state} rows={history} />
        </VStack>
      ) : null}


      <div className="px-4 py-4">
        <BidActions
          bidMode={bidMode}
          onBidModeChange={onBidModeChange}
          onPlaceBid={onPlaceBid}
          state={state}
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
      <span
        className="absolute size-2 rounded-full bg-success opacity-35 animate-ping motion-reduce:animate-none"
      />
      <span className="size-2 rounded-full bg-success" />
    </span>
  );
}

export { AuctionBidCard };
