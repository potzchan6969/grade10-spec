"use client";

import { Card } from "@grade10/design-system/components/display/card";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef } from "react";
import type { PromoTicketQr } from "./promo-ticket";

type PromoQrCardProps = {
  /** The token the card encodes. */
  qrCode: PromoTicketQr;
  /** The line under the code — "Staff scan this at the counter". Optional,
   * consumer-supplied. */
  caption?: string;
  /** Drawn collapsed until the ticket's scan control opens it. */
  open?: boolean;
  /** The id the scan control's `aria-controls` names. */
  id?: string;
  className?: string;
};

/**
 * The scan QR as its own card — QR plate over the caption — so a surface can
 * place it wherever the scan happens without reshaping the ticket. Unfolds
 * in place on `open`, scrolling itself into view where the surface can
 * scroll; mount it only where the member may be scanned.
 */
function PromoQrCard({
  qrCode,
  caption,
  open = false,
  id,
  className,
}: PromoQrCardProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  /* Unfolding pushes the card below the fold on a sheet — bring it up so
   * the member never hunts for it. The scroll waits out the unfold, else
   * it aims at a card still collapsed; `nearest` stays put when it
   * already fits, and reduced-motion snaps rather than glides. */
  useEffect(() => {
    if (!open) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setTimeout(
      () =>
        regionRef.current?.scrollIntoView?.({
          block: "nearest",
          behavior: reduced.matches ? "auto" : "smooth",
        }),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
      id={id}
      ref={regionRef}
    >
      <div className={cn("overflow-hidden", !open && "invisible")}>
        <Card className="w-full" data-slot="promo-qr-card">
          <VStack align="center" className="w-full" gap="xs">
            <span className="block w-fit rounded-(--radius-md) bg-white p-1.5">
              <QRCodeSVG
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                marginSize={2}
                size={128}
                title={qrCode.altText}
                value={qrCode.value}
              />
            </span>
            {caption ? (
              <span className="text-center text-xs font-normal leading-4 text-secondary-foreground">
                {caption}
              </span>
            ) : null}
          </VStack>
        </Card>
      </div>
    </div>
  );
}

export type { PromoQrCardProps };
export { PromoQrCard };
