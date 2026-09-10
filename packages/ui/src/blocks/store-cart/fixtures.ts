import type { CartDrawerCopy, CartItemSummary, HeldPromoCode } from "./types";

/** Subtotal used by cart drawer Storybook stubs. */
const STORY_CART_SUBTOTAL_HKD = 42700;
/** Max points bill-credit in Storybook stubs (1 pt = HK$1). */
const STORY_POINTS_MAX_HKD = 1200;
/** Sale subtotal after the storewide −10% special sale. */
const STORY_SPECIAL_SALE_SUBTOTAL_HKD = 38430;
/** Extra cut when SAVE20 stacks on the sale subtotal (折上折). */
const STORY_STACKED_PROMO_CUT_HKD = 7686;
/** Cut when SAVE20 replaces the site sale (20% of list). */
const STORY_REPLACE_PROMO_CUT_HKD = 8540;

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

/** Cut when the storewide −10% special sale is named in the footer. */
const STORY_SITE_SALE_CUT_HKD = 4270;
const STORY_SITE_SALE_AMOUNT = formatStoryCreditHkd(STORY_SITE_SALE_CUT_HKD);
const STORY_SITE_SALE_LABEL = "Store sale (−10%)";
const STORY_LIST_SUBTOTAL = formatStoryHkd(STORY_CART_SUBTOTAL_HKD);
const STORY_SPECIAL_SALE_SUBTOTAL = formatStoryHkd(
  STORY_SPECIAL_SALE_SUBTOTAL_HKD,
);
const STORY_STACKED_PROMO_AMOUNT = formatStoryCreditHkd(
  STORY_STACKED_PROMO_CUT_HKD,
);
const STORY_REPLACE_PROMO_AMOUNT = formatStoryCreditHkd(
  STORY_REPLACE_PROMO_CUT_HKD,
);
const STORY_STACKED_TOTAL = formatStoryHkd(
  STORY_SPECIAL_SALE_SUBTOTAL_HKD - STORY_STACKED_PROMO_CUT_HKD,
);
const STORY_REPLACE_TOTAL = formatStoryHkd(
  STORY_CART_SUBTOTAL_HKD - STORY_REPLACE_PROMO_CUT_HKD,
);

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
    shippingValue: "Calculated at checkout",
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
  emptyTitle: "Your cart is empty",
  emptyDescription: "Items you add will appear here",
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

/**
 * Held list while a non-combining site sale is on — SAVE20 is refused by
 * Shopify combine rules in the refuse scenario.
 */
const SAMPLE_HELD_WITH_SITE_SALE_BLOCK: readonly HeldPromoCode[] = [
  {
    id: "held-save20",
    label: "SAVE20",
    title: "20% off order",
    detailLabel: "Use by 31 Dec 2026",
    applicable: false,
    inapplicableReason: "Cannot combine with the store sale on this order",
  },
  ...SAMPLE_HELD_PROMO_CODES.filter((c) => c.id !== "held-stack"),
];

/**
 * Held list when SAVE20 may stack or replace the site sale — ticket Apply is live.
 */
const SAMPLE_HELD_WITH_SITE_SALE_STACKABLE: readonly HeldPromoCode[] = [
  {
    id: "held-save20",
    label: "SAVE20",
    title: "20% off order",
    detailLabel: "Use by 31 Dec 2026",
    applicable: true,
  },
  ...SAMPLE_HELD_PROMO_CODES.filter(
    (c) => c.applicable && c.id !== "held-stack",
  ),
];

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

/**
 * Storewide product special sale (−10%) on every line — compare-at is list
 * price. List subtotal HK$42,700 → sale subtotal HK$38,430.
 */
const SPECIAL_SALE_CART_ITEMS: CartItemSummary[] = [
  {
    id: "item-1",
    name: "1999 Pokémon Base Set #4 Charizard Holo PSA 10",
    price: "HK$22,050.00",
    originalPrice: "HK$24,500.00",
    quantity: 1,
    maxQuantity: 1,
    status: "default",
  },
  {
    id: "item-2",
    name: "2000 Neo Genesis 1st Edition Lugia Holo #9 BGS 9.5",
    price: "HK$16,380.00",
    originalPrice: "HK$18,200.00",
    quantity: 1,
    maxQuantity: 3,
    status: "default",
  },
];

/** List prices for the same basket when a promo *replaces* the site sale. */
const LIST_PRICE_CART_ITEMS: CartItemSummary[] = SAMPLE_CART_ITEMS.map(
  (item) => ({ ...item }),
);

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

/**
 * Storybook stub for site-sale × typed-code combine modes.
 * - `refuse` — SAVE20 rejected; site sale stays on lines
 * - `stack` — SAVE20 cuts the post-sale subtotal; lines keep sale + compare-at
 * - `replace` — site sale lifts; SAVE20 cuts list alone
 */
function applySiteSalePromoInStories(
  code: string,
  mode: "refuse" | "stack" | "replace",
):
  | {
      ok: true;
      label: string;
      amount: string;
      total: string;
      items: CartItemSummary[];
      subtotal: string;
    }
  | { ok: false; error: string } {
  const trimmed = code.trim().toUpperCase();
  if (trimmed !== "SAVE20") {
    return { ok: false, error: "This promo code is invalid" };
  }
  if (mode === "refuse") {
    return {
      ok: false,
      error: "Cannot combine with the store sale on this order",
    };
  }
  if (mode === "stack") {
    return {
      ok: true,
      label: "SAVE20",
      amount: STORY_STACKED_PROMO_AMOUNT,
      total: STORY_STACKED_TOTAL,
      items: SPECIAL_SALE_CART_ITEMS,
      subtotal: STORY_SPECIAL_SALE_SUBTOTAL,
    };
  }
  return {
    ok: true,
    label: "SAVE20",
    amount: STORY_REPLACE_PROMO_AMOUNT,
    total: STORY_REPLACE_TOTAL,
    items: LIST_PRICE_CART_ITEMS,
    subtotal: STORY_LIST_SUBTOTAL,
  };
}

export {
  applySiteSalePromoInStories,
  applyTypedPromoInStories,
  DEFAULT_CART_COPY,
  formatStoryCreditHkd,
  formatStoryHkd,
  LIST_PRICE_CART_ITEMS,
  OVERFLOW_CART_ITEMS,
  parseStoryMoney,
  SAMPLE_CART_ITEMS,
  SAMPLE_HELD_DISCOUNTS,
  SAMPLE_HELD_INAPPLICABLE_ONLY,
  SAMPLE_HELD_PROMO_CODES,
  SAMPLE_HELD_WITH_SITE_SALE_BLOCK,
  SAMPLE_HELD_WITH_SITE_SALE_STACKABLE,
  SPECIAL_SALE_CART_ITEMS,
  STORY_CART_SUBTOTAL_HKD,
  STORY_LIST_SUBTOTAL,
  STORY_POINTS_MAX_HKD,
  STORY_REPLACE_PROMO_AMOUNT,
  STORY_REPLACE_TOTAL,
  STORY_SITE_SALE_AMOUNT,
  STORY_SITE_SALE_LABEL,
  STORY_SPECIAL_SALE_SUBTOTAL,
  STORY_STACKED_PROMO_AMOUNT,
  STORY_STACKED_TOTAL,
  storyCartEstimatedTotal,
};
