import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { createElement } from "react";
import { minNextBidMinor } from "../../../../packages/ui/src/blocks/auction-listing/format-usd";
import {
  formatListingClosed,
  formatListingEnds,
  formatListingOpens,
} from "../../../../packages/ui/src/lib/format-datetime";
import {
  FIXTURE_AUCTION_CLOSED_AT_MS,
  FIXTURE_AUCTION_ENDS_AT_MS,
  FIXTURE_AUCTION_OPENS_AT_MS,
} from "../../../../packages/ui/src/lib/datetime-fixtures";
import type {
  ListingAuctionBidView,
  ListingAuctionStanding,
  ListingBidHistoryRow,
  ListingLotMetaBadge,
  ListingUserBidHistoryRow,
} from "../../../../packages/ui/src/blocks/auction-listing/types";

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

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

const DAY_SECONDS = 24 * 60 * 60;
const HOUR_SECONDS = 60 * 60;
export const EXTENSION_WINDOW_MS = 30 * 60 * 1000;
export const EXTENSION_DURATION_MS = 30 * 60 * 1000;
export const LIVE_INITIAL_REMAINING_MS = (6 * 60 + 9) * 1000;

export type AuctionTiming = {
  closesAtMs: number;
  extended: boolean;
};

export function remainingSecondsUntil(
  closesAtMs: number,
  nowMs = Date.now(),
): number {
  return Math.max(0, Math.floor((closesAtMs - nowMs) / 1000));
}

export function shouldExtendClose(
  closesAtMs: number,
  nowMs = Date.now(),
): boolean {
  const remainingMs = closesAtMs - nowMs;
  return remainingMs > 0 && remainingMs <= EXTENSION_WINDOW_MS;
}

export function extendRecordedClose(nowMs = Date.now()): number {
  return nowMs + EXTENSION_DURATION_MS;
}

export function createLiveAuctionTiming(nowMs = Date.now()): AuctionTiming {
  return {
    closesAtMs: nowMs + LIVE_INITIAL_REMAINING_MS,
    extended: false,
  };
}

export function applyBidExtension(
  timing: AuctionTiming,
  nowMs = Date.now(),
): AuctionTiming {
  if (!shouldExtendClose(timing.closesAtMs, nowMs)) {
    return timing;
  }

  return {
    closesAtMs: extendRecordedClose(nowMs),
    extended: true,
  };
}

export const AUCTION_LOT = {
  title: "1999 Charizard, PSA 10",
  listingNumber: "12",
  saleName: "September Slabs",
  category: "Pokémon",
  description:
    "Shadowless 1st Ed. Authenticated and vaulted. Stored in Grade10 Vault — ships within one business day of payment.",
  images: [
    { src: IMAGE, alt: "1999 Charizard, PSA 10 — front" },
    { src: IMAGE, alt: "1999 Charizard, PSA 10 — back" },
  ],
  startingBidMinor: 120_000,
  currentBidMinor: 480_000,
  incrementMinor: 25_000,
  bidCount: 6,
  viewerMaximumMinor: 800_000,
  currency: "USD",
};

export const AUCTION_LOT_BADGES: readonly ListingLotMetaBadge[] = [
  { label: `Listing ${AUCTION_LOT.listingNumber}` },
  { label: AUCTION_LOT.category },
  { label: AUCTION_LOT.saleName },
];

const VIEWER_INITIALS = "john@example.com";

const BID_HISTORY: ListingBidHistoryRow[] = [
  {
    id: "bid-john-480",
    initials: VIEWER_INITIALS,
    amountMinor: 480_000,
    relativeTime: "2 min ago",
    isViewer: true,
  },
  {
    id: "bid-mike-455",
    initials: "mike@example.com",
    amountMinor: 455_000,
    relativeTime: "6 min ago",
  },
  {
    id: "bid-alex-430",
    initials: "alex@example.com",
    amountMinor: 430_000,
    relativeTime: "12 min ago",
  },
];

const noop = () => {};

const NAV_LOGO = createElement(G10LogoMono, { className: "h-7 w-auto" });

