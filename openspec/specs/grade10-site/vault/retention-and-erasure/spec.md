# grade10-site/vault/retention-and-erasure Specification

## Purpose

What the vault keeps after a case ends, what it deletes when the person asks to
be forgotten, what it keeps anyway because it is the evidence that an agreement
existed, and the page the person reads all three on.

It answers for a collector's grading submissions too, on the same table and the
same request, so one review and one erasure path serve both products.

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
  - Four classes: the agreements, the identity records behind them, the item
    photographs, and the record of each case
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
  - A walk-in removed: a draft staff opened and then cancelled, or run out,
    is purged as an unsigned case, the collector's own actor ids rewritten
- What cannot be rewritten
  - Append-only records: money, corrections, valuations, movements, history
    and the audit trail take no update and no delete
  - The one exception: the collector's own actor id in the history and the
    photograph-read trail, which an erasure or a walk-in's removal rewrites
- Your data
  - One page under the account: what is kept, where the identity stands, what
    has been signed and the ask, in one place rather than on a closed case
  - What is kept, in the reader's words: each class with the window it is kept
    for, and that a review deletes nothing by itself
  - The identity standing: verified until when and checked how — never the name
    and never the document
  - Every signed document: offered from here as the one download
    `grade10-site/vault/documents-and-signing` defines
  - The ask and its refusal: filed here and cancelled here inside the window,
    and withheld in words while an item is held or a loan is running
- Grading's records
  - The vault's classes carry grading's paper: the submission agreement, the
    two receipts and the hand-in and hand-back photographs sit in agreements
    and photos, at the same windows
  - Case records carry the submission record: the collector's name, email,
    phone and postal address, the list, the pickup code and the messages
  - Measured from the submission's end: collected, cancelled, expired, or its
    last card paid out
  - No identity class: grading records no identity, so there is none to review
    and none to hold
  - A live submission blocks: between booked and ready, with an upcharge
    unsettled or ready cards uncollected, the ask is refused by name as a live
    case refuses it

## Requirements

### Requirement: Each class of kept data has a review window per brand

Each brand SHALL hold a review window, in days after a case ends, for each of
four classes:

| Class | What it covers | Grade10 |
| --- | --- | --- |
| Agreements | the sealed documents of a case | 2,555 days |
| Identity | the identity record and its photograph | 1,825 days |
| Photos | the item photographs | 2,555 days |
| Case records | the record of each case - its contact, the item's words, its events and the messages sent about it | 2,555 days |

The window SHALL be a decision per brand and never per environment.

A class with no window SHALL be reported as undecided; it SHALL NOT be read as
zero and SHALL NOT be flagged as due.

<!-- trace:scenario id=g10.vault-retention-and-erasure.SC-tr9 rev=1 -->
#### Scenario: grade10-site-vault-retention-and-erasure-SC-01 - A class nobody has decided is reported as such
**Serves:** grade10-site-vault-retention-and-erasure-US-03 - Compliance officer sees what is being kept too long

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

<!-- trace:scenario id=g10.vault-retention-and-erasure.SC-4ja rev=1 -->
#### Scenario: grade10-site-vault-retention-and-erasure-SC-02 - A case past its window is flagged and left
**Serves:** grade10-site-vault-retention-and-erasure-US-03 - Compliance officer sees what is being kept too long

- **GIVEN** a case released 2,600 days ago under a brand keeping agreements for 2,555
- **WHEN** the review runs
- **THEN** the case is reported with the class that is past its window
- **AND** nothing about the case has changed

<!-- trace:scenario id=g10.vault-retention-and-erasure.SC-2j9 rev=1 -->
#### Scenario: grade10-site-vault-retention-and-erasure-SC-03 - The window runs from the case's own ending
**Serves:** grade10-site-vault-retention-and-erasure-US-03 - Compliance officer sees what is being kept too long

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

<!-- trace:scenario id=g10.vault-retention-and-erasure.SC-7k7 rev=1 -->
#### Scenario: grade10-site-vault-retention-and-erasure-SC-04 - A live loan blocks the erasure
**Serves:** grade10-site-vault-retention-and-erasure-US-02 - Admin runs an erasure without touching a live case

