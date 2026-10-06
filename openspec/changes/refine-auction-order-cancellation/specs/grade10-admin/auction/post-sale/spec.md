# grade10-admin/auction/post-sale Specification

## Feature set

- Resolving an unpaid order
  - Cancellation record: captures a reason, consequences and the lot link before a terminal cancel
  - Paid after cancel: catches money received after cancellation until finance returns it
- Queue
  - Cancellation filters: groups cancelled orders by reason and flags late payment

## ADDED Requirements

### Requirement: Cancelling an unpaid auction order is explicit and terminal

An operator SHALL choose exactly one category from Non-payment, Missed setup,
Winner asked, Lot issue, and Other, and enter a note before
confirming an unpaid auction-order cancellation. The confirmation SHALL show
that the lot returns to stock, no runner-up offer is made, the winner is
emailed, the suspension is unchanged and the action cannot be undone. After
confirmation, the queue SHALL filter by cancellation category and the order
SHALL link to the lot while remaining terminal.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-6oq rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-150 - The cancellation dialog requires the reason and consequences
**Serves:** post-sale-US-13 - Operator cancels an order knowing what follows

- **GIVEN** an unpaid auction order
- **WHEN** the operator opens Cancel
- **THEN** a category and note are required
- **AND** the confirmation names return to stock, no runner-up, winner email, unchanged suspension and no undo

<!-- trace:scenario id=g10adm.auction-post-sale.SC-1qh rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-151 - Cancellation categories filter the queue
**Serves:** post-sale-US-13 - Operator cancels an order knowing what follows

- **GIVEN** cancelled orders with different reason categories
- **WHEN** the operator filters by one category
- **THEN** only matching cancelled orders are returned

<!-- trace:scenario id=g10adm.auction-post-sale.SC-kcq rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-154 - A cancelled order links to its returned lot
**Serves:** post-sale-US-13 - Operator cancels an order knowing what follows

- **GIVEN** a cancelled auction order whose lot returned to stock
- **WHEN** the operator opens the cancelled order
- **THEN** the order links to that lot for manual relisting

### Requirement: A late payment after cancellation is recorded without revival

If a payment that counts toward the balance commits before cancellation
commits, Grade10 SHALL refuse the cancellation. A payment that counts toward
nothing SHALL NOT block it. If a card payment arrives after
cancellation commits, Grade10 SHALL record it append-only, keep the order
Cancelled, flag it Paid after cancel, and expose the flag for Finance to
return the money outside Grade10. Any operator holding `auction:payment` may
clear the flag with a required reason and Finance's return reference when
available. Grade10 SHALL record the actor and timestamp.
Clearing the flag SHALL not revive the order or change the lot's stock outcome.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-23g rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-152 - A late payment is flagged without reviving the order
**Serves:** post-sale-US-14 - Operator returns money paid after a cancel

- **GIVEN** a cancelled order
- **WHEN** a card payment arrives after the cancellation
- **THEN** the payment is recorded and the order remains Cancelled
- **AND** the order is flagged Paid after cancel for an operator with `auction:payment`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-18a rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-155 - Clearing a late-payment flag leaves the cancellation intact
**Serves:** post-sale-US-14 - Operator returns money paid after a cancel

- **GIVEN** Finance returned a payment flagged Paid after cancel
- **WHEN** an operator holding `auction:payment` clears the flag with a reason and any available return reference
- **THEN** Grade10 records the reason, any supplied reference, actor and timestamp
- **AND** the flag clears while the order stays Cancelled and the lot stays in stock

<!-- trace:scenario id=g10adm.auction-post-sale.SC-30g rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-153 - Money that counts toward the balance wins the cancellation race
**Serves:** post-sale-US-13 - Operator cancels an order knowing what follows

- **GIVEN** an unpaid order whose card payment counts toward the balance and commits before an operator's cancellation commits
- **WHEN** the operator confirms cancellation
- **THEN** Grade10 refuses cancellation
- **AND** the order follows its recorded-payment outcome

<!-- trace:scenario id=g10adm.auction-post-sale.SC-i4m rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-156 - Money that counts toward nothing does not block cancellation
**Serves:** post-sale-US-13 - Operator cancels an order knowing what follows

- **GIVEN** an unpaid order with a recorded payment that counts toward nothing
- **WHEN** the operator confirms cancellation with a category and note
- **THEN** Grade10 cancels the order and returns the lot to stock
- **AND** the recorded payment remains available for Finance to return outside Grade10
