import type {
  AuctionRecordCopy,
  AuctionRecordRowProps,
  EmailAlertsCopy,
  WatchButtonCopy,
} from "./types";

const IMAGE = new URL(
  "../store-order-history/product.fixture.png",
  import.meta.url,
).href;

const AUCTION_RECORD_COPY: AuctionRecordCopy = {
  title: "My Auctions",
  auctionColumn: "Auction",
  currentBidColumn: "Current Bid",
  standingColumn: "Status",
  emailAlertsColumn: "Email Alerts",
  noStanding: "--",
  watchingHeading: "Watching",
  biddingHeading: "Bidding",
  emptyTitle: "No lots yet",
  emptyDescription:
    "Watch a lot to come back to it here, or place a bid. Email alerts are optional.",
  browseCatalogue: "Browse lots",
  openListing: "Open listing",
  openBidding: "Bid",
};

const WATCH_COPY: WatchButtonCopy = {
  watch: "Watch",
  watching: "Watching",
  unwatch: "Unwatch",
  watchAriaLabel: "Watch this lot",
  unwatchAriaLabel: "Unwatch this lot",
  watchedToast: {
    title: "Email alerts on for this lot",
    actionLabel: "View My Auctions",
  },
  unwatchedToast: {
    title: "Unwatched this lot",
    description: "Email alerts for this lot are off too.",
    actionLabel: "Undo",
  },
};

const EMAIL_ALERTS_COPY: EmailAlertsCopy = {
  label: "Email alerts",
  onAriaLabel: "Turn off email alerts for this lot",
  offAriaLabel: "Turn on email alerts for this lot",
  disabledReason: "Auction email alerts are off in account notifications.",
  enabledToast: { title: "Email alerts on for this lot" },
  mutedToast: {
    title: "Email alerts off for this lot",
    description: "It stays on My Auctions.",
  },
};

/** Same copy, worded for a lot the collector has bid on rather than watched. */
const BIDDING_EMAIL_ALERTS_COPY: EmailAlertsCopy = {
  ...EMAIL_ALERTS_COPY,
  mutedToast: {
    title: "Email alerts off for this lot",
    description: "Your bid stands.",
  },
};

const ROW_COPY = {
  openListing: AUCTION_RECORD_COPY.openListing,
  openBidding: AUCTION_RECORD_COPY.openBidding,
  noStanding: AUCTION_RECORD_COPY.noStanding,
};

/** Won-row copy — title + actions-column CTA open Winner Order. */
const ORDER_ROW_COPY = {
  ...ROW_COPY,
  openListing: "Open order",
  viewOrder: "View order",
};

/**
 * Workbench story paths for Won → Winner Order. Same ids as
 * `apps/preview/.../workbench-story-nav.ts` so the compound My Auctions
 * stories deep-link in `pnpm storybook:workbench`.
 */
const WINNER_ORDER_HREF = {
  awaitingAddress:
    "?path=/story/my-auctions-winner-order-settlement--awaiting-address",
  expiredSetup:
    "?path=/story/my-auctions-winner-order-settlement--expired-setup",
  preparingInvoice:
    "?path=/story/my-auctions-winner-order-settlement--preparing-invoice",
  pendingPayment:
    "?path=/story/my-auctions-winner-order-payment--pending-payment",
  expiredInvoice:
    "?path=/story/my-auctions-winner-order-payment--expired-invoice",
  partiallyPaid:
    "?path=/story/my-auctions-winner-order-payment--partially-paid",
  paymentVerifying:
    "?path=/story/my-auctions-winner-order-payment--payment-verifying",
  processing: "?path=/story/my-auctions-winner-order-delivery--processing",
  shipped: "?path=/story/my-auctions-winner-order-delivery--shipped",
  delivered: "?path=/story/my-auctions-winner-order-delivery--delivered",
  cancelled: "?path=/story/my-auctions-winner-order-closed--cancelled",
  refunded: "?path=/story/my-auctions-winner-order-closed--refunded",
} as const;

function watchingItem(
  partial: Partial<AuctionRecordRowProps> &
    Pick<AuctionRecordRowProps, "title" | "state" | "id">,
): AuctionRecordRowProps {
  return {
    copy: ROW_COPY,
    watchCopy: WATCH_COPY,
    watched: true,
    emailAlerts: true,
    emailAlertsCopy: EMAIL_ALERTS_COPY,
    imageSrc: IMAGE,
    imageAlt: partial.title,
    ...partial,
  };
}

function biddingItem(
  partial: Partial<AuctionRecordRowProps> &
    Pick<AuctionRecordRowProps, "title" | "state" | "id">,
): AuctionRecordRowProps {
  return {
    copy: ROW_COPY,
    bidPlaced: true,
    emailAlerts: true,
    emailAlertsCopy: BIDDING_EMAIL_ALERTS_COPY,
    imageSrc: IMAGE,
    imageAlt: partial.title,
    ...partial,
  };
}