- **GIVEN** a person with one closed case and one running loan
- **WHEN** their erasure is run
- **THEN** it is refused, naming the running case, and neither case is touched

<!-- trace:scenario id=g10.vault-retention-and-erasure.SC-res rev=1 -->
#### Scenario: grade10-site-vault-retention-and-erasure-SC-05 - A case that goes live mid-run is not erased
**Serves:** grade10-site-vault-retention-and-erasure-US-02 - Admin runs an erasure without touching a live case

- **GIVEN** an erasure running over a person's cases
- **WHEN** one of them becomes live between being listed and being reached
- **THEN** that case is refused and reported, and the others are erased

#### Scenario: grade10-site-vault-retention-and-erasure-SC-41 - A person who never held a case is held back by nothing
**Serves:** grade10-site-vault-retention-and-erasure-US-01 - Collector asks to be forgotten and the vault answers for its own data

- **GIVEN** a person who has never held a vault case
- **WHEN** their erasure is run
- **THEN** no case refuses it
- **AND** the vault names nothing it still holds of them

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

### Requirement: The collector reads what the vault holds about them on one page

Your data is one page under the collector's own account, and it answers for
the vault's own data.

**Who reads it** - the page SHALL be answered to the account holder alone, and
somebody who is not signed in SHALL be asked to sign in and SHALL be shown
nothing about any account.

**What it holds** - four blocks: what the vault keeps and for how long, where
the identity stands, the documents the collector has signed, and the ask to be
forgotten.

**The documents** - the page SHALL list every sealed document the collector
holds, each under the case it belongs to, and SHALL offer the one download
`grade10-site/vault/documents-and-signing` defines.

**A block that fails** - the page SHALL name what failed and SHALL leave every
block it already answered on screen.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-12 - Your data is the account holder's own page
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector opening their account's data page

- **WHEN** somebody who is not signed in opens Your data
- **THEN** they are asked to sign in
- **AND** nothing about any account is shown

#### Scenario: grade10-site-vault-retention-and-erasure-SC-13 - Every signed document is listed under its case and offered once
**Serves:** `grade10-site-vault-retention-and-erasure-US-05`, `grade10-site/vault/documents-and-signing#grade10-site-vault-documents-and-signing-US-05` - a collector taking their own copy of everything they have signed

- **GIVEN** a collector holding sealed documents on two closed cases
- **WHEN** they open Your data
- **THEN** every one of those documents is listed under the case it belongs to

#### Scenario: grade10-site-vault-retention-and-erasure-SC-15 - A block that cannot be answered leaves the rest of the page standing
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector reading the page when part of it cannot be answered

- **WHEN** one of the page's blocks cannot be answered
- **THEN** the page names what failed
- **AND** every block that was answered stays on screen

### Requirement: Your data names each class the vault keeps and the window it is kept for

The page says what the vault keeps about the collector and for how long.

**Per class** - the page SHALL name each class the brand holds a window for,
in the collector's words, with the window as days after a case ends.

**A review, not a clock** - the page SHALL say that a window is reviewed and
that nothing is deleted by the window passing.

**A window nobody has decided** - a class whose window is unset SHALL read as
undecided; it SHALL NOT read as zero, as deleted at once, or as kept forever.

**On a case that ended** - a case that ended after custody SHALL name the same
classes and windows, and SHALL point at Your data for the ask to be forgotten.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-16 - The page names each class with its window
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector working out how long their papers and photographs are kept

- **GIVEN** a brand with a window set for each of its classes
- **WHEN** the collector opens Your data
- **THEN** each class is named with its window in days after a case ends
- **AND** the page says the window is reviewed and deletes nothing by itself

#### Scenario: grade10-site-vault-retention-and-erasure-SC-17 - A class nobody has decided reads as undecided
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector reading a class whose window Legal has not confirmed

- **GIVEN** a brand with no window set for its identity records
- **WHEN** the collector opens Your data
- **THEN** that class reads as undecided
- **AND** it reads neither as zero days nor as kept forever

