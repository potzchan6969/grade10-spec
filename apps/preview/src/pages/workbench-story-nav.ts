/** Storybook story id for a closed won Auction Lot Details assembly. */
const AUCTION_LOT_DETAILS_CLOSED_WON_STORY_ID =
  "auction-display-screens-lot-details--closed-won-payment-due";

/** Storybook story id for the filled Order History page assembly. */
const ORDER_HISTORY_STORY_ID =
  "store-order-history-screens-order-history--filled";

/** Storybook story id for the filled Order Details page assembly. */
const ORDER_DETAILS_STORY_ID =
  "store-order-detail-screens-order-details--filled";

/** Storybook story id for the Store Locator page assembly. */
const STORE_LOCATOR_STORY_ID =
  "store-store-locator-screens-store-locator--default";

/** Storybook story id for the Terms of Service page assembly. */
const TERMS_OF_SERVICE_STORY_ID =
  "site-carried-surfaces-screens-legal--terms-of-service";

/** Storybook story id for the Privacy Policy page assembly. */
const PRIVACY_POLICY_STORY_ID =
  "site-carried-surfaces-screens-legal--privacy-policy";
/** Storybook story id for the My Auctions page assembly (list → Winner Order). */
const MY_AUCTIONS_PAGE_STORY_ID =
  "auction-bidding-screens-my-auctions--post-auction";

/** Winner Order story ids — one per derived standing a Won row may open. */
const WINNER_ORDER_AWAITING_ADDRESS_STORY_ID =
  "auction-post-bidding-screens-winner-order-setup--awaiting-setup";
const WINNER_ORDER_EXPIRED_SETUP_STORY_ID =
  "auction-post-bidding-screens-winner-order-setup--expired-setup";
const WINNER_ORDER_PREPARING_INVOICE_STORY_ID =
  "auction-post-bidding-screens-winner-order-setup--preparing-invoice";
const WINNER_ORDER_PENDING_PAYMENT_STORY_ID =
  "auction-post-bidding-screens-winner-order-payment--pending-payment";
const WINNER_ORDER_PAYMENT_VERIFYING_STORY_ID =
  "auction-post-bidding-screens-winner-order-payment--payment-verifying";
const WINNER_ORDER_EXPIRED_INVOICE_STORY_ID =
  "auction-post-bidding-screens-winner-order-payment--expired-invoice";
const WINNER_ORDER_PARTIALLY_PAID_STORY_ID =
  "auction-post-bidding-screens-winner-order-payment--partially-paid";
const WINNER_ORDER_PROCESSING_STORY_ID =
  "auction-post-bidding-screens-winner-order-delivery--processing";
const WINNER_ORDER_SHIPPED_STORY_ID =
  "auction-post-bidding-screens-winner-order-delivery--shipped";
const WINNER_ORDER_DELIVERED_STORY_ID =
  "auction-post-bidding-screens-winner-order-delivery--delivered";
const WINNER_ORDER_CANCELLED_STORY_ID =
  "auction-post-bidding-screens-winner-order-closed--cancelled";
const WINNER_ORDER_REFUNDED_STORY_ID =
  "auction-post-bidding-screens-winner-order-closed--refunded";
const WINNER_ORDER_REFUND_DETAILS_STORY_ID =
  "auction-post-bidding-screens-winner-order-refund-details--closing-refund";
const WINNER_ORDER_EMAIL_GRADE10_STORY_ID =
  "auction-post-bidding-screens-winner-order-email-grade10--payment-overdue";

/** Manager href that opens a story in the workbench (`?path=/story/…`). */
function storyHref(storyId: string): string {
  return `?path=/story/${storyId}`;
}

/** Chrome destination for Store Locator once the page story exists. */
const STORE_LOCATOR_HREF = storyHref(STORE_LOCATOR_STORY_ID);

/** Chrome destination for Terms of Service. */
const TERMS_OF_SERVICE_HREF = storyHref(TERMS_OF_SERVICE_STORY_ID);

/** Chrome destination for Privacy Policy. */
const PRIVACY_POLICY_HREF = storyHref(PRIVACY_POLICY_STORY_ID);
/** TBC — provisional docs host for collector Help in the primary nav. */
const HELP_HREF = "https://grade10.mintlify.io/";

/** Primary-nav Help; last — after Shows, else Store Locator, else Auction. */
const HELP_NAV_ITEM = {
  label: "Help",
  href: HELP_HREF,
  external: true,
} as const;

/** Primary-nav Shows; before Help, after Store Locator when present. */
const SHOWS_NAV_ITEM = {
  label: "Shows",
  href: "/shows",
} as const;

