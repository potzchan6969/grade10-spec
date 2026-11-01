/** How a word on a ticket order is coloured: the badge's fill. */
type TicketTone = "plain" | "ok" | "info" | "warn" | "bad";

/** One act a surface offers: a link leaves the page, a press runs here. */
type TicketAct = {
  label: string;
  href?: string;
  onClick?: () => void;
};

/** One line of what was bought, every value display-ready. */
type TicketOrderLine = {
  key: string;
  /** "2 × General Pass (Two-Day), Adult" */
  label: string;
  /** The line under it: "Early bird, HK$380.00 each". */
  detail?: string;
  /** "HK$760.00" */
  amount: string;
};

/** One order in My Tickets, every value display-ready. */
type MyTicketsOrder = {
  id: string;
  /** The card's accessible name: "Order TK7Q2M". */
  label: string;
  /** The event's name. */
  event: string;
  /** The event's days, formatted. */
  when: string;
  /** The word for where the order stands. */
  status: string;
  tone: TicketTone;
  /** "3 tickets" */
  tickets: string;
  /** The six-character reference. */
  reference: string;
  /** A line under the facts: "Held until 15:02." */
  note?: string;
  /** The card's one act: View Tickets, View Order, Continue to Payment. */
  act: TicketAct;
  /** Draws the act filled: the order still waits on the collector. */
  urgent?: boolean;
};

export type { MyTicketsOrder, TicketAct, TicketOrderLine, TicketTone };
