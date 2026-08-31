export type ListingBidHistoryRow = {
  id: string;
  /** Email or display label — avatar shows one initial via `avatarInitial`. */
  initials: string;
  amountMinor: number;
  relativeTime: string;
  leading?: boolean;
  isViewer?: boolean;
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
  countdownFormat: "short" | "long";
  /** Recorded close has moved past the listing's scheduled close. */
  extended: boolean;
  deadline?: string;
  standing: ListingAuctionStanding;
  viewerMaximumMinor?: number;
  minBidMinor: number;
  incrementMinor: number;
  suggestedMaxMinor: number;
  bidCountLabel: string;
  resultFact?: string;
};

export type ListingLotMetaBadge = {
  label: string;
};
