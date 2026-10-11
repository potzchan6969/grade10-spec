import type {
  MyConsignmentDetailView,
  MyConsignmentListCopy,
  MyConsignmentRecordCopy,
  MyConsignmentSummary,
} from "@grade10/ui";

/** Storybook story ids of the consignor's two pages, list → record. */
const MY_CONSIGNMENTS_STORY_ID = "pages-consignment-my-consignments--default";
const MY_CONSIGNMENT_STORY_ID = "pages-consignment-my-consignment--default";

const SIGN_IN_COPY = {
  title: "Sign in to see your consignments",
  body: "Your consignments are listed under your Grade10 account.",
  signIn: "Sign in",
};

const FAILED_COPY = {
  message: "Your consignments did not load.",
  retry: "Try again",
};

const MY_CONSIGNMENTS_COPY: MyConsignmentListCopy = {
  loading: "Loading your consignments…",
  failed: FAILED_COPY,
  emptyTitle: "Nothing consigned yet",
  emptyBody:
    "Bring a card to a Grade10 counter to sell it in the shop or at auction. It shows here once it is with us.",
  signIn: SIGN_IN_COPY,
  card: {
    items: "Your items",
    owed: "Your payout",
    paid: "Payouts",
    open: "Open",
  },
};

const MY_CONSIGNMENT_COPY: MyConsignmentRecordCopy = {
  back: "Your consignments",
  loading: "Loading your consignments…",
  failed: FAILED_COPY,
  notFoundTitle: "We could not find that consignment",
  notFoundBody:
    "It may belong to another account. Check the reference in your email.",
  signIn: SIGN_IN_COPY,
  detail: {
    stages: [
      { id: "asked", label: "Asked" },
      { id: "received", label: "Received" },
      { id: "terms", label: "Terms" },
      { id: "signed", label: "Signed" },
      { id: "onSale", label: "On sale" },
      { id: "sold", label: "Sold" },
      { id: "paid", label: "Paid" },
    ],
    ended: "Ended unsold",
    itemsTitle: "Your items",
    item: { endingSoon: "Ending soon" },
    terms: {
      title: "Your terms",
      notPinned: "Your terms are pinned when your agreement is prepared.",
      term: "Term",
      returnWindow: "Return window",
      storeCommission: "Store commission",
      auctionCommission: "Auction commission",
      minimum: "Minimum commission",
      fees: "Fees",
      whenPaid: "When you are paid",
      notSet: "Not set",
    },
    sellerTitle: "Your name on the store",
    payoutsTitle: "Payouts",
    noPayouts: "No payout yet. You are paid after each sale’s return window.",
    documentsTitle: "Your documents",
    documentsNote:
      "Your sealed copies come by email. Ask at the counter for another.",
    noDocuments: "No document yet.",
    messagesTitle: "Emails we sent you",
    noMessages: "No email yet.",
  },
};

/** Newest first, as the list reads. */
const MY_CONSIGNMENTS: readonly MyConsignmentSummary[] = [
  {
    ref: "CN-2026-0042",
    heading: "Consignment CN-2026-0042",
    status: "On sale",
    opened: "Opened 1 Oct 2026 at Central",
    itemCount: "3 items",
    paid: "Paid to you: HK$5,525.00",
  },
  {
    ref: "CN-2026-0031",
    heading: "Consignment CN-2026-0031",
    status: "Payout on its way",
    opened: "Opened 12 Aug 2026 at Causeway Bay",
    itemCount: "1 item",
    owed: "Owed to you: HK$8,500.00",
  },
  {
    ref: "CN-2026-0007",
    heading: "Consignment CN-2026-0007",
    status: "Closed",
    opened: "Opened 3 Mar 2026",
    itemCount: "3 items",
    paid: "Paid to you: HK$18,400.00",
  },
];

