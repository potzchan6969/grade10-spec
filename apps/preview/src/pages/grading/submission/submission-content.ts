/** The manual page these wireframes settle, under grade10-site. */
export const SUBMISSION_MANUAL_PATH = "grading/submission";

/** The collector's submission page, one state per stage or card outcome it can show. */
export type SubmissionState =
  | "planned"
  | "booked"
  | "handed-in"
  | "withdrawal-open"
  | "with-the-grader"
  | "grades-are-in"
  | "moved-up-level"
  | "back-at-shop"
  | "returned-ungraded"
  | "not-returned"
  | "ready-to-collect"
  | "named-person"
  | "storage-accruing"
  | "back-with-you"
  | "cancelled"
  | "expired";

export const SUBMISSION_STORY_IDS = {
  planned: "grading-submission-prototypes-submission--planned",
  booked: "grading-submission-prototypes-submission--booked",
  "handed-in": "grading-submission-prototypes-submission--handed-in",
  "withdrawal-open":
    "grading-submission-prototypes-submission--withdrawal-open",
  "with-the-grader":
    "grading-submission-prototypes-submission--with-the-grader",
  "grades-are-in": "grading-submission-prototypes-submission--grades-are-in",
  "moved-up-level": "grading-submission-prototypes-submission--moved-up-level",
  "back-at-shop": "grading-submission-prototypes-submission--back-at-the-shop",
  "returned-ungraded":
    "grading-submission-prototypes-submission--returned-ungraded",
  "not-returned": "grading-submission-prototypes-submission--not-returned",
  "ready-to-collect":
    "grading-submission-prototypes-submission--ready-to-collect",
  "named-person": "grading-submission-prototypes-submission--named-person",
  "storage-accruing":
    "grading-submission-prototypes-submission--storage-accruing",
  "back-with-you": "grading-submission-prototypes-submission--back-with-you",
  cancelled: "grading-submission-prototypes-submission--cancelled",
  expired: "grading-submission-prototypes-submission--expired",
} as const satisfies Record<SubmissionState, string>;

/** The drop-off a planned submission books, and the visit a booked one moves. */
export const SUBMISSION_BOOK_DROP_OFF_STORY_ID =
  "grading-drop-off-prototypes-book-drop-off--lead";
export const SUBMISSION_MOVE_VISIT_STORY_ID =
  "grading-drop-off-prototypes-drop-off-booked--booked";
/** The plan a new submission starts from once the old one expired. */
export const SUBMISSION_NEW_PLAN_STORY_ID =
  "grading-planning-prototypes-plan-submission--cards";
/** The hand-back receipt a collected card leaves with. */
export const SUBMISSION_RECEIPT_STORY_ID =
  "grading-documents-prototypes-hand-back-receipt--signable";

/** The rail of stages a submission walks; the page reads the stage it reached. */
export const SUBMISSION_STAGES = [
  { id: "planned", label: "Planned" },
  { id: "booked", label: "Booked" },
  { id: "handed-in", label: "Handed in" },
  { id: "sent", label: "Sent" },
  { id: "graded", label: "Graded" },
  { id: "back", label: "Back" },
  { id: "home", label: "Home" },
] as const;

export type SubmissionView = {
  /** The stage the rail reached; the word it ended on, when the case ended. */
  stage: (typeof SUBMISSION_STAGES)[number]["id"];
  ended?: string;
  word: string;
  move: string;
  /** The collector's facts for the stage, in order. */
  facts: readonly { label: string; value: string }[];
  /** Card lines: each card's own outcome, in the collector's words. */
  cards?: readonly { name: string; outcome: string }[];
  /** The one action the stage offers, and the wireframe it opens. */
  action?: { label: string; storyId?: string };
  note?: string;
};

