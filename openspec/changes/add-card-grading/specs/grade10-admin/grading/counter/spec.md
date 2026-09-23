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
  - Three grants: read, which opens the settings read-only, operate, and
    approve, which edits them
  - A verified session: as the vault's, in production and staging
  - Filed under its submission: every act is on the audit chain
  - Staff hear nothing: the badges, the tiles and the day's strip are the
    signal
- Acts by grant and status
  - Shown only where they can run: an act absent is better than an act refused
  - Cancel never once the cards have left
  - The worker refuses independently: a submission that moved under the
    operator is refused by name rather than written over

## ADDED Requirements

### Requirement: The queue cuts submissions by what they are waiting for

The Grading section opens on a queue of submissions cut by what each one is
waiting for.

**Views** - the queue SHALL offer these, and every status but `planned` SHALL
belong to exactly one of the first six:

| View | What it lists |
| --- | --- |
| Booked | `booked` — the default view |
| Handed in | `checked_in` |
| With the grader | `sent`, `graded` |
| Back | `returned` |
| Ready | `ready` |
| Closed | `collected`, `cancelled`, `expired` |
| Today | every submission that has not ended whose drop-off falls on the shop's own calendar day |

**Drafts** - a `planned` submission SHALL appear in no view until it is booked.

**The day** - the Today cut SHALL be made where the rows are read, on the
brand's own zone `Asia/Hong_Kong`, so that the view and the badge beside it
cannot disagree across a midnight.

**The strip** - above the rows the queue SHALL show the day's drop-offs in slot
order, each naming the time, the collector, the submission, the cards and the
grader and level, with one line saying that pickups walk in.

**Paging** - the queue SHALL page newest-touched first on a cursor over what
the page stopped reading, never on an offset, and SHALL answer 50 rows by
default. Each answer SHALL carry the number of rows behind the cut and whether
more remain, read rather than inferred from the page being full.

**Nothing to show** - a view with no row SHALL say so and SHALL still offer
every cut.

#### Scenario: grade10-admin-grading-counter-SC-01 - Today is the shop's day
**Serves:** grade10-admin-grading-counter-US-01 - the operator opens the shop and reads what is waiting

- **GIVEN** a drop-off booked for later today at the shop, read early in the morning there while the date in Coordinated Universal Time is still yesterday's
- **WHEN** the Today view is read
- **THEN** the drop-off's submission is in it

#### Scenario: grade10-admin-grading-counter-SC-02 - Every status has exactly one home
**Serves:** grade10-admin-grading-counter-US-01 - the operator opens the shop and reads what is waiting

- **WHEN** the six status views are read together
- **THEN** every status but `planned` appears in exactly one of them

#### Scenario: grade10-admin-grading-counter-SC-03 - A plan nobody booked stays off the queue
**Serves:** grade10-admin-grading-counter-US-01 - the operator opens the shop and reads what is waiting

- **GIVEN** a submission that is `planned` with no drop-off booked
- **WHEN** every view is read
- **THEN** it is in none of them

#### Scenario: grade10-admin-grading-counter-SC-04 - A page resumes where the last one stopped
**Serves:** grade10-admin-grading-counter-US-01 - the operator opens the shop and reads what is waiting

- **GIVEN** a view holding 120 submissions
- **WHEN** two pages are read in turn
- **THEN** the second begins after the last row of the first, with no row seen twice and none skipped
- **AND** each answer says how many rows stand behind the cut and whether more remain

#### Scenario: grade10-admin-grading-counter-SC-05 - A view with nothing in it says so
**Serves:** grade10-admin-grading-counter-US-01 - the operator opens the shop and reads what is waiting

- **GIVEN** a view whose cut matches no submission
- **WHEN** it is read
- **THEN** it says there is nothing in it, and every other cut is still offered

#### Scenario: grade10-admin-grading-counter-SC-85 - The day's strip carries the drop-offs in slot order
**Serves:** grade10-admin-grading-counter-US-01 - the operator opens the shop and reads what is waiting

- **GIVEN** two drop-offs booked for today, one earlier than the other
- **WHEN** the queue is read
- **THEN** the strip above the rows carries both in slot order, each naming the time, the collector, the submission, the cards and the grader and level
- **AND** one line says that pickups walk in

### Requirement: A row says why its submission is waiting on somebody

A row carries enough to work the counter from without opening the submission.

**The row** - each row SHALL carry the submission id, the collector, the number
of cards, the grader and level, the status word the collector reads, the visit,
when it was last touched, and every reason the submission is waiting on
somebody.

**Badges** - a row SHALL badge each of these that holds:

| Badge | Raised when |
| --- | --- |
| Visit today | the submission's drop-off falls on the shop's own day |
| Batch closes today | the submission is handed in and its batch's cut-off falls on the shop's own day |
| Due back | the batch's estimated day back has come |
| Running late | the batch is past its estimated day back |
| Upcharge to settle | a card moved up a level and the difference is unpaid |
| Ungraded card | a card came back with no grade |
| Unchecked return | the batch has been back for a day and has not been received |
| Uncollected 30 d | the cards have been ready for 30 days and nobody has collected them |
| Storage fee from day 90 | the cards have been ready for 90 days, so the storage fee accrues |
| Notice due | the cards have been ready for 180 days, so the written notice is owed |
| Payout past its window | a payout is owed and unmade 14 days after the day its batch was received at the shop |
| Message not sent | a letter to the collector ran out of attempts |

**Derivation** - the badges SHALL be derived at the read from the submission's
own dates, never stored, and the console and the worker SHALL derive them the
same way. Every day count above SHALL be read from its setting rather than
compiled in.

#### Scenario: grade10-admin-grading-counter-SC-06 - A drop-off today badges the row
**Serves:** grade10-admin-grading-counter-US-01 - the operator opens the shop and reads what is waiting

- **GIVEN** a booked submission whose drop-off falls on the shop's own day
- **WHEN** the queue is read
- **THEN** its row badges the visit today

#### Scenario: grade10-admin-grading-counter-SC-07 - Cards ready a month badge as uncollected
**Serves:** grade10-admin-grading-counter-US-12 - the operator works the Ready view and sees who has left their cards

- **GIVEN** a submission ready for 30 days that nobody has collected
- **WHEN** the queue is read
- **THEN** its row badges it uncollected for 30 days

#### Scenario: grade10-admin-grading-counter-SC-08 - Cards ready six months ask for the notice
**Serves:** grade10-admin-grading-counter-US-12 - the operator works the Ready view and sees who has left their cards

- **GIVEN** a submission ready for 180 days that nobody has collected
- **WHEN** the Ready view is read
- **THEN** its row badges the notice as due

#### Scenario: grade10-admin-grading-counter-SC-09 - A payout nobody made in its window badges itself
**Serves:** grade10-admin-grading-counter-US-09 - the approver sees a payout still owed on a card that did not come back

- **GIVEN** a payout owed on a card whose batch was received at the shop 15 days ago, with nothing paid out
- **WHEN** the queue is read
- **THEN** its row badges the payout as past its window

#### Scenario: grade10-admin-grading-counter-SC-10 - A badge is worked out, never written down
**Serves:** The queue - every surface that shows a row works the reasons out afresh from the submission's own dates

- **GIVEN** a submission ready for 29 days
- **WHEN** the queue is read the next day with nothing else changed
- **THEN** its row badges it uncollected for 30 days, without any write having happened in between

