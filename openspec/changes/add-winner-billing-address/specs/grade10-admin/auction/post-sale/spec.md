## Purpose

Post-sale operators can see, complete and protect the billing address needed
before a winner's invoice is sent.

## Feature set

- **Billing address on the quote**
  - The quote shows Bill To beside Ship To
  - Both addresses come from the order snapshot
- **Missing billing address guard**
  - Send refuses an order with no billing address and names the missing fact
  - The operator can add it before sending with the existing reasoned edit
- **Phone-record parity**
  - Recording an address by phone asks for billing too
  - Same as delivery address is selected by default

## ADDED Requirements

### Requirement: An invoice cannot be sent without a billing address

The post-sale quote and send flow keep billing and delivery addresses
separate.

**Quote** — The quote SHALL show Bill To beside Ship To from the order
snapshot.

**Send guard** — Sending SHALL be refused when the order has no billing
address, and the refusal SHALL name the missing billing address. An operator
with payment-processing SHALL be able to add the billing address with the
existing reasoned edit before sending.

**Phone record** — Recording an address by phone SHALL ask for billing too,
with Same as delivery address selected by default.

#### Scenario: post-sale-SC-11 - Send names a missing billing address
**Serves:** post-sale-US-11 - Operator adds a missing billing address before sending

- **GIVEN** an order with a delivery address and no billing address
- **WHEN** an operator tries to send its invoice
- **THEN** sending is refused
- **AND** the refusal names the missing billing address
- **AND** no invoice is sent

#### Scenario: post-sale-SC-12 - The operator adds billing before send
**Serves:** post-sale-US-11 - Operator adds a missing billing address before sending

- **GIVEN** an order with a delivery address and no billing address
- **WHEN** an operator adds billing with a reason and records the order by phone
- **THEN** the phone record asks for billing with Same as delivery address selected
- **AND** the quote shows Bill To and Ship To
- **AND** the operator can send the invoice after the billing address is recorded
