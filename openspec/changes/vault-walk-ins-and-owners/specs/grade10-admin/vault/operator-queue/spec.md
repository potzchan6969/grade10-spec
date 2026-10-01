# grade10-admin/vault/operator-queue Specification

## Purpose

The vault section of the admin console: a queue of cases cut by what each one
is waiting for, one case's own tabs, the draft staff open for a customer at
the counter, the collector each case belongs to, the grants behind every act,
and the physical vault the items sit in.

The queue is the shop's inbox — nothing is emailed to staff — so what a case
is waiting for, and whose it is, has to be readable off the row. What money
the console records is `grade10-admin/vault/money-book`; the case machine the
buttons follow is `grade10-site/vault/case-lifecycle`; one collector's page is
`grade10-admin/console/collector-page`.

## Feature set

- The queue
  - Cut by what waits: every status belongs to exactly one status view, and
    the rest are queries
  - Rows that explain themselves: the badge names why a case is waiting on a
    person
  - Keyset paging: a page, a backlog count and a control that says whether
    there is more
  - Today, cut where the rows are: the brand's own zone decides it, in the
    read rather than in the browser
  - A count on every cut: each view says how many it holds before it is
    opened
  - The landing view is the Today cut: today's visits in slot order, from
    that cut's own query rather than a second one
  - The collector's word: a row prints the word the collector reads for the
    status, never the raw one
  - The collector by name: a row names whose case it is, by the account's
    name read at each read and copied nowhere, for staff and admins only
  - One collector's cases: a name narrows the queue and the held items to
    that collector, carried in the address and never typed
  - Names on the trail: a list that names collectors, and a list narrowed to
    one, records who read which collectors — never a name
  - Overdue and search stay whole: neither narrows by collector nor names one
- Finding one case
  - Exact or prefix: exact on a contact, prefix on a case id, and never a
    substring over a contact column
  - Canonical number: a number is matched however the operator typed it
  - A read that leaves a trail: who searched, when, what kind of term and how
    many matched — never the term
  - Prefix on the reference: the six characters a customer reads out find
    the case, on the same trail as any other search
- One case
  - Tabs by job: the case, the documents, the custody, the money
  - Buttons follow the machine: an act shows only where its move may run, and
    the worker refuses independently
  - The visit in order: the counter's steps for today's visit, ticked as
    each act lands
  - Why an act is not offered: a withheld act says what it is waiting for in
    words, the forfeiture's cure date among them
  - The identity in six words: what the record says, never the provider's
    finer states
- Who may act
  - Four grants: read, operate, approve, payout — and the identity read
    beside them, which also opens collector names and emails
  - Two people on money: staff and treasurer share no money grant
  - A verified session: a second factor, and one verification lasting twelve
    hours
  - Filed under the case: every act, and every read that declares one, is on
    the case's audit trail
- The physical vault
  - The shop is required: an item's custody row names where it is
  - Movements: in at vaulting, moved on a move, out at every exit
  - What is held: everything in a locker, with its shop, oldest first
  - Counted at a glance: how much is held, per shop, how much carries a live
    loan and how much waits on a pickup
- Walk-in intake
  - A draft at the counter: staff open a draft from the customer's email, the
    item and any photographs of their own, under the customer's own account;
    no contact number is taken at the counter
  - No name typed: an account the walk-in creates reads by its email handle
    until the customer names themselves
  - An address signed in to before: refused, and that customer sends the
    request from their own phone
  - The statement first: shown before the address is typed, its version
    kept by the open, and in production the open refuses while it is unwritten
  - Nothing emailed: the open sends nothing, and the draft waits for the
    customer to send it
  - One draft cap: a walk-in counts against the account's unsent drafts
- No intake of its own
  - Every case is the collector's: the console sends none, a walk-in waits as
    a draft for the customer to send, and no identity is keyed to a case

## ADDED Requirements

### Requirement: Staff open a draft for a customer at the counter

Staff open a vault request for a customer who walks in with an item and no
request of their own, as a draft under the customer's own account that the
customer then sends from their own phone.

1. **Open a walk-in** — the queue's header SHALL offer it to an operator
   holding the vault operate grant, and to nobody else.
