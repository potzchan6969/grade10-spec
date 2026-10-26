import { formatDay, formatMonthName } from "@grade10/date";
import {
  FIXTURE_LOYALTY_ADJUST_AT_MS,
  FIXTURE_LOYALTY_PURCHASE_AT_MS,
  FIXTURE_LOYALTY_REDEEM_AT_MS,
} from "../../lib/datetime-fixtures";
import type { PointHistoryCopy } from "./point-history";
import type { PointsTotals } from "./types";
import type { LedgerEntry, CouponItem, RewardMenuItem } from "./types";

/* Grade10's own programme content, for the examples only. A consumer supplies
 * its own; nothing here is a default. */

const BALANCE = 1250;

/** Stand-in product art for the item rewards. */
const REWARD_IMAGE = new URL(
  "../store-order-detail/product.fixture.png",
  import.meta.url,
).href;

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
];

const COUPONS: CouponItem[] = [
  {
    id: "coupon-open",
    amount: "HK$50",
    code: "GRD-50-7Q2M",
    description: "HK$50 off any order",
    expiry: `Use by ${formatDay(Date.UTC(2026, 11, 31))}`,
    status: "open",
    qrCode: {
      value: "g10:redeem:coupon-open:7Q2M",
      altText: "Show this code to store staff",
      toggleLabel: "Use now",
      caption: "Staff scan this at the counter",
    },
  },
  {
    id: "coupon-online",
    amount: "HK$30",
    code: "GRD-30-W8BN",
    description: "HK$30 off any order",
    expiry: `Use by ${formatDay(Date.UTC(2027, 0, 15))}`,
    status: "open",
    scopeLabel: "Online only",
    qrCode: {
      value: "g10:redeem:coupon-online:W8BN",
      altText: "Show this code to store staff",
      toggleLabel: "Use now",
    },
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
    id: "entry-topup",
    kind: "Points top-up",
    track: "earned",
    icon: "topup",
    delta: 200,
    date: formatDay(Date.UTC(2026, 8, 15)),
    month: formatMonthName(Date.UTC(2026, 8, 15)),
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
    id: "entry-purchase",
    kind: "In-store purchase",
    track: "earned",
    icon: "order",
    delta: 105,
    date: formatDay(FIXTURE_LOYALTY_PURCHASE_AT_MS),
    month: formatMonthName(FIXTURE_LOYALTY_PURCHASE_AT_MS),
    context: "Order #10482",
  },
  {
    id: "entry-redeem",
    kind: "Redeemed reward",
    track: "used",
    icon: "reward",
    delta: -500,
    date: formatDay(FIXTURE_LOYALTY_REDEEM_AT_MS),
    month: formatMonthName(FIXTURE_LOYALTY_REDEEM_AT_MS),
    context: "Redeemed HK$50 off",
  },
  {
    id: "entry-expiry",
    kind: "Points expired",
    track: "used",
    icon: "expiry",
    delta: -40,
    date: formatDay(Date.UTC(2026, 7, 1)),
    month: formatMonthName(Date.UTC(2026, 7, 1)),
  },
  {
    id: "entry-adjustment",
    kind: "Points adjusted",
    track: "earned",
    icon: "adjustment",
    delta: 120,
    date: formatDay(FIXTURE_LOYALTY_ADJUST_AT_MS),
    month: formatMonthName(FIXTURE_LOYALTY_ADJUST_AT_MS),
    context: "Goodwill credit",
  },
];

const POINTS_TOTALS: PointsTotals = {
  earned: 440,
  used: -820,
  pending: 128,
};

const POINT_HISTORY_COPY: PointHistoryCopy = {
  label: "Point history",
  summary: { earned: "Earned", used: "Used", pending: "Pending", points: "pts" },
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

/** Opaque, single-use, minted by the programme — this one only looks the part. */
const MEMBER_TOKEN = "g10m.eyJrIjoiZml4dHVyZSJ9.5f2a9c";

export {
  LEDGER_ENTRIES,
  POINT_HISTORY_COPY,
  POINTS_TOTALS,
  BALANCE,
  COUPONS,
  MEMBER_TOKEN,
  REWARDS,
};