#### Scenario: grade10-admin-grading-counter-SC-11 - A letter that never went shows on its row
**Serves:** grade10-site/grading/collector-notifications#grade10-site-grading-collector-notifications-US-03 - the operator picks up a message the collector never got

- **GIVEN** a letter to the collector that ran out of attempts
- **WHEN** the queue is read
- **THEN** the submission's row badges the message as not sent

#### Scenario: grade10-admin-grading-counter-SC-86 - A row is worked from without opening the submission
**Serves:** grade10-admin-grading-counter-US-01 - the operator opens the shop and reads what is waiting

- **WHEN** the queue is read
- **THEN** each row carries the submission id, the collector, the number of cards, the grader and level, the status word the collector reads, the visit, when it was last touched, and every reason the submission is waiting on somebody

### Requirement: Four tiles stand over the counter

The tiles are the counter's own figures, derived at the read like the badges.

The queue SHALL carry these four:

| Tile | What it counts |
| --- | --- |
| Batch closing | the grader and level closing next, its cards, its submissions, how many more may still join today, and the day it ships |
| With graders | the submissions with a grader, and how many are past their estimate |
| Ready, uncollected | the submissions ready and uncollected, and how many have been ready more than 30 days |
| To settle | the sum of the unpaid upcharges in HKD minor units, and how many submissions owe one |

#### Scenario: grade10-admin-grading-counter-SC-12 - The ready tile counts what is still in the safe
**Serves:** grade10-admin-grading-counter-US-12 - the operator works the Ready view and sees who has left their cards

- **GIVEN** four submissions ready and uncollected, one of them ready for 45 days
- **WHEN** the queue is read
- **THEN** the ready tile counts four, of which one is past 30 days

#### Scenario: grade10-admin-grading-counter-SC-13 - The settle tile sums what is owed
**Serves:** grade10-admin-grading-counter-US-10 - the operator answers a collector about what is still owed

- **GIVEN** two submissions with unpaid upcharges of 20000 and 35000 HKD minor units
- **WHEN** the queue is read
- **THEN** the settle tile reads 55000 HKD minor units over two submissions

#### Scenario: grade10-admin-grading-counter-SC-87 - The closing and with-graders tiles read the batches
**Serves:** grade10-admin-grading-counter-US-01 - the operator opens the shop and reads what is waiting

- **GIVEN** a batch closing next at one grader and level, and three submissions with a grader of which one is past its estimate
- **WHEN** the queue is read
- **THEN** the batch closing tile names that grader and level, its cards, its submissions, how many more may still join today, and the day it ships
- **AND** the with-graders tile counts three, of which one is past its estimate

### Requirement: Hand-in at the counter runs as one flow

The hand-in runbook SHALL run these steps in order, and no step SHALL be
offered before the one above it is done:

1. **Find it or write it** — the day's booking opens its submission and the
   visit is started at the desk; where nobody booked, the counter opens a
   submission at the desk and writes the list card by card with the collector,
   one card at a time.
2. **Check each card with the collector** — Present, a condition note, the
   declared value against the card's reference, and two photographs, front and
   back, that reach the collector's submission page. A card not on the list is
   added with the collector.
3. **Check the level fits** — a card whose declared value is above the pinned
   level's ceiling SHALL NOT be checked in at that level; it moves to a second
   submission at a higher level, or it is refused.
4. **Sign the agreement** — the submission agreement is shown on the iPad, and
   the till SHALL NOT open until it is sealed.
5. **Take the fee at the till** — one Grading Service line per card owing a fee
   at the pinned level's fee, and one cover line per card where the pinned
   level carries cover; the paid order is written back to the submission one
   line to one card, and running the till again SHALL write nothing further and
   answer the lines already recorded.
6. **Label, seal and check in** — one intake label per card, the cards sealed
   into the intake bag with the printed list, the submission moved to
   `checked_in`, and the intake receipt issued with the sealed agreement.

**Where two submissions share one drop-off**, each SHALL run its own hand-in,
and the other SHALL be named under the visit.

**One paid order, one submission** - the first submission to record a paid
order SHALL claim it; another submission presenting the same order, at any
level, SHALL be refused by name with nothing written, and recording the order
again on the submission that claimed it SHALL answer that submission's own
lines.

#### Scenario: grade10-admin-grading-counter-SC-14 - The day's booking opens its submission
**Serves:** grade10-admin-grading-counter-US-02 - the operator takes a booked list in at the desk

- **GIVEN** a drop-off booked for today
- **WHEN** the operator opens it from the day's strip and starts the visit at the desk
- **THEN** its submission's hand-in runbook opens at the card check

#### Scenario: grade10-admin-grading-counter-SC-15 - A walk-in's list is written at the desk
**Serves:** grade10-admin-grading-counter-US-02 - the operator takes a list in at the desk from somebody who booked nothing

- **GIVEN** a collector at the desk with cards and no submission
- **WHEN** the operator opens a submission at the desk and adds the cards one at a time with them
- **THEN** the submission is handed in from the same runbook, with the fee sheet pinned to it at the hand-in

#### Scenario: grade10-admin-grading-counter-SC-16 - A card is checked with its two photographs
**Serves:** grade10-admin-grading-counter-US-02 - the operator takes a booked list in at the desk

- **WHEN** the operator marks a card present with a condition note and takes its front and back photographs
- **THEN** the card reads as checked with the note as typed
- **AND** both photographs show on the collector's submission page

#### Scenario: grade10-admin-grading-counter-SC-17 - A card above the level's ceiling cannot be checked in at that level
**Serves:** grade10-admin-grading-counter-US-03 - the operator finds one card the chosen level will not carry

- **GIVEN** a submission at a level whose pinned ceiling is 5000000 HKD minor units
- **WHEN** the operator checks a card declared at 8000000 HKD minor units
- **THEN** the card is refused at that level by name, and is offered a second submission at a higher level or a refusal

#### Scenario: grade10-admin-grading-counter-SC-18 - The till opens only on the sealed agreement
**Serves:** grade10-admin-grading-counter-US-02 - the operator takes a booked list in at the desk

- **GIVEN** every card checked and the agreement not yet sealed
- **WHEN** the operator looks for the fee step
- **THEN** taking the fee is not offered, and the reason is on the step

#### Scenario: grade10-admin-grading-counter-SC-19 - One paid line to one card, and a cover line where the level carries one
**Serves:** grade10-admin-grading-counter-US-02 - the operator takes a booked list in at the desk

- **GIVEN** a sealed agreement over four cards at a pinned fee of 15000 HKD minor units each, at a level carrying cover
- **WHEN** the operator records the paid order
- **THEN** four fee lines of 15000 HKD minor units are written back, one to each card in list order, with a cover line beside each
- **AND** recording the same order again writes nothing and answers those lines

#### Scenario: grade10-admin-grading-counter-SC-20 - Labels, the sealed bag and the intake receipt
**Serves:** grade10-admin-grading-counter-US-02 - the operator takes a booked list in at the desk

- **GIVEN** a sealed agreement and a paid line on every card owing a fee
- **WHEN** the operator checks the cards in
- **THEN** each card is given its own intake label and intake id, the submission moves to `checked_in`, and the intake receipt goes out with the sealed agreement

#### Scenario: grade10-admin-grading-counter-SC-21 - A second submission on one visit runs its own hand-in
**Serves:** grade10-site/grading/dropoff-booking#grade10-site-grading-dropoff-booking-US-04 - a collector brings a second list to the drop-off the first one owns

- **GIVEN** two submissions on one drop-off
- **WHEN** the operator opens either runbook
- **THEN** it names the other under the visit, and each is checked, signed, paid and checked in on its own

