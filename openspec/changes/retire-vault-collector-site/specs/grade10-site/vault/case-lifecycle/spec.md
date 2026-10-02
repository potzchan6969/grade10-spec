# grade10-site/vault/case-lifecycle Specification

## Feature set

- Moving a case
  - Taken from the collector's own page: the moves that are theirs - calling
    the request off, and asking for the item back - are acts on their own case,
    answered to them alone, whichever screen offers them
- The exits
  - Read in the collector's words: an ended case is read with the reason staff
    gave, who called it off, which clock ran out, or the figure the item
    settled and the dates of the notice behind it

## RENAMED Requirements

- FROM: `### Requirement: The collector's own moves run from their case page`
- TO: `### Requirement: The collector's own moves are acts on their own case`
- FROM: `### Requirement: A case page answers only to the collector whose case it is`
- TO: `### Requirement: A case answers only to the collector whose case it is`

## MODIFIED Requirements

### Requirement: The collector's own moves are acts on their own case

Two moves belong to the collector, and each is an act on the case it is
about, answered to the case's owner alone.

| Move | Taken while | What the act does |
| --- | --- | --- |
| Call the request off | the item is not yet in the vault - `draft`, `submitted`, `under_valuation`, `offer_made`, `accepted` or `signing` | ends the case as `cancelled`, closing the live offer and cancelling the booked visit where either stands |
| Ask for the item back | the item is held and nothing stands against it - a case in the vault owing nothing, or a settled loan | records the ask against the case |

**What it closed** - the answer to a call-off SHALL be the case as ended,
naming the live offer it closed and the visit it cancelled, and naming
neither where neither stood.

**One ask** - an ask for the item back SHALL be recorded once; the same ask
sent again while it stands SHALL answer with the case and record no second
ask.

**Refused by name** - each act SHALL carry the instant the case was read at,
and an act on a case that has moved since, or that stands outside the
statuses the act is taken from, SHALL be refused by name with the case
unchanged.

**Read back** - a case called off SHALL read as an ended case on the next
read, naming the collector as who called it off.

#### Scenario: grade10-site-vault-case-lifecycle-SC-16 - Calling a request off names what it closes
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector ends a request they opened rather than asking staff to

- **GIVEN** a case holding a live offer and a booked visit
- **WHEN** its owner calls the request off
- **THEN** the answer names the offer it closed and the visit it cancelled

#### Scenario: grade10-site-vault-case-lifecycle-SC-17 - A confirmed call-off ends the case and reads back
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector sees their request closed where they closed it

- **GIVEN** a case holding a live offer and a booked visit
- **WHEN** its owner calls the request off
- **THEN** the case is `cancelled`, the offer is closed and the visit is cancelled
- **AND** the next read of the case reads it as ended, naming the collector as who called it off

#### Scenario: grade10-site-vault-case-lifecycle-SC-37 - A confirmation names only what stands open
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector is not told the request closes something it never held

- **GIVEN** a submitted request with no offer made and no visit booked
- **WHEN** its owner calls the request off
- **THEN** the answer names no closed offer and no cancelled visit

#### Scenario: grade10-site-vault-case-lifecycle-SC-18 - Asking for the item back is recorded once
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector asks for their item and reads that the ask stands

- **GIVEN** a case whose item is in the vault with nothing outstanding
- **WHEN** its owner asks for the item back, and the same ask is sent again
- **THEN** the ask is recorded against the case once
- **AND** the second answers with the case and records nothing

#### Scenario: grade10-site-vault-case-lifecycle-SC-19 - A refused move leaves the confirmation open
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector is told why the act they asked for did not run

- **GIVEN** a collector who read their case before the counter moved it
- **WHEN** they call the request off naming the instant they read it at
- **THEN** the act is refused by name as a case that moved
- **AND** the case is unchanged

### Requirement: An ended case reads in the collector's words

A case that ended without a release carries, on its owner's read, what
happened to it.

| Ending | What the read carries |
| --- | --- |
| `declined` | the reason staff gave, verbatim, and the day it closed |
| `cancelled` | who called it off - the collector, staff, or a clock - and the day; the offer that closed and the visit cancelled with it |
| `expired` | the clock that ran out and the day |
| `forfeited` | the figure the item settled, the day the notice was written and the date it gave to pay by |