const WATCHING_CAMERA = watchingItem({
  id: "cam",
  title: "1994 Vintage Rangefinder Camera",
  state: "ending_soon",
  currentBid: "HK$4,800",
  closesAt: "Closes 9 Sep 2026, 21:00 HKT",
  href: "#lot-camera",
});

const WATCHING_POSTER = watchingItem({
  id: "poster",
  title: "Signed Tour Poster, 1/50",
  state: "live",
  currentBid: "HK$1,050",
  closesAt: "Closes 12 Sep 2026, 18:00 HKT",
  href: "#lot-poster",
});

/** Watched lot that closed with no winner — external status Ended, still listed. */
const WATCHING_ENDED = watchingItem({
  id: "watch-ended",
  title: "1986 World Cup Panini Sticker Album",
  state: "ended",
  stateLabel: "Ended",
  currentBid: "HK$320",
  closesAt: "Ended 8 Sep 2026, 21:00 HKT",
  href: "#lot-sticker-album",
});

const BIDDING_POSTER = biddingItem({
  id: "bid-poster",
  title: "Signed Tour Poster, 1/50",
  state: "outbid",
  stateLabel: "Outbid",
  currentBid: "HK$1,050",
  closesAt: "Closes 12 Sep 2026, 18:00 HKT",
  href: "#lot-poster",
});
const BIDDING_CHARIZARD = biddingItem({
  id: "bid-charizard",
  title: "1999 Base Set Charizard PSA 9",
  state: "leading",
  stateLabel: "Leading",
  currentBid: "HK$12,800",
  closesAt: "Closes 17 Sep 2026, 21:00 HKT",
  href: "#lot-charizard",
});

/** Bid on a lot that closed with no winner — stays listed; standing Didn’t win. */
const BIDDING_ENDED = biddingItem({
  id: "bid-ended",
  title: "1977 Star Wars Topps Wax Pack",
  state: "hold_released",
  stateLabel: "Didn’t win",
  currentBid: "HK$890",
  closesAt: "Ended 7 Sep 2026, 18:00 HKT",
  href: "#lot-wax-pack",
});

/** Won — setup-first standing vocabulary. */
const BIDDING_WON_AWAITING_ADDRESS = biddingItem({
  id: "won-awaiting-address",
  title: "1999 Base Set Charizard PSA 9",
  state: "awaiting_address",
  stateLabel: "Awaiting Setup",
  currentBid: "HK$12,800",
  closesAt: "Confirm by 19 Sep 2026, 21:30 HKT",
  href: WINNER_ORDER_HREF.awaitingAddress,
  copy: ORDER_ROW_COPY,
});

/** Setup deadline passed — Contact Us on Winner Order; status stays setup. */
const BIDDING_WON_SETUP_OVERDUE = biddingItem({
  id: "won-setup-overdue",
  title: "1999 Base Set Venusaur PSA 8",
  state: "awaiting_address_expired",
  stateLabel: "Setup Overdue",
  currentBid: "HK$4,800",
  closesAt: "Setup overdue",
  href: WINNER_ORDER_HREF.expiredSetup,
  copy: ORDER_ROW_COPY,
});

const BIDDING_WON_PREPARING_INVOICE = biddingItem({
  id: "won-preparing-invoice",
  title: "1998 Neo Genesis Lugia PSA 10",
  state: "preparing_invoice",
  stateLabel: "Preparing Invoice",
  currentBid: "HK$9,400",
  closesAt: "Ended 16 Sep 2026, 20:00 HKT",
  href: WINNER_ORDER_HREF.preparingInvoice,
  copy: ORDER_ROW_COPY,
});

const BIDDING_WON_PENDING_PAYMENT = biddingItem({
  id: "won-pending-payment",
  title: "2000 Skyridge Crystal Charizard PSA 9",
  state: "pending_payment",
  stateLabel: "Pending Payment",
  currentBid: "HK$21,500",
  closesAt: "Pay by 24 Sep 2026, 12:00 HKT",
  href: WINNER_ORDER_HREF.pendingPayment,
  copy: ORDER_ROW_COPY,
});

/** Bank-transfer proof under check — deadline paused on Winner Order. */
const BIDDING_WON_PAYMENT_VERIFYING = biddingItem({
  id: "won-payment-verifying",
  title: "1999 Neo Destiny Dark Tyranitar PSA 9",
  state: "payment_verifying",
  stateLabel: "Payment Verifying",
  currentBid: "HK$7,200",
  closesAt: "Proof under review",
  href: WINNER_ORDER_HREF.paymentVerifying,
  copy: ORDER_ROW_COPY,
});

