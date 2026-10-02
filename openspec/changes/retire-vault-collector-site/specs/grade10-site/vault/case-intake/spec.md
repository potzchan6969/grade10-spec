# grade10-site/vault/case-intake Specification

## Feature set

- Sending it in
  - Read back before it goes: a draft reads back whole, every fact and
    photograph as the send will carry it, and each changes until the send
  - What happens next: the request screen's own words, drawn again with it;
    the worker promises the collector nothing on a send
  - The collection statement: a send carries the collector's word that they
    read it, and the version they were shown is kept with the send
- The case reference
  - Where it is read: the collector's own read of the case, every letter, and
    the counter's search
- A draft staff opened
  - Under the collector's account: among their own cases as a draft opened at
    the counter, changed like any draft of theirs
  - Sent by the collector: the send is their own act, unchanged, carrying the
    statement and keeping its version

## RENAMED Requirements

- FROM: `### Requirement: The last step reads the request back before it sends`
- TO: `### Requirement: A send answers for the collection statement in force`

## MODIFIED Requirements

### Requirement: A collector opens a request for one item

A collector SHALL open a vault request from their own account, or find one
staff opened for them at the counter as `grade10-admin/vault/operator-queue`
states, and carry it through three acts on the worker:

1. Open it with the item's facts: its category, a title, an optional
   description, an optional contact number, and whether they want a loan
   against it and for how much.
2. Photograph it: attach at least one and at most ten photographs.
3. Send it in.

An unsent request SHALL take the collector's edits and photographs until it
is sent, and SHALL be listed among the collector's own cases as unsent. It
SHALL carry photographs only while it is unsent.

<!-- trace:scenario id=g10.vault-case-intake.SC-gfr rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-01 - A request is opened and reopened
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **WHEN** a collector opens a request and leaves it unsent
- **THEN** their own cases list it as an unsent request
- **AND** it still takes an edit to its facts and a photograph

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
| Category | one of the item register's ten: trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia, other |
| Title | required, at most 200 characters |
| Description | optional, at most 2,000 characters |
| Contact number | optional, stored canonical to the brand's numbering plan however it was typed, and never verified |
| Currency | the brand's own; a request naming another SHALL be refused by name |
| Financing amount | optional, an integer count of minor units in that currency |

A contact number the brand's numbering plan cannot read SHALL be refused by
name, and no case SHALL be opened with it. A category outside the ten SHALL be
refused, and no case SHALL be opened with it.

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
**Serves:** grade10-site-vault-case-intake-US-01 - the collector says what the item is

- **WHEN** a collector opens a request as a comic
- **THEN** the case is opened as a comic
- **WHEN** a collector opens a request naming a category outside the register's ten
- **THEN** it is refused and no case is opened

### Requirement: A send answers for the collection statement in force

Before the collector sends, the draft reads back what the send will carry,
and the send answers for the personal information collection statement.

- **Read back** - the collector's read of their unsent request SHALL carry the
  item facts, the amount asked for and the photographs as the send will carry
  them, and each SHALL take an edit until the send.
- **The statement** - the worker SHALL answer the collector with the
  collection statement in force for the brand: its version, and its words
  where they are written.
- **The word** - a send SHALL name the version of the statement the collector
  read, and a send naming no version, or one other than the version in force,
  SHALL be refused by name with the request left unsent.
- **The version** - a send SHALL keep the version it named.
- **Wording nobody has written yet** - where no collection statement wording
  is set, the statement SHALL be answered with a version and no words;
  outside production a send naming that version SHALL NOT be refused for it,
  and in production the send SHALL be refused by name with the request left
  unsent.

#### Scenario: grade10-site-vault-case-intake-SC-15 - The last step shows the request as it will be sent
**Serves:** grade10-site-vault-case-intake-US-04 - the collector reads back what they are sending before it goes

- **GIVEN** a request carrying its item facts and one photograph
- **WHEN** the collector reads the unsent request
- **THEN** it carries the item facts, the amount asked for and the photograph as the send will carry them
- **AND** an edit to its title is read back on the next read

#### Scenario: grade10-site-vault-case-intake-SC-16 - A send without the tick is refused
**Serves:** grade10-site-vault-case-intake-US-04 - the collector answers for the statement before the request goes

- **GIVEN** a request carrying a photograph
- **WHEN** the collector sends it naming a statement version other than the one in force
- **THEN** it is refused by name and the request stays unsent

#### Scenario: grade10-site-vault-case-intake-SC-17 - The send keeps the version that was shown
**Serves:** grade10-site-vault-case-intake-US-04 - the collector answers for the statement they were shown

- **GIVEN** a collection statement in force for the brand
- **WHEN** the collector sends the request naming that statement's version
- **THEN** the case keeps that version of the collection statement with the send

