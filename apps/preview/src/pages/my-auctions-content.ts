import type { AuctionRecordRowProps } from "@grade10/ui";
import {
  storyHref,
  WINNER_ORDER_AWAITING_ADDRESS_STORY_ID,
  WINNER_ORDER_CANCELLED_STORY_ID,
  WINNER_ORDER_DELIVERED_STORY_ID,
  WINNER_ORDER_EXPIRED_INVOICE_STORY_ID,
  WINNER_ORDER_PENDING_PAYMENT_STORY_ID,
  WINNER_ORDER_PREPARING_INVOICE_STORY_ID,
  WINNER_ORDER_PROCESSING_STORY_ID,
  WINNER_ORDER_REFUNDED_STORY_ID,
  WINNER_ORDER_SHIPPED_STORY_ID,
} from "./workbench-story-nav";

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

const AUCTION_RECORD_COPY = {
  title: "My Auctions",
  auctionColumn: "Auction",
  currentBidColumn: "Current Bid",
  standingColumn: "Your Standing",
  emailAlertsColumn: "Email Alerts",
  noStanding: "--",
  emptyTitle: "No lots yet",
  emptyDescription:
    "Watch a lot to come back to it here, or place a bid. Email alerts are optional.",
  browseCatalogue: "Browse lots",
  openListing: "Open listing",
  openBidding: "Bid",
};

const ORDER_ROW_COPY = {
  openListing: "Open order",
  openBidding: AUCTION_RECORD_COPY.openBidding,
  noStanding: AUCTION_RECORD_COPY.noStanding,
  viewOrder: "View order",
};

const LISTING_ROW_COPY = {
  openListing: AUCTION_RECORD_COPY.openListing,
  openBidding: AUCTION_RECORD_COPY.openBidding,
  noStanding: AUCTION_RECORD_COPY.noStanding,
};

const BIDDING_EMAIL_ALERTS_COPY = {
  label: "Email alerts",
  onAriaLabel: "Turn off email alerts for this lot",
  offAriaLabel: "Turn on email alerts for this lot",
  mutedToast: {
    title: "Email alerts off for this lot",
    description: "Your bid stands.",
  },
  enabledToast: { title: "Email alerts on for this lot" },
};

function biddingItem(
  partial: Partial<AuctionRecordRowProps> &
    Pick<AuctionRecordRowProps, "title" | "state" | "id">,
): AuctionRecordRowProps {
  return {
    copy: LISTING_ROW_COPY,
    bidPlaced: true,
    emailAlerts: true,
    emailAlertsCopy: BIDDING_EMAIL_ALERTS_COPY,
    imageSrc: IMAGE,
    imageAlt: partial.title,
    ...partial,
  };
}

function watchingItem(
  partial: Partial<AuctionRecordRowProps> &
    Pick<AuctionRecordRowProps, "title" | "state" | "id">,
): AuctionRecordRowProps {
  return {
    copy: LISTING_ROW_COPY,
    watched: true,
    emailAlerts: true,
    emailAlertsCopy: {
      ...BIDDING_EMAIL_ALERTS_COPY,
      mutedToast: {
        title: "Email alerts off for this lot",
        description: "It stays on My Auctions.",
      },
    },
    watchCopy: {
      watch: "Watch",
      watching: "Watching",
      unwatch: "Unwatch",
      watchAriaLabel: "Watch this lot",
      unwatchAriaLabel: "Unwatch this lot",
    },
    imageSrc: IMAGE,
    imageAlt: partial.title,
    ...partial,
  };
}

/** Won rows — title opens the matching Winner Order story (PRD: opens the order). */
const WON_AWAITING_ADDRESS = biddingItem({
  id: "won-awaiting-address",
  title: "1999 Base Set Charizard PSA 9",
  state: "awaiting_address",
  stateLabel: "Awaiting Setup",
  currentBid: "HK$12,800",
  closesAt: "Ended 17 Sep 2026, 21:30 HKT",
  href: storyHref(WINNER_ORDER_AWAITING_ADDRESS_STORY_ID),
  copy: {
    ...ORDER_ROW_COPY,
    viewOrder: "Complete Order Setup",
  },
});

const WON_PREPARING_INVOICE = biddingItem({
  id: "won-preparing-invoice",
  title: "1998 Neo Genesis Lugia PSA 10",
  state: "preparing_invoice",
  stateLabel: "Preparing Invoice",
  currentBid: "HK$9,400",
  closesAt: "Ended 16 Sep 2026, 20:00 HKT",
  href: storyHref(WINNER_ORDER_PREPARING_INVOICE_STORY_ID),
  copy: ORDER_ROW_COPY,
});

