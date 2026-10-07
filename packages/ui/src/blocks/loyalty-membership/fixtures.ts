import {
  FIXTURE_LOYALTY_ADJUST_DAY,
  FIXTURE_LOYALTY_PURCHASE_DAY,
  FIXTURE_LOYALTY_REDEEM_DAY,
} from "../../lib/datetime-fixtures";
import { formatDay } from "../../lib/format-datetime";
import type { ActivityEntry, CouponItem, RewardMenuItem } from "./types";

/* Grade10's own programme content, for the examples only. A consumer supplies
 * its own; nothing here is a default. */

const BALANCE = 1250;

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
    expiry: `Valid until ${formatDay(Date.UTC(2026, 11, 31))}`,
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

const FALLBACK_CODE = "H7K2-9QXF";

export { ACTIVITY, BALANCE, COUPONS, FALLBACK_CODE, MEMBER_TOKEN, REWARDS };
