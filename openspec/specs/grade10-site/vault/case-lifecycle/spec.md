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
  - Taken from the collector's own page: the moves that are theirs - calling
    the request off, and asking for the item back - are acts on their own case,
    answered to them alone, whichever screen offers them
  - The register told: starting the valuation registers the item, vaulting
    marks it, and release, unwind and forfeit close the mark, a forfeit
    naming the lender
  - The owner on the register: preparing documents registers the item if
    nothing has yet, and is refused while the register names an owner other
    than the case's collector or reads the item as retired
- Clocks
  - Abandonment clocks: a case nobody came back to ends on its own clock and
    never on a missed visit
  - No clock on a settled loan: a repaid case waits for its owner, because
    storage is free
  - A draft staff opened: ends on the unsent draft's own clock, with no
    email
- The exits
  - Ends that are not a release: declined, cancelled, expired, forfeited
  - Cancel before custody: the case's owner may call it off until the item is
    in the vault
  - Nothing unwinds past a live advance: once money stands, the ways out are
    repayment and forfeiture
  - Two moves back: a corrected advance and a corrected repayment each put the
    case where the money leaves it
  - Read in the collector's words: an ended case is read with the reason staff
    gave, who called it off, which clock ran out, or the figure the item
    settled and the dates of the notice behind it
  - A walk-in typed wrong: staff cancel the unsent draft they opened, and the
    account at the wrong address keeps nothing of it
- Derived at the read
  - The fact the case meets: a lapsed, declined or superseded offer, a visit
    closed as missed and an ask for the item back, each with the one thing to
    do next
  - A lapsed offer reads as lapsed: the offer's own expiry decides it at the
    read, and the case stays where it was, open for another offer
  - Where the case stands: the stage on the lane the case walks, read from the
    status and never stored
  - Whose the item is: one word from the fact the case reads, its status and
    the due date
  - No status for any of it: nothing derived is written down, so a fact can
    never disagree with the case it was read from

## Requirements

### Requirement: A case holds one of fourteen statuses

A case SHALL hold exactly one status, from this set:

| Status | What it means |
| --- | --- |
| `draft` | opened and not yet sent in |
| `submitted` | sent in, waiting for the shop to pick it up |
| `under_valuation` | staff are valuing the item |
| `offer_made` | the financed lane's terms are on the table |
| `accepted` | terms agreed, on either lane |
| `signing` | a packet is out for signature |
| `vaulted` | the item is in a shop's vault |
| `active` | the advance is recorded and the loan is running |
| `repaid` | the loan is settled and the item is still held |
| `released` | the item has gone home |
| `declined` | the shop refused the item |
| `cancelled` | the case was called off |
| `expired` | a clock ran out |
| `forfeited` | the item settled the debt |

`released`, `declined`, `cancelled`, `expired` and `forfeited` SHALL be
terminal: no move leaves them.

Whether a case holds a visit and whether a loan is overdue SHALL NOT be
statuses. A visit is a fact the diary owns and the case caches; overdue is the
loan's arithmetic against a clock.

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-tro rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-01 - A terminal case takes no move
**Serves:** grade10-site-vault-case-lifecycle-US-03 - Operator moves a case through the counter without stepping over a guard

- **GIVEN** a case that has been released
- **WHEN** any move is asked of it
- **THEN** it is refused by name and the case does not change

### Requirement: The two lanes walk one machine

A financed case SHALL walk `draft → submitted → under_valuation → offer_made →
accepted → signing → vaulted → active → repaid → released`.

A storage case SHALL walk `draft → submitted → under_valuation → accepted →
signing → vaulted → released`, and SHALL never hold an offer, an advance or a
balance.

A financed case whose terms are agreed as custody alone SHALL walk the storage
case's path from `under_valuation`, and SHALL hold no offer, advance or balance.

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-ya9 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-02 - A storage case agrees terms without an offer
**Serves:** The statuses - a storage case agrees terms without an offer

- **GIVEN** a storage case being valued
- **WHEN** its custody terms are agreed at the counter
- **THEN** the case is `accepted` with no offer against it

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-hp9 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-15 - A loan request stored on custody terms walks the storage path
**Serves:** The statuses - a loan request stored on custody terms walks the storage path

- **GIVEN** a financed case being valued, with no offer on the table
- **WHEN** its custody terms are agreed at the counter
- **THEN** the case is `accepted` with no offer, signs the custody agreement alone, and is released from `vaulted` owing nothing

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-yda rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-03 - A storage case owes nothing
**Serves:** The statuses - a storage case owes nothing

