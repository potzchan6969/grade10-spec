# grade10-admin/grading/counter Specification

## Purpose

The Grading section of the admin console: a queue of submissions cut by what
each one waits for, the runbooks the counter works a hand-in and a hand-back
through, one submission's own tabs, the settings every page runs on, and the
grants behind every act.

The queue is the shop's inbox — nothing is emailed to staff — so what a
submission is waiting for has to be readable off the row. The batches the
cards leave and come back in are `grade10-admin/grading/batches`; the machine
the buttons follow is `grade10-site/grading/submission-lifecycle`.

## Feature set

- The queue
  - Cut by what waits: every status belongs to exactly one view, and the rest
    are queries
  - Today, cut where the rows are: the shop's own day decides it, with the
    day's drop-offs in a strip above
  - Rows that explain themselves: a badge names why a submission is waiting on
    somebody, derived at the read and never stored
  - Tiles over the counter: what is closing, what is with graders, what is
    ready and uncollected, and what is still to settle
- Hand-in at the counter
  - Find it or write it: the day's booking opens its submission, and a
    walk-in's list is written at the desk with the collector
  - Card by card with the collector: present, a condition note, the declared
    value against its reference, and two photographs that reach the
    collector's page
  - The level must fit: a card above the level's ceiling moves to a second
    submission or is refused
  - Sign, then take the fee: the till opens only on the sealed agreement, one
    line per card and a cover line where the level carries one
  - No hand-in without a paid line: the submission stays booked, the seal
    stands, and the cards go home with the collector
  - The safe's cap refuses at the desk: a hand-in that would carry the safe
    past its cap books the next drop-off instead
  - Labels and check in: one label per card, the cards sealed in with the
    printed list, and the intake receipt out
- Refusing a card
  - Three reasons: the grader would not take it, it is declared above the
    level, or the collector withdrew it
  - In the collector's words: the line staff type reaches the submission page
    and the receipt exactly as typed
  - Never charged: the fee drops with the card, and a line already paid comes
    back at the till
- Hand-back at the counter
  - Who is collecting: the pickup code and the name, read against the person
    the collector named
  - The ID glance above the threshold: matched to the name, with nothing kept
  - Nobody else, no override: anyone who is neither is turned away, code or no
    code
  - Settle first: the upcharge and the storage accrued are taken at the till
    before anything is handed over
  - Handed over and inspected: each item ticked with the collector, each slab
    photographed
  - Closed on the sealed receipt: a card the grader held leaves the submission
    ready for a second hand-back
  - Vault instead: a slab can go into a vault case from the same step once the
    balance is settled
- Handing a document over
  - Mintable only when the counter is ready: the agreement once every card is
    checked, the receipt once nothing is due and every item is ticked
  - One document, one short link: shown on the iPad or copied
  - Send it again: any sealed document, and the grades message, can be sent to
    the collector again
- One submission
  - Tabs by job: the cards, the money, the documents, the timeline
  - The header answers the phone: the summary, what is due, what came back
    ungraded, and the batch it is in
  - Reaching the collector: their email and phone, with click-to-chat
    templates staff press
  - Withdrawing a card: offered until the batch closes, refunding its line and
    releasing the card against a receipt
  - The timeline: every event with the figures it carried and the grader's
    stages in its words, staff-only entries kept from the collector
- Two people for money
  - A waiver, a payout, a money setting: each takes a reason and a second
    approve holder who is not the recorder
  - Waived only once the cards are back: there is nothing to write off before
  - Its own record: a payout carries its route and its reversal rather than
    editing what the till took
- The written notice
  - Asked for from the queue: the submission on the notice rung asks staff for
    it rather than a sweep sending it
  - Posted and recorded: the address from the agreement, the posting date and
    the tracking, with the email the same day
  - The clock runs from the posting: and nothing further is offered after it
- The settings
  - Every default is a setting: the clocks, the caps, the thresholds, the fee
    sheet and the diary services, read and never compiled in
  - Pinned to a submission: at booking for the sheet, at signing for every
    figure the agreement prints
  - Reaching only what is not booked: a change never moves a submission
    already priced or signed
  - Filed under its own subject: a settings write is audited as a setting, not
    as a submission
- The grants
  - Three grants: read, operate, and approve, which also opens the settings
  - A verified session: as the vault's, in production and staging
  - Filed under its submission: every act is on the audit chain
  - Staff hear nothing: the badges, the tiles and the day's strip are the
    signal
- Acts by grant and status
  - Shown only where they can run: an act absent is better than an act refused
  - Cancel never once the cards have left
  - The worker refuses independently: a submission that moved under the
    operator is refused by name rather than written over
