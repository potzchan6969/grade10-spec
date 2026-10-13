import type {
  BookingDay,
  BookingLocation,
  BookingRecord,
  BookingSlot,
} from "@grade10/ui";

/** The manual page these wireframes settle, under grade10-site. */
export const DROP_OFF_MANUAL_PATH = "grading/drop-off";

/** The states of Book the drop-off, in the order a collector walks them. */
export type DropOffBookState =
  | "statement"
  | "lead"
  | "bulk-lead"
  | "shop"
  | "days"
  | "batch-line"
  | "batch-line-past-cut-off"
  | "times"
  | "nothing-free"
  | "diary-refuses"
  | "joins-visit"
  | "slot-resized";

/** The states of Drop-off booked. */
export type DropOffBookedState =
  | "booked"
  | "bulk"
  | "fee-with-cover"
  | "cards-leave"
  | "vault-line"
  | "joined"
  | "visit-detached"
  | "moved";

export const DROP_OFF_BOOK_STORY_IDS = {
  statement: "grading-drop-off-prototypes-book-drop-off--statement-unticked",
  lead: "grading-drop-off-prototypes-book-drop-off--lead",
  "bulk-lead": "grading-drop-off-prototypes-book-drop-off--bulk-lead",
  shop: "grading-drop-off-prototypes-book-drop-off--shop",
  days: "grading-drop-off-prototypes-book-drop-off--days",
  "batch-line": "grading-drop-off-prototypes-book-drop-off--batch-line",
  "batch-line-past-cut-off":
    "grading-drop-off-prototypes-book-drop-off--batch-line-past-the-cut-off",
  times: "grading-drop-off-prototypes-book-drop-off--times",
  "nothing-free": "grading-drop-off-prototypes-book-drop-off--nothing-free",
  "diary-refuses":
    "grading-drop-off-prototypes-book-drop-off--the-diary-refuses",
  "joins-visit": "grading-drop-off-prototypes-book-drop-off--joins-visit",
  "slot-resized": "grading-drop-off-prototypes-book-drop-off--slot-resized",
} as const satisfies Record<DropOffBookState, string>;

export const DROP_OFF_BOOKED_STORY_IDS = {
  booked: "grading-drop-off-prototypes-drop-off-booked--booked",
  bulk: "grading-drop-off-prototypes-drop-off-booked--bulk",
  "fee-with-cover":
    "grading-drop-off-prototypes-drop-off-booked--fee-with-cover",
  "cards-leave":
    "grading-drop-off-prototypes-drop-off-booked--the-day-the-cards-leave",
  "vault-line": "grading-drop-off-prototypes-drop-off-booked--vault-line",
  joined: "grading-drop-off-prototypes-drop-off-booked--joined",
  "visit-detached":
    "grading-drop-off-prototypes-drop-off-booked--visit-detached",
  moved: "grading-drop-off-prototypes-drop-off-booked--moved",
} as const satisfies Record<DropOffBookedState, string>;

/** Where the list is opened: the submission's own wireframe. */
export const DROP_OFF_OPEN_LIST_STORY_ID =
  "grading-submission-prototypes-submission--booked";

export const DROP_OFF_TIME_ZONE = "Asia/Hong_Kong";
export const DROP_OFF_TIME_ZONE_LABEL = "Hong Kong time (GMT+8)";
/** Shop-local today the calendar is drawn on. */
export const DROP_OFF_TODAY = "2026-10-13";
export const DROP_OFF_MIN_MONTH = "2026-10";
export const DROP_OFF_MAX_MONTH = "2026-11";
/** Thirty days from today, the service's horizon. */
const DROP_OFF_HORIZON = "2026-11-12";
/** Shop-local day with nothing free: the calendar shows it disabled. */
const FULL_DAY = "2026-10-27";

function ymd(year: number, monthIndex: number, day: number): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

/** Days of October and November 2026; Sundays and the full day are not free. */
export const DROP_OFF_DAYS: readonly BookingDay[] = (() => {
  const days: BookingDay[] = [];
  for (const monthIndex of [9, 10]) {
    const count = new Date(Date.UTC(2026, monthIndex + 1, 0)).getUTCDate();
    for (let day = 1; day <= count; day += 1) {
      const date = ymd(2026, monthIndex, day);
      const sunday =
        new Date(Date.UTC(2026, monthIndex, day)).getUTCDay() === 0;
      days.push({
        date,
        available:
          !sunday &&
          date > "2026-10-13" &&
          date <= DROP_OFF_HORIZON &&
          date !== FULL_DAY,
      });
    }
  }
  return days;
})();

/** Epoch milliseconds for a shop-local day and minute past its midnight. */
export function shopMoment(date: string, minutesPastMidnight: number): number {
  const [year, month, day] = date.split("-").map(Number);
  return (
    Date.UTC(year, month - 1, day) -
    8 * 3_600_000 +
    minutesPastMidnight * 60_000
  );
}

const SLOT_MINUTES = [600, 630, 660, 840, 870];

/** The day's free starts, each `length` minutes long. */
export function dropOffSlots(
  date: string,
  length = 20,
): readonly BookingSlot[] {
  return SLOT_MINUTES.map((minutes) => {
    const start = shopMoment(date, minutes);
    return { start, end: start + length * 60_000, remaining: 1 };
  });
}

export const DROP_OFF_SHOP: BookingLocation = {
  id: "loc_causeway_bay",
  slug: "causeway-bay",
  name: "Hong Kong Grade10 Store",
  address: "13 Pak Sha Road, Causeway Bay, Hong Kong",
  timeZone: DROP_OFF_TIME_ZONE,
};