2. **Read the statement** — the form SHALL show the collection statement in
   force before the address field, and the open SHALL keep the version shown.
3. **Type the request** — the customer's email address and the item's facts:
   category, title, optional description and optional financing amount, each
   held to the rules `grade10-site/vault/case-intake` sets for a collector's
   own request. The form SHALL ask for no name and take no contact number; the
   customer adds a number from their own phone.
4. **Photograph the item** — none or more of the operator's own photographs,
   held to the photograph rules of `grade10-site/vault/case-intake`; the
   customer's send still needs one.
5. **Open the case** — the draft SHALL open under the account behind that
   address, or under one created for it where there is none, and the operator
   SHALL land on the draft's own page.

The address SHALL be matched to its account whatever its capitals and the
spaces around it. Opening a walk-in SHALL send nothing to anybody. The draft
SHALL sit in the Drafts view until the customer sends it.

| Refused | When |
| --- | --- |
| Signed in before | the address belongs to an account someone has signed in to; the refusal SHALL say only that, and that the customer sends the request from their own phone |
| Draft cap | the account already holds three unsent requests; the cap's own refusal |
| Statement unwritten | in production, while no collection statement wording is set for the brand; outside production the open SHALL NOT be refused for it |
| Statement not in force | the version the form showed is not the one in force |
| A fact | any fact `grade10-site/vault/case-intake` refuses |

A refused open SHALL write no case, and the form SHALL keep what was typed.
Every case SHALL be opened under an account, and every identity SHALL stay
keyed to a person and never to a case. Staff SHALL NOT add a second item, edit
an item, or attach a photograph to a case, except a photograph on an unsent
draft staff opened.

#### Scenario: grade10-admin-vault-operator-queue-SC-55 - A walk-in opens a draft under the customer's account
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator serves a customer who arrives with no request

- **GIVEN** an address no account answers to
- **WHEN** an operator opens a walk-in for it with the item's facts and two photographs
- **THEN** a draft carrying those facts and photographs opens under a new account for that address
- **AND** the operator lands on the draft's page, and the draft is in the Drafts view
- **AND** nothing is emailed to anybody

#### Scenario: grade10-admin-vault-operator-queue-SC-56 - An account nobody has signed in to takes the draft
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator serves a customer whose address the shop met before

- **GIVEN** an account made for an address at an earlier checkout, which nobody has signed in to
- **WHEN** an operator opens a walk-in for that address
- **THEN** the draft opens under that account, and no second account exists for the address

#### Scenario: grade10-admin-vault-operator-queue-SC-57 - An address signed in to before is refused
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator learns this customer sends from their own phone

- **GIVEN** an account someone has signed in to
- **WHEN** an operator opens a walk-in for its address
- **THEN** it is refused by name, saying only that the address has signed in before and that the customer sends the request from their own phone
- **AND** no case is opened, and the form keeps what was typed

#### Scenario: grade10-admin-vault-operator-queue-SC-58 - The statement comes before the address and its version is kept
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator reads the statement to the customer before taking their address

- **GIVEN** a collection statement in force for the brand
- **WHEN** an operator opens the walk-in form
- **THEN** the statement is shown before the address field
- **AND** the draft the form opens keeps the version that was shown

#### Scenario: grade10-admin-vault-operator-queue-SC-59 - In production, an unwritten statement refuses the open
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator is not asked to collect an address under a statement that does not exist

- **GIVEN** production and a brand with no collection statement wording set
- **WHEN** an operator opens a walk-in
- **THEN** it is refused by name
- **AND** no case is opened and no account is created

#### Scenario: grade10-admin-vault-operator-queue-SC-60 - Outside production, an unwritten statement does not hold the open
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator rehearses a walk-in while the wording is still being written

- **GIVEN** an environment that is not production and a brand with no collection statement wording set
- **WHEN** an operator opens a walk-in
- **THEN** the draft opens, and the statement reads as being prepared

#### Scenario: grade10-admin-vault-operator-queue-SC-61 - A fourth unsent request is refused at the counter
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator meets the same cap the customer meets