**One ending per case** - an ended case SHALL carry the ending it took and
the day it closed.

**The clock** - an expired case SHALL carry which clock ran out: the unsent
request untouched, no visit ahead of it, or a missed visit.

**The paper stays** - a case that signed a custody or loan agreement SHALL
keep those documents readable to its owner after it ends.

**Nothing left to do** - an ended case SHALL take no move, as every terminal
status.

#### Scenario: grade10-site-vault-case-lifecycle-SC-20 - A declined case reads the reason staff gave
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector learns why the shop would not take the item

- **GIVEN** a case staff declined with a reason
- **WHEN** its owner reads it
- **THEN** it carries the ending, the day it closed and the reason verbatim

#### Scenario: grade10-site-vault-case-lifecycle-SC-21 - A cancelled case names who called it off
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector sees whether they or the shop closed the case

- **GIVEN** a case cancelled by staff while it held a live offer and a booked visit
- **WHEN** its owner reads it
- **THEN** it carries that staff called it off and the day
- **AND** it carries the offer that closed and the visit cancelled with it

#### Scenario: grade10-site-vault-case-lifecycle-SC-22 - An expired case reads one wording and names its clock on the timeline
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector who stopped answering reads what ended the case

- **GIVEN** two expired cases, one that never booked a visit and one whose booked visit was missed
- **WHEN** their owners read them
- **THEN** both carry the expired ending, and each carries the clock that ran out

#### Scenario: grade10-site-vault-case-lifecycle-SC-23 - A forfeited case names the figure and the notice
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the borrower reads what the item settled and the notice behind it

- **GIVEN** a case forfeited after a written notice
- **WHEN** its owner reads it
- **THEN** it carries the figure the item settled, the day the notice was written and the date it gave to pay by
- **AND** the signed agreements are still readable

### Requirement: A case is read as meeting one fact

Some of what a collector must answer is not a status but a fact read off the
case, its offer and its visit. The owner's read of a case, on their own cases
and on the case alone, SHALL carry what each fact is worked out from, and the
fact SHALL be worked out by these rules at the instant of that read.

| Fact | Read when | What the read gives |
| --- | --- | --- |
| The offer ran out | the offer's expiry has passed and the case is still `offer_made` | the offer that closed, its amount and the day it ran out |
| The offer was declined | the collector declined the offer and the case is back in `under_valuation` | the figure they declined and the day |
| A new offer replaced the last | a later offer stands and the one before it closed | the offer that closed and its day, beside the offer on the table |
| The visit was closed as missed | the booked slot passed, the visit was closed as missed and the case stands where it was | the slot that was missed |
| The item was asked back | an ask for the item back stands | the day the ask was recorded |

**Read, never written** - each fact SHALL be worked out at every read; none
SHALL be stored on the case, and none SHALL be a status.

**A lapsed offer** - the offer's own expiry SHALL decide that the offer ran
out, whether or not a sweep has closed it yet; the case SHALL stay in the
status it held, open for another offer, and an answer to the offer that ran
out SHALL be refused by name.

**A missed visit is the visit's ending** - a case reading a missed visit SHALL
stand where it stood and SHALL take another booking.

**Two facts at once** - where a case meets more than one fact, the fact of the
most recent event SHALL be the one read, and the other SHALL stay on the
case's history.

**Nothing ahead** - a case waiting on nobody but its own clock - terms agreed
or a packet out, with no visit ahead of it - SHALL read as waiting on the
collector, with the day the 30-day clock would call it off.

#### Scenario: grade10-site-vault-case-lifecycle-SC-24 - An offer that ran out reads as run out
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector is not left answering an offer nobody can honour

- **GIVEN** a case whose offer expired yesterday and which no sweep has closed yet
- **WHEN** its owner reads it
- **THEN** it reads that the offer ran out, naming its amount and the day
- **AND** the case is still `offer_made`, open for another offer, and an answer to the closed offer is refused by name

#### Scenario: grade10-site-vault-case-lifecycle-SC-25 - A declined offer leaves the request open
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who said no reads that the shop may still offer again

