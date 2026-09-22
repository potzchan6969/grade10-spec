# grade10-site/vault/case-intake Specification

## Purpose

How a collector opens a vault request for one item: what they say about it,
what they photograph, the one question that decides whether the case carries a
loan, and the reference the case is known by afterwards.

Intake is where the case is born, so it is where the facts nothing later can
change are fixed — the item, the currency, the lane and the reference. What
happens to the case afterwards is `grade10-site/vault/case-lifecycle`; the
visit it offers on submission is `grade10-site/vault/visit-booking`.

## Feature set

- Opening a request
  - Draft cap: three unsent drafts per account, because a draft is what holds
    photographs
  - One item per case: several items are several requests, so one case never
    describes two things
  - Brand currency: the case is opened in the brand's own currency and in no
    other
- Describing the item
  - Item facts: category, title, description and an optional contact number
  - The lane question: a financing amount makes the financed lane and its
    absence makes storage
  - Canonical number: a number is stored one way however it was typed, so one
    person is found once
- Photographs
  - Photo limits: one to ten raster photographs, each within the size cap
  - Metadata stripped: a photograph reaches the bucket carrying no location
  - Read trail: a photograph is served to its owner and to staff, and every
    read is recorded
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

## MODIFIED Requirements

### Requirement: A collector opens a request for one item

A collector SHALL open a vault request from their own account, in three steps:

1. Describe the item: its category, a title, an optional description, an
   optional contact number, and whether they want a loan against it and for
   how much.
2. Photograph it: at least one and at most ten photographs.
3. Read the request back and send it in.

An unsent request SHALL be reopenable at the step it was left on, and SHALL
carry photographs only while it is unsent.

#### Scenario: grade10-site-vault-case-intake-SC-01 - A request is opened and reopened
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **WHEN** a collector opens a request and leaves it unsent
- **THEN** it is listed as an unsent request on their own list
- **AND** reopening it returns them to its photograph step

#### Scenario: grade10-site-vault-case-intake-SC-02 - A photograph is refused once the request is sent
**Serves:** Opening a request - a photograph is refused once the request is sent

- **GIVEN** a request the collector has sent in
- **WHEN** a further photograph is offered for it
- **THEN** it is refused by name and nothing is stored

## ADDED Requirements

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
  set, the step SHALL say it is being prepared, and the send SHALL NOT be
  refused for it in any environment.

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

#### Scenario: grade10-site-vault-case-intake-SC-18 - A statement nobody has written yet does not hold the request
**Serves:** grade10-site-vault-case-intake-US-04 - the collector sends the request while the wording is still being written

- **GIVEN** a brand with no collection statement wording set
- **WHEN** the collector reaches the last step
- **THEN** the statement reads as being prepared
- **AND** ticking it sends the request in, in every environment

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
