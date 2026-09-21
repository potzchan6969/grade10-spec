---
title: Collector Pages
spec: grade10-site/vault/case-intake
order: 1
---

The collector's side of the vault is one signed-in section: the cases they
hold, a wizard to open another, and each case's own page.

- **URL** — `grade10.com/vault`, unprefixed: a session surface answers at one
  address and reads the language off the collector's cookie, so `/tc/vault`
  matches nothing; signing in is asked for in a dialog, never a redirect
  1. `grade10.com/vault` — the list and the wizard
  2. `grade10.com/vault/cases/<id>` — one case, the address every email links to
  3. `grade10.com/vault/sign#<token>` — the signing ceremony, opened from the
     QR code or link staff hand over; no account needed
- **Sign-in** — magic link, Google where enabled; no phone number and no SMS
- **Language** — the section, the wizard, every refusal and the ceremony's
  chrome in English and both Chinese scripts; the paper and every email English

## Case list

- **One card per case** — the item's name, status, when it opened, the lane,
  the amount asked
- **Start a request** — opens the wizard; **3** unsent drafts at most per
  account
- **A draft** — reopens on its photo step from the list

## Request wizard

Three steps, one per thing the collector does.

1. *Collector* — **Describe the item** — category (trading card, coin,
   bullion, watch, jewellery, other), title (≤ **200** characters),
   description (≤ **2,000**), WhatsApp number (optional, unverified, stored
   in E.164), and the question that decides the lane: a loan and how much
2. *Collector* — **Photograph it** — **1 to 10** photos, JPEG, PNG or WebP,
   ≤ **20 MB** each; location metadata is stripped before and after upload
3. *Collector* — **Send it in** — needs at least one photo; the case becomes
   `submitted` and the page offers the visit booking

- 🚧 **Check it, then send** — the third step reads the request back, says
  what happens next, and takes the collector's tick that they have read the
  personal information collection statement before it sends
- **Currency** — the brand's (HKD for Grade10); another currency is refused
- **One item per case** — a binder of twelve cards is twelve requests, in
  batches of three; book one visit on the first and bring them all together

## Case page

What a collector reads on one case, top to bottom.

- **Header** — item, status badge, lane badge, and staff's decline reason
  verbatim when declined
- 🚧 **Case reference** — six characters from an alphabet that cannot be
  misread, issued beside the id when the request is sent in; in the header,
  the list and every email, spoken at the counter, typed as the transfer
  reference; the address keeps the id
- 🚧 **The fact it meets** — the badge and the line under it read the case as
  it stands, derived at the read and never a status of its own: the offer ran
  out, you declined it, a new offer replaced the last, we closed the visit
  you missed, you asked for it back — each with the one thing to do next
- 🚧 **Endings** — declined with the reason, cancelled, expired naming the
  clock that ended it, forfeited naming the figure the item settled, the
  notice date and the date to pay by; the signed agreements stay on the page
- **Photos** — thumbnails, served only to the owner and to staff
- **The offer** — amount, term in days, rate for the term, the total to
  repay, what a late day costs, and the expiry; **Accept** and **Decline**
  are the collector's own; no repay-by date, because the term runs from the payout
- 🚧 **Answering from the page** — Accept opens a confirmation naming the
  total, what a late day costs and what will be signed; Decline and Cancel
  confirm the same way; the card names the valuation and promises that
  accepting starts nothing, declining keeps the request open, the visit stands
- **What is owed** — outstanding of total, repaid so far, due date, days
  overdue, and the instant it was computed at, with the line saying the
  balance holds until the deadline
