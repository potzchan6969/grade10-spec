# grade10-site/auction/order-status Specification

## Purpose
The auction order's state: two independently written primitives for the money
and the goods, the conditions that qualify them, and the single ordered
derivation that resolves one status a buyer and an operator both read.

## Feature set

- Writable primitives
  - Invoice status gains `payment_verifying`: the winner uploaded payment proof and an operator has not checked it
  - Stopped deadline: while proof is checked the deadline does not run, and the time left is kept
- Derived order status
  - Payment Verifying: its own name, read by the winner and the operator alike
  - Replaced invoices hold no status: the order's invoice status is always its current invoice's

- Writable primitives
  - Invoice status: the state of the money, written by payment and by an operator
  - Fulfilment status: the state of the goods, written by dispatch alone
  - Supplementary conditions: two facts read from data Grade10 already holds, so no third enum is needed
- Derived order status
  - Ordered derivation: one rule chain whose first match wins, so precedence is explicit rather than emergent
  - Never written directly: the primitives are the only writable state, so a status cannot contradict them
- Guards
  - Refused combinations: a lot that must never dispatch before payment is stopped at write time
  - Permitted transitions: every other move between states is refused
- Independence from the store
  - Separate derivation: an auction order and a store order share label names and share no meaning

## Requirements

### Requirement: An auction order carries two writable status fields

Each auction order SHALL carry exactly one invoice status and exactly one
fulfilment status, maintained independently of one another. An auction order
has one current invoice; a reissue replaces it, per
`grade10-admin/auction/post-sale`. The order's invoice status SHALL always be
its current invoice's. A replaced invoice SHALL hold no invoice status of its
own, and SHALL NOT be written `cancelled`; Grade10 reads that it was replaced
from the chain of invoices on the order.

**Invoice status** — the state of the money.

| Status | Entry condition |
| --- | --- |
| `not_issued` | No invoice has been sent. The value at auction order creation |
| `pending` | An operator has sent the invoice and it is unpaid. A reissued invoice is `pending`, and so is an invoice whose proof an operator returned |
| `payment_verifying` | The winner uploaded payment proof on a `pending` bank transfer invoice, and an operator has not yet confirmed or returned it. The deadline is stopped |
| `expired` | The payment deadline passed with the invoice `pending`. Written by Grade10 at the deadline. Winner self-service payment ends; an operator may reissue, settle manually, or cancel |
| `paid` | Payment is received in full, whether by the winner's card, by an operator confirming the winner's proof, or recorded by an operator |
| `cancelled` | An operator cancels an order that is unpaid. Terminal |
| `refunded` | A paid invoice is subsequently refunded. Terminal |

**Fulfilment status** — the state of the goods.

| Status | Entry condition |
| --- | --- |
| `unfulfilled` | No dispatch has occurred. The value at auction order creation |
| `fulfilled` | The warehouse has dispatched the lot and a tracking number is attached |

Grade10 SHALL write `expired` at the moment the payment deadline passes with
the invoice still `pending`, and never on a `payment_verifying` invoice. An
expired invoice SHALL NOT accept winner card payment or proof upload. An
operator SHALL reissue it to `pending` with a new deadline, settle it manually
to `paid`, or cancel it.

#### Scenario: auction-status-SC-01 - A new auction order starts pending and unfulfilled
**Serves:** Writable primitives - a new auction order starts pending and unfulfilled

- **WHEN** a lot closes with a winner and Grade10 creates the auction order
- **THEN** its invoice status is `not_issued`
- **AND** its fulfilment status is `unfulfilled`

#### Scenario: auction-status-SC-02 - Expiry writes no status
**Serves:** Writable primitives - expiry writes no status

- **GIVEN** an auction order whose invoice is `pending` with a payment
  deadline of 2026-09-19T09:00:00Z
- **WHEN** that deadline passes with no payment received
- **THEN** Grade10 sets the invoice status to `expired`
- **AND** the fulfilment status is still `unfulfilled`

#### Scenario: auction-status-SC-03 - A reissue keeps the invoice pending
**Serves:** Writable primitives - a reissue keeps the invoice pending

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** an operator reissues the invoice
- **THEN** the invoice status is `pending`
- **AND** the payment deadline is the new one the reissue set

#### Scenario: auction-status-SC-42 - A replaced invoice holds no status
**Serves:** Derived order status - the order's invoice status is always its current invoice's

