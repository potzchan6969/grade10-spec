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
  - Who reads the page: the collector signed in, or whoever holds the emailed
    link, and a plan kept signed out lands on its page on that same link
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
  - Cancelled before the visit starts: the collector calls the submission off
    and the drop-off goes with it
  - Until the visit starts: no cancel once the visit has begun or the counter
    has checked or refused a card, for the collector and for staff acting on
    their word, and nobody is emailed about it
  - Expired: a plan nobody booked ends on its own clock
  - Nothing paid, nothing owed: both ends leave the cards with the collector
- Acts by status
  - Only what the status allows: the page offers no act it would refuse
  - Editing the list: the same submission saved again, never a second one,
    and nothing booked by the edit
  - Nothing while the cards are away: from sent to back the page is a read

## ADDED Requirements

### Requirement: A submission holds one of ten statuses

A submission is in one status at a time, and that status is the only word the
page gives for where the cards are.

| Status | The word the collector reads | Whose move | Rail stage |
| --- | --- | --- | --- |
| `planned` | Not handed in yet | Waiting on you | Planned |
| `booked` | Drop-off booked | Drop-off on its day | Booked |
| `checked_in` | Handed in | With us | Handed in |
| `sent` | With the grader | With the grader, named | Sent |
| `graded` | Grades are in | On their way back | Graded |
| `returned` | Back at the shop, being checked | With us | Back |
| `ready` | Ready to collect | Waiting on you | Back |
| `collected` | Back with you | Collected | Home |
| `cancelled` | Cancelled | — | — |
| `expired` | Expired | — | — |

A submission SHALL hold exactly one of these ten statuses, and a move SHALL
write nothing else about where the cards are.

Every move between statuses SHALL be one of these, and SHALL run only from the
statuses it names:

| Move | From → to | Who makes it |
| --- | --- | --- |
| Book the drop-off | `planned` → `booked` | the collector, once the visit is booked |
| Cancel | `planned`, `booked` → `cancelled` | the collector, or staff on their word |
| Expire unbooked | `planned` → `expired` | the plan's own clock |
| Expire after the visit | `booked` → `expired` | the clock after a visit nobody came to |
| Hand in | `planned`, `booked` → `checked_in` | staff at the counter |
| Ship | `checked_in` → `sent` | the batch leaving the shop |
| Grades in | `sent` → `graded` | the grader's stage that says the grades are in |
| Receive | `graded` → `returned` | the batch arriving back at the shop |
| Ready | `returned` → `ready` | the batch's receiving being finished |
| Collect | `ready` → `collected` | staff, once the hand-back receipt is sealed |

- **Refused when it has moved** - a move asked of a submission in any other
  status SHALL be refused by name, and the submission SHALL NOT change.
- **Terminal** - `collected`, `cancelled` and `expired` SHALL be terminal, and
  no move SHALL leave them.
- **Not a status** - a refused card, a withdrawn card, an unsettled upcharge, a
  card the grader holds and a grader past its estimate SHALL NOT be statuses.
  Each is a fact on one card or a reading of the clock.
- **One name** - the status's internal name SHALL NOT reach the collector; the
  word in the table is the only name the page and the emails use.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-01 - A move the status does not name is refused
**Serves:** The statuses - a collector whose submission moved under them is never shown a change that did not happen

- **GIVEN** a submission that has already been cancelled
- **WHEN** any move is asked of it
- **THEN** it is refused by name and the submission does not change

#### Scenario: grade10-site-grading-submission-lifecycle-SC-02 - The page reads the status in the collector's words
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector follows one submission from planned to home without asking the shop

- **GIVEN** a submission whose cards are with the grader
- **WHEN** the collector opens the submission page
- **THEN** the page reads With the grader
- **AND** no internal name for the status appears anywhere on the page

#### Scenario: grade10-site-grading-submission-lifecycle-SC-03 - One card's exception leaves the status alone
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector follows one submission from planned to home without asking the shop

- **GIVEN** a submission of four cards that is ready to collect
- **WHEN** one of the four came back ungraded
- **THEN** the submission is still ready to collect
- **AND** the ungraded return is a fact on that card alone

### Requirement: The submission page opens to the collector and to the emailed link

One page is read by the collector whose submission it is, by whoever holds the
link the shop emailed, and by nobody else.

- **Signed in** - a collector signed in under the email the submission was
  booked under SHALL read the submission page.
- **The emailed link** - the access token that link carries SHALL open the same
  page on any device, with no account.
- **From the wizard** - a plan kept in the wizard SHALL open its page on the
  access the emailed link carries, so a collector who is not signed in lands on
  it.
- **Anybody else** - a reader holding neither SHALL be given the site's
  not-found page, and the page SHALL NOT say whether the submission exists.
- **An id nobody was issued** - a submission id the shop never issued SHALL be
  answered the same way.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-52 - A reader who is neither the collector nor the link reads not found
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector follows their own submission, and a stranger with the address reads nothing

- **GIVEN** a submission booked under a collector's email
- **WHEN** somebody who is neither signed in as that collector nor holding the emailed link opens its address
- **THEN** the site's not-found page is shown
- **AND** nothing on it says whether that submission exists

#### Scenario: grade10-site-grading-submission-lifecycle-SC-60 - A plan kept signed out opens its page on the link it was kept with
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector follows their own submission with no account

