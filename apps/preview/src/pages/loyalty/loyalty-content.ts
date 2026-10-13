import { formatDay } from "@grade10/date";
import type {
  ActivityEntry,
  ActivityListCopy,
  AsyncState,
  CartItemSummary,
  CouponItem,
  CouponListCopy,
  MemberCardCopy,
  MembershipSummaryCopy,
  RewardMenuCopy,
  RewardMenuItem,
  WalletPassLinksCopy,
  WalletPassWallet,
} from "@grade10/ui";
import { storyHref } from "../workbench-story-nav";

/* Stand-in programme content the Loyalty workbench draws with. Grade10's own
 * copy and figures for the examples only; a consumer supplies its own. */

/** Storybook story id for the Pay Part of a Basket flow. */
const LOYALTY_PAY_PART_OF_BASKET_STORY_ID =
  "loyalty-paying-with-points-flows-pay-part-of-a-basket--part-of-basket";

/** Preview href from Membership to the points-on-the-basket flow. */
const LOYALTY_PAY_PART_OF_BASKET_HREF = storyHref(
  LOYALTY_PAY_PART_OF_BASKET_STORY_ID,
);

const RENEWS = formatDay(Date.UTC(2027, 2, 1));
const EXPIRES_LATER = formatDay(Date.UTC(2027, 1, 14));
const EXPIRES_SOON = formatDay(Date.UTC(2026, 10, 2));
const COUPON_VALID = formatDay(Date.UTC(2027, 0, 11));

const MEMBER = {
  displayName: "Mei Lin",
  /** Eight letters, none of I, L, O or U. */
  fallbackCode: "KRMT-QWPB",
  /** Opaque, single-use, minted by the programme; this one only looks the part. */
  token: "g10m.eyJrIjoiZml4dHVyZSJ9.5f2a9c",
};

const MEMBERSHIP_SUMMARY_COPY: MembershipSummaryCopy = {
  title: "My membership",
  tier: "Tier",
  balance: "Points to spend",
  qualifying: "Points earned this year",
  renewal: "Tier renews",
};

const MEMBER_CARD_COPY: MemberCardCopy = {
  qrAlt: "Your member QR code",
  fallbackCode: "Short code",
  refresh: "Get a new code",
  expiresIn: "Expires in",
  secondsUnit: "s",
  expired: "This code has expired. Get a new one.",
  used: "This code has already been used",
};

const REWARD_MENU_COPY: RewardMenuCopy = {
  label: "Rewards",
  redeem: "Redeem",
  points: "pts",
  atQuantityBound: "Maximum per redemption",
  insufficient: "Not enough points",
  decreaseQuantity: "Decrease quantity",
  increaseQuantity: "Increase quantity",
};

const COUPON_LIST_COPY: CouponListCopy = {
  label: "Your coupons",
  maskedCode: "Code hidden",
  spent: "Spent",
  void: "Void",
  expired: "Expired",
};

/** The controls a surface hangs on an open coupon. */
const COUPON_ACTION_COPY = {
  useAtCheckout: "Use at checkout",
  showToTill: "Show to the till",
};

const ACTIVITY_LIST_COPY: ActivityListCopy = {
  label: "Activity",
};

const WALLET_PASS_COPY: WalletPassLinksCopy = {
  heading: "Carry your card on your phone",
  unreachable: "We could not check your passes just now.",
};

const MEMBERSHIP_PAGE_COPY = {
  breadcrumbAccount: "Account",
  title: "Membership",
  cardHeading: "Your member card",
  rewardsHeading: "Rewards",
  couponsHeading: "Your coupons",
  spendHeading: "Spend on your basket",
  spendBody:
    "Points come off your bill at checkout. No code is needed, and nothing is held until you pay.",
  spendAction: "Go to checkout",
  activityHeading: "Activity",
};

const REWARDS: RewardMenuItem[] = [
  {
    id: "voucher-50",
    name: "HK$50 off",
    pointCost: 500,
    validity: "Code valid 90 days from redemption",
    limits: "Spend HK$300 or more · In store only",
  },
  {
    id: "sleeves",
    name: "Grade10 card sleeves",
    pointCost: 120,
    maxQuantity: 3,
    collectionWindow: "Collect in store within 14 days",
  },
  {
    id: "slab-stand",
    name: "Acrylic slab stand",
    pointCost: 4000,
    collectionWindow: "Collect in store within 30 days",
  },
];

