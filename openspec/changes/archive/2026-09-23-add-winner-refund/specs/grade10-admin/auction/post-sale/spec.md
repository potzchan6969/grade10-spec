## Feature set

- Resolving an unpaid order
  - Refund: records money returned after full or partial collection
- Queue
  - Refunded outcome: lets finance find completed refunds
- Audit trail
  - Refund record: keeps the amount, method, reason, proof and audit number

## ADDED Requirements

### Requirement: Operators can record one bounded refund and its stock outcome

An operator with `auction:refund` SHALL be able to record exactly one refund
on an auction order in Processing, Shipped, Delivered or Partially Paid. The
entered amount SHALL be greater than zero and no greater than the cumulative
amount paid. The record SHALL include method, provider reference, reason,
note, one to five proof files, the operator and timestamp, and whether the
lot returns to stock. Recording it SHALL make the order Refunded, preserve
the shipment record, fix the stock choice, and refuse a second refund.

#### Scenario: grade10-admin-auction-post-sale-SC-145 - A refund closes a partially paid order
**Serves:** post-sale-US-16 - recording the external refund on the order

- **GIVEN** a Partially Paid order with 40000 minor units paid
- **WHEN** an operator records a 40000 minor unit bank refund with its reason, reference and proof
- **THEN** the order reads Refunded
- **AND** the refund stores the amount, method, audit number and stock choice

#### Scenario: grade10-admin-auction-post-sale-SC-146 - An over-refund is refused
**Serves:** post-sale-US-16 - refusing an amount the winner did not pay

- **GIVEN** an order with 40000 minor units paid
- **WHEN** an operator enters a refund above 40000 minor units
- **THEN** Grade10 refuses the record
- **AND** the order remains in its previous outcome

### Requirement: Refunds are findable and permissioned

The post-sale queue SHALL offer a Refunded outcome and the order detail SHALL
show one refund record with its amount, method, reference, reason, note,
proof, audit number, actor and time. `staff` and `admin` SHALL receive
`auction:refund`; `finance` SHALL read refund records but SHALL NOT record
one. A refund SHALL appear in the invoice log without exposing payment
credentials.

#### Scenario: grade10-admin-auction-post-sale-SC-147 - Finance reconciles one refund record
**Serves:** post-sale-US-17 - reconciling the refund record

- **GIVEN** a refunded order
- **WHEN** finance filters the queue to Refunded and opens the order
- **THEN** the queue returns the order
- **AND** the detail exposes the same refund amount, method, reference, reason, audit number and actor
