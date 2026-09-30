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
  value each, by hand or from a pasted list matched in the shop's card price
  reference; one grader and one level for the whole list, the fee, the cover
  line and the return date before anything is booked, and each card that could
  move up a level named with the sheet's difference it would cost. The plan is
  priced on the sheet it is booked on, lives under the email given, and its
  link opens on any device with no account; signed in, the home lists every
  submission.
- **The drop-off is a visit in the shop's diary.** Booked from the plan as the
  vault's visit is, showing beside each day the batch it makes; moved or
  cancelled up to the visit; a dealer's list takes the longer Bulk drop-off; a
  second submission joins the drop-off the first one owns; a walk-in books the
  customer-bookable Grading visit and lists the cards at the counter. The
  submission sends every email about the visit, hears a missed one from the
  diary within the hour, and the diary sends nothing for a product booking.
- **Nothing is paid before every card is checked and the agreement sealed.**
  Staff check each card with the collector, the collector signs the submission
  agreement on the iPad with every figure it prints pinned from then on, and
  only then does the till open, one Grading Service line per card and a cover
  line where the level carries one, written back to the submission by line. A
  card the grader would not take is refused with a reason in the collector's
  words and never charged, and nothing is handed in until a line is paid.
- **One submission has one status; every card carries its own outcome.** Ten
  statuses from planned to collected in one table, the word, whose move it is
  and the rail step, and every exception, a refused, withdrawn, ungraded,
  moved-up, held, lost or damaged card among them, a fact on the card told in
  the collector's words, with the fee's fate per outcome in one table. The
  rest of the cards carry on.
- **Cards leave in batches, one grader and one level each.** A batch is what
  the grader invoices and ships back, so it is what the shop tracks: closed
  Thursday 19:00, shipped the next day, its stages read from the grader's
  order status each morning and written to every submission in it; a
  re-estimate emails every collector in the batch; the safe's cap refuses a
  hand-in past it.
- **Receiving matches every cert to a card.** The manifest and the invoice
  enter first, each scan matches a cert to an intake id, a cert already held
  elsewhere is refused by name, and finishing makes every submission in the
  batch ready at once, with the pickup code and what is due emailed. An
  upcharge is the fee sheet's difference the collector was quoted, the invoice
  reconciled against it; Grade10 fronts it and carries it until collection. A
  card not returned or damaged is paid out at its declared value on a record
  of its own, approved by a second person.
- **Collection is in person, against the code and a receipt.** The collector,
  or one person they name on the page, collects with the pickup code; above
  the threshold the counter glances at an ID and keeps nothing. Nobody else is
  released to. A slab can go straight into a vault case from the same counter.
  Uncollected cards are reminded, then charged storage per card and per month,
  then given written notice as a counter act with its posting date; the first
  release stops at the notice.
- **Two documents ride the vault's ceremony.** The submission agreement and
  the hand-back receipt are sealed on the same doc-sign ceremony the vault
  uses, with a packet that needs no identity record; the intake receipt is
  issued, not signed. Every default the pages run on is a setting the console
  reads under a grant, pinned to a submission at booking and at signing; a
  readiness list names what stands between the code and the first submission,
  and the seal refuses a placeholder in production.
