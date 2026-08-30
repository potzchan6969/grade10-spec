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
import { formatUsd } from "./format-usd";
import { ListingAutoBidReveal } from "./listing-auto-bid-reveal";
import { ListingCountdownDisplay } from "./listing-countdown-display";
import {
  ListingAutoBidControls,
  ListingManualBidControls,
} from "./listing-manual-bid-controls";
import { ListingRollingUsdDisplay } from "./listing-rolling-usd-display";
import type { ListingAuctionBidView } from "./types";

type ListingAuctionBidFieldsCopy = {
  auctionWon: string;
  paymentDue: string;
  paymentDueBody: string;
  payInvoice: string;
  didNotWin: string;
  cardRelease: string;
  outbid: string;
  highestBid: string;
  yourMaximum: string;
  opensIn: string;
  closed: string;
  timeLeftAutoExtended: string;
  autoExtendedTooltip: string;
  placeBidSection: string;
  placeBid: string;
  enableAutoBidding: string;
  autoBiddingTooltip: string;
  buyerFeeHint: string;
  bidCountZero: string;
};

type StandingBannerProps = {
  copy: ListingAuctionBidFieldsCopy;
  view: ListingAuctionBidView;
};

function StandingBanner({ copy, view }: StandingBannerProps) {
  if (view.standing === "won-payment-due") {
    return (
      <VStack
        className="w-full border-b border-border bg-muted/50 px-4 py-4"
        gap="sm"
      >
        <Badge variant="success">{copy.auctionWon}</Badge>
        <Text weight="medium">{copy.paymentDue}</Text>
        <Text size="sm" tone="secondary">
          {copy.paymentDueBody}
        </Text>
        <Button onClick={() => undefined}>{copy.payInvoice}</Button>
      </VStack>
    );
  }

  if (view.standing === "won-settled") {
    return <Badge variant="success">{copy.auctionWon}</Badge>;
  }

  if (view.standing === "lost") {
    return (
      <VStack
        className="w-full border-b border-border bg-muted/50 px-4 py-4"
        gap="xs"
      >
        <Badge variant="warning">{copy.didNotWin}</Badge>
        <Text size="sm" tone="secondary">
          {copy.cardRelease}
        </Text>
      </VStack>
    );
  }

  if (view.standing === "outbid") {
    return (
      <HStack
        className="w-full border-b border-border px-4 py-3"
        hAlign="space-between"
        vAlign="center"
      >
        <Text size="sm">
          {copy.yourMaximum}: {formatUsd(view.viewerMaximumMinor ?? 0)}
        </Text>
        <Badge variant="warning">{copy.outbid}</Badge>
      </HStack>
    );
  }

  if (view.standing === "leading-max") {
    return (
      <HStack
        className="w-full border-b border-border px-4 py-3"
        hAlign="space-between"
        vAlign="center"
      >
        <Text size="sm">
          {copy.yourMaximum}: {formatUsd(view.viewerMaximumMinor ?? 0)}
        </Text>
        <Badge variant="success">{copy.highestBid}</Badge>
      </HStack>
    );
  }

  if (view.standing === "leading-manual") {
    return (
      <div className="w-full border-b border-border px-4 py-3">
        <Badge variant="success">{copy.highestBid}</Badge>
      </div>
    );
  }

  return null;
}

type PriceBlockProps = {
  copy: ListingAuctionBidFieldsCopy;
  view: ListingAuctionBidView;
};

function PriceBlock({ copy, view }: PriceBlockProps) {
  return (
    <VStack gap="xs">
      <Text
        className="text-secondary-foreground"
        size="sm"
        tone="secondary"
        weight="medium"
      >
        {view.priceLabel}
      </Text>
      <Text as="p" className="text-2xl font-medium leading-8">
        {view.isUnsold ? (
          "Unsold"
        ) : (
          <ListingRollingUsdDisplay amountMinor={view.currentBidMinor} />
        )}
      </Text>
      {view.hasBids ? (
        <Text size="xs" tone="secondary">
          {view.bidCountLabel}
        </Text>
      ) : (
        <Text size="xs" tone="secondary">
          {copy.bidCountZero}
        </Text>
      )}
    </VStack>
  );
}

