import { formatMonthName, formatShortDay, formatWeekday } from "@grade10/date";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { dayInstant, monthInstant, shiftMonth, weekdayOf } from "./calendar";
import type { BookingDay, BookingDayKind } from "./types";

/** Monday first, as the grid reads. */
type WeekdayWords = Readonly<
  Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", string>
>;

const WEEK = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

type BookingCalendarCopy = {
  previousMonth: string;
  nextMonth: string;
  /** The grid's column heads: `Mo`, `Tu`. */
  heads?: WeekdayWords;
  /** The strip's weekday over each number: `Mon`, `Tue`. */
  weekdays?: WeekdayWords;
  /** Under a full day's number: `Full`. */
  full?: string;
  /** Under a closed day's number: `Closed`. */
  closed?: string;
  /** Leads today's name for a screen reader: `Today`. */
  today?: string;
  /** The strip's range: `{from} to {to}`. */
  stripTitle?: string;
  earlierDays?: string;
  laterDays?: string;
};

type BookingCalendarProps = {
  copy: BookingCalendarCopy;
  layout: "month" | "strip";
  month: string;
  minMonth?: string;
  maxMonth?: string;
  /** Shop-local today, `YYYY-MM-DD`. */
  today: string;
  days: readonly BookingDay[];
  selectedDate?: string;
  locale: string;
  onMonthChange: (month: string) => void;
  onSelectDay: (date: string) => void;
};

const STRIP_DAYS = 14;

function kindOf(day: BookingDay): BookingDayKind {
  return day.kind ?? (day.available ? "open" : "unavailable");
}

/** The month grid, or the 14-day strip a phone reads instead. Internal. */
function BookingCalendar(props: BookingCalendarProps) {
  return props.layout === "strip" ? (
    <DayStrip {...props} />
  ) : (
    <MonthGrid {...props} />
  );
}

function dayWord(copy: BookingCalendarCopy, kind: BookingDayKind) {
  if (kind === "full") return copy.full ?? "";
  if (kind === "closed") return copy.closed ?? "";
  return "";
}

function dayLabel(
  copy: BookingCalendarCopy,
  date: string,
  kind: BookingDayKind,
  today: string,
  locale: string,
) {
  const word = dayWord(copy, kind);
  return [
    date === today && copy.today ? copy.today : null,
    formatWeekday(date, locale),
    word || null,
  ]
    .filter(Boolean)
    .join(", ");
}

function dayTone(kind: BookingDayKind, picked: boolean) {
  if (picked) return "bg-primary text-primary-foreground";
  if (kind === "open")
    return "bg-card text-foreground shadow-[inset_0_0_0_1px_var(--border-strong)] hover:shadow-[inset_0_0_0_1px_var(--foreground)]";
  if (kind === "full" || kind === "closed")
    return "bg-card text-secondary-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:shadow-[inset_0_0_0_1px_var(--foreground)]";
  return "bg-transparent text-muted-foreground";
}

function NavButton({
  label,
  disabled,
  onClick,
  next,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  next?: boolean;
}) {
  return (
    <button
      aria-label={label}
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-transparent text-foreground transition-colors duration-100 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {next ? (
        <CaretRight aria-hidden size={16} />
      ) : (
        <CaretLeft aria-hidden size={16} />
      )}
    </button>
  );
}

