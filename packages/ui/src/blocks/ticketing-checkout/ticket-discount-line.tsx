import { Link } from "@grade10/design-system/components/forms/link";
import { cn } from "@grade10/design-system/lib/utils";
import { Tag } from "@phosphor-icons/react";
import { CHECKOUT_QUIET, CHECKOUT_ROW } from "./checkout-look";

type TicketDiscountLineCopy = {
  /** `Promo SPRING20`. */
  title: string;
  /** What the code does here: `20% off General passes`,
   * `2 of your 3 tickets are free. CREW4 had 2 left.`, or, used up,
   * `Used up, not applied`. */
  detail: string;
  /** `Remove`. */
  remove: string;
  /** The Remove press's accessible name: `Remove SPRING20`. */
  removeLabel: string;
};

type TicketDiscountLineProps = {
  copy: TicketDiscountLineCopy;
  /** What it takes off, formatted: `−HK$190.00`. */
  amount: string;
  /**
   * `applied` takes the amount off, in the success tone; `usedUp` strikes it
   * through, because the code's last use went to another buyer first.
   */
  state?: "applied" | "usedUp";
  /** A removal is on its way: Remove waits. */
  removing?: boolean;
  onRemove: () => void;
  className?: string;
};

/** The code's line among the order lines: the code, what it does, the amount
 * it takes off and Remove. One code an order. */
function TicketDiscountLine({
  copy,
  amount,
  state = "applied",
  removing = false,
  onRemove,
  className,
}: TicketDiscountLineProps) {
  return (
    <div className={cn(CHECKOUT_ROW, className)} data-slot="discount-line">
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="inline-flex items-center gap-1.5 text-base leading-6 font-medium">
          <span aria-hidden className="inline-flex flex-none">
            <Tag size={16} />
          </span>
          {copy.title}
        </span>
        <span className={CHECKOUT_QUIET}>{copy.detail}</span>
      </span>
      <span className="flex flex-none flex-col items-end gap-0.5">
        {state === "usedUp" ? (
          <s className="text-base leading-6 text-secondary-foreground tabular-nums">
            {amount}
          </s>
        ) : (
          <span className="text-base leading-6 text-success tabular-nums">
            {amount}
          </span>
        )}
        <Link
          aria-label={copy.removeLabel}
          className="min-h-6 leading-5"
          disabled={removing}
          onClick={removing ? undefined : onRemove}
          render={<button type="button" />}
          size="sm"
        >
          {copy.remove}
        </Link>
      </span>
    </div>
  );
}

export type { TicketDiscountLineCopy, TicketDiscountLineProps };
export { TicketDiscountLine };
