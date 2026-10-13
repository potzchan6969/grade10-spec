/* The Book a visit board's cast and words: Hong Kong, Thu 15 Oct 2026 at
 * 14:20, three shops and four services. Money is in the collector's shape,
 * HK$100.00. */

import type {
  BookingDay,
  BookingDetailsFormCopy,
  BookingLocation,
  BookingQuestion,
  BookingService,
  BookingSlot,
  BookingSlotPickerCopy,
  BookingSummaryCopy,
} from "@grade10/ui";

const BOARD_ZONE = "Asia/Hong_Kong";
/** Shop-local today the calendar marks. */
const BOARD_TODAY = new Date(2026, 9, 15);
const BOARD_TODAY_KEY = "2026-10-15";
const BOARD_MIN_MONTH = "2026-10";
const BOARD_MAX_MONTH = "2026-12";

const ME = {
  name: "Alex Chan",
  email: "alex.chan@example.com",
  phone: "+85291234567",
};

const GRADE_FEE = "Grading fees from HK$[FEE] a card · pay at the counter";
const SLEEVES = "Bring the cards in sleeves.";
const VAULT_FEE = "Vault fees: [VAULT FEE]";
const PHOTO_ID = "Bring a photo ID.";

const COMPANY: BookingQuestion = {
  key: "company",
  label: "Grading company",
  kind: "select",
  options: ["PSA", "BGS", "CGC", "Grade10"],
  required: true,
  placeholder: "Choose a company",
};

const cards = (min: number, max: number, error: string): BookingQuestion => ({
  key: "cards",
  label: "How many cards?",
  kind: "number",
  required: true,
  hint: `${min} to ${max} cards.`,
  min,
  max,
  error,
});

type BoardService = BookingService & {
  group: "grading" | "vault";
  shops: readonly string[];
  /** What is charged at booking, worded for the summary and the pay box. */
  pay?: { line: string; amount: string; refund: string };
};

const BOARD_SERVICES: readonly BoardService[] = [
  {
    id: "drop",
    slug: "grading-drop-off",
    name: "Grading drop-off",
    group: "grading",
    durationLabel: "30 min",
    fit: "Choose this if you have fewer than 20 cards.",
    notes: [GRADE_FEE, SLEEVES],
    shops: ["central", "causeway-bay", "kowloon-bay"],
    questions: [
      cards(
        1,
        19,
        "Enter 1 to 19. For 20 or more, go back and choose Bulk grading drop-off.",
      ),
      COMPANY,
      {
        key: "sub",
        label: "Submission",
        kind: "short_text",
        required: false,
        hint: "Filled in when you book from a submission.",
      },
    ],
  },
  {
    id: "bulk",
    slug: "bulk-grading-drop-off",
    name: "Bulk grading drop-off",
    group: "grading",
    durationLabel: "45 min",
    fit: "Choose this if you have 20 to 100 cards.",
    charge: "Deposit HK$100.00",
    notes: [GRADE_FEE, SLEEVES],
    shops: ["central", "causeway-bay"],
    pay: {
      line: "HK$100.00 deposit at booking",
      amount: "HK$100.00 deposit",
      refund:
        "Refunded if you cancel at least 24 hours before, or if the shop cancels.",
    },
    questions: [
      cards(20, 100, "Enter 20 to 100. More than 100? Message us first."),
      COMPANY,
    ],
  },
  {
    id: "vin",
    slug: "vault-drop-off",
    name: "Vault drop-off",
    group: "vault",
    durationLabel: "30 min",
    fit: "Choose this to put graded cards, raw cards or sealed product in the vault.",
    charge: "HK$300.00",
    notes: [VAULT_FEE, PHOTO_ID],
    shops: ["central", "kowloon-bay"],
    pay: {
      line: "HK$300.00, paid at booking",
      amount: "HK$300.00",
      refund: "Refunded if the shop cancels.",
    },
    questions: [
      {
        key: "what",
        label: "What are you putting in?",
        kind: "checkboxes",
        options: ["Graded cards", "Raw cards", "Sealed product"],
        required: true,
      },
      {
        key: "case",
        label: "Case",
        kind: "short_text",
        required: false,
        hint: "If the items already have a vault case.",
      },
    ],
  },
  {
    id: "vout",
    slug: "vault-collection",
    name: "Vault collection",
    group: "vault",
    durationLabel: "30 min",
    fit: "Choose this to take items out of the vault.",
    notes: [VAULT_FEE, PHOTO_ID],
    shops: ["central", "kowloon-bay"],
    questions: [
      {
        key: "case",
        label: "Case",
        kind: "short_text",
        required: true,
        hint: "On your loan-due letter or case page.",
      },
    ],
  },
];

type BoardShop = BookingLocation & {
  mtr?: string;
  phone?: string;
  /** Earliest free start per service, worded and as a slot. */
  earliestAt: { label: string; date: string; time: string };
};

