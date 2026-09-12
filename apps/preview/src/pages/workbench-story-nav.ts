/** Storybook story id for the filled Order History page assembly. */
const ORDER_HISTORY_STORY_ID = "pages-order-history-page--filled";

/** Storybook story id for the filled Order Details page assembly. */
const ORDER_DETAILS_STORY_ID = "pages-order-details-page--filled";

/** Jump the workbench Storybook iframe to another page story. */
function navigateToStory(storyId: string) {
  const target = window.top ?? window;
  const url = new URL(target.location.href);
  url.searchParams.set("path", `/story/${storyId}`);
  url.searchParams.delete("id");
  target.location.assign(`${url.pathname}${url.search}${url.hash}`);
}

export { navigateToStory, ORDER_DETAILS_STORY_ID, ORDER_HISTORY_STORY_ID };
