---
title: Collector Pages
order: 1
---

The collector's side of the vault is one signed-in section: the cases they
hold, a wizard to open another, and each case's own page with its offer, its
balance, its documents and its visit.

- **URL** — `grade10.com/vault`, also `/tc/vault` and `/sc/vault`; signing in
  is asked for in a dialog over the address, never a redirect
  1. `grade10.com/vault` — the list and the wizard
  2. `grade10.com/vault/cases/<id>` — one case, the address every email links
     to
  3. `grade10.com/vault/sign#<token>` — the signing ceremony, opened from the
     QR code or link staff hand over; no account needed
- **Sign-in** — magic link or emailed code, Google where enabled; no phone
  number and no SMS anywhere
- **Language** — the section, the wizard and every refusal answer in English,
  traditional and simplified Chinese; the ceremony's operative wording, the
  documents and every email are English only

## The case list

- **One card per case** — the item's name, status, when it opened, the lane,
  the amount asked
- **Start a request** — opens the wizard; **3** unsent drafts at most per
  account
- **A draft** — reopens on its photo step from the list

## The request wizard

Three steps, one per thing the collector does.

1. *Collector* — **Describe the item** — category (trading card, coin,
   bullion, watch, jewellery, other), title (≤ **200** characters),
   description (≤ **2,000**), WhatsApp number (optional, free text, never
   verified), and the one question that decides the lane: storage only, or a
   loan and how much
2. *Collector* — **Photograph it** — **1 to 10** photos, JPEG, PNG or WebP,
   ≤ **20 MB** each, several per tap uploaded one after another; location
   metadata is stripped in the browser and again by the worker
3. *Collector* — **Send it in** — needs at least one photo; the case becomes
   `submitted` and the page offers the visit booking

- **Currency** — the brand's (HKD for Grade10); a request naming another
  currency is refused
- **One item per case** — a binder of twelve cards is twelve wizards, in
  batches of three, and as built twelve visits

## The case page

What a collector reads on one case, top to bottom.

- **Header** — item, status badge, lane badge, and staff's decline reason
  verbatim when declined
- **Photos** — thumbnails, served only to the owner and to staff
- **The offer** — amount, term in days, rate for the term, repay-by date,
  expiry; no total repayable, no word on what lateness costs, and no button:
  acceptance is recorded by staff in the shop
- **What is owed** — outstanding of total, repaid so far, due date, days
  overdue, and the instant it was computed at; nothing says how to pay
- **Custody** — held since when, settled or what is outstanding, and **Ask
  for it back**, which records one ask while the item is held and refuses
  otherwise
- **Documents** — each packet with its fingerprint, each sealed document with
  its fingerprint and a download
- **Visit** — the booking picker while the case is `submitted`, `vaulted`,
  `active` or `repaid`, so a borrower can book the visit they repay and
  collect on
- **History** — every event the collector may see, actor kind only, never a
  staff id; an operator's correction of a money row is not among them
- **Clocks** — every time on this page and in every email is printed in UTC,
  the platform's one zone; only the booking picker speaks the shop's clock

## Booking a visit

- **Where and when** — shops and free slots come from the diary; a
  **14-day** window in the shop's own zone; a slot in the past is refused
- **Move or cancel** — any time up to the slot, an email each, whether the
  collector or staff moved it
- **No-show before custody** — **24 hours** after the slot the case ends as
  `expired`, and the email says the visit was missed
- **No-show for a pickup** — the visit is closed in the diary and the case
  stays where it is, so the next visit can be booked
- **Starting the valuation** marks the visit completed, whether or not the
  collector was there

## What the collector hears

- **Email, English, seventeen kinds** — visit booked, moved, cancelled; offer
  made, offer expired; item vaulted; payout recorded; repayment recorded;
  loan repaid; item released; forfeited; declined; cancelled; expired
  untouched; expired unbooked; visit missed; signed documents with the PDFs
  attached
- **One decision per event** — what each event tells the collector is
  written down once, so a new event cannot ship silent
- **A failed send is kept** — the message is queued and retried on a ladder
  from **5 minutes** to **6 hours**, and given up loudly after **5** attempts
- **WhatsApp** — a click-to-chat link staff press, with six templates; no
  automation, no inbound channel
- **No reminders** — nothing tells a borrower the due date is near or the
  loan is overdue

