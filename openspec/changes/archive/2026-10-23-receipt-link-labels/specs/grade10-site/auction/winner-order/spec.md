# grade10-site/auction/winner-order Specification

## Feature set

- Receipts
  - Link label: a receipt link names the receipt ID and issue date —
    `Receipt #RC-LK7P2Q01P1 (22 Sep 2026)` — or `Receipt` alone when the
    record carries no ID; the date is day-only, in the viewer's local zone

## MODIFIED Requirements

### Requirement: The winner can view the payment receipt as a PDF

After payment is confirmed on an auction order — by the winner's card, by an
operator confirming the winner's bank transfer proof, or by operator manual
settlement — Winner Order SHALL offer the winner a control to view and
download the itemised payment receipt as a PDF. Each receipt link SHALL use
a PDF icon, SHALL render as a text link (not a button), and SHALL sit under
the payment-method card — not on the same row as the invoice PDF. The link
SHALL name the receipt's ID and issue date — `Receipt #RC-LK7P2Q01P1 (22
Sep 2026)`, accessible name `Receipt #RC-LK7P2Q01P1 (22 Sep 2026) PDF` —
the ID kept exactly as the receipt PDF and Grade10's letters print it. The issue date SHALL read as a day-only date in the viewer's local zone, per `shared/dates-and-times`. A
receipt record carrying no ID SHALL read `Receipt`, accessible name
`Receipt PDF`. Where an order records more than one payment, its receipt
links SHALL run oldest issued first. The control SHALL be hidden before
payment, while the invoice is `payment_verifying`, and when Cancelled.

<!-- trace:scenario id=g10.auction-winner-order.SC-aaq rev=1 -->
#### Scenario: winner-order-SC-67 - A paid order offers its receipt PDF
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers view and download of the receipt PDF under the payment-method card
- **AND** the Invoice PDF control remains available beside the Order summary heading

<!-- trace:scenario id=g10.auction-winner-order.SC-08s rev=1 -->
#### Scenario: winner-order-SC-68 - No receipt PDF before payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `pending` or `payment_verifying`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no receipt PDF control

<!-- trace:scenario id=g10.auction-winner-order.SC-n5y rev=1 -->
#### Scenario: winner-order-SC-307 - The receipt link names its ID and issue date
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** a paid auction order whose receipt is `RC-LK7P2Q01P1`, issued on
  22 Sep 2026
- **WHEN** the winner opens Winner Order
- **THEN** the receipt link reads `Receipt #RC-LK7P2Q01P1 (22 Sep 2026)`

<!-- trace:scenario id=g10.auction-winner-order.SC-d8z rev=1 -->
#### Scenario: winner-order-SC-308 - A receipt with no ID reads Receipt
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** a paid auction order whose receipt record carries no receipt ID
- **WHEN** the winner opens Winner Order
- **THEN** the receipt link reads `Receipt`
