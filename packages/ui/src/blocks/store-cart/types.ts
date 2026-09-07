import type { ReactNode } from "react";

type CartItemStatus = "default" | "adjusted" | "soldOut" | "unavailable";

/**
 * One line item in the shopping cart.
 * All amounts and strings are display-ready presentation values.
 */
type CartItemSummary = {
  id: string;
  name: string;
  price: ReactNode;
  originalPrice?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  quantity: number;
  maxQuantity?: number;
  status?: CartItemStatus;
};

type PromoState =
  | { status: "collapsed" }
  | { status: "expanded"; error?: string }
  | { status: "applied"; code: string; discountAmount: ReactNode };

/**
 * A live promo code the member already holds (minted from Loyalty).
 * Shopper-facing copy must say “promo code”, never “coupon”.
 */
type HeldPromoCode = {
  id: string;
  /** Display name or code string shown in the list and in `Discount (…)` when applied. */
  label: string;
  valueLabel: ReactNode;
  expiryLabel?: string;
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
  applyPromo: string;
  promoPlaceholder: string;
  removePromo: string;
  /** Section heading above held codes the member can pick. */
  yourPromoCodes: string;
  /** Partition heading for held codes that cannot apply to this cart. */
  notValidPromoCodes: string;
  /** Apply action on an applicable held promo row. */
  applyHeldPromo: string;
  usePoints: string;
  applyPoints: string;
  pointsPlaceholder: string;
  useMaxPoints: string;
  removePoints: string;
  /** Summary line label when points credit is applied. */
  pointsLabel: string;
  checkoutButton: string;
  /** Label while checkout is pending a redirect (e.g. to Shopify). */
  checkoutRedirecting: string;
};

type CartDrawerCopy = {
  header: CartDrawerHeaderCopy;
  item: CartItemCopy;
  footer: CartDrawerFooterCopy;
  /** Toast when delisted catalogue lines are cleared after open loading. */
  unavailableItemsRemoved: string;
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
  PromoState,
};
