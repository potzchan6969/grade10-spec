# grade10-site/vault/case-lifecycle Specification

## Purpose

The case machine: fourteen statuses, two lanes through them, the clocks that
end a case nobody came back to, and the exits that are not a release.

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

#### Scenario: grade10-site-vault-case-lifecycle-SC-02 - A storage case agrees terms without an offer

- **GIVEN** a storage case being valued
- **WHEN** its custody terms are agreed at the counter
- **THEN** the case is `accepted` with no offer against it

#### Scenario: grade10-site-vault-case-lifecycle-SC-15 - A loan request stored on custody terms walks the storage path

- **GIVEN** a financed case being valued, with no offer on the table
- **WHEN** its custody terms are agreed at the counter
- **THEN** the case is `accepted` with no offer, signs the custody agreement alone, and is released from `vaulted` owing nothing

#### Scenario: grade10-site-vault-case-lifecycle-SC-03 - A storage case owes nothing

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

#### Scenario: grade10-site-vault-case-lifecycle-SC-04 - A case that moved under the caller is refused
**Serves:** grade10-site-vault-case-lifecycle-US-03 - Operator moves a case through the counter without stepping over a guard

- **GIVEN** two operators reading one case being valued
- **WHEN** both send the same move
- **THEN** one is applied and the other is refused by name

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

#### Scenario: grade10-site-vault-case-lifecycle-SC-06 - An abandoned agreement ends after a month
**Serves:** grade10-site-vault-case-lifecycle-US-02 - Collector who stops answering is not left with an open case

- **GIVEN** a case that agreed terms 31 days ago, with no visit ahead of it
- **WHEN** the clocks are read
- **THEN** the case is `cancelled` and the collector is told

#### Scenario: grade10-site-vault-case-lifecycle-SC-07 - A collector who rebooked keeps their case
**Serves:** grade10-site-vault-case-lifecycle-US-02 - Collector who stops answering is not left with an open case

- **GIVEN** a case that agreed terms 31 days ago and holds a visit next week
- **WHEN** the clocks are read
- **THEN** the case is left exactly where it is

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

#### Scenario: grade10-site-vault-case-lifecycle-SC-09 - A collector cancels an offer they were made
**Serves:** grade10-site-vault-case-lifecycle-US-01 - Collector calls off a request before the item is in the vault

- **GIVEN** a case holding a live offer and a booked visit
- **WHEN** its owner cancels the case
- **THEN** the case is `cancelled`, the offer is closed, the visit is cancelled and the collector is told

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

#### Scenario: grade10-site-vault-case-lifecycle-SC-11 - An unwind is refused past the advance
**Serves:** grade10-site-vault-case-lifecycle-US-03 - Operator moves a case through the counter without stepping over a guard

- **GIVEN** a case with an advance recorded against it
- **WHEN** staff try to unwind it from the vault
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-case-lifecycle-SC-12 - A corrected advance returns the case to the vault

- **GIVEN** an active case whose advance is taken back in full
- **WHEN** the correction is recorded
- **THEN** the case is `vaulted` and may be advanced against again

#### Scenario: grade10-site-vault-case-lifecycle-SC-13 - A corrected repayment reopens the loan

- **GIVEN** a repaid case whose last repayment is taken back
- **WHEN** the correction is recorded
- **THEN** the case is `active` and the balance is what it would have been had the record never been written

### Requirement: An ended case keeps the record of its visit

A case that has ended SHALL keep the visit it cached. The record of where the
item went SHALL NOT be cleared by the ending, and clearing it SHALL NOT be
read as a cancellation nobody made.

#### Scenario: grade10-site-vault-case-lifecycle-SC-14 - The visit outlives the case

- **GIVEN** a case that was released after a pickup visit
- **WHEN** the case is read afterwards
- **THEN** it still names the visit the item went home on