- **GIVEN** a collector who is not signed in and has kept a plan in the
  wizard, by booking it or by saving it for later
- **WHEN** the wizard opens the plan's submission page
- **THEN** the page opens with no account and no sign-in asked for
- **AND** it is the page the emailed link opens

### Requirement: The page reads one word, one chip and one rail

Three things say where a submission is, and all three are read from its one
status.

- **The word** - the page SHALL show the status's word from the status table as
  the submission's badge.
- **The chip** - the page SHALL show, beside the word, whose move it is from the
  same table, naming the grader while the cards are away so that waiting on the
  grader never reads as waiting on the shop.
- **The rail** - the page SHALL show seven stages, Planned, Booked, Handed in,
  Sent, Graded, Back and Home, with the status's own stage current, the stages
  before it done and the stages after it still to come.
- **An ended submission** - a `cancelled` or `expired` submission SHALL leave
  the rail at the stage it ended on, and SHALL show no chip.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-04 - The rail stands at the status's stage
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector sees how far the cards have got without reading a date

- **GIVEN** a submission that has been handed in
- **WHEN** the collector opens the submission page
- **THEN** the rail stands at Handed in, with Planned and Booked done and Sent, Graded, Back and Home still to come

#### Scenario: grade10-site-grading-submission-lifecycle-SC-05 - The chip names the grader while the cards are away
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector reads whose move it is rather than asking the shop

- **GIVEN** a submission whose cards are with the grader
- **WHEN** the collector reads the chip
- **THEN** it says the cards are with that grader, and not that they are with the shop

#### Scenario: grade10-site-grading-submission-lifecycle-SC-06 - An ended submission stays where it ended
**Serves:** grade10-site-grading-submission-lifecycle-US-10 - the collector who called the submission off reads that it went no further

- **GIVEN** a submission cancelled while the drop-off was booked
- **WHEN** the collector opens the submission page
- **THEN** the rail stands at Booked and goes no further
- **AND** no chip is shown

#### Scenario: grade10-site-grading-submission-lifecycle-SC-53 - The word, the chip and the rail are one status's row
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector reads where the cards are in three places that never disagree

- **GIVEN** a submission at any of the ten statuses
- **WHEN** the collector opens the submission page
- **THEN** the word, the chip and the rail's current stage are that status's row of the status table
- **AND** no two of them say a different thing

### Requirement: While the cards are with the grader the page reads its stages and the estimate

From the day the batch leaves until it is back at the shop the page is a read
of what the grader has published and of the clock.

- **The grader's own words** - each stage the grader publishes SHALL reach the
  page as the grader wrote it, in the order it was recorded.
- **The estimate** - the page SHALL show a return estimate counted from the day
  the batch left the shop, and SHALL derive it when read rather than storing a
  standing answer.
- **Running late** - past the estimate the page SHALL say the grader is running
  late and SHALL name the grader, without the submission changing status.
- **A new date** - a re-estimated return date SHALL reach the page and the
  collector on the day it is set.
- **Nothing to do** - from `sent` to `returned` the page SHALL offer the
  collector no act.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-07 - A grader's stage reaches the page unchanged
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector reads the grader's own progress instead of a shop paraphrase

- **GIVEN** a submission whose cards are with the grader
- **WHEN** staff record the grader's published stage
- **THEN** the page shows that stage in the grader's own words

#### Scenario: grade10-site-grading-submission-lifecycle-SC-08 - The estimate counts from the day the batch left
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector knows when to expect the cards back

- **GIVEN** a submission in a batch that was shipped on a known day
- **WHEN** the collector opens the submission page
- **THEN** the return estimate is counted from that ship day

#### Scenario: grade10-site-grading-submission-lifecycle-SC-09 - Past the estimate the page says so
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector learns the cards are late without writing to the shop

- **GIVEN** a submission whose cards are with the grader and whose estimate has passed
- **WHEN** the collector opens the submission page
- **THEN** the page says the grader is running late and names it
- **AND** the submission is still With the grader

#### Scenario: grade10-site-grading-submission-lifecycle-SC-10 - A new return date is told the day it is set
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector hears a slipped date from the shop rather than finding it

- **GIVEN** a submission whose cards are with the grader
- **WHEN** a new return date is set for its batch
- **THEN** the page shows the new date that day
- **AND** the collector is told the same day

#### Scenario: grade10-site-grading-submission-lifecycle-SC-11 - Nothing to do while the cards are away
**Serves:** grade10-site-grading-submission-lifecycle-US-11 - the collector is never shown a button the shop would refuse

- **GIVEN** a submission whose cards are with the grader
- **WHEN** the collector opens the submission page
- **THEN** the page offers no act, and says there is nothing to do

### Requirement: Every card carries one outcome

A card's own history runs beside the submission's status, and one card's
outcome never moves another card.

A card SHALL carry exactly one outcome at a time, from this set:

| Outcome | What the collector reads |
| --- | --- |
| Listed | on the list, not yet handed in |
| Handed in | checked at the counter, with its intake id and its two photographs |
| Refused at the counter | the grader would not take it; it stayed in the collector's hands, with the reason as staff typed it |
| Graded | the grade in the grader's own words, with the cert |
| Ungraded | came back raw, with the grader's code and note |
| Minimum grade not met | graded below the minimum the collector asked for, so it comes back raw |
| Moved up a level | worth more than the level allows, so the grader charged the next level |
| Withdrawn | pulled from the intake bag before the batch closed |
| Held by the grader | kept for a further look, with the date it is expected |
| Not returned | did not come back from the grader or the courier |
| Damaged | came back damaged |
| Collected | handed back to the collector |
| Vaulted | went into a vault case at the counter |

