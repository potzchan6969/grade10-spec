# grade10-site/vault/retention-and-erasure Specification

## Purpose

What the vault keeps after a case ends, what it deletes when the person asks to
be forgotten, what it keeps anyway because it is the evidence that an agreement
existed, and the page the person reads all three on.

It answers for a collector's grading submissions on the same table and the same
request, so one review and one erasure path serve both products.

Two mechanisms, kept apart on purpose: a review that flags a case past its
window and acts on nothing, and an erasure the person asks for from their own
account and an operator runs.

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
- Your data
  - One page under the account: what is kept, where the identity stands, what
    has been signed and the ask, in one place rather than on a closed case
  - What is kept, in the reader's words: each class with the window it is kept
    for, and that a review deletes nothing by itself
  - The identity standing: verified until when and checked how — never the name
    and never the document
  - Every signed document: the one download, offered from here and bounded to
    what the page lists
  - The ask and its refusal: filed here and cancelled here inside the window,
    and withheld in words while an item is held or a loan is running
- Grading's records
  - The vault's classes carry grading's paper: the submission agreement, the
    two receipts and the hand-in and hand-back photographs sit in agreements
    and photos, at the same windows
  - A class of its own: the submission record — the collector's name, email,
    phone and postal address, the list, the pickup code and the messages
  - Measured from the submission's end: collected, cancelled, expired, or its
    last card paid out
  - No identity class: grading records no identity, so there is none to review
    and none to hold
  - A live submission blocks: between booked and ready, with an upcharge
    unsettled or ready cards uncollected, the ask is refused by name as a live
    case refuses it

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

**Measured from the end** - each window SHALL run from the day the submission
ended: collected, cancelled, expired, or its last card paid out.

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

#### Scenario: grade10-site-vault-retention-and-erasure-SC-30 - A submission that has not ended is reported under no class
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-03` - the person answerable for what the shop keeps reading a list that names nothing still in hand

- **GIVEN** a submission handed in and still with the grader
- **WHEN** the review runs
- **THEN** it is reported under no class

### Requirement: An erasure is refused by name while a submission is live

An erasure SHALL be refused while the collector holds a live submission, as it
is refused while a vault case is in flight, and the refusal SHALL name the
submission and which hold stands.

**Booked through ready** - a submission at any status from booked to ready
SHALL refuse.

**An upcharge unsettled** - a submission whose cards are ready with money still
due on it SHALL refuse.

**Ready cards uncollected** - a submission whose cards are ready and not yet
collected SHALL refuse.

**More than one hold** - a submission standing under several SHALL have each
named.

**A submission that has ended** - collected, cancelled, expired, or its last
card paid out - SHALL refuse nothing.

**A submission never booked** - one still planned SHALL refuse nothing, and
holds nothing for the review to report.

**Withheld in the collector's words** - on the page, where the ask is filed, a
live submission SHALL withhold it in the collector's words - cards of theirs
with the grader, money to settle, or cards waiting to be collected - and the
page SHALL file nothing while one stands. A request filed another way waits
while the submission refuses it, as a request does when a hold opens after
filing.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-31 - A submission with the grader refuses the erasure and leaves the rest alone
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-02` - an operator running the ask over a collector who graded cards as well as pawning them

- **GIVEN** a collector with one collected submission and one handed in and still with the grader
- **WHEN** their erasure is run
- **THEN** it is refused, naming the live submission and the hold that stands
- **AND** neither submission is touched

#### Scenario: grade10-site-vault-retention-and-erasure-SC-32 - An unsettled upcharge and uncollected cards each refuse by name
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-02` - an operator told which money and which cards are in the way

- **GIVEN** a collector whose only submission is ready with an upcharge still due
- **WHEN** their erasure is run
- **THEN** it is refused, naming the unsettled upcharge
- **GIVEN** a collector whose only submission is ready with nothing due and its cards still at the shop
- **WHEN** their erasure is run
- **THEN** it is refused, naming the cards waiting to be collected

#### Scenario: grade10-site-vault-retention-and-erasure-SC-33 - The ask is withheld in the collector's own words while cards are out
**Serves:** grade10-site-vault-retention-and-erasure-US-04 - a collector asking to be forgotten while their cards are still being graded

- **GIVEN** a collector whose submission is with the grader
- **WHEN** they ask to be forgotten on the page
- **THEN** the ask is withheld, naming that cards of theirs are with the grader
- **AND** the page files no request

#### Scenario: grade10-site-vault-retention-and-erasure-SC-34 - Submissions that have all ended hold nothing back
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-02` - an operator running the ask once every card is back with its collector

- **GIVEN** a collector whose submissions are collected, cancelled or expired, with nothing due on any of them
- **WHEN** their erasure is run
- **THEN** no submission refuses it

#### Scenario: grade10-site-vault-retention-and-erasure-SC-38 - A submission nobody booked refuses nothing and goes with the account
**Serves:** `grade10-site-vault-retention-and-erasure-US-04` - a collector asking to be forgotten over a list they planned and never booked

- **GIVEN** a collector whose only submission is still planned, never booked
- **WHEN** their erasure is run
- **THEN** no submission refuses it
- **AND** the planned submission is purged, nothing of it naming the collector

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
