**Author:** @brianchacha6969 - 2026-09-21

## Why

A collector who wants a card graded today fills in the grader's forms, ships
the card abroad and insures it alone, or hands it to a shop and leaves with
nothing: no receipt naming the card, no way to see where it is, and no promise
of what happens if it does not come back. The shop already sees the card, holds
a counter and a safe, and ships to PSA, CGC and BGS; nothing in Grade10 lets it
take a submission in, track it, and hand the slabs back against a record.

**Metric:** submissions booked a month, cards graded, and the share of upcharges
settled before collection; beside them the share of submissions uncollected 30
days after the ready email. All four are zero today, because nothing can hold a
submission.

## What Changes

- **A collector plans a submission on their phone.** The cards with a declared
  value each, by hand or from a pasted list; one grader and one level for the
  whole list, the fee and the return date before anything is booked, and each
  card that could move up a level named with the difference it would cost. The
  plan lives under the email given and its link opens on any device with no
  account.
- **The drop-off is a visit in the shop's diary.** Booked from the plan as the
  vault's visit is, showing beside each day the batch it makes; moved or
  cancelled up to the visit; a second submission joins a drop-off already
  booked; a walk-in books the customer-bookable Grading visit and lists the
  cards at the counter. The submission sends every email about the visit; the
  diary sends none for a product booking.
- **Nothing is paid before every card is checked and the agreement sealed.**
  Staff check each card with the collector, the collector signs the submission
  agreement on the iPad, and only then does the till open, one Grading Service
  line per card, written back to the submission by reference. A card the
  grader would not take is refused with a reason in the collector's words and
  never charged.
- **One submission has one status; every card carries its own outcome.** Ten
  statuses from planned to collected, and the twelve exceptions, a refused,
  withdrawn, ungraded, moved-up, held, lost or damaged card among them, are
  facts on the card, told in the collector's words with the money each one
  changes. The rest of the cards carry on.
- **Cards leave in batches, one grader and one level each.** A batch is what
  the grader invoices and ships back, so it is what the shop tracks: closed
  Thursday 19:00, shipped Friday, its stages read from the grader's order
  status each morning and written to every submission in it; a re-estimate
  emails every collector in the batch.
- **Receiving matches every cert to a card.** Each scan matches a cert to an
  intake id on the grader's manifest, a cert already held elsewhere is refused
  by name, and finishing makes every submission in the batch ready at once,
  with the pickup code and what is due emailed. An upcharge on the grader's
  invoice is fronted by Grade10 and due at the counter before collection.
- **Collection is in person, against the code and a receipt.** The collector,
  or one person they name on the page, collects with the pickup code; above
  the threshold the counter glances at an ID and keeps nothing. Nobody else is
  released to. A slab can go straight into a vault case from the same counter.
  Uncollected cards are reminded, then charged storage, then given written
  notice.
- **Two documents ride the vault's ceremony.** The submission agreement and
  the hand-back receipt are sealed on the same doc-sign ceremony the vault
  uses, with a packet that needs no identity record; the intake receipt is
  issued, not signed. Every default the pages run on is a setting the console
  reads.
