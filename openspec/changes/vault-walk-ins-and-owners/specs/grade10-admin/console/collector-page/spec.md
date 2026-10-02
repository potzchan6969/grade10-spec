# grade10-admin/console/collector-page Specification

## Purpose

One console page per collector in the Grade10 console: who they are and what
the shop holds for them, one section per product, each read and refused on
its own. This change ships the header and the vault cases section; the cases
themselves are `grade10-admin/vault/operator-queue`'s.

## Feature set

- Opening the page
  - Address: `/vault/collectors/<user id>`, under the Vault entry in the nav
  - Who opens it: the vault read grant; staff, treasurers and admins
  - Reached from a name: a collector's name on the queue or the held items,
    and the collector's cases link in a case's header
  - On the audit chain: each opening, each read of the header and each page
    of cases records who read which collector, as a search does
  - Nobody at that id: an id no account answers to, or one that is not an
    id, says so
- The header
  - Name and email: the account's own, under the identity grant
  - No name for a treasurer: the short id and no name; the contact stays on
    each case
  - Name unavailable: the short id and a line saying so, and the page still
    loads
  - Holds no vault case: an account that never held a vault case reads as its
    short id and says so, and no name or email is read
  - A failed read: its own error and a retry
  - Their cases on the queue: a link opening the queue narrowed to them
- Vault cases section
  - Every case they hold: reference, item, status, lane and last touched,
    newest-touched first, each opening its case
  - Paged: a page at a time, saying whether there is more
  - None: a collector holding no vault case reads as such
- Sections stand alone
  - Own grant: a section the operator may not read shows its own refusal
  - Own failure: a section that fails shows its own error and a retry, and
    the others stand

## ADDED Requirements

### Requirement: A collector's page answers under the Vault entry

One page per collector SHALL answer at `/vault/collectors/<user id>` in the
Grade10 console, the user id being the collector's account id. While it is
open the nav SHALL mark the Vault entry, and the page SHALL have no nav entry
of its own.

An operator holding the vault read grant SHALL open it — staff, treasurers and
admins — and an operator without it SHALL be refused, with no section loaded.

#### Scenario: grade10-admin-console-collector-page-SC-01 - The page opens under the Vault entry
**Serves:** grade10-admin-console-collector-page-US-01 - the operator lands on one page for the person in front of them

- **GIVEN** a collector holding a vault case
- **WHEN** a member of staff opens `/vault/collectors/<user id>` for that collector
- **THEN** the collector's page opens, and the nav marks the Vault entry

#### Scenario: grade10-admin-console-collector-page-SC-02 - The page is refused without the vault read grant
**Serves:** Opening the page - an operator whose roles hold no vault grant follows a link to it

- **GIVEN** an operator without the vault read grant
- **WHEN** they open a collector's page
- **THEN** it is refused, and no section loads

### Requirement: A collector's page is reached from their name and from a case

- **From a name** — a queue row or a held-item row that names its collector
  SHALL carry, beside the name, a link to that collector's page.
- **From a case** — a case's header SHALL carry **The collector's cases**,
  opening the page of the case's collector, for every operator holding the
  vault read grant. A case no account holds SHALL carry no such link.

#### Scenario: grade10-admin-console-collector-page-SC-03 - A name opens the collector's page
**Serves:** grade10-admin-console-collector-page-US-01 - the operator goes from a row to everything that customer holds

- **GIVEN** a queue row naming its collector
- **WHEN** a member of staff follows the link beside the name
- **THEN** that collector's page opens

#### Scenario: grade10-admin-console-collector-page-SC-04 - A case's header opens its collector's page for a treasurer too
**Serves:** grade10-admin-console-collector-page-US-02 - the treasurer goes from one borrower's case to their others

- **GIVEN** a treasurer reading a case
- **WHEN** they follow **The collector's cases** in its header
- **THEN** the page of that case's collector opens

#### Scenario: grade10-admin-console-collector-page-SC-05 - A case nobody holds offers no collector's page
**Serves:** Opening the page - a case whose account was erased

- **GIVEN** a case no account holds any more
- **WHEN** an operator reads its header
- **THEN** it carries no link to a collector's page

### Requirement: Each opening of a collector's page is recorded