export const AUCTION_NAV = {
  copy: { locale: "USD" },
  promo: "PROMO UTILITY BAR",
  logo: NAV_LOGO,
  logoHref: "/",
  locales: [
    { value: "US", label: "USD" },
    { value: "HK", label: "HKD" },
  ],
  locale: "US",
  utilityLinks: [],
  navItems: [
    { label: "Store", href: "#shop" },
    { label: "Auction", href: "#auction", current: true },
    { label: "Grade", href: "#grade" },
    { label: "Store Locator", href: "#locator" },
  ],
  onLocaleChange: noop,
  onAccountClick: noop,
  onCartClick: noop,
};

export const AUCTION_LOT_DETAILS_COPY = {
  header: {
    auctionBreadcrumb: "Auction",
    lotBreadcrumb: `Lot ${AUCTION_LOT.listingNumber}`,
    watch: "Watch",
    watching: "Watching",
    watchAriaLabel: "Watch this lot",
    unwatchAriaLabel: "Unwatch this lot",
  },
  sidebar: {
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
    autoExtendedTooltip:
      "A bid in the last 30 minutes adds 30 minutes to the close. Repeats until 30 minutes pass with no bids, up to the listing cap.",
    placeBidSection: "Place bid",
    placeBid: "Place Bid",
    confirmMaximum: "Confirm",
    raiseMaximum: "Raise",
    confirmMaximumTooltip:
      "The most we'll bid for you. Authorizes a card hold for this amount—you may pay less if the auction ends below it.",
    confirmMaximumAriaLabel: "Confirm maximum",
    raiseMaximumAriaLabel: "Raise maximum",
    enableAutoBidding: "Enable auto-bidding",
    autoBiddingTooltip:
      "We bid for you as needed, up to your maximum. Your card hold matches that amount—you may pay less if the auction ends below it.",
    minimumMaximumFloor:
      "At least {amount} (current bid + {increment})",
    minimumMaximumLeadingNudge:
      "At least {amount} (your maximum + US$1)",
    minimumMaximumLeadingIncrement:
      "At least {amount} (your maximum + {increment})",
    maximumBelowMinimum: "Enter at least {amount}",
    buyerFeeHint: "Buyer fee is added on top of the winning bid",
    buyerFeeTooltip:
      "Winners pay a percentage of the hammer price as a buyer fee. The rate is confirmed at checkout.",
    noBidsYet: "No bids yet",
    aboutThisLot: "About this lot",
    vaultShipping: "Vault shipping",
    authentication: "Authentication",
    result: "Result",
    showMore: "Show more",
  },
  vaultShippingBody:
    "Stored in Grade10 Vault — ships from our facility within 1 business day of payment.",
  authenticationBody: "Authenticated by Grade10 Marketplace",
  ageVerification: {
    title: "Confirm your age",
    body: "You must be 18 or older to bid. Enter your date of birth to continue.",
    monthPlaceholder: "Month",
    dayPlaceholder: "Day",
    yearPlaceholder: "Year",
    birthMonthLabel: "Birth month",
    birthDayLabel: "Birth day",
    birthYearLabel: "Birth year",
    cancel: "Cancel",
    confirm: "Confirm",
  },
  userBidHistory: {
    link: "Your bid history",
    title: "Bid History",
    amount: "Your bid",
    type: "Type",
    time: "Time",
  },
};

