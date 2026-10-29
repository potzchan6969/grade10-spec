/** Story ids the wireframes click through to, in this feature's titles. */
export const REQUEST_WIZARD_DESCRIBE_STORY_ID =
  "finance-collector-pages-prototypes-request-wizard--describe";
export const CASE_PAGE_OFFER_WAITING_STORY_ID =
  "finance-collector-pages-prototypes-case-page--offer-waiting";
export const CASE_PAGE_LOAN_RUNNING_STORY_ID =
  "finance-collector-pages-prototypes-case-page--loan-running";
export const BOOK_A_VISIT_SHOP_STORY_ID =
  "finance-collector-pages-prototypes-book-a-visit--shop";
export const BOOK_A_VISIT_TIMES_STORY_ID =
  "finance-collector-pages-prototypes-book-a-visit--times";
export const BOOK_A_VISIT_BOOKED_STORY_ID =
  "finance-collector-pages-prototypes-book-a-visit--booked";

export const COLLECTOR_PAGES_MANUAL_PATH = "vault/collector-pages";

/** Draft words: the collector's cases, as the list reads them. */
export const CASE_LIST_COPY = {
  title: "Your cases",
  description: "Every case you hold. Nobody else’s cases are listed here.",
  startRequest: "Start a request",
  open: "Open",
  resume: "Resume",
  draftsLimit: "You can keep up to three drafts.",
  loading: "Loading your cases…",
  empty: {
    title: "Nothing here yet",
    description:
      "Start a request to send a card in for a loan, or to keep it safe at the shop.",
  },
};

export const CASE_LIST_CASES = [
  {
    title: "1999 Charizard",
    status: "Offer waiting",
    chip: "Waiting on you",
    reference: "K7HQ4R",
    opened: "2 October 2026",
    lane: "Loan",
  },
  {
    title: "Blastoise, Base Set",
    status: "Loan running",
    chip: "Due 1 December",
    reference: "M3WP9T",
    opened: "18 September 2026",
    lane: "Loan",
  },
] as const;

export const CASE_LIST_DRAFT = {
  title: "Vintage booster box",
  status: "Draft",
  photographs: "2 of 10 photographs",
  nextStep: "Add the photographs, then send it in.",
} as const;

export const REQUEST_STEPS_COPY = {
  describe: {
    category: "Category",
    categoryValue: "Trading card",
    title: "Title",
    titleValue: "1999 Charizard, Base Set, Shadowless",
    titleHint: "Up to 200 characters.",
    description: "Description",
    descriptionValue: "Graded PSA 9. Kept in its sleeve and top loader.",
    descriptionHint: "Up to 2,000 characters.",
    whatsapp: "WhatsApp number (optional)",
    whatsappHint:
      "We do not check it. Add the country code if it is not Hong Kong.",
    lane: "What do you want from the shop?",
    laneLoan: "A loan, against the item",
    laneStorage: "Only to keep it safe",
    amount: "How much would you like to borrow? (HKD)",
    amountValue: "8000",
    continue: "Continue",
    finishLater: "Finish later",
  },
  photograph: {
    drop: "Add photographs of the item",
    dropHint: "1 to 10 photographs. JPEG, PNG or WebP, up to 20 MB each.",
    removed: "Location details are removed from every photograph.",
    addPhotos: "Add photographs",
    tips: [
      "Front and back, in good light, with no glare.",
      "Include the grade label or the cert number if the item has one.",
      "Photograph any edge or corner wear as it is.",
    ],
    count: "2 of 10 photographs added",
  },
  review: {
    title: "Your request",
    rows: [
      { label: "Category", value: "Trading card" },
      { label: "Title", value: "1999 Charizard, Base Set, Shadowless" },
      { label: "Lane", value: "A loan of HK$8,000" },
      { label: "Photographs", value: "2" },
    ],
    nextTitle: "What happens next",
    next: [
      "We value the item from your photographs.",
      "If we can lend against it, we send you an offer.",
      "You book a visit to hand the item over.",
    ],
    statement: "I have read the personal information collection statement.",
    send: "Send it in",
  },
  sent: {
    title: "Request sent",
    reference: "Your reference",
    lead: "Say or type this reference at the shop, or use it as the transfer reference.",
    book: "Book a visit",
    notNow: "Not now",
    several: "Sending several cards? Book one visit for all of them.",
  },
};

export const CASE_PAGE_COPY = {
  item: "1999 Charizard",
  meta: "Trading card · Reference K7HQ4R · Opened 2 October 2026",
  request: {
    title: "Request sent",
    lead: "We are valuing your card from its photographs. Nothing is needed from you yet.",
    book: "Book a visit",
    cancel: "Cancel this request",
  },
  offer: {
    title: "Our offer",
    lead: "HK$8,000.00 over 30 days at 6% for the term.",
    rowsLabel: "The offer’s figures",
    rows: [
      { label: "Loan", value: "HK$8,000.00" },
      { label: "Interest for the term", value: "HK$480.00" },
      { label: "Late day cost", value: "HK$100.00 per started day" },
    ],
    total: "Total to repay: HK$8,480.00.",
    openUntil: "Open until 12 October, 18:00 HKT.",
    accept: "Accept this offer",
    decline: "Decline this offer",
  },
  ranOut: {
    title: "Offer ran out",
    lead: "The offer closed on 12 October at 18:00 HKT. Your visit still stands.",
  },
  owed: {
    title: "What is owed",
    rowsLabel: "The balance",
    rows: [
      { label: "Outstanding", value: "HK$8,480.00 of HK$8,480.00" },
      { label: "Repaid so far", value: "HK$0.00" },
      { label: "Due date", value: "1 December 2026" },
    ],
    overdueRows: [
      { label: "Outstanding", value: "HK$8,980.00" },
      { label: "Days overdue", value: "4" },
      { label: "Late interest so far", value: "HK$400.00" },
    ],
    pastDueLead: "Interest runs at the same daily rate, with no fee.",
    book: "Book a visit to repay and collect",
  },
  reminders: {
    title: "Reminders",
    free: "A reminder costs nothing.",
    items: [
      { id: "week", content: "7 days before the due date" },
      { id: "day", content: "1 day before the due date" },
      { id: "overdue", content: "Every 7 days once overdue" },
    ],
  },
};

export const BOOK_A_VISIT_COPY = {
  shop: {
    title: "Choose a shop",
    lead: "Pick the shop you will hand the item over at.",
    choose: "Choose this shop",
  },
  times: {
    title: "Pick a time",
    day: "Tuesday 20 October",
    slots: ["10:00", "11:30", "14:00", "16:30"],
    zone: "Times are in Hong Kong time (GMT+8).",
    book: "Book this time",
    moveCancel: "You can move or cancel the visit any time up to the slot.",
  },
  nothingFree: {
    title: "Nothing free on this day",
    description: "Pick another day, or another shop.",
    chooseDay: "Choose another day",
  },
  booked: {
    title: "Visit booked",
    lead: "Tuesday 20 October at 11:30, at the shop.",
    rows: [
      { label: "Shop", value: "Hong Kong Grade10 Store" },
      { label: "Bring", value: "The item and your ID" },
    ],
    calendar: "Add to calendar",
    move: "Move",
    cancel: "Cancel visit",
  },
};
