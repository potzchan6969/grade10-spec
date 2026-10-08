# grade10-site/auction/order-status Specification

## Purpose
The auction order's state: two independently written primitives for the money
and the goods, the conditions that qualify them, and the single ordered
derivation that resolves one status a buyer and an operator both read.

## Feature set

- Writable primitives
  - Invoice status gains `payment_verifying`: the winner uploaded payment proof and an operator has not checked it
  - Stopped deadline: while proof is checked the deadline does not run, and the time left is kept
  - Invoice status: the state of the money, written by payment and by an operator
  - Fulfilment status: the state of the goods, written by dispatch alone
  - Supplementary conditions: two facts read from data Grade10 already holds, so no third enum is needed
  - Partial payment state: records that money has arrived while the invoice remains open
  - Card money that lands after the deadline pays the invoice: an expired invoice becomes paid, flagged Paid late
- Derived order status
  - Refunded from partial collection: makes a refund terminal after any recorded payment
  - Deadline-derived outcomes: distinguishes an overdue setup from an overdue payment
  - Payment Verifying: its own name, read by the winner and the operator alike
  - Replaced invoices hold no status: the order's invoice status is always its current invoice's
  - Ordered derivation: one rule chain whose first match wins, so precedence is explicit rather than emergent
  - Never written directly: the primitives are the only writable state, so a status cannot contradict them
  - Preparing Shipment: display name for invoice `paid` and fulfilment `unfulfilled` (was Processing)
  - Partially Paid: exposes an operator-collected balance that is not yet fully settled
  - Setup Overdue past the address deadline: an unconfirmed order whose address deadline has passed reads Setup Overdue, and a confirmed one keeps Preparing Invoice
- Guards
  - Refused combinations: a lot that must never dispatch before payment is stopped at write time
  - Permitted transitions: every other move between states is refused
  - Self-service closure: stops winner payment, reissue and cancellation after money that counts toward the balance is recorded
  - No winner address after the deadline: the winner's address write is refused until an operator reopens the form or records the address
  - No card payment starts on an expired or checked invoice: the winner cannot begin one, so no card is charged
  - Landed money moves nothing elsewhere: on any status but pending, expired or paid, on a replaced invoice or at another amount, it is recorded, flagged, and counts toward nothing
- Independence from the store
  - Separate derivation: an auction order and a store order share label names and share no meaning
- Supplementary conditions
  - Address window open: a write gate read from the persisted address deadline and the order's own facts, outside the status derivation and never a status

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
| `partially_paid` | An operator recorded a payment short of the order total on a `pending` or `expired` bank transfer invoice; no deadline runs |
| `payment_verifying` | The winner uploaded payment proof on a `pending` bank transfer invoice, and an operator has not yet confirmed or returned it. The deadline is stopped |
| `expired` | The payment deadline passed with the invoice `pending`. Written by Grade10 at the deadline. Winner self-service payment ends; an operator may reissue, record a payment, or cancel |
| `paid` | Payment is received in full, whether by the winner's card, by an operator confirming the winner's proof, or recorded by an operator |
| `cancelled` | An operator cancels an order that is unpaid. Terminal |
| `refunded` | A paid invoice is subsequently refunded. Terminal |

**Fulfilment status** — the state of the goods.

| Status | Entry condition |
| --- | --- |
| `unfulfilled` | No dispatch has occurred. The value at auction order creation |
| `fulfilled` | The warehouse has dispatched the lot and a tracking number is attached |

Grade10 SHALL write `expired` at the moment the payment deadline passes with
the invoice still `pending`, and never on a `payment_verifying` invoice. A card
payment started before the deadline holds the invoice `pending` until it ends,
per `grade10-site/auction/winner-order` "The payment deadline is fixed when the
invoice is sent". An
expired invoice SHALL NOT offer or start winner card payment, and SHALL NOT
accept proof upload. An operator SHALL reissue it to `pending` with a new
deadline, settle it manually to `paid`, or cancel it.

<!-- trace:scenario id=g10.auction-order-status.SC-tc9 rev=1 -->
#### Scenario: auction-status-SC-01 - A new auction order starts pending and unfulfilled
**Serves:** Writable primitives - a new auction order starts pending and unfulfilled

