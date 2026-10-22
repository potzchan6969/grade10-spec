import { formatDay } from "@grade10/date";
import type {
  ActivityEntry,
  ActivityListCopy,
  AsyncState,
  CartItemSummary,
  CouponItem,
  CouponListCopy,
  MemberPassCopy,
  RewardCheckoutCopy,
  RewardMenuCopy,
  RewardMenuItem,
  TierCardCopy,
  WalletPassLinksCopy,
  WalletPassWallet,
} from "@grade10/ui";
import { storyHref } from "../workbench-story-nav";

/* Stand-in programme content the Loyalty workbench draws with. Grade10's own
 * copy and figures for the examples only; a consumer supplies its own. */

/** Storybook story id for the cart drawer's Scenario, where points pay part of a basket. */
const LOYALTY_PAY_PART_OF_BASKET_STORY_ID =
  "store-cart-screens-cart-drawer-scenario--scenario";

/** Preview href from Membership to points on the basket. */
const LOYALTY_PAY_PART_OF_BASKET_HREF = storyHref(
  LOYALTY_PAY_PART_OF_BASKET_STORY_ID,
);

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
  benefits: "Benefits",
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
  redeemFor: (cost) => `Redeem for ${cost.toLocaleString("en-HK")} pts`,
  redeemedCouponTitle: "Added to your coupons",
  redeemedItemTitle: "Ready to Collect",
  done: "Done",
  viewCoupons: "View Coupons",
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

const TIER_BENEFITS_PAGE_COPY = {
  breadcrumbAccount: "Account",
  breadcrumbMembership: "Membership",
  title: "Tiers & Benefits",
};

const TIER_LADDER_COPY = {
  qualifying: "Qualifying pts this year",
  footnote: `Only points from purchases count toward your tier. Your tier year renews ${RENEWS}.`,
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
  /** The shorter ask the ladder's rung carries — "Join", "500 pts / yr". */
  ladderCaption: string;
  benefits: readonly string[];
  /** A rung nobody earns: the ladder draws no connector into it. */
  invitationOnly?: boolean;
};

const TIER_BENEFITS: readonly TierBenefitsRow[] = [
  {
    id: "silver",
    tier: "Silver",
    caption: "Free to join",
    ladderCaption: "Join",
    benefits: ["1 pt for every HK$10 spent"],
  },
  {
    id: "gold",
    tier: "Gold",
    caption: "500 pts / year",
    ladderCaption: "500 pts / yr",
    benefits: ["1.2 pt for every HK$10 spent"],
  },
  {
    id: "black",
    tier: "Black",
    caption: "Invitation only",
    ladderCaption: "Invitation Only",
    benefits: ["1.7 pt for every HK$10 spent"],
    invitationOnly: true,
  },
];

const MEMBERSHIP_PAGE_COPY = {
  breadcrumbAccount: "Account",
  title: "Membership",
  cardHeading: "Your member pass",
  rewardsHeading: "Rewards",
  couponsHeading: "Your coupons",
  spendHeading: "Spend on your basket",
  spendBody:
    "Points come off your bill at checkout. No code is needed, and nothing is held until you pay.",
  spendAction: "Go to checkout",
  activityHeading: "Activity",
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
  activity: AsyncState<readonly ActivityEntry[]>;
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
  activity: { status: "ready", data: ACTIVITY },
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
    retentionLine: undefined,
    earnLine: "Silver earning 1x points",
    coupons: {
      status: "empty",
      message: "You have no coupons yet. Redeem a reward to get one.",
    },
    activity: {
      status: "empty",
      message: "No activity yet. Purchases appear here once they are recorded.",
    },
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

export type { HowPointsWorkRow, MembershipView, TierBenefitsRow };
export {
  ACTIVITY,
  ACTIVITY_LIST_COPY,
  APPLE_HELD,
  APPLE_OFFERED,
  APPLE_PASS_URL,
  CART_ITEMS,
  CART_SUBTOTAL,
  COUPON_ACTION_COPY,
  COUPON_LIST_COPY,
  COUPONS,
  GOOGLE_HELD,
  GOOGLE_OFFERED,
  GOOGLE_SAVE_URL,
  HOW_POINTS_WORK,
  ISSUED_COUPON,
  LOYALTY_PAY_PART_OF_BASKET_HREF,
  LOYALTY_PAY_PART_OF_BASKET_STORY_ID,
  MEMBER,
  MEMBER_PASS_COPY,
  MEMBERSHIP_PAGE_COPY,
  MEMBERSHIP_STATE_VIEWS,
  MEMBERSHIP_VIEW,
  POINTS_BALANCE_LABEL,
  REWARD_CHECKOUT_COPY,
  REWARD_MENU_COPY,
  REWARDS,
  TIER_BENEFITS,
  TIER_BENEFITS_PAGE_COPY,
  TIER_CARD_COPY,
  TIER_LADDER_COPY,
  WALLET_PASS_COPY,
};
