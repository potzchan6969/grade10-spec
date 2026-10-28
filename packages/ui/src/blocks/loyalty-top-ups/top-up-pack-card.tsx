import { Badge } from "@grade10/design-system/components/display/badge";
import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { Warning } from "@phosphor-icons/react";

type TopUpPackCardCopy = {
  /** The unit after the points count — "points". */
  unit: string;
  /** The discount badge — "Save 5%". Omitted when the pack has no discount. */
  save?: string;
  /** Why the pack cannot be picked — "Over today’s limit". Tooltip and
   * screen-reader text when disabled. */
  unavailable?: string;
};

type TopUpPackCardProps = {
  copy: TopUpPackCardCopy;
  /** The radio value the list reports when this pack is picked. */
  value: string;
  /** "10,000" */
  pointsLabel: string;
  /** "HK$9,500" */
  priceLabel: string;
  /** Struck list price — "HK$10,000". Required to show the save badge. */
  wasPriceLabel?: string;
  disabled?: boolean;
};

/**
 * One pack row in the top-up picker: points big, the price, a struck list
 * price and a save badge when discounted, and why it cannot be picked when it
 * cannot. Lives inside a `RadioList`; the group owns the picked value.
 */
function TopUpPackCard({
  copy,
  value,
  pointsLabel,
  priceLabel,
  wasPriceLabel,
  disabled,
}: TopUpPackCardProps) {
  return (
    <RadioCard
      disabled={disabled}
      title={
        <span className="flex items-baseline gap-1.5">
          <span className="text-xl font-semibold tracking-tight">
            {pointsLabel}
          </span>
          <span className="font-normal text-secondary-foreground">
            {copy.unit}
          </span>
          {disabled ? (
            <span className="sr-only">{copy.unavailable}</span>
          ) : null}
          {disabled ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className="ml-auto inline-flex size-5 shrink-0 items-center justify-center self-center text-warning"
                  render={<span />}
                >
                  <Warning aria-hidden size={16} weight="fill" />
                </TooltipTrigger>
                <TooltipContent>{copy.unavailable}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </span>
      }
      description={
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-medium text-foreground">{priceLabel}</span>
          {wasPriceLabel ? (
            <>
              <s>{wasPriceLabel}</s>
              <Badge size="sm" variant="success">
                {copy.save}
              </Badge>
            </>
          ) : null}
        </span>
      }
      value={value}
    />
  );
}

export type { TopUpPackCardCopy, TopUpPackCardProps };
export { TopUpPackCard };
