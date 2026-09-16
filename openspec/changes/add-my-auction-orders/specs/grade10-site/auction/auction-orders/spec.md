## Purpose

My Auction Orders is the signed-in collector's list of every auction order they
have won, one row per order, with the one action each order needs next.

## Feature set

- **Order list**
  - Rows: one per won order, with lot, auction, winning bid and order status.
  - Ordering: orders waiting on the winner first, then newest close.
  - Entry points: the account menu and each Won row on My Auctions.
- **Row actions**
  - View lot: opens the lot's listing page.
  - Next action: Confirm address, Pay Invoice or View detail by order status.
- **Honest reads**
  - Owner only: the list is resolved from the session.
  - Empty and failed: an empty list points to My Auctions; a failed read retries.

## ADDED Requirements

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

Rows SHALL order in two bands: orders whose status is Awaiting Address or
Pending Payment first, then every other order. Within each band, the most
recently closed lot SHALL come first.

The account menu SHALL link to My Auction Orders beside My Auctions.

#### Scenario: grade10-site-auction-auction-orders-SC-01 - Every won order is listed once
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** a collector who has won three lots
- **WHEN** they open My Auction Orders
- **THEN** it lists three rows, one per auction order
- **AND** each row carries the lot, the auction, the winning bid and the order status

#### Scenario: grade10-site-auction-auction-orders-SC-02 - Another collector's orders are never listed
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** two collectors who have each won a lot
- **WHEN** the first opens My Auction Orders
- **THEN** only their own order is listed

#### Scenario: grade10-site-auction-auction-orders-SC-03 - Orders waiting on the winner come first
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** a Delivered order whose lot closed yesterday and a Pending Payment
  order whose lot closed last week
- **WHEN** the collector opens My Auction Orders
- **THEN** the Pending Payment order is listed before the Delivered order

#### Scenario: grade10-site-auction-auction-orders-SC-04 - Newest close first within a band
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** two Processing orders, one whose lot closed yesterday and one last week
- **WHEN** the collector opens My Auction Orders
- **THEN** the order closed yesterday is listed first

### Requirement: Each row offers View lot and the action its status needs

Every row SHALL offer **View lot**, which opens the lot's listing page, and
exactly one action chosen by the order status. Every action SHALL open that
order, per `grade10-site/auction/winner-order`.

| Order status | Action |
| --- | --- |
| Awaiting Address | Confirm address |
| Pending Payment | Pay Invoice |
| Preparing Invoice | View detail |
| Processing | View detail |
| Shipped | View detail |
| Delivered | View detail |
| Cancelled | View detail |
| Refunded | View detail |

An order whose invoice status is `expired` reads Pending Payment and SHALL
offer Pay Invoice.

No row SHALL record payment, change an address, or change an order status from
the list itself.

#### Scenario: grade10-site-auction-auction-orders-SC-05 - An order awaiting an address offers Confirm address
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** an order whose status is Awaiting Address
- **WHEN** the winner selects Confirm address on its row
- **THEN** that order opens

#### Scenario: grade10-site-auction-auction-orders-SC-06 - An unpaid order offers Pay Invoice
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** an order whose status is Pending Payment
- **WHEN** the winner reads its row
- **THEN** the row's action is Pay Invoice
- **AND** selecting it opens that order

#### Scenario: grade10-site-auction-auction-orders-SC-07 - An expired invoice still offers Pay Invoice
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** an order whose invoice status is `expired`
- **WHEN** the winner reads its row
- **THEN** the order status is Pending Payment
- **AND** the row's action is Pay Invoice

#### Scenario: grade10-site-auction-auction-orders-SC-08 - Other statuses offer View detail
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** orders whose statuses are Preparing Invoice, Processing, Shipped,
  Delivered, Cancelled and Refunded
- **WHEN** the winner reads their rows
- **THEN** each row's action is View detail

#### Scenario: grade10-site-auction-auction-orders-SC-09 - View lot opens the listing
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** an order on My Auction Orders
- **WHEN** the winner selects View lot
- **THEN** the lot's listing page opens

### Requirement: Empty and failed reads

An empty My Auction Orders SHALL say the collector has no auction orders,
SHALL offer a way to My Auctions, and SHALL NOT be presented as a failure.

A read Grade10 could not complete SHALL be shown as a failure that can be
retried, and SHALL NOT be shown as an empty list.

#### Scenario: grade10-site-auction-auction-orders-SC-10 - An empty list points to My Auctions
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** a collector who has won no lots
- **WHEN** they open My Auction Orders
- **THEN** the page offers a way to My Auctions
- **AND** it does not report an error

#### Scenario: grade10-site-auction-auction-orders-SC-11 - A failed read is not an empty list
**Serves:** grade10-site-auction-auction-orders-US-01 - Winner finds what each won order needs next

- **GIVEN** a collector whose orders Grade10 cannot read
- **WHEN** they open My Auction Orders
- **THEN** the page reports that the read failed and offers to retry
- **AND** it does not show an empty list
