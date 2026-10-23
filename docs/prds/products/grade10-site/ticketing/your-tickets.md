---
title: Your Tickets
order: 3
---

Every order has its own page at `grade10.com/tickets/orders/<order>`, which
follows it from the hold to the door. A signed-in collector also sees all
their orders, newest first.

- **The orders list** ❓ — where it lives on the site; Design

| Order | The page shows |
| --- | --- |
| Held | the hold's end, Continue to payment |
| Offered | how many, when the offer ends, Accept, Decline |
| Confirmed | the reference, each ticket with its QR code, and its entries so far |
| Expired | that the hold or the offer ended, and which |
| Refunding | the tickets void, the amount going back |
| Refunded | the amount gone back |
| Cancelled | a free order cancelled, by the shop or with its event |

## The Tickets

- **One QR per ticket** — a group's tickets show from one phone
- **The same code every time** — a screenshot admits as the page does, and
  the first to reach the door with it gets in
- **The reference** — six characters the door can find the order by, when
  a code will not show
- **Day passes** — show the days they have already been used
- **Void** — a refund or a cancellation voids the tickets at once; the door
  refuses them

## Coming Back From Stripe

- **Paid** — the order page confirms the order and shows the tickets
- **Still settling** — the page shows the order as held until the payment
  is settled, and keeps checking
- **Went back** — the tickets are let go, unless the payment landed after
  all
- **Settling never ends** ❓ — what the page says when no answer comes;
  Design

## Messages

| Message | When |
| --- | --- |
| Confirmation | an order is confirmed: the reference, each line, and a link to the order |
| Offer | a waiting line offers tickets: how many, when the offer ends, and a link to take it up |
| Cancellation | a paid order is refunded — by the shop, with its event, or because it was paid after its hold ended — or a free one cancelled; with the amount going back |

Every message carries grade10's footer and goes in the collector's
language: English, Traditional or Simplified Chinese. A cancellation
replaces a confirmation not yet sent. A checkout or offer still unpaid when
its event is cancelled is let go without a mail.

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
and printing.

| Measure | Counts |
| --- | --- |
| Found at the door | Tickets admitted by reference rather than by code |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Erased account | Decided | The orders stay as the event's record, naming nobody. | Product |
| Shared screenshots | ❓ Open | Whether a code that admits from a screenshot is acceptable while transfers are out of scope, or the code should change on each view. | Product |
| Offline tickets | ❓ Open | Whether the page keeps the codes for a phone with no signal. | Design |
| Ended offer and lapsed hold | ❓ Open | How the page words the two kinds of expired order. | Design |
| Paid too late | ❓ Open | Whether the mail for a payment refunded after its hold ended says why, rather than only that the order was cancelled. | Product |
:::