- **GIVEN** an account holding three unsent requests, one of them opened at the counter
- **WHEN** an operator opens a walk-in for its address
- **THEN** it is refused with the draft cap's refusal, and no case is opened

#### Scenario: grade10-admin-vault-operator-queue-SC-62 - A walk-in sent twice opens one draft
**Serves:** Walk-in intake - an open the console sends again after its answer was lost

- **GIVEN** a walk-in an operator has opened
- **WHEN** the same open arrives again
- **THEN** it answers the draft already opened, and the account holds one draft for it

#### Scenario: grade10-admin-vault-operator-queue-SC-63 - Only the operate grant opens a walk-in
**Serves:** grade10-admin-vault-operator-queue-US-10 - a treasurer at the counter cannot open a case

- **GIVEN** an operator holding the vault read grant and not the vault operate grant
- **WHEN** they read the queue's header
- **THEN** no walk-in is offered, and sending one is refused by name

#### Scenario: grade10-admin-vault-operator-queue-SC-74 - An address typed in other capitals finds the same account
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator types the address as the customer spells it

- **GIVEN** an account someone has signed in to at `mei.chan@example.com`
- **WHEN** an operator opens a walk-in for ` Mei.Chan@Example.com `
- **THEN** it is refused as an address signed in before
- **AND** no case is opened, and no second account exists for the address

#### Scenario: grade10-admin-vault-operator-queue-SC-75 - A walk-in holds at most ten photographs
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator photographs the item under the collector's own limits

- **GIVEN** a walk-in form holding ten photographs
- **WHEN** the operator adds another
- **THEN** it is refused by name, and the form still holds ten

#### Scenario: grade10-admin-vault-operator-queue-SC-76 - A fact the intake refuses is refused at the counter
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator corrects a field before the draft opens

- **GIVEN** a walk-in whose title runs past 200 characters
- **WHEN** the operator opens it
- **THEN** it is refused by name beside the title
- **AND** no case is opened, and the form keeps what was typed

#### Scenario: grade10-admin-vault-operator-queue-SC-79 - A walk-in opens with no photograph
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator opens the draft before the item is photographed

- **GIVEN** a walk-in form holding a category and a title and no photograph
- **WHEN** the operator opens it
- **THEN** the draft opens
- **AND** the customer's send of it is refused until it holds a photograph

#### Scenario: grade10-admin-vault-operator-queue-SC-80 - Staff do not change a case they did not open as an unsent draft
**Serves:** grade10-admin-vault-operator-queue-US-10 - every case stays the collector's to describe

- **GIVEN** a request the collector sent, and an unsent draft staff opened
- **WHEN** an operator attaches a photograph to each
- **THEN** the sent request refuses it by name and is unchanged
- **AND** the draft staff opened takes it

### Requirement: An account a walk-in creates reads by its email handle

A walk-in SHALL set no name on any account. An account created for a walk-in
SHALL be named by the part of its address before the `@` until the customer
names themselves, and an existing account nobody has signed in to SHALL keep
the name it has.

#### Scenario: grade10-admin-vault-operator-queue-SC-64 - A created account reads by its handle
**Serves:** grade10-admin-vault-operator-queue-US-10 - the operator tells the new draft apart before the customer names themselves

- **GIVEN** no account for `mei.chan@example.com`
- **WHEN** an operator opens a walk-in for it
- **THEN** the draft's collector reads `mei.chan` on the queue

#### Scenario: grade10-admin-vault-operator-queue-SC-65 - A walk-in renames nobody
**Serves:** grade10-admin-vault-operator-queue-US-10 - an earlier account keeps the name it carries

- **GIVEN** an account nobody has signed in to, named `Mei Chan`
- **WHEN** an operator opens a walk-in for its address
- **THEN** the account is still named `Mei Chan`

### Requirement: A row names whose case it is

A queue row, in every status view and the Today cut, and a held-item row
SHALL name the case's collector for an operator holding the identity read
grant.

- **The account's name** — read from the account at each read and copied
  nowhere, so a renamed account reads its new name.
- **Name unavailable** — a row whose account cannot be read SHALL show the
  collector's short id — the first eight characters of the account's id — and
  "name unavailable", and the rest of the row and the list SHALL stand.
