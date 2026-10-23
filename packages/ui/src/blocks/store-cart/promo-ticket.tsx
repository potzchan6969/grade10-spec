import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { QrCode, Tag } from "@phosphor-icons/react";
import { type ReactNode, useState } from "react";
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

/** The scan code a member holds out to store staff, drawn by the consumer
 * wherever fits — the ticket only carries the control that opens it. */
type PromoTicketQr = {
  /** The token, encoded verbatim. */
  value: string;
  /** Read to anyone who cannot see the code. Required — no built-in English. */
  altText: string;
  /** The reveal control's visible label — "Use now". Required — no
   * built-in English. */
  toggleLabel: string;
  /** The line under the code where a scan card draws it — the card's own,
   * never the ticket's. */
  caption?: string;
};

type PromoTicketProps = {
  code: HeldPromoCode;
  /** Highlights the ticket when this held code is the applied promo. */
  selected?: boolean;
  /** Softens inapplicable tickets; no product action. */
  muted?: boolean;
  /** Set once the coupon is spent: the ticket mutes, names it used, and
   * drops the scan control — there is nothing left to scan. */
  usedLabel?: string;
  /** The staff-facing scan — draws a Use now control in the stub's action
   * slot. The QR itself is the consumer's to place: `qrOpen` /
   * `onQrToggle` / `qrRegionId` wire the control to it. Online-cart
   * tickets take none. */
  qrCode?: PromoTicketQr;
  /** Whether the consumer's scan region is open — `aria-expanded`. */
  qrOpen?: boolean;
  /** Reports presses on the scan control. */
  onQrToggle?: (open: boolean) => void;
  /** The consumer-owned scan region's id — `aria-controls`. */
  qrRegionId?: string;
  /** The stub row's leading mark — a tag for a held code; a collection
   * ticket passes its own (a storefront) instead. */
  labelIcon?: ReactNode;
  /** Typically the Apply control for an applicable code — the online cart's
   * alone; a store-facing ticket takes none. */
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
  usedLabel,
  qrCode,
  qrOpen,
  onQrToggle,
  qrRegionId,
  labelIcon,
  action,
  className,
}: PromoTicketProps) {
  const used = usedLabel != null;
  const borderTone = selected ? "border-ring" : "border-border";
  const hasDetail =
    (!used && code.detailLabel != null) ||
    Boolean(code.inapplicableReason) ||
    used;
  const [qrOpenInner, setQrOpenInner] = useState(false);
  const open = qrOpen ?? qrOpenInner;

  return (
    // biome-ignore lint/a11y/useSemanticElements: a ticket groups a name, its detail and at most one action, not form fields.
    <div
      data-slot="promo-ticket"
      role="group"
      aria-disabled={muted || used || undefined}
      aria-label={code.label}
      className={cn(
        "w-full",
        (muted || used) && "opacity-70",
        TICKET_SHADOW,
        className,
      )}
    >
      <div
        className={cn(
          "rounded-t-(--radius-xl) border border-b-0 bg-background p-3",
          borderTone,
        )}
        style={TICKET_TOP_MASK}
      >
        <VStack gap="none" className="min-w-0">
          <span className="text-sm font-medium leading-5 text-foreground">
            {code.title}
          </span>
          {hasDetail ? (
            <VStack gap="none">
              {!used && code.detailLabel != null ? (
                <span className="text-xs font-normal leading-4 text-secondary-foreground">
                  {code.detailLabel}
                </span>
              ) : null}
              {code.inapplicableReason ? (
                <span className="text-xs font-normal leading-4 text-secondary-foreground">
                  {code.inapplicableReason}
                </span>
              ) : null}
              {used ? (
                <span className="text-xs font-normal leading-4 text-secondary-foreground">
                  {usedLabel}
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
              {labelIcon ?? <Tag size={14} weight="bold" />}
            </span>
            <span className="truncate text-xs font-normal leading-4 text-secondary-foreground">
              {code.label}
            </span>
          </HStack>
          {used
            ? null
            : (action ??
              (qrCode ? (
                <Button
                  aria-controls={qrRegionId}
                  aria-expanded={open}
                  className="-my-1 shrink-0"
                  onClick={() =>
                    onQrToggle ? onQrToggle(!open) : setQrOpenInner(!open)
                  }
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  <QrCode aria-hidden />
                  {qrCode.toggleLabel}
                </Button>
              ) : null))}
        </HStack>
      </div>
    </div>
  );
}

export type { PromoTicketProps, PromoTicketQr };
export { PromoTicket };
