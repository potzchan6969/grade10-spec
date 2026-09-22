# grade10-site/vault/case-lifecycle Specification

## Purpose

The case machine: fourteen statuses, two lanes through them, the clocks that
end a case nobody came back to, the exits that are not a release, and the facts
a case is read as meeting without any of them becoming a status.

One case is one item and one collector. Which lane it walks was decided at
intake (`grade10-site/vault/case-intake`); what each move needs before it may
run is stated by the capability that owns the move — the visit
(`grade10-site/vault/visit-booking`), the offer
(`grade10-site/vault/valuation-and-offer`), the paper
(`grade10-site/vault/documents-and-signing`), the money
(`grade10-site/vault/loan-and-settlement`).

## Feature set

- The statuses
  - One status column: a case holds exactly one status, and it is the only
    thing a move writes
  - Two lanes, one machine: the financed lane adds the offer and the loan, and
    nothing else forks
  - What is not a status: a booking and an overdue loan are answers to
    questions, not states
- Moving a case
  - Guarded moves: a move runs only from the statuses it names, and a case
    that moved under the caller is refused by name
  - One history: every move and every plain record appends to the case's own
    history, in the move's own transaction
  - Actor on the record: each entry names who acted — the collector, a member
    of staff, or a sweep
  - Taken from the collector's own page: the moves that are theirs — calling
    the request off, and asking for the item back — run from the case, each
    behind a confirmation naming what it closes
- Clocks
  - Abandonment clocks: a case nobody came back to ends on its own clock and
    never on a missed visit
  - No clock on a settled loan: a repaid case waits for its owner, because
    storage is free
- The exits
  - Ends that are not a release: declined, cancelled, expired, forfeited
  - Cancel before custody: the case's owner may call it off until the item is
    in the vault
  - Nothing unwinds past a live advance: once money stands, the ways out are
    repayment and forfeiture
  - Two moves back: a corrected advance and a corrected repayment each put the
    case where the money leaves it
  - Read in the collector's words: an ended case says the reason staff gave,
    who called it off, which clock ran out, or the figure the item settled
    and the dates of the notice behind it
- Derived at the read
  - The fact the case meets: a lapsed, declined or superseded offer, a visit
    closed as missed and an ask for the item back, each with the one thing to
    do next
  - A lapsed offer reads as lapsed: the offer's own expiry decides it at the
    read, and the case stays where it was, open for another offer
  - Where the case stands: the stage on the lane the case walks, read from the
    status and never stored
  - Whose the item is: one word from the status, the offer and the due date
  - No status for any of it: nothing derived is written down, so a fact can
    never disagree with the case it was read from

## ADDED Requirements

### Requirement: The collector's own moves run from their case page

Two moves belong to the collector, and both run from the case they are about.

| Move | Offered while | The confirmation names | What confirming does |
| --- | --- | --- | --- |
| Call the request off | the item is not yet in the vault — `draft`, `submitted`, `under_valuation`, `offer_made`, `accepted` or `signing` | the live offer it closes and the visit it cancels | ends the case as `cancelled` |
| Ask for the item back | the item is held and nothing stands against it — a case in the vault owing nothing, or a settled loan — and no ask stands already | that the item leaves on a pickup visit against a signed release | records the ask against the case |

**Confirmation first** — each move SHALL ask for confirmation before it runs,
and the case SHALL be unchanged while that confirmation stands.

**One ask** — an ask for the item back SHALL be recorded once, and the move
SHALL NOT be offered again while that ask stands.

**Refused in the open** — a move the case refuses SHALL leave the confirmation
open carrying the refusal by name, and the case SHALL be read again.

**Read back** — a case called off from its page SHALL read as an ended case on
the next read.

#### Scenario: grade10-site-vault-case-lifecycle-SC-16 - Calling a request off names what it closes
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector ends a request they opened rather than asking staff to

- **GIVEN** a case holding a live offer and a booked visit
- **WHEN** its owner asks to call the request off
- **THEN** a confirmation names the offer it closes and the visit it cancels
- **AND** the case is unchanged until they confirm

#### Scenario: grade10-site-vault-case-lifecycle-SC-17 - A confirmed call-off ends the case and reads back
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector sees their request closed where they closed it

- **GIVEN** a collector reading the call-off confirmation on their own case
- **WHEN** they confirm it
- **THEN** the case is `cancelled`, the offer is closed and the visit is cancelled
- **AND** the case reads as an ended case naming who called it off

#### Scenario: grade10-site-vault-case-lifecycle-SC-18 - Asking for the item back is recorded once
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector asks for their item and reads that the ask stands

- **GIVEN** a case whose item is in the vault with nothing outstanding
- **WHEN** its owner asks for the item back and confirms
- **THEN** the ask is recorded against the case
- **AND** the move is no longer offered while that ask stands