- **No collector** — a case no account holds SHALL name no collector.
- **No grant, no column** — an operator without the identity read grant SHALL
  read the rows with no collector column, and no name on any of them.
- **Short id stands in** — a row reading the short id SHALL narrow the list
  and link the collector's page as a name does.
- **Overdue and search** — the Overdue view and a search's results SHALL name
  no collector and SHALL NOT narrow by one; a found case's header links its
  collector.

#### Scenario: grade10-admin-vault-operator-queue-SC-66 - The queue names each case's collector
**Serves:** grade10-admin-vault-operator-queue-US-11 - the operator greets the customer by name

- **GIVEN** two cases held by accounts named `Mei Chan` and `Ken Lo`
- **WHEN** an operator holding the identity read grant reads the queue
- **THEN** each row names its own collector

#### Scenario: grade10-admin-vault-operator-queue-SC-67 - The held items name each item's collector
**Serves:** grade10-admin-vault-operator-queue-US-11 - the operator tells two customers' items apart on the shelf

- **GIVEN** items held for two collectors
- **WHEN** an operator holding the identity read grant reads the held items
- **THEN** each row names the collector whose case holds it

#### Scenario: grade10-admin-vault-operator-queue-SC-68 - A renamed account reads its new name
**Serves:** grade10-admin-vault-operator-queue-US-11 - the operator reads the name the customer gave last

- **GIVEN** a case whose account was renamed after the case was opened
- **WHEN** the queue is read
- **THEN** the row names the account's new name

#### Scenario: grade10-admin-vault-operator-queue-SC-69 - A name that cannot be read leaves the row standing
**Serves:** grade10-admin-vault-operator-queue-US-11 - the operator keeps working while names cannot be read

- **GIVEN** a page of rows, one of whose accounts cannot be read
- **WHEN** an operator holding the identity read grant reads the queue
- **THEN** that row shows the collector's short id and "name unavailable"
- **AND** every other row names its collector, and the list loads
- **AND** following the short id narrows the list to that collector

#### Scenario: grade10-admin-vault-operator-queue-SC-70 - A treasurer reads the rows with no collector
**Serves:** grade10-admin/console/collector-page#grade10-admin-console-collector-page-US-02 - the treasurer follows money without a name their role does not hold

- **GIVEN** a treasurer
- **WHEN** they read the queue and the held items
- **THEN** no row has a collector column or a name
- **AND** asking for the collectors' names is refused by name

### Requirement: A collector's name narrows the queue and the held items

A click on a collector's name SHALL narrow the queue's status views, the Today
cut and the held items to that collector's cases.

- **In the address** — the collector SHALL be carried in the address, so a
  reload or a link keeps the narrowing; there SHALL be no field to type a
  collector.
- **Counted for that collector** — every cut's count and the held items'
  figures SHALL count that collector's cases alone.
- **Named above the rows** — the narrowed list SHALL name the collector, or
  show their short id to an operator without the identity read grant, and
  SHALL offer a control that clears the narrowing.
- **None here** — a cut holding none of that collector's cases SHALL say the
  collector holds no case in it.
- **Unknown collector** — an address naming an id no account answers to, or
  one that is not an id, SHALL read as a collector holding no case.

#### Scenario: grade10-admin-vault-operator-queue-SC-71 - A name narrows the lists to that collector
**Serves:** grade10-admin-vault-operator-queue-US-12 - the operator sees everything one customer has with the shop

- **GIVEN** a collector with two cases waiting on staff and one item held, among other collectors' cases
- **WHEN** an operator clicks the collector's name
- **THEN** the cut for cases waiting on staff lists those two and counts 2
- **AND** the held items list that one item, and their figures count it alone
- **AND** the collector's name stands above the rows with a control that clears it

#### Scenario: grade10-admin-vault-operator-queue-SC-72 - The address keeps the collector
**Serves:** grade10-admin-vault-operator-queue-US-12 - the operator sends a colleague the narrowed queue

- **GIVEN** a queue narrowed to one collector
- **WHEN** the page is reloaded
- **THEN** it is still narrowed to that collector
- **AND** clearing it lists every collector's cases again, and nowhere on the queue offers a field to type a collector