- **GIVEN** an auction order whose `pending` invoice an operator reissued
- **WHEN** the order's invoice status is read
- **THEN** it is the new invoice's status, `pending`
- **AND** the replaced invoice holds no invoice status and is not `cancelled`

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
| 6 | `payment_verifying` | `unfulfilled` | — | **Payment Verifying** |
| 7 | `expired` | `unfulfilled` | — | **Pending Payment** |
| 8 | `pending` | `unfulfilled` | — | **Pending Payment** |
| 9 | `not_issued` | `unfulfilled` | `address_confirmed` is true | **Preparing Invoice** |
| 10 | `not_issued` | `unfulfilled` | `address_confirmed` is false | **Awaiting Setup** |

The derived order status vocabulary SHALL be these nine names, read the same
by the winner and the operator.

Grade10 SHALL compute order status at read time, or maintain it as a
projection whose sole writer is this derivation. No other path SHALL set
order status. Reporting on money owed SHALL read invoice status directly
rather than inferring it from order status.

Rules 1 and 2 precede fulfilment because a terminal financial outcome
overrides where the goods are: a refunded order that already shipped is
Refunded.

#### Scenario: auction-status-SC-05 - An unpaid order inside its deadline is Pending Payment
**Serves:** Derived order status - an unpaid order inside its deadline is Pending Payment

- **GIVEN** an auction order with invoice status `pending`, fulfilment status
  `unfulfilled`, and a payment deadline that has not passed
- **WHEN** its order status is read
- **THEN** it is Pending Payment

#### Scenario: auction-status-SC-06 - The same order past its deadline is Expired
**Serves:** Derived order status - an expired invoice keeps Pending Payment

- **GIVEN** an auction order with invoice status `expired` and fulfilment
  status `unfulfilled`
- **WHEN** its order status is read
- **THEN** it is Pending Payment
- **AND** no order status reads Expired

#### Scenario: auction-status-SC-07 - A paid, undispatched order is Processing
**Serves:** Derived order status - a paid, undispatched order is Processing

- **GIVEN** an auction order with invoice status `paid` and fulfilment status
  `unfulfilled`
- **WHEN** its order status is read
- **THEN** it is Processing

#### Scenario: auction-status-SC-08 - Dispatch and delivery separate Shipped from Delivered
**Serves:** Derived order status - dispatch and delivery separate Shipped from Delivered

- **GIVEN** two auction orders, both `paid` and `fulfilled`, one with
  `delivery_confirmed` true and one with it false
- **WHEN** their order statuses are read
- **THEN** the first is Delivered and the second is Shipped

#### Scenario: auction-status-SC-09 - A refund overrides a shipped order
**Serves:** Derived order status - a refund overrides a shipped order

- **GIVEN** an auction order with invoice status `refunded` and fulfilment
  status `fulfilled`
- **WHEN** its order status is read
- **THEN** it is Refunded
- **AND** it is neither Shipped nor Delivered

#### Scenario: auction-status-SC-10 - Order status refuses a direct write
**Serves:** Derived order status - order status refuses a direct write

- **GIVEN** an auction order whose derived order status is Pending Payment
- **WHEN** any caller attempts to set its order status to Processing
- **THEN** Grade10 refuses the write
- **AND** the order status is still Pending Payment

#### Scenario: auction-status-SC-19 - An order with no address is Awaiting Address
**Serves:** Derived order status - an order with no address is Awaiting Setup

- **GIVEN** an auction order with invoice status `not_issued` whose winner has
  confirmed no delivery address
- **WHEN** its order status is read
- **THEN** it is Awaiting Setup

#### Scenario: auction-status-SC-20 - A confirmed address with no invoice is Preparing Invoice
**Serves:** Derived order status - a confirmed address with no invoice is Preparing Invoice

- **GIVEN** an auction order with invoice status `not_issued` whose winner has
  confirmed a delivery address
- **WHEN** its order status is read
- **THEN** it is Preparing Invoice

#### Scenario: auction-status-SC-43 - Proof waiting for an operator reads Payment Verifying
**Serves:** Derived order status - Payment Verifying has its own name

- **GIVEN** an auction order with invoice status `payment_verifying` and fulfilment status `unfulfilled`
- **WHEN** its order status is read by the winner and by an operator
- **THEN** both read Payment Verifying
- **AND** neither reads Pending Payment

### Requirement: Invalid combinations are refused at write time

Grade10 SHALL reject these combinations when they are written, not merely
resolve them at derivation.

