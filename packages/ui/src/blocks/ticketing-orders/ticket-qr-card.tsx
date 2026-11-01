import { cn } from "@grade10/design-system/lib/utils";
import { CalendarBlank, CheckCircle, Lightning } from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";
import { TicketStatusBadge } from "./ticket-status-badge";
import type { TicketTone } from "./types";

/** Where one ticket stands at the door. */
type TicketQrCardState =
  /** Every entry still ahead. */
  | "valid"
  /** Used on an earlier day, with days still left. */
  | "daysLeft"
  /** In today; the code still shows for the pass's next day. */
  | "usedToday"
  /** Refunded or cancelled: the door refuses it. */
  | "void";

const TONE: Record<TicketQrCardState, TicketTone> = {
  valid: "ok",
  daysLeft: "info",
  usedToday: "info",
  void: "bad",
};

/** The words one ticket says, as the consumer worded them. */
type TicketQrCardCopy = {
  /** The card's accessible name: "Ticket 1 of 3". */
  label: string;
  /** The pass: "General Pass (Two-Day), Adult". */
  pass: string;
  /** Under the pass: "Ticket 1 of 3. Alex Chan". */
  holder: string;
  /** The badge: "Valid", "1 Day Left", "Refunded". */
  status: string;
  /** The code's accessible name: "Ticket code TK7Q2M-1". */
  qrLabel: string;
  /** Under the reference: "Code TK7Q2M-1". */
  code: string;
  /** Its entries: "Admits on 2 days: 12 and 13 Dec", or
   * "Used Sat 12 Dec, 10:14. 1 day left". */
  entries: string;
  /** Its Fast Pass days left, when it has any: "Fast Pass on 2 days". */
  fastPass?: string;
  /** In today, over the code: "In Sat 12 Dec, 10:42. See you Sunday." */
  usedToday?: string;
  /** Why the code no longer admits, under the facts. */
  voided?: string;
};

type TicketQrCardProps = {
  copy: TicketQrCardCopy;
  state: TicketQrCardState;
  /** The order's six-character reference, drawn large. */
  reference: string;
  /** What the QR code encodes: the signed ticket code. */
  qrValue: string;
  className?: string;
};

/**
 * One ticket as the door reads it: the pass and its holder, the QR code on a
 * white plate, the order's reference large under it for a phone that will
 * not scan, then its entries and Fast Pass days. A void ticket keeps its code
 * faded with the reason under it; a ticket in today says so over the code.
 */
function TicketQrCard({
  copy,
  state,
  reference,
  qrValue,
  className,
}: TicketQrCardProps) {
  const isVoid = state === "void";
  return (
    <section
      aria-label={copy.label}
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 text-card-foreground",
        className,
      )}
      data-slot="ticket-qr-card"
      data-state={state}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <strong className="text-base leading-6 font-bold">{copy.pass}</strong>
          <span className="text-sm leading-5 text-secondary-foreground">
            {copy.holder}
          </span>
        </div>
        <TicketStatusBadge label={copy.status} tone={TONE[state]} />
      </div>
      {state === "usedToday" && copy.usedToday ? (
        <p
          className="flex items-start gap-2 rounded-xl bg-success-muted px-3 py-2.5 text-sm leading-5 font-medium"
          role="status"
        >
          <span
            aria-hidden
            className="inline-flex mt-0.5 shrink-0 text-success"
          >
            <CheckCircle size={16} weight="bold" />
          </span>
          <span>{copy.usedToday}</span>
        </p>
      ) : null}
      <div
        className={cn(
          "mx-auto rounded-xl border border-border-subtle bg-white p-3",
          isVoid && "opacity-25",
        )}
        data-slot="ticket-qr"
      >
        <QRCodeSVG
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
          marginSize={0}
          role="img"
          aria-label={copy.qrLabel}
          size={196}
          value={qrValue}
        />
      </div>
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span
          className="font-mono text-[28px] leading-9 font-semibold tracking-[0.12em]"
          data-slot="ticket-reference"
        >
          {reference}
        </span>
        <span className="text-xs leading-4 text-secondary-foreground">
          {copy.code}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 border-t border-border-subtle pt-3 text-sm leading-5">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="inline-flex shrink-0">
            <CalendarBlank size={16} />
          </span>
          {copy.entries}
        </span>
        {copy.fastPass ? (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="inline-flex shrink-0">
              <Lightning size={16} />
            </span>
            {copy.fastPass}
          </span>
        ) : null}
      </div>
      {isVoid && copy.voided ? (
        <p className="text-sm leading-5 text-secondary-foreground">
          {copy.voided}
        </p>
      ) : null}
    </section>
  );
}

export type { TicketQrCardCopy, TicketQrCardProps, TicketQrCardState };
export { TicketQrCard };
