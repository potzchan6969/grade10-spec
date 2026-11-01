import type { MyTicketsListCopy } from "./my-tickets-list";
import type { TicketConfirmingDrawerCopy } from "./ticket-confirming-drawer";
import type { TicketOrderPageCopy } from "./ticket-order-page";
import type { TicketOrderSummaryProps } from "./ticket-order-summary";
import type { TicketQrCardProps } from "./ticket-qr-card";
import type { MyTicketsOrder, TicketOrderLine } from "./types";

/** Stand-in words and orders from the 2026-10-30 boards (ReturnPhone,
 * OrderPhone, YourTickets) until the ticketing catalog lands. */

export const EMAIL = "alex.chan@example.com";
export const YOUR_TICKETS_HREF = "/tickets/orders";
export const SHOWS_HREF = "/shows";

export const CONFIRMING_COPY: TicketConfirmingDrawerCopy = {
  waiting: {
    title: "Confirming your payment…",
    description: "Please keep this page open.",
  },
  safeToClose: {
    title: "Still confirming your payment",
    description:
      "If you paid, your tickets arrive by email as soon as it lands. You can close this page.",
    reference: "Reference TK7Q2M",
    close: "Close",
  },
};

const FACTS = [
  "Sat 12 and Sun 13 Dec 2026, 10:00 to 19:00",
  "[Venue], [Venue address], Hong Kong",
];

export const ORDER_COPY: TicketOrderPageCopy = {
  title: "Order TK7Q2M",
  status: "Confirmed",
  event: "[Show Name]",
  facts: [...FACTS, "Bought 24 Nov 2026"],
  breadcrumb: { parent: "Your Tickets", current: "TK7Q2M" },
  doorNote:
    "No signal at the door? The same tickets are in your email as one PDF, and it opens without signal. Can’t scan? Give the reference TK7Q2M.",
};

export const HELD_FACTS = [...FACTS, "Started 24 Nov 2026, 14:32"];

export const LINES: readonly TicketOrderLine[] = [
  {
    key: "adult",
    label: "2 × General Pass (Two-Day), Adult",
    detail: "Early bird, HK$380.00 each",
    amount: "HK$760.00",
  },
  {
    key: "fast-pass",
    label: "Fast Pass on 1 of them, 2 days",
    detail: "HK$100.00 a day",
    amount: "HK$200.00",
  },
  {
    key: "child",
    label: "1 × General Pass (Two-Day), Child",
    detail: "Early bird",
    amount: "HK$190.00",
  },
];

export const SUMMARY: TicketOrderSummaryProps = {
  copy: {
    title: "What You Bought",
    totalLabel: "Total",
    paidBy: "Paid by Visa •• 4242 on 24 Nov 2026",
  },
  lines: LINES,
  total: "HK$1,150.00",
};

const ADMITS = "Admits on 2 days: 12 and 13 Dec";

function ticket(
  n: number,
  pass: string,
  overrides: Partial<TicketQrCardProps["copy"]> = {},
  state: TicketQrCardProps["state"] = "valid",
): TicketQrCardProps & { key: string } {
  return {
    key: `t${n}`,
    state,
    reference: "TK7Q2M",
    qrValue: `T1.tk7q2m-${n}.c2lnbmVkLXRhZy0${n}`,
    copy: {
      label: `Ticket ${n} of 3`,
      pass,
      holder: `Ticket ${n} of 3. Alex Chan`,
      status: "Valid",
      qrLabel: `Ticket code TK7Q2M-${n}`,
      code: `Code TK7Q2M-${n}`,
      entries: ADMITS,
      ...overrides,
    },
  };
}

const ADULT = "General Pass (Two-Day), Adult";
const CHILD = "General Pass (Two-Day), Child";

export const TICKETS = [
  ticket(1, ADULT, { fastPass: "Fast Pass on 2 days" }),
  ticket(2, ADULT),
  ticket(3, CHILD),
];

