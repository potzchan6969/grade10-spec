import type { StageRailStage } from "../page-blocks/stage-rail";
import type { ConsignmentSellerLineCopy } from "./consignment-seller-line";
import type { MyConsignmentCardCopy } from "./my-consignment-card";
import type { MyConsignmentDetailCopy } from "./my-consignment-detail";
import type { MyConsignmentItemCopy } from "./my-consignment-item";
import type { MyConsignmentListCopy } from "./my-consignment-list";
import type { MyConsignmentRecordCopy } from "./my-consignment-record";
import type { MyConsignmentTermsCopy } from "./my-consignment-terms";
import type { MyConsignmentsFailedCopy } from "./my-consignments-failed";
import type { MyConsignmentsSignInCopy } from "./my-consignments-sign-in";
import type {
  MyConsignmentDetailView,
  MyConsignmentItemView,
  MyConsignmentSummary,
  MyConsignmentTermsView,
} from "./types";

/** The consignor's rail, in the order a consignment walks it. */
export const MINE_STAGE_LABELS: readonly StageRailStage[] = [
  { id: "asked", label: "Asked" },
  { id: "received", label: "Received" },
  { id: "terms", label: "Terms" },
  { id: "signed", label: "Signed" },
  { id: "onSale", label: "On sale" },
  { id: "sold", label: "Sold" },
  { id: "paid", label: "Paid" },
];

export const MINE_SIGN_IN_COPY: MyConsignmentsSignInCopy = {
  title: "Sign in to see your consignments",
  body: "Your consignments are listed under your Grade10 account.",
  signIn: "Sign in",
};

export const MINE_FAILED_COPY: MyConsignmentsFailedCopy = {
  message: "Your consignments did not load.",
  retry: "Try again",
};

export const MINE_CARD_COPY: MyConsignmentCardCopy = {
  items: "Your items",
  owed: "Your payout",
  paid: "Payouts",
  open: "Open",
};

export const MINE_LIST_COPY: MyConsignmentListCopy = {
  loading: "Loading your consignments…",
  failed: MINE_FAILED_COPY,
  emptyTitle: "Nothing consigned yet",
  emptyBody:
    "Bring a card to a Grade10 counter to sell it in the shop or at auction. It shows here once it is with us.",
  signIn: MINE_SIGN_IN_COPY,
  card: MINE_CARD_COPY,
};

export const MINE_ITEM_COPY: MyConsignmentItemCopy = {
  endingSoon: "Ending soon",
};

export const MINE_TERMS_COPY: MyConsignmentTermsCopy = {
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
};

export const MINE_DETAIL_COPY: MyConsignmentDetailCopy = {
  stages: MINE_STAGE_LABELS,
  ended: "Ended unsold",
  itemsTitle: "Your items",
  item: MINE_ITEM_COPY,
  terms: MINE_TERMS_COPY,
  sellerTitle: "Your name on the store",
  payoutsTitle: "Payouts",
  noPayouts: "No payout yet. You are paid after each sale’s return window.",
  documentsTitle: "Your documents",
  documentsNote:
    "Your sealed copies come by email. Ask at the counter for another.",
  noDocuments: "No document yet.",
  messagesTitle: "Emails we sent you",
  noMessages: "No email yet.",
};

export const MINE_RECORD_COPY: MyConsignmentRecordCopy = {
  back: "Your consignments",
  loading: "Loading your consignments…",
  failed: MINE_FAILED_COPY,
  notFoundTitle: "We could not find that consignment",
  notFoundBody:
    "It may belong to another account. Check the reference in your email.",
  signIn: MINE_SIGN_IN_COPY,
  detail: MINE_DETAIL_COPY,
};

export const SELLER_LINE_STORE_COPY: ConsignmentSellerLineCopy = {
  line: "Sold by Kowloon Cards",
  note: "A collector selling through Grade10. We hold the card, take payment and handle returns.",
};

