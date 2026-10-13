import type { ReactNode } from "react";

/** The six kinds a service may ask. */
type BookingQuestionKind =
  | "short_text"
  | "long_text"
  | "number"
  | "select"
  | "radio"
  | "checkboxes";

/** One thing a service asks at booking; the label is the operator's words. */
type BookingQuestion = {
  key: string;
  label: string;
  kind: BookingQuestionKind;
  /** The values an answer may take, in order; what is stored and reported. */
  options?: readonly string[];
  /** The text shown for an option value, where it differs from the value. */
  optionLabels?: Readonly<Record<string, string>>;
  required: boolean;
  placeholder?: string;
  /** The line under the label, e.g. `1 to 19 cards.` */
  hint?: string;
  /** Bounds a number answer may take, inclusive. */
  min?: number;
  max?: number;
  /** What an answer out of bounds, or a required one left empty, is told. */
  error?: string;
  /** Uneditable text before a number, e.g. `$`. */
  prefix?: string;
};

type BookingService = {
  id: string;
  slug: string;
  name: ReactNode;
  description?: ReactNode;
  /** Pre-formatted, e.g. `30 min`. */
  durationLabel: ReactNode;
  /** Who it suits: `Choose this if you have fewer than 20 cards.` */
  fit?: ReactNode;
  /** What is charged at booking, worded: `Deposit HK$100.00`. */
  charge?: ReactNode;
  /** The price and bring lines under the card's rule, one each. */
  notes?: readonly ReactNode[];
  questions: readonly BookingQuestion[];
};

type BookingLocation = {
  id: string;
  slug: string;
  name: ReactNode;
  address: ReactNode;
  /** Today's hours, worded: `Open today 10:00 to 20:00`. */
  hours?: ReactNode;
  /** The earliest free time, worded: `Earliest: today, 16:30`. */
  earliest?: ReactNode;
  /** The IANA zone every time at this shop is read in. */
  timeZone: string;
};

/** How a day reads on the calendar: free times, all taken, the shop shut, or
 * out of reach (past, beyond the horizon, inside the notice). Full and closed
 * days can still be picked, to say so and point elsewhere. */
type BookingDayKind = "open" | "full" | "closed" | "unavailable";

/** One calendar day of the shop, `YYYY-MM-DD` in the shop's zone. `kind`
 * wins over `available` when given; without it an available day is open and
 * any other is out of reach. */
type BookingDay = { date: string; available: boolean; kind?: BookingDayKind };

/** One offered start, as epoch milliseconds. */
type BookingSlot = { start: number; end: number; remaining: number };

/** Answers keyed by question key, a list for checkboxes; an unanswered
 * optional question is absent. */
type BookingAnswers = Readonly<Record<string, string | readonly string[]>>;

/** One answer as the confirmation shows it, under the label it was asked by. */
type BookingAnswerLine = {
  key: string;
  label: string;
  answer: string | readonly string[];
};

/** What the details form hands back: trimmed, and nothing normalized beyond
 * that. An empty phone or notes is `""`. Phone is E.164 when parseable. */
type BookingDetailsValues = {
  name: string;
  email: string;
  phone: string;
  phoneCountry: string;
  notes: string;
  answers: BookingAnswers;
  /** Who comes in, when the collector books for someone else. */
  bookedFor?: string;
};

type BookingRecordState =
  | "booked"
  | "checked_in"
  | "cancelled"
  | "completed"
  | "no_show";

/** One booking as a collector sees it. Only `booked` can still be changed. */
type BookingRecord = {
  id: string;
  service: ReactNode;
  location: ReactNode;
  address: ReactNode;
  timeZone: string;
  start: number;
  end: number;
  state: BookingRecordState;
};

export type {
  BookingAnswerLine,
  BookingAnswers,
  BookingDay,
  BookingDayKind,
  BookingDetailsValues,
  BookingLocation,
  BookingQuestion,
  BookingQuestionKind,
  BookingRecord,
  BookingRecordState,
  BookingService,
  BookingSlot,
};
