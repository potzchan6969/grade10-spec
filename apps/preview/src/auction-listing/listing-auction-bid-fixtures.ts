import {
  DEFAULT_LISTING_CURRENCY,
  DEFAULT_LISTING_EXTENSION_POLICY,
  formatAutoExtendedTooltip,
  formatMoney,
  type ListingAgeVerificationDialogCopy,
  type ListingAuctionBidCardCopy,
  type ListingAuctionBidView,
  type ListingAuctionStanding,
  type ListingBidHistoryRow,
  type ListingUserBidHistoryRow,
  minNextBidMinor,
} from "@grade10/ui";
import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_AUCTION_CLOSED_AT_MS,
  FIXTURE_AUCTION_ENDS_AT_MS,
  FIXTURE_AUCTION_OPENS_AT_MS,
} from "@grade10/ui/lib/datetime-fixtures";

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
  "closed-won-payment-due": "Closed — confirm purchase",
  "closed-won-settled": "Closed — won settled",
  "closed-lost": "Closed — lost",
  "closed-unsold": "Closed — unsold",
};

/** Numeric lot facts shared by bid-card fixtures and preview page content. */
export const BID_FIXTURE_LOT = {
  currency: DEFAULT_LISTING_CURRENCY,
  /** Near the low end of the lot's historical comps. */
  startingBidMinor: 4_800_000,
  /** Live mid-ladder current bid (a few increments above start). */
  currentBidMinor: 5_800_000,
  /** Step sized for a mid–six-figure HKD lot. */
  incrementMinor: 250_000,
  bidCount: 6,
  /** Private maximum below the high comps band while still leading. */
  viewerMaximumMinor: 9_500_000,
} as const;

/** Live-auto-outbid: market above the viewer's maximum. */
const OUTBID_CURRENT_MINOR =
  BID_FIXTURE_LOT.viewerMaximumMinor + BID_FIXTURE_LOT.incrementMinor;

/** Closed hammer for sold / won / lost fixtures. */
const CLOSED_SOLD_MINOR = 7_250_000;

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
    id: "bid-john-5800",
    initials: VIEWER_INITIALS,
    amountMinor: BID_FIXTURE_LOT.currentBidMinor,
    acceptedAtMs: msAgo(2),
    isViewer: true,
  },
  {
    id: "bid-mike-5550",
    initials: "mike@example.com",
    amountMinor:
      BID_FIXTURE_LOT.currentBidMinor - BID_FIXTURE_LOT.incrementMinor,
    acceptedAtMs: msAgo(6),
  },
  {
    id: "bid-alex-5300",
    initials: "alex@example.com",
    amountMinor:
      BID_FIXTURE_LOT.currentBidMinor - BID_FIXTURE_LOT.incrementMinor * 2,
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
  completePurchase: "Confirm shipping and payment",
  completePurchaseBody:
    "Choose where we ship and how you pay. You cannot pay until both are confirmed.",
  completePurchaseAction: "Continue",
  paid: "Paid",
  paidBody: "Track shipping and delivery for this lot.",
  viewOrderDetails: "View order details",
  didNotWin: "Did not win",
  cardRelease: "Your card authorization will be released.",
  outbid: "Outbid",
  highestBid: "Leading",
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
  setPrivateMaximum: "Set your private maximum",
  raisePrivateMaximum: "Raise your private maximum",
  currentMaximum: "Max: {amount}",
  reviewMaximum: "Set maximum to {amount}",
  raiseMaximumReview: "Raise maximum to {amount}",
  bidNowReview: "Bid now at {amount}",
  privateMaximumTooltip:
    "Your maximum is the most you are willing to pay before buyer fees. Other bidders cannot see it. We only bid as needed to keep you leading.",
  maximumMechanismSubtext:
    "We bid only as needed up to your maximum. Hold matches it; you can raise, not lower or cancel.",
  customAmountPlaceholder: "Custom amount (min. {amount})",
  stepperMessage: "Min.: {amount}",
  invalidAmount: "Enter a valid amount.",
  useMinimum: "Use minimum",
  bidImmediate: "Maximum {amount}",
  bidUpTo: "Maximum {amount}",
  nextEligibleBid: "Min. bid",
  amountAboveCurrent: "{amount} vs current",
  amountAboveMaximum: "{amount} vs max",
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
  closedSummary: "Closed at {time}. Ran {duration}",
  activityTimeCopy: FIXTURE_ACTIVITY_TIME_COPY,
} satisfies Omit<
  ListingAuctionBidCardCopy,
  | "aboutThisLot"
  | "vaultShipping"
  | "authentication"
  | "result"
  | "showMore"
  | "showLess"
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
            ? OUTBID_CURRENT_MINOR
            : state === "closed-sold" ||
                state === "closed-won-payment-due" ||
                state === "closed-won-settled" ||
                state === "closed-lost"
              ? CLOSED_SOLD_MINOR
              : BID_FIXTURE_LOT.currentBidMinor,
    bidCount:
      state === "live-no-bids" || state === "closed-unsold"
        ? 0
        : BID_FIXTURE_LOT.bidCount,
  };
}