export const SUBMISSION_VIEWS = {
  planned: {
    stage: "planned",
    word: "Not handed in yet",
    move: "Waiting on you",
    facts: [
      { label: "Cards", value: "3 cards, PSA, Regular level" },
      { label: "Estimate", value: "HKD 1,800, from the day the batch leaves" },
      { label: "Drop-off", value: "Not booked yet" },
    ],
    action: {
      label: "Book the drop-off",
      storyId: SUBMISSION_BOOK_DROP_OFF_STORY_ID,
    },
    note: "Nudged at 21 days; the plan expires at 30 days with no drop-off ahead.",
  },
  booked: {
    stage: "booked",
    word: "Drop-off booked",
    move: "Drop-off on its day",
    facts: [
      { label: "Visit", value: "Tuesday 20 October, 10:00, Causeway Bay" },
      { label: "Cards", value: "3 cards" },
    ],
    action: {
      label: "Move or cancel the visit",
      storyId: SUBMISSION_MOVE_VISIT_STORY_ID,
    },
    note: "A missed visit closes the visit, not the plan; your list and estimate stay.",
  },
  "handed-in": {
    stage: "handed-in",
    word: "Handed in",
    move: "With us",
    facts: [
      { label: "Handed in", value: "3 cards, on Tuesday 20 October" },
      {
        label: "Batch",
        value: "Closes Thursday 22 October, 19:00; leaves Friday 23 October",
      },
      {
        label: "Estimated back",
        value: "About 5 weeks from the day the batch leaves",
      },
    ],
    cards: [
      { name: "1999 Charizard, Base Set", outcome: "Handed in" },
      { name: "Blastoise, Base Set", outcome: "Handed in" },
      { name: "Venusaur, Base Set", outcome: "Handed in" },
    ],
    action: { label: "Withdraw a card" },
  },
  "withdrawal-open": {
    stage: "handed-in",
    word: "Handed in",
    move: "With us",
    facts: [
      {
        label: "Withdraw",
        value: "A card can be withdrawn until Thursday 22 October, 19:00",
      },
      {
        label: "Fee",
        value:
          "Refunded at the till when the card is collected against a receipt",
      },
    ],
    cards: [{ name: "Venusaur, Base Set", outcome: "Ask to withdraw" }],
    action: { label: "Withdraw this card" },
  },
  "with-the-grader": {
    stage: "sent",
    word: "With the grader",
    move: "With PSA",
    facts: [
      { label: "Sent", value: "Friday 23 October, with PSA" },
      { label: "Estimated back", value: "About 5 weeks from the ship day" },
    ],
  },
  "grades-are-in": {
    stage: "graded",
    word: "Grades are in",
    move: "On their way back",
    facts: [
      {
        label: "Grades",
        value: "Posted to your page when the cards are checked back in",
      },
    ],
    cards: [
      { name: "1999 Charizard, Base Set", outcome: "PSA 10 GEM MT" },
      { name: "Blastoise, Base Set", outcome: "PSA 9" },
      { name: "Venusaur, Base Set", outcome: "Ungraded, code N1" },
    ],
    note: "The grades show when the cards are checked back in at the shop, never before.",
  },
  "moved-up-level": {
    stage: "graded",
    word: "Grades are in",
    move: "On their way back",
    facts: [
      {
        label: "Balance",
        value: "HKD 600 due at the counter before collection",
      },
    ],
    cards: [
      {
        name: "Blastoise, Base Set",
        outcome: "Moved up a level: the difference is HKD 600",
      },
    ],
    note: "The grade is the grader's decision. The card is kept until the difference is paid.",
  },
  "back-at-shop": {
    stage: "back",
    word: "Back at the shop, being checked",
    move: "With us",
    facts: [
      { label: "Back", value: "Checked in at the shop; ready within the week" },
    ],
    cards: [
      { name: "1999 Charizard, Base Set", outcome: "Checked" },
      { name: "Blastoise, Base Set", outcome: "Checked" },
      { name: "Venusaur, Base Set", outcome: "Checked" },
    ],
  },
  "returned-ungraded": {
    stage: "back",
    word: "Back at the shop, being checked",
    move: "With us",
    facts: [{ label: "Back", value: "Checked in at the shop" }],
    cards: [
      {
        name: "Venusaur, Base Set",
        outcome:
          "Ungraded, code N1. The fee stands, as the grader's terms say.",
      },
    ],
  },
  "not-returned": {
    stage: "back",
    word: "Back at the shop, being checked",
    move: "With us",
    facts: [
      {
        label: "Payout",
        value: "Paid out within the payout window, at declared value",
      },
    ],
    cards: [
      {
        name: "Venusaur, Base Set",
        outcome: "Not returned: HKD 3,100 at declared value, fee refunded",
      },
    ],
    note: "Grade10 claims from the grader or the courier itself; you are emailed the same day.",
  },
  "ready-to-collect": {
    stage: "back",
    word: "Ready to collect",
    move: "Waiting on you",
    facts: [
      { label: "Pickup code", value: "7K3Q" },
      {
        label: "Collect",
        value: "At the shop, in person, against the pickup code",
      },
      { label: "Reminders", value: "At 30 and 60 days, storage from day 90" },
    ],
    cards: [
      { name: "1999 Charizard, Base Set", outcome: "Ready" },
      { name: "Blastoise, Base Set", outcome: "Ready" },
    ],
    action: {
      label: "Name someone else to collect",
      storyId: SUBMISSION_STORY_IDS["named-person"],
    },
    note: "Vaulted cards are collected with their vault case, on the vault's own visit.",
  },
  "named-person": {
    stage: "back",
    word: "Ready to collect",
    move: "Waiting on you",
    facts: [
      { label: "Named", value: "Chan Siu Ming" },
      { label: "ID", value: "Matched at the counter; nothing kept" },
    ],
    action: { label: "Name someone else to collect" },
    note: "The named person collects in your place and signs the hand-back receipt.",
  },
  "storage-accruing": {
    stage: "back",
    word: "Ready to collect",
    move: "Waiting on you",
    facts: [
      { label: "Storage", value: "HKD 30 a card a month, from day 90" },
      { label: "Accrued", value: "One month, HKD 60 for two cards" },
    ],
    cards: [
      { name: "1999 Charizard, Base Set", outcome: "Storage accruing" },
      { name: "Blastoise, Base Set", outcome: "Storage accruing" },
    ],
    note: "Written notice is due at 180 days, from the day the cards were ready.",
  },
  "back-with-you": {
    stage: "home",
    word: "Back with you",
    move: "Collected",
    facts: [
      { label: "Collected", value: "Tuesday 9 February 2027, by you" },
      { label: "Records", value: "The graded record stays on this page" },
    ],
    action: {
      label: "Download the receipt",
      storyId: SUBMISSION_RECEIPT_STORY_ID,
    },
  },
  cancelled: {
    stage: "booked",
    ended: "Cancelled",
    word: "Cancelled",
    move: "Nothing is owed",
    facts: [{ label: "Cancelled", value: "Before the visit started" }],
  },
  expired: {
    stage: "planned",
    ended: "Expired",
    word: "Expired",
    move: "Nothing is owed",
    facts: [{ label: "Expired", value: "No drop-off was booked in time" }],
    action: {
      label: "Start a new plan",
      storyId: SUBMISSION_NEW_PLAN_STORY_ID,
    },
  },
} as const satisfies Record<SubmissionState, SubmissionView>;

export const SUBMISSION_COPY = {
  title: "Your submission",
  id: "Submission SUB-2041 · PSA, Regular level",
  rail: "Where it is",
  cards: "Your cards",
  facts: "Details",
  note: "Good to know",
  withdraw: {
    title: "Withdraw a card",
    body: "Choose the card to take out of the batch. It is collected at the counter against a receipt.",
  },
} as const;