- **Told in the collector's words** - every outcome other than Listed, Handed
  in and Graded SHALL be shown on the card as a line in the collector's words,
  with the money it changes beside it.
- **The rest carry on** - a card that is refused, withdrawn, ungraded, held,
  not returned or damaged SHALL NOT hold any other card of the submission.
- **A held card** - a submission with a card the grader still holds SHALL stay
  `ready` until that card is handed back, and its hand-back receipt SHALL name
  the card still out.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-12 - One card's outcome is one line on that card
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector reads each card's own story on the submission page

- **GIVEN** a submission of four cards, one of them moved up a level
- **WHEN** the collector opens the submission page
- **THEN** that card shows Moved up a level with the money it changes
- **AND** the other three cards show their own outcomes and no such line

#### Scenario: grade10-site-grading-submission-lifecycle-SC-13 - Three cards are ready while one did not come back
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector collects the cards that came back without waiting on the one that did not

- **GIVEN** a submission of four cards whose batch has been received
- **WHEN** one card is recorded as not returned
- **THEN** the submission becomes ready to collect
- **AND** the three cards that came back are collectable

#### Scenario: grade10-site-grading-submission-lifecycle-SC-14 - A card the grader holds keeps the submission ready
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector takes the slabs that came back and reads what is still out

- **GIVEN** a ready submission with one card held by the grader and the rest handed back on a sealed receipt
- **WHEN** the collector reads the submission page
- **THEN** the submission is still ready to collect
- **AND** the receipt and the page both name the card still out with the date it is expected

### Requirement: A card is withdrawn until its batch closes

A collector who changes their mind after hand-in can have one card back, and
the window is the batch's.

- **The window** - a card SHALL be withdrawable from the moment the submission
  is handed in until the batch it is in closes, and SHALL NOT be withdrawable
  after that.
- **How** - the collector asks the shop, and staff SHALL pull the card from the
  intake bag and hand it back at the counter against a receipt.
- **The money** - the card's fee line and its cover line SHALL come back at the
  till when the card is collected.
- **The page** - the card SHALL read Withdrawn with its refund, and the
  submission's estimate SHALL drop to the cards that go on.
- **Nothing left to send** - a withdrawal that takes the submission's last card
  SHALL cancel the submission, and the collector SHALL be told.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-15 - A card is pulled from the bag before the batch closes
**Serves:** grade10-site-grading-submission-lifecycle-US-02 - the collector who changed their mind gets one card back at the counter

- **GIVEN** a handed-in submission of four cards whose batch has not closed
- **WHEN** the collector asks for one card back and collects it at the counter
- **THEN** that card reads Withdrawn, its fee and cover come back at the till against a receipt
- **AND** the other three cards go on to the grader

#### Scenario: grade10-site-grading-submission-lifecycle-SC-16 - A closed batch takes the withdrawal away
**Serves:** grade10-site-grading-submission-lifecycle-US-02 - the collector learns the window has shut rather than asking for the impossible

- **GIVEN** a handed-in submission whose batch has closed
- **WHEN** the collector opens the submission page
- **THEN** no card offers to be withdrawn

#### Scenario: grade10-site-grading-submission-lifecycle-SC-54 - The last withdrawal cancels the submission
**Serves:** grade10-site-grading-submission-lifecycle-US-02 - the collector who asks for every card back is left with nothing open in their name

- **GIVEN** a handed-in submission of two cards whose batch has not closed, one of them already withdrawn
- **WHEN** the collector asks for the second card back and collects it at the counter
- **THEN** the submission is cancelled
- **AND** the collector is told, and the page says what came back and why

### Requirement: The grade is the grader's decision

A card that came back raw or below the grade the collector asked for is
explained on the page, and the shop does not argue the grade.

- **Ungraded** - the card SHALL show the grader's code and its note, and a line
  saying the fee stands.
- **Minimum grade not met** - a card asked for at a minimum grade that graded
  below it SHALL come back raw, and SHALL show a line saying the fee stands.
- **A review** - the page SHALL say that the grade is the grader's decision and
  that a review is a new submission at the grader's review fee, asked for at the
  counter.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-17 - An ungraded card carries the grader's code and note
**Serves:** grade10-site-grading-submission-lifecycle-US-03 - the collector learns what the grader found rather than asking the shop

- **GIVEN** a ready submission with one card returned ungraded
- **WHEN** the collector opens the submission page
- **THEN** that card shows the grader's code and its note, and says the fee stands

#### Scenario: grade10-site-grading-submission-lifecycle-SC-18 - A card below its minimum grade comes back raw
**Serves:** grade10-site-grading-submission-lifecycle-US-03 - the collector who set a minimum grade reads why the card is not in a slab

- **GIVEN** a card listed with a minimum grade that the grader graded below
- **WHEN** the batch is received and the outcome recorded
- **THEN** the card reads Minimum grade not met, comes back raw, and says the fee stands

#### Scenario: grade10-site-grading-submission-lifecycle-SC-19 - A review is a new submission
**Serves:** grade10-site-grading-submission-lifecycle-US-03 - the collector who disagrees with a grade is told where to ask

