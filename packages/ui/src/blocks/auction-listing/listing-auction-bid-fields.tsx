import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { Info } from "@phosphor-icons/react";
import {
  formatCollectorDeadline,
  formatLocalDay,
  formatLocalMoment,
  formatLocalTime,
  type ShippedLocale,
} from "../../lib/format-datetime";
import { formatMoney } from "../../lib/format-money";
import {
  elapsedDurationParts,
  formatAccessibleText,
} from "./listing-countdown-digit";
import { ListingCountdownDisplay } from "./listing-countdown-display";
import {
  type BidAuthorizationStatus,
  ListingQuickMaximumBidActions,
  type ListingQuickMaximumBidActionsCopy,
} from "./listing-quick-maximum-bid-actions";
import { ListingRollingMoneyDisplay } from "./listing-rolling-money-display";
import type { BidEnrollment, ListingAuctionBidView } from "./types";

type ListingAuctionBidFieldsCopy = ListingQuickMaximumBidActionsCopy & {
  auctionWon: string;
  /** Title when the win still needs shipping and payment choices. */
  completePurchase: string;
  /** Supporting line under `completePurchase`. */
  completePurchaseBody: string;
  /** CTA into shipping and payment confirmation. */
  completePurchaseAction: string;
  /** Title when the win is paid and fulfilment is in progress or complete. */
  paid: string;
  /** Supporting line under `paid`, e.g. track shipping and delivery. */
  paidBody: string;
  /** CTA into order / delivery status for a paid win. */
  viewOrderDetails: string;
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
  /** Resolved copy naming this listing's extended-bidding duration (and cap). */
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
  /**
   * Closed-lot subtext with clock and duration, e.g.
   * "Closed at {time}. Ran {duration}".
   */
  closedSummary: string;
  /**
   * Result amount when the lot closed with no winner. Collector-facing copy
   * is Ended (external lot status); the internal status remains Unsold.
   */
  unsold: string;
};

type StandingBannerProps = {
  copy: ListingAuctionBidFieldsCopy;
  view: ListingAuctionBidView;
  bidEnrollment?: BidEnrollment;
  onCompletePurchase?: () => void;
  onViewOrderDetails?: () => void;
};

function viewerHasAuctionStanding(
  view: ListingAuctionBidView,
  bidEnrollment: BidEnrollment = "ready",
): boolean {
  if (bidEnrollment === "signed-out") return false;
  return view.standing !== "none";
}

