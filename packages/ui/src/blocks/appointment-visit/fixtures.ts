import type { FactRow } from "../page-blocks/fact-card";
import type { NoteListItem } from "../page-blocks/note-list";
import type { StageRailStage } from "../page-blocks/stage-rail";
import type {
  VisitAct,
  VisitFact,
  VisitFullDayShop,
  VisitLateChoice,
  VisitListRow,
  VisitWaitService,
  VisitWaitShop,
} from "./types";
import type { VisitBodyCopy } from "./visit-body";
import type { VisitBookedPassCopy } from "./visit-booked-pass";
import type { VisitCancelPanelCopy } from "./visit-cancel-panel";
import type { VisitFullDayCopy } from "./visit-full-day";
import type { VisitLatePanelCopy } from "./visit-late-panel";
import type { VisitLinkOpensNothingCopy } from "./visit-link-opens-nothing";
import type { VisitListCopy } from "./visit-list";
import type { VisitMovePanelCopy } from "./visit-move-panel";
import type { VisitPassCopy } from "./visit-pass";
import type { VisitReconnectingCopy } from "./visit-reconnecting";
import type { VisitTicketBodyCopy } from "./visit-ticket-body";
import type { VisitWaitBodyCopy } from "./visit-wait-body";

/** Grading Submission at the Causeway Bay shop, Thu 3 Sep 2026, 10:15 to 10:45. */
const VISIT_CODE = "BK-7QH2K";
const VISIT_SHOP = "Hong Kong Grade10 Store";
const VISIT_ADDRESS = "13 Pak Sha Road, Causeway Bay, Hong Kong";
const VISIT_SERVICE = "Grading Submission";
const VISIT_EMAIL = "alex@example.com";
const MINE_HREF = "#/book/mine";
const BOOK_HREF = "#/book";
const WAIT_HREF = "#/book/wait/causeway-bay";
const DIRECTIONS_HREF = `https://maps.google.com/?q=${encodeURIComponent(`Grade10 ${VISIT_SHOP} ${VISIT_ADDRESS}`)}`;

const VISIT_PASS_COPY: VisitPassCopy = {
  title: "Visit code",
  codeLabel: "Visit code",
  note: "Show it at the counter on the day.",
};

const TODAY_PASS_COPY: VisitPassCopy = {
  title: "Show this at the counter",
  codeLabel: "Visit code",
  line: `${VISIT_SERVICE} · ${VISIT_SHOP} · 10:15 to 10:45`,
};

const CALLED_PASS_COPY: VisitPassCopy = {
  title: "Counter 3",
  codeLabel: "Visit code",
  line: `${VISIT_SERVICE} · ${VISIT_SHOP} · 10:15`,
  note: "We hold the counter for you until 10:25.",
};

const RECONNECTING_COPY: VisitReconnectingCopy = {
  title: "Reconnecting…",
  body: "Updated 10:02. This page tries again by itself.",
  retry: "Try now",
  trying: "Trying…",
};

const VISIT_FACTS: readonly VisitFact[] = [
  {
    label: "When",
    value: "Thu 3 Sep, 10:15 to 10:45",
    sub: "Times in HKT",
  },
  {
    label: "Where",
    value: `Grade10 ${VISIT_SHOP}`,
    sub: `${VISIT_ADDRESS} · Lift to the 2nd floor`,
  },
  { label: "Service", value: VISIT_SERVICE, sub: "30 min" },
  {
    label: "Booked for",
    value: "Alex Chan",
    sub: `${VISIT_EMAIL} · +852 9123 4567`,
  },
  { label: "Shop phone", value: "+852 2345 6789" },
];

const STRUCK_FACTS: readonly VisitFact[] = VISIT_FACTS.map((fact, index) =>
  index === 0 ? { ...fact, struck: true } : fact,
).concat({ label: "Visit code", value: VISIT_CODE, mono: true });