#### Scenario: grade10-admin-grading-counter-SC-88 - A card declared at the level's ceiling is checked in at that level
**Serves:** grade10-admin-grading-counter-US-02 - the operator takes a booked list in at the desk

- **GIVEN** a submission at a level whose pinned ceiling is 390000 HKD minor units
- **WHEN** the operator checks a card declared at 390000 HKD minor units
- **THEN** the card is checked in at that level, the ceiling being the highest declared value the level carries

#### Scenario: grade10-admin-grading-counter-SC-101 - An order recorded on another submission is refused
**Serves:** grade10-admin-grading-counter-US-02 - the operator takes a booked list in at the desk

- **GIVEN** two sealed submissions, one at Express and one at Regular, and one paid order carrying the fee lines of both levels
- **WHEN** the operator records the order on the Express submission, then on the Regular one
- **THEN** the Express submission claims the order, and the Regular one is refused by name with nothing written on it
- **AND** the refusal names the Express submission as the one holding the order
- **AND** recording the order again on the Express submission writes nothing and answers its own lines

### Requirement: A hand-in is refused whole rather than done in part

A hand-in that cannot be completed leaves the cards with the collector and
nothing half written.

**An unsealed agreement** - a hand-in SHALL be refused by name while the
submission agreement is not sealed.

**No paid line** - a hand-in SHALL be refused by name while any card owing a
fee has no paid line. The submission stays `booked`, the sealed agreement
stands, and the cards go home with the collector; the till is run again, or
another drop-off is booked.

**The safe's cap** - a hand-in that would carry the declared value held in the
safe past `grading.safe_declared_cap` SHALL be refused by name at the desk, and
the counter SHALL offer the next drop-off instead. The value held counts the
declared value of every card in a `checked_in`, `returned` or `ready`
submission whose outcome has not taken it out of the safe, ready slabs
included.

#### Scenario: grade10-admin-grading-counter-SC-22 - An unsealed agreement refuses the hand-in
**Serves:** grade10-admin-grading-counter-US-02 - the operator takes a booked list in at the desk

- **GIVEN** every card checked and no sealed agreement
- **WHEN** the operator checks the cards in
- **THEN** it is refused by name and the submission stays `booked`

#### Scenario: grade10-admin-grading-counter-SC-23 - No paid line, no hand-in
**Serves:** grade10-admin-grading-counter-US-02 - the operator takes a booked list in at the desk

- **GIVEN** a sealed agreement and a till run that failed, so no fee line was written
- **WHEN** the operator checks the cards in
- **THEN** it is refused by name, the submission stays `booked` with its seal standing, and the counter offers running the till again or booking another drop-off

#### Scenario: grade10-admin-grading-counter-SC-24 - A hand-in past the safe's cap is refused at the desk
**Serves:** grade10-admin/grading/batches#grade10-admin-grading-batches-US-05 - the operator keeps the declared value in the safe under its cap

- **GIVEN** a cap of 30000000 HKD minor units, 28000000 HKD minor units already held, and a submission declaring 3000000 HKD minor units
- **WHEN** the operator checks the cards in
- **THEN** it is refused by name and the counter offers the next drop-off

### Requirement: A refused card carries its reason in the collector's words and is never charged

Refusing a card takes it off the list and leaves the rest of the hand-in
running.

**Three reasons** - a refusal SHALL name exactly one of them: the grader would
not take the card, the card is declared above the level, or the collector
withdrew it.

**The words** - a refusal SHALL take a line in the collector's words, and that
line SHALL show on the submission page and on the intake receipt exactly as
typed. A refusal with no reason or no line SHALL NOT be offered.

**The money** - the fee and any cover SHALL drop with the card, and a line
already paid for it SHALL be refunded at the till against the submission.

**The rest carry on** - the other cards SHALL be checked, signed for, paid for
and handed in unchanged, and the refused card stays with the collector.

**The last card** - where the refusal leaves the submission with no card to
hand in, the counter SHALL cancel the submission from `booked` at the desk and
tell the collector there; no message SHALL be sent.

#### Scenario: grade10-admin-grading-counter-SC-25 - A card the grader would not take is refused in the collector's words
**Serves:** grade10-admin-grading-counter-US-03 - the operator refuses one card at the desk and the rest go on

- **WHEN** the operator refuses a card for the grader not taking it, typing the line the collector will read
- **THEN** the card leaves the list with that line on the submission page and on the intake receipt, word for word

#### Scenario: grade10-admin-grading-counter-SC-26 - A refusal needs a reason and the words
**Serves:** grade10-admin-grading-counter-US-03 - the operator refuses one card at the desk and the rest go on

- **GIVEN** the refusal opened with no reason picked and no line typed
- **WHEN** the operator looks for the refuse action
- **THEN** it is not offered until both are given

#### Scenario: grade10-admin-grading-counter-SC-27 - A line already paid comes back at the till
**Serves:** grade10-admin-grading-counter-US-03 - the operator refuses one card at the desk and the rest go on

- **GIVEN** a card whose fee line of 15000 HKD minor units has been paid
- **WHEN** the operator refuses that card
- **THEN** a refund of 15000 HKD minor units is taken at the till against the submission, naming the card and the line it refunds

#### Scenario: grade10-admin-grading-counter-SC-28 - One refusal never holds the others
**Serves:** grade10-admin-grading-counter-US-03 - the operator refuses one card at the desk and the rest go on

- **GIVEN** a list of four cards, one refused
- **WHEN** the hand-in runs on
- **THEN** three cards are labelled, sealed in and checked in, and the fee stands for those three alone

#### Scenario: grade10-admin-grading-counter-SC-89 - Refusing the last card cancels the submission at the desk
**Serves:** grade10-admin-grading-counter-US-03 - the operator refuses one card at the desk and the rest go on

- **GIVEN** a `booked` submission whose only card that is not already refused is being refused
- **WHEN** the operator refuses it with a reason and the collector's words
- **THEN** the counter says there is nothing left to hand in and cancels the submission from `booked`
- **AND** the collector is told at the desk, and no message is sent

### Requirement: Hand-back at the counter runs as one flow

The hand-back runbook SHALL run these steps in order, and the submission SHALL
close only on the sealed receipt:

1. **Who is collecting** — the pickup code and the name, read against the
   collector and the person they named on the submission page.
2. **The ID glance** — where the submission's declared total is at or above
   `grading.id_glance_threshold`, an identity document SHALL be matched to that
   name and nothing about it SHALL be kept; the receipt records only that an ID
   was matched. Below the threshold no document SHALL be asked for.
3. **Settle** — the upcharge and the storage accrued SHALL be taken at the till
   before anything is handed over; where nothing is due, the step ticks with
   nothing taken.
4. **Hand over and inspect** — each item is ticked as it is handed over and
   inspected with the collector, and each slab is photographed for the
   collector's page. A card the grader is still holding SHALL NOT be tickable.
5. **Sign the receipt** — the hand-back receipt is shown on the iPad and
   sealed.
6. **Close** — the submission moves to `collected` on the sealed receipt, and
   the record stays on the page.

**A card the grader held** - a submission whose card is still held SHALL stay
`ready` after the first hand-back, its receipt naming the card still out, and a
second hand-back SHALL close it when that card comes back. That second
hand-back SHALL run step 1 again, and step 2 where the threshold asks for it,
as every hand-back does.

