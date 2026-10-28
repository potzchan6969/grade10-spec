---
title: Buying Tickets
order: 1
---

An event's page lists its ticket types; a collector picks how many of each
and goes to Stripe's page to pay.

| Rule | Value |
| --- | --- |
| Tickets one account may hold on one event | Set per event, 10 unless the operator says otherwise |
| Ticket types on one order | Up to 20 |
| How long a checkout holds its tickets | 15 minutes; Stripe's page closes when the hold ends |
| How long a busy press keeps trying | About ten seconds |

## The Event Page

Each ticket type shows one of five sale states, and the page moves between
them on the second without reloading.

| State | The type shows |
| --- | --- |
| On sale | the price, a quantity, Buy |
| Not started | the price and a countdown to the sale |
| Sold out | Join the waiting line where the type takes one; Sold out otherwise |
| Paused | the price, selling none |
| Ended | sales ended, or the event is over or cancelled |

- **One clock** — the countdown runs on the service's clock, not the
  phone's, so a phone set wrong opens nothing early
- **Sold out can come back** — a lapsed hold returns its tickets within a
  minute, to the waiting line first where anyone waits
- **Invited types** — appear only to a signed-in collector whose address
  was invited, beside the listed types, with how many that address may still
  hold
- **Prices** — in the event's currency, through the shared money format —
  [Money Amounts](/p/platform/shared/money-amounts)
- **Signed out** ❓ — what the page shows and where sign-in happens; Design
- **The events list** ❓ — which events it shows, in what order, and past
  ones or not; Design
- **The event's own content** ❓ — an image or not, and how the venue,
  times and description are laid out; Design
- **Quantity** ❓ — whether the picker stops at what the account may still
  hold; Design
- **Remaining** ❓ — whether a type shows how many are left; Design

## Buying

:::flow{title="From Buy to tickets" case="Paid"}
## *Collector* - **Presses Buy**
The press passes the bot check, where one is on.
## *Tickets* - **Holds the tickets**
For 15 minutes, against what the type has left and the account's limit.
## *Collector* - **Pays on Stripe's page**
Card only, the collector's address prefilled, in their language.
## *Collector* - **Comes back to the order page**
The order is confirmed and the confirmation mailed —
[Your Tickets](/p/grade10-site/ticketing/your-tickets).
:::

:::flow{title="From Buy to tickets" case="Free"}
## *Collector* - **Presses Buy**
The same press, the same checks.
## *Tickets* - **Confirms at once**
No Stripe page; the order page opens on the tickets.
:::

:::flow{title="From Buy to tickets" case="A crowd"}
## *Collector* - **Presses Buy**
Too many collectors are buying that type this instant.
## *Site* - **Keeps trying**
For about ten seconds, with the button pending.
## *Site* - **Says it is still busy**
The same press, pressed again, may go through. Nothing is held, unless
Stripe was the one pacing pages: then the tickets stay held, and the next
press opens the page.
:::

- **A changed mind** — a second checkout on the same event lets the
  account's earlier unpaid one go, so nobody holds two sets of tickets
- **Paid too late** — money that lands as the hold ends confirms where the
  tickets are still free and nobody waits for them, and goes back to the
  collector otherwise
- **Pressed twice** — the same selection pressed again never holds a second
  set
- **No sign-in to buy** — buying asks only an email, so the press stays
  short; the order and the points it earns belong to that address, and join
  the account a later sign-in proves -
  [Points](/p/grade10-site/loyalty/points)

## Refusals

Each refusal has its own sentence, in every language the site speaks.

- **The sentences** ❓ — each refusal's words; Design

| The collector meets | When |
| --- | --- |
| Sold out | nothing is left, or what is left is the waiting line's |
| Not on sale yet | pressed before the start; the countdown restarts from the service's clock |
| Over your limit | the order would pass the event's limit on one account |
| Not invited | an invited type, and this address has no invitation |
| Over the invitation | more than the invitation lets this address hold |
| Still busy | the crowd outlasted every retry |
| The check failed | the bot check gave no answer, or a wrong one |
| Payment could not start | Stripe could not make the page; the tickets were let go |

:::detail{title="Code map" for="engineer"}
- **Sale rule** — `saleStateOf` in `@grade10/ticketing-contracts`
- **Hooks** — `useEvent`, `useEventMine`, `useLiveSale`, `useStartCheckout` in `@grade10/ticketing-frontend`
- **Refusal codes** — `TICKETING_FAILURE_CODES` (`packages/ticketing/contracts/src/failures.ts`)
- **Leaving for Stripe** — `leaveDocument`, per `docs/conventions/pending.md`
- **The crowd** — [buying, in the design record](https://github.com/9gag/grade10/blob/main/docs/architecture/ticketing.md#buying)
:::

:::detail{title="Product decisions" for="pm"}
A sale that opens at one instant draws a crowd the service cannot serve all
at once, and a buyer who sits waiting cannot tell a slow sale from a broken
one. The page answers within seconds, every time: a page to pay on, a
reason, or busy. Out of scope: a basket across events, promo codes, and
paying any way but card.

| Measure | Counts |
| --- | --- |
| Press to page | Seconds from Buy to Stripe's page, at the 95th percentile, per sale |
| Paid too late | Payments refunded because the hold had ended |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Hold | Decided | 15 minutes; Stripe's page closes with it, and money caught as it closes is settled, not lost. | Product |
| Retries | Decided | The site tries a busy press again for about ten seconds before saying busy. | Engineering |
| Where the events list lives | ❓ Open | In the site's navigation, the account, or both. | Design |
| The hold on screen | ❓ Open | Whether the order page counts the hold down. | Design |
| The busy state | ❓ Open | How a pending press and a busy answer look. | Design |
| Stripe's back link | ❓ Open | Whether going back from Stripe's page leaves it payable; checked in test mode before the first sale with a waiting line. | Engineering |
:::