- **GIVEN** a case whose offer its owner declined
- **WHEN** they read it
- **THEN** it reads that they declined, naming the figure and the day
- **AND** the case is being valued, the booked visit stands, and the collector may still call the request off

#### Scenario: grade10-site-vault-case-lifecycle-SC-26 - A missed visit reads on the case
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who missed a slot reads that the case is still theirs to book

- **GIVEN** a case in the vault whose booked visit was closed as missed
- **WHEN** its owner reads it
- **THEN** it reads that the visit was missed, naming the slot
- **AND** the case stands where it stood and takes another booking

#### Scenario: grade10-site-vault-case-lifecycle-SC-27 - An ask for the item back reads on the case
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who asked for their item reads what happens next

- **GIVEN** a case whose item is held and whose owner has asked for it back
- **WHEN** they read it
- **THEN** it reads the ask and the day it was recorded
- **AND** the case takes a pickup booking, and the same ask sent again records nothing

#### Scenario: grade10-site-vault-case-lifecycle-SC-28 - A case with no visit ahead asks for one
**Serves:** grade10-site-vault-case-lifecycle-US-02 - the collector is told what will end the case before it ends

- **GIVEN** a case whose terms were agreed with no visit ahead of it
- **WHEN** its owner reads it
- **THEN** it reads as waiting on them
- **AND** it names the day the 30-day clock would call the case off

#### Scenario: grade10-site-vault-case-lifecycle-SC-40 - A case meeting two facts reads the later one
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector is given one thing to do next, not two

- **GIVEN** a case whose offer ran out on Monday and whose booked visit was closed as missed on Wednesday
- **WHEN** its owner reads it
- **THEN** it reads the missed visit, the later of the two, and the case takes another booking
- **AND** the offer that ran out stays on the case's history

#### Scenario: grade10-site-vault-case-lifecycle-SC-29 - Nothing derived is written down
**Serves:** Derived at the read - a fact nobody stored can never disagree with the case it came from

- **WHEN** any of these facts is read on a case
- **THEN** the case's status, its offer and its visit are unchanged
- **AND** the fact is held nowhere between reads

### Requirement: A case reads the stage it has reached and whose the item is

Every case reads how far along its lane it is and who holds the item now,
both worked out from the owner's read of the case at the instant of that read.

| Stage | The statuses it covers |
| --- | --- |
| Request | `draft`, `submitted` |
| Valued | `under_valuation` |
| Offer | `offer_made` |
| Agreed | `accepted` |
| Signed | `signing` |
| Vault | `vaulted` |
| Loan | `active`, `repaid` |
| Home | `released` |

| Whose the item is | Read when | What it carries |
| --- | --- | --- |
| With you | `draft` | nothing |
| Waiting on you | the fact read is a missed visit or an ask for the item back, or the case stands at `offer_made` reading no fact | nothing |
| Waiting on you | terms agreed with no visit ahead of it | the 30-day clock that would call the case off |
| With us | the fact read is an offer that ran out, was declined or was replaced, or the case stands at `submitted`, `under_valuation`, `signing` or `vaulted` on either lane reading no fact | the day the item has been held since, once it is in the vault |
| Visit | terms agreed with a visit ahead of it | the day of the visit |
| Due | a loan running before its due date | the due date |
| Past due | a loan running after its due date | how many days past due |
| Settled | `repaid` | the day it settled |
| Collected | `released` | the day it was collected |
| Closed | `declined`, `cancelled`, `expired`, `forfeited` | the day it closed |

**The financed lane walks eight stages** and the storage lane the same list
without Offer and Loan, so a storage case walks six.

**Where the case is** - the stage the status covers SHALL read as the one in
progress, every earlier stage as done and every later one as still to come.

**An ended case stops where it ended** - the read SHALL carry the stage it
ended at, which SHALL stay the one in progress, with the ending beside it.

**The fact decides, else the status** - where the case reads a fact, that
fact's row SHALL decide whose the item is; where it reads none, the status
SHALL.

**One clock** - a day, a deadline and a count of days SHALL be read on the
brand's own zone, which `shared/dates-and-times` states, from the one instant
the worker's read names.

**The list reads the same** - each case on the collector's own cases SHALL
carry what its stage and whose the item is are worked out from, so the list
and the case read the same answer.

**Read, never written** - neither the stage nor whose the item is SHALL be
stored on the case.

