import type {
  EventOrderSummaryCopy,
  EventPhoneOrderBarCopy,
  FastPassControlCopy,
  TicketCheckoutLine,
  TicketCheckoutOrderCopy,
  TicketCheckoutRefusalNoticeCopy,
  TicketDetailsStepCopy,
  TicketPromoCodeFieldCopy,
  TicketReviewStepCopy,
} from "@grade10/ui";
import { BUYER, hkd, SHOW, T, t } from "../ticketing-words";

/* What the buying screens pass their blocks, every word from the
 * `ticketing` catalog. Prices and the stand-in order are the boards'. */

export const PASS_COPY = {
  was: T.common.was,
};

export const FAST_PASS_COPY: FastPassControlCopy = {
  title: T.event.fastPass.title,
  body: T.event.fastPass.body,
  add: T.event.fastPass.add,
  addLabel: T.event.fastPass.addLabel,
  moreLabel: T.event.fastPass.oneMore,
  fewerLabel: T.event.fastPass.oneFewer,
  removeLabel: T.event.fastPass.remove,
  daysLabel: T.event.fastPass.daysGroup,
  everyoneGroup: T.event.fastPass.everyoneGroup,
  eachGroup: T.event.fastPass.eachGroup,
  splitHint: T.event.fastPass.notEveryoneNeedsIt,
  split: T.event.fastPass.choosePerPerson,
  joinHint: T.event.fastPass.everyoneNeedsIt,
  join: T.event.fastPass.sameForEveryone,
};

export const ORDER_COPY: EventOrderSummaryCopy = {
  title: T.event.order.title,
  empty: T.event.order.intro,
  continue: T.event.order.continue,
  was: PASS_COPY.was,
  remove: T.event.order.removeLine,
  fastPassPrompt: T.event.order.upsellTitle,
};

export const BAR_COPY: EventPhoneOrderBarCopy = {
  region: T.event.order.totalLabel,
  continue: T.event.order.continue,
  youSave: T.event.order.youSave,
};

export const GOOD_TO_KNOW_NOTES = [
  { id: "qr", content: T.event.goodToKnow.oneCode },
  { id: "mail", content: T.event.goodToKnow.pdf },
  { id: "fast", content: T.event.goodToKnow.fastPass },
  /* ❓ The refund policy line is Product's; the catalog has no key yet. */
  { id: "refund", content: "[Refund policy, one line: Product]" },
] as const;

/** Under the step titles: the show and its days. */
export const SUBTITLE = t(T.summary.eventLine, {
  event: SHOW.name,
  dates: SHOW.shortDays,
});

export const DETAILS_COPY: TicketDetailsStepCopy = {
  back: T.details.back,
  title: T.details.title,
  buyer: T.details.buyerLabel,
  haveAccount: T.details.haveAccount,
  signIn: T.details.signIn,
  name: T.details.name.label,
  namePlaceholder: T.details.name.placeholder,
  email: T.details.email.label,
  emailPlaceholder: T.details.email.placeholder,
  emailHint: T.details.email.hint,
  accountEmailHint: T.details.email.hintSignedIn,
  notYou: T.details.email.notYou,
  nameMissing: T.details.name.required,
  emailInvalid: T.details.email.invalid,
  fixOne: t(T.details.fieldsWrong, { count: 1 }),
  fixBoth: t(T.details.fieldsWrong, { count: 2 }),
  continue: T.details.continue,
};

export const CHECKOUT_ORDER_COPY: TicketCheckoutOrderCopy = {
  title: T.summary.title,
  total: T.summary.total,
};

export const PROMO_COPY: TicketPromoCodeFieldCopy = {
  label: T.promo.label,
  placeholder: T.promo.placeholder,
  apply: T.promo.apply,
};

export const reviewCopy = (signedIn: boolean): TicketReviewStepCopy => ({
  back: T.review.back,
  title: T.review.title,
  details: T.details.title,
  edit: T.review.edit,
  editLabel: T.review.editDetails,
  name: T.review.name,
  email: T.review.email,
  emailHint: signedIn ? T.review.emailNoteSignedIn : T.review.emailNote,
  notesLabel: T.review.notes.title,
  agreeFirst: T.review.notAgreedBar,
  slow: T.review.slow,
  opening: T.review.opening,
  agreement: {
    label: T.review.agreementLabel,
    detail: signedIn
      ? T.review.agreeSignedInNote
      : t(T.review.agreeGuestNote, { email: BUYER.email }),
    required: T.review.notAgreed,
  },
});

/** The boards' order: two adults and a child on the Two-Day pass, early
 * bird, with Fast Pass for both days on two of them. */
export const ORDER_LINES: readonly TicketCheckoutLine[] = [
  {
    id: "adult2",
    title: t(T.summary.line, {
      pass: "General Pass (Two-Day), Adult",
      quantity: 2,
    }),
    details: [
      t(T.summary.earlyBird, { amount: hkd(380) }),
      t(T.summary.fastPass, { days: 2, amount: hkd(200) }),
    ],
    amount: hkd(960),
  },
  {
    id: "child2",
    title: t(T.summary.line, {
      pass: "General Pass (Two-Day), Child",
      quantity: 1,
    }),
    details: [t(T.summary.earlyBird, { amount: hkd(190) })],
    amount: hkd(190),
  },
];
export const ORDER_TOTAL = 1150;

/** The same order after the early bird ended at 23:59 while the buyer was
 * here. */