#### Scenario: grade10-admin-grading-counter-SC-29 - The code and the name open the hand-back
**Serves:** grade10-admin-grading-counter-US-04 - the operator hands the cards back at the desk

- **GIVEN** a submission that is `ready`
- **WHEN** the operator enters the pickup code and the name of the person at the desk, and both match the collector
- **THEN** the runbook opens at what is due

#### Scenario: grade10-admin-grading-counter-SC-30 - Above the threshold an ID is glanced at and nothing is kept
**Serves:** grade10-admin-grading-counter-US-04 - the operator hands the cards back at the desk

- **GIVEN** a threshold of 1000000 HKD minor units and a submission declaring 1500000 HKD minor units
- **WHEN** the operator works the hand-back
- **THEN** the step asks for an identity document matching the name
- **AND** the receipt records only that an ID was matched, holding no number, no image and no document kind

#### Scenario: grade10-admin-grading-counter-SC-31 - Below the threshold no document is asked for
**Serves:** grade10-admin-grading-counter-US-04 - the operator hands the cards back at the desk

- **GIVEN** a threshold of 1000000 HKD minor units and a submission declaring 600000 HKD minor units
- **WHEN** the operator works the hand-back
- **THEN** the code and the name release the cards, with no identity document asked for

#### Scenario: grade10-admin-grading-counter-SC-32 - What is due is taken before anything is handed over
**Serves:** grade10-admin-grading-counter-US-04 - the operator hands the cards back at the desk

- **GIVEN** an upcharge of 20000 HKD minor units and storage of 6000 HKD minor units accrued
- **WHEN** the operator opens the hand-over step before taking them at the till
- **THEN** nothing may be ticked, and the step names what is still due

#### Scenario: grade10-admin-grading-counter-SC-33 - Each item is ticked and each slab photographed
**Serves:** grade10-admin-grading-counter-US-04 - the operator hands the cards back at the desk

- **GIVEN** nothing due
- **WHEN** the operator ticks each item as it is handed over and inspected, photographing each slab
- **THEN** each item reads as handed over, and its photograph shows on the collector's submission page

#### Scenario: grade10-admin-grading-counter-SC-34 - A card the grader still holds is not handed over
**Serves:** grade10-admin-grading-counter-US-04 - the operator hands the cards back at the desk

- **GIVEN** a submission of three cards, one still held by the grader
- **WHEN** the hand-back is worked
- **THEN** the held card's row reads as still out and cannot be ticked, and the receipt names it

#### Scenario: grade10-admin-grading-counter-SC-35 - The submission closes on the sealed receipt
**Serves:** grade10-admin-grading-counter-US-04 - the operator hands the cards back at the desk

- **GIVEN** nothing due, every item ticked and the receipt sealed on the iPad
- **WHEN** the operator hands the packet over
- **THEN** the submission moves to `collected` and the record stays on the collector's page

#### Scenario: grade10-admin-grading-counter-SC-36 - A second hand-back closes the submission
**Serves:** grade10-admin-grading-counter-US-04 - the operator hands the cards back at the desk

- **GIVEN** a submission left `ready` after a first hand-back, with one card the grader had held now back
- **WHEN** the operator works the hand-back over that one item and seals its receipt
- **THEN** the submission moves to `collected`

#### Scenario: grade10-admin-grading-counter-SC-90 - A second hand-back reads who is collecting again
**Serves:** grade10-admin-grading-counter-US-04 - the operator hands the cards back at the desk

- **GIVEN** a submission left `ready` after a first hand-back, with the held card now back
- **WHEN** the operator opens the second hand-back
- **THEN** it opens at who is collecting, taking the pickup code and the name again, and the ID glance above the threshold, as the first hand-back did

### Requirement: Only the collector or the person they named leaves with the cards

The counter releases to two people and refuses everybody else.

**The code and the name** - both SHALL be read at the desk, and a code that
does not match the submission SHALL be refused on the field.

**The named person** - where the collector has named somebody on the submission
page, that person SHALL be released to on the same code, and the hand-back
receipt SHALL record that they collected.

**Nobody else** - a person who is neither the collector nor the person named
SHALL be turned away, with a code or without one, and the counter SHALL offer
staff no override. The counter SHALL say that the collector can name a person
from their own page.

**As often as it is typed** - a wrong code SHALL be refused every time it is
entered, no attempt count SHALL close the field, and each refusal SHALL be
recorded on the submission's timeline. Where the collector cannot produce the
code, the counter MAY read the ID glance against the collector's own name
instead.

#### Scenario: grade10-admin-grading-counter-SC-37 - A wrong code is refused on the field
**Serves:** grade10-admin-grading-counter-US-05 - the operator releases the cards to the right person or to nobody

- **WHEN** the operator enters a code that is not this submission's
- **THEN** it is refused on the field and no step below it opens

#### Scenario: grade10-admin-grading-counter-SC-38 - The named person collects, and the receipt says so
**Serves:** grade10-admin-grading-counter-US-05 - the operator releases the cards to the right person or to nobody

- **GIVEN** a submission naming a person other than the collector
- **WHEN** that person comes in with the code and the operator reads their name against the page
- **THEN** the hand-back runs, and the sealed receipt records that they collected

#### Scenario: grade10-admin-grading-counter-SC-39 - Anybody else is turned away, with no override
**Serves:** grade10-admin-grading-counter-US-05 - the operator releases the cards to the right person or to nobody

- **GIVEN** a submission naming nobody but the collector
- **WHEN** somebody else comes in holding the pickup code
- **THEN** the counter turns them away, offers no override, and says the collector may name a person from their own page

#### Scenario: grade10-admin-grading-counter-SC-91 - A wrong code is refused as often as it is typed
**Serves:** grade10-admin-grading-counter-US-04 - the operator hands the cards back at the desk

- **GIVEN** a person at the desk who has already been refused two wrong pickup codes
- **WHEN** they enter a third wrong code
- **THEN** it is refused on the field as the first two were, with nothing closing the field
- **AND** each of the three refusals is on the submission's timeline
- **AND** the counter offers the ID glance against the collector's own name instead

#### Scenario: grade10-admin-grading-counter-SC-92 - The collector collects although another person is named
**Serves:** grade10-admin-grading-counter-US-05 - the operator releases the cards to the right person or to nobody

- **GIVEN** a submission naming a person other than the collector
- **WHEN** the collector comes in with the code and their own name
- **THEN** the hand-back runs for them, the person named not having displaced them

### Requirement: A slab goes into a vault case from the hand-back step

A collector who would rather leave a slab with the shop opens a vault case at
the same counter.

**When it is offered** - opening a vault case for a slab SHALL be offered from
the hand-over step, and SHALL be refused while anything is still due on the
submission.

**What it records** - the card SHALL be recorded as having gone to the vault
instead of over the counter, and the hand-back receipt SHALL say so.

#### Scenario: grade10-admin-grading-counter-SC-40 - A settled balance opens the vault case
**Serves:** grade10-admin-grading-counter-US-06 - the operator keeps a slab for the collector instead of handing it over

- **GIVEN** a `ready` submission with nothing due
- **WHEN** the operator opens a vault case for one slab from the hand-over step
- **THEN** that card is recorded as gone to the vault, and the receipt says so

#### Scenario: grade10-admin-grading-counter-SC-41 - An unsettled balance holds the vault case
**Serves:** grade10-admin-grading-counter-US-06 - the operator keeps a slab for the collector instead of handing it over

- **GIVEN** an upcharge of 20000 HKD minor units still unpaid
- **WHEN** the operator looks for the vault step
- **THEN** opening a case is not offered, and the reason is on the step