| Invoice status | Fulfilment status | Why it is refused |
| --- | --- | --- |
| `not_issued` | `fulfilled` | A lot must never be dispatched before it is invoiced and paid for |
| `pending` | `fulfilled` | A lot must never be dispatched before it is paid for |
| `payment_verifying` | `fulfilled` | Proof that no operator has confirmed is not payment, so the lot must not be dispatched |
| `expired` | `fulfilled` | An expired invoice is unpaid, so the lot must not be dispatched |
| `cancelled` | `fulfilled` | An order that shipped cannot be cancelled — it is refunded instead |

The dispatch action SHALL assert that invoice status is `paid` before it may
set fulfilment status to `fulfilled`. That assertion SHALL live in the
system, not in a warehouse operating procedure.

#### Scenario: auction-status-SC-11 - Dispatch before payment is refused
**Serves:** Writable primitives - dispatch before payment is refused

- **GIVEN** an auction order whose invoice status is `pending`
- **WHEN** the warehouse records a dispatch against it
- **THEN** Grade10 refuses it
- **AND** the fulfilment status remains `unfulfilled`

#### Scenario: auction-status-SC-12 - A shipped order cannot be cancelled
**Serves:** Writable primitives - a shipped order cannot be cancelled

- **GIVEN** an auction order whose invoice status is `paid` and fulfilment
  status is `fulfilled`
- **WHEN** an operator attempts to cancel its invoice
- **THEN** Grade10 refuses it
- **AND** the invoice status remains `paid`

#### Scenario: auction-status-SC-21 - An order with no invoice cannot be dispatched
**Serves:** Writable primitives - an order with no invoice cannot be dispatched

- **GIVEN** an auction order whose invoice status is `not_issued`
- **WHEN** the warehouse records a dispatch against it
- **THEN** Grade10 refuses it
- **AND** the fulfilment status remains `unfulfilled`

#### Scenario: auction-status-SC-44 - Dispatch while proof is checked is refused
**Serves:** Writable primitives - proof is not payment

- **GIVEN** an auction order whose invoice status is `payment_verifying`
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
| Invoice status | `pending` | `payment_verifying` | The winner uploads payment proof on a bank transfer invoice |
| Invoice status | `pending` | `pending` | An operator reissues the invoice; the new invoice replaces it |
| Invoice status | `pending` | `cancelled` | An operator cancels an unpaid invoice; the lot reopens |
| Invoice status | `pending` | `expired` | Grade10, at the payment deadline, with the invoice unpaid |
| Invoice status | `payment_verifying` | `paid` | An operator confirms the proof |
| Invoice status | `payment_verifying` | `pending` | An operator returns the proof; the deadline restarts with the time left |
| Invoice status | `expired` | `paid` | An operator commits a manual settlement |
| Invoice status | `expired` | `pending` | An operator reissues the invoice with a new deadline |
| Invoice status | `expired` | `cancelled` | An operator cancels the order; the lot reopens |
| Invoice status | `paid` | `refunded` | A refund is completed. Refund mechanics are not specified at MVP |
| Fulfilment status | `unfulfilled` | `fulfilled` | The warehouse dispatches, with invoice status already `paid` |
| `delivery_confirmed` | false | true | The carrier confirms delivery, with fulfilment status already `fulfilled` |

A `payment_verifying` invoice SHALL leave that state only by an operator's
confirm or return. Grade10 SHALL refuse a cancel, a reissue, a manual
settlement or a card payment on it. Proof upload SHALL enter
`payment_verifying` only from `pending`.

#### Scenario: auction-status-SC-13 - A paid invoice cannot return to pending
**Serves:** Writable primitives - a paid invoice cannot return to pending

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** any caller attempts to set it to `pending`
- **THEN** Grade10 refuses the write
- **AND** the invoice status is still `paid`

#### Scenario: auction-status-SC-14 - A cancelled invoice is terminal
**Serves:** Writable primitives - a cancelled invoice is terminal

- **GIVEN** an auction order whose invoice status is `cancelled`
- **WHEN** an operator attempts to record payment against it
- **THEN** Grade10 refuses it
- **AND** the invoice status is still `cancelled`

#### Scenario: auction-status-SC-22 - An invoice cannot be sent without a confirmed address
**Serves:** Writable primitives - an invoice cannot be sent without a confirmed address

- **GIVEN** an auction order whose invoice status is `not_issued` and whose
  winner has confirmed no delivery address
- **WHEN** an operator attempts to send its invoice
- **THEN** Grade10 refuses it
- **AND** the invoice status is still `not_issued`

#### Scenario: auction-status-SC-25 - An expired invoice refuses winner card payment
**Serves:** Derived order status - an expired invoice keeps Pending Payment without winner card pay

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** the winner's card payment for it is attempted
- **THEN** Grade10 refuses the payment
- **AND** the invoice status remains `expired`
- **AND** the order still derives as Pending Payment