- **GIVEN** a submission whose grades are in
- **WHEN** the collector reads the page about the grades
- **THEN** it says the grade is the grader's decision and that a review is a new submission at the grader's review fee, asked for at the counter

### Requirement: The fee follows the card's outcome

What the fee does is decided by the card's outcome and by nothing else. Each
rule reaches the card's fee line and the cover line beside it alike.

| Outcome | The fee |
| --- | --- |
| Refused at the counter | never charged; a line already paid comes back at the till |
| Withdrawn before the batch closes | refunded at the till when the card is collected against a receipt |
| Ungraded, or minimum grade not met | stands |
| Moved up a level | stands, and the difference between the two levels is due before collection |
| Held by the grader | stands; the card comes back on a second hand-back |
| Not returned, or damaged | refunded beside the payout |

- **Back the way it was paid** - every refund SHALL be a line at the till in the
  way the fee was paid, and SHALL NOT be paid by any other route.
- **Said on the page** - the page SHALL show what came back and the outcome it
  came back for.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-20 - A refused card is never charged
**Serves:** grade10-site-grading-submission-lifecycle-US-01 - the collector pays for the cards the shop took in and for no others

- **GIVEN** a submission whose fee has been paid at the counter
- **WHEN** one card is refused at the counter
- **THEN** that card's fee and cover come back at the till
- **AND** the page names the refund and the refusal it came back for

#### Scenario: grade10-site-grading-submission-lifecycle-SC-21 - The fee stands on a card that came back raw
**Serves:** grade10-site-grading-submission-lifecycle-US-03 - the collector reads that the raw card was still graded work

- **GIVEN** a ready submission with one card returned ungraded
- **WHEN** the collector reads that card's money
- **THEN** its fee stands and no refund is offered

#### Scenario: grade10-site-grading-submission-lifecycle-SC-22 - A refund goes back the way the fee was paid
**Serves:** grade10-site-grading-submission-lifecycle-US-02 - the collector gets the money back where they paid it

- **GIVEN** a card whose fee was paid by card at the till
- **WHEN** that card is withdrawn and collected
- **THEN** the refund is a line at the till in the way the fee was paid

### Requirement: The upcharge is the fee sheet's difference between the two levels

A card that came back worth more than the level allows costs the difference the
collector was quoted before booking, and nothing else.

- **The figure** - the upcharge SHALL be the difference between the two levels
  on the fee sheet pinned to the submission, in HKD, and SHALL NOT be taken from
  the grader's invoice.
- **When it is told** - the upcharge SHALL reach the page and the collector on
  the day the grades are recorded.
- **When it is due** - the upcharge SHALL be due at the counter before anything
  is handed back, and SHALL NOT be asked for before the grades are in.
- **A gap** - a grader invoice that differs from the pinned sheet SHALL NOT move
  what the collector owes.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-23 - The upcharge is told the day the grades post
**Serves:** grade10-site-grading-submission-lifecycle-US-04 - the collector learns what to settle before coming in, not at the counter

- **GIVEN** a submission whose card came back moved up a level
- **WHEN** the grades are recorded
- **THEN** the page and the collector's message name the difference between the two levels as due at the counter before collection, that day

#### Scenario: grade10-site-grading-submission-lifecycle-SC-24 - The pinned sheet's difference is the figure charged
**Serves:** grade10-site-grading-submission-lifecycle-US-04 - the collector is charged the figure they were quoted before booking

- **GIVEN** a submission whose pinned fee sheet puts 60000 HKD minor units between the level booked and the level charged
- **WHEN** the grader's invoice carries a different figure for that card
- **THEN** the collector owes 60000 HKD minor units

### Requirement: A ready submission carries a pickup code and one figure to settle

When the cards are ready the page is a pickup card: where to come, what to
bring, and what to settle.

- **The code** - a ready submission SHALL carry a four-digit pickup code, shown
  on the page and in the ready message, and SHALL be unique among the
  submissions that are ready.
- **When to come** - the page SHALL give the shop's hours and SHALL say that no
  booking is needed.
- **What is due** - the page SHALL show one figure to settle, the unsettled
  upcharge and the storage accrued to the day together, and SHALL say it is due
  at the counter.
- **Settle first** - nothing SHALL be handed back while anything is due.
- **Nothing due** - where nothing is owed the page SHALL say so rather than show
  a figure of zero.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-25 - The pickup card carries the code, the hours and what is due
**Serves:** grade10-site-grading-submission-lifecycle-US-06 - the collector walks in once and leaves with the slabs

- **GIVEN** a submission that has become ready to collect
- **WHEN** the collector opens the submission page
- **THEN** it shows a four-digit code, the shop's hours, that no booking is needed, and one figure to settle
- **AND** the same code is in the ready message

#### Scenario: grade10-site-grading-submission-lifecycle-SC-26 - Nothing is handed back while money is due
**Serves:** grade10-site-grading-submission-lifecycle-US-06 - the collector settles at the counter before the slabs come out

- **GIVEN** a ready submission with an unsettled upcharge
- **WHEN** the collector comes in with the code
- **THEN** the hand-back is refused by name until the figure is settled at the counter

#### Scenario: grade10-site-grading-submission-lifecycle-SC-27 - A ready submission owing nothing says so
**Serves:** grade10-site-grading-submission-lifecycle-US-06 - the collector knows to bring no money

