# grade10-site/auction/winner-order Specification

## Feature set

- A lot an internal bidder won
  - Internal bidder order: a close with an internal bidder leading opens its order with the internal bidder's billing address and sends no letter

## MODIFIED Requirements

### Requirement: One invoice and one auction order per lot

Grade10 SHALL issue exactly one invoice and create exactly one auction order
per lot that closes with a winner other than the house, and SHALL NOT
combine lots won by the same winner into one invoice, one deadline, or one
shipment. Each order SHALL carry its own delivery address, its own quote, its
own payment deadline, and its own fulfilment lifecycle. For a lot the house
leads at its close, under `grade10-site/auction/auction`, Grade10 SHALL issue
no invoice and create no auction order.

<!-- trace:scenario id=g10.auction-winner-order.SC-a2i rev=1 -->
#### Scenario: winner-order-SC-06 - Two lots won together stay two orders
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** one winner who wins two lots in the same auction, closing at
  different times
- **WHEN** both lots close and an operator sends each invoice
- **THEN** Grade10 has created two auction orders and sent two invoices
- **AND** each carries its own payment deadline measured from its own
  invoice's send
- **AND** each is charged its own shipping

### Requirement: A lot close opens an order that waits for the winner's address

At lot close Grade10 SHALL, for a winner other than the house:

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

The house is never a lot's winner here. When a lot's leading bid at its
close is the house's, under `grade10-site/auction/auction`, Grade10 SHALL
create no auction order for it and SHALL send no won or address letter for
it, to the house or to anyone else.

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

<!-- trace:scenario id=g10.auction-winner-order.SC-los rev=1 -->
#### Scenario: winner-order-SC-277 - A lot the house wins opens no order
**Serves:** A lot the house won - the close finds the house on top and opens nothing

- **GIVEN** an `HKD` lot where the house leads at 31000 HKD minor units over
  collector A
- **WHEN** the lot closes
- **THEN** Grade10 creates no auction order and issues no invoice for it
- **AND** sends no won or address letter for it
