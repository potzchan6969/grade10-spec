/* Story data for the grading blocks. Every figure is HKD minor units and
 * every day an instant, because that is what a consumer passes.
 *
 * Every word a collector reads is the en catalog's — `@grade10/i18n`'s
 * `messages/shared/en/grading.json` — quoted key for key, so the workbench
 * shows the shipped words rather than a second English of them. The blocks
 * themselves stay props-only and import no catalog. */
import type { GradingCardListCopy } from "./grading-card-list";
import type {
  GradingCardRecordCopy,
  GradingRecordCard,
} from "./grading-card-record";
import type { GradingFeeSheetCopy } from "./grading-fee-sheet";
import type {
  GradingGradeCard,
  GradingGradeCardsCopy,
} from "./grading-grade-cards";
import type {
  GradingLevelPickerCopy,
  GradingPickerLevel,
} from "./grading-level-picker";
import type { GradingMoneyBlockCopy } from "./grading-money-block";
import type { GradingNamedCollectorCopy } from "./grading-named-collector";
import type {
  GradingPasteResult,
  GradingPasteSheetCopy,
} from "./grading-paste-sheet";
import type { GradingPickupCardCopy } from "./grading-pickup-card";
import type { GradingReviewCard, GradingReviewCopy } from "./grading-review";
import type { GradingStatusRailCopy } from "./grading-status-rail";
import type { GradingUncollectedLadderCopy } from "./grading-uncollected-ladder";
import type {
  GradingFeeSheetRecord,
  GradingGrader,
  GradingListedCard,
  GradingMoney,
} from "./types";

const FIXTURE_TIME_ZONE = "Asia/Hong_Kong";

/** 1 June 2026, and the days the ladder counts from it. */
const READY_ON = 1780304400000;
const NAMED_AT = 1781514000000;
const REMINDER_ONE_ON = 1781946000000;
const REMINDER_TWO_ON = 1784106000000;
const STORAGE_FROM = 1786698000000;
const NOTICE_ON = 1789290000000;
const NOTICE_POSTED_ON = 1789894800000;
const PAID_AT = 1781514000000;

function hkd(amountMinor: number): GradingMoney {
  return { amountMinor, currency: "HKD" };
}

const PSA_LEVELS = [
  {
    id: "value",
    name: "Value",
    ceiling: hkd(150000),
    cardsPerSubmission: "1 to 20 cards",
    feePerCard: hkd(25000),
    weeks: "About 8 weeks",
  },
  {
    id: "regular",
    name: "Regular",
    ceiling: hkd(400000),
    cardsPerSubmission: "1 to 20 cards",
    feePerCard: hkd(40000),
    coverRate: "1% of declared value",
    weeks: "About 6 weeks",
  },
  {
    id: "express",
    name: "Express",
    ceiling: hkd(1500000),
    cardsPerSubmission: "1 to 20 cards",
    feePerCard: hkd(55000),
    coverRate: "1.5% of declared value",
    weeks: "About 4 weeks",
  },
  {
    id: "super-express",
    name: "Super Express",
    ceiling: hkd(4000000),
    cardsPerSubmission: "1 to 20 cards",
    feePerCard: hkd(120000),
    coverRate: "2% of declared value",
    weeks: "About 2 weeks",
  },
] as const;

const PSA_SHEET: GradingFeeSheetRecord = {
  id: "psa",
  name: "PSA",
  levels: PSA_LEVELS,
};

const CGC_SHEET: GradingFeeSheetRecord = {
  id: "cgc",
  name: "CGC",
  figuresLine: "These figures are examples until CGC confirms them.",
  levels: PSA_LEVELS.map((level) => ({
    ...level,
    feePerCard: hkd(level.feePerCard.amountMinor - 3000),
  })),
};

const BGS_SHEET: GradingFeeSheetRecord = {
  id: "bgs",
  name: "BGS",
  figuresLine: "These figures are examples until BGS confirms them.",
  levels: PSA_LEVELS.map((level) => ({
    ...level,
    feePerCard: hkd(level.feePerCard.amountMinor + 2000),
  })),
};