const BEFORE_NOTES: readonly NoteListItem[] = [
  { id: "bring-0", content: "Bring each card in a penny sleeve." },
  { id: "price", content: "Fees are paid at the counter." },
  { id: "hold", content: "We hold your time for 10 min after 10:15." },
];

const TOLD_ROWS: readonly FactRow[] = [
  { label: "Preferred grading company", value: "PSA" },
  { label: "Bringing", value: "Sleeves, Binder" },
];

const DIRECTIONS_ACT: VisitAct = {
  key: "directions",
  label: "Directions",
  href: DIRECTIONS_HREF,
  external: true,
};

const BOOKED_ACTS: readonly VisitAct[] = [
  { key: "move", label: "Change time", onClick: () => {} },
  { key: "cancel", label: "Cancel visit", onClick: () => {} },
  { key: "calendar", label: "Add to calendar", href: "#/book/bk_live.ics" },
  DIRECTIONS_ACT,
];

const TODAY_ACTS: readonly VisitAct[] = [
  { key: "late", label: "Running late", onClick: () => {} },
  DIRECTIONS_ACT,
  { key: "move", label: "Change time", onClick: () => {} },
  { key: "cancel", label: "Cancel visit", onClick: () => {} },
];

const ENDED_ACTS: readonly VisitAct[] = [
  { key: "again", label: "Book again", href: BOOK_HREF, primary: true },
  { key: "mine", label: "My visits", href: MINE_HREF },
];

const VISIT_BODY_WORDS = {
  dismiss: "Dismiss",
  yourVisit: "Your visit",
  before: "Before you come",
  told: "What you told us",
  foot: `We email ${VISIT_EMAIL} about this visit.`,
} as const;

const BOOKED_BODY_COPY: VisitBodyCopy = {
  ...VISIT_BODY_WORDS,
  phase: "Booked",
  note: "in 2 days",
  title: VISIT_SERVICE,
  lede: `Thu 3 Sep, 10:15 to 10:45 HKT at ${VISIT_SHOP}.`,
  pass: VISIT_PASS_COPY,
  footNote: "You can change or cancel until 10:45 on the day.",
};

const TODAY_BODY_COPY: VisitBodyCopy = {
  ...VISIT_BODY_WORDS,
  phase: "Today",
  note: "10:15 · in 1h 15m",
  title: "See you at 10:15",
  lede: `${VISIT_SERVICE} at ${VISIT_SHOP}, ${VISIT_ADDRESS}.`,
  notice: {
    text: "Signal 8 or black rain: we close while it’s up and email you.",
  },
  pass: TODAY_PASS_COPY,
  footNote: "Change or cancel until 10:45. We hold your time until 10:25.",
};

const CALLED_BODY_COPY: VisitBodyCopy = {
  ...VISIT_BODY_WORDS,
  phase: "Counter 3",
  note: "ready at 10:15",
  title: "Counter 3 is ready for you",
  lede: "Go to Counter 3 now and show your pass.",
  pass: CALLED_PASS_COPY,
};

const CANCELLED_BODY_COPY: VisitBodyCopy = {
  ...VISIT_BODY_WORDS,
  phase: "Cancelled by you",
  note: "Tue 1 Sep, 12:00",
  title: "You cancelled this visit",
  lede: `10:15 on Thu 3 Sep is open for others now. We emailed ${VISIT_EMAIL}.`,
  notice: { title: "Your reason", text: "I booked the wrong time" },
  footNote: `Book again starts with ${VISIT_SERVICE} at ${VISIT_SHOP}, with what you told us.`,
};

const PASSED_BODY_COPY: VisitBodyCopy = {
  ...VISIT_BODY_WORDS,
  phase: "Time passed",
  note: "held until 10:25",
  title: "We held your time until 10:25",
  lede: "Come in and wait as a walk-in, or book another time.",
  notice: {
    title: "Walk in now: about 15 to 25 min",
    text: `${VISIT_SERVICE} at ${VISIT_SHOP}. Staff check you in when you arrive.`,
    link: "See the wait",
  },
  pass: {
    ...TODAY_PASS_COPY,
    note: "Show this when you arrive. You wait from when you check in.",
  },
  footNote: `Change or cancel until 10:45. Or book ${VISIT_SERVICE} again right away.`,
};

