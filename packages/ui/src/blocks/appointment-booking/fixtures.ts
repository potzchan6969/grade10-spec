import { FIXTURE_TIME_ZONE } from "../../lib/datetime-fixtures";
import type { BookingConfirmationCopy } from "./booking-confirmation";
import type { BookingDetailsFormCopy } from "./booking-details-form";
import type { BookingLocationPickerCopy } from "./booking-location-picker";
import type { BookingManageCardCopy } from "./booking-manage-card";
import type { BookingServicePickerCopy } from "./booking-service-picker";
import type { BookingSlotPickerCopy } from "./booking-slot-picker";
import type { BookingSummaryCopy } from "./booking-summary";
import type {
  BookingDay,
  BookingLocation,
  BookingQuestion,
  BookingRecord,
  BookingRecordState,
  BookingService,
  BookingSlot,
} from "./types";

/** Hong Kong, September 2026: the calendar every fixture is drawn on. */
const FIXTURE_MONTH = "2026-09";
const FIXTURE_TIME_ZONE_LABEL = "Hong Kong time";
/** 1 Sep 2026 12:00 in Hong Kong. */
const FIXTURE_BOOKING_NOW_MS = Date.UTC(2026, 8, 1, 4, 0);

const STATE_LABELS: Record<BookingRecordState, string> = {
  booked: "Booked",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No show",
};

const FORMAT_QUESTION: BookingQuestion = {
  id: "format",
  label: "Is the card raw or slabbed?",
  kind: "choice",
  options: ["Raw", "Slabbed"],
  required: true,
};

const CARD_QUESTION: BookingQuestion = {
  id: "card",
  label: "Which card are you bringing?",
  kind: "text",
  required: false,
};

const GRADING_SERVICE: BookingService = {
  id: "svc_grading",
  slug: "grading",
  name: "Card grading",
  description: "Bring a card in and have it graded at the desk.",
  durationLabel: "30 min",
  questions: [FORMAT_QUESTION, CARD_QUESTION],
};

const VAULTING_SERVICE: BookingService = {
  id: "svc_vault_drop_off",
  slug: "vault-drop-off",
  name: "Vault drop-off",
  description:
    "Bring collectibles to vault. Staff register them at the counter.",
  durationLabel: "30 min",
  questions: [],
};

const CONSULTATION_SERVICE: BookingService = {
  id: "svc_consultation",
  slug: "consultation",
  name: "Collection consultation",
  description: "Talk through a collection with a specialist.",
  durationLabel: "60 min",
  questions: [],
};

/** Same shop as Store Locator / free pickup. */
const CAUSEWAY_BAY: BookingLocation = {
  id: "loc_causeway_bay",
  slug: "causeway-bay",
  name: "Hong Kong Grade10 Store",
  address: "13 Pak Sha Road, Causeway Bay, Hong Kong",
  timeZone: FIXTURE_TIME_ZONE,
};

/** Every day of the month, Sundays closed, nothing before the 2nd. */
const SEPTEMBER_DAYS: readonly BookingDay[] = Array.from(
  { length: 30 },
  (_, index) => {
    const day = index + 1;
    const date = `${FIXTURE_MONTH}-${String(day).padStart(2, "0")}`;
    const sunday = new Date(Date.UTC(2026, 8, day)).getUTCDay() === 0;
    return { date, available: day >= 2 && !sunday };
  },
);

/** 3 Sep 2026, 10:00 to 12:00 Hong Kong on a 15-minute grid, 11:00 taken. */
const THIRD_HKT_10 = Date.UTC(2026, 8, 3, 2, 0);
const SEPTEMBER_3_SLOTS: readonly BookingSlot[] = [
  0, 15, 30, 45, 75, 90, 105,
].map((minutes) => ({
  start: THIRD_HKT_10 + minutes * 60_000,
  end: THIRD_HKT_10 + (minutes + 30) * 60_000,
  remaining: 1,
}));

