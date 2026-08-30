import type { BiddingState, BidHistoryRow, LotFixture } from "./types";

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
    initials: "JD",
    amountMinor: 480_000,
    relativeTime: "2 min ago",
    leading: true,
    isViewer: true,
  },
  {
    initials: "MK",
    amountMinor: 455_000,
    relativeTime: "6 min ago",
  },
  {
    initials: "AR",
    amountMinor: 430_000,
    relativeTime: "12 min ago",
  },
];

export const EXTENSION_TOOLTIP =
  "Bids placed in the final 30 minutes extend the auction by 30 minutes, up to the listing extension cap.";

export const BUYER_FEE_HINT = "Buyer's premium is added at invoice.";

export function bidHistoryForState(state: BiddingState): BidHistoryRow[] {
  if (!stateMeta(state).hasBids) return [];

  if (state === "live-auto-overtaken") {
    return [
      {
        initials: "MK",
        amountMinor: 825_000,
        relativeTime: "1 min ago",
        leading: true,
      },
      {
        initials: "JD",
        amountMinor: 800_000,
        relativeTime: "5 min ago",
        isViewer: true,
      },
      {
        initials: "AR",
        amountMinor: 775_000,
        relativeTime: "10 min ago",
      },
    ];
  }

  if (state.startsWith("closed")) {
    return [
      {
        initials: "MK",
        amountMinor: 310_000,
        relativeTime: "Closed",
        leading: true,
      },
      {
        initials: "JD",
        amountMinor: 295_000,
        relativeTime: "Closed",
        isViewer: state === "closed-lost",
      },
    ];
  }

  return BID_HISTORY;
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
