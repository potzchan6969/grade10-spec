import type { ReactNode } from "react";

type CartItemStatus = "default" | "adjusted" | "soldOut" | "unavailable";

/**
 * One line item in the shopping cart.
 * All amounts and strings are display-ready presentation values.
 *
 * Discount display (each dollar once):
 * - **Catalogue sale** — `price` + optional `originalPrice` (compare-at); no
 *   `couponCode`.
 * - **Product promo/coupon** — `couponCode` on this line with the discounted
 *   unit `price` (and optional pre-coupon `originalPrice`). That cut MUST NOT
 *   also appear as `PromoState` `applied` on the footer.
 * - **Order-level promo/coupon/points** — lines stay at catalogue/sale prices
 *   with no `couponCode`; the footer summary carries the cut.
 */
type CartItemSummary = {
  id: string;
  name: string;
  price: ReactNode;
  /** Compare-at / pre-discount unit price; struck through when set. */
  originalPrice?: ReactNode;
  /**
   * Product (item-level) promo/coupon code shown under the price line.
   * Order-level codes belong on the footer, not here.
   */
  couponCode?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  quantity: number;
  maxQuantity?: number;
  /**
   * How many are left, in the consumer's own words. Displayed as supplied —
   * the line neither formats it nor decides from it that stock is low. It sits
   * beside the low-stock warning, never in place of it: one says what was
   * already changed, the other says what is left.
   */
  remainingLabel?: ReactNode;
  status?: CartItemStatus;
};

/**
 * Footer promo affordance. `applied` is for **order-level** codes only —
 * product coupons update the matching line’s `couponCode` / `price` instead.
 */
type PromoState =
  | { status: "collapsed" }
  | { status: "expanded"; error?: string }
  | { status: "applied"; code: string; discountAmount: ReactNode };

/**
 * A live promo code the member already holds (minted from Loyalty).
 * Shopper-facing copy must say “promo code”, never “coupon”.
 * The consumer SHALL NOT pass expired or void codes — only live held codes
 * appear in the nested sheet.
 */
type HeldPromoCode = {
  id: string;
  /** Promo code string — tag row on the ticket; `Discount (…)` when applied. */
  label: string;
  /** Ticket title — e.g. “HK$100 discount”. */
  title: ReactNode;
  /** Expiry and/or conditions under the title. */
  detailLabel?: ReactNode;
  applicable: boolean;
  /** Shown when `applicable` is false — prefer actionable copy. */
  inapplicableReason?: string;
};

/**
 * Points bill-credit tender on the cart drawer.
 * Nothing is debited from the loyalty ledger until the order is paid.
 */
type PointsState =
  | { status: "collapsed" }
  | { status: "expanded"; error?: string }
  | { status: "applied"; amountLabel: ReactNode };

type CartItemCopy = {
  lowStockWarning: string;
  soldOutLabel: string;
  removeItemLabel: string;
  decreaseQtyLabel: string;
  increaseQtyLabel: string;
};

type CartDrawerHeaderCopy = {
  title: string;
  closeCartLabel: string;
};

type CartDrawerFooterCopy = {
  subtotalLabel: string;
  shippingLabel: string;
  shippingValue: string;
  estimatedTotalLabel: string;
  /** First-layer row label — e.g. "Promo code". */
  usePromoCode: string;
  /** First-layer row action — e.g. "Select or enter code". Opens nested sheet. */
  selectOrEnterPromoCode: string;
  /** Nested sheet title. */
  promoSheetTitle: string;
  /** Nested sheet back / close control. */
  promoSheetBackLabel: string;
  /** Apply action next to the promo code text field. */
  applyPromo: string;
  promoPlaceholder: string;
  removePromo: string;
  /** Section heading above held codes the member can pick. */
  yourPromoCodes: string;
  /** Partition heading for held codes that cannot apply to this cart. */
  notValidPromoCodes: string;
  /** Empty held list — no live codes to pick. */
  noHeldPromoCodes: string;
  /** CTA when the held list is empty — opens Loyalty (new tab when wired). */
  browseLoyaltyOffers: string;
  /** Apply action on an applicable held promo row. */
  applyHeldPromo: string;
  usePoints: string;
  applyPoints: string;
  pointsPlaceholder: string;
  /** Trailing unit on the points field — e.g. "pt". */
  pointsUnit: string;
  useMaxPoints: string;
  /** Conversion rate under the points field — e.g. "1 pt = HK$1". */
  pointsRateLabel: string;
  removePoints: string;
  /** Summary line label when points credit is applied. */
  pointsLabel: string;
  checkoutButton: string;
  /** Label while checkout is pending a redirect (e.g. to Shopify). */
  checkoutRedirecting: string;
  /** Toast title when checkout redirect fails (e.g. Shopify session error). */
  checkoutFailed: string;
};

/**
 * Promo-cleared toast content. A bare string is the title only; an object may
 * add an optional description line.
 */
type PromoNotice = string | { title: string; description?: string };

type CartDrawerCopy = {
  header: CartDrawerHeaderCopy;
  item: CartItemCopy;
  footer: CartDrawerFooterCopy;
  /** Empty-cart title for the design-system empty state. */
  emptyTitle: string;
  /** Optional empty-cart description under the title. */
  emptyDescription?: string;
  /** Toast title when delisted catalogue lines are cleared after open loading. */
  unavailableItemsRemoved: string;
  /** Optional description under `unavailableItemsRemoved`. */
  unavailableItemsRemovedDescription?: string;
};

export type {
  CartDrawerCopy,
  CartDrawerFooterCopy,
  CartDrawerHeaderCopy,
  CartItemCopy,
  CartItemStatus,
  CartItemSummary,
  HeldPromoCode,
  PointsState,
  PromoNotice,
  PromoState,
};
