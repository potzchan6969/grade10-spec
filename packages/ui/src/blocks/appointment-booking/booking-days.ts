import { formatWeekday } from "@grade10/date";
import type { BookingDay, BookingDayKind } from "./types";

/** Monday first, as the calendars read. */
type WeekdayWords = Readonly<
  Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", string>
>;

const WEEK = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

/** The words both day pickers share. */
type BookingDaysCopy = {
  previousMonth: string;
  nextMonth: string;
  /** The month's column heads: `Mo`, `Tu`. */
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

/** What both day pickers take: the month on show, its days and the pick. */
type BookingDaysProps = {
  copy: BookingDaysCopy;
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

function kindOf(day: BookingDay | undefined): BookingDayKind {
  if (!day) return "unavailable";
  return day.kind ?? (day.available ? "open" : "unavailable");
}

/** The word under a day's number: `Full`, `Closed`, or nothing. */
function dayWord(copy: BookingDaysCopy, kind: BookingDayKind) {
  if (kind === "full") return copy.full ?? "";
  if (kind === "closed") return copy.closed ?? "";
  return "";
}

/** A day's name for a screen reader: `Today, Monday 21 June, Closed`. */
function dayLabel(
  copy: BookingDaysCopy,
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

export type { BookingDaysCopy, BookingDaysProps, WeekdayWords };
export { dayLabel, dayWord, kindOf, WEEK };
