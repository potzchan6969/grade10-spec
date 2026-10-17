import type { ReactNode } from "react";

type CartItemStatus = "default" | "adjusted" | "soldOut" | "unavailable";

/**
 * One line item in the shopping cart.
 * All amounts and strings are display-ready presentation values, and the
 * consumer's quote owns every one: the drawer computes no amount.
 *
 * Discount display (each dollar once):
 * - **Site sale** - the shop's automatic cut on products or collections shows
 *   only on the lines it cuts: `price` is the sale price and `originalPrice`
 *   the list price, each the price of one; no `couponCode`, and never a
 *   summary row.
 * - **Order discount** - a cut off the whole order, such as a spend
 *   threshold, never touches the lines: it is an `OrderDiscountRow` in the
 *   footer, after the Subtotal it is taken from.
 * - **Subtotal** - each line's price times its quantity, leaving out sold-out
 *   and unavailable lines, in every outcome.
 * - **A code that meets a site sale** - reaches the drawer only as
 *   `PromoState`. The quote decides whether it stacks (the lines keep the
 *   sale; the footer adds only the code's discount), is refused (lines and
 *   totals stay; the promo sheet says why), or replaces the sale (the quote
 *   decides line by line which lines it takes; each such line shows its list
 *   price with no `originalPrice`).
 * - **A code shown on a line** - `couponCode` with the discounted unit
 *   `price`; outside the site sale and promo outcomes above, and never also
 *   `PromoState` `applied`.
 */
type CartItemSummary = {
  id: string;
  name: string;
  price: ReactNode;
  /** List price of one, struck through whenever set, even when it equals
   * `price`. */
  originalPrice?: ReactNode;
  /**
   * A code shown on this line, under the price. Outside the site sale and
   * promo outcomes: a code that meets a site sale is `PromoState`, not this.
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
  /**
   * The line's own write in flight. A line that sets it, `false` included,
   * owns its removal: the drawer calls `onRemoveItem` on the press, keeps the
   * row busy while this is true, and animates it out once `items` drops it.
   * Left unset, removal waits for its exit animation as before.
   */
  pending?: boolean;
  /** The refusal of the line's last write, shown on the row. */
  failed?: string;
};

/**
 * Footer promo affordance, and the only way a code that meets a site sale
 * reaches the drawer. `applied` carries the code's discount as the quote
 * priced it; a code shown on a line uses `couponCode` instead.
 */
type PromoState =
  | { status: "collapsed" }
  | { status: "expanded"; error?: string }
  | {
      status: "applied";
      /** e.g. `Discount (SAVE10)`. */
      label: string;
      discountAmount: ReactNode;
    };

/**
 * An order-class site discount in the footer, after the Subtotal and before
 * the promo slot. Display-ready; the shopper cannot remove it.
 */
type OrderDiscountRow = {
  /** e.g. `Discount (Spend 10k 10% off)`. */
  label: string;
  /** e.g. `−HK$4,270.00`. */
  amount: string;
};

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
  /** Read before the price a struck line charges, never shown. */
  salePriceLabel: string;
  /** Read before a struck list price, never shown. */
  listPriceLabel: string;
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
  /** Partition heading for codes that cannot apply to this cart. */
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
  /** Quiet text before the sign-in action for a guest — e.g. "Already have an account?". */
  signInPrompt?: string;
  /** Sign-in action in that line — e.g. "Sign in". */
  signInAction?: string;
  /** Quiet text after the sign-in action — e.g. "for points and rewards". */
  signInSuffix?: string;
  /** Section heading above every applicable code, held and public — e.g. "Promo codes". */
  publicPromoCodes?: string;
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
  OrderDiscountRow,
  PointsState,
  PromoNotice,
  PromoState,
};
