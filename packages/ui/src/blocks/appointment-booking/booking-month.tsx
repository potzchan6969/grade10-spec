import { formatMonthName } from "@grade10/date";
import { Calendar } from "@grade10/design-system/components/forms/calendar";
import {
  type BookingDaysProps,
  dayLabel,
  dayWord,
  kindOf,
  WEEK,
} from "./booking-days";
import {
  dateFromDay,
  dateFromMonth,
  dayFromDate,
  monthFromDate,
  monthInstant,
} from "./calendar";

/** The month on the design system's calendar, each day's word under its
 * number. Full and closed days still pick, to say why. */
function BookingMonth({
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
  const byDate = new Map(days.map((day) => [day.date, day]));
  const kindAt = (date: Date) => kindOf(byDate.get(dayFromDate(date)));
  return (
    <Calendar
      captionLayout="label"
      data-slot="booking-month"
      dayNote={(date) => dayWord(copy, kindAt(date))}
      disabled={(date) => kindAt(date) === "unavailable"}
      endMonth={maxMonth ? dateFromMonth(maxMonth) : undefined}
      formatters={{
        formatCaption: (date) =>
          formatMonthName(monthInstant(monthFromDate(date)), {
            locale,
            timeZone: "UTC",
          }),
        formatWeekdayName: (date) => {
          const key = WEEK[(date.getDay() + 6) % 7] ?? "mon";
          return copy.heads?.[key] ?? key.slice(0, 2);
        },
      }}
      labels={{
        labelDayButton: (date) =>
          dayLabel(copy, dayFromDate(date), kindAt(date), today, locale),
        labelNext: () => copy.nextMonth,
        labelPrevious: () => copy.previousMonth,
      }}
      mode="single"
      month={dateFromMonth(month)}
      onMonthChange={(date) => onMonthChange(monthFromDate(date))}
      onSelect={(date) => onSelectDay(dayFromDate(date))}
      required
      selected={selectedDate ? dateFromDay(selectedDate) : undefined}
      showOutsideDays={false}
      startMonth={minMonth ? dateFromMonth(minMonth) : undefined}
      today={dateFromDay(today)}
      weekStartsOn={1}
    />
  );
}

export { BookingMonth };