- **GIVEN** a ready submission with no upcharge and no storage accrued
- **WHEN** the collector reads the pickup card
- **THEN** it says nothing is due

### Requirement: Cards are released to the collector or the one person they named

Collection is in person, against the code and a name, and the shop releases the
cards to nobody else.

- **Who** - the cards SHALL be released only to the collector or to the one
  person named on the submission page, and to nobody else, with the code or
  without it.
- **No override** - staff SHALL have no way to release to anyone else.
- **The ID glance** - where the submission's declared value is above 1000000 HKD
  minor units in total, the counter SHALL match an ID to that person's name,
  SHALL keep nothing from it, and SHALL NOT record it as an identity check.
- **Below the threshold** - at or below that figure the code and the name SHALL
  release the cards.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-28 - Above the threshold an ID is matched and nothing is kept
**Serves:** grade10-site-grading-submission-lifecycle-US-06 - the collector brings an ID because the page told them to

- **GIVEN** a ready submission whose cards are declared at 1500000 HKD minor units in total
- **WHEN** the collector comes in with the code
- **THEN** the page and the counter ask for an ID matching the name
- **AND** nothing from the ID is kept on the submission

#### Scenario: grade10-site-grading-submission-lifecycle-SC-29 - Below the threshold the code and the name release the cards
**Serves:** grade10-site-grading-submission-lifecycle-US-06 - the collector is not asked for papers they do not need

- **GIVEN** a ready submission whose cards are declared at 400000 HKD minor units in total
- **WHEN** the collector comes in with the code
- **THEN** the pickup card asks for no ID, and the code and the name release the cards

#### Scenario: grade10-site-grading-submission-lifecycle-SC-30 - Anybody else is turned away
**Serves:** grade10-site-grading-submission-lifecycle-US-07 - the collector knows a forwarded code releases nothing

- **GIVEN** a ready submission with nobody named
- **WHEN** a person who is not the collector comes in with the code
- **THEN** the cards are not released, and staff have no way to release them

### Requirement: The collector names one person to collect

A collector who cannot come in names somebody, from the page, before that
person arrives.

- **One at a time** - a submission SHALL hold at most one named person, by their
  full name as it is written on their ID.
- **When** - the named person SHALL be named, changed or removed from the page at
  any time before the cards are collected, and SHALL be refused once they are.
- **Quietly** - naming, changing or removing SHALL send no message, and SHALL be
  written to the submission's history.
- **On the receipt** - the hand-back receipt SHALL name who collected.
- **A full name or nobody** - a naming with no name SHALL be refused, and the
  submission SHALL stay with nobody named.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-31 - Naming somebody is logged and sends nothing
**Serves:** grade10-site-grading-submission-lifecycle-US-07 - the collector sends somebody else in their place

- **GIVEN** a ready submission with nobody named
- **WHEN** the collector names one person by their full name
- **THEN** the page shows that person as the named collector
- **AND** the submission's history carries the naming, and no message is sent

#### Scenario: grade10-site-grading-submission-lifecycle-SC-32 - A second name replaces the first
**Serves:** grade10-site-grading-submission-lifecycle-US-07 - the collector changes their mind about who comes in

- **GIVEN** a ready submission with one person named
- **WHEN** the collector names a different person
- **THEN** only the second person is named, and the first is released to nobody

#### Scenario: grade10-site-grading-submission-lifecycle-SC-33 - Naming is refused once the cards are collected
**Serves:** grade10-site-grading-submission-lifecycle-US-07 - the collector reads why the card is no longer offered

- **GIVEN** a submission whose cards have been collected
- **WHEN** the collector tries to name somebody
- **THEN** it is refused by name as already collected

#### Scenario: grade10-site-grading-submission-lifecycle-SC-55 - An empty name names nobody
**Serves:** grade10-site-grading-submission-lifecycle-US-07 - the collector never sends somebody in on a name the page never took

- **GIVEN** a ready submission with nobody named
- **WHEN** the collector asks to name somebody and gives no name
- **THEN** the naming is refused
- **AND** the submission still has nobody named

#### Scenario: grade10-site-grading-submission-lifecycle-SC-56 - Removing the named person leaves nobody named
**Serves:** grade10-site-grading-submission-lifecycle-US-07 - the collector takes back the name they gave and comes in themselves

- **GIVEN** a ready submission with one person named
- **WHEN** the collector removes them
- **THEN** the submission has nobody named, and only the collector is released to
- **AND** the removal is in the submission's history, and no message is sent

### Requirement: A slab goes into a vault case at the same counter

Instead of taking a slab home the collector can leave it with the shop, and
that is a vault case rather than storage on the submission.

- **At the counter** - a slab SHALL be able to go straight into a vault case at
  the same hand-back, and the card's outcome SHALL read Vaulted with a link to
  the case.
- **Where the duties are** - the identity check and the custody agreement for
  that slab SHALL be the vault case's, under
  `grade10-site/vault/case-intake`, and SHALL NOT be asked for by the
  submission.
- **No storage** - a vaulted card SHALL be excluded from the submission's
  storage fee, and vault storage SHALL be free.
- **On the receipt** - the hand-back receipt SHALL say the card went to the
  vault.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-34 - A slab left at the counter becomes a vault case
**Serves:** grade10-site-grading-submission-lifecycle-US-06 - the collector leaves a slab with the shop rather than carrying it home

