/* Stand-in data for the checkout stories, in the boards' words. The site
 * passes its own from `@grade10/i18n`. */
import type { NoteListItem } from "../page-blocks/note-list";
import type { TicketCheckoutOrderCopy } from "./ticket-checkout-order";
import type { TicketCheckoutRefusalNoticeProps } from "./ticket-checkout-refusal-notice";
import type { TicketDetailsStepCopy } from "./ticket-details-step";
import type { TicketPromoCodeFieldCopy } from "./ticket-promo-code-field";
import type { TicketReviewStepCopy } from "./ticket-review-step";
import type { TicketCheckoutLine } from "./types";

const SUBTITLE = "[Show Name]: Sat 12 and Sun 13 Dec 2026";
const EMAIL = "alex.chan@example.com";

const ORDER_COPY: TicketCheckoutOrderCopy = {
  title: "Your Order",
  total: "Total",
};

const LINES: readonly TicketCheckoutLine[] = [
  {
    id: "adult-fast",
    title: "General Pass (Two-Day), Adult × 1",
    details: ["HK$380.00, early bird", "Fast Pass, 2 days: HK$200.00"],
    amount: "HK$580.00",
  },
  {
    id: "adult",
    title: "General Pass (Two-Day), Adult × 1",
    details: ["HK$380.00, early bird"],
    amount: "HK$380.00",
  },
  {
    id: "child",
    title: "General Pass (Two-Day), Child × 1",
    details: ["HK$190.00, early bird"],
    amount: "HK$190.00",
  },
];

/** The early-bird period ended while the buyer was on Check Your Order. */
const LINES_FULL_PRICE: readonly TicketCheckoutLine[] = [
  {
    id: "adult-fast",
    title: "General Pass (Two-Day), Adult × 1",
    details: ["HK$480.00, was HK$380.00", "Fast Pass, 2 days: HK$200.00"],
    amount: "HK$680.00",
  },
  {
    id: "adult",
    title: "General Pass (Two-Day), Adult × 1",
    details: ["HK$480.00, was HK$380.00"],
    amount: "HK$480.00",
  },
  {
    id: "child",
    title: "General Pass (Two-Day), Child × 1",
    details: ["HK$240.00, was HK$190.00"],
    amount: "HK$240.00",
  },
];

/** CREW4 with 2 left: the dearest two go free. */
const LINES_TWO_FREE: readonly TicketCheckoutLine[] = [
  { ...LINES[0], promoNote: "Free with CREW4" },
  { ...LINES[1], promoNote: "Free with CREW4" },
  LINES[2],
];

/** A pass that costs nothing. */
const LINES_FREE: readonly TicketCheckoutLine[] = [
  {
    id: "crew",
    title: "Crew Pass, Two Days × 2",
    details: ["Fast Pass included."],
    amount: "Free",
  },
];

/** One adult with Fast Pass: under WELCOME50's two tickets. */
const LINES_ONE: readonly TicketCheckoutLine[] = [LINES[0]];

const DETAILS_COPY: TicketDetailsStepCopy = {
  back: "Passes",
  title: "Your Details",
  buyer: "Buyer",
  haveAccount: "Have an account?",
  signIn: "Sign In",
  name: "Name on the tickets",
  namePlaceholder: "Your full name",
  email: "Email",
  emailPlaceholder: "name@example.com",
  emailHint: "Your tickets go here. You check it before paying.",
  accountEmailHint: "Your tickets go here. It’s your account’s email.",
  notYou: "Not You?",
  nameMissing: "Enter your name",
  emailInvalid: "Enter an email like name@example.com",
  fixOne: "Check the field above.",
  fixBoth: "Check the 2 fields above.",
  continue: "Continue",
};

const NAME_HINT_PREFILLED =
  "Printed on your tickets. Change it if a friend is coming.";
const NAME_HINT_EMPTY = "The name printed on your tickets";

const GUEST_AGREEMENT_DETAIL = `We keep your tickets and points in a Grade10 account for ${EMAIL}, and make one if there isn’t one yet. Sign in with this email any time to see them.`;
const ACCOUNT_AGREEMENT_DETAIL =
  "Your tickets and the points from this order go to your Grade10 account.";

