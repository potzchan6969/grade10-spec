# grade10-site/vault/case-intake Specification

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
  - A loan of more than zero: a financing amount of zero is refused, and
    storage is asked for by leaving the amount out
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
  - Read back before it goes: a draft reads back whole, every fact and
    photograph as the send will carry it, and each changes until the send
  - What happens next: the request screen's own words, drawn again with it;
    the worker promises the collector nothing on a send
  - The collection statement: a send carries the collector's word that they
    read it, and the version they were shown is kept with the send
- The case reference
  - Six characters a person can read out: an alphabet without the characters
    that are read for one another at a counter
  - Issued with the case: drawn beside the id, so no case is ever without one
  - Unique per brand and never reused: unique across every case the brand has
    opened, and a clash is redrawn rather than shared
  - The id stays the key: the address, every link and every lookup keep the id,
    and the reference is what is spoken and typed
  - Where it is read: the collector's own read of the case, every letter, the
    signed paper, and the counter's search
- A draft staff opened
  - Under the collector's account: among their own cases as a draft opened at
    the counter, changed like any draft of theirs
  - Theirs to change: staff's facts and photographs change before the send,
    as on any draft
  - Sent by the collector: the send is their own act, unchanged, carrying the
    statement and keeping its version
  - Nothing before the send: no valuation, no visit and no email until the
    collector sends it

## MODIFIED Requirements

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
  read of their cases, on the read of the case itself, on the answer to the
  send, and on the signed paper. The letter that carries it is
  `grade10-site/vault/collector-notifications`'s, what the paper prints is
  `grade10-site/vault/documents-and-signing`'s, and the counter's search over
  it is `grade10-admin/vault/operator-queue`'s.

<!-- trace:scenario id=g10.vault-case-intake.SC-u8f rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-19 - A case is opened with its reference
**Serves:** grade10-site-vault-case-intake-US-05 - the collector has something to say at the counter from the day they ask

- **WHEN** a collector opens a request
- **THEN** the case carries a six-character reference of that alphabet, before the request is sent

<!-- trace:scenario id=g10.vault-case-intake.SC-1y5 rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-20 - Two cases never share a reference
**Serves:** The case reference - a draw that clashes is redrawn rather than shared

- **GIVEN** a case carrying a reference
- **WHEN** another case is opened and the reference drawn for it is that one
- **THEN** another is drawn and the two cases carry different references

<!-- trace:scenario id=g10.vault-case-intake.SC-0q4 rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-21 - A reference is never issued twice
**Serves:** The case reference - what was drawn once stays with the case that took it

- **GIVEN** a case that has ended
- **WHEN** a new case is opened
- **THEN** it is not issued the ended case's reference

<!-- trace:scenario id=g10.vault-case-intake.SC-3s9 rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-22 - The address keeps the id
**Serves:** The case reference - a link followed from a letter opens the case by its id

- **WHEN** a letter links the collector to their case
- **THEN** the link names the case's id and never its reference

<!-- trace:scenario id=g10.vault-case-intake.SC-3h1 rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-23 - The reference is read where a person needs it
**Serves:** grade10-site-vault-case-intake-US-05 - the collector reads it out at the counter and types it at the bank

- **GIVEN** a case carrying a reference
- **WHEN** the collector reads their own cases, reads the case itself, or sends the request
- **THEN** each answer names that same reference