#### Scenario: grade10-site-vault-case-lifecycle-SC-30 - A financed case walks eight stages
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector reads how far along the case is without counting statuses

- **GIVEN** a financed case whose item is in the vault
- **WHEN** its owner reads it
- **THEN** it reads eight stages from Request to Home, with Vault in progress
- **AND** every earlier stage reads as done and every later one as still to come

#### Scenario: grade10-site-vault-case-lifecycle-SC-31 - A storage case walks six
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector on the storage lane is shown no stage their case never takes

- **GIVEN** a storage case being valued
- **WHEN** its owner reads it
- **THEN** it reads six stages, with no Offer and no Loan stage
- **AND** Valued reads as the stage in progress

#### Scenario: grade10-site-vault-case-lifecycle-SC-32 - An ended case stops at the stage it ended on
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector sees where the case had reached when it closed

- **GIVEN** a case cancelled while its terms were agreed
- **WHEN** its owner reads it
- **THEN** Agreed reads as the stage in progress
- **AND** the ending is carried beside it

#### Scenario: grade10-site-vault-case-lifecycle-SC-33 - A case waiting on the collector says so
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector can tell at a glance which cases need them

- **GIVEN** a case holding a live offer
- **WHEN** its owner reads it
- **THEN** it reads that the case is waiting on them

#### Scenario: grade10-site-vault-case-lifecycle-SC-34 - A held item reads the same on the list and the case
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector reads one answer for where the item is, wherever they look

- **GIVEN** a storage case whose item is in the vault
- **WHEN** its owner reads their own cases and then the case
- **THEN** both read that the item is with us, naming the day it has been held since

#### Scenario: grade10-site-vault-case-lifecycle-SC-38 - A vaulted case reads With us on either lane
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector whose item is in the vault reads one answer, whichever lane they walk

- **GIVEN** a financed case whose item is in the vault with no advance paid out yet
- **WHEN** its owner reads it
- **THEN** it reads that the item is with us, naming the day it has been held since

#### Scenario: grade10-site-vault-case-lifecycle-SC-35 - A released case reads collected
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector who took the item home reads that the case is done

- **GIVEN** a case whose item was released
- **WHEN** its owner reads it
- **THEN** it reads that the item was collected, naming the day

#### Scenario: grade10-site-vault-case-lifecycle-SC-36 - An ended case reads closed
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector reads that nothing is held for them any more

- **GIVEN** a case that expired on an abandonment clock
- **WHEN** its owner reads it
- **THEN** it reads that the case is closed, naming the day

### Requirement: A case answers only to the collector whose case it is

A case belongs to one collector, and the worker tells nobody else that it
exists.

**One answer for both** - a read of, or an act on, an id that answers to no
case and a case belonging to another collector SHALL both be refused as the
same case not found.

**No distinction** - the refusal SHALL carry nothing that tells the two
apart.

#### Scenario: grade10-site-vault-case-lifecycle-SC-39 - Another collector's case reads as not found
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who opens a case that is not theirs learns nothing about it

- **GIVEN** a signed-in collector and a case belonging to somebody else
- **WHEN** they read it or answer its offer by its id
- **THEN** they are refused with the same not found an id nobody was issued answers
- **AND** nothing in the refusal says which of the two they met

### Requirement: A draft staff opened ends silently and leaves nothing on the account

A draft staff opened at the counter ends the way any unsent request does, and
its address was typed rather than proven, so its endings tell nobody and the
account keeps nothing of it.

- **The clock** - it SHALL end as `expired` on the unsent request's own clock,
  7 days from its last touch, an edit by the collector being a touch.
- **The cancel** - staff SHALL be able to cancel it while it is unsent, and so
  SHALL the collector.
- **Silent** - neither ending SHALL tell anybody, as
  `grade10-site/vault/collector-notifications` states.
- **Removed** - when staff cancel it, or its clock ends it, whoever has signed
  in to the account since, the draft and every photograph on it SHALL be
  removed from the account in the same step: the account's own cases SHALL
  NOT list it, a read of it by its id SHALL answer not found to the account,
  the account's own data SHALL NOT hold it, and no photograph of it SHALL be
  served. The account SHALL stay as it was, and the case's reference SHALL
  stay spent. The case SHALL stay in staff's Closed view under its reference,
  its item reading as erased and naming no collector.
