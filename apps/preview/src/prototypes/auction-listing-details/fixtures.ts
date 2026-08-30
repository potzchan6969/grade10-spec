import type { BiddingState, BidHistoryRow, LotFixture } from "./types";

const DAY_SECONDS = 24 * 60 * 60;
const HOUR_SECONDS = 60 * 60;

const IMAGE = new URL("../../pages/product.fixture.png", import.meta.url).href;

export const LOT: LotFixture = {
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

export const BID_HISTORY: BidHistoryRow[] = [
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

export const EXTENSION_TOOLTIP =
  "Bids placed in the final 30 minutes extend the auction by 30 minutes, up to the listing extension cap.";

export const BUYER_FEE_HINT = "Buyer’s premium is added at invoice.";

export const AUTO_BIDDING_TOOLTIP =
  "We'll bid automatically only as needed, up to your maximum. Your card hold covers the maximum; you may pay less if the auction ends below it.";

export function bidHistoryForState(state: BiddingState): BidHistoryRow[] {
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

/** Prepends a rival bid for live-auction demos. */
export function appendSimulatedBid(
  rows: readonly BidHistoryRow[],
): BidHistoryRow[] {
  if (rows.length === 0) return rows;

  const top = rows[0];
  const rival =
    SIMULATED_RIVALS[Math.floor(Math.random() * SIMULATED_RIVALS.length)];
  const newBid: BidHistoryRow = {
    id: `bid-sim-${Date.now()}`,
    initials: rival,
    amountMinor: top.amountMinor + LOT.incrementMinor,
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
    showMaximum:
      state === "live-auto-leading" || state === "live-auto-overtaken",
    isLeading:
      state === "live-auto-leading" ||
      state === "live-manual" /* simplified for manual highest */,
    isOutbid: state === "live-auto-overtaken",
    isWinner:
      state === "closed-won-payment-due" || state === "closed-won-settled",
    isLoser: state === "closed-lost",
    isUnsold: state === "closed-unsold",
    statusLabel: opens ? "Opens" : closed ? "Result" : "Live",
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
    countdownFormat: opens ? "long" : "short",
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
            : LOT.currentBidMinor,
    bidCount:
      state === "live-no-bids" || state === "closed-unsold" ? 0 : LOT.bidCount,
    resultFact:
      state === "closed-unsold"
        ? "Unsold"
        : closed && !state.includes("unsold")
          ? `Sold · US$3,100`
          : undefined,
  };
}
