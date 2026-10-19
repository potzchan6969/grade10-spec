import { dayValue, formatTimeOfDay, formatWeekday } from "@grade10/date";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown } from "@phosphor-icons/react";
import { type ReactNode, useId, useState } from "react";
import { type LocaleProps, zoneLabel } from "./booking-copy";
import { INK_2, TEXT_LINK } from "./booking-look";

type BookingSummaryCopy = {
  title: string;
  service: string;
  location: string;
  when: string;
  /** The value of a row not picked yet; given, every row always shows. */
  notChosen?: string;
  /** The change press on a row: `Change`. */
  change?: string;
  /** Its name for a screen reader: `Change {what}`. */
  changeAria?: string;
  /** Joins the start and the end: `{day}, {from} to {to}`. */
  span?: string;
};

type BookingSummaryRow = { label: string; value: ReactNode };

type BookingSummaryProps = LocaleProps & {
  copy: BookingSummaryCopy;
  service?: ReactNode;
  /** Control beside the service — typically a change-service action. */
  serviceAction?: ReactNode;
  location?: ReactNode;
  /** Drawn under the shop's name when given. */
  address?: ReactNode;
  /** Drops the shop row: no service runs at more than one shop. */
  hideLocation?: boolean;
  start?: number;
  end?: number;
  /** Control beside the booked time — typically a change-date action. */
  whenAction?: ReactNode;
  timeZone?: string;
  timeZoneLabel?: string;
  /** Presses that go back to a pick; each row with a value offers its own. */
  onChangeService?: () => void;
  onChangeLocation?: () => void;
  onChangeWhen?: () => void;
  /** Rows after the picks, with no change: `For`, `Pay now`. */
  extraRows?: readonly BookingSummaryRow[];
  /** Lines under the rows: the price, what to bring. */
  notes?: readonly ReactNode[];
  /** The last line: until when it can be changed. */
  footer?: ReactNode;
  /** A booking is in flight: no change press works. */
  busy?: boolean;
  className?: string;
};

type Row = BookingSummaryRow & {
  set: boolean;
  action?: ReactNode;
};

function whenWords({
  copy,
  start,
  end,
  timeZone,
  timeZoneLabel,
  locale,
}: Pick<
  BookingSummaryProps,
  "copy" | "start" | "end" | "timeZone" | "timeZoneLabel"
> & { locale: string }) {
  if (start === undefined || timeZone === undefined) return undefined;
  const options = { locale, timeZone };
  const day = formatWeekday(dayValue(new Date(start), timeZone), locale);
  const from = formatTimeOfDay(start, options);
  if (end === undefined) return `${day}, ${from}`;
  const to = formatTimeOfDay(end, options);
  const span = (copy.span ?? "{day}, {from} to {to}")
    .replace("{day}", day)
    .replace("{from}", from)
    .replace("{to}", to);
  return `${span} ${zoneLabel(timeZone, start, timeZoneLabel)}`;
}

function rowsOf(
  props: BookingSummaryProps,
  locale: string,
): { rows: Row[]; when?: string } {
  const {
    copy,
    service,
    serviceAction,
    location,
    address,
    hideLocation,
    whenAction,
    onChangeService,
    onChangeLocation,
    onChangeWhen,
    extraRows = [],
    busy,
  } = props;
  const when = whenWords({ ...props, locale });
  const always = copy.notChosen !== undefined;
  const change = (label: string, onChange?: () => void) =>
    onChange && copy.change ? (
      <button
        aria-label={
          copy.changeAria
            ? copy.changeAria.replace("{what}", label.toLowerCase())
            : undefined
        }
        className={cn(TEXT_LINK, "flex-none px-1")}
        disabled={busy}
        onClick={onChange}
        type="button"
      >
        {copy.change}
      </button>
    ) : undefined;
  const rows: Row[] = [];
  if (service || always) {
    rows.push({
      label: copy.service,
      value: service ?? copy.notChosen,
      set: !!service,
      action: service
        ? (serviceAction ?? change(copy.service, onChangeService))
        : undefined,
    });
  }
  if (!hideLocation && (location || always)) {
    rows.push({
      label: copy.location,
      value: location ? (
        address ? (
          <span className="flex flex-col">
            <span>{location}</span>
            <span
              className={cn("text-[13px] leading-[18px] font-normal", INK_2)}
            >
              {address}
            </span>
          </span>
        ) : (
          location
        )
      ) : (
        copy.notChosen
      ),
      set: !!location,
      action: location ? change(copy.location, onChangeLocation) : undefined,
    });
  }
  if (when || always) {
    rows.push({
      label: copy.when,
      value: when ?? copy.notChosen,
      set: !!when,
      action: when
        ? (whenAction ?? change(copy.when, onChangeWhen))
        : undefined,
    });
  }
  for (const extra of extraRows) rows.push({ ...extra, set: true });
  return { rows, when };
}