:::callout{kind="warning"}
The owner's flow and the built flow disagree on order. The notes run
valuation, then the offer on WhatsApp, then acceptance, then a booked visit;
the code is book-first: a case is booked while `submitted`, starting the
valuation marks the visit done, and the collector cannot accept from their
phone. Walked as the notes describe, nobody can book the drop-off once the
offer is out.
:::

:::callout{kind="warning"}
A borrower cannot pay online, is never given bank details or a payoff quote
with a validity, and cannot ask for an extension. Repayment is recorded by a
treasurer after the fact, against the date the money reached the bank; the
balance steps at midnight UTC, which is 08:00 in Hong Kong.
:::

:::detail{title="Product decisions" for="pm"}
The collector's pages exist so an item can be handed over with the paperwork
already agreed, and so the collector can watch their own property from their
phone. The owner's brief is [Grade10 Finance](/references/grade10-finance).

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Wants cash against a graded card without selling it | Knows the offer, the total to repay, the due date and what lateness costs before the visit |
| Collector | Wants a card kept safely | Books a drop-off, signs once, sees it held |
| Borrower | Due date near | Is reminded, knows how and where to pay, can book the pickup |
| Borrower | Cannot repay on time | Knows the grace, the cost and the forfeiture date, and can ask to extend |
| Collector | Several cards | One visit, one set of paper |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A case has an address | Decided | `/vault/cases/<id>`, pinned to the path the emails are built from | Engineering |
| Every event tells the collector or is decided silent | Decided | One map from event to message; a failed send is retried, never dropped | Engineering |
| A live loan can book its visit | Decided | `active` is bookable; a missed pickup closes the visit and keeps the case | Product |
| Accept online | ❓ Open | A collector-side accept and decline, recorded as the collector's act; today acceptance is a staff click | Product |
| How to pay | ❓ Open | Bank details, a payoff quote with a stated validity, and where each is shown | Product |
| Reminders | ❓ Open | Due-soon and overdue kinds on the same map, a sweep over the due calculation, and the cadence and channel | Owner |
| Zone | ❓ Open | Hong Kong time on collector surfaces is a delta to the platform's dates-and-times contract, which states UTC on every surface | Product |
| Total and lateness on the offer card | ❓ Open | The wire now carries the total to term; the words need catalogue keys and a submodule bump | Design |
| Cancel a case | ❓ Open | No collector cancel; a change of mind waits **30 days** to expire | Product |
| Several items | ❓ Open | One visit for a binder: book on the lead case (nothing says so), or a multi-item case | Product |
| Phone number | ❓ Open | Optional, unverified, unformatted; the brand's numbering plan exists and the intake does not use it | Product |
| Chinese operative text | ❓ Open | Emails, ceremony wording and documents are English; half the ceremony chrome is already in the catalogue | Legal |
:::

:::detail{title="For engineers" for="engineer"}
- **Pages** — `apps/frontend/grade10/src/pages/vault/{VaultPage,CasePage,SignPage}.tsx`;
  the address table is `surfaces.ts`, and `ROUTES.vaultCase` is pinned to
  `CASE_PATH` in `packages/vault/contracts/src/paths.ts`, which the emails
  fill
- **Slices** — `packages/vault/frontend/src/features/custody/{request,cases,booking}`;
  refusals branch on `VaultFailureCode`; the timeline keeps
  `CUSTOMER_EVENT_KINDS` and drops staff-only events
- **Customer router** — `packages/vault/backend/src/trpc/routers/cases.ts`:
  create, submit, mine, detail, locations, slots, book, reschedule,
  cancelBooking, requestRelease; no accept, no cancel, no repayment
- **Notifications** — `packages/vault/backend/src/notify/vocabulary.ts` holds
  `NOTIFY_FOR_EVENT`; copy in `email/messages.ts`; retries in
  `db/schema/notificationRetries.ts` and `sweeps/notify.ts`
- **Copy** — `packages/i18n/messages/shared/{en,zh-Hant,zh-Hans,ko}/vault.json`
  in this store; the app reads the pinned submodule, so a catalogue change
  reaches it with the next submodule bump
- **Photos** — `packages/vault/contracts/src/photos.ts` holds the limits;
  reads are owner-only, uncached and written to an append-only ledger
:::
