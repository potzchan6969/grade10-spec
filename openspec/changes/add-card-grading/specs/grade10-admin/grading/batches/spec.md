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
  - A line that matches nothing: held as unmatched until staff name the card it
    meant or close it as the grader's error, and finishing waits
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

## ADDED Requirements

### Requirement: A batch is one shop, one grader and one level

What the grader invoices and ships back, so it is what the shop tracks: one
parcel, one order, one set of cards at one level.

**The pair** - a batch SHALL hold submissions of one grader and one level, at
one shop.

**One at a time** - at most one open batch SHALL stand for a shop, a grader
and a level, and every card handed in for that trio before its cut-off SHALL
join it; a batch closed at its cut-off and not yet shipped takes no more cards.

**Opened on first use** - where that trio has no open batch, one SHALL be opened
with its cut-off when the first card for it is handed in.

**A card that fits neither** - a card at another grader or another level SHALL
wait for that trio's own batch and SHALL never join this one.

**Opened ahead of the first card** - a batch MAY also be opened from the
console for a trio that has no open batch, and the first card handed in
for that trio SHALL join it rather than opening a second.

**Its name** - a batch SHALL be named by its shop, its grader and level, and
its cut-off date.

#### Scenario: grade10-admin-grading-batches-SC-01 - The first card handed in opens the batch
**Serves:** grade10-admin-grading-batches-US-01 - the operator finds the day's cards already gathered into the parcel that will leave

- **GIVEN** no open batch stands for the shop, the grader and the level
- **WHEN** a submission at that grader and level is handed in
- **THEN** a batch is opened for that shop, grader and level with its cut-off,
  and the submission joins it

#### Scenario: grade10-admin-grading-batches-SC-02 - A second batch never opens beside an open one
**Serves:** grade10-admin-grading-batches-US-01 - the operator sends one parcel for the shop, the grader and the level rather than two

- **GIVEN** an open batch stands for the shop, the grader and the level
- **WHEN** another submission at that grader and level is handed in
- **THEN** it joins that batch, and no second batch is opened for the trio

#### Scenario: grade10-admin-grading-batches-SC-03 - A card at another level waits for its own batch
**Serves:** grade10-admin-grading-batches-US-01 - the operator keeps one order at one level in the parcel that leaves

- **GIVEN** an open batch at one grader and level
- **WHEN** a submission at the same grader and a different level is handed in
- **THEN** it joins that grader and level's own batch instead, and the first
  batch is unchanged

#### Scenario: grade10-admin-grading-batches-SC-44 - A batch opened from the console takes the trio's first card
**Serves:** grade10-admin-grading-batches-US-01 - the operator opens the week's parcel before the first collector walks in

- **GIVEN** no open batch stands for the shop, the grader and the level
- **WHEN** the operator opens one for that grader and level, and a submission
  at that grader and level is then handed in
- **THEN** the submission joins that batch, and no second batch is opened for
  the trio

### Requirement: A batch's word is read from its own stamps

The word on the row and the tiles is derived from what the batch has been
stamped with, so no act sets it and two screens cannot disagree.

**The set** - a batch SHALL read as exactly one of these words:

| Word | Read from |
| --- | --- |
| Open | its cut-off is still ahead |
| Closed | its cut-off has passed and it carries no ship date |
| Shipped | it carries a ship date and has not arrived back |
| Back, unchecked | it has arrived back and receiving is not finished |
| Received | receiving is finished |

**Never written** - no act SHALL set the word, and the word SHALL be derived
wherever it is read.

**Waiting to be checked** - a batch back at the shop and unchecked for more
than one day SHALL be badged as waiting on the shop.

#### Scenario: grade10-admin-grading-batches-SC-04 - The cut-off passes and the batch reads closed
**Serves:** The batch and its cut-off - every row, tile and act reads the word off the stamps rather than a field somebody set

- **GIVEN** a batch reading Open
- **WHEN** its cut-off passes with no ship date recorded
- **THEN** it reads Closed, and nothing was written to say so

#### Scenario: grade10-admin-grading-batches-SC-05 - The box arrives and the batch reads back, unchecked
**Serves:** grade10-admin-grading-batches-US-02 - the operator opens the returned box against the batch that reads as waiting

- **GIVEN** a batch reading Shipped
- **WHEN** it is recorded as arrived back at the shop
- **THEN** it reads Back, unchecked, and it is badged as waiting on the shop
  once it has stood unchecked for more than one day

