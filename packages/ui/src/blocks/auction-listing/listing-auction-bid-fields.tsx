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
  formatLocalMoment,
  type ShippedLocale,
} from "../../lib/format-datetime";
import { ListingCountdownDisplay } from "./listing-countdown-display";
import {
  ListingQuickMaximumBidActions,
  type ListingQuickMaximumBidActionsCopy,
  type MarketComps,
} from "./listing-quick-maximum-bid-actions";
import { ListingRollingMoneyDisplay } from "./listing-rolling-money-display";
import type { BidEnrollment, ListingAuctionBidView } from "./types";

type ListingAuctionBidFieldsCopy = ListingQuickMaximumBidActionsCopy & {
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
  /** Resolved copy naming this listing's extension window and duration. */
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

function StandingBanner({
  copy,
  view,
  bidEnrollment = "ready",
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

  if (view.standing === "leading-max" || view.standing === "leading-manual") {
    return <Badge variant="success">{copy.highestBid}</Badge>;
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
          "Unsold"
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
  bidEnrollment?: BidEnrollment;
  locale: ShippedLocale;
  marketComps?: MarketComps;
  onPlaceBid: () => void;
  onCommitMaximum: (amountMinor: number) => void;
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
  marketComps,
  onPlaceBid,
  onCommitMaximum,
}: BidActionsProps) {
  if (!view.showBidActions) return null;

  if (bidEnrollment === "signed-out") {
    return <SignedOutBidAction copy={copy} onPlaceBid={onPlaceBid} />;
  }

  return (
    <ListingQuickMaximumBidActions
      copy={copy}
      locale={locale}
      marketComps={marketComps}
      onCommitMaximum={onCommitMaximum}
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
