import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import {
  CHECKOUT_CARD,
  CHECKOUT_CARD_HEADING,
  CHECKOUT_QUIET,
  CHECKOUT_ROW,
} from "./checkout-look";
import type { TicketCheckoutLine } from "./types";

type TicketCheckoutOrderCopy = {
  /** `Your Order`: the card's heading and the region's name. */
  title: string;
  /** `Total`. */
  total: string;
};

type TicketCheckoutOrderProps = {
  copy: TicketCheckoutOrderCopy;
  lines: readonly TicketCheckoutLine[];
  /** The order's total, formatted: `HK$1,150.00`, `HK$0.00`, or `Free`. */
  total: string;
  /** Under the lines, over the total: the Promo code field, or the applied
   * code's line. */
  promo?: ReactNode;
  /** Under the total: the points line. */
  points?: ReactNode;
  className?: string;
};

/** Your Order: each line with the price it was held at, the code, the total
 * and the points it earns. The same card on Your Details and Check Your
 * Order. */
function TicketCheckoutOrder({
  copy,
  lines,
  total,
  promo,
  points,
  className,
}: TicketCheckoutOrderProps) {
  return (
    <section
      aria-label={copy.title}
      className={cn(CHECKOUT_CARD, "gap-1", className)}
      data-slot="checkout-order"
    >
      <h2 className={cn(CHECKOUT_CARD_HEADING, "mb-1")}>{copy.title}</h2>
      {lines.map((line) => (
        <div className={CHECKOUT_ROW} key={line.id}>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-base leading-6 font-medium">
              {line.title}
            </span>
            {line.details?.map((detail) => (
              <span className={CHECKOUT_QUIET} key={detail}>
                {detail}
              </span>
            ))}
            {line.promoNote ? (
              <span className="text-sm leading-5 text-success">
                {line.promoNote}
              </span>
            ) : null}
          </span>
          <span className="flex-none text-base leading-6 tabular-nums">
            {line.amount}
          </span>
        </div>
      ))}
      {promo}
      <div className="flex items-baseline justify-between gap-3 pt-3">
        <span className="text-base leading-6 font-bold">{copy.total}</span>
        <span className="text-xl leading-7 font-semibold tabular-nums">
          {total}
        </span>
      </div>
      {points}
    </section>
  );
}

export type { TicketCheckoutOrderCopy, TicketCheckoutOrderProps };
export { TicketCheckoutOrder };