#### Scenario: grade10-admin-grading-batches-SC-06 - Receiving finished reads the batch received
**Serves:** grade10-admin-grading-batches-US-02 - the operator sees the box closed off with the day it came back

- **GIVEN** a batch reading Back, unchecked
- **WHEN** receiving is finished
- **THEN** it reads Received with the date it arrived back

### Requirement: The cut-off closes the batch and the next day ships it

The shop's own clock decides when a batch stops taking cards, and the parcel
leaves the day after.

**The cut-off** - a batch SHALL close at Thursday 19:00 on the shop's day,
`Asia/Hong_Kong`, read from a setting and never compiled in.

**The ship day** - the ship day SHALL be the day after the cut-off.

**After it** - a card handed in after the cut-off SHALL join the trio's next
batch rather than the one that closed.

**The estimate** - the date a batch is due back SHALL be counted from its ship
day, at the level's own number of weeks.

#### Scenario: grade10-admin-grading-batches-SC-07 - A card handed in after the cut-off joins the next batch
**Serves:** grade10-admin-grading-batches-US-01 - the operator hands a list in on Friday and it leaves with next week's parcel

- **GIVEN** a batch whose cut-off passed at Thursday 19:00 on the shop's day
- **WHEN** a submission at that grader and level is handed in afterwards
- **THEN** it joins the trio's next batch, and the closed batch's cards are
  unchanged

#### Scenario: grade10-admin-grading-batches-SC-08 - The batch that closed on Thursday ships the next day
**Serves:** grade10-admin-grading-batches-US-01 - the operator works the morning after the cut-off from a row that says the parcel goes today

- **GIVEN** a batch that closed at Thursday 19:00 on the shop's day
- **WHEN** the batches are read on the Friday
- **THEN** the batch reads Closed and ships that day, and its estimate back is
  counted from that day at the level's number of weeks

### Requirement: The tiles read what the shop is holding

Four figures over the counter, derived when they are read, so staff need no
message to know what is waiting.

**What they read** - the tiles SHALL read what ships today, what is with
graders and how many of those are past their estimate, what is back and
unchecked, and the declared value in the safe against its cap.

**Derived** - every tile SHALL be derived at the read and SHALL never be
stored.

**At the cap** - the safe's tile SHALL say so where the declared value held is
at or above the cap.

#### Scenario: grade10-admin-grading-batches-SC-09 - The tiles read the day over the counter
**Serves:** grade10-admin-grading-batches-US-05 - the operator building a batch reads the shop's day off the counter rather than an email

- **GIVEN** one batch closed and shipping today, two batches with graders of
  which one is past its estimate, one batch back and unchecked, and
  24000000 HKD minor units of declared value held against a cap of
  30000000 HKD minor units
- **WHEN** the batches are read
- **THEN** the tiles read 1 shipping today, 2 with graders with 1 past its
  estimate, 1 back and unchecked, and 24000000 HKD minor units against
  30000000 HKD minor units

### Requirement: Shipping a batch is one act over every submission in it

One parcel to one grader, prepared and sent from one form, so the whole batch
moves and every collector hears on the same act.

1. The operator opens the ship form on a batch that has closed.
2. The packing list is printed: one line per intake id in the batch.
3. The grader's order number is recorded.
4. The courier and its tracking are recorded.
5. The insured total - the sum of the declared values of the cards in the
   batch - is read on the form rather than entered, and the courier's written
   cover figure and that figure's currency are recorded.
6. The ship date is recorded, never later than today.
7. The batch is marked shipped: every submission in it moves from Handed in to
   With the grader, the estimate back is set from the ship day, and every
   collector in the batch is told the tracking and that date.

**Held until it is complete** - the act SHALL be refused while the order
number, the courier, the tracking, the cover figure or the ship date is unset,
naming what is unset.

**Not before it closes** - the ship form SHALL open only on a batch that has
closed, and a batch still open SHALL offer no way to ship it.

**A date ahead of today** - a ship date later than the shop's today SHALL be
refused on the field.

**One act, one send** - the act SHALL move every submission in the batch
together or none of them, and SHALL tell each collector once.

**A batch already shipped** - a second attempt to ship the same batch SHALL be
refused by name and SHALL send nothing further.

#### Scenario: grade10-admin-grading-batches-SC-45 - A batch still open offers no way to ship it
**Serves:** grade10-admin-grading-batches-US-01 - the operator cannot send a parcel that is still taking cards

- **GIVEN** a batch whose cut-off is still ahead
- **WHEN** it is read
- **THEN** it reads Open, no way to ship it is offered, and the ship form
  cannot be opened on it

