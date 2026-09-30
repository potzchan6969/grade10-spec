## Feature set

- Order page
  - The design's page body: title and badge, Order Progress, the lot, alerts, the sidebar
  - By status: Complete Order Setup, the invoice with the pay control, or read-only detail

## ADDED Requirements

### Requirement: The auction order page is the Winner Order design

The auction order page SHALL render `AuctionWinnerOrder` from
`shared/ui/auction-order`, the block the Winner Order stories render, and no
rebuild of it.

| Part | Carries |
| --- | --- |
| Header | The page title and the order status badge |
| Order Progress | The five steps, per "Winner Order shows five progress steps" |
| Lot | The lot's key image, title and winning bid, opening the lot |
| Alerts | Under the lot: the status's outcome, suspension, a returned proof, a card checkout's return |
| Sidebar | The order summary with its lines and Invoice PDF, the pay controls and deadline, the payment method with its receipts, the delivery and billing addresses, and Complete Order Setup while setup is open |

The page SHALL NOT show Order Information, Collection Method, an Order Status
list or a Lots section.

What the page offers SHALL follow the order status.

| Order status | The page offers |
| --- | --- |
| Awaiting Setup | Complete Order Setup, which opens setup, per "The address form refuses empty required fields" |
| Preparing Invoice | The confirmed address, per "The delivery address is confirmed before payment"; no invoice and no way to pay |
| Pending Payment | The full invoice with every line, per "Invoice fields", and the pay control for the chosen method; the confirmed address |
| Preparing Shipment, Shipped, Delivered, Cancelled, Refunded | Read-only detail, with the records per "Records the winner keeps" |

An invoice whose status is `expired` SHALL still be presented under the
derived Pending Payment order status, per `revise-auction-winner-invoicing`,
with its full invoice and **Contact Us** instead of the pay control. The page
SHALL not derive a second Expired order status.

<!-- trace:scenario id=g10.auction-winner-order.SC-cu4 rev=1 -->
#### Scenario: winner-order-SC-241 - The page shows the lot once
**Serves:** winner-order-US-19 - Winner confirms where a won lot ships

- **GIVEN** an auction order in any status
- **WHEN** the winner opens it
- **THEN** the page shows the header, the lot card and the sidebar
- **AND** the lot's title shows in the lot card only
- **AND** no Order Information, Collection Method, Order Status list or Lots
  section shows

<!-- trace:scenario id=g10.auction-winner-order.SC-1yn rev=1 -->
#### Scenario: winner-order-SC-240 - A suspended winner reads it under the lot
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** a suspended winner's auction order whose invoice is `pending`
- **WHEN** the winner opens it
- **THEN** an alert under the lot says bidding is suspended and payment does
  not lift it
- **AND** offers Pay what is owed

#### Scenario: winner-order-SC-242 - An unpaid order shows the invoice and the pay control
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** an auction order whose status is Pending Payment
- **WHEN** the winner opens it
- **THEN** the sidebar shows every invoice line and the pay control
- **AND** the confirmed delivery address and the lot

#### Scenario: winner-order-SC-243 - An order preparing its invoice offers no payment
**Serves:** winner-order-US-19 - Winner confirms where a won lot ships

- **GIVEN** an auction order whose status is Preparing Invoice
- **WHEN** the winner opens it
- **THEN** the page shows the confirmed address
- **AND** offers no invoice and no pay control

## REMOVED Requirements

### Requirement: The auction order page shows its sections by status

**Reason:** The page is the Winner Order design, which carries no Order
Information, Collection Method, Order Status list or Lots section; the lot
showed twice and the design's progress already tells the winner where the
order stands.

**Migration:** "The auction order page is the Winner Order design" holds what
the page offers by status. The order read still carries the status timeline.
