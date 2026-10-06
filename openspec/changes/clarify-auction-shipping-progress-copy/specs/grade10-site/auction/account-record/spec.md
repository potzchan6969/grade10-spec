# grade10-site/auction/account-record Specification

## Purpose

A signed-in collector's own record of the auction listings they bookmark —
by watching or by bidding — on one My Auctions table: how a watch is made
and removed, how a bid enrolls the list, what Status shows while a listing is
open and after it closes, and what a winner and a losing bidder
are told once a listing closes. The detailed Bidding index and listing
history remain the contract of `grade10-site/auction/bidding-history`.
Owner-only — nobody but the collector sees their record.

## Feature set

- Won Status
  - Preparing Shipment: paid, undispatched auction order on My Auctions (was Processing)

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
| Awaiting Setup | The setup deadline has not passed, no invoice has been sent, and the winner has confirmed no delivery address |
| Preparing Invoice | No invoice has been sent, and the winner has confirmed a delivery address |
| Payment Verifying | Invoice status is `payment_verifying` |
| Pending Payment | Invoice status is `pending` and the payment deadline has not passed |
| Setup Overdue | The setup deadline has passed without a confirmed delivery address |
| Payment Overdue | Invoice status is `expired` after the payment deadline |
| Preparing Shipment | Invoice status is `paid`, and fulfilment status is `unfulfilled` |
| Shipped | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is not confirmed |
| Delivered | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is confirmed |
| Cancelled | Invoice status is `cancelled` |
| Refunded | Invoice status is `refunded` |

Preparing Shipment and Shipped SHALL use Badge `default` on a Won row.

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

A Didn’t win listing reads "Your card was not charged.", under "A losing bidder
reads that their card was not charged".

<!-- trace:scenario id=g10.auction-account-record.SC-1lv rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-20 - Card capture reads as Paid
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose invoice status is `paid` and whose fulfilment status is `unfulfilled`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Preparing Shipment
- **AND** its status badge uses Badge `default`

<!-- trace:scenario id=g10.auction-account-record.SC-pu6 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-21 - Manual collection reads as the same Paid
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose collection an operator recorded outside Stripe is `paid`, and which has not shipped
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Preparing Shipment

<!-- trace:scenario id=g10.auction-account-record.SC-m3u rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-22 - An expired payment reads Payment Overdue
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose invoice status is `expired`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Payment Overdue
- **AND** the row offers View order into Winner Order
- **AND** the row does not itself carry how to reach Grade10

<!-- trace:scenario id=g10.auction-account-record.SC-byk rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-23 - Shipment states reach the winner
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** one won listing whose paid order is fulfilled without delivery confirmation and one whose paid order has delivery confirmation
- **WHEN** the winner opens their Bidding page
- **THEN** the first listing's state is Shipped
- **AND** its status badge uses Badge `default`
- **AND** the second listing's state is Delivered

<!-- trace:scenario id=g10.auction-account-record.SC-4sy rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-24 - The winner is offered no write
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing in any auction-order status
- **WHEN** the winner opens their Bidding page
- **THEN** no control on the surface records payment, uploads payment proof, requests a wire, records shipment, changes an address or payment method, or changes the order status

<!-- trace:scenario id=g10.auction-account-record.SC-xi1 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-35 - A cancelled order remains Cancelled
**Serves:** After a close - a cancelled order remains Cancelled

- **GIVEN** a won listing whose invoice status is `cancelled`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Cancelled

<!-- trace:scenario id=g10.auction-account-record.SC-91a rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-36 - A refunded order remains Refunded
**Serves:** After a close - a refunded order remains Refunded

- **GIVEN** a won listing whose invoice status is `refunded`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Refunded

<!-- trace:scenario id=g10.auction-account-record.SC-uh6 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-47 - A won lot with no address reads Awaiting Setup
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose auction order has no sent invoice, no confirmed delivery address, and whose setup deadline has not passed
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Awaiting Setup

<!-- trace:scenario id=g10.auction-account-record.SC-ahn rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-48 - A confirmed address with no invoice reads Preparing Invoice
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose winner has confirmed a delivery address and whose invoice has not been sent
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Preparing Invoice

<!-- trace:scenario id=g10.auction-account-record.SC-pnn rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-56 - Every Won standing offers View order
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** won listings in Awaiting Setup, Pending Payment, Payment Verifying, Shipped, and Refunded
- **WHEN** the winner opens My Auctions
- **THEN** each of those rows offers View order into that lot's Winner Order

<!-- trace:scenario id=g10.auction-account-record.SC-fn7 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-57 - Didn’t win offers no View order
**Serves:** After a close - a lost listing does not open a Winner Order

- **GIVEN** a listing whose standing is Didn’t win
- **WHEN** the winner opens My Auctions
- **THEN** that row offers no View order entry to Winner Order

<!-- trace:scenario id=g10.auction-account-record.SC-skc rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-58 - A Won row carries no secondary helper lines
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing in Awaiting Setup and a won listing whose invoice is `expired`
- **WHEN** the winner opens My Auctions
- **THEN** neither row shows secondary helper detail under its standing
- **AND** both rows still show their standing and View order

<!-- trace:scenario id=g10.auction-account-record.SC-haw rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-60 - Proof waiting for an operator reads Payment Verifying
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose invoice status is `payment_verifying`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Payment Verifying
- **AND** the row offers View order and no upload control

<!-- trace:scenario id=g10.auction-account-record.SC-fgb rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-61 - The row follows the proof check
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** one won listing whose proof an operator returned, and one whose proof an operator confirmed, neither shipped
- **WHEN** the winner opens their Bidding page
- **THEN** the first listing's state is Pending Payment
- **AND** the second listing's state is Preparing Shipment