function SummaryBody({
  rows,
  notes = [],
  footer,
}: {
  rows: readonly Row[];
  notes?: readonly ReactNode[];
  footer?: ReactNode;
}) {
  return (
    <>
      {rows.map((row) => (
        <div
          className="flex items-center gap-3 border-t border-border py-1.5"
          data-slot="booking-summary-row"
          key={row.label}
        >
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-xs leading-4 text-secondary-foreground">
              {row.label}
            </span>
            <span
              className={cn(
                "text-sm leading-5 tabular-nums",
                row.set ? "font-semibold" : "text-secondary-foreground",
              )}
            >
              {row.value}
            </span>
          </span>
          {row.action}
        </div>
      ))}
      {notes.length > 0 ? (
        <div
          className={cn(
            "flex flex-col gap-1 border-t border-border pt-2.5 text-[13px] leading-[18px]",
            INK_2,
          )}
          data-slot="booking-summary-notes"
        >
          {notes.map((line, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional
            <span key={index}>{line}</span>
          ))}
        </div>
      ) : null}
      {footer ? (
        <p className="m-0 mt-3 text-[13px] leading-[18px] text-secondary-foreground">
          {footer}
        </p>
      ) : null}
    </>
  );
}

/** The choice so far. Without `notChosen` a row renders once its value is
 * known; with it every row shows, unset ones saying so. */
function BookingSummary(props: BookingSummaryProps) {
  const { copy, notes, footer, locale = "en", className } = props;
  const headingId = useId();
  const { rows } = rowsOf(props, locale);
  return (
    <aside
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card p-4",
        className,
      )}
      data-slot="booking-summary"
    >
      <h2 className="m-0 mb-2 text-[15px] leading-5 font-bold" id={headingId}>
        {copy.title}
      </h2>
      <SummaryBody footer={footer} notes={notes} rows={rows} />
    </aside>
  );
}

type BookingSummaryBarProps = BookingSummaryProps & {
  /** The one line under the title while folded: `Grading drop-off · Central`. */
  line: ReactNode;
  /** Starts unfolded; the bar then keeps its own state. */
  defaultOpen?: boolean;
};

/** The choice so far on a narrow screen: one line under the title, unfolding
 * into the same rows the rail shows. */
function BookingSummaryBar(props: BookingSummaryBarProps) {
  const { copy, notes, footer, line, defaultOpen = false, className } = props;
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const { rows } = rowsOf(props, props.locale ?? "en");
  return (
    <div
      className={cn("border-b border-border bg-card", className)}
      data-slot="booking-summary-bar"
    >
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="flex min-h-13 w-full cursor-pointer items-center gap-3 bg-transparent px-4 py-1.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs leading-4 text-secondary-foreground">
            {copy.title}
          </span>
          <span className="truncate text-sm leading-5 font-semibold tabular-nums">
            {line}
          </span>
        </span>
        <span
          aria-hidden
          className={cn(
            "inline-flex transition-transform duration-150",
            open && "rotate-180",
          )}
        >
          <CaretDown size={16} />
        </span>
      </button>
      {open ? (
        <div
          className="flex animate-in flex-col px-4 pb-3 slide-in-from-top-1 duration-200"
          id={panelId}
        >
          <SummaryBody footer={footer} notes={notes} rows={rows} />
        </div>
      ) : null}
    </div>
  );
}

export type {
  BookingSummaryBarProps,
  BookingSummaryCopy,
  BookingSummaryProps,
  BookingSummaryRow,
};
export { BookingSummary, BookingSummaryBar };