- **GIVEN** a storage case in the vault
- **WHEN** a repayment is offered against it
- **THEN** it is refused by name as a case that owes nothing

### Requirement: Every move is guarded, recorded and refused when the case has moved

A move SHALL run only from the statuses it names, and SHALL be refused by name
when the case is in any other status — including when it moved between the
caller reading it and the move landing.

Every move, and every record that moves nothing, SHALL append one entry to the
case's own history in the same transaction as the write it describes. The
entry SHALL name what happened, who did it — the collector, a member of staff,
or a sweep — and the statuses it moved between.

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-vvb rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-04 - A case that moved under the caller is refused
**Serves:** grade10-site-vault-case-lifecycle-US-03 - Operator moves a case through the counter without stepping over a guard

- **GIVEN** two operators reading one case being valued
- **WHEN** both send the same move
- **THEN** one is applied and the other is refused by name

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-an5 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-05 - The history has no gaps
**Serves:** grade10-site-vault-case-lifecycle-US-03 - Operator moves a case through the counter without stepping over a guard

- **WHEN** any move or record is made on a case
- **THEN** the case's history carries an entry for it naming the actor
- **AND** a failure that leaves the case unmoved leaves no entry

### Requirement: A case nobody came back to ends on its own clock

Each clock SHALL be measured as stated here, and nothing SHALL end a case for
a visit it missed except a case that has nothing else holding it:

| Clock | Runs from | Length | What ends |
| --- | --- | --- | --- |
| Unsent request untouched | last touch | 7 days | the case, as `expired` |
| Submitted with no visit ahead of it | when it was sent in | 30 days | the case, as `expired` |
| Accepted with no visit ahead of it | the move into `accepted` | 30 days | the case, as `cancelled` |
| Signing, nothing executed, no visit ahead of it | the move into `signing` | 30 days | the case, as `cancelled` |
| Missed visit on a submitted case | the slot | 24 hours | the case, as `expired` |
| Missed visit on any other case | the slot | 24 hours | the visit only |

An abandonment clock SHALL be anchored on the history entry that moved the
case into the status it is sitting in, never on when the case was last
touched, so a background repair or a cancelled visit cannot push a deadline
out.

A case in `repaid` SHALL run no clock: the loan is settled, the item is the
collector's, and storage is free.

A case with a visit still ahead of it SHALL NOT be ended by an abandonment
clock; a case whose ceremony is still open or whose signed set already covers
its lane SHALL NOT be ended either.

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-lz5 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-06 - An abandoned agreement ends after a month
**Serves:** grade10-site-vault-case-lifecycle-US-02 - Collector who stops answering is not left with an open case

- **GIVEN** a case that agreed terms 31 days ago, with no visit ahead of it
- **WHEN** the clocks are read
- **THEN** the case is `cancelled` and the collector is told

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-33a rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-07 - A collector who rebooked keeps their case
**Serves:** grade10-site-vault-case-lifecycle-US-02 - Collector who stops answering is not left with an open case

- **GIVEN** a case that agreed terms 31 days ago and holds a visit next week
- **WHEN** the clocks are read
- **THEN** the case is left exactly where it is

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-z0u rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-08 - A settled loan waits for its owner
**Serves:** grade10-site-vault-case-lifecycle-US-02 - Collector who stops answering is not left with an open case

- **GIVEN** a case that repaid its loan six months ago and still holds the item
- **WHEN** the clocks are read
- **THEN** the case is left exactly where it is and nothing is owed for keeping it

### Requirement: The case's owner may call it off before custody

The collector SHALL be able to cancel their own case from any status before
the item is in the vault — `draft`, `submitted`, `under_valuation`,
`offer_made`, `accepted` or `signing` — and staff SHALL be able to cancel it
from the same statuses. Whatever offer is live SHALL close in the same
transaction, any visit SHALL be cancelled with the case, and the collector
SHALL be told — except on a draft staff opened, whose cancel tells nobody, as
"A draft staff opened ends silently and leaves nothing on the account" states.

Staff SHALL be able to decline an item while it is being valued, with a reason
the collector reads verbatim.

