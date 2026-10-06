# grade10-site/auction/winner-order Specification

## Purpose

Let a winner open the carrier's tracker from the dispatched order while the
order is Shipped or Delivered.

## Feature set

- Order-progress tracking
  - Tracking number: while fulfilment is `fulfilled` with a tracking number, Order Progress makes the number an external link to the carrier tracking page; no Track shipment control or carrier name appears in Order Progress; the link remains after delivery is confirmed

## ADDED Requirements

### Requirement: Winner Order makes the tracking number the carrier link

While an auction order's fulfilment is `fulfilled` and it has a tracking
number, Winner Order SHALL show that number as the external link to the carrier
tracking page in Order Progress. The link SHALL open in a new tab. Order
Progress SHALL show no separate Track shipment control or carrier name. The
link SHALL remain after `delivery_confirmed` is set while the fulfilment stays
`fulfilled`.

This requirement governs the live Winner Order presentation only. The carrier
data a winner keeps remains governed by `Records the winner keeps`; it does
not require carrier name in Order Progress.

<!-- trace:scenario id=g10.auction-winner-order.SC-h7d rev=1 -->
#### Scenario: winner-order-SC-251 - A dispatched lot shows the tracking number as the carrier link
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose fulfilment status has just become
  `fulfilled` with a tracking number attached
- **WHEN** the winner opens the order
- **THEN** Order Progress shows the tracking number as a link to the carrier
  tracking page
- **AND** the link opens in a new tab
- **AND** it shows no separate Track shipment control and no carrier name in
  Order Progress

<!-- trace:scenario id=g10.auction-winner-order.SC-k4r rev=1 -->
#### Scenario: winner-order-SC-252 - The tracker remains after delivery is confirmed
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order that is `fulfilled` with a tracking number, and
  `delivery_confirmed` is set
- **WHEN** the winner opens the order
- **THEN** Order Progress still shows the tracking number as a link to the
  carrier tracking page