Opening a collector's page, each read of its header, and each further page of
its vault cases SHALL write one entry on the audit trail naming who read, when, and which collector,
filed under that collector so their openings are pulled by their id. No
column of the entry SHALL hold the collector's name or email. An opening whose
entry cannot be written SHALL be refused rather than shown.

#### Scenario: grade10-admin-console-collector-page-SC-06 - An opening leaves an entry naming who read whom
**Serves:** grade10-admin-console-collector-page-US-01 - the shop can answer who looked at a customer

- **WHEN** a member of staff, or a treasurer, opens a collector's page
- **THEN** the audit trail carries an entry naming the operator, the instant and the collector's id
- **AND** the collector's name and email appear in no column of it

#### Scenario: grade10-admin-console-collector-page-SC-07 - An opening with nowhere to record it is refused
**Serves:** Opening the page - a read of a person the trail cannot record

- **GIVEN** an audit trail that cannot be written
- **WHEN** an operator opens a collector's page
- **THEN** the vault cases are refused rather than shown, and the header shows no name or email

### Requirement: The header names the collector to whoever holds the identity grant

The header SHALL read the collector's account at each opening and copy it
nowhere. It SHALL read the name and email only of an account that holds, or
has held, a vault case.

| Reader or account | The header shows |
| --- | --- |
| Holds the identity read grant | the account's name and email |
| Without the identity read grant | the collector's short id — the first eight characters of the account's id — and no name or email; each case keeps its own contact |
| An account that cannot be read | the short id and a line saying the name is unavailable |
| An account that never held a vault case | the short id and a line saying it holds no vault case; no name or email is read |
| A read that fails | its own error and a retry, the cases still listed |
| An id no account answers to, or one that is not an id | that nobody answers to that id |

- **Their cases on the queue** — the header SHALL carry a link opening the
  queue narrowed to this collector, for every reader of the page, the
  treasurer included.

An account a walk-in created SHALL read by its email handle until the customer
names themselves, as `grade10-admin/vault/operator-queue` states.

#### Scenario: grade10-admin-console-collector-page-SC-08 - Staff read the collector's name and email
**Serves:** grade10-admin-console-collector-page-US-01 - the operator confirms who they are talking to

- **GIVEN** a collector whose account is named `Mei Chan` at `mei.chan@example.com`
- **WHEN** a member of staff opens their page
- **THEN** the header reads `Mei Chan` and `mei.chan@example.com`

#### Scenario: grade10-admin-console-collector-page-SC-09 - A treasurer reads the short id and no name
**Serves:** grade10-admin-console-collector-page-US-02 - the treasurer follows a borrower without their name

- **GIVEN** a collector whose account id begins `u7k2m9qa`
- **WHEN** a treasurer opens their page
- **THEN** the header reads `u7k2m9qa` and no name or email

#### Scenario: grade10-admin-console-collector-page-SC-10 - A name that cannot be read leaves the page standing
**Serves:** grade10-admin-console-collector-page-US-01 - the operator answers the customer while names cannot be read

- **GIVEN** a collector holding two vault cases, whose account cannot be read
- **WHEN** a member of staff opens their page
- **THEN** the header shows the short id, no email, and says the name is unavailable
- **AND** the vault cases section lists both cases

#### Scenario: grade10-admin-console-collector-page-SC-11 - An id nobody answers to says so
**Serves:** grade10-admin-console-collector-page-US-01 - the operator learns a link went nowhere rather than to an empty customer

- **GIVEN** an id no account answers to, or one that is not an id
- **WHEN** a member of staff or a treasurer opens the page at that id
- **THEN** the page says nobody answers to that id

#### Scenario: grade10-admin-console-collector-page-SC-18 - The header's read is refused without the identity grant
**Serves:** grade10-admin-console-collector-page-US-02 - the treasurer is never handed the name by another route

- **GIVEN** a treasurer and a collector holding a vault case
- **WHEN** the treasurer asks for that collector's name and email
- **THEN** it is refused by name, and no name or email comes back
- **AND** the collector's vault cases still answer

#### Scenario: grade10-admin-console-collector-page-SC-19 - The header opens the queue narrowed to the collector
**Serves:** grade10-admin-console-collector-page-US-01 - the operator works the customer's cases among the shop's queue

- **GIVEN** a collector holding two vault cases
- **WHEN** a member of staff follows **Their cases on the queue** in the header
- **THEN** the queue opens narrowed to that collector, listing both cases

