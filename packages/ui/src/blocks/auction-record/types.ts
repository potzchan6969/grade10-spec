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

export type AuctionRecordCopy = {
  title?: string;
  watching?: string;
  bidding?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  openListing?: string;
  state?: Partial<Record<AuctionRecordRowState, string>>;
};

export type AuctionRecordTabsProps = {
  activeTab: "watching" | "bidding";
  copy: Pick<AuctionRecordCopy, "watching" | "bidding">;
  onTabChange: (tab: "watching" | "bidding") => void;
  children?: ReactNode;
  className?: string;
};

export type AuctionRecordRowProps = {
  title: string;
  state: AuctionRecordRowState;
  stateLabel?: string;
  detail?: ReactNode;
  href?: string;
  bidPlaced?: boolean;
  copy?: Pick<AuctionRecordCopy, "openListing">;
  onOpen?: () => void;
  className?: string;
};

export type WatchingListProps = {
  items: readonly AuctionRecordRowProps[];
  copy?: AuctionRecordCopy;
  empty?: AuctionRecordEmptyProps;
  className?: string;
};

export type BiddingListProps = {
  items: readonly AuctionRecordRowProps[];
  copy?: AuctionRecordCopy;
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

export type WatchButtonCopy = {
  watch: string;
  unwatch: string;
  pending?: string;
};

export type WatchButtonProps = {
  watched: boolean;
  pending?: boolean;
  copy: WatchButtonCopy;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
};
