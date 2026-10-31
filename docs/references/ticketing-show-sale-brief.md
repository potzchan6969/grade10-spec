# Ticketing Show Sale Brief

The owner's brief for selling the next show's tickets online, given on
2026-10-28 and answered the same day, and the plan that turns the built
ticketing service into one that sells it — and any later event — without new
code per event. The pages under
[Tickets](../prds/products/grade10-site/ticketing/index.md) and
[Ticket operations](../prds/products/grade10-admin/ticketing/index.md) carry
the product it settles; the service is built in the application repository.
Where this document and a page or a spec disagree, they are correct.

## The Brief

- **Entrance** - `grade10.com/shows` is where a buyer starts. How that page
  points at the event on sale waits on its design, and nothing is built for
  it until then
- **Design** - everything this brief needs is designed this time, except
  the `/shows` page
- **No sign-in** - a buyer pays without signing in, like a guest checkout
- **Two surfaces** - a public ticket page per event, and a console section
  that runs the events. Nothing reaches into g10-gems; the two systems stay
  independent
- **Buying** - the buyer's name and email, once per order; Stripe, by card
  or WeChat Pay; at most 8 tickets per buyer
- **Passes**
  1. VIP, two days
  2. General, adult, two days
  3. General, child, two days
  4. General, adult, one day
  5. General, child, one day
- **Fast Pass** - skips the entrance queue at extra cost, bought per day as
  an upgrade to a ticket; VIP includes it
- **Early bird** - each pass has its own lower price during an early period
- **Points** - a purchase earns points to the address given. The account
  behind that address is made if there is none, and the points land at
  once; the buyer signs in later to see them
- **Point history** - each earn adds a row to the buyer's point history
- **Tickets by mail** - the QR codes reach the buyer's mailbox as one PDF,
  readable without signing in. A link in the mail cannot sign anyone in,
  because the mail lives for months and no sign-in link lives that long
- **Rehearsal** - every date is set in the console, and an event can be
  sold only to console staff or to addresses matching a pattern such as
  `*@9gag.com`, so a rehearsal runs on the real site before the public sees
  the show
- **The booth** - not the system's. Staff sell on site by hand at a member
  or a non-member price, check membership on the member card, and hand over
  a wristband. A booth sale earns no points and is in no history

## What The Answers Settled

| Item | Decision |
| --- | --- |
| g10-gems' alerts | g10-gems ignores a dispute or a failed refund on a payment carrying `ticketOrderId`, before the first live sale |
| Points to someone's account | A purchase earns at once to the account behind the address, whether or not anyone has signed into it |
| Entries | Every pass is one QR code, good on any day of the event, once per day; a two-day pass admits on 2 days, a one-day pass on 1 |
| Fast Pass | Bought per day, shown as an upgrade to the pass; VIP has it every day it admits |
| PDF | One PDF per order, a page per ticket designed to be screenshotted on its own |
| Buyer's details | Name and email, once per order |
| Dates and rehearsal | Every date is the event's setting; an event can be closed to console staff and address patterns |
| How it lands | All at once, the pages under `docs/prds` first, without the OpenSpec workflow; the pages are its record |
| Fast Pass days | Any day the ticket comes in through the lane, not a named day of the event |
| Upgrading later | None: Fast Pass is bought with the tickets only |
| Who draws the screens | Drafted here in the design system, extended where ticketing needs it, everything but `/shows` |

## Generic By Design

Every value the brief names is configuration on an event, so the next event
is a console session, not a release.

| An event sets | This show |
| --- | --- |
| Title, venue, description, in every site language | The show |
| Event days, and every type's sales window | Two days; early bird, then full price |
| Who may buy | Anyone; for the rehearsal, console staff and `*@9gag.com`, `*@memestrategy.com` |
| Tickets one buyer may hold | 8 |
| Ticket types: name, entries, capacity, sales window | The five passes, with 2 or 1 entries |
| Each type's price periods | An early-bird price until a date, then the full price |
| Fast Pass: the price per day, the types that include it | Included on VIP |