const LINK_OPENS_NOTHING_COPY: VisitLinkOpensNothingCopy = {
  title: "This link doesn’t open a visit",
  lede: "A visit link opens only the visit it was made for. This one may not open because:",
  missing: "Part of the link is missing. Open it again from the email.",
  older:
    "It’s from an older email. Use the link in the latest email about your visit.",
  moved:
    "The email on the visit was changed, so its links went to the new address.",
  mine: "My visits",
  book: "Book a visit",
  code: "Have your visit code? Staff at any shop can find your visit with it.",
};

const CANCEL_PANEL_COPY: VisitCancelPanelCopy = {
  title: "Cancel your visit?",
  description: `${VISIT_SERVICE} · Thu 3 Sep, 10:15 · ${VISIT_SHOP}`,
  free: "10:15 on Thu 3 Sep opens for others to book.",
  mail: `We’ll email ${VISIT_EMAIL} that it’s cancelled.`,
  why: "Why are you cancelling? (optional)",
  reasons: {
    cant: "I can’t make it",
    wrong: "I booked the wrong time",
    walk: "I’ll walk in instead",
    other: "Something else",
  },
  more: "Tell us more (optional)",
  keep: "Keep my visit",
  cancel: "Cancel visit",
  cancelling: "Cancelling…",
};

const LATE_CHOICES: readonly VisitLateChoice[] = [
  {
    minutes: 10,
    label: "About 10 min",
    detail: "Around 10:25. We keep your time.",
  },
  {
    minutes: 20,
    label: "About 20 min",
    detail:
      "Around 10:35, after we stop holding at 10:25. Check in when you arrive and wait for the next free counter.",
  },
  {
    minutes: 30,
    label: "About 30 min",
    detail:
      "Around 10:45, after we stop holding at 10:25. Check in when you arrive and wait for the next free counter.",
  },
];

const LATE_PANEL_COPY: VisitLatePanelCopy = {
  title: "Running late?",
  description: `Tell ${VISIT_SHOP} about when you’ll arrive. We hold your time until 10:25.`,
  legend: "About how late?",
  send: `Tell ${VISIT_SHOP}: about 10 min`,
  sending: "Sending…",
  close: "Close",
};

const MOVE_PANEL_COPY: VisitMovePanelCopy = {
  title: "Change time",
  description: `${VISIT_SERVICE} at ${VISIT_SHOP} · now Thu 3 Sep, 10:15`,
  confirm: "Pick a time",
  moving: "Moving…",
  keep: "Keep 10:15",
  consequence: `Your visit code stays ${VISIT_CODE}. We’ll email ${VISIT_EMAIL} the new time.`,
};

const BOOKED_PASS_COPY: Omit<VisitBookedPassCopy, "confirmation"> = {
  pass: {
    title: "Booked",
    codeLabel: "Visit code",
    line: "For Alex Chan",
    note: "Show this at the counter on the day.",
  },
  directions: "Directions",
  until: "You can change or cancel until 10:45 on Thu 3 Sep.",
  before: "Before you come",
  getThere: "How to get there",
  another: "Book another visit",
};

const BOOKED_BEFORE: readonly string[] = [
  "Bring each card in a penny sleeve.",
  "We hold your time until 10:30. Running late? Tell us from your visit page.",
  "Fees are paid at the counter.",
];

const GET_THERE_ROWS: readonly FactRow[] = [
  { label: "Shop", value: VISIT_SHOP },
  { label: "Where", value: VISIT_ADDRESS },
  { label: "Directions", value: "Lift to the 2nd floor" },
  { label: "Shop phone", value: "+852 2345 6789" },
];

