---
title: Collector Pages
spec: grade10-site/vault/case-intake
order: 1
---

What a collector does on their own vault case, and what they are told about
it. The backend answers every read and act below; the screens are being drawn
again.

- 🚧 **On the site** — no vault page but the signing ceremony at
  `grade10.com/vault/sign#<token>`, opened from the QR code or link staff
  hand over at the counter; no account needed
- ❓ **The collector's screens** — the case list, the request, one case,
  booking a visit and Your data; @tangconst designs them from the backend as
  it stands —
  [Grade10 Vault Digital Twin](/references/grade10-vault-digital-twin)
- **Sign-in** — magic link, Google where enabled; no phone number and no SMS
- **Language** — the ceremony's chrome in English and both Chinese scripts;
  the paper and every email English

## Case list

- **Your cases** — the collector reads every case they hold, and nobody
  else's
- **Drafts** — **3** unsent drafts at most per account, a draft staff opened
  at the counter among them
- ❓ **The list on screen** — how the cases read and how a request starts;
  @tangconst

## Request wizard

1. *Collector* — **Describe the item** — category (one of the register's
   ten, below), title (≤ **200** characters), description (≤ **2,000**),
   WhatsApp number (optional, unverified, in E.164, refused if not a
   number, and asked for its country code when it reads as one from
   elsewhere), and the lane question: a loan of how much (more than zero),
   or storage only
2. *Collector* — **Photograph it** — **1 to 10** photos, JPEG, PNG or WebP,
   ≤ **20 MB** each; location metadata is stripped before and after upload
3. *Collector* — **Send it in** — needs at least one photo; the case becomes
   `submitted` and a visit can be booked

- **The collection statement** — a send keeps the version of the personal
  information collection statement the collector was shown; in production
  the send is refused while the statement is unwritten
- **One number however typed** — full-width digits and `852` before a
  local number store as the same number; a number from elsewhere with no
  country code is asked for one
