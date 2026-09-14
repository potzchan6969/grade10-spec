## Feature set

- Writable primitives
  - Invoice status gains `not_issued`: an order exists from lot close, before any invoice has been sent
  - Invoice status gains `expired`: Grade10 writes it when the deadline passes unpaid, so expiry is a recorded fact rather than a time read
- Supplementary conditions
  - Address confirmed replaces deadline elapsed: the derivation reads whether the winner has confirmed an address; the deadline is carried by the invoice status
- Derived order status
  - Awaiting Address and Preparing Invoice: the two states before an invoice, shared by winner and operator alike
  - No Expired order status: an order whose invoice has expired still reads Pending Payment, and stays payable
- Guards
  - No dispatch and no send out of order: an order with no invoice cannot ship, and no invoice is sent without a confirmed address

## REMOVED Requirements

### Requirement: Two supplementary conditions qualify the primitives

**Reason**: The derivation now reads whether the order has a confirmed
delivery address, and no longer reads whether the deadline has elapsed —
expiry is an invoice status — so the requirement's table no longer holds.

**Migration**: Replaced by "Supplementary conditions qualify the primitives".
Its scenario retires; "Delivery cannot be confirmed before dispatch" carries
the same refusal under the new requirement.

## ADDED Requirements

### Requirement: Supplementary conditions qualify the primitives

Grade10 SHALL read these two conditions from data it already holds and
SHALL NOT store either as a status enum.

| Condition | Source |
| --- | --- |
| `address_confirmed` | The winner has confirmed a delivery address on the auction order |
| `delivery_confirmed` | The carrier has confirmed delivery and delivery proof is recorded |

Whether the payment deadline has passed SHALL NOT be a condition of the
derivation; invoice status `expired` carries it.
`delivery_confirmed` SHALL be settable only on an auction order whose
fulfilment status is `fulfilled`. Delivery is a confirmation event on an
already-dispatched order rather than a third fulfilment status, because the
warehouse reports dispatch and the carrier reports delivery — two parties
reporting two events.

#### Scenario: auction-status-SC-17 - Delivery cannot be confirmed before dispatch

- **GIVEN** an auction order whose fulfilment status is `unfulfilled`
- **WHEN** a delivery confirmation is received for it
- **THEN** Grade10 refuses it
- **AND** `delivery_confirmed` remains false
## MODIFIED Requirements

### Requirement: An auction order carries two writable status fields

Each auction order SHALL carry exactly one invoice status and exactly one
fulfilment status, maintained independently of one another. There is one
invoice per lot, so one invoice status per auction order.

**Invoice status** — the state of the money.

| Status | Entry condition |
| --- | --- |
| `not_issued` | No invoice has been sent. The value at auction order creation |
| `pending` | An operator has sent the invoice and it is unpaid. A reissued invoice is `pending` |
| `expired` | The payment deadline passed with the invoice unpaid. Written by Grade10 at the deadline. Still payable |
| `paid` | Payment is received in full, whether by the winner's card or recorded by an operator |
| `cancelled` | An operator cancels an order that is unpaid. Terminal |
| `refunded` | A paid invoice is subsequently refunded. Terminal |

**Fulfilment status** — the state of the goods.

| Status | Entry condition |
| --- | --- |
| `unfulfilled` | No dispatch has occurred. The value at auction order creation |
| `fulfilled` | The warehouse has dispatched the lot and a tracking number is attached |

Grade10 SHALL write `expired` at the moment the payment deadline passes with
the invoice still `pending`. An expired invoice SHALL remain payable, by the
winner's card or an operator's manual settlement. Reissuing an expired invoice
SHALL return it to `pending` with a new deadline.

#### Scenario: auction-status-SC-01 - A new auction order starts not issued and unfulfilled

- **WHEN** a lot closes with a winner and Grade10 creates the auction order
- **THEN** its invoice status is `not_issued`
- **AND** its fulfilment status is `unfulfilled`

#### Scenario: auction-status-SC-02 - Expiry writes an expired invoice status

