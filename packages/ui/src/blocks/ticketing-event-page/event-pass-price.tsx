import { cn } from "@grade10/design-system/lib/utils";
import type { EventPassPrice } from "./types";

type EventPassPriceTextProps = EventPassPrice & {
  /** The word read before the struck-through price: `Was`. */
  wasWord: string;
  /** `lg` is the VIP card's price; `md` a row's on wide; `sm` a row's
   * under its name on a phone. */
  size: "lg" | "md" | "sm";
  /** The struck price after the price in force, as the VIP card reads;
   * rows put it first. */
  wasAfter?: boolean;
  className?: string;
};

const PRICE = {
  lg: "text-[26px] leading-8 @min-[30rem]/pass:text-3xl @min-[30rem]/pass:leading-9",
  md: "text-lg leading-7",
  sm: "text-base leading-6",
} as const;

const WAS = {
  lg: "text-lg leading-6",
  md: "text-[15px] leading-5",
  sm: "text-sm leading-5",
} as const;

/* No `tabular-nums` on the bold price: the brand face's bold tabular 7
 * overlaps the next digit (`HK$700.00`). */

/**
 * A pass's price: the price in force, bold, and the full price struck
 * through beside it during an early bird, read as "Was …" by a screen
 * reader. An ended pass reads its price in grey.
 */
function EventPassPriceText({
  price,
  was,
  muted,
  wasWord,
  size,
  wasAfter,
  className,
}: EventPassPriceTextProps) {
  const struck = was ? (
    <s
      className={cn(
        "font-medium text-secondary-foreground tabular-nums",
        WAS[size],
      )}
    >
      <span className="sr-only">{wasWord} </span>
      {was}
    </s>
  ) : null;
  return (
    <span
      className={cn("inline-flex items-baseline", className)}
      data-slot="event-pass-price"
    >
      {wasAfter ? null : struck}
      <span
        className={cn(
          "font-bold",
          muted ? "text-secondary-foreground" : "text-foreground",
          PRICE[size],
        )}
      >
        {price}
      </span>
      {wasAfter ? struck : null}
    </span>
  );
}

export type { EventPassPriceTextProps };
export { EventPassPriceText };
