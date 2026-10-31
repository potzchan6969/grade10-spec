---
title: Events and Ticket Types
spec: grade10-admin/ticketing/events
order: 1
---

| Rule | Value |
| --- | --- |
| Tickets one account may hold on one event | 1 to 100, 10 by default |
| 🚧 Tickets one email may hold on one event | Replacing one account: 1 to 100, 10 by default, a guest and the account under the email counted together |
| Capacity of one type | Up to 1,000,000 |
| 🚧 Capacity left empty | No limit: the type never sells out and takes no waiting line |
| Price | Free, or at least HK$4.00, Stripe's minimum |
| 🚧 Entries on one type | 1 up to the door days its type admits on |
| 🚧 Price periods on one type | Up to 5 |
| 🚧 Fast Pass price per day | Free, or at least HK$4.00; a full order at the limit, every Fast Pass day added, within what Stripe charges at once |
| 🚧 Address patterns on one event | Up to 20, each an address or `*@` a domain |
| Offer time on a type with a line | 30 minutes to 24 hours |
| Addresses one invitation send may name | Up to 200 |
| 🚧 Entries in one access rule | Up to 200, each an address or `*@` a domain |
| ❓ Access rules on one type | TBC by Product |
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
- 🚧 **Audience** — public, or restricted to console staff, a list of
  address patterns such as `*@9gag.com`, or both; a restricted event sells only to a
  signed-in account it lets in, so a rehearsal runs on the real site, then
  opens to everyone with one edit, which holds from the next checkout and the
  next waiting-line offer taken up
- 🚧 **Dates** — every date is the event's: its days, and each type's sales
  window and price periods, so the same show can be rehearsed before it is
  public; an edit that leaves a type more entries than its door days is
  refused
- 🚧 **Fast Pass** — the event's price per day; none set, the event offers
  none. A Fast Pass day is spent when the door uses it on a day the ticket comes in
- 🚧 **Warn at** — a number of guests per event day; passing it alerts
  Operations and shows on Sales, and never stops a sale
- 🚧 **Promo codes and free tickets** — the event's own —
  [Promo Codes](/p/grade10-admin/ticketing/promo-codes),
  [Free Tickets](/p/grade10-admin/ticketing/free-tickets)

## A Ticket Type

- **Window** — the sales start and end, and the days it admits on, both
  inside the event
- **Entry** — `once` or `daily`
- 🚧 **Entries** — replacing entry: how many days a ticket admits on, once a
  day, any day of the event; existing types keep what they admit
- 🚧 **Price periods** — a price from a date until the next one starts; the
  first is the type's price from the sales start, so an early bird is a
  first period and the full price a second
- 🚧 **Includes Fast Pass** — on every day the ticket admits, at no extra
  cost, as VIP does
- **Status** — `active`, `paused` or `invited`; pausing stops sales and
  freezes the waiting line
- 🚧 **Public sale** — replacing the `invited` status: on, in the type's
  window, or off, so only its access rules sell it
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
| 🚧 Fast Pass | Fast Pass days sold, and how many the door used |
| Waiting | places in the line |

- 🚧 **Sales** — the event's tab: sold today, gross, checkouts open now and
  Fast Pass days, per hour and per day, by pass, by card or WeChat Pay, and
  by guest or account; refreshed every 30 seconds while open
- 🚧 **Attendees export** — a CSV per door day

## Invitations

An invited type sells only to the addresses invited to it, each up to the
quantity its invitation names.

- 🚧 **Replaced** — by [access rules](#access-rules)

- **Send** — paste up to 200 addresses and a quantity; an address already
  invited takes the new quantity
- **No mail** — the service mails nobody; the operator tells their guests
- **Take back** — tickets already bought stay; the address can buy no more
- **The list** — each invitation with how many its address holds now
- **No stock** — an invitation holds no tickets back; the type's capacity
  is the stock

## Access Rules

🚧 Replacing invitations: a type's rules say who may buy it outside its public
sale, and when. Early access is a rule that opens before the public sale; a
type only some may buy has its public sale off.

- **Who** — exact addresses and `*@` domains; a buyer signs in so the address
  is proven
- **When** — the rule opens on a date and may close on one; with neither, it
  follows the type's window
- **How many** — a limit per address, or the event's limit on one email
- **Price** — the price period in force, so an early bird for early access
  starts when the rule opens
- **Carried over** — each invitation becomes a rule of one address with its
  quantity
- **Take back** — tickets already bought stay; a removed rule sells no more
- **No stock** — a rule holds no tickets back; the type's capacity is the
  stock
- **The list** — each rule with how many tickets matching addresses hold now

:::detail{title="Code map" for="engineer"}
- **Hooks** — `useAdminEvents`, `useAdminEvent`, `useEventMoves`, `useTicketTypeMoves`, `useAttendees`, `useAccessRules`, `useAccessRuleMoves` in `@grade10/ticketing-admin-frontend`
:::

:::detail{title="Product decisions" for="pm"}
An operator puts a show on sale in one sitting and needs to see, at any
moment, how it is selling and who is waiting. A partner's presale is a list
of addresses, not a link that works for whoever holds it. Out of scope:
seating plans and a hidden link.

| Measure | Counts |
| --- | --- |
| Invitations used | Invited quantity bought, against quantity invited |
| 🚧 Early access used | Tickets bought under a rule before the public sale, against the type's capacity |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Generic events | Decided | Passes, prices, dates, Fast Pass and who may buy are the event's settings, so the next event is set up in the console, never built. | Product |
| No limit | Decided | A type may have no capacity, so a show that never sells out offers no sold-out state and no line; the venue is guarded by Warn at instead. | Product |
| Fast Pass limit | ❓ Open | Whether the Fast Pass queue needs a cap on the Fast Pass days sold; none is built, since a cap needs a counter of its own beside each type's capacity. | Product |
| Rehearsal | Decided | An event restricted to staff and address patterns is sold on the real site, then opened; a pattern alone proves nothing, so a restricted event needs a sign-in. | Product |
| Invitation per address | Decided | Sign-in proves the address, so no code is needed, and an address with no account yet can be invited. | Product |
| Invitation mail | ❓ Open | Whether the service mails an invited guest, or the operator keeps telling them; the same holds for an access rule. | Operations |
| Access rules replace invitations | Decided | Who may buy a type, and when, is one setting on the type: addresses or domains, with a window and a limit; an invitation is a rule of one address. Decided 2026-10-30. | Product |
| Event audience stays | Decided | A rehearsal stays one switch on the event; access rules are per type. Decided 2026-10-30. | Product |
| Cancel confirmation | ❓ Open | How the console makes cancelling, which refunds everyone, a deliberate act. | Design |
| Placement | ❓ Open | Where Tickets sits in the console's navigation. | Design |
:::