/** A grader nobody has priced: its levels listed, carrying no figures. */
const UNPRICED_SHEET: GradingFeeSheetRecord = {
  id: "bgs",
  name: "BGS",
  figuresLine:
    "BGS has not confirmed its fees yet, so its levels cannot be picked.",
  levels: PSA_LEVELS.map(({ id, name }) => ({
    id,
    name,
    cardsPerSubmission: "—",
    weeks: "—",
  })),
};

const THREE_SHEETS: readonly GradingFeeSheetRecord[] = [
  PSA_SHEET,
  CGC_SHEET,
  BGS_SHEET,
];

const GRADERS: readonly GradingGrader[] = [
  { id: "psa", name: "PSA" },
  { id: "cgc", name: "CGC" },
  { id: "bgs", name: "BGS" },
];

const FEE_SHEET_COPY: GradingFeeSheetCopy = {
  title: "What it costs",
  level: "Level",
  ceiling: "Value up to",
  cardsPerSubmission: "Cards a submission",
  feePerCard: "Fee a card",
  cover: "Cover",
  weeks: "Back in about",
  noCover: "No cover",
  noFigure: "—",
};

const ABOVE_TOP_LINE =
  "A card worth more than HK$40,000 is priced at the counter.";

const LEVEL_PICKER_COPY: GradingLevelPickerCopy = {
  title: "Pick a service",
  graderLabel: "Grader",
  highestDeclaredLabel: "Your highest declared value is",
  estimateTitle: "Your estimate",
  totalLabel: "Total",
  unavailable: "Not available",
};

const OPEN_LEVELS: readonly GradingPickerLevel[] = [
  {
    id: "value",
    name: "Value",
    state: "open",
    ceiling: hkd(150000),
    feePerCard: hkd(25000),
    weeks: "Back in about 8 weeks",
  },
  {
    id: "regular",
    name: "Regular",
    state: "open",
    ceiling: hkd(400000),
    feePerCard: hkd(40000),
    weeks: "Back in about 6 weeks",
  },
  {
    id: "express",
    name: "Express",
    state: "open",
    ceiling: hkd(1500000),
    coverLine: "Cover adds HK$30 a card",
    feePerCard: hkd(55000),
    weeks: "Back in about 4 weeks",
  },
];

const ESTIMATE = {
  feeLine: "4 cards × HK$250",
  total: hkd(112000),
  weeks: "Back in about 6 weeks",
};

const UPCHARGE_NOTICE =
  "A card the grader moves up a level is charged the difference before collection. We tell you before you collect.";

const COUNTER_LINE =
  "One of your cards is worth more than any level takes. Ask at the counter and we will price it with you.";

const CARD_LIST_COPY: GradingCardListCopy = {
  title: "Your cards",
  searchLabel: "Add a card",
  searchPlaceholder: "Start typing a card name",
  addTyped: "Add as typed",
  paste: "Paste a list",
  emptyTitle: "No cards yet",
  emptyBody: "Add them one at a time, or paste a list you already have.",
  matched: "{set} · {number} · matched in the catalogue",
  matchedNoDetail: "Matched in the catalogue",
  keptAsTyped: "Kept as you typed it · no reference",
  catalogueUnavailable:
    "We could not reach the catalogue, so this card keeps the name you typed. The value is still needed.",
  noValue: "Tell us the declared value before you continue.",
  declaredValueLabel: "Declared value",
  referenceSalesLabel: "Recent sales:",
  minimumGrade:
    "Only encapsulate at {grade} or above · the fee applies either way",
  edit: "Edit",
  remove: "Remove",
};

const MATCHED_CARD: GradingListedCard = {
  id: "card_charizard",
  name: "Charizard",
  set: "Base Set",
  number: "4/102",
  matched: true,
  declaredValue: hkd(380000),
  referenceSales: [
    { id: "s1", label: "Sold 12 May", price: hkd(365000) },
    { id: "s2", label: "Sold 3 May", price: hkd(372000) },
    { id: "s3", label: "Sold 28 Apr", price: hkd(358000) },
  ],
  minimumGrade: "PSA 9",
  minimumGradeWanted: true,
};