#### Scenario: grade10-admin-grading-batches-SC-10 - The packing list names every intake id in the batch
**Serves:** grade10-admin-grading-batches-US-01 - the operator packs the parcel against a list the grader can check the cards off

- **GIVEN** a closed batch holding three submissions of two, one and five cards
- **WHEN** the packing list is printed
- **THEN** it carries one line per intake id, eight lines in all

#### Scenario: grade10-admin-grading-batches-SC-11 - Marking it shipped sends every submission and tells every collector
**Serves:** grade10-admin-grading-batches-US-01 - the operator sends the parcel with one press rather than opening each submission

- **GIVEN** a closed batch holding three submissions, each at Handed in, with
  its order number, courier, tracking, insured total, cover figure and ship
  date recorded
- **WHEN** it is marked shipped
- **THEN** all three submissions read With the grader, the batch reads Shipped
  with its estimate back counted from the ship day, and each of the three
  collectors is told the tracking and that date once

#### Scenario: grade10-admin-grading-batches-SC-12 - A ship date ahead of today is refused
**Serves:** grade10-admin-grading-batches-US-01 - the operator cannot record a parcel as gone before it has gone

- **WHEN** a ship date later than the shop's today is entered on the ship form
- **THEN** it is refused on the field, and the batch is not shipped

#### Scenario: grade10-admin-grading-batches-SC-13 - The act is held while a field it needs is unset
**Serves:** grade10-admin-grading-batches-US-01 - the operator is told what the form still wants before the parcel leaves

- **GIVEN** a closed batch with no tracking recorded
- **WHEN** the operator tries to mark it shipped
- **THEN** the act is refused naming the tracking, and no submission moves

#### Scenario: grade10-admin-grading-batches-SC-14 - Two operators marking one parcel sent
**Serves:** Shipping the batch - the guard two operators meet when both send one parcel in the same minute

- **GIVEN** a closed batch two operators have open
- **WHEN** both mark it shipped
- **THEN** one act ships it, the other is refused by name, and no collector is
  told twice

### Requirement: The insured total is read against the courier's written cover

The parcel is insured to what it carries, and the courier's own written figure
is what that is read against.

**Derived, never typed** - the insured total SHALL be the sum of the declared
values of the cards in the batch, read on the ship form as a figure staff
cannot enter or change, and SHALL be recorded on the batch as the figure
declared to the courier.

**The comparison** - the insured total SHALL be compared to the courier's
written cover figure before the batch is shipped.

**Above the cover** - a batch whose insured total is above the cover figure
SHALL be refused, naming the total and the cover figure.

**One currency** - the two SHALL be compared only where they carry the same
currency; where they differ the batch SHALL be refused and no rate SHALL be
applied.

**Named beside the figure** - the cover figure SHALL carry its currency
wherever it is read, and any amount that is not HKD SHALL name its currency
beside it.

#### Scenario: grade10-admin-grading-batches-SC-43 - The ship form reads the insured total off the cards in the batch
**Serves:** grade10-admin-grading-batches-US-01 - the operator declares to the courier what the parcel is worth without adding it up

- **GIVEN** a closed batch of three cards declared at 500000, 300000 and
  200000 HKD minor units
- **WHEN** the ship form is opened
- **THEN** the insured total reads 1000000 HKD minor units, it cannot be
  typed over, and it is recorded on the batch as the figure declared to the
  courier

#### Scenario: grade10-admin-grading-batches-SC-15 - A declared total above the courier's cover is refused
**Serves:** grade10-admin-grading-batches-US-01 - the operator cannot send a parcel worth more than the courier has agreed to cover

- **GIVEN** a closed batch with an insured total of 45000000 HKD minor units
  and a written cover figure of 30000000 HKD minor units
- **WHEN** the operator tries to mark it shipped
- **THEN** it is refused naming 45000000 HKD minor units against 30000000 HKD
  minor units, and no submission moves

#### Scenario: grade10-admin-grading-batches-SC-16 - A cover figure in another currency is refused, never converted
**Serves:** grade10-admin-grading-batches-US-01 - the operator reads a cover figure written in the courier's own money rather than a rate nobody agreed

- **GIVEN** a closed batch with an insured total of 45000000 HKD minor units
  and a written cover figure of 1000000 USD minor units
- **WHEN** the operator tries to mark it shipped
- **THEN** it is refused because the two figures are in different currencies,
  and no rate is applied to either

