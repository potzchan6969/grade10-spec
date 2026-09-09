## MODIFIED Requirements

### Requirement: A winner reads their own payment and shipment state

A listing under Won SHALL carry the auction order's derived status, projected
from the invoice status, fulfilment status, payment deadline, and delivery
confirmation defined by `grade10-site/auction/order-status`. The account record
SHALL show the same status vocabulary as the auction order and SHALL NOT invent
a second payment or shipment state.

| Collector state | Reached from |
| --- | --- |
| Pending Payment | Invoice status is `pending`, and the payment deadline has not elapsed |
| Expired | Invoice status is `pending`, and the payment deadline has elapsed |
| Processing | Invoice status is `paid`, and fulfilment status is `unfulfilled` |
| Shipped | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is not confirmed |
| Delivered | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is confirmed |
| Cancelled | Invoice status is `cancelled` |
| Refunded | Invoice status is `refunded` |

This surface SHALL remain read-only. It SHALL offer no control that records
payment, requests a wire, records shipment, changes an address, or changes an
auction order's status.

#### Scenario: grade10-site-auction-account-record-SC-20 - Card capture reads as Paid

- **GIVEN** a won listing whose invoice status is `paid` and whose fulfilment status is `unfulfilled`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Processing

#### Scenario: grade10-site-auction-account-record-SC-21 - Manual collection reads as the same Paid

- **GIVEN** a won listing whose collection an operator recorded outside Stripe is `paid`, and which has not shipped
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Processing

#### Scenario: grade10-site-auction-account-record-SC-22 - A payment problem says how to reach Grade10

- **GIVEN** a won listing whose invoice status is `pending` and whose payment deadline has passed
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Expired
- **AND** the row carries how to reach Grade10

#### Scenario: grade10-site-auction-account-record-SC-23 - Shipment states reach the winner

- **GIVEN** one won listing whose paid order is fulfilled without delivery confirmation and one whose paid order has delivery confirmation
- **WHEN** the winner opens their Bidding page
- **THEN** the first listing's state is Shipped
- **AND** the second listing's state is Delivered

#### Scenario: grade10-site-auction-account-record-SC-24 - The winner is offered no write

- **GIVEN** a won listing in any auction-order status
- **WHEN** the winner opens their Bidding page
- **THEN** no control on the surface records payment, requests a wire, records shipment, changes an address, or changes the order status

#### Scenario: grade10-site-auction-account-record-SC-35 - A cancelled order remains Cancelled

- **GIVEN** a won listing whose invoice status is `cancelled`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Cancelled

#### Scenario: grade10-site-auction-account-record-SC-36 - A refunded order remains Refunded

- **GIVEN** a won listing whose invoice status is `refunded`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Refunded
