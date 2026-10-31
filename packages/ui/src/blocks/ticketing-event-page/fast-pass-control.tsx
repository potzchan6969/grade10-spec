import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { Lightning, Minus, Plus, Trash } from "@phosphor-icons/react";
import { fillCopy } from "./event-page-copy";

type FastPassControlCopy = {
  /** `Fast Pass`. */
  title: string;
  /** `Skip the long entrance queue at the venue. One Fast Pass covers one
   * person for one day.` */
  body: string;
  /** The add press's visible word: `Fast Pass`. */
  add: string;
  /** `Add Fast Pass for {who}, {days}`. */
  addLabel: string;
  /** `One more Fast Pass day for {who}`. */
  moreLabel: string;
  /** `One fewer Fast Pass day for {who}`. */
  fewerLabel: string;
  /** The − at one day is a bin: `Remove Fast Pass for {who}`. */
  removeLabel: string;
  /** The pill's group name: `Fast Pass days for {who}`. */
  daysLabel: string;
  /** `Fast Pass for everyone on this pass`. */
  everyoneGroup: string;
  /** `Fast Pass for each ticket`. */
  eachGroup: string;
  /** Before the split press: `Not everyone needs it?`. */
  splitHint: string;
  /** `Choose per person`. */
  split: string;
  /** Before the join press: `Everyone needs it?`. */
  joinHint: string;
  /** `Same for everyone`. */
  join: string;
};

/** One line of the control: everyone on the pass, or one person. */
type FastPassLine = {
  id: string;
  /** `Everyone`, `Adult 1`, `Child`. */
  label: string;
  /** Under the label on the everyone line: `3 people`. */
  who?: string;
  /** Fast Pass days chosen, 0 up to the control's `maxDays`. */
  days: number;
  /** `2 days`. */
  daysText: string;
  /** What the days add: `+HK$600.00`; none at 0 days. */
  price?: string;
};

type FastPassSelection =
  | { mode: "everyone"; everyone: FastPassLine }
  | {
      mode: "each";
      people: readonly FastPassLine[];
      /** `4 of 6 Fast Passes: HK$400.00.` */
      tally: string;
      /** `2 more cover everyone, every day.` or `Everyone skips the queue.` */
      nudge: string;
      /** `Add for everyone (+HK$200.00)`; none once everyone has every
       * day. */
      fillLabel?: string;
    };

type FastPassControlProps = {
  copy: FastPassControlCopy;
  /** The days the pass still admits: the + stops there, and a one-day pass
   * shows no + at all. */
  maxDays: number;
  /** `2 days`: what the add press adds, in its accessible name. */
  maxDaysText: string;
  selection: FastPassSelection;
  /** A line's days changed: the line's `id` and its new days. */
  onDaysChange: (lineId: string, days: number) => void;
  /** Switch between one line for everyone and one per person. Omit it on a
   * pass with one ticket: there is no one else to split from. */
  onModeChange?: (mode: FastPassSelection["mode"]) => void;
  /** Gives every person every day the pass admits. */
  onFillAll?: () => void;
  className?: string;
};

const ADD =
  "inline-flex h-11 items-center gap-1.5 rounded-full border-[1.5px] border-dashed border-border bg-card px-4 text-sm font-semibold whitespace-nowrap text-foreground transition-[border-color,transform] duration-150 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[.96]";
const STEP =
  "grid size-11 place-items-center border-0 bg-transparent text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring active:not-disabled:scale-[.96] disabled:cursor-default disabled:opacity-35";

