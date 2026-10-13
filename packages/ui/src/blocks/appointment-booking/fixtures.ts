import { FIXTURE_TIME_ZONE } from "../../lib/datetime-fixtures";
import type { BookingConfirmationCopy } from "./booking-confirmation";
import type { BookingDetailsFormCopy } from "./booking-details-form";
import type { BookingLocationPickerCopy } from "./booking-location-picker";
import type { BookingManageCardCopy } from "./booking-manage-card";
import type { BookingServicePickerCopy } from "./booking-service-picker";
import type { BookingSlotPickerCopy } from "./booking-slot-picker";
import type { BookingSummaryCopy } from "./booking-summary";
import type {
  BookingAnswerLine,
  BookingDay,
  BookingLocation,
  BookingQuestion,
  BookingRecord,
  BookingRecordState,
  BookingService,
  BookingSlot,
} from "./types";
import {
  CONSULTATION_QUESTIONS,
  GRADING_QUESTIONS,
  VAULT_DROP_OFF_QUESTIONS,
} from "./visit-questions";

/** Hong Kong, September 2026: the calendar every fixture is drawn on. */
const FIXTURE_MONTH = "2026-09";
/** 1 Sep 2026 12:00 in Hong Kong. */
const FIXTURE_BOOKING_NOW_MS = Date.UTC(2026, 8, 1, 4, 0);

const STATE_LABELS: Record<BookingRecordState, string> = {
  booked: "Booked",
  checked_in: "Checked in",
  cancelled: "Cancelled",
  completed: "Visited",
  no_show: "Missed",
};

/** One question of each kind, for the form that draws all six. */
const ALL_KINDS_QUESTIONS: readonly BookingQuestion[] = [
  {
    key: "tag",
    label: "Collector tag",
    kind: "short_text",
    required: false,
    placeholder: "Collector tag",
  },
  {
    key: "story",
    label: "Story",
    kind: "long_text",
    required: false,
    placeholder: "Tell us more",
  },
  {
    key: "value",
    label: "Value",
    kind: "number",
    required: false,
    placeholder: "10,000",
  },
  {
    key: "size",
    label: "Size",
    kind: "select",
    options: ["small", "large"],
    optionLabels: { small: "Small", large: "Large" },
    required: false,
    placeholder: "Pick a size",
  },
  {
    key: "handover",
    label: "Handover",
    kind: "radio",
    options: ["pickup", "dropoff"],
    optionLabels: { pickup: "Pickup", dropoff: "Drop-off" },
    required: false,
  },
  {
    key: "bring",
    label: "Bringing",
    kind: "checkboxes",
    options: ["sleeves", "binder", "id"],
    optionLabels: { sleeves: "Sleeves", binder: "Binder", id: "Photo ID" },
    required: false,
  },
];

const GRADING_SERVICE: BookingService = {
  id: "svc_grading",
  slug: "grading",
  name: "Grading Submission",
  description: "Tell us a bit about the items you plan to submit for grading.",
  durationLabel: "30 min",
  questions: GRADING_QUESTIONS,
};

const VAULTING_SERVICE: BookingService = {
  id: "svc_vault_drop_off",
  slug: "vault-drop-off",
  name: "Vault Drop-Off",
  description: "Help us prepare for your item intake and security logging.",
  durationLabel: "30 min",
  questions: VAULT_DROP_OFF_QUESTIONS,
};

const CONSULTATION_SERVICE: BookingService = {
  id: "svc_consultation",
  slug: "consultation",
  name: "Store/Auction Listing",
  description:
    "Let us know what you would like to discuss with our specialists.",
  durationLabel: "60 min",
  questions: CONSULTATION_QUESTIONS,
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
  service: "Grading Submission",
  location: "Hong Kong Grade10 Store",
  address: "13 Pak Sha Road, Causeway Bay, Hong Kong",
  timeZone: FIXTURE_TIME_ZONE,
  start: Date.UTC(2026, 8, 3, 2, 15),
  end: Date.UTC(2026, 8, 3, 2, 45),
  state: "booked",
};

const CHECKED_IN_RECORD: BookingRecord = {
  ...LIVE_RECORD,
  id: "bk_checked_in",
  state: "checked_in",
};

/** What the grading service's live booking was answered with. */
const LIVE_ANSWERS: readonly BookingAnswerLine[] = [
  { key: "company", label: "Preferred grading company", answer: "PSA" },
  { key: "bring", label: "Bringing", answer: ["Sleeves", "Binder"] },
];

