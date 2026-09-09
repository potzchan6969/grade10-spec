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
  watchingHeading: "Watching",
  biddingHeading: "Bidding",
  emptyTitle: "No lots yet",
  emptyDescription:
    "Watch a lot from its details page to come back to it here, or place a bid. Email alerts are optional.",
  browseCatalogue: "Browse auctions",
  openListing: "Open listing",
  openBidding: "Bid",
  currentBidLabel: "Current bid",
  closesAtLabel: "Closes",
};

const WATCH_COPY: WatchButtonCopy = {
  watch: "Watch",
  watching: "Watching",
  watchAriaLabel: "Watch this lot",
  unwatchAriaLabel: "Unwatch this lot",
};

const EMAIL_ALERTS_COPY: EmailAlertsCopy = {
  label: "Email alerts",
  onAriaLabel: "Turn off email alerts for this lot",
  offAriaLabel: "Turn on email alerts for this lot",
  disabledReason: "Auction email alerts are off in account notifications.",
  enabledToast: { title: "Email alerts on for this lot" },
  mutedToast: {
    title: "Email alerts off for this lot",
    description: "It stays on Watching.",
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
  currentBidLabel: AUCTION_RECORD_COPY.currentBidLabel,
  closesAtLabel: AUCTION_RECORD_COPY.closesAtLabel,
};

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
  stateLabel: "Ending soon",
  currentBid: "HK$4,800",
  closesAt: "9 Sep 2026, 21:00 HKT",
  href: "#lot-camera",
});

const WATCHING_POSTER = watchingItem({
  id: "poster",
  title: "Signed Tour Poster, 1/50",
  state: "live",
  stateLabel: "Open",
  currentBid: "HK$1,050",
  closesAt: "12 Sep 2026, 18:00 HKT",
  href: "#lot-poster",
});

const BIDDING_POSTER = biddingItem({
  id: "bid-poster",
  title: "Signed Tour Poster, 1/50",
  state: "outbid",
  stateLabel: "Outbid",
  currentBid: "HK$1,050",
  closesAt: "12 Sep 2026, 18:00 HKT",
  detail: "Next bid HK$1,100",
  href: "#lot-poster",
});

const BIDDING_CHARIZARD = biddingItem({
  id: "bid-charizard",
  title: "1999 Base Set Charizard PSA 9",
  state: "leading",
  stateLabel: "Leading",
  currentBid: "HK$12,800",
  closesAt: "17 Sep 2026, 21:00 HKT",
  href: "#lot-charizard",
});

export {
  AUCTION_RECORD_COPY,
  BIDDING_CHARIZARD,
  BIDDING_EMAIL_ALERTS_COPY,
  BIDDING_POSTER,
  biddingItem,
  EMAIL_ALERTS_COPY,
  IMAGE,
  ROW_COPY,
  WATCH_COPY,
  WATCHING_CAMERA,
  WATCHING_POSTER,
  watchingItem,
};