### Requirement: A document is minted only when the counter is ready for it

Nothing is handed over to sign that the shop could not be held to.

**The agreement** - it SHALL be mintable only once every card on the list has
been checked or refused, and SHALL be refused by name otherwise.

**The receipt** - it SHALL be mintable only once nothing is due and every item
that can be handed over has been ticked, and SHALL be refused by name
otherwise. What is due SHALL be fixed at the mint.

**One at a time** - minting SHALL replace no sealed document, SHALL leave at
most one open document on a submission, and SHALL answer one short link that
runs for 30 minutes, shown on the iPad or copied.

**Unset facts** - in production, minting SHALL be refused by name while any
fact the document prints has not been set.

#### Scenario: grade10-admin-grading-counter-SC-42 - An unchecked card holds the agreement
**Serves:** grade10-admin-grading-counter-US-11 - the operator hands a document over only when the counter is ready for it

- **GIVEN** one card on the list neither checked nor refused
- **WHEN** the operator mints the submission agreement
- **THEN** it is refused by name, and the step says which step is unfinished

#### Scenario: grade10-admin-grading-counter-SC-43 - A balance due holds the receipt
**Serves:** grade10-admin-grading-counter-US-11 - the operator hands a document over only when the counter is ready for it

- **GIVEN** storage of 6000 HKD minor units unpaid
- **WHEN** the operator mints the hand-back receipt
- **THEN** it is refused by name before the iPad is offered

#### Scenario: grade10-admin-grading-counter-SC-44 - An unticked item holds the receipt
**Serves:** grade10-admin-grading-counter-US-11 - the operator hands a document over only when the counter is ready for it

- **GIVEN** nothing due and one item that can be handed over not ticked
- **WHEN** the operator mints the hand-back receipt
- **THEN** it is refused by name

#### Scenario: grade10-admin-grading-counter-SC-45 - One document, one link, thirty minutes
**Serves:** grade10-admin-grading-counter-US-11 - the operator hands a document over only when the counter is ready for it

- **WHEN** the operator mints a document
- **THEN** one link is answered, shown on the iPad or copied, and it stops working 30 minutes after it was minted

#### Scenario: grade10-admin-grading-counter-SC-46 - A fact nobody has set refuses the mint in production
**Serves:** grade10-admin-grading-counter-US-11 - the operator hands a document over only when the counter is ready for it

- **GIVEN** production, with a fact the agreement prints still unset
- **WHEN** the operator mints the agreement
- **THEN** it is refused by name, naming the fact, and nothing is sealed

#### Scenario: grade10-admin-grading-counter-SC-47 - A declined signature leaves nothing handed over
**Serves:** grade10-site/grading/counter-documents#grade10-site-grading-counter-documents-US-02 - the collector declines to sign at the counter

- **GIVEN** a minted document the collector declined on the iPad
- **WHEN** the operator reads the step
- **THEN** it shows the decline, nothing is handed over, and minting again is offered

### Requirement: A sealed document and the grades message can be handed over again

A collector who lost an email gets the same sealed copy rather than a new one.

**What can be sent again** - every sealed document a letter has already
carried, and the message telling the collector the grades are in, SHALL be
sendable to the collector again from the console (`Q113`). The handed-in
message carries the agreement and the intake receipt, and the message at
collection carries the hand-back receipt.

**Not yet carried** - a sealed document no letter has carried SHALL NOT be
offered to send again, and a send SHALL be refused by name with nothing sent
(`Q113`). Before the hand-in the agreement is downloaded on the iPad there and
then.

**What is sent** - sending again SHALL send the copy already sealed, changing
no fingerprint and sealing nothing new.

**Nothing sealed yet** - a submission carrying no sealed document SHALL say so
rather than list an empty set of documents.

#### Scenario: grade10-admin-grading-counter-SC-48 - A sealed document is shown or copied at the counter
**Serves:** grade10-admin-grading-counter-US-11 - the operator hands a document over only when the counter is ready for it

- **GIVEN** a submission with its agreement, intake receipt and hand-back receipt sealed
- **WHEN** the operator opens the documents
- **THEN** each is listed with its fingerprint, and each can be shown on the iPad or its link copied

#### Scenario: grade10-admin-grading-counter-SC-49 - A collector who lost the email is sent the same copy
**Serves:** grade10-admin-grading-counter-US-11 - the operator hands a document over only when the counter is ready for it

- **WHEN** the operator sends a sealed document to the collector again
- **THEN** the collector is sent the copy already sealed, with the same fingerprint

#### Scenario: grade10-admin-grading-counter-SC-102 - A document no letter has carried is not offered again
**Serves:** grade10-admin-grading-counter-US-11 - the operator hands a document over only when the counter is ready for it

- **GIVEN** a `booked` submission whose agreement is sealed and whose cards are not yet checked in
- **WHEN** the operator opens its documents
- **THEN** the agreement is listed with its fingerprint and is not offered to send again
- **AND** a send of it is refused by name, and nothing is sent

#### Scenario: grade10-admin-grading-counter-SC-93 - A submission with nothing sealed says so
**Serves:** grade10-admin-grading-counter-US-11 - the operator hands a document over only when the counter is ready for it

- **GIVEN** a `booked` submission with no card yet checked
- **WHEN** the operator opens its documents
- **THEN** it says nothing has been sealed yet

### Requirement: One submission opens into a header and four tabs

One submission is one screen: the header answers the phone, and the tabs carry
the jobs.

| Surface | What an operator does there |
| --- | --- |
| Header | read the summary, the status word, the declared total, what is due, what came back ungraded and the batch it is in; reach the collector by email, phone and click-to-chat templates; work the drop-off or the pickup |
| Cards | read each card's intake id, declared value, level and the level it was moved to, grade and certificate in the grader's words, and its outcome; check, add, refuse or withdraw a card where the status allows |
| Money | read what was paid at hand-in with the till's reference, the upcharge, the storage accrued, what is still to settle, refunds and payouts; record a settlement, waive an upcharge, record or reverse a payout |
| Documents | read the sealed documents with their fingerprints; show one on the iPad, copy its link, or send it again |
| Timeline | read every event with the figures it carried |

**One figure** - what the money tab shows as paid SHALL be what the till
recorded, line for line.

**Nothing to open** - a submission id no submission holds SHALL be answered by
the console's not-found line rather than an empty screen.

#### Scenario: grade10-admin-grading-counter-SC-50 - The header answers the phone
**Serves:** grade10-admin-grading-counter-US-10 - the operator answers a collector from one screen

- **GIVEN** a submission with an upcharge to settle and one card back ungraded
- **WHEN** the operator opens it
- **THEN** the header carries the summary, the status word, the declared total, what is due, the ungraded card and the batch

#### Scenario: grade10-admin-grading-counter-SC-51 - The cards tab carries each card's record
**Serves:** grade10-admin-grading-counter-US-10 - the operator answers a collector from one screen

- **GIVEN** a submission whose cards have come back, one moved up a level
- **WHEN** the operator reads the cards tab
- **THEN** each card names its intake id, declared value, level and the level it was moved to, its grade and certificate in the grader's words, and its outcome

#### Scenario: grade10-admin-grading-counter-SC-52 - The money tab and the till say the same figure
**Serves:** grade10-admin-grading-counter-US-10 - the operator answers a collector from one screen

- **GIVEN** four fee lines of 15000 HKD minor units paid at hand-in
- **WHEN** the operator reads the money tab
- **THEN** it shows 60000 HKD minor units paid over four lines, each naming the till's reference and its card