const FULL_DAY_COPY: VisitFullDayCopy = {
  title: `Today is full at ${VISIT_SHOP}.`,
  earliestEach: "Earliest at each shop",
  noFreeYet: "No free times yet",
  walkIn: {
    title: "Walk in today: about 15 to 25 min",
    body: `No booking needed. Come to ${VISIT_SHOP} and we call you when a counter is free.`,
    seeWait: "See the wait now",
  },
};

const FULL_DAY_SHOPS: readonly VisitFullDayShop[] = [
  { id: "loc_causeway_bay", name: VISIT_SHOP, earliest: "Tomorrow, 10:00" },
  { id: "loc_central", name: "Central", earliest: "Today, 16:30" },
  { id: "loc_mong_kok", name: "Mong Kok" },
];

const LIST_COPY: VisitListCopy = {
  upcoming: "Upcoming",
  past: "Past",
  open: "Open",
};

const UPCOMING_ROWS: readonly VisitListRow[] = [
  {
    id: "bk_live",
    service: VISIT_SERVICE,
    status: "Booked",
    code: VISIT_CODE,
    location: VISIT_SHOP,
    when: "3 Sep 2026, 10:15–10:45",
  },
  {
    id: "bk_later",
    service: "Store/Auction Listing",
    status: "Booked",
    code: "BK-3MD8P",
    location: VISIT_SHOP,
    when: "10 Sep 2026, 14:00–15:00",
  },
];

const PAST_ROWS: readonly VisitListRow[] = [
  {
    id: "bk_done",
    service: VISIT_SERVICE,
    status: "Completed",
    location: VISIT_SHOP,
    when: "24 Aug 2026, 10:00–10:30",
  },
  {
    id: "bk_cancelled",
    service: VISIT_SERVICE,
    status: "Cancelled by you",
    location: VISIT_SHOP,
    when: "5 Aug 2026, 11:00–11:30",
  },
];

const WAIT_COPY: VisitWaitBodyCopy = {
  walkIn: "Walk in",
  shop: VISIT_SHOP,
  place: `${VISIT_ADDRESS} · Lift to the 2nd floor`,
  status: "Open now",
  hours: "Today 10:00 to 19:00",
  waitNow: "Walk-in wait now",
  book: "Book",
  openToday: "Open today",
  how: "To walk in, tell us at the counter. We send a ticket link to your phone or email, and we’ll WhatsApp you when you’re next.",
  updated: "Updated 12:00 · times in HKT",
  bookTime: "Book a time",
};

const WAIT_SERVICES: readonly VisitWaitService[] = [
  {
    id: "svc_grading",
    name: VISIT_SERVICE,
    sub: "Cards to be graded",
    wait: { estimate: "About 15 to 25 min", waiting: "3 waiting" },
  },
  {
    id: "svc_vault_drop_off",
    name: "Vault Drop-Off",
    sub: "Items for the vault",
    wait: { estimate: "About 5 to 10 min", waiting: "Nobody waiting" },
  },
  {
    id: "svc_consultation",
    name: "Store/Auction Listing",
    sub: "Booked only",
    book: {
      href: "#/book?service=consultation",
      label: "Book a time for Store/Auction Listing",
    },
  },
];

const PAUSED_SERVICES: readonly VisitWaitService[] = WAIT_SERVICES.map((row) =>
  row.book ? row : { id: row.id, name: row.name, sub: "Walk-ins paused" },
);

const OTHER_SHOPS: readonly VisitWaitShop[] = [
  { id: "loc_central", name: "Central", hours: "10:00 to 19:00" },
  { id: "loc_mong_kok", name: "Mong Kok", hours: "11:00 to 20:00" },
];

const TICKET_STEPS: readonly StageRailStage[] = [
  { id: "waiting", label: "Waiting" },
  { id: "next", label: "You’re next" },
  { id: "called", label: "Your turn" },
];