const BOARD_SHOPS: readonly BoardShop[] = [
  {
    id: "central",
    slug: "central",
    name: "Central",
    address: "2/F, 18 Queen’s Road Central",
    hours: "Open today 10:00 to 20:00",
    earliest: "Earliest: today, 16:30",
    mtr: "MTR Central exit D2",
    phone: "2345 6789",
    timeZone: BOARD_ZONE,
    earliestAt: { label: "today, 16:30", date: "2026-10-15", time: "16:30" },
  },
  {
    id: "causeway-bay",
    slug: "causeway-bay",
    name: "Causeway Bay",
    address: "",
    hours: "Open today 11:00 to 20:00",
    earliest: "Earliest: Fri 16 Oct, 11:00",
    timeZone: BOARD_ZONE,
    earliestAt: {
      label: "Fri 16 Oct, 11:00",
      date: "2026-10-16",
      time: "11:00",
    },
  },
  {
    id: "kowloon-bay",
    slug: "kowloon-bay",
    name: "Kowloon Bay",
    address: "",
    hours: "Open today 10:00 to 19:00",
    earliest: "Earliest: today, 17:00",
    timeZone: BOARD_ZONE,
    earliestAt: { label: "today, 17:00", date: "2026-10-15", time: "17:00" },
  },
];

const pad = (value: number) => String(value).padStart(2, "0");

/** A start on a Hong Kong day, `HH:mm` local. */
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

/** Central's diary: the 17th full, 2 to 4 Nov closed, 60 days ahead. */
function boardDays(month: string): readonly BookingDay[] {
  const [year, index] = month.split("-").map(Number);
  const count = new Date(Date.UTC(year ?? 0, index ?? 1, 0)).getUTCDate();
  return Array.from({ length: count }, (_, offset) => {
    const date = `${month}-${pad(offset + 1)}`;
    if (date < BOARD_TODAY_KEY || date > "2026-12-14") {
      return { date, available: false, kind: "unavailable" as const };
    }
    if (date === "2026-10-17") {
      return { date, available: false, kind: "full" as const };
    }
    if (date >= "2026-11-02" && date <= "2026-11-04") {
      return { date, available: false, kind: "closed" as const };
    }
    return { date, available: true, kind: "open" as const };
  });
}

/** One day's free starts: today's four, a card show's afternoon, a spread otherwise. */
function boardSlots(
  date: string,
  minutes: number,
  gone: readonly number[] = [],
): readonly BookingSlot[] {
  const times =
    date === BOARD_TODAY_KEY
      ? ["16:30", "17:00", "17:30", "19:30"]
      : date === "2026-10-24"
        ? ["12:00", "13:30", "15:00", "16:30"]
        : ["10:00", "11:30", "12:00", "14:00", "15:00", "16:30", "18:00"];
  return times
    .map((time) => hkSlot(date, time, minutes))
    .filter((slot) => !gone.includes(slot.start));
}

const SPECIAL_HOURS: Readonly<Record<string, string>> = {
  "2026-10-24": "Open 12:00 to 18:00 · Card show at the convention centre",
};

const SLOT_COPY: BookingSlotPickerCopy = {
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

const DETAILS_COPY: BookingDetailsFormCopy = {
  title: "Your details",
  name: "Name",
  email: "Email",
  phone: "Phone",
  phonePlaceholder: "+852 1234 5678",
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

const WORDS = {
  title: "Book a visit",
  steps: {
    service: "Service",
    location: "Shop",
    time: "Time",
    details: "Details",
  },
  stepsLabel: "Booking steps",
  doneAria: "Step {n}, {label}, done. Go back to it.",
  svcQ: "What do you need?",
  groups: { grading: "Grading", vault: "Vault" },
  more100: "More than 100 cards?",
  messageUs: "Message us first",
  shopQ: "Pick a shop",
  need: {
    service: "Choose a service to continue.",
    location: "Pick a shop to continue.",
    time: "Pick a time to continue.",
  },
  continue: "Continue",
  back: "Back",
  signedIn: `Signed in as ${ME.name}.`,
  notYou: "Not you?",
  signInLine: "Have an account? Sign in and we fill this in.",
  signIn: "Sign in",
  consent: "We use these details to run your visit and email you about it.",
  privacy: "Privacy policy",
  changeRule: "You can change or cancel until your visit starts.",
  forLabel: "For",
  payNow: "Pay now",
  payVia:
    "You pay on a secure Stripe page. Nothing is charged until you finish there.",
  payHold: "We hold this time for 30 minutes",
  payContinue: "Continue to payment",
  booking: "Booking…",
  stillTrying: "Booking… still trying",
  slowNote: "Keep this page open. We won’t book you twice.",
  aboutCards: "About your cards",
  aboutItems: "About your items",
  earliestEach: "Earliest at each shop",
  noFreeYet: "No free times yet",
  takenBody: "Pick another time. We kept your details.",
  confirmingPhase: "Confirming payment",
  confirmingTitle: "Confirming your payment",
  expiredTitle: "Payment not completed",
  expiredNote: "Book again to pick a time and pay.",
  bookAgain: "Book again",
} as const;

export type { BoardService, BoardShop };
export {
  BOARD_MAX_MONTH,
  BOARD_MIN_MONTH,
  BOARD_SERVICES,
  BOARD_SHOPS,
  BOARD_TODAY,
  BOARD_TODAY_KEY,
  BOARD_ZONE,
  boardDays,
  boardSlots,
  DETAILS_COPY,
  hkSlot,
  ME,
  SLOT_COPY,
  SPECIAL_HOURS,
  SUMMARY_COPY,
  WORDS,
};
