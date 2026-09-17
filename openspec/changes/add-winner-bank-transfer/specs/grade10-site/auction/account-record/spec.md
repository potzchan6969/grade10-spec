## Feature set

- **After a close**
  - Payment Verifying: a won lot whose payment proof waits for an operator reads Payment Verifying

## MODIFIED Requirements

### Requirement: A winner reads their own payment and shipment state

A listing under Won SHALL carry the auction order's derived status, projected
from the invoice status, fulfilment status, address confirmation, and
delivery confirmation defined by
`grade10-site/auction/order-status`. The account record SHALL show the same
status vocabulary as the auction order and SHALL NOT invent a second payment
or shipment state.

| Collector state | Reached from |
| --- | --- |
| Awaiting Setup | No invoice has been sent, and the winner has confirmed no delivery address |
| Preparing Invoice | No invoice has been sent, and the winner has confirmed a delivery address |
| Payment Verifying | Invoice status is `payment_verifying` |
| Pending Payment | Invoice status is `pending` or `expired` |
| Processing | Invoice status is `paid`, and fulfilment status is `unfulfilled` |
| Shipped | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is not confirmed |
| Delivered | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is confirmed |
| Cancelled | Invoice status is `cancelled` |
| Refunded | Invoice status is `refunded` |

This surface SHALL remain read-only. It SHALL offer no control that records
payment, uploads payment proof, requests a wire, records shipment, changes an
address or payment method, or changes an auction order's status.

Every Won listing SHALL offer a clear **View order** (or equivalent) entry that
opens that lot's Winner Order, including when the derived status is Cancelled
or Refunded. Listings that are not Won SHALL NOT offer that entry.

A Won listing SHALL NOT carry secondary helper detail lines under its standing
(address prompts, invoice-coming copy, order totals, or how to reach Grade10).
How to reach Grade10 when the invoice is `expired` SHALL appear on Winner Order
only.

Didn’t win hold being-released and released copy remains governed by the durable
hold requirements folded with `redesign-my-auctions-table`; this change does not
remove them.

#### Scenario: grade10-site-auction-account-record-SC-20 - Card capture reads as Paid
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose invoice status is `paid` and whose fulfilment status is `unfulfilled`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Processing

#### Scenario: grade10-site-auction-account-record-SC-21 - Manual collection reads as the same Paid
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose collection an operator recorded outside Stripe is `paid`, and which has not shipped
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Processing

#### Scenario: grade10-site-auction-account-record-SC-22 - A payment problem says how to reach Grade10
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose invoice status is `expired`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Pending Payment
- **AND** the row offers View order into Winner Order
- **AND** the row does not itself carry how to reach Grade10

#### Scenario: grade10-site-auction-account-record-SC-23 - Shipment states reach the winner
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** one won listing whose paid order is fulfilled without delivery confirmation and one whose paid order has delivery confirmation
- **WHEN** the winner opens their Bidding page
- **THEN** the first listing's state is Shipped
- **AND** the second listing's state is Delivered

#### Scenario: grade10-site-auction-account-record-SC-24 - The winner is offered no write
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing in any auction-order status
- **WHEN** the winner opens their Bidding page
- **THEN** no control on the surface records payment, uploads payment proof, requests a wire, records shipment, changes an address or payment method, or changes the order status

#### Scenario: grade10-site-auction-account-record-SC-35 - A cancelled order remains Cancelled
**Serves:** After a close - a cancelled order remains Cancelled

- **GIVEN** a won listing whose invoice status is `cancelled`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Cancelled

#### Scenario: grade10-site-auction-account-record-SC-36 - A refunded order remains Refunded
**Serves:** After a close - a refunded order remains Refunded

- **GIVEN** a won listing whose invoice status is `refunded`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Refunded

#### Scenario: grade10-site-auction-account-record-SC-47 - A won lot with no address reads Awaiting Setup
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose auction order has no sent invoice and no confirmed delivery address
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Awaiting Setup

#### Scenario: grade10-site-auction-account-record-SC-48 - A confirmed address with no invoice reads Preparing Invoice
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose winner has confirmed a delivery address and whose invoice has not been sent
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Preparing Invoice

#### Scenario: grade10-site-auction-account-record-SC-56 - Every Won standing offers View order
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** won listings in Awaiting Setup, Pending Payment, Payment Verifying, Shipped, and Refunded
- **WHEN** the winner opens My Auctions
- **THEN** each of those rows offers View order into that lot's Winner Order

#### Scenario: grade10-site-auction-account-record-SC-57 - Didn’t win offers no View order
**Serves:** After a close - a lost listing does not open a Winner Order

- **GIVEN** a listing whose standing is Didn’t win
- **WHEN** the winner opens My Auctions
- **THEN** that row offers no View order entry to Winner Order

#### Scenario: grade10-site-auction-account-record-SC-58 - A Won row carries no secondary helper lines
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing in Awaiting Setup and a won listing whose invoice is `expired`
- **WHEN** the winner opens My Auctions
- **THEN** neither row shows secondary helper detail under its standing
- **AND** both rows still show their standing and View order

#### Scenario: grade10-site-auction-account-record-SC-60 - Proof waiting for an operator reads Payment Verifying
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose invoice status is `payment_verifying`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Payment Verifying
- **AND** the row offers View order and no upload control

#### Scenario: grade10-site-auction-account-record-SC-61 - The row follows the proof check
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** one won listing whose proof an operator returned, and one whose proof an operator confirmed, neither shipped
- **WHEN** the winner opens their Bidding page
- **THEN** the first listing's state is Pending Payment
- **AND** the second listing's state is Processing
