import { cn } from "@grade10/design-system/lib/utils";
import type { TicketOrderLine } from "./types";

/** The words the summary says. */
type TicketOrderSummaryCopy = {
  /** "What You Bought" */
  title: string;
  /** "Total", "Total after refund", "Refunded". */
  totalLabel: string;
  /** "Paid by Visa •• 4242 on 24 Nov 2026" */
  paidBy?: string;
  /** "Refunded", beside the amount taken off. */
  refundLabel?: string;
};

type TicketOrderSummaryProps = {
  copy: TicketOrderSummaryCopy;
  lines: readonly TicketOrderLine[];
  /** "HK$1,150.00", or "Free". */
  total: string;
  /** The amount refunded so far, signed: "−HK$190.00". */
  refund?: string;
  className?: string;
};

/**
 * What the order bought, line by line as the consumer priced it, how it was
 * paid, any refund taken off, and the total. Nothing is computed here.
 */
function TicketOrderSummary({
  copy,
  lines,
  total,
  refund,
  className,
}: TicketOrderSummaryProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-card-foreground",
        className,
      )}
      data-slot="ticket-order-summary"
    >
      <h2 className="text-lg leading-7 font-bold">{copy.title}</h2>
      {lines.map((line) => (
        <div
          className="flex items-start justify-between gap-3 text-sm leading-5"
          key={line.key}
        >
          <span className="min-w-0">
            {line.label}
            {line.detail ? (
              <span className="block text-secondary-foreground">
                {line.detail}
              </span>
            ) : null}
          </span>
          <span className="shrink-0 font-medium whitespace-nowrap">
            {line.amount}
          </span>
        </div>
      ))}
      {copy.paidBy ? (
        <p className="text-sm leading-5 text-secondary-foreground">
          {copy.paidBy}
        </p>
      ) : null}
      {refund && copy.refundLabel ? (
        <div className="flex justify-between gap-3 text-sm leading-5 text-secondary-foreground">
          <span>{copy.refundLabel}</span>
          <span className="whitespace-nowrap">{refund}</span>
        </div>
      ) : null}
      <div className="flex justify-between gap-3 border-t border-border pt-3 text-base leading-6 font-bold">
        <span>{copy.totalLabel}</span>
        <span className="whitespace-nowrap" data-slot="ticket-order-total">
          {total}
        </span>
      </div>
    </section>
  );
}

export type { TicketOrderSummaryCopy, TicketOrderSummaryProps };
export { TicketOrderSummary };