#### Scenario: grade10-site-vault-case-intake-SC-18 - Outside production, a statement nobody has written yet does not hold the request
**Serves:** grade10-site-vault-case-intake-US-04 - the collector sends the request while the wording is still being written

- **GIVEN** an environment that is not production and a brand with no
  collection statement wording set
- **WHEN** the collector reads the statement and sends the request naming its version
- **THEN** the statement is answered with a version and no words
- **AND** the request is sent in

#### Scenario: grade10-site-vault-case-intake-SC-31 - In production, a statement nobody has written yet refuses the send
**Serves:** grade10-site-vault-case-intake-US-04 - the collector is not asked to answer for a statement that does not exist

- **GIVEN** production and a brand with no collection statement wording set
- **WHEN** the collector sends the request
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
- **The id stays the key** - every link to a case and every lookup SHALL keep
  the id, and a reference SHALL NOT stand in a link.
- **Where it is read** - a reference SHALL be carried on the collector's own
  read of their cases, on the read of the case itself, and on the answer to
  the send. The letter that carries it is
  `grade10-site/vault/collector-notifications`'s, and the counter's search
  over it is `grade10-admin/vault/operator-queue`'s.

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
**Serves:** The case reference - a link followed from a letter opens the case by its id

- **WHEN** a letter links the collector to their case
- **THEN** the link names the case's id and never its reference

#### Scenario: grade10-site-vault-case-intake-SC-23 - The reference is read where a person needs it
**Serves:** grade10-site-vault-case-intake-US-05 - the collector reads it out at the counter and types it at the bank

- **GIVEN** a case carrying a reference
- **WHEN** the collector reads their own cases, reads the case itself, or sends the request
- **THEN** each answer names that same reference

### Requirement: A draft staff opened is the collector's to change and send

A draft staff opened at the counter, under the collector's account, as
`grade10-admin/vault/operator-queue` states, SHALL be the collector's request
like any other draft.

- **Listed** - the collector's own cases SHALL list it as an unsent request
  marked as opened at the counter, and its read SHALL carry staff's facts and
  photographs.
- **Theirs to change** - the collector SHALL change its facts and its
  photographs, staff's among them, before the send, as on any draft. It
  carries no contact number until the collector adds one, since the counter
  takes none.
- **Sent by the collector** - the collector's own send SHALL send it, held to
  the same statement rule as any send, and the version it named SHALL be kept
  with the send.
- **Nothing before the send** - until the collector sends it, no valuation
  SHALL be started, no visit SHALL be bookable, and no email SHALL be sent
  about it.

#### Scenario: grade10-site-vault-case-intake-SC-32 - The collector finds the draft staff opened
**Serves:** grade10-site-vault-case-intake-US-06 - the collector signs in on their own phone and finds the request

- **GIVEN** a draft staff opened at the counter under the collector's account, carrying two photographs
- **WHEN** the collector signs in and reads their own cases
- **THEN** the draft is listed as unsent, marked as opened at the counter
- **AND** its read carries staff's facts and photographs
- **AND** it carries no contact number, and an edit by the collector adds one

#### Scenario: grade10-site-vault-case-intake-SC-33 - The collector changes what staff typed and photographed
**Serves:** grade10-site-vault-case-intake-US-06 - the collector corrects the request before it goes

- **GIVEN** a draft staff opened, carrying two photographs
- **WHEN** the collector changes its title, removes one of staff's photographs and adds one of their own
- **THEN** the draft's read carries the new title and those two photographs

#### Scenario: grade10-site-vault-case-intake-SC-34 - The collector sends it with the last step
**Serves:** grade10-site-vault-case-intake-US-06 - the collector answers for the statement before anything happens to the item

- **GIVEN** a draft staff opened, carrying a photograph
- **WHEN** the collector sends it naming the statement version in force
- **THEN** the case is submitted, keeps that version of the statement, and a visit may be booked against it

#### Scenario: grade10-site-vault-case-intake-SC-35 - Nothing happens to an unsent draft staff opened
**Serves:** grade10-site-vault-case-intake-US-06 - nothing happens to the item on a request the collector has not seen

- **GIVEN** a draft staff opened that the collector has not sent
- **WHEN** staff read its case and the collector reads their own cases
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
- **WHEN** the collector reads it
- **THEN** the category and title read as the register holds them
- **AND** adding a photograph and changing the description are both kept
- **AND** the register's description is unchanged, since the edit changes the request alone

#### Scenario: grade10-site-vault-case-intake-SC-41 - An edit to the register's facts is refused
**Serves:** grade10-site-vault-case-intake-US-01 - the case and the register never tell two stories of one slab

- **GIVEN** a draft staff opened with a slab the register holds under this collector
- **WHEN** an edit to its category or title is sent
- **THEN** it is refused by name and the draft keeps the register's facts