- 🚧 **How to pay** — under a live loan, the block
  [Loan and Money](/p/grade10-site/vault/loan-and-money#reading-the-book)
  states, the daily figure after the deadline, and the dates the reminders go
- 🚧 **Repayments** — each with the day it reached the bank, the method and
  the balance after it; a part payment clears interest first and never
  restarts the clock
- 🚧 **Final notice** — on a loan past due once the notice is sent: the date
  to pay by, the reminders already sent, and that nothing can be taken
  before that date
- **Custody** — held since when, settled or what is outstanding, and **Ask
  for it back**, which records one ask while the item is held
- **Documents** — each packet with its fingerprint, each sealed document with
  its fingerprint and a download
- 🚧 **After release** — the collected date, the release receipt beside the
  agreements, the public verify address beside each fingerprint, and what is
  kept for how long, linking
  [Your data](/p/grade10-site/vault/compliance-and-readiness#retention-and-erasure)
- **Visit** — the booking picker at every live status but a draft, so a
  visit can be booked before the valuation, after the offer, or to repay and
  collect on
- 🚧 **Before the visit** — a case with a visit ahead names the slot, adds it
  to the collector's calendar, and lists what to do first: verify identity on
  this phone, bring the item, sign at the counter
- **Cancel this request** — ends the case at any status before the item is in
  the vault; any visit is cancelled with it and the item stays with the collector
- **History** — every event the collector may see, actor kind only, never a
  staff id; the counter's own records stay staff-only

## Booking a visit

- **Where and when** — shops and free slots come from the diary; a
  **14-day** window in the shop's own zone; a slot in the past is refused
- **Move or cancel** — any time up to the slot, an email each, whether the
  collector or staff moved it
- 🚧 **Booked** — a confirmation screen names the shop, the slot and what to
  bring, with add to calendar, move and cancel
- **A missed visit** — closes the visit and keeps the case; a submitted case
  ends **24 hours** after the slot instead, and the email says the visit was
  missed — [Case Lifecycle](/p/grade10-site/vault/case-lifecycle#timers)
- **The visit completes** on the first counter act after its slot

## Messages

- 🚧 **Email, English, twenty-four kinds** — one per event the collector may
  see, the identity-check invitation before the visit among them; the set is
  the capability's own table
- 🚧 **What a message names** — its figures as a table, not a sentence: the
  offer its terms, total, late-day cost and expiry; a money message the
  amount, the due date, the daily figure after it and how to pay; a reminder
  its schedule; every message the reference, the licence line, the complaints contact
- 🚧 **The forfeiture notice** — names the clause it acts under, the date to
  pay by, what is owed as at that day and what each further day adds, the
  condition on which the item lapses, that taking it is a person's decision,
  and that no further reminder follows
- **Reminders** — **7 days** and **1 day** before the due date, then every
  **7 days** overdue; each names the balance and the date, the overdue one
  that interest runs at the same daily rate with no fee; the ladder stops at
  a forfeiture notice
- **A failed send is kept** — every message, the signed set included, is
  retried on one ladder for up to **5** attempts, then parked with its
  reason; the case badges for staff, who can hand it back to the queue
- **WhatsApp** — a click-to-chat link staff press, with six templates; no
  automation, no inbound channel

## Specs and journeys

::spec{id="grade10-site/vault/case-intake"}

::spec{id="grade10-site/vault/visit-booking"}

::spec{id="grade10-site/vault/collector-notifications"}

:::detail{title="Code map" for="engineer"}
- **Pages** — `apps/frontend/grade10/src/pages/vault/{VaultPage,CasePage,SignPage}.tsx`;
  the address table is `surfaces.ts`, and `ROUTES.vaultCase` is pinned to
  `CASE_PATH` in `packages/vault/contracts/src/paths.ts`, which the emails
  fill
- **Slices** — `packages/vault/frontend/src/features/custody/{request,cases,booking}`;
  refusals branch on `VaultFailureCode`; the timeline keeps what
  `isCustomerEvent` admits and drops staff-only kinds
- **Customer router** — `packages/vault/backend/src/trpc/routers/cases.ts`:
  create, submit, mine, detail, locations, slots, book, reschedule,
  cancelBooking, accept, decline, cancel, requestRelease; no money ever
- **Notifications** — `packages/vault/backend/src/notify/vocabulary.ts` holds
  `NOTIFY_FOR_EVENT`; copy in `email/messages.ts`; reminders in
  `sweeps/remind.ts`; retries in `db/schema/notificationRetries.ts`,
  `notify/sealed.ts` and `sweeps/notify.ts`
- **Copy** — `packages/i18n/messages/shared/{en,zh-Hant,zh-Hans,ko}/vault.json`
  in this store; the app reads the pinned submodule, so a catalogue change
  reaches it with the next submodule bump
- **Photos** — `packages/vault/contracts/src/photos.ts` holds the limits;
  reads are owner-only, uncached and written to an append-only ledger
:::

:::detail{title="Product decisions" for="pm"}
The collector's pages exist so an item can be handed over with the paperwork
already agreed, and so the collector can watch their own property from their
phone. The owner's brief is [Grade10 Finance](/references/grade10-finance).

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Wants cash against a graded card without selling it | Knows the offer, the total to repay and what lateness costs before the visit, and answers it from their phone |
| Collector | Wants a card kept safely | Books a drop-off, signs once, sees it held |
| Borrower | Due date near | Is reminded a week and a day before, knows how and where to pay, can book the pickup |
| Borrower | Cannot repay on time | Knows what a late day costs, and is warned in writing with a date to pay by before anything is taken |
| Collector | Several cards | One request each, one visit for all of them |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A case has an address | Decided | `/vault/cases/<id>`, pinned to the path the emails are built from | Engineering |
| A case has a reference | Decided | Six characters from an alphabet that cannot be misread, issued beside the id when the request is sent in: spoken at the counter, typed as the transfer reference, prefix-searched in the console. The id stays the key and the address, so the reference is additive | Product |
| The page reads the fact, not the machine | Decided | A lapsed, declined or superseded offer, a missed visit and an ask for the item back are derived at the read from the case, its offer and its visit; no status is added for any of them | Product |
| Every event tells the collector or is decided silent | Decided | One map from event to message; a failed send is retried, never dropped | Engineering |
| Every message is a table and blocks | Decided | The figures a message is about print as a table, how to pay and the lender's licence footer with the complaints contact as blocks, built as React Email templates in this store's `apps/emails`; the worker's one-paragraph copy goes | Product |
| A live loan can book its visit | Decided | `active` is bookable; a missed pickup closes the visit and keeps the case | Product |
| The collector answers for themselves | Decided | Accept, decline and cancel are the collector's own acts on their own case, each behind a confirmation naming what it does; the counter keeps its own path for the customer standing at it, and the signature is what binds either way | Product |
| How to pay | Decided | A structured block — the lender's FPS id, its bank account, the case reference as the transfer reference, or card or cash at the counter — printed under a live loan's balance and in every money message, with the line saying the balance holds until the deadline; no payoff quote with a validity, because the balance at a date is the quote | Product |
| Reminders | Decided | **7** and **1** days before the due date, then every **7** days overdue, by email, stopping at the forfeiture notice; the schedule is an operating constant, named on the live loan, and a borrower is never charged for one | Owner |
| Review before sending | Decided | The wizard reads the request back and takes the collection-statement tick before it sends; the statement's own text is Legal's | Product |
| Add to calendar | Decided | A calendar file the phone's own calendar opens, from the booked screen and the case; no calendar provider is linked | Product |
| Cancel a case | Decided | The owner of a case cancels it in every status before custody, which closes the open offer and the visit with it | Product |
| Several items | Decided | The lead case books the visit and the siblings need none, because a case has never needed one to be vaulted | Product |
| Total and lateness on the offer card | Decided | The card states the total to repay and what a late day costs, so a collector answers knowing both | Design |
| SMS and WhatsApp automation | Deferred | Click-to-chat, staff-pressed, until the owner names a provider | Owner |
| Phone number | Decided | Stored in E.164 against the brand's plan and unverified until a channel writes to it | Product |
| Two vocabularies for one list | Decided | What happens to a case and what the collector is told stay separate lists joined by a map, so no event can ship silent | Engineering |
| Every copy rides one ladder | Decided | The signed set retries on the same rungs as every other message — **5 minutes** to **6 hours**, an attempt giving up after **10 seconds** — and parks with its reason, rather than being retried for ever by a sweep of its own | Engineering |
| No extension to ask for | Decided | A borrower pays at their own bank and cannot pay from the page; a renewal is a new offer somebody writes down, and nobody has written one yet | Owner |
| Chinese operative text | TBC Legal | English governs the paper; the ceremony's chrome, the wizard and every refusal answer in the collector's language, and bilingual templates and consent copy are Legal's to supply | Legal |
:::
