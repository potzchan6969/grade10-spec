---
title: Orders and Refunds
order: 2
---

## Finding an Order

- **By event, by status** — newest first, a page at a time
- **By reference or address** — the six-character reference, or the
  buyer's address; recorded on the audit chain as a read about one person
- **One order** — its lines, tickets, refund and every mail it was sent

## Acting on an Order

| Act | On | What happens |
| --- | --- | --- |
| Refund | a paid confirmed order | tickets void, capacity back, the refund sent, the buyer mailed |
| Cancel | a free confirmed order | tickets void, capacity back, the buyer mailed |
| Resend confirmation | a confirmed order | the confirmation mailed again |

- **Whole orders** — a refund returns the whole order
- **Capacity back** — goes to the waiting line first where anyone waits
- **Used or over** — an order can be refunded after its tickets were used
  and after its event ended

## Refunds

| State | Means |
| --- | --- |
| Due | owed and on its way to Stripe |
| Succeeded | Stripe took it |
| Parked | Stripe refused it, or it kept failing for about a day; a person tries it again |
| Superseded | a parked refund someone tried again, under a new one |

- **Why money goes back** — an operator refunded it, its event was
  cancelled, or it was paid after its hold ended
- **Refunded in Stripe's dashboard** — a whole-charge refund there settles
  the order as refunded too

## An Erased Buyer

Erasure takes the name, the address and the account off every order the
person made; the order, its tickets and its entries stay as the event's
record, naming nobody. An order still held, or owed a refund, waits until it
settles.

:::detail{title="Code map" for="engineer"}
- **Hooks** — `useAdminOrders`, `useAdminOrder`, `useOrderMoves`, `useAdminRefunds`, `useRetryRefund` in `@grade10/ticketing-admin-frontend`
- **Refund ladder** — [money, in the design record](https://github.com/9gag/grade10/blob/main/docs/architecture/ticketing.md#money)
:::

:::detail{title="Product decisions" for="pm"}
A buyer who writes in is answered from one order page: what they bought,
what they were sent, and where their money is. Out of scope: a partial
refund, moving tickets to another event, and editing an order.

| Measure | Counts |
| --- | --- |
| Time to refund | From the refund to Stripe taking it |
| Parked refunds | Refunds waiting on a person |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Whole refunds only | Decided | One refund returns the whole order, so the tickets and the money never disagree. | Product |
| Refunding used tickets | ❓ Open | Whether a refund should be refused once a ticket was used, or the event is over. | Product |
| Parked refunds | ❓ Open | Who is told when a refund parks, beyond the alarm. | Operations |
:::
