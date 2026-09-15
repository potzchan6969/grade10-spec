# grade10-admin/vault/operator-queue Specification

## Purpose

The vault section of the admin console: a queue of cases cut by what each one
is waiting for, one case's own tabs, the grants behind every act, and the
physical vault the items sit in.

The queue is the shop's inbox — nothing is emailed to staff — so what a case
is waiting for has to be readable off the row. What money the console records
is `grade10-admin/vault/money-book`; the case machine the buttons follow is
`grade10-site/vault/case-lifecycle`.

## Feature set

- The queue
  - Cut by what waits: every status belongs to exactly one status view, and
    the rest are queries
  - Today, cut where the rows are: the shop's own day decides it, in the read
    rather than in the browser
  - Rows that explain themselves: the badge names why a case is waiting on a
    person
  - Keyset paging: a page, a backlog count and a control that says whether
    there is more
- Finding one case
  - Exact or prefix: exact on a contact, prefix on a case id, and never a
    substring over a contact column
  - Canonical number: a number is matched however the operator typed it
  - A read that leaves a trail: who searched, when, what kind of term and how
    many matched — never the term
- One case
  - Tabs by job: the case, the documents, the custody, the money
  - Buttons follow the machine: an act shows only where its move may run, and
    the worker refuses independently
- Who may act
  - Four grants: read, operate, approve, payout — and the identity read
    beside them
  - Two people on money: staff and treasurer share no money grant
  - A verified session: a second factor, and one verification lasting twelve
    hours
  - Filed under the case: every act, and every read that declares one, is on
    the case's audit trail
- The physical vault
  - The shop is required: an item's custody row names where it is
  - Movements: in at vaulting, moved on a move, out at every exit
  - What is held: everything in a locker, with its shop, oldest first
- No intake of its own
  - Every case is the collector's: the console opens none, and no identity is
    keyed to a case

## Requirements

### Requirement: The queue cuts cases by what they are waiting for

The queue SHALL offer these views, and every status SHALL belong to exactly
one of the first five:

| View | What it lists |
| --- | --- |
| Needs staff | `submitted`, `under_valuation`, `offer_made` — the default view |
| Agreeing | `accepted`, `signing` |
| In custody | `vaulted`, `active`, `repaid` |
| Closed | `released`, `declined`, `cancelled`, `expired`, `forfeited` |
| Drafts | `draft` |
| Today | every case that has not ended whose visit falls on the shop's own calendar day |
| Overdue | every live loan past its due date, longest overdue first |

The Today cut SHALL be made where the rows are read, on the brand's own zone,
so that the view and the badge beside it cannot disagree across a midnight.

#### Scenario: grade10-admin-vault-operator-queue-SC-01 - Today is the shop's day
**Serves:** grade10-admin-vault-operator-queue-US-01 - Operator opens the shop and sees what is waiting

- **GIVEN** a visit booked for later today at the shop, read early in the morning there while the date in Coordinated Universal Time is still yesterday's
- **WHEN** the Today view is read
- **THEN** the visit's case is in it

#### Scenario: grade10-admin-vault-operator-queue-SC-02 - Every status has exactly one home
**Serves:** grade10-admin-vault-operator-queue-US-01 - Operator opens the shop and sees what is waiting

- **WHEN** the five status views are read together
- **THEN** every status appears in exactly one of them

### Requirement: A row says why its case is waiting on a person

Each row SHALL carry the case id, the item's name, the status, the lane, the
amount asked for, the visit it holds, when it was last touched, and every
reason it is waiting on a person:

| Badge | Raised when |
| --- | --- |
| Release requested | the collector has asked for the item back and nobody has answered |
| Awaiting valuation | the case is `submitted` and nobody has started it |
| Valuation stalled | the case has been `under_valuation` untouched for more than 7 days |
| Offer lapsed | the case's offer ran out of window |
| Message parked | a message to the collector ran out of attempts |
| Document seen before | the identity document is on file under another account |
| Visit today | the case's visit falls on the shop's own day |

The badges SHALL be derived at the read, never stored, and the console and the
worker SHALL derive them the same way.

Before terms are accepted a case SHALL badge a person; after them it SHALL run
a clock instead.

#### Scenario: grade10-admin-vault-operator-queue-SC-03 - A valuation nobody has touched badges after a week
**Serves:** grade10-admin-vault-operator-queue-US-01 - Operator opens the shop and sees what is waiting

- **GIVEN** a case being valued and untouched for 8 days
- **WHEN** the queue is read
- **THEN** its row badges a stalled valuation

#### Scenario: grade10-admin-vault-operator-queue-SC-04 - A case being valued yesterday badges nothing for it
**Serves:** The queue - a case being valued yesterday badges nothing for it

