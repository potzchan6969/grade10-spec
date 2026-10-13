import { STORE_CART_COPY } from "../../store-content";

/**
 * Draft words for what the drawer block does not say yet: a price change, a
 * review that cannot finish, a shop refusal and a short fill. Each is a
 * stand-in notice in these flows until the copy is confirmed.
 */
const PRICE_CHANGED = {
  title: "Price changed",
  description: "HK$38,000.00 is now HK$36,000.00.",
};

const WITHDRAWN = {
  title: STORE_CART_COPY.unavailableItemsRemoved,
  description: STORE_CART_COPY.unavailableItemsRemovedDescription,
};

const REVIEW_CANNOT_FINISH = {
  title: "Couldn’t check these lines",
  description: "Their price and stock are not checked yet.",
  retry: "Retry",
};

const CHECKOUT_CHANGED = {
  title: "Checkout changed a line",
  description: "Fix the line marked below to continue.",
};

const SHOP_REFUSED = {
  title: "The shop refused a line",
  description: "Remove it to continue.",
};

const SHORT_FILL = {
  title: "The shop can fill fewer",
  description: "The line now reads the count the shop can fill.",
};

export {
  CHECKOUT_CHANGED,
  PRICE_CHANGED,
  REVIEW_CANNOT_FINISH,
  SHOP_REFUSED,
  SHORT_FILL,
  WITHDRAWN,
};
