import type {
  CartItemSummary,
  HeldPromoCode,
  OrderDiscountRow,
  PointsState,
  PromoState,
} from "@grade10/ui";
import { BOOSTER, CHARIZARD } from "./store/cart-content";

/**
 * One basket, priced the way the shop prices it, for every Flow that walks a
 * cart: the cart Screens' graded card and sealed box, a site discount, at most one coupon
 * and points. Each setting is a condition a tester sets up in staging, so the
 * amounts a Flow draws from it are what staging must show. Amounts are integer
 * HK cents until they are formatted.
 */

type SiteDiscount = "none" | "product-sale" | "order-discount";
type Coupon = "none" | "order" | "product" | "too-small";
type ShopAnswer = "stack" | "replace" | "refuse";
type Points = "none" | "500" | "max";
type Balance = "1250" | "50000";
/** What the open-time read found: lines as added, the card sold out, or the box short. */
type LineState = "ready" | "sold-out" | "adjusted";

type BasketSettings = {
  siteDiscount: SiteDiscount;
  coupon: Coupon;
  shopAnswer: ShopAnswer;
  points: Points;
  balance: Balance;
  lines?: LineState;
};

/** How the coupon met the site discount, in the order the cart shows it. */
type CodeOutcome =
  | "no-code"
  | "applied"
  | "stacked"
  | "replaced"
  | "refused"
  | "not-valid";

type PricedBasket = {
  items: CartItemSummary[];
  subtotal: string;
  orderDiscounts: OrderDiscountRow[];
  promoState: PromoState;
  pointsState: PointsState | null;
  pointsBalanceLabel: string;
  estimatedTotal: string;
  heldCode: HeldPromoCode | null;
  outcome: CodeOutcome;
  /** Points actually taken, after any trim to what the order carries. */
  pointsTaken: number;
  /** Points asked for, before the trim. */
  pointsAsked: number;
  /** What is left to pay in money, in cents. */
  totalCents: number;
};

const REFUSED = "Cannot combine with the sale on this order";