const TICKET_FACTS: readonly FactRow[] = [
  { label: "Service", value: VISIT_SERVICE },
  { label: "Shop", value: VISIT_SHOP },
  { label: "Joined", value: "11:42" },
  { label: "Updated", value: "12:00" },
];

const TICKET_WORDS = {
  title: "Your ticket",
  steps: TICKET_STEPS,
  facts: "Your ticket",
  leave: "Leave the line",
  leaveQ: "Leave the line?",
  keep: "Keep my place",
  leaving: "Leaving…",
  leaveFailed: "We couldn’t take you out of the line. Try again.",
  leaveOffline: "Leaving works again once you’re back online.",
  bookTime: "Book a time",
} as const;

const TICKET_WAITING_COPY: VisitTicketBodyCopy = {
  ...TICKET_WORDS,
  phase: "Waiting",
  estimate: "About 15 to 25 min",
  head: "3rd in line",
  noteHead: "Stay nearby.",
  note: "We’ll WhatsApp you when you’re next and hold your turn 10 min. WhatsApp to +852 9123 4567",
  leaveBody:
    "You give up W-014, 3rd in line. To walk in again, ask at the counter for a new ticket.",
};

const TICKET_CALLED_COPY: VisitTicketBodyCopy = {
  ...TICKET_WORDS,
  phase: "Your turn",
  head: "Counter 3 is ready for you",
  line: "Called 11:58 · held for you until 12:08",
  noteHead: "Show this screen at Counter 3.",
  note: "Can’t come? Leave the line so we can call the next person.",
  leaveBody: "You give up your turn at Counter 3, and we call the next person.",
};

const TICKET_OFFLINE_COPY: VisitTicketBodyCopy = {
  ...TICKET_WAITING_COPY,
  phase: "As of 11:58",
  estimate: undefined,
  line: "The wait shows again once you’re back online.",
};

const TICKET_SEEN_COPY: VisitTicketBodyCopy = {
  ...TICKET_WORDS,
  phase: "Seen",
  head: "You were seen",
  line: "Thanks for coming in.",
  leaveBody: "",
};

const TICKET_RECONNECTING_COPY: VisitReconnectingCopy = {
  title: "Reconnecting…",
  body: "Updated 11:58. Your place is kept, and if we call you meanwhile, we hold your turn 10 min.",
  retry: "Try now",
  trying: "Trying…",
};

export {
  BEFORE_NOTES,
  BOOK_HREF,
  BOOKED_ACTS,
  BOOKED_BEFORE,
  BOOKED_BODY_COPY,
  BOOKED_PASS_COPY,
  CALLED_BODY_COPY,
  CANCEL_PANEL_COPY,
  CANCELLED_BODY_COPY,
  DIRECTIONS_HREF,
  ENDED_ACTS,
  FULL_DAY_COPY,
  FULL_DAY_SHOPS,
  GET_THERE_ROWS,
  LATE_CHOICES,
  LATE_PANEL_COPY,
  LINK_OPENS_NOTHING_COPY,
  LIST_COPY,
  MINE_HREF,
  MOVE_PANEL_COPY,
  OTHER_SHOPS,
  PASSED_BODY_COPY,
  PAST_ROWS,
  PAUSED_SERVICES,
  RECONNECTING_COPY,
  STRUCK_FACTS,
  TICKET_CALLED_COPY,
  TICKET_FACTS,
  TICKET_OFFLINE_COPY,
  TICKET_RECONNECTING_COPY,
  TICKET_SEEN_COPY,
  TICKET_WAITING_COPY,
  TODAY_ACTS,
  TODAY_BODY_COPY,
  TOLD_ROWS,
  UPCOMING_ROWS,
  VISIT_CODE,
  VISIT_FACTS,
  VISIT_PASS_COPY,
  WAIT_COPY,
  WAIT_HREF,
  WAIT_SERVICES,
};
