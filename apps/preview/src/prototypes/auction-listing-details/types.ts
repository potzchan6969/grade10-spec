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

export type BidHistoryRow = {
  initials: string;
  amountMinor: number;
  relativeTime: string;
  leading?: boolean;
  isViewer?: boolean;
};

export type LotFixture = {
  title: string;
  listingNumber: string;
  saleName: string;
  category: string;
  description: string;
  images: readonly { src: string; alt: string }[];
  startingBidMinor: number;
  currentBidMinor: number;
  incrementMinor: number;
  bidCount: number;
  viewerMaximumMinor?: number;
  currency: string;
};

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