### Requirement: The grader's stage is recorded from a closed set

A person reads the grader's order status most mornings and records where the
order stands; the grader's own words ride beside it.

**A closed set** - the stage SHALL be chosen from that grader's own set of
stages and SHALL never be free text.

**The grader's words** - the words the grader published SHALL be recorded in a
note beside the stage and SHALL reach the batch and every submission in it
unchanged.

**One stage is the move** - exactly one stage of the set SHALL be the move to
the grades being in, and recording it SHALL move every submission in the batch
from With the grader to Grades are in and tell every collector in it.

**Recorded once** - recording a stage already recorded SHALL write nothing
further and SHALL tell nobody again.

#### Scenario: grade10-admin-grading-batches-SC-17 - The morning read records the grader's stage in its own words
**Serves:** grade10-admin-grading-batches-US-04 - the operator types what the grader's order page said this morning

- **GIVEN** a batch reading Shipped
- **WHEN** a stage from that grader's set is recorded with the grader's own
  words beside it
- **THEN** the stage and those words stand on the batch and on every
  submission in it, unchanged

#### Scenario: grade10-admin-grading-batches-SC-18 - The stage that is the move puts the grades in for the whole batch
**Serves:** grade10-admin-grading-batches-US-04 - the operator reads the grades posted on the grader's order and the whole batch follows

- **GIVEN** a batch reading Shipped holding three submissions at With the
  grader
- **WHEN** the stage that is the move to the grades being in is recorded
- **THEN** all three submissions read Grades are in, and each collector in the
  batch is told once

#### Scenario: grade10-admin-grading-batches-SC-19 - The same stage recorded twice writes nothing further
**Serves:** The grader's stages - a morning read repeated on one order tells no collector the same news twice

- **GIVEN** a batch whose last recorded stage is the one being recorded again
- **WHEN** it is recorded a second time
- **THEN** nothing further is written and no collector is told again

### Requirement: The estimate is a date, and a re-estimate takes a reason

Running late is the estimate read against the clock, never a word written on
the batch, and a new date is news the collector hears the day it is set.

**A date** - the batch SHALL carry the date it is due back and SHALL carry no
word for being late.

**Read against the clock** - a batch past its due date SHALL read as late
wherever it is read, derived and never written.

**A reason** - a re-estimate SHALL take the new date and a reason, and SHALL
be refused without them.

**Told that day** - a re-estimate SHALL tell every collector in the batch on
the day it is set.

**The same date** - a re-estimate to the date already set SHALL write nothing
further and SHALL tell nobody again.

#### Scenario: grade10-admin-grading-batches-SC-20 - A batch past its estimate reads late with nothing written
**Serves:** grade10-admin-grading-batches-US-04 - the operator finds the late order on the row before the collector asks about it

- **GIVEN** a batch reading Shipped whose due date has passed
- **WHEN** the batches are read
- **THEN** the batch reads late and is counted in the tile of batches past
  their estimate, and nothing was written to say so

#### Scenario: grade10-admin-grading-batches-SC-50 - The due-back badge stands from the estimated day until the batch is received
**Serves:** grade10-admin-grading-batches-US-04 - the operator watches for the batches whose day back has come before a collector asks

- **GIVEN** a batch reading Shipped whose estimated day back is the shop's own
  day
- **WHEN** the queue is read
- **THEN** every submission in that batch is badged as due back
- **AND** on a day after that estimate the badge is running late instead
- **AND** neither badge stands once the batch reads Received

#### Scenario: grade10-admin-grading-batches-SC-21 - A re-estimate takes a reason and tells every collector that day
**Serves:** grade10-admin-grading-batches-US-04 - the operator passes the grader's new date on to everybody whose cards are in the parcel

- **GIVEN** a batch reading Shipped holding four submissions
- **WHEN** a new due date is set with a reason
- **THEN** the batch carries the new date and the reason, and all four
  collectors are told that day

#### Scenario: grade10-admin-grading-batches-SC-48 - A re-estimate with no reason is refused
**Serves:** grade10-admin-grading-batches-US-04 - the operator gives the collector the reason the date moved, not just a new day

- **GIVEN** a batch reading Shipped
- **WHEN** a new due date is set with no reason
- **THEN** the re-estimate is refused naming the reason, the due date does not
  move, and no collector is told

#### Scenario: grade10-admin-grading-batches-SC-22 - A re-estimate to the date already set writes nothing further
**Serves:** The grader's stages - a date typed again on one order tells no collector the same news twice

