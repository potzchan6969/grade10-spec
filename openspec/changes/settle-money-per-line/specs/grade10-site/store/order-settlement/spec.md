# Order settlement — delta

## Purpose

What a paid order records about the lines the shop sold it, and what every money
rule reads from that record: what the order earned on, what a refund claws back,
and whether a coupon the member promised was really taken.

## Feature set

- Settled lines
  - Line record: what the shop sold, per line, as the shop states it
  - Earn per line: the part of each line the eligible-goods rule let earn
  - Allocation per instrument: what the shop allocated to each one it named
- Money read from them
  - Claw-back: what the returned lines earned
  - Tender return: the whole sale stated back, or none of it
  - Corroboration: whether a coupon's own cut reached the sale
  - Tender value: what the shop allocated to the points discount
- Sources that cannot answer
  - Stated fallback: a pro-rated share, named as an estimate
  - Refusal: no basis at all rather than a guess
  - Reports: a member left short, and a sale whose money closed over goods it
    still holds

## ADDED Requirements

### Requirement: A paid order records the lines the shop settled

The Store SHALL record, once when an order reaches paid, each line the provider
settled: the provider's own handle for it, the goods it carried after the
discounts allocated to it, and whether the eligible-goods rule let it earn — and
beside them, what the provider allocated to each named instrument on the order.
The order's earn basis SHALL be the sum of what those recorded lines earned. The
record SHALL NOT be recomputed afterwards, so every money rule reading it answers
the same on every replay.

#### Scenario: grade10-site-store-order-settlement-SC-01 - A settled order keeps its lines

- **WHEN** an order the provider itemised reaches paid
- **THEN** the Store records one line per line the provider settled
- **AND** each line carries the provider's handle for it and its own goods
- **AND** the order earns on the recorded lines the rule let earn

#### Scenario: grade10-site-store-order-settlement-SC-02 - A redelivered settlement records the lines once

- **WHEN** the same paid order arrives a second time
- **THEN** the lines already recorded are unchanged

### Requirement: A claw-back is priced on the lines that came back

The Store SHALL price a refund's claw-back as what the returned lines earned,
read from the settled record by the handles the refund names. A refund states its
goods by what it names came back: one naming only the delivery states no goods,
and one naming nothing states nothing about them and SHALL be priced as its share
of the order's own goods, named as an estimate. A claw-back SHALL never exceed
what the order earned on, and SHALL never fall as the refunds accumulate, however
many refunds a return arrives in.

#### Scenario: grade10-site-store-order-settlement-SC-03 - Returning goods that never earned reverses nothing

- **WHEN** a member who paid partly with points returns only the gift card
- **THEN** no earning is clawed back

#### Scenario: grade10-site-store-order-settlement-SC-04 - A split return claws back what one refund would

- **WHEN** a member returns every good that earned, across several refunds
- **THEN** the whole earn basis is clawed back
- **AND** the answer is the same as for the same return in one refund

#### Scenario: grade10-site-store-order-settlement-SC-05 - A refund naming nothing is estimated and says so

- **WHEN** an operator refunds an amount against an order, naming nothing back
- **THEN** the claw-back is that amount's share of the order's goods
- **AND** every such refund is counted, and one the share cannot price exactly
  is counted apart from it

#### Scenario: grade10-site-store-order-settlement-SC-13 - A refund of the delivery alone claws back nothing

- **WHEN** an operator returns the delivery on an order, itemising no goods
- **THEN** nothing is clawed back
- **AND** a tender the sale was paid with stays spent

### Requirement: A points tender returns only when everything it was spread over does

The Store SHALL return a points tender to the member's balance only once the
goods its refunds have stated back reach everything the sale states its goods in
— the goods the provider stated, or the whole charge where it stated none. A
refund that states no goods SHALL add none, so a sale returned as a typed amount
SHALL hold its tender however its refunds are ordered. A tender is one discount
the provider spreads across every line it sold, so no part of the sale SHALL be
read as having carried it and no partial return SHALL return any of it. A member
who returned everything the order earned on and got no tender back SHALL be
reported, to be returned by hand. A sale whose whole charge came back while its
goods are still recorded as held SHALL be reported apart from that, whether or
not a tender was spent on it.

#### Scenario: grade10-site-store-order-settlement-SC-11 - A sale still holding a gift card returns no tender

- **WHEN** a member returns every good that earned
- **AND** keeps the gift card the same tender paid part of
- **THEN** no points are returned to their balance
- **AND** the member is reported for an operator to settle by hand

#### Scenario: grade10-site-store-order-settlement-SC-12 - Every good back returns the whole tender

- **WHEN** every good of a sale a member tendered points on comes back
- **THEN** the whole tender is returned to their balance
- **AND** the answer is the same whether the return arrives as one refund or many

#### Scenario: grade10-site-store-order-settlement-SC-14 - A sale paid back in full whose goods stop short is reported

- **WHEN** an operator returns a sale as an amount typed for the goods and the
  delivery ticked beside it
- **THEN** the whole charge is recorded back and none of the goods are
- **AND** the sale is reported for an operator, whether points were spent on it
  or not

#### Scenario: grade10-site-store-order-settlement-SC-15 - A sale returned as a typed amount holds its tender

- **WHEN** a sale a member tendered points on is returned as an amount typed for
  the goods and the delivery ticked beside it
- **THEN** no points are returned to their balance
- **AND** the answer is the same whichever of the two the operator rings first

### Requirement: A coupon is spent only where its own cut reached the sale

The Store SHALL spend a coupon welded to a line only where the settlement's
allocations for that line name the coupon's own application, read once in the
transaction that makes the payment true, and matched by the title the Store
welded it under and the variant it names — both, so a cut the shop made itself
is never read as ours. An order code SHALL be spent only where the settled order
carries that code. A coupon the settled lines do not show SHALL be returned to
the member and counted.

#### Scenario: grade10-site-store-order-settlement-SC-06 - A coupon whose cut is gone is not spent

- **WHEN** a shopkeeper removes a product coupon's cut before tender
- **AND** the sale still sells that variant
- **THEN** the coupon returns to the member unspent

#### Scenario: grade10-site-store-order-settlement-SC-07 - A coupon the sale still shows is spent

- **WHEN** a sale settles carrying a product coupon's own cut on its line
- **THEN** the coupon is spent against that order

### Requirement: A points tender is worth what the shop allocated to it

The Store SHALL price the points tender on a settled order at what the provider
allocated to it, not at what the Store promised. A discount code SHALL be priced
at the value the Store minted it for; what the provider allocated to a code SHALL
NOT change what the sale captures. Money the provider discounted that no
instrument accounts for SHALL be counted and reported, and SHALL never be read as
a points tender.

#### Scenario: grade10-site-store-order-settlement-SC-08 - A code applied for less than its face value captures no extra points

- **WHEN** a settled order carries an order code the shop applied for less than
  its face value
- **THEN** the points captured are no more than the points discount's own
  allocation paid for

#### Scenario: grade10-site-store-order-settlement-SC-09 - A points tender is worth its own allocation

- **WHEN** a settled order carries a points discount the shop applied for less
  than the Store promised
- **AND** the shopkeeper took a further discount off the same sale by hand
- **THEN** the points captured are those the points discount's own allocation
  paid for
- **AND** the discount the shopkeeper made is not read as points

#### Scenario: grade10-site-store-order-settlement-SC-10 - A discount no instrument explains is reported

- **WHEN** a settled order's discounts exceed what its instruments account for
- **THEN** the difference is reported for an operator
- **AND** no points are captured for it