export const TICKETS_AFTER_DAY_ONE = [
  ticket(
    1,
    ADULT,
    {
      status: "1 Day Left",
      entries: "Used Sat 12 Dec, 10:14. 1 day left",
      fastPass: "Fast Pass on 1 day left",
    },
    "daysLeft",
  ),
  ticket(
    2,
    ADULT,
    { status: "1 Day Left", entries: "Used Sat 12 Dec, 10:14. 1 day left" },
    "daysLeft",
  ),
  ticket(
    3,
    CHILD,
    { status: "1 Day Left", entries: "Used Sat 12 Dec, 10:15. 1 day left" },
    "daysLeft",
  ),
];

export const TICKETS_PART_REFUNDED = [
  TICKETS[0],
  TICKETS[1],
  ticket(
    3,
    CHILD,
    {
      status: "Refunded",
      voided: "Refunded on 2 Dec 2026. This code no longer lets anyone in.",
    },
    "void",
  ),
];

export const TICKET_USED_TODAY = ticket(
  1,
  ADULT,
  {
    status: "1 Day Left",
    entries: "Used Sat 12 Dec, 10:42. 1 day left",
    fastPass: "Fast Pass on 1 day left",
    usedToday: "In Sat 12 Dec, 10:42. See you Sunday.",
  },
  "usedToday",
);

export const FREE_TICKETS = [1, 2].map((n) => ({
  key: `f${n}`,
  state: "valid" as const,
  reference: "TK9F4D",
  qrValue: `T1.tk9f4d-${n}.c2lnbmVkLXRhZy0${n}`,
  copy: {
    label: `Ticket ${n} of 2`,
    pass: "Guest Pass, Two Days",
    holder: `Ticket ${n} of 2. Alex Chan`,
    status: "Valid",
    qrLabel: `Ticket code TK9F4D-${n}`,
    code: `Code TK9F4D-${n}`,
    entries: ADMITS,
  },
}));

export const MY_TICKETS_COPY: MyTicketsListCopy = {
  title: "Your Tickets",
  intro: `Every order bought with ${EMAIL}, newest first.`,
  loading: "Loading your tickets",
  empty: {
    title: "No Tickets Yet",
    body: `Tickets you buy with ${EMAIL} show up here.`,
    browse: "See the Shows",
  },
  error: {
    title: "We couldn’t load your tickets",
    body: "Check your connection and try again.",
    retry: "Try Again",
  },
  signedOut: {
    title: "Sign In to See Your Tickets",
    body: "Use the email you bought with. Orders bought as a guest show up too.",
    signIn: "Sign In with Email",
    guestNote:
      "Bought as a guest? Your tickets are in your email as one PDF, and it works at the door on its own.",
  },
};

export const MY_ORDERS: readonly MyTicketsOrder[] = [
  {
    id: "o-tk9f4d",
    label: "Order TK9F4D",
    event: "[Show Name]",
    when: "Sat 12 and Sun 13 Dec 2026",
    status: "Waiting for Payment",
    tone: "warn",
    tickets: "2 tickets",
    reference: "TK9F4D",
    note: "Held until 15:02.",
    act: { label: "Continue to Payment", href: "/tickets/orders/o-tk9f4d" },
    urgent: true,
  },
  {
    id: "o-tk7q2m",
    label: "Order TK7Q2M",
    event: "[Show Name]",
    when: "Sat 12 and Sun 13 Dec 2026",
    status: "Confirmed",
    tone: "ok",
    tickets: "3 tickets",
    reference: "TK7Q2M",
    act: { label: "View Tickets", href: "/tickets/orders/o-tk7q2m" },
  },
  {
    id: "o-tk3h8w",
    label: "Order TK3H8W",
    event: "[Show Name]",
    when: "Sat 12 and Sun 13 Dec 2026",
    status: "Refunded",
    tone: "bad",
    tickets: "1 ticket",
    reference: "TK3H8W",
    act: { label: "View Order", href: "/tickets/orders/o-tk3h8w" },
  },
  {
    id: "o-tk2b6p",
    label: "Order TK2B6P",
    event: "[Earlier Show Name]",
    when: "Sat 6 Jun 2026",
    status: "Ended",
    tone: "plain",
    tickets: "2 tickets",
    reference: "TK2B6P",
    act: { label: "View Tickets", href: "/tickets/orders/o-tk2b6p" },
  },
];
