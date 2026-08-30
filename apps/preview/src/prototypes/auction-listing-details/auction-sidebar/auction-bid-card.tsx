import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import { StatusIndicator } from "@grade10/design-system/components/display/status-indicator";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { SVGProps } from "react";
import { BidHistoryList } from "../bid-history-list";
import { bidHistoryForState, stateMeta } from "../fixtures";
import { auctionHeaderLabel } from "../state-utils";
import type { BidMode, BiddingState } from "../types";
import {
  AutoBidControls,
  ManualBidControls,
} from "./manual-bid-controls";
import {
  BidActions,
  PriceBlock,
  StandingBanner,
  TimeBlock,
} from "./shared-fields";

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
  const history = bidHistoryForState(state);

  return (
    <Card className="w-full" data-slot="auction-bid-card" padding={false}>
      <HStack
        className="w-full border-b border-border px-4 py-2"
        hAlign="space-between"
        vAlign="center"
      >
        <HStack gap="sm" vAlign="center">
          <StatusIndicator
            variant={meta.live ? "brand" : "default"}
          />
          <Text size="sm" weight="medium">
            {auctionHeaderLabel(state)}
          </Text>
        </HStack>
        <Badge
          variant={
            meta.opens ? "info" : meta.closed ? "default" : "success"
          }
        >
          {meta.statusLabel}
        </Badge>
      </HStack>

      <div className="grid w-full grid-cols-2 border-b border-border">
        <div className="border-r border-border px-4 py-3">
          <PriceBlock state={state} />
        </div>
        <div className="px-4 py-3">
          <TimeBlock state={state} />
        </div>
      </div>

      <StandingBanner state={state} />

      {history.length > 0 ? (
        <VStack
          className="max-h-56 w-full overflow-y-auto border-b border-border px-4 py-4"
          gap="sm"
        >
          <HStack gap="xs" vAlign="center">
            <ChartLineUpIcon className="size-3.5 text-muted-foreground" />
            <Text size="sm" tone="secondary" weight="medium">
              Recent Bids
            </Text>
          </HStack>
          <BidHistoryList rows={history} heading="" />
        </VStack>
      ) : null}

      <div className="px-4 py-4">
        <BidActions
          bidMode={bidMode}
          onBidModeChange={onBidModeChange}
          onPlaceBid={onPlaceBid}
          state={state}
        >
          {bidMode === "manual" ? (
            <ManualBidControls state={state} />
          ) : (
            <AutoBidControls state={state} />
          )}
        </BidActions>
      </div>
    </Card>
  );
}

function ChartLineUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 256 256" {...props}>
      <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L89.86,98.12a8,8,0,0,1,10.3-.41l58.81,44.11L218.86,76a8,8,0,0,1,10.28,12.3l-64,56a8,8,0,0,1-10.29,0L96.14,117.23,40,163.31V200H224A8,8,0,0,1,232,208Z" />
    </svg>
  );
}

export { AuctionBidCard };