Once the item is in the vault, the case SHALL be callable off only by staff,
and only while no advance stands against it; that unwind SHALL run the release
machinery and sign no release document.

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-0gz rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-09 - A collector cancels an offer they were made
**Serves:** grade10-site-vault-case-lifecycle-US-01 - Collector calls off a request before the item is in the vault

- **GIVEN** a case holding a live offer and a booked visit
- **WHEN** its owner cancels the case
- **THEN** the case is `cancelled`, the offer is closed, the visit is cancelled and the collector is told

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-vch rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-10 - A case in the vault is not the collector's to cancel
**Serves:** grade10-site-vault-case-lifecycle-US-01 - Collector calls off a request before the item is in the vault

- **GIVEN** a case whose item is in the vault
- **WHEN** its owner asks to cancel it
- **THEN** it is refused by name

### Requirement: Nothing unwinds past a live advance

While an advance stands against a case, the case SHALL leave `active` only by
being repaid, by being forfeited, or by that advance being corrected. An
unwind from the vault SHALL be refused by name while an advance stands.

A corrected advance SHALL return the case to `vaulted`, where it may be
advanced against again. A corrected repayment on a settled loan SHALL reopen
it to `active`. The machine SHALL hold no other move back.

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-am3 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-11 - An unwind is refused past the advance
**Serves:** grade10-site-vault-case-lifecycle-US-03 - Operator moves a case through the counter without stepping over a guard

- **GIVEN** a case with an advance recorded against it
- **WHEN** staff try to unwind it from the vault
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-act rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-12 - A corrected advance returns the case to the vault
**Serves:** The exits - a corrected advance returns the case to the vault

- **GIVEN** an active case whose advance is taken back in full
- **WHEN** the correction is recorded
- **THEN** the case is `vaulted` and may be advanced against again

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-dm6 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-13 - A corrected repayment reopens the loan
**Serves:** The exits - a corrected repayment reopens the loan

- **GIVEN** a repaid case whose last repayment is taken back
- **WHEN** the correction is recorded
- **THEN** the case is `active` and the balance is what it would have been had the record never been written

### Requirement: An ended case keeps the record of its visit

A case that has ended SHALL keep the visit it cached. The record of where the
item went SHALL NOT be cleared by the ending, and clearing it SHALL NOT be
read as a cancellation nobody made.

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-k7x rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-14 - The visit outlives the case
**Serves:** Moving a case - the visit outlives the case

- **GIVEN** a case that was released after a pickup visit
- **WHEN** the case is read afterwards
- **THEN** it still names the visit the item went home on

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

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-u1t rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-20 - A declined case reads the reason staff gave
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector learns why the shop would not take the item

- **GIVEN** a case staff declined with a reason
- **WHEN** its owner reads it
- **THEN** it carries the ending, the day it closed and the reason verbatim

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-qy1 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-21 - A cancelled case names who called it off
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector sees whether they or the shop closed the case

- **GIVEN** a case cancelled by staff while it held a live offer and a booked visit
- **WHEN** its owner reads it
- **THEN** it carries that staff called it off and the day
- **AND** it carries the offer that closed and the visit cancelled with it

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-kil rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-22 - An expired case reads one wording and names its clock on the timeline
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector who stopped answering reads what ended the case

- **GIVEN** two expired cases, one that never booked a visit and one whose booked visit was missed
- **WHEN** their owners read them
- **THEN** both carry the expired ending, and each carries the clock that ran out

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-fp8 rev=1 -->
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

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-8ne rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-24 - An offer that ran out reads as run out
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector is not left answering an offer nobody can honour

- **GIVEN** a case whose offer expired yesterday and which no sweep has closed yet
- **WHEN** its owner reads it
- **THEN** it reads that the offer ran out, naming its amount and the day
- **AND** the case is still `offer_made`, open for another offer, and an answer to the closed offer is refused by name

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-8m9 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-25 - A declined offer leaves the request open
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who said no reads that the shop may still offer again

- **GIVEN** a case whose offer its owner declined
- **WHEN** they read it
- **THEN** it reads that they declined, naming the figure and the day
- **AND** the case is being valued, the booked visit stands, and the collector may still call the request off

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-5rw rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-26 - A missed visit reads on the case
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who missed a slot reads that the case is still theirs to book

- **GIVEN** a case in the vault whose booked visit was closed as missed
- **WHEN** its owner reads it
- **THEN** it reads that the visit was missed, naming the slot
- **AND** the case stands where it stood and takes another booking

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-bnt rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-27 - An ask for the item back reads on the case
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who asked for their item reads what happens next

