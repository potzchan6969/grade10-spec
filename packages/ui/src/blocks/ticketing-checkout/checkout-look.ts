/** The checkout steps' shared look, one place for the boards' values.
 * Internal: the blocks compose these, consumers never see them. */

/** A step's card: Your Details, Your Order. */
const CHECKOUT_CARD =
  "flex flex-col rounded-2xl border border-border bg-background p-5";

/** A card's heading: `Your Order`. */
const CHECKOUT_CARD_HEADING = "m-0 text-lg leading-7 font-bold";

/** One rule-separated row of the order: what on the left, the amount on the
 * right. */
const CHECKOUT_ROW =
  "flex items-start justify-between gap-3 border-b border-border-subtle py-3";

/** A quiet line under a row's title. */
const CHECKOUT_QUIET = "text-sm leading-5 text-secondary-foreground";

export { CHECKOUT_CARD, CHECKOUT_CARD_HEADING, CHECKOUT_QUIET, CHECKOUT_ROW };