- **WHEN** a lot closes with a winner and Grade10 creates the auction order
- **THEN** its invoice status is `not_issued`
- **AND** its fulfilment status is `unfulfilled`

<!-- trace:scenario id=g10.auction-order-status.SC-i18 rev=1 -->
#### Scenario: auction-status-SC-02 - Expiry writes no status
**Serves:** Writable primitives - expiry writes no status

- **GIVEN** an auction order whose invoice is `pending` with a payment
  deadline of 2026-09-19T09:00:00Z
- **WHEN** that deadline passes with no payment received
- **THEN** Grade10 sets the invoice status to `expired`
- **AND** the fulfilment status is still `unfulfilled`

<!-- trace:scenario id=g10.auction-order-status.SC-wlf rev=1 -->
#### Scenario: auction-status-SC-03 - A reissue keeps the invoice pending
**Serves:** Writable primitives - a reissue keeps the invoice pending

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** an operator reissues the invoice
- **THEN** the invoice status is `pending`
- **AND** the payment deadline is the new one the reissue set

<!-- trace:scenario id=g10.auction-order-status.SC-8qq rev=1 -->
#### Scenario: auction-status-SC-42 - A replaced invoice holds no status
**Serves:** Derived order status - the order's invoice status is always its current invoice's

- **GIVEN** an auction order whose `pending` invoice an operator reissued
- **WHEN** the order's invoice status is read
- **THEN** it is the new invoice's status, `pending`
- **AND** the replaced invoice holds no invoice status and is not `cancelled`

### Requirement: Order status is derived, never written

Grade10 SHALL compute order status from the two status fields and the three
supplementary conditions, evaluating the rules below **in order** and taking
the first match.

| # | Invoice status | Fulfilment status | Condition | Order status |
| --- | --- | --- | --- | --- |
| 1 | `refunded` | any | — | **Refunded** |
| 2 | `cancelled` | any | — | **Cancelled** |
| 3 | `paid` | `fulfilled` | `delivery_confirmed` is true | **Delivered** |
| 4 | `paid` | `fulfilled` | `delivery_confirmed` is false | **Shipped** |
| 5 | `paid` | `unfulfilled` | — | **Preparing Shipment** |
| 6 | `payment_verifying` | `unfulfilled` | — | **Payment Verifying** |
| 7 | `expired` | `unfulfilled` | — | **Payment Overdue** |
| 8 | `pending` | `unfulfilled` | — | **Pending Payment** |
| 9 | `not_issued` | `unfulfilled` | `address_confirmed` is true | **Preparing Invoice** |
| 10 | `not_issued` | `unfulfilled` | `address_confirmed` is false and `address_deadline_passed` is true | **Setup Overdue** |
| 11 | `not_issued` | `unfulfilled` | `address_confirmed` is false and `address_deadline_passed` is false | **Awaiting Setup** |

The derived order status vocabulary SHALL be these eleven names, read the same
by the winner and the operator.

Grade10 SHALL compute order status at read time, or maintain it as a
projection whose sole writer is this derivation. No other path SHALL set
order status. Reporting on money owed SHALL read invoice status directly
rather than inferring it from order status.

Rules 1 and 2 precede fulfilment because a terminal financial outcome
overrides where the goods are: a refunded order that already shipped is
Refunded.

<!-- trace:scenario id=g10.auction-order-status.SC-xlj rev=1 -->
#### Scenario: auction-status-SC-05 - An unpaid order inside its deadline is Pending Payment
**Serves:** Derived order status - an unpaid order inside its deadline is Pending Payment

- **GIVEN** an auction order with invoice status `pending`, fulfilment status
  `unfulfilled`, and a payment deadline that has not passed
- **WHEN** its order status is read
- **THEN** it is Pending Payment

<!-- trace:scenario id=g10.auction-order-status.SC-f7y rev=1 -->
#### Scenario: auction-status-SC-06 - The same order past its deadline is Payment Overdue
**Serves:** Derived order status - an expired invoice derives Payment Overdue