#### Scenario: grade10-site-vault-case-lifecycle-SC-19 - A refused move leaves the confirmation open
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector is told why the act they asked for did not run

- **GIVEN** a collector confirming a move on a case that has moved under them
- **WHEN** the move is refused
- **THEN** the confirmation stays open carrying the refusal by name
- **AND** the case is read again

### Requirement: An ended case reads in the collector's words

A case that ended without a release says what happened to it, in the words the
collector would use.

| Ending | What the case names |
| --- | --- |
| `declined` | the reason staff gave, verbatim; that the item stayed with the collector and any visit was cancelled |
| `cancelled` | who called it off — the collector, staff, or a clock — and the day; the offer that closed and the visit cancelled with it |
| `expired` | which clock ran out; that nothing was signed and the item never left |
| `forfeited` | the figure the item settled, the day the notice was written and the date it gave to pay by |

**One ending per case** — an ended case SHALL name the ending it took and the
day it closed.

**The paper stays** — a case that signed a custody or loan agreement SHALL keep
those documents readable after it ends.

**Nothing left to do** — an ended case SHALL offer no move on itself, and SHALL
offer starting another request instead.

#### Scenario: grade10-site-vault-case-lifecycle-SC-20 - A declined case reads the reason staff gave
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector learns why the shop would not take the item

- **GIVEN** a case staff declined with a reason
- **WHEN** its owner reads it
- **THEN** it names the ending, the day it closed and the reason verbatim
- **AND** it offers starting another request

#### Scenario: grade10-site-vault-case-lifecycle-SC-21 - A cancelled case names who called it off
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector sees whether they or the shop closed the case

- **GIVEN** a case cancelled by staff while it held a live offer and a booked visit
- **WHEN** its owner reads it
- **THEN** it names that staff called it off and the day
- **AND** it names the offer that closed and the visit cancelled with it

#### Scenario: grade10-site-vault-case-lifecycle-SC-22 - An expired case names the clock that ran out
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector who stopped answering reads what ended the case

- **GIVEN** a case expired by an abandonment clock
- **WHEN** its owner reads it
- **THEN** it names which clock ran out
- **AND** it says nothing was signed and the item never left

#### Scenario: grade10-site-vault-case-lifecycle-SC-23 - A forfeited case names the figure and the notice
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the borrower reads what the item settled and the notice behind it

- **GIVEN** a case forfeited after a written notice
- **WHEN** its owner reads it
- **THEN** it names the figure the item settled, the day the notice was written and the date it gave to pay by
- **AND** the signed agreements are still readable

### Requirement: A case is read as meeting one fact

Some of what a collector must answer is not a status but a fact read off the
case, its offer and its visit.

| Fact | Read when | What the collector reads | The one thing to do next |
| --- | --- | --- | --- |
| The offer ran out | the offer's expiry has passed and the case is still `offer_made` | the offer that closed, its amount and the day it ran out | wait for another offer; the request is still open |
| The offer was declined | the collector declined the offer and the case is back in `under_valuation` | the figure they declined and the day | wait for another offer, or call the request off |
| A new offer replaced the last | a later offer stands and the one before it closed | the offer that closed and its day, beside the offer on the table | answer the offer that stands |
| The visit was closed as missed | the booked slot passed, the visit was closed as missed and the case stands where it was | the slot that was missed | book another visit |
| The item was asked back | an ask for the item back stands | the day the ask was recorded | book a pickup visit |

**Read, never written** — each fact SHALL be worked out at every read; none
SHALL be stored on the case, and none SHALL be a status.

**A lapsed offer** — the offer's own expiry SHALL decide that the offer ran
out, whether or not a sweep has closed it yet; the case SHALL stay in the
status it held, open for another offer, and SHALL offer no answer to the offer
that ran out.

**A missed visit is the visit's ending** — a case reading a missed visit SHALL
stand where it stood and SHALL offer another visit.

**Nothing ahead** — a case waiting on nobody but its own clock — terms agreed
or a packet out, with no visit ahead of it — SHALL ask for a visit and name the
30-day clock that would call it off.

#### Scenario: grade10-site-vault-case-lifecycle-SC-24 - An offer that ran out reads as run out
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector is not left answering an offer nobody can honour

- **GIVEN** a case whose offer expired yesterday and which no sweep has closed yet
- **WHEN** its owner reads it
- **THEN** it reads that the offer ran out, naming its amount and the day
- **AND** the case is still `offer_made`, open for another offer, and offers no answer to the closed offer

#### Scenario: grade10-site-vault-case-lifecycle-SC-25 - A declined offer leaves the request open
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who said no reads that the shop may still offer again