export const ORDER_LINES_FULL: readonly TicketCheckoutLine[] = [
  {
    id: "adult2",
    title: ORDER_LINES[0]?.title ?? "",
    details: [
      t(T.summary.was, { amount: hkd(480), was: hkd(380) }),
      t(T.summary.fastPass, { days: 2, amount: hkd(200) }),
    ],
    amount: hkd(1160),
  },
  {
    id: "child2",
    title: ORDER_LINES[1]?.title ?? "",
    details: [t(T.summary.was, { amount: hkd(240), was: hkd(190) })],
    amount: hkd(240),
  },
];
export const ORDER_TOTAL_FULL = 1400;

/** A free order: two passes given with CREW4. */
export const ORDER_LINES_FREE: readonly TicketCheckoutLine[] = [
  {
    id: "adult2",
    title: t(T.summary.line, {
      pass: "General Pass (Two-Day), Adult",
      quantity: 2,
    }),
    promoNote: t(T.promo.freeWith, { code: "CREW4" }),
    amount: T.summary.free,
  },
];

/** Points from what is paid: one for each HK$10. */
export const pointsFor = (paid: number) =>
  Math.floor(paid / 10).toLocaleString("en-US");

export type RefusalAction =
  | "pay"
  | "backToPasses"
  | "seeTheEvent"
  | "seeTheShows"
  | "signIn"
  | "tryAgain";

export type Refusal = {
  /** The `TicketingFailureCode` the checkout answered. */
  code: string;
  copy: TicketCheckoutRefusalNoticeCopy;
  action?: RefusalAction;
};

const R = T.refusals;

/** Every refusal the checkout can answer instead of a payment page, worded
 * as `words-keys.md` maps each code. */
export const REFUSALS: readonly Refusal[] = [
  { code: "CHECKOUT_BUSY", copy: R.checkoutBusy, action: "pay" },
  { code: "CHECKOUT_PENDING", copy: R.checkoutPending, action: "pay" },
  { code: "SOLD_OUT", copy: R.soldOut, action: "backToPasses" },
  {
    code: "SOLD_OUT (some left)",
    copy: {
      title: t(R.soldOutSome.title, { count: 2 }),
      body: t(R.soldOutSome.body, { count: 2 }),
    },
    action: "backToPasses",
  },
  {
    code: "TYPE_NOT_ON_SALE (not started)",
    copy: {
      title: t(R.typeNotStarted.title, { time: "12:00", date: "Mon 16 Nov" }),
    },
    action: "backToPasses",
  },
  {
    code: "TYPE_NOT_ON_SALE (paused)",
    copy: R.typePaused,
    action: "backToPasses",
  },
  {
    code: "TYPE_NOT_ON_SALE (ended)",
    copy: R.typeEnded,
    action: "backToPasses",
  },
  { code: "EVENT_NOT_ON_SALE", copy: R.eventNotOnSale, action: "seeTheEvent" },
  { code: "TYPE_NOT_FOUND", copy: R.notFound, action: "backToPasses" },
  {
    code: "ACCOUNT_LIMIT (guest)",
    copy: { title: t(R.accountLimitGuest.title, { limit: SHOW.limit }) },
    action: "backToPasses",
  },
  {
    code: "ACCOUNT_LIMIT (signed in)",
    copy: {
      title: t(R.accountLimitSignedIn.title, {
        held: 6,
        limit: SHOW.limit,
        left: 2,
      }),
    },
    action: "backToPasses",
  },
  {
    code: "NOT_OPEN_TO_YOU_YET",
    copy: {
      title: R.notOpenToYouYet.title,
      body: t(R.notOpenToYouYet.body, { time: "12:00", date: "Mon 16 Nov" }),
    },
    action: "backToPasses",
  },
  {
    code: "NOT_OPEN_TO_YOU_YET (no public sale)",
    copy: R.notOpenToYou,
    action: "backToPasses",
  },
  {
    code: "ACCESS_LIMIT",
    copy: { title: t(R.accessLimit.title, { count: 4 }) },
    action: "backToPasses",
  },
  { code: "NOT_IN_AUDIENCE", copy: R.notInAudience, action: "seeTheShows" },
  {
    code: "FAST_PASS_UNAVAILABLE",
    copy: R.fastPassUnavailable,
    action: "backToPasses",
  },
  { code: "Signed out mid-checkout", copy: R.signedOut, action: "signIn" },
  { code: "CHALLENGE_FAILED", copy: R.challengeFailed, action: "pay" },
  {
    code: "CHECKOUT_UNAVAILABLE",
    copy: R.checkoutUnavailable,
    action: "tryAgain",
  },
  { code: "PAYMENT_UNAVAILABLE", copy: R.paymentUnavailable },
  { code: "TICKETING_CLOSED", copy: R.ticketingClosed },
  { code: "NOTHING_SELECTED", copy: R.chooseAgain, action: "backToPasses" },
  { code: "Anything else", copy: R.generic, action: "tryAgain" },
];

export const REFUSAL_ACTIONS: Record<
  RefusalAction,
  { label: string; tone: "primary" | "outline" }
> = {
  pay: { label: R.actions.pay, tone: "primary" },
  backToPasses: { label: R.actions.backToPasses, tone: "outline" },
  seeTheEvent: { label: R.actions.seeTheEvent, tone: "outline" },
  seeTheShows: { label: R.actions.seeTheShows, tone: "outline" },
  signIn: { label: R.actions.signIn, tone: "primary" },
  tryAgain: { label: R.actions.tryAgain, tone: "primary" },
};
