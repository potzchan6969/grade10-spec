# grade10-site/vault/case-intake Specification

## Purpose

How a vault request for one item is opened: by the collector, or by staff at
the counter as a draft the collector sends; what it says about the item, what
it photographs, the one question that decides whether the case carries a
loan, and the reference the case is known by afterwards.

Intake is where the case is born, so it is where the facts nothing later can
change are fixed — the item, the currency, the lane and the reference. What
happens to the case afterwards is `grade10-site/vault/case-lifecycle`; the
visit it offers on submission is `grade10-site/vault/visit-booking`; the
counter's form is `grade10-admin/vault/operator-queue`.

## Feature set

- Opening a request
  - Draft cap: three unsent drafts per account, a draft staff opened among
    them, because a draft is what holds photographs
  - One item per case: several items are several requests, so one case never
    describes two things
  - Brand currency: the case is opened in the brand's own currency and in no
    other
- Describing the item
  - Item facts: one of the register's ten categories, a title, a description
    and an optional contact number
  - The lane question: a financing amount makes the financed lane and its
    absence makes storage
  - Canonical number: a number is stored one way however it was typed, so one
    person is found once
  - A known slab on a draft: on a draft staff opened with a slab the register
    holds under that collector, the collector changes only the photos and the
    description
- Photographs
  - Photo limits: one to ten raster photographs, each within the size cap
  - Metadata stripped: a photograph reaches the bucket carrying no location
  - Read trail: a photograph is served to its owner and to staff, and every
    read is recorded
  - Removed before the send: the collector removes any photograph from an
    unsent request of their own; a sent request keeps every one
- Sending it in
  - A photograph required: staff prepare around what they can see
  - What follows: the case is submitted and the visit can be booked
  - Read back before it goes: the last step shows the request as it will be
    sent, each block editable where it was written
  - What happens next: the step says what the shop does with the request, so
    nobody waits on an answer nobody promised
  - The collection statement: the collector ticks that they have read it
    before the request sends, and the version they were shown is kept with
    the send
- The case reference
  - Six characters a person can read out: an alphabet without the characters
    that are read for one another at a counter
  - Issued with the case: drawn beside the id, so no case is ever without one
  - Unique per brand and never reused: unique across every case the brand has
    opened, and a clash is redrawn rather than shared
  - The id stays the key: the address, every link and every lookup keep the id,
    and the reference is what is spoken and typed
  - Where it is read: the case's own header, its card on the list, the step
    that sent it, every letter, and the counter's search
- A draft staff opened
  - Under the collector's account: on their list as a draft opened at the
    counter, reopening in the wizard like any draft
  - Theirs to change: staff's facts and photographs change before the send,
    as on any draft
  - Sent by the collector: the wizard's last step, unchanged, takes the
    statement tick and keeps its version
  - Nothing before the send: no valuation, no visit and no email until the
    collector sends it

## Requirements

### Requirement: A collector opens a request for one item

A collector SHALL open a vault request from their own account, or find one
staff opened for them at the counter as `grade10-admin/vault/operator-queue`
states, and carry it through three steps:

1. Describe the item: its category, a title, an optional description, an
   optional contact number, and whether they want a loan against it and for
   how much.
2. Photograph it: at least one and at most ten photographs.
3. Read the request back and send it in.

An unsent request SHALL be reopenable at the step it was left on, and SHALL
carry photographs only while it is unsent.

<!-- trace:scenario id=g10.vault-case-intake.SC-gfr rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-01 - A request is opened and reopened
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **WHEN** a collector opens a request and leaves it unsent
- **THEN** it is listed as an unsent request on their own list
- **AND** reopening it returns them to its photograph step

<!-- trace:scenario id=g10.vault-case-intake.SC-nkl rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-02 - A photograph is refused once the request is sent
**Serves:** Opening a request - a photograph is refused once the request is sent

- **GIVEN** a request the collector has sent in
- **WHEN** a further photograph is offered for it
- **THEN** it is refused by name and nothing is stored

### Requirement: A request states one item, in the brand's own currency

A request SHALL carry exactly these facts about the item, and SHALL describe
one item only:

| Fact | Rule |
| --- | --- |
| Category | one of the item register's ten: trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia, other, each read in the collector's language |
| Title | required, at most 200 characters |
| Description | optional, at most 2,000 characters |
| Contact number | optional, stored canonical to the brand's numbering plan however it was typed, and never verified |
| Currency | the brand's own; a request naming another SHALL be refused by name |
| Financing amount | optional, an integer count of minor units in that currency |