- **The programme decides points** - a paid ticket earns by the loyalty
  programme's rule; no event turns it on or off
- **Payment methods are the brand's** - card and WeChat Pay for every
  grade10 event
- **Invited types keep sign-in** - an invitation is proved by signing in
  with its address; only a type on open sale is bought as a guest
- **The waiting line keeps sign-in** - a place belongs to an account, and
  its offer is mailed to it

## The Plan

Six phases. Phases 2 and 3 need no design and run while design works; phase
5 waits on it.

### Phase 1 - The Pages

The pages say what the product is before any code moves. Each new outcome is
one 🚧 line; each open item a ❓ naming who answers it.

- **Tickets** - who may buy (guest, restricted event), card and WeChat Pay,
  the cap per address, Fast Pass and early bird on the event page, the
  details step, the return page, entries per pass; the decided rows that
  flip — signed-in buying, card only
- **Your Tickets** - the PDF by mail, a guest's orders joining the account
  once a sign-in proves the address, the return page for a guest
- **Events and Ticket Types** - event days and audience, entries, price
  periods, Fast Pass settings
- **Door** - entries per ticket, the Fast Pass lane
- **Points** - tickets earn, the history row, booth sales never earn
- **Carrying the marks** - the work lands without the OpenSpec workflow:
  no change record and no durable spec, the pages being its whole record. A
  🚧 line needs no change behind it, and comes off once its outcome ships
  and is checked

### Phase 2 - The Service

In `packages/ticketing` and `apps/backend/grade10/ticketing`, one migration
per step, each behind the tests its lanes already run.

1. **Guest checkout** - `checkout.start` takes a name and an address with no
   session; the bot check is required for it. The lock row, the cap, the
   one-unpaid-checkout rule and the request key move from the account to the
   folded address. A signed-in buyer buys under the account's address
2. **Restricted events** - an event's audience: public, or console staff
   and address patterns. A restricted event lists nowhere public, needs a
   sign-in, and refuses everyone else `NOT_IN_AUDIENCE`
3. **WeChat Pay** - `wechat_pay` beside `card` on the hosted page, and the
   pin that the payment carries `ticketOrderId` alone; ticketing alarms on
   `charge.dispute.created` for its own payments
4. **Price periods** - a type's prices by start date; the hold writes the
   price in force as the line's `unitPrice`, so an early-bird checkout paid
   late keeps its price
5. **Entries** - `entry: once | daily` becomes `entries`, a count from 1 to
   the event's days, at most one per door day; existing types migrate,
   `once` to 1 and `daily` to the days they admit on
6. **Fast Pass** - the event's Fast Pass price per day, and no limit (❓ on
   the page); a type that includes it; an order line carries how many of its entries are
   fast, every ticket on the line carries it, and the total prices it in
7. **The door** - a scan admits while the ticket has an entry left and none
   today; a door set to the Fast Pass lane admits only a ticket with a fast
   entry left, and sends the rest to the main queue without using an entry
8. **Points** - on confirmation, the account behind the address, made
   unverified if none, through the auth worker's `accountByEmail` and
   `createUnverifiedAccount`; the order takes that account; a due row calls
   loyalty's `recordSpend` on the amount paid, channel `online`, reference
   type `ticket_order`, so a lost call is retried; a refund calls
   `recordRefund`
9. **PDF tickets** - a `TicketPdf` document beside the auction's PDFs in
   `@grade10/ui`, drawn with pdf-lib, a page per ticket with the event, the
   pass, the days it admits, its Fast Pass, the buyer, the reference and the
   QR code, in the buyer's language; the confirmation and its resend attach
   it and carry no link that needs signing in
10. **The guest's return** - the checkout answers a view token, kept in the
    buying browser for a day, that lets `/tickets/orders/<id>?checkout=done`
    show the order and its codes without a session
11. **The design record** - `docs/architecture/ticketing.md` rewritten for
    each step as it lands

### Phase 3 - g10-gems

- **The guard** - its webhook skips `refund.failed` and
  `charge.dispute.created` whose payment carries `ticketOrderId`, with a
  test; a pull request on `9gag/g10-gems` for its team to merge before the
  first live sale

