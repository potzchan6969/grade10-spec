import type {
  CartDrawerCopy,
  CartItemSummary,
  HeldPromoCode,
} from "./types";

const DEFAULT_CART_COPY: CartDrawerCopy = {
  header: {
    title: "Cart",
    closeCartLabel: "Close cart",
  },
  item: {
    lowStockWarning: "Low stock. Quantity adjusted",
    soldOutLabel: "Sold Out",
    removeItemLabel: "Remove item",
    decreaseQtyLabel: "Decrease quantity",
    increaseQtyLabel: "Increase quantity",
  },
  footer: {
    subtotalLabel: "Subtotal",
    shippingLabel: "Shipping",
    shippingValue: "TBD",
    estimatedTotalLabel: "Estimated Total",
    usePromoCode: "Promo code",
    selectOrEnterPromoCode: "Select or enter code",
    promoSheetTitle: "Promo code",
    promoSheetBackLabel: "Back",
    applyPromo: "Apply",
    promoPlaceholder: "Enter promo code",
    removePromo: "Remove",
    yourPromoCodes: "Your promo codes",
    notValidPromoCodes: "Not valid for this order",
    applyHeldPromo: "Apply",
    usePoints: "Use points",
    applyPoints: "Apply",
    pointsPlaceholder: "Enter amount (HK$)",
    useMaxPoints: "Use max",
    removePoints: "Remove",
    pointsLabel: "Points",
    checkoutButton: "Proceed to Checkout",
    checkoutRedirecting: "Redirecting...",
  },
  unavailableItemsRemoved:
    "Some item(s) have been removed as they’re no longer available",
};

/** Sample held promo codes for Storybook — mix of applicable and not valid. */
const SAMPLE_HELD_PROMO_CODES: readonly HeldPromoCode[] = [
  {
    id: "held-welcome",
    label: "WELCOME100",
    valueLabel: "HK$100 off",
    expiryLabel: "Use by 31 Dec 2026",
    applicable: true,
  },
  {
    id: "held-tier",
    label: "TIER50",
    valueLabel: "HK$50 off",
    expiryLabel: "Use by 30 Jun 2026",
    applicable: true,
  },
  {
    id: "held-min-spend",
    label: "SAVE200",
    valueLabel: "HK$200 off",
    expiryLabel: "Use by 31 Mar 2026",
    applicable: false,
    inapplicableReason: "Add ~HK$7,300 more to use this promo code",
  },
  {
    id: "held-stack",
    label: "STACK10",
    valueLabel: "10% off",
    expiryLabel: "Use by 15 Apr 2026",
    applicable: false,
    inapplicableReason: "Cannot combine with another promo code on this order",
  },
];

const SAMPLE_CART_ITEMS: CartItemSummary[] = [
  {
    id: "item-1",
    name: "1999 Pokémon Base Set #4 Charizard Holo PSA 10",
    price: "HK$24,500.00",
    originalPrice: "HK$26,000.00",
    quantity: 1,
    maxQuantity: 1,
    status: "default",
  },
  {
    id: "item-2",
    name: "2000 Neo Genesis 1st Edition Lugia Holo #9 BGS 9.5",
    price: "HK$18,200.00",
    quantity: 1,
    maxQuantity: 3,
    status: "default",
  },
];

const OVERFLOW_CART_ITEMS: CartItemSummary[] = [
  ...SAMPLE_CART_ITEMS,
  {
    id: "item-3",
    name: "2002 Yu-Gi-Oh! LOB Blue-Eyes White Dragon 1st Edition PSA 9",
    price: "HK$8,900.00",
    quantity: 2,
    status: "default",
  },
  {
    id: "item-4",
    name: "1996 Japanese Basic Pikachu No Rarity Symbol PSA 9",
    price: "HK$4,500.00",
    quantity: 1,
    status: "default",
  },
  {
    id: "item-5",
    name: "2003 Skyridge Umbreon Holo #H30 PSA 10",
    price: "HK$12,000.00",
    quantity: 1,
    status: "default",
  },
  {
    id: "item-6",
    name: "2016 Pokémon 20th Anniversary Mario Pikachu PSA 10",
    price: "HK$15,500.00",
    quantity: 1,
    status: "default",
  },
];

export {
  DEFAULT_CART_COPY,
  OVERFLOW_CART_ITEMS,
  SAMPLE_CART_ITEMS,
  SAMPLE_HELD_PROMO_CODES,
};
