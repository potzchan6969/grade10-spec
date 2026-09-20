## Feature set

- Queue
  - Partial payment outcome: lets an operator distinguish a collection still in progress from a fully settled order
- Resolving an unpaid order
  - Partial collection: records more than one operator-entered payment against one invoice
  - Closing tolerance: lets the operator close a near-settled invoice or keep its real balance open
- Audit trail
  - Payment receipts: gives each recorded payment its own auditable receipt

## ADDED Requirements

### Requirement: Operators can record an ordered partial-payment history

An operator with `payment-processing` SHALL be able to record more than one
operator-entered payment against one invoice. Each payment SHALL include
amount, method, reference and proof, receive its own receipt number, and be
ordered oldest first. The cumulative amount SHALL determine the remaining
balance. While money remains due, the order outcome SHALL be Partially Paid.

#### Scenario: grade10-admin-auction-post-sale-SC-140 - A partial payment starts collection
**Serves:** post-sale-US-12 - Operator collects a lot's price across more than one payment

- **GIVEN** an unpaid invoice with a 100000 minor-unit HKD balance
- **WHEN** the operator records a 40000 minor-unit payment with method, reference and proof
- **THEN** the payment is accepted with its own receipt number
- **AND** the order reads Partially Paid with 60000 minor units remaining

#### Scenario: grade10-admin-auction-post-sale-SC-141 - Repeated payments keep one order history
**Serves:** post-sale-US-12 - Operator collects a lot's price across more than one payment

- **GIVEN** a Partially Paid invoice with one recorded payment
- **WHEN** the operator records another payment smaller than the current balance
- **THEN** both payments remain in oldest-first order
- **AND** the order remains Partially Paid

### Requirement: Closing tolerance is explicit and preserves payments

When a new payment leaves a small balance, the operator SHALL choose whether
to close the invoice as Paid or keep collecting. Keeping it open SHALL retain
the real balance and every payment. An exact balance payment SHALL close the
invoice without a second tolerance prompt. A payment SHALL never be discarded
or silently rounded.

#### Scenario: grade10-admin-auction-post-sale-SC-142 - The closing prompt does not discard the payment
**Serves:** post-sale-US-12 - Operator collects a lot's price across more than one payment

- **GIVEN** cumulative payments of 90000 minor units against a 100000 minor-unit invoice
- **WHEN** the operator records 5000 minor units and chooses to keep the invoice open
- **THEN** the order remains Partially Paid with the real balance
- **AND** recording the exact 5000-minor-unit balance closes it as Paid without another prompt
