import { formatDay, formatMonthName } from "@grade10/date";
import { Link } from "@grade10/design-system/components/forms/link";
import type {
  AsyncState,
  CartItemSummary,
  CouponItem,
  CouponListCopy,
  LedgerEntry,
  MemberPassCopy,
  PointHistoryCopy,
  PointsTotals,
  RewardCheckoutCopy,
  RewardMenuCopy,
  RewardMenuItem,
  TierCardCopy,
  WalletPassLinksCopy,
  WalletPassWallet,
} from "@grade10/ui"; /* Stand-in programme content the Loyalty workbench draws with. Grade10's own
 * copy and figures for the examples only; a consumer supplies its own. */
import { createElement } from "react";

const RENEWS = formatDay(Date.UTC(2027, 2, 1));
const COUPON_VALID = formatDay(Date.UTC(2027, 0, 11));

const MEMBER = {
  displayName: "Mei Lin",
  /** No name is collected at registration; the pass carries the account email. */
  email: "mei.lin@example.com",
  /** Opaque, single-use, minted by the programme; this one only looks the part. */
  token: "g10m.eyJrIjoiZml4dHVyZSJ9.5f2a9c",
};

const TIER_CARD_COPY: TierCardCopy = {
  balance: "Points to spend",
  points: "pts",
  worthSuffix: "off at checkout",
  qualifying: "Keep Gold",
};

const MEMBER_PASS_COPY: MemberPassCopy = {
  qrAlt: "Your member QR code",
  refresh: "Refresh",
  refreshesIn: "Refreshes in",
};

const REWARD_MENU_COPY: RewardMenuCopy = {
  label: "Rewards",
  points: "pts",
  pointCount: (points) => points.toLocaleString("en-HK"),
};

const REWARD_CHECKOUT_COPY: RewardCheckoutCopy = {
  useAt: "Use at",
  validFor: "Valid for",
  pointBalance: "Point Balance",
  points: "pts",
  pointCount: (points) => points.toLocaleString("en-HK"),
  pointsNeeded: (missing) => `Need ${missing.toLocaleString("en-HK")} more pts`,
  redeemFor: (cost) => `Redeem for ${cost.toLocaleString("en-HK")} pts`,
  cancel: "Cancel",
  redeemedCouponTitle: "Added to your coupons",
  redeemedItemTitle: "Ready to Collect",
  done: "Done",
  viewCoupons: "View Coupons",
};

const COUPON_LIST_COPY: CouponListCopy = {
  label: "Your coupons",
  spent: "Spent",
  void: "Void",
  scanTitle: "Use Coupon",
};

/** The controls a surface hangs on an open coupon. */
const COUPON_ACTION_COPY = {
  useAtCheckout: "Use at checkout",
  showToTill: "Show to the till",
};

const POINT_HISTORY_COPY: PointHistoryCopy = {
  label: "Point history",
  summary: {
    earned: "Earned",
    used: "Used",
    pending: "Pending",
    points: "pts",
  },
  filters: { all: "All", earned: "Earned", used: "Used", pending: "Pending" },
  filteredEmpty: {
    all: "No entries yet.",
    earned: "Nothing earned yet.",
    used: "Nothing used yet.",
    pending: "Nothing on the way.",
  },
  pending: {
    title: "Pending",
    body: "Points land when order completes.",
    points: "pts",
  },
};

const WALLET_PASS_COPY: WalletPassLinksCopy = {
  unreachable: "We could not check your passes just now.",
};

const TIER_BENEFITS_PAGE_COPY = {
  title: "Tiers & Benefits",
};

/** One line of the programme's mechanics, as the Tiers & Benefits surface reads it. */
type HowPointsWorkRow = {
  id: "earn" | "pending" | "spend" | "expiry";
  title: string;
  body: string;
};