- **GIVEN** a case whose item is held and whose owner has asked for it back
- **WHEN** they read it
- **THEN** it reads the ask and the day it was recorded
- **AND** the case takes a pickup booking, and the same ask sent again records nothing

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-whn rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-28 - A case with no visit ahead asks for one
**Serves:** grade10-site-vault-case-lifecycle-US-02 - the collector is told what will end the case before it ends

- **GIVEN** a case whose terms were agreed with no visit ahead of it
- **WHEN** its owner reads it
- **THEN** it reads as waiting on them
- **AND** it names the day the 30-day clock would call the case off

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-77l rev=1 -->
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

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-3v2 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-30 - A financed case walks eight stages
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector reads how far along the case is without counting statuses

- **GIVEN** a financed case whose item is in the vault
- **WHEN** its owner reads it
- **THEN** it reads eight stages from Request to Home, with Vault in progress
- **AND** every earlier stage reads as done and every later one as still to come

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-yvx rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-31 - A storage case walks six
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector on the storage lane is shown no stage their case never takes

- **GIVEN** a storage case being valued
- **WHEN** its owner reads it
- **THEN** it reads six stages, with no Offer and no Loan stage
- **AND** Valued reads as the stage in progress

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-dub rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-32 - An ended case stops at the stage it ended on
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector sees where the case had reached when it closed

- **GIVEN** a case cancelled while its terms were agreed
- **WHEN** its owner reads it
- **THEN** Agreed reads as the stage in progress
- **AND** the ending is carried beside it

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-e7l rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-33 - A case waiting on the collector says so
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector can tell at a glance which cases need them

- **GIVEN** a case holding a live offer
- **WHEN** its owner reads it
- **THEN** it reads that the case is waiting on them

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-vgv rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-34 - A held item reads the same on the list and the case
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector reads one answer for where the item is, wherever they look

- **GIVEN** a storage case whose item is in the vault
- **WHEN** its owner reads their own cases and then the case
- **THEN** both read that the item is with us, naming the day it has been held since

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-ftn rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-38 - A vaulted case reads With us on either lane
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector whose item is in the vault reads one answer, whichever lane they walk

- **GIVEN** a financed case whose item is in the vault with no advance paid out yet
- **WHEN** its owner reads it
- **THEN** it reads that the item is with us, naming the day it has been held since

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-6ug rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-35 - A released case reads collected
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector who took the item home reads that the case is done

- **GIVEN** a case whose item was released
- **WHEN** its owner reads it
- **THEN** it reads that the item was collected, naming the day

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-a3h rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-36 - An ended case reads closed
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector reads that nothing is held for them any more

- **GIVEN** a case that expired on an abandonment clock
- **WHEN** its owner reads it
- **THEN** it reads that the case is closed, naming the day

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

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-68t rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-41 - A walk-in typed wrong is cancelled and leaves nothing
**Serves:** grade10-site-vault-case-lifecycle-US-06 - the operator undoes a draft opened under the wrong address

- **GIVEN** a draft staff opened under a mistyped address, carrying two photographs
- **WHEN** staff cancel it
- **THEN** the case is `cancelled`
- **AND** the account at that address lists nothing of it among its own cases, a read of it by its id answers not found to that account, and neither photograph is served
- **AND** staff's Closed view lists it under its reference, its item reading as erased and no collector named
- **AND** nobody is emailed

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-8rr rev=1 -->
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

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-vc1 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-44 - The collector's own cancel keeps the draft on their list
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector calls off a request staff opened for them

- **GIVEN** a draft staff opened under the collector's account
- **WHEN** the collector cancels it
- **THEN** the case is `cancelled` and stays on their own cases as a cancelled request
- **AND** nobody is emailed

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-plk rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-45 - A walk-in the collector sent is cancelled as any case
**Serves:** grade10-site-vault-case-lifecycle-US-06 - the operator cancels a walk-in that is no longer a draft

- **GIVEN** a draft staff opened that the collector has sent
- **WHEN** staff cancel it
- **THEN** the case is `cancelled` and stays on the collector's own cases with its photographs
- **AND** the collector is told, as on any case

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-6aa rev=1 -->
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

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-hir rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-48 - Staff's cancel removes the draft after someone signed in
**Serves:** grade10-site-vault-case-lifecycle-US-06 - a sign-in at a mistyped address does not keep someone else's draft

