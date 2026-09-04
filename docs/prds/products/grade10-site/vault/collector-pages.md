---
title: Collector Pages
order: 1
---

The collector's side of the vault is one signed-in page: the cases they hold,
a wizard to open another, and each case's own screen with its offer, its
balance, its documents and its visit.

- **URL** — `grade10.com/vault`, also `/tc/vault` and `/sc/vault`; signing in
  is asked for in a dialog over the address, never a redirect
  1. `grade10.com/vault` — the list, the wizard and every case screen, all on
     one address, so no case can be linked or bookmarked
  2. `grade10.com/vault/sign#<token>` — the signing ceremony, opened from the
     QR code or link staff hand over; no account needed
  3. `grade10.com/vault/cases/<id>` — what every email links to; it opens the
     list, not the case, because the page keeps its place in memory rather
     than in the address
- **Sign-in** — magic link or emailed code, Google where enabled; no phone
  number and no SMS anywhere
- **Language** — the page, the wizard and every refusal answer in English,
  traditional and simplified Chinese; the ceremony, the documents and every
  email are English only

## The case list

- **One card per case** — status, when it opened, the lane, the amount asked;
  the item's name is not on the card, so three cards sent the same day read
  alike
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
   ≤ **20 MB** each, one file per tap; location metadata is stripped in the
   browser and again by the worker
3. *Collector* — **Send it in** — needs at least one photo; the case becomes
   `submitted` and the page offers the visit booking

- **Currency** — the brand's (HKD for Grade10), never the collector's choice
- **One item per case** — a binder of twelve cards is twelve wizards, in
  batches of three, and as built twelve visits

## The case screen

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
  for it back**, which records the ask and moves nothing
- **Documents** — each packet with its fingerprint, each sealed document with
  its fingerprint and a download
- **Visit** — the booking picker, only while the case is `submitted`,
  `vaulted` or `repaid`; a case with a live loan has no picker
- **History** — every event, actor kind only, never a staff id
- **Clocks** — every time on this page and in every email is printed in UTC;
  only the booking picker speaks the shop's clock, so one visit reads
  `03:00 UTC` on the list and `11:00` in the picker

## Booking a visit

- **Where and when** — shops and free slots come from the diary; a
  **14-day** window in the shop's own zone; a slot in the past is refused
- **Move or cancel** — any time up to the slot, an email each
- **No-show** — **24 hours** after the slot the case ends as `expired`, and
  the email says the request "sat unfinished"
- **Starting the valuation** marks the visit completed, whether or not the
  collector was there

## What the collector hears

- **Email only, English only, nine kinds** — visit booked, moved, cancelled;
  offer made; item vaulted; item released; declined; expired; signed
  documents, with the PDFs attached
- **WhatsApp** — a click-to-chat link staff press, with six templates; no
  automation, no inbound channel
- **Silence** — nothing tells a borrower that the payout landed, that a
  repayment was recorded, that the due date is near, that the loan is
  overdue, or that the item was forfeited

:::callout{kind="warning"}
The owner's flow and the built flow disagree on order. The notes run
valuation, then the offer on WhatsApp, then acceptance, then a booked visit;
the code is book-first: a case can be booked only while `submitted`, starting
the valuation marks the visit done, and the collector cannot accept from their
phone. Walked as the notes describe, nobody can book the drop-off once the
offer is out.
:::

:::callout{kind="warning"}
A live loan dead-ends on this page. The borrower cannot book a visit to repay
and collect, cannot pay online, is never given bank details or a payoff quote
with a validity, and cannot ask for an extension. Repayment is recorded by a
treasurer after the fact, and the balance the treasurer must quote steps at
midnight UTC, which is 08:00 in Hong Kong.
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
| One address for the whole section | Decided today | `/vault` keeps its view in memory; a case has no address of its own | Engineering |
| Case address | ❓ Open | A `/vault/cases/<id>` surface the emails already link to | Engineering |
| Accept online | ❓ Open | A collector-side accept and decline, recorded as the collector's act; today acceptance is a staff click | Product |
| Repay and collect | ❓ Open | `active` bookable, payment instructions and a payoff quote with a stated validity on the page | Product |
| Reminders | ❓ Open | Due-soon, overdue, payout recorded, repayment recorded, forfeited; channel (email, WhatsApp Business) | Product |
| Zone | ❓ Open | Hong Kong time on every collector surface and email; UTC today | Product |
| Copy | ❓ Open | `submitted` reads "With us" while the card is at home; a no-show is mailed as "sat unfinished"; the refusal promises AVIF and refuses it; an English balance line sits inside a Chinese page | Design |
| Cancel a case | ❓ Open | No collector cancel; a change of mind waits **30 days** to expire | Product |
| Several items | ❓ Open | One visit for a binder: book on the lead case (nothing says so), or a multi-item case | Product |
| Phone number | ❓ Open | Optional, unverified, unformatted; no `+852` guidance, and staff see no link for a number under eight digits | Product |
:::

:::detail{title="For engineers" for="engineer"}
- **Pages** — `apps/frontend/grade10/src/pages/vault/{VaultPage,SignPage}.tsx`;
  the address table is `surfaces.ts`, `/vault/*` all lands on `VaultPage`,
  and its view is React state
- **Slices** — `packages/vault/frontend/src/features/custody/{request,cases,booking}`;
  refusals branch on `VaultFailureCode`, never on a message
- **Customer router** — `packages/vault/backend/src/trpc/routers/cases.ts`:
  create, submit, mine, detail, locations, slots, book, reschedule,
  cancelBooking, requestRelease; no accept, no cancel, no repayment
- **Copy** — `packages/i18n/messages/shared/{en,zh-Hant,zh-Hans}/vault.json`
  in this store, fully answered; email copy and ceremony chrome are English in
  the application repository (`packages/vault/backend/src/email/messages.ts`,
  `SignPage.tsx`)
- **Clocks** — `@grade10/utils/dates` sets `PLATFORM_ZONE = "UTC"`; the
  booking picker alone renders in the location's zone
- **Photos** — `packages/vault/contracts/src/photos.ts` holds the limits;
  reads are owner-only, uncached and written to an append-only ledger
:::
