---
title: Your Tickets
spec: grade10-site/ticketing/your-tickets
order: 3
---

Every order has its own page at `grade10.com/tickets/orders/<order>`, which
follows it from the hold to the door. A signed-in collector also sees all
their orders, newest first.

- 🚧 **My Tickets** — the orders list at `grade10.com/tickets/orders`,
  reached from My Tickets in the account menu, beside My Orders; unpaid
  checkouts that lapsed are left out
- 🚧 **Lost tickets** — signing in with the buying email is the way back;
  the order page and the event page say so
- 🚧 **A guest's orders** — join the account behind their email, which the
  purchase made where there was none, so signing in later with that email
  lists them

| Order | The page shows |
| --- | --- |
| Held | the hold's end, Continue to payment |
| Offered | how many, when the offer ends, Accept, Decline |
| Confirmed | the reference, each ticket with its QR code, and its entries so far |
| Expired | that the hold or the offer ended, and which |
| Refunding | the tickets void, the amount going back |
| Refunded | the amount gone back |
| 🚧 Part refunded | the refunded tickets void and marked so, the others kept, the amount gone back |
| Cancelled | a free order cancelled, by the shop or with its event |

## The Tickets

- **One QR per ticket** — a group's tickets show from one phone
- **The same code every time** — a screenshot admits as the page does, and
  the first to reach the door with it gets in
- **The reference** — six characters the door can find the order by, when
  a code will not show
- **Day passes** — show the days they have already been used
- 🚧 **Entries and Fast Pass** — each ticket shows its entries left and its
  Fast Pass days left
- **Void** — a refund or a cancellation voids the tickets at once; the door
  refuses them

## Coming Back From Stripe

- 🚧 **A guest comes back** — the order page shows the order and its codes
  in the browser that bought, for a day, without a sign-in; anywhere else it
  asks to sign in with the order's email
- 🚧 **The order's address** — a random id, never the reference, and it
  never signs anyone in

- **Paid** — the order page confirms the order and shows the tickets
- **Still settling** — the page shows the order as held until the payment
  is settled, and keeps checking
- **Went back** — the tickets are let go, unless the payment landed after
  all
- 🚧 **Settling never ends** — the page says it is safe to close, the mail
  will follow, and gives the reference

## Messages

| Message | When |
| --- | --- |
| Confirmation | an order is confirmed: the reference, each line, and a link to the order |
| 🚧 Confirmation with tickets | the same, with the tickets as one PDF and no link that needs signing in, a link to Stripe's receipt, and the promo code and its discount where one was used |
| Offer | a waiting line offers tickets: how many, when the offer ends, and a link to take it up |
| Cancellation | a paid order is refunded — by the shop, with its event, or because it was paid after its hold ended — or a free one cancelled; with the amount going back |

Every message carries grade10's footer and goes in the collector's
language: English, Traditional or Simplified Chinese. A cancellation
replaces a confirmation not yet sent. A checkout or offer still unpaid when
its event is cancelled is let go without a mail.

## A Shared Free Ticket

A free ticket staff made to share opens at its own private link, one ticket
a link — [Free Tickets](/p/grade10-admin/ticketing/free-tickets).

- 🚧 **The page** — the event, the pass, the guest's name, Fast Pass, the QR
  code and Download PDF; no sign-in needed
- 🚧 **Save to My Tickets** — signs in with an email and keeps the ticket on
  that account, marked free; the link keeps working
- 🚧 **Used today** — the time it came in, with the code still shown for the
  pass's next day
- 🚧 **A dead link** — says why, with no code: cancelled, replaced by a new
  link, the event over, or not found

## The PDF

- 🚧 **One per order** — a page per ticket, each whole on one screen, so a
  buyer screenshots one ticket and sends it to the friend it is for
- 🚧 **Each page** — the event, the pass, its entries and Fast Pass days, the
  buyer's name, the reference and the QR code, in the buyer's language
- 🚧 **No sign-in in the mail** — a link in a mail that lives for months
  never signs anyone in, so the codes travel in the PDF
- 🚧 **Resent** — a resend from the console sends the PDF again, with the
  codes as they stand

:::detail{title="Code map" for="engineer"}
- **Hooks** — `useMyOrders`, `useMyOrder`, `useCheckoutReturn` and `useDeclineOffer` in `@grade10/ticketing-frontend`
- **Site paths** — `TICKETING_SITE_PATHS` in `@grade10/ticketing-contracts`
- **QR code** — a signed ticket id, never stored — [the door, in the design record](https://github.com/9gag/grade10/blob/main/docs/architecture/ticketing.md#the-door)
- **Mail words** — `email.ticketing` in `@grade10/i18n`
:::

:::detail{title="Product decisions" for="pm"}
A collector at the door needs their tickets in two taps, and a collector
whose show was cancelled needs to know their money is coming back. One page
per order carries both, and the reference covers a phone that will not show
a code. Out of scope: a wallet pass, sending a ticket to another account,
and a printed ticket at the door.

| Measure | Counts |
| --- | --- |
| Found at the door | Tickets admitted by reference rather than by code |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Erased account | Decided | The orders stay as the event's record, naming nobody. | Product |
| Paid link | Decided | The codes show without a sign-in only in the browser that paid, for a day; a copied or shared order link opens nothing until the order's email signs in. Decided 2026-10-30. | Product |
| My Tickets | Decided | In the account menu beside My Orders, since signing in with the buying email is how a guest finds lost tickets. | Product |
| Tickets in the mailbox | Decided | The codes reach the buyer as a PDF, because a sign-in link cannot live as long as the mail does, and the codes are easiest found where the mail is. | Product |
| One PDF per order | Decided | One attachment per order, a page per ticket designed to be screenshotted alone. | Product |
| Shared screenshots | ❓ Open | Whether a code that admits from a screenshot is acceptable while transfers are out of scope, or the code should change on each view. | Product |
| Offline tickets | ❓ Open | Whether the page keeps the codes for a phone with no signal. | Design |
| Ended offer and lapsed hold | ❓ Open | How the page words the two kinds of expired order. | Design |
| Paid too late | ❓ Open | Whether the mail for a payment refunded after its hold ended says why, rather than only that the order was cancelled. | Product |
:::
