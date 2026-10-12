import type {
  FactRow,
  NoteListItem,
  VisitAct,
  VisitBodyCopy,
  VisitCancelPanelCopy,
  VisitFact,
  VisitLateChoice,
  VisitLatePanelCopy,
  VisitLinkOpensNothingCopy,
  VisitMovePanelCopy,
  VisitPassCopy,
  VisitReconnectingCopy,
  VisitTicketBodyCopy,
  VisitWaitBodyCopy,
  VisitWaitService,
  VisitWaitShop,
} from "@grade10/ui";

/** Grading Submission at the Causeway Bay shop, Thu 3 Sep 2026, 10:15 to 10:45. */
const VISIT_NAME = "Alex Chan";
const SHOP = "Hong Kong Grade10 Store";
const ADDRESS = "13 Pak Sha Road, Causeway Bay, Hong Kong";
const SERVICE = "Grading Submission";
const EMAIL = "alex@example.com";
const MINE_HREF = "#/book/mine";
const BOOK_HREF = "#/book";
const WAIT_HREF = "#/book/wait/causeway-bay";
const DIRECTIONS_HREF = `https://maps.google.com/?q=${encodeURIComponent(`Grade10 ${SHOP} ${ADDRESS}`)}`;

const PASS_WORDS = {
  nameLabel: "Booked for",
} as const;

const PASS_LINE = `${SERVICE} · ${SHOP} · 10:15 to 10:45`;

const VISIT_FACTS: readonly VisitFact[] = [
  { label: "When", value: "Thu 3 Sep, 10:15 to 10:45", sub: "Times in HKT" },
  {
    label: "Where",
    value: `Grade10 ${SHOP}`,
    sub: `${ADDRESS} · Lift to the 2nd floor`,
  },
  { label: "Service", value: SERVICE, sub: "30 min" },
  {
    label: "Booked for",
    value: VISIT_NAME,
    sub: `${EMAIL} · +852 9123 4567`,
  },
  { label: "Shop phone", value: "+852 2345 6789" },
];

/** A visit that ended or is off: the time struck where it is off. */
function endedFacts(struck: boolean): readonly VisitFact[] {
  return VISIT_FACTS.map((fact, index) =>
    index === 0 && struck ? { ...fact, struck } : fact,
  );
}

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

const BOOK_AGAIN_ACT: VisitAct = {
  key: "again",
  label: "Book again",
  href: BOOK_HREF,
  primary: true,
};

const MINE_ACT: VisitAct = { key: "mine", label: "My visits", href: MINE_HREF };

const PICK_ANOTHER_ACT: VisitAct = {
  key: "another",
  label: "Pick another time",
  href: BOOK_HREF,
  primary: true,
};

const BODY_WORDS = {
  dismiss: "Dismiss",
  yourVisit: "Your visit",
  before: "Before you come",
  told: "What you told us",
  foot: `We email ${EMAIL} about this visit.`,
} as const;

const RECONNECTING_COPY: VisitReconnectingCopy = {
  title: "Reconnecting…",
  body: "Updated 10:02. This page tries again by itself.",
  retry: "Try now",
  trying: "Trying…",
};

const BOOKED_COPY: VisitBodyCopy = {
  ...BODY_WORDS,
  phase: "Booked",
  note: "in 2 days",
  title: SERVICE,
  lede: `Thu 3 Sep, 10:15 to 10:45 HKT at ${SHOP}.`,
  pass: {
    ...PASS_WORDS,
    title: "Your pass",
    note: "At the counter, give your phone or email.",
  },
  footNote: "You can change or cancel until 10:45 on the day.",
};

const TODAY_COPY: VisitBodyCopy = {
  ...BODY_WORDS,
  phase: "Today",
  note: "10:15 · in 1h 15m",
  title: "See you at 10:15",
  lede: `${SERVICE} at ${SHOP}, ${ADDRESS}.`,
  notice: {
    text: "Signal 8 or black rain: we close while it’s up and email you.",
  },
  pass: {
    ...PASS_WORDS,
    title: "Your pass",
    line: PASS_LINE,
    note: "At the counter, give your phone or email.",
  },
  footNote: "Change or cancel until 10:45. We hold your time until 10:25.",
};