A contact number the brand's numbering plan cannot read SHALL be refused by
name, and no case SHALL be opened with it.

A collector with several items SHALL open one request for each.

<!-- trace:scenario id=g10.vault-case-intake.SC-yru rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-03 - A request in another currency is refused
**Serves:** grade10-site-vault-case-intake-US-02 - Collector sends in a card they only want kept safe

- **WHEN** a request is opened naming a currency that is not the brand's
- **THEN** it is refused by name and no case exists

<!-- trace:scenario id=g10.vault-case-intake.SC-lmq rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-04 - A number is stored one way
**Serves:** Describing the item - a number is stored one way

- **WHEN** two collectors give the same number typed differently
- **THEN** both cases store it in the same canonical form

#### Scenario: grade10-site-vault-case-intake-SC-24 - A title and a description at their caps are taken
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **WHEN** a collector opens a request with a title of exactly 200 characters
  and a description of exactly 2,000
- **THEN** the request is opened carrying both as written

#### Scenario: grade10-site-vault-case-intake-SC-25 - A title or a description past its cap is refused
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **WHEN** a collector opens a request with a title of 201 characters
- **THEN** it is refused by name and no case is opened
- **WHEN** a collector opens a request with a description of 2,001 characters
- **THEN** it is refused by name and no case is opened

#### Scenario: grade10-site-vault-case-intake-SC-26 - A number the brand's plan cannot read is refused
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **WHEN** a collector opens a request whose contact number is `123-abc`
- **THEN** it is refused by name and no case is opened

#### Scenario: grade10-site-vault-case-intake-SC-27 - A second item is a second request
**Serves:** grade10-site-vault-case-intake-US-05 - Collector gets a reference they can say and type

- **GIVEN** a collector who has just sent in a request for one item
- **WHEN** they open a request for another item
- **THEN** a new request is opened with a reference of its own
- **AND** the request already sent keeps its reference and its status

#### Scenario: grade10-site-vault-case-intake-SC-39 - The wizard offers the register's ten categories
**Serves:** grade10-site-vault-case-intake-US-01 - the collector says what the item is in their own language

- **GIVEN** a collector reading the site in Korean
- **WHEN** they open the request's first step
- **THEN** it offers trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia and other, each in Korean
- **AND** a request sent as a comic is opened as a comic

### Requirement: The financing amount decides the lane

A request carrying a financing amount SHALL open a case on the financed lane;
a request carrying none SHALL open one on the storage lane. The absence of an
amount SHALL be read as the storage lane and never as a missing value, and
nothing later in the case SHALL ask again which lane it is on.

<!-- trace:scenario id=g10.vault-case-intake.SC-jgo rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-05 - A loan asked for opens the financed lane
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **WHEN** a collector opens a request asking for 5,000,000 HKD minor units
- **THEN** the case is on the financed lane

<!-- trace:scenario id=g10.vault-case-intake.SC-z3o rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-06 - No loan asked for opens the storage lane
**Serves:** grade10-site-vault-case-intake-US-02 - Collector sends in a card they only want kept safe

- **WHEN** a collector opens a request asking for no loan
- **THEN** the case is on the storage lane and no offer is ever written for it

### Requirement: An account holds at most three unsent requests

An account SHALL hold at most three unsent requests at once, drafts staff
opened at the counter among them, and a fourth SHALL be refused by name,
whether the collector opens it or staff open it at the counter. Sending a
request in, or its ending, SHALL free a place.

<!-- trace:scenario id=g10.vault-case-intake.SC-90o rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-07 - A fourth unsent request is refused
**Serves:** Opening a request - a fourth unsent request is refused

- **GIVEN** an account holding three unsent requests
- **WHEN** the collector opens another
- **THEN** it is refused by name and no case is opened

#### Scenario: grade10-site-vault-case-intake-SC-36 - A draft staff opened takes a place under the cap
**Serves:** Opening a request - a draft staff opened counts against the collector's own

- **GIVEN** an account holding two unsent requests of its own and one staff opened at the counter
- **WHEN** the collector opens another
- **THEN** it is refused by name and no case is opened

### Requirement: A case carries between one and ten photographs

A case SHALL carry at most ten photographs. Each SHALL be a JPEG, PNG or WebP
of at most 20 MB - 20,971,520 bytes - and anything else SHALL be refused by name before it is
stored. The same bytes offered twice SHALL attach one photograph.

The collector SHALL remove a photograph from any unsent request of their own,
one staff opened at the counter among them. A sent request's photographs
SHALL NOT be removed.

