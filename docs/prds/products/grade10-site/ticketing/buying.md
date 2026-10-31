---
title: Buying Tickets
spec: grade10-site/ticketing/buying
order: 1
---

An event's page lists its ticket types; a collector picks how many of each
and goes to Stripe's page to pay.

- **Where it starts** ❓ — how `grade10.com/shows` leads to the event's
  page, once its design lands; Design

| Rule | Value |
| --- | --- |
| Tickets one account may hold on one event | Set per event, 10 unless the operator says otherwise |
| 🚧 Tickets one address may hold on one event | The same limit, counted per email, signed in or not; 8 for the show |
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
- 🚧 **Early access** — a type whose rule matches the signed-in address
  sells to it before the public sale; to anyone else it shows when it opens,
  or does not show where it has no public sale
- **Prices** — in the event's currency, through the shared money format —
  [Money Amounts](/p/platform/shared/money-amounts)
- 🚧 **Early bird** — a type shows the price in force and, where a later one
  is set, when this one ends
- 🚧 **Fast Pass** — each pass offers an upgrade per day it admits, at the
  event's Fast Pass price a day; a type that includes it says so and offers
  none
- 🚧 **Restricted** — an event closed to console staff and address patterns
  lists nowhere public, and its page asks a signed-out visitor to sign in
  and refuses anyone outside it
- **Signed out** ❓ — what the page shows and where sign-in happens; Design
- **The events list** ❓ — which events it shows, in what order, and past
  ones or not; Design
- **The event's own content** ❓ — an image or not, and how the venue,
  times and description are laid out; Design
- **Quantity** ❓ — whether the picker stops at what the account may still
  hold; Design
- **Remaining** ❓ — whether a type shows how many are left; Design

## Buying

- 🚧 **Guest** — no sign-in: Buy opens a details step for a name and an
  email, typed once, then Check Your Order, then Stripe's page
- 🚧 **Signed in** — the details step is filled from the account, and the
  order is the account's
- 🚧 **Check Your Order** — before Stripe's page: the name and email read
  back with a way to edit them, the order, the total, and about how many
  points it earns from what is paid
- 🚧 **Agreement** — a tick, needed to pay: a guest agrees to the Terms of
  Sale and Grade10's Terms and Privacy Policy, told their tickets and points
  are kept in a Grade10 account for that email, made if there is none; a
  signed-in buyer agrees to the Terms of Sale only
- 🚧 **Card or WeChat Pay** — both on Stripe's page
- 🚧 **The price held** — a checkout keeps the price it was held at, so an
  early-bird checkout paid after the period still pays early bird
- **Upgrade later** — Fast Pass is bought with the tickets only

:::flow{title="From Buy to tickets" case="Paid"}
## *Collector* - **Presses Buy**
The press passes the bot check, where one is on.
## *Tickets* - **Holds the tickets**
For 15 minutes, against what the type has left and the limit on the email.
## *Collector* - **Pays on Stripe's page**
By the methods under Buying, the collector's email prefilled, in their
language.
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

- **A changed mind** — a second checkout on the same event lets the same
  email's earlier unpaid one go, so nobody holds two sets of tickets
- **Paid too late** — money that lands as the hold ends confirms where the
  tickets are still free and nobody waits for them, and goes back to the
  collector otherwise
- **Pressed twice** — the same selection pressed again never holds a second
  set

## Promo Codes

One code an order — [Promo Codes](/p/grade10-admin/ticketing/promo-codes).

- 🚧 **Code field** — on Check Your Order under the order lines, always shown

- 🚧 **Applied** — a discount line with a way to remove it; the total, the
  points and the pay button follow
- 🚧 **From a link** — the event's address with `?code=` reaches Check Your
  Order with the code applied
- 🚧 **Free with a code** — a total of HK$0.00 skips Stripe's page and earns
  no points; a code never leaves less than HK$4.00 otherwise
- 🚧 **Refused** — said under the field, the order unchanged: not found, not
  started, expired, used up, already used with this email, for other passes
  or a bigger order, for listed emails only, or too many tries
- 🚧 **Used up while paying** — the last use went to another buyer first:
  the buyer pays the full total or removes the code

## Refusals

Each refusal has its own sentence, in every language the site speaks.

- **The sentences** ❓ — each refusal's words; Design

| The collector meets | When |
| --- | --- |
| Sold out | nothing is left, or what is left is the waiting line's |
| Not on sale yet | pressed before the start; the countdown restarts from the service's clock |
| Over your limit | the order would pass the event's limit on one email |
| Not invited | an invited type, and this address has no invitation |
| Over the invitation | more than the invitation lets this address hold |
| 🚧 Not open to you yet | no rule matches this address before the public sale |
| Still busy | the crowd outlasted every retry |
| The check failed | the bot check gave no answer, or a wrong one |
| 🚧 Not for you | a restricted event, and this account is neither staff nor a matching address |
| 🚧 Code used up | the code's last use went to another checkout first |
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
reason, or busy. A guest who never signed up is told, before paying, that
the tickets and points are kept in an account for their email. Out of scope:
a basket across events, two codes on one order, and paying any way but card
and WeChat Pay.

| Measure | Counts |
| --- | --- |
| Press to page | Seconds from Buy to Stripe's page, at the 95th percentile, per sale |
| Paid too late | Payments refunded because the hold had ended |
| Guest share | Orders bought without sign-in, against all orders |
| Reach Stripe | Checkouts started that reach Stripe's page |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Hold | Decided | 15 minutes; Stripe's page closes with it, and money caught as it closes is settled, not lost. | Product |
| Retries | Decided | The site tries a busy press again for about ten seconds before saying busy. | Engineering |
| Price at hold | Decided | A checkout pays the price in force when it held its tickets, so a period ending under a buyer never changes their total. | Product |
| One unpaid checkout per email | Decided | A new checkout lets the same email's earlier unpaid one go, whoever starts it, as the brief keeps it; a guest typing someone else's email can end their unpaid checkout, which the bot check and the 15-minute hold bound. Decided 2026-10-28. | Product |
| Check before paying | Decided | The email is typed once and read back on Check Your Order, where the buyer also sees the total, the points and the terms, rather than typed twice on the details step. Decided 2026-10-30. | Product |
| Agreement makes the account | Decided | A guest's tick agrees to Grade10's Terms and Privacy Policy as well as the Terms of Sale, because the purchase keeps their tickets and points in an account for the email. Decided 2026-10-30. | Product |
| The terms' words | ❓ Open | The Terms of Sale and the refund policy line, tracked in [ops.md § Ticketing](https://github.com/9gag/grade10/blob/main/docs/temp/ops.md). | Legal |
| Fast Pass while buying | Decided | Fast Pass is added in the same checkout as the pass, shown as an upgrade to it; adding it after paying is not offered. | Product |
| WeChat Pay on a phone | ❓ Open | Stripe's page shows a QR code to scan, which a buyer on the same phone cannot; tested in test mode before launch. | Engineering |
| Where the events list lives | ❓ Open | In the site's navigation, the account, or both. | Design |
| The hold on screen | ❓ Open | Whether the order page counts the hold down. | Design |
| The busy state | ❓ Open | How a pending press and a busy answer look. | Design |
| Stripe's back link | ❓ Open | Whether going back from Stripe's page leaves it payable; checked in test mode before the first sale with a waiting line. | Engineering |
:::
