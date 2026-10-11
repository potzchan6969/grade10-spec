/**
 * What a consignor reads of their own consignments, display-ready: every
 * value arrives formatted and every sentence that carries a value arrives
 * already said, so the blocks place words and never compose them.
 */

/** One consignment on the consignor's list. */
type MyConsignmentSummary = {
  /** The reference, as the consignor's emails print it. */
  ref: string;
  /** The card's title, the reference in it. */
  heading: string;
  /** Where the consignment stands. */
  status: string;
  /** When, and where, it was opened. */
  opened: string;
  /** How many items it holds. */
  itemCount: string;
  /** What is owed to the consignor; omitted when nothing is. */
  owed?: string;
  /** What was paid to the consignor; omitted when nothing was. */
  paid?: string;
};

/** One item of a consignment. */
type MyConsignmentItemView = {
  /** Stable among the consignment's items. */
  id: string;
  title: string;
  labelCode?: string;
  /** Where the item stands. */
  state: string;
  endingSoon: boolean;
  /** The channel it sells through; omitted before one is chosen. */
  channel?: string;
  /** Its price, payout and dates, one line each, in reading order. */
  lines: readonly string[];
};

/** A label and its value, read as `label: value`. */
type MyConsignmentChannelValue = { label: string; value: string };

/** The terms pinned to a consignment, each value said. */
type MyConsignmentTermsView = {
  /** The schedule's version and when it was pinned. */
  pinned: string;
  term: string;
  returnWindow: string;
  /** The store bands, one line each; none reads as not set. */
  storeCommission: readonly string[];
  /** The auction rate; null reads as not set. */
  auctionCommission: string | null;
  minimum: readonly MyConsignmentChannelValue[];
  fees: string;
  whenPaid: readonly MyConsignmentChannelValue[];
};

/** One payout: its line, and each item it paid for. */
type MyConsignmentPayoutView = {
  id: string;
  line: string;
  parts: readonly { id: string; text: string }[];
};

/** One document the consignment holds. */
type MyConsignmentDocumentView = { id: string; title: string; note: string };

/** One email the consignor was sent. */
type MyConsignmentMessageView = { id: string; line: string };

/** One consignment, everything the consignor reads of it. */
type MyConsignmentDetailView = {
  heading: string;
  opened: string;
  status: string;
  /** Whether it ended unsold, so the status warns and the rail says so. */
  ended: boolean;
  owed?: string;
  paid?: string;
  /** The id of the stage reached, one of the copy's stages. */
  stage: string;
  items: readonly MyConsignmentItemView[];
  /** Null until the agreement is prepared. */
  terms: MyConsignmentTermsView | null;
  /** Whether, and how, the store names the consignor. */
  seller: string;
  payouts: readonly MyConsignmentPayoutView[];
  documents: readonly MyConsignmentDocumentView[];
  messages: readonly MyConsignmentMessageView[];
};

/** The consignor's list, as its read stands. */
type MyConsignmentsState =
  | { status: "signedOut" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: readonly MyConsignmentSummary[] };

/** One consignment, as its read stands; one not theirs reads as not found. */
type MyConsignmentState =
  | { status: "signedOut" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "notFound" }
  | { status: "ready"; data: MyConsignmentDetailView };

export type {
  MyConsignmentChannelValue,
  MyConsignmentDetailView,
  MyConsignmentDocumentView,
  MyConsignmentItemView,
  MyConsignmentMessageView,
  MyConsignmentPayoutView,
  MyConsignmentState,
  MyConsignmentSummary,
  MyConsignmentsState,
  MyConsignmentTermsView,
};