#### Scenario: grade10-admin-grading-counter-SC-53 - Staff reach the collector from the header
**Serves:** grade10-admin-grading-counter-US-10 - the operator answers a collector from one screen

- **WHEN** the operator opens a submission
- **THEN** the header carries the collector's email and phone and the click-to-chat templates staff press

#### Scenario: grade10-admin-grading-counter-SC-94 - A submission id that resolves to nothing says so
**Serves:** grade10-admin-grading-counter-US-10 - the operator answers a collector from one screen

- **GIVEN** an address carrying a submission id no submission holds
- **WHEN** the operator opens it
- **THEN** the console's not-found line is answered, and no empty screen is drawn

### Requirement: A card is withdrawn until its batch closes

A collector who asks for one card back before it leaves gets it back against a
receipt.

**When it is offered** - withdrawing a card SHALL be offered on a `checked_in`
submission until its batch closes, and SHALL be offered nowhere else.

**What it does** - the card SHALL be recorded as withdrawn, its paid lines
SHALL be refunded at the till, and the card SHALL be released to the collector
against a hand-back receipt. The rest of the cards SHALL stay in the batch.

#### Scenario: grade10-admin-grading-counter-SC-54 - A withdrawal refunds the line and releases the card
**Serves:** grade10-admin-grading-counter-US-07 - the operator gives one card back before the batch leaves

- **GIVEN** a `checked_in` submission whose batch is still open, with a paid fee line of 15000 HKD minor units on the card
- **WHEN** the operator withdraws that card
- **THEN** the card is recorded as withdrawn, 15000 HKD minor units are refunded at the till, and the card is released against a hand-back receipt
- **AND** the other cards stay in the batch

#### Scenario: grade10-admin-grading-counter-SC-55 - A closed batch takes the withdrawal away
**Serves:** grade10-admin-grading-counter-US-07 - the operator gives one card back before the batch leaves

- **GIVEN** a `checked_in` submission whose batch has closed
- **WHEN** the operator reads the cards tab
- **THEN** withdrawing a card is not offered

### Requirement: The timeline carries every event with its figures, and staff-only entries stay in the console

The timeline is what a dispute is tested against.

**What is on it** - every event on the submission SHALL be on the timeline,
with the figures it carried and who did it, in the order it happened.

**The grader's words** - each stage the grader publishes SHALL land on the
timeline in the grader's own words, unchanged.

**Staff only** - which entries a collector sees SHALL be worked out at the
read, and a staff-only entry SHALL reach no collector surface and no letter.

#### Scenario: grade10-admin-grading-counter-SC-56 - One submission's history is one read
**Serves:** grade10-admin-grading-counter-US-13 - the admin reconstructs a submission held in a dispute

- **GIVEN** a submission that was booked, checked in, shipped, graded, received and collected
- **WHEN** its timeline is read
- **THEN** every one of those events is on it, in order, with the figures each carried and who did it

#### Scenario: grade10-admin-grading-counter-SC-57 - A staff-only entry never reaches the collector
**Serves:** grade10-admin-grading-counter-US-13 - the admin reconstructs a submission held in a dispute

- **GIVEN** a submission carrying an entry marked staff-only
- **WHEN** the collector's submission page and the letters sent about it are read
- **THEN** the entry appears in neither

#### Scenario: grade10-admin-grading-counter-SC-58 - The grader's stage stands in its own words
**Serves:** grade10-admin-grading-counter-US-13 - the admin reconstructs a submission held in a dispute

- **WHEN** a stage read from the grader is recorded against the submission's batch
- **THEN** the timeline carries that stage in the grader's own words, unchanged

### Requirement: A waiver, a payout and a money setting each take a reason and a second approve holder

No one person writes money off, pays it out, or changes what the counter
charges.

**Two people** - waiving an upcharge, recording or reversing a payout, and
writing a money setting SHALL each take a reason and a second holder of
`grading:approve` who is not the person recording it. A second approver who is
the recorder SHALL be refused by name.

**Not before the cards are back** - waiving an upcharge SHALL be offered only
once the submission's cards are back at the shop, because there is nothing to
write off before.

**Its own record** - a waiver SHALL be written as a record of its own beside
what the till took, never as an edit of it, and SHALL name the card it waives.

#### Scenario: grade10-admin-grading-counter-SC-59 - A waiver takes a second approve holder
**Serves:** grade10-admin-grading-counter-US-08 - the approver writes off an upcharge with a second person

- **GIVEN** a `ready` submission with an upcharge of 20000 HKD minor units
- **WHEN** an approve holder waives it with a reason and a second approve holder who is not them
- **THEN** the waiver is recorded against the card, and what is due drops to nothing

#### Scenario: grade10-admin-grading-counter-SC-60 - The recorder cannot be the approver
**Serves:** grade10-admin-grading-counter-US-08 - the approver writes off an upcharge with a second person

- **WHEN** an approve holder records a waiver naming themselves as the second approve holder
- **THEN** it is refused by name and nothing is written

#### Scenario: grade10-admin-grading-counter-SC-61 - Nothing is waived before the cards are back
**Serves:** grade10-admin-grading-counter-US-08 - the approver writes off an upcharge with a second person

- **GIVEN** a submission whose cards are still with the grader
- **WHEN** an approve holder reads the money tab
- **THEN** waiving the upcharge is not offered

#### Scenario: grade10-admin-grading-counter-SC-95 - A second approver without the grant is refused
**Serves:** grade10-admin-grading-counter-US-08 - the approver writes off an upcharge with a second person

- **GIVEN** a member of staff holding `grading:operate` and not `grading:approve`
- **WHEN** an approve holder names them as the second approve holder on a waiver
- **THEN** it is refused by name, saying they do not hold `grading:approve`, and nothing is written

### Requirement: A payout is its own record, with its route and its reversal

A card that did not come back is paid for without the collector waiting on the
shop's claim.

**What is paid** - a payout SHALL be recorded at the card's declared value,
with the card's fee refunded beside it, on a record naming the card, the
person who recorded it and the second approve holder.

**The route** - a payout SHALL name one of two routes, the till or a bank
transfer, and a transfer SHALL carry its reference.

**The window** - a payout SHALL be recorded within `grading.settlement_days` of
the day its batch was received at the shop, and one recorded past that window
SHALL say so.

**Once only** - a card already carrying a payout that has not been reversed
SHALL refuse a second by name.

**Reversal** - a card that turns up SHALL be answered by a reversal on that
same record, with its own reason and second approve holder, and the card SHALL
go back on the submission; nothing already recorded SHALL be edited.

#### Scenario: grade10-admin-grading-counter-SC-62 - A payout pays the declared value and refunds the fee
**Serves:** grade10-admin-grading-counter-US-09 - the approver settles a card that did not come back

- **GIVEN** a card declared at 400000 HKD minor units with a paid fee line of 15000 HKD minor units, recorded as not returned
- **WHEN** an approve holder records a payout at the till with a second approve holder who is not them
- **THEN** the record carries 400000 HKD minor units at the till, the fee refund of 15000 HKD minor units beside it, the card, the recorder and the approver

#### Scenario: grade10-admin-grading-counter-SC-63 - A card carries one live payout
**Serves:** grade10-admin-grading-counter-US-09 - the approver settles a card that did not come back

- **GIVEN** a card already carrying a payout that has not been reversed
- **WHEN** an approve holder records a second payout on it
- **THEN** it is refused by name

