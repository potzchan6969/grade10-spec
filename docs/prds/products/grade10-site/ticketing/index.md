---
title: Tickets
icon: ticket
---

Tickets to grade10's own events: a show, a signing, a launch. A collector
buys on Stripe's hosted page with an email alone — no sign-in — gets a QR
code per ticket, and shows it at the door. One ticketing service runs each
brand's events, so another brand sells with the same screens.

- **Events** — a title, a venue, a start and an end, in every language the
  site speaks; listed once an operator puts it on sale, and a cancelled event
  sells nothing again
- **Ticket types** — what a collector picks: a name, a price, how many
  there are, when they sell and which days they admit on
  1. On sale in their window, for anyone signed in
  2. Paused — listed, selling none
  3. Invited — listed only to the addresses an operator invited
- **Entry** — a single-entry ticket admits once; a day pass admits once on
  each day it is valid
- **Orders** — one checkout on one event, with a six-character reference a
  collector can read out at the door
- **Tickets** — one per person admitted, each with its own QR code
- **Points** — a paid ticket order earns in the
  [loyalty programme](/p/grade10-site/loyalty/points) under the buyer's
  email, lands on the member's ledger once a sign-in proves that address,
  and counts as activity for the balance's expiry

## Where It Is Open

**Not open to the public yet** — the ticketing service and the site's data
for it are carried in development and the two staging lanes, and on no lane
the public reaches; the pages a collector buys on are not built yet —
[Carried Surfaces](/p/grade10-site/site/carried-surfaces)

## Users

- **Collectors** buy on an event's page at `grade10.com/tickets/<event>`,
  join a sold-out type's [waiting line](/p/grade10-site/ticketing/waiting-line),
  and keep their tickets on [Your Tickets](/p/grade10-site/ticketing/your-tickets)
- **Invited guests** — exhibitors, press, partners — buy a type nobody else
  sees, signed in with the address they were invited at
- **Operators** run events, orders and refunds from the
  [Tickets section](/p/grade10-admin/ticketing) of the console
- **Door staff** — console staff — admit tickets at the
  [Door](/p/grade10-admin/ticketing/door)

:::detail{title="Code map" for="engineer"}
- **Design record** — [ticketing architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/ticketing.md)
- **Service** — `apps/backend/grade10/ticketing`, `packages/ticketing/backend`
- **Contracts** — `@grade10/ticketing-contracts` (`packages/ticketing/contracts`)
- **Site data layer** — `@grade10/ticketing-frontend`, installed behind `__GATE_TICKETING__`
:::

:::detail{title="Product decisions" for="pm"}
grade10 runs events of its own, and selling their tickets through a third
party splits the collector's account, mail and language from the rest of
the site. Selling them here keeps one account, one sign-in and one door
list. Out of scope: assigned seating, transfers between accounts, resale,
and a wallet pass.

| User | Job |
| --- | --- |
| Collector | Buy a few tickets to a show quickly, and get in with a phone |
| Invited guest | Claim the tickets they were promised, without a code to type |
| Operator | Put an event on sale, answer a buyer, give money back |
| Door staff | Let the right people in fast, and know why when not |

| Measure | Counts |
| --- | --- |
| Sell-through | Tickets sold against what each type has |
| Holds lapsed | Checkouts that held tickets and never paid, against all checkouts |
| Busy presses | Presses still busy after every retry, per sale |
| Line served | Waiting places offered tickets, and offers accepted |

A sale is first come, first served, and a crowd at one instant needs another
shape:

| Shape | Fits | Status |
| --- | --- | --- |
| First come | Supply meets demand over time | Built |
| Invitations | Comps, press, partners, a presale to a named list | Built |
| Waiting line | A type that sold out, with tickets coming back | Built |
| Waiting room | Shielding the service at one on-sale instant | Added only when a sale's figures show the service saturating |
| Ballot | A drop many times outnumbering its supply | ❓ Open |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Email-keyed buying | Decided | Buying asks only an email — no sign-in — so the press stays short; the order belongs to that address and joins the account a later sign-in proves, its points dated to the purchase. Decided 2026-10-28; supersedes signed-in buying. | Product |
| Payment | Decided | Stripe's hosted page, card only, on the g10-gems account; no card form on the site. | Engineering |
| Busy, never queued | Decided | A press that meets a crowd is answered busy in seconds rather than held waiting. | Engineering |
| Ballot | ❓ Open | Whether a drop that a crowd outnumbers many times sells by ballot — entries, a logged draw, a window to pay each win — decided before the first such drop. | Product |
| Loyalty share of a ballot | ❓ Open | Whether top-tier members get a share; decided with the ballot. | Product |
| Mail words | ❓ Open | The three mails, drafted in four languages, read by a native reader of each before the first sale. | Product |
:::