/** Preview href for Winner Order → lot details. */
const AUCTION_LOT_DETAILS_HREF = storyHref(
  AUCTION_LOT_DETAILS_CLOSED_WON_STORY_ID,
);

/** Preview href for Winner Order → My Auctions list. */
const MY_AUCTIONS_PAGE_HREF = storyHref(MY_AUCTIONS_PAGE_STORY_ID);

/** Storybook story id for the About page assembly. */
const ABOUT_PAGE_STORY_ID = "site-about-screens-about--default";

/** Storybook story id for the Shows page assembly. */
const SHOWS_PAGE_STORY_ID = "site-shows-screens-shows--default";

/** Storybook story id for the Press page assembly. */
const PRESS_PAGE_STORY_ID = "site-press-screens-press--default";

/** Storybook story id for the press-release article assembly. */
const PRESS_ARTICLE_STORY_ID = "site-press-screens-press-release--default";

/** Storybook story id for the Media Coverage page assembly. */
const MEDIA_COVERAGE_PAGE_STORY_ID =
  "site-media-coverage-screens-media-coverage--default";

/**
 * Real routes that resolve to a page story in the workbench: the href
 * stays the surface's true address and a click in the canvas jumps to
 * that route's story. Add a row when a page story lands.
 */
const ROUTE_STORY_IDS: Record<string, string> = {
  "/about": ABOUT_PAGE_STORY_ID,
  "/media-coverage": MEDIA_COVERAGE_PAGE_STORY_ID,
  "/press-releases": PRESS_PAGE_STORY_ID,
  "/shows": SHOWS_PAGE_STORY_ID,
};

/**
 * Route prefixes that resolve to a page story when no exact route matches:
 * every release slug opens the one article template story.
 */
const ROUTE_PREFIX_STORY_IDS: Record<string, string> = {
  "/press-releases/": PRESS_ARTICLE_STORY_ID,
};

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
  // A trailing slash means the list route, not a slug under it.
  const route =
    href.length > 1 && href.endsWith("/") ? href.slice(0, -1) : href;
  const storyId = match
    ? decodeURIComponent(match[1])
    : (ROUTE_STORY_IDS[route] ??
      Object.entries(ROUTE_PREFIX_STORY_IDS).find(([prefix]) =>
        route.startsWith(prefix),
      )?.[1]);
  if (!storyId) return;

  event.preventDefault();
  navigateToStory(storyId);
}

export {
  AUCTION_LOT_DETAILS_CLOSED_WON_STORY_ID,
  AUCTION_LOT_DETAILS_HREF,
  HELP_HREF,
  HELP_NAV_ITEM,
  interceptWorkbenchStoryLinks,
  MEDIA_COVERAGE_PAGE_STORY_ID,
  MY_AUCTIONS_PAGE_HREF,
  MY_AUCTIONS_PAGE_STORY_ID,
  navigateToStory,
  ORDER_DETAILS_STORY_ID,
  ORDER_HISTORY_STORY_ID,
  PRESS_ARTICLE_STORY_ID,
  PRESS_PAGE_STORY_ID,
  PRIVACY_POLICY_HREF,
  PRIVACY_POLICY_STORY_ID,
  SHOWS_NAV_ITEM,
  STORE_LOCATOR_HREF,
  STORE_LOCATOR_STORY_ID,
  storyHref,
  TERMS_OF_SERVICE_HREF,
  TERMS_OF_SERVICE_STORY_ID,
  WINNER_ORDER_AWAITING_ADDRESS_STORY_ID,
  WINNER_ORDER_CANCELLED_STORY_ID,
  WINNER_ORDER_DELIVERED_STORY_ID,
  WINNER_ORDER_EMAIL_GRADE10_STORY_ID,
  WINNER_ORDER_EXPIRED_INVOICE_STORY_ID,
  WINNER_ORDER_EXPIRED_SETUP_STORY_ID,
  WINNER_ORDER_PARTIALLY_PAID_STORY_ID,
  WINNER_ORDER_PAYMENT_VERIFYING_STORY_ID,
  WINNER_ORDER_PENDING_PAYMENT_STORY_ID,
  WINNER_ORDER_PREPARING_INVOICE_STORY_ID,
  WINNER_ORDER_PROCESSING_STORY_ID,
  WINNER_ORDER_REFUND_DETAILS_STORY_ID,
  WINNER_ORDER_REFUNDED_STORY_ID,
  WINNER_ORDER_SHIPPED_STORY_ID,
};