#### Scenario: grade10-admin-grading-counter-SC-64 - A card that turns up is a reversal on the record
**Serves:** grade10-admin-grading-counter-US-09 - the approver settles a card that did not come back

- **GIVEN** a card paid out and since found
- **WHEN** an approve holder reverses the payout with a reason and a second approve holder
- **THEN** the reversal is written on that record, the payout itself is left as it was, and the card is back on the submission

#### Scenario: grade10-admin-grading-counter-SC-96 - A payout by transfer carries its reference
**Serves:** grade10-admin-grading-counter-US-09 - the approver settles a card that did not come back

- **GIVEN** a card declared at 300000 HKD minor units recorded as not returned
- **WHEN** an approve holder records the payout by bank transfer with a second approve holder who is not them
- **THEN** the record carries the transfer as its route with the transfer's reference, and the card's fee refunded beside it

#### Scenario: grade10-admin-grading-counter-SC-97 - A payout recorded late says it is late
**Serves:** grade10-admin-grading-counter-US-09 - the approver settles a card that did not come back

- **GIVEN** `grading.settlement_days` of 14 and a card whose batch was received at the shop 15 days ago
- **WHEN** an approve holder opens the payout
- **THEN** it says the window has passed, and the payout can still be recorded

### Requirement: The written notice is a counter act with a posting date

The notice is a fact with a date on it, posted by a person.

**Asked for, not swept** - from `grading.notice_day` the submission SHALL badge
the notice as due on the queue and on its own page, and SHALL wait for staff;
no sweep SHALL send it. Recording it before that day SHALL be refused by name.

**What is recorded** - the notice SHALL take the posting date and the tracking
together, and SHALL be refused while either is missing. It SHALL be posted to
the postal address taken at signing.

**The email** - the same notice SHALL be emailed to the collector on the day it
is recorded.

**The clock** - the 30 days the notice gives SHALL run from the posting date
recorded, and one submission SHALL carry one notice.

**After it** - once those 30 days have passed the counter SHALL offer nothing
further, the cards stay the collector's at the shop, and the storage fee goes
on accruing.

#### Scenario: grade10-admin-grading-counter-SC-65 - The notice is asked for from the queue
**Serves:** grade10-admin-grading-counter-US-12 - the operator works the Ready view and sees who has left their cards

- **GIVEN** a submission ready for 180 days
- **WHEN** the operator reads the Ready view
- **THEN** its row asks for the notice, and nothing has been sent without them

#### Scenario: grade10-admin-grading-counter-SC-66 - The posting date and the tracking are recorded together
**Serves:** grade10-admin-grading-counter-US-12 - the operator works the Ready view and sees who has left their cards

- **GIVEN** the notice posted by registered post to the address on the agreement
- **WHEN** the operator records it with a posting date and no tracking
- **THEN** recording is not offered until the tracking is given

#### Scenario: grade10-admin-grading-counter-SC-67 - The thirty days run from the posting date
**Serves:** grade10-admin-grading-counter-US-12 - the operator works the Ready view and sees who has left their cards

- **GIVEN** a notice recorded as posted on a date three days before it was entered
- **WHEN** the submission is read
- **THEN** the 30 days are counted from the posting date, not from the day it was entered
- **AND** the collector is emailed the notice on the day it is recorded

#### Scenario: grade10-admin-grading-counter-SC-68 - Nothing further is offered after the thirty days
**Serves:** grade10-admin-grading-counter-US-12 - the operator works the Ready view and sees who has left their cards

- **GIVEN** a notice posted 31 days ago with the cards still uncollected
- **WHEN** the operator opens the submission
- **THEN** the counter offers no act beyond the hand-back, and the storage fee goes on accruing

### Requirement: Every default the counter runs on is a setting, read and never compiled in

Confirming a default is a decision somebody records, not a release somebody
waits for.

**What is a setting** - every clock, cap, threshold, fee-sheet row and diary
service the counter runs on SHALL be a setting the console reads: the plan's
nudge and expiry days, the reminder days, the day the storage fee starts and
its amount per card per month, the notice day, the settlement days, the ID
glance threshold, the safe's declared cap, the batch cut-off, and the fee sheet
one row per grader and level with its ceiling, fee, cover rate, estimate and
cards a submission.

**Unset stops the read** - a value that no owner has written SHALL refuse the
read that needs it, by name, naming the setting; no value SHALL fall back to
one compiled in.

**Who writes one** - a settings write SHALL require `grading:approve`, and a
money setting SHALL take a second approve holder who is not the writer.

**Its own subject** - a settings write SHALL be filed on the audit chain under
its own subject, `settings`, rather than under a submission.

**Unset on the page** - the settings page SHALL mark every setting no owner has
written, naming the owner who owes it.

#### Scenario: grade10-admin-grading-counter-SC-69 - A setting nobody has written stops the read
**Serves:** grade10-admin-grading-counter-US-15 - operations confirms a default before the counter can run on it

- **GIVEN** the storage fee per card per month never written by its owner
- **WHEN** a surface that needs it is read
- **THEN** the read is refused by name, naming that setting, and no other value is used in its place

#### Scenario: grade10-admin-grading-counter-SC-70 - A money setting takes a second approve holder
**Serves:** grade10-admin-grading-counter-US-15 - operations confirms a default before the counter can run on it

- **WHEN** an approve holder writes the safe's declared cap as 30000000 HKD minor units with a second approve holder who is not them
- **THEN** the setting is written, carrying both names

#### Scenario: grade10-admin-grading-counter-SC-71 - A settings write is filed under its own subject
**Serves:** grade10-admin-grading-counter-US-15 - operations confirms a default before the counter can run on it

- **WHEN** an approve holder changes the notice day
- **THEN** the audit chain carries the write under the settings subject, naming the key, the old value, the new value, the writer and the approver

#### Scenario: grade10-admin-grading-counter-SC-98 - A setting nobody has written is marked on the settings page
**Serves:** grade10-admin-grading-counter-US-15 - operations confirms a default before the counter can run on it

- **GIVEN** a fee-sheet row no owner has written
- **WHEN** the settings are read
- **THEN** that row is marked as unset, naming the owner who owes it

### Requirement: A setting pinned to a submission never moves under it

A figure a collector was quoted or signed for stays the figure.

**At booking** - the fee-sheet row the submission is priced on SHALL be pinned
to it when the drop-off is booked, or at hand-in for a submission written at
the desk.

**At signing** - every figure the submission agreement prints SHALL be pinned
when that agreement is minted: the storage fee per card per month, the day it
starts, the settlement days, the notice day, the reminder days and the ID
glance threshold.

**Reach** - a settings write SHALL reach only submissions not yet booked, and
SHALL change no figure already pinned.

#### Scenario: grade10-admin-grading-counter-SC-72 - The fee sheet is pinned at booking
**Serves:** grade10-admin-grading-counter-US-15 - operations confirms a default before the counter can run on it

- **GIVEN** a submission booked on a fee sheet whose level fee is 15000 HKD minor units
- **WHEN** an approve holder later writes that fee as 18000 HKD minor units
- **THEN** the booked submission is still priced at 15000 HKD minor units at the till

#### Scenario: grade10-admin-grading-counter-SC-73 - Every figure the agreement prints is pinned at signing
**Serves:** grade10-admin-grading-counter-US-15 - operations confirms a default before the counter can run on it

- **GIVEN** a submission whose agreement was sealed with a storage fee of 3000 HKD minor units per card per month
- **WHEN** an approve holder later writes that fee as 5000 HKD minor units
- **THEN** the storage accrued on that submission is still worked out at 3000 HKD minor units per card per month

