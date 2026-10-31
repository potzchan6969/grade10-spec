/** One line of the order as the buyer reads it: what, the price it was held
 * at, and what it costs. Every value arrives formatted. */
type TicketCheckoutLine = {
  id: string;
  /** `General Pass (Two-Day), Adult × 1`. */
  title: string;
  /** Quiet lines under the title: `HK$380.00, early bird`,
   * `Fast Pass, 2 days: HK$200.00`, `HK$480.00, was HK$380.00`. */
  details?: readonly string[];
  /** A code's word on this line, in the success tone: `Free with CREW4`. */
  promoNote?: string;
  /** `HK$580.00`, or `Free`. */
  amount: string;
};

/** Where the press that leaves for payment stands. */
type TicketCheckoutPayState = "idle" | "slow" | "opening";

/** What the Promo code field shows under itself. */
type TicketPromoCodeFieldStatus =
  | { kind: "idle" }
  | { kind: "applying" }
  /** The code was refused: the sentence says why. */
  | { kind: "refused"; message: string }
  /** Too many wrong codes: the sentence names the wait, and Apply waits. */
  | { kind: "tooManyTries"; message: string };

export type {
  TicketCheckoutLine,
  TicketCheckoutPayState,
  TicketPromoCodeFieldStatus,
};