<!-- trace:scenario id=g10.vault-case-intake.SC-e09 rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-08 - An eleventh photograph is refused
**Serves:** grade10-site-vault-case-intake-US-03 - Collector photographs the item from their phone

- **GIVEN** a request carrying ten photographs
- **WHEN** another is offered
- **THEN** it is refused by name and nothing is stored

<!-- trace:scenario id=g10.vault-case-intake.SC-vs1 rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-09 - A file of another kind is refused
**Serves:** grade10-site-vault-case-intake-US-03 - Collector photographs the item from their phone

- **WHEN** a file that is not one of the three image types is offered
- **THEN** it is refused by name and nothing is stored

<!-- trace:scenario id=g10.vault-case-intake.SC-uls rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-10 - The same photograph twice is one photograph
**Serves:** grade10-site-vault-case-intake-US-03 - Collector photographs the item from their phone

- **WHEN** the same bytes are offered twice for one case
- **THEN** the case carries one photograph, not two

#### Scenario: grade10-site-vault-case-intake-SC-28 - Ten photographs at the size cap are all taken
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **GIVEN** a request carrying no photograph
- **WHEN** ten different JPEGs of exactly 20,971,520 bytes each are offered for
  it
- **THEN** all ten are stored on the request

#### Scenario: grade10-site-vault-case-intake-SC-29 - A photograph past the size cap is refused
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **GIVEN** a request carrying fewer than ten photographs
- **WHEN** a JPEG of 20,971,521 bytes is offered for it
- **THEN** it is refused by name and nothing is stored

#### Scenario: grade10-site-vault-case-intake-SC-37 - The collector removes a photograph from an unsent request
**Serves:** grade10-site-vault-case-intake-US-06 - the collector corrects the request before it goes

- **GIVEN** an unsent request carrying three photographs
- **WHEN** the collector removes one of them
- **THEN** the request carries the other two, and the removed one is no longer served

#### Scenario: grade10-site-vault-case-intake-SC-38 - A sent request's photographs stay
**Serves:** Photographs - what staff valued stays as it was sent

- **GIVEN** a request the collector has sent in
- **WHEN** the collector asks to remove one of its photographs
- **THEN** it is refused by name and the request still carries every photograph

### Requirement: A photograph is stored without its location and read under a trail

Every stored photograph SHALL have its metadata stripped before it is stored,
and a photograph whose metadata cannot be removed SHALL be refused by name
rather than stored as it arrived. The stripping SHALL happen where the bytes
land, whatever the client did first.

A photograph SHALL be served to the case's owner and to staff holding the
vault read grant, and to nobody else. Every read SHALL be recorded in a ledger
that is never rewritten.

<!-- trace:scenario id=g10.vault-case-intake.SC-jw9 rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-11 - Location metadata never reaches the vault
**Serves:** grade10-site-vault-case-intake-US-03 - Collector photographs the item from their phone

- **WHEN** a photograph carrying a location is offered
- **THEN** what is stored carries none

<!-- trace:scenario id=g10.vault-case-intake.SC-5ui rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-12 - A photograph is not another collector's to read
**Serves:** grade10-site-vault-case-intake-US-03 - Collector photographs the item from their phone

- **WHEN** a signed-in collector asks for a photograph on a case that is not theirs
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-case-intake-SC-30 - Every read of a photograph is recorded
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **GIVEN** a collector's case carrying a photograph
- **WHEN** the collector opens that photograph
- **THEN** the read is recorded, naming who read it and when
- **AND** the photograph is served only once the read is recorded

### Requirement: A request is sent in only with a photograph on it

A request SHALL be sent in only when it carries at least one photograph, and a
request with none SHALL be refused by name and stay unsent. Sending it in
SHALL make the case one the shop can see and one a visit can be booked
against.

<!-- trace:scenario id=g10.vault-case-intake.SC-vq4 rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-13 - A request with nothing to look at is refused
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **GIVEN** a request carrying no photograph
- **WHEN** the collector sends it in
- **THEN** it is refused by name and the request stays unsent

<!-- trace:scenario id=g10.vault-case-intake.SC-lnd rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-14 - Sending it in offers the visit
**Serves:** `grade10-site-vault-case-intake-US-01`, `grade10-site-vault-case-intake-US-02` - sending it in offers the visit

- **GIVEN** a request carrying one photograph
- **WHEN** the collector sends it in
- **THEN** the case is submitted and a visit may be booked against it

### Requirement: The last step reads the request back before it sends

The last step is where the collector checks what they are about to send and
answers for the personal information collection statement.

- **Read back** - the step SHALL show the item facts, the amount asked for and
  the photographs as they will be sent, each block offering a way back to the
  step it was written on.
