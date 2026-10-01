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
  - Today, cut where the rows are: the brand's own zone decides it, in the
    read rather than in the browser
  - A count on every cut: each view says how many it holds before it is
    opened
  - The landing view is the Today cut: today's visits in slot order, from
    that cut's own query rather than a second one
  - The collector's word: a row prints the word the collector reads for the
    status, never the raw one
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
  - Counted at a glance: how much is held, per shop, how much carries a live
    loan and how much waits on a pickup
- No intake of its own
  - Every case is the collector's: the console opens none, and no identity is
    keyed to a case

## Requirements

### Requirement: The queue cuts cases by what they are waiting for

The queue SHALL offer these views, and every status SHALL belong to exactly
one of the first five:

| View | What it lists |
| --- | --- |
| Needs staff | `submitted`, `under_valuation`, `offer_made` |
| Agreeing | `accepted`, `signing` |
| In custody | `vaulted`, `active`, `repaid` |
| Closed | `released`, `declined`, `cancelled`, `expired`, `forfeited` |
| Drafts | `draft` |
| Today | every case that has not ended whose visit falls on the calendar day the brand's own zone puts it in |
| Overdue | every live loan past its due date, longest overdue first |

The Today cut SHALL be made where the rows are read, on the brand's own zone
as `shared/dates-and-times` states it, so that the view and the badge beside it
cannot disagree across a midnight.

Every view SHALL say how many cases it holds before it is opened, counted
behind that view's own filter rather than over the page in hand, at the
instant and on the zone the rows are read. A view holding nothing SHALL say
so rather than leaving its count unwritten, and the page SHALL say how many of
that number it is showing.

The queue SHALL open on the Today cut, read from that cut's own query rather
than from a second one, ordered by the visit's slot time earliest first. Where
the cut holds nothing, the landing view SHALL say no visit is booked for
today.

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-77a rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-01 - Today is the shop's day
**Serves:** grade10-admin-vault-operator-queue-US-01 - Operator opens the shop and sees what is waiting

- **GIVEN** a visit booked for later today at the shop, read early in the morning there while the date in Coordinated Universal Time is still yesterday's
- **WHEN** the Today view is read
- **THEN** the visit's case is in it

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-90m rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-02 - Every status has exactly one home
**Serves:** grade10-admin-vault-operator-queue-US-01 - Operator opens the shop and sees what is waiting

- **WHEN** the five status views are read together
- **THEN** every status appears in exactly one of them

#### Scenario: grade10-admin-vault-operator-queue-SC-21 - Every cut says how many it holds
**Serves:** grade10-admin-vault-operator-queue-US-06 - the operator sizes the day's load before opening a case

- **GIVEN** 60 cases waiting on staff and none agreeing
- **WHEN** the queue is read
- **THEN** the cut for cases waiting on staff says it holds 60, and the one for cases agreeing says it holds none
- **AND** the page in hand says how many of the 60 it is showing

#### Scenario: grade10-admin-vault-operator-queue-SC-22 - The console opens on today's visits in slot order
**Serves:** grade10-admin-vault-operator-queue-US-06 - the operator starts the shift on the day's visits

- **GIVEN** visits booked at the shop today for 10:00, 11:30 and 15:00
- **WHEN** an operator opens the vault section
- **THEN** the view it opens on is the Today cut, holding those three cases in that order, with its count beside it
- **AND** reading the Today cut straight after answers those same three cases

#### Scenario: grade10-admin-vault-operator-queue-SC-23 - A day with no visit says so
**Serves:** grade10-admin-vault-operator-queue-US-06 - the operator learns there is nothing booked before working the rest of the queue

- **GIVEN** no visit booked at the shop for today
- **WHEN** an operator opens the vault section
- **THEN** the view it opens on says no visit is booked for today, and its count reads none

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

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-9ub rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-03 - A valuation nobody has touched badges after a week
**Serves:** grade10-admin-vault-operator-queue-US-01 - Operator opens the shop and sees what is waiting

- **GIVEN** a case being valued and untouched for 8 days
- **WHEN** the queue is read
- **THEN** its row badges a stalled valuation

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-rv6 rev=1 -->
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

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-uo6 rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-05 - A page resumes where the last one stopped
**Serves:** grade10-admin-vault-operator-queue-US-01 - Operator opens the shop and sees what is waiting

- **GIVEN** a queue of 120 cases
- **WHEN** two pages are read in turn
- **THEN** the second begins after the last row of the first, with no row seen twice and none skipped

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-3mx rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-06 - A full page is not the signal
**Serves:** The queue - a full page is not the signal

