import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import {
  CurrencyCircleDollar,
  Info,
  Lightning,
  Tag,
  X,
} from "@phosphor-icons/react";
import { type ReactNode, useId } from "react";
import { fillCopy } from "./event-page-copy";

type EventOrderSummaryCopy = {
  /** `Your Order`. */
  title: string;
  /** Before anything is chosen: `Choose how many of each pass. You pay on
   * the next step, by card or WeChat Pay.` */
  empty: string;
  /** `Continue`. */
  continue: string;
  /** Read before a struck-through amount: `Was`. */
  was: string;
  /** A removable line's press: `Remove {line}`. */
  remove: string;
  /** The Fast Pass prompt's heading: `Skip the queue with Fast Pass`. */
  fastPassPrompt: string;
};

type EventOrderLine = {
  id: string;
  /** `2 × General Pass (Two-Day), Adult`, `Fast Pass × 6 days`. */
  label: string;
  /** `HK$760.00`. */
  amount: string;
  /** The full price struck through during an early bird: `HK$960.00`. */
  was?: string;
  /** Lines that come off with a ✕, such as Fast Pass. */
  onRemove?: () => void;
};

/** The nudge shown while nothing chosen has Fast Pass. */
type EventOrderFastPassPrompt = {
  /** `HK$300 a day for 3 people`. */
  detail: string;
  /** `Add 1 day`, `Add both days`; or one `Add for everyone`. */
  options: readonly { id: string; label: string; onAdd: () => void }[];
};

type EventOrderSummaryProps = {
  copy: EventOrderSummaryCopy;
  /** What is chosen; none shows the empty sentence. */
  lines: readonly EventOrderLine[];
  /** `3 tickets`. */
  count: string;
  /** `HK$950.00`. */
  total: string;
  /** The early-bird saving across the order, the catalog's whole sentence
   * with its bold run drawn by the page: `**You save HK$250.00** with the
   * early bird price.` A language that puts the saving mid-sentence keeps
   * its own order. */
  savingLine?: ReactNode;
  fastPassPrompt?: EventOrderFastPassPrompt;
  /** At the email's limit: `One email can buy up to 8 tickets for this
   * event.` */
  limitNote?: string;
  /** The points line at the foot: `You will earn points in the Grade10
   * account for your email.` */
  points?: string;
  onContinue: () => void;
  /** Continue is pressed and the next step is on its way. */
  busy?: boolean;
  /** The anchor the phone bar's `see order` jumps to. */
  id?: string;
  className?: string;
};

/**
 * Your Order, beside the passes (under them on a phone): each chosen line
 * with its full price struck through during an early bird, the Fast Pass
 * prompt while none is chosen, the count and total, the early-bird saving on
 * a gold tint, Continue, and the points line. Continue waits for a ticket.
 */
function EventOrderSummary({
  copy,
  lines,
  count,
  total,
  savingLine,
  fastPassPrompt,
  limitNote,
  points,
  onContinue,
  busy,
  id,
  className,
}: EventOrderSummaryProps) {
  const headingId = useId();
  const chosen = lines.length > 0;
  return (
    <aside
      aria-labelledby={headingId}
      className={cn(
        "box-border flex flex-col gap-4 rounded-2xl border border-border bg-card p-6",
        className,
      )}
      data-slot="event-order-summary"
      id={id}
    >
      <h2 className="m-0 text-xl leading-7 font-bold" id={headingId}>
        {copy.title}
      </h2>
      {chosen ? (
        <>
          <div className="flex flex-col gap-2.5">
            {lines.map((line) => (
              <div
                className="flex justify-between gap-3 text-sm leading-5"
                key={line.id}
              >
                <span>{line.label}</span>
                <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
                  {line.was ? (
                    <s className="text-[13px] text-secondary-foreground tabular-nums">
                      <span className="sr-only">{copy.was} </span>
                      {line.was}
                    </s>
                  ) : null}
                  <span className="tabular-nums">{line.amount}</span>
                  {line.onRemove ? (
                    <button
                      aria-label={fillCopy(copy.remove, { line: line.label })}
                      className="-my-1 -mr-1.5 -ml-0.5 grid size-7 place-items-center self-center rounded-full border-0 bg-transparent text-secondary-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      onClick={line.onRemove}
                      type="button"
                    >
                      <X aria-hidden size={14} weight="bold" />
                    </button>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
          {fastPassPrompt ? (
            <fieldset
              aria-label={copy.fastPassPrompt}
              className="m-0 flex min-w-0 flex-col gap-2.5 rounded-[10px] border border-border p-3"
            >
              <div className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="inline-flex mt-0.5 shrink-0 text-primary"
                >
                  <Lightning size={16} weight="bold" />
                </span>
                <span className="flex flex-col">
                  <strong className="text-sm leading-5 font-semibold">
                    {copy.fastPassPrompt}
                  </strong>
                  <span className="text-[13px] leading-[18px] text-secondary-foreground tabular-nums">
                    {fastPassPrompt.detail}
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {fastPassPrompt.options.map((option) => (
                  <Button
                    key={option.id}
                    onClick={option.onAdd}
                    size="sm"
                    variant="outline"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </fieldset>
          ) : null}
          <div className="h-px bg-border-subtle" />
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-base font-semibold">{count}</span>
            <span className="text-2xl leading-8 font-bold">{total}</span>
          </div>
          {savingLine ? (
            <div className="flex items-center gap-2.5 rounded-[10px] bg-primary-muted px-3 py-2.5 text-sm leading-5">
              <span aria-hidden className="inline-flex shrink-0 text-primary">
                <Tag size={16} />
              </span>
              <span>{savingLine}</span>
            </div>
          ) : null}
        </>
      ) : (
        <p className="m-0 text-sm leading-5 text-secondary-foreground">
          {copy.empty}
        </p>
      )}
      <Button
        className="self-start"
        disabled={!chosen}
        loading={busy}
        onClick={onContinue}
        size="lg"
      >
        {copy.continue}
      </Button>
      {limitNote ? (
        <p
          className="m-0 flex items-start gap-2 text-sm leading-5"
          role="status"
        >
          <span
            aria-hidden
            className="inline-flex mt-0.5 shrink-0 text-primary"
          >
            <Info size={16} />
          </span>
          {limitNote}
        </p>
      ) : null}
      {points ? (
        <span className="inline-flex items-start gap-2 text-sm leading-5 text-secondary-foreground">
          <span
            aria-hidden
            className="inline-flex mt-0.5 shrink-0 text-primary"
          >
            <CurrencyCircleDollar size={16} />
          </span>
          <span>{points}</span>
        </span>
      ) : null}
    </aside>
  );
}

export type {
  EventOrderFastPassPrompt,
  EventOrderLine,
  EventOrderSummaryCopy,
  EventOrderSummaryProps,
};
export { EventOrderSummary };