function formatBidCountLabel(count: number): string {
  return count === 1 ? `${count} bid` : `${count} bids`;
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
    countdown: closed
      ? formatListingClosed(FIXTURE_AUCTION_CLOSED_AT_MS)
      : opens
        ? "2D 4H 12M 0S"
        : "6m 9s",
    countdownSeconds: closed
      ? null
      : opens
        ? 2 * DAY_SECONDS + 4 * HOUR_SECONDS + 12 * 60
        : 6 * 60 + 9,
    countdownFormat: opens ? ("long" as const) : ("short" as const),
    deadline: closed
      ? undefined
      : opens
        ? formatListingOpens(FIXTURE_AUCTION_OPENS_AT_MS)
        : formatListingEnds(FIXTURE_AUCTION_ENDS_AT_MS),
    currentBidMinor:
      state === "closed-unsold"
        ? 0
        : state === "live-no-bids"
          ? AUCTION_LOT.startingBidMinor
        : state === "live-auto-outbid"
          ? 825_000
          : state === "closed-sold" ||
              state === "closed-won-payment-due" ||
              state === "closed-won-settled" ||
              state === "closed-lost"
            ? 310_000
            : AUCTION_LOT.currentBidMinor,
    bidCount:
      state === "live-no-bids" || state === "closed-unsold"
        ? 0
        : AUCTION_LOT.bidCount,
    resultFact:
      state === "closed-unsold"
        ? "Unsold"
        : closed && !state.includes("unsold")
          ? "Sold · US$3,100"
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
        relativeTime: "1 min ago",
      },
      {
        id: "bid-john-800",
        initials: "john@example.com",
        amountMinor: 800_000,
        relativeTime: "5 min ago",
        isViewer: true,
      },
      {
        id: "bid-alex-775",
        initials: "alex@example.com",
        amountMinor: 775_000,
        relativeTime: "10 min ago",
      },
    ];
  }

  if (state.startsWith("closed")) {
    return [
      {
        id: "bid-mike-310",
        initials: "mike@example.com",
        amountMinor: 310_000,
        relativeTime: "Closed",
      },
      {
        id: "bid-john-295",
        initials: "john@example.com",
        amountMinor: 295_000,
        relativeTime: "Closed",
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
          amountLabel: "US$4,800",
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          timeLabel: "2 min ago",
        },
        {
          id: "user-bid-manual-455",
          amountLabel: "US$4,550",
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          timeLabel: "12 min ago",
        },
      ];
    case "live-auto-leading":
      return [
        {
          id: "user-bid-auto-480",
          amountLabel: "US$4,800",
          bidType: "auto",
          bidTypeLabel: USER_BID_HISTORY_LABELS.automatic,
          timeLabel: "2 min ago",
        },
        {
          id: "user-bid-manual-430",
          amountLabel: "US$4,300",
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          timeLabel: "25 min ago",
        },
      ];
    case "live-auto-outbid":
      return [
        {
          id: "user-bid-auto-800",
          amountLabel: "US$8,000",
          bidType: "auto",
          bidTypeLabel: USER_BID_HISTORY_LABELS.automatic,
          timeLabel: "5 min ago",
        },
        {
          id: "user-bid-manual-775",
          amountLabel: "US$7,750",
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          timeLabel: "18 min ago",
        },
      ];
    case "closed-won-payment-due":
    case "closed-won-settled":
      return [
        {
          id: "user-bid-won-310",
          amountLabel: "US$3,100",
          bidType: "auto",
          bidTypeLabel: USER_BID_HISTORY_LABELS.automatic,
          timeLabel: "Closed",
        },
        {
          id: "user-bid-won-285",
          amountLabel: "US$2,850",
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          timeLabel: "Closed",
        },
      ];
    case "closed-lost":
      return [
        {
          id: "user-bid-lost-295",
          amountLabel: "US$2,950",
          bidType: "manual",
          bidTypeLabel: USER_BID_HISTORY_LABELS.manual,
          timeLabel: "Closed",
        },
      ];
    default:
      return [];
  }
}

const SIMULATED_RIVALS = [
  "sara@example.com",
  "nina@example.com",
  "tom@example.com",
] as const;

const MAX_RECENT_BIDS = 5;

export type LiveListingFacts = {
  currentBidMinor: number;
  bidCount: number;
  hasBids: boolean;
};

export function initialLiveListingFacts(state: BiddingState): LiveListingFacts {
  const meta = stateMeta(state);
  const history = bidHistoryForState(state);

  if (history.length > 0) {
    return {
      currentBidMinor: history[0].amountMinor,
      bidCount: meta.bidCount,
      hasBids: true,
    };
  }

  return {
    currentBidMinor: AUCTION_LOT.startingBidMinor,
    bidCount: meta.bidCount,
    hasBids: meta.hasBids,
  };
}

export type LiveBidSimulationOptions = {
  /** When set, a rival bid within this cap triggers an automatic viewer counter-bid. */
  viewerMaximumMinor?: number;
  viewerInitials?: string;
};

