---
title: Collector Pages
spec: grade10-site/vault/case-intake
order: 1
---

The collector's side of the vault is one signed-in section: the cases they
hold, a wizard to open another, and each case's own page with its offer, its
balance, its documents and its visit.

- **URL** — `grade10.com/vault`, unprefixed: a session surface answers at one
  address and reads the language off the collector's cookie, so `/tc/vault`
  and `/sc/vault` match nothing; signing in is asked for in a dialog over the
  address, never a redirect
  1. `grade10.com/vault` — the list and the wizard
  2. `grade10.com/vault/cases/<id>` — one case, the address every email links
     to
  3. `grade10.com/vault/sign#<token>` — the signing ceremony, opened from the
     QR code or link staff hand over; no account needed
- **Sign-in** — magic link, Google where enabled; no phone number and no
  SMS anywhere
- **Language** — the section, the wizard, every refusal and the signing
  screen's own words answer in English, traditional and simplified Chinese;
  the ceremony's operative wording, the documents and every email are English
  only, because the trail attests to the exact words that were shown

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
   description (≤ **2,000**), WhatsApp number (optional and never verified,
   stored in E.164 against the brand's numbering plan however it was typed),
   and the one question that decides the lane: storage only, or a loan and
   how much
2. *Collector* — **Photograph it** — **1 to 10** photos, JPEG, PNG or WebP,
   ≤ **20 MB** each, several per tap uploaded one after another; location
   metadata is stripped in the browser and again by the worker
3. *Collector* — **Send it in** — needs at least one photo; the case becomes
   `submitted` and the page offers the visit booking

- **Currency** — the brand's (HKD for Grade10); a request naming another
  currency is refused
- **One item per case** — a binder of twelve cards is twelve requests, in
  batches of three; the wizard says to book one visit on the first and bring
  them all together, because a case has never needed a booking of its own

## Case page

What a collector reads on one case, top to bottom.

- **Header** — item, status badge, lane badge, and staff's decline reason
  verbatim when declined
- **Photos** — thumbnails, served only to the owner and to staff
- **The offer** — amount, term in days, rate for the term, the total to
  repay, what a late day costs, and the expiry; **Accept** and **Decline**
  are the collector's own. Accepting moves the case and books nothing;
  declining closes the offer and leaves the request open for another. No
  repay-by date, because the term runs from the day the money reaches them
- **What is owed** — outstanding of total, repaid so far, due date, days
  overdue, and the instant it was computed at; under it, on a live loan, how
  to pay in the brand's own words and the line saying the balance holds until
  the deadline
- **Custody** — held since when, settled or what is outstanding, and **Ask
  for it back**, which records one ask while the item is held and refuses
  otherwise
- **Documents** — each packet with its fingerprint, each sealed document with
  its fingerprint and a download
- **Visit** — the booking picker at every live status but a draft, so a
  visit can be booked before the valuation, after the offer, or to repay and
  collect on
- **Cancel this request** — ends the case at any status before the item is in
  the vault; any visit is cancelled with it and the item stays with the
  collector
- **History** — every event the collector may see, actor kind only, never a
  staff id. The counter's own records stay staff-only: a document already
  held under another account, and the note that the terms were explained
- **Clocks** — a day and a deadline, on this page and in every email, are
  the shop's own — Hong Kong time — and a deadline names the zone it is
  stated in; a timeline stamp places an instant and stays UTC

## Booking a visit

- **Where and when** — shops and free slots come from the diary; a
  **14-day** window in the shop's own zone; a slot in the past is refused
- **Move or cancel** — any time up to the slot, an email each, whether the
  collector or staff moved it
- **No-show on a submitted case** — **24 hours** after the slot the case ends
  as `expired`, and the email says the visit was missed
- **No-show on any other case** — the visit is closed in the diary and the
  case stays where it is, so the next visit can be booked
- **The visit completes** on the first counter act after its slot — the
  valuation being started, or the item being vaulted — so a valuation from
  photographs leaves a future visit open

## Messages

- **Email, English, twenty-three kinds** — visit booked, moved, cancelled,
  missed; offer made, offer expired; item vaulted; payout recorded with the
  due date; repayment recorded; payout corrected; repayment corrected;
  repayment due soon; repayment overdue; forfeiture notice with its cure
  date; loan repaid; item released; forfeited; declined; cancelled; expired
  untouched; expired unbooked; request closed after a missed visit; signed
  documents with the PDFs attached
- **One decision per event** — what each event tells the collector is
  written down once, so a new event cannot ship silent
- **Reminders** — **7 days** and **1 day** before the due date, then every
  **7 days** while the loan is overdue; each names the balance and the date,
  and the overdue one says interest keeps running at the same daily rate with
  no fee. The ladder stops at a forfeiture notice, which says something
  stronger
- **A failed send is kept** — every message, the signed set included, is
  queued and retried on one ladder from **5 minutes** to **6 hours**; after
  **5** attempts the row is parked with the reason on it, the case badges for
  staff, and an operator can hand every parked message on that case back to
  the queue. The queue names the message and never its reader: the address,
  the item's title, the currency and a signed set's PDFs are read again at
  each attempt, and a set too heavy to attach is logged and the mail goes
  with the link to the case
- **A send that hangs is a failed send** — every attempt gives up at **10
  seconds**, so one unanswered request cannot hold a sweep pass
- **WhatsApp** — a click-to-chat link staff press, with six templates; no
  automation, no inbound channel

:::callout{kind="note"}
A borrower pays at their own bank and cannot pay from the page: the
instructions say where to send it, a treasurer records it against the date it
arrived, and the balance at any date is the quote. There is no extension to
ask for — a renewal is a new offer somebody writes down, and nobody has
written one yet.
:::

## Specs and journeys

**Specs** — this page documents `grade10-site/vault/case-intake`,
`grade10-site/vault/visit-booking` and
`grade10-site/vault/collector-notifications`. The requirements are theirs; this
page holds the decision behind them.

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
| Every event tells the collector or is decided silent | Decided | One map from event to message; a failed send is retried, never dropped | Engineering |
| A live loan can book its visit | Decided | `active` is bookable; a missed pickup closes the visit and keeps the case | Product |
| The collector answers for themselves | Decided | Accept, decline and cancel are the collector's own acts on their own case; the counter keeps its own path for the customer standing at it, and the signature is what binds either way | Product |
| How to pay | Decided | One instructions text beside the lender's identity, printed under a live loan's balance, with the line saying the balance holds until the deadline; no payoff quote with a validity, because the balance at a date is the quote | Product |
| Reminders | Decided | **7** and **1** days before the due date, then every **7** days overdue, by email, stopping at the forfeiture notice; the schedule is an operating constant and a borrower is never charged for one | Owner |
| Cancel a case | Decided | The owner of a case cancels it in every status before custody, which closes the open offer and the visit with it | Product |
| Several items | Decided | The lead case books the visit and the siblings need none, because a case has never needed one to be vaulted | Product |
| Total and lateness on the offer card | Decided | The card states the total to repay and what a late day costs, so a collector answers knowing both | Design |
| SMS and WhatsApp automation | Deferred | Click-to-chat, staff-pressed, until the owner names a provider | Owner |
| Phone number | Decided | Stored in E.164 against the brand's plan and unverified until a channel writes to it | Product |
| Two vocabularies for one list | Decided | What happens to a case and what the collector is told stay separate lists joined by a map, so no event can ship silent | Engineering |
| Every copy rides one ladder | Decided | The signed set retries on the same rungs as every other message and parks with its reason, rather than being retried for ever by a sweep of its own | Engineering |
| A send that never returns | Decided | Ten seconds, then the attempt has failed like any other | Engineering |
| Chinese operative text | TBC Legal | English governs the paper; the ceremony's chrome, the wizard and every refusal answer in the collector's language, and bilingual templates and consent copy are Legal's to supply | Legal |
:::
