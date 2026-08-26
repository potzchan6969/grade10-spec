import type {
  ActivityEntry,
  CouponItem,
  PendingCollectionItem,
  RewardMenuItem,
} from "./types";

/* Grade10's own programme content, for the examples only. A consumer supplies
 * its own; nothing here is a default. */

const BALANCE = 1250;

const REWARDS: RewardMenuItem[] = [
  {
    id: "voucher-50",
    name: "HK$50 off",
    pointCost: 500,
    validity: "Code valid 90 days from redemption",
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
    expiry: "Valid until Dec 31, 2026",
    status: "open",
  },
  {
    id: "coupon-spent",
    amount: "HK$100",
    code: "GRD-100-XK4P",
    description: "HK$100 off any order",
    expiry: "Valid until Oct 15, 2026",
    status: "spent",
  },
  {
    id: "coupon-void",
    amount: "HK$50",
    code: "GRD-50-9ZZT",
    expiry: "Expired Jun 30, 2026",
    status: "void",
  },
];

const ACTIVITY: ActivityEntry[] = [
  {
    id: "entry-purchase",
    kind: "Purchase",
    delta: 105,
    date: "Aug 18, 2026",
    context: "Order #10482",
  },
  {
    id: "entry-redeem",
    kind: "Redeemed HK$50 off",
    delta: -500,
    date: "Aug 2, 2026",
    context: "Balance: 1,250",
  },
  {
    id: "entry-adjustment",
    kind: "Points adjusted",
    delta: 120,
    date: "Jul 28, 2026",
  },
];

const PENDING_COLLECTIONS: PendingCollectionItem[] = [
  {
    id: "pending-sleeves",
    name: "Grade10 card sleeves",
    pointsPaid: 240,
    redeemedDate: "Redeemed Aug 20, 2026",
    collectBy: "Collect by Sep 3, 2026",
  },
  {
    id: "pending-stand",
    name: "Acrylic slab stand",
    pointsPaid: 4000,
    redeemedDate: "Redeemed Jul 1, 2026",
    collectBy: "Collect by Jul 31, 2026",
    expired: true,
  },
];

/** Opaque, single-use, minted by the programme — this one only looks the part. */
const MEMBER_TOKEN = "g10m.eyJrIjoiZml4dHVyZSJ9.5f2a9c";

const FALLBACK_CODE = "H7K2-9QXF";

export {
  ACTIVITY,
  BALANCE,
  COUPONS,
  FALLBACK_CODE,
  MEMBER_TOKEN,
  PENDING_COLLECTIONS,
  REWARDS,
};