- **GIVEN** an auction order whose invoice is `pending` with a payment
  deadline of 2026-09-19T09:00:00Z
- **WHEN** that deadline passes with no payment received
- **THEN** Grade10 sets the invoice status to `expired`
- **AND** the fulfilment status is still `unfulfilled`

#### Scenario: auction-status-SC-03 - A reissue keeps the invoice pending

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** an operator reissues the invoice
- **THEN** the invoice status is `pending`
- **AND** the payment deadline is the new one the reissue set

### Requirement: Order status is derived, never written

Grade10 SHALL compute order status from the two status fields and the two
supplementary conditions, evaluating the rules below **in order** and taking
the first match.

| # | Invoice status | Fulfilment status | Condition | Order status |
| --- | --- | --- | --- | --- |
| 1 | `refunded` | any | — | **Refunded** |
| 2 | `cancelled` | any | — | **Cancelled** |
| 3 | `paid` | `fulfilled` | `delivery_confirmed` is true | **Delivered** |
| 4 | `paid` | `fulfilled` | `delivery_confirmed` is false | **Shipped** |
| 5 | `paid` | `unfulfilled` | — | **Processing** |
| 6 | `expired` | `unfulfilled` | — | **Pending Payment** |
| 7 | `pending` | `unfulfilled` | — | **Pending Payment** |
| 8 | `not_issued` | `unfulfilled` | `address_confirmed` is true | **Preparing Invoice** |
| 9 | `not_issued` | `unfulfilled` | `address_confirmed` is false | **Awaiting Address** |

Grade10 SHALL compute order status at read time, or maintain it as a
projection whose sole writer is this derivation. No other path SHALL set
order status. Reporting on money owed SHALL read invoice status directly
rather than inferring it from order status.

Rules 1 and 2 precede fulfilment because a terminal financial outcome
overrides where the goods are: a refunded order that already shipped is
Refunded.

#### Scenario: auction-status-SC-05 - An unpaid order inside its deadline is Pending Payment

- **GIVEN** an auction order with invoice status `pending`, fulfilment status
  `unfulfilled`, and a payment deadline that has not passed
- **WHEN** its order status is read
- **THEN** it is Pending Payment

#### Scenario: auction-status-SC-06 - The same order past its deadline remains Pending Payment

- **GIVEN** an auction order with invoice status `expired` and fulfilment
  status `unfulfilled`
- **WHEN** its order status is read
- **THEN** it is Pending Payment
- **AND** no order status reads Expired

#### Scenario: auction-status-SC-07 - A paid, undispatched order is Processing

- **GIVEN** an auction order with invoice status `paid` and fulfilment status
  `unfulfilled`
- **WHEN** its order status is read
- **THEN** it is Processing

#### Scenario: auction-status-SC-08 - Dispatch and delivery separate Shipped from Delivered

- **GIVEN** two auction orders, both `paid` and `fulfilled`, one with
  `delivery_confirmed` true and one with it false
- **WHEN** their order statuses are read
- **THEN** the first is Delivered and the second is Shipped

#### Scenario: auction-status-SC-09 - A refund overrides a shipped order

- **GIVEN** an auction order with invoice status `refunded` and fulfilment
  status `fulfilled`
- **WHEN** its order status is read
- **THEN** it is Refunded
- **AND** it is neither Shipped nor Delivered

#### Scenario: auction-status-SC-10 - Order status refuses a direct write

- **GIVEN** an auction order whose derived order status is Pending Payment
- **WHEN** any caller attempts to set its order status to Processing
- **THEN** Grade10 refuses the write
- **AND** the order status is still Pending Payment

#### Scenario: auction-status-SC-19 - An order with no address is Awaiting Address

- **GIVEN** an auction order with invoice status `not_issued` whose winner has
  confirmed no delivery address
- **WHEN** its order status is read
- **THEN** it is Awaiting Address

#### Scenario: auction-status-SC-20 - A confirmed address with no invoice is Preparing Invoice

- **GIVEN** an auction order with invoice status `not_issued` whose winner has
  confirmed a delivery address
- **WHEN** its order status is read
- **THEN** it is Preparing Invoice

