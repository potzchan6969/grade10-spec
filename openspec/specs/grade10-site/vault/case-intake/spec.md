# grade10-site/vault/case-intake Specification

## Purpose

How a collector opens a vault request for one item: what they say about it,
what they photograph, and the one question that decides whether the case
carries a loan.

Intake is where the case is born, so it is where the facts nothing later can
change are fixed — the item, the currency, and the lane. What happens to the
case afterwards is `grade10-site/vault/case-lifecycle`; the visit it offers on
submission is `grade10-site/vault/visit-booking`.

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

## Requirements

### Requirement: A collector opens a request for one item

A collector SHALL open a vault request from their own account, in three steps:

1. Describe the item: its category, a title, an optional description, an
   optional contact number, and whether they want a loan against it and for
   how much.
2. Photograph it: at least one and at most ten photographs.
3. Send it in.

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

### Requirement: A request states one item, in the brand's own currency

A request SHALL carry exactly these facts about the item, and SHALL describe
one item only:

| Fact | Rule |
| --- | --- |
| Category | one of: trading card, coin, bullion, watch, jewellery, other |
| Title | required, at most 200 characters |
| Description | optional, at most 2,000 characters |
| Contact number | optional, stored canonical to the brand's numbering plan however it was typed, and never verified |
| Currency | the brand's own; a request naming another SHALL be refused by name |
| Financing amount | optional, an integer count of minor units in that currency |

A collector with several items SHALL open one request for each.

#### Scenario: grade10-site-vault-case-intake-SC-03 - A request in another currency is refused
**Serves:** grade10-site-vault-case-intake-US-02 - Collector sends in a card they only want kept safe

- **WHEN** a request is opened naming a currency that is not the brand's
- **THEN** it is refused by name and no case exists

#### Scenario: grade10-site-vault-case-intake-SC-04 - A number is stored one way

- **WHEN** two collectors give the same number typed differently
- **THEN** both cases store it in the same canonical form

### Requirement: The financing amount decides the lane

A request carrying a financing amount SHALL open a case on the financed lane;
a request carrying none SHALL open one on the storage lane. The absence of an
amount SHALL be read as the storage lane and never as a missing value, and
nothing later in the case SHALL ask again which lane it is on.

#### Scenario: grade10-site-vault-case-intake-SC-05 - A loan asked for opens the financed lane
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **WHEN** a collector opens a request asking for 5,000,000 HKD minor units
- **THEN** the case is on the financed lane

#### Scenario: grade10-site-vault-case-intake-SC-06 - No loan asked for opens the storage lane
**Serves:** grade10-site-vault-case-intake-US-02 - Collector sends in a card they only want kept safe

- **WHEN** a collector opens a request asking for no loan
- **THEN** the case is on the storage lane and no offer is ever written for it

### Requirement: An account holds at most three unsent requests

An account SHALL hold at most three unsent requests at once, and a fourth
SHALL be refused by name. Sending a request in, or its ending, SHALL free a
place.

#### Scenario: grade10-site-vault-case-intake-SC-07 - A fourth unsent request is refused
**Serves:** Opening a request - a fourth unsent request is refused

- **GIVEN** an account holding three unsent requests
- **WHEN** the collector opens another
- **THEN** it is refused by name and no case is opened

### Requirement: A case carries between one and ten photographs

A case SHALL carry at most ten photographs. Each SHALL be a JPEG, PNG or WebP
of at most 20 MB, and anything else SHALL be refused by name before it is
stored. The same bytes offered twice SHALL attach one photograph.

#### Scenario: grade10-site-vault-case-intake-SC-08 - An eleventh photograph is refused
**Serves:** grade10-site-vault-case-intake-US-03 - Collector photographs the item from their phone

- **GIVEN** a request carrying ten photographs
- **WHEN** another is offered
- **THEN** it is refused by name and nothing is stored

#### Scenario: grade10-site-vault-case-intake-SC-09 - A file of another kind is refused
**Serves:** grade10-site-vault-case-intake-US-03 - Collector photographs the item from their phone

- **WHEN** a file that is not one of the three image types is offered
- **THEN** it is refused by name and nothing is stored

#### Scenario: grade10-site-vault-case-intake-SC-10 - The same photograph twice is one photograph
**Serves:** grade10-site-vault-case-intake-US-03 - Collector photographs the item from their phone

- **WHEN** the same bytes are offered twice for one case
- **THEN** the case carries one photograph, not two

### Requirement: A photograph is stored without its location and read under a trail

Every stored photograph SHALL have its metadata stripped before it is stored,
and a photograph whose metadata cannot be removed SHALL be refused by name
rather than stored as it arrived. The stripping SHALL happen where the bytes
land, whatever the client did first.

A photograph SHALL be served to the case's owner and to staff holding the
vault read grant, and to nobody else. Every read SHALL be recorded in a ledger
that is never rewritten.

#### Scenario: grade10-site-vault-case-intake-SC-11 - Location metadata never reaches the vault
**Serves:** grade10-site-vault-case-intake-US-03 - Collector photographs the item from their phone

- **WHEN** a photograph carrying a location is offered
- **THEN** what is stored carries none

#### Scenario: grade10-site-vault-case-intake-SC-12 - A photograph is not another collector's to read
**Serves:** grade10-site-vault-case-intake-US-03 - Collector photographs the item from their phone

- **WHEN** a signed-in collector asks for a photograph on a case that is not theirs
- **THEN** it is refused by name

### Requirement: A request is sent in only with a photograph on it

A request SHALL be sent in only when it carries at least one photograph, and a
request with none SHALL be refused by name and stay unsent. Sending it in
SHALL make the case one the shop can see and one a visit can be booked
against.

#### Scenario: grade10-site-vault-case-intake-SC-13 - A request with nothing to look at is refused
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **GIVEN** a request carrying no photograph
- **WHEN** the collector sends it in
- **THEN** it is refused by name and the request stays unsent

#### Scenario: grade10-site-vault-case-intake-SC-14 - Sending it in offers the visit
**Serves:** `grade10-site-vault-case-intake-US-01`, `grade10-site-vault-case-intake-US-02` - sending it in offers the visit

- **GIVEN** a request carrying one photograph
- **WHEN** the collector sends it in
- **THEN** the case is submitted and a visit may be booked against it