const HOW_POINTS_WORK = {
  heading: "How points work",
  rows: [
    {
      id: "earn",
      title: "Earn",
      body: "1 pt for every HK$10 you spend.",
    },
    {
      id: "pending",
      title: "Pending",
      body: "Points arrive after your order completes.",
    },
    {
      id: "spend",
      title: "Spend",
      body: "1 pt = HK$1 off at checkout, or swap them for rewards and coupons.",
    },
    {
      id: "expiry",
      title: "Expiry",
      body: "Points expire after 12 months with no activity. We’ll remind you 30 days before.",
    },
  ] satisfies readonly HowPointsWorkRow[],
};

/** One rung of the ladder, as the Tiers & Benefits surface reads it. */
type TierBenefitsRow = {
  id: string;
  tier: string;
  caption: string;
  benefits: readonly string[];
  /** A rung nobody earns: the ladder draws no connector into it. */
  invitationOnly?: boolean;
};

const TIER_BENEFITS: readonly TierBenefitsRow[] = [
  {
    id: "silver",
    tier: "Silver",
    caption: "Free to join",
    benefits: ["1 pt for every HK$10 spent"],
  },
  {
    id: "gold",
    tier: "Gold",
    caption: "500 pts / year",
    benefits: ["1.2 pt for every HK$10 spent"],
  },
  {
    id: "black",
    tier: "Black",
    caption: "Invitation only",
    benefits: ["1.7 pt for every HK$10 spent"],
    invitationOnly: true,
  },
];

const COUPONS_PAGE_COPY = {
  title: "Coupons",
  availableTab: "Available",
  historyTab: "Used & Expired",
  noAvailable: "Nothing to use yet",
  noAvailableDescription: "New coupons land here, ready to scan.",
  noHistory: "No used or expired coupons",
  noHistoryDescription:
    "Coupons you’ve spent or that have lapsed show up here.",
  noCoupons: "No coupons yet",
  noCouponsDescription: "Coupons you earn or get from the shop appear here.",
};

/** The upsell under the Available tab — points still buy more. */
const COUPON_PROMO_COPY = {
  title: "Want more coupons?",
  description: "Turn your points into coupons in Rewards.",
  cta: "Browse Rewards",
};

const REWARDS_PAGE_COPY = {
  title: "Rewards",
  subtitle: "Swap points for coupons, collecting supplies and vault services.",
};

const MEMBERSHIP_PAGE_COPY = {
  title: "Membership",
  cardHeading: "Your Member Pass",
  rewardsHeading: "Rewards",
  couponsHeading: "Your Coupons",
  topUpAction: "Top-up Points",
  pointHistoryHeading: "Points History",
};

/** Stand-in product art for the item rewards. */
const REWARD_IMAGE = new URL("../product.fixture.png", import.meta.url).href;

const REWARDS: RewardMenuItem[] = [
  {
    id: "potatoz",
    kind: "item",
    name: "Halloween Potatoz",
    description: "Pick one from Zombie, Demon and Halloween Hat Potatoz.",
    pointCost: 100,
    image: { src: REWARD_IMAGE, alt: "Three plush Potatoz keychains" },
    deadline: "Until 31 Dec 2026",
    useAt: "Grade10 store",
    validFor: "14 days from redemption",
  },
  {
    id: "voucher-50",
    kind: "coupon",
    name: "HK$50 off coupon",
    description: "Spend at online or offline store",
    pointCost: 500,
    useAt: "Online or physical store",
    validFor: "90 days from redemption",
  },
  {
    id: "slab-stand",
    kind: "item",
    name: "Acrylic slab stand",
    description: "Display one graded slab upright.",
    pointCost: 4000,
    image: { src: REWARD_IMAGE, alt: "A clear acrylic slab stand" },
    useAt: "Grade10 store",
    validFor: "30 days from redemption",
  },
  {
    id: "uv-sleeves",
    kind: "item",
    name: "UV slab sleeves",
    description: "Shield fifty graded slabs from light.",
    pointCost: 300,
    image: { src: REWARD_IMAGE, alt: "A pack of UV slab sleeves" },
    useAt: "Grade10 store",
    validFor: "30 days from redemption",
  },
  {
    id: "foil-pack",
    kind: "item",
    name: "Mystery foil pack",
    description: "One sealed pack from the foil promo wave.",
    pointCost: 800,
    image: { src: REWARD_IMAGE, alt: "A sealed foil promo pack" },
    useAt: "Grade10 store",
    validFor: "30 days from redemption",
  },
  {
    id: "express-grading",
    kind: "item",
    name: "Express grading voucher",
    description: "Jump one submission to the front of the grading queue.",
    pointCost: 1100,
    image: { src: REWARD_IMAGE, alt: "An express grading voucher" },
    useAt: "Grade10 store",
    validFor: "30 days from redemption",
  },
];

