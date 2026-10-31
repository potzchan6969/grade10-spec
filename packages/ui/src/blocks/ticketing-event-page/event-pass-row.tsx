import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { cn } from "@grade10/design-system/lib/utils";
import { EventPassPriceText } from "./event-pass-price";
import type { EventPassPrice, EventPassQuantity } from "./types";

type EventPassRowCopy = {
  /** Read before a struck-through price: `Was`. */
  was: string;
};

type EventPassRowProps = {
  copy: EventPassRowCopy;
  /** Who the row is for: `Adult`, `Child`. */
  label: string;
  /** Under the label: `Ages 12 and up`. */
  who?: string;
  /** Where this kind's later price is set, when the price in force ends:
   * `Early bird ends Sun 29 Nov, 23:59`. Above `note` when both apply. */
  earlyBirdEnds?: string;
  /** A line under who: an early-access pass's `Yours to buy: up to 4`. */
  note?: string;
  price: EventPassPrice;
  /** The how-many picker; none on a row that does not sell now. */
  quantity?: EventPassQuantity;
  className?: string;
};

/**
 * One kind of ticket inside a pass card: its label, who it is for, its price
 * and a stepper with no visible label (a screen reader hears the quantity's
 * `label`). On a phone the price sits under the label and the stepper
 * narrows; wider, the price sits beside the stepper. The row reads its own
 * width, so it lays out the same wherever it is placed.
 */
function EventPassRow({
  copy,
  label,
  who,
  earlyBirdEnds,
  note,
  price,
  quantity,
  className,
}: EventPassRowProps) {
  return (
    <div
      className={cn(
        "@container/row border-t border-border-subtle py-3",
        className,
      )}
      data-slot="event-pass-row"
    >
      <div className="flex items-center justify-between gap-3 @min-[30rem]/row:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-base leading-6 font-semibold">{label}</span>
          <EventPassPriceText
            {...price}
            className="flex-wrap gap-x-2 @min-[30rem]/row:hidden"
            size="sm"
            wasWord={copy.was}
          />
          {who ? (
            <span className="text-[13px] leading-[18px] text-secondary-foreground">
              {who}
            </span>
          ) : null}
          {earlyBirdEnds ? (
            <span className="text-[13px] leading-[18px] text-secondary-foreground">
              {earlyBirdEnds}
            </span>
          ) : null}
          {note ? (
            <span className="text-[13px] leading-[18px] text-secondary-foreground">
              {note}
            </span>
          ) : null}
        </div>
        <EventPassPriceText
          {...price}
          className="hidden gap-2.5 @min-[30rem]/row:inline-flex"
          size="md"
          wasWord={copy.was}
        />
        {quantity ? (
          <StepperInput
            aria-label={quantity.label}
            className="w-[148px] shrink-0 @min-[30rem]/row:w-[200px]"
            decrementLabel={quantity.decrementLabel}
            incrementLabel={quantity.incrementLabel}
            max={quantity.max}
            min={0}
            onValueChange={quantity.onValueChange}
            value={quantity.value}
          />
        ) : null}
      </div>
    </div>
  );
}

export type { EventPassRowCopy, EventPassRowProps };
export { EventPassRow };