- **GIVEN** a filter matching exactly one page of rows
- **WHEN** the page is read
- **THEN** it says there is nothing more, rather than offering another page

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
SHALL appear in no column of it.

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

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-4px rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-09 - Listing the queue records nothing
**Serves:** grade10-admin-vault-operator-queue-US-02 - Operator finds the case of the person at the counter

- **WHEN** an operator reads the queue
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

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-skv rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-10 - The console offers only what the machine allows
**Serves:** grade10-admin-vault-operator-queue-US-03 - Operator works one case from its own tabs

- **GIVEN** a case in the vault
- **WHEN** its tabs are read
- **THEN** no act that runs only before custody is offered

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-jmv rev=1 -->
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

### Requirement: Every act on a case is filed under that case

Every act that changes a case SHALL be recorded on the hash-chained audit
trail under that case, so one case's whole trail can be pulled by its id.

A read that declares what it should leave behind SHALL be recorded too, and a
read that declares nothing SHALL leave no entry. An act or declaring read with
nowhere to write its entry SHALL be refused rather than performed unrecorded.

Nothing SHALL be emailed or pushed to staff: the queue, its badges and the
Today and Overdue views are the signal.

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-p2u rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-16 - One case's trail is one query
**Serves:** Who may act - one case's trail is one query

- **GIVEN** a case that has been valued, offered, signed and paid out
- **WHEN** its audit trail is pulled by the case id
- **THEN** every one of those acts is on it, with who did each

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-x9j rev=1 -->
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

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-96r rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-18 - Vaulting without a shop is refused
**Serves:** grade10-admin-vault-operator-queue-US-04 - Operator takes an item in and can say where it is

- **WHEN** an operator confirms an item into the vault with no shop
- **THEN** it is refused by name

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-1uj rev=1 -->
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

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-cdy rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-20 - There is no counter intake
**Serves:** grade10-admin-vault-operator-queue-US-04 - Operator takes an item in and can say where it is

- **WHEN** an operator looks for a way to open a case
- **THEN** the console offers none, and every case in the queue belongs to an account

### Requirement: An operator's session is verified with a second factor, and stays verified for twelve hours

A second factor SHALL be required in production, for every brand, and SHALL
be optional in staging and in development.

One verification SHALL stamp the session for 12 hours, and no act inside that
window SHALL ask for another.

#### Scenario: grade10-admin-vault-operator-queue-SC-53 - Production asks for the second factor
**Serves:** Who may act - production asks for the second factor

- **GIVEN** an operator signing in to production
- **WHEN** they open a vault surface
- **THEN** a second factor is required

#### Scenario: grade10-admin-vault-operator-queue-SC-54 - One verification covers the shift's next act
**Serves:** Who may act - one verification covers the shift's next act

- **GIVEN** an operator who verified an hour ago
- **WHEN** they record a payment
- **THEN** nothing asks them again

### Requirement: A case reads on the console in the words the collector reads

Every console surface that names a case shows the handle the collector can
read out and the word the collector reads for where the case stands.

- **The reference** - a queue row, a row of the Today cut, a held-item row and
  a case's own header SHALL each show that case's six-character reference.
- **The word** - a status SHALL be shown as the word the collector reads for
  it, and no console surface SHALL print the stored status name.
- **One vocabulary** - the word the console shows for a status SHALL be the
  word the collector's own case page shows for it.
- **Who is waited on** - a queue row SHALL say when the case is waiting on the
  collector rather than on a member of staff.

#### Scenario: grade10-admin-vault-operator-queue-SC-27 - A row reads the collector's word, never the stored one
**Serves:** grade10-admin-vault-operator-queue-US-01 - the operator reads a row in the words the person at the counter will use

- **GIVEN** a case whose stored status is `under_valuation`
- **WHEN** the queue is read
- **THEN** the row shows the word the collector's own case page shows for that status
- **AND** no stored status name is printed on it

#### Scenario: grade10-admin-vault-operator-queue-SC-28 - Every case surface carries the reference
**Serves:** grade10-admin-vault-operator-queue-US-05 - the operator reads the reference back to the person at the counter

- **GIVEN** a case holding an item in the vault
- **WHEN** an operator reads its queue row, its row in the held list and its own header
- **THEN** each shows that case's reference

#### Scenario: grade10-admin-vault-operator-queue-SC-29 - A row says when the collector is the one being waited on
**Serves:** grade10-admin-vault-operator-queue-US-01 - the operator sees at a glance which cases are not theirs to move

- **GIVEN** a case whose offer is out and unanswered
- **WHEN** the queue is read
- **THEN** its row says the case is waiting on the collector

