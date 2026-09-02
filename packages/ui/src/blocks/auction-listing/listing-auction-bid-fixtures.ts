import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_AUCTION_CLOSED_AT_MS,
  FIXTURE_AUCTION_ENDS_AT_MS,
  FIXTURE_AUCTION_OPENS_AT_MS,
} from "../../lib/datetime-fixtures";
import { formatMoney } from "../../lib/format-money";
import {
  DEFAULT_LISTING_CURRENCY,
  minNextBidMinor,
} from "./listing-bid-money";
import type { ListingAgeVerificationDialogCopy } from "./listing-age-verification-dialog";
import type { ListingAuctionBidCardCopy } from "./listing-auction-bid-card";
import {
  DEFAULT_LISTING_EXTENSION_POLICY,
  formatAutoExtendedTooltip,
} from "./listing-extension-policy";
import type {
  ListingAuctionBidView,
  ListingAuctionStanding,
  ListingBidHistoryRow,
  ListingUserBidHistoryRow,
} from "./types";

export type BiddingState =
  | "opens"
  | "live-no-bids"
  | "live-manual"
  | "live-auto-leading"
  | "live-auto-outbid"
  | "closed-sold"
  | "closed-won-payment-due"
  | "closed-won-settled"
  | "closed-lost"
  | "closed-unsold";

export type BidMode = "manual" | "auto";

export type AuctionTiming = {
  closesAtMs: number;
  extended: boolean;
};

export const BIDDING_STATE_LABELS: Record<BiddingState, string> = {
  opens: "Opens (pre-auction)",
  "live-no-bids": "Live — no bids",
  "live-manual": "Live — manual",
  "live-auto-leading": "Live — auto leading",
  "live-auto-outbid": "Live — auto outbid",
  "closed-sold": "Closed — sold",
  "closed-won-payment-due": "Closed — won payment due",
  "closed-won-settled": "Closed — won settled",
  "closed-lost": "Closed — lost",
  "closed-unsold": "Closed — unsold",
};

/** Numeric lot facts shared by bid-card fixtures and preview page content. */
export const BID_FIXTURE_LOT = {
  currency: DEFAULT_LISTING_CURRENCY,
  startingBidMinor: 120_000,
  currentBidMinor: 480_000,
  incrementMinor: 25_000,
  bidCount: 6,
  viewerMaximumMinor: 800_000,
} as const;

const FIXTURE_LOCALE = "en-HK";

function fixtureAmount(minor: number): string {
  return formatMoney(minor, BID_FIXTURE_LOT.currency, {
    locale: FIXTURE_LOCALE,
  });
}

const DAY_SECONDS = 24 * 60 * 60;
const HOUR_SECONDS = 60 * 60;
const VIEWER_INITIALS = "john@example.com";

function msAgo(minutes: number, nowMs = Date.now()): number {
  return nowMs - minutes * 60_000;
}

const BID_HISTORY: ListingBidHistoryRow[] = [
  {
    id: "bid-john-480",
    initials: VIEWER_INITIALS,
    amountMinor: 480_000,
    acceptedAtMs: msAgo(2),
    isViewer: true,
  },
  {
    id: "bid-mike-455",
    initials: "mike@example.com",
    amountMinor: 455_000,
    acceptedAtMs: msAgo(6),
  },
  {
    id: "bid-alex-430",
    initials: "alex@example.com",
    amountMinor: 430_000,
    acceptedAtMs: msAgo(12),
  },
];

