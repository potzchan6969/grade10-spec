## Feature set

- Content ownership
  - Status column copy: names the mixed standing and order-state column plainly

## ADDED Requirements

### Requirement: The auction-record surface renders application-owned status copy

The shared auction-record surface SHALL expose the Status column label and
row status copy supplied by the application. It SHALL not infer whether a row
is Setup Overdue or Payment Overdue, and SHALL preserve the supplied View order
action.

#### Scenario: shared-ui-auction-record-SC-16 - The mixed column is named Status
**Serves:** Content ownership - the mixed column is named Status

- **WHEN** the application supplies Status and either overdue label
- **THEN** the component renders the supplied column and row copy
- **AND** it does not invent another status label