- **What happens next** - the step SHALL say what the shop does with the
  request once it arrives.
- **The tick** - the collector SHALL tick that they have read the collection
  statement, and a send without the tick SHALL be refused by name with the
  request left unsent.
- **The version** - a send SHALL keep the version of the collection statement
  the step showed.
- **Wording nobody has written yet** - where no collection statement wording is
  set, the step SHALL say it is being prepared; outside production the send
  SHALL NOT be refused for it, and in production the send SHALL be refused by
  name with the request left unsent.

#### Scenario: grade10-site-vault-case-intake-SC-15 - The last step shows the request as it will be sent
**Serves:** grade10-site-vault-case-intake-US-04 - the collector reads back what they are sending before it goes

- **GIVEN** a request carrying its item facts and one photograph
- **WHEN** the collector reaches the last step
- **THEN** it shows the item facts, the amount asked for and the photographs as they will be sent
- **AND** each block offers a way back to the step it was written on
- **AND** the step says what the shop does with the request once it arrives

#### Scenario: grade10-site-vault-case-intake-SC-16 - A send without the tick is refused
**Serves:** grade10-site-vault-case-intake-US-04 - the collector answers for the statement before the request goes

- **GIVEN** a request whose last step has not been ticked
- **WHEN** the collector sends it in
- **THEN** it is refused by name and the request stays unsent

#### Scenario: grade10-site-vault-case-intake-SC-17 - The send keeps the version that was shown
**Serves:** grade10-site-vault-case-intake-US-04 - the collector ticks the statement they were shown

- **GIVEN** a request whose last step showed a collection statement
- **WHEN** the collector ticks it and sends the request in
- **THEN** the case keeps that version of the collection statement with the send

#### Scenario: grade10-site-vault-case-intake-SC-18 - Outside production, a statement nobody has written yet does not hold the request
**Serves:** grade10-site-vault-case-intake-US-04 - the collector sends the request while the wording is still being written

- **GIVEN** an environment that is not production and a brand with no
  collection statement wording set
- **WHEN** the collector reaches the last step
- **THEN** the statement reads as being prepared
- **AND** ticking it sends the request in

#### Scenario: grade10-site-vault-case-intake-SC-31 - In production, a statement nobody has written yet refuses the send
**Serves:** grade10-site-vault-case-intake-US-04 - the collector is not asked to answer for a statement that does not exist

- **GIVEN** production and a brand with no collection statement wording set
- **WHEN** the collector ticks the statement and sends the request in
- **THEN** the send is refused by name
- **AND** the request stays a draft

### Requirement: A case carries a six-character reference

Every case has a short reference beside its id, for a person to read out at a
counter and type into a bank form.

- **Shape** - a reference SHALL be six characters drawn from the digits 2 to 9
  and the capital letters A to Z without I, L and O.
- **Issued with the case** - a reference SHALL be drawn when the case is
  opened, beside its id, so an unsent request carries one as much as a sent
  case does.
- **Unique and never reused** - a reference SHALL be unique across every case
  the brand has ever opened, ended and abandoned cases included, and a draw
  that clashes SHALL be redrawn rather than shared.
- **Fixed** - a case's reference SHALL never change after it is issued.
- **The id stays the key** - the case's address, every link to it and every
  lookup SHALL keep the id, and a reference SHALL NOT stand in an address.
- **Where it is read** - a reference SHALL be shown on the case's own header,
  on its card in the collector's list, and on the step that sent the request.
  The letter that carries it is `grade10-site/vault/collector-notifications`'s,
  and the counter's search over it is `grade10-admin/vault/operator-queue`'s.

#### Scenario: grade10-site-vault-case-intake-SC-19 - A case is opened with its reference
**Serves:** grade10-site-vault-case-intake-US-05 - the collector has something to say at the counter from the day they ask

- **WHEN** a collector opens a request
- **THEN** the case carries a six-character reference of that alphabet, before the request is sent

#### Scenario: grade10-site-vault-case-intake-SC-20 - Two cases never share a reference
**Serves:** The case reference - a draw that clashes is redrawn rather than shared

- **GIVEN** a case carrying a reference
- **WHEN** another case is opened and the reference drawn for it is that one
- **THEN** another is drawn and the two cases carry different references

#### Scenario: grade10-site-vault-case-intake-SC-21 - A reference is never issued twice
**Serves:** The case reference - what was drawn once stays with the case that took it

- **GIVEN** a case that has ended
- **WHEN** a new case is opened
- **THEN** it is not issued the ended case's reference