- ❓ Designer — **Ten categories** — the register's; the backend takes all
  ten, and the designer draws the step from it —
  [Items](/p/grade10-admin/inventory/items#values)
- ❓ Designer — **A slab staff found** — on a draft staff opened with a slab
  the register knows, the backend refuses a change to the category and title
  and the case reads `factsFromRegister`; how the step shows it is the
  designer's — [Items](/p/grade10-admin/inventory/items#facts)
- **Currency** — the brand's (HKD for Grade10); another currency is refused
- **One item per case** — a binder of twelve cards is twelve requests, in
  batches of three; book one visit on the first and bring them all together
- ❓ **The request on screen** — its steps, the read-back before it sends and
  the statement's tick; @tangconst

## Case page

- **Whose it is** — one case answers only to the collector who holds it and
  to staff
- **Case reference** — six characters from an alphabet that cannot be
  misread, issued beside the id when the request is opened; in every email,
  spoken at the counter, typed as the transfer reference; the address keeps
  the id
- **The fact it meets** — the offer ran out, the offer was declined, a new
  offer replaced the last, the visit was closed as missed, the item was asked
  back: derived from the case at the read, never a status of its own
- **Endings** — why a case ended is on the case: the reason staff gave,
  verbatim, who called it off, the clock that ran out, or the figure the item
  settled at; the signed agreements stay —
  [Case Lifecycle](/p/grade10-site/vault/case-lifecycle#exits)
- **Photos** — served only to the owner and to staff
- **The offer** — amount, term in days, rate for the term, the total to
  repay, what a late day costs, and the expiry; **Accept** and **Decline**
  are the collector's own; no repay-by date, because the term runs from the payout
- **What is owed** — outstanding of total, repaid so far, due date, days
  overdue, and the instant it was computed at
- **Money on a live loan** — the how-to-pay block, the daily figure after the
  deadline, the dates the reminders go, each repayment and the final notice, as
  [Loan and Money](/p/grade10-site/vault/loan-and-money#reading-the-book) states them
- **Custody** — held since when, settled or what is outstanding, and **Ask
  for it back**, which records one ask while the item is held
- **Documents** — each packet with its fingerprint, each sealed document with
  its fingerprint and a download
- **Cancel this request** — ends the case at any status before the item is in
  the vault; any visit is cancelled with it and the item stays with the collector
- **A draft staff opened** — under the collector's own account as a draft
  opened at the counter; they check it and send it, and nothing is valued or
  emailed before they send it
- **Sending a walk-in** — until the collector's screens ship, a draft staff
  opened waits, and ends silently on its own clock
- **History** — every event the collector may see, actor kind only, never a
  staff id; the counter's own records stay staff-only
- **Clocks** — a day and a deadline, on the case and in every email, are
  the shop's own — Hong Kong time — and a deadline names the zone it is
  stated in; a timeline stamp places an instant and stays UTC
- ❓ **The case on screen** — the stages, whose the item is, the answers to
  the offer and each act's confirmation; @tangconst

## Booking a visit

- **When** — at every live status but a draft, so a visit can be booked
  before the valuation, after the offer, or to repay and collect on
- **Where and when** — shops and free slots come from the diary; a
  **14-day** window in the shop's own zone; a slot in the past is refused
- **Move or cancel** — any time up to the slot, an email each, whether the
  collector or staff moved it
- **Booked** — the email names the shop, the slot and what to bring, with
  the calendar file; the file names this visit, replaces the one before it
  on a move, and is withdrawn on a cancel
- **A missed visit** — closes the visit and keeps the case; a submitted case
  ends **24 hours** after the slot instead, and the email says the visit was
  missed — [Case Lifecycle](/p/grade10-site/vault/case-lifecycle#timers)
- **The visit completes** on the first counter act after its slot
- ❓ **Booking on screen** — the shop and slot picker and the booked visit;
  which screen holds them is @tangconst's

## Messages

- **Email, English, twenty-four kinds** — one per event the collector may
  see, the identity-check invitation before the visit among them; the set is
  the capability's own table
- **What a message names** — its figures as a table, not a sentence: the
  offer its terms, total, late-day cost and expiry; a money message the
  amount, the due date, the daily figure after it, how to pay while a balance
  is owed and the lender's licence line; a reminder its schedule; every
  message the reference and the complaints contact
- **The forfeiture notice** — names the clause it acts under, the date to
  pay by, what is owed as at that day and what each further day adds, the
  condition on which the item lapses, that taking it is a person's decision,
  and that no further reminder follows
- **Reminders** — **7 days** and **1 day** before the due date, then every
  **7 days** overdue; each names the balance and the date, the overdue one that
  interest runs at the same daily rate with no fee; stopping at the notice
- **A failed send is kept** — every message, the signed set included, is
  retried on one ladder for up to **5** attempts, then parked with its
  reason; the case badges for staff, who can hand it back to the queue
- **WhatsApp** — a click-to-chat link staff press, with six templates; no
  automation, no inbound channel
- **Where a message links** — every email's case link keeps
  `grade10.com/vault/cases/<id>`, the identity invitation's
  `grade10.com/vault/verify#<secret>`, and a sign-in started there returns
  there; each lands on the not-found surface until the collector's screens
  ship

## Specs and journeys

::spec{id="grade10-site/vault/case-intake"}

::spec{id="grade10-site/vault/visit-booking"}

::spec{id="grade10-site/vault/collector-notifications"}

:::detail{title="Code map" for="engineer"}
- **Pages** — `apps/frontend/grade10/src/pages/vault/SignPage.tsx`; the
  address table is `surfaces.ts`
- **Booking views** — `packages/vault/frontend/src/features/custody/booking`,
  kept as views a screen composes and mounted by no route
- **Links** — `CASE_PATH` and `VERIFY_PATH` in
  `packages/vault/contracts/src/paths.ts`, which the emails fill
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
| A case has a reference | Decided | Six characters from an alphabet that cannot be misread, issued beside the id when the request is opened: spoken at the counter, typed as the transfer reference, prefix-searched in the console. The id stays the key and the address, so the reference is additive | Product |
| The page reads the fact, not the machine | Decided | A lapsed, declined or superseded offer, a missed visit and an ask for the item back are derived at the read from the case, its offer and its visit; no status is added for any of them | Product |
| Every event tells the collector or is decided silent | Decided | One map from event to message; a failed send is retried, never dropped | Engineering |
| Every message is a table and blocks | Decided | The figures a message is about print as a table, how to pay and the lender's licence footer with the complaints contact as blocks; the worker renders its own React Email letters, aligned with the preview source in this store's `apps/emails`, and the one-paragraph copy goes | Product |
| A live loan can book its visit | Decided | `active` is bookable; a missed pickup closes the visit and keeps the case | Product |
| The collector answers for themselves | Decided | Accept, decline and cancel are the collector's own acts on their own case; the counter keeps its own path for the customer standing at it, and the signature is what binds either way | Product |
| How to pay | Decided | A structured block — the lender's FPS id, its bank account under the lender's registered name, the case reference as the transfer reference, or card or cash at the counter — printed under a live loan's balance and in every money message sent while a balance is still owed, with the line saying the balance holds until the deadline; a message naming no balance owed carries none, so the offer, a loan repaid and an item forfeited go without it; no payoff quote with a validity, because the balance at a date is the quote | Product |
| Reminders | Decided | **7** and **1** days before the due date, then every **7** days overdue, by email, stopping at the forfeiture notice; the schedule is an operating constant, named on the live loan, and a borrower is never charged for one | Owner |
| Review before sending | Decided | A send keeps the version of the collection statement the collector was shown; the statement's own text is Legal's | Product |
| Add to calendar | Decided | A calendar file the phone's own calendar opens, from the case and the visit's own emails; a later file for the same visit replaces the first and a cancellation withdraws it; no calendar provider is linked | Product |
| The collector's screens | Decided | The site carries no vault page but the signing ceremony while @tangconst draws the collector's screens from the backend; every read and act, the emails and the paper stay, so her design is drawn against what runs rather than rebuilt | Owner |
| Cancel a case | Decided | The owner of a case cancels it in every status before custody, which closes the open offer and the visit with it | Product |
| Several items | Decided | The lead case books the visit and the siblings need none, because a case has never needed one to be vaulted | Product |
| Total and lateness on the offer | Decided | The offer states the total to repay and what a late day costs, so a collector answers knowing both | Design |
| SMS and WhatsApp automation | Deferred | Click-to-chat, staff-pressed, until the owner names a provider | Owner |
| Phone number | Decided | Stored in E.164 against the brand's plan and unverified until a channel writes to it | Product |
| Which typed numbers are one person | Decided | One stored number, never one person: spacing, dots, dashes and brackets, `+852` or `00852`, a bare eight-digit local number, full-width digits, and `852` before a local number all store as one; a number from elsewhere with no country code is asked for one | Product |
| Two vocabularies for one list | Decided | What happens to a case and what the collector is told stay separate lists joined by a map, so no event can ship silent | Engineering |
| Every copy rides one ladder | Decided | The signed set retries on the same rungs as every other message — **5 minutes** to **6 hours**, an attempt giving up after **10 seconds** — and parks with its reason, rather than being retried for ever by a sweep of its own | Engineering |
| No extension to ask for | Decided | A borrower pays at their own bank and cannot pay from the page; a renewal is a new offer somebody writes down, and nobody has written one yet | Owner |
| Chinese operative text | TBC Legal | English governs the paper; the ceremony's chrome answers in the collector's language, and bilingual templates and consent copy are Legal's to supply | Legal |
:::