- **The collector's own cancel** - a draft staff opened that the collector
  cancels SHALL end as any cancelled draft and stay on their own cases.
- **Opened again** - staff SHALL be able to open another walk-in for the right
  address once the draft typed wrong is cancelled.
- **Once sent** - a draft staff opened that the collector has sent SHALL be
  cancelled, told and kept as any case, and a cancel sent against a read made
  while it was unsent SHALL be refused by name as a case that moved.

#### Scenario: grade10-site-vault-case-lifecycle-SC-41 - A walk-in typed wrong is cancelled and leaves nothing
**Serves:** grade10-site-vault-case-lifecycle-US-06 - the operator undoes a draft opened under the wrong address

- **GIVEN** a draft staff opened under a mistyped address, carrying two photographs
- **WHEN** staff cancel it
- **THEN** the case is `cancelled`
- **AND** the account at that address lists nothing of it among its own cases, a read of it by its id answers not found to that account, and neither photograph is served
- **AND** staff's Closed view lists it under its reference, its item reading as erased and no collector named
- **AND** nobody is emailed

#### Scenario: grade10-site-vault-case-lifecycle-SC-42 - The walk-in opens again under the right address
**Serves:** grade10-site-vault-case-lifecycle-US-06 - the operator serves the customer under the address they meant

- **GIVEN** a draft staff opened under a mistyped address and then cancelled
- **WHEN** staff open a walk-in for the right address
- **THEN** a new draft opens under that address's account, with a reference of its own and not the cancelled draft's

#### Scenario: grade10-site-vault-case-lifecycle-SC-43 - An unsent walk-in runs out and leaves nothing
**Serves:** Clocks - the sweep that ends a draft staff opened and nobody sent

- **GIVEN** a draft staff opened and untouched for 8 days
- **WHEN** the clocks are read
- **THEN** the case is `expired`, the account lists nothing of it among its own cases, and nobody is told

#### Scenario: grade10-site-vault-case-lifecycle-SC-44 - The collector's own cancel keeps the draft on their list
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector calls off a request staff opened for them

- **GIVEN** a draft staff opened under the collector's account
- **WHEN** the collector cancels it
- **THEN** the case is `cancelled` and stays on their own cases as a cancelled request
- **AND** nobody is emailed

#### Scenario: grade10-site-vault-case-lifecycle-SC-45 - A walk-in the collector sent is cancelled as any case
**Serves:** grade10-site-vault-case-lifecycle-US-06 - the operator cancels a walk-in that is no longer a draft

- **GIVEN** a draft staff opened that the collector has sent
- **WHEN** staff cancel it
- **THEN** the case is `cancelled` and stays on the collector's own cases with its photographs
- **AND** the collector is told, as on any case

#### Scenario: grade10-site-vault-case-lifecycle-SC-46 - A cancel read before the collector sent is refused
**Serves:** grade10-site-vault-case-lifecycle-US-06 - the counter and the collector act on one walk-in at once

- **GIVEN** a draft staff opened, read by an operator while it was unsent
- **WHEN** the collector sends it, and the operator then cancels it from the page they read
- **THEN** the cancel is refused by name as a case that moved
- **AND** the case stays submitted, on the collector's own cases, with its photographs

#### Scenario: grade10-site-vault-case-lifecycle-SC-47 - The collector's edit restarts the draft's clock
**Serves:** Clocks - a walk-in the collector is still working on

- **GIVEN** a draft staff opened on day 0, whose title the collector changed on day 5
- **WHEN** the clocks are read on day 8, and again on day 13
- **THEN** on day 8 the draft stands, and by day 13 it has run out, been removed from the account, and nobody was told

#### Scenario: grade10-site-vault-case-lifecycle-SC-48 - Staff's cancel removes the draft after someone signed in
**Serves:** grade10-site-vault-case-lifecycle-US-06 - a sign-in at a mistyped address does not keep someone else's draft

- **GIVEN** a draft staff opened, and someone who has since signed in to that account without sending it
- **WHEN** staff cancel it
- **THEN** it is removed from the account, as an unsent walk-in is, and nobody is emailed
