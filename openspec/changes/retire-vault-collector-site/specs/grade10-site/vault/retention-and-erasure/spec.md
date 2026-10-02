# grade10-site/vault/retention-and-erasure Specification

## Purpose

What the vault keeps after a case ends, what it deletes when the person asks to
be forgotten, what it keeps anyway because it is the evidence that an agreement
existed, and what the person reads of all three under their own account.

It answers for a collector's grading submissions too, on the same table and the
same request, so one review and one erasure path serve both products.

Two mechanisms, kept apart on purpose: a review that flags a case past its
window and acts on nothing, and an erasure the person asks for from their own
account and an operator runs.

## Feature set

- Your data
  - One page under the account: one read under the collector's own account -
    what is kept, where the identity stands, what has been signed and the ask -
    rather than on a closed case
  - Every signed document: offered with it as the one download
    `grade10-site/vault/documents-and-signing` defines
  - The ask and its refusal: filed and cancelled under the account inside the
    window, and refused by name while an item is held or a loan is running

## RENAMED Requirements

- FROM: `### Requirement: The collector reads what the vault holds about them on one page`
- TO: `### Requirement: The collector reads what the vault holds about them under their own account`

## MODIFIED Requirements

### Requirement: The collector reads what the vault holds about them under their own account

Your data is one read under the collector's own account, and it answers for
the vault's own data.

**Who reads it** - the read SHALL be answered to the account holder alone;
somebody who is not signed in SHALL be refused, and SHALL be answered nothing
about any account.

**What it holds** - what the vault keeps and for how long, where the identity
stands, the documents the collector has signed, what stands in the way of an
erasure, and the ask to be forgotten.

**The documents** - the read SHALL carry every sealed document of the
collector's cases on the page of cases it answers for, each under the case it
belongs to, and a further page SHALL be read by the cursor the read returns.
The one download `grade10-site/vault/documents-and-signing` defines is
bounded to that same page.

**A part that fails** - where the identity standing or the ask cannot be
answered, the read SHALL name that part as failed and SHALL carry every other
part it answered.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-12 - Your data is the account holder's own page
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector opening their account's data page

- **WHEN** somebody who is not signed in asks for Your data
- **THEN** they are refused as not signed in
- **AND** nothing about any account is answered

#### Scenario: grade10-site-vault-retention-and-erasure-SC-13 - Every signed document is listed under its case and offered once
**Serves:** `grade10-site-vault-retention-and-erasure-US-05`, `grade10-site/vault/documents-and-signing#grade10-site-vault-documents-and-signing-US-05` - a collector taking their own copy of everything they have signed

- **GIVEN** a collector holding sealed documents on two closed cases
- **WHEN** they read Your data
- **THEN** every one of those documents is carried under the case it belongs to

#### Scenario: grade10-site-vault-retention-and-erasure-SC-15 - A block that cannot be answered leaves the rest of the page standing
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector reading the page when part of it cannot be answered

- **WHEN** the identity standing cannot be answered
- **THEN** the read names the identity standing as failed
- **AND** it carries what is kept, the signed documents, what stands in the way and the ask

### Requirement: Your data names each class the vault keeps and the window it is kept for

The collector's read carries what the vault keeps about them and for how
long.

**Per class** - Your data SHALL carry each class the brand holds a window for,
with the window as days after a case ends.

**A window nobody has decided** - a class whose window is unset SHALL carry no
number; it SHALL NOT be carried as zero, and SHALL NOT be read as deleted at
once or as kept forever.

**On a case that ended** - the owner's read of a case that ended after custody
- released or forfeited - SHALL carry the same classes and windows; the read
of any other case SHALL carry none.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-16 - The page names each class with its window
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector working out how long their papers and photographs are kept

- **GIVEN** a brand with a window set for each of its classes
- **WHEN** the collector reads Your data
- **THEN** each class is carried with its window in days after a case ends

#### Scenario: grade10-site-vault-retention-and-erasure-SC-17 - A class nobody has decided reads as undecided
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector reading a class whose window Legal has not confirmed

- **GIVEN** a brand with no window set for its identity records
- **WHEN** the collector reads Your data
- **THEN** that class is carried with no number
- **AND** it is carried neither as zero days nor as kept forever

#### Scenario: grade10-site-vault-retention-and-erasure-SC-18 - A case that ended names what is kept and points at Your data
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector reading a released case and following it to the ask

- **GIVEN** a case whose item was released
- **WHEN** the collector reads it
- **THEN** the read carries the same classes and windows Your data carries
- **AND** the read of a case still running carries none

### Requirement: Your data shows where the identity stands and never the identity itself

Your data carries what the vault knows about the collector's identity check
without carrying the check.

**Six standings** - the read SHALL carry one of the six standings the identity
record holds, with the facts each names:

| Standing | What the read carries |
| --- | --- |
| Verified | the day it expires, how it was checked and the day it was checked |
| Out | the day the check was started |
| Stalled | the day the check was started |
| Refused | the day the last check was decided |
| Lapsed | the day the last check expired |
| None | nothing; one is taken at the next visit |

**A check still out** - Out and Stalled SHALL NOT be carried as None.

**Never the identity** - the read SHALL NOT carry the legal name, the date of
birth, the document type, its number, its expiry or its photograph, and SHALL
NOT carry why a check was refused.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-19 - A verified identity reads until when and how it was checked
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector checking whether they must verify again before their next visit

