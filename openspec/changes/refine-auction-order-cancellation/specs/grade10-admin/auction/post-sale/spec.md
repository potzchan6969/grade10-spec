## Feature set

- Resolving an unpaid order
  - Cancellation record: captures a reason, consequences and the lot link before a terminal cancel
  - Paid after cancel: catches money received after cancellation until finance returns it
- Queue
  - Cancellation filters: groups cancelled orders by reason and flags late payment

## ADDED Requirements

### Requirement: Cancelling an unpaid auction order is explicit and terminal

An operator SHALL choose one cancellation category and enter a note before
confirming an unpaid auction-order cancellation. The confirmation SHALL show
that the lot returns to stock, no runner-up offer is made, the winner is
emailed, the suspension is unchanged and the action cannot be undone. After
confirmation, the queue SHALL filter by cancellation category and the order
SHALL link to the lot while remaining terminal.

#### Scenario: grade10-admin-auction-post-sale-SC-150 - The cancellation dialog requires the reason and consequences
**Serves:** post-sale-US-13 - Operator cancels an order knowing what follows

- **GIVEN** an unpaid auction order
- **WHEN** the operator opens Cancel
- **THEN** a category and note are required
- **AND** the confirmation names return to stock, no runner-up, winner email, unchanged suspension and no undo

#### Scenario: grade10-admin-auction-post-sale-SC-151 - Cancellation categories filter the queue
**Serves:** post-sale-US-13 - Operator cancels an order knowing what follows

- **GIVEN** cancelled orders with different reason categories
- **WHEN** the operator filters by one category
- **THEN** only matching cancelled orders are returned

### Requirement: A late payment after cancellation is recorded without revival

If a card payment arrives after cancellation, Grade10 SHALL record it, keep
the order Cancelled, flag it Paid after cancel, and expose the flag for
Finance to return the money outside Grade10. Clearing the flag SHALL not
revive the order or change the lot's stock outcome.

#### Scenario: grade10-admin-auction-post-sale-SC-152 - A late payment is flagged without reviving the order
**Serves:** post-sale-US-14 - Operator returns money paid after a cancel

- **GIVEN** a cancelled order
- **WHEN** a card payment arrives after the cancellation
- **THEN** the payment is recorded and the order remains Cancelled
- **AND** the order is flagged Paid after cancel for Finance
