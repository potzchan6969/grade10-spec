import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Tag } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { HeldPromoCode } from "./types";

/** Half-circle punch at the bottom edge (left + right). Layers add, not intersect. */
const TICKET_TOP_MASK = {
  WebkitMaskImage:
    "radial-gradient(circle 9px at 0 100%, transparent 8.5px, #000 9px), radial-gradient(circle 9px at 100% 100%, transparent 8.5px, #000 9px)",
  WebkitMaskSize: "50.5% 100%, 50.5% 100%",
  WebkitMaskPosition: "0 0, 100% 0",
  WebkitMaskRepeat: "no-repeat",
  maskImage:
    "radial-gradient(circle 9px at 0 100%, transparent 8.5px, #000 9px), radial-gradient(circle 9px at 100% 100%, transparent 8.5px, #000 9px)",
  maskSize: "50.5% 100%, 50.5% 100%",
  maskPosition: "0 0, 100% 0",
  maskRepeat: "no-repeat",
} as const;

/** Half-circle punch at the top edge (left + right). Layers add, not intersect. */
const TICKET_BOTTOM_MASK = {
  WebkitMaskImage:
    "radial-gradient(circle 9px at 0 0, transparent 8.5px, #000 9px), radial-gradient(circle 9px at 100% 0, transparent 8.5px, #000 9px)",
  WebkitMaskSize: "50.5% 100%, 50.5% 100%",
  WebkitMaskPosition: "0 0, 100% 0",
  WebkitMaskRepeat: "no-repeat",
  maskImage:
    "radial-gradient(circle 9px at 0 0, transparent 8.5px, #000 9px), radial-gradient(circle 9px at 100% 0, transparent 8.5px, #000 9px)",
  maskSize: "50.5% 100%, 50.5% 100%",
  maskPosition: "0 0, 100% 0",
  maskRepeat: "no-repeat",
} as const;

const TICKET_SHADOW =
  "[filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.04))_drop-shadow(0_2px_6px_rgba(0,0,0,0.05))]";

type PromoTicketProps = {
  code: HeldPromoCode;
  /** Highlights the ticket when this held code is the applied promo. */
  selected?: boolean;
  /** Softens inapplicable tickets; no product action. */
  muted?: boolean;
  /** Typically the Apply control for an applicable code. */
  action?: ReactNode;
  className?: string;
};

/**
 * Promo code as a ticket: side cutouts, dashed tear line, drop-shadow that
 * follows the notched silhouette. Presentation-only — action is a slot.
 * Shopper copy on the surface must say “promo code”, never “coupon”.
 */
function PromoTicket({
  code,
  selected = false,
  muted = false,
  action,
  className,
}: PromoTicketProps) {
  const borderTone = selected ? "border-ring" : "border-border";
  const hasDetail =
    code.detailLabel != null || Boolean(code.inapplicableReason);

  return (
    <div
      data-slot="promo-ticket"
      className={cn("w-full", muted && "opacity-70", TICKET_SHADOW, className)}
    >
      <div
        className={cn(
          "rounded-t-(--radius-xl) border border-b-0 bg-background p-3",
          borderTone,
        )}
        style={TICKET_TOP_MASK}
      >
        <VStack gap="none">
          <span className="text-sm font-medium leading-5 text-foreground">
            {code.title}
          </span>
          {hasDetail ? (
            <VStack gap="none">
              {code.detailLabel != null ? (
                <span className="text-xs font-normal leading-4 text-secondary-foreground">
                  {code.detailLabel}
                </span>
              ) : null}
              {code.inapplicableReason ? (
                <span className="text-xs font-normal leading-4 text-secondary-foreground">
                  {code.inapplicableReason}
                </span>
              ) : null}
            </VStack>
          ) : null}
        </VStack>
      </div>

      <div className="relative h-0" aria-hidden>
        <div className="absolute inset-x-3 top-0 -translate-y-1/2 border-t border-dashed border-border-strong" />
      </div>

      <div
        className={cn(
          "rounded-b-(--radius-xl) border border-t-0 bg-background px-3 py-2",
          borderTone,
        )}
        style={TICKET_BOTTOM_MASK}
      >
        <HStack gap="sm" vAlign="center" className="w-full">
          <HStack gap="xs" vAlign="center" className="min-w-0 flex-1">
            <span aria-hidden className="shrink-0 text-secondary-foreground">
              <Tag size={14} weight="bold" />
            </span>
            <span className="truncate text-xs font-normal leading-4 text-secondary-foreground">
              {code.label}
            </span>
          </HStack>
          {action}
        </HStack>
      </div>
    </div>
  );
}

export type { PromoTicketProps };
export { PromoTicket };