/** Matched in the reference, which names no set or number of its own
 * (`Q109`): the card reads as matched from its name alone. */
const MATCHED_NO_DETAIL_CARD: GradingListedCard = {
  id: "card_mewtwo",
  name: "Mewtwo",
  matched: true,
  declaredValue: hkd(90000),
  referenceSales: [{ id: "s1", label: "Sold 9 May", price: hkd(88000) }],
};

const TYPED_CARD: GradingListedCard = {
  id: "card_typed",
  name: "Umbreon holo, Japanese promo",
  matched: false,
  declaredValue: hkd(120000),
  minimumGrade: "PSA 9",
};

const NO_VALUE_CARD: GradingListedCard = {
  id: "card_pikachu",
  name: "Pikachu Illustrator",
  set: "Promo",
  number: "1998",
  matched: true,
  minimumGrade: "PSA 9",
};

const ABOVE_CEILING_CARD: GradingListedCard = {
  id: "card_lugia",
  name: "Lugia first edition",
  set: "Neo Genesis",
  number: "9/111",
  matched: true,
  declaredValue: hkd(2200000),
  minimumGrade: "PSA 9",
  aboveCeilingLine:
    "This card is worth more than Bulk takes. It can go in a second submission on the same drop-off.",
};

const LIST_CAP = {
  count: 100,
  line: "Up to 100 cards in one submission.",
  closesLevelLine: "More than 20 cards leaves Bulk as the only level open.",
};

const CAP_REACHED_LINE =
  "This submission is full. Start a second submission on another day.";

const CARD_MATCHES = [
  {
    id: "match_blastoise",
    name: "Blastoise",
    setLine: "Base Set · 2/102",
    suggestedValue: hkd(210000),
  },
  {
    id: "match_venusaur",
    name: "Venusaur",
    setLine: "Base Set · 15/102",
    suggestedValue: hkd(180000),
  },
];

const PASTE_SHEET_COPY: GradingPasteSheetCopy = {
  title: "Paste a list",
  body: "One card a line. We match what we can and keep the rest as you typed it.",
  textLabel: "Your list",
  textPlaceholder: "Charizard Base Set 4/102",
  linesReadLabel: "Lines read:",
  matched: "Matched",
  keptAsTyped: "Kept as typed",
  withoutValue: "Without a value",
  aboveCeiling: "Above the ceiling",
  skipped: "Skipped, already listed",
  catalogueUnavailable:
    "Our catalogue could not be asked, so every line is kept as you typed it.",
  add: "Add these cards to the list",
  close: "Go back",
};

const PASTE_RESULT: GradingPasteResult = {
  matched: {
    count: 12,
    line: "Twelve lines matched our reference and show recent sales.",
    cards: [MATCHED_CARD],
  },
  keptAsTyped: {
    count: 3,
    line: "Three lines are kept as you typed them.",
    cards: [TYPED_CARD],
  },
  withoutValue: {
    count: 2,
    line: "Two lines need a declared value before you continue.",
    cards: [NO_VALUE_CARD],
  },
  aboveCeiling: {
    count: 1,
    line: "Lugia first edition at HK$22,000 is above the ceiling.",
    cards: [ABOVE_CEILING_CARD],
  },
  skipped: {
    count: 2,
    line: "Two lines name a card already on your list.",
  },
};

const BULK_NOTICE =
  "More than 20 cards means Bulk: HK$120 a card, up to HK$1,500 a card declared, back in about 12 weeks, and a longer drop-off of about 45 minutes for up to 100 cards.";

const SECOND_SUBMISSION_LINE =
  "A card above the ceiling can go in a second submission on the same drop-off.";