type TimeBlockProps = {
  copy: ListingAuctionBidFieldsCopy;
  view: ListingAuctionBidView;
};

function TimeBlock({ copy, view }: TimeBlockProps) {
  return (
    <VStack gap="xs">
      {view.opens ? (
        <Text
          className="text-secondary-foreground"
          size="sm"
          tone="secondary"
          weight="medium"
        >
          {copy.opensIn}
        </Text>
      ) : view.closed ? (
        <Text
          className="text-secondary-foreground"
          size="sm"
          tone="secondary"
          weight="medium"
        >
          {copy.closed}
        </Text>
      ) : (
        <HStack gap="xs" vAlign="center">
          <Text
            className="text-secondary-foreground"
            size="sm"
            tone="secondary"
            weight="medium"
          >
            {copy.timeLeftAutoExtended}
          </Text>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                aria-label={copy.autoExtendedTooltip}
                className="inline-flex shrink-0 cursor-pointer text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                render={<Info aria-hidden size={12} />}
              />
              <TooltipContent>{copy.autoExtendedTooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </HStack>
      )}
      <Text as="p" className="text-2xl font-medium leading-8">
        {view.countdownSeconds != null ? (
          <ListingCountdownDisplay
            format={view.countdownFormat}
            initialSeconds={view.countdownSeconds}
          />
        ) : (
          view.countdown
        )}
      </Text>
      {view.deadline ? (
        <Text size="xs" tone="secondary">
          {view.deadline}
        </Text>
      ) : null}
    </VStack>
  );
}

type BidActionsProps = {
  copy: ListingAuctionBidFieldsCopy;
  view: ListingAuctionBidView;
  bidMode: "manual" | "auto";
  onBidModeChange: (mode: "manual" | "auto") => void;
  onPlaceBid: () => void;
};

function BidActions({
  copy,
  view,
  bidMode,
  onBidModeChange,
  onPlaceBid,
}: BidActionsProps) {
  if (!view.showBidActions) return null;

  const autoBidEnabled = bidMode === "auto";
  const manualCopy = {
    bidAmountLabel: copy.placeBidSection,
    maximumLabel: copy.yourMaximum,
  };

  return (
    <VStack className="w-full" gap="md">
      <VStack gap="sm">
        <Text
          className="text-secondary-foreground"
          size="sm"
          tone="secondary"
          weight="medium"
        >
          {copy.placeBidSection}
        </Text>
        <HStack className="w-full" gap="sm" vAlign="start">
          <ListingManualBidControls
            copy={manualCopy}
            hideLabel
            incrementMinor={view.incrementMinor}
            minBidMinor={view.minBidMinor}
          />
          <Button className="shrink-0" onClick={onPlaceBid} size="md">
            {copy.placeBid}
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
            {copy.enableAutoBidding}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  aria-label={copy.autoBiddingTooltip}
                  className="inline-flex shrink-0 cursor-pointer text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  onPointerDown={(event) => event.preventDefault()}
                  render={<Info aria-hidden size={12} />}
                />
                <TooltipContent>{copy.autoBiddingTooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </CheckboxListInput>
        <ListingAutoBidReveal open={autoBidEnabled}>
          <ListingAutoBidControls
            copy={{ maximumLabel: copy.yourMaximum }}
            suggestedMaxMinor={view.suggestedMaxMinor}
          />
        </ListingAutoBidReveal>
      </VStack>

      <Text size="xs" tone="secondary">
        {copy.buyerFeeHint}
      </Text>
    </VStack>
  );
}

export type { ListingAuctionBidFieldsCopy };
export { BidActions, PriceBlock, StandingBanner, TimeBlock };
