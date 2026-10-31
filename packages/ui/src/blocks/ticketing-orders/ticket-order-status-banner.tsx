import { cn } from "@grade10/design-system/lib/utils";
import { CircleNotch, Clock, XCircle } from "@phosphor-icons/react";
import { TicketActButton } from "./ticket-act-button";
import type { TicketAct } from "./types";

/** What an order page says over the tickets. */
type TicketOrderStatusBannerKind =
  /** Held, counting down to the hold's end, with the way back to pay. */
  | "held"
  /** The hold reached zero; the payment is being checked. */
  | "checking"
  /** Some tickets refunded, the rest still admit. */
  | "partRefunded"
  /** Every ticket refunded. */
  | "refunded"
  /** The event is cancelled and the order refunded. */
  | "eventCancelled"
  /** A guest in the browser that bought: sign in to see it anywhere. */
  | "guest";

/** The words the banner says. */
type TicketOrderStatusBannerCopy = {
  /** "Held for", "Checking", "HK$190.00 is on its way back". */
  title: string;
  body: string;
};

type TicketOrderStatusBannerProps = {
  copy: TicketOrderStatusBannerCopy;
  kind: TicketOrderStatusBannerKind;
  /** Held only: the time left, formatted and ticked by the consumer: "12:34". */
  countdown?: string;
  /** Held: Continue to Payment. Guest: Sign In. */
  act?: TicketAct;
  className?: string;
};

const TINT: Record<Exclude<TicketOrderStatusBannerKind, "guest">, string> = {
  held: "bg-primary-muted",
  checking: "bg-muted",
  partRefunded: "bg-muted",
  refunded: "bg-muted",
  eventCancelled: "bg-destructive-muted",
};

function Glyph({ kind }: { kind: TicketOrderStatusBannerKind }) {
  if (kind === "checking")
    return (
      <span
        aria-hidden
        className="inline-flex animate-spin text-secondary-foreground"
      >
        <CircleNotch size={20} />
      </span>
    );
  if (kind === "eventCancelled")
    return (
      <span aria-hidden className="inline-flex text-destructive">
        <XCircle size={20} />
      </span>
    );
  return (
    <span
      aria-hidden
      className={`inline-flex ${kind === "held" ? "text-primary" : "text-secondary-foreground"}`}
    >
      <Clock size={20} />
    </span>
  );
}

/**
 * Where an order stands, over its tickets: held with its countdown and the
 * way back to pay, checking once the hold reached zero, a refund on its way
 * (part or whole), the event cancelled — or, for a guest in the browser that
 * bought, the way to see the order anywhere. The consumer ticks the countdown.
 */
function TicketOrderStatusBanner({
  copy,
  kind,
  countdown,
  act,
  className,
}: TicketOrderStatusBannerProps) {
  if (kind === "guest") {
    return (
      <section
        aria-label={copy.title}
        className={cn(
          "flex flex-col gap-3 rounded-2xl border border-border bg-card p-4",
          className,
        )}
        data-kind={kind}
        data-slot="ticket-order-status-banner"
      >
        <strong className="text-base leading-6 font-semibold">
          {copy.title}
        </strong>
        <p className="text-sm leading-5 text-secondary-foreground">
          {copy.body}
        </p>
        {act ? <TicketActButton act={act} size="md" variant="outline" /> : null}
      </section>
    );
  }
  const held = kind === "held";
  const title = (
    <strong className="text-base leading-6 font-medium">
      {copy.title}
      {held && countdown ? (
        <>
          {" "}
          <span className="font-bold tabular-nums" data-slot="ticket-countdown">
            {countdown}
          </span>
        </>
      ) : null}
    </strong>
  );
  return (
    <section
      aria-label={held ? copy.title : undefined}
      className={cn(
        "flex flex-col gap-4 rounded-2xl p-4",
        held && "p-5",
        TINT[kind],
        className,
      )}
      data-kind={kind}
      data-slot="ticket-order-status-banner"
      role={held ? undefined : "status"}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex shrink-0">
          <Glyph kind={kind} />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          {title}
          <span className="text-sm leading-5 text-secondary-foreground">
            {copy.body}
          </span>
        </div>
      </div>
      {held && act ? <TicketActButton act={act} size="lg" /> : null}
    </section>
  );
}

export type {
  TicketOrderStatusBannerCopy,
  TicketOrderStatusBannerKind,
  TicketOrderStatusBannerProps,
};
export { TicketOrderStatusBanner };