- **A block set for the collector's pages.** The fee sheet, an editable card
  list for planning and a read-only record for the pages after hand-in, the
  paste sheet, the level picker, the review, the status rail and ownership
  chip, the pickup card, the name-a-collector card, the grade cards, the money
  block and the uncollected ladder are exported from `packages/ui` with
  stories; the drop-off composes the package's appointment-booking exports
  and adds only the batch line and the wizard rail.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/grading/submission-plan`: the home and the price sheet, the
  three-step wizard, a pasted list matched in the card price reference, the
  grader and level with the levels a value or a count closes, the estimate
  with its cover line, the review with its upcharge warning, the sheet pinned
  at booking, finishing later under an emailed link or the signed-in list,
  and the plan's nudge and expiry.
- `grade10-site/grading/dropoff-booking`: the product-bound drop-off service
  and its Bulk variant, the batch a chosen day makes, the booked page and its
  checklist, moving, cancelling and missing the visit as the diary closes it,
  a second submission joining the drop-off the first one owns, and the
  walk-in.
- `grade10-site/grading/submission-lifecycle`: the ten statuses in one table
  with the chip and the rail, a card's outcomes, the exceptions, the fee by
  outcome, withdrawing a card, ready to collect with the pickup code and the
  ID glance, naming a collector, vaulting a slab, the uncollected ladder to
  the notice, the payout for a lost card, and the record after collection.
- `grade10-site/grading/counter-documents`: the submission agreement and the
  hand-back receipt on the iPad, sealed on the vault's ceremony with no
  identity record, their clauses, the figures pinned at signing, the postal
  address, declining, copies, and the issued intake receipt.
- `grade10-site/grading/collector-notifications`: one exhaustive map from
  every event to its email or to silence on purpose, English only, each
  linking the submission page; the drop-off's messages sent by grading; the
  footer; a failed send kept.
- `grade10-admin/grading/counter`: the queue cut by what a submission waits
  for, its badges and tiles; the hand-in runbook, check, sign, pay, label, and
  no hand-in without a paid line; refusing a card; the hand-back runbook, who
  collects, the ID glance, settle, sign or vault; one submission's tabs, the
  cards, money, documents and timeline; withdrawing a card; a waiver and a
  payout with a second person; the written notice as a counter act; the
  settings under their grant, pinned at booking and at signing; the grants.
- `grade10-admin/grading/batches`: batches open, shipped and back; the ship
  form against the courier's written cover; re-estimating; the manifest and
  the invoice entering, receiving against the manifest and its exceptions,
  the upcharge as the sheet's difference; and the cap on declared value in
  the safe.
- `shared/ui/grading-submission`: the collector-facing block set in
  `packages/ui/src/blocks/grading-submission/` with colocated stories, none of
  which exists yet: `GradingFeeSheet`, `GradingCardList` for the editable
  planning list, `GradingCardRecord` for the read-only list after hand-in with
  intake ids and photograph pairs, `GradingPasteSheet`, `GradingLevelPicker`,
  `GradingReview`, `GradingStatusRail`, `GradingOwnershipChip`,
  `GradingPickupCard`, `GradingNamedCollector`, `GradingGradeCards`,
  `GradingMoneyBlock` and `GradingUncollectedLadder`, every one fed by props
  alone. The drop-off reuses the package's `appointment-booking` exports,
  `BookingLocationPicker`, `BookingSlotPicker`, `BookingDetailsForm`,
  `BookingConfirmation` and `BookingManageCard`, unchanged; grading adds the
  batch line and its own wizard rail, since `BookingSteps` is pinned to the
  diary's five. The capability's own page is the designer's, written with
  `ui-design.md`.

### Modified Capabilities

- `grade10-site/vault/retention-and-erasure`: the retention table gains the
  grading classes, the submission agreement, the intake and hand-back receipts
  and the intake and hand-back photographs in the vault's agreements and
  photos classes, and the submission record, name, email, phone, postal
  address, the list, the code and the messages, as a class of its own, all at
  the vault's windows and each measured from the submission's end event; no
  identity class; and the in-flight refusal reaches a live submission, one
  between booked and ready, an unsettled upcharge or ready cards uncollected,
  so one review and one erasure path serve both products.

`grade10-site/appointment/booking` is not modified: the collector's booking
surface lists customer-bookable services only and already names the Grading
visit the walk-in books; the product-bound drop-off is a service bound to
`grading`, data the diary already takes, and a shared visit is one booking the
first submission owns (`decisions.md` Q18, Q19).

## Impact

- **Packages** — `packages/grading/{contracts,backend,frontend,admin-frontend}`
  laid out as the vault's are; `packages/ui` gains the `grading-submission`
  block set and its stories; `packages/i18n` gains a `grading` namespace in
  every shared catalog and head entries for the collector's surfaces.
  The blocks take their formatted lines as functions and fill no
  placeholder themselves: each app fills its words through its own
  catalog, so the collector's page and the console's WhatsApp templates
  hold to the same "never a literal placeholder" rule with one filler
  apiece.
- **Worker** — `apps/backend/grade10/grading`, its own Neon database, one
  writer of the status, sweeps for the plan's clocks, the missed visit, the
  uncollected ladder and the grader's morning read, and a `grading_settings`
  table seeded from the defaults and read by every value the pages run on,
  the fee sheet and the diary services as their own records, each value
  pinned to a submission at booking and at signing.
- **The card price reference** — `grade10-admin/inventory/card-price-reference`
  is the catalogue the paste match and the reference sales ride, over its own
  entrypoint; the PriceCharting token stays server-only and that capability's
  (`decisions.md` Q45, Q46).
- **The diary** — three catalogue entries in `packages/appointment`: the
  product-bound Grading drop-off, its Bulk variant, and the customer-bookable
  Grading visit; booked over the per-product entrypoint, the visit's outcome
  read back over the binding, no new diary logic. The scheduling vocabulary's
  product set gains `grading`, one word in `add-multi-store-appointments`'s
  own delta (`decisions.md` Q19).
- **Doc-sign** — the vault's ceremony instantiated into the grading database;
  the host contract gains a packet option that requires no identity record,
  decided per template, never a null reference; the collector's sign page
  reaches the grading ceremony at its own base address.
- **The console** — a Grading section in the grade10 admin panel: the queue,
  the batches, one submission, the notice, the settings; three grants named
  as the vault's are, `grading:approve` also opening the settings; every write
  elevated and filed under its submission on the audit chain, a settings
  write under its own subject.
- **The POS** — one Grading Service line per card at the level's fee and a
  cover line per card where the level carries one, an upcharge, a storage fee
  and a refund each a line against the submission, written back by line; a
  payout on its own record; no online payment.
- **Loyalty** — grading's lines are meant to ride the programme's non-earning
  list as the Grading Service fee already does (`decisions.md` Q47).
- **Emails** — one message per event in the grading shell in `apps/emails`,
  the page's table being the map, on the vault's retry ladder.
- **The vault** — the retention table gains the grading classes and the
  in-flight rule; vaulting a slab at the counter opens an ordinary vault case
  on the collector's phone.
- **Carried surfaces** — `grade10.com/grading`, `/grading/submissions/<id>`,
  `/grading/sign` and `admin.grade10.com/grading` are carried in development
  and staging as the vault's pages are, on no lane the public reaches.
- **No domain suite exists** for `grade10-site/grading` or
  `grade10-admin/grading`; both domains are new, so this change carries none.

## Follow-on changes

- Disposal of cards nobody collects after the notice's 30 days, under clause
  6: its terminal status, the act, the grant and the held-proceeds record, as
  `dispose-uncollected-cards`.
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

Every clock, figure and wording the canvas adopted is a decided row in
`decisions.md`, taken as recommended at landing; the owner named confirms the
value on the page its ❓ sits on, and the decided row holds until then.

- **Operations** — the clocks (`Q23`, `Q33`); the payout window of 14 days from
  the day the batch is received, at the till or by bank transfer (`Q24`); the
  ID glance threshold of HKD 10,000 with no staff override (`Q12`, `Q11`);
  cards a submission as the fee sheet's fewest and most columns (`Q28`); the
  manifest and the invoice entered before the first scan, an unmatched line
  holding finishing (`Q50`); the batch closed Thursday 19:00 and shipped the
  next day (`Q17`). Still Operations' on
  [Grading Console · Receiving](../../../docs/prds/products/grade10-admin/grading/console.md#receiving):
  whether the manifest enters as a file or typed (`Q50`), and whether a batch
  above the courier's written cover is split or held (`Q29`).
- **Commercial** — the fee sheet, one setting per grader and level to the
  grader's top tier, with cover as its own line at 1.5% of the declared value
  per card at Express and Super Express (`Q27`); the fee's fate per outcome
  (`Q5`); the upcharge fronted with no cap and no pre-authorisation (`Q6`);
  the storage fee of HKD 30 a card a month from day 90, a part month counting
  whole (`Q25`); the safe's cap of HKD 300,000 declared until cover is bought
  (`Q29`); no loyalty points on any grading line (`Q47`). The sheet's real
  figures replace the examples on
  [Planning a Submission · Fee Sheet](../../../docs/prds/products/grade10-site/grading/planning.md#fee-sheet).
- **Legal** — the custodian is the brand's one registered legal name, the
  vault's (`Q52`); the complaints contact, clause 4, clause 5, clause 6 and
  the hand-back receipt's first clause for a named person print as drafted
  until Legal confirms them, and in production the seal refuses while a fact
  it prints is unset (`Q48`); the notice by registered post and email, its
  period a setting pinned at signing and seeded at 90 days (`Q26`); the
  grading classes at the vault's retention windows (`Q20`, `Q68`). Legal's
  confirmations are ❓ on
  [Documents and Signing](../../../docs/prds/products/grade10-site/grading/documents.md).
- **Product** — the three diary services, their durations and the diary's
  own horizon (`Q30`); a `planned` submission off the queue (`Q36`); a
  reference outage keeping every line as typed (`Q46`); slabs shipped back
  as a second release (`Q7`).
- **Engineering** — `grading` joins the scheduling vocabulary in
  `add-multi-store-appointments`' own delta (`Q19`).

## References

- [Grading · Where It Is Open](../../../docs/prds/products/grade10-site/grading/index.md#where-it-is-open)
- [Grading · Users](../../../docs/prds/products/grade10-site/grading/index.md#users)
- [Grading · Before the First Submission](../../../docs/prds/products/grade10-site/grading/index.md#before-the-first-submission)
- [Planning a Submission · Fee Sheet](../../../docs/prds/products/grade10-site/grading/planning.md#fee-sheet)
- [Planning a Submission · Caps and Clocks](../../../docs/prds/products/grade10-site/grading/planning.md#caps-and-clocks)
- [Planning a Submission · The Wizard](../../../docs/prds/products/grade10-site/grading/planning.md#the-wizard)
- [The Drop-off · Rules](../../../docs/prds/products/grade10-site/grading/drop-off.md#rules)
- [The Drop-off · Booking](../../../docs/prds/products/grade10-site/grading/drop-off.md#booking)
- [The Drop-off · Before You Come](../../../docs/prds/products/grade10-site/grading/drop-off.md#before-you-come)
- [The Submission · Statuses](../../../docs/prds/products/grade10-site/grading/submission.md#statuses)
- [The Submission · A Card's Outcome](../../../docs/prds/products/grade10-site/grading/submission.md#a-card-s-outcome)
- [The Submission · Exceptions](../../../docs/prds/products/grade10-site/grading/submission.md#exceptions)
- [The Submission · The Fee by Outcome](../../../docs/prds/products/grade10-site/grading/submission.md#the-fee-by-outcome)
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
- [Grading Console · Written Notice](../../../docs/prds/products/grade10-admin/grading/console.md#written-notice)
- [Grading Console · Settings](../../../docs/prds/products/grade10-admin/grading/console.md#settings)
- [Grading Console · Grants](../../../docs/prds/products/grade10-admin/grading/console.md#grants)
- [Grading operations](../../../docs/prds/products/grade10-admin/grading/index.md)
- [Grading Blocks · The Blocks](../../../docs/prds/products/shared/ui/grading-submission.md#the-blocks)
- [Compliance and Readiness · Retention and erasure](../../../docs/prds/products/grade10-site/vault/compliance-and-readiness.md#retention-and-erasure)
