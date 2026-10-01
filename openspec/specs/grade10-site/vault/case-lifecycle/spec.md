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
SHALL be told.

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

### Requirement: The collector's own moves run from their case page

Two moves belong to the collector, and both run from the case they are about.

| Move | Offered while | The confirmation names | What confirming does |
| --- | --- | --- | --- |
| Call the request off | the item is not yet in the vault — `draft`, `submitted`, `under_valuation`, `offer_made`, `accepted` or `signing` | whichever stands open — the live offer it closes, the visit it cancels, or both | ends the case as `cancelled` |
| Ask for the item back | the item is held and nothing stands against it — a case in the vault owing nothing, or a settled loan — and no ask stands already | that the item leaves on a pickup visit against a signed release | records the ask against the case |

**Confirmation first** — each move SHALL ask for confirmation before it runs,
and the case SHALL be unchanged while that confirmation stands.

**Only what stands open** — a confirmation SHALL name the live offer and the
booked visit the move closes, and SHALL name neither where neither stands.

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

#### Scenario: grade10-site-vault-case-lifecycle-SC-37 - A confirmation names only what stands open
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector is not told the request closes something it never held

- **GIVEN** a submitted request with no offer made and no visit booked
- **WHEN** its owner asks to call the request off
- **THEN** the confirmation names the request alone
- **AND** it names no offer and no visit

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
| `expired` | one wording whichever clock ran out, with the clock on the timeline; that nothing was signed and the item never left |
| `forfeited` | the figure the item settled, the day the notice was written and the date it gave to pay by |

**One ending per case** — an ended case SHALL name the ending it took and the
day it closed.

**One expired wording** — an expired case SHALL read the same wording whichever
clock ran out, and the clock that ran out SHALL be named on the case's
timeline.

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

#### Scenario: grade10-site-vault-case-lifecycle-SC-22 - An expired case reads one wording and names its clock on the timeline
**Serves:** grade10-site-vault-case-lifecycle-US-04 - the collector who stopped answering reads what ended the case

- **GIVEN** two expired cases, one that never booked a visit and one whose booked visit was missed
- **WHEN** their owners read them
- **THEN** both read the same expired wording, and each timeline names the clock that ran out
- **AND** each says nothing was signed and the item never left

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

**Two facts at once** — where a case meets more than one fact, the fact of the
most recent event SHALL be the one read, and the other SHALL stay on the
case's timeline.

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

#### Scenario: grade10-site-vault-case-lifecycle-SC-40 - A case meeting two facts reads the later one
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector is given one thing to do next, not two

- **GIVEN** a case whose offer ran out on Monday and whose booked visit was closed as missed on Wednesday
- **WHEN** its owner reads it
- **THEN** it reads the missed visit, the later of the two, and offers another visit
- **AND** the offer that ran out stays on the case's timeline

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

**Where the case is** — the stage the status covers SHALL read as the one in
progress, every earlier stage as done and every later one as still to come.

**An ended case stops where it ended** — the stage it ended at SHALL stay the
one in progress, with the ending named beside it.

**The fact decides, else the status** — where the case reads a fact, that
fact's row SHALL decide whose the item is; where it reads none, the status
SHALL.

**One clock** — a day, a deadline and a count of days SHALL be read on the
brand's own zone, which `shared/dates-and-times` states, from one instant per
read.

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

### Requirement: A case page answers only to the collector whose case it is

A case belongs to one collector, and the page tells nobody else that it exists.

**One page for both** — an id that answers to no case and a case belonging to
another collector SHALL both read the same not-found page.

**No distinction** — the not-found page SHALL carry nothing that tells the two
apart.

#### Scenario: grade10-site-vault-case-lifecycle-SC-39 - Another collector's case reads as not found
**Serves:** grade10-site-vault-case-lifecycle-US-05 - the collector who opens a case that is not theirs learns nothing about it

- **GIVEN** a signed-in collector and a case belonging to somebody else
- **WHEN** they open it by its id
- **THEN** they read the same not-found page an id nobody was issued reads
- **AND** nothing on it says which of the two they met
