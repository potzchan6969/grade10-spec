import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Calendar } from "@grade10/design-system/components/forms/calendar";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { formatLocalTime } from "../../lib/format-datetime";
import type { AsyncState } from "../shared/async";
import { AsyncRegion } from "./async-region";
import { type LocaleProps, zoneLabel } from "./booking-copy";
import {
  dateFromDay,
  dateFromMonth,
  dayFromDate,
  monthFromDate,
} from "./calendar";
import type { BookingDay, BookingSlot } from "./types";

type BookingSlotPickerCopy = {
  dayTitle: string;
  timeTitle: string;
  previousMonth: string;
  nextMonth: string;
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
  /** The zone in the reader's words, e.g. `GMT+8`. */
  timeZoneLabel?: string;
  onMonthChange: (month: string) => void;
  onSelectDay: (date: string) => void;
  onSelectSlot: (slot: BookingSlot) => void;
  className?: string;
};

/**
 * A month calendar beside the picked day's times. Everything shown is what
 * the consumer passed: the picker decides nothing about the diary.
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
  return (
    <div
      className={cn(
        "grid gap-8 lg:grid-cols-[auto_minmax(12rem,22rem)] lg:items-start lg:justify-start",
        className,
      )}
      data-slot="booking-slot-picker"
    >
      <VStack data-slot="booking-day-picker" gap="sm" hAlign="start">
        <Text as="h2" size="lg" weight="medium">
          {copy.dayTitle}
        </Text>
        <AsyncRegion skeletons={5} slot="booking-days" state={days}>
          {(list) => (
            <SlotCalendar
              copy={copy}
              days={list}
              maxMonth={maxMonth}
              minMonth={minMonth}
              month={month}
              onMonthChange={onMonthChange}
              onSelectDay={onSelectDay}
              selectedDate={selectedDate}
            />
          )}
        </AsyncRegion>
      </VStack>
      <VStack data-slot="booking-time-picker" gap="sm" hAlign="stretch">
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
                <fieldset
                  aria-label={copy.timeTitle}
                  className="m-0 grid min-w-0 grid-cols-2 gap-2 border-0 p-0 sm:grid-cols-3"
                >
                  {list.map((slot) => {
                    const startLabel = formatLocalTime(slot.start, {
                      locale,
                      timeZone,
                    });
                    const selected = selectedStart === slot.start;
                    return (
                      <Button
                        aria-pressed={selected}
                        key={slot.start}
                        onClick={() => onSelectSlot(slot)}
                        className="w-full"
                        size="sm"
                        type="button"
                        variant={selected ? "default" : "outline"}
                      >
                        {startLabel}
                      </Button>
                    );
                  })}
                </fieldset>
              )
            }
          </AsyncRegion>
        )}
      </VStack>
    </div>
  );
}

function SlotCalendar({
  copy,
  days,
  month,
  minMonth,
  maxMonth,
  selectedDate,
  onMonthChange,
  onSelectDay,
}: {
  copy: BookingSlotPickerCopy;
  days: readonly BookingDay[];
  month: string;
  minMonth?: string;
  maxMonth?: string;
  selectedDate?: string;
  onMonthChange: (month: string) => void;
  onSelectDay: (date: string) => void;
}) {
  const available = new Set(
    days.filter((day) => day.available).map((day) => day.date),
  );
  return (
    <Calendar
      disabled={(date) => !available.has(dayFromDate(date))}
      endMonth={maxMonth ? dateFromMonth(maxMonth) : undefined}
      labels={{
        labelPrevious: () => copy.previousMonth,
        labelNext: () => copy.nextMonth,
      }}
      mode="single"
      month={dateFromMonth(month)}
      onMonthChange={(date) => onMonthChange(monthFromDate(date))}
      onSelect={(date) => {
        if (date) {
          onSelectDay(dayFromDate(date));
        }
      }}
      selected={selectedDate ? dateFromDay(selectedDate) : undefined}
      startMonth={minMonth ? dateFromMonth(minMonth) : undefined}
    />
  );
}

export type { BookingSlotPickerCopy, BookingSlotPickerProps };
export { BookingSlotPicker };