/** Payment deadline passed — Contact Us on Winner Order; invoice stays pending. */
const BIDDING_WON_EXPIRED = biddingItem({
  id: "won-expired",
  title: "1999 Fossil Dragonite Holo PSA 8",
  state: "expired",
  stateLabel: "Payment Overdue",
  currentBid: "HK$3,600",
  closesAt: "Payment overdue",
  href: WINNER_ORDER_HREF.expiredInvoice,
  copy: ORDER_ROW_COPY,
});

const BIDDING_WON_PARTIALLY_PAID = biddingItem({
  id: "won-partially-paid",
  title: "1999 Jungle Vaporeon Holo PSA 9",
  state: "partially_paid",
  stateLabel: "Partially Paid",
  currentBid: "HK$5,100",
  closesAt: "Payment in progress",
  href: WINNER_ORDER_HREF.partiallyPaid,
  copy: ORDER_ROW_COPY,
});

const BIDDING_WON_PROCESSING = biddingItem({
  id: "won-processing",
  title: "1999 Fossil Dragonite Holo PSA 9",
  state: "processing",
  stateLabel: "Processing",
  currentBid: "HK$4,200",
  closesAt: "Paid 18 Sep 2026",
  href: WINNER_ORDER_HREF.processing,
  copy: ORDER_ROW_COPY,
});

const BIDDING_WON_SHIPPED = biddingItem({
  id: "won-shipped",
  title: "2000 Skyridge Crobat Holo PSA 9",
  state: "shipped",
  stateLabel: "Shipped",
  currentBid: "HK$2,100",
  closesAt: "Shipped 20 Sep 2026",
  href: WINNER_ORDER_HREF.shipped,
  copy: ORDER_ROW_COPY,
});

const BIDDING_WON_DELIVERED = biddingItem({
  id: "won-delivered",
  title: "1999 Base Set Blastoise PSA 8",
  state: "delivered",
  stateLabel: "Delivered",
  currentBid: "HK$6,800",
  closesAt: "Delivered 22 Sep 2026",
  href: WINNER_ORDER_HREF.delivered,
  copy: ORDER_ROW_COPY,
});

const BIDDING_WON_CANCELLED = biddingItem({
  id: "won-cancelled",
  title: "1999 Jungle Scyther Holo PSA 9",
  state: "cancelled",
  stateLabel: "Cancelled",
  currentBid: "HK$1,200",
  closesAt: "Cancelled 19 Sep 2026",
  href: WINNER_ORDER_HREF.cancelled,
  copy: ORDER_ROW_COPY,
});

const BIDDING_WON_REFUNDED = biddingItem({
  id: "won-refunded",
  title: "1999 Fossil Kabutops Holo PSA 9",
  state: "refunded",
  stateLabel: "Refunded",
  currentBid: "HK$2,450",
  closesAt: "Refunded 21 Sep 2026",
  href: WINNER_ORDER_HREF.refunded,
  copy: ORDER_ROW_COPY,
});

const BIDDING_DIDNT_WIN_HOLD_RELEASING = biddingItem({
  id: "didnt-win-releasing",
  title: "1999 Jungle Flareon Holo PSA 8",
  state: "hold_releasing",
  stateLabel: "Didn’t win",
  currentBid: "HK$1,850",
  closesAt: "Ended 15 Sep 2026, 19:00 HKT",
  href: "#lot-flareon",
});

export {
  AUCTION_RECORD_COPY,
  BIDDING_CHARIZARD,
  BIDDING_DIDNT_WIN_HOLD_RELEASING,
  BIDDING_EMAIL_ALERTS_COPY,
  BIDDING_ENDED,
  BIDDING_POSTER,
  BIDDING_WON_AWAITING_ADDRESS,
  BIDDING_WON_CANCELLED,
  BIDDING_WON_DELIVERED,
  BIDDING_WON_EXPIRED,
  BIDDING_WON_PARTIALLY_PAID,
  BIDDING_WON_PAYMENT_VERIFYING,
  BIDDING_WON_PENDING_PAYMENT,
  BIDDING_WON_PREPARING_INVOICE,
  BIDDING_WON_PROCESSING,
  BIDDING_WON_REFUNDED,
  BIDDING_WON_SETUP_OVERDUE,
  BIDDING_WON_SHIPPED,
  biddingItem,
  EMAIL_ALERTS_COPY,
  IMAGE,
  ORDER_ROW_COPY,
  ROW_COPY,
  WATCH_COPY,
  WATCHING_CAMERA,
  WATCHING_ENDED,
  WATCHING_POSTER,
  WINNER_ORDER_HREF,
  watchingItem,
};
