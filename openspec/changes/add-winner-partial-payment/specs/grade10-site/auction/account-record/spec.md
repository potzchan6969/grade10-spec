## Feature set

- After a close
  - Partially Paid row: tells a winner that an operator is collecting the invoice

## ADDED Requirements

### Requirement: My Auctions keeps a partially paid Won row linked to the order

The My Auctions account record SHALL keep a partially paid auction in the Won
list, label its order state Partially Paid, show the winning lot and amount,
and open the same Winner Order when the winner selects View order. It SHALL
not relabel the row as a new bid standing.

#### Scenario: grade10-site-auction-account-record-SC-62 - A partially paid Won row opens Winner Order
**Serves:** grade10-site-auction-account-record-US-08 - Winner revisits a partially paid order

- **GIVEN** a winner whose auction order is Partially Paid
- **WHEN** they open My Auctions and select the Won row
- **THEN** the row is labelled Partially Paid
- **AND** View order opens that order's Winner Order