const LATE_TOLD_COPY: VisitBodyCopy = {
  ...BODY_WORDS,
  phase: "Today",
  note: "Running late · about 10:25",
  title: "We’ll hold your time until 10:25",
  lede: `We told ${SHOP} you’ll be about 10 min late. Show your pass when you arrive.`,
  pass: {
    ...PASS_WORDS,
    title: "Your pass",
    line: PASS_LINE,
    note: "At the counter, give your phone or email.",
  },
  footNote:
    "After 10:25 you can still come: check in and wait for the next free counter.",
};

const CHECKED_IN_COPY: VisitBodyCopy = {
  ...BODY_WORDS,
  phase: "Checked in",
  note: "10:09",
  title: "We’ll call you",
  lede: "Stay near the counters. Your counter shows here when it’s ready.",
  notice: {
    title: "About 5 to 10 min",
    text: "Updated 10:12. This page updates by itself.",
  },
  pass: {
    ...PASS_WORDS,
    title: "Your pass",
    line: PASS_LINE,
    note: "Show this at your counter.",
  },
  footNote: "Change and cancel close once you’re checked in.",
};

const CALLED_COPY: VisitBodyCopy = {
  ...BODY_WORDS,
  phase: "Counter 3",
  note: "ready at 10:15",
  title: "Counter 3 is ready for you",
  lede: "Go to Counter 3 now and show your pass.",
  pass: {
    ...PASS_WORDS,
    title: "Counter 3",
    line: `${SERVICE} · ${SHOP} · 10:15`,
    note: "We hold the counter for you until 10:25.",
  },
};

const TIME_PASSED_COPY: VisitBodyCopy = {
  ...BODY_WORDS,
  phase: "Time passed",
  note: "held until 10:25",
  title: "We held your time until 10:25",
  lede: "Come in and wait as a walk-in, or book another time.",
  notice: {
    title: "Walk in now: about 15 to 25 min",
    text: `${SERVICE} at ${SHOP}. Staff check you in when you arrive.`,
    link: "See the wait",
  },
  pass: {
    ...PASS_WORDS,
    title: "Your pass",
    line: PASS_LINE,
    note: "When you arrive, give your phone or email. You wait from when you check in.",
  },
  footNote: `Change or cancel until 10:45. Or book ${SERVICE} again right away.`,
};

const COMPLETED_COPY: VisitBodyCopy = {
  ...BODY_WORDS,
  phase: "Completed",
  note: "Thu 3 Sep",
  title: "Thanks for coming in",
  lede: `Your visit at ${SHOP} on Thu 3 Sep is complete. Book again whenever it suits you.`,
};

const MISSED_COPY: VisitBodyCopy = {
  ...BODY_WORDS,
  phase: "Missed",
  note: "Thu 3 Sep, 10:15",
  title: "We missed you",
  lede: `You weren’t checked in at ${SHOP} on Thu 3 Sep. Book again and we’ll fill in what you told us.`,
  footNote: `Were you there? Call ${SHOP} on +852 2345 6789.`,
};

const CANCELLED_YOU_COPY: VisitBodyCopy = {
  ...BODY_WORDS,
  phase: "Cancelled by you",
  note: "Tue 1 Sep, 12:00",
  title: "You cancelled this visit",
  lede: `10:15 on Thu 3 Sep is open for others now. We emailed ${EMAIL}.`,
  notice: { title: "Your reason", text: "I booked the wrong time" },
  footNote: `Book again starts with ${SERVICE} at ${SHOP}, with what you told us.`,
};

const CANCELLED_SHOP_COPY: VisitBodyCopy = {
  ...BODY_WORDS,
  phase: "Cancelled by the shop",
  note: "Wed 2 Sep, 18:00",
  title: `${SHOP} cancelled your visit`,
  lede: "Your 10:15 time on Thu 3 Sep is off. Pick another time and what you told us comes with you.",
  notice: {
    title: "Reason from the shop",
    text: "A grader is off sick.",
  },
  footNote: `We emailed ${EMAIL}.`,
};

