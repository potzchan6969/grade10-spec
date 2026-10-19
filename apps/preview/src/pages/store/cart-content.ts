import type {
  CartDrawerFooterCopy,
  CartItemSummary,
  HeldPromoCode,
  PointsState,
} from "@grade10/ui";
import { STORE_CART_COPY } from "../store-content";

/** Product picture the cart rows draw; the workbench's shared store fixture. */
const PICTURE = new URL("../product.fixture.png", import.meta.url).href;

const BOOSTER_NAME = "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)";
const CHARIZARD_NAME = "1999 Pokémon Base Set #4 Charizard Holo PSA 10";
const DELISTED_NAME = "1998 Japanese Base Set No Rarity Charmander PSA 10";
const DELISTED_LINE_ID = "line-delisted";

const BOOSTER: CartItemSummary = {
  id: "line-booster",
  name: BOOSTER_NAME,
  price: "HK$1,200.00",
  quantity: 1,
  maxQuantity: 4,
  imageSrc: PICTURE,
  imageAlt: BOOSTER_NAME,
};

/** No picture on file, so the row draws the thumbnail placeholder. */
const CHARIZARD: CartItemSummary = {
  id: "line-charizard",
  name: CHARIZARD_NAME,
  price: "HK$38,000.00",
  quantity: 1,
  maxQuantity: 1,
};

const READY_SUBTOTAL = "HK$39,200.00";
const READY_ITEMS: readonly CartItemSummary[] = [BOOSTER, CHARIZARD];

const SOLD_OUT_ITEMS: readonly CartItemSummary[] = [
  BOOSTER,
  { ...CHARIZARD, id: "line-sold-out", status: "soldOut" },
];

const ADJUSTED_LINE: CartItemSummary = {
  ...BOOSTER,
  quantity: 2,
  maxQuantity: 2,
  remainingLabel: "2 left",
  status: "adjusted",
};
const ADJUSTED_SUBTOTAL = "HK$40,400.00";
const ADJUSTED_ITEMS: readonly CartItemSummary[] = [ADJUSTED_LINE, CHARIZARD];

const SITE_SALE_ITEMS: readonly CartItemSummary[] = [
  { ...BOOSTER, price: "HK$960.00", originalPrice: "HK$1,200.00" },
  { ...CHARIZARD, price: "HK$30,400.00", originalPrice: "HK$38,000.00" },
];
const SITE_SALE_SUBTOTAL = "HK$31,360.00";

const DELISTED_ITEMS: readonly CartItemSummary[] = [
  BOOSTER,
  {
    id: DELISTED_LINE_ID,
    name: DELISTED_NAME,
    price: "HK$3,200.00",
    quantity: 1,
    maxQuantity: 1,
  },
];

/** Lines the shop has not checked yet: the consumer supplies the unchecked copy. */
const UNCHECKED_ITEMS: readonly CartItemSummary[] = [
  { ...BOOSTER, price: "Not checked" },
  { ...CHARIZARD, price: "Not checked" },
];
const UNCHECKED_TOTAL = "Not checked";

const APPLIED_TOTAL = "HK$39,080.00";

const POINTS_COLLAPSED: PointsState = { status: "collapsed" };
const POINTS_EXPANDED: PointsState = { status: "expanded" };
const POINTS_APPLIED: PointsState = {
  status: "applied",
  amountLabel: "−HK$120.00",
};
const POINTS_BALANCE_LABEL = "You’ve 1,200 pts.";

const HELD_PROMO_CODES: readonly HeldPromoCode[] = [
  {
    id: "held-welcome",
    label: "WELCOME100",
    title: "HK$100 discount",
    detailLabel: "Use by 31 Dec 2026",
    applicable: true,
  },
  {
    id: "held-save200",
    label: "SAVE200",
    title: "HK$200 discount",
    detailLabel: "Spend HK$5,000 or more",
    applicable: false,
    inapplicableReason: "Spend HK$5,000 or more to use this code",
  },
];

/** The guest's footer copy: guest checkout primary, the quiet sign-in line
 * the block draws under it, and no points. */
const GUEST_FOOTER_COPY: CartDrawerFooterCopy = {
  ...STORE_CART_COPY.footer,
  checkoutButton: "Check Out as Guest",
};

/** Codes open to everyone, listed to guests and members under their own heading. */
const PUBLIC_PROMO_CODES: readonly HeldPromoCode[] = [
  {
    id: "public-g10launch",
    label: "G10LAUNCH",
    title: "HK$200 discount",
    detailLabel: "Use by 30 Nov 2026",
    applicable: true,
  },
  {
    id: "public-holiday",
    label: "HOLIDAY26",
    title: "5% discount",
    detailLabel: "Use by 31 Dec 2026",
    applicable: true,
  },
];

/** Draft words for the review that cannot finish; the drawer block has no copy for it yet. */
const CART_REVIEW_FAILED = {
  title: "Couldn’t check your cart",
  description: "Prices and stock are not checked for these lines.",
  retry: "Retry",
};

/** Storybook story id of the product page the cart opens a line on. */
const PRODUCT_DETAIL_STORY_ID =
  "store-product-page-screens-product-detail--default";

/** Storybook story id of the Pay For The Cart flow the drawer's checkout continues to. */
/** Storybook story id of the sign-in screen a guest's sign-in link opens. */
const SIGN_IN_STORY_ID = "account-sign-in-screens-sign-in--from-add-to-cart";

/** Storybook story id of the Order Confirmed screen a guest checkout returns to. */
const ORDER_CONFIRMED_STORY_ID =
  "store-order-detail-screens-order-link--just-paid";

export {
  ADJUSTED_ITEMS,
  ADJUSTED_SUBTOTAL,
  APPLIED_TOTAL,
  BOOSTER,
  BOOSTER_NAME,
  CART_REVIEW_FAILED,
  CHARIZARD,
  CHARIZARD_NAME,
  DELISTED_ITEMS,
  DELISTED_LINE_ID,
  DELISTED_NAME,
  GUEST_FOOTER_COPY,
  HELD_PROMO_CODES,
  ORDER_CONFIRMED_STORY_ID,
  POINTS_APPLIED,
  POINTS_BALANCE_LABEL,
  POINTS_COLLAPSED,
  POINTS_EXPANDED,
  PRODUCT_DETAIL_STORY_ID,
  PUBLIC_PROMO_CODES,
  READY_ITEMS,
  READY_SUBTOTAL,
  SIGN_IN_STORY_ID,
  SITE_SALE_ITEMS,
  SITE_SALE_SUBTOTAL,
  SOLD_OUT_ITEMS,
  UNCHECKED_ITEMS,
  UNCHECKED_TOTAL,
};
