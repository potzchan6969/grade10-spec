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
  standingColumn: "Your Standing",
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