- **GIVEN** a draft staff opened, and someone who has since signed in to that account without sending it
- **WHEN** staff cancel it
- **THEN** it is removed from the account, as an unsent walk-in is, and nobody is emailed

### Requirement: The item register is told what the case does with the item

The vault SHALL tell the item register about the case's item as part of the
move that does it, and SHALL never wait on the register to commit a move:

| Move | The register is told |
| --- | --- |
| Starting the valuation | the item is registered under the case's collector, with the case's category, title, description and any slab staff named by grader, grade and cert |
| Confirming the item vaulted | the vault marks the item |
| Release, and unwinding from the vault | the vault's mark ends |
| Forfeiture | the vault's mark ends, and the item belongs to the lender |

- **Owed with the move** - that the register is owed the case's state SHALL
  be recorded in the move's own transaction, and the case's state as it then
  stands SHALL be delivered until the register has it; a state told twice or
  late SHALL change nothing.
- **Nothing else** - a corrected advance, a corrected repayment, a move
  between lockers, every move before the valuation, and a decline, cancel or
  expiry before custody SHALL tell the register nothing; an item registered at
  the valuation stays registered, not marked, under its collector.

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-hpb rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-49 - Starting the valuation registers the item
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff start valuing a request and the register gains the item

- **GIVEN** a submitted case from collector Ana Wong for a trading card titled "Charizard card"
- **WHEN** staff start its valuation
- **THEN** the register holds a trading card titled "Charizard card" owned by Ana Wong, not marked

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-01y rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-50 - Vaulting marks the item, and release ends the mark
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff put the item in a locker and later hand it back

- **GIVEN** a case whose item is registered
- **WHEN** staff confirm it vaulted
- **THEN** the register reads the item as marked by the vault for that case
- **WHEN** the item is later released, or the case unwound from the vault
- **THEN** the vault's mark is closed and the owner is unchanged

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-1ku rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-51 - A forfeit hands the item to the lender
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff forfeit a late loan's collateral

- **GIVEN** an active case whose item the vault marks, owned by the collector
- **WHEN** staff forfeit the case
- **THEN** the vault's mark is closed and the register reads the lender as the item's owner, moved by the vault on that case

#### Scenario: grade10-site-vault-case-lifecycle-SC-52 - A move never waits on the register
**Serves:** Moving a case - the counter keeps working while the register is down

- **GIVEN** the register not answering
- **WHEN** staff confirm an item vaulted
- **THEN** the case is `vaulted` at once
- **AND** the register reads the item as marked once it answers again, and no word is told twice

#### Scenario: grade10-site-vault-case-lifecycle-SC-53 - A corrected advance tells the register nothing
**Serves:** Moving a case - a money correction is not a custody fact

- **GIVEN** an active case whose item the vault marks
- **WHEN** its advance is taken back and the case returns to `vaulted`
- **THEN** the register still holds one open mark for the case and nothing else is told

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-lln rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-58 - A case that ends before custody leaves its item registered
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff decline or cancel a case they have started valuing

- **GIVEN** a case under valuation whose item is registered under its collector
- **WHEN** staff decline it, or it is cancelled
- **THEN** the item stays registered under the collector, not marked, with no move

### Requirement: Preparing documents waits on the register's owner

Preparing a case's documents SHALL read the case's item from the register
first, registering it in the same act where nothing has registered the case's
item yet, and SHALL be refused by name; preparing the release receipt SHALL
read the item the same way and be refused the same way:

| While | The refusal |
| --- | --- |
| The register names an owner other than the case's collector | names the owner the register shows, linking the item, where staff can transfer it |
| The register reads the item as retired | names and links the item, where staff can restore it |
| The register does not yet hold the item it was told of | says the item is still being registered |
| The register cannot be asked | says the register cannot be read now |

The Documents tab SHALL NOT offer Prepare documents while the register names
another owner, and SHALL say so in a line naming that owner and linking the
item. The line and the refusal SHALL name the owner by name for a holder of
`kyc:read`, the read on the audit log, and by the account's short id
otherwise.

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-17k rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-54 - Another owner withholds Prepare documents
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff learn before the paper is printed that the slab is registered to someone else

