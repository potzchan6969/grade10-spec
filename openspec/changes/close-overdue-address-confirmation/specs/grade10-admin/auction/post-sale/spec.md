## Feature set

- Queue
  - Two states before an invoice: Awaiting Address waits on the winner, Preparing Invoice waits on an operator and needs action
  - Overdue mark: an order whose address window has closed is marked, so a stalled order is chased rather than forgotten
  - Expired invoices: an order whose invoice has expired reads Pending Payment and is highlighted as needing action
- Quote and send
  - Operator quote: Shipping & Handling, and Insurance when added, are priced by a person for the winner's confirmed address
  - Reopening the address entrance: an operator gives a winner whose window has closed a fresh 48 hours, with a reason
  - Send opens the window: sending issues the invoice, locks the address, and starts the 7-day deadline
  - Re-quote on request: an address change after send is re-priced and reissued by an operator, who decides what happens to the deadline
- Resolving an unpaid order
  - Manual settlement: a non-card payment is recorded with its method, its reference, and proof of it
  - Cancellation: now also available before an invoice is sent, for an order the operator decides not to pursue
- Audit trail
  - Payment method on the record: every paid entry says how it was paid

## ADDED Requirements

### Requirement: An operator reopens the address entrance

An operator holding payment-processing SHALL be able to reopen the address
entrance on an auction order in Awaiting Address or Preparing Invoice whose
address window has closed:

1. Open the order and read when its address window closed and how many times
   the entrance has already been reopened.
2. Give a reason. The reason is mandatory.
3. Commit.

On commit Grade10 SHALL set the order's address-window closing time to 48
hours from the moment of the reopen, per
`grade10-site/auction/winner-order`, and SHALL write a reopened entry to the
invoice log carrying the named operator, the timestamp and the reason.

A reopen SHALL change no status: the order SHALL read Awaiting Address or
Preparing Invoice exactly as it did before, its invoice status SHALL stay
`not_issued`, and no order SHALL be suspended or cancelled by it. Grade10
SHALL place no limit on how many times one order's entrance is reopened.

Grade10 SHALL refuse a reopen when the reason is missing, when the order's
address window is still open, when the order's invoice has been sent, since
the delivery address locks at send, and when the order's invoice status is
`cancelled`, since cancellation has already returned the lot to available
stock. An operator without payment-processing SHALL see the reopen control
visible and disabled, and Grade10 SHALL refuse the same action on the server.

An operator holding payment-processing SHALL also be able to record a delivery
address on an order whose address window has closed, without reopening the
entrance, so a winner who gives their address by telephone is quoted in one
step. Recording it SHALL NOT reopen the window and SHALL NOT let the winner
write again.

#### Scenario: grade10-admin-auction-post-sale-SC-75 - A reopen gives a fresh 48 hours
**Serves:** post-sale-US-09 - Operator reopens a closed address entrance

- **GIVEN** an auction order in Awaiting Address whose address window closed
  at 2026-09-14T09:00:00Z
- **AND** an operator holding payment-processing
- **WHEN** they reopen the entrance with a reason at 2026-09-16T14:00:00Z
- **THEN** the order's address window closes at 2026-09-18T14:00:00Z
- **AND** the order still derives as Awaiting Address
- **AND** the winner can confirm a delivery address again

#### Scenario: grade10-admin-auction-post-sale-SC-76 - A reopen without a reason is refused
**Serves:** post-sale-US-09 - Operator reopens a closed address entrance

- **GIVEN** an auction order whose address window closed at 2026-09-14T09:00:00Z
- **WHEN** an operator attempts to reopen the entrance without a reason
- **THEN** Grade10 refuses it
- **AND** the address window is still closed

#### Scenario: grade10-admin-auction-post-sale-SC-77 - An operator without the grant cannot reopen
**Serves:** post-sale-US-09 - Operator reopens a closed address entrance

- **GIVEN** an operator who does not hold payment-processing
- **WHEN** they open an auction order whose address window has closed
- **THEN** the reopen control is visible and disabled
- **AND** Grade10 refuses the reopen on the server if it is attempted

#### Scenario: grade10-admin-auction-post-sale-SC-78 - A third reopen is allowed
**Serves:** post-sale-US-09 - Operator reopens a closed address entrance

- **GIVEN** an auction order whose entrance has been reopened twice and whose
  address window has closed again
- **WHEN** an operator holding payment-processing reopens it a third time with
  a reason
- **THEN** Grade10 accepts the reopen
- **AND** the address window closes 48 hours from that reopen

#### Scenario: grade10-admin-auction-post-sale-SC-79 - The reopen is on the invoice log
**Serves:** Audit trail - the reopen names who did it and why

- **GIVEN** an auction order an operator reopened with a reason
- **WHEN** an operator reads the invoice log
- **THEN** it holds a reopened entry with the named operator, its timestamp
  and that reason

#### Scenario: grade10-admin-auction-post-sale-SC-80 - Reopening an open entrance is refused
**Serves:** post-sale-US-09 - Operator reopens a closed address entrance

- **GIVEN** an auction order in Awaiting Address whose address window closes
  at 2026-09-18T14:00:00Z
- **WHEN** an operator attempts to reopen the entrance at 2026-09-17T10:00:00Z
- **THEN** Grade10 refuses it
- **AND** the address window still closes at 2026-09-18T14:00:00Z

#### Scenario: grade10-admin-auction-post-sale-SC-81 - No reopen once the invoice is sent
**Serves:** post-sale-US-09 - Operator reopens a closed address entrance

- **GIVEN** an auction order whose invoice an operator has sent
- **WHEN** an operator attempts to reopen its address entrance
- **THEN** Grade10 refuses it
- **AND** the delivery address stays locked, changeable only by a re-quote

#### Scenario: grade10-admin-auction-post-sale-SC-83 - A cancelled order refuses a reopen
**Serves:** post-sale-US-09 - Operator reopens a closed address entrance

- **GIVEN** an auction order an operator cancelled before any invoice was sent,
  whose lot has returned to available stock
- **WHEN** an operator attempts to reopen its address entrance
- **THEN** Grade10 refuses it
- **AND** the order still derives as Cancelled
- **AND** the lot stays in available stock

#### Scenario: grade10-admin-auction-post-sale-SC-84 - An operator records the address without reopening
**Serves:** post-sale-US-09 - Operator reopens a closed address entrance

- **GIVEN** an auction order in Awaiting Address whose address window closed
  at 2026-09-14T09:00:00Z
- **WHEN** an operator holding payment-processing records the delivery address
  the winner gave them by telephone
- **THEN** Grade10 accepts it
- **AND** the order derives as Preparing Invoice
- **AND** the address window is still closed, so the winner cannot change it
