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
- A draft staff opened
  - Under the collector's account: on their list as a draft opened at the
    counter, reopening in the wizard like any draft
  - Theirs to change: staff's facts and photographs change before the send,
    as on any draft
  - Sent by the collector: the wizard's last step, unchanged, takes the
    statement tick and keeps its version
  - Nothing before the send: no valuation, no visit and no email until the
    collector sends it
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

## ADDED Requirements

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

## MODIFIED Requirements

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
