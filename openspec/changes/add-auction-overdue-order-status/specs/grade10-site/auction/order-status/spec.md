## Feature set

- Derived order status
  - Deadline-derived outcomes: distinguishes an overdue setup from an overdue payment

## ADDED Requirements

### Requirement: Deadline-derived order status distinguishes setup and payment overdue

An order whose address deadline has passed before an invoice is sent SHALL
derive Setup Overdue. An order whose invoice is expired SHALL derive Payment
Overdue. These names SHALL be derived from the authoritative deadline and
invoice facts, not manually stored as a second status model, and SHALL not
change the underlying address or payment records.

#### Scenario: auction-status-SC-52 - An expired invoice derives Payment Overdue
**Serves:** Derived order status - an expired invoice derives Payment Overdue

- **GIVEN** an order whose invoice status is expired
- **WHEN** its status is read
- **THEN** the derived status is Payment Overdue

#### Scenario: auction-status-SC-53 - An incomplete setup derives Setup Overdue
**Serves:** Derived order status - an incomplete setup derives Setup Overdue

- **GIVEN** an order without a sent invoice whose address deadline has passed
- **WHEN** its status is read
- **THEN** the derived status is Setup Overdue