export const LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY = {
  recentBids: "Recent Bids",
  bidHistory: {
    you: "You",
    empty: "No bids yet",
  },
  auctionWon: "Auction won",
  paymentDue: "Payment due",
  paymentDueBody: "Please pay your invoice to complete this purchase.",
  payInvoice: "Pay Invoice",
  didNotWin: "Did not win",
  cardRelease: "Your card authorization will be released.",
  outbid: "Outbid",
  highestBid: "Highest bid",
  yourMaximum: "Your maximum",
  setMaximumLabel: "Set maximum",
  setMaximumCurrentLabel: "Set maximum (current: {amount})",
  opensIn: "Opens in",
  closed: "Closed",
  timeLeft: "Time left",
  timeLeftAutoExtended: "Time left (auto-extended)",
  autoExtendedTooltip: formatAutoExtendedTooltip(
    DEFAULT_LISTING_EXTENSION_POLICY,
  ),
  placeBidSection: "Place bid",
  placeBid: "Place Bid",
  signInToBid: "Sign In to Bid",
  confirmMaximum: "Confirm",
  raiseMaximum: "Raise",
  confirmMaximumTooltip:
    "The most we’ll bid for you. Authorizes a card hold for this amount—you may pay less if the auction ends below it.",
  confirmMaximumAriaLabel: "Confirm Maximum",
  raiseMaximumAriaLabel: "Raise Maximum",
  enableAutoBidding: "Enable auto-bidding",
  autoBiddingTooltip:
    "We bid for you as needed, up to your maximum. Your card hold matches that amount—you may pay less if the auction ends below it.",
  minimumMaximumFloor: "At least {amount} (current bid + {increment})",
  minimumMaximumLeadingNudge: "At least {amount} (your maximum + {increment})",
  minimumMaximumLeadingIncrement:
    "At least {amount} (your maximum + {increment})",
  maximumBelowMinimum: "Enter at least {amount}",
  buyerFeeHint: "Buyer fee is added on top of the winning bid",
  buyerFeeTooltip:
    "Winners pay a percentage of the hammer price as a buyer fee. The rate is confirmed at checkout.",
  noBidsYet: "No bids yet",
  endsLabel: "Ends",
  opensLabel: "Opens",
  closedAt: "Closed {when}",
  activityTimeCopy: FIXTURE_ACTIVITY_TIME_COPY,
} satisfies Omit<
  ListingAuctionBidCardCopy,
  "aboutThisLot" | "vaultShipping" | "authentication" | "result" | "showMore"
>;

export const LISTING_AUCTION_BID_AGE_VERIFICATION_COPY = {
  title: "Confirm your age",
  body: "You must be 18 or older to bid. Enter your date of birth to continue.",
  monthPlaceholder: "Month",
  dayPlaceholder: "Day",
  yearPlaceholder: "Year",
  birthMonthLabel: "Birth month",
  birthDayLabel: "Birth day",
  birthYearLabel: "Birth year",
  underAgeError: "You must be 18 or older to bid.",
  cancel: "Cancel",
  confirm: "Confirm",
} satisfies ListingAgeVerificationDialogCopy;

function formatBidCountLabel(count: number): string {
  return count === 1 ? `${count} bid` : `${count} bids`;
}

export function remainingSecondsUntil(
  closesAtMs: number,
  nowMs = Date.now(),
): number {
  return Math.max(0, Math.floor((closesAtMs - nowMs) / 1000));
}

export function stateMeta(state: BiddingState) {
  const closed = state.startsWith("closed");
  const live = state.startsWith("live");
  const opens = state === "opens";

  return {
    closed,
    live,
    opens,
    hasBids: state !== "live-no-bids" && state !== "closed-unsold" && !opens,
    showBidActions: live,
    isUnsold: state === "closed-unsold",
    priceLabel: opens
      ? "Starting bid"
      : closed
        ? state === "closed-unsold"
          ? "Result"
          : "Winning bid"
        : "Current Bid",
    countdown: closed ? "Closed" : opens ? "2D 4H 12M 0S" : "6m 9s",
    countdownSeconds: closed
      ? null
      : opens
        ? 2 * DAY_SECONDS + 4 * HOUR_SECONDS + 12 * 60
        : 6 * 60 + 9,
    countdownFormat: opens ? ("long" as const) : ("short" as const),
    deadlineAtMs: closed
      ? FIXTURE_AUCTION_CLOSED_AT_MS
      : opens
        ? FIXTURE_AUCTION_OPENS_AT_MS
        : FIXTURE_AUCTION_ENDS_AT_MS,
    currentBidMinor:
      state === "closed-unsold"
        ? 0
        : state === "live-no-bids"
          ? BID_FIXTURE_LOT.startingBidMinor
          : state === "live-auto-outbid"
            ? 825_000
            : state === "closed-sold" ||
                state === "closed-won-payment-due" ||
                state === "closed-won-settled" ||
                state === "closed-lost"
              ? 310_000
              : BID_FIXTURE_LOT.currentBidMinor,
    bidCount:
      state === "live-no-bids" || state === "closed-unsold"
        ? 0
        : BID_FIXTURE_LOT.bidCount,
    resultFact:
      state === "closed-unsold"
        ? "Unsold"
        : closed && !state.includes("unsold")
          ? `Sold · ${fixtureAmount(310_000)}`
          : undefined,
  };
}