const WON_PENDING_PAYMENT = biddingItem({
  id: "won-pending-payment",
  title: "2000 Skyridge Crystal Charizard PSA 9",
  state: "pending_payment",
  stateLabel: "Pending Payment",
  currentBid: "HK$21,500",
  closesAt: "Pay by 24 Sep 2026, 12:00 HKT",
  href: storyHref(WINNER_ORDER_PENDING_PAYMENT_STORY_ID),
  copy: ORDER_ROW_COPY,
});

const WON_EXPIRED = biddingItem({
  id: "won-expired",
  title: "1999 Fossil Dragonite Holo PSA 8",
  state: "expired",
  stateLabel: "Pending Payment",
  currentBid: "HK$3,600",
  closesAt: "Payment overdue",
  href: storyHref(WINNER_ORDER_EXPIRED_INVOICE_STORY_ID),
  copy: ORDER_ROW_COPY,
});

const WON_PROCESSING = biddingItem({
  id: "won-processing",
  title: "1999 Fossil Dragonite Holo PSA 9",
  state: "processing",
  stateLabel: "Processing",
  currentBid: "HK$4,200",
  closesAt: "Paid 18 Sep 2026",
  href: storyHref(WINNER_ORDER_PROCESSING_STORY_ID),
  copy: ORDER_ROW_COPY,
});

const WON_SHIPPED = biddingItem({
  id: "won-shipped",
  title: "2000 Skyridge Crobat Holo PSA 9",
  state: "shipped",
  stateLabel: "Shipped",
  currentBid: "HK$2,100",
  closesAt: "Shipped 20 Sep 2026",
  href: storyHref(WINNER_ORDER_SHIPPED_STORY_ID),
  copy: ORDER_ROW_COPY,
});

const WON_DELIVERED = biddingItem({
  id: "won-delivered",
  title: "1999 Base Set Blastoise PSA 8",
  state: "delivered",
  stateLabel: "Delivered",
  currentBid: "HK$6,800",
  closesAt: "Delivered 22 Sep 2026",
  href: storyHref(WINNER_ORDER_DELIVERED_STORY_ID),
  copy: ORDER_ROW_COPY,
});

const WON_CANCELLED = biddingItem({
  id: "won-cancelled",
  title: "1999 Jungle Scyther Holo PSA 9",
  state: "cancelled",
  stateLabel: "Cancelled",
  currentBid: "HK$1,200",
  closesAt: "Cancelled 19 Sep 2026",
  href: storyHref(WINNER_ORDER_CANCELLED_STORY_ID),
  copy: ORDER_ROW_COPY,
});

const WON_REFUNDED = biddingItem({
  id: "won-refunded",
  title: "1999 Fossil Kabutops Holo PSA 9",
  state: "refunded",
  stateLabel: "Refunded",
  currentBid: "HK$2,450",
  closesAt: "Refunded 21 Sep 2026",
  href: storyHref(WINNER_ORDER_REFUNDED_STORY_ID),
  copy: ORDER_ROW_COPY,
});

const DIDNT_WIN_HOLD_RELEASING = biddingItem({
  id: "didnt-win-releasing",
  title: "1999 Jungle Flareon Holo PSA 8",
  state: "hold_releasing",
  stateLabel: "Didn’t win",
  currentBid: "HK$1,850",
  closesAt: "Ended 15 Sep 2026, 19:00 HKT",
  href: "#lot-flareon",
});

const LEADING = biddingItem({
  id: "bid-charizard-live",
  title: "1999 Base Set Venusaur PSA 9",
  state: "leading",
  stateLabel: "Leading",
  currentBid: "HK$5,400",
  closesAt: "Closes 25 Sep 2026, 21:00 HKT",
  href: "#lot-venusaur",
});

const WATCHING_ENDED = watchingItem({
  id: "watch-ended",
  title: "1986 World Cup Panini Sticker Album",
  state: "ended",
  stateLabel: "Ended",
  currentBid: "HK$320",
  closesAt: "Ended 8 Sep 2026, 21:00 HKT",
  href: "#lot-sticker-album",
});

const POST_AUCTION_BIDDING: readonly AuctionRecordRowProps[] = [
  WON_AWAITING_ADDRESS,
  WON_PREPARING_INVOICE,
  WON_PENDING_PAYMENT,
  WON_EXPIRED,
  WON_PROCESSING,
  WON_SHIPPED,
  WON_DELIVERED,
  WON_CANCELLED,
  WON_REFUNDED,
  DIDNT_WIN_HOLD_RELEASING,
  LEADING,
];

const POST_AUCTION_WATCHING: readonly AuctionRecordRowProps[] = [
  WATCHING_ENDED,
];

export {
  AUCTION_RECORD_COPY,
  POST_AUCTION_BIDDING,
  POST_AUCTION_WATCHING,
  WON_AWAITING_ADDRESS,
  WON_CANCELLED,
  WON_DELIVERED,
  WON_EXPIRED,
  WON_PENDING_PAYMENT,
  WON_PREPARING_INVOICE,
  WON_PROCESSING,
  WON_REFUNDED,
  WON_SHIPPED,
};
