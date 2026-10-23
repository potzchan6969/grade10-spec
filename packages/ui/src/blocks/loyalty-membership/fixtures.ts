import { formatDay } from "@grade10/date";
import {
  FIXTURE_LOYALTY_ADJUST_DAY,
  FIXTURE_LOYALTY_PURCHASE_DAY,
  FIXTURE_LOYALTY_REDEEM_DAY,
} from "../../lib/datetime-fixtures";
import type { ActivityEntry, CouponItem, RewardMenuItem } from "./types";

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
    expiry: `Valid until ${formatDay(Date.UTC(2026, 11, 31))}`,
    status: "open",
    qrCode: {
      value: "g10:redeem:coupon-open:7Q2M",
      altText: "Show this code to store staff",
      toggleLabel: "Use now",
      caption: "Staff scan this at the counter",
    },
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

const ACTIVITY: ActivityEntry[] = [
  {
    id: "entry-purchase",
    kind: "Purchase",
    delta: 105,
    date: FIXTURE_LOYALTY_PURCHASE_DAY,
    channel: "In store",
    context: "Order #10482",
  },
  {
    id: "entry-redeem",
    kind: "Redeemed HK$50 off",
    delta: -500,
    date: FIXTURE_LOYALTY_REDEEM_DAY,
    channel: "Online store",
    context: "Balance: 1,250",
  },
  {
    id: "entry-adjustment",
    kind: "Points adjusted",
    delta: 120,
    date: FIXTURE_LOYALTY_ADJUST_DAY,
    channel: "Membership programme",
  },
];

/** Opaque, single-use, minted by the programme — this one only looks the part. */
const MEMBER_TOKEN = "g10m.eyJrIjoiZml4dHVyZSJ9.5f2a9c";

export { ACTIVITY, BALANCE, COUPONS, MEMBER_TOKEN, REWARDS };
