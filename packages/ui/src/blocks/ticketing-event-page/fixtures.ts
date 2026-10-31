import type { NoteListItem } from "../page-blocks/note-list";
import type { EventGoodToKnowCopy } from "./event-good-to-know";
import type { EventOrderSummaryCopy } from "./event-order-summary";
import type { EventPageMessageCopy } from "./event-page-state";
import type { EventPhoneOrderBarCopy } from "./event-phone-order-bar";
import type { FastPassControlCopy } from "./fast-pass-control";
import type { EventPassPerk } from "./types";

/* Draft English from the Main, MainPhone and EventPhone boards; the page
 * passes the `ticketing` catalog's words. */

export const WAS = { was: "Was" };

export const FAST_PASS_COPY: FastPassControlCopy = {
  title: "Fast Pass",
  body: "Skip the long entrance queue at the venue. One Fast Pass covers one person for one day.",
  add: "Fast Pass",
  addLabel: "Add Fast Pass for {who}, {days}",
  moreLabel: "One more Fast Pass day for {who}",
  fewerLabel: "One fewer Fast Pass day for {who}",
  removeLabel: "Remove Fast Pass for {who}",
  daysLabel: "Fast Pass days for {who}",
  everyoneGroup: "Fast Pass for everyone on this pass",
  eachGroup: "Fast Pass for each ticket",
  splitHint: "Not everyone needs it?",
  split: "Choose per person",
  joinHint: "Everyone needs it?",
  join: "Same for everyone",
};

export const ORDER_COPY: EventOrderSummaryCopy = {
  title: "Your Order",
  empty:
    "Choose how many of each pass. You pay on the next step, by card or WeChat Pay.",
  continue: "Continue",
  was: "Was",
  remove: "Remove {line}",
  fastPassPrompt: "Skip the queue with Fast Pass",
};

export const BAR_COPY: EventPhoneOrderBarCopy = {
  region: "Order total",
  continue: "Continue",
  youSave: "You save {amount}",
};

export const GOOD_TO_KNOW_COPY: EventGoodToKnowCopy = {
  label: "Good to know",
};

export const NOTES: readonly NoteListItem[] = [
  {
    id: "qr",
    content:
      "One code per ticket. It lets you in once on each day your pass covers.",
  },
  {
    id: "mail",
    content:
      "Your tickets arrive by email as one PDF. It works with no signal at the door.",
  },
  {
    id: "fast",
    content:
      "Fast Pass skips the entrance queue on the days you use it. VIP includes it every day.",
  },
  { id: "refund", content: "[Refund policy, one line: Product]" },
];

/** The VIP perks: no wristband (the PRD drops it). */
export const VIP_PERKS: readonly EventPassPerk[] = [
  {
    id: "fast",
    kind: "fastPass",
    lead: "Fast Pass every day, included.",
    text: "Skip the entrance queue both days.",
  },
  { id: "days", kind: "check", text: "Both days, Sat 12 and Sun 13 Dec" },
  { id: "more", kind: "check", text: "[More VIP perks, if any: Product]" },
];

export const LIMIT_NOTE = "One email can buy up to 8 tickets for this event.";

export const MISSING_COPY: EventPageMessageCopy = {
  title: "We can’t find this event",
  body: "If it was sent to you as a preview, sign in to see it. Otherwise the link may be wrong.",
  signIn: "Sign In",
  seeShows: "See the Shows",
};

export const MISSING_SIGNED_IN_COPY: EventPageMessageCopy = {
  title: "We can’t find this event",
  body: "The link may be wrong, or the event has been taken down.",
  seeShows: "See the Shows",
};

export const CLOSED_COPY: EventPageMessageCopy = {
  title: "This event isn’t open to you yet",
  body: "It’s on sale to a few people before the public sale. Check the shows for when it opens to everyone.",
  seeShows: "See the Shows",
};
