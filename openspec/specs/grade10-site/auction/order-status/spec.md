# grade10-site/auction/order-status Specification

## Purpose
The auction order's state: two independently written primitives for the money
and the goods, the conditions that qualify them, and the single ordered
derivation that resolves one status a buyer and an operator both read.

## Feature set

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
fulfilment status, maintained independently of one another. There is one
invoice per lot, so one invoice status per auction order.

**Invoice status** — the state of the money.

| Status | Entry condition |
| --- | --- |
| `pending` | An invoice is issued and unpaid. A reissued invoice is `pending` |
| `paid` | Payment is received in full, whether through Stripe or recorded by an operator |
| `cancelled` | An operator cancels an unpaid invoice. Terminal |
| `refunded` | A paid invoice is subsequently refunded. Terminal |

**Fulfilment status** — the state of the goods.

| Status | Entry condition |
| --- | --- |
| `unfulfilled` | No dispatch has occurred. The value at auction order creation |
| `fulfilled` | The warehouse has dispatched the lot and a tracking number is attached |

There SHALL be no expired invoice status. An expired order is `pending` with
its payment deadline elapsed — a time condition read at derivation, not a
state anything writes. Reissuing an invoice SHALL leave invoice status
`pending` and set a new deadline; it SHALL NOT introduce a further status.

#### Scenario: auction-status-SC-01 - A new auction order starts pending and unfulfilled

- **WHEN** a lot closes with a winner and Grade10 creates the auction order
- **THEN** its invoice status is `pending`
- **AND** its fulfilment status is `unfulfilled`

#### Scenario: auction-status-SC-02 - Expiry writes no status

- **GIVEN** an auction order whose invoice status is `pending`
- **WHEN** its payment deadline passes with no payment received
- **THEN** its invoice status is still `pending`
- **AND** no stored status field has been changed

#### Scenario: auction-status-SC-03 - A reissue keeps the invoice pending

- **GIVEN** an expired auction order whose invoice status is `pending`
- **WHEN** an operator reissues the invoice
- **THEN** the invoice status is still `pending`
- **AND** the payment deadline is the new one the reissue set

### Requirement: Two supplementary conditions qualify the primitives

Grade10 SHALL read these two conditions from data it already holds and SHALL
NOT store either as a status enum.

| Condition | Source |
| --- | --- |
| `deadline_elapsed` | The current time is later than the auction order's payment deadline |
| `delivery_confirmed` | The carrier has confirmed delivery and delivery proof is recorded |

`delivery_confirmed` SHALL be settable only on an auction order whose
fulfilment status is `fulfilled`. Delivery is a confirmation event on an
already-dispatched order rather than a third fulfilment status, because the
warehouse reports dispatch and the carrier reports delivery — two parties
reporting two events.

#### Scenario: auction-status-SC-04 - Delivery cannot be confirmed before dispatch
**Serves:** Writable primitives - delivery cannot be confirmed before dispatch

- **GIVEN** an auction order whose fulfilment status is `unfulfilled`
- **WHEN** a delivery confirmation is received for it
- **THEN** Grade10 refuses it
- **AND** `delivery_confirmed` remains false

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
| 6 | `pending` | `unfulfilled` | `deadline_elapsed` is true | **Expired** |
| 7 | `pending` | `unfulfilled` | `deadline_elapsed` is false | **Pending Payment** |

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

#### Scenario: auction-status-SC-06 - The same order past its deadline is Expired

- **GIVEN** that same auction order
- **WHEN** its payment deadline passes and its order status is read again
- **THEN** it is Expired
- **AND** neither status field was written

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

### Requirement: Invalid combinations are refused at write time

Grade10 SHALL reject these combinations when they are written, not merely
resolve them at derivation.

| Invoice status | Fulfilment status | Why it is refused |
| --- | --- | --- |
| `pending` | `fulfilled` | A lot must never be dispatched before it is paid for |
| `cancelled` | `fulfilled` | An order that shipped cannot be cancelled — it is refunded instead |

The dispatch action SHALL assert that invoice status is `paid` before it may
set fulfilment status to `fulfilled`. That assertion SHALL live in the
system, not in a warehouse operating procedure.

#### Scenario: auction-status-SC-11 - Dispatch before payment is refused
**Serves:** Guards - dispatch before payment is refused

- **GIVEN** an auction order whose invoice status is `pending`
- **WHEN** the warehouse records a dispatch against it
- **THEN** Grade10 refuses it
- **AND** the fulfilment status remains `unfulfilled`

#### Scenario: auction-status-SC-12 - A shipped order cannot be cancelled
**Serves:** Guards - a shipped order cannot be cancelled

- **GIVEN** an auction order whose invoice status is `paid` and fulfilment
  status is `fulfilled`
- **WHEN** an operator attempts to cancel its invoice
- **THEN** Grade10 refuses it
- **AND** the invoice status remains `paid`

### Requirement: Permitted transitions

Grade10 SHALL allow only these transitions and SHALL refuse every other.

| Field | From | To | Trigger |
| --- | --- | --- | --- |
| Invoice status | `pending` | `paid` | Stripe payment confirmed, or an operator commits a manual settlement |
| Invoice status | `pending` | `cancelled` | An operator cancels an unpaid invoice; the lot reopens |
| Invoice status | `paid` | `refunded` | A refund is completed. Refund mechanics are not specified at MVP |
| Fulfilment status | `unfulfilled` | `fulfilled` | The warehouse dispatches, with invoice status already `paid` |
| `delivery_confirmed` | false | true | The carrier confirms delivery, with fulfilment status already `fulfilled` |

#### Scenario: auction-status-SC-13 - A paid invoice cannot return to pending
**Serves:** Guards - a paid invoice cannot return to pending

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** any caller attempts to set it to `pending`
- **THEN** Grade10 refuses the write
- **AND** the invoice status is still `paid`

#### Scenario: auction-status-SC-14 - A cancelled invoice is terminal
**Serves:** Guards - a cancelled invoice is terminal

- **GIVEN** an auction order whose invoice status is `cancelled`
- **WHEN** an operator attempts to record payment against it
- **THEN** Grade10 refuses it
- **AND** the invoice status is still `cancelled`

### Requirement: Auction order status is independent of store order status

The statuses in this capability SHALL apply to auction orders alone. Grade10
SHALL NOT merge them with, alias them to, or map them onto the badges in
`grade10-site/store/order-status`. A label name the two sets share SHALL NOT
imply shared meaning, and no surface SHALL derive one from the other.

#### Scenario: auction-status-SC-15 - A shared label name carries no shared meaning
**Serves:** Independence from the store - a shared label name carries no shared meaning

- **GIVEN** an auction order derived as Processing and a store order badged
  `processing`
- **WHEN** either is read
- **THEN** each is resolved by its own capability's derivation
- **AND** neither is computed from the other's status values
