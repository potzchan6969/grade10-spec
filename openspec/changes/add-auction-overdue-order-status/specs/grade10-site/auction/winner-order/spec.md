## Feature set

- Payment deadline
  - Payment Overdue surface: tells a winner that card Pay has closed
- Invoice at lot close
  - Setup Overdue surface: tells a winner that address confirmation has closed

## ADDED Requirements

### Requirement: Winner Order removes the self-service action for each overdue outcome

Winner Order SHALL show Payment Overdue when an invoice expires and SHALL
remove Pay, while retaining Contact Us and the order's payment facts. It SHALL
show Setup Overdue when address setup expires before invoice send and SHALL
remove Confirm, while retaining Contact Us and the order's address facts. The
winner SHALL not be offered a way to reopen either window.

#### Scenario: winner-order-SC-158 - Payment Overdue removes Pay
**Serves:** winner-order-US-05 - Winner misses the payment deadline

- **GIVEN** an order with an expired invoice
- **WHEN** the winner opens Winner Order
- **THEN** it reads Payment Overdue
- **AND** Pay is absent while Contact Us remains

#### Scenario: winner-order-SC-159 - Setup Overdue removes Confirm
**Serves:** winner-order-US-07 - Winner misses the address deadline

- **GIVEN** an order without a sent invoice whose address deadline passed
- **WHEN** the winner opens Winner Order
- **THEN** it reads Setup Overdue
- **AND** Confirm is absent while Contact Us remains
