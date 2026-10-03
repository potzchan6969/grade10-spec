# grade10-site/vault/retention-and-erasure Specification

## ADDED Requirements

### Requirement: Grading's records are kept under the vault's classes, measured from the submission's end

Grading keeps no retention table of its own: what a submission leaves behind
falls under the vault's classes, at the vault's windows.

**The classes** - the review SHALL answer for a submission under three classes,
each at the window the brand holds for that class:

| Class | What it covers on a submission | Grade10 |
| --- | --- | --- |
| Agreements | the sealed submission agreement, the intake receipt and the hand-back receipt | 2,555 days |
| Photos | the hand-in and the hand-back photographs | 2,555 days |
| Case records | the submission record - the collector's name, email, phone and postal address, the card list, the pickup code and the messages sent about it | 2,555 days |

**The class is the kind of data** - Case records is named by what the record is
and never by the product that holds it.

**Measured from the end** - each window SHALL run from the later of the day
the submission ended (collected, cancelled, expired, or its last card paid
out) and the day nothing is owed either way: no due unsettled and no payout
owed or unreceived.

**A submission still running** - one that has not ended SHALL be reported under
no class.

**No identity** - grading SHALL hold no identity record for a submission, so
the identity class SHALL answer for no submission and no submission SHALL be
held for one.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-28 - A submission past its window is reported under each class it holds
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-03` - the person answerable for what the shop keeps reading one review over both products

- **GIVEN** a submission collected 2,600 days ago under a brand keeping agreements, photos and case records for 2,555 days
- **WHEN** the review runs
- **THEN** the submission is reported under each of those three classes
- **AND** it is reported under no identity class

#### Scenario: grade10-site-vault-retention-and-erasure-SC-29 - The window runs from whichever event ended the submission
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-03` - the person answerable for what the shop keeps reading a submission dated from its own ending

- **GIVEN** a submission cancelled before hand-in and written to since for another reason
- **WHEN** the review runs
- **THEN** its windows are measured from the day it was cancelled
- **GIVEN** a submission whose last card was paid out
- **WHEN** the review runs
- **THEN** its windows are measured from the day of that payout

#### Scenario: grade10-site-vault-retention-and-erasure-SC-42 - A transfer not yet received holds the window
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-03` - the person answerable for what the shop keeps reading a submission dated from when the money settled

- **GIVEN** a submission whose last card was paid out by transfer, marked received 10 days after that payout
- **WHEN** the review runs
- **THEN** its windows are measured from the day the transfer was marked received

#### Scenario: grade10-site-vault-retention-and-erasure-SC-30 - A submission that has not ended is reported under no class
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-03` - the person answerable for what the shop keeps reading a list that names nothing still in hand

- **GIVEN** a submission handed in and still with the grader
- **WHEN** the review runs
- **THEN** it is reported under no class

### Requirement: A submission that was signed keeps its evidence and one nobody signed is purged

What an erasure leaves of a submission is decided by whether anything was
sealed on it.

**Signed** - a submission whose agreement was sealed SHALL keep that agreement,
the hand-back receipt and the hand-in and hand-back photographs under a hold
named on the submission.

**Purged whichever way** - the collector's contact details, their postal
address, the person they named to collect and the collector's own actor ids
SHALL be removed from every submission.

**Never signed** - a submission that ended with nothing sealed SHALL be purged,
the signing ceremony's own personal data with it.

**Never booked** - a submission still planned SHALL be purged with the account,
whether or not it has ended.

**Owed mail** - every message the submission still owed SHALL be deleted.

**The record stands** - a submission's history entries SHALL survive the
erasure, naming an erased collector where they named them.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-35 - A collected submission keeps its papers and loses the person
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-01` - a collector asking that grading keep no more of them than the vault does

- **GIVEN** a submission collected against a sealed agreement and a hand-back receipt
- **WHEN** the collector is erased
- **THEN** the agreement, the receipt and the hand-in and hand-back photographs are kept under a named hold
- **AND** the contact details, the postal address and the person named to collect are gone

#### Scenario: grade10-site-vault-retention-and-erasure-SC-36 - A submission nobody signed keeps nothing
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-01` - a collector who never handed the cards in asking to be forgotten

- **GIVEN** a submission cancelled before anything was signed
- **WHEN** the collector is erased
- **THEN** nothing of the submission names the collector
- **AND** the signing ceremony's personal data is gone

#### Scenario: grade10-site-vault-retention-and-erasure-SC-37 - Owed mail goes and the history keeps its entries
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-01` - a collector erased while the shop still owed them a message

- **GIVEN** a submission carrying an owed message and a history naming the collector on their own moves
- **WHEN** the collector is erased
- **THEN** the message is deleted
- **AND** those entries name an erased collector, and the entries themselves stand