function MonthGrid({
  copy,
  month,
  minMonth,
  maxMonth,
  today,
  days,
  selectedDate,
  locale,
  onMonthChange,
  onSelectDay,
}: BookingCalendarProps) {
  const title = formatMonthName(monthInstant(month), {
    locale,
    timeZone: "UTC",
  });
  const lead = days[0] ? weekdayOf(days[0].date) : 0;
  const cells: (BookingDay | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  );
  return (
    <div className="flex min-w-0 flex-col gap-2" data-slot="booking-month">
      <div className="flex items-center gap-1">
        <span
          aria-live="polite"
          className="flex-1 text-[15px] leading-5 font-bold"
          role="status"
        >
          {title}
        </span>
        <NavButton
          disabled={minMonth !== undefined && month <= minMonth}
          label={copy.previousMonth}
          onClick={() => onMonthChange(shiftMonth(month, -1))}
        />
        <NavButton
          disabled={maxMonth !== undefined && month >= maxMonth}
          label={copy.nextMonth}
          next
          onClick={() => onMonthChange(shiftMonth(month, 1))}
        />
      </div>
      <table
        aria-label={title}
        className="-m-1 w-[calc(100%+0.5rem)] table-fixed border-separate border-spacing-1"
        // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: a month of pressable days is an ARIA grid, as the calendar it replaces was
        role="grid"
      >
        <thead>
          <tr>
            {WEEK.map((key) => (
              <th
                className="h-6 p-0 text-xs font-normal text-secondary-foreground"
                key={key}
                scope="col"
              >
                {copy.heads?.[key] ?? key.slice(0, 2)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.find(Boolean)?.date ?? "blank"}>
              {week.map((day, index) =>
                day ? (
                  <DayCell
                    copy={copy}
                    day={day}
                    key={day.date}
                    locale={locale}
                    onSelectDay={onSelectDay}
                    selected={day.date === selectedDate}
                    today={today}
                  />
                ) : (
                  // biome-ignore lint/suspicious/noArrayIndexKey: blanks are positional
                  <td className="p-0" key={`blank-${index}`} />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DayCell({
  copy,
  day,
  selected,
  today,
  locale,
  onSelectDay,
}: {
  copy: BookingCalendarCopy;
  day: BookingDay;
  selected: boolean;
  today: string;
  locale: string;
  onSelectDay: (date: string) => void;
}) {
  const kind = kindOf(day);
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: a cell of a grid table is a gridcell, which carries the pick
    <td aria-selected={selected} className="min-w-0 p-0">
      <button
        aria-label={dayLabel(copy, day.date, kind, today, locale)}
        aria-pressed={selected}
        className={cn(
          "flex h-13 w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-px rounded-lg p-0 transition-[box-shadow,background-color] duration-100 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed",
          dayTone(kind, selected),
        )}
        data-day={day.date}
        data-kind={kind}
        disabled={kind === "unavailable"}
        onClick={() => onSelectDay(day.date)}
        type="button"
      >
        <span
          className={cn(
            "text-sm leading-[18px] font-semibold tabular-nums",
            day.date === today &&
              "underline decoration-2 underline-offset-[3px]",
          )}
        >
          {Number(day.date.slice(8, 10))}
        </span>
        <span className="h-3 text-[10px] leading-3">{dayWord(copy, kind)}</span>
      </button>
    </td>
  );
}

function DayStrip({
  copy,
  month,
  minMonth,
  maxMonth,
  today,
  days,
  selectedDate,
  locale,
  onMonthChange,
  onSelectDay,
}: BookingCalendarProps) {
  // The strip opens on today when the month holds it, and moves to keep the
  // picked day in the window.
  const startIndex = Math.max(
    0,
    days.findIndex((day) => day.date >= today),
  );
  const [offset, setOffset] = useState(startIndex);
  const [shownMonth, setShownMonth] = useState(month);
  if (shownMonth !== month) {
    setShownMonth(month);
    setOffset(startIndex);
  }
  const selectedIndex = days.findIndex((day) => day.date === selectedDate);
  // Follows the pick only when it changes, so paging away from it holds.
  const [followed, setFollowed] = useState<string | undefined>(undefined);
  if (followed !== selectedDate) setFollowed(selectedDate);
  if (
    followed !== selectedDate &&
    selectedIndex >= 0 &&
    (selectedIndex < offset || selectedIndex >= offset + STRIP_DAYS)
  ) {
    setOffset(
      selectedIndex < startIndex
        ? selectedIndex
        : selectedIndex - ((selectedIndex - startIndex) % STRIP_DAYS),
    );
  }
  const window = days.slice(offset, offset + STRIP_DAYS);
  const first = window[0];
  const last = window.at(-1);
  const canEarlier =
    offset > startIndex || minMonth === undefined || month > minMonth;
  const canLater =
    offset + STRIP_DAYS < days.length ||
    maxMonth === undefined ||
    month < maxMonth;
  const word = (date: string) =>
    formatShortDay(dayInstant(date), { locale, timeZone: "UTC" });
  const title =
    first && last
      ? (copy.stripTitle ?? "{from} – {to}")
          .replace("{from}", word(first.date))
          .replace("{to}", word(last.date))
      : "";

  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = row.current;
    const cell = bar?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!bar || !cell) return;
    if (
      cell.offsetLeft < bar.scrollLeft ||
      cell.offsetLeft + cell.offsetWidth > bar.scrollLeft + bar.clientWidth
    ) {
      bar.scrollLeft = Math.max(0, cell.offsetLeft - 4);
    }
  });

  return (
    <div className="flex min-w-0 flex-col gap-2" data-slot="booking-strip">
      <div className="flex items-center gap-1">
        <span
          aria-live="polite"
          className="flex-1 text-sm leading-5 font-bold tabular-nums"
        >
          {title}
        </span>
        <NavButton
          disabled={!canEarlier}
          label={copy.earlierDays ?? copy.previousMonth}
          onClick={() => {
            if (offset - STRIP_DAYS >= startIndex) {
              setOffset(offset - STRIP_DAYS);
            } else if (offset > startIndex) {
              setOffset(startIndex);
            } else {
              onMonthChange(shiftMonth(month, -1));
            }
          }}
        />
        <NavButton
          disabled={!canLater}
          label={copy.laterDays ?? copy.nextMonth}
          next
          onClick={() => {
            if (offset + STRIP_DAYS < days.length) {
              setOffset(offset + STRIP_DAYS);
            } else {
              onMonthChange(shiftMonth(month, 1));
            }
          }}
        />
      </div>
      <div
        className="relative -m-1 flex snap-x snap-mandatory gap-1 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={row}
      >
        {window.map((day) => {
          const kind = kindOf(day);
          const picked = day.date === selectedDate;
          const weekday = WEEK[weekdayOf(day.date)] ?? "mon";
          return (
            <button
              aria-label={dayLabel(copy, day.date, kind, today, locale)}
              aria-pressed={picked}
              className={cn(
                "flex h-17 min-w-11 flex-[0_0_calc((100%-24px)/7)] cursor-pointer snap-start flex-col items-center justify-center gap-px rounded-lg p-0 transition-[box-shadow,background-color] duration-100 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed",
                dayTone(kind, picked),
              )}
              data-day={day.date}
              data-kind={kind}
              disabled={kind === "unavailable"}
              key={day.date}
              onClick={() => onSelectDay(day.date)}
              type="button"
            >
              <span className="text-[11px] leading-[14px]">
                {copy.weekdays?.[weekday] ?? weekday}
              </span>
              <span
                className={cn(
                  "text-[15px] leading-5 font-bold tabular-nums",
                  day.date === today &&
                    "underline decoration-2 underline-offset-[3px]",
                )}
              >
                {Number(day.date.slice(8, 10))}
              </span>
              <span className="h-3 text-[10px] leading-3">
                {dayWord(copy, kind)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { BookingCalendarCopy, WeekdayWords };
export { BookingCalendar };