#### Scenario: grade10-admin-vault-operator-queue-SC-73 - A cut holding none of the collector's cases says so
**Serves:** grade10-admin-vault-operator-queue-US-12 - the operator reads an empty cut as that customer having nothing in it

- **GIVEN** a queue narrowed to a collector with no case being agreed
- **WHEN** the cut for cases being agreed is opened
- **THEN** it says the collector holds no case in it, and its count reads none

#### Scenario: grade10-admin-vault-operator-queue-SC-77 - An address naming nobody reads as a collector holding no case
**Serves:** grade10-admin-vault-operator-queue-US-12 - a stale link reads as empty rather than failing

- **GIVEN** a queue address narrowed to an id no account answers to, or to `not-a-user-id`
- **WHEN** a member of staff or a treasurer opens it
- **THEN** every cut says the collector holds no case in it, and every count reads none

#### Scenario: grade10-admin-vault-operator-queue-SC-78 - Overdue and search stay whole while the queue is narrowed
**Serves:** grade10-admin-vault-operator-queue-US-12 - the arrears read every borrower whoever was narrowed to

- **GIVEN** a queue narrowed to one collector, and overdue loans of two collectors
- **WHEN** the Overdue view is opened
- **THEN** it lists both overdue loans and names no collector

### Requirement: Every read that names a collector, or lists one collector's cases, is recorded

Each page of rows that names collectors, and each read narrowed to one
collector, SHALL write one entry on the audit trail naming who read, when and
the ids of the collectors read. No column of the entry SHALL hold a name or an
email. A list that names nobody SHALL write none. A read whose entry cannot be
written SHALL be refused rather than shown.

#### Scenario: grade10-admin-vault-operator-queue-SC-81 - A page of names is recorded without the names
**Serves:** grade10-admin-vault-operator-queue-US-11 - the shop can answer who looked at a customer

- **GIVEN** cases of two named collectors waiting on staff
- **WHEN** a member of staff reads that cut
- **THEN** the audit trail carries one entry naming the operator, the instant and both collectors' ids
- **AND** neither name nor email appears in any column of it

#### Scenario: grade10-admin-vault-operator-queue-SC-82 - A list narrowed to one collector is recorded
**Serves:** grade10-admin-vault-operator-queue-US-12 - reading one customer's cases leaves a trace

- **WHEN** a treasurer reads the queue narrowed to one collector
- **THEN** the audit trail carries one entry naming the treasurer, the instant and that collector's id

## MODIFIED Requirements

### Requirement: Search is exact on a contact, prefix on a case id, and leaves a trail

Search SHALL match a phone number or an email address exactly, and a case id
or a case reference by prefix. It SHALL NOT match a substring of a contact
column.

A number SHALL be canonicalised against the brand's numbering plan before it
is compared, so the spacing an operator typed does not decide whether the case
is found. The term SHALL travel in the request body, never in an address.

One kind per term SHALL be decided before the match is made: a term of two to
six characters drawn from the reference's own alphabet SHALL be searched as a
reference, whatever case the operator typed it in, and a term of seven or more
SHALL be searched as a case-id prefix.

Every search SHALL write one entry on the audit trail naming who searched,
when, what kind of term it was, and how many cases matched. The term itself
SHALL appear in no column of it. A list read is recorded only when it names a
collector or is narrowed to one, as "Every read that names a collector, or
lists one collector's cases, is recorded" states.

The answer SHALL be one page and SHALL say when more matched than were handed
back. A search that matches no case SHALL say so, rather than reading as a
queue with nothing in it.

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-02a rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-07 - A number is found however it was typed
**Serves:** grade10-admin-vault-operator-queue-US-02 - Operator finds the case of the person at the counter

- **GIVEN** a case stored under a canonical number
- **WHEN** an operator searches for the same number with spaces in it
- **THEN** the case is found

#### Scenario: grade10-admin-vault-operator-queue-SC-07a - A number typed in full-width digits or with a bare dial code is found
**Serves:** grade10-admin-vault-operator-queue-US-02 - Operator finds the case of the person at the counter

