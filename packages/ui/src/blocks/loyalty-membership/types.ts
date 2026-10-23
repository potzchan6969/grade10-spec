import type { ReactNode } from "react";

/** What a redemption settles as: a physical item, or a money-off coupon. */
type RewardKind = "item" | "coupon";

/** Art the consumer supplies for an item reward. A coupon draws its own tile. */
type RewardImage = {
  src: string;
  alt: string;
};

/**
 * One reward on the shop. Points are numbers because the programme counts
 * them; every date, window and place is a string the consumer already
 * formatted, because formatting needs a locale and a time zone this package
 * is forbidden to know. A redemption is always one unit.
 */
type RewardMenuItem = {
  id: string;
  kind: RewardKind;
  name: string;
  description?: string;
  /** Points for one redemption. */
  pointCost: number;
  /** Item art; a coupon draws the gift tile and takes none. */
  image?: RewardImage;
  /** The redemption window's end, already formatted. */
  deadline?: string;
  /** Where the coupon is spendable, or where the item is collected, as supplied. */
  useAt?: string;
  /** How long the coupon is good for, or the collection window, as supplied. */
  validFor?: string;
};

/** The same reward read on the checkout surface. */
type RewardCheckoutReward = RewardMenuItem;

/** What a settled redemption left the member holding, on the ticket. */
type RewardRedemption = {
  /** The balance left after the debit. */
  balanceAfter: number;
  /** The line under the check — the cost and the remaining balance, as supplied. */
  summary: string;
  /** The ticket's deadline line — use-by or collect-by, as supplied. */
  deadline: string;
  /** The member-readable code the redemption minted — a discount coupon's only. */
  code?: string;
  /** The ticket's footer line where no code stands — the collect-in-store line. */
  note?: string;
  /** The staff-facing QR the redeemed ticket draws — the scan token the till
   * reads. */
  qrCode?: { value: string; altText: string; toggleLabel: string };
  /** Set when the issued coupon is already spent — the ticket mutes, says
   * so, and drops its scan QR. */
  usedLabel?: string;
};

type CouponStatus = "open" | "spent" | "void" | "expired";

/** One issued discount code and what remains of it. */
type CouponItem = {
  id: string;
  /** What the code takes off, already formatted. */
  amount: string;
  /** The code a shop takes at its till; absent for a coupon spent from the wallet by id. */
  code?: string;
  /** What the coupon is for. */
  description?: string;
  /** When the code stops working, already formatted. */
  expiry: string;
  status: CouponStatus;
  /** Consumer-owned control for this coupon — apply, copy, whatever the surface offers. */
  action?: ReactNode;
};

/** One ledger entry, already translated into member-readable terms. */
type ActivityEntry = {
  id: string;
  /** What happened, as the member reads it — never an operator reason or retry key. */
  kind: string;
  /** Signed points movement. */
  delta: number;
  /** Already formatted. */
  date: string;
  /** Where it came from, as the member reads it — the counter, the online
   *  store, or the programme itself. Absent where the source did not say. */
  channel?: string;
  /** Running context under the entry — an order reference, a balance line. */
  context?: ReactNode;
};

export type {
  ActivityEntry,
  CouponItem,
  CouponStatus,
  RewardCheckoutReward,
  RewardImage,
  RewardKind,
  RewardMenuItem,
  RewardRedemption,
};