- **GIVEN** a case whose offer its owner declined
- **WHEN** they read it
- **THEN** it reads that they declined, naming the figure and the day
- **AND** the case is being valued, the booked visit stands, and calling the request off is still offered

#### Scenario: grade10-site-vault-case-lifecycle-SC-26 - A missed visit reads on the case
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who missed a slot reads that the case is still theirs to book

- **GIVEN** a case in the vault whose booked visit was closed as missed
- **WHEN** its owner reads it
- **THEN** it reads that the visit was missed, naming the slot
- **AND** the case stands where it stood and offers another visit

#### Scenario: grade10-site-vault-case-lifecycle-SC-27 - An ask for the item back reads on the case
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who asked for their item reads what happens next

- **GIVEN** a case whose item is held and whose owner has asked for it back
- **WHEN** they read it
- **THEN** it reads the ask and the day it was recorded
- **AND** it offers a pickup visit and does not offer the ask again

#### Scenario: grade10-site-vault-case-lifecycle-SC-28 - A case with no visit ahead asks for one
**Serves:** grade10-site-vault-case-lifecycle-US-02 - the collector is told what will end the case before it ends

- **GIVEN** a case whose terms were agreed with no visit ahead of it
- **WHEN** its owner reads it
- **THEN** it asks them to book a visit
- **AND** it names the 30-day clock that would call the case off

#### Scenario: grade10-site-vault-case-lifecycle-SC-29 - Nothing derived is written down
**Serves:** Derived at the read - a fact nobody stored can never disagree with the case it came from

- **WHEN** any of these facts is read on a case
- **THEN** the case's status, its offer and its visit are unchanged
- **AND** the fact is held nowhere between reads

### Requirement: A case reads the stage it has reached and whose the item is

Every case says how far along its lane it is and who holds the item now, both
worked out from the status at the read.

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
| Waiting on you | a live offer stands, a visit was closed as missed, or an ask for the item back stands | nothing |
| With us | `submitted`, `under_valuation`, an offer that ran out or was declined, `signing`, or `vaulted` on the storage lane | the day the item has been held since, once it is in the vault |
| Visit | terms agreed with a visit ahead of it | the day of the visit |
| Due | a loan running before its due date | the due date |
| Past due | a loan running after its due date | how many days past due |
| Settled | `repaid` | the day it settled |
| Collected | `released` | the day it was collected |
| Closed | `declined`, `cancelled`, `expired`, `forfeited` | the day it closed |

**The financed lane walks eight stages** and the storage lane the same list
without Offer and Loan, so a storage case walks six.

**Where the case is** — the stage the status covers SHALL read as the one in
progress, every earlier stage as done and every later one as still to come.

**An ended case stops where it ended** — the stage it ended at SHALL stay the
one in progress, with the ending named beside it.

**One clock** — a day, a deadline and a count of days SHALL be read on the
shop's clock from one instant per read.

**The list reads the same** — the case list SHALL read each case's stage and
whose the item is by these same rules.

**Read, never written** — neither the stage nor whose the item is SHALL be
stored on the case.

#### Scenario: grade10-site-vault-case-lifecycle-SC-30 - A financed case walks eight stages
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector reads how far along the case is without counting statuses

- **GIVEN** a financed case whose item is in the vault
- **WHEN** its owner reads it
- **THEN** it shows eight stages from Request to Home, with Vault in progress
- **AND** every earlier stage reads as done and every later one as still to come

#### Scenario: grade10-site-vault-case-lifecycle-SC-31 - A storage case walks six
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector on the storage lane is shown no stage their case never takes

- **GIVEN** a storage case being valued
- **WHEN** its owner reads it
- **THEN** it shows six stages, with no Offer and no Loan stage
- **AND** Valued reads as the stage in progress

#### Scenario: grade10-site-vault-case-lifecycle-SC-32 - An ended case stops at the stage it ended on
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector sees where the case had reached when it closed

- **GIVEN** a case cancelled while its terms were agreed
- **WHEN** its owner reads it
- **THEN** Agreed reads as the stage in progress
- **AND** the ending is named beside it

#### Scenario: grade10-site-vault-case-lifecycle-SC-33 - A case waiting on the collector says so
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector can tell at a glance which cases need them

- **GIVEN** a case holding a live offer
- **WHEN** its owner reads it
- **THEN** it reads that the case is waiting on them

#### Scenario: grade10-site-vault-case-lifecycle-SC-34 - A held item reads the same on the list and the case
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector reads one answer for where the item is, wherever they look

- **GIVEN** a storage case whose item is in the vault
- **WHEN** its owner reads the case list and then the case
- **THEN** both read that the item is with us, naming the day it has been held since

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