- **GIVEN** an auction order with invoice status `expired` and fulfilment
  status `unfulfilled`
- **WHEN** its order status is read
- **THEN** it is Payment Overdue

<!-- trace:scenario id=g10.auction-order-status.SC-aj3 rev=1 -->
#### Scenario: auction-status-SC-07 - A paid, undispatched order is Processing
**Serves:** Derived order status - a paid, undispatched order is Preparing Shipment

The scenario title is historical for its permanent trace identity. Its normative
Given, When and Then use the current Preparing Shipment vocabulary.

- **GIVEN** an auction order with invoice status `paid` and fulfilment status
  `unfulfilled`
- **WHEN** its order status is read
- **THEN** it is Preparing Shipment

<!-- trace:scenario id=g10.auction-order-status.SC-apb rev=1 -->
#### Scenario: auction-status-SC-08 - Dispatch and delivery separate Shipped from Delivered
**Serves:** Derived order status - dispatch and delivery separate Shipped from Delivered

- **GIVEN** two auction orders, both `paid` and `fulfilled`, one with
  `delivery_confirmed` true and one with it false
- **WHEN** their order statuses are read
- **THEN** the first is Delivered and the second is Shipped

<!-- trace:scenario id=g10.auction-order-status.SC-div rev=1 -->
#### Scenario: auction-status-SC-09 - A refund overrides a shipped order
**Serves:** Derived order status - a refund overrides a shipped order

- **GIVEN** an auction order with invoice status `refunded` and fulfilment
  status `fulfilled`
- **WHEN** its order status is read
- **THEN** it is Refunded
- **AND** it is neither Shipped nor Delivered

<!-- trace:scenario id=g10.auction-order-status.SC-h5p rev=1 -->
#### Scenario: auction-status-SC-10 - Order status refuses a direct write
**Serves:** Derived order status - order status refuses a direct write

- **GIVEN** an auction order whose derived order status is Pending Payment
- **WHEN** any caller attempts to set its order status to Preparing Shipment
- **THEN** Grade10 refuses the write
- **AND** the order status is still Pending Payment

<!-- trace:scenario id=g10.auction-order-status.SC-w76 rev=1 -->
#### Scenario: auction-status-SC-19 - An order with no address is Awaiting Setup
**Serves:** Derived order status - an order with no address is Awaiting Setup

- **GIVEN** an auction order with invoice status `not_issued` whose winner has
  confirmed no delivery address and whose address deadline has not passed
- **WHEN** its order status is read
- **THEN** it is Awaiting Setup

<!-- trace:scenario id=g10.auction-order-status.SC-7zj rev=1 -->
#### Scenario: auction-status-SC-20 - A confirmed address with no invoice is Preparing Invoice
**Serves:** Derived order status - a confirmed address with no invoice is Preparing Invoice

- **GIVEN** an auction order with invoice status `not_issued` whose winner has
  confirmed a delivery address
- **WHEN** its order status is read
- **THEN** it is Preparing Invoice

<!-- trace:scenario id=g10.auction-order-status.SC-12a rev=1 -->
#### Scenario: auction-status-SC-43 - Proof waiting for an operator reads Payment Verifying
**Serves:** Derived order status - Payment Verifying has its own name

- **GIVEN** an auction order with invoice status `payment_verifying` and fulfilment status `unfulfilled`
- **WHEN** its order status is read by the winner and by an operator
- **THEN** both read Payment Verifying
- **AND** neither reads Pending Payment

### Requirement: Deadline-derived order status distinguishes setup and payment overdue

An order whose address deadline has passed before an invoice is sent SHALL
derive Setup Overdue. An order whose invoice is expired SHALL derive Payment
Overdue. These names SHALL be derived from the authoritative deadline and
invoice facts, not manually stored as a second status model, and SHALL not
change the underlying address or payment records.

<!-- trace:scenario id=g10.auction-order-status.SC-agq rev=1 -->
#### Scenario: auction-status-SC-52 - An expired invoice derives Payment Overdue
**Serves:** Derived order status - an expired invoice derives Payment Overdue

- **GIVEN** an order whose invoice status is expired
- **WHEN** its status is read
- **THEN** the derived status is Payment Overdue