export function bidHistoryForState(
  state: BiddingState,
): ListingBidHistoryRow[] {
  if (!stateMeta(state).hasBids) return [];

  if (state === "live-auto-outbid") {
    return [
      {
        id: "bid-mike-outbid",
        initials: "mike@example.com",
        amountMinor: OUTBID_CURRENT_MINOR,
        acceptedAtMs: msAgo(1),
      },
      {
        id: "bid-john-max",
        initials: "john@example.com",
        amountMinor: BID_FIXTURE_LOT.viewerMaximumMinor,
        acceptedAtMs: msAgo(5),
        isViewer: true,
      },
      {
        id: "bid-alex-prior",
        initials: "alex@example.com",
        amountMinor:
          BID_FIXTURE_LOT.viewerMaximumMinor - BID_FIXTURE_LOT.incrementMinor,
        acceptedAtMs: msAgo(10),
      },
    ];
  }

  if (state.startsWith("closed")) {
    const viewerWon =
      state === "closed-won-payment-due" || state === "closed-won-settled";
    return [
      {
        id: viewerWon ? "bid-john-sold" : "bid-mike-sold",
        initials: viewerWon ? VIEWER_INITIALS : "mike@example.com",
        amountMinor: CLOSED_SOLD_MINOR,
        acceptedAtMs: msAgo(60),
        isViewer: viewerWon,
      },
      {
        id: viewerWon ? "bid-mike-prior" : "bid-john-closed",
        initials: viewerWon ? "mike@example.com" : VIEWER_INITIALS,
        amountMinor: CLOSED_SOLD_MINOR - BID_FIXTURE_LOT.incrementMinor,
        acceptedAtMs: msAgo(90),
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
          id: "user-bid-manual-current",
          amountLabel: fixtureAmount(BID_FIXTURE_LOT.currentBidMinor),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(2),
        },
        {
          id: "user-bid-manual-prior",
          amountLabel: fixtureAmount(
            BID_FIXTURE_LOT.currentBidMinor - BID_FIXTURE_LOT.incrementMinor,
          ),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(12),
        },
      ];
    case "live-auto-leading":
      return [
        {
          id: "user-bid-auto-current",
          amountLabel: fixtureAmount(BID_FIXTURE_LOT.currentBidMinor),
          bidType: "auto",
          bidTypeLabel: USER_BID_HISTORY_LABELS.automatic,
          acceptedAtMs: msAgo(2),
        },
        {
          id: "user-bid-manual-prior",
          amountLabel: fixtureAmount(
            BID_FIXTURE_LOT.currentBidMinor - BID_FIXTURE_LOT.incrementMinor * 2,
          ),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(25),
        },
      ];
    case "live-auto-outbid":
      return [
        {
          id: "user-bid-auto-max",
          amountLabel: fixtureAmount(BID_FIXTURE_LOT.viewerMaximumMinor),
          bidType: "auto",
          bidTypeLabel: USER_BID_HISTORY_LABELS.automatic,
          acceptedAtMs: msAgo(5),
        },
        {
          id: "user-bid-manual-prior",
          amountLabel: fixtureAmount(
            BID_FIXTURE_LOT.viewerMaximumMinor - BID_FIXTURE_LOT.incrementMinor,
          ),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(18),
        },
      ];
    case "closed-won-payment-due":
    case "closed-won-settled":
      return [
        {
          id: "user-bid-won",
          amountLabel: fixtureAmount(CLOSED_SOLD_MINOR),
          bidType: "auto",
          bidTypeLabel: USER_BID_HISTORY_LABELS.automatic,
          acceptedAtMs: msAgo(60),
        },
        {
          id: "user-bid-won-prior",
          amountLabel: fixtureAmount(
            CLOSED_SOLD_MINOR - BID_FIXTURE_LOT.incrementMinor,
          ),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(90),
        },
      ];
    case "closed-lost":
      return [
        {
          id: "user-bid-lost",
          amountLabel: fixtureAmount(
            CLOSED_SOLD_MINOR - BID_FIXTURE_LOT.incrementMinor,
          ),
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          acceptedAtMs: msAgo(120),
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
    opensAtMs: meta.closed || meta.opens ? FIXTURE_AUCTION_OPENS_AT_MS : null,
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
  };
}
