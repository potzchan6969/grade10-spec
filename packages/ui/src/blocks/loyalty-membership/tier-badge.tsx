import { Badge } from "@grade10/design-system/components/display/badge";
import { cn } from "@grade10/design-system/lib/utils";
import { CrownSimple } from "@phosphor-icons/react";

type TierBadgeVariant = "silver" | "gold" | "black";

type TierBadgeProps = {
  /** The tier held, as the consumer names it; drawn in caps. */
  tier: string;
  /** The skin the badge wears with the tier — silver, gold or black. */
  variant: TierBadgeVariant;
  /** The `data-slot` the surface's hooks hang on. */
  slot: string;
  className?: string;
};

const SKIN: Record<TierBadgeVariant, string> = {
  silver: "border-slate-300 text-slate-300",
  gold: "border-primary text-primary",
  black: "border-primary-foreground text-primary-foreground",
};

/**
 * The tier's badge, shared by the tier card and the member pass so the two
 * surfaces name the held tier the same way: an outline chip in the skin's
 * palette, and the crown a black tier earns in Phosphor's bold weight.
 */
function TierBadge({ tier, variant, slot, className }: TierBadgeProps) {
  return (
    <Badge
      className={cn("bg-transparent uppercase", SKIN[variant], className)}
      data-slot={slot}
      variant="outline"
    >
      {variant === "black" ? (
        <CrownSimple aria-hidden size={12} weight="bold" />
      ) : null}
      {tier}
    </Badge>
  );
}

export type { TierBadgeProps, TierBadgeVariant };
export { TierBadge };