const LATER_RECORD: BookingRecord = {
  ...LIVE_RECORD,
  id: "bk_later",
  service: "Store/Auction Listing",
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

/** The board's cast: Hong Kong, Thu 15 Oct 2026 at 14:20. */
const BOARD_NOW_MS = Date.UTC(2026, 9, 15, 6, 20);
/** Shop-local today the calendar marks. */
const BOARD_TODAY = new Date(2026, 9, 15);
const BOARD_MONTH = "2026-10";

const GRADE_FEE = "Grading fees from HK$[FEE] a card · pay at the counter";
const SLEEVES = "Bring the cards in sleeves.";
const VAULT_FEE = "Vault fees: [VAULT FEE]";
const PHOTO_ID = "Bring a photo ID.";

const BOARD_GRADING_QUESTIONS: readonly BookingQuestion[] = [
  {
    key: "cards",
    label: "How many cards?",
    kind: "number",
    required: true,
    hint: "1 to 19 cards.",
    min: 1,
    max: 19,
    error:
      "Enter 1 to 19. For 20 or more, go back and choose Bulk grading drop-off.",
  },
  {
    key: "company",
    label: "Grading company",
    kind: "select",
    options: ["PSA", "BGS", "CGC", "Grade10"],
    required: true,
    placeholder: "Choose a company",
  },
  {
    key: "sub",
    label: "Submission",
    kind: "short_text",
    required: false,
    hint: "Filled in when you book from a submission.",
  },
];

const BOARD_SERVICES: readonly BookingService[] = [
  {
    id: "svc_drop",
    slug: "grading-drop-off",
    name: "Grading drop-off",
    durationLabel: "30 min",
    fit: "Choose this if you have fewer than 20 cards.",
    notes: [GRADE_FEE, SLEEVES],
    questions: BOARD_GRADING_QUESTIONS,
  },
  {
    id: "svc_bulk",
    slug: "bulk-grading-drop-off",
    name: "Bulk grading drop-off",
    durationLabel: "45 min",
    fit: "Choose this if you have 20 to 100 cards.",
    charge: "Deposit HK$100.00",
    notes: [GRADE_FEE, SLEEVES],
    questions: BOARD_GRADING_QUESTIONS.slice(0, 2),
  },
];

const BOARD_VAULT_SERVICES: readonly BookingService[] = [
  {
    id: "svc_vault_in",
    slug: "vault-drop-off",
    name: "Vault drop-off",
    durationLabel: "30 min",
    fit: "Choose this to put graded cards, raw cards or sealed product in the vault.",
    charge: "HK$300.00",
    notes: [VAULT_FEE, PHOTO_ID],
    questions: [],
  },
  {
    id: "svc_vault_out",
    slug: "vault-collection",
    name: "Vault collection",
    durationLabel: "30 min",
    fit: "Choose this to take items out of the vault.",
    notes: [VAULT_FEE, PHOTO_ID],
    questions: [],
  },
];

const BOARD_SHOPS: readonly BookingLocation[] = [
  {
    id: "loc_central",
    slug: "central",
    name: "Central",
    address: "2/F, 18 Queen’s Road Central",
    hours: "Open today 10:00 to 20:00",
    earliest: "Earliest: today, 16:30",
    timeZone: FIXTURE_TIME_ZONE,
  },
  {
    id: "loc_causeway_bay",
    slug: "causeway-bay",
    name: "Causeway Bay",
    address: "",
    hours: "Open today 11:00 to 20:00",
    earliest: "Earliest: Fri 16 Oct, 11:00",
    timeZone: FIXTURE_TIME_ZONE,
  },
  {
    id: "loc_kowloon_bay",
    slug: "kowloon-bay",
    name: "Kowloon Bay",
    address: "",
    hours: "Open today 10:00 to 19:00",
    earliest: "Earliest: today, 17:00",
    timeZone: FIXTURE_TIME_ZONE,
  },
];

/** October at Central: nothing before today, the 17th full, Sundays open. */
const OCTOBER_DAYS: readonly BookingDay[] = Array.from(
  { length: 31 },
  (_, index) => {
    const day = index + 1;
    const date = `2026-10-${String(day).padStart(2, "0")}`;
    if (day < 15) return { date, available: false, kind: "unavailable" };
    if (day === 17) return { date, available: false, kind: "full" };
    if (day === 28) return { date, available: false, kind: "closed" };
    return { date, available: true, kind: "open" };
  },
);

/** One free start on a Hong Kong day, `HH:mm` local. */
function hkSlot(date: string, time: string, minutes = 30): BookingSlot {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const start = Date.UTC(
    year ?? 0,
    (month ?? 1) - 1,
    day ?? 1,
    (hour ?? 0) - 8,
    minute ?? 0,
  );
  return { start, end: start + minutes * 60_000, remaining: 1 };
}

/** Today at Central: four starts left. */
const TODAY_SLOTS: readonly BookingSlot[] = [
  "16:30",
  "17:00",
  "17:30",
  "19:30",
].map((time) => hkSlot("2026-10-15", time));

/** Thu 22 Oct at Central: morning, afternoon and evening starts. */
const THURSDAY_SLOTS: readonly BookingSlot[] = [
  "10:00",
  "11:30",
  "12:00",
  "14:00",
  "15:00",
  "16:30",
  "18:00",
  "19:00",
].map((time) => hkSlot("2026-10-22", time));

const SERVICE_PICKER_COPY: BookingServicePickerCopy = {
  title: "Choose a Service",
};

const LOCATION_PICKER_COPY: BookingLocationPickerCopy = {
  title: "Shop",
};

const SLOT_PICKER_COPY: BookingSlotPickerCopy = {
  timeTitle: "Pick a time",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  timesIn: "Times in",
  pickADay: "Pick a day to see its free times.",
  noTimes: "Nothing is free on this day any more.",
  heads: {
    mon: "Mo",
    tue: "Tu",
    wed: "We",
    thu: "Th",
    fri: "Fr",
    sat: "Sa",
    sun: "Su",
  },
  weekdays: {
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",
  },
  full: "Full",
  closed: "Closed",
  todayDay: "Today, {day}",
  stripTitle: "{from} to {to}",
  earlierDays: "Earlier days",
  laterDays: "Later days",
  parts: { morning: "Morning", afternoon: "Afternoon", evening: "Evening" },
};

const DETAILS_FORM_COPY: BookingDetailsFormCopy = {
  title: "Your details",
  name: "Name",
  email: "Email",
  phone: "Phone",
  phonePlaceholder: "+852 12345678",
  countrySearchPlaceholder: "e.g. United States",
  emailHint: "We send the confirmation here.",
  phoneHint: "So the shop can reach you on the day.",
  phoneRequiredHint: "The shop calls before this visit.",
  notes: "Notes",
  notesHint: "Anything the shop should know.",
  optional: "optional",
  nameMissing: "Enter your name.",
  emailMissing: "Enter an email like name@example.com.",
  emailInvalid: "Enter an email like name@example.com.",
  phoneMissing: "Enter the whole phone number.",
  phoneRequired: "Add a phone number. The shop calls before this visit.",
  bookingAs: "Booking as",
  answerMissing: "This is needed to continue.",
  chooseOne: "Choose at least one.",
  chooseX: "Choose a {label}.",
  choose: "Choose",
  submit: "Book",
  forOther: {
    label: "I’m booking for someone else",
    name: "Their name",
    hint: "We email the pass to you. Forward it to them.",
    missing: "Enter their name.",
  },
};

const SUMMARY_COPY: BookingSummaryCopy = {
  title: "Your visit",
  service: "Service",
  location: "Shop",
  when: "Time",
  notChosen: "Not chosen yet",
  change: "Change",
  changeAria: "Change {what}",
  span: "{day}, {from} to {to}",
};

const CONFIRMATION_COPY: BookingConfirmationCopy = {
  title: "You’re booked",
  body: "We’ve sent the details to your email, with a calendar file.",
  service: "Service",
  location: "Shop",
  when: "When",
  beforeYouCome: "Before you come",
  answers: "What you told us",
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
  ALL_KINDS_QUESTIONS,
  BOARD_GRADING_QUESTIONS,
  BOARD_MONTH,
  BOARD_NOW_MS,
  BOARD_SERVICES,
  BOARD_SHOPS,
  BOARD_TODAY,
  BOARD_VAULT_SERVICES,
  CANCELLED_RECORD,
  CAUSEWAY_BAY,
  CHECKED_IN_RECORD,
  COMPLETED_RECORD,
  CONFIRMATION_COPY,
  CONSULTATION_SERVICE,
  DETAILS_FORM_COPY,
  FIXTURE_BOOKING_NOW_MS,
  FIXTURE_MONTH,
  GRADING_SERVICE,
  hkSlot,
  LATER_RECORD,
  LIVE_ANSWERS,
  LIVE_RECORD,
  LOCATION_PICKER_COPY,
  MANAGE_CARD_COPY,
  OCTOBER_DAYS,
  SEPTEMBER_3_SLOTS,
  SEPTEMBER_DAYS,
  SERVICE_PICKER_COPY,
  SLOT_PICKER_COPY,
  STATE_LABELS,
  SUMMARY_COPY,
  THURSDAY_SLOTS,
  TODAY_SLOTS,
  VAULTING_SERVICE,
};
