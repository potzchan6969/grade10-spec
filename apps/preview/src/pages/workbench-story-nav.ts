/** Storybook story id for a closed won Auction Lot Details assembly. */
const AUCTION_LOT_DETAILS_CLOSED_WON_STORY_ID =
  "pages-auction-lot-details--closed-won-payment-due";

/** Storybook story id for the filled Order History page assembly. */
const ORDER_HISTORY_STORY_ID = "pages-order-history-page--filled";

/** Storybook story id for the filled Order Details page assembly. */
const ORDER_DETAILS_STORY_ID = "pages-order-details-page--filled";

/** Storybook story id for the Store Locator page assembly. */
const STORE_LOCATOR_STORY_ID = "pages-store-locator-page--default";

/** Manager href that opens a story in the workbench (`?path=/story/…`). */
function storyHref(storyId: string): string {
  return `?path=/story/${storyId}`;
}

/** Chrome destination for Store Locator once the page story exists. */
const STORE_LOCATOR_HREF = storyHref(STORE_LOCATOR_STORY_ID);

/** Preview href for Winner Order → lot details. */
const AUCTION_LOT_DETAILS_HREF = storyHref(
  AUCTION_LOT_DETAILS_CLOSED_WON_STORY_ID,
);

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
  interceptWorkbenchStoryLinks,
  navigateToStory,
  ORDER_DETAILS_STORY_ID,
  ORDER_HISTORY_STORY_ID,
  STORE_LOCATOR_HREF,
  STORE_LOCATOR_STORY_ID,
  storyHref,
};
