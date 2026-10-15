import { formatShortDay } from "@grade10/date";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import {
  type BookingDaysProps,
  dayLabel,
  dayWord,
  kindOf,
  WEEK,
} from "./booking-days";
import { dayInstant, shiftMonth, weekdayOf } from "./calendar";
import type { BookingDayKind } from "./types";

const STRIP_DAYS = 14;

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

/** The 14-day strip a phone reads in place of the month. Internal. */
function BookingDayStrip({
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
}: BookingDaysProps) {
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
              data-selected={picked || undefined}
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

export { BookingDayStrip };