- **GIVEN** a collector whose identity is bound and expires on a later day
- **WHEN** they read Your data
- **THEN** the standing is carried as verified until that day, with how it was checked and the day it was checked

#### Scenario: grade10-site-vault-retention-and-erasure-SC-20 - A check still out is not read as no identity
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector who started a check and comes back to see where it got to

- **GIVEN** a collector whose check has been started and not decided
- **WHEN** they read Your data
- **THEN** the standing is carried as out, with the day it was started
- **AND** it is not carried as none

#### Scenario: grade10-site-vault-retention-and-erasure-SC-39 - A stalled check reads as a check that is out
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector coming back to a check the shop is still waiting on

- **GIVEN** a collector whose started check has been left undecided long enough to stand as stalled
- **WHEN** they read Your data
- **THEN** the standing is carried as stalled, with the day it was started
- **AND** it is not carried as none

#### Scenario: grade10-site-vault-retention-and-erasure-SC-21 - An expired check reads as expired
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector finding out that what was checked no longer stands

- **GIVEN** a collector whose last check expired
- **WHEN** they read Your data
- **THEN** the standing is carried as lapsed, with the day it expired

#### Scenario: grade10-site-vault-retention-and-erasure-SC-40 - An identity nobody asked for reads as none on file
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector finding out whether anything of theirs was ever checked

- **GIVEN** a collector nobody has asked for a check
- **WHEN** they read Your data
- **THEN** the standing is carried as none

#### Scenario: grade10-site-vault-retention-and-erasure-SC-22 - The standing names neither the person nor their document
**Serves:** grade10-site-vault-retention-and-erasure-US-05 - a collector reading their standing on a page the vault answers over the counter's record

- **GIVEN** a collector whose identity is bound and whose earlier check was refused
- **WHEN** they read Your data
- **THEN** the read carries no legal name, date of birth, document type, document number, expiry or photograph
- **AND** it carries no reason for the refusal

### Requirement: The collector files the ask to be forgotten from Your data and cancels it inside the window

The ask to be forgotten is filed under the collector's own account, and the
vault answers for what it still holds before anything is filed. The window
before an erasure may run, and the cancel inside it, are
`shared/auth/users`'s.

1. While any case of theirs stands in the way of an erasure - a request in
   flight, an item still in the vault, or a loan still running - the ask
   SHALL be refused by name, naming each such case by its reference and what
   holds it, and nothing SHALL be filed.
2. With nothing in the way, the request is filed, and the answer and Your
   data SHALL carry the day it was filed and the day an erasure may run.
3. Inside the window the collector SHALL be able to cancel the request, and a
   cancelled request SHALL leave Your data carrying no request, the ask open
   again.
4. From the day an erasure may run a cancel SHALL be refused by name.
5. A hold standing while a request is open SHALL be carried beside the
   request, and the erasure waits until the hold lifts.

#### Scenario: grade10-site-vault-retention-and-erasure-SC-23 - The ask is withheld while the vault still holds something
**Serves:** grade10-site-vault-retention-and-erasure-US-01 - a collector asking to be forgotten before their case is finished

- **GIVEN** a collector whose item is in the vault
- **WHEN** they ask to be forgotten
- **THEN** the ask is refused by name, naming that case as an item in the vault
- **AND** no request is filed
- **GIVEN** a collector whose loan is still running
- **WHEN** they ask to be forgotten
- **THEN** the ask is refused by name, naming that case as a loan running
- **AND** no request is filed

#### Scenario: grade10-site-vault-retention-and-erasure-SC-24 - The collector files the ask and reads when it may run
**Serves:** `grade10-site-vault-retention-and-erasure-US-05`, `shared/auth/users#shared-auth-users-US-06` - a collector filing the ask for themselves rather than asking an operator to file it

- **GIVEN** a collector with nothing in the vault's way
- **WHEN** they ask to be forgotten
- **THEN** the request is filed
- **AND** Your data carries the day it was filed and the day an erasure may run

#### Scenario: grade10-site-vault-retention-and-erasure-SC-25 - The collector cancels inside the window
**Serves:** `grade10-site-vault-retention-and-erasure-US-05`, `shared/auth/users#shared-auth-users-US-06` - a collector changing their mind before anything is erased

- **GIVEN** a collector whose request is filed, before the day an erasure may run
- **WHEN** they cancel the request
- **THEN** Your data carries no request
- **AND** a new ask may be filed

#### Scenario: grade10-site-vault-retention-and-erasure-SC-26 - A hold that stands while a request is open is named beside it
**Serves:** grade10-site-vault-retention-and-erasure-US-01 - a collector who filed the ask and then opened a case

- **GIVEN** a collector with a filed request who then puts an item in the vault
- **WHEN** they read Your data
- **THEN** the request is still carried with the day it was filed
- **AND** the hold is carried beside it, naming the case

#### Scenario: grade10-site-vault-retention-and-erasure-SC-27 - Once the window has passed the page offers no cancel
**Serves:** `grade10-site-vault-retention-and-erasure-US-05`, `shared/auth/users#shared-auth-users-US-06` - a collector reading the page after the window they could have cancelled in

- **GIVEN** a collector whose filed request has reached the day an erasure may run
- **WHEN** they cancel the request
- **THEN** the cancel is refused by name
- **AND** the request still stands
