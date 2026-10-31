---
title: Orders and Refunds
order: 2
---

## Finding an Order

- **By event, by status** — newest first, a page at a time
- **By reference or address** — the six-character reference, or the
  buyer's address; recorded on the audit chain as a read about one person
- **One order** — its lines, tickets, refund and every mail it was sent
  - 🚧 **Points account** — the account a paid order's points went to,
    including one made for a guest's email
- 🚧 **Export** — the orders as a CSV with each one's Stripe payment id, for
  finance to match payouts

## Acting on an Order

| Act | On | What happens |
| --- | --- | --- |
| Refund | a paid confirmed order | tickets void, capacity back, the refund sent, the buyer mailed |
| Cancel | a free confirmed order | tickets void, capacity back, the buyer mailed |
| Resend confirmation | a confirmed order | the confirmation mailed again |
| 🚧 Refund chosen tickets | a paid confirmed order | those tickets void, their share of the money and points back, the others kept |
| 🚧 Correct the name | a confirmed order | the name on its tickets changes |
| 🚧 Correct the email | a confirmed order | the order moves to the new email and its tickets are mailed there |
| 🚧 Add Fast Pass days | a confirmed order | days added to chosen tickets at no charge |
| 🚧 Download PDF | a confirmed order | the tickets' PDF, for staff to send by hand |

- 🚧 **A reason** — every fix and refund takes one, kept with the order
- 🚧 **Points** — a refund takes back the points the refunded tickets earned
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
what they were sent, and where their money is. Out of scope: moving
tickets to another event, and changing an order's passes.

| Measure | Counts |
| --- | --- |
| Time to refund | From the refund to Stripe taking it |
| Parked refunds | Refunds waiting on a person |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Part refunds | Decided | Staff refund the tickets chosen, voiding only those, since a group often sends back one ticket; supersedes whole refunds only. | Product |
| Order fixes | Decided | A wrong name or email and a missing Fast Pass day are fixed on the order, each with a reason, rather than by refunding and buying again. | Product |
| Refunding used tickets | ❓ Open | Whether a refund should be refused once a ticket was used, or the event is over. | Product |
| Parked refunds | ❓ Open | Who is told when a refund parks, beyond the alarm. | Operations |
:::