<!-- trace:scenario id=g10.auction-order-status.SC-kjm rev=1 -->
#### Scenario: auction-status-SC-53 - An incomplete setup derives Setup Overdue
**Serves:** Derived order status - an incomplete setup derives Setup Overdue

- **GIVEN** an order without a sent invoice whose address deadline has passed
- **WHEN** its status is read
- **THEN** the derived status is Setup Overdue

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

<!-- trace:scenario id=g10.auction-order-status.SC-y48 rev=1 -->
#### Scenario: auction-status-SC-11 - Dispatch before payment is refused
**Serves:** Writable primitives - dispatch before payment is refused

- **GIVEN** an auction order whose invoice status is `pending`
- **WHEN** the warehouse records a dispatch against it
- **THEN** Grade10 refuses it
- **AND** the fulfilment status remains `unfulfilled`

<!-- trace:scenario id=g10.auction-order-status.SC-mej rev=1 -->
#### Scenario: auction-status-SC-12 - A shipped order cannot be cancelled
**Serves:** Writable primitives - a shipped order cannot be cancelled

- **GIVEN** an auction order whose invoice status is `paid` and fulfilment
  status is `fulfilled`
- **WHEN** an operator attempts to cancel its invoice
- **THEN** Grade10 refuses it
- **AND** the invoice status remains `paid`

<!-- trace:scenario id=g10.auction-order-status.SC-sx5 rev=1 -->
#### Scenario: auction-status-SC-21 - An order with no invoice cannot be dispatched
**Serves:** Writable primitives - an order with no invoice cannot be dispatched

- **GIVEN** an auction order whose invoice status is `not_issued`
- **WHEN** the warehouse records a dispatch against it
- **THEN** Grade10 refuses it
- **AND** the fulfilment status remains `unfulfilled`

<!-- trace:scenario id=g10.auction-order-status.SC-fmg rev=1 -->
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
| Invoice status | `not_issued` | `cancelled` | An operator cancels an order before its invoice is sent. The listing stays Closed and its stock hold is released, so the item is back in stock. |
| Invoice status | `pending` | `paid` | The winner's card payment is confirmed, or an operator commits a manual settlement |
| Invoice status | `pending` | `payment_verifying` | The winner uploads payment proof on a bank transfer invoice |
| Invoice status | `pending` | `pending` | An operator reissues the invoice; the new invoice replaces it |
| Invoice status | `pending` | `expired` | Grade10, at the payment deadline, with the invoice unpaid |
| Invoice status | `pending` | `partially_paid` | An operator records a payment short of the order total on a bank transfer invoice |
| Invoice status | `payment_verifying` | `paid` | An operator confirms the proof |
| Invoice status | `payment_verifying` | `pending` | An operator returns the proof; the deadline restarts with the time left |
| Invoice status | `expired` | `paid` | An operator commits a manual settlement |
| Invoice status | `expired` | `paid` | A card payment lands on it anyway, flagged Paid late |
| Invoice status | `expired` | `pending` | An operator reissues the invoice with a new deadline |
| Invoice status | `expired` | `partially_paid` | An operator records a payment short of the order total on a bank transfer invoice |
| Invoice status | `expired` | `cancelled` | An operator cancels the order. The listing stays Closed and its stock hold is released, so the item is back in stock. |
| Invoice status | `partially_paid` | `partially_paid` | An operator records another payment short of the balance |
| Invoice status | `partially_paid` | `paid` | An operator records a payment that meets the balance, or closes the invoice within tolerance |
| Invoice status | `partially_paid` | `refunded` | A refund is recorded |
| Invoice status | `paid` | `refunded` | A refund is completed. Refund mechanics are not specified at MVP |
| Fulfilment status | `unfulfilled` | `fulfilled` | The warehouse dispatches, with invoice status already `paid` |
| `delivery_confirmed` | false | true | The carrier confirms delivery, with fulfilment status already `fulfilled` |