/** The list's visit: Tuesday 20 October at 10:00, about 20 minutes. */
export const DROP_OFF_VISIT: BookingRecord = {
  id: "bk_drop_off",
  service: "Grading drop-off",
  location: DROP_OFF_SHOP.name,
  address: DROP_OFF_SHOP.address,
  timeZone: DROP_OFF_TIME_ZONE,
  start: shopMoment("2026-10-20", 600),
  end: shopMoment("2026-10-20", 620),
  state: "booked",
};

export const DROP_OFF_BULK_VISIT: BookingRecord = {
  ...DROP_OFF_VISIT,
  id: "bk_drop_off_bulk",
  service: "Bulk drop-off",
  end: shopMoment("2026-10-20", 645),
};

export const DROP_OFF_MOVED_VISIT: BookingRecord = {
  ...DROP_OFF_VISIT,
  id: "bk_drop_off_moved",
  start: shopMoment("2026-10-22", 840),
  end: shopMoment("2026-10-22", 860),
};

/** Shown as "now" so the manage card reads the visit as still ahead. */
export const DROP_OFF_NOW = Date.UTC(2026, 9, 13);

export const DROP_OFF_COPY = {
  statement: {
    title: "Collection statement",
    body: "Nothing is paid until each card is checked and signed. The cards stay yours until then.",
    tick: "I have read the collection statement",
    choose: "Choose a shop",
  },
  shop: {
    title: "Choose a shop",
    more: "More shops appear here as they open.",
    choose: "Choose this shop",
  },
  days: {
    timesIn: "Times in",
    pick: "Choose a day to see its times.",
    nothingFree: "Nothing is free on this day. Choose another day.",
  },
  batchLine: {
    title: "Your batch",
    hand: "Hand in by Thursday 22 October, 19:00, and your cards leave on Friday 23 October. The estimate runs from the day they leave.",
    pastCutOff:
      "Thursday 22 October's batch has closed. Hand in by Thursday 29 October, 19:00, and your cards leave on Friday 30 October. The estimate runs from that day.",
  },
  times: {
    zone: "Times are in Hong Kong time (GMT+8).",
    book: "Book 10:00, Tuesday 20 October",
  },
  refusal: {
    title: "That time is no longer free",
    body: "The diary no longer offers 10:00 on Tuesday 20 October. The times are read again; choose another.",
  },
  joins: {
    title: "Join your visit",
    visit: "Tuesday 20 October, 10:00, at the Causeway Bay shop",
    list: "Your list is listed under the visit your first list booked.",
    join: "Join this visit",
  },
  resized: {
    title: "The visit is now 45 minutes",
    body: "Two lists pass 20 cards together, so the visit is longer and moves once in the diary.",
  },
  lead: {
    title: "Your visit",
    cards: "Cards",
    visit: "Visit",
    paid: "Paid",
    paidValue: "Nothing, until each card is checked and signed",
    continue: "Choose a shop",
  },
  booked: {
    title: "Drop-off booked",
    body: "Bring your cards on the day. We emailed the details to you.",
    service: "Service",
    location: "Shop",
    when: "When",
    beforeYouCome: "Before you come",
    answers: "Your answers",
    manage: "Manage this visit",
    calendar: "Add to calendar",
    openList: "Open your list",
  },
  manage: {
    service: "Service",
    location: "Shop",
    when: "When",
    state: {
      booked: "Booked",
      checked_in: "Checked in",
      cancelled: "Cancelled",
      completed: "Completed",
      no_show: "Missed",
    },
    move: "Move",
    cancel: "Cancel",
    cancelTitle: "Cancel this visit?",
    cancelBody:
      "Your list and its estimate stay with you. You can book another visit.",
    cancelConfirm: "Cancel visit",
    cancelKeep: "Keep visit",
  },
  detached: {
    title: "This visit was closed",
    body: "The visit ended without a hand-in. Your list and estimate are kept, so you can book again.",
    bookAgain: "Book again",
  },
  moved: {
    title: "Moved to Thursday 22 October, 14:00",
    body: "We emailed the new time to you.",
  },
  vault: {
    title: "Your vault card needs an ID check",
    body: "Grading needs no ID. The vault case on this visit takes the identity check.",
  },
  feeWithCover:
    "HKD 1,200 a card at the till, plus a cover line of HKD 292.50 on a card declared at HKD 19,500.",
  bulk: {
    note: "Bulk visit: about 45 minutes, for 20 cards or more.",
    lead: "24 cards on one list. Bulk takes about 45 minutes.",
  },
  beforeYouCome: [
    {
      id: "sleeves",
      content:
        "The cards, each in a sleeve. Penny sleeves are fine; no toploaders taped shut.",
    },
    {
      id: "list",
      content:
        "The list. Staff check each card against it, and it can change until the cards are handed in.",
    },
    {
      id: "signature",
      content:
        "The signature, then the fee. On the shop iPad once every card is checked, then the fee at the till.",
    },
    {
      id: "leave",
      content:
        "The day the cards leave. Friday 23 October for cards handed in by Thursday 22 October, 19:00, and the estimated day back at the shop.",
    },
  ],
} as const;

/** Item 4 read with its dates: the ship day and the estimated day back. */
export const DROP_OFF_CARDS_LEAVE_LINE =
  "The day the cards leave: Friday 23 October, for cards handed in by Thursday 22 October, 19:00. Back at the shop in about 5 weeks, around Friday 27 November.";

/** The Shop state's lines beside the picker: how long each visit takes, and a visit already booked. */
export const DROP_OFF_SHOP_LINES = {
  durations:
    "A drop-off takes about 20 minutes; Bulk, 20 cards or more, about 45 minutes.",
  alreadyBooked:
    "Already booked a drop-off? A second list joins that visit, with no new booking.",
} as const;