/** Stand-in availability: these rewards have run out; redeeming one is
 * refused and the surface closes. */
const SOLD_OUT_REWARDS: ReadonlySet<string> = new Set(["uv-sleeves"]);

/** Stand-in flakiness: the first redeem attempt on these dies on the wire;
 * retryable — the surface stays open. */
const FLAKY_REWARDS: ReadonlySet<string> = new Set(["foil-pack"]);

/** Stand-in drift: the balance fell short elsewhere since the sheet opened;
 * the page refetches and the deficit row shows. */
const BALANCE_DROPPED_REWARDS: ReadonlySet<string> = new Set([
  "express-grading",
]);
const DROPPED_BALANCE = 600;

const SOLD_OUT_COPY = {
  title: "This reward just ran out",
  description: "No points were taken. Pick another reward.",
};

const RETRY_COPY = {
  title: "Couldn't redeem just now",
  description: "No points were taken. Check your connection and try again.",
};

const SHORT_BALANCE_COPY = {
  title: "Not enough points",
  description: (missing: number) =>
    `You need ${missing.toLocaleString("en-HK")} more pts to redeem this reward. No points were taken.`,
};

/** The staff-facing scan every open coupon offers — the token the till
 * reads, minted when the member chooses the coupon. */
const COUPON_SCAN = {
  altText: "Show this code to store staff",
  toggleLabel: "Use now",
  caption: "Staff scan this at the counter",
};