#### Scenario: grade10-admin-grading-counter-SC-74 - A change reaches only what is not yet booked
**Serves:** grade10-admin-grading-counter-US-15 - operations confirms a default before the counter can run on it

- **GIVEN** one submission booked and one still planned
- **WHEN** an approve holder writes a new fee-sheet row
- **THEN** the planned submission is priced on the new row when it books, and the booked one is untouched

### Requirement: Every act sits behind one of three grants

What the console shows and what the worker requires SHALL be one declaration,
so a section an operator cannot use is not offered.

| Grant | Held by | What it opens |
| --- | --- | --- |
| `grading:read` | staff, admin | the queue with its badges, tiles and day strip; one submission with its cards, money, documents and timeline; the settings, read-only |
| `grading:operate` | staff, admin | starting the visit, checking, adding and refusing a card, minting a document, recording the fee paid, handing in, withdrawing a card, handing back, opening a vault case for a slab, posting the written notice, sending a document or the grades message again |
| `grading:approve` | staff, admin | waiving an upcharge, recording and reversing a payout, and writing a setting or a fee-sheet row |

**The settings** - `grading:read` SHALL open the settings read-only, and only
`grading:approve` SHALL edit them.

**Several grants** - an operator holding more than one grant SHALL be offered
the acts of each.

**Nothing is sent to staff** - no email or push SHALL go to staff: the queue's
badges, its tiles and the day's strip are the whole signal.

#### Scenario: grade10-admin-grading-counter-SC-75 - The console shows only what the operator may do
**Serves:** grade10-admin-grading-counter-US-14 - the operator is never shown a button that will only be refused

- **GIVEN** an operator holding `grading:read` alone
- **WHEN** they open a submission
- **THEN** no act requiring another grant is offered, and sending one is refused by name

#### Scenario: grade10-admin-grading-counter-SC-76 - Only an approve holder edits the settings
**Serves:** grade10-admin-grading-counter-US-14 - the operator is never shown a button that will only be refused

- **GIVEN** an operator holding `grading:read` and `grading:operate`
- **WHEN** they open the settings
- **THEN** every row is read-only, no field opens, and sending a write is refused by name

#### Scenario: grade10-admin-grading-counter-SC-77 - Staff are sent nothing
**Serves:** The grants - a shift learns what is waiting by reading the counter's own screen and nowhere else

- **WHEN** a submission becomes ready, runs late or falls due for the notice
- **THEN** no email or push goes to any member of staff, and the queue's badges, tiles and day strip carry it instead

#### Scenario: grade10-admin-grading-counter-SC-99 - A read holder opens the settings and changes nothing
**Serves:** grade10-admin-grading-counter-US-15 - operations confirms a default before the counter can run on it

- **GIVEN** an operator holding `grading:read` alone
- **WHEN** they open the settings
- **THEN** every setting is listed with its value and the owner who confirms it, no field opens, and sending a write is refused by name

#### Scenario: grade10-admin-grading-counter-SC-100 - An operator is offered every grant they hold
**Serves:** grade10-admin-grading-counter-US-14 - the operator is never shown a button that will only be refused

- **GIVEN** an operator holding `grading:operate` and `grading:approve`
- **WHEN** they open a `returned` submission
- **THEN** the acts of both grants are offered together

### Requirement: An operator's session is verified, and stays verified for twelve hours

Working a grading surface takes a verified session, and takes it once a shift.

**Where it is asked for** - A second factor SHALL be required in production and
in staging, and SHALL be optional in development.

**How long it holds** - One verification SHALL stamp the session for 12 hours,
and no act inside that window SHALL ask for another.

#### Scenario: grade10-admin-grading-counter-SC-78 - Staging asks for the second factor
**Serves:** The grants - an operator opening a grading surface off development meets the second factor before any act

- **GIVEN** an operator signing in to staging
- **WHEN** they open a grading surface
- **THEN** a second factor is required

#### Scenario: grade10-admin-grading-counter-SC-79 - One verification covers the shift's next act
**Serves:** The grants - an operator working a shift is asked for the second factor once rather than at every act

- **GIVEN** an operator who verified an hour ago
- **WHEN** they record a payment at the counter
- **THEN** nothing asks them again

### Requirement: Every act on a submission is filed under that submission

Every act that changes a submission SHALL be recorded on the hash-chained audit
trail under that submission, so one submission's whole trail can be pulled by
its id.

An act with nowhere to write its entry SHALL be refused rather than performed
unrecorded.

#### Scenario: grade10-admin-grading-counter-SC-80 - One submission's trail is one query
**Serves:** grade10-admin-grading-counter-US-13 - the admin reconstructs a submission held in a dispute

- **GIVEN** a submission that was checked in, shipped, received, waived and collected
- **WHEN** its audit trail is pulled by the submission id
- **THEN** every one of those acts is on it, with who did each

#### Scenario: grade10-admin-grading-counter-SC-81 - An act with nowhere to record itself is refused
**Serves:** The grants - a counter act that cannot be written down is never performed

- **GIVEN** an act whose audit entry cannot be written
- **WHEN** an operator sends it
- **THEN** it is refused rather than performed

### Requirement: An act is offered only where it can run, and the worker refuses independently

An act absent is better than an act refused, and the console is never the guard.

| Act | Grant | Offered at |
| --- | --- | --- |
| Open the submission, its documents and its money | read | every status |
| Start the visit, check, add or refuse a card, mint the agreement, record the fee paid, hand in | operate | `planned`, `booked` |
| Cancel the submission | operate | `planned`, `booked` |
| Withdraw a card | operate | `checked_in`, until its batch closes |
| Mint the hand-back receipt, hand over, open a vault case for a slab | operate | `ready` |
| Post the written notice | operate | `ready`, from the notice day |
| Show, copy or send a sealed document or the grades message again | operate | once the document is sealed |
| Waive an upcharge | approve | `returned`, `ready` |
| Record or reverse a payout | approve | `returned`, `ready`, `collected` |
| Write a setting or a fee-sheet row | approve | every status |

**Cancel** - cancelling a submission SHALL never be offered once the cards have
been handed in.

**The worker** - an act SHALL be refused by name by the worker, independently
of what the console offered, when the submission has moved since the console
read it; the submission SHALL be left as the other operator wrote it, and the
console SHALL read it again.

#### Scenario: grade10-admin-grading-counter-SC-82 - The console offers only what the status allows
**Serves:** grade10-admin-grading-counter-US-14 - the operator is never shown a button that will only be refused

- **GIVEN** a submission whose cards are with the grader
- **WHEN** its tabs are read
- **THEN** no act that runs only before hand-in is offered

#### Scenario: grade10-admin-grading-counter-SC-83 - Cancel is gone once the cards have left
**Serves:** grade10-admin-grading-counter-US-14 - the operator is never shown a button that will only be refused

- **GIVEN** a `checked_in` submission
- **WHEN** an operator looks for cancel
- **THEN** it is offered nowhere, and sending it is refused by name

#### Scenario: grade10-admin-grading-counter-SC-84 - The worker refuses what a stale console offers
**Serves:** grade10-admin-grading-counter-US-14 - the operator is never shown a button that will only be refused

- **GIVEN** two operators at one counter, one of whom has already handed the submission in
- **WHEN** the other sends an act the submission no longer allows
- **THEN** it is refused by name, the submission keeps what the first operator wrote, and the console reads it again