const LIVE_RECORD: BookingRecord = {
  id: "bk_live",
  service: "Card grading",
  location: "Hong Kong Grade10 Store",
  address: "13 Pak Sha Road, Causeway Bay, Hong Kong",
  timeZone: FIXTURE_TIME_ZONE,
  start: Date.UTC(2026, 8, 3, 2, 15),
  end: Date.UTC(2026, 8, 3, 2, 45),
  state: "booked",
};

const LATER_RECORD: BookingRecord = {
  ...LIVE_RECORD,
  id: "bk_later",
  service: "Collection consultation",
  start: Date.UTC(2026, 8, 10, 6, 0),
  end: Date.UTC(2026, 8, 10, 7, 0),
};

const COMPLETED_RECORD: BookingRecord = {
  ...LIVE_RECORD,
  id: "bk_done",
  start: Date.UTC(2026, 7, 24, 2, 0),
  end: Date.UTC(2026, 7, 24, 2, 30),
  state: "completed",
};

const CANCELLED_RECORD: BookingRecord = {
  ...LIVE_RECORD,
  id: "bk_cancelled",
  location: "Hong Kong Grade10 Store",
  address: "13 Pak Sha Road, Causeway Bay, Hong Kong",
  start: Date.UTC(2026, 8, 5, 3, 0),
  end: Date.UTC(2026, 8, 5, 3, 30),
  state: "cancelled",
};

const SERVICE_PICKER_COPY: BookingServicePickerCopy = {
  title: "What are you coming in for?",
};

const LOCATION_PICKER_COPY: BookingLocationPickerCopy = {
  title: "Shop",
};

const SLOT_PICKER_COPY: BookingSlotPickerCopy = {
  dayTitle: "Pick a day",
  timeTitle: "Pick a time",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  timesIn: "Times in",
  pickADay: "Pick a day to see its times.",
  noTimes: "Nothing is free on this day any more.",
};

const DETAILS_FORM_COPY: BookingDetailsFormCopy = {
  title: "Your details",
  name: "Name",
  email: "Email",
  phone: "Phone",
  notes: "Anything we should know?",
  notesHint: "For the desk — not an intake record.",
  optional: "optional",
  nameMissing: "Tell us your name.",
  emailMissing: "Tell us where to send the confirmation.",
  emailInvalid: "That doesn’t look like an email address.",
  answerMissing: "Pick one to continue.",
  submit: "Book the visit",
};

const SUMMARY_COPY: BookingSummaryCopy = {
  title: "Your visit",
  service: "Service",
  location: "Shop",
  when: "When",
};

const CONFIRMATION_COPY: BookingConfirmationCopy = {
  title: "You’re booked",
  body: "We’ve sent the details to your email, with a calendar file.",
  service: "Service",
  location: "Shop",
  when: "When",
  manage: "Move or cancel this visit",
  calendar: "Add to calendar",
};

const MANAGE_CARD_COPY: BookingManageCardCopy = {
  service: "Service",
  location: "Shop",
  when: "When",
  state: STATE_LABELS,
  move: "Move the visit",
  cancel: "Cancel the visit",
  cancelTitle: "Cancel this visit?",
  cancelBody: "The desk goes back to being free, and we’ll send you a note.",
  cancelConfirm: "Yes, cancel it",
  cancelKeep: "Keep it",
};

export {
  CANCELLED_RECORD,
  CARD_QUESTION,
  CAUSEWAY_BAY,
  COMPLETED_RECORD,
  CONFIRMATION_COPY,
  CONSULTATION_SERVICE,
  DETAILS_FORM_COPY,
  FIXTURE_BOOKING_NOW_MS,
  FIXTURE_MONTH,
  FIXTURE_TIME_ZONE_LABEL,
  FORMAT_QUESTION,
  GRADING_SERVICE,
  LATER_RECORD,
  LIVE_RECORD,
  LOCATION_PICKER_COPY,
  MANAGE_CARD_COPY,
  SEPTEMBER_3_SLOTS,
  SEPTEMBER_DAYS,
  SERVICE_PICKER_COPY,
  SLOT_PICKER_COPY,
  STATE_LABELS,
  SUMMARY_COPY,
  VAULTING_SERVICE,
};