const REVIEW_COPY: GradingReviewCopy = {
  title: "Check and book",
  scheduleTitle: "Your cards",
  declaredTotalLabel: "Declared in total",
  feeLabel: "Fee",
  coverLabel: "Cover",
  minimumGradeLabel: "Minimum grade",
  warningTitle: "One card could cost more",
  warningLevelLabel: "The grader would move it to",
  warningDifferenceLabel: "Difference due before collection",
  warningHigherFeeLabel: "That level costs a card now",
  goodToKnowTitle: "Good to know",
  consent: "I agree to how the cards are collected.",
  book: "Book the drop-off",
  saveForLater: "Save and book later",
  edit: "Edit",
};

const REVIEW_SCHEDULE: readonly GradingReviewCard[] = [
  {
    id: "card_charizard",
    name: "Charizard",
    setLine: "Base Set · 4/102",
    declaredValue: hkd(380000),
    minimumGrade: "PSA 9",
    cover: hkd(3800),
  },
  {
    id: "card_blastoise",
    name: "Blastoise",
    setLine: "Base Set · 2/102",
    declaredValue: hkd(210000),
    cover: hkd(2100),
  },
  {
    id: "card_venusaur",
    name: "Venusaur",
    setLine: "Base Set · 15/102",
    declaredValue: hkd(180000),
    cover: hkd(1800),
  },
  {
    id: "card_typed",
    name: "Umbreon holo, Japanese promo",
    setLine: "As you typed it",
    declaredValue: hkd(30000),
    cover: hkd(4300),
  },
];

const GOOD_TO_KNOW: readonly string[] = [
  "Nothing is paid until every card is checked at the counter.",
  "We photograph each card front and back when you hand it in.",
  "A card the grader moves up a level is charged the difference before collection.",
  "A card returned ungraded still carries its fee.",
  "Cards stay with us until you collect them.",
];

const STATUS_RAIL_COPY: GradingStatusRailCopy = {
  planned: "Planned",
  booked: "Booked",
  handedIn: "Handed in",
  sent: "Sent",
  graded: "Graded",
  back: "Back",
  home: "Home",
};

const ENDED_LINE = "Cancelled. The cards never left you, and nothing was paid.";

const CARD_RECORD_COPY: GradingCardRecordCopy = {
  title: "Your cards",
  intakeIdLabel: "Intake id",
  declaredValueLabel: "Declared",
  minimumGradeLabel: "Minimum grade",
  certificateLabel: "Certificate",
  lookupLabel: "Look it up",
};

const FRONT_PHOTO = {
  src: "https://placehold.co/160x224/png?text=Front",
  alt: "Charizard, front",
};

const BACK_PHOTO = {
  src: "https://placehold.co/160x224/png?text=Back",
  alt: "Charizard, back",
};

const SLAB_PHOTO = {
  src: "https://placehold.co/160x224/png?text=Slab",
  alt: "Charizard in its slab",
};

const RECORD_BASE: GradingRecordCard = {
  id: "card_charizard",
  name: "Charizard",
  setLine: "Base Set · 4/102",
  declaredValue: hkd(380000),
  outcome: "listed",
  outcomeLabel: "Listed",
  outcomeLine: "On your list, not handed in yet.",
};

const GRADE_CARDS_COPY: GradingGradeCardsCopy = {
  title: "Your grades",
  ungradedTitle: "Returned ungraded",
  graderLabel: "Graded by",
  certificateLabel: "Certificate",
  lookupLabel: "Look it up",
  ungradedCodeLabel: "Grader’s code",
};

const GRADED_CARD: GradingGradeCard = {
  id: "card_charizard",
  name: "Charizard, Base Set 4/102",
  grade: "9",
  gradeLabel: "Mint",
  grader: "PSA",
  certificate: "PSA 84213377",
  lookupHref: "https://www.psacard.com/cert/84213377",
};