A `payment_verifying` invoice SHALL leave that state only by an operator's
confirm or return. Grade10 SHALL refuse a cancel, a reissue or a manual
settlement on it, and SHALL NOT start a card payment on it; a card payment
that completes anyway is recorded per "Money that lands is always recorded"
and moves nothing. Proof upload SHALL enter `payment_verifying` only from
`pending`.

Grade10 SHALL refuse a cancel on a `pending` invoice; it is reissued or left
to expire.

A card payment that completes SHALL be recorded, per "Money that lands is
always recorded" in `grade10-admin/auction/post-sale`. It SHALL move the
invoice status only when it lands on the current invoice, `pending` or
`expired`, at its order total; anywhere else it SHALL move no status.

<!-- trace:scenario id=g10.auction-order-status.SC-r6z rev=1 -->
#### Scenario: auction-status-SC-13 - A paid invoice cannot return to pending
**Serves:** Writable primitives - a paid invoice cannot return to pending

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** any caller attempts to set it to `pending`
- **THEN** Grade10 refuses the write
- **AND** the invoice status is still `paid`

<!-- trace:scenario id=g10.auction-order-status.SC-d22 rev=1 -->
#### Scenario: auction-status-SC-14 - A cancelled invoice is terminal
**Serves:** Writable primitives - a cancelled invoice is terminal

- **GIVEN** an auction order whose invoice status is `cancelled`
- **WHEN** an operator attempts to record payment against it
- **THEN** Grade10 refuses it
- **AND** the invoice status is still `cancelled`

<!-- trace:scenario id=g10.auction-order-status.SC-j9x rev=1 -->
#### Scenario: auction-status-SC-22 - An invoice cannot be sent without a confirmed address
**Serves:** Writable primitives - an invoice cannot be sent without a confirmed address

- **GIVEN** an auction order whose invoice status is `not_issued` and whose
  winner has confirmed no delivery address
- **WHEN** an operator attempts to send its invoice
- **THEN** Grade10 refuses it
- **AND** the invoice status is still `not_issued`

Scenario `auction-status-SC-25` keeps its title with its id. The title is
historical: an expired invoice starts no card payment, and one that lands
anyway pays it, flagged Paid late.

<!-- trace:scenario id=g10.auction-order-status.SC-0sk rev=1 -->
#### Scenario: auction-status-SC-25 - An expired invoice refuses winner card payment
**Serves:** Derived order status - an expired invoice derives Payment Overdue without winner card pay

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** the winner tries to start a card payment for it
- **THEN** Grade10 starts none, and no card is charged
- **AND** the invoice status remains `expired`
- **AND** the order still derives as Payment Overdue

<!-- trace:scenario id=g10.auction-order-status.SC-wt0 rev=1 -->
#### Scenario: auction-status-SC-45 - Proof moves the invoice to payment_verifying and back
**Serves:** Writable primitives - `payment_verifying` is entered on upload and left by an operator

- **GIVEN** a `pending` bank transfer invoice
- **WHEN** the winner uploads proof, and an operator later returns it
- **THEN** the invoice is `payment_verifying` after the upload
- **AND** `pending` after the return

Scenario `auction-status-SC-46` keeps its title with its id. The title is
historical: a checked invoice starts no card payment, and one that completes
anyway is recorded and moves nothing.

<!-- trace:scenario id=g10.auction-order-status.SC-er6 rev=1 -->
#### Scenario: auction-status-SC-46 - A checked invoice refuses cancel, reissue, settlement and card payment
**Serves:** Writable primitives - only confirm or return leaves `payment_verifying`

- **GIVEN** an auction order whose invoice status is `payment_verifying`
- **WHEN** an operator attempts to cancel it, reissue it or settle it manually, or the winner tries to start a card payment for it
- **THEN** Grade10 refuses each, and no card is charged
- **AND** the invoice status is still `payment_verifying`

<!-- trace:scenario id=g10.auction-order-status.SC-e4v rev=1 -->
#### Scenario: auction-status-SC-47 - Confirming proof writes paid
**Serves:** Writable primitives - `payment_verifying` is left by an operator

- **GIVEN** an auction order whose invoice status is `payment_verifying` and whose fulfilment status is `unfulfilled`
- **WHEN** an operator confirms the proof
- **THEN** the invoice status is `paid`
- **AND** the order derives as Preparing Shipment

