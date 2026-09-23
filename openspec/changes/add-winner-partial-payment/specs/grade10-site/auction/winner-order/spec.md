## Feature set

- Settlement
  - Operator-collected balance: keeps a partially paid invoice out of winner self-service
- Records the winner keeps
  - Payment receipts: lists every partial payment on the existing receipt row
- Payment deadline
  - Closed after partial payment: removes the self-service deadline once collection starts

## ADDED Requirements

### Requirement: Winner Order shows a locked partially paid record

When an operator has recorded money but has not closed the invoice, Winner
Order SHALL show Partially Paid as a locked state with Contact Us and a receipt
link for each payment in the existing receipt row, oldest first. It SHALL show
no running balance. It SHALL hide Pay, address changes, invoice reissue and
cancellation, and SHALL show no further payment deadline.

#### Scenario: winner-order-SC-156 - The partially paid order is locked
**Serves:** winner-order-US-12 - Winner sees partial collection without a second order

- **GIVEN** an order with one partial payment and money still due
- **WHEN** the winner opens Winner Order
- **THEN** it reads Partially Paid
- **AND** it offers Contact Us and shows no running balance
- **AND** it shows a separate receipt link for each recorded payment, oldest first
- **AND** it shows no Pay, reissue, address change or cancel action