#### Scenario: grade10-site-vault-retention-and-erasure-SC-18 - A case that ended names what is kept and points at Your data
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector reading a released case and following it to the ask

- **GIVEN** a case whose item was released
- **WHEN** the collector opens it
- **THEN** the same classes and windows are named on the case
- **AND** the case points at Your data for the ask to be forgotten

### Requirement: Your data shows where the identity stands and never the identity itself

The page says what the vault knows about the collector's identity check
without showing the check.

**Six standings** - the page SHALL show one of the six standings the identity
record holds, and SHALL name for each:

| Standing | What the page names |
| --- | --- |
| Verified | verified until the day it expires, how it was checked and the day it was checked |
| Out | a check is out, and the day it was started |
| Stalled | a check is out, and the day it was started |
| Refused | the last check was not accepted, and the day it was decided |
| Lapsed | the last check expired, and the day it expired |
| None | no identity on file, and that one is taken at the next visit |

**A check still out** - Out and Stalled SHALL NOT read as no identity on file.

**Never the identity** - the page SHALL NOT show the legal name, the date of
birth, the document type, its number, its expiry or its photograph, and SHALL
NOT name why a check was refused.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-19 - A verified identity reads until when and how it was checked
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector checking whether they must verify again before their next visit

- **GIVEN** a collector whose identity is bound and expires on a later day
- **WHEN** they open Your data
- **THEN** the standing reads verified until that day, how it was checked and the day it was checked

#### Scenario: grade10-site-vault-retention-and-erasure-SC-20 - A check still out is not read as no identity
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector who started a check and comes back to see where it got to

- **GIVEN** a collector whose check has been started and not decided
- **WHEN** they open Your data
- **THEN** the standing reads that a check is out, with the day it was started
- **AND** it does not read as no identity on file

#### Scenario: grade10-site-vault-retention-and-erasure-SC-39 - A stalled check reads as a check that is out
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector coming back to a check the shop is still waiting on

- **GIVEN** a collector whose started check has been left undecided long enough to stand as stalled
- **WHEN** they open Your data
- **THEN** the standing reads that a check is out, with the day it was started
- **AND** it does not read as no identity on file

#### Scenario: grade10-site-vault-retention-and-erasure-SC-21 - An expired check reads as expired
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector finding out that what was checked no longer stands

- **GIVEN** a collector whose last check expired
- **WHEN** they open Your data
- **THEN** the standing reads that the last check expired, with the day it expired

#### Scenario: grade10-site-vault-retention-and-erasure-SC-40 - An identity nobody asked for reads as none on file
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector finding out whether anything of theirs was ever checked

- **GIVEN** a collector nobody has asked for a check
- **WHEN** they open Your data
- **THEN** the standing reads no identity on file, and that one is taken at the next visit

#### Scenario: grade10-site-vault-retention-and-erasure-SC-22 - The standing names neither the person nor their document
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector reading their standing on a page the vault answers over the counter's record

- **GIVEN** a collector whose identity is bound and whose earlier check was refused
- **WHEN** they open Your data
- **THEN** the standing names no legal name, date of birth, document type, document number, expiry or photograph
- **AND** it names no reason for the refusal

### Requirement: The collector files the ask to be forgotten from Your data and cancels it inside the window

The ask to be forgotten is filed from this page, and the vault answers for
what it still holds before anything is filed. The collector walks it in this
order:

1. The page says what the ask does: what the vault deletes, what stays under a
   named hold because it is the evidence of a signed agreement, and that every
   product answers for its own data.
2. The collector asks to be forgotten, and a confirmation names the window
   before an erasure may run and that the ask may be cancelled inside it.
3. While any case of theirs stands in the way of an erasure, the ask SHALL be
   withheld, the page SHALL name the hold in the collector's words - an item
   still in the vault, or a loan still running - and nothing SHALL be filed.
4. With nothing in the way, the request is filed, and the page SHALL name the
   day it was filed and the day an erasure may run.
5. Inside the window the page SHALL offer to cancel the request, and a
   cancelled request SHALL leave the page offering the ask again.