<!-- trace:scenario id=g10.auction-order-status.SC-q1w rev=1 -->
#### Scenario: auction-status-SC-48 - Proof upload enters payment_verifying only from pending
**Serves:** Writable primitives - `payment_verifying` is entered on upload

- **GIVEN** auction orders whose invoice status is `not_issued`, `expired`, `paid` and `cancelled`
- **WHEN** a proof upload is recorded against each
- **THEN** Grade10 refuses each
- **AND** each invoice status is unchanged

<!-- trace:scenario id=g10.auction-order-status.SC-1xq rev=1 -->
#### Scenario: auction-status-SC-55 - A card payment landing on an expired invoice pays it, flagged Paid late
**Serves:** Writable primitives - money that lands after the deadline pays the invoice

- **GIVEN** an auction order whose card invoice of 323225 minor units in HKD is
  `expired`
- **WHEN** a card payment of 323225 minor units in HKD for it completes
- **THEN** the invoice status is `paid`, and the payment is flagged Paid late
- **AND** the order derives as Preparing Shipment

<!-- trace:scenario id=g10.auction-order-status.SC-wjo rev=1 -->
#### Scenario: auction-status-SC-56 - A card payment landing on a checked invoice moves nothing
**Serves:** Guards - money that lands while proof is checked moves no status

- **GIVEN** an auction order whose invoice is `payment_verifying`
- **WHEN** a card payment for its order total completes against it
- **THEN** Grade10 records the payment, flagged Unexpected status, and counts it
  toward nothing
- **AND** the invoice status is still `payment_verifying`, and the order still
  derives as Payment Verifying

<!-- trace:scenario id=g10.auction-order-status.SC-4yo rev=1 -->
#### Scenario: auction-status-SC-57 - A card payment on a cancelled invoice moves no status
**Serves:** Guards - money that lands on a cancelled order revives nothing

- **GIVEN** an auction order whose invoice was cancelled after the winner had
  started a card payment for its order total
- **WHEN** that card payment completes
- **THEN** Grade10 records the payment, flagged Paid after cancel, and counts it
  toward nothing
- **AND** the invoice status is still `cancelled`, and the order still derives
  as Cancelled

### Requirement: Auction order status is independent of store order status

The statuses in this capability SHALL apply to auction orders alone. Grade10
SHALL NOT merge them with, alias them to, or map them onto the badges in
`grade10-site/commerce/order-status`. A label name the two sets share SHALL NOT
imply shared meaning, and no surface SHALL derive one from the other.

<!-- trace:scenario id=g10.auction-order-status.SC-1o2 rev=1 -->
#### Scenario: auction-status-SC-15 - A shared label name carries no shared meaning
**Serves:** Independence from the store - either derivation read on its own, with no path between them

- **GIVEN** an auction order derived as Preparing Shipment and a store order badged
  `processing`
- **WHEN** either is read
- **THEN** each is resolved by its own capability's derivation
- **AND** neither is computed from the other's status values

### Requirement: Supplementary conditions qualify the primitives

Grade10 SHALL read these three conditions from data it already holds and
SHALL NOT store any as a status enum.

| Condition | Source |
| --- | --- |
| `address_confirmed` | The winner has confirmed a delivery address on the auction order |
| `address_deadline_passed` | The address deadline has passed while no invoice has been sent |
| `delivery_confirmed` | The carrier has confirmed delivery and delivery proof is recorded |

Whether the payment deadline has passed SHALL NOT be a separate condition of
the derivation; invoice status `expired` carries it. `address_deadline_passed`
SHALL be read from the authoritative address deadline and SHALL not be stored
as a second order status.
`delivery_confirmed` SHALL be settable only on an auction order whose
fulfilment status is `fulfilled`. Delivery is a confirmation event on an
already-dispatched order rather than a third fulfilment status, because the
warehouse reports dispatch and the carrier reports delivery — two parties
reporting two events.

<!-- trace:scenario id=g10.auction-order-status.SC-ztl rev=1 -->
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