- **GIVEN** a ready submission being handed back
- **WHEN** one slab is put into a vault case at the counter
- **THEN** that card reads Vaulted and links its case
- **AND** it is not counted for storage on the submission, and the receipt says it went to the vault

### Requirement: Cards left uncollected walk reminders, then storage, then a written notice

A submission nobody collects climbs a ladder counted in days from the day it
became ready to collect.

| Day after ready | What happens |
| --- | --- |
| 30 | a reminder, costing nothing |
| 60 | a second reminder, costing nothing |
| 90 | the storage fee begins to accrue |
| 180 | the written notice is due |
| the notice period after the notice is posted | the first release stops here; the period is `grading.notice_period_days`, pinned at signing |

- **The notice** - from day 180 staff SHALL post the written notice by
  registered post to the address taken at signing and SHALL email it the same
  day, and its posting date and tracking SHALL be recorded on the submission.
- **The days it gives** - the notice period pinned at signing SHALL run from
  the posting date, and the page SHALL show that date and the day it ends.
- **The cards stay the collector's** - throughout the ladder the cards SHALL
  remain the collector's, and no rung SHALL take them.
- **The ladder stops** - nothing SHALL follow the notice's period in this
  release, and the page SHALL say that a slab kept on purpose goes into a vault
  case instead.
- **Nothing pauses it** - the rungs SHALL be counted from the ready day
  whatever the collector books or names, and a card SHALL leave the ladder only
  by being collected, vaulted or paid out.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-35 - The rungs are counted from the ready day
**Serves:** grade10-site-grading-submission-lifecycle-US-08 - the collector who has not come in is nudged before being charged

- **GIVEN** a submission that became ready to collect on a known day
- **WHEN** 30 and then 60 days have passed with the cards uncollected
- **THEN** a reminder has gone at each rung and nothing has been charged
- **AND** the page shows each rung with the day it falls

#### Scenario: grade10-site-grading-submission-lifecycle-SC-36 - The notice gives its pinned period from its posting date
**Serves:** grade10-site-grading-submission-lifecycle-US-08 - the collector is given written warning before anything else

- **GIVEN** a ready submission 180 days uncollected, its notice period pinned at 90 days
- **WHEN** staff post the written notice and record its posting date and tracking
- **THEN** the page shows the posting date and gives 90 days from it
- **AND** the collector is emailed the same day

#### Scenario: grade10-site-grading-submission-lifecycle-SC-37 - After the notice's days the cards are still the collector's
**Serves:** grade10-site-grading-submission-lifecycle-US-08 - the collector can still come in, or vault the slabs, after the notice

- **GIVEN** a submission whose notice was posted longer ago than its pinned notice period
- **WHEN** the collector opens the submission page
- **THEN** the cards are still theirs to collect, storage is still accruing, and the page offers the vault instead

#### Scenario: grade10-site-grading-submission-lifecycle-SC-57 - Naming a collector does not pause the ladder
**Serves:** grade10-site-grading-submission-lifecycle-US-08 - the collector who says somebody is coming is still nudged and still charged for the wait

- **GIVEN** a ready submission uncollected 95 days, with a person named and a visit booked at the shop
- **WHEN** the collector reads the ladder and what is due
- **THEN** the rungs still count from the ready day and the storage is still accruing
- **AND** only a card collected, vaulted or paid out has left the ladder

### Requirement: Storage accrues per card held and per month started

Storage is a nudge rather than a price, derived from the ready day and the
cards the shop still holds.

- **The fee** - storage SHALL be 3000 HKD minor units per card still held at the
  shop, per month started from day 90 after the submission became ready.
- **A part month** - a month begun SHALL count as a whole month.
- **Which cards** - a card withdrawn, paid out or vaulted SHALL NOT be counted.
- **Derived** - the figure SHALL be worked out when it is read, from the ready
  day and the cards held, and SHALL NOT be written down month by month.
- **When it is paid** - the storage accrued SHALL be due at the counter before
  collection, as one line per card held, the hand-in's own convention: one
  store line to one card.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-38 - A part month counts whole
**Serves:** grade10-site-grading-submission-lifecycle-US-08 - the collector reads what the wait has cost so far

- **GIVEN** a ready submission of four cards, uncollected 100 days
- **WHEN** the collector reads what is due
- **THEN** the storage is 12000 HKD minor units, one month started for each of the four cards

#### Scenario: grade10-site-grading-submission-lifecycle-SC-39 - Cards no longer at the shop are not counted
**Serves:** grade10-site-grading-submission-lifecycle-US-08 - the collector is charged only for the cards the shop is holding

- **GIVEN** a ready submission of four cards uncollected 100 days, one of them vaulted and one paid out
- **WHEN** the collector reads what is due
- **THEN** the storage is 6000 HKD minor units, for the two cards still held

#### Scenario: grade10-site-grading-submission-lifecycle-SC-40 - Storage is settled before the cards are handed back
**Serves:** grade10-site-grading-submission-lifecycle-US-08 - the collector settles the wait at the counter and takes the slabs

- **GIVEN** a ready submission with storage accrued
- **WHEN** the collector comes in to collect
- **THEN** the storage accrued to that day is taken at the till, one line per card held, before anything is handed back

### Requirement: A card that did not come back is paid out at its declared value