- **GIVEN** a case stored under `+85298765432`
- **WHEN** an operator searches for `９８７６ ５４３２`, or for `852 9876 5432` with no `+`
- **THEN** the case is found, and the search records neither term

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-m6s rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-08 - A search records itself without the term
**Serves:** grade10-admin-vault-operator-queue-US-02 - Operator finds the case of the person at the counter

- **WHEN** an operator searches for a customer's email address
- **THEN** the audit trail carries one entry naming the operator, the instant, that the term was an address, and the number of matches
- **AND** the address appears in no column of it

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-4px rev=2 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-09 - Listing the queue records nothing
**Serves:** grade10-admin-vault-operator-queue-US-02 - Operator finds the case of the person at the counter

- **GIVEN** a treasurer
- **WHEN** they read the queue unnarrowed
- **THEN** no audit entry is written for it

#### Scenario: grade10-admin-vault-operator-queue-SC-24 - The characters read out at the counter find the case
**Serves:** grade10-admin-vault-operator-queue-US-05 - the operator serves the person at the counter from what they read out

- **GIVEN** a case carrying a six-character reference
- **WHEN** an operator searches for those characters in lower case
- **THEN** that case is found

#### Scenario: grade10-admin-vault-operator-queue-SC-26 - A reference nobody holds says so
**Serves:** grade10-admin-vault-operator-queue-US-05 - the operator learns the characters were misheard rather than reading an empty queue

- **WHEN** an operator searches for a reference no case carries
- **THEN** the answer says no case answers to it

#### Scenario: grade10-admin-vault-operator-queue-SC-47 - The first characters of a case id find the case
**Serves:** grade10-admin-vault-operator-queue-US-02 - the operator opens the case from the id in front of them

- **GIVEN** a case whose id an operator is reading off another screen
- **WHEN** they search the first eight characters of that id
- **THEN** that case is found

#### Scenario: grade10-admin-vault-operator-queue-SC-48 - Part of a number finds nothing
**Serves:** grade10-admin-vault-operator-queue-US-02 - the operator cannot walk the customer list a piece of a number at a time

- **GIVEN** a case stored under a known phone number
- **WHEN** an operator searches part of that number rather than the whole of it
- **THEN** the case is not found

### Requirement: Every act sits behind a named grant

Each act SHALL require exactly one named grant:

| Grant | Held by | What it opens |
| --- | --- | --- |
| Vault read | staff, treasurer, admin | cases, the contact, items, documents, what one case owes, held items, the arrears, search, narrowing by collector, the collector page |
| Vault operate | staff, admin | open a walk-in, start valuation, accept at the counter, record or reuse an identity check, record terms explained, prepare, hand over, vault, move, release, unwind, cancel, the visit, hand a parked message back |
| Vault approve | staff, admin | record a valuation, make or withdraw an offer, decline, send the forfeiture notice, forfeit |
| Vault payout | treasurer, admin | the advance, a repayment, taking a money record back, the ledger and the position |
| Identity read | staff, admin | the identity photograph, the collector's name on the queue and the held items, and the collector's name and email on the collector page |

Staff and treasurer SHALL share no money grant. What the console shows and
what the worker requires SHALL be one declaration, so a section an operator
cannot use is not offered.

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-4bx rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-12 - The console shows only what the operator may do
**Serves:** grade10-admin-vault-operator-queue-US-03 - Operator works one case from its own tabs

- **GIVEN** an operator holding the vault read grant alone
- **WHEN** they open a case
- **THEN** no act requiring another grant is offered, and sending one is refused by name

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-ld3 rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-13 - Staff cannot record money
**Serves:** grade10-admin-vault-operator-queue-US-03 - Operator works one case from its own tabs

- **GIVEN** an operator holding the staff grants
- **WHEN** they try to record a repayment
- **THEN** it is refused by name

## REMOVED Requirements

### Requirement: The console opens no case of its own

**Reason:** Staff open a draft for a customer who walks in with no request on
their phone (decisions Q10). The draft opens under the customer's own account
and is sent by the customer, so a case still belongs to a person.

**Migration:** Replaced by "Staff open a draft for a customer at the counter",
which carries the rule that every identity stays keyed to a person and never
to a case. grade10-admin-vault-operator-queue-SC-20 is retired.