function StandingBanner({
  copy,
  view,
  bidEnrollment = "ready",
  onCompletePurchase,
  onViewOrderDetails,
}: StandingBannerProps) {
  if (!viewerHasAuctionStanding(view, bidEnrollment)) {
    return null;
  }

  if (view.standing === "won-payment-due") {
    return (
      <VStack
        className="w-full border-b border-border bg-muted/50 px-4 py-4"
        gap="sm"
      >
        <VStack className="w-full gap-0.5" gap="none">
          <Text weight="medium">{copy.completePurchase}</Text>
          <Text
            className="text-secondary-foreground"
            size="sm"
            tone="secondary"
          >
            {copy.completePurchaseBody}
          </Text>
        </VStack>
        <Button onClick={onCompletePurchase} size="md">
          {copy.completePurchaseAction}
        </Button>
      </VStack>
    );
  }

  if (view.standing === "won-settled") {
    return (
      <VStack
        className="w-full border-b border-border bg-muted/50 px-4 py-4"
        gap="sm"
      >
        <VStack className="w-full gap-0.5" gap="none">
          <Text weight="medium">{copy.paid}</Text>
          <Text
            className="text-secondary-foreground"
            size="sm"
            tone="secondary"
          >
            {copy.paidBody}
          </Text>
        </VStack>
        <Button onClick={onViewOrderDetails} size="md">
          {copy.viewOrderDetails}
        </Button>
      </VStack>
    );
  }

  if (view.standing === "lost") {
    return (
      <VStack
        className="w-full border-b border-border bg-muted/50 px-4 py-4"
        gap="xs"
      >
        <Text size="sm" tone="secondary" className="text-secondary-foreground">
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
  locale,
  bidEnrollment = "ready",
}: {
  copy: ListingAuctionBidFieldsCopy;
  view: ListingAuctionBidView;
  locale: ShippedLocale;
  bidEnrollment?: BidEnrollment;
}) {
  if (!viewerHasAuctionStanding(view, bidEnrollment)) {
    return null;
  }

  if (view.standing === "outbid") {
    const outbidAmountMinor = view.viewerMaximumMinor;
    return (
      <Badge variant="warning">
        {outbidAmountMinor != null
          ? `${copy.outbid} · ${formatMoney(outbidAmountMinor, view.currency, { locale })}`
          : copy.outbid}
      </Badge>
    );
  }

  if (view.standing === "leading-max" || view.standing === "leading-manual") {
    return (
      <Badge variant="success">
        {`${copy.highestBid} · ${formatMoney(view.currentBidMinor, view.currency, { locale })}`}
      </Badge>
    );
  }

  if (view.standing === "won-payment-due" || view.standing === "won-settled") {
    return <Badge variant="success">{copy.auctionWon}</Badge>;
  }

  if (view.standing === "lost") {
    return <Badge variant="warning">{copy.didNotWin}</Badge>;
  }

  return null;
}

type PriceBlockProps = {
  copy: ListingAuctionBidFieldsCopy;
  view: ListingAuctionBidView;
  locale: ShippedLocale;
};

function PriceBlock({ copy, view, locale }: PriceBlockProps) {
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
          copy.unsold
        ) : (
          <ListingRollingMoneyDisplay
            amountMinor={view.currentBidMinor}
            currency={view.currency}
            locale={locale}
          />
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
  const closedDay =
    view.closed && view.deadlineAtMs != null
      ? formatLocalDay(view.deadlineAtMs, { locale, timeZone })
      : null;
  const closedTime =
    view.closed && view.deadlineAtMs != null
      ? formatLocalTime(view.deadlineAtMs, { locale, timeZone })
      : null;
  const ranDuration =
    view.closed && view.opensAtMs != null && view.deadlineAtMs != null
      ? formatAccessibleText(
          elapsedDurationParts(
            Math.max(
              0,
              Math.floor((view.deadlineAtMs - view.opensAtMs) / 1000),
            ),
          ),
        )
      : null;
  const closedSubtext =
    closedTime != null && ranDuration != null
      ? copy.closedSummary
          .replace("{time}", closedTime)
          .replace("{duration}", ranDuration)
      : null;
  const closedPrimary =
    closedDay ??
    (view.deadlineAtMs != null
      ? formatLocalMoment(view.deadlineAtMs, { locale, timeZone })
      : view.countdown);

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
          closedPrimary
        )}
      </Text>
      {view.closed && closedSubtext != null ? (
        <Text size="xs" tone="secondary">
          {closedSubtext}
        </Text>
      ) : deadlineLine ? (
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
  bidEnrollment?: BidEnrollment;
  locale: ShippedLocale;
  onPlaceBid: () => void;
  onCommitMaximum: (amountMinor: number) => void;
  authorizationStatus?: BidAuthorizationStatus;
  authorizationMessage?: string;
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
  bidEnrollment = "ready",
  locale,
  onPlaceBid,
  onCommitMaximum,
  authorizationStatus,
  authorizationMessage,
}: BidActionsProps) {
  if (!view.showBidActions) return null;

  if (bidEnrollment === "signed-out") {
    return <SignedOutBidAction copy={copy} onPlaceBid={onPlaceBid} />;
  }

  return (
    <ListingQuickMaximumBidActions
      amountEntryLocked={bidEnrollment === "needs-card"}
      authorizationMessage={authorizationMessage}
      authorizationStatus={authorizationStatus}
      copy={copy}
      locale={locale}
      onCommitMaximum={onCommitMaximum}
      onLinkCard={bidEnrollment === "needs-card" ? onPlaceBid : undefined}
      view={view}
    />
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
export {
  BidActions,
  BuyerFeeHint,
  PriceBlock,
  StandingBanner,
  StandingStatusBadge,
  TimeBlock,
};
