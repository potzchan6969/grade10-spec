import type {
  TicketWaitingLineJoinCopy,
  TicketWaitingLineOfferCopy,
  TicketWaitingLinePlaceCopy,
  TicketWaitingLineRefusal,
} from "./ticket-waiting-line";

/* Draft English as the `ticketing` catalog words it; the page passes the
 * catalog's sentences, filled. */

export const JOIN_COPY: TicketWaitingLineJoinCopy = {
  join: "Join the Waiting Line",
  note: "If tickets come back, we’ll email you and hold them for you.",
};

export const OFFER_ENDED =
  "Your offer ended, and the tickets went to the next person. You can join again, at the back.";

export const TICKETS_LEFT: TicketWaitingLineRefusal = {
  title: "2 tickets are still on sale.",
  body: "Buy what’s left, or join the line once they sell out.",
};

export const PLACE_COPY: TicketWaitingLinePlaceCopy = {
  title: "You’re in the waiting line",
  wanted: "Waiting for 2 tickets",
  band: "You’re near the front.",
  note: "If tickets come back, we’ll email you and hold them for you.",
  leave: "Leave the Line",
};

export const OFFER_COPY: TicketWaitingLineOfferCopy = {
  title: "Tickets are held for you",
  body: "2 tickets are held for you until 14:47, Sat 28 Nov. Pay before then to keep them.",
  accept: "Accept",
  decline: "Decline",
};

export const OFFER_GONE: TicketWaitingLineRefusal = {
  title: "This offer has ended.",
  body: "The tickets went to the next person in line.",
};

export const SOMETHING_WRONG: TicketWaitingLineRefusal = {
  title: "Something went wrong.",
  body: "Try again in a moment.",
};
