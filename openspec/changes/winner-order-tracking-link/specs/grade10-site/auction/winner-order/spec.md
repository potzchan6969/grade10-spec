## Feature set

- Order-progress tracking
  - Shipping tracker: while fulfilment is `fulfilled` (Shipped and Delivered), Order Progress shows the tracking number as an external carrier link; no Track shipment button and no carrier name in that chrome

## ADDED Requirements

### Requirement: Winner Order makes the tracking number the carrier link

While an auction order's fulfilment is `fulfilled`, Winner Order SHALL show
the tracking number as the external link to the carrier tracking page in Order
Progress. It SHALL show no separate Track shipment control and no carrier name
in that chrome. The link SHALL remain after `delivery_confirmed` is set while
the fulfilment remains `fulfilled`.

This requirement governs the live Winner Order presentation only. The records
the winner keeps, including receipt identifiers and contents, remain governed
by their own requirement.

<!-- trace:scenario id=g10.auction-winner-order.SC-h7d rev=1 -->
#### Scenario: winner-order-SC-251 - A dispatched lot shows the tracking number as the carrier link
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose fulfilment status has just become
  `fulfilled` with a tracking number attached
- **WHEN** the winner opens the order
- **THEN** Order Progress shows the tracking number as a link to the carrier
  tracking page
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