### Phase 4 - Design

Everything below, in Figma, in English and both Chinese scripts.

- **Event page** - the event's content, each pass with its five sale
  states, the early-bird price and when it ends, the Fast Pass upgrade per
  day, quantity against the cap, remaining or not, a restricted event's
  refusal
- **Details step** - name, address typed twice, the total, Pay; signed in,
  prefilled
- **Busy and refusals** - a pending press, a busy answer, each refusal's
  sentence
- **Return page** - paid, still settling, settling that never ends, went
  back
- **Your Tickets** - the orders list and an order's page
- **PDF and mail** - the ticket page of the PDF; the confirmation, offer
  and cancellation mails
- **Point history** - the ticket row
- **Console** - events list, event editor with languages, days, audience,
  passes, price periods and Fast Pass; publish and cancel; figures; orders
  and refunds; invitations; the guest list
- **Door** - the scan answer at arm's length, the Fast Pass lane, find by
  reference, no connection

### Phase 5 - The Screens

- **Site** - the event page, details step, return page and Your Tickets in
  `apps/frontend/grade10`, on `@grade10/ticketing-frontend`, behind the
  `ticketing` gate until launch
- **Console** - the Tickets section and the door in `apps/admin/grade10`, on
  `@grade10/ticketing-admin-frontend`
- **Blocks** - every new compound component in `@grade10/ui`, from the
  design, with its stories

### Phase 6 - Rehearsal And Launch

- **Rehearsal** - the show set up in production, restricted to console staff
  and the two domains; real card and WeChat Pay purchases, the PDF, points,
  the door on both lanes, and a refund that claws the points back
- **Launch** - the audience opened to everyone, the `ticketing` gate opened
  on production, and `/shows` linking to the event once its design lands

## The Webhook Check

Both systems on one Stripe account, each with its own endpoint and signing
secret. Stripe sends every event to every endpoint subscribed to it, and
retries each endpoint on its own, so one endpoint failing never holds the
other's events. What each side does with the other's events, read on
2026-10-28 from g10-gems `f51bb6d` and grade10's ticketing service:

| Event | g10-gems on a ticket's event | Ticketing on a g10-gems event | Clash |
| --- | --- | --- | --- |
| `payment_intent.succeeded` | Skipped — no `booking_id`, answers 200 | Ignored | None, while a ticket's payment carries `ticketOrderId` alone, as a test pins |
| `checkout.session.*` | Not handled; g10-gems makes no Checkout Session | `not_ours` without `ticketOrderId` | None |
| `charge.refunded` | `mark_payment_refunded` finds no payment record, changes nothing, 200 | `not_ours` for an unknown intent | None |
| `refund.failed` | **Mails g10-gems' admins** "refund failed — refund by FPS", with no booking | Parks its own refund and alarms | **Yes** — two teams told to refund one buyer, one of them by FPS |
| `charge.dispute.created` | **Mails g10-gems' admins** "card payment disputed", with no booking | Not handled | **Yes** — the wrong team hears, ticketing hears nothing |

- **Customers** - none clash: ticketing makes no Stripe Customer, and
  Checkout's guest customer is not one g10-gems finds by address
- **Live and test** - both refuse an event whose mode is not their lane's
- **Shared by the account** - the API rate limit, so an on-sale crowd can
  slow g10-gems' Stripe calls; Radar rules; the statement descriptor and the
  receipts Stripe mails, under the account's one business name; one payout,
  split in reporting by `ticketOrderId`
- **WeChat Pay** - already on for the account, since g10-gems takes it in
  HKD, so no Stripe setup is needed
- **The fix** - phase 2 step 3 and phase 3

## Open

- **WeChat Pay on a phone** ❓ - Stripe's hosted page shows a QR code to
  scan, which a buyer on the same phone cannot; tested in test mode before
  launch; engineering
- **Mail words** ❓ - the confirmation, offer and cancellation in three
  languages, read by a native reader of each; product owner