6. From the day an erasure may run the page SHALL offer no cancel, and SHALL say
   that each product erases what it holds.
7. A hold standing while a request is open SHALL be named beside the request,
   with that the erasure waits until the hold lifts.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-23 - The ask is withheld while the vault still holds something
**Serves:** grade10-site-vault-retention-and-erasure-US-01 - a collector asking to be forgotten before their case is finished

- **GIVEN** a collector whose item is in the vault
- **WHEN** they open Your data
- **THEN** the ask is withheld, naming that an item of theirs is in the vault
- **AND** no request is filed
- **GIVEN** a collector whose loan is still running
- **WHEN** they open Your data
- **THEN** the ask is withheld, naming that a loan of theirs is running
- **AND** no request is filed

#### Scenario: grade10-site-vault-retention-and-erasure-SC-24 - The collector files the ask and reads when it may run
**Serves:** `grade10-site-vault-retention-and-erasure-US-05`, `shared/auth/users#shared-auth-users-US-06` - a collector filing the ask for themselves rather than asking an operator to file it

- **GIVEN** a collector with nothing in the vault's way
- **WHEN** they ask to be forgotten and confirm the ask
- **THEN** the request is filed
- **AND** the page names the day it was filed and the day an erasure may run

#### Scenario: grade10-site-vault-retention-and-erasure-SC-25 - The collector cancels inside the window
**Serves:** `grade10-site-vault-retention-and-erasure-US-05`, `shared/auth/users#shared-auth-users-US-06` - a collector changing their mind before anything is erased

- **GIVEN** a collector whose request is filed, before the day an erasure may run
- **WHEN** they cancel the request
- **THEN** the page offers the ask again
- **AND** no filed request stands

#### Scenario: grade10-site-vault-retention-and-erasure-SC-26 - A hold that stands while a request is open is named beside it
**Serves:** grade10-site-vault-retention-and-erasure-US-01 - a collector who filed the ask and then opened a case

- **GIVEN** a collector with a filed request who then puts an item in the vault
- **WHEN** they open Your data
- **THEN** the request is still named with the day it was filed
- **AND** the hold is named beside it, with that the erasure waits until the hold lifts

#### Scenario: grade10-site-vault-retention-and-erasure-SC-27 - Once the window has passed the page offers no cancel
**Serves:** `grade10-site-vault-retention-and-erasure-US-05`, `shared/auth/users#shared-auth-users-US-06` - a collector reading the page after the window they could have cancelled in

- **GIVEN** a collector whose filed request has reached the day an erasure may run
- **WHEN** they open Your data
- **THEN** no cancel is offered
- **AND** the page says each product erases what it holds

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

### Requirement: An erasure is refused by name while a submission is live

An erasure SHALL be refused while the collector holds a live submission, as it
is refused while a vault case is in flight, and the refusal SHALL name the
submission and which hold stands.

**Booked through ready** - a submission at any status from booked to ready
SHALL refuse.

**Money unsettled** - a submission with money still due on it, an upcharge,
storage or the repayment of a reversed payout, SHALL refuse, whatever its
status.

**Ready cards uncollected** - a submission whose cards are ready and not yet
collected SHALL refuse.

**More than one hold** - a submission standing under several SHALL have each
named.

**A submission that has ended** - collected, cancelled, expired, or its last
card paid out - with nothing due on it SHALL refuse nothing.

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
- **THEN** it is refused, naming the money unsettled
- **GIVEN** a collector whose only submission is ready with nothing due and its cards still at the shop
- **WHEN** their erasure is run
- **THEN** it is refused, naming the cards waiting to be collected

#### Scenario: grade10-site-vault-retention-and-erasure-SC-43 - A repayment due on a collected submission refuses the erasure
**Serves:** `grade10-site-vault-retention-and-erasure-US-04`, `grade10-site-vault-retention-and-erasure-US-02` - an operator told that a found card's repayment is still in the way

- **GIVEN** a collector whose only submission is collected, a card on it found and its payout reversed, the repayment unpaid
- **WHEN** their erasure is run
- **THEN** it is refused, naming the money unsettled

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
