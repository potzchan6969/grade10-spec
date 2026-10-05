# grade10-site/auction/order-status Specification

## Feature set

- Writable primitives
  - Invoice status gains `not_issued`: an order exists from lot close, before any invoice has been sent
  - Invoice status gains `expired`: Grade10 writes it when the deadline passes unpaid, so expiry is a recorded fact rather than a time read
- Supplementary conditions
  - Address confirmation and the persisted address deadline are separate facts:
    `address_window_open` is derived from `address_deadline_at`, invoice status
    and current order facts; an operator action never writes a status directly
  - Address window open: a further condition, read from the order's own facts, which gates what the winner may write rather than what the order reads as
- Derived order status
  - Awaiting Setup, Setup Overdue and Preparing Invoice: the states before an invoice, shared by winner and operator alike
  - Setup Overdue: names an unconfirmed address whose persisted deadline has passed
  - No Expired order status: an order whose invoice has expired still reads Pending Payment; winner card pay stops; operator reissue, manual settlement, or cancel remain
- Guards
  - No dispatch and no send out of order: an order with no invoice cannot ship, and no invoice is sent without a confirmed address
  - No winner address after the deadline: the winner's write is refused until an operator reopens the address form

## ADDED Requirements

### Requirement: The address deadline gates the winner's address write

Grade10 SHALL persist the order's `address_deadline_at` and derive one further
condition, `address_window_open`, from that timestamp, invoice status and the
current order facts. Grade10 SHALL NOT store `address_window_open` as a status
enum.

| Condition | Source |
| --- | --- |
| `address_window_open` | The persisted `address_deadline_at` is in the future, the invoice is still `not_issued`, and the current order facts permit a winner write |

`address_window_open` gates what the winner may write. While it is false
Grade10 SHALL refuse a delivery-address write from the winner, per
`grade10-site/auction/winner-order`. An unconfirmed `not_issued` order whose
persisted address deadline has passed SHALL derive as Setup Overdue; a
confirmed address SHALL still derive as Preparing Invoice.

An operator SHALL be able to record a delivery address on an auction order
whose `address_window_open` is false. Doing so SHALL set `address_confirmed`
true, SHALL leave `address_window_open` false, and SHALL NOT let the winner
write again. An operator reopening an unconfirmed Setup Overdue order with
invoice status `not_issued` SHALL make `address_window_open` true again. It
SHALL NOT write a status directly; the derived order status SHALL be
re-evaluated from the reopened order facts.

`address_window_open` SHALL be read only while the invoice status is
`not_issued`. Sending the invoice locks the delivery address, per
`grade10-site/auction/winner-order`, and Grade10 SHALL NOT read the condition
afterwards.

#### Scenario: auction-status-SC-30 - The address window is derived from its persisted deadline
**Serves:** Supplementary conditions - the address deadline is read from the order's own facts

- **GIVEN** an auction order whose persisted `address_deadline_at` is
  2026-09-14T09:00:00Z and whose address form has not been reopened
- **WHEN** `address_window_open` is read at 2026-09-14T08:59:00Z and again at
  2026-09-14T09:01:00Z
- **THEN** it is true at the first reading and false at the second
- **AND** no `address_window_open` status enum was written between the two readings

#### Scenario: auction-status-SC-31 - A passed address deadline derives Setup Overdue
**Serves:** Derived order status - a passed address deadline derives Setup Overdue

- **GIVEN** an auction order with invoice status `not_issued`, fulfilment
  status `unfulfilled`, `address_confirmed` false and `address_window_open`
  false
- **WHEN** its order status is read
- **THEN** it is Setup Overdue

#### Scenario: auction-status-SC-32 - A passed address deadline keeps Preparing Invoice
**Serves:** Derived order status - a passed address deadline keeps its status

- **GIVEN** an auction order with invoice status `not_issued`, fulfilment
  status `unfulfilled`, `address_confirmed` true and `address_window_open`
  false
- **WHEN** its order status is read
- **THEN** it is Preparing Invoice

#### Scenario: auction-status-SC-33 - A passed address deadline refuses the winner's address write
**Serves:** Guards - no address on a passed address deadline

- **GIVEN** an unconfirmed auction order in Setup Overdue with invoice status
  `not_issued` whose `address_window_open` is false
- **WHEN** the winner submits a delivery address for it
- **THEN** Grade10 refuses the write
- **AND** the order's `address_confirmed` and delivery address are unchanged
- **AND** its derived order status is unchanged

#### Scenario: auction-status-SC-34 - A reopened window accepts the write again
**Serves:** Guards - no address on a passed address deadline

- **GIVEN** an unconfirmed auction order in Setup Overdue with invoice status
  `not_issued` whose `address_window_open` is false
- **WHEN** an operator reopens the address form and the winner then
  submits a delivery address
- **THEN** Grade10 accepts the write
- **AND** `address_confirmed` is true
- **AND** the order derives as Preparing Invoice

#### Scenario: auction-status-SC-35 - An operator may record the address on a passed address deadline
**Serves:** Guards - no address on a passed address deadline

- **GIVEN** an auction order whose `address_window_open` is false
- **WHEN** an operator records a delivery address on it without reopening the
  address form
- **THEN** Grade10 accepts the write
- **AND** `address_window_open` is still false
- **AND** the order derives as Preparing Invoice