### Requirement: Invalid combinations are refused at write time

Grade10 SHALL reject these combinations when they are written, not merely
resolve them at derivation.

| Invoice status | Fulfilment status | Why it is refused |
| --- | --- | --- |
| `not_issued` | `fulfilled` | A lot must never be dispatched before it is invoiced and paid for |
| `pending` | `fulfilled` | A lot must never be dispatched before it is paid for |
| `expired` | `fulfilled` | An expired invoice is unpaid, so the lot must not be dispatched |
| `cancelled` | `fulfilled` | An order that shipped cannot be cancelled — it is refunded instead |

The dispatch action SHALL assert that invoice status is `paid` before it may
set fulfilment status to `fulfilled`. That assertion SHALL live in the
system, not in a warehouse operating procedure.

#### Scenario: auction-status-SC-11 - Dispatch before payment is refused

- **GIVEN** an auction order whose invoice status is `pending`
- **WHEN** the warehouse records a dispatch against it
- **THEN** Grade10 refuses it
- **AND** the fulfilment status remains `unfulfilled`

#### Scenario: auction-status-SC-12 - A shipped order cannot be cancelled

- **GIVEN** an auction order whose invoice status is `paid` and fulfilment
  status is `fulfilled`
- **WHEN** an operator attempts to cancel its invoice
- **THEN** Grade10 refuses it
- **AND** the invoice status remains `paid`

#### Scenario: auction-status-SC-21 - An order with no invoice cannot be dispatched

- **GIVEN** an auction order whose invoice status is `not_issued`
- **WHEN** the warehouse records a dispatch against it
- **THEN** Grade10 refuses it
- **AND** the fulfilment status remains `unfulfilled`

### Requirement: Permitted transitions

Grade10 SHALL allow only these transitions and SHALL refuse every other.

| Field | From | To | Trigger |
| --- | --- | --- | --- |
| Invoice status | `not_issued` | `pending` | An operator sends the invoice, with `address_confirmed` already true |
| Invoice status | `not_issued` | `cancelled` | An operator cancels an order before its invoice is sent; the lot reopens |
| Invoice status | `pending` | `paid` | The winner's card payment is confirmed, or an operator commits a manual settlement |
| Invoice status | `pending` | `cancelled` | An operator cancels an unpaid invoice; the lot reopens |
| Invoice status | `pending` | `expired` | Grade10, at the payment deadline, with the invoice unpaid |
| Invoice status | `expired` | `paid` | The winner's card payment is confirmed, or an operator commits a manual settlement |
| Invoice status | `expired` | `pending` | An operator reissues the invoice with a new deadline |
| Invoice status | `expired` | `cancelled` | An operator cancels the order; the lot reopens |
| Invoice status | `paid` | `refunded` | A refund is completed. Refund mechanics are not specified at MVP |
| Fulfilment status | `unfulfilled` | `fulfilled` | The warehouse dispatches, with invoice status already `paid` |
| `delivery_confirmed` | false | true | The carrier confirms delivery, with fulfilment status already `fulfilled` |

#### Scenario: auction-status-SC-13 - A paid invoice cannot return to pending

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** any caller attempts to set it to `pending`
- **THEN** Grade10 refuses the write
- **AND** the invoice status is still `paid`

#### Scenario: auction-status-SC-14 - A cancelled invoice is terminal

- **GIVEN** an auction order whose invoice status is `cancelled`
- **WHEN** an operator attempts to record payment against it
- **THEN** Grade10 refuses it
- **AND** the invoice status is still `cancelled`

#### Scenario: auction-status-SC-22 - An invoice cannot be sent without a confirmed address

- **GIVEN** an auction order whose invoice status is `not_issued` and whose
  winner has confirmed no delivery address
- **WHEN** an operator attempts to send its invoice
- **THEN** Grade10 refuses it
- **AND** the invoice status is still `not_issued`

#### Scenario: auction-status-SC-25 - An expired invoice can still be paid

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** the winner's card payment for it is confirmed
- **THEN** the invoice status is `paid`
- **AND** the order derives as Processing