export function liveBidSimulationOptions(
  state: BiddingState,
): LiveBidSimulationOptions {
  if (state === "live-auto-leading") {
    return {
      viewerMaximumMinor: AUCTION_LOT.viewerMaximumMinor,
      viewerInitials: VIEWER_INITIALS,
    };
  }
  return {};
}

function randomRivalInitials(): string {
  return SIMULATED_RIVALS[
    Math.floor(Math.random() * SIMULATED_RIVALS.length)
  ];
}

function viewerAutoCounterAmount(
  rivalAmountMinor: number,
  viewerMaximumMinor: number,
): number | null {
  const counterAmount = Math.min(
    rivalAmountMinor + AUCTION_LOT.incrementMinor,
    viewerMaximumMinor,
  );
  if (counterAmount <= rivalAmountMinor) return null;
  return counterAmount;
}

export function simulateNextLiveBid(
  history: readonly ListingBidHistoryRow[],
  facts: LiveListingFacts,
  options: LiveBidSimulationOptions = {},
): { history: ListingBidHistoryRow[]; facts: LiveListingFacts } {
  const viewerInitials = options.viewerInitials ?? VIEWER_INITIALS;
  const viewerMaximumMinor = options.viewerMaximumMinor;

  if (history.length === 0) {
    const rivalInitials = randomRivalInitials();
    const newBid: ListingBidHistoryRow = {
      id: `bid-sim-${Date.now()}`,
      initials: rivalInitials,
      amountMinor: AUCTION_LOT.startingBidMinor,
      relativeTime: "Just now",
    };

    return {
      history: [newBid],
      facts: {
        currentBidMinor: AUCTION_LOT.startingBidMinor,
        bidCount: 1,
        hasBids: true,
      },
    };
  }

  const top = history[0];
  const rivalAmount = top.amountMinor + AUCTION_LOT.incrementMinor;
  const rivalBid: ListingBidHistoryRow = {
    id: `bid-rival-${Date.now()}`,
    initials: randomRivalInitials(),
    amountMinor: rivalAmount,
    relativeTime: "Just now",
  };

  if (viewerMaximumMinor != null) {
    const counterAmount = viewerAutoCounterAmount(
      rivalAmount,
      viewerMaximumMinor,
    );
    if (counterAmount != null) {
      const viewerBid: ListingBidHistoryRow = {
        id: `bid-viewer-${Date.now()}`,
        initials: viewerInitials,
        amountMinor: counterAmount,
        relativeTime: "Just now",
        isViewer: true,
      };

      return {
        history: [viewerBid, rivalBid, ...history].slice(0, MAX_RECENT_BIDS),
        facts: {
          currentBidMinor: counterAmount,
          bidCount: facts.bidCount + 2,
          hasBids: true,
        },
      };
    }
  }

  return {
    history: [rivalBid, ...history].slice(0, MAX_RECENT_BIDS),
    facts: {
      currentBidMinor: rivalAmount,
      bidCount: facts.bidCount + 1,
      hasBids: true,
    },
  };
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

/** Reconcile static story state with live-simulated bid facts. */
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
    return AUCTION_LOT.viewerMaximumMinor;
  }
  return undefined;
}

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
  const deadline =
    meta.closed || meta.opens
      ? meta.deadline
      : liveTiming != null
        ? formatListingEnds(liveTiming.closesAtMs)
        : meta.deadline;
  const viewerMaximumMinor = viewerMaximumForState(state);
  const priceLabel =
    meta.closed || meta.isUnsold
      ? meta.priceLabel
      : hasBids
        ? "Current Bid"
        : "Starting bid";

  return {
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
    deadline,
    standing: resolveListingStanding(
      state,
      currentBidMinor,
      viewerMaximumMinor,
    ),
    viewerMaximumMinor,
    minBidMinor: minNextBidMinor(
      currentBidMinor,
      AUCTION_LOT.incrementMinor,
      hasBids,
      AUCTION_LOT.startingBidMinor,
    ),
    incrementMinor: AUCTION_LOT.incrementMinor,
    suggestedMaxMinor: AUCTION_LOT.viewerMaximumMinor ?? 0,
    resultFact: meta.resultFact,
  };
}