- **GIVEN** a batch whose due date is the date being set
- **WHEN** it is set again
- **THEN** nothing further is written and no collector is told again

### Requirement: The manifest and the invoice enter before the first scan

What the grader says it is sending back, and what it is charging for, are in
front of the operator before a single slab is scanned.

**First** - the grader's manifest and its invoice SHALL be entered before any
slab in that batch is scanned, and scanning SHALL be closed until they are.

**What a manifest line carries** - each line SHALL carry:

| Field | Meaning |
| --- | --- |
| Intake id | the card the grader is naming, as the shop labelled it |
| Cert | the grader's certification number for the slab |
| Grade | the grade in the grader's own words |
| The grader's code | the code it returns a card under, where it returned one |
| Note | the grader's words about that card, where it wrote any |
| Level charged | the level the grader charged that card at |

**The invoice** - the invoice SHALL be entered with its reference, its total
and that total's currency.

**A line that matches nothing** - a manifest line naming no intake id in the
batch SHALL be held as unmatched until staff resolve it, and SHALL hold the
batch from being finished.

**Resolving a line** - staff SHALL resolve an unmatched line one of two ways:
naming the card in the batch the line meant, after which the line scans onto
that card; or closing it as the grader's error with a reason, which stands on
the line. A card outside the batch, or a close with no reason, SHALL be refused
by name. A line resolved either way SHALL no longer hold the batch.

**One line each** - a manifest repeating a line number, a cert or an intake id
SHALL be refused by name, and nothing entered.

#### Scenario: grade10-admin-grading-batches-SC-23 - Nothing is scanned until the manifest and the invoice are in
**Serves:** grade10-admin-grading-batches-US-02 - the operator opening the box works against what the grader said it sent

- **GIVEN** a batch reading Back, unchecked with no manifest entered
- **WHEN** the operator opens it to receive
- **THEN** scanning is closed and the batch asks for the manifest and the
  invoice first, and scanning opens once both are entered

#### Scenario: grade10-admin-grading-batches-SC-24 - A manifest line naming no intake id in the batch is held unmatched
**Serves:** grade10-admin-grading-batches-US-02 - the operator sees the grader's line that belongs to nothing the shop sent

- **GIVEN** a manifest carrying a line whose intake id is in no submission in
  the batch
- **WHEN** the manifest is entered
- **THEN** that line is listed as unmatched, and the batch cannot be finished
  while it stands

#### Scenario: grade10-admin-grading-batches-SC-51 - Staff resolve an unmatched line by naming its card or closing it
**Serves:** grade10-admin-grading-batches-US-02 - the operator clears the grader's mistyped line without re-entering the manifest

- **GIVEN** a batch with two unmatched manifest lines, one whose intake id is
  mistyped for a card in the batch and one the grader listed in error
- **WHEN** staff name the card the first line meant, and close the second as
  the grader's error with a reason
- **THEN** the first line's cert scans onto that card, the second reads closed
  with its reason, and neither holds the batch from being finished

### Requirement: A scan matches one cert to one card

Every slab in the box is read onto the card it belongs to, so a slab can never
be handed to the wrong collector.

1. The operator scans the slab's cert.
2. The cert is read against the batch's manifest; a cert the manifest does not
   carry is refused by name.
3. The manifest line's intake id names the card, and the cert, the grade and
   the grader's words are recorded on that card.
4. The row reads matched and scanned, naming the card and its submission.

**One card at one grader holds a cert** - a cert already carried by a card at
the same grader SHALL be refused, in any submission and any batch of that
grader, batches already received included, naming the submission that holds
it, and nothing SHALL be recorded.

**Returned raw** - a card the grader graded nothing SHALL be recorded ungraded
with the grader's code and its note.

#### Scenario: grade10-admin-grading-batches-SC-25 - A scan matches the cert to the card the manifest names
**Serves:** grade10-admin-grading-batches-US-02 - the operator works down the box slab by slab and each one finds its card

- **GIVEN** a manifest line carrying a cert against an intake id in the batch
- **WHEN** that cert is scanned
- **THEN** the cert, the grade and the grader's words stand on the card that
  intake id names, and the row reads matched and scanned against its
  submission

#### Scenario: grade10-admin-grading-batches-SC-26 - A cert another submission holds is refused by name
**Serves:** grade10-admin-grading-batches-US-02 - the operator is stopped before a slab is put with the wrong collector's cards

