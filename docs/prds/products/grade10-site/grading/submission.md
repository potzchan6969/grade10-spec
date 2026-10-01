---
title: The Submission
spec: grade10-site/grading/submission-lifecycle
order: 3
---

A submission is one collector's cards, one grader, one level, one status; each
card carries its own outcome, so an ungraded card leaves the rest ready.

🚧 **The collector, or the link** — the page opens to the collector signed in
under the booking email and to whoever holds the emailed link; anybody else
reads not found.

## Statuses

🚧 **Ten statuses** — the word is the badge, the chip says whose move it is,
and the internal id never reaches the collector; `cancelled` is theirs until the visit starts or a card is checked or refused:

| Status | Word | Whose move | Rail | Clock |
| --- | --- | --- | --- | --- |
| `planned` | Not handed in yet | Waiting on you | Planned | nudged at 21 days; expired at 30 with no drop-off ahead |
| `booked` | Drop-off booked | Drop-off on its day | Booked | a missed visit closes the visit, not the plan |
| `checked_in` | Handed in | With us | Handed in | the batch closes Thursday 19:00 and leaves the next day; a card can be withdrawn until then |
| `sent` | With the grader | With PSA · Running late, with PSA past the estimate | Sent | the estimate, from the ship day |
| `graded` | Grades are in | On their way back | Graded | — |
| `returned` | Back at the shop, being checked | With us | Back | — |
| `ready` | Ready to collect | Waiting on you | Back | reminders at 30 and 60 days, storage from 90, the notice from 180 |
| `collected` | Back with you | Collected | Home | retention runs from this day |
| `cancelled` | Cancelled | — | — | retention runs from this day |
| `expired` | Expired | — | — | retention runs from this day |

- 🚧 **Each card's grade at Grades are in** — the page shows the grader's
  stage alone; the grades reach it when the cards are checked back in at the
  shop, never before the cards are back

## A Card's Outcome

🚧 **The set** — Listed · Handed in · Refused at the counter · the grade in the
grader's words, `PSA 10 GEM MT` · Ungraded, with the grader's code such as N1
· Minimum grade not met · Moved up a level · Withdrawn · Held by the grader ·
Not returned · Damaged · Collected · Vaulted; each is a fact on the card,
never a status of the submission.

## Exceptions

🚧 **Each a fact on one card** — told in the collector's words with the money
it changes; the rest of the cards carry on:

| Exception | What the collector sees | Who records it |
| --- | --- | --- |
| Refused at the counter | a card the grader would not take stays in their hands with the reason, never charged; the list and the estimate drop to the cards that go on | staff at hand-in |
| Missed drop-off | the visit closes, the list and the estimate stay; another drop-off is booked from the page | the diary's console; the submission reads it within the hour |
| Withdrawn before the batch | until the batch closes on Thursday 19:00 the card is pulled from the intake bag and collected at the counter against a receipt; its fee comes back at the till, and a withdrawal that takes the last card cancels the submission | staff, on the collector's message |
| Returned ungraded | the card comes back raw with the grader's note and code; the fee stands, as the grader's terms say | staff at receiving, from the manifest |
| Minimum grade not met | a card asked for at PSA 9 or above that graded 8 comes back raw; the fee stands | the collector, per card when listed |
| Moved up a level | the card came back worth more than the level allows, so the grader charged the next level; the difference is the fee sheet's, between the two levels, quoted before booking and due at the counter before collection, told the day the grades post | staff at receiving; the invoice reconciled against the sheet |
| A grade not accepted | the grade is the grader's decision; a review is a new submission at the grader's review fee, asked for at the counter | nobody |
| Running late | the grader is past the estimate; the page shows its stage, and the new date is emailed the day it is set | staff, on the batch with a reason |
| Held by the grader | one card kept for a further look; the others are ready now, the receipt names the card still out, and a second hand-back closes the submission | staff at receiving, with the grader's date |
| Not returned, or damaged | paid out at its declared value with its fee refunded, inside the payout window; Grade10 claims from the grader or the courier itself | staff at receiving; emailed the same day |

- 🚧 **Nothing left to hand in** — a submission whose last card the counter
  refuses is cancelled there, told in person; no message goes and nothing is owed

## The Fee by Outcome

🚧 **One rule per outcome** — the fee a card, and its cover line with it:

| Outcome | The fee |
| --- | --- |
| Refused at the counter | never charged; a line already paid comes back at the till |
| Withdrawn before the batch closes | refunded at the till when the card is collected against a receipt |
| Returned ungraded, or minimum grade not met | stands, as the grader's terms say |
| Moved up a level | stands, and the sheet's difference between the two levels is due before collection |
| Held by the grader | stands; the card comes back on a second hand-back |
| Not returned, or damaged | refunded with the payout at declared value |

