# grade10-site/loyalty/programme Specification

## Feature set

- Earning
  - Earn on completion: a web order earns once, when it is Completed, on the net it has paid then; a till sale earns when sold

## ADDED Requirements

### Requirement: A web order earns when it completes

A site order SHALL earn its points once, when it first reaches the Completed
badge — every item fulfilled and paid in full — and never at payment. The
earn SHALL be priced on the qualifying goods the order has paid for at
completion, less the goods any refund before completion took back, at the
member's tier then. An order canceled or refunded in full before it completes
SHALL earn nothing. An order that already holds an earn, one priced at
payment before this rule or one an attribution claim minted, SHALL earn
nothing again when it completes. A site guest order SHALL never earn, linked
to an account or not. A till sale is fulfilled at the counter, so it SHALL
earn when it is sold. Points spent and coupons used SHALL still be debited
when the paid order lands. Order Details SHALL name no points for an order
that will never earn.

<!-- trace:scenario id=g10.loyalty-programme.SC-ec1 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-259 - A web order earns when it completes, not when it is paid
**Serves:** g10.loyalty-programme.US13 - Member earns when the order completes

- **GIVEN** a member's paid web order that is not yet fulfilled
- **WHEN** its payment lands
- **THEN** it earns nothing yet
- **AND** when every item is fulfilled it earns once, on its qualifying goods

<!-- trace:scenario id=g10.loyalty-programme.SC-ec2 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-260 - A refund before completion lowers what the completion earns
**Serves:** g10.loyalty-programme.US13 - Member earns when the order completes

- **GIVEN** a member's paid web order, part of whose goods are refunded before it is fulfilled
- **WHEN** the order completes
- **THEN** the refund claws back nothing
- **AND** the completion earns on the goods left

<!-- trace:scenario id=g10.loyalty-programme.SC-ec3 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-261 - An order that earned at payment earns nothing again
**Serves:** g10.loyalty-programme.US13 - Member earns when the order completes

- **GIVEN** a web order paid before this rule, whose payment earned
- **WHEN** the order completes
- **THEN** no second earn is recorded

<!-- trace:scenario id=g10.loyalty-programme.SC-ec4 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-258 - An order that will never earn names no points
**Serves:** g10.loyalty-programme.US14 - Member earns nothing on an order that never completes

- **GIVEN** a web order canceled, or refunded in full, before it completes
- **WHEN** the member opens its Order Details
- **THEN** the page names no points for it
