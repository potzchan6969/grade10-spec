import { formatTimeOfDay, formatWeekday, hourOf } from "@grade10/date";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import type { AsyncState } from "../shared/async";
import { AsyncRegion } from "./async-region";
import { type LocaleProps, zoneLabel } from "./booking-copy";
import { BookingDayStrip } from "./booking-day-strip";
import type { BookingDaysCopy, WeekdayWords } from "./booking-days";
import { INK_2, STEP_HEADING } from "./booking-look";
import { BookingMonth } from "./booking-month";
import { dayFromDate, dayInstant, monthInstant } from "./calendar";
import type { BookingDay, BookingSlot } from "./types";

type BookingSlotPickerCopy = {
  /** Kept for consumers that still pass it; the calendar is unheaded. */
  dayTitle?: string;
  /** The step's heading: `Pick a time`. */
  timeTitle: string;
  previousMonth: string;
  nextMonth: string;
  /** Precedes the zone name: `Times in`. */
  timesIn: string;
  /** Shown in the time column before a day is picked. */
  pickADay: string;
  /** Shown when the picked day's list came back with nothing in it. */
  noTimes: string;
  /** The month grid's column heads: `Mo`, `Tu`. */
  heads?: WeekdayWords;
  /** The strip's weekday over each number: `Mon`. */
  weekdays?: WeekdayWords;
  /** Under a full day's number: `Full`. */
  full?: string;
  /** Under a closed day's number: `Closed`. */
  closed?: string;
  /** Today's day header: `Today, {day}`. */
  todayDay?: string;
  /** The strip's range: `{from} to {to}`. */
  stripTitle?: string;
  earlierDays?: string;
  laterDays?: string;
  /** Groups the times by part of the day; omit it for one list. */
  parts?: { morning: string; afternoon: string; evening: string };
};

type BookingSlotPickerProps = LocaleProps & {
  copy: BookingSlotPickerCopy;
  /** `YYYY-MM` in the shop's calendar. */
  month: string;
  /** Inclusive bounds the collector can step within. */
  minMonth?: string;
  maxMonth?: string;
  /** Shop-local today, `YYYY-MM-DD`, the grid marks; omit it and the calendar uses the reader's today. */
  today?: string;
  days: AsyncState<readonly BookingDay[]>;
  selectedDate?: string;
  slots: AsyncState<readonly BookingSlot[]>;
  selectedStart?: number;
  timeZone: string;
  /** The zone in the reader's words, e.g. `GMT+8`. */
  timeZoneLabel?: string;
  /**
   * `month` draws the month grid; `strip` the 14-day strip a phone reads;
   * `responsive` the grid from 760px and the strip below it.
   */
  layout?: "month" | "strip" | "responsive";
  /** The picked day's own hours, e.g. a card show: drawn over its times. */
  note?: ReactNode;
  /** Drawn in place of the times: the picked day is full or closed. */
  dayPanel?: ReactNode;
  /** The last line of the time column: how far ahead the service books. */
  footer?: ReactNode;
  /** Drawn first, over the heading: a time just taken. */
  notice?: ReactNode;
  onMonthChange: (month: string) => void;
  onSelectDay: (date: string) => void;
  onSelectSlot: (slot: BookingSlot) => void;
  className?: string;
};

type Part = keyof NonNullable<BookingSlotPickerCopy["parts"]>;

const PARTS: readonly Part[] = ["morning", "afternoon", "evening"];

