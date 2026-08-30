import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";
import type { BiddingState } from "../types";
import { BUYER_FEE_HINT, LOT, stateMeta } from "../fixtures";
import { formatUsd, minNextBidMinor } from "../format-usd";

type StandingBannerProps = {
  state: BiddingState;
};

function StandingBanner({ state }: StandingBannerProps) {
  const meta = stateMeta(state);

  if (meta.isWinner && state === "closed-won-payment-due") {
    return (
      <VStack
        className="w-full border-b border-border bg-muted/50 px-4 py-4"
        gap="sm"
      >
        <Badge variant="success">Auction won</Badge>
        <Text weight="medium">Payment due</Text>
        <Text size="sm" tone="secondary">
          Please pay your invoice to complete this purchase.
        </Text>
        <Button onClick={() => undefined}>Pay Invoice</Button>
      </VStack>
    );
  }

  if (meta.isWinner && state === "closed-won-settled") {
    return <Badge variant="success">Auction won</Badge>;
  }

  if (meta.isLoser) {
    return (
      <VStack
        className="w-full border-b border-border bg-muted/50 px-4 py-4"
        gap="xs"
      >
        <Badge variant="warning">Did not win</Badge>
        <Text size="sm" tone="secondary">
          Your card authorization will be released.
        </Text>
      </VStack>
    );
  }

  if (meta.isOutbid) {
    return (
      <HStack
        className="w-full border-b border-border px-4 py-3"
        hAlign="space-between"
        vAlign="center"
      >
        <Text size="sm">Your maximum: {formatUsd(LOT.viewerMaximumMinor ?? 0)}</Text>
        <Badge variant="warning">Outbid</Badge>
      </HStack>
    );
  }

  if (meta.isLeading && meta.showMaximum) {
    return (
      <HStack
        className="w-full border-b border-border px-4 py-3"
        hAlign="space-between"
        vAlign="center"
      >
        <Text size="sm">Your maximum: {formatUsd(LOT.viewerMaximumMinor ?? 0)}</Text>
        <Badge variant="success">Highest bid</Badge>
      </HStack>
    );
  }

  if (meta.isLeading && state === "live-manual") {
    return (
      <div className="w-full border-b border-border px-4 py-3">
        <Badge variant="success">Highest bid</Badge>
      </div>
    );
  }

  return null;
}

type PriceBlockProps = {
  state: BiddingState;
};

function PriceBlock({ state }: PriceBlockProps) {
  const meta = stateMeta(state);

  return (
    <VStack gap="xs">
      <Text size="sm" tone="secondary" weight="medium">
        {meta.priceLabel}
      </Text>
      <Text as="p" className="text-xl font-medium leading-7">
        {meta.isUnsold ? "Unsold" : formatUsd(meta.currentBidMinor)}
      </Text>
      {meta.hasBids ? (
        <Text size="xs" tone="secondary">
          {meta.bidCount} bid{meta.bidCount === 1 ? "" : "s"}
        </Text>
      ) : (
        <Text size="xs" tone="secondary">
          0 bids
        </Text>
      )}
    </VStack>
  );
}

type TimeBlockProps = {
  state: BiddingState;
};

function TimeBlock({ state }: TimeBlockProps) {
  const meta = stateMeta(state);

  return (
    <VStack gap="xs">
      <Text size="sm" tone="secondary" weight="medium">
        {meta.opens ? "Opens in" : meta.closed ? "Closed" : "Time left"}
      </Text>
      <Text as="p" className="text-xl font-medium leading-7">
        {meta.countdown}
      </Text>
      {meta.deadline ? (
        <Text size="xs" tone="secondary">
          {meta.deadline}
        </Text>
      ) : null}
      {!meta.closed && !meta.opens ? (
        <Text size="xs" tone="secondary">Auto-extend</Text>
      ) : null}
    </VStack>
  );
}

type MinBidHintProps = {
  state: BiddingState;
};

function MinBidHint({ state }: MinBidHintProps) {
  const meta = stateMeta(state);
  if (!meta.showBidActions) return null;

  const min = minNextBidMinor(
    meta.currentBidMinor,
    LOT.incrementMinor,
    meta.hasBids,
    LOT.startingBidMinor,
  );

  return (
    <Text size="xs" tone="secondary">
      Min. bid: {formatUsd(min)} (current + {formatUsd(LOT.incrementMinor)})
    </Text>
  );
}

type BidActionsProps = {
  state: BiddingState;
  bidMode: "manual" | "auto";
  onBidModeChange: (mode: "manual" | "auto") => void;
  onPlaceBid: () => void;
  children?: ReactNode;
};

function BidActions({
  state,
  bidMode,
  onBidModeChange,
  onPlaceBid,
  children,
}: BidActionsProps) {
  const meta = stateMeta(state);
  if (!meta.showBidActions) return null;

  return (
    <VStack className="w-full" gap="sm">
      <HStack className="w-full" gap="sm">
        <Button
          onClick={() => onBidModeChange("manual")}
          size="sm"
          variant={bidMode === "manual" ? "default" : "outline"}
        >
          Manual
        </Button>
        <Button
          onClick={() => onBidModeChange("auto")}
          size="sm"
          variant={bidMode === "auto" ? "default" : "outline"}
        >
          Auto
        </Button>
      </HStack>
      {bidMode === "manual" ? (
        <HStack className="w-full" gap="sm" vAlign="end">
          {children}
          <Button className="shrink-0" onClick={onPlaceBid}>
            Place Bid
          </Button>
        </HStack>
      ) : (
        <>
          {children}
          <Button className="w-full" onClick={onPlaceBid}>
            Place Bid
          </Button>
        </>
      )}
      <MinBidHint state={state} />
      <Text size="xs" tone="secondary">{BUYER_FEE_HINT}</Text>
    </VStack>
  );
}

export {
  BidActions,
  MinBidHint,
  PriceBlock,
  StandingBanner,
  TimeBlock,
};
