import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { Warning } from "@phosphor-icons/react";

type TopUpPackCardCopy = {
  /** The unit after the points count — "pts". */
  unit: string;
  /** Why the pack cannot be picked — "Over today’s limit". Tooltip and
   * screen-reader text when disabled. */
  unavailable?: string;
};

type TopUpPackCardProps = {
  copy: TopUpPackCardCopy;
  /** The radio value the list reports when this pack is picked. */
  value: string;
  /** The points the pack credits — "10,000". */
  pointsLabel: string;
  /** What the member pays, right-aligned — "HK$9,500". */
  priceLabel: string;
  /** The same money read as points, struck beside the count — "9,500".
   * Supplied only when the pack is discounted. */
  paidPointsLabel?: string;
  /** The extra points over what is paid, in success — "+500 bonus points". */
  bonusLabel?: string;
  disabled?: boolean;
};

/**
 * One pack row in the top-up picker (Figma `7530:4568`): the points count
 * with what they cost struck beside it, the price at the trailing edge, and
 * the bonus points a discounted pack adds over the money spent. The card
 * chrome — border, selected tint, hover and disabled — is `RadioCard`'s.
 * Lives inside a `RadioList`; the group owns the picked value.
 */
function TopUpPackCard({
  copy,
  value,
  pointsLabel,
  priceLabel,
  paidPointsLabel,
  bonusLabel,
  disabled,
}: TopUpPackCardProps) {
  return (
    <RadioCard disabled={disabled} value={value}>
      <span className="flex w-full items-baseline gap-1.5">
        {paidPointsLabel ? (
          <s className="text-secondary-foreground">{paidPointsLabel}</s>
        ) : null}
        <span className="text-base font-medium tracking-tight">
          {pointsLabel} {copy.unit}
        </span>
        {disabled ? <span className="sr-only">{copy.unavailable}</span> : null}
        {disabled ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="inline-flex size-5 shrink-0 items-center justify-center self-center text-warning"
                render={<span />}
              >
                <Warning aria-hidden size={16} weight="fill" />
              </TooltipTrigger>
              <TooltipContent>{copy.unavailable}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
        <span className="ml-auto text-sm">{priceLabel}</span>
      </span>
      {bonusLabel ? (
        <span className="text-sm text-success">{bonusLabel}</span>
      ) : null}
    </RadioCard>
  );
}

export type { TopUpPackCardCopy, TopUpPackCardProps };
export { TopUpPackCard };
