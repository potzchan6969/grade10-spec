import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { cn } from "@grade10/design-system/lib/utils";
import { Coins, Warning } from "@phosphor-icons/react";

type TopUpPackCardCopy = {
  /** The unit after the points count — "pt". */
  unit: string;
  /** Why the pack cannot be picked — "Over today’s limit". Tooltip and
   * screen-reader text when disabled. */
  unavailable?: string;
};

type TopUpPackCardProps = {
  copy: TopUpPackCardCopy;
  /** The radio value the list reports when this pack is picked. */
  value: string;
  /** The points the pack credits — "5,000". */
  pointsLabel: string;
  /** What the member pays — "HK$4,850". */
  priceLabel: string;
  /** The same money read as points — "4,850". Supplied only when the pack
   * is discounted. */
  paidPointsLabel?: string;
  /** The extra points over what is paid — "150". The card reads it as
   * `${bonusLabel} ${copy.unit}` in accent. Supplied only when the pack is
   * discounted. */
  bonusLabel?: string;
  /** Figma's viewport axis: the dialog's tile ("large") or the drawer's row
   * ("small"). */
  viewport?: "large" | "small";
  disabled?: boolean;
};

/**
 * One pack in the top-up picker (Figma `7530:6737`). `viewport="large"` is the
 * dialog's tile — a media box with the coins mark over the points count, the
 * paid-plus-bonus line under it and the price; `viewport="small"` is the
 * drawer's row — count and bonus leading, price and the radio ring trailing.
 * A discounted pack reads what is paid plus the bonus under the count; a
 * pack with no bonus keeps the line's space on large so prices sit level
 * across a row.
 *
 * The card chrome — border, selected tint, hover and disabled — is
 * `RadioCard`'s, reached through shell selectors because the card owns its
 * inner padding and leading ring: large hides the ring (selection is the
 * border and tint, focus rings the shell) and small reverses it to the
 * trailing edge. Lives inside a `RadioList`; the group owns the picked value.
 */
function TopUpPackCard({
  copy,
  value,
  pointsLabel,
  priceLabel,
  paidPointsLabel,
  bonusLabel,
  viewport = "large",
  disabled,
}: TopUpPackCardProps) {
  const small = viewport === "small";
  const bonusLine = (
    <span
      className={cn(
        "flex items-center gap-0.5 font-medium",
        small ? "text-xs" : "text-sm",
      )}
    >
      <span className="text-secondary-foreground">{paidPointsLabel}</span>
      <span className="text-secondary-foreground">+</span>
      <span className="text-accent-foreground">
        {bonusLabel} {copy.unit}
      </span>
    </span>
  );
  const unavailable = disabled ? (
    <>
      <span className="sr-only">{copy.unavailable}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className="inline-flex size-5 shrink-0 items-center justify-center self-center text-secondary-foreground"
            render={<span />}
          >
            <Warning aria-hidden size={16} weight="regular" />
          </TooltipTrigger>
          <TooltipContent>{copy.unavailable}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  ) : null;

  return (
    <RadioCard
      className={
        small
          ? "[&_[data-slot=radio-button]]:flex-row-reverse [&_[data-slot=radio-button]]:items-center [&_[data-slot=radio-button]]:p-4 [&_[data-slot=radio-card-content]]:flex-row [&_[data-slot=radio-card-content]]:items-center [&_[data-slot=radio-card-content]]:gap-2"
          : "has-[[data-slot=radio-button]:focus-visible]:ring-3 has-[[data-slot=radio-button]:focus-visible]:ring-ring/50 [&_[data-slot=radio-button]]:flex-col [&_[data-slot=radio-button]]:items-stretch [&_[data-slot=radio-button]]:p-2 [&_[data-slot=radio-button]>:first-child]:hidden [&_[data-slot=radio-card-content]]:gap-2"
      }
      disabled={disabled}
      value={value}
    >
      {small ? (
        <>
          <span className="flex min-w-0 flex-1 flex-col justify-center">
            <span className="flex items-baseline gap-0.5 text-base font-semibold">
              <span>{pointsLabel}</span>
              <span>{copy.unit}</span>
              {unavailable}
            </span>
            {bonusLabel ? bonusLine : null}
          </span>
          <span className="shrink-0 text-sm">{priceLabel}</span>
        </>
      ) : (
        <>
          <span
            className="flex aspect-[208/139] w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted"
            data-slot="top-up-pack-card-media"
          >
            <Coins
              aria-hidden
              color="var(--muted-foreground)"
              size={40}
              weight="regular"
            />
          </span>
          <span className="flex w-full flex-col gap-3 px-2 pt-1 pb-2">
            <span className="flex flex-col">
              <span className="flex items-baseline gap-1">
                <span className="text-xl font-semibold">{pointsLabel}</span>
                <span className="text-base font-medium">{copy.unit}</span>
                {unavailable}
              </span>
              {bonusLabel ? (
                bonusLine
              ) : (
                <span aria-hidden className="invisible text-sm font-medium">
                  {"\u00A0"}
                </span>
              )}
            </span>
            <span className="text-sm">{priceLabel}</span>
          </span>
        </>
      )}
    </RadioCard>
  );
}

export type { TopUpPackCardCopy, TopUpPackCardProps };
export { TopUpPackCard };