- **A block set for the collector's pages.** The fee sheet, the card list and
  the paste sheet, the level picker, the review, the status rail and ownership
  chip, the pickup card, the name-a-collector card, the grade cards, the money
  block and the uncollected ladder are exported from `packages/ui` with
  stories. None exists yet.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/grading/submission-plan`: the home and the price sheet, the
  three-step wizard, a pasted list, the grader and level with the levels a
  value or a count closes, the estimate, the review with its upcharge warning,
  finishing later under an emailed link, and the plan's nudge and expiry.
- `grade10-site/grading/dropoff-booking`: the product-bound drop-off service
  and its Bulk variant, the batch a chosen day makes, the booked page and its
  checklist, moving, cancelling and missing the visit, a second submission
  joining a drop-off, and the walk-in.
- `grade10-site/grading/submission-lifecycle`: the ten statuses and the
  ownership chip, a card's outcomes, the twelve exceptions, withdrawing a card,
  ready to collect with the pickup code and the ID glance, naming a collector,
  vaulting a slab, the uncollected ladder, settlement for a lost card, and the
  record after collection.
- `grade10-site/grading/counter-documents`: the submission agreement and the
  hand-back receipt on the iPad, sealed on the vault's ceremony with no
  identity record, their clauses, the postal address, declining, copies, and
  the issued intake receipt.
- `grade10-site/grading/collector-notifications`: one exhaustive map from
  every event to its email or to silence on purpose, English only, each
  linking the submission page; the drop-off's five messages sent by grading;
  the footer; a failed send kept.
- `grade10-admin/grading/counter`: the queue cut by what a submission waits
  for, its badges and tiles; the hand-in runbook, check, sign, pay, label;
  refusing a card; the hand-back runbook, who collects, the ID glance, settle,
  sign or vault; the settings; the grants.
- `grade10-admin/grading/batches`: batches open, shipped and back; the ship
  form, re-estimating, receiving against the manifest and its exceptions, and
  the cap on declared value in the safe.
- `grade10-admin/grading/submission-record`: one submission's tabs, the cards
  after the grades, money, documents and timeline; recording a settlement,
  waiving an upcharge with a second person, withdrawing a card.
- `shared/ui/grading-submission`: the collector-facing block set in
  `packages/ui/src/blocks/grading-submission/` with colocated stories, none of
  which exists yet: `GradingFeeSheet`, `GradingCardList`,
  `GradingPasteSheet`, `GradingLevelPicker`, `GradingReview`,
  `GradingStatusRail`, `GradingOwnershipChip`, `GradingPickupCard`,
  `GradingNamedCollector`, `GradingGradeCards`, `GradingMoneyBlock` and
  `GradingUncollectedLadder`, every one fed by props alone.

### Modified Capabilities

- `grade10-site/vault/retention-and-erasure`: the retention table gains the
  grading classes, the submission agreement, the intake and hand-back receipts
  and the intake and hand-back photographs, at the vault's windows, and no
  identity class, so one review and one erasure path serve both products.

`grade10-site/appointment/booking` is not modified: the collector's booking
surface lists customer-bookable services only and already names the Grading
visit the walk-in books; the product-bound drop-off is a service bound to
`grading`, data the diary already takes (`decisions.md` Q18, Q19).

## Impact

- **Packages** — `packages/grading/{contracts,backend,frontend,admin-frontend}`
  laid out as the vault's are; `packages/ui` gains the `grading-submission`
  block set and its stories; `packages/i18n` gains a `grading` namespace in
  every shared catalog and head entries for the collector's surfaces.
- **Worker** — `apps/backend/grade10/grading`, its own Neon database, one
  writer of the status, sweeps for the plan's clocks, the uncollected ladder
  and the grader's morning read, and a `grading_settings` table seeded from
  the defaults and read by every value the pages run on.
- **The diary** — three catalogue entries in `packages/appointment`: the
  product-bound Grading drop-off, its Bulk variant, and the customer-bookable
  Grading visit; booked over the per-product entrypoint, no new diary logic.
  The scheduling vocabulary's product set gains `grading`, one word in
  `add-multi-store-appointments`'s own delta (`decisions.md` Q19).
- **Doc-sign** — the vault's ceremony instantiated into the grading database;
  the host contract gains a packet option that requires no identity record,
  decided per template, never a null reference; the collector's sign page
  reaches the grading ceremony at its own base address.
- **The console** — a Grading section in the grade10 admin panel: the queue,
  the batches, one submission, the settings; three grants named as the
  vault's are; every write elevated and filed under its submission on the
  audit chain.
- **The POS** — one Grading Service line per card at the level's fee, an
  upcharge, a storage fee and a refund each a line against the submission,
  written back by reference; no online payment.
- **Emails** — thirteen messages in the grading shell in `apps/emails`, on the
  vault's retry ladder.
- **The vault** — the retention table gains the grading classes; vaulting a
  slab at the counter opens an ordinary vault case on the collector's phone.
- **Carried surfaces** — `grade10.com/grading`, `/grading/submissions/<id>`,
  `/grading/sign` and `admin.grade10.com/grading` are carried in development
  and staging as the vault's pages are, on no lane the public reaches.
- **No domain suite exists** for `grade10-site/grading` or
  `grade10-admin/grading`; both domains are new, so this change carries none.

## Follow-on changes

- A vault case opened for a slab carries the grade and the cert as valuation
  fields, read from the submission.
- A slab consigned to a Grade10 auction straight from the graded record.
- Shipping slabs back inside Hong Kong, to the address on the agreement, at
  cost, once transit cover exists.
- Reading the grader's order status through its own service, instead of the
  morning check typing the stage.
- CGC's and BGS's fee sheets, once Commercial supplies them; the levels exist
  as data from the first release.

## Open questions

Every default below is adopted from the canvas until its owner confirms or
changes it, and is a `❓` row in `decisions.md` with the value recommended.

- **Operations** — the clocks: the plan's nudge at 21 days and expiry at 30,
  reminders at 30 and 60 days, storage from day 90, the notice at 180, and the
  batch cut-off Thursday 19:00 with the batch shipping Friday, checked against
  the courier's pickup schedule; the settlement window of 14 days and where
  the refund goes; the ID glance threshold of HKD 10,000 and that staff have
  no override; the Bulk cap of 100 cards and the longer drop-off. ❓ on
  [The Submission · Not Collected](../../../docs/prds/products/grade10-site/grading/submission.md#not-collected)
  and [Grading Console · Settings](../../../docs/prds/products/grade10-admin/grading/console.md#settings).
- **Commercial** — the fee sheet, one per grader and level with its ceiling,
  fee, cover line and estimate, every figure on the canvas being an example
  modelled on PSA's; the cover line of 1.5% at Express and Super Express; the
  fee standing on an ungraded card; fronting the upcharge with no cap and no
  pre-authorisation; the storage fee of HKD 30 a card a month as a nudge, not
  revenue; the cap of HKD 300,000 on declared value in the safe until cover is
  bought. ❓ on
  [Planning a Submission · Fee Sheet](../../../docs/prds/products/grade10-site/grading/planning.md#fee-sheet)
  and [Planning a Submission · Caps and Clocks](../../../docs/prds/products/grade10-site/grading/planning.md#caps-and-clocks).
- **Legal** — the custodian's registered name and the complaints contact
  printed on both documents and every email; clause 5, which changes the day a
  policy is bought; clause 6's wording and the notice's form, whether email
  alone serves and the 30 days it gives; the hand-back receipt's first clause
  when a named person collects; the grading classes at the vault's retention
  windows. ❓ on
  [Documents and Signing · The Submission Agreement](../../../docs/prds/products/grade10-site/grading/documents.md#the-submission-agreement)
  and [Documents and Signing · The Hand-back Receipt](../../../docs/prds/products/grade10-site/grading/documents.md#the-hand-back-receipt).
- **Product** — the three diary services' names and durations; whether a
  `planned` submission has a queue view of its own; shipping slabs back in a
  second release. ❓ on
  [The Drop-off · Rules](../../../docs/prds/products/grade10-site/grading/drop-off.md#rules)
  and [Grading Console · Queue](../../../docs/prds/products/grade10-admin/grading/console.md#queue).
- **Engineering** — whether `grading` joins the scheduling vocabulary's
  product set in `add-multi-store-appointments`'s own delta (`Q19`).
- **The author's handle** — `@brianchacha6969` has no row in
  `docs/prds/team.yaml` yet, so the record can name the hand and address
  nothing to it until Operations adds the line.

## References

- [Grading · Where It Is Open](../../../docs/prds/products/grade10-site/grading/index.md#where-it-is-open)
- [Grading · Users](../../../docs/prds/products/grade10-site/grading/index.md#users)
- [Planning a Submission · Fee Sheet](../../../docs/prds/products/grade10-site/grading/planning.md#fee-sheet)
- [Planning a Submission · Caps and Clocks](../../../docs/prds/products/grade10-site/grading/planning.md#caps-and-clocks)
- [Planning a Submission · The Wizard](../../../docs/prds/products/grade10-site/grading/planning.md#the-wizard)
- [The Drop-off · Rules](../../../docs/prds/products/grade10-site/grading/drop-off.md#rules)
- [The Drop-off · Booking](../../../docs/prds/products/grade10-site/grading/drop-off.md#booking)
- [The Drop-off · Before You Come](../../../docs/prds/products/grade10-site/grading/drop-off.md#before-you-come)
- [The Submission · Statuses](../../../docs/prds/products/grade10-site/grading/submission.md#statuses)
- [The Submission · A Card's Outcome](../../../docs/prds/products/grade10-site/grading/submission.md#a-card-s-outcome)
- [The Submission · Exceptions](../../../docs/prds/products/grade10-site/grading/submission.md#exceptions)
- [The Submission · Not Collected](../../../docs/prds/products/grade10-site/grading/submission.md#not-collected)
- [The Submission · Ready to Collect](../../../docs/prds/products/grade10-site/grading/submission.md#ready-to-collect)
- [The Submission · The Record After Collection](../../../docs/prds/products/grade10-site/grading/submission.md#the-record-after-collection)
- [The Submission · What a Collector Can Do](../../../docs/prds/products/grade10-site/grading/submission.md#what-a-collector-can-do)
- [Documents and Signing · The Documents](../../../docs/prds/products/grade10-site/grading/documents.md#the-documents)
- [Documents and Signing · The Submission Agreement](../../../docs/prds/products/grade10-site/grading/documents.md#the-submission-agreement)
- [Documents and Signing · The Intake Receipt](../../../docs/prds/products/grade10-site/grading/documents.md#the-intake-receipt)
- [Documents and Signing · The Hand-back Receipt](../../../docs/prds/products/grade10-site/grading/documents.md#the-hand-back-receipt)
- [What the Collector Hears · Messages](../../../docs/prds/products/grade10-site/grading/messages.md#messages)
- [Grading Console · Queue](../../../docs/prds/products/grade10-admin/grading/console.md#queue)
- [Grading Console · Hand-in](../../../docs/prds/products/grade10-admin/grading/console.md#hand-in)
- [Grading Console · Batches](../../../docs/prds/products/grade10-admin/grading/console.md#batches)
- [Grading Console · Receiving](../../../docs/prds/products/grade10-admin/grading/console.md#receiving)
- [Grading Console · One Submission](../../../docs/prds/products/grade10-admin/grading/console.md#one-submission)
- [Grading Console · Hand-back](../../../docs/prds/products/grade10-admin/grading/console.md#hand-back)
- [Grading Console · Settings](../../../docs/prds/products/grade10-admin/grading/console.md#settings)
- [Grading Console · Grants](../../../docs/prds/products/grade10-admin/grading/console.md#grants)
- [Grading operations](../../../docs/prds/products/grade10-admin/grading/index.md)
- [Compliance and Readiness · Retention and erasure](../../../docs/prds/products/grade10-site/vault/compliance-and-readiness.md#retention-and-erasure)