const COUPONS: CouponItem[] = [
  {
    id: "coupon-open",
    amount: "HK$50",
    code: "GRD-50-7Q2M",
    description: "HK$50 off any order",
    expiry: `Use by ${formatDay(Date.UTC(2026, 10, 8))}`,
    status: "open",
    expiringSoon: true,
    qrCode: { ...COUPON_SCAN, value: "g10:redeem:coupon-open:7Q2M" },
  },
  {
    id: "coupon-online",
    amount: "HK$30",
    code: "GRD-30-W8BN",
    description: "HK$30 off any order",
    expiry: `Use by ${formatDay(Date.UTC(2027, 0, 15))}`,
    status: "open",
    scopeLabel: "Online only",
    qrCode: { ...COUPON_SCAN, value: "g10:redeem:coupon-online:W8BN" },
  },
  {
    id: "coupon-spent",
    amount: "HK$100",
    code: "GRD-100-XK4P",
    description: "HK$100 off any order",
    expiry: `Use by ${formatDay(Date.UTC(2026, 9, 15))}`,
    status: "spent",
    statusLabel: `Used on ${formatDay(Date.UTC(2026, 9, 12))}`,
  },
  {
    id: "coupon-void",
    amount: "HK$50",
    code: "GRD-50-9ZZT",
    expiry: `Expired ${formatDay(Date.UTC(2026, 5, 30))}`,
    status: "void",
    statusLabel: `Void ${formatDay(Date.UTC(2026, 5, 30))}. Points returned`,
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
  expiry: `Use by ${COUPON_VALID}`,
  status: "open",
  qrCode: { ...COUPON_SCAN, value: "g10:redeem:coupon-issued:4HVD" },
};

const LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: "entry-pending-online",
    kind: "Online purchase",
    track: "earned",
    pending: true,
    delta: 86,
    context: "Order #10511",
  },
  {
    id: "entry-pending-store",
    kind: "In-store purchase",
    track: "earned",
    pending: true,
    delta: 42,
    context: "Order #10514",
  },
  {
    id: "entry-tickets",
    kind: "Grade10 FEST Summer 2026",
    track: "earned",
    icon: "order",
    delta: 60,
    date: formatDay(Date.UTC(2026, 9, 20)),
    month: formatMonthName(Date.UTC(2026, 9, 20)),
  },
  {
    id: "entry-sleeves",
    kind: "Redeemed reward",
    track: "used",
    icon: "reward",
    delta: -120,
    date: formatDay(Date.UTC(2026, 9, 14)),
    month: formatMonthName(Date.UTC(2026, 9, 14)),
    context: "Redeemed Grade10 card sleeves",
  },
  {
    id: "entry-adjustment",
    kind: "Points adjusted",
    track: "earned",
    icon: "adjustment",
    delta: 120,
    date: formatDay(Date.UTC(2026, 9, 9)),
    month: formatMonthName(Date.UTC(2026, 9, 9)),
    context: "Credit from Grade10",
  },
  {
    id: "entry-redeem",
    kind: "Redeemed reward",
    track: "used",
    icon: "reward",
    delta: -500,
    date: formatDay(Date.UTC(2026, 9, 2)),
    month: formatMonthName(Date.UTC(2026, 9, 2)),
    context: "Redeemed HK$50 off",
  },
  {
    id: "entry-purchase",
    kind: "In-store purchase",
    track: "earned",
    icon: "order",
    delta: 105,
    date: formatDay(Date.UTC(2026, 8, 20)),
    month: formatMonthName(Date.UTC(2026, 8, 20)),
    context: "Order #10482",
  },
  {
    id: "entry-topup",
    kind: "Points top-up",
    track: "earned",
    icon: "topup",
    delta: 200,
    date: formatDay(Date.UTC(2026, 8, 15)),
    month: formatMonthName(Date.UTC(2026, 8, 15)),
    /* The Stripe receipt lives on the entry itself — a top-up's only
     * paperwork, so the ledger carries no separate history surface. */
    context: createElement(
      Link,
      { href: "#receipt-entry-topup", size: "sm", variant: "secondary" },
      "View Receipt",
    ),
  },
  {
    id: "entry-topup-review",
    kind: "Points top-up",
    track: "earned",
    /* Above the 50,000-point review threshold, so the ledger shows it held. */
    delta: 60000,
    pending: true,
    context: "Under review. Ref TU-2026-0384.",
  },
  {
    id: "entry-credits",
    kind: "Use at checkout",
    track: "used",
    icon: "credits",
    delta: -80,
    date: formatDay(Date.UTC(2026, 8, 10)),
    month: formatMonthName(Date.UTC(2026, 8, 10)),
    context: "Order #10514",
  },
  {
    id: "entry-topup-chargeback",
    kind: "Top-up charged back",
    track: "used",
    icon: "topup",
    delta: -1000,
    date: formatDay(Date.UTC(2026, 8, 5)),
    month: formatMonthName(Date.UTC(2026, 8, 5)),
  },
];

const POINTS_TOTALS: PointsTotals = {
  earned: 500,
  used: -820,
  pending: 128,
};

const GOOGLE_SAVE_URL = "https://pay.google.com/gp/v/save/example";
const APPLE_PASS_URL = "https://example.com/passes/grade10.pkpass";

