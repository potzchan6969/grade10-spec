import type {
  ListingAuctionBidView,
  ListingAuctionStanding,
  ListingBidHistoryRow,
  ListingLotMetaBadge,
} from "../../../../packages/ui/src/blocks/auction-listing/types";
import { minNextBidMinor } from "../../../../packages/ui/src/blocks/auction-listing/format-usd";
import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { createElement } from "react";

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

export type BiddingState =
  | "opens"
  | "live-no-bids"
  | "live-manual"
  | "live-auto-leading"
  | "live-auto-overtaken"
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
  "live-auto-overtaken": "Live — auto overtaken",
  "closed-sold": "Closed — sold",
  "closed-won-payment-due": "Closed — won payment due",
  "closed-won-settled": "Closed — won settled",
  "closed-lost": "Closed — lost",
  "closed-unsold": "Closed — unsold",
};

const DAY_SECONDS = 24 * 60 * 60;
const HOUR_SECONDS = 60 * 60;

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

const BID_HISTORY: ListingBidHistoryRow[] = [
  {
    id: "bid-john-480",
    initials: "john@example.com",
    amountMinor: 480_000,
    relativeTime: "2 min ago",
    leading: true,
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
      leading: "Leading",
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
    opensIn: "Opens in",
    closed: "Closed",
    timeLeftAutoExtended: "Time left (auto-extended)",
    autoExtendedTooltip:
      "Bids placed in the final 30 minutes extend the auction by 30 minutes, up to the listing extension cap.",
    placeBidSection: "Place bid",
    placeBid: "Place Bid",
    enableAutoBidding: "Enable auto-bidding",
    autoBiddingTooltip:
      "We'll bid automatically only as needed, up to your maximum. Your card hold covers the maximum; you may pay less if the auction ends below it.",
    buyerFeeHint: "Buyer’s premium is added at invoice.",
    bidCountZero: "0 bids",
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
      ? "Closed 30 Aug 2026, 09:15 UTC"
      : opens
        ? "2D 4H 12M 0S"
        : "6m 9s",
    countdownSeconds: closed
      ? null
      : opens
        ? 2 * DAY_SECONDS + 4 * HOUR_SECONDS + 12 * 60
        : 6 * 60 + 9,
    countdownFormat: opens ? "long" as const : "short" as const,
    deadline: closed
      ? undefined
      : opens
        ? "Opens 22 Aug 2026, 18:00 UTC"
        : "Ends 1 Sep 2026, 18:00 UTC",
    currentBidMinor:
      state === "closed-unsold"
        ? 0
        : state === "live-auto-overtaken"
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

export function bidHistoryForState(state: BiddingState): ListingBidHistoryRow[] {
  if (!stateMeta(state).hasBids) return [];

  if (state === "live-auto-overtaken") {
    return [
      {
        id: "bid-mike-825",
        initials: "mike@example.com",
        amountMinor: 825_000,
        relativeTime: "1 min ago",
        leading: true,
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
        leading: true,
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

const SIMULATED_RIVALS = [
  "sara@example.com",
  "nina@example.com",
  "tom@example.com",
] as const;

const MAX_RECENT_BIDS = 5;

export function appendSimulatedBid(
  rows: readonly ListingBidHistoryRow[],
): ListingBidHistoryRow[] {
  if (rows.length === 0) return [...rows];

  const top = rows[0];
  const rival =
    SIMULATED_RIVALS[Math.floor(Math.random() * SIMULATED_RIVALS.length)];
  const newBid: ListingBidHistoryRow = {
    id: `bid-sim-${Date.now()}`,
    initials: rival,
    amountMinor: top.amountMinor + AUCTION_LOT.incrementMinor,
    relativeTime: "Just now",
    leading: true,
  };

  return [
    newBid,
    ...rows.map((row) => ({
      ...row,
      leading: false,
    })),
  ].slice(0, MAX_RECENT_BIDS);
}

export function bidModeForState(state: BiddingState): BidMode {
  if (state === "live-manual") return "manual";
  if (state === "live-auto-leading" || state === "live-auto-overtaken") {
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
  if (state === "live-auto-overtaken") return "outbid";
  if (state === "live-auto-leading") return "leading-max";
  if (state === "live-manual") return "leading-manual";
  return "none";
}

export function buildListingAuctionBidView(
  state: BiddingState,
): ListingAuctionBidView {
  const meta = stateMeta(state);

  return {
    headerLabel: auctionHeaderLabel(state),
    live: meta.live,
    opens: meta.opens,
    closed: meta.closed,
    hasBids: meta.hasBids,
    isUnsold: meta.isUnsold,
    showBidActions: meta.showBidActions,
    priceLabel: meta.priceLabel,
    currentBidMinor: meta.currentBidMinor,
    bidCount: meta.bidCount,
    bidCountLabel: formatBidCountLabel(meta.bidCount),
    countdown: meta.countdown,
    countdownSeconds: meta.countdownSeconds,
    countdownFormat: meta.countdownFormat,
    deadline: meta.deadline,
    standing: listingAuctionStanding(state),
    viewerMaximumMinor: AUCTION_LOT.viewerMaximumMinor,
    minBidMinor: minNextBidMinor(
      meta.currentBidMinor,
      AUCTION_LOT.incrementMinor,
      meta.hasBids,
      AUCTION_LOT.startingBidMinor,
    ),
    incrementMinor: AUCTION_LOT.incrementMinor,
    suggestedMaxMinor: AUCTION_LOT.viewerMaximumMinor ?? 0,
    resultFact: meta.resultFact,
  };
}
