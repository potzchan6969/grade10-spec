import { Ticket } from "@phosphor-icons/react";
import { TicketActButton } from "./ticket-act-button";
import { TicketStatusBadge } from "./ticket-status-badge";
import type { MyTicketsOrder } from "./types";

/** One order in My Tickets: the event and its days, its state, how many
 * tickets under which reference, and its one act. Internal. */
function MyTicketsOrderCard({ order }: { order: MyTicketsOrder }) {
  return (
    <article
      aria-label={order.label}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground"
      data-slot="my-tickets-order"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <strong className="text-base leading-6 font-bold">
            {order.event}
          </strong>
          <span className="text-sm leading-5 text-secondary-foreground">
            {order.when}
          </span>
        </div>
        <TicketStatusBadge label={order.status} tone={order.tone} />
      </div>
      <div className="flex items-center gap-2 text-sm leading-5">
        <span aria-hidden className="inline-flex text-secondary-foreground">
          <Ticket size={16} />
        </span>
        <span>{order.tickets}</span>
        <span aria-hidden className="text-border-strong">
          |
        </span>
        <span className="font-mono">{order.reference}</span>
      </div>
      {order.note ? (
        <p className="text-sm leading-5 text-secondary-foreground">
          {order.note}
        </p>
      ) : null}
      <TicketActButton
        act={order.act}
        size="md"
        variant={order.urgent ? "default" : "outline"}
      />
    </article>
  );
}

export { MyTicketsOrderCard };