#### Scenario: auction-status-SC-45 - Proof moves the invoice to payment_verifying and back
**Serves:** Writable primitives - `payment_verifying` is entered on upload and left by an operator

- **GIVEN** a `pending` bank transfer invoice
- **WHEN** the winner uploads proof, and an operator later returns it
- **THEN** the invoice is `payment_verifying` after the upload
- **AND** `pending` after the return

#### Scenario: auction-status-SC-46 - A checked invoice refuses cancel, reissue, settlement and card payment
**Serves:** Writable primitives - only confirm or return leaves `payment_verifying`

- **GIVEN** an auction order whose invoice status is `payment_verifying`
- **WHEN** an operator attempts to cancel it, reissue it or settle it manually, or a card payment is attempted
- **THEN** Grade10 refuses each
- **AND** the invoice status is still `payment_verifying`

#### Scenario: auction-status-SC-47 - Confirming proof writes paid
**Serves:** Writable primitives - `payment_verifying` is left by an operator

- **GIVEN** an auction order whose invoice status is `payment_verifying` and whose fulfilment status is `unfulfilled`
- **WHEN** an operator confirms the proof
- **THEN** the invoice status is `paid`
- **AND** the order derives as Processing

#### Scenario: auction-status-SC-48 - Proof upload enters payment_verifying only from pending
**Serves:** Writable primitives - `payment_verifying` is entered on upload

- **GIVEN** auction orders whose invoice status is `not_issued`, `expired`, `paid` and `cancelled`
- **WHEN** a proof upload is recorded against each
- **THEN** Grade10 refuses each
- **AND** each invoice status is unchanged

### Requirement: Auction order status is independent of store order status

The statuses in this capability SHALL apply to auction orders alone. Grade10
SHALL NOT merge them with, alias them to, or map them onto the badges in
`grade10-site/store/order-status`. A label name the two sets share SHALL NOT
imply shared meaning, and no surface SHALL derive one from the other.

#### Scenario: auction-status-SC-15 - A shared label name carries no shared meaning
**Serves:** Independence from the store - either derivation read on its own, with no path between them

- **GIVEN** an auction order derived as Processing and a store order badged
  `processing`
- **WHEN** either is read
- **THEN** each is resolved by its own capability's derivation
- **AND** neither is computed from the other's status values

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
**Serves:** Guards - a carrier confirmation arriving against an order nobody has dispatched

- **GIVEN** an auction order whose fulfilment status is `unfulfilled`
- **WHEN** a delivery confirmation is received for it
- **THEN** Grade10 refuses it
- **AND** `delivery_confirmed` remains false

### Requirement: The deadline stops while proof is checked

While an operator checks proof the payment deadline stands still, and it runs
again from the time that was left.

**Stopped deadline** - When an invoice becomes `payment_verifying`, Grade10
SHALL record the time left, which is the payment deadline minus the moment of
upload, and SHALL stop the deadline.

**Never expired while checked** - While the invoice is `payment_verifying`,
the deadline SHALL NOT run and Grade10 SHALL NOT write `expired`, however much
time passes.

**Returned to pending** - When an operator returns the invoice to `pending`,
Grade10 SHALL set the payment deadline to the moment of return plus the
recorded time left, with no grace added.

**Confirmed paid** - When an operator confirms it to `paid`, the deadline no
longer applies.

**The two states never meet** - Because the deadline is stopped, a
`payment_verifying` invoice can never become `expired`, and an `expired`
invoice refuses proof upload, so the two states never meet.

#### Scenario: auction-status-SC-40 - A checked invoice never expires
**Serves:** Writable primitives - the deadline does not run while proof is checked

- **GIVEN** an invoice with a payment deadline of 2026-09-19T09:00:00Z that became `payment_verifying` at 2026-09-17T09:00:00Z
- **WHEN** 2026-09-25T09:00:00Z arrives with no operator action
- **THEN** the invoice status is still `payment_verifying`
- **AND** the recorded time left is 2 days

#### Scenario: auction-status-SC-41 - A return restarts the deadline with the time left
**Serves:** Writable primitives - the time left is kept across the check

- **GIVEN** an invoice that became `payment_verifying` at 2026-09-17T09:00:00Z with 2 days left
- **WHEN** an operator returns it to `pending` at 2026-09-25T09:00:00Z
- **THEN** its payment deadline is 2026-09-27T09:00:00Z
- **AND** Grade10 writes `expired` at that deadline if the invoice is still `pending`
