# grade10-site/auction/winner-order Specification

## Feature set

- Order setup
  - The winner confirms the IANA time zone for this order with their address, payment method and billing address
- Payment deadline
  - Winner Order states the deadline in the zone confirmed for this order

## ADDED Requirements

### Requirement: Winner setup records the winner's time zone

Grade10 SHALL show the browser's current IANA time zone as a suggestion in Order Setup. The winner SHALL be able to choose another IANA time zone before confirming. Confirmation SHALL submit and store the selected zone on the auction order with the other setup facts. Grade10 SHALL refuse confirmation without a valid IANA time zone. A browser suggestion alone SHALL NOT count as the winner's confirmation. Once confirmed, that zone SHALL stay fixed on the order.

The payment deadline on Winner Order SHALL be stated in the current invoice revision's zone and name that zone, including when the winner later opens the order from a browser in another zone. Each invoice and receipt SHALL use the zone snapshotted for its invoice revision under `grade10-admin/auction/post-sale`.

<!-- trace:scenario id=g10.auction-winner-order.SC-zone-confirm rev=1 -->
#### Scenario: winner-order-SC-300 - Winner confirms a suggested or changed zone
**Serves:** winner-order-US-24 - Winner confirms the time zone for a won lot

- **GIVEN** a browser suggesting `Europe/London` for a winner in Order Setup
- **WHEN** the winner selects `America/New_York` and confirms setup
- **THEN** the order stores `America/New_York` as the winner's stated zone
- **AND** its payment deadline is shown in that zone with its name

<!-- trace:scenario id=g10.auction-winner-order.SC-zone-refusal rev=1 -->
#### Scenario: winner-order-SC-301 - A missing or invalid zone prevents confirmation
**Serves:** winner-order-US-24 - Winner confirms the time zone for a won lot

- **GIVEN** a winner completing the other setup fields
- **WHEN** confirmation submits no zone or a value that is not an IANA time zone
- **THEN** Grade10 refuses confirmation and names the missing or invalid zone
- **AND** the order remains Awaiting Setup

<!-- trace:scenario id=g10.auction-winner-order.SC-zone-travel rev=1 -->
#### Scenario: winner-order-SC-302 - A later browser zone does not move the deadline
**Serves:** winner-order-US-24 - Winner confirms the time zone for a won lot

- **GIVEN** an order confirmed in `America/New_York` with a sent invoice
- **WHEN** the winner opens Winner Order from a browser in `Asia/Hong_Kong`
- **THEN** the payment deadline still reads in the order's confirmed `America/New_York` zone
- **AND** the invoice PDF uses the zone frozen on that invoice revision
