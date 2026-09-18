/** Storybook story id for a closed won Auction Lot Details assembly. */
const AUCTION_LOT_DETAILS_CLOSED_WON_STORY_ID =
  "pages-auction-lot-details--closed-won-payment-due";

/** Storybook story id for the filled Order History page assembly. */
const ORDER_HISTORY_STORY_ID = "pages-order-history-page--filled";

/** Storybook story id for the filled Order Details page assembly. */
const ORDER_DETAILS_STORY_ID = "pages-order-details-page--filled";

/** Storybook story id for the Store Locator page assembly. */
const STORE_LOCATOR_STORY_ID = "pages-store-locator-page--default";

/** Storybook story id for the My Auctions page assembly (list → Winner Order). */
const MY_AUCTIONS_PAGE_STORY_ID = "pages-my-auctions-page--post-auction";

/** Winner Order story ids — one per derived standing a Won row may open. */
const WINNER_ORDER_AWAITING_ADDRESS_STORY_ID =
  "my-auctions-winner-order-settlement--awaiting-address";
const WINNER_ORDER_EXPIRED_SETUP_STORY_ID =
  "my-auctions-winner-order-settlement--expired-setup";
const WINNER_ORDER_PREPARING_INVOICE_STORY_ID =
  "my-auctions-winner-order-settlement--preparing-invoice";
const WINNER_ORDER_PENDING_PAYMENT_STORY_ID =
  "my-auctions-winner-order-payment--pending-payment";
const WINNER_ORDER_PAYMENT_VERIFYING_STORY_ID =
  "my-auctions-winner-order-payment--payment-verifying";
const WINNER_ORDER_EXPIRED_INVOICE_STORY_ID =
  "my-auctions-winner-order-payment--expired-invoice";
const WINNER_ORDER_PARTIALLY_PAID_STORY_ID =
  "my-auctions-winner-order-payment--partially-paid";
const WINNER_ORDER_PROCESSING_STORY_ID =
  "my-auctions-winner-order-delivery--processing";
const WINNER_ORDER_SHIPPED_STORY_ID =
  "my-auctions-winner-order-delivery--shipped";
const WINNER_ORDER_DELIVERED_STORY_ID =
  "my-auctions-winner-order-delivery--delivered";
const WINNER_ORDER_CANCELLED_STORY_ID =
  "my-auctions-winner-order-closed--cancelled";
const WINNER_ORDER_REFUNDED_STORY_ID =
  "my-auctions-winner-order-closed--refunded";
const WINNER_ORDER_REFUND_DETAILS_STORY_ID =
  "my-auctions-winner-order-refund-details--closing-refund";

/** Manager href that opens a story in the workbench (`?path=/story/…`). */
function storyHref(storyId: string): string {
  return `?path=/story/${storyId}`;
}

/** Chrome destination for Store Locator once the page story exists. */
const STORE_LOCATOR_HREF = storyHref(STORE_LOCATOR_STORY_ID);

/** TBC — provisional docs host for collector Help in the primary nav. */
const HELP_HREF = "https://grade10.mintlify.io/";

/** Primary-nav Help; after Store Locator when present, else after Auction. */
const HELP_NAV_ITEM = {
  label: "Help",
  href: HELP_HREF,
  external: true,
} as const;

/** Preview href for Winner Order → lot details. */
const AUCTION_LOT_DETAILS_HREF = storyHref(
  AUCTION_LOT_DETAILS_CLOSED_WON_STORY_ID,
);

/** Preview href for Winner Order → My Auctions list. */
const MY_AUCTIONS_PAGE_HREF = storyHref(MY_AUCTIONS_PAGE_STORY_ID);

/** Jump the workbench Storybook iframe to another page story. */
function navigateToStory(storyId: string) {
  const target = window.top ?? window;
  const url = new URL(target.location.href);
  url.searchParams.set("path", `/story/${storyId}`);
  url.searchParams.delete("id");
  target.location.assign(`${url.pathname}${url.search}${url.hash}`);
}

/**
 * When chrome links use `?path=/story/…`, send the click to the Storybook
 * manager frame instead of navigating the canvas iframe alone.
 */
function interceptWorkbenchStoryLinks(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const anchor = target.closest("a");
  if (!anchor) return;

  const href = anchor.getAttribute("href");
  if (!href) return;

  const match = /(?:\?|&)path=\/story\/([^&#]+)/.exec(href);
  if (!match) return;

  event.preventDefault();
  navigateToStory(decodeURIComponent(match[1]));
}

export {
  AUCTION_LOT_DETAILS_CLOSED_WON_STORY_ID,
  AUCTION_LOT_DETAILS_HREF,
  HELP_HREF,
  HELP_NAV_ITEM,
  interceptWorkbenchStoryLinks,
  MY_AUCTIONS_PAGE_HREF,
  MY_AUCTIONS_PAGE_STORY_ID,
  navigateToStory,
  ORDER_DETAILS_STORY_ID,
  ORDER_HISTORY_STORY_ID,
  STORE_LOCATOR_HREF,
  STORE_LOCATOR_STORY_ID,
  storyHref,
  WINNER_ORDER_AWAITING_ADDRESS_STORY_ID,
  WINNER_ORDER_CANCELLED_STORY_ID,
  WINNER_ORDER_DELIVERED_STORY_ID,
  WINNER_ORDER_EXPIRED_INVOICE_STORY_ID,
  WINNER_ORDER_EXPIRED_SETUP_STORY_ID,
  WINNER_ORDER_PARTIALLY_PAID_STORY_ID,
  WINNER_ORDER_PAYMENT_VERIFYING_STORY_ID,
  WINNER_ORDER_PENDING_PAYMENT_STORY_ID,
  WINNER_ORDER_PREPARING_INVOICE_STORY_ID,
  WINNER_ORDER_PROCESSING_STORY_ID,
  WINNER_ORDER_REFUNDED_STORY_ID,
  WINNER_ORDER_REFUND_DETAILS_STORY_ID,
  WINNER_ORDER_SHIPPED_STORY_ID,
};
