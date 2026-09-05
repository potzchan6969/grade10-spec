import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { formatLocalTime, intlLocale } from "../../lib/format-datetime";
import type { AsyncState } from "../shared/async";
import { AsyncRegion } from "./async-region";
import { type LocaleProps, zoneLabel } from "./booking-copy";
import {
  datesOf,
  dayOf,
  monthInstant,
  shiftMonth,
  weekdayOf,
} from "./calendar";
import type { BookingDay, BookingSlot } from "./types";

type BookingSlotPickerCopy = {
  dayTitle: string;
  timeTitle: string;
  previousMonth: string;
  nextMonth: string;
  /** Seven labels, Monday first. */
  weekdays: readonly [string, string, string, string, string, string, string];
  /** Precedes the zone name: `Times in`. */
  timesIn: string;
  /** Shown in the time column before a day is picked. */
  pickADay: string;
  /** Shown when the picked day's list came back with nothing in it. */
  noTimes: string;
};

type BookingSlotPickerProps = LocaleProps & {
  copy: BookingSlotPickerCopy;
  /** `YYYY-MM` in the shop's calendar. */
  month: string;
  /** Inclusive bounds the collector can step within. */
  minMonth?: string;
  maxMonth?: string;
  days: AsyncState<readonly BookingDay[]>;
  selectedDate?: string;
  slots: AsyncState<readonly BookingSlot[]>;
  selectedStart?: number;
  timeZone: string;
  /** The zone in the reader's words, e.g. `Hong Kong time`. */
  timeZoneLabel?: string;
  onMonthChange: (month: string) => void;
  onSelectDay: (date: string) => void;
  onSelectSlot: (slot: BookingSlot) => void;
  className?: string;
};

const CELL_CLASS = "size-10 p-0 text-sm";

/** How far the first day sits from Monday, as grid columns. */
const LEADING_SPAN = [
  "",
  "col-span-1",
  "col-span-2",
  "col-span-3",
  "col-span-4",
  "col-span-5",
  "col-span-6",
] as const;

/**
 * A month of the shop's days, marked available or not, and the picked day's
 * times in the shop's zone. Everything shown is what the consumer passed:
 * the picker decides nothing about the diary.
 */
function BookingSlotPicker({
  copy,
  month,
  minMonth,
  maxMonth,
  days,
  selectedDate,
  slots,
  selectedStart,
  timeZone,
  timeZoneLabel,
  locale = "en",
  onMonthChange,
  onSelectDay,
  onSelectSlot,
  className,
}: BookingSlotPickerProps) {
  const monthName = new Intl.DateTimeFormat(intlLocale(locale), {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(monthInstant(month));
  const canStepBack = minMonth === undefined || month > minMonth;
  const canStepForward = maxMonth === undefined || month < maxMonth;

  return (
    <div
      className={cn("grid gap-6 md:grid-cols-[auto_1fr]", className)}
      data-slot="booking-slot-picker"
    >
      <VStack data-slot="booking-day-picker" gap="sm">
        <Text as="h2" size="lg" weight="medium">
          {copy.dayTitle}
        </Text>
        <HStack className="w-full" hAlign="space-between" vAlign="center">
          <IconButton
            aria-label={copy.previousMonth}
            disabled={!canStepBack}
            onClick={() => onMonthChange(shiftMonth(month, -1))}
            type="button"
          >
            <CaretLeft />
          </IconButton>
          <Text as="span" data-slot="booking-month" weight="medium">
            {monthName}
          </Text>
          <IconButton
            aria-label={copy.nextMonth}
            disabled={!canStepForward}
            onClick={() => onMonthChange(shiftMonth(month, 1))}
            type="button"
          >
            <CaretRight />
          </IconButton>
        </HStack>
        <AsyncRegion skeletons={5} slot="booking-days" state={days}>
          {(list) => (
            <MonthGrid
              days={list}
              month={month}
              onSelectDay={onSelectDay}
              selectedDate={selectedDate}
              weekdays={copy.weekdays}
            />
          )}
        </AsyncRegion>
      </VStack>
      <VStack data-slot="booking-time-picker" gap="sm">
        <Text as="h2" size="lg" weight="medium">
          {copy.timeTitle}
        </Text>
        <Text as="span" data-slot="booking-zone" size="sm" tone="secondary">
          {copy.timesIn} {zoneLabel(timeZone, timeZoneLabel)}
        </Text>
        {selectedDate === undefined ? (
          <Text as="span" size="sm" tone="muted">
            {copy.pickADay}
          </Text>
        ) : (
          <AsyncRegion skeletons={4} slot="booking-times" state={slots}>
            {(list) =>
              list.length === 0 ? (
                <Text as="span" size="sm" tone="muted">
                  {copy.noTimes}
                </Text>
              ) : (
                <div
                  className="grid grid-cols-3 gap-2"
                  data-slot="booking-times"
                >
                  {list.map((slot) => (
                    <Button
                      aria-pressed={slot.start === selectedStart}
                      data-slot="booking-time"
                      key={slot.start}
                      onClick={() => onSelectSlot(slot)}
                      size="sm"
                      type="button"
                      variant={
                        slot.start === selectedStart ? "default" : "outline"
                      }
                    >
                      {formatLocalTime(slot.start, { locale, timeZone })}
                    </Button>
                  ))}
                </div>
              )
            }
          </AsyncRegion>
        )}
      </VStack>
    </div>
  );
}

function MonthGrid({
  month,
  days,
  selectedDate,
  weekdays,
  onSelectDay,
}: {
  month: string;
  days: readonly BookingDay[];
  selectedDate?: string;
  weekdays: BookingSlotPickerCopy["weekdays"];
  onSelectDay: (date: string) => void;
}) {
  const available = new Set(
    days.filter((day) => day.available).map((day) => day.date),
  );
  const dates = datesOf(month);
  const leading = weekdayOf(dates[0] ?? `${month}-01`);
  return (
    <div className="grid grid-cols-7 gap-1" data-slot="booking-month-grid">
      {weekdays.map((label) => (
        <Text
          as="span"
          className="text-center"
          key={label}
          size="xs"
          tone="secondary"
        >
          {label}
        </Text>
      ))}
      {leading > 0 ? (
        <span aria-hidden className={LEADING_SPAN[leading]} />
      ) : null}
      {dates.map((date) => {
        const selected = date === selectedDate;
        const open = available.has(date);
        return (
          <Button
            aria-pressed={selected}
            className={CELL_CLASS}
            data-available={open}
            data-slot="booking-day"
            disabled={!open}
            key={date}
            onClick={() => onSelectDay(date)}
            size="sm"
            type="button"
            variant={selected ? "default" : open ? "outline" : "ghost"}
          >
            {dayOf(date)}
          </Button>
        );
      })}
    </div>
  );
}

export type { BookingSlotPickerCopy, BookingSlotPickerProps };
export { BookingSlotPicker };
