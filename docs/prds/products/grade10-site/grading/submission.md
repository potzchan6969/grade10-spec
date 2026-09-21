---
title: The Submission
spec: grade10-site/grading/submission-lifecycle
order: 3
---

A submission is one collector's cards to one grader at one level, with one
status; each card carries its own outcome beside it, so four cards with one
returned ungraded are still one submission, ready to collect.

## Statuses

🚧 **Ten statuses** — the badge is the word the collector reads and the
internal id never reaches them; the exits are `cancelled`, by the collector
any time before the cards are handed in, and `expired`:

| Status | Badge | Waits on | Clock |
| --- | --- | --- | --- |
| `planned` | Not handed in yet | the collector: book the drop-off | nudged at 21 days; expired at 30 with no drop-off ahead |
| `booked` | Drop-off booked | the drop-off visit | a missed visit closes the visit, not the plan |
| `checked_in` | Checked in | staff: the next batch | the batch closes Thursday 19:00 and leaves Friday; a card can be withdrawn until then |
| `sent` | With the grader | the grader | the estimate, from the ship day; past it the page reads Running late |
| `graded` | Grades are in | the courier back to the shop | — |
| `returned` | Back at the shop, being checked | staff: the slabs against the manifest | — |
| `ready` | Ready to collect | the collector's pickup | reminders at 30 and 60 days, a storage fee from 90, written notice at 180 |
| `collected` | Back with you | nothing; the cards went home | retention runs from this day |
| `cancelled` | Cancelled | nothing; the cards never left the collector | — |
| `expired` | Expired | nothing; the plan lapsed unbooked | — |

- 🚧 **The ownership chip** — one chip beside the status says whose move it
  is: Waiting on you · With us · With PSA · Running late, with PSA · Drop-off
  on its day · Collected; the grader gets its own so waiting on it never reads
  as waiting on the shop
- 🚧 **The progress rail** — Planned · Booked · Handed in · Sent · Graded ·
  Back · Home, on every submission page

## A Card's Outcome

🚧 **The set** — Listed · Checked in · Refused at the counter · the grade in
the grader's words, `PSA 10 GEM MT` · Ungraded, with the grader's code such as
N1 · Minimum grade not met · Moved up a level · Withdrawn · Held by the grader
· Not returned · Damaged · Collected · Vaulted; a grade, an upcharge and an
ungraded return are facts on the card, never a status of the submission.

## Exceptions

🚧 **Twelve exceptions** — each a fact on one card, told in the collector's
words with the money it changes; the rest of the cards carry on:

| Exception | What the collector sees | Who records it |
| --- | --- | --- |
| Refused at the counter | a card the grader would not take stays in their hands with the reason, never charged; the list and the estimate drop to the cards that go on | staff at hand-in |
| Missed drop-off | the visit closes, the list and the estimate stay; another drop-off is booked from the page | the diary |
| Withdrawn before the batch | until the batch closes on Thursday 19:00 the card is pulled from the intake bag and collected at the counter against a receipt; its fee comes back at the till | staff, on the collector's message |
| Returned ungraded | the card comes back raw with the grader's note and code; the fee stands, as the grader's terms say | staff at receiving, from the manifest |
| Minimum grade not met | a card asked for at PSA 9 or above that graded 8 comes back raw; the fee stands | the collector, per card when listed |
| Moved up a level | the card came back worth more than the level allows, so the grader charged the next level; the difference is due at the counter before collection, told the day the grades post | staff at receiving, from the invoice |
| A grade not accepted | the grade is the grader's decision; a review is a new submission at the grader's review fee, asked for at the counter | nobody |
| Running late | the grader is past the estimate; the page shows its stage, and the new date is emailed the day it is set | staff, on the batch with a reason |
| Held by the grader | one card kept for a further look; the others are ready now, the receipt names the card still out, and a second hand-back closes the submission | staff at receiving, with the grader's date |
| Not returned, or damaged | settled at its declared value with its fee refunded, inside the settlement window; Grade10 claims from the grader or the courier itself | staff at receiving; emailed the same day |
| Refunds | back the way it was paid, at the till: a refused line, a withdrawn card, a card not returned; nothing on an ungraded card, and never the grader's fee once the batch has left | staff, one POS line each |
| Not collected | reminders, then a storage fee, then written notice, then disposal under Cap. 456 with the proceeds less fees held for the collector; vault instead is their choice at the counter | the clock; staff at the counter |

## Not Collected

| Day after the ready email | What happens | Confirms |
| --- | --- | --- |
| 30 and 60 | ❓ a reminder each, costing nothing | Operations |
| 90 | ❓ a storage fee of HKD 30 a card a month accrues, due before collection | Commercial the amount, Operations the day |
| 180 | ❓ written notice by registered post to the address taken at signing and by email, giving 30 days to collect | Legal: the form, whether email alone serves, the 30 days |
| after the 30 days | ❓ the cards may be sold under the Disposal of Uncollected Goods Ordinance (Cap. 456), the proceeds less fees held for the collector | Legal |

- 🚧 **The cards stay the collector's** — until the notice's day has passed;
  the storage fee is a nudge, and a slab kept on purpose goes into a vault
  case free
- ❓ **Settlement window** — a card not returned, or returned damaged, is
  settled at its declared value with its fee refunded within 14 days of the
  batch being received, at the counter or by bank transfer to the card paid
  with — Operations

## Ready to Collect

- 🚧 **The pickup code** — four digits on the page and in the ready email,
  shown at the counter; with it the shop's hours, no booking needed, and what
  is due
