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
import { useEffect, useState } from "react";
import {
  formatMinimumMaximumCaption,
  formatUsd,
  formatUsdNumeric,
  isMaximumBelowFloor,
  parseUsdInputToMinor,
  resolveMaximumFloor,
} from "./format-usd";
import { ListingAutoBidReveal } from "./listing-auto-bid-reveal";
import "./listing-bid-mode-stack.css";
import { ListingCountdownDisplay } from "./listing-countdown-display";
import {
  ListingAutoBidControls,
  ListingManualBidControls,
} from "./listing-manual-bid-controls";
import { ListingRollingUsdDisplay } from "./listing-rolling-usd-display";
import type { BidEnrollment, ListingAuctionBidView } from "./types";
import {
  formatCollectorDeadline,
  formatLocalMoment,
  type ShippedLocale,
} from "../../lib/format-datetime";

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
  setMaximumLabel: string;
  setMaximumCurrentLabel: string;
  opensIn: string;
  closed: string;
  timeLeft: string;
  timeLeftAutoExtended: string;
  autoExtendedTooltip: string;
  placeBidSection: string;
  placeBid: string;
  signInToBid: string;
  confirmMaximum: string;
  raiseMaximum: string;
  confirmMaximumTooltip: string;
  confirmMaximumAriaLabel: string;
  raiseMaximumAriaLabel: string;
  enableAutoBidding: string;
  autoBiddingTooltip: string;
  minimumMaximumFloor: string;
  minimumMaximumLeadingNudge: string;
  minimumMaximumLeadingIncrement: string;
  maximumBelowMinimum: string;
  buyerFeeHint: string;
  buyerFeeTooltip: string;
  noBidsYet: string;
  endsLabel: string;
  opensLabel: string;
  closedAt: string;
};

type StandingBannerProps = {
  copy: ListingAuctionBidFieldsCopy;
  view: ListingAuctionBidView;
  bidEnrollment?: BidEnrollment;
};

function viewerHasAuctionStanding(
  view: ListingAuctionBidView,
  bidEnrollment: BidEnrollment = "ready",
): boolean {
  if (bidEnrollment === "signed-out") return false;
  return view.standing !== "none";
}

function StandingBanner({ copy, view, bidEnrollment = "ready" }: StandingBannerProps) {
  if (!viewerHasAuctionStanding(view, bidEnrollment)) {
    return null;
  }

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
    return null;
  }

  if (view.standing === "leading-max") {
    return null;
  }

  if (view.standing === "leading-manual") {
    return null;
  }

  return null;
}

function StandingStatusBadge({
  copy,
  view,
  bidEnrollment = "ready",
}: {
  copy: ListingAuctionBidFieldsCopy;
  view: ListingAuctionBidView;
  bidEnrollment?: BidEnrollment;
}) {
  if (!viewerHasAuctionStanding(view, bidEnrollment)) {
    return null;
  }

  if (view.standing === "outbid") {
    return <Badge variant="warning">{copy.outbid}</Badge>;
  }

  if (
    view.standing === "leading-max" ||
    view.standing === "leading-manual"
  ) {
    return <Badge variant="success">{copy.highestBid}</Badge>;
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
          {copy.noBidsYet}
        </Text>
      )}
    </VStack>
  );
}

type TimeBlockProps = {
  copy: ListingAuctionBidFieldsCopy;
  view: ListingAuctionBidView;
  locale: ShippedLocale;
  timeZone: string;
};

function formatCollectorDeadlineLine(
  view: ListingAuctionBidView,
  copy: ListingAuctionBidFieldsCopy,
  locale: ShippedLocale,
  timeZone: string,
): string | undefined {
  const at = view.deadlineAtMs;
  if (at == null) return view.deadline;

  if (view.opens) {
    return formatCollectorDeadline(at, {
      locale,
      timeZone,
      prefix: copy.opensLabel,
    });
  }

  if (view.closed) {
    return undefined;
  }

  return formatCollectorDeadline(at, {
    locale,
    timeZone,
    prefix: copy.endsLabel,
  });
}

function TimeBlock({ copy, view, locale, timeZone }: TimeBlockProps) {
  const deadlineLine = formatCollectorDeadlineLine(
    view,
    copy,
    locale,
    timeZone,
  );
  const closedCountdown =
    view.closed && view.deadlineAtMs != null
      ? formatLocalMoment(view.deadlineAtMs, { locale, timeZone })
      : view.countdown;

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
            {view.extended ? copy.timeLeftAutoExtended : copy.timeLeft}
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
            closesAtMs={view.closesAtMs}
            format={view.countdownFormat}
            initialSeconds={view.countdownSeconds}
          />
        ) : (
          closedCountdown
        )}
      </Text>
      {deadlineLine ? (
        <Text size="xs" tone="secondary">
          {deadlineLine}
        </Text>
      ) : null}
    </VStack>
  );
}

type BidActionsProps = {
  copy: ListingAuctionBidFieldsCopy;
  view: ListingAuctionBidView;
  bidMode: "manual" | "auto";
  bidEnrollment?: BidEnrollment;
  onBidModeChange: (mode: "manual" | "auto") => void;
  onPlaceBid: () => void;
  onCommitMaximum: () => void;
};

function SignedOutBidAction({
  copy,
  onPlaceBid,
}: {
  copy: ListingAuctionBidFieldsCopy;
  onPlaceBid: () => void;
}) {
  return (
    <Button className="w-full" onClick={onPlaceBid} size="md">
      {copy.signInToBid}
    </Button>
  );
}