/** CN-2026-0042: on sale, terms pinned, named on the store, one payout. */
const MY_CONSIGNMENT: MyConsignmentDetailView = {
  heading: "Consignment CN-2026-0042",
  opened: "Opened 1 Oct 2026 at Central",
  status: "On sale",
  ended: false,
  paid: "Paid to you: HK$5,525.00",
  stage: "onSale",
  items: [
    {
      id: "G10-1001",
      title: "Charizard Base Set",
      labelCode: "G10-1001",
      state: "On sale",
      endingSoon: false,
      channel: "In the shop and online",
      lines: [
        "List price HK$6,500.00",
        "Floor HK$6,000.00",
        "On sale until 30 Dec 2026",
      ],
    },
    {
      id: "G10-1002",
      title: "Blastoise 1st Edition",
      labelCode: "G10-1002",
      state: "On sale",
      endingSoon: true,
      channel: "At auction",
      lines: ["Floor HK$12,000.00", "On sale until 18 Oct 2026"],
    },
    {
      id: "G10-0877",
      title: "Pikachu Illustrator Promo",
      labelCode: "G10-0877",
      state: "Paid",
      endingSoon: false,
      channel: "In the shop and online",
      lines: [
        "Sold for HK$6,500.00",
        "Sold 2 Oct 2026",
        "Your payout HK$5,525.00",
        "Paid on 9 Oct 2026",
      ],
    },
  ],
  terms: {
    pinned: "Schedule v3, pinned when your agreement was prepared",
    term: "90 days on sale",
    returnWindow: "7 days after a store sale; 3 days after a lot is delivered",
    storeCommission: [
      "15% up to HK$10,000.00",
      "12% up to HK$50,000.00",
      "10% above that",
    ],
    auctionCommission: "12% of the hammer",
    minimum: [
      { label: "In the shop and online", value: "HK$200.00" },
      { label: "At auction", value: "None" },
    ],
    fees: "Listing None · return HK$100.00 · early take-back HK$300.00",
    whenPaid: [
      { label: "In the shop and online", value: "After the return window" },
      { label: "At auction", value: "At the sale" },
    ],
  },
  seller: "Shown as Kowloon Cards",
  payouts: [
    {
      id: "2026-10-09-FPS 9876-552500",
      line: "HK$5,525.00 on 9 Oct 2026 to FPS 9876",
      parts: [
        {
          id: "G10-0877-552500",
          text: "G10-0877 · Pikachu Illustrator Promo · HK$5,525.00",
        },
      ],
    },
  ],
  documents: [
    {
      id: "CR-2026-0042",
      title: "Consignment receipt",
      note: "CR-2026-0042 · signed 1 Oct 2026",
    },
    {
      id: "CA-2026-0042",
      title: "Consignment agreement",
      note: "CA-2026-0042 · signed 1 Oct 2026",
    },
    {
      id: "PS-2026-0042-1",
      title: "Payout statement",
      note: "PS-2026-0042-1 · prepared 9 Oct 2026, not signed yet",
    },
  ],
  messages: [
    { id: "received-1", line: "We have your items · 1 Oct 2026" },
    {
      id: "agreementSigned-2",
      line: "Your consignment agreement is signed · 1 Oct 2026",
    },
    { id: "onSale-3", line: "Your items are on sale · 2 Oct 2026" },
    { id: "sold-4", line: "Your item sold · 2 Oct 2026" },
    { id: "paid-5", line: "You have been paid · 9 Oct 2026" },
  ],
};

/** A consignment that ended unsold, waiting on the consignor's choice. */
const MY_CONSIGNMENT_ENDED: MyConsignmentDetailView = {
  ...MY_CONSIGNMENT,
  heading: "Consignment CN-2026-0019",
  opened: "Opened 4 May 2026",
  status: "Ended: choose what happens next",
  ended: true,
  paid: undefined,
  items: [
    {
      id: "G10-0640",
      title: "Gengar Fossil Holo",
      labelCode: "G10-0640",
      state: "Ended unsold",
      endingSoon: false,
      channel: "In the shop and online",
      lines: ["List price HK$3,200.00"],
    },
  ],
  seller:
    "You agreed to be named as Kowloon Cards. Grade10 has not turned it on.",
  payouts: [],
  documents: [MY_CONSIGNMENT.documents[1]].filter((row) => row !== undefined),
  messages: [
    { id: "endedUnsold-1", line: "Your consignment ended unsold · 2 Aug 2026" },
  ],
};

export {
  MY_CONSIGNMENT,
  MY_CONSIGNMENT_COPY,
  MY_CONSIGNMENT_ENDED,
  MY_CONSIGNMENT_STORY_ID,
  MY_CONSIGNMENTS,
  MY_CONSIGNMENTS_COPY,
  MY_CONSIGNMENTS_STORY_ID,
};
