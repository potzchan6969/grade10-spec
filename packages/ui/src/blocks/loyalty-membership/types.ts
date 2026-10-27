import type { ReactNode } from "react";
import type { PromoTicketQr } from "../store-cart/promo-ticket";

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
  /** The member-readable code the redemption minted; a gift's ticket shows
   * `note` in its place. */
  code?: string;
  /** The ticket's footer line where no code is shown — the collect-in-store line. */
  note?: string;
  /** The staff-facing QR the redeemed ticket draws — the scan token the till
   * reads. */
  qrCode?: {
    value: string;
    altText: string;
    toggleLabel: string;
    /** The line under the code on the scan card. */
    caption?: string;
  };
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
  /** When the code stops working, already formatted — "Use by 31 Dec".
   * Drawn only on open and expired coupons; a spent or void coupon reads
   * its `statusLabel` instead. */
  expiry: string;
  /** Set on an open coupon whose expiry is near — the consumer owns the
   * clock and the threshold (inside 14 days at Grade10). The Use by line
   * then reads emphasised. Never read on a closed coupon. */
  expiringSoon?: boolean;
  status: CouponStatus;
  /** Where the coupon is spendable when the till cannot take it — "Online
   * only". A scoped coupon reads the line under its expiry and never draws
   * a Use now or a QR: there is no moment the member holds out a code the
   * sale will refuse. */
  scopeLabel?: string;
  /** The one line a closed coupon says — "Used on 12 Oct" or "Void 30 Jun".
   * Falls back to the copy's own word for the status. Never read on an
   * expired coupon: its expiry already says so. */
  statusLabel?: string;
  /** Consumer-owned control for this coupon — apply, copy, whatever the surface offers. */
  action?: ReactNode;
  /** The staff-facing scan an open coupon offers — the token the till reads,
   * minted when the member chooses the coupon. Draws a Use now control on the
   * ticket that opens the scan card on its own surface. */
  qrCode?: PromoTicketQr;
};

/** The tile an entry draws — what happened, not the programme's name for it.
 * A pending entry draws an hourglass whatever icon it is given. */
type LedgerIcon =
  | "order"
  | "reward"
  | "topup"
  | "credits"
  | "adjustment"
  | "expiry";

/** One ledger entry, already translated into member-readable terms. */
type LedgerEntry = {
  id: string;
  /** What happened, as the member reads it — never an operator reason or retry key. */
  kind: string;
  /** Which filter the entry answers — earned or used. */
  track: "earned" | "used";
  /** The tile beside the entry. Absent on a pending entry, which draws an hourglass. */
  icon?: LedgerIcon;
  /** Signed points movement. */
  delta: number;
  /** The day the points landed, already formatted. Absent on a pending
   *  entry — still on the way, nothing has landed. */
  date?: string;
  /** The month the entry groups under, already formatted — "October 2026".
   * Absent, the entry lists ungrouped. */
  month?: string;
  /** Where it came from, as the member reads it — the counter, the online
   *  store, or the programme itself. Absent where the source did not say. */
  channel?: string;
  /** The line after the date — an order reference, a note like "Rewards". */
  context?: ReactNode;
  /** Still on the way: lands when its order completes. Pending entries draw
   *  under the Pending card and never in a month group. */
  pending?: boolean;
};

/** The three figures over the ledger, signed the way deltas are. */
type PointsTotals = {
  earned: number;
  used: number;
  pending: number;
};

export type {
  CouponItem,
  CouponStatus,
  LedgerEntry,
  LedgerIcon,
  PointsTotals,
  RewardCheckoutReward,
  RewardImage,
  RewardKind,
  RewardMenuItem,
  RewardRedemption,
};
