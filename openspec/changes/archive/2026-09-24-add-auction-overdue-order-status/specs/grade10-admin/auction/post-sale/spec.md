## Feature set

- Queue
  - Overdue outcomes: names setup and payment deadlines after self-service closes

## ADDED Requirements

### Requirement: The post-sale queue names the two deadline outcomes

The auction post-sale queue SHALL expose Setup Overdue when the address
deadline has passed before an invoice is sent, and Payment Overdue when the
invoice is expired. Each SHALL be a filterable outcome with its own visual
label. The row SHALL retain the winner, lot, amount and action context needed
for an operator to contact the winner or resolve the order.

#### Scenario: grade10-admin-auction-post-sale-SC-148 - The queue uses the two overdue outcomes
**Serves:** post-sale-US-15 - Operator filters Setup Overdue and Payment Overdue

- **GIVEN** one order past its setup deadline and one expired invoice
- **WHEN** the operator filters the queue by each overdue outcome
- **THEN** Setup Overdue and Payment Overdue return the matching orders
- **AND** the labels are distinct

#### Scenario: grade10-admin-auction-post-sale-SC-149 - Overdue outcomes do not erase the action context
**Serves:** post-sale-US-15 - Operator filters Setup Overdue and Payment Overdue

- **GIVEN** an overdue order with a winner, lot and outstanding amount
- **WHEN** an operator opens the queue row
- **THEN** those facts remain visible
- **AND** the row offers the existing contact or resolution path rather than a new self-service action