#### Scenario: grade10-site-vault-case-intake-SC-22 - The address keeps the id
**Serves:** The case reference - a link followed from a letter or the list opens the case by its id

- **WHEN** a collector opens their case from the list or from a letter
- **THEN** the address names the case's id and never its reference

#### Scenario: grade10-site-vault-case-intake-SC-23 - The reference is read where a person needs it
**Serves:** grade10-site-vault-case-intake-US-05 - the collector reads it out at the counter and types it at the bank

- **GIVEN** a case carrying a reference
- **WHEN** the collector opens their case list, the case itself, or the step that sent the request
- **THEN** each names that same reference

### Requirement: A draft staff opened is the collector's to change and send

A draft staff opened at the counter, under the collector's account, as
`grade10-admin/vault/operator-queue` states, SHALL be the collector's request
like any other draft.

- **Listed** — the collector's list SHALL show it as an unsent request reading
  that staff opened it at the counter, and opening it SHALL reopen the wizard
  at its photograph step.
- **Theirs to change** — the collector SHALL change its facts and its
  photographs, staff's among them, before the send, as on any draft. It
  carries no contact number until the collector adds one, since the counter
  takes none.
- **Sent by the collector** — the wizard's last step, unchanged, SHALL send
  it: the read-back, the statement tick and the version it shows, kept with
  the send.
- **Nothing before the send** — until the collector sends it, no valuation
  SHALL be started, no visit SHALL be bookable, and no email SHALL be sent
  about it.

#### Scenario: grade10-site-vault-case-intake-SC-32 - The collector finds the draft staff opened
**Serves:** grade10-site-vault-case-intake-US-06 - the collector signs in on their own phone and finds the request

- **GIVEN** a draft staff opened at the counter under the collector's account, carrying two photographs
- **WHEN** the collector signs in and opens their list
- **THEN** the draft is listed as unsent, reading that staff opened it at the counter
- **AND** opening it reopens the wizard at its photograph step, carrying staff's facts and photographs
- **AND** it carries no contact number, and the collector may add one

#### Scenario: grade10-site-vault-case-intake-SC-33 - The collector changes what staff typed and photographed
**Serves:** grade10-site-vault-case-intake-US-06 - the collector corrects the request before it goes

- **GIVEN** a draft staff opened, carrying two photographs
- **WHEN** the collector changes its title, removes one of staff's photographs and adds one of their own
- **THEN** the last step reads back the new title and those two photographs

#### Scenario: grade10-site-vault-case-intake-SC-34 - The collector sends it with the last step
**Serves:** grade10-site-vault-case-intake-US-06 - the collector answers for the statement before anything happens to the item

- **GIVEN** a draft staff opened, carrying a photograph
- **WHEN** the collector ticks the statement on the last step and sends it
- **THEN** the case is submitted, keeps the version of the statement the step showed, and a visit may be booked against it

#### Scenario: grade10-site-vault-case-intake-SC-35 - Nothing happens to an unsent draft staff opened
**Serves:** grade10-site-vault-case-intake-US-06 - nothing happens to the item on a request the collector has not seen

- **GIVEN** a draft staff opened that the collector has not sent
- **WHEN** staff read its case and the collector reads its list
- **THEN** no valuation is offered, no visit can be booked, and no email has been sent about it

### Requirement: A draft holding a slab the register knows changes only its photos and description

On a draft staff opened with a slab the item register already holds under the
customer at the counter, the category, title, grader, grade and cert SHALL be
read from the register, and
the collector's edits SHALL change only the photographs and the request's
description, never the register's.
An edit to any other fact of that draft SHALL be refused by name.

#### Scenario: grade10-site-vault-case-intake-SC-40 - The collector edits the photos and the description of a linked draft
**Serves:** grade10-site-vault-case-intake-US-01 - the collector checks a draft staff opened with their slab

- **GIVEN** a draft staff opened with a slab the register holds under this collector as a trading card titled "Charizard 1999 Base Set", PSA `10`
- **WHEN** the collector opens it on their phone
- **THEN** the category and title read as the register holds them and offer no field
- **AND** adding a photograph and changing the description are both kept
- **AND** the register's description is unchanged, since the edit changes the request alone

#### Scenario: grade10-site-vault-case-intake-SC-41 - An edit to the register's facts is refused
**Serves:** grade10-site-vault-case-intake-US-01 - the case and the register never tell two stories of one slab

- **GIVEN** a draft staff opened with a slab the register holds under this collector
- **WHEN** an edit to its category or title is sent
- **THEN** it is refused by name and the draft keeps the register's facts
