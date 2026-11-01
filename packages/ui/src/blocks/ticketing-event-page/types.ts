/** A pass's price as the page words it. The page formats every amount; the
 * block never does money math. */
type EventPassPrice = {
  /** The price in force: `HK$380.00`. */
  price: string;
  /** The full price, struck through beside an early-bird price:
   * `HK$480.00`. */
  was?: string;
  /** Sales ended: the price reads grey. */
  muted?: boolean;
};

/** The how-many picker on a pass that sells to this buyer now. A pass that
 * does not sell now has none. */
type EventPassQuantity = {
  value: number;
  /** What the pass holds plus what the email may still hold, so the limit
   * stops every + at once. */
  max: number;
  onValueChange: (value: number) => void;
  /** The picker's name for a screen reader:
   * `How many tickets: General Pass (Two-Day), Adult`. */
  label: string;
  /** `One fewer General Pass (Two-Day), Adult`. */
  decrementLabel: string;
  /** `One more General Pass (Two-Day), Adult`. */
  incrementLabel: string;
};

/** When a pass opens: the public sale's start (`On sale Mon 16 Nov, 12:00`),
 * or an early-access pass's (`Opens Mon 16 Nov, 12:00`), with a countdown
 * where the page runs one (`Opens in 1 day 21:42:10`). */
type EventPassOpening = { label: string; countdown?: string };

/** A word beside a pass's name: `Sales Ended`, or `For you now` on an
 * early-access pass an access rule lets this buyer buy before the public
 * sale. */
type EventPassBadge = { label: string; tone: "ended" | "access" };

/** One VIP perk; `fastPass` leads with the bolt and its `lead` in bold. */
type EventPassPerk = {
  id: string;
  kind: "fastPass" | "check";
  /** Bold words before the rest: `Fast Pass every day, included.` */
  lead?: string;
  text: string;
};

export type {
  EventPassBadge,
  EventPassOpening,
  EventPassPerk,
  EventPassPrice,
  EventPassQuantity,
};
