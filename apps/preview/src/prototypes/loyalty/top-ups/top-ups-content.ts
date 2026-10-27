/* Draft words and stand-in figures for buying points, as the member reads
 * them. Pack sizes, discounts and limits are an operator's; these only look
 * the part. The terms line is a draft until Legal confirms it. */

export const TOP_UPS_MANUAL_PATH = "loyalty/top-ups";

export type TopUpPack = {
  id: string;
  points: number;
  /** Whole percent off, 0 for none. */
  discountPercent: number;
};

/** Packs on sale, in the operator's order. */
export const TOP_UP_PACKS: readonly TopUpPack[] = [
  { id: "pack-1k", points: 1_000, discountPercent: 0 },
  { id: "pack-5k", points: 5_000, discountPercent: 3 },
  { id: "pack-10k", points: 10_000, discountPercent: 5 },
  { id: "pack-50k", points: 50_000, discountPercent: 10 },
];

/** A pack strictly above this many points is reviewed before it is credited. */
export const REVIEW_THRESHOLD = 20_000;

/** Points still allowed today in the over-limit state. */
export const LEFT_TODAY = 8_000;

/** The pack that goes off sale between the list and checkout. */
export const OFF_SALE_PACK_ID = "pack-10k";

export const MEMBER_BALANCE = { total: 1_200, earned: 200, toppedUp: 1_000 };
export const MEMBER_EMAIL = "mei.lin@example.com";

/** The reference a held top-up reads back, on the result and its history row. */
export const UNDER_REVIEW_REFERENCE = "TU-2026-0384";

/** Crumb labels every top-ups surface shares. */
export const TOP_UPS_BREADCRUMBS = {
  account: "Account",
  membership: "Membership",
} as const;

const points = (value: number) => `${value.toLocaleString("en-US")} points`;
const hkd = (value: number) => `HK$${value.toLocaleString("en-US")}`;

export const packPrice = (pack: TopUpPack) =>
  Math.round(pack.points * (1 - pack.discountPercent / 100));
export const packSaving = (pack: TopUpPack) => pack.points - packPrice(pack);

export const TOP_UP_COPY = {
  title: "Top Up Points",
  description:
    "Buy points at a discount. Each point takes HK$1 off at checkout.",
  balance: (total: number) => `Your balance: ${points(total)}`,
  balanceEarned: "Earned",
  balanceToppedUp: "Topped up",

  packsLegend: "Choose a pack",
  packPoints: (value: number) => value.toLocaleString("en-US"),
  packPointsSuffix: "points",
  packPrice: hkd,
  packWasPrice: hkd,
  packSave: (percent: number) => `Save ${percent}%`,
  packOverLimit: "Over today’s limit",
  limitLeft: (left: number) => `${points(left)} left today`,
  limitReached: {
    title: "You’ve reached today’s top-up limit",
    description: "You can buy again tomorrow.",
  },

  /** One line under the button once a pack is picked: what, what it costs,
   *  where the balance lands. */
  selectedLine: (pts: number, price: number, after: number) =>
    `${points(pts)} for ${hkd(price)}. Balance after: ${points(after)}`,
  reviewNote:
    "Packs this size are reviewed before the points arrive. Your card is charged only if it’s approved.",

  terms:
    "I understand topped-up points can’t be refunded, cashed out or transferred, and I agree to the Top-Up Terms.",
  termsLink: "Top-Up Terms",
  choosePackError: "Choose a pack to continue.",
  termsError: "Agree to the terms to continue.",

  continue: "Continue to payment",
  opening: "Opening checkout…",
  paymentNote:
    "You’ll pay securely with Stripe. Card, Apple Pay and Google Pay accepted.",
  smallPrint:
    "Topped-up points expire with the rest of your balance and don’t count toward your tier.",
  historyLink: "View top-up history",

  offSale: {
    title: "That pack is no longer available",
    description: "Choose another pack to continue.",
  },
  notOpened: {
    title: "We couldn’t open checkout",
    description: "You haven’t been charged. Try again in a moment.",
  },
  paused: {
    title: "Top-ups are paused on your account",
    description:
      "You can still spend the points you have. Contact us if you have questions.",
    action: "Contact us",
  },
  unavailable: {
    title: "Top-ups aren’t available right now",
    description: "Check back soon. You can still spend the points you have.",
    action: "Close",
  },
} as const;

export const TOP_UP_RESULT_COPY = {
  backToMembership: "Back to Membership",
  confirming: {
    title: "Confirming your payment…",
    description:
      "This usually takes a few seconds. Please keep this page open.",
  },
  added: {
    title: (added: number) => `${points(added)} added`,
    balance: (total: number) => `Your balance is now ${points(total)}.`,
    receipt: (email: string) => `Stripe has emailed your receipt to ${email}.`,
    shop: "Start shopping",
  },
  underReview: {
    title: "Your top-up is under review",
    description: (price: number, added: number) =>
      `We’ve placed a hold of ${hkd(price)} on your card. Once approved, we’ll charge it and add ${points(added)}. If it isn’t approved, the hold is released and you won’t be charged.`,
    reference: (ref: string) => `Reference ${ref}`,
    safeToLeave:
      "You can close this page. You’ll see the result in your Top-Up History.",
    history: "View Top-Up History",
  },
  notApproved: {
    title: "Your top-up wasn’t approved",
    description:
      "You haven’t been charged, and the hold on your card has been released.",
    contact: "Contact us",
  },
  notCompleted: {
    title: "Payment not completed",
    description: "You haven’t been charged.",
    retry: "Try again",
  },
} as const;

export type TopUpHistoryEntry = {
  id: string;
  date: string;
  points: number;
  paid: number;
  status: "credited" | "under-review" | "not-approved" | "charged-back";
  /** Stripe receipt; only a completed charge has one. */
  receipt?: boolean;
};

export const TOP_UP_HISTORY_ENTRIES: readonly TopUpHistoryEntry[] = [
  {
    id: "tu-1",
    date: "24 Oct 2026",
    points: 50_000,
    paid: 45_000,
    status: "under-review",
  },
  {
    id: "tu-2",
    date: "15 Sep 2026",
    points: 1_000,
    paid: 1_000,
    status: "credited",
    receipt: true,
  },
  {
    id: "tu-3",
    date: "2 Sep 2026",
    points: 5_000,
    paid: 4_850,
    status: "charged-back",
    receipt: true,
  },
  {
    id: "tu-4",
    date: "20 Aug 2026",
    points: 10_000,
    paid: 9_500,
    status: "not-approved",
  },
];

export const TOP_UP_HISTORY_COPY = {
  title: "Top-Up History",
  description: "Every pack you’ve bought or tried to buy.",
  colDate: "Date",
  colPack: "Points",
  colPaid: "Paid",
  colStatus: "Status",
  colReceipt: "Receipt",
  receipt: "View",
  status: {
    credited: "Added",
    "under-review": "Under review",
    "not-approved": "Not approved",
    "charged-back": "Charged back",
  },
  underReviewHint: "Your card is charged only if this is approved.",
  empty: {
    title: "No top-ups yet",
    description: "Points packs you buy will show here.",
    action: "Top up points",
  },
  backToMembership: "Back to Membership",
} as const;