- **GIVEN** an accepted case whose collector is Ana Wong, linked to an item the register shows as Ben Lee's
- **WHEN** staff read its Documents tab
- **THEN** Prepare documents is not offered, and a line names Ben Lee and links the item
- **AND** for staff without `kyc:read` the line names Ben Lee's short id instead

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-tqz rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-55 - A prepare under another owner is refused by name
**Serves:** grade10-site-vault-case-lifecycle-US-03 - the register's owner changed after the tab was opened

- **GIVEN** a Documents tab offering Prepare documents, and the item then moved to Ben Lee
- **WHEN** staff prepare the documents
- **THEN** it is refused, naming Ben Lee and linking the item, and the case stays where it was
- **AND** for staff without `kyc:read` the refusal names Ben Lee's short id instead

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-zb0 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-56 - A prepare the register cannot answer is refused by name
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff are told why the paper could not be printed

- **GIVEN** an accepted case, and the register not answering
- **WHEN** staff prepare the documents
- **THEN** it is refused, saying the register cannot be read now, and nothing is rendered

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-6yn rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-57 - A prepare before the register holds the item is refused by name
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff are told the item is still being registered

- **GIVEN** an accepted case whose item's registration has not reached the register
- **WHEN** staff prepare the documents
- **THEN** it is refused, saying the item is still being registered, and nothing is rendered

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-01t rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-59 - A prepare registers an item nothing has registered yet
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff prepare the papers of a case valued before the vault's deploy

- **GIVEN** an accepted case valued before the vault's deploy, with no item registered
- **WHEN** staff prepare the documents
- **THEN** the item is registered under the case's collector and the custody agreement prints its facts

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-hhb rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-60 - A prepare on a retired item is refused by name
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff restore an item retired by mistake before its papers are printed

- **GIVEN** an accepted case whose item staff retired after its valuation started
- **WHEN** staff prepare the documents
- **THEN** it is refused, naming and linking the item, and nothing is rendered
- **WHEN** staff restore the item and prepare the documents again
- **THEN** the packet is prepared

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-q4b rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-61 - A release receipt the register refuses is refused by name
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff are told why the hand-back paper could not be printed

- **GIVEN** a vaulted case owing nothing, whose item the register reads as retired, or the register not answering
- **WHEN** staff prepare its release receipt
- **THEN** it is refused, naming and linking the retired item, or saying the register cannot be read now, and nothing is rendered

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

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-69a rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-16 - Calling a request off names what it closes
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector ends a request they opened rather than asking staff to

- **GIVEN** a case holding a live offer and a booked visit
- **WHEN** its owner calls the request off
- **THEN** the answer names the offer it closed and the visit it cancelled

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-7se rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-17 - A confirmed call-off ends the case and reads back
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector sees their request closed where they closed it

- **GIVEN** a case holding a live offer and a booked visit
- **WHEN** its owner calls the request off
- **THEN** the case is `cancelled`, the offer is closed and the visit is cancelled
- **AND** the next read of the case reads it as ended, naming the collector as who called it off

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-4jt rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-37 - A confirmation names only what stands open
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector is not told the request closes something it never held

- **GIVEN** a submitted request with no offer made and no visit booked
- **WHEN** its owner calls the request off
- **THEN** the answer names no closed offer and no cancelled visit

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-daj rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-18 - Asking for the item back is recorded once
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector asks for their item and reads that the ask stands

- **GIVEN** a case whose item is in the vault with nothing outstanding
- **WHEN** its owner asks for the item back, and the same ask is sent again
- **THEN** the ask is recorded against the case once
- **AND** the second answers with the case and records nothing

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-zjg rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-19 - A refused move leaves the confirmation open
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector is told why the act they asked for did not run

- **GIVEN** a collector who read their case before the counter moved it
- **WHEN** they call the request off naming the instant they read it at
- **THEN** the act is refused by name as a case that moved
- **AND** the case is unchanged

### Requirement: A case answers only to the collector whose case it is

A case belongs to one collector, and the worker tells nobody else that it
exists.

**One answer for both** - a read of, or an act on, an id that answers to no
case and a case belonging to another collector SHALL both be refused as the
same case not found.

**No distinction** - the refusal SHALL carry nothing that tells the two
apart.

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-oo5 rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-39 - Another collector's case reads as not found
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who opens a case that is not theirs learns nothing about it

- **GIVEN** a signed-in collector and a case belonging to somebody else
- **WHEN** they read it or answer its offer by its id
- **THEN** they are refused with the same not found an id nobody was issued answers
- **AND** nothing in the refusal says which of the two they met
