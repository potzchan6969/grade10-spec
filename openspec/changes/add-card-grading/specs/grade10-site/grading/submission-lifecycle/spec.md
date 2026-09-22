# grade10-site/grading/submission-lifecycle Specification

## Purpose

The submission machine as the collector reads it: ten statuses, the outcome
each card carries beside them, the money each outcome moves, and how the cards
are collected, vaulted or left at the shop.

One submission is one collector's cards to one grader at one level, and every
exception is a fact on one card rather than a status of its own. What staff
write on each move is `grade10-admin/grading/counter`; what the collector is
emailed is `grade10-site/grading/collector-notifications`.

## Feature set

- The statuses
  - One status column: a submission holds exactly one status, and the word the
    collector reads is the only name for it
  - Whose move it is: a chip beside the word, so waiting on the grader never
    reads as waiting on the shop
  - The rail: seven stages from Planned to Home, an ended submission staying
    where it ended
  - What is not a status: a refusal, a withdrawal, an upcharge, a held card
    and running late are all answers to questions, not states
- With the grader
  - The grader's own words: each stage it publishes reaches the page unchanged
  - The estimate: counted from the day the batch left, and read against the
    clock rather than written down
  - Running late: past the estimate the page says so, and a new date is told
    the day it is set
  - Nothing to do: the status offers the collector no act while the cards are
    away
- A card's outcome
  - One outcome per card: from listed to collected, with the grade in the
    grader's own words
  - Told in the collector's words: each exception is a line on the card with
    the money it changes
  - The rest carry on: one card refused, withdrawn, ungraded, held or lost
    never holds the others
  - Withdrawn before the batch closes: the card is pulled from the intake bag
    and collected at the counter against a receipt
- The fee by outcome
  - One rule per outcome: what the fee does on a refused, withdrawn, ungraded,
    moved-up, held, lost or damaged card
  - The upcharge is the sheet's difference: the figure quoted before booking,
    due at the counter before collection
  - Back the way it was paid: every refund is a line at the till, and the page
    says what came back and why
- Ready to collect
  - The pickup code: four digits on the page and in the email, with the shop's
    hours and no booking needed
  - What is due: the upcharge and the storage accrued, settled at the counter
    before anything is handed back
  - The ID glance: above the threshold an ID is matched to the name and
    nothing is kept; it is not an identity check
  - Nobody else: a person who is neither the collector nor the one they named
    is turned away, code or no code
  - Naming a collector: one person at a time by their full name, named,
    changed or removed on the page before anyone comes in
  - Vault it instead: a slab goes into a vault case at the same counter, where
    the identity check and the custody agreement belong
- The uncollected ladder
  - Reminders first: two, costing nothing
  - Then storage: per card still held and per month started, due before
    collection and derived when read
  - Then the written notice: posted and emailed, with the days counted from
    its posting date
  - The cards stay the collector's: the ladder stops at the notice, and a slab
    kept on purpose moves into a vault case
- The payout
  - A card that did not come back: paid out at its declared value with its fee
    refunded, inside the payout window
  - Two routes: the till or a bank transfer
  - The claim is the shop's: the collector waits on nobody
  - Reversed if it turns up: on the same record, with the card back on the
    submission
- The record after collection
  - The graded record: grade, grader and cert per slab with a look-up link,
    and the photographs taken at hand-back
  - The documents stay: each with its fingerprint and a download
  - Never stock: a collector's slab never enters the catalogue, and a vault
    valuation or an auction reads the record from here
- Cancelled and expired
  - Cancelled before hand-in: the collector calls the submission off and the
    drop-off goes with it
  - Expired: a plan nobody booked ends on its own clock
  - Nothing paid, nothing owed: both ends leave the cards with the collector
- Acts by status
  - Only what the status allows: the page offers no act it would refuse
  - Nothing while the cards are away: from sent to back the page is a read
