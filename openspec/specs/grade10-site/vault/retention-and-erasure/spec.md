# grade10-site/vault/retention-and-erasure Specification

## Purpose

What the vault keeps after a case ends, what it deletes when the person asks
to be forgotten, and what it keeps anyway because it is the evidence that an
agreement existed.

Two mechanisms, kept apart on purpose: a review that flags a case past its
window and acts on nothing, and an erasure that a person asks for and an
operator runs.

## Feature set

- Retention windows
  - Three classes: the agreements, the identity records behind them, and the
    item photographs
  - Per brand, per class: days after the case ends, because how long evidence
    is kept is a decision about a jurisdiction
  - The review is a review: it flags, gauges and writes nothing, so a wrong
    number costs a review and not a record
  - An unset window: flagged as undecided rather than treated as zero
- Erasure
  - Asked on the account: the person asks once and every product answers
  - A case in flight blocks: nothing is erased while an item is held or a loan
    is running
  - Never signed, purged: photographs, the item's words and the ceremony's own
    personal data go, and the identity is released
  - Signed and closed, held: the sealed documents and the identity behind the
    signature stay under a named hold
  - Whichever class: contact, staff free text and the collector's own actor
    ids go, and owed mail goes with them
- What cannot be rewritten
  - Append-only records: money, corrections, valuations, movements, history
    and the audit trail take no update and no delete
  - The one exception: the collector's own actor id in the history, which
    erasure rewrites

## Requirements

### Requirement: Each class of kept data has a review window per brand

Each brand SHALL hold a review window, in days after a case ends, for each of
three classes:

| Class | What it covers | Grade10 |
| --- | --- | --- |
| Agreements | the sealed documents of a case | 2,555 days |
| Identity | the identity record and its photograph | 1,825 days |
| Photos | the item photographs | 2,555 days |

The window SHALL be a decision per brand and never per environment.

A class with no window SHALL be reported as undecided; it SHALL NOT be read as
zero and SHALL NOT be flagged as due.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-01 - A class nobody has decided is reported as such

- **GIVEN** a brand with no window set for its identity records
- **WHEN** the review runs
- **THEN** the class is reported as undecided and no case is flagged for it

### Requirement: The review flags a case past its window and changes nothing

The review SHALL consider every case that ended after custody — `released` or
`forfeited` — because those are the cases still holding the documents, the
identity and the photographs a window is about. It SHALL measure each window
from the moment the case reached that status, and SHALL report every class
whose window has passed.

It SHALL be decided by the case's status and never by whether anybody has
asked to be forgotten.

It SHALL write nothing, delete nothing and stamp nothing: the same case SHALL
be reported again next pass until a person acts on it.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-02 - A case past its window is flagged and left

- **GIVEN** a case released 2,600 days ago under a brand keeping agreements for 2,555
- **WHEN** the review runs
- **THEN** the case is reported with the class that is past its window
- **AND** nothing about the case has changed

#### Scenario: grade10-site-vault-retention-and-erasure-SC-03 - The window runs from the case's own ending

- **GIVEN** a case that ended long ago and was written to since for another reason
- **WHEN** the review runs
- **THEN** the window is measured from when it reached its terminal status

### Requirement: An erasure is refused while any of the person's cases is in flight

An erasure SHALL be refused while the person holds a case that is neither a
never-signed ending nor a closed-after-custody one: an item still held, a loan
still running, or documents still out for signature. The refusal SHALL name
each case so an operator knows where to look.

Erasure SHALL be asked for on the account, and each product SHALL answer for
its own data. A run that stops part-way SHALL leave the rest for the next run
rather than failing the whole.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-04 - A live loan blocks the erasure

- **GIVEN** a person with one closed case and one running loan
- **WHEN** their erasure is run
- **THEN** it is refused, naming the running case, and neither case is touched

#### Scenario: grade10-site-vault-retention-and-erasure-SC-05 - A case that goes live mid-run is not erased

- **GIVEN** an erasure running over a person's cases
- **WHEN** one of them becomes live between being listed and being reached
- **THEN** that case is refused and reported, and the others are erased

### Requirement: A case nobody signed is purged, and one that was signed is held

A case that ended without a sealed document SHALL be purged: its photographs,
the item's own words and the ceremony's personal data SHALL be deleted, and
the identity binding behind it SHALL be released.

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

#### Scenario: grade10-site-vault-retention-and-erasure-SC-06 - A cancelled case keeps nothing

- **GIVEN** a case cancelled before anything was signed
- **WHEN** the person is erased
- **THEN** its photographs and item text are gone, its identity is released, and the case names no person

#### Scenario: grade10-site-vault-retention-and-erasure-SC-07 - A released case keeps its evidence

- **GIVEN** a case whose item was released after a signed agreement
- **WHEN** the person is erased
- **THEN** the sealed documents, the identity record and its photograph are kept under a named hold, and the contact details are gone

#### Scenario: grade10-site-vault-retention-and-erasure-SC-08 - Owed mail goes with the person

- **GIVEN** a case carrying an owed or parked message
- **WHEN** the person is erased
- **THEN** the message is deleted whichever class the case fell in

#### Scenario: grade10-site-vault-retention-and-erasure-SC-09 - The collector's own history entries are anonymised

- **GIVEN** a case whose history names the collector as the actor on their own moves
- **WHEN** the person is erased
- **THEN** those entries name an erased collector, the entries themselves stand, and staff actors are untouched

### Requirement: Nothing recorded is rewritten

No database session SHALL be able to update or delete a money record, a
correction, a valuation, a custody movement, a case's history entry or an
audit-trail entry. A correction is an append, and so is every other change of
mind.

The one exception SHALL be the actor column of the history and the
photograph-read trail, which an erasure rewrites so that a person's own id
does not survive their erasure.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-10 - An update to a money record is refused

- **WHEN** any session tries to update or delete a recorded payment
- **THEN** the database refuses it

#### Scenario: grade10-site-vault-retention-and-erasure-SC-11 - The history keeps its entries and loses the person

- **WHEN** a person is erased
- **THEN** every history entry still exists and none of them names them