const REVIEW_COPY: TicketReviewStepCopy = {
  back: "Your Details",
  title: "Check Your Order",
  details: "Your Details",
  edit: "Edit",
  editLabel: "Edit your details",
  name: "Name on the tickets",
  email: "Email",
  emailHint: "Your tickets go here as one PDF. Check it’s right.",
  notesLabel: "Before you pay",
  agreeFirst: "Tick the box to agree first.",
  slow: "Lots of people are buying right now. Still trying.",
  opening: "Opening payment…",
  agreement: {
    label: "Agreement",
    detail: GUEST_AGREEMENT_DETAIL,
    required: "Tick the box to agree before you pay.",
  },
};

const REVIEW_COPY_SIGNED_IN: TicketReviewStepCopy = {
  ...REVIEW_COPY,
  emailHint: "Your account’s email. Your tickets go here as one PDF.",
  agreement: { ...REVIEW_COPY.agreement, detail: ACCOUNT_AGREEMENT_DETAIL },
};

const NOTES_PAID: readonly NoteListItem[] = [
  {
    id: "stripe",
    content: "You pay on Stripe’s secure page, by card or WeChat Pay.",
  },
  {
    id: "hold",
    content: "Your tickets are held for 15 minutes while you pay.",
  },
  {
    id: "pdf",
    content: "They arrive by email as one PDF, with a link to your receipt.",
  },
];

const NOTES_FREE: readonly NoteListItem[] = [
  { id: "pdf", content: "Your tickets arrive by email as one PDF." },
  { id: "nothing", content: "Nothing is charged." },
];

const REFUND_POLICY = "[Refund policy, one line: Product]";

const PROMO_COPY: TicketPromoCodeFieldCopy = {
  label: "Promo code",
  placeholder: "Enter a code",
  apply: "Apply",
};

/** Each sentence a code can be refused with, under the field. */
const PROMO_REFUSALS = {
  notFound: "We can’t find this code. Check the spelling.",
  expired: "EARLY100 ended on Sun 15 Nov 2026.",
  notStarted: "SUMMER10 starts at 10:00 on Tue 1 Dec 2026.",
  conditionNotMet: "WELCOME50 needs at least 2 tickets.",
  alreadyUsed: `SPRING20 was already used with ${EMAIL}.`,
  usedUp: "SPRING20 has been used up.",
  emailsOnly: "PRESS15 is only for the emails it was sent to.",
  tooManyTries: "Too many codes tried. Try again in 10 minutes.",
} as const;

type RefusalCase = {
  /** The board's name for the case. */
  name: string;
  /** The service's answer it dresses. */
  code: string;
} & Pick<TicketCheckoutRefusalNoticeProps, "copy"> & {
    action?: { label: string; tone: "primary" | "outline" };
  };

const BACK = { label: "Back to Passes", tone: "outline" } as const;
const PAY = { label: "Pay", tone: "primary" } as const;

/** Every refusal the checkout can answer with, in the Refusals board's
 * order. Not invited and Over the invitation are now access rules: Not open
 * to you yet and Over your access limit. */