### Requirement: The case opens on today's visit, step by step

A case with a visit at the shop today opens on the steps the counter works for
that visit, in the order they are worked.

- **The steps** - the checklist SHALL hold these steps, in this order:

| # | Step | Ticked when | Lane |
| --- | --- | --- | --- |
| 1 | Identity | an identity check is recorded or reused for the collector | both |
| 2 | Inspect and value | a valuation is recorded, or the one on file is confirmed | both |
| 3 | Terms | the collector's acceptance is recorded, or on a case that borrows nothing the custody terms are agreed | both |
| 4 | Explain key terms | the loan agreement's key terms are recorded as explained | financed only |
| 5 | Prepare documents | the packet is prepared | both |
| 6 | Hand over the link | the packet's link is handed to the collector | both |
| 7 | Vault the item | the item is confirmed into the vault with its shop | both |

- **Ticked as they land** - a step SHALL be ticked when the act that lands it
  is recorded, and never before.
- **The step in hand** - the earliest step not yet ticked SHALL carry the act
  that lands it.
- **A step not yet offered** - a step whose act the case does not yet allow
  SHALL say what it is waiting for, in words, rather than offering an act the
  worker will refuse.
- **No visit today** - a case with no visit at the shop today SHALL show no
  checklist.

#### Scenario: grade10-admin-vault-operator-queue-SC-30 - The counter reads the visit's steps in order
**Serves:** grade10-admin-vault-operator-queue-US-07 - a shop of three runs the counter from the screen

- **GIVEN** a financed case with a visit at the shop today, its identity check recorded and nothing valued yet
- **WHEN** staff open the case
- **THEN** it opens on the visit's seven steps in order, with the identity step ticked
- **AND** the step that inspects and values carries the act that lands it

#### Scenario: grade10-admin-vault-operator-queue-SC-31 - A step the case does not allow yet says what it is waiting for
**Serves:** grade10-admin-vault-operator-queue-US-07 - the counter learns what is missing without sending an act that will be refused

- **GIVEN** a financed case with a visit today whose packet is not signed
- **WHEN** staff read the step that puts the item in the vault
- **THEN** the step offers no act and says it is waiting for the packet to be signed

#### Scenario: grade10-admin-vault-operator-queue-SC-32 - A case that borrows nothing walks the custody terms
**Serves:** grade10-admin-vault-operator-queue-US-07 - the counter works a storage visit from the same screen

- **GIVEN** a case that borrows nothing, with a visit at the shop today
- **WHEN** staff open the case
- **THEN** its terms step reads the custody terms, and no step asks for the loan agreement's key terms
- **AND** its checklist walks six steps rather than seven

#### Scenario: grade10-admin-vault-operator-queue-SC-33 - A case with no visit today shows no checklist
**Serves:** grade10-admin-vault-operator-queue-US-07 - the counter is not walked through a visit nobody is coming to

- **GIVEN** a case whose visit is booked for tomorrow
- **WHEN** staff open it
- **THEN** no visit checklist is shown

#### Scenario: grade10-admin-vault-operator-queue-SC-50 - An act lands its step and hands the next one on
**Serves:** grade10-admin-vault-operator-queue-US-07 - the counter works down the list without looking up what comes next

- **GIVEN** a case with a visit at the shop today, read at the step in hand
- **WHEN** an operator sends that step's act
- **THEN** the step is ticked, and the step after it carries the act that lands it

### Requirement: An act the case withholds says what it is waiting for

Where a case's status withholds an act, the tab says what the act is waiting
for instead of leaving the operator to send it and be refused.

- **Named, not silent** - a tab SHALL name the acts this case's status
  withholds, and what each is waiting for, in words.
- **Forfeit** - the custody tab SHALL withhold forfeiture with one of these
  reasons, and SHALL offer it once none holds:

| Reason | Held while |
| --- | --- |
| The due date has not passed | the loan is not yet past its due date |
| No written notice has been sent | no forfeiture notice has been sent on the case |
| The borrower has until the date they were given | the date the notice gave the borrower has not passed; the reason names that date and the day the notice was sent |

- **The notice from there** - where forfeiture is held for want of a notice,
  sending the notice SHALL be offered beside the reason.
- **What the collector was told** - the custody tab SHALL list the messages
  sent to the collector about the late loan, each with the day it went and the
  channel it went by.

#### Scenario: grade10-admin-vault-operator-queue-SC-34 - A loan not yet past its due date cannot be forfeited
**Serves:** grade10-admin-vault-operator-queue-US-08 - the operator never takes an item a day early