- **GIVEN** a case being valued and touched 2 days ago
- **WHEN** the queue is read
- **THEN** its row carries no stalled badge

### Requirement: The queue pages on a cursor and says whether there is more

The queue SHALL page newest-touched first on a cursor over what the page
stopped reading, never on an offset, and SHALL answer 50 rows by default and at
most 200 where a caller asks for more.

Each answer SHALL carry the number of rows behind the filter and whether more
remain, read rather than inferred from the page being full. A page with no
rows over a standing backlog SHALL say so and still offer the control.

#### Scenario: grade10-admin-vault-operator-queue-SC-05 - A page resumes where the last one stopped
**Serves:** grade10-admin-vault-operator-queue-US-01 - Operator opens the shop and sees what is waiting

- **GIVEN** a queue of 120 cases
- **WHEN** two pages are read in turn
- **THEN** the second begins after the last row of the first, with no row seen twice and none skipped

#### Scenario: grade10-admin-vault-operator-queue-SC-06 - A full page is not the signal
**Serves:** The queue - a full page is not the signal

- **GIVEN** a filter matching exactly one page of rows
- **WHEN** the page is read
- **THEN** it says there is nothing more, rather than offering another page

### Requirement: Search is exact on a contact, prefix on a case id, and leaves a trail

Search SHALL match a phone number or an email address exactly, and a case id
by prefix. It SHALL NOT match a substring of a contact column.

A number SHALL be canonicalised against the brand's numbering plan before it
is compared, so the spacing an operator typed does not decide whether the case
is found. The term SHALL travel in the request body, never in an address.

Every search SHALL write one entry on the audit trail naming who searched,
when, what kind of term it was, and how many cases matched. The term itself
SHALL appear in no column of it.

The answer SHALL be one page and SHALL say when more matched than were handed
back.

#### Scenario: grade10-admin-vault-operator-queue-SC-07 - A number is found however it was typed
**Serves:** grade10-admin-vault-operator-queue-US-02 - Operator finds the case of the person at the counter

- **GIVEN** a case stored under a canonical number
- **WHEN** an operator searches for the same number with spaces in it
- **THEN** the case is found

#### Scenario: grade10-admin-vault-operator-queue-SC-08 - A search records itself without the term
**Serves:** grade10-admin-vault-operator-queue-US-02 - Operator finds the case of the person at the counter

- **WHEN** an operator searches for a customer's email address
- **THEN** the audit trail carries one entry naming the operator, the instant, that the term was an address, and the number of matches
- **AND** the address appears in no column of it

#### Scenario: grade10-admin-vault-operator-queue-SC-09 - Listing the queue records nothing
**Serves:** grade10-admin-vault-operator-queue-US-02 - Operator finds the case of the person at the counter

- **WHEN** an operator reads the queue
- **THEN** no audit entry is written for it

### Requirement: One case opens into tabs whose acts follow the machine

A case SHALL open into a header and four tabs:

| Surface | What an operator does there |
| --- | --- |
| Header | see the contact, open a chat link, set or change the contact, book, move or cancel the visit, read the badges, hand a parked message back to the queue |
| Case | start the valuation, record a valuation, make or counter an offer, withdraw it, record the collector's acceptance at the counter, agree custody terms, decline, cancel, and read the case's timeline |
| Documents | record or reuse the identity check, record that the terms were explained, prepare documents, prepare the release, hand over the link and QR code, re-check a packet, download the identity photograph |
| Custody | confirm vaulted with its shop and locker, move the item, release, unwind, send the forfeiture notice, forfeit |
| Payouts | record the advance, record a repayment against a quote, take a money record back |

An act SHALL be offered only at the statuses its move may run from, and the
worker SHALL refuse it independently of what the console offered.

#### Scenario: grade10-admin-vault-operator-queue-SC-10 - The console offers only what the machine allows
**Serves:** grade10-admin-vault-operator-queue-US-03 - Operator works one case from its own tabs

- **GIVEN** a case in the vault
- **WHEN** its tabs are read
- **THEN** no act that runs only before custody is offered

#### Scenario: grade10-admin-vault-operator-queue-SC-11 - The worker refuses what a stale console offers
**Serves:** grade10-admin-vault-operator-queue-US-03 - Operator works one case from its own tabs

- **GIVEN** a console showing a case that has since moved
- **WHEN** an operator sends an act the case no longer allows
- **THEN** the worker refuses it by name

### Requirement: Every act sits behind a named grant

Each act SHALL require exactly one named grant:

