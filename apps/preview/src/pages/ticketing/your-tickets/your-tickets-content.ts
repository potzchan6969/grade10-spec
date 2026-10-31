import type {
  MyTicketsListCopy,
  MyTicketsOrder,
  SharedTicketCopy,
  SharedTicketView,
  TicketConfirmingDrawerCopy,
  TicketOrderLine,
  TicketOrderPageCopy,
  TicketOrderPageTicket,
  TicketQrCardState,
} from "@grade10/ui";
import { BUYER, hkd, SHOW, T, t } from "../ticketing-words";

/* What the Your Tickets screens pass their blocks, every word from the
 * `ticketing` catalog. The orders are the OrderPhone and YourTickets
 * boards'. */

export const CONFIRMING_COPY: TicketConfirmingDrawerCopy = {
  waiting: {
    title: T.return.confirming.title,
    description: T.return.confirming.body,
  },
  safeToClose: {
    title: T.return.stillConfirming.title,
    description: T.return.stillConfirming.body,
    reference: t(T.common.reference, { reference: BUYER.reference }),
    close: T.common.close,
  },
};

const FACTS = [
  `${SHOW.shortDays}, ${SHOW.start} to ${SHOW.end}`,
  "[Venue], [Venue address], Hong Kong",
];

export const orderCopy = (
  status: string,
  { held = false, reference = BUYER.reference as string } = {},
): TicketOrderPageCopy => ({
  title: t(T.order.title, { reference }),
  status,
  event: SHOW.name,
  facts: [
    ...FACTS,
    held
      ? t(T.order.started, { date: "24 Nov 2026, 14:32" })
      : t(T.order.bought, { date: "24 Nov 2026" }),
  ],
  breadcrumb: { parent: T.order.breadcrumb, current: reference },
  doorNote: t(T.order.noSignal, { reference }),
});

export const LINES: readonly TicketOrderLine[] = [
  {
    key: "adult",
    label: t(T.common.lineQuantity, {
      quantity: 2,
      pass: "General Pass (Two-Day), Adult",
    }),
    detail: t(T.order.lines.earlyBirdEach, { amount: hkd(380) }),
    amount: hkd(760),
  },
  {
    key: "fast-pass",
    label: t(T.order.lines.fastPassOn, { tickets: 1, days: 2 }),
    detail: t(T.common.aDay, { amount: hkd(100) }),
    amount: hkd(200),
  },
  {
    key: "child",
    label: t(T.common.lineQuantity, {
      quantity: 1,
      pass: "General Pass (Two-Day), Child",
    }),
    detail: T.order.lines.earlyBird,
    amount: hkd(190),
  },
];

export const PAID_BY = t(T.common.paidBy, {
  method: t(T.common.card, { brand: "Visa", last4: "4242" }),
  date: "24 Nov 2026",
});

const ADULT = "General Pass (Two-Day), Adult";
const CHILD = "General Pass (Two-Day), Child";
const ADMITS = t(T.order.ticket.admits, { count: 2, days: "12 and 13 Dec" });

type TicketWords = Partial<TicketOrderPageTicket["copy"]>;

function ticket(
  n: number,
  pass: string,
  words: TicketWords = {},
  state: TicketQrCardState = "valid",
  {
    count = 3,
    reference = BUYER.reference as string,
    holder = BUYER.name as string,
  } = {},
): TicketOrderPageTicket {
  return {
    key: `t${n}`,
    state,
    reference,
    qrValue: `T1.${reference.toLowerCase()}-${n}.c2lnbmVkLXRhZy0${n}`,
    copy: {
      label: t(T.order.ticket.label, { ordinal: n, count }),
      pass,
      holder: t(T.order.ticket.ofHolder, { ordinal: n, count, name: holder }),
      status: T.order.ticket.valid,
      qrLabel: t(T.order.ticket.codeLabel, { code: `${reference}-${n}` }),
      code: t(T.order.ticket.code, { code: `${reference}-${n}` }),
      entries: ADMITS,
      ...words,
    },
  };
}

export const TICKETS = [
  ticket(1, ADULT, { fastPass: t(T.order.ticket.fastPass, { count: 2 }) }),
  ticket(2, ADULT),
  ticket(3, CHILD),
];

const dayLeft = t(T.order.status.daysLeft, { count: 1 });
const usedOn = (time: string) =>
  t(T.order.ticket.used, { when: `Sat 12 Dec, ${time}`, left: 1 });

export const TICKETS_AFTER_DAY_ONE = [
  ticket(
    1,
    ADULT,
    {
      status: dayLeft,
      entries: usedOn("10:14"),
      fastPass: t(T.order.ticket.fastPassLeft, { count: 1 }),
    },
    "daysLeft",
  ),
  ticket(2, ADULT, { status: dayLeft, entries: usedOn("10:14") }, "daysLeft"),
  ticket(
    3,
    CHILD,
    {
      status: dayLeft,
      entries: usedOn("10:15"),
      usedToday: t(T.sharedTicket.usedToday, {
        time: "Sat 12 Dec, 10:15",
        day: "Sunday",
      }),
    },
    "usedToday",
  ),
];