- **GIVEN** a live loan whose due date has not passed
- **WHEN** an operator reads the custody tab
- **THEN** forfeiture is not offered, and the reason reads that the due date has not passed

#### Scenario: grade10-admin-vault-operator-queue-SC-35 - A late loan with no notice offers the notice
**Serves:** grade10-admin-vault-operator-queue-US-08 - the operator sees the one act that moves a late case on

- **GIVEN** a live loan past its due date on which no forfeiture notice has been sent
- **WHEN** an operator reads the custody tab
- **THEN** forfeiture is not offered, and the reason reads that no written notice has been sent
- **AND** sending the notice is offered beside it

#### Scenario: grade10-admin-vault-operator-queue-SC-36 - A running cure names the date and the day the notice went
**Serves:** grade10-admin-vault-operator-queue-US-08 - the operator reads the exact day the item may be taken

- **GIVEN** a forfeiture notice sent on a day whose date to pay by has not passed
- **WHEN** an operator reads the custody tab
- **THEN** forfeiture is not offered, and the reason names the date the borrower was given and the day the notice was sent

#### Scenario: grade10-admin-vault-operator-queue-SC-37 - A tab says what this status withholds
**Serves:** grade10-admin-vault-operator-queue-US-03 - the operator learns why a case offers less than the one before it

- **GIVEN** a case whose item is in the vault
- **WHEN** its tabs are read
- **THEN** the acts this status withholds are named, each with what it is waiting for

#### Scenario: grade10-admin-vault-operator-queue-SC-38 - The custody tab lists what the collector was told
**Serves:** grade10-admin-vault-operator-queue-US-08 - the operator sees what the borrower has already been sent before taking the item

- **GIVEN** a late loan on which two reminders and a forfeiture notice have been sent
- **WHEN** an operator reads the custody tab
- **THEN** each of the three is listed with the day it went and the channel it went by

#### Scenario: grade10-admin-vault-operator-queue-SC-51 - Forfeiture is offered once nothing holds it
**Serves:** grade10-admin-vault-operator-queue-US-08 - the operator takes the item on the first day they may

- **GIVEN** a live loan past its due date whose forfeiture notice gave the borrower a date that has passed
- **WHEN** an operator reads the custody tab
- **THEN** forfeiture is offered, with no reason withholding it

### Requirement: The identity panel reads the six states the record holds

The console says where a collector's identity stands in six words, so an
operator arranging a visit knows whether to send the check again, wait, or
take it at the counter.

- **The six** - the panel SHALL show exactly one of the six states
  `grade10-site/e-kyc/hosted-verification` defines, which is where each one's
  meaning is stated, and the case's header SHALL carry the same state. Beside
  the state the panel SHALL add:

| State | What the panel adds | What the panel offers |
| --- | --- | --- |
| Verified | who checked the identity, and when | viewing the photograph under the identity read grant, and recording one at the counter instead |
| Out | the day the check went | sending it again, and recording one at the counter |
| Stalled | the day the check was submitted | recording one at the counter, and sending it again |
| Refused | the day and the reason | recording one at the counter, naming who is recording over the refusal |
| Lapsed | the day | sending a hosted check, and recording one at the counter |
| None | nothing | sending a hosted check, and recording one at the counter |

- **Never the provider's own** - a finer state the identity provider reports
  SHALL fold into one of the six, and no word of the provider's SHALL be
  shown.
- **Out or Stalled** - the console SHALL NOT decide when a submitted check
  stops reading as Out; it SHALL read the state
  `grade10-site/e-kyc/hosted-verification` holds, which is where the boundary
  between the two is stated.

#### Scenario: grade10-admin-vault-operator-queue-SC-39 - A check still out reads as out, not as nothing asked for
**Serves:** grade10-admin-vault-operator-queue-US-09 - the operator knows whether to send the check again or wait

- **GIVEN** a case whose hosted check was invited two days ago and not answered
- **WHEN** an operator reads the identity panel
- **THEN** it reads Out, with the day the check went
- **AND** it offers sending it again and recording one at the counter

#### Scenario: grade10-admin-vault-operator-queue-SC-40 - A refused check names who records over it
**Serves:** grade10-admin-vault-operator-queue-US-09 - the operator takes the identity at the counter with the refusal in sight

- **GIVEN** a case whose last hosted check was declined
- **WHEN** an operator reads the identity panel
- **THEN** it reads Refused, with the day and the reason
- **AND** recording one at the counter names who is recording over the refusal

