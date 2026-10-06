# grade10-site/auction/order-status Specification

## Feature set

- Supplementary conditions
  - Address window open: a write gate read from the persisted address deadline and the order's own facts, outside the status derivation and never a status
- Derived order status
  - Setup Overdue past the address deadline: an unconfirmed order whose address deadline has passed reads Setup Overdue, and a confirmed one keeps Preparing Invoice
- Guards
  - No winner address after the deadline: the winner's address write is refused until an operator reopens the form or records the address

## ADDED Requirements

### Requirement: The address deadline gates the winner's address write

Grade10 SHALL persist the order's `address_deadline_at`. It is the authoritative
address deadline `address_deadline_passed` is read from, per "Supplementary
conditions qualify the primitives". Grade10 SHALL also derive one write gate,
`address_window_open`, from that timestamp, the invoice status and those
order facts, and SHALL NOT store it as a status enum.

| Condition | Source |
| --- | --- |
| `address_window_open` | The persisted `address_deadline_at` is in the future, the invoice is still `not_issued`, no delivery address is confirmed, and the order is not cancelled and has no cancellation requested |

`address_window_open` gates what the winner may write and SHALL NOT be a
condition of the order-status derivation, which reads `address_deadline_passed`.
While it is false Grade10 SHALL refuse a delivery-address write from the
winner, per `grade10-site/auction/winner-order`. An unconfirmed `not_issued`
order whose `address_deadline_passed` is true SHALL derive as Setup Overdue; a
confirmed address SHALL derive as Preparing Invoice, per "Order status is
derived, never written".

An operator's reopen or recorded address, per "An operator reopens the address
form" in `grade10-admin/auction/post-sale`, acts on these conditions only. A
reopen SHALL make `address_window_open` true again. A recorded address SHALL set
`address_confirmed` true and SHALL leave `address_window_open` false. Neither
SHALL write a status; the derived order status SHALL be re-evaluated from the
order's facts.

`address_window_open` SHALL be read only while the invoice status is
`not_issued`. Sending the invoice locks the delivery address, per
`grade10-site/auction/winner-order`, and Grade10 SHALL NOT read the condition
afterwards.

<!-- trace:scenario id=g10.auction-order-status.SC-g4b rev=1 -->
#### Scenario: auction-status-SC-30 - The address window is derived from its persisted deadline
**Serves:** Supplementary conditions - address window open

- **GIVEN** an auction order whose persisted `address_deadline_at` is
  2026-09-14T09:00:00Z and whose address form has not been reopened
- **WHEN** `address_window_open` is read at 2026-09-14T08:59:00Z and again at
  2026-09-14T09:01:00Z
- **THEN** it is true at the first reading and false at the second
- **AND** no `address_window_open` status enum was written between the two readings

<!-- trace:scenario id=g10.auction-order-status.SC-cgu rev=1 -->
#### Scenario: auction-status-SC-31 - A passed address deadline derives Setup Overdue
**Serves:** Derived order status - Setup Overdue past the address deadline

- **GIVEN** an auction order with invoice status `not_issued`, fulfilment
  status `unfulfilled`, `address_confirmed` false and `address_deadline_passed`
  true
- **WHEN** its order status is read
- **THEN** it is Setup Overdue

<!-- trace:scenario id=g10.auction-order-status.SC-nin rev=1 -->
#### Scenario: auction-status-SC-32 - A passed address deadline keeps Preparing Invoice
**Serves:** Derived order status - Setup Overdue past the address deadline

- **GIVEN** an auction order with invoice status `not_issued`, fulfilment
  status `unfulfilled`, `address_confirmed` true and `address_deadline_passed`
  true
- **WHEN** its order status is read
- **THEN** it is Preparing Invoice

<!-- trace:scenario id=g10.auction-order-status.SC-9bm rev=1 -->
#### Scenario: auction-status-SC-33 - A passed address deadline refuses the winner's address write
**Serves:** Guards - no winner address after the deadline

- **GIVEN** an unconfirmed auction order in Setup Overdue with invoice status
  `not_issued` whose `address_window_open` is false
- **WHEN** the winner submits a delivery address for it
- **THEN** Grade10 refuses the write
- **AND** the order's `address_confirmed` and delivery address are unchanged
- **AND** its derived order status is unchanged

<!-- trace:scenario id=g10.auction-order-status.SC-soi rev=1 -->
#### Scenario: auction-status-SC-34 - A reopened window accepts the write again
**Serves:** Guards - no winner address after the deadline

- **GIVEN** an unconfirmed auction order in Setup Overdue with invoice status
  `not_issued` whose `address_window_open` is false
- **WHEN** an operator reopens the address form and the winner then
  submits a delivery address
- **THEN** Grade10 accepts the write
- **AND** `address_confirmed` is true
- **AND** the order derives as Preparing Invoice

<!-- trace:scenario id=g10.auction-order-status.SC-kki rev=1 -->
#### Scenario: auction-status-SC-35 - A recorded address leaves the address window closed
**Serves:** Supplementary conditions - address window open

- **GIVEN** an unconfirmed auction order in Setup Overdue whose invoice status
  is `not_issued` and whose `address_window_open` is false
- **WHEN** an operator records a delivery address on it, per "An operator
  reopens the address form" in `grade10-admin/auction/post-sale`
- **THEN** `address_confirmed` is true and `address_window_open` is still false
- **AND** the order derives as Preparing Invoice
