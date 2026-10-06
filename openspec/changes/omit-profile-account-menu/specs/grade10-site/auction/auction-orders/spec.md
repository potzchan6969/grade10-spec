# grade10-site/auction/auction-orders Specification

## Feature set

- **Order list**
  - Entry points: not the account menu; each Won row on My Auctions opens its
    own order.

## MODIFIED Requirements

### Requirement: The list holds one row per won order

My Auction Orders SHALL list every auction order whose winner is the signed-in
collector, one row per order, resolved from the session. It SHALL NOT accept
any input that selects another collector's orders.

| Field | Value |
| --- | --- |
| Lot | Key image and title |
| Auction | The auction's name |
| Winning bid | Integer count of minor units with an ISO 4217 currency code |
| Order status | The derived status, per `grade10-site/auction/order-status` |

Rows SHALL order in two bands: orders whose status is Awaiting Setup or
Pending Payment first, then every other order. Within each band, the most
recently closed lot SHALL come first.

<!-- trace:scenario id=g10.auction-auction-orders.SC-nv4 rev=1 -->
#### Scenario: grade10-site-auction-auction-orders-SC-01 - Every won order is listed once
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** a collector who has won three lots
- **WHEN** they open My Auction Orders
- **THEN** it lists three rows, one per auction order
- **AND** each row carries the lot, the auction, the winning bid and the order status

<!-- trace:scenario id=g10.auction-auction-orders.SC-czj rev=1 -->
#### Scenario: grade10-site-auction-auction-orders-SC-02 - Another collector's orders are never listed
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** two collectors who have each won a lot
- **WHEN** the first opens My Auction Orders
- **THEN** only their own order is listed

<!-- trace:scenario id=g10.auction-auction-orders.SC-c1n rev=1 -->
#### Scenario: grade10-site-auction-auction-orders-SC-03 - Orders waiting on the winner come first
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** a Delivered order whose lot closed yesterday and a Pending Payment
  order whose lot closed last week
- **WHEN** the collector opens My Auction Orders
- **THEN** the Pending Payment order is listed before the Delivered order

<!-- trace:scenario id=g10.auction-auction-orders.SC-lqy rev=1 -->
#### Scenario: grade10-site-auction-auction-orders-SC-04 - Newest close first within a band
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** two Preparing Shipment orders, one whose lot closed yesterday and one last week
- **WHEN** the collector opens My Auction Orders
- **THEN** the order closed yesterday is listed first