export function bidHistoryForState(
  state: BiddingState,
): ListingBidHistoryRow[] {
  if (!stateMeta(state).hasBids) return [];

  if (state === "live-auto-outbid") {
    return [
      {
        id: "bid-mike-825",
        initials: "mike@example.com",
        amountMinor: 825_000,
        acceptedAtMs: msAgo(1),
      },
      {
        id: "bid-john-800",
        initials: "john@example.com",
        amountMinor: 800_000,
        acceptedAtMs: msAgo(5),
        isViewer: true,
      },
      {
        id: "bid-alex-775",
        initials: "alex@example.com",
        amountMinor: 775_000,
        acceptedAtMs: msAgo(10),
      },
    ];
  }

  if (state.startsWith("closed")) {
    return [
      {
        id: "bid-mike-310",
        initials: "mike@example.com",
        amountMinor: 310_000,
        acceptedAtMs: msAgo(60),
        timeOverride: "Closed",
      },
      {
        id: "bid-john-295",
        initials: "john@example.com",
        amountMinor: 295_000,
        acceptedAtMs: msAgo(90),
        timeOverride: "Closed",
        isViewer: state === "closed-lost",
      },
    ];
  }

  return BID_HISTORY;
}

const USER_BID_HISTORY_LABELS = {
  manual: "Manual",
  automatic: "Automatic",
} as const;

export function userBidHistoryForState(
  state: BiddingState,
): ListingUserBidHistoryRow[] {
  switch (state) {
    case "live-manual":
      return [
        {
          id: "user-bid-manual-480",
          amountLabel: fixtureAmount(480_000),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(2),
        },
        {
          id: "user-bid-manual-455",
          amountLabel: fixtureAmount(455_000),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(12),
        },
      ];
    case "live-auto-leading":
      return [
        {
          id: "user-bid-auto-480",
          amountLabel: fixtureAmount(480_000),
          bidType: "auto",
          bidTypeLabel: USER_BID_HISTORY_LABELS.automatic,
          acceptedAtMs: msAgo(2),
        },
        {
          id: "user-bid-manual-430",
          amountLabel: fixtureAmount(430_000),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(25),
        },
      ];
    case "live-auto-outbid":
      return [
        {
          id: "user-bid-auto-800",
          amountLabel: fixtureAmount(800_000),
          bidType: "auto",
          bidTypeLabel: USER_BID_HISTORY_LABELS.automatic,
          acceptedAtMs: msAgo(5),
        },
        {
          id: "user-bid-manual-775",
          amountLabel: fixtureAmount(775_000),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(18),
        },
      ];
    case "closed-won-payment-due":
    case "closed-won-settled":
      return [
        {
          id: "user-bid-won-310",
          amountLabel: fixtureAmount(310_000),
          bidType: "auto",
          bidTypeLabel: USER_BID_HISTORY_LABELS.automatic,
          acceptedAtMs: msAgo(60),
          timeOverride: "Closed",
        },
        {
          id: "user-bid-won-285",
          amountLabel: fixtureAmount(285_000),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(90),
          timeOverride: "Closed",
        },
      ];
    case "closed-lost":
      return [
        {
          id: "user-bid-lost-295",
          amountLabel: fixtureAmount(295_000),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(120),
          timeOverride: "Closed",
        },
      ];
    default:
      return [];
  }
}

