---
title: Grading
icon: medal
---

Grading is the shop as a submission centre: a collector lists the cards on
their phone, brings them to the counter, Grade10 hands them to PSA, CGC or BGS
in a batch and hands the slabs back in person. A submission is one grader and
one level, and every card in it carries its own outcome.

- 🚧 **Where** — one host and a path per surface
  1. `grade10.com/grading` — the price sheet and the collector's own
     submissions; public and indexed, as `/book` is
  2. `grade10.com/grading/new` — the wizard
  3. `grade10.com/grading/submissions/<id>` — one submission, the address every
     email links to, where its drop-off is booked; no account needed
  4. `grade10.com/grading/submissions/<id>/edit` — the wizard on a kept plan
  5. `grade10.com/grading/sign#<token>` — the submission agreement and the
     hand-back receipt on the shop iPad, opened from the QR code or link staff
     hand over
  6. `grade10.com/book` — a walk-in's drop-off with no list; the cards are
     listed at the counter
  7. `admin.grade10.com/grading` — the queue, the batches and one submission;
     `admin.grade10.com/grading/walk-in` for a list written at the desk
- 🚧 **Money** — HKD, taken at the till against one POS line per card, and a
  cover line per card at Express and Super Express, written back to the
  submission; nothing is paid before every card is checked and the agreement
  sealed
- 🚧 **Paper** — three English documents, each running to as many pages as
  its list of cards needs; the two signed ones sealed in-house on the vault's
  ceremony — [Documents and Signing](/p/grade10-site/grading/documents)
- **Specs** — `openspec/specs/grade10-site/grading` for the collector's side
  and `openspec/specs/grade10-admin/grading` for the console; each page names
  the ones it documents

| Page | What it holds |
| --- | --- |
| [Planning a Submission](/p/grade10-site/grading/planning) | The fee sheet, the caps and clocks, the wizard, the estimate and the upcharge warning |
| [The Drop-off](/p/grade10-site/grading/drop-off) | The diary service, the batch the day makes, moving, cancelling and missing the visit |
| [The Submission](/p/grade10-site/grading/submission) | The ten statuses, a card's outcomes, the exceptions, the fee by outcome, ready to collect, the record after |
| [Documents and Signing](/p/grade10-site/grading/documents) | The agreement, the intake receipt, the hand-back receipt, what Legal owes |
| [What the Collector Hears](/p/grade10-site/grading/messages) | Every event's email, or silence on purpose |
| [Grading Console](/p/grade10-admin/grading/console) | The queue, hand-in, batches, receiving, hand-back, the notice, the settings, the grants |

## Where It Is Open

🚧 **Not open to the public yet** — carried in development and staging as the
vault's pages are, and on no lane the public reaches —
[Carried Surfaces](/p/grade10-site/site/carried-surfaces)

## Users

- **Collectors** — list the cards, book the drop-off, sign at the counter and
  pay, watch the submission, settle an upcharge, name a person to collect,
  collect or vault a slab
- **Shop staff** — work the queue: check each card, refuse one, seal the
  agreement, take the fee, batch the cards to the grader, receive them against
  the manifest, hand them back, post the notice
- **The grader** — an outside party, PSA, CGC or BGS: grades under its own
  terms, invoices the batch, ships it back; its stages and its words reach the
  collector unchanged
- **Admins** — every grant, including the second person a waiver, a payout
  or a money setting takes

## Before the First Submission

Every item is a value or an act outside the code, with who closes it.

1. *Legal* — **The custodian's registered name and the complaints contact**
   — printed on both documents and every email
2. *Legal* — **The notice's form** — its wording, whether email alone serves,
   and the 30 days it gives from posting
