---
title: Events and Ticket Types
order: 1
---

| Rule | Value |
| --- | --- |
| Tickets one account may hold on one event | 1 to 100, 10 by default |
| Capacity of one type | Up to 1,000,000 |
| Price | Free, or at least HK$4.00, Stripe's minimum |
| Offer time on a type with a line | 30 minutes to 24 hours |
| Addresses one invitation send may name | Up to 200 |
| An edit reaches the site | Within 5 seconds on the event's page, 30 on the events list |

## An Event

- **Draft** — a new event starts here and lists nowhere; it is priced in the
  brand's currency, HKD on grade10
- **Publish** — puts it on sale; it needs at least one `active` type, an end
  still ahead, and every type selling and admitting inside the event
- **Unpublish** — takes it off sale while nothing is held, sold or being
  refunded on it
- **Cancel** — for good: every unpaid hold and offer is let go, every free
  order cancelled, every paid order refunded, and every buyer with confirmed
  tickets mailed
- **Languages** — the title, summary, venue and description in each language
  the site speaks, falling back to the base text

## A Ticket Type

- **Window** — the sales start and end, and the days it admits on, both
  inside the event
- **Entry** — `once` or `daily`
- **Status** — `active`, `paused` or `invited`; pausing stops sales and
  freezes the waiting line
- **Waiting line** — on when an offer time is set; an invited type takes none
- **Capacity** — never under what is held and sold; raising it gives the new
  tickets to the line first

- **An edit that would strand the line is refused** — clearing its line,
  making it invited, cutting capacity under its largest place, or unpublishing
  the event while anyone waits.

## The Figures

Each type shows what it holds now.

| Figure | Counts |
| --- | --- |
| Held | tickets in unpaid checkouts |
| Offered | tickets in standing waiting-line offers |
| Sold | tickets of confirmed orders |
| Admitted | tickets let in at the door |
| Gross | the value of confirmed orders |
| Waiting | places in the line |

## Invitations

An invited type sells only to the addresses invited to it, each up to the
quantity its invitation names.

- **Send** — paste up to 200 addresses and a quantity; an address already
  invited takes the new quantity
- **No mail** — the service mails nobody; the operator tells their guests
- **Take back** — tickets already bought stay; the address can buy no more
- **The list** — each invitation with how many its address holds now
- **No stock** — an invitation holds no tickets back; the type's capacity
  is the stock

:::detail{title="Code map" for="engineer"}
- **Hooks** — `useAdminEvents`, `useAdminEvent`, `useEventMoves`, `useTicketTypeMoves`, `useAttendees`, `useInvitations`, `useGrantInvitations`, `useRevokeInvitation` in `@grade10/ticketing-admin-frontend`
:::

:::detail{title="Product decisions" for="pm"}
An operator puts a show on sale in one sitting and needs to see, at any
moment, how it is selling and who is waiting. A partner's presale is a list
of addresses, not a link that works for whoever holds it. Out of scope:
seating plans, a hidden link, and a discount code.

| Measure | Counts |
| --- | --- |
| Invitations used | Invited quantity bought, against quantity invited |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Invitation per address | Decided | Sign-in proves the address, so no code is needed, and an address with no account yet can be invited. | Product |
| Invitation mail | ❓ Open | Whether the service mails an invited guest, or the operator keeps telling them. | Operations |
| Cancel confirmation | ❓ Open | How the console makes cancelling, which refunds everyone, a deliberate act. | Design |
| Placement | ❓ Open | Where Tickets sits in the console's navigation. | Design |
:::
