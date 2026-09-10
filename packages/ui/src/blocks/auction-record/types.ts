import type { ReactNode } from "react";

export type AuctionRecordRowState =
  | "scheduled"
  | "live"
  | "ending_soon"
  | "ended"
  | "leading"
  | "outbid"
  | "bid_submitted"
  | "bid_not_accepted"
  | "awaiting_payment"
  | "payment_problem"
  | "paid"
  | "shipped"
  | "delivered"
  | "hold_releasing"
  | "hold_released"
  | "pending_payment"
  | "expired"
  | "processing"
  | "cancelled"
  | "refunded";

export type WatchToastCopy = {
  title: string;
  description?: string;
  /** Nested toast action — View My Auctions on watch, Undo on unwatch. */
  actionLabel?: string;
};

export type WatchButtonCopy = {
  watch: string;
  watching: string;
  /** Label on the My Auctions Unwatch button (trash + text). */
  unwatch?: string;
  watchAriaLabel: string;
  unwatchAriaLabel: string;
  pending?: string;
  /** Toast once the application confirms watched. */
  watchedToast?: WatchToastCopy;
  /** Toast once the application confirms unwatched. */
  unwatchedToast?: WatchToastCopy;
};

export type EmailAlertsToastCopy = {
  title: string;
  description?: string;
};

export type EmailAlertsCopy = {
  label: string;
  onAriaLabel: string;
  offAriaLabel: string;
  /** Shown when the account master has turned auction email alerts off. */
  disabledReason?: string;
  /** Toast once the consumer confirms alerts went on for this lot. */
  enabledToast?: EmailAlertsToastCopy;
  /** Toast once the consumer confirms alerts went off for this lot. */
  mutedToast?: EmailAlertsToastCopy;
};

export type WatchButtonProps = {
  watched: boolean;
  pending?: boolean;
  copy: WatchButtonCopy;
  onPress: () => void;
  disabled?: boolean;
  /**
   * Bid stands on the lot — show Watching disabled and do not report press.
   * Distinct from a transient `disabled` / pending lock.
   */
  locked?: boolean;
  /** Toast action when watch is confirmed (opens My Auctions). */
  onWatchedToastAction?: () => void;
  /** Toast action when unwatch is confirmed (Undo). */
  onUnwatchedToastAction?: () => void;
  className?: string;
};

export type AuctionRecordCopy = {
  title: string;
  /** Table column: listing identity. */
  auctionColumn: string;
  /** Table column: current bid amount. */
  currentBidColumn: string;
  /** Table column: bidder standing. */
  standingColumn: string;
  /** Table column: email alerts switch. */
  emailAlertsColumn: string;
  /** Your Standing when the collector has not bid. */
  noStanding: string;
  /** @deprecated Prefer one-table My Auctions; kept for AuctionRecordTabs. */
  watchingHeading?: string;
  /** @deprecated Prefer one-table My Auctions; kept for AuctionRecordTabs. */
  biddingHeading?: string;
  emptyTitle: string;
  emptyDescription: string;
  browseCatalogue: string;
  openListing?: string;
  openBidding?: string;
  /** @deprecated Close sits under the title in the table row. */
  currentBidLabel?: string;
  /** @deprecated Close sits under the title in the table row. */
  closesAtLabel?: string;
  state?: Partial<Record<AuctionRecordRowState, string>>;
};

export type AuctionRecordRowCopy = Pick<
  AuctionRecordCopy,
  "openListing" | "openBidding" | "noStanding"
>;

/** @deprecated Prefer AuctionRecord one-table page; kept for transitional imports. */
export type AuctionRecordTabsProps = {
  activeTab: "watching" | "bidding";
  copy: {
    watchingHeading?: string;
    biddingHeading?: string;
    watching?: string;
    bidding?: string;
  };
  onTabChange: (tab: "watching" | "bidding") => void;
  children?: ReactNode;
  className?: string;
};

export type AuctionRecordRowProps = {
  title: string;
  state: AuctionRecordRowState;
  stateLabel?: string;
  detail?: ReactNode;
  currentBid?: ReactNode;
  closesAt?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  /** True when the collector has bid — Unwatch is omitted. */
  bidPlaced?: boolean;
  biddingHref?: string;
  onOpenBidding?: () => void;
  copy?: AuctionRecordRowCopy;
  onOpen?: () => void;
  watched?: boolean;
  watchPending?: boolean;
  watchCopy?: WatchButtonCopy;
  onWatchToggle?: () => void;
  emailAlerts?: boolean;
  emailAlertsPending?: boolean;
  emailAlertsDisabled?: boolean;
  emailAlertsCopy?: EmailAlertsCopy;
  onEmailAlertsChange?: (enabled: boolean) => void;
  className?: string;
  id?: string;
};

/** @deprecated Prefer composing AuctionRecord; kept for transitional imports. */
export type WatchingListProps = {
  items: readonly AuctionRecordRowProps[];
  empty?: AuctionRecordEmptyProps;
  className?: string;
};

/** @deprecated Prefer composing AuctionRecord; kept for transitional imports. */
export type BiddingListProps = {
  items: readonly AuctionRecordRowProps[];
  empty?: AuctionRecordEmptyProps;
  className?: string;
};

export type AuctionRecordEmptyProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export type AuctionRecordProps = {
  copy: AuctionRecordCopy;
  breadcrumbs?: ReactNode;
  watchingItems?: readonly AuctionRecordRowProps[];
  biddingItems?: readonly AuctionRecordRowProps[];
  onBrowseCatalogue?: () => void;
  className?: string;
};