const PICKUP_COPY: GradingPickupCardCopy = {
  title: "Ready to collect",
  codeLabel: "Your pickup code",
  itemsLabel: "To collect",
  whereLabel: "Where",
  openLabel: "Open",
  noBooking: "No booking needed. Come in any time we are open.",
  dueLabel: "To settle",
  nothingDue: "Nothing",
  bringLabel: "Bring",
  bringNothing: "Nothing beyond the code. Your name releases the cards.",
};

const NAMED_COLLECTOR_COPY: GradingNamedCollectorCopy = {
  title: "Someone else collecting?",
  body: "Name one person and they can collect with their own ID.",
  nameLabel: "Their name",
  namePlaceholder: "As it reads on their ID",
  save: "Save",
  namedBadge: "Named",
  namedAtLabel: "Named on",
  onePersonLine: "One person at a time. Change or remove them any time.",
  change: "Change",
  remove: "Remove",
};

const MONEY_BLOCK_COPY: GradingMoneyBlockCopy = {
  title: "What it costs",
  includes: "Includes intake, photographs, shipping both ways and cover.",
  footnote:
    "A card returned ungraded still carries its fee; a card refused at the counter never does.",
};

const SETTLE_LEAD = "Settle HK$300 at the counter before you collect.";

const LADDER_COPY: GradingUncollectedLadderCopy = {
  title: "If nobody collects",
  readyLabel: "Ready since",
  cardsHeldLabel: "Cards we hold:",
  passedLabel: "Passed",
  postedLabel: "Notice posted",
};

const LADDER_RUNGS = [
  {
    id: "reminder-30",
    label: "First reminder, day 30",
    on: REMINDER_ONE_ON,
    line: "We email you.",
  },
  {
    id: "reminder-60",
    label: "Second reminder, day 60",
    on: REMINDER_TWO_ON,
    line: "We email you again.",
  },
  {
    id: "storage-90",
    label: "Storage starts, day 90",
    on: STORAGE_FROM,
    fee: hkd(3000),
    line: "A card a month, from this day.",
  },
  {
    id: "notice-180",
    label: "Written notice, day 180",
    on: NOTICE_ON,
    line: "We write to you and give you 30 days from the posting day.",
  },
];

const VAULT_LINE =
  "A slab can go into a vault case instead of coming home with you.";

export {
  ABOVE_CEILING_CARD,
  ABOVE_TOP_LINE,
  BACK_PHOTO,
  BGS_SHEET,
  BULK_NOTICE,
  CAP_REACHED_LINE,
  CARD_LIST_COPY,
  CARD_MATCHES,
  CARD_RECORD_COPY,
  CGC_SHEET,
  COUNTER_LINE,
  ENDED_LINE,
  ESTIMATE,
  FEE_SHEET_COPY,
  FIXTURE_TIME_ZONE,
  FRONT_PHOTO,
  GOOD_TO_KNOW,
  GRADE_CARDS_COPY,
  GRADED_CARD,
  GRADERS,
  hkd,
  LADDER_COPY,
  LADDER_RUNGS,
  LEVEL_PICKER_COPY,
  LIST_CAP,
  MATCHED_CARD,
  MATCHED_NO_DETAIL_CARD,
  MONEY_BLOCK_COPY,
  NAMED_AT,
  NAMED_COLLECTOR_COPY,
  NO_VALUE_CARD,
  NOTICE_ON,
  NOTICE_POSTED_ON,
  OPEN_LEVELS,
  PAID_AT,
  PASTE_RESULT,
  PASTE_SHEET_COPY,
  PICKUP_COPY,
  PSA_SHEET,
  READY_ON,
  RECORD_BASE,
  REMINDER_ONE_ON,
  REMINDER_TWO_ON,
  REVIEW_COPY,
  REVIEW_SCHEDULE,
  SECOND_SUBMISSION_LINE,
  SETTLE_LEAD,
  SLAB_PHOTO,
  STATUS_RAIL_COPY,
  STORAGE_FROM,
  THREE_SHEETS,
  TYPED_CARD,
  UNPRICED_SHEET,
  UPCHARGE_NOTICE,
  VAULT_LINE,
};
