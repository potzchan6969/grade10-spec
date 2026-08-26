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
  usePromoCode: string;
  applyPromo: string;
  promoPlaceholder: string;
  removePromo: string;
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
  PromoState,
};