- **GIVEN** a cert already held by a card in another submission
- **WHEN** it is scanned into this batch
- **THEN** the scan is refused naming the submission that holds that cert, and
  nothing is recorded on either card

#### Scenario: grade10-admin-grading-batches-SC-46 - A cert that grader returned in an earlier batch is refused
**Serves:** grade10-admin-grading-batches-US-02 - the operator is stopped from putting one grader's cert on two cards, months apart

- **GIVEN** a cert carried by a card in a submission of an earlier batch at
  the same grader, that batch already received
- **WHEN** it is scanned into this batch
- **THEN** the scan is refused naming the submission that holds that cert, and
  nothing is recorded on either card

#### Scenario: grade10-admin-grading-batches-SC-27 - A cert the manifest does not carry is refused
**Serves:** grade10-admin-grading-batches-US-02 - the operator finds a slab in the box the grader never listed

- **GIVEN** a batch whose manifest carries no line for a cert
- **WHEN** that cert is scanned
- **THEN** the scan is refused by name, and nothing is recorded

#### Scenario: grade10-admin-grading-batches-SC-28 - A card returned raw is recorded ungraded with the grader's code
**Serves:** grade10-admin-grading-batches-US-02 - the operator records the card that came back in its sleeve as the grader described it

- **GIVEN** a manifest line carrying the grader's code and note against an
  intake id, with no grade
- **WHEN** that line's card is scanned
- **THEN** the card is recorded ungraded with the grader's code and its note

### Requirement: The counters read the batch as it is scanned

What is done and what is left, over the counter, while the box is being worked
through.

**The figures** - the counters SHALL read how many cards are scanned of the
batch's cards, how many are matched, how many came back ungraded, how many
carry an upcharge and what those upcharges come to, and how many submissions
become ready when the batch is finished.

**Derived** - every counter SHALL be derived at the read.

**One unit** - the upcharges' sum SHALL be given in HKD minor units.

#### Scenario: grade10-admin-grading-batches-SC-29 - The counters read what the box has given up so far
**Serves:** grade10-admin-grading-batches-US-02 - the operator half way down the box reads what is left without counting the slabs

- **GIVEN** a batch of 10 cards across 3 submissions, with 6 cards scanned, of
  which 1 came back ungraded and 2 were charged a level up at 25000 HKD minor
  units each
- **WHEN** the receiving counters are read
- **THEN** they read 6 scanned of 10, 6 matched, 1 ungraded, 2 upcharges
  summing to 50000 HKD minor units, and 3 submissions ready when the batch is
  finished

### Requirement: A batch saved part-scanned keeps its scans

A box worked half way through is put down and taken up again without losing
what has been read.

**Kept** - saving a part-scanned batch SHALL keep every scan, every match and
every exception recorded so far.

**Still waiting** - the batch SHALL go on reading Back, unchecked until
receiving is finished.

**Told at the finish** - a plain scan SHALL tell no collector anything until
the batch is finished; an exception recorded on a card is told that day, as
the exceptions and the upcharge say.

#### Scenario: grade10-admin-grading-batches-SC-30 - A half-scanned box is put down and taken up again
**Serves:** grade10-admin-grading-batches-US-02 - the operator serves a customer in the middle of a box and comes back to it

- **GIVEN** a batch of 10 cards with 6 cards scanned
- **WHEN** the operator saves and opens the batch again
- **THEN** the 6 scans, their matches and the exceptions recorded stand, the
  batch reads Back, unchecked, and no collector has been told of a plain scan,
  only of an exception on the day it was recorded

### Requirement: Finishing receiving makes every submission ready at once

One act closes the box: every collector in the batch hears on the same day and
nobody is told ready twice.

**Held while anything is open** - finishing SHALL be refused while a manifest
line is unmatched, or while a card on the manifest is neither scanned nor
recorded as an exception, naming what holds it.

**Every submission together** - finishing SHALL move every submission in the
batch from Back at the shop to Ready to collect in one act, or move none of
them.

**Each collector told** - each collector SHALL be told their pickup code and
what is due once.

**The batch closes** - the batch SHALL read Received with the date it arrived
back.

**Finished once** - finishing a batch already finished SHALL write nothing
further and SHALL tell nobody again.

#### Scenario: grade10-admin-grading-batches-SC-31 - Finishing is held while a line or a slab is unresolved
**Serves:** grade10-admin-grading-batches-US-02 - the operator cannot close a box with a slab still unaccounted for

- **GIVEN** a batch with one unmatched manifest line and one card on the
  manifest neither scanned nor recorded as an exception
