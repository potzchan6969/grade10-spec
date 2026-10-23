import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { QrCode, Tag } from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";
import { type ReactNode, useId, useState } from "react";
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

/** The scan code a member holds out to store staff, folded away until asked. */
type PromoTicketQr = {
  /** The token, encoded verbatim. */
  value: string;
  /** Read to anyone who cannot see the code. Required — no built-in English. */
  altText: string;
  /** The reveal control's visible label — "Use now". Required — no
   * built-in English. */
  toggleLabel: string;
};

type PromoTicketProps = {
  code: HeldPromoCode;
  /** Highlights the ticket when this held code is the applied promo. */
  selected?: boolean;
  /** Softens inapplicable tickets; no product action. */
  muted?: boolean;
  /** The staff-facing QR — a QR button beside the title folds it into the
   * stub, the half of the ticket the member holds out at the till.
   * Online-cart tickets take none. */
  qrCode?: PromoTicketQr;
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
  qrCode,
  labelIcon,
  action,
  className,
}: PromoTicketProps) {
  const borderTone = selected ? "border-ring" : "border-border";
  const hasDetail =
    code.detailLabel != null || Boolean(code.inapplicableReason);
  const qrId = useId();
  const [qrOpen, setQrOpen] = useState(false);

  return (
    // biome-ignore lint/a11y/useSemanticElements: a ticket groups a name, its detail and at most one action, not form fields.
    <div
      data-slot="promo-ticket"
      role="group"
      aria-disabled={muted || undefined}
      aria-label={code.label}
      className={cn("w-full", muted && "opacity-70", TICKET_SHADOW, className)}
    >
      <div
        className={cn(
          "rounded-t-(--radius-xl) border border-b-0 bg-background p-3",
          borderTone,
        )}
        style={TICKET_TOP_MASK}
      >
        <HStack gap="sm" vAlign="center" className="w-full">
          <VStack gap="none" className="min-w-0 flex-1">
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
          {qrCode ? (
            <Button
              aria-controls={qrId}
              aria-expanded={qrOpen}
              className="-my-1 shrink-0"
              onClick={() => setQrOpen((open) => !open)}
              size="sm"
              type="button"
              variant="secondary"
            >
              <QrCode aria-hidden />
              {qrCode.toggleLabel}
            </Button>
          ) : null}
        </HStack>
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
        {qrCode ? (
          <div
            aria-hidden={!qrOpen}
            className={cn(
              "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
              qrOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
            id={qrId}
          >
            <div className={cn("overflow-hidden", !qrOpen && "invisible")}>
              <span
                className="mx-auto my-3 block w-fit rounded-(--radius-md) bg-white p-2"
                data-slot="promo-ticket-qr"
              >
                <QRCodeSVG
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  marginSize={2}
                  size={160}
                  title={qrCode.altText}
                  value={qrCode.value}
                />
              </span>
            </div>
          </div>
        ) : null}
        <HStack gap="sm" vAlign="center" className="w-full">
          <HStack gap="xs" vAlign="center" className="min-w-0 flex-1">
            <span aria-hidden className="shrink-0 text-secondary-foreground">
              {labelIcon ?? <Tag size={14} weight="bold" />}
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

export type { PromoTicketProps, PromoTicketQr };
export { PromoTicket };