| Grant | Held by | What it opens |
| --- | --- | --- |
| Vault read | staff, treasurer, admin | cases, the contact, items, documents, what one case owes, held items, the arrears, search |
| Vault operate | staff, admin | start valuation, accept at the counter, record or reuse an identity check, record terms explained, prepare, hand over, vault, move, release, unwind, cancel, the visit, hand a parked message back |
| Vault approve | staff, admin | record a valuation, make or withdraw an offer, decline, send the forfeiture notice, forfeit |
| Vault payout | treasurer, admin | the advance, a repayment, taking a money record back, the ledger and the position |
| Identity read | staff, admin | the identity photograph |

Staff and treasurer SHALL share no money grant. What the console shows and
what the worker requires SHALL be one declaration, so a section an operator
cannot use is not offered.

#### Scenario: grade10-admin-vault-operator-queue-SC-12 - The console shows only what the operator may do
**Serves:** grade10-admin-vault-operator-queue-US-03 - Operator works one case from its own tabs

- **GIVEN** an operator holding the vault read grant alone
- **WHEN** they open a case
- **THEN** no act requiring another grant is offered, and sending one is refused by name

#### Scenario: grade10-admin-vault-operator-queue-SC-13 - Staff cannot record money
**Serves:** grade10-admin-vault-operator-queue-US-03 - Operator works one case from its own tabs

- **GIVEN** an operator holding the staff grants
- **WHEN** they try to record a repayment
- **THEN** it is refused by name

### Requirement: An operator's session is verified, and stays verified for twelve hours

A second factor SHALL be required in production and in staging, and SHALL be
optional in development.

One verification SHALL stamp the session for 12 hours, and no act inside that
window SHALL ask for another.

#### Scenario: grade10-admin-vault-operator-queue-SC-14 - Staging asks for the second factor
**Serves:** Who may act - staging asks for the second factor

- **GIVEN** an operator signing in to staging
- **WHEN** they open a vault surface
- **THEN** a second factor is required

#### Scenario: grade10-admin-vault-operator-queue-SC-15 - One verification covers the shift's next act
**Serves:** Who may act - one verification covers the shift's next act

- **GIVEN** an operator who verified an hour ago
- **WHEN** they record a payment
- **THEN** nothing asks them again

### Requirement: Every act on a case is filed under that case

Every act that changes a case SHALL be recorded on the hash-chained audit
trail under that case, so one case's whole trail can be pulled by its id.

A read that declares what it should leave behind SHALL be recorded too, and a
read that declares nothing SHALL leave no entry. An act or declaring read with
nowhere to write its entry SHALL be refused rather than performed unrecorded.

Nothing SHALL be emailed or pushed to staff: the queue, its badges and the
Today and Overdue views are the signal.

#### Scenario: grade10-admin-vault-operator-queue-SC-16 - One case's trail is one query
**Serves:** Who may act - one case's trail is one query

- **GIVEN** a case that has been valued, offered, signed and paid out
- **WHEN** its audit trail is pulled by the case id
- **THEN** every one of those acts is on it, with who did each

#### Scenario: grade10-admin-vault-operator-queue-SC-17 - An act with nowhere to record itself is refused
**Serves:** Who may act - an act with nowhere to record itself is refused

- **GIVEN** an act whose audit trail cannot be written
- **WHEN** an operator sends it
- **THEN** it is refused rather than performed

### Requirement: The physical vault names where each item is

Taking an item into the vault SHALL require the shop it will be kept at, and
SHALL accept an optional locker. The shop SHALL be one the diary knows, and
SHALL never be typed as free text.

Every entry, move and exit SHALL write a movement: in at vaulting, moved on a
move between lockers, out at release, unwind and forfeiture.

Everything held SHALL be listable with the shop holding it, oldest first, on
the same paging as the queue.

A forfeited item SHALL be written out of custody, because it has become the
shop's own stock.

#### Scenario: grade10-admin-vault-operator-queue-SC-18 - Vaulting without a shop is refused
**Serves:** grade10-admin-vault-operator-queue-US-04 - Operator takes an item in and can say where it is

- **WHEN** an operator confirms an item into the vault with no shop
- **THEN** it is refused by name

#### Scenario: grade10-admin-vault-operator-queue-SC-19 - The held list says which vault holds what
**Serves:** grade10-admin-vault-operator-queue-US-04 - Operator takes an item in and can say where it is

- **GIVEN** items held at two shops
- **WHEN** the held list is read
- **THEN** each row names the shop it is held at

### Requirement: The console opens no case of its own

The console SHALL have no intake: staff SHALL NOT open a case, add a second
item to one, edit an item or attach a photograph of their own. A collector
without an account opens one in the shop, on their own phone.

Every identity SHALL therefore be keyed to a person and never to a case.

#### Scenario: grade10-admin-vault-operator-queue-SC-20 - There is no counter intake
**Serves:** grade10-admin-vault-operator-queue-US-04 - Operator takes an item in and can say where it is

- **WHEN** an operator looks for a way to open a case
- **THEN** the console offers none, and every case in the queue belongs to an account
