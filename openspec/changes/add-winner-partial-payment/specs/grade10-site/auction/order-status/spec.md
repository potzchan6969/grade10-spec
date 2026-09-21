## Feature set

- Writable primitives
  - Partial payment state: records that money has arrived while the invoice remains open
- Derived order status
  - Partially Paid: exposes an operator-collected balance that is not yet fully settled
- Guards
  - Self-service closure: stops winner payment, reissue and cancellation after money is recorded

## ADDED Requirements

### Requirement: Recorded money derives Partially Paid and closes self-service

An auction order with at least one recorded payment and an unpaid balance
SHALL derive Partially Paid. Partially Paid SHALL suppress the winner's
self-service payment, invoice reissue and cancellation actions, and SHALL
not carry a payment deadline. The status SHALL remain until the operator
closes the invoice as Paid, including after confirming an overpayment, or
records a refund.

#### Scenario: auction-status-SC-49 - A recorded payment derives Partially Paid
**Serves:** Derived order status - a recorded payment derives Partially Paid

- **GIVEN** an invoice with one recorded payment and money still due
- **WHEN** an order-status surface reads it
- **THEN** the derived status is Partially Paid

#### Scenario: auction-status-SC-50 - Partially Paid has no self-service deadline
**Serves:** Guards - Partially Paid has no self-service deadline

- **GIVEN** a Partially Paid order
- **WHEN** the winner opens Winner Order
- **THEN** Pay, invoice reissue and cancellation are unavailable
- **AND** no payment deadline is shown