export function bidModeForState(state: BiddingState): BidMode {
  if (state === "live-manual") return "manual";
  if (state === "live-auto-leading" || state === "live-auto-outbid") {
    return "auto";
  }
  return "manual";
}

export function auctionHeaderLabel(state: BiddingState): string {
  const meta = stateMeta(state);
  if (meta.opens) return "Opens soon";
  if (meta.closed) return "Auction closed";
  return "Auction";
}

function listingAuctionStanding(state: BiddingState): ListingAuctionStanding {
  if (state === "closed-won-payment-due") return "won-payment-due";
  if (state === "closed-won-settled") return "won-settled";
  if (state === "closed-lost") return "lost";
  if (state === "live-auto-outbid") return "outbid";
  if (state === "live-auto-leading") return "leading-max";
  if (state === "live-manual") return "leading-manual";
  return "none";
}

function resolveListingStanding(
  state: BiddingState,
  currentBidMinor: number,
  viewerMaximumMinor?: number,
): ListingAuctionStanding {
  const standing = listingAuctionStanding(state);
  if (
    standing === "leading-max" &&
    viewerMaximumMinor != null &&
    currentBidMinor > viewerMaximumMinor
  ) {
    return "outbid";
  }
  return standing;
}

function viewerMaximumForState(state: BiddingState): number | undefined {
  if (state === "live-auto-leading" || state === "live-auto-outbid") {
    return BID_FIXTURE_LOT.viewerMaximumMinor;
  }
  return undefined;
}

export type LiveListingFacts = {
  currentBidMinor: number;
  bidCount: number;
  hasBids: boolean;
};

export function buildListingAuctionBidView(
  state: BiddingState,
  timing?: AuctionTiming,
  liveFacts?: LiveListingFacts,
): ListingAuctionBidView {
  const meta = stateMeta(state);
  const liveTiming = meta.live && timing != null ? timing : undefined;
  const currentBidMinor = liveFacts?.currentBidMinor ?? meta.currentBidMinor;
  const bidCount = liveFacts?.bidCount ?? meta.bidCount;
  const hasBids = liveFacts?.hasBids ?? meta.hasBids;
  const countdownSeconds =
    liveTiming != null
      ? remainingSecondsUntil(liveTiming.closesAtMs)
      : meta.countdownSeconds;
  const deadlineAtMs =
    meta.closed || meta.opens
      ? meta.deadlineAtMs
      : liveTiming != null
        ? liveTiming.closesAtMs
        : meta.deadlineAtMs;
  const viewerMaximumMinor = viewerMaximumForState(state);
  const priceLabel =
    meta.closed || meta.isUnsold
      ? meta.priceLabel
      : hasBids
        ? "Current Bid"
        : "Starting bid";

  return {
    currency: BID_FIXTURE_LOT.currency,
    headerLabel: auctionHeaderLabel(state),
    live: meta.live,
    opens: meta.opens,
    closed: meta.closed,
    hasBids,
    isUnsold: meta.isUnsold,
    showBidActions: meta.showBidActions,
    priceLabel,
    currentBidMinor,
    bidCount,
    bidCountLabel: formatBidCountLabel(bidCount),
    countdown: meta.countdown,
    countdownSeconds,
    closesAtMs: liveTiming?.closesAtMs ?? null,
    countdownFormat: meta.countdownFormat,
    extended: liveTiming?.extended ?? false,
    deadlineAtMs,
    standing: resolveListingStanding(
      state,
      currentBidMinor,
      viewerMaximumMinor,
    ),
    viewerMaximumMinor,
    minBidMinor: minNextBidMinor(
      currentBidMinor,
      BID_FIXTURE_LOT.incrementMinor,
      hasBids,
      BID_FIXTURE_LOT.startingBidMinor,
    ),
    incrementMinor: BID_FIXTURE_LOT.incrementMinor,
    suggestedMaxMinor: BID_FIXTURE_LOT.viewerMaximumMinor ?? 0,
    resultFact: meta.resultFact,
  };
}