function partOf(start: number, timeZone: string): Part {
  const hour = hourOf(new Date(start), timeZone);
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

/**
 * The step's heading, a month calendar (or a 14-day strip) next to the picked day's times grouped by part of the day.
 * Everything shown is what the consumer passed: the picker decides nothing
 * about the diary.
 */
function BookingSlotPicker({
  copy,
  month,
  minMonth,
  maxMonth,
  today,
  days,
  selectedDate,
  slots,
  selectedStart,
  timeZone,
  timeZoneLabel,
  layout = "month",
  note,
  dayPanel,
  footer,
  notice,
  locale = "en",
  onMonthChange,
  onSelectDay,
  onSelectSlot,
  className,
}: BookingSlotPickerProps) {
  const todayKey = today ?? dayFromDate(new Date());
  // The name a reader sees is the one in force at the times shown: the picked
  // slot, else the picked day, else the month being browsed.
  const labelInstant =
    selectedStart ??
    (selectedDate !== undefined
      ? dayInstant(selectedDate)
      : monthInstant(month));
  const zone = (
    <span
      className="text-xs whitespace-nowrap text-secondary-foreground"
      data-slot="booking-zone"
    >
      {copy.timesIn} {zoneLabel(timeZone, labelInstant, timeZoneLabel)}
    </span>
  );
  const dayName =
    selectedDate === undefined
      ? undefined
      : selectedDate === todayKey && copy.todayDay
        ? copy.todayDay.replace("{day}", formatWeekday(selectedDate, locale))
        : formatWeekday(selectedDate, locale);
  const calendarCopy: BookingDaysCopy = {
    previousMonth: copy.previousMonth,
    nextMonth: copy.nextMonth,
    heads: copy.heads,
    weekdays: copy.weekdays,
    full: copy.full,
    closed: copy.closed,
    today: copy.todayDay?.replace("{day}", "").replace(/[,，\s]+$/, ""),
    stripTitle: copy.stripTitle,
    earlierDays: copy.earlierDays,
    laterDays: copy.laterDays,
  };
  const calendar = (shape: "month" | "strip") => (
    <AsyncRegion skeletons={5} slot="booking-days" state={days}>
      {(list) => {
        const Days = shape === "strip" ? BookingDayStrip : BookingMonth;
        return (
          <Days
            copy={calendarCopy}
            days={list}
            locale={locale}
            maxMonth={maxMonth}
            minMonth={minMonth}
            month={month}
            onMonthChange={onMonthChange}
            onSelectDay={onSelectDay}
            selectedDate={selectedDate}
            today={todayKey}
          />
        );
      }}
    </AsyncRegion>
  );
  return (
    <section
      className={cn("flex flex-col gap-4", className)}
      data-slot="booking-slot-picker"
    >
      {notice}
      <h2 className={STEP_HEADING}>{copy.timeTitle}</h2>
      <div className="flex flex-wrap items-start gap-6">
        {layout === "strip" ? null : (
          <div
            className={cn(
              "min-w-0 flex-[1_1_300px]",
              layout === "responsive" && "hidden min-[760px]:block",
            )}
            data-slot="booking-day-picker"
          >
            {calendar("month")}
          </div>
        )}
        <div
          className="flex min-w-0 flex-[1_1_280px] flex-col gap-3"
          data-slot="booking-time-picker"
        >
          {layout === "month" ? null : (
            <div
              className={cn(layout === "responsive" && "min-[760px]:hidden")}
              data-slot={layout === "strip" ? "booking-day-picker" : undefined}
            >
              {calendar("strip")}
            </div>
          )}
          {dayName === undefined ? (
            <>
              {zone}
              <p
                className={cn(
                  "m-0 rounded-lg bg-muted p-3 text-sm leading-5",
                  INK_2,
                )}
              >
                {copy.pickADay}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[15px] leading-5 font-bold">
                  {dayName}
                </span>
                {zone}
              </div>
              {note ? (
                <p
                  className="m-0 rounded-lg bg-info/15 px-3 py-2 text-[13px] leading-[18px] text-(--blue-800) tabular-nums"
                  data-slot="booking-day-note"
                >
                  {note}
                </p>
              ) : null}
              {dayPanel ?? (
                <AsyncRegion skeletons={4} slot="booking-times" state={slots}>
                  {(list) =>
                    list.length === 0 ? (
                      <p
                        className={cn(
                          "m-0 rounded-lg bg-muted p-3 text-sm leading-5",
                          INK_2,
                        )}
                      >
                        {copy.noTimes}
                      </p>
                    ) : (
                      <Times
                        dayName={dayName}
                        list={list}
                        locale={locale}
                        onSelectSlot={onSelectSlot}
                        parts={copy.parts}
                        selectedStart={selectedStart}
                        timeZone={timeZone}
                      />
                    )
                  }
                </AsyncRegion>
              )}
            </>
          )}
          {footer ? (
            <p className="m-0 text-[13px] leading-[18px] text-secondary-foreground">
              {footer}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Times({
  list,
  parts,
  dayName,
  selectedStart,
  timeZone,
  locale,
  onSelectSlot,
}: {
  list: readonly BookingSlot[];
  parts: BookingSlotPickerCopy["parts"];
  dayName: string;
  selectedStart?: number;
  timeZone: string;
  locale: string;
  onSelectSlot: (slot: BookingSlot) => void;
}) {
  const chips = (group: readonly BookingSlot[]) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(84px,100%),1fr))] gap-2">
      {group.map((slot) => {
        const selected = selectedStart === slot.start;
        return (
          <button
            aria-pressed={selected}
            className={cn(
              "h-11 cursor-pointer rounded-lg text-[15px] font-semibold tabular-nums transition-[box-shadow,background-color] duration-100 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              selected
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground shadow-[inset_0_0_0_1px_var(--border-strong)] hover:shadow-[inset_0_0_0_1px_var(--foreground)]",
            )}
            key={slot.start}
            onClick={() => onSelectSlot(slot)}
            type="button"
          >
            {formatTimeOfDay(slot.start, { locale, timeZone })}
          </button>
        );
      })}
    </div>
  );
  if (!parts) {
    return (
      <fieldset aria-label={dayName} className="m-0 min-w-0 border-0 p-0">
        {chips(list)}
      </fieldset>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {PARTS.map((part) => {
        const group = list.filter(
          (slot) => partOf(slot.start, timeZone) === part,
        );
        if (group.length === 0) return null;
        return (
          // biome-ignore lint/a11y/useSemanticElements: a group of presses, not a form fieldset
          <div
            aria-label={parts[part]}
            className="flex flex-col gap-2"
            key={part}
            role="group"
          >
            <span
              className={cn("text-[13px] leading-[18px] font-semibold", INK_2)}
            >
              {parts[part]}
            </span>
            {chips(group)}
          </div>
        );
      })}
    </div>
  );
}

export type { BookingSlotPickerCopy, BookingSlotPickerProps };
export { BookingSlotPicker };
