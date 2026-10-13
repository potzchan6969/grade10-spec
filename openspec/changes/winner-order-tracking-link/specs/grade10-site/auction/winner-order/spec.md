# grade10-site/auction/winner-order Specification

## Purpose
What a winner is sent after a lot closes and what they do with it: one order
per lot, a delivery address, payment method and billing address they choose, an
operator's invoice priced for both, payment by card or by a bank transfer they
prove, and the receipt, tracker and delivery proof the order keeps afterwards.

## Feature set

- Order-progress tracking
  - Tracking number: while fulfilment is `fulfilled` with a tracking number, Order Progress makes the number an external link to the carrier tracking page when the operator recorded a tracker link, and plain text otherwise; no Track shipment control or carrier name appears in Order Progress; the link remains after delivery is confirmed

## ADDED Requirements

### Requirement: Winner Order makes the tracking number the carrier link

While an auction order's fulfilment is `fulfilled` and it has a tracking
number, Winner Order SHALL show that number as the external link to the carrier
tracking page in Order Progress when the operator recorded a tracker link. The
link SHALL open in a new tab. Order Progress SHALL show no separate Track
shipment control or carrier name. The link SHALL remain after
`delivery_confirmed` is set while the fulfilment stays `fulfilled`. When the
operator recorded no tracker link, Winner Order SHALL show the tracking number
as plain text, with no carrier name and no Track shipment control.

This requirement governs the live Winner Order presentation only.

<!-- trace:scenario id=g10.auction-winner-order.SC-h7d rev=2 -->
#### Scenario: winner-order-SC-251 - A dispatched lot shows the tracking number as the carrier link
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose fulfilment status has just become
  `fulfilled` with a tracking number and a tracker link attached
- **WHEN** the winner opens the order
- **THEN** Order Progress shows the tracking number as a link to the carrier
  tracking page
- **AND** the link opens in a new tab
- **AND** it shows no separate Track shipment control and no carrier name in
  Order Progress

<!-- trace:scenario id=g10.auction-winner-order.SC-k4r rev=2 -->
#### Scenario: winner-order-SC-252 - The tracker remains after delivery is confirmed
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order that is `fulfilled` with a tracking number and a
  tracker link, and `delivery_confirmed` is set
- **WHEN** the winner opens the order
- **THEN** Order Progress still shows the tracking number as a link to the
  carrier tracking page

<!-- trace:scenario id=g10.auction-winner-order.SC-tgb rev=1 -->
#### Scenario: winner-order-SC-276 - Without a tracker link the tracking number is plain text
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order that is `fulfilled` with a tracking number and no
  tracker link recorded by the operator
- **WHEN** the winner opens the order
- **THEN** Order Progress shows the tracking number as plain text, not a link
- **AND** it shows no carrier name and no Track shipment control