- 🚧 **Back the way it was paid** — every refund is a line at the till, the
  way the fee was paid, and the page says what came back and why

## Not Collected

| Day after the ready email | What happens | Confirms |
| --- | --- | --- |
| 30 and 60 | a reminder each, costing nothing | Operations |
| 90 | a storage fee of HKD 30 a card a month accrues, due before collection | Commercial the amount, Operations the day |
| 180 | the written notice is due: staff post it by registered post to the address taken at signing and email it the same day, giving the notice period pinned at signing, **90** days until counsel confirms, from the posting date | Legal: the form, whether email alone serves, the period |
| after the notice period | clause 6 lets the cards be sold under the Disposal of Uncollected Goods Ordinance (Cap. 456) and its own power of sale, the proceeds less what is owed and the sale's costs held for the collector; nothing is built for it yet | Legal |

- 🚧 **Storage per card still at the shop** — a month started since day 90
  counts; a card withdrawn, paid out or vaulted does not, and it is one line
  per card held at the till
- 🚧 **The rungs never pause** — they count from the ready day; only collecting, vaulting or a payout leaves it
- 🚧 **A part month** — counts as a whole month
- 🚧 **Every card paid out** — the submission has ended, for erasure and
  retention, on the day its last card is paid out
- 🚧 **The notice is a counter act** — from day 180 the submission asks staff
  for it; the posting date and tracking are recorded, and the days the notice gives run from it
- 🚧 **After the notice** — the release stops here: the cards stay the
  collector's, storage accrues, and a slab kept on purpose moves into a vault
  case
- 🚧 **The payout** — a card not returned, or returned damaged, is paid out at
  its declared value on a record of its own, approved by a second person, at
  the till or by bank transfer; a card that turns up reverses it on that record
- 🚧 **The payout window** — 14 days from the day the batch is received at
  the shop

## Ready to Collect

- 🚧 **The pickup code** — four digits on the page and in the ready email,
  shown at the counter; with it the shop's hours, walk in, and what is due
- **A shop closed for a single day** — the hours shown are the weekly ones,
  so a one-off closure still shows the shop open that day; reading the
  diary's closures is a later change
- 🚧 **The ID glance** — above the threshold an ID matching the name, nothing
  kept and no identity check; at or below it the code and the name release
- 🚧 **The threshold** — HKD 10,000 declared in total
- 🚧 **Name a collector** — one person at a time, by their full name as on
  their ID, named, changed or removed on the page before collection; no email
  goes, History logs it, and the receipt names who collected
- 🚧 **Nobody else** — anybody but the collector and the named person is turned
  away, code or no code; the collector names them in the minute
- 🚧 **No counter override** — staff cannot release to anyone else; a release
  to an executor or under a court order is a later change
- 🚧 **Vault it** — a slab goes straight into a vault case at the counter: the
  identity check and the custody agreement happen there, storage is free, a
  loan is the vault's offer after valuing it, and the receipt says so —
  [Vault](/p/grade10-site/vault)
- 🚧 **No slabs shipped** — the collector, or the person they name, collects
  in person

## The Record After Collection

- 🚧 **The graded record** — grade, grader and cert per slab with a look-up
  link, the slab photographs from hand-back, and the three documents, each
  with its fingerprint and a download; on the page and in the account