#### Scenario: grade10-admin-console-collector-page-SC-20 - A header whose read fails shows its error and a retry
**Serves:** grade10-admin-console-collector-page-US-01 - the operator keeps the cases while the name is down

- **GIVEN** a collector holding two vault cases, and an account service that fails
- **WHEN** a member of staff opens their page
- **THEN** the header shows its own error and a retry, and the vault cases section lists both cases

#### Scenario: grade10-admin-console-collector-page-SC-22 - An account that never held a vault case is not named
**Serves:** grade10-admin-console-collector-page-US-01 - the page is never a way to read any account's name

- **GIVEN** an account named `Lee Siu Ming` that has never held a vault case
- **WHEN** a member of staff opens its page
- **THEN** the header shows its short id and says it holds no vault case
- **AND** no name or email is read or shown

### Requirement: The vault cases section lists every case the collector holds

The section SHALL list every vault case the collector's account holds, at
every status, newest-touched first.

- **The row** — the case reference, the item, the status in the collector's
  word, the lane and when it was last touched; the row SHALL open its case.
- **Paged** — 50 rows a page on a cursor, saying whether more remain, read
  rather than inferred from a full page.
- **None** — a collector holding no vault case SHALL read as holding none.
- **Not theirs any more** — a case removed from the account or erased SHALL
  NOT be listed.

#### Scenario: grade10-admin-console-collector-page-SC-12 - Every case the collector holds is listed
**Serves:** grade10-admin-console-collector-page-US-01 - the operator answers about all of a customer's cases at once

- **GIVEN** a collector holding an unsent request, a request being valued and a released case
- **WHEN** a member of staff opens their page
- **THEN** all three are listed newest-touched first, each with its reference, item, status word, lane and when it was last touched
- **AND** following a row opens that case

#### Scenario: grade10-admin-console-collector-page-SC-21 - A removed walk-in and an erased case are not listed
**Serves:** grade10-admin-console-collector-page-US-01 - the operator reads only what the collector still holds

- **GIVEN** a collector holding one released case, a walk-in staff removed from their account, and a case that was erased
- **WHEN** a member of staff opens their page
- **THEN** only the released case is listed

#### Scenario: grade10-admin-console-collector-page-SC-13 - Cases page fifty at a time
**Serves:** grade10-admin-console-collector-page-US-01 - the operator reads a long-standing customer's history

- **GIVEN** a collector holding 60 vault cases
- **WHEN** their page is opened
- **THEN** 50 cases are listed and the section says more remain
- **AND** loading more lists the other 10, none of them seen twice

#### Scenario: grade10-admin-console-collector-page-SC-14 - A collector with no vault case reads as holding none
**Serves:** grade10-admin-console-collector-page-US-01 - the operator learns the customer has nothing with the vault

- **GIVEN** an account holding no vault case
- **WHEN** a member of staff opens its page
- **THEN** the vault cases section says the collector holds no vault case

#### Scenario: grade10-admin-console-collector-page-SC-15 - A treasurer reads the same cases
**Serves:** grade10-admin-console-collector-page-US-02 - the treasurer follows a borrower's money across their cases

- **GIVEN** a collector holding two financed cases
- **WHEN** a treasurer opens their page
- **THEN** both cases are listed as staff read them

### Requirement: Each section of a collector's page reads and fails on its own

Each section SHALL load on its own, showing its own loading state, and SHALL
read on its own grant: a section whose grant the operator does not hold SHALL
say so in its own place — the header reading the short id and no name — and
the others SHALL load. A section that fails SHALL show its own error and a
retry, and the others SHALL stand.

#### Scenario: grade10-admin-console-collector-page-SC-16 - A failed section leaves the others standing
**Serves:** grade10-admin-console-collector-page-US-01 - the operator keeps the half of the page that answered

- **GIVEN** a collector's page whose vault cases cannot be read
- **WHEN** a member of staff opens it
- **THEN** the vault cases section shows its own error and a retry, and the header names the collector
- **AND** a retry once the cases can be read lists them

#### Scenario: grade10-admin-console-collector-page-SC-17 - A section does not wait for another
**Serves:** grade10-admin-console-collector-page-US-01 - the operator reads the cases while the name is still on its way

- **GIVEN** a collector's page whose header is slow to answer
- **WHEN** a member of staff opens it
- **THEN** the vault cases are listed while the header still shows it is loading
