import type { CartDrawerCopy, CartItemSummary, HeldPromoCode } from "./types";

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
    noHeldPromoCodes: "You don’t have any promo codes yet.",
    browseLoyaltyOffers: "Browse loyalty offers",
    applyHeldPromo: "Apply",
    usePoints: "Use points",
    applyPoints: "Apply",
    pointsPlaceholder: "0",
    pointsUnit: "pt",
    useMaxPoints: "Use max",
    pointsRateLabel: "1 pt = HK$1",
    removePoints: "Remove",
    pointsLabel: "Points",
    checkoutButton: "Proceed to Checkout",
    checkoutRedirecting: "Redirecting...",
    checkoutFailed: "Couldn’t open checkout",
  },
  unavailableItemsRemoved: "Items removed from cart",
  unavailableItemsRemovedDescription: "Some products are no longer available",
};

/** Sample held promo codes for Storybook — live codes only (no expired). */
const SAMPLE_HELD_PROMO_CODES: readonly HeldPromoCode[] = [
  {
    id: "held-welcome",
    label: "WELCOME100",
    title: "HK$100 discount",
    detailLabel: "Use by 31 Dec 2026",
    applicable: true,
  },
  {
    id: "held-tier",
    label: "TIER50",
    title: "HK$50 discount",
    detailLabel: "Use by 30 Jun 2026",
    applicable: true,
  },
  {
    id: "held-min-spend",
    label: "SAVE200",
    title: "HK$200 discount",
    detailLabel: "Use by 31 Mar 2026",
    applicable: false,
    inapplicableReason: "Add ~HK$7,300 more to use this promo code",
  },
  {
    id: "held-stack",
    label: "STACK10",
    title: "10% discount",
    detailLabel: "Use by 15 Apr 2026",
    applicable: false,
    inapplicableReason: "Cannot combine with another promo code on this order",
  },
];

/** Held list where every code is inapplicable — only the “Not valid” partition. */
const SAMPLE_HELD_INAPPLICABLE_ONLY: readonly HeldPromoCode[] =
  SAMPLE_HELD_PROMO_CODES.filter((c) => !c.applicable);

const SAMPLE_CART_ITEMS: CartItemSummary[] = [
  {
    id: "item-1",
    name: "1999 Pokémon Base Set #4 Charizard Holo PSA 10",
    price: "HK$24,500.00",
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

/** Demo totals when a sample held code is applied in Storybook. */
const SAMPLE_HELD_DISCOUNTS: Record<string, { amount: string; total: string }> =
  {
    "held-welcome": { amount: "−HK$100.00", total: "HK$42,600.00" },
    "held-tier": { amount: "−HK$50.00", total: "HK$42,650.00" },
  };

/**
 * Storybook stub: accept SAVE10, or a live applicable held label, the way the
 * app would resolve a typed code against the member's wallet.
 */
function applyTypedPromoInStories(
  code: string,
  held: readonly HeldPromoCode[],
):
  | {
      ok: true;
      heldId: string | null;
      label: string;
      amount: string;
      total: string;
    }
  | { ok: false; error: string } {
  const trimmed = code.trim().toUpperCase();
  if (trimmed === "SAVE10") {
    return {
      ok: true,
      heldId: null,
      label: "SAVE10",
      amount: "−HK$4,270.00",
      total: "HK$38,430.00",
    };
  }
  const match = held.find((c) => c.label.toUpperCase() === trimmed);
  if (match?.applicable) {
    const discount = SAMPLE_HELD_DISCOUNTS[match.id];
    if (discount) {
      return {
        ok: true,
        heldId: match.id,
        label: match.label,
        amount: discount.amount,
        total: discount.total,
      };
    }
  }
  if (match && !match.applicable) {
    return {
      ok: false,
      error:
        match.inapplicableReason ??
        "This promo code cannot be used on this order",
    };
  }
  return { ok: false, error: "This promo code is invalid" };
}

/** Subtotal used by cart drawer Storybook stubs. */
const STORY_CART_SUBTOTAL_HKD = 42700;
/** Max points bill-credit in Storybook stubs (1 pt = HK$1). */
const STORY_POINTS_MAX_HKD = 1200;

function parseStoryMoney(value: string): number {
  return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
}

function formatStoryHkd(amount: number): string {
  return `HK$${amount.toLocaleString("en-HK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Credit/discount display — Unicode minus (U+2212), not ASCII hyphen. */
function formatStoryCreditHkd(amount: number): string {
  return `−${formatStoryHkd(amount)}`;
}

/**
 * Storybook estimated total: subtotal minus applied promo discount and points
 * credit. Keeps remove/apply handlers consistent across held codes and SAVE10.
 */
function storyCartEstimatedTotal(
  promoDiscountAmount: string | null | undefined,
  pointsCreditHkd: number | null | undefined,
): string {
  let total = STORY_CART_SUBTOTAL_HKD;
  if (promoDiscountAmount) {
    total -= parseStoryMoney(promoDiscountAmount);
  }
  if (pointsCreditHkd != null && pointsCreditHkd > 0) {
    total -= pointsCreditHkd;
  }
  return formatStoryHkd(total);
}

export {
  applyTypedPromoInStories,
  DEFAULT_CART_COPY,
  formatStoryCreditHkd,
  formatStoryHkd,
  OVERFLOW_CART_ITEMS,
  parseStoryMoney,
  SAMPLE_CART_ITEMS,
  SAMPLE_HELD_DISCOUNTS,
  SAMPLE_HELD_INAPPLICABLE_ONLY,
  SAMPLE_HELD_PROMO_CODES,
  STORY_CART_SUBTOTAL_HKD,
  STORY_POINTS_MAX_HKD,
  storyCartEstimatedTotal,
};
