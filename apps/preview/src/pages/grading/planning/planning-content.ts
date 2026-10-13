/** The manual page these wireframes settle, under grade10-site. */
export const PLANNING_MANUAL_PATH = "grading/planning";

/** The steps of Planning a submission, in the order a collector walks them. */
export type PlanState =
  | "fee-sheet"
  | "cards"
  | "service"
  | "service-closed"
  | "service-bulk"
  | "book"
  | "book-upcharge";

export const PLAN_STORY_IDS = {
  "fee-sheet": "grading-planning-prototypes-plan-submission--fee-sheet",
  cards: "grading-planning-prototypes-plan-submission--cards",
  service: "grading-planning-prototypes-plan-submission--service",
  "service-closed":
    "grading-planning-prototypes-plan-submission--service-closed",
  "service-bulk": "grading-planning-prototypes-plan-submission--service-bulk",
  book: "grading-planning-prototypes-plan-submission--book",
  "book-upcharge": "grading-planning-prototypes-plan-submission--book-upcharge",
} as const satisfies Record<PlanState, string>;

/** The drop-off booking the plan's Book step leads to. */
export const PLAN_BOOK_DROP_OFF_STORY_ID =
  "grading-drop-off-prototypes-book-drop-off--lead";

/** The wizard's steps: the stage rail reads these labels. */
export const PLAN_STAGES = [
  { id: "cards", label: "The cards" },
  { id: "service", label: "The service" },
  { id: "book", label: "Book" },
] as const;

export const PLAN_GRADERS = ["PSA", "CGC", "BGS"] as const;

/** Every figure is an example modelled on the fee sheet; the sheet itself is Commercial's. */
export const PLAN_LEVELS = [
  {
    id: "value",
    name: "Value",
    ceiling: "HKD 3,900",
    cards: "20 cards",
    fee: "HKD 250 a card",
    cover: "",
    back: "about 8 weeks",
  },
  {
    id: "regular",
    name: "Regular",
    ceiling: "HKD 11,700",
    cards: "20 cards",
    fee: "HKD 600 a card",
    cover: "",
    back: "about 5 weeks",
  },
  {
    id: "express",
    name: "Express",
    ceiling: "HKD 19,500",
    cards: "20 cards",
    fee: "HKD 1,200 a card",
    cover: "plus 1.5% cover",
    back: "about 3 weeks",
  },
  {
    id: "super-express",
    name: "Super Express",
    ceiling: "HKD 39,000",
    cards: "20 cards",
    fee: "HKD 2,400 a card",
    cover: "plus 1.5% cover",
    back: "about 2 weeks",
  },
  {
    id: "bulk",
    name: "Bulk",
    ceiling: "HKD 1,500",
    cards: "20 to 100 cards",
    fee: "HKD 180 a card",
    cover: "",
    back: "about 10 weeks",
  },
] as const;

export const PLAN_COPY = {
  title: "Plan a submission",
  description:
    "Three steps: the cards, the service and the drop-off. Nothing is paid or signed until the cards are checked at the counter.",
  cards: {
    contact: "Your details",
    name: "Name",
    email: "Email",
    phone: "Phone",
    cardTitle: "Card 1",
    cardName: "Card name",
    cardSet: "Set",
    declared: "Declared value (HKD)",
    reference: "Recent sales are a reference, not a valuation.",
    referenceRows: "Ungraded HKD 2,900 · PSA 9 HKD 5,800 · PSA 10 HKD 11,000",
    minimum: "Only encapsulate at PSA 9 or above",
    addCard: "Add another card",
    continue: "Choose the service",
    cardCount: "1 card on this plan",
    bulkCount: "24 cards on this plan",
  },
  service: {
    grader: "Grader",
    level: "Level",
    back: "Back to the cards",
    estimate: "Estimate",
    estimateRows: "3 cards × HKD 600 = HKD 1,800",
    estimateBack: "Back in about 5 weeks from the day the batch leaves.",
    cover:
      "Cover is 1.5% of the declared value a card, its own line on the estimate.",
    continue: "Continue to the drop-off",
    chosen: "Chosen",
    closedValue: "Value is closed: card 2 is declared above HKD 3,900.",
    closedRegular: "Regular is closed: card 2 is declared above HKD 11,700.",
    closedBulk: "Bulk is closed: 3 cards is fewer than 20.",
    bulkOnly: "24 cards: Bulk is the only level open.",
    bulkEstimate: "24 cards × HKD 180 = HKD 4,320",
    bulkBack: "Back in about 10 weeks from the day the batch leaves.",
    closedAbove20:
      "Closed: more than 20 cards leaves Bulk the only level open.",
    estimateExpress: "3 cards × HKD 1,200 = HKD 3,600, plus cover HKD 141.00",
    estimateExpressBack: "Back in about 3 weeks from the day the batch leaves.",
  },
  book: {
    schedule: "Cards in this plan",
    declared: "Declared value in total",
    declaredValue: "HKD 9,400",
    fee: "Fee at the counter, once signed",
    feeValue: "HKD 1,800",
    cards: [
      {
        id: "charizard",
        name: "1999 Charizard, Base Set",
        declared: "HKD 3,500",
      },
      { id: "blastoise", name: "Blastoise, Base Set", declared: "HKD 2,800" },
      { id: "venusaur", name: "Venusaur, Base Set", declared: "HKD 3,100" },
    ],
    feeBulk: "HKD 4,320",
    goodToKnow: "Good to know",
    consent: "I agree to the submission agreement and its seven clauses.",
    book: "Book the drop-off",
    save: "Save the plan to book later",
    upcharge: {
      title: "Blastoise, Base Set may move up a level",
      body: "If the grader's PSA 10 reference is above Regular's ceiling, the card moves to Express. The difference, HKD 600, is due at the counter before collection.",
    },
  },
  goodToKnow: [
    {
      id: "pay",
      content:
        "Nothing is paid until each card is checked and signed at the counter.",
    },
    {
      id: "estimate",
      content:
        "The estimate runs from the day the batch leaves, not from today.",
    },
    {
      id: "grade",
      content:
        "The grader decides the grade. The declared value sets the level and the cover.",
    },
    { id: "change", content: "Cards can change until they are handed in." },
    {
      id: "ship",
      content:
        "Slabs are not shipped. They are handed back in person, against a pickup code.",
    },
  ],
} as const;

/** The first visit, before any sign-in: what grading is, the steps and the fee sheet. */
export const PLAN_FEE_SHEET_COPY = {
  title: "What grading costs",
  intro:
    "We send your cards to the grader and bring them back slabbed. You pay the fee a card at the counter, once each card is checked.",
  steps: [
    { id: "plan", content: "Plan the submission: your cards and the level." },
    { id: "book", content: "Book a drop-off at the shop." },
    { id: "hand-in", content: "Hand the cards in and sign at the counter." },
    { id: "collect", content: "Collect the slabs when they are back." },
  ],
  stepsLabel: "Four steps",
  sheetLead:
    "Each fee includes the grader's fee and shipping both ways. Every figure is an example.",
  coverLine:
    "Express and Super Express add a cover line: 1.5% of the declared value a card.",
  start: "Start a submission",
  bookWithout: "Book a drop-off without a list",
} as const;
