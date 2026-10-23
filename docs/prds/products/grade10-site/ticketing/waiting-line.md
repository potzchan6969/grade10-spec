---
title: Waiting Line
order: 2
---

A ticket type that sells out can take a waiting line. Tickets that come back
go to the line first, as offers to the collectors waiting in it.

| Rule | Value |
| --- | --- |
| How long an offer holds | Set per type, 30 minutes to 24 hours, or until the event ends if sooner |
| Places one account holds | One per type |
| How soon returned tickets are offered | Within a minute |

## Joining

- **Where** — Join the waiting line replaces Buy on a sold-out type that
  takes a line
- **How many** — the collector says how many tickets they wait for, up to
  what the account may still hold on the event
- **While anyone waits** — the type reads sold out to everyone else, even
  with tickets free, because those tickets are the line's
- **Joining again** — answers the place or the offer the account already
  holds
- **No line** — an invited type takes none, because its buyers are named
  already

## Your Place

The place shows roughly how far back the collector is, as a band, never an
exact number. The line offers each place whose group fits the tickets free,
in the order they joined, so a smaller group behind can be served before a
larger one ahead.

- **The band** ❓ — where the bands break and what each says; Design
- **Leaving** — gives up the place; an offer already made stands until it
  is declined or lapses
- **A place that ends** — because the event ended, was cancelled, or the
  account has no room left, sends no mail

## The Offer

:::flow{title="From a returned ticket to a place at the door"}
## *Tickets* - **Offers the tickets**
To the first place whose group fits, and mails the offer.
## *Collector* - **Accepts**
Pays on Stripe's page, or, for free tickets, is confirmed at once.
## *Collector* - **Holds tickets**
The order page shows them, as any confirmed order does.
:::

- **On the event page** — a standing offer shows with Accept, Decline and
  when it ends
- **Past the sales end** — an offer made before sales close runs its full
  time
- **Declined or lapsed** — the tickets go to the next place that fits
- **Accepting again** — opens the same Stripe page while the offer holds

:::detail{title="Code map" for="engineer"}
- **Hooks** — `useJoinWaitlist`, `useLeaveWaitlist`, `useAcceptOffer` and `useDeclineOffer` in `@grade10/ticketing-frontend`; the place and the offer are read with `useEventMine`
- **Design record** — [the waiting line](https://github.com/9gag/grade10/blob/main/docs/architecture/ticketing.md#the-waiting-line)
:::

:::detail{title="Product decisions" for="pm"}
A sold-out show still has tickets coming back — a hold that lapses, a
refund — and without a line they go to whoever reloads at the right second.
The line hands them to the people who asked first, by mail, with time to
pay. Out of scope: a line on an invited type, and a line that holds tickets
back for a large group.

| Measure | Counts |
| --- | --- |
| Offers made | Per type, by how each ended: accepted, declined, lapsed |
| Wait | Time from joining to an offer |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| First fit | Decided | The smaller group behind is served before tickets wait for a larger group ahead. | Product |
| Position | Decided | Shown as a rough band, since first fit can move a place. | Product |
| No mail when a place ends | Decided | Only an offer is mailed. | Product |
| Live position | ❓ Open | Whether the page pushes "it's your turn" while it is open, or the mail alone tells. | Product |
:::