- **WHEN** the operator tries to finish receiving
- **THEN** it is refused naming the unmatched line and that card, and no
  submission moves

#### Scenario: grade10-admin-grading-batches-SC-32 - Finishing makes every submission ready and tells each collector once
**Serves:** grade10-admin-grading-batches-US-02 - the operator closes the box and every collector in it hears the same day

- **GIVEN** a batch of 3 submissions with every manifest line matched and
  every card scanned or recorded as an exception
- **WHEN** receiving is finished
- **THEN** all 3 submissions read Ready to collect, each collector is told
  their pickup code and what is due once, and the batch reads Received with
  the date it arrived back

#### Scenario: grade10-admin-grading-batches-SC-33 - Finishing a box twice tells nobody twice
**Serves:** Receiving against the manifest - a finish pressed a second time on one box reaches no collector again

- **GIVEN** a batch already finished
- **WHEN** finishing is run on it again
- **THEN** nothing further is written and no collector is told again

### Requirement: A card that did not come back is recorded on the card

The grader's box is short a slab, and the fact and the money it moves stand on
that one card while the rest of the batch goes on.

**The outcomes** - a card on the manifest that is not in the box SHALL be
recorded as one of these:

| Outcome | What is recorded |
| --- | --- |
| Held by the grader | the card is kept for a further look, with the date the grader expects to return it |
| Not returned | the card did not come back, and it owes a payout at its declared value |
| Damaged | the slab came back damaged, photographed in the box before it leaves it, and it owes a payout at its declared value |

**The date is part of the record** - recording a card held by the grader
without the date it is expected SHALL be refused, naming the date.

**Photographed first** - a damaged slab SHALL be photographed while it is
still in the box it arrived in, before the record is made.

**The rest go on** - the other cards in the submission and in the batch SHALL
carry on, and the batch SHALL be finishable with a card held, not returned or
damaged.

**Told the same day** - the collector SHALL be told on the day the outcome is
recorded, in the message for a card not back with the box; a held card's
message SHALL name the day the grader holds it until.

#### Scenario: grade10-admin-grading-batches-SC-34 - A card held by the grader is recorded with the date it is expected
**Serves:** grade10-admin-grading-batches-US-03 - the operator finishing the box records the one card the grader kept and lets the others go

- **GIVEN** a submission of four cards whose manifest names one card as held
  by the grader
- **WHEN** it is recorded held with the date the grader expects to return it
- **THEN** that card carries held with that date, the other three carry their
  own outcomes, and the batch can be finished

#### Scenario: grade10-admin-grading-batches-SC-47 - A card recorded held with no date it is expected is refused
**Serves:** grade10-admin-grading-batches-US-03 - the operator cannot leave a card with the grader and no day to chase it on

- **GIVEN** a card on the manifest that is not in the box
- **WHEN** it is recorded held by the grader with no expected date
- **THEN** the record is refused naming the date, and nothing is recorded on
  the card

#### Scenario: grade10-admin-grading-batches-SC-35 - A card that did not come back owes its declared value
**Serves:** grade10-admin-grading-batches-US-03 - the operator records the slab that is missing from the box against the money it costs

- **GIVEN** a card on the manifest declared at 800000 HKD minor units that is
  not in the box
- **WHEN** it is recorded as not returned
- **THEN** the card carries not returned and owes a payout of 800000 HKD minor
  units

#### Scenario: grade10-admin-grading-batches-SC-36 - A damaged slab is photographed in the box before it leaves it
**Serves:** grade10-admin-grading-batches-US-03 - the operator keeps the evidence for the claim before the slab is moved

- **GIVEN** a slab that has come back damaged
- **WHEN** it is recorded damaged
- **THEN** the record is refused until the slab is photographed in the box it
  arrived in, and the card then carries damaged with those photographs and
  owes a payout at its declared value

#### Scenario: grade10-admin-grading-batches-SC-37 - The collector hears either outcome the same day
**Serves:** grade10-admin-grading-batches-US-03 - the collector hears about the card from the shop rather than by counting the slabs at the counter

- **WHEN** a card is recorded held by the grader, not returned or damaged
- **THEN** its collector is told on that day, in the message for a card not
  back with the box, and a held card's message names the day the grader holds
  it until

### Requirement: The upcharge is the fee sheet's difference

One figure reaches the collector: the difference between the two levels on the
fee sheet their submission was priced on.

**The figure** - an upcharge SHALL be the fee sheet pinned to that submission's
difference between the level it was booked at and the level the grader
charged.