<!-- trace:scenario id=g10.auction-order-status.SC-dq1 rev=1 -->
#### Scenario: auction-status-SC-40 - A checked invoice never expires
**Serves:** Writable primitives - the deadline does not run while proof is checked

- **GIVEN** an invoice with a payment deadline of 2026-09-19T09:00:00Z that became `payment_verifying` at 2026-09-17T09:00:00Z
- **WHEN** 2026-09-25T09:00:00Z arrives with no operator action
- **THEN** the invoice status is still `payment_verifying`
- **AND** the recorded time left is 2 days

<!-- trace:scenario id=g10.auction-order-status.SC-x14 rev=1 -->
#### Scenario: auction-status-SC-41 - A return restarts the deadline with the time left
**Serves:** Writable primitives - the time left is kept across the check

- **GIVEN** an invoice that became `payment_verifying` at 2026-09-17T09:00:00Z with 2 days left
- **WHEN** an operator returns it to `pending` at 2026-09-25T09:00:00Z
- **THEN** its payment deadline is 2026-09-27T09:00:00Z
- **AND** Grade10 writes `expired` at that deadline if the invoice is still `pending`

### Requirement: Refunded is a terminal auction order status

An auction order with a recorded refund SHALL derive status Refunded whether
the cumulative payment was full or partial. The status SHALL be terminal and
SHALL not be replaced by a later payment or shipment event.

<!-- trace:scenario id=g10.auction-order-status.SC-yon rev=1 -->
#### Scenario: auction-status-SC-51 - A refund derives Refunded
**Serves:** Derived order status - a refund derives Refunded

- **GIVEN** an order with a recorded refund after partial collection
- **WHEN** any order-status surface reads it
- **THEN** the derived status is Refunded
- **AND** a later payment event does not change that status

<!-- trace:scenario id=g10.auction-order-status.SC-0dn rev=1 -->
#### Scenario: auction-status-SC-54 - An overpayment does not derive Refunded
**Serves:** Derived order status - an overpayment keeps the order status

- **GIVEN** an order with a payment above its invoice total and a returned
  difference
- **WHEN** any order-status surface reads it
- **THEN** the derived status remains the status before the overpayment return
- **AND** it is not Refunded

### Requirement: Recorded money derives Partially Paid and closes self-service

An auction order with at least one recorded payment that counts toward the
balance, and an unpaid balance, SHALL derive Partially Paid. A payment that
counts toward nothing SHALL move no status. Partially Paid SHALL suppress the
winner's self-service payment, invoice reissue and cancellation actions, and
SHALL not carry a payment deadline. The status SHALL remain until the operator
closes the invoice as Paid, including after confirming an overpayment, or
records a refund.

<!-- trace:scenario id=g10.auction-order-status.SC-4ke rev=2 -->
#### Scenario: auction-status-SC-49 - A recorded payment derives Partially Paid
**Serves:** Derived order status - a recorded payment derives Partially Paid

- **GIVEN** an invoice with one recorded payment that counts toward the balance, and money still due
- **WHEN** an order-status surface reads it
- **THEN** the derived status is Partially Paid

<!-- trace:scenario id=g10.auction-order-status.SC-e1r rev=1 -->
#### Scenario: auction-status-SC-50 - Partially Paid has no self-service deadline
**Serves:** Guards - Partially Paid has no self-service deadline

- **GIVEN** a Partially Paid order
- **WHEN** the winner opens Winner Order
- **THEN** Pay, invoice reissue and cancellation are unavailable
- **AND** no payment deadline is shown

<!-- trace:scenario id=g10.auction-order-status.SC-3ko rev=1 -->
#### Scenario: auction-status-SC-58 - Money that counts toward nothing moves no status
**Serves:** Derived order status - a payment that counts toward nothing moves no status

- **GIVEN** an order in Pending Payment whose only recorded payment counts toward nothing
- **WHEN** an order-status surface reads it
- **THEN** the derived status is Pending Payment, not Partially Paid

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
`not_issued`. An invoice is sent only on a confirmed address, which locks on
confirm, per `grade10-site/auction/winner-order`, and Grade10 SHALL NOT read
the condition after the send.

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