A card lost or damaged in the grader's hands or in transit is settled by the
shop, and the collector waits on nobody else's claim.

- **The amount** - the payout SHALL be the card's declared value, with the
  card's fee and cover refunded beside it.
- **The window** - the payout SHALL be made within 14 days of the day the batch
  was received at the shop.
- **The routes** - the payout SHALL go by one of two routes, at the till or by
  bank transfer.
- **Its own record** - each payout SHALL be recorded on the card with its route
  and its reference, and SHALL be shown on the submission page.
- **Told the same day** - the collector SHALL be told on the day the outcome is
  recorded.
- **The shop claims** - the payout SHALL NOT wait on a claim against the grader
  or the courier.
- **Reversed** - a card that turns up later SHALL reverse the payout on the same
  record, and the card SHALL go back on the submission with its outcome.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-41 - A lost card is paid out at its declared value with its fee back
**Serves:** grade10-site-grading-submission-lifecycle-US-05 - the collector is made whole for a card that never came back

- **GIVEN** a card declared at 800000 HKD minor units whose batch was received on a known day, recorded as not returned
- **WHEN** the payout is made at the till
- **THEN** the collector is paid 800000 HKD minor units with the card's fee and cover refunded beside it, within 14 days of that day
- **AND** the page shows the payout, its route and its reference

#### Scenario: grade10-site-grading-submission-lifecycle-SC-42 - A damaged card is told the same day
**Serves:** grade10-site-grading-submission-lifecycle-US-05 - the collector hears about a damaged card from the shop rather than at the counter

- **GIVEN** a batch being received
- **WHEN** a card is recorded as damaged
- **THEN** the collector is told that day, with the payout it owes

#### Scenario: grade10-site-grading-submission-lifecycle-SC-43 - A card that turns up reverses its payout
**Serves:** grade10-site-grading-submission-lifecycle-US-05 - the collector gets the card back and the page says what happened to the money

- **GIVEN** a card that was paid out as not returned
- **WHEN** the card turns up
- **THEN** the payout is reversed on the same record
- **AND** the card is back on the submission with its outcome, and the page shows the reversal

### Requirement: After collection the submission keeps the graded record

Once the cards are home the submission page becomes the record of what was
graded.

- **Per slab** - the record SHALL carry the grade in the grader's words, the
  grader and the cert, with a link that looks the cert up, and the slab
  photographs taken at hand-back.
- **The documents** - the submission agreement, the intake receipt and the
  hand-back receipt SHALL stay on the page, each with its fingerprint and a
  download.
- **Where it is read** - the record SHALL be on the submission page, and under
  the collector's account where they keep one.
- **Never stock** - a collector's slab SHALL NOT enter the shop's catalogue, and
  a vault valuation or an auction consignment SHALL read the record from the
  submission.
- **A second hand-back** - a submission whose held card comes back later SHALL be
  closed by that second hand-back, and both receipts SHALL stay on the record.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-44 - The record carries the grade, the cert and the papers
**Serves:** grade10-site-grading-submission-lifecycle-US-09 - the collector keeps the proof of what was graded

- **GIVEN** a submission whose cards have been collected
- **WHEN** the collector opens the submission page
- **THEN** each slab shows its grade in the grader's words, its grader, its cert and a look-up link, with its hand-back photograph
- **AND** the three documents are there, each with its fingerprint and a download

#### Scenario: grade10-site-grading-submission-lifecycle-SC-45 - A collected slab is never the shop's stock
**Serves:** grade10-site-grading-submission-lifecycle-US-09 - the collector's slab stays theirs and is read from one place

- **GIVEN** a submission whose cards have been collected
- **WHEN** the slab is valued for a vault case or consigned to an auction
- **THEN** the grade, the grader and the cert are read from the submission's record
- **AND** the slab is in no catalogue of the shop's

#### Scenario: grade10-site-grading-submission-lifecycle-SC-46 - The held card's return closes the submission
**Serves:** grade10-site-grading-submission-lifecycle-US-09 - the collector comes back for the last card and the record is whole

- **GIVEN** a ready submission whose other cards were handed back and one card was held by the grader
- **WHEN** that card comes back and is handed over on a second receipt
- **THEN** the submission is collected
- **AND** the record carries both hand-backs and both receipts

### Requirement: A submission is cancelled until its visit starts or the counter takes a card, and expires when nobody books

Both endings leave the cards with the collector and the account settled at
nothing.

- **Cancelling** - the collector SHALL be able to cancel a submission that is
  `planned` or `booked` until its visit starts and until the counter checks or
  refuses a card on its list, and SHALL NOT be able to after either, nor once
  the cards are handed in. Staff SHALL cancel in the same window, on the
  collector's word, and the collector SHALL be sent no message for either.
- **The drop-off goes with it** - cancelling SHALL cancel the drop-off booked
  for that submission.
- **Expiring** - a `planned` submission nobody books, and a `booked` submission
  whose visit nobody came to, SHALL expire on the clock the plan sets.
- **Nothing paid, nothing owed** - a cancelled or expired submission SHALL carry
  no money paid and nothing owed, and its cards SHALL never have left the
  collector.
- **Nothing left to hand in** - a hand-in that refuses the submission's last
  card SHALL cancel the submission at the counter, the collector SHALL be told
  there, and no message SHALL be sent.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-47 - Cancelling takes the drop-off with it
