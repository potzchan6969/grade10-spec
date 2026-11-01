import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import {
  TicketOrderSummary,
  type TicketOrderSummaryProps,
} from "./ticket-order-summary";
import { TicketQrCard, type TicketQrCardProps } from "./ticket-qr-card";
import { TicketStatusBadge } from "./ticket-status-badge";
import type { TicketTone } from "./types";

/** The words the order page says around its parts. */
type TicketOrderPageCopy = {
  /** "Order TK7Q2M" */
  title: string;
  /** The badge: "Confirmed", "Waiting for Payment", "Partly Refunded". */
  status: string;
  /** The event's name. */
  event: string;
  /** The lines under it: the days and hours, the venue, when it was bought. */
  facts: readonly string[];
  /** The trail back to My Tickets, for a signed-in collector. */
  breadcrumb?: { parent: string; current: string };
  /** What to do when the phone will not show a code. */
  doorNote?: string;
};

/** One ticket on the page, keyed. */
type TicketOrderPageTicket = TicketQrCardProps & { key: string };

type TicketOrderPageProps = {
  copy: TicketOrderPageCopy;
  tone: TicketTone;
  /** Where the breadcrumb's parent leads: My Tickets. */
  yourTicketsHref?: string;
  /** Replaces the order's heading: the paid outcome when the collector comes
   * back from Stripe. */
  lead?: ReactNode;
  /** Over the tickets: a `TicketOrderStatusBanner`. */
  banner?: ReactNode;
  /** One card per ticket that has a code; none while held. */
  tickets: readonly TicketOrderPageTicket[];
  summary: TicketOrderSummaryProps;
  /** Under the summary: a `TicketPointsRow`. */
  points?: ReactNode;
  /** The page's last word: the way back for lost tickets, or a guest's
   * sign-in prompt. */
  footer?: ReactNode;
  className?: string;
};

/**
 * One order, from the hold to the door: its reference and state, the event,
 * whatever the order needs said over its tickets, a QR card per ticket, what
 * it bought, and its points. The page carries no site chrome; the consumer
 * mounts it under the header.
 */
function TicketOrderPage({
  copy,
  tone,
  yourTicketsHref,
  lead,
  banner,
  tickets,
  summary,
  points,
  footer,
  className,
}: TicketOrderPageProps) {
  return (
    <div
      className={cn("flex w-full flex-col gap-5", className)}
      data-slot="ticket-order-page"
    >
      {lead ?? (
        <>
          {copy.breadcrumb ? (
            <Breadcrumbs className="-mx-1">
              <BreadcrumbItem href={yourTicketsHref}>
                {copy.breadcrumb.parent}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem current>{copy.breadcrumb.current}</BreadcrumbItem>
            </Breadcrumbs>
          ) : null}
          <header className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl leading-8 font-bold">{copy.title}</h1>
              <TicketStatusBadge label={copy.status} tone={tone} />
            </div>
            <p className="text-base leading-6 font-medium">{copy.event}</p>
            <p className="text-sm leading-5 text-secondary-foreground">
              {copy.facts.map((fact) => (
                <span className="block" key={fact}>
                  {fact}
                </span>
              ))}
            </p>
          </header>
        </>
      )}
      {banner}
      {tickets.map(({ key, ...ticket }) => (
        <TicketQrCard key={key} {...ticket} />
      ))}
      {tickets.length > 0 && copy.doorNote ? (
        <p className="text-sm leading-5 text-secondary-foreground">
          {copy.doorNote}
        </p>
      ) : null}
      <TicketOrderSummary {...summary} />
      {points}
      {footer}
    </div>
  );
}

export type {
  TicketOrderPageCopy,
  TicketOrderPageProps,
  TicketOrderPageTicket,
};
export { TicketOrderPage };