function BidActions({
  copy,
  view,
  bidMode,
  bidEnrollment = "ready",
  onBidModeChange,
  onPlaceBid,
  onCommitMaximum,
}: BidActionsProps) {
  const autoBidEnabled = bidMode === "auto";
  const hasCommittedMaximum = view.viewerMaximumMinor != null;
  const maximumFloor = resolveMaximumFloor({
    minBidMinor: view.minBidMinor,
    incrementMinor: view.incrementMinor,
    viewerMaximumMinor: view.viewerMaximumMinor,
    standing: view.standing,
    currentBidMinor: view.currentBidMinor,
  });
  const floorMaximumMinor = maximumFloor.floorMinor;
  const defaultMaximumMinor = hasCommittedMaximum
    ? floorMaximumMinor
    : view.suggestedMaxMinor;
  const [maximumInput, setMaximumInput] = useState(() =>
    formatUsdNumeric(defaultMaximumMinor),
  );
  const [maximumFieldTouched, setMaximumFieldTouched] = useState(false);

  useEffect(() => {
    if (!autoBidEnabled) return;
    setMaximumInput(formatUsdNumeric(defaultMaximumMinor));
    setMaximumFieldTouched(false);
  }, [autoBidEnabled, defaultMaximumMinor]);

  if (!view.showBidActions) return null;

  if (bidEnrollment === "signed-out") {
    return (
      <SignedOutBidAction copy={copy} onPlaceBid={onPlaceBid} />
    );
  }

  const maximumMinor = parseUsdInputToMinor(maximumInput);
  const maximumInvalid = isMaximumBelowFloor(maximumMinor, floorMaximumMinor);
  const showMaximumError = maximumFieldTouched && maximumInvalid;
  const disableMaximumButton = maximumFieldTouched && maximumInvalid;
  const maximumHelperMessage = formatMinimumMaximumCaption(
    maximumFloor,
    copy,
    view.incrementMinor,
  );
  const maximumMessage = showMaximumError
    ? copy.maximumBelowMinimum.replace("{amount}", formatUsd(floorMaximumMinor))
    : maximumHelperMessage;
  const maximumFieldLabel = hasCommittedMaximum
    ? copy.setMaximumCurrentLabel.replace(
        "{amount}",
        formatUsd(view.viewerMaximumMinor ?? 0),
      )
    : copy.setMaximumLabel;

  function handleCommitMaximum() {
    if (maximumInvalid) {
      setMaximumFieldTouched(true);
      return;
    }
    onCommitMaximum();
  }

  const manualCopy = {
    bidAmountLabel: copy.placeBidSection,
    maximumLabel: copy.yourMaximum,
  };
  const autoCopy = {
    maximumLabel: maximumFieldLabel,
  };

  return (
    <VStack className="w-full" gap="sm">
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

      <div className="bid-mode-stack w-full">
        <ListingAutoBidReveal open={!autoBidEnabled}>
          <VStack className="w-full" gap="sm">
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
                key={`manual-${view.minBidMinor}`}
                minBidMinor={view.minBidMinor}
              />
              <Button className="shrink-0" onClick={onPlaceBid} size="md">
                {copy.placeBid}
              </Button>
            </HStack>
          </VStack>
        </ListingAutoBidReveal>

        <ListingAutoBidReveal open={autoBidEnabled}>
          <VStack className="w-full" gap="sm">
            <HStack gap="xs" vAlign="center">
              <Text
                className="text-secondary-foreground"
                size="sm"
                tone="secondary"
                weight="medium"
              >
                {maximumFieldLabel}
              </Text>
              {!hasCommittedMaximum ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      aria-label={copy.confirmMaximumTooltip}
                      className="inline-flex shrink-0 cursor-pointer text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      onPointerDown={(event) => event.preventDefault()}
                      render={<Info aria-hidden size={12} />}
                    />
                    <TooltipContent>
                      {copy.confirmMaximumTooltip}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
            </HStack>
            <HStack className="w-full" gap="sm" vAlign="start">
              <ListingAutoBidControls
                copy={autoCopy}
                hideLabel
                message={maximumMessage}
                minMaximumMinor={floorMaximumMinor}
                onBlur={() => setMaximumFieldTouched(true)}
                onValueChange={setMaximumInput}
                status={showMaximumError ? "error" : "default"}
                value={maximumInput}
              />
              <Button
                aria-label={
                  hasCommittedMaximum
                    ? copy.raiseMaximumAriaLabel
                    : copy.confirmMaximumAriaLabel
                }
                className="shrink-0"
                disabled={disableMaximumButton}
                onClick={handleCommitMaximum}
                size="md"
              >
                {hasCommittedMaximum ? copy.raiseMaximum : copy.confirmMaximum}
              </Button>
            </HStack>
          </VStack>
        </ListingAutoBidReveal>
      </div>
    </VStack>
  );
}

function BuyerFeeHint({
  copy,
}: {
  copy: Pick<ListingAuctionBidFieldsCopy, "buyerFeeHint" | "buyerFeeTooltip">;
}) {
  return (
    <HStack gap="xs" vAlign="center">
      <Text size="xs" tone="secondary">
        {copy.buyerFeeHint}
      </Text>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            aria-label={copy.buyerFeeTooltip}
            className="inline-flex shrink-0 cursor-pointer text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            render={<Info aria-hidden size={12} />}
          />
          <TooltipContent>{copy.buyerFeeTooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </HStack>
  );
}

export type { ListingAuctionBidFieldsCopy };
export { BidActions, BuyerFeeHint, PriceBlock, StandingBanner, StandingStatusBadge, TimeBlock };