- **The look-up page** — one cert-verification page a grader, `{cert}`
  filled in, each read off that grader's public site; the owner confirms each
  against a live cert, readiness item 12 on
  [Grading](/p/grade10-site/grading#before-the-first-submission)
- 🚧 **Never stock** — a collector's slab never enters the catalogue; a vault
  valuation reads its grader, grade and cert from the item register; an
  auction consignment reads the record from here —
  [Items](/p/grade10-admin/inventory/items#facts)
- 🚧 **Retention** — 2,555 days on the vault's table: the sealed documents and
  the photographs in the vault's classes, and the submission record as a class
  of its own; each window runs from the later of the day the submission ends,
  collected, cancelled, expired or its last card paid out, and the day nothing
  is owed either way; no identity class —
  [Compliance and Readiness](/p/grade10-site/vault/compliance-and-readiness)
- 🚧 **Erasure waits** — the ask to be forgotten is refused while a submission
  is between booked and ready, an upcharge is unsettled or ready cards wait

## What a Collector Can Do

🚧 **By status** — the page offers only what the status allows:

| Status | The collector can |
| --- | --- |
| `planned`, `booked` | edit the list; book, move or cancel the drop-off; cancel the submission |
| `checked_in` | withdraw a card until the batch closes, by messaging the shop |
| `sent` to `returned` | nothing; read the grader's stages and the grades |
| `ready` | name a collector, change or remove them; collect, or vault a slab at the counter |
| `collected` | read the record; vault it, sell it at a Grade10 auction, ask for erasure |

- 🚧 **The counter's list** — no edit once the counter checks or refuses a card
- 🚧 **Cancelling** — offered until the visit starts and until the counter
  checks or refuses a card; after that the counter refuses the cards instead

<!-- story: the submission page at ready, with a collector named -->

:::example{title="5TW8HN, never collected"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 2026/10/27 | The fee for 4 cards at PSA Regular, 4 × $600, due at the counter | +2400 | 2400 |
| | Paid by card at the till, POS 48213 | −2400 | 0 |
| 2026/11/20 | Umbreon VMAX moved up to Express on the grader's invoice; the sheet's difference is due before collection | +600 | 600 |
| 2026/11/26 | Ready to collect; the code is emailed, and nothing else is due for 90 days | | 600 |
| 2026/12/26 | A reminder, costing nothing | | 600 |
| 2027/01/25 | The second reminder | | 600 |
| 2027/02/24 | Storage from day 90: 4 cards × $30 | +120 | 720 |
| 2027/03/24 | Storage, the second month | +120 | 840 |
| 2027/04/24 | Storage, the third month | +120 | 960 |
| 2027/05/24 | Storage, the fourth month | +120 | 1080 |
| 2027/05/25 | Written notice posted: $600 upcharge and $480 storage to date, due before collection, the notice period from today to collect | | 1080 |

The balance is what the collector owes on that day.
:::

:::detail{title="Code map" for="engineer"}
- **Vocabulary** — statuses, card outcomes, exceptions and chips in
  `packages/grading/contracts`
- **The machine** — `packages/grading/backend/src/submissions/transitions.ts`
  is the only writer of the status
- **Sweeps** — the plan's nudge and expiry, the missed visit, the uncollected
  ladder, the grader's morning read, in `packages/grading/backend/src/sweeps/`
- **Retention** — the grading classes on `packages/app-env/src/retention.ts`,
  beside the vault's
- **Architecture** —
  [grading.md](https://github.com/9gag/grade10/blob/main/docs/architecture/grading.md)
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| No exception is a status | Decided | Refused, withdrawn, ungraded, moved up, held, not returned and damaged are recorded on the card; the submission has one status and the rest of the cards carry on | Product |
| One table for the status | Decided | The word, whose move it is and the rail step are one row per status, so the badge, the chip and the rail can never disagree; the grader's own chip keeps waiting on it from reading as waiting on the shop | Product |
| Running late is not a status | Decided | It is the estimate against the clock, read on the page and by the queue the same way | Engineering |
| Held by the grader keeps the submission ready | Decided | The rest are handed back against a receipt that names the card still out; a second hand-back closes it | Product |
| The fee's fate is one table | Decided | Refused never charged, withdrawn refunded at the till, ungraded and minimum not met stand, held stands, not returned or damaged refunded with the payout; every refund goes back the way it was paid | Product |
| Storage fee | Decided | HKD 30 a card a month from day 90, per card still held and per month started, derived at the read, one line per card held at collection, a nudge rather than revenue; waived only by two people, with a reason, as the upcharge is; vault storage stays free, so a slab kept on purpose moves into a case | Commercial |
| The notice | Decided | Reminders at 30 and 60, the fee at 90, then from 180 a counter act: posted by registered post and emailed, the posting date and tracking recorded, the notice period pinned at signing from posting, seeded at 90 days; the first release stops there and clause 6 keeps the disposal basis; counsel words the notice and clause 6 together | Legal |
| Payout for a lost or damaged card | Decided | Declared value on its own record with a second person's approval, at the till or by bank transfer, plus the fee refunded, within 14 days of the batch being received at the shop; a card that turns up reverses the payout | Operations |
| ID at hand-back | Decided | Above HKD 10,000 declared in total a glance at an ID matching the name, keeping nothing; below it the code and the name; no counter override, since the collector renames from their phone | Operations |
| The threshold's own figure | Decided | Above the threshold is more than HKD 10,000 declared in total, so the figure itself is released on the code and the name | Operations |
| Each card's grade before the cards are back | ❓ Open | The page shows a card's grade once the cards are checked back in at the shop; at Grades are in it shows the grader's stage alone. Showing grades when the grader posts them would mean entering the grader's list before the cards arrive | Product |
| Grade and cert into a vault case | ❓ Open | A follow-on; the vault reads the record from the submission page meanwhile | Product |
| Retention | Decided | 2,555 days for the documents and the photographs in the vault's classes and for the submission record as its own class, each from the later of the submission's end event and the day nothing is owed either way; no identity class; a live submission blocks an erasure as a live case does | Legal |
:::