const REFUSALS: readonly RefusalCase[] = [
  {
    name: "Busy, after the page’s own retries",
    code: "CHECKOUT_BUSY",
    copy: {
      title: "Too many people are buying this second.",
      body: "Press Pay again.",
    },
    action: PAY,
  },
  {
    name: "No answer, after the page’s own retries",
    code: "CHECKOUT_PENDING",
    copy: {
      title: "We didn’t hear back.",
      body: "Press Pay again to continue the same order.",
    },
    action: PAY,
  },
  {
    name: "Sold out",
    code: "SOLD_OUT",
    copy: { title: "They sold out just now." },
    action: BACK,
  },
  {
    name: "Fewer left than chosen",
    code: "SOLD_OUT, remaining 2",
    copy: { title: "Only 2 are left.", body: "Choose up to 2." },
    action: BACK,
  },
  {
    name: "Not started",
    code: "TYPE_NOT_ON_SALE, upcoming",
    copy: { title: "Sales for this pass open at 12:00 on 1 Dec." },
    action: BACK,
  },
  {
    name: "Paused",
    code: "TYPE_NOT_ON_SALE, paused",
    copy: { title: "Sales for this pass are paused right now." },
    action: BACK,
  },
  {
    name: "Pass ended",
    code: "TYPE_NOT_ON_SALE, ended",
    copy: { title: "Sales for this pass have ended." },
    action: BACK,
  },
  {
    name: "Event off sale",
    code: "EVENT_NOT_ON_SALE",
    copy: { title: "This event isn’t on sale anymore." },
    action: { label: "See the Event", tone: "outline" },
  },
  {
    name: "Pass or event gone",
    code: "TYPE_NOT_FOUND, EVENT_NOT_FOUND",
    copy: { title: "This pass isn’t available anymore." },
    action: BACK,
  },
  {
    name: "Over the limit, guest",
    code: "ACCOUNT_LIMIT, guest",
    copy: { title: "One email can hold up to 8 tickets for this event." },
    action: BACK,
  },
  {
    name: "Over the limit, signed in",
    code: "ACCOUNT_LIMIT, signed in",
    copy: {
      title:
        "You hold 6 of the 8 tickets one email can hold, so choose up to 2.",
    },
    action: BACK,
  },
  {
    name: "Not open to you yet",
    code: "NOT_OPEN_TO_YOU_YET",
    copy: { title: "This pass isn’t open to your email yet." },
    action: BACK,
  },
  {
    name: "Over your access limit",
    code: "ACCESS_LIMIT",
    copy: { title: "Your access lets this email hold 2 of this pass." },
    action: BACK,
  },
  {
    name: "Not for you",
    code: "NOT_IN_AUDIENCE",
    copy: { title: "This event isn’t open to this account yet." },
    action: { label: "See the Shows", tone: "outline" },
  },
  {
    name: "Fast Pass unavailable",
    code: "FAST_PASS_UNAVAILABLE",
    copy: { title: "Fast Pass isn’t available on this pass anymore." },
    action: BACK,
  },
  {
    name: "Signed out meanwhile",
    code: "Session ended",
    copy: {
      title: "You were signed out.",
      body: "Sign in again, or buy with your name and email.",
    },
    action: { label: "Sign In", tone: "outline" },
  },
  {
    name: "Bot check failed",
    code: "CHALLENGE_FAILED",
    copy: {
      title: "We couldn’t check you’re not a bot.",
      body: "Press Pay again.",
    },
    action: PAY,
  },
  {
    name: "Payment page failed",
    code: "CHECKOUT_UNAVAILABLE",
    copy: { title: "We couldn’t open the payment page, and nothing is held." },
    action: { label: "Try Again", tone: "primary" },
  },
  {
    name: "Payment unavailable",
    code: "PAYMENT_UNAVAILABLE",
    copy: {
      title: "Payment isn’t available right now.",
      body: "Nothing was charged.",
    },
  },
  {
    name: "Sales closed",
    code: "TICKETING_CLOSED",
    copy: { title: "Ticket sales are closed right now." },
  },
  {
    name: "Nothing chosen or repeated",
    code: "NOTHING_SELECTED, TYPE_REPEATED, IDEMPOTENCY_KEY_REUSED",
    copy: { title: "Choose your tickets again." },
    action: BACK,
  },
];

export type { RefusalCase };
export {
  ACCOUNT_AGREEMENT_DETAIL,
  DETAILS_COPY,
  EMAIL,
  GUEST_AGREEMENT_DETAIL,
  LINES,
  LINES_FREE,
  LINES_FULL_PRICE,
  LINES_ONE,
  LINES_TWO_FREE,
  NAME_HINT_EMPTY,
  NAME_HINT_PREFILLED,
  NOTES_FREE,
  NOTES_PAID,
  ORDER_COPY,
  PROMO_COPY,
  PROMO_REFUSALS,
  REFUND_POLICY,
  REFUSALS,
  REVIEW_COPY,
  REVIEW_COPY_SIGNED_IN,
  SUBTITLE,
};
