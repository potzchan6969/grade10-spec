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
  | "hold_released";

export type WatchButtonCopy = {
  watch: string;
  watching: string;
  watchAriaLabel: string;
  unwatchAriaLabel: string;
  pending?: string;
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
  className?: string;
};

export type AuctionRecordCopy = {
  title: string;
  watchingHeading: string;
  biddingHeading: string;
  emptyTitle: string;
  emptyDescription: string;
  browseCatalogue: string;
  openListing?: string;
  openBidding?: string;
  /** Label above a row's current bid. Absent renders the amount alone. */
  currentBidLabel?: string;
  /** Label above a row's close. Absent renders the time alone. */
  closesAtLabel?: string;
  state?: Partial<Record<AuctionRecordRowState, string>>;
};

export type AuctionRecordRowCopy = Pick<
  AuctionRecordCopy,
  "openListing" | "openBidding" | "currentBidLabel" | "closesAtLabel"
>;

/** @deprecated Prefer AuctionRecord page sections; kept for transitional imports. */
export type AuctionRecordTabsProps = {
  activeTab: "watching" | "bidding";
  copy: Pick<AuctionRecordCopy, "watchingHeading" | "biddingHeading"> & {
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

export type WatchingListProps = {
  items: readonly AuctionRecordRowProps[];
  empty?: AuctionRecordEmptyProps;
  className?: string;
};

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
