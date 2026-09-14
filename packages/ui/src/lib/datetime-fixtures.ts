import type { ActivityTimeCopy } from "./format-datetime";
import {
  formatDay,
  formatDeadline,
  formatListingClosed,
  formatListingOpens,
  formatMoment,
} from "./format-datetime";

export const FIXTURE_SHIPPED_LOCALE = "en" as const;
export const FIXTURE_TIME_ZONE = "Asia/Hong_Kong";
export const FIXTURE_NOW_MS = Date.UTC(2026, 7, 21, 12, 0);

export const FIXTURE_ACTIVITY_TIME_COPY: ActivityTimeCopy = {
  justNow: "Just now",
  secondsAgo: "{count, plural, one {# sec ago} other {# sec ago}}",
  minutesAgo: "{count, plural, one {# min ago} other {# min ago}}",
  hoursAgo: "{count, plural, one {# hr ago} other {# hr ago}}",
  daysAgo: "{count, plural, one {# day ago} other {# days ago}}",
};

export const FIXTURE_AUCTION_ENDS_AT_MS = Date.UTC(2026, 8, 1, 18, 0);
export const FIXTURE_AUCTION_OPENS_AT_MS = Date.UTC(2026, 7, 22, 18, 0);
export const FIXTURE_AUCTION_CLOSED_AT_MS = Date.UTC(2026, 7, 30, 9, 15);
export const FIXTURE_BID_LANDED_AT_MS = Date.UTC(2026, 7, 21, 11, 16);
export const FIXTURE_ORDER_PLACED_AT_MS = Date.UTC(2026, 7, 26);
export const FIXTURE_ORDER_SHIPPED_AT_MS = Date.UTC(2026, 7, 27);
export const FIXTURE_REFUND_AT_MS = Date.UTC(2026, 7, 28);
export const FIXTURE_MEMBER_FIRST_USE_AT_MS = Date.UTC(2026, 7, 24, 20, 41);
export const FIXTURE_LOYALTY_PURCHASE_AT_MS = Date.UTC(2026, 7, 18);
export const FIXTURE_LOYALTY_REDEEM_AT_MS = Date.UTC(2026, 7, 2);
export const FIXTURE_LOYALTY_ADJUST_AT_MS = Date.UTC(2026, 6, 28);
export const FIXTURE_BALANCE_EXPIRY_AT_MS = Date.UTC(2027, 7, 18);
export const FIXTURE_BALANCE_EXPIRY_SOON_AT_MS = Date.UTC(2026, 8, 9);
export const FIXTURE_TIER_RENEWAL_AT_MS = Date.UTC(2027, 2, 1);
export const FIXTURE_MEMBER_SINCE_AT_MS = Date.UTC(2024, 2, 12);

export const FIXTURE_AUCTION_DEADLINE = formatDeadline(
  FIXTURE_AUCTION_ENDS_AT_MS,
);
export const FIXTURE_AUCTION_OPENS_DEADLINE = formatDeadline(
  FIXTURE_AUCTION_OPENS_AT_MS,
);
export const FIXTURE_AUCTION_CLOSED = formatListingClosed(
  FIXTURE_AUCTION_CLOSED_AT_MS,
);
export const FIXTURE_AUCTION_OPENS = formatListingOpens(
  FIXTURE_AUCTION_OPENS_AT_MS,
);
export const FIXTURE_BID_LANDED_AT = formatMoment(FIXTURE_BID_LANDED_AT_MS);
export const FIXTURE_ORDER_PLACED_DAY = formatDay(FIXTURE_ORDER_PLACED_AT_MS);
export const FIXTURE_ORDER_SHIPPED_DAY = formatDay(FIXTURE_ORDER_SHIPPED_AT_MS);
export const FIXTURE_REFUND_DAY = formatDay(FIXTURE_REFUND_AT_MS);
export const FIXTURE_MEMBER_FIRST_USE_AT = formatMoment(
  FIXTURE_MEMBER_FIRST_USE_AT_MS,
);
export const FIXTURE_PLACED_ON = `Placed on ${FIXTURE_ORDER_PLACED_DAY}`;
export const FIXTURE_PLACED_ON_WITH_PERIOD = `Placed on ${FIXTURE_ORDER_PLACED_DAY}.`;
export const FIXTURE_BALANCE_EXPIRY_DAY = formatDay(
  FIXTURE_BALANCE_EXPIRY_AT_MS,
);
export const FIXTURE_BALANCE_EXPIRY_SOON_DAY = formatDay(
  FIXTURE_BALANCE_EXPIRY_SOON_AT_MS,
);
export const FIXTURE_TIER_RENEWAL_DAY = formatDay(FIXTURE_TIER_RENEWAL_AT_MS);
export const FIXTURE_MEMBER_SINCE = `Member since ${formatDay(FIXTURE_MEMBER_SINCE_AT_MS)}`;
export const FIXTURE_LOYALTY_PURCHASE_DAY = formatDay(
  FIXTURE_LOYALTY_PURCHASE_AT_MS,
);
export const FIXTURE_LOYALTY_REDEEM_DAY = formatDay(
  FIXTURE_LOYALTY_REDEEM_AT_MS,
);
export const FIXTURE_LOYALTY_ADJUST_DAY = formatDay(
  FIXTURE_LOYALTY_ADJUST_AT_MS,
);
export const FIXTURE_REFUND_MESSAGE = `Out of stock. Refund issued on ${FIXTURE_REFUND_DAY}`;
export const FIXTURE_CANCELED_MESSAGE = `Canceled by customer on ${FIXTURE_REFUND_DAY}`;

/** Bid moments for the live-bidding demo script. */
export const FIXTURE_LIVE_BID_AT_MS = [
  Date.UTC(2026, 7, 21, 11, 0),
  Date.UTC(2026, 7, 21, 11, 2),
  Date.UTC(2026, 7, 21, 11, 4),
  Date.UTC(2026, 7, 21, 11, 8),
  Date.UTC(2026, 7, 21, 11, 12),
  Date.UTC(2026, 7, 21, 11, 16),
] as const;
