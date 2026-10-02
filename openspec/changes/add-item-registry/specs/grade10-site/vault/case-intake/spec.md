# grade10-site/vault/case-intake Specification

## Feature set

- Describing the item
  - Item facts: one of the register's ten categories, a title, a description
    and an optional contact number
  - A known slab on a draft: on a draft staff opened with a slab the register
    holds under that collector, the collector changes only the photos and the
    description

## MODIFIED Requirements

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

## ADDED Requirements

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