- 🚧 **The ID glance** — above the threshold the counter glances at an ID
  matching the name, the collector's or the named person's, and keeps
  nothing; below it the code and the name release the cards. Not an identity
  check, so the vault's identity duties do not apply
- ❓ **The threshold** — HKD 10,000 declared in total — Operations
- 🚧 **Name a collector** — one person at a time, named on the page before
  anyone comes in, by their full name as on their ID; changed or removed from
  the page any time before collection; no email goes, History logs it, and
  the receipt names who collected
- 🚧 **Nobody else** — a person who is neither the collector nor the named
  person is turned away, code or no code; the collector names them from the
  page in the same minute
- ❓ **No counter override** — staff cannot release to anyone else — Operations
- 🚧 **Vault it** — a slab goes straight into a vault case at the counter:
  the identity check and the custody agreement happen there, no second visit,
  storage free, and a loan is an offer the vault makes after valuing it; the
  card goes to the vault rather than home, and the receipt says so —
  [Vault](/p/grade10-site/vault)
- ❓ **Grade and cert into the case** — a follow-on: the vault's valuation
  reads them from the submission rather than carrying them as fields — Product
- 🚧 **No slabs shipped** — the collector, or the person they name, collects
  in person

## The Record After Collection

- 🚧 **The graded record** — grade, grader and cert per slab with a look-up
  link, slab photographs taken at hand-back, and three documents, the
  submission agreement, the intake receipt and the hand-back receipt, each
  with its fingerprint and a download; kept on the page, and under the account
  when the collector keeps one
- 🚧 **Never stock** — a collector's slab never enters the catalogue; a vault
  valuation or an auction consignment reads the record from here
- ❓ **Retention** — seven years, 2,555 days, joining the vault's retention
  table so one erasure path serves both products; grading keeps no identity
  class — Legal —
  [Compliance and Readiness](/p/grade10-site/vault/compliance-and-readiness)

## What a Collector Can Do

🚧 **By status** — the page offers only what the status allows:

| Status | The collector can |
| --- | --- |
| `planned`, `booked` | edit the list; book, move or cancel the drop-off; cancel the submission |
| `checked_in` | withdraw a card until the batch closes, by messaging the shop |
| `sent` to `returned` | nothing; read the grader's stages and the grades |
| `ready` | name a collector, change or remove them; collect, or vault a slab at the counter |
| `collected` | read the record; vault it, sell it at a Grade10 auction, ask for erasure |

<!-- story: the submission page at ready, with a collector named -->

:::example{title="5TW8HN, never collected"}
| When | Event | Points | Balance |
| --- | --- | --- | --- |
| 2026/10/27 | The fee for 4 cards at PSA Regular, 4 × $600, due at the counter | +2400 | 2400 |
| | Paid by card at the till, POS 48213 | −2400 | 0 |
| 2026/11/20 | Umbreon VMAX moved up to Express on the grader's invoice; the difference is due before collection | +600 | 600 |
| 2026/11/26 | Ready to collect; the code is emailed, and nothing else is due for 90 days | | 600 |
| 2026/12/26 | A reminder, costing nothing | | 600 |
| 2027/01/25 | The second reminder | | 600 |
| 2027/02/24 | Storage from day 90: 4 cards × $30 | +120 | 720 |
| 2027/03/24 | Storage, the second month | +120 | 840 |
| 2027/04/24 | Storage, the third month | +120 | 960 |
| 2027/05/25 | Written notice: $600 upcharge and $360 storage to date, due before collection, 30 days to collect | | 960 |

The balance is what the collector owes on that day. Collected on 28 Nov as
planned, the balance was $600, settled at the till.
:::

:::detail{title="Code map" for="engineer"}
- **Vocabulary** — statuses, card outcomes, exceptions and chips in
  `packages/grading/contracts`
- **The machine** — `packages/grading/backend/src/submissions/transitions.ts`
  is the only writer of the status
- **Sweeps** — the plan's nudge and expiry, the uncollected ladder, the
  grader's morning read, in `packages/grading/backend/src/sweeps/`
- **Retention** — the grading classes on `packages/app-env/src/retention.ts`,
  beside the vault's
- **Architecture** —
  [grading.md](https://github.com/9gag/grade10/blob/main/docs/architecture/grading.md)
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| No exception is a status | Decided | Refused, withdrawn, ungraded, moved up, held, not returned and damaged are recorded on the card; the submission has one status and the rest of the cards carry on | Product |
| Running late is not a status | Decided | It is the estimate against the clock, read on the page and by the queue the same way | Engineering |
| Held by the grader keeps the submission ready | Decided | The rest are handed back against a receipt that names the card still out; a second hand-back closes it | Product |
| Storage fee | ❓ Open | HKD 30 a card a month from day 90, due before collection, a nudge rather than revenue; vault storage stays free, so a slab kept on purpose moves into a case | Commercial |
| Notice and disposal | ❓ Open | Reminders at 30 and 60, the fee at 90, written notice at 180 by registered post and email giving 30 days, then disposal under Cap. 456 with the proceeds less fees held; the notice's form and wording | Legal |
| Settlement for a lost or damaged card | ❓ Open | Declared value plus the fee within 14 days of the batch being received, at the counter or by bank transfer; where the refund goes | Operations |
| ID at hand-back | ❓ Open | Above HKD 10,000 declared in total a glance at an ID matching the name, keeping nothing; below it the code and the name; no counter override, since the collector renames from their phone | Operations |
| Grade and cert into a vault case | ❓ Open | A follow-on; the vault reads the record from the submission page meanwhile | Product |
| Retention | ❓ Open | 2,555 days for the agreement, the photographs and the receipts, on the vault's table; no identity class | Legal |
:::