function Line({
  copy,
  line,
  maxDays,
  maxDaysText,
  onDaysChange,
}: {
  copy: FastPassControlCopy;
  line: FastPassLine;
  maxDays: number;
  maxDaysText: string;
  onDaysChange: (lineId: string, days: number) => void;
}) {
  const who = { who: line.label };
  const last = line.days === 1;
  return (
    <div
      className="flex min-h-12 items-center gap-3"
      data-slot="fast-pass-line"
    >
      <span className="flex w-[76px] shrink-0 flex-col">
        <span className="text-sm font-medium">{line.label}</span>
        {line.who ? (
          <span className="text-xs leading-4 text-secondary-foreground">
            {line.who}
          </span>
        ) : null}
        {line.price ? (
          <span className="text-xs leading-4 text-secondary-foreground tabular-nums @min-[28rem]/fast:hidden">
            {line.price}
          </span>
        ) : null}
      </span>
      {line.days === 0 ? (
        <button
          aria-label={fillCopy(copy.addLabel, { ...who, days: maxDaysText })}
          className={ADD}
          onClick={() => onDaysChange(line.id, maxDays)}
          type="button"
        >
          <Plus aria-hidden size={14} weight="bold" />
          {copy.add}
        </button>
      ) : (
        <fieldset
          aria-label={fillCopy(copy.daysLabel, who)}
          className="m-0 inline-flex h-11 min-w-0 items-center overflow-hidden rounded-full border-[1.5px] border-primary bg-[color-mix(in_oklab,var(--primary)_16%,var(--card))] p-0"
        >
          <button
            aria-label={fillCopy(
              last ? copy.removeLabel : copy.fewerLabel,
              who,
            )}
            className={STEP}
            onClick={() => onDaysChange(line.id, line.days - 1)}
            type="button"
          >
            {last ? (
              <Trash aria-hidden size={16} />
            ) : (
              <Minus aria-hidden size={16} weight="bold" />
            )}
          </button>
          <span
            aria-live="polite"
            className={cn(
              "inline-flex items-center justify-center gap-1.5 px-2 text-sm font-semibold whitespace-nowrap tabular-nums",
              maxDays > 1 ? null : "pr-[18px]",
            )}
          >
            <span aria-hidden className="inline-flex text-primary">
              <Lightning size={14} weight="bold" />
            </span>
            {line.daysText}
            {maxDays > 1 ? (
              <span aria-hidden className="ml-1 inline-flex gap-1">
                {Array.from({ length: maxDays }, (_, day) => (
                  <span
                    className={cn(
                      "size-[7px] rounded-full",
                      day < line.days
                        ? "bg-primary"
                        : "bg-[color-mix(in_oklab,var(--foreground)_22%,transparent)]",
                    )}
                    data-on={day < line.days}
                    // biome-ignore lint/suspicious/noArrayIndexKey: one dot per day, in day order
                    key={day}
                  />
                ))}
              </span>
            ) : null}
          </span>
          {maxDays > 1 ? (
            <button
              aria-label={fillCopy(copy.moreLabel, who)}
              className={STEP}
              disabled={line.days >= maxDays}
              onClick={() => onDaysChange(line.id, line.days + 1)}
              type="button"
            >
              <Plus aria-hidden size={16} weight="bold" />
            </button>
          ) : null}
        </fieldset>
      )}
      {line.price ? (
        <span className="hidden flex-1 text-right text-sm tabular-nums @min-[28rem]/fast:inline">
          {line.price}
        </span>
      ) : null}
    </div>
  );
}

/**
 * The Fast Pass upgrade under a pass's tickets, shown once a ticket is
 * chosen. One line for everyone on the pass starts as `+ Fast Pass`, which
 * adds every day the pass admits and grows into a pill: −, ⚡ the days with
 * a dot per day, +. At one day the − is a bin; a one-day pass has no +.
 *
 * `Choose per person` opens one line per ticket, with the tally, a nudge
 * toward covering everyone and `Add for everyone`; `Same for everyone` folds
 * it back. The control is controlled: the page owns the days and prices.
 */
function FastPassControl({
  copy,
  maxDays,
  maxDaysText,
  selection,
  onDaysChange,
  onModeChange,
  onFillAll,
  className,
}: FastPassControlProps) {
  const lineProps = { copy, maxDays, maxDaysText, onDaysChange };
  const each = selection.mode === "each";
  return (
    <div
      className={cn("@container/fast", className)}
      data-mode={selection.mode}
      data-slot="fast-pass-control"
    >
      <div className="flex flex-col gap-3.5 rounded-xl bg-background-subtle p-4">
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 text-base font-semibold">
            <span aria-hidden className="inline-flex shrink-0 text-primary">
              <Lightning size={16} weight="bold" />
            </span>
            {copy.title}
          </span>
          <span className="text-sm leading-5 text-secondary-foreground">
            {copy.body}
          </span>
        </div>
        {selection.mode === "everyone" ? (
          <fieldset
            aria-label={copy.everyoneGroup}
            className="m-0 min-w-0 border-0 p-0"
          >
            <Line {...lineProps} line={selection.everyone} />
          </fieldset>
        ) : (
          <>
            <fieldset
              aria-label={copy.eachGroup}
              className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0"
            >
              {selection.people.map((line) => (
                <Line {...lineProps} key={line.id} line={line} />
              ))}
            </fieldset>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <span className="text-sm leading-5 tabular-nums">
                <strong className="font-semibold">{selection.tally}</strong>{" "}
                <span className="text-secondary-foreground">
                  {selection.nudge}
                </span>
              </span>
              {selection.fillLabel && onFillAll ? (
                <Button onClick={onFillAll} size="sm" variant="outline">
                  {selection.fillLabel}
                </Button>
              ) : null}
            </div>
          </>
        )}
        {onModeChange ? (
          <div className="-mx-3 -mt-1.5 -mb-2.5 flex flex-wrap items-center gap-1">
            <span className="pl-3 text-[13px] leading-[18px] text-secondary-foreground">
              {each ? copy.joinHint : copy.splitHint}
            </span>
            <Button
              onClick={() => onModeChange(each ? "everyone" : "each")}
              size="sm"
              variant="ghost"
            >
              {each ? copy.join : copy.split}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type {
  FastPassControlCopy,
  FastPassControlProps,
  FastPassLine,
  FastPassSelection,
};
export { FastPassControl };