export const SELLER_LINE_LOT_COPY: ConsignmentSellerLineCopy = {
  line: "Consigned by Kowloon Cards",
  note: "Selling through Grade10 Auctions. We hold the card, take payment and deliver it.",
};

/** Newest first, as the list reads. */
export const MINE_SUMMARIES: readonly MyConsignmentSummary[] = [
  {
    ref: "CN-2026-0042",
    heading: "Consignment CN-2026-0042",
    status: "On sale",
    opened: "Opened 1 Oct 2026 at Central",
    itemCount: "2 items",
  },
  {
    ref: "CN-2026-0031",
    heading: "Consignment CN-2026-0031",
    status: "Payout on its way",
    opened: "Opened 12 Aug 2026 at Causeway Bay",
    itemCount: "1 item",
    owed: "Owed to you: HK$5,525.00",
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

export const ON_SALE_ITEM: MyConsignmentItemView = {
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
};

export const AUCTION_ITEM: MyConsignmentItemView = {
  id: "G10-1002",
  title: "Blastoise 1st Edition",
  labelCode: "G10-1002",
  state: "On sale",
  endingSoon: true,
  channel: "At auction",
  lines: ["Reserve HK$12,000.00", "On sale until 18 Oct 2026"],
};

export const SOLD_ITEM: MyConsignmentItemView = {
  id: "G10-0877",
  title: "Pikachu Illustrator Promo",
  labelCode: "G10-0877",
  state: "Payout on its way",
  endingSoon: false,
  channel: "In the shop and online",
  lines: [
    "Sold for HK$6,500.00",
    "Sold 20 Sep 2026",
    "Your payout HK$5,525.00",
    "Due 4 Oct 2026",
  ],
};

export const NOT_PRICED_ITEM: MyConsignmentItemView = {
  id: "Mew Promo-0",
  title: "Mew Promo",
  state: "Received",
  endingSoon: false,
  lines: ["Not priced yet"],
};

export const PINNED_TERMS: MyConsignmentTermsView = {
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
};

/** On sale, terms pinned, named on the store, one payout, two documents. */
export const MINE_DETAIL: MyConsignmentDetailView = {
  heading: "Consignment CN-2026-0042",
  opened: "Opened 1 Oct 2026 at Central",
  status: "On sale",
  ended: false,
  paid: "Paid to you: HK$5,525.00",
  stage: "onSale",
  items: [ON_SALE_ITEM, AUCTION_ITEM, SOLD_ITEM],
  terms: PINNED_TERMS,
  seller: "Shown as Kowloon Cards",
  payouts: [
    {
      id: "2026-10-04-FPS 9876-552500",
      line: "HK$5,525.00 on 4 Oct 2026 to FPS 9876",
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
      note: "CA-2026-0042 · signed 2 Oct 2026",
    },
  ],
  messages: [
    { id: "received-1", line: "We have your items · 1 Oct 2026" },
    {
      id: "agreementSigned-2",
      line: "Your consignment agreement is signed · 2 Oct 2026",
    },
    { id: "onSale-3", line: "Your items are on sale · 3 Oct 2026" },
  ],
};

/** Just received: nothing priced, pinned, paid, signed or sent. */
export const MINE_DETAIL_FRESH: MyConsignmentDetailView = {
  heading: "Consignment CN-2026-0051",
  opened: "Opened 10 Oct 2026",
  status: "Received",
  ended: false,
  stage: "terms",
  items: [NOT_PRICED_ITEM],
  terms: null,
  seller: "You are not named on the store.",
  payouts: [],
  documents: [],
  messages: [],
};

/** Ended unsold: the status warns and the rail stops at On sale. */
export const MINE_DETAIL_ENDED: MyConsignmentDetailView = {
  ...MINE_DETAIL,
  heading: "Consignment CN-2026-0019",
  status: "Ended: choose what happens next",
  ended: true,
  paid: undefined,
  items: [{ ...ON_SALE_ITEM, state: "Ended unsold", lines: [] }],
  payouts: [],
  seller:
    "You agreed to be named as Kowloon Cards. Grade10 has not turned it on.",
};
