import type { ReactNode } from "react";

/**
 * One reward on the redemption menu. Points are numbers because the programme
 * counts them; every date and window is a string the consumer already
 * formatted, because formatting needs a locale and a time zone this package is
 * forbidden to know.
 */
type RewardMenuItem = {
  id: string;
  name: string;
  /** Points for one redemption — or for one unit when the reward takes a quantity. */
  pointCost: number;
  /** Present when the reward is priced per unit: the per-redemption bound. */
  maxQuantity?: number;
  /** A physical reward's collection window, stated as supplied. */
  collectionWindow?: string;
  /** A money-off reward's code validity period, stated as supplied. */
  validity?: string;
  /**
   * What its coupon cannot be spent without — a basket big enough, a counter
   * or a checkout it is good at. Stated as supplied, and absent where the
   * coupon limits nothing.
   */
  limits?: string;
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

export type { ActivityEntry, CouponItem, CouponStatus, RewardMenuItem };
