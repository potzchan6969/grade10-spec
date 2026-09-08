export type ListingBidHistoryRow = {
  id: string;
  /** Email or display label — avatar shows one initial via `avatarInitial`. */
  initials: string;
  amountMinor: number;
  acceptedAtMs: number;
  timeOverride?: string;
  isViewer?: boolean;
};

export type ListingUserBidHistoryRow = {
  id: string;
  amountLabel: string;
  acceptedAtMs: number;
  timeOverride?: string;
};

export type ListingLotGalleryImage = {
  src: string;
  alt: string;
};

export type ListingAuctionStanding =
  | "none"
  | "won-payment-due"
  | "won-settled"
  | "lost"
  | "outbid"
  | "leading-max"
  | "leading-manual";

/** Normalized bid-panel presentation the consumer derives from product state. */
export type ListingAuctionBidView = {
  /** ISO 4217 currency for every amount on this listing. */
  currency: string;
  headerLabel: string;
  live: boolean;
  opens: boolean;
  closed: boolean;
  hasBids: boolean;
  isUnsold: boolean;
  showBidActions: boolean;
  priceLabel: string;
  currentBidMinor: number;
  bidCount: number;
  countdown: string;
  countdownSeconds: number | null;
  /** When set, the countdown ticks against this instant instead of decrementing locally. */
  closesAtMs?: number | null;
  /** Instant for the collector deadline line under the countdown. */
  deadlineAtMs?: number | null;
  /**
   * When the lot opened for bidding. With `deadlineAtMs` on a closed lot, the
   * time block shows the close date as the primary value and a single subtext
   * line with the close time and how long the auction ran.
   */
  opensAtMs?: number | null;
  countdownFormat: "short" | "long";
  /** Recorded close has moved past the listing's scheduled close. */
  extended: boolean;
  /** @deprecated Prefer formatting from `deadlineAtMs` in the bid card. */
  deadline?: string;
  standing: ListingAuctionStanding;
  viewerMaximumMinor?: number;
  minBidMinor: number;
  incrementMinor: number;
  suggestedMaxMinor: number;
  bidCountLabel: string;
};

/** How far the collector has progressed through bid enrollment on this listing. */
export type BidEnrollment = "signed-out" | "needs-card" | "ready";

export type ListingLotMetaBadge = {
  label: string;
};
