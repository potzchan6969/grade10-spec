import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { Info } from "@phosphor-icons/react";
import type { BiddingState } from "../types";
import {
  AUTO_BIDDING_TOOLTIP,
  BUYER_FEE_HINT,
  LOT,
  stateMeta,
} from "../fixtures";
import { formatUsd } from "../format-usd";
import { RollingUsdDisplay } from "../rolling-usd-display";
import { CountdownDisplay } from "../countdown-display";
import { AutoBidReveal } from "../auto-bid-reveal";
import {
  AutoBidControls,
  ManualBidControls,
} from "./manual-bid-controls";

const AUTO_EXTENDED_TOOLTIP =
  "Bids placed in the final 30 minutes extend the auction by 30 minutes.";

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
      <Text
        className="text-secondary-foreground"
        size="sm"
        tone="secondary"
        weight="medium"
      >
        {meta.priceLabel}
      </Text>
      <Text as="p" className="text-2xl font-medium leading-8">
        {meta.isUnsold ? (
          "Unsold"
        ) : (
          <RollingUsdDisplay amountMinor={meta.currentBidMinor} />
        )}
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
      {meta.opens ? (
        <Text
          className="text-secondary-foreground"
          size="sm"
          tone="secondary"
          weight="medium"
        >
          Opens in
        </Text>
      ) : meta.closed ? (
        <Text
          className="text-secondary-foreground"
          size="sm"
          tone="secondary"
          weight="medium"
        >
          Closed
        </Text>
      ) : (
        <HStack gap="xs" vAlign="center">
          <Text
            className="text-secondary-foreground"
            size="sm"
            tone="secondary"
            weight="medium"
          >
            Time left (auto-extended)
          </Text>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                aria-label="Auto-extended bidding rules"
                className="inline-flex shrink-0 cursor-pointer text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                render={<Info aria-hidden size={12} />}
              />
              <TooltipContent>{AUTO_EXTENDED_TOOLTIP}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </HStack>
      )}
      <Text as="p" className="text-2xl font-medium leading-8">
        {meta.countdownSeconds != null ? (
          <CountdownDisplay
            format={meta.countdownFormat}
            initialSeconds={meta.countdownSeconds}
          />
        ) : (
          meta.countdown
        )}
      </Text>
      {meta.deadline ? (
        <Text size="xs" tone="secondary">
          {meta.deadline}
        </Text>
      ) : null}
    </VStack>
  );
}

type BidActionsProps = {
  state: BiddingState;
  bidMode: "manual" | "auto";
  onBidModeChange: (mode: "manual" | "auto") => void;
  onPlaceBid: () => void;
};

function BidActions({
  state,
  bidMode,
  onBidModeChange,
  onPlaceBid,
}: BidActionsProps) {
  const meta = stateMeta(state);
  if (!meta.showBidActions) return null;

  const autoBidEnabled = bidMode === "auto";

  return (
    <VStack className="w-full" gap="md">
      <VStack gap="sm">
        <Text
          className="text-secondary-foreground"
          size="sm"
          tone="secondary"
          weight="medium"
        >
          Place a bid
        </Text>
        <HStack className="w-full" gap="sm" vAlign="start">
          <ManualBidControls hideLabel state={state} />
          <Button className="shrink-0" onClick={onPlaceBid} size="md">
            Place Bid
          </Button>
        </HStack>
      </VStack>

      <VStack gap="sm">
        <CheckboxListInput
          checked={autoBidEnabled}
          onCheckedChange={(next) =>
            onBidModeChange(next === true ? "auto" : "manual")
          }
          size="sm"
        >
          <span className="inline-flex min-w-0 flex-1 items-center gap-1">
            Enable auto-bidding
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  aria-label="Auto-bidding rules"
                  className="inline-flex shrink-0 cursor-pointer text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  onPointerDown={(event) => event.preventDefault()}
                  render={<Info aria-hidden size={12} />}
                />
                <TooltipContent>{AUTO_BIDDING_TOOLTIP}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </CheckboxListInput>
        <AutoBidReveal open={autoBidEnabled}>
          <AutoBidControls state={state} />
        </AutoBidReveal>
      </VStack>

      <Text size="xs" tone="secondary">{BUYER_FEE_HINT}</Text>
    </VStack>
  );
}

export {
  BidActions,
  PriceBlock,
  StandingBanner,
  TimeBlock,
};