const formatHkd = (cents: number) =>
  `HK$${(cents / 100).toLocaleString("en-HK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/** A cut, with the Unicode minus the cart uses. */
const formatCut = (cents: number) => `−${formatHkd(cents)}`;

const GRADED = { line: CHARIZARD, listCents: 3800000 };
const SEALED = { line: BOOSTER, listCents: 120000 };
/** The shop had two boxes left of what the shopper asked for. */
const SEALED_FILLED = 2;
const NO_GRADED_CARD = "Nothing in this order is a graded card";

/** A product-class site sale: 10% off graded cards, drawn on the card's line. */
const SALE_RATE = 0.1;
/** An order-class site discount: 5% off an order of HK$30,000 or more. */
const ORDER_DISCOUNT = {
  label: "Discount (Spend HK$30,000, 5% off)",
  rate: 0.05,
  thresholdCents: 3000000,
};

/** The member's coupons, as Membership lists them and the cart holds them. */
const COUPONS = {
  order: {
    code: "GRD-50-7Q2M",
    title: "HK$50 discount",
    description: "HK$50 off any order",
    amount: "HK$50",
    cutCents: 5000,
  },
  product: {
    code: "GRD-10-PSA1",
    title: "10% off graded cards",
    description: "10% off graded cards",
    amount: "10%",
    rate: 0.1,
  },
  "too-small": {
    code: "GRD-200-B5K9",
    title: "HK$200 discount",
    description: "HK$200 off an order of HK$50,000 or more",
    amount: "HK$200",
    cutCents: 20000,
    thresholdCents: 5000000,
  },
} as const;

const COUPON_VALID = "Use by 31 Dec 2026";

const round = (cents: number) => Math.round(cents);

function heldCodeOf(coupon: Coupon, reason?: string): HeldPromoCode | null {
  if (coupon === "none") return null;
  const held = COUPONS[coupon];
  return {
    id: `held-${coupon}`,
    label: held.code,
    title: held.title,
    detailLabel: COUPON_VALID,
    applicable: !reason,
    inapplicableReason: reason,
  };
}

/** Prices the basket for these settings, the way the shop's quote returns it. */
function priceBasket(settings: BasketSettings): PricedBasket {
  const { siteDiscount, coupon, shopAnswer } = settings;
  const lines = settings.lines ?? "ready";
  const balance = Number(settings.balance);
  const saleCents = round(GRADED.listCents * (1 - SALE_RATE));
  // A sold-out line keeps its row but leaves the subtotal.
  const gradedCounts = lines !== "sold-out";
  const sealedQuantity = lines === "adjusted" ? SEALED_FILLED : 1;
  const sealedCents = SEALED.listCents * sealedQuantity;

  // A code the basket cannot take never reaches the shop; it is held, muted.
  const siteSubtotal =
    (gradedCounts
      ? siteDiscount === "product-sale"
        ? saleCents
        : GRADED.listCents
      : 0) + sealedCents;
  const tooSmall =
    (coupon === "too-small" &&
      siteSubtotal < COUPONS["too-small"].thresholdCents) ||
    (coupon === "product" && !gradedCounts);
  const codeMeetsSale = coupon !== "none" && !tooSmall;

  const outcome: CodeOutcome =
    coupon === "none"
      ? "no-code"
      : tooSmall
        ? "not-valid"
        : siteDiscount === "none"
          ? "applied"
          : shopAnswer === "stack"
            ? "stacked"
            : shopAnswer === "replace"
              ? "replaced"
              : "refused";
  const codeOn =
    codeMeetsSale && outcome !== "refused" && outcome !== "not-valid";
  const siteOn = siteDiscount !== "none" && outcome !== "replaced";

  let gradedCents = GRADED.listCents;
  let gradedOriginal: number | undefined;
  if (siteOn && siteDiscount === "product-sale") {
    gradedCents = saleCents;
    gradedOriginal = GRADED.listCents;
  }
  let couponCode: string | undefined;
  if (codeOn && coupon === "product") {
    gradedOriginal = gradedOriginal ?? gradedCents;
    gradedCents = round(gradedCents * (1 - COUPONS.product.rate));
    couponCode = COUPONS.product.code;
  }

  const items: CartItemSummary[] = [
    {
      ...SEALED.line,
      price: formatHkd(SEALED.listCents),
      quantity: sealedQuantity,
      ...(lines === "adjusted"
        ? {
            maxQuantity: SEALED_FILLED,
            remainingLabel: `${SEALED_FILLED} left`,
          }
        : {}),
      status: lines === "adjusted" ? "adjusted" : "default",
    },
    {
      ...GRADED.line,
      price: formatHkd(gradedCents),
      ...(gradedOriginal ? { originalPrice: formatHkd(gradedOriginal) } : {}),
      ...(couponCode ? { couponCode } : {}),
      status: gradedCounts ? "default" : "soldOut",
    },
  ];

  const subtotalCents = (gradedCounts ? gradedCents : 0) + sealedCents;
  const orderDiscountCents =
    siteOn &&
    siteDiscount === "order-discount" &&
    subtotalCents >= ORDER_DISCOUNT.thresholdCents
      ? round(subtotalCents * ORDER_DISCOUNT.rate)
      : 0;
  const orderCodeCents =
    codeOn && coupon === "order" ? COUPONS.order.cutCents : 0;
  const billCents = subtotalCents - orderDiscountCents - orderCodeCents;

  // 1 pt = HK$1. A promise larger than the order is trimmed, not refused.
  const pointsAsked =
    settings.points === "none"
      ? 0
      : settings.points === "500"
        ? Math.min(500, balance)
        : balance;
  const pointsTaken = Math.min(pointsAsked, Math.floor(billCents / 100));
  const totalCents = billCents - pointsTaken * 100;

  const promoState: PromoState =
    outcome === "refused"
      ? { status: "expanded", error: REFUSED }
      : codeOn && coupon === "order"
        ? {
            status: "applied",
            label: `Discount (${COUPONS.order.code})`,
            discountAmount: formatCut(orderCodeCents),
          }
        : { status: "collapsed" };

  const pointsState: PointsState =
    pointsTaken > 0
      ? { status: "applied", amountLabel: formatCut(pointsTaken * 100) }
      : { status: "collapsed" };

  const reason = tooSmall
    ? coupon === "product"
      ? NO_GRADED_CARD
      : `Add ${formatHkd(COUPONS["too-small"].thresholdCents - siteSubtotal)} more to use this promo code`
    : outcome === "refused"
      ? REFUSED
      : undefined;

  return {
    items,
    subtotal: formatHkd(subtotalCents),
    orderDiscounts: orderDiscountCents
      ? [
          {
            label: ORDER_DISCOUNT.label,
            amount: formatCut(orderDiscountCents),
          },
        ]
      : [],
    promoState,
    pointsState,
    pointsBalanceLabel: `You’ve ${balance.toLocaleString("en-HK")} pts.`,
    estimatedTotal: formatHkd(totalCents),
    heldCode: heldCodeOf(coupon, reason),
    outcome,
    pointsTaken,
    pointsAsked,
    totalCents,
  };
}

/** The basket before any code: the site discount alone, points not yet used. */
function basketBeforeTheCode(settings: BasketSettings): PricedBasket {
  return priceBasket({ ...settings, coupon: "none", points: "none" });
}

/** The step title for how the code met the site discount. */
const OUTCOME_TITLES: Record<CodeOutcome, string> = {
  "no-code": "No code on the order",
  applied: "Code comes off the order",
  stacked: "Code stacks on the site discount",
  replaced: "Code replaces the site discount",
  refused: "Code refused, the site discount stays",
  "not-valid": "Code not valid for this order yet",
};

const DEFAULT_BASKET: BasketSettings = {
  siteDiscount: "none",
  coupon: "order",
  shopAnswer: "stack",
  points: "none",
  balance: "1250",
};

/** Controls for the basket's settings, each named where staging sets it up. */
const BASKET_ARG_TYPES = {
  siteDiscount: {
    name: "Site discount",
    description: "Shopify Admin > Discounts, an automatic discount",
    control: {
      type: "radio",
      labels: {
        none: "None",
        "product-sale": "10% off graded cards, on the line",
        "order-discount": "5% off orders of HK$30,000 or more",
      },
    },
    options: ["none", "product-sale", "order-discount"],
  },
  coupon: {
    name: "Coupon",
    description: "Held in the member's wallet, minted by Loyalty",
    control: {
      type: "radio",
      labels: {
        none: "None",
        order: "HK$50 off any order",
        product: "10% off graded cards",
        "too-small": "HK$200 off orders of HK$50,000 or more",
      },
    },
    options: ["none", "order", "product", "too-small"],
  },
  shopAnswer: {
    name: "Shop's answer",
    description:
      "The combinations on the site discount in Shopify Admin and the coupon's own combine setting",
    control: {
      type: "radio",
      labels: {
        stack: "Combines - both apply",
        replace: "Does not combine - the code wins",
        refuse: "Does not combine - the code is refused",
      },
    },
    options: ["stack", "replace", "refuse"],
    if: { arg: "siteDiscount", neq: "none" },
  },
  points: {
    name: "Points",
    description: "The member's choice on the cart, 1 pt = HK$1",
    control: {
      type: "radio",
      labels: { none: "None", "500": "500 pts", max: "Use max" },
    },
    options: ["none", "500", "max"],
  },
  lines: {
    name: "Lines",
    description:
      "What the cart's open-time read finds in Shopify: stock and availability",
    control: {
      type: "radio",
      labels: {
        ready: "As added",
        "sold-out": "The graded card sold out",
        adjusted: "Two boxes left of more asked",
      },
    },
    options: ["ready", "sold-out", "adjusted"],
  },
  balance: {
    name: "Balance",
    description: "The member's redeemable points, in the loyalty console",
    control: {
      type: "radio",
      labels: { "1250": "1,250 pts", "50000": "50,000 pts" },
    },
    options: ["1250", "50000"],
  },
} as const;

/** The requirement that decides each basket setting's outcome. */
const BASKET_RULES = {
  siteDiscount:
    "shared/ui/store-cart: A site sale reaches the drawer only on its lines",
  coupon:
    "grade10-site/store/discounts: A draft order carries at most one discount code",
  shopAnswer:
    "grade10-site/store/site-discounts: Shopify's rules decide how a site discount meets a discount code, and grade10 accepts what the shop priced",
  points: "grade10-site/loyalty/paying-with-points#pay-online",
  balance: "grade10-site/loyalty/paying-with-points#rate-one-dollar",
  lines:
    "shared/ui/store-cart: Fetching status and price info on open with Boneyard skeletons",
} as const;

export type { BasketSettings, CodeOutcome, LineState, PricedBasket };
export {
  BASKET_ARG_TYPES,
  BASKET_RULES,
  basketBeforeTheCode,
  COUPONS,
  DEFAULT_BASKET,
  formatCut,
  formatHkd,
  OUTCOME_TITLES,
  priceBasket,
};