const COUPONS: CouponItem[] = [
  {
    id: "coupon-open",
    amount: "HK$50",
    code: "GRD-50-7Q2M",
    description: "HK$50 off any order",
    expiry: `Valid until ${COUPON_VALID}`,
    status: "open",
  },
  {
    id: "coupon-spent",
    amount: "HK$100",
    code: "GRD-100-XK4P",
    description: "HK$100 off any order",
    expiry: `Valid until ${formatDay(Date.UTC(2026, 9, 15))}`,
    status: "spent",
  },
  {
    id: "coupon-void",
    amount: "HK$50",
    code: "GRD-50-9ZZT",
    expiry: `Expired ${formatDay(Date.UTC(2026, 5, 30))}`,
    status: "void",
  },
  {
    id: "coupon-expired",
    amount: "10%",
    code: "GRD-10-M3RT",
    description: "10% off graded cards",
    expiry: `Expired ${formatDay(Date.UTC(2026, 4, 1))}`,
    status: "expired",
  },
];

/** The coupon a redemption issues, before the member has spent it. */
const ISSUED_COUPON: CouponItem = {
  id: "coupon-issued",
  amount: "HK$50 off",
  code: "GRD-50-4HVD",
  description: "HK$50 off any order",
  expiry: `Valid until ${COUPON_VALID}`,
  status: "open",
};

const ACTIVITY: ActivityEntry[] = [
  {
    id: "entry-purchase",
    kind: "Purchase",
    delta: 105,
    date: formatDay(Date.UTC(2026, 8, 20)),
    channel: "In store",
    context: "Order #10482",
  },
  {
    id: "entry-redeem",
    kind: "Redeemed HK$50 off",
    delta: -500,
    date: formatDay(Date.UTC(2026, 9, 2)),
    channel: "Online store",
    context: "Balance: 1250",
  },
  {
    id: "entry-adjustment",
    kind: "Points adjusted",
    delta: 120,
    date: formatDay(Date.UTC(2026, 9, 9)),
    channel: "Membership programme",
  },
];

const GOOGLE_SAVE_URL = "https://pay.google.com/gp/v/save/example";
const APPLE_PASS_URL = "https://example.com/passes/grade10.pkpass";

/** A wallet the member can add the card to. */
const GOOGLE_OFFERED: WalletPassWallet = {
  id: "google",
  offer: { label: "Add to Google Wallet" },
};
const APPLE_OFFERED: WalletPassWallet = {
  id: "apple",
  offer: { label: "Add to Apple Wallet" },
};
/** Carried in Google Wallet; the install link stands beside the held sentence. */
const GOOGLE_HELD: WalletPassWallet = {
  id: "google",
  offer: { label: "Open in Google Wallet", saveUrl: GOOGLE_SAVE_URL },
  heldLabel: "Carried in Google Wallet",
  endLabel: "End Google pass",
};
const APPLE_HELD: WalletPassWallet = {
  id: "apple",
  offer: { label: "Open in Apple Wallet", saveUrl: APPLE_PASS_URL },
  heldLabel: "Carried in Apple Wallet",
  endLabel: "End Apple pass",
};

/** The day the balance lapses, and the tone the consumer says it in. */
type BalanceExpiry = { day: string; tone: "normal" | "warning" };

/** The expiry prop the summary takes, worded by the consumer from the balance. */
function balanceExpiryProp(
  balance: number,
  expiry: BalanceExpiry,
): { line: string; tone: BalanceExpiry["tone"] } {
  const line =
    expiry.tone === "warning"
      ? `${balance} points expire on ${expiry.day}. Use them before then.`
      : `${balance} points expire on ${expiry.day}`;
  return { line, tone: expiry.tone };
}

const BALANCE_EXPIRES_LATER: BalanceExpiry = {
  day: EXPIRES_LATER,
  tone: "normal",
};
const BALANCE_EXPIRES_SOON: BalanceExpiry = {
  day: EXPIRES_SOON,
  tone: "warning",
};

