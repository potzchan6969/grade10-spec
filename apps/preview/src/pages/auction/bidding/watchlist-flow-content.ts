import type { AuctionRecordRowProps } from "@grade10/ui";
import { POST_AUCTION_WATCHING } from "./my-auctions-content";

/** A watched lot still open for bids, built from the My Auctions watching row. */
const WATCHED_LIVE_LOT: AuctionRecordRowProps = {
  ...POST_AUCTION_WATCHING[0],
  id: "watch-live-lugia",
  title: "1998 Neo Genesis Lugia PSA 10",
  state: "live",
  stateLabel: "Live",
  currentBid: "US$4,800",
  closesAt: "Closes 26 Oct 2026, 18:00 HKT",
  emailAlerts: true,
  href: "#lot-lugia",
};

/** The same watched lot with its email alerts muted; the watch itself stays on. */
const WATCHED_ALERTS_MUTED: AuctionRecordRowProps = {
  ...WATCHED_LIVE_LOT,
  emailAlerts: false,
};

export { WATCHED_ALERTS_MUTED, WATCHED_LIVE_LOT };