#### Scenario: grade10-admin-vault-operator-queue-SC-41 - Each of the six states reads its own panel
**Serves:** grade10-admin-vault-operator-queue-US-09 - the operator reads one word for where the identity stands

- **WHEN** a case standing at each of the six states is read in turn
- **THEN** the panel shows that state, with what it adds beside it and the acts it offers

#### Scenario: grade10-admin-vault-operator-queue-SC-42 - A provider's finer state folds into one of the six
**Serves:** grade10-admin-vault-operator-queue-US-09 - the operator is never shown a word the shop does not use

- **GIVEN** a hosted check the provider reports in a stage of its own outside the six
- **WHEN** an operator reads the identity panel
- **THEN** it shows one of the six states, and no word of the provider's

#### Scenario: grade10-admin-vault-operator-queue-SC-52 - A check just submitted reads Out, and Stalled when the identity check says so
**Serves:** grade10-admin-vault-operator-queue-US-09 - the operator waits on the provider only while there is something to wait for

- **GIVEN** a hosted check the collector has submitted and the provider has not decided
- **WHEN** an operator reads the identity panel before `grade10-site/e-kyc/hosted-verification` reads that check as stalled, and again after
- **THEN** the panel reads Out first and Stalled second, on the state `grade10-site/e-kyc/hosted-verification` holds rather than on a reading of its own

### Requirement: The held list counts what is held and says what each item carries

The held list answers how much the shops are holding before an operator reads
a single row.

- **The figures** - the list SHALL carry three figures: how much is held, how
  much carries a live loan, and how much waits on a booked pickup. The first
  SHALL break down by shop; there is no fourth figure counting shops.
- **Counted behind the filter** - each figure SHALL count everything the
  filter in force holds, never the page in hand.
- **The row** - a row SHALL carry the case reference, the item's name, the
  shop, the locker, the day it was taken in, how many days it has been held,
  the status in the collector's word, what is outstanding on it, and whether a
  pickup is booked.
- **One shop or all** - the list SHALL be narrowable to one shop.
- **Nothing held** - a list holding nothing SHALL say so, with its figures at
  none.

#### Scenario: grade10-admin-vault-operator-queue-SC-43 - The figures count what is held, not the page
**Serves:** grade10-admin-vault-operator-queue-US-04 - the operator says how much the shops are holding without paging the list

- **GIVEN** 60 items held across two shops, more than one page of them, 25 of them carrying a live loan and 4 waiting on a booked pickup
- **WHEN** the held list is read
- **THEN** its figures read 60 held, 25 carrying a live loan and 4 waiting on a pickup, and name how many of the 60 are held at each of the two shops

#### Scenario: grade10-admin-vault-operator-queue-SC-44 - One shop narrows the rows and the figures with them
**Serves:** grade10-admin-vault-operator-queue-US-04 - the operator answers for the shop they are standing in

- **GIVEN** items held at two shops
- **WHEN** the list is narrowed to one of them
- **THEN** only that shop's items are listed, and the figures count that shop's items alone

#### Scenario: grade10-admin-vault-operator-queue-SC-45 - A row says what the item is carrying
**Serves:** grade10-admin-vault-operator-queue-US-04 - the operator answers for one item without opening its case

- **GIVEN** an item held under a live loan and another whose pickup is booked
- **WHEN** the held list is read
- **THEN** each row names the case reference, the item, the shop, the locker, the day it was taken in, the days it has been held, the status in the collector's word, what is outstanding, and whether a pickup is booked

#### Scenario: grade10-admin-vault-operator-queue-SC-46 - A shop holding nothing says so
**Serves:** grade10-admin-vault-operator-queue-US-04 - the operator reads an empty shelf as an empty shelf

- **GIVEN** a shop holding no item
- **WHEN** the list is narrowed to it
- **THEN** it says nothing is held, and its figures read none

### Requirement: The custody tab reads back where the item has been

An operator answers for an item's whereabouts from the case, without asking
anyone to look the movements up elsewhere.

- **The log** - the custody tab SHALL list the item's movements newest first,
  each naming the movement, the locker it names, when it was written and the
  operator who made it.
- **Written by the act** - a movement SHALL reach the log because the act that
  moved the item wrote it, and SHALL NOT be entered by hand.

#### Scenario: grade10-admin-vault-operator-queue-SC-49 - A move between lockers reads back on the log
**Serves:** grade10-admin-vault-operator-queue-US-04 - the operator says where an item has been without leaving the case

- **GIVEN** an item held in a locker
- **WHEN** an operator moves it to another locker and reads the custody tab
- **THEN** the log's newest row names the move, the new locker, when it happened and who moved it