/** The membership figures a view draws; every state is a variant of it. */
type MembershipView = {
  tier: string;
  balance: number;
  qualifyingPoints: number;
  qualifyingThreshold: number;
  renewalDate: string;
  tierValidity?: string;
  balanceExpiry?: BalanceExpiry;
  rewards: AsyncState<readonly RewardMenuItem[]>;
  coupons: AsyncState<readonly CouponItem[]>;
  activity: AsyncState<readonly ActivityEntry[]>;
  /** The wallets the member already carries a pass in. */
  heldWallets: readonly string[];
};

const MEMBERSHIP_VIEW: MembershipView = {
  tier: "Gold",
  balance: 1250,
  qualifyingPoints: 320,
  qualifyingThreshold: 500,
  renewalDate: RENEWS,
  tierValidity:
    "Gold earns 1.2× points. Keep it with 500 points earned by then.",
  balanceExpiry: BALANCE_EXPIRES_LATER,
  rewards: { status: "ready", data: REWARDS },
  coupons: { status: "ready", data: COUPONS },
  activity: { status: "ready", data: ACTIVITY },
  heldWallets: [],
};

/** The states the Membership screen draws, each a change to the default view. */
const MEMBERSHIP_STATE_VIEWS = {
  noPoints: {
    ...MEMBERSHIP_VIEW,
    tier: "Silver",
    balance: 0,
    qualifyingPoints: 0,
    tierValidity: "Silver. Earn on every paid purchase to start toward Gold.",
    balanceExpiry: undefined,
    coupons: {
      status: "empty",
      message: "You have no coupons yet. Redeem a reward to get one.",
    },
    activity: {
      status: "empty",
      message: "No activity yet. Purchases appear here once they are recorded.",
    },
  },
  expiresSoon: {
    ...MEMBERSHIP_VIEW,
    balanceExpiry: BALANCE_EXPIRES_SOON,
  },
  thresholdReached: {
    ...MEMBERSHIP_VIEW,
    qualifyingPoints: 620,
  },
  rewardsLoading: {
    ...MEMBERSHIP_VIEW,
    rewards: { status: "loading" },
  },
  noCoupons: {
    ...MEMBERSHIP_VIEW,
    coupons: {
      status: "empty",
      message: "You have no coupons yet. Redeem a reward to get one.",
    },
  },
  passAdded: {
    ...MEMBERSHIP_VIEW,
    heldWallets: ["google"],
  },
} satisfies Record<string, MembershipView>;

/** Stand-in basket for the points-on-the-cart flow: two lines, HK$1,400. */
const CART_ITEMS: readonly CartItemSummary[] = [
  {
    id: "line-booster",
    name: "Sealed Booster Box",
    price: "HK$1,280.00",
    quantity: 1,
  },
  {
    id: "line-sleeves",
    name: "Card sleeves",
    price: "HK$120.00",
    quantity: 1,
  },
];

const CART_SUBTOTAL = "HK$1,400.00";
const POINTS_BALANCE_LABEL = "You’ve 1,250 pts.";

export type { BalanceExpiry, MembershipView };
export {
  ACTIVITY,
  ACTIVITY_LIST_COPY,
  APPLE_HELD,
  APPLE_OFFERED,
  APPLE_PASS_URL,
  BALANCE_EXPIRES_LATER,
  BALANCE_EXPIRES_SOON,
  balanceExpiryProp,
  CART_ITEMS,
  CART_SUBTOTAL,
  COUPON_ACTION_COPY,
  COUPON_LIST_COPY,
  COUPONS,
  GOOGLE_HELD,
  GOOGLE_OFFERED,
  GOOGLE_SAVE_URL,
  ISSUED_COUPON,
  LOYALTY_PAY_PART_OF_BASKET_HREF,
  LOYALTY_PAY_PART_OF_BASKET_STORY_ID,
  MEMBER,
  MEMBER_CARD_COPY,
  MEMBERSHIP_PAGE_COPY,
  MEMBERSHIP_STATE_VIEWS,
  MEMBERSHIP_SUMMARY_COPY,
  MEMBERSHIP_VIEW,
  POINTS_BALANCE_LABEL,
  REWARD_MENU_COPY,
  REWARDS,
  WALLET_PASS_COPY,
};