/** A wallet the member can add the card to. */
const GOOGLE_OFFERED: WalletPassWallet = {
  id: "google",
  artwork: { wallet: "google" },
  offer: { label: "Add to Google Wallet" },
};
const APPLE_OFFERED: WalletPassWallet = {
  id: "apple",
  artwork: { wallet: "apple" },
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

/** The membership figures a view draws; every state is a variant of it. */
type MembershipView = {
  tier: string;
  /** The skin the held tier's card wears. */
  tierVariant: "silver" | "gold" | "black";
  balance: number;
  /** What the balance pays at checkout, formatted for the page. */
  worth: string;
  qualifyingPoints: number;
  qualifyingThreshold: number;
  retentionLine?: string;
  earnLine?: string;
  rewards: AsyncState<readonly RewardMenuItem[]>;
  coupons: AsyncState<readonly CouponItem[]>;
  ledger: AsyncState<readonly LedgerEntry[]>;
  ledgerTotals: PointsTotals;
  /** The wallets the member already carries a pass in. */
  heldWallets: readonly string[];
};

const MEMBERSHIP_VIEW: MembershipView = {
  tier: "Gold",
  tierVariant: "gold",
  balance: 1250,
  worth: "HK$125",
  qualifyingPoints: 320,
  qualifyingThreshold: 500,
  retentionLine: `Earn 180+ pts by ${RENEWS} to stay Gold`,
  earnLine: "Gold earning 1.2x points",
  rewards: { status: "ready", data: REWARDS },
  coupons: { status: "ready", data: COUPONS },
  ledger: { status: "ready", data: LEDGER_ENTRIES },
  ledgerTotals: POINTS_TOTALS,
  heldWallets: [],
};

/** The states the Membership screen draws, each a change to the default view. */
const MEMBERSHIP_STATE_VIEWS = {
  noPoints: {
    ...MEMBERSHIP_VIEW,
    tier: "Silver",
    tierVariant: "silver" as const,
    balance: 0,
    worth: "HK$0",
    qualifyingPoints: 0,
    retentionLine: `Earn 500+ pts by ${RENEWS} to upgrade`,
    earnLine: "Silver earning 1x points",
    coupons: {
      status: "empty",
      message: COUPONS_PAGE_COPY.noCoupons,
      description: COUPONS_PAGE_COPY.noCouponsDescription,
    },
    ledger: {
      status: "empty",
      message: "No points yet",
      description: "Earn points on what you pay — online or at the till.",
      action: { label: "Start shopping", onAction: () => {} },
    },
    ledgerTotals: { earned: 0, used: 0, pending: 0 },
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
      message: COUPONS_PAGE_COPY.noCoupons,
      description: COUPONS_PAGE_COPY.noCouponsDescription,
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

export type { HowPointsWorkRow, MembershipView, TierBenefitsRow };
export {
  APPLE_HELD,
  APPLE_OFFERED,
  APPLE_PASS_URL,
  BALANCE_DROPPED_REWARDS,
  CART_ITEMS,
  CART_SUBTOTAL,
  COUPON_ACTION_COPY,
  COUPON_LIST_COPY,
  COUPON_PROMO_COPY,
  COUPONS,
  COUPONS_PAGE_COPY,
  DROPPED_BALANCE,
  FLAKY_REWARDS,
  GOOGLE_HELD,
  GOOGLE_OFFERED,
  GOOGLE_SAVE_URL,
  HOW_POINTS_WORK,
  ISSUED_COUPON,
  LEDGER_ENTRIES,
  MEMBER,
  MEMBER_PASS_COPY,
  MEMBERSHIP_PAGE_COPY,
  MEMBERSHIP_STATE_VIEWS,
  MEMBERSHIP_VIEW,
  POINT_HISTORY_COPY,
  POINTS_BALANCE_LABEL,
  POINTS_TOTALS,
  RETRY_COPY,
  REWARD_CHECKOUT_COPY,
  REWARD_MENU_COPY,
  REWARDS,
  REWARDS_PAGE_COPY,
  SHORT_BALANCE_COPY,
  SOLD_OUT_COPY,
  SOLD_OUT_REWARDS,
  TIER_BENEFITS,
  TIER_BENEFITS_PAGE_COPY,
  TIER_CARD_COPY,
  WALLET_PASS_COPY,
};