**Serves:** grade10-site-grading-submission-lifecycle-US-10 - the collector calls the whole thing off from one page

- **GIVEN** a submission with a drop-off booked
- **WHEN** the collector cancels the submission
- **THEN** the submission is cancelled and its drop-off is cancelled with it
- **AND** the page says nothing was paid and nothing is owed

#### Scenario: grade10-site-grading-submission-lifecycle-SC-48 - Cancelling is refused once the cards are in
**Serves:** grade10-site-grading-submission-lifecycle-US-11 - the collector is not offered a cancel the counter would refuse

- **GIVEN** a submission that has been handed in
- **WHEN** the collector opens the submission page
- **THEN** no cancel is offered, and a cancel asked for is refused by name

#### Scenario: grade10-site-grading-submission-lifecycle-SC-49 - A submission nobody books expires on its own
**Serves:** grade10-site-grading-submission-lifecycle-US-10 - the collector who never came back is left owing nothing

- **GIVEN** a planned submission with no drop-off booked
- **WHEN** its expiry clock runs out
- **THEN** the submission is expired, the rail stands at Planned
- **AND** nothing was paid, nothing is owed, and the cards were never handed in

#### Scenario: grade10-site-grading-submission-lifecycle-SC-58 - The last card refused at the counter cancels the submission
**Serves:** grade10-site-grading-submission-lifecycle-US-10 - the collector leaves the counter with their cards and nothing open in their name

- **GIVEN** a booked submission of one card being handed in at the counter
- **WHEN** the counter refuses that card
- **THEN** the submission is cancelled and the collector is told at the counter
- **AND** no message is sent, and nothing was paid and nothing is owed

#### Scenario: grade10-site-grading-submission-lifecycle-SC-61 - Cancel is withheld once the visit's start time comes or the counter checks or refuses a card
**Serves:** grade10-site-grading-submission-lifecycle-US-10 - the collector is not offered a cancel the counter would refuse

- **GIVEN** a booked submission whose visit's start time has come, and another
  one of whose cards the counter checked before its visit's start time, the
  desk having started early
- **WHEN** the collector opens each submission's page, or sends a cancel for
  either from a page read before
- **THEN** no cancel is offered on either
- **AND** each cancel is refused by name, and each submission and its cards
  stay as they were

### Requirement: The page offers only the acts the status allows

The acts on the page are decided by the status, so the collector is never shown
something the shop would refuse.

| Status | The collector can |
| --- | --- |
| `planned`, `booked` | edit the list; book, move or cancel the drop-off; cancel the submission |
| `checked_in` | withdraw a card until the batch closes |
| `sent`, `graded`, `returned` | nothing; read the grader's stages and the grades |
| `ready` | name, change or remove a collector; collect, or vault a slab at the counter |
| `collected` | read the record; vault a slab, consign it to an auction, ask for erasure |
| `cancelled`, `expired` | start a new submission |

- **Offered and allowed are the same set** - the page SHALL offer no act that
  the submission's status would refuse.
- **An act on a status that has moved** - an act asked for on a submission that
  has since moved SHALL be refused by name.
- **The counter owns the list** - from the first card the counter checks or
  refuses, the page SHALL offer no edit of the list, and an edit or a paste
  sent onto it SHALL be refused by name before anything is written.
- **Editing keeps the submission** - an edit of the list at `planned` or
  `booked` SHALL save the same submission and never a second one, and SHALL
  book nothing: booking is the submission page's.

#### Scenario: grade10-site-grading-submission-lifecycle-SC-50 - Each status offers its own acts and no others
**Serves:** grade10-site-grading-submission-lifecycle-US-11 - the collector reads one page and sees only what they can do now

- **GIVEN** a submission that is ready to collect
- **WHEN** the collector opens the submission page
- **THEN** it offers naming, changing and removing a collector, and vaulting a slab
- **AND** it offers no edit of the list and no withdrawal

#### Scenario: grade10-site-grading-submission-lifecycle-SC-51 - An act on a submission that has moved is refused
**Serves:** grade10-site-grading-submission-lifecycle-US-11 - the collector who acted on a stale page is told rather than surprised

- **GIVEN** a collector reading a handed-in submission whose batch has since closed
- **WHEN** they ask to withdraw a card
- **THEN** it is refused by name and no card is withdrawn

#### Scenario: grade10-site-grading-submission-lifecycle-SC-59 - The counter owns the list from the first card it checks or refuses
**Serves:** grade10-site-grading-submission-lifecycle-US-11 - the collector at the counter is never offered an edit the shop would refuse

- **GIVEN** a booked submission one of whose cards the counter has checked, or
  refused before checking any
- **WHEN** the collector opens the submission page, or sends an edit or a
  paste of the list from a page read before
- **THEN** the page offers no edit of the list
- **AND** the edit and the paste are refused by name, and the cards, their
  photographs and the refusal's words stay as the counter wrote them

#### Scenario: grade10-site-grading-submission-lifecycle-SC-62 - Editing a kept list saves the same submission and books nothing
**Serves:** grade10-site-grading-submission-lifecycle-US-11 - the collector changes the list before hand-in without starting again

- **GIVEN** a planned submission with no drop-off, and a booked submission
  holding one
- **WHEN** the collector edits each list and saves it
- **THEN** each keeps its own submission id, and no second submission is kept
- **AND** the planned one holds no drop-off and the booked one keeps its own,
  so the edit booked nothing
