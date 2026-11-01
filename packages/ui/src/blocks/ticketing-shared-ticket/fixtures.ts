import type { SharedTicketCopy, SharedTicketView } from "./shared-ticket";

/** The FreeTicketPhone board's words. */
export const SHARED_TICKET_COPY: SharedTicketCopy = {
  heading: "Your Ticket",
  ticketLabel: "Ticket TKF3H8-4",
  codeLabel: "Ticket code TKF3H8-4",
  codeLine:
    "Show this code at the door. It lets you in once on each day your pass covers.",
  free: "Free",
  downloadPdf: "Download PDF",
  save: "Save to My Tickets",
  viewMyTickets: "View My Tickets",
  view: "View",
  privacy:
    "A free ticket from [Show Name]. Anyone with this link can use it, so keep it to yourself.",
  cancelled: {
    title: "This ticket was canceled.",
    description: "Ask whoever sent it to you.",
    badge: "Canceled",
  },
  over: {
    title: "[Show Name] has ended.",
    description: "Thanks for coming.",
    badge: "Ended",
  },
  replaced: {
    title: "This link was replaced by a new one",
    description: "Ask whoever sent it to you.",
  },
  notFound: {
    title: "We can’t find this ticket",
    description: "Check the link.",
  },
};

export const SHARED_TICKET: SharedTicketView = {
  eventTitle: "[Show Name]",
  passName: "General Pass (Two-Day), Adult",
  days: "Sat 12 and Sun 13 Dec 2026",
  doors: "Doors 10:00 to 19:00",
  venue: "[Venue]",
  guest: "For Jamie Wong",
  fastPass: "Fast Pass on 1 day",
  code: "TKF3H8-4",
  qrValue: "T2.tkt_01JF3H8.1.5c2f9a1e",
};

export const SHARED_TICKET_USED_TODAY = "In Sat 12 Dec, 10:42. See you Sunday.";

export const SHARED_TICKET_SAVED_SAID = "Saved to My Tickets";