**In HKD** - an upcharge SHALL be in HKD minor units.

**Never the invoice's own** - the grader's invoice figure SHALL never be
charged to the collector and SHALL never be shown as what is due.

**Reconciled** - the invoice SHALL be read against the sum of the sheet's
differences at receiving, and a gap SHALL be recorded as the shop's to settle
with the grader.

#### Scenario: grade10-admin-grading-batches-SC-38 - A card moved up a level owes the sheet's difference
**Serves:** grade10-admin-grading-batches-US-02 - the collector is charged at the counter the figure they were quoted before booking

- **GIVEN** a submission whose pinned fee sheet prices its booked level at
  15000 HKD minor units a card and the next level at 40000 HKD minor units a
  card
- **WHEN** a card in it is scanned as charged at that next level
- **THEN** the card owes an upcharge of 25000 HKD minor units

#### Scenario: grade10-admin-grading-batches-SC-39 - An invoice that disagrees with the sheet is the shop's to settle
**Serves:** grade10-admin-grading-batches-US-02 - the operator reconciles the grader's bill without the collector's figure moving

- **GIVEN** a batch whose sheet differences sum to 50000 HKD minor units and
  whose invoice charges 8000 USD minor units for the same cards
- **WHEN** the invoice is read against the sheet at receiving
- **THEN** the two figures are recorded against each other, each with its own
  currency, as the shop's to settle with the grader, and every collector still
  owes the sheet's difference on their own card

### Requirement: The safe holds no more declared value than its cap

What the shop is holding is counted against one figure, and a hand-in that
would carry it over is turned away at the desk.

**What is counted** - the total SHALL be the declared values of the cards the
shop holds - handed in, back at the shop, and ready to collect with the slabs
still held - and SHALL leave out a card paid out, withdrawn or moved into a
vault case.

**The cap** - the cap SHALL be 30000000 HKD minor units, read from a setting
and never compiled in.

**Refused at the desk** - a hand-in that would carry the total past the cap
SHALL be refused, the collector told, and the next drop-off booked instead.

**Counted once** - two hand-ins at the same moment SHALL be counted against
each other, so the cap cannot be passed by both.

**Operational** - the cap SHALL stand as an operational limit until cover is
bought, and SHALL be changeable as a setting rather than by a release.

#### Scenario: grade10-admin-grading-batches-SC-40 - The safe's total counts the ready slabs still held
**Serves:** grade10-admin-grading-batches-US-05 - the operator reads what the shop is holding, the graded slabs nobody has collected included

- **GIVEN** cards declared at 10000000 HKD minor units handed in, at 8000000
  HKD minor units back at the shop, and at 6000000 HKD minor units ready to
  collect and still held, with one card declared at 2000000 HKD minor units
  already collected
- **WHEN** the declared value in the safe is read
- **THEN** it reads 24000000 HKD minor units

#### Scenario: grade10-admin-grading-batches-SC-41 - A hand-in that would carry the safe past its cap is refused
**Serves:** grade10-admin-grading-batches-US-05 - the collector at the desk is booked back in rather than leaving cards the shop cannot cover

- **GIVEN** a declared value in the safe of 29000000 HKD minor units against a
  cap of 30000000 HKD minor units
- **WHEN** a submission declared at 2000000 HKD minor units is handed in
- **THEN** the hand-in is refused, the collector is told the shop is at its
  cap, and the next drop-off is booked instead

#### Scenario: grade10-admin-grading-batches-SC-42 - Two desks cannot carry the safe past the cap together
**Serves:** The safe's cap - two hand-ins counted against the same shelf at the same moment

- **GIVEN** a declared value in the safe of 29000000 HKD minor units against a
  cap of 30000000 HKD minor units
- **WHEN** two submissions each declared at 800000 HKD minor units are handed
  in at the same moment
- **THEN** one is taken and the other is refused, and the total never passes
  30000000 HKD minor units

#### Scenario: grade10-admin-grading-batches-SC-49 - A hand-in that fills the safe to its cap is taken
**Serves:** grade10-admin-grading-batches-US-05 - the collector at the desk is taken in while there is still room on the shelf

- **GIVEN** a declared value in the safe of 29000000 HKD minor units against a
  cap of 30000000 HKD minor units
- **WHEN** a submission declared at 1000000 HKD minor units is handed in
- **THEN** the hand-in is taken, the declared value in the safe reads
  30000000 HKD minor units, and the safe's tile says it is at its cap
