# Order settlement — delta

## Purpose

What a paid order records about the lines the shop sold it, and what every money
rule reads from that record: what the order earned on, what a refund claws back,
and whether a coupon the member promised was really taken.

## Feature set

- Settled lines
  - Line record: what the shop sold, per line, as the shop states it
  - Earn per line: the part of each line the eligible-goods rule let earn
  - Allocation per line: what each instrument took off it
- Money read from them
  - Earn basis: the sum of what earned, settled once
  - Claw-back: what the returned lines earned
  - Corroboration: whether a coupon's own cut reached the sale
- Sources that cannot answer
  - Stated fallback: a pro-rated share, named as an estimate
  - Refusal: no basis at all rather than a guess

## User journeys

### order-settlement-US-01: Collector returns the gift card and keeps the cards

**As a** collector who paid partly with points,
**I want** returning something my points never bought to leave my points alone,
**so that** a refund settles the money I am owed and nothing else.

**Accepted by:**

- `order-settlement-SC-04` — Returning goods that never earned reverses nothing
- `order-settlement-SC-05` — Returning every qualifying good reverses the tender

### order-settlement-US-02: Shopkeeper takes a coupon's cut off before tender

**As a** shopkeeper selling at the till through the Shopify app,
**I want** a coupon I removed from the sale to stay the member's,
**so that** they do not lose it for a discount nobody gave them.

**Accepted by:**

- `order-settlement-SC-06` — A coupon whose cut is gone is not spent

## ADDED Requirements

### Requirement: A paid order records the lines the shop settled

The Store SHALL record, once when an order reaches paid, each line the provider
settled: the provider's own handle for it, the goods it carried after the
discounts allocated to it, and what each instrument allocated. The record SHALL
NOT be recomputed afterwards, so every money rule reading it answers the same on
every replay.

#### Scenario: order-settlement-SC-01 - A settled order keeps its lines

- **WHEN** an order the provider itemised reaches paid
- **THEN** the Store records one line per line the provider settled
- **AND** each line carries the provider's handle for it and its own goods

#### Scenario: order-settlement-SC-02 - A redelivered settlement records the lines once

- **WHEN** the same paid order arrives a second time
- **THEN** the lines already recorded are unchanged

### Requirement: An order earns on the lines that earned

The Store SHALL price an order's earning as the sum of what its settled lines
earned, applying the loyalty capability's rule to each line rather than to a
total. A line the rule cannot classify SHALL NOT earn, and an order whose lines
the provider states nothing about SHALL fall back to the goods total it stated —
named as an estimate — or refuse earning where it stated neither.

#### Scenario: order-settlement-SC-03 - A gift card's line earns nothing

- **WHEN** a paid order carries a gift card beside two graded cards
- **THEN** the order earns on the two cards alone

### Requirement: A claw-back is priced on the lines that came back

The Store SHALL price a refund's claw-back as what the returned lines earned,
read from the settled record by the handles the refund names. A refund naming no
line SHALL be priced as its share of the order's own goods, named as an estimate.
A claw-back SHALL never exceed what the order earned on, and SHALL never fall as
the refunds accumulate.

#### Scenario: order-settlement-SC-04 - Returning goods that never earned reverses nothing

- **WHEN** a member who paid partly with points returns only the gift card
- **THEN** no points are reversed
- **AND** no earning is clawed back

#### Scenario: order-settlement-SC-05 - Returning every qualifying good reverses the tender

- **WHEN** a member returns every good their points paid for
- **THEN** the whole points tender is returned to their balance
- **AND** the answer is the same whether the return arrives as one refund or many

#### Scenario: order-settlement-SC-07 - A refund naming no line is estimated and says so

- **WHEN** an operator refunds an amount against an order, naming no line
- **THEN** the claw-back is that amount's share of the order's goods
- **AND** the estimate is counted where an operator can find it

### Requirement: A coupon is spent only where its own cut reached the sale

The Store SHALL spend a coupon welded to a line only where the settled lines
show that coupon's own allocation, and an order code only where the settled
order carries that code. A coupon the sale does not show SHALL be returned to
the member and counted.

#### Scenario: order-settlement-SC-06 - A coupon whose cut is gone is not spent

- **WHEN** a shopkeeper removes a product coupon's cut before tender
- **AND** the sale still sells that variant
- **THEN** the coupon returns to the member unspent

#### Scenario: order-settlement-SC-08 - A coupon the sale still shows is spent

- **WHEN** a sale settles carrying a product coupon's own cut on its line
- **THEN** the coupon is spent against that order

### Requirement: An instrument is worth what the shop allocated to it

The Store SHALL price each instrument on a settled order at what the provider
allocated to it, not at what the Store minted or promised. Money the provider
discounted that no instrument accounts for SHALL be counted and reported, and
SHALL never be read as a points tender.

#### Scenario: order-settlement-SC-09 - A code is worth what it took off

- **WHEN** a settled order carries an order code the shop applied for less than
  its face value
- **THEN** the code counts at what the shop applied

#### Scenario: order-settlement-SC-10 - A discount no instrument explains is reported

- **WHEN** a settled order's discounts exceed what its instruments account for
- **THEN** the difference is reported for an operator
- **AND** no points are captured for it
