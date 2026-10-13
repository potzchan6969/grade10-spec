# grade10-site/auction/winner-order Specification

## Feature set

- A lot an internal bidder won
  - Internal bidder order: a close with an internal bidder leading opens its order with the internal bidder's billing address and sends no letter

## MODIFIED Requirements

### Requirement: A lot close opens an order that waits for the winner's address

At lot close Grade10 SHALL, for the winner:

1. Create one auction order for the lot, with invoice status `not_issued` and
   fulfilment status `unfulfilled`, per `grade10-site/auction/order-status`.
2. Notify the winner that they have won and ask them to confirm a delivery
   address, per `grade10-site/auction/notifications-order`.

Grade10 SHALL NOT issue an invoice at lot close, and SHALL offer the winner no
way to pay until an operator has sent one.

When the winner confirms a delivery address, the order SHALL become ready for
an operator to quote, per `grade10-admin/auction/post-sale`. From then on the
winner SHALL NOT change the address, per "The delivery address locks when the
invoice is sent".

When a lot's leading bid at its close is the house's, under
`grade10-site/auction/auction`, the winner is the internal bidder of
`grade10-admin/auction/internal-bid` that the lot's internal bid names.
Grade10 SHALL create its one auction order in step 1, flagged internal, and
SHALL, in place of step 2 and the winner's setup:

- Take the internal bidder's billing address as it stands at the close as
  the order's delivery address and billing address, and bank transfer as its
  payment method, all confirmed at the close, so the order is ready for an
  operator to quote and never waits on an address deadline.
- Send no letter of `grade10-site/auction/notifications-order` for the order,
  at the close or after it, to the internal bidder or to anyone.

Order creation and the winner notice SHALL be idempotent. A lot
close delivered more than once SHALL produce one auction order.

<!-- trace:scenario id=g10.auction-winner-order.SC-l0b rev=1 -->
#### Scenario: winner-order-SC-26 - A lot close asks for an address, not payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a lot closing with a winner
- **WHEN** the lot closes
- **THEN** Grade10 creates one auction order with invoice status `not_issued`
  and fulfilment status `unfulfilled`
- **AND** issues no invoice
- **AND** asks the winner to confirm a delivery address

<!-- trace:scenario id=g10.auction-winner-order.SC-2p8 rev=2 -->
#### Scenario: winner-order-SC-27 - A repeated lot close creates nothing twice
**Serves:** Invoice at lot close - a repeated lot close creates nothing twice

- **GIVEN** a lot whose close has already created an auction order
- **WHEN** that same lot close is delivered again
- **THEN** Grade10 leaves one auction order
- **AND** does not notify the winner a second time

<!-- trace:scenario id=g10.auction-winner-order.SC-sko rev=1 -->
#### Scenario: winner-order-SC-28 - Confirming an address readies the order for a quote
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order waiting for its winner's address
- **WHEN** the winner confirms a delivery address
- **THEN** the order's derived status is Preparing Invoice
- **AND** the winner is offered no way to pay yet

<!-- trace:scenario id=g10.auction-winner-order.SC-los rev=2 -->
#### Scenario: winner-order-SC-277 - A lot an internal bidder wins opens its order with the internal bidder's address
**Serves:** A lot an internal bidder won - the close finds the house on top and opens the internal bidder's order

- **GIVEN** an `HKD` lot where the house leads at 31000 HKD minor units over
  collector A, its internal bid naming an internal bidder whose billing
  address is in Hong Kong
- **WHEN** the lot closes
- **THEN** Grade10 creates one auction order for the internal bidder, flagged
  internal, with invoice status `not_issued`
- **AND** the order holds that billing address as its delivery and billing
  address, with bank transfer, and derives as Preparing Invoice
- **AND** issues no invoice and sends no won, address or other letter for it
