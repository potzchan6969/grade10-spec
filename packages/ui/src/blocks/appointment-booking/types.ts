import type { ReactNode } from "react";

/** The five picks of the flow, in the order the collector makes them. */
type BookingStep = "service" | "location" | "day" | "time" | "details";

/** One thing a service asks at booking; the label is the operator's words. */
type BookingQuestion = {
  id: string;
  label: string;
  kind: "text" | "choice";
  options?: readonly string[];
  required: boolean;
};

type BookingService = {
  id: string;
  slug: string;
  name: ReactNode;
  description?: ReactNode;
  /** Pre-formatted, e.g. `30 min`. */
  durationLabel: ReactNode;
  questions: readonly BookingQuestion[];
};

type BookingLocation = {
  id: string;
  slug: string;
  name: ReactNode;
  address: ReactNode;
  /** The IANA zone every time at this shop is read in. */
  timeZone: string;
};

/** One calendar day of the shop, `YYYY-MM-DD` in the shop's zone. */
type BookingDay = { date: string; available: boolean };

/** One offered start, as epoch milliseconds. */
type BookingSlot = { start: number; end: number; remaining: number };

/** Answers keyed by question id; an unanswered optional question is absent. */
type BookingAnswers = Readonly<Record<string, string>>;

/** What the details form hands back: trimmed, and nothing normalized beyond
 * that. An empty phone or notes is `""`. */
type BookingDetailsValues = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  answers: BookingAnswers;
};

type BookingRecordState = "booked" | "cancelled" | "completed" | "no_show";

/** One booking as a collector sees it. Only `booked` is live. */
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
  BookingAnswers,
  BookingDay,
  BookingDetailsValues,
  BookingLocation,
  BookingQuestion,
  BookingRecord,
  BookingRecordState,
  BookingService,
  BookingSlot,
  BookingStep,
};
