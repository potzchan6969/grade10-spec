# grade10-admin/grading/batches Specification

## Purpose

The batch the cards leave in and come back in: one grader and one level,
closed on the shop's cut-off, shipped under the courier's written cover,
tracked by the grader's own stages, and received against its manifest.

A batch is what the grader invoices and ships back, so it is what the shop
tracks rather than a parcel per submission. What each card's outcome then
means to the collector is `grade10-site/grading/submission-lifecycle`.

## Feature set

- The batch and its cut-off
  - One grader, one level: a card that fits neither waits for the next batch
  - Its word is read, never set: open, closed, shipped, back and received come
    from the batch's own stamps
  - The cut-off and the ship day: the batch closes on the shop's clock and
    leaves the next day
  - The tiles: what ships today, what is with graders, what is back unchecked,
    and what the safe holds
- Shipping the batch
  - What leaves with it: the packing list of intake ids, the grader's order
    number, and the courier and its tracking
  - Insured to the declared total: read against the courier's written cover
    figure before it goes
  - A ship date that is not ahead of today
  - One act, every submission: marking it shipped moves every submission in it
    and tells every collector
- The grader's stages
  - Read most mornings: a person reads the grader's order status and records
    the stage in its own words
  - The estimate is a date, not a status: running late is read from the clock
    by the page and the queue the same way
  - A re-estimate takes a reason: and every collector in the batch is told the
    day it is set
- Receiving against the manifest
  - The manifest and the invoice first: no slab is scanned before they are in
  - A line that matches nothing: held as unmatched until staff resolve it, and
    finishing waits
  - A cert belongs to one submission: a scan matching a cert held elsewhere is
    refused by name, so a slab can never be handed to the wrong collector
  - The counters: scanned, matched, ungraded, and the upcharges with their sum
  - Half done, kept: a batch saved part-scanned keeps its scans
  - Finished at once: every submission in the batch becomes ready together,
    each collector told what is due
- What did not come back
  - Held by the grader: recorded with the date it is expected, the rest of the
    cards going on
  - Not returned: recorded on the card, with the payout it owes
  - Damaged: photographed in the box before it leaves it
  - Told the same day: the collector hears either outcome on the day it is
    recorded
- The upcharge at receiving
  - The sheet's difference: the figure the collector was quoted, and never the
    invoice's own
  - The invoice reconciled against it: a gap is the shop's to settle with the
    grader
- The safe's cap
  - Declared value in the safe: counted with the ready slabs still held
  - Refused past the cap: a hand-in that would carry it over is turned into
    the next drop-off
  - An operational cap: it stands because cover does not yet