export const TICKETS_PART_REFUNDED = [
  TICKETS[0] as TicketOrderPageTicket,
  TICKETS[1] as TicketOrderPageTicket,
  ticket(
    3,
    CHILD,
    {
      status: T.order.ticket.refunded,
      voided: t(T.order.ticket.refundedNote, { date: "2 Dec 2026" }),
    },
    "void",
  ),
];

export const TICKETS_REFUNDED = TICKETS.map((item, n) =>
  ticket(
    n + 1,
    item.copy.pass,
    {
      status: T.order.ticket.refunded,
      voided: t(T.order.ticket.refundedNote, { date: "3 Dec 2026" }),
    },
    "void",
  ),
);

export const FREE_TICKETS = [1, 2].map((n) =>
  ticket(n, "Guest Pass (Two-Day)", {}, "valid", {
    count: 2,
    reference: "TK9F4D",
  }),
);

export const MY_TICKETS_COPY: MyTicketsListCopy = {
  title: T.myTickets.title,
  intro: t(T.myTickets.intro, { email: BUYER.email }),
  loading: T.myTickets.loading,
  empty: {
    title: T.myTickets.empty.title,
    body: t(T.myTickets.empty.body, { email: BUYER.email }),
    browse: T.common.seeTheShows,
  },
  error: {
    title: T.myTickets.failed.title,
    body: T.myTickets.failed.body,
    retry: T.common.tryAgain,
  },
  signedOut: {
    title: T.myTickets.signedOut.title,
    body: T.myTickets.signedOut.body,
    signIn: T.common.signInWithEmail,
    guestNote: T.myTickets.signedOut.note,
  },
};

const order = (
  reference: string,
  status: string,
  tone: MyTicketsOrder["tone"],
  tickets: number,
  act: string,
  more: Partial<MyTicketsOrder> = {},
): MyTicketsOrder => ({
  id: `o-${reference.toLowerCase()}`,
  label: t(T.myTickets.orderLabel, { reference }),
  event: SHOW.name,
  when: SHOW.shortDays,
  status,
  tone,
  tickets: t(T.common.ticketCount, { count: tickets }),
  reference,
  act: { label: act, href: `/tickets/orders/o-${reference.toLowerCase()}` },
  ...more,
});

export const MY_ORDERS: readonly MyTicketsOrder[] = [
  order("TK9F4D", T.order.status.held, "warn", 2, T.myTickets.continue, {
    note: t(T.myTickets.heldUntil, { time: "15:02" }),
    urgent: true,
  }),
  order(
    BUYER.reference,
    T.order.status.confirmed,
    "ok",
    3,
    T.myTickets.viewTickets,
  ),
  order("TKF3H8", T.order.status.confirmed, "ok", 1, T.myTickets.viewTicket, {
    note: t(T.myTickets.freeTicket, {
      pass: "Guest Pass (Two-Day)",
      event: "Grade10",
    }),
  }),
  order("TK3H8W", T.order.status.refunded, "bad", 1, T.myTickets.viewOrder),
  order("TK2B6P", T.order.status.ended, "plain", 2, T.myTickets.viewTickets, {
    event: "[Earlier Show Name]",
    when: "Sat 6 Jun 2026",
  }),
];

export const SHARED_COPY: SharedTicketCopy = {
  heading: T.sharedTicket.title,
  ticketLabel: t(T.sharedTicket.label, { code: "TKF3H8-4" }),
  codeLabel: t(T.sharedTicket.codeLabel, { code: "TKF3H8-4" }),
  codeLine: T.sharedTicket.showAtDoor,
  free: T.sharedTicket.free,
  downloadPdf: T.sharedTicket.downloadPdf,
  save: T.sharedTicket.save,
  viewMyTickets: T.sharedTicket.viewMyTickets,
  view: T.sharedTicket.view,
  privacy: t(T.sharedTicket.note, { event: "Grade10" }),
  cancelled: {
    badge: T.sharedTicket.dead.cancelled.badge,
    title: T.sharedTicket.dead.cancelled.title,
    description: T.sharedTicket.dead.cancelled.body,
  },
  over: {
    badge: T.event.badge.ended,
    title: t(T.sharedTicket.dead.over.title, { event: SHOW.name }),
    description: T.sharedTicket.dead.over.body,
  },
  replaced: {
    title: T.sharedTicket.dead.replaced.title,
    description: T.sharedTicket.dead.replaced.body,
  },
  notFound: {
    title: T.sharedTicket.dead.notFound.title,
    description: T.sharedTicket.dead.notFound.body,
  },
};

export const SHARED_TICKET: SharedTicketView = {
  eventTitle: SHOW.name,
  passName: "Guest Pass (Two-Day)",
  days: SHOW.shortDays,
  doors: t(T.sharedTicket.doors, { start: SHOW.start, end: SHOW.end }),
  venue: SHOW.venue,
  guest: t(T.sharedTicket.forGuest, { name: "Jamie Wong" }),
  fastPass: t(T.order.ticket.fastPass, { count: 1 }),
  code: "TKF3H8-4",
  qrValue: "T1.tkf3h8-4.c2lnbmVkLXRhZy00",
};