3. *Legal* — **The retention classes** — grading's rows on the vault's table
   — [Compliance and Readiness](/p/grade10-site/vault/compliance-and-readiness#retention-and-erasure)
4. *Commercial, Legal* — **Cover** — a goods-in-trust quote spanning grading
   and the vault, transit insurance for outbound batches and the courier's
   collectibles terms in writing; clause 5 changes the day a policy is bought
   and the safe's cap stands until then
5. *Commercial* — **The fee sheet** — one per grader and level, replacing the
   example figures the pages carry
6. *Operations, Commercial* — **The settings** — every row of the console's
   table confirmed or changed —
   [Grading Console](/p/grade10-admin/grading/console#settings)
7. *Product, Engineering* — **The diary services** — the drop-off, its Bulk
   variant and the walk-in's visit, named and sized in the diary

- 🚧 **The seal refuses a placeholder** — in production an agreement or a
  receipt cannot be sealed while a fact it prints is unset; outside
  production the bracket prints

:::detail{title="Code map" for="engineer"}
- **Code** — `packages/grading/{contracts,backend,frontend,admin-frontend}`
  with `packages/appointment` and `packages/doc-sign` beside it; the
  collector's pages in the grade10 SPA, the console pages in the grade10 admin
  panel; deployed as `grade10-grading-service`
- **Architecture** —
  [grading.md](https://github.com/9gag/grade10/blob/main/docs/architecture/grading.md),
  to be written with the change
- **Defaults** —
  [ops.md § Grading](https://github.com/9gag/grade10/blob/main/docs/temp/ops.md),
  each becoming a setting the console reads
- **Change** — `add-card-grading` in this store
:::

:::detail{title="Product decisions" for="pm"}
A collector who wants a card graded deals with the grader's forms, its
shipping and its insurance alone; the shop already sees the card, holds a
counter and ships to the graders. Grading makes the shop the submission
centre: one list, one visit, one fee, and the slabs back in the same hands.
The canvas is the source, and the defaults it runs on are in
[ops.md](https://github.com/9gag/grade10/blob/main/docs/temp/ops.md).

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Wants a few cards graded | Knows the fee, the level and the return date before the visit, pays once at the counter, and is told the moment the grades are in |
| Collector | A dealer with a box of cards | Pastes the list, takes the Bulk level and the longer visit, and collects everything at once |
| Collector | A card came back worth more than the level | Knows the difference the day the grades post, never at the counter |
| Shop staff | A customer at the counter | Finds the booking, checks each card with them, seals the agreement, takes the fee and seals the bag in one visit |
| Shop staff | A batch is back | Scans every slab against the manifest, records the exceptions on the cards, and emails every collector in one act |
| The grader | A batch arrives | One order at one level, one invoice, one shipment back |

**Not in scope.** Shipping slabs back; CGC and BGS fee figures until
Commercial supplies their sheets; a vault case carrying the grade and cert as
valuation fields; online payment; staff notifications; disposal of cards
nobody collects, which the first release stops short of.

**Measurement.** Submissions booked, cards graded, upcharges settled before
collection, submissions uncollected past 30 days.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One submission, one grader, one level | Decided | A card that needs another level goes in a second submission on the same drop-off; a batch is one grader and one level, so a submission is what the grader invoices | Product |
| A card's outcome is a fact on the card | Decided | A grade, an upcharge, an ungraded return, a card held or lost are recorded on the card and never as a status of the submission; the rest of the cards carry on | Product |
| Nothing paid before every card is checked and the agreement sealed | Decided | The till opens on the sealed agreement, one POS line per card at the level's fee; the collector keeps the cards until then, and a sealed agreement with no paid line hands nothing in | Product |
| The fee stands on an ungraded card | ❓ Open | The grader charges it either way and the collector is warned twice, on the review step and in clause 3; goodwill on it is Commercial's call, and the design advises against | Commercial |
| Refused at the counter, never charged | Decided | A card the grader would not take is refused with a reason in the collector's words; a line already paid is refunded at the till | Product |
| The upcharge is fronted and carried until collection | ❓ Open | Grade10 pays the difference on the grader's invoice and collects it at the counter; the exposure is carried from receiving to collection, or to disposal once a later change builds it, and nothing recovers it before; a collector who never collects leaves Grade10 holding it, secured on the card; no cap and no pre-authorisation | Commercial |
| No slabs shipped | ❓ Open | The collector or a person they name collects in person; a second release could ship inside Hong Kong to the address on the agreement, at cost, once transit cover exists | Product |
| Every default is a setting the console reads | Decided | Each value on the console's settings table is configuration, never a constant; a submission carries the values it was booked and signed on | Engineering |
| A day is the brand's, an instant is UTC | Decided | `Asia/Hong_Kong` decides the cut-off, a due date, a reminder day and the queue's day; the wire and the database stay UTC ([[shared/dates-and-times]]) | Product |
| Grading needs no identity record | Decided | The ID glance above the threshold is a counter fact, matched to the name and keeping nothing, and not a KYC check; the vault's identity duties do not apply | Product |
| Cover for the cards | ❓ Open | Clause 5 promises a payout at declared value while Grade10 holds no policy and couriers cap collectibles cover near USD 1,000 a parcel; a goods-in-trust quote spanning grading and the vault, transit insurance for outbound batches and the courier's terms in writing before launch, and the safe's cap meanwhile | Commercial, Legal |
| The first release stops at the notice | Decided | Reminders, the storage fee and the written notice are built; disposal under clause 6, its status, act, grant and held-proceeds record, is a later change, and the cards stay the collector's at the shop meanwhile | Product |
:::
