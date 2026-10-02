# grade10-site/vault/retention-and-erasure Specification

## Feature set

- Erasure
  - A walk-in removed: a draft staff opened and then cancelled, or run out,
    is purged as an unsigned case, the collector's own actor ids rewritten
- What cannot be rewritten
  - The one exception: the collector's own actor id in the history and the
    photograph-read trail, which an erasure or a walk-in's removal rewrites

## MODIFIED Requirements

### Requirement: A case nobody signed is purged, and one that was signed is held

A case that ended without a sealed document SHALL be purged: its photographs,
the item's own words and the ceremony's personal data SHALL be deleted, and
the identity binding behind it SHALL be released.

A draft staff opened at the counter that staff cancel, or whose clock ends it,
SHALL be purged the same way at that moment, as
`grade10-site/vault/case-lifecycle` states, whether or not the person is
erased.

A case that ended after custody SHALL be held: the sealed documents, the
identity record and its photograph SHALL be kept under a hold named on the
case, with no clock. The hold SHALL say which it is — evidence of a signed
agreement, or a custody that closed without one.

Whichever class the case falls in, the contact details, any decline reason,
staff free text on the valuation and the movements, and the collector's own
actor ids in the case's history and photograph-read trail SHALL be removed;
staff actors SHALL stay, because a staff read is the audited thing.

Every message the vault still owed that case SHALL be deleted.

Which class a case falls in SHALL be decided under the case's own lock at the
moment of erasure, never from a list read earlier.

<!-- trace:scenario id=g10.vault-retention-and-erasure.SC-krq rev=1 -->
#### Scenario: grade10-site-vault-retention-and-erasure-SC-06 - A cancelled case keeps nothing
**Serves:** grade10-site-vault-retention-and-erasure-US-01 - Collector asks to be forgotten and the vault answers for its own data

- **GIVEN** a case cancelled before anything was signed
- **WHEN** the person is erased
- **THEN** its photographs and item text are gone, its identity is released, and the case names no person

<!-- trace:scenario id=g10.vault-retention-and-erasure.SC-3an rev=1 -->
#### Scenario: grade10-site-vault-retention-and-erasure-SC-07 - A released case keeps its evidence
**Serves:** grade10-site-vault-retention-and-erasure-US-01 - Collector asks to be forgotten and the vault answers for its own data

- **GIVEN** a case whose item was released after a signed agreement
- **WHEN** the person is erased
- **THEN** the sealed documents, the identity record and its photograph are kept under a named hold, and the contact details are gone

<!-- trace:scenario id=g10.vault-retention-and-erasure.SC-1es rev=1 -->
#### Scenario: grade10-site-vault-retention-and-erasure-SC-08 - Owed mail goes with the person
**Serves:** grade10-site-vault-retention-and-erasure-US-01 - Collector asks to be forgotten and the vault answers for its own data

- **GIVEN** a case carrying an owed or parked message
- **WHEN** the person is erased
- **THEN** the message is deleted whichever class the case fell in

<!-- trace:scenario id=g10.vault-retention-and-erasure.SC-8av rev=1 -->
#### Scenario: grade10-site-vault-retention-and-erasure-SC-09 - The collector's own history entries are anonymised
**Serves:** grade10-site-vault-retention-and-erasure-US-01 - Collector asks to be forgotten and the vault answers for its own data

- **GIVEN** a case whose history names the collector as the actor on their own moves
- **WHEN** the person is erased
- **THEN** those entries name an erased collector, the entries themselves stand, and staff actors are untouched

#### Scenario: grade10-site-vault-retention-and-erasure-SC-44 - A removed walk-in is purged and loses the collector's actor id
**Serves:** grade10-site-vault-retention-and-erasure-US-02 - Admin runs an erasure without touching a live case

- **GIVEN** a draft staff opened, whose title the collector changed after signing in
- **WHEN** staff cancel it
- **THEN** its photographs and item text are gone and its history entries name no collector
- **AND** staff's own entries stand, and a later erasure of that account finds nothing of the case left to rewrite

### Requirement: Nothing recorded is rewritten

No database session SHALL be able to update or delete a money record, a
correction, a valuation, a custody movement, a case's history entry or an
audit-trail entry. A correction is an append, and so is every other change of
mind.

The one exception SHALL be the actor column of the history and the
photograph-read trail, which an erasure or a walk-in's removal rewrites so
that a person's own id does not survive it.

<!-- trace:scenario id=g10.vault-retention-and-erasure.SC-qfh rev=1 -->
#### Scenario: grade10-site-vault-retention-and-erasure-SC-10 - An update to a money record is refused
**Serves:** grade10-site-vault-retention-and-erasure-US-02 - Admin runs an erasure without touching a live case

- **WHEN** any session tries to update or delete a recorded payment
- **THEN** the database refuses it

<!-- trace:scenario id=g10.vault-retention-and-erasure.SC-5ap rev=1 -->
#### Scenario: grade10-site-vault-retention-and-erasure-SC-11 - The history keeps its entries and loses the person
**Serves:** What cannot be rewritten - the history keeps its entries and loses the person

- **WHEN** a person is erased
- **THEN** every history entry still exists and none of them names them