const CANCEL_PANEL_COPY: VisitCancelPanelCopy = {
  title: "Cancel your visit?",
  description: `${SERVICE} · Thu 3 Sep, 10:15 · ${SHOP}`,
  free: "10:15 on Thu 3 Sep opens for others to book.",
  mail: `We’ll email ${EMAIL} that it’s cancelled.`,
  why: "Why are you cancelling? (optional)",
  reasons: {
    cant: "I can’t make it",
    wrong: "I booked the wrong time",
    other: "Something else",
  },
  more: "Tell us more (optional)",
  keep: "Keep my visit",
  cancel: "Cancel visit",
  cancelling: "Cancelling…",
};

const MOVE_PANEL_COPY: VisitMovePanelCopy = {
  title: "Change time",
  description: `${SERVICE} at ${SHOP} · now Thu 3 Sep, 10:15`,
  confirm: "Pick a time",
  moving: "Moving…",
  keep: "Keep 10:15",
  consequence: `We’ll email ${EMAIL} the new time.`,
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

const LATE_PANEL_COPY: Omit<VisitLatePanelCopy, "send"> = {
  title: "Running late?",
  description: `Tell ${SHOP} about when you’ll arrive. We hold your time until 10:25.`,
  legend: "About how late?",
  sending: "Sending…",
  close: "Close",
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
  staff: "Staff at any shop can find your visit by your phone or email.",
};

const BOOKED_PASS_COPY: VisitPassCopy = {
  ...PASS_WORDS,
  title: "Booked",
  note: "At the counter, give your phone or email.",
};

const BOOKED_BEFORE: readonly string[] = [
  "Bring each card in a penny sleeve.",
  "We hold your time until 10:30. Running late? Tell us from your visit page.",
  "Fees are paid at the counter.",
];

const GET_THERE_ROWS: readonly FactRow[] = [
  { label: "Shop", value: SHOP },
  { label: "Where", value: ADDRESS },
  { label: "Directions", value: "Lift to the 2nd floor" },
  { label: "Shop phone", value: "+852 2345 6789" },
];

const WAIT_COPY: VisitWaitBodyCopy = {
  walkIn: "Walk in",
  shop: SHOP,
  place: `${ADDRESS} · Lift to the 2nd floor`,
  status: "Open now",
  hours: "Today 10:00 to 19:00",
  waitNow: "Walk-in wait now",
  book: "Book",
  openToday: "Open today",
  how: "To walk in, tell us at the counter. We send a ticket link to your phone or email, and we’ll WhatsApp you when you’re next.",
  updated: "Updated 12:00 · times in HKT",
  bookTime: "Book a time",
};

const LISTING_BOOK = {
  href: "#/book?service=consultation",
  label: "Book a time for Store/Auction Listing",
};

const WAIT_SERVICES: readonly VisitWaitService[] = [
  {
    id: "svc_grading",
    name: SERVICE,
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
    book: LISTING_BOOK,
  },
];

const PAUSED_SERVICES: readonly VisitWaitService[] = [
  {
    id: "svc_grading",
    name: SERVICE,
    sub: "Walk-ins paused",
    book: {
      href: "#/book?service=grading",
      label: `Book a time for ${SERVICE}`,
    },
  },
  {
    id: "svc_vault_drop_off",
    name: "Vault Drop-Off",
    sub: "Walk-ins paused",
    book: {
      href: "#/book?service=vault-drop-off",
      label: "Book a time for Vault Drop-Off",
    },
  },
  {
    id: "svc_consultation",
    name: "Store/Auction Listing",
    sub: "Booked only",
    book: LISTING_BOOK,
  },
];

const OTHER_SHOPS: readonly VisitWaitShop[] = [
  { id: "loc_central", name: "Central", hours: "10:00 to 19:00" },
  { id: "loc_mong_kok", name: "Mong Kok", hours: "11:00 to 20:00" },
];

const TICKET_FACTS: readonly FactRow[] = [
  { label: "Service", value: SERVICE },
  { label: "Shop", value: SHOP },
  { label: "Joined", value: "11:42" },
  { label: "Updated", value: "12:00" },
];

const TICKET_WORDS = {
  title: "Your ticket",
  steps: [
    { id: "waiting", label: "Waiting" },
    { id: "next", label: "You’re next" },
    { id: "called", label: "Your turn" },
  ],
  facts: "Your ticket",
  leave: "Leave the line",
  leaveQ: "Leave the line?",
  keep: "Keep my place",
  leaving: "Leaving…",
  leaveFailed: "We couldn’t take you out of the line. Try again.",
  leaveOffline: "Leaving works again once you’re back online.",
  bookTime: "Book a time",
} as const;

const NEW_TICKET = "Ask at the counter for a new ticket, or book a time.";

const TICKET_COPY = {
  waiting: {
    ...TICKET_WORDS,
    phase: "Waiting",
    estimate: "About 15 to 25 min",
    head: "3rd in line",
    noteHead: "Stay nearby.",
    note: "We’ll WhatsApp you when you’re next and hold your turn 10 min. WhatsApp to +852 •••• 4567",
    leaveBody:
      "You give up W-014, 3rd in line. To walk in again, ask at the counter for a new ticket.",
  },
  next: {
    ...TICKET_WORDS,
    phase: "You’re next",
    estimate: "About 2 to 5 min",
    head: "Head back to the shop now",
    noteHead: "We hold your turn 10 min.",
    note: `When we call W-014, come to the counter. After 10 min we call the next person. ${SHOP} · ${ADDRESS}`,
    leaveBody:
      "You give up W-014, next in line. To walk in again, ask at the counter for a new ticket.",
  },
  called: {
    ...TICKET_WORDS,
    phase: "Your turn",
    head: "Counter 3 is ready for you",
    line: "Called 11:58 · held for you until 12:08",
    noteHead: "Show this screen at Counter 3.",
    note: "Can’t come? Leave the line so we can call the next person.",
    leaveBody:
      "You give up your turn at Counter 3, and we call the next person.",
  },
  missed: {
    ...TICKET_WORDS,
    phase: "Missed",
    head: "Missed your turn",
    line: "We called W-014 at 11:58 and held your turn until 12:08.",
    noteHead: "Still nearby?",
    note: NEW_TICKET,
    leaveBody: "",
  },
  left: {
    ...TICKET_WORDS,
    phase: "You left",
    head: "You left the line",
    line: "At 11:50.",
    noteHead: "Changed your mind?",
    note: NEW_TICKET,
    leaveBody: "",
  },
  seen: {
    ...TICKET_WORDS,
    phase: "Seen",
    head: "You were seen",
    line: "Thanks for coming in.",
    leaveBody: "",
  },
  closed: {
    ...TICKET_WORDS,
    phase: "Closed",
    head: "The line has closed",
    line: "Walk-ins ended for today.",
    noteHead: "Changed your mind?",
    note: NEW_TICKET,
    leaveBody: "",
  },
} satisfies Record<string, VisitTicketBodyCopy>;

const TICKET_RECONNECTING_COPY: VisitReconnectingCopy = {
  title: "Reconnecting…",
  body: "Updated 11:58. Your place is kept, and if we call you meanwhile, we hold your turn 10 min.",
  retry: "Try now",
  trying: "Trying…",
};

export {
  BEFORE_NOTES,
  BOOK_AGAIN_ACT,
  BOOK_HREF,
  BOOKED_BEFORE,
  BOOKED_COPY,
  BOOKED_PASS_COPY,
  CALLED_COPY,
  CANCEL_PANEL_COPY,
  CANCELLED_SHOP_COPY,
  CANCELLED_YOU_COPY,
  CHECKED_IN_COPY,
  COMPLETED_COPY,
  DIRECTIONS_ACT,
  DIRECTIONS_HREF,
  EMAIL,
  endedFacts,
  GET_THERE_ROWS,
  LATE_CHOICES,
  LATE_PANEL_COPY,
  LATE_TOLD_COPY,
  LINK_OPENS_NOTHING_COPY,
  MINE_ACT,
  MINE_HREF,
  MISSED_COPY,
  MOVE_PANEL_COPY,
  OTHER_SHOPS,
  PAUSED_SERVICES,
  PICK_ANOTHER_ACT,
  RECONNECTING_COPY,
  SERVICE,
  SHOP,
  TICKET_COPY,
  TICKET_FACTS,
  TICKET_RECONNECTING_COPY,
  TIME_PASSED_COPY,
  TODAY_COPY,
  TOLD_ROWS,
  VISIT_FACTS,
  VISIT_NAME,
  WAIT_COPY,
  WAIT_HREF,
  WAIT_SERVICES,
};
