## Feature set

- Writable primitives
  - Card money that lands after the deadline pays the invoice: an expired invoice becomes paid, flagged Paid late
- Guards
  - No card payment starts on an expired or checked invoice: the winner cannot begin one, so no card is charged
  - Landed money moves nothing elsewhere: on any status but pending, expired or paid, on a replaced invoice or at another amount, it is recorded, flagged, and counts toward nothing

## MODIFIED Requirements

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
the invoice still `pending`, and never on a `payment_verifying` invoice. An
expired invoice SHALL NOT offer or start winner card payment, and SHALL NOT
accept proof upload. An operator SHALL reissue it to `pending` with a new
deadline, settle it manually to `paid`, or cancel it.

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
| Invoice status | `expired` | `paid` | A card payment lands on it anyway, flagged Paid late; a payment started in time keeps the invoice `pending` instead |
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

Scenario `auction-status-SC-25` keeps its title with its id. The title is
historical: an expired invoice starts no card payment, and one that lands
anyway pays it, flagged Paid late.

#### Scenario: auction-status-SC-25 - An expired invoice refuses winner card payment
**Serves:** Derived order status - an expired invoice derives Payment Overdue without winner card pay

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** the winner tries to start a card payment for it
- **THEN** Grade10 starts none, and no card is charged
- **AND** the invoice status remains `expired`
- **AND** the order still derives as Payment Overdue

#### Scenario: auction-status-SC-45 - Proof moves the invoice to payment_verifying and back
**Serves:** Writable primitives - `payment_verifying` is entered on upload and left by an operator

- **GIVEN** a `pending` bank transfer invoice
- **WHEN** the winner uploads proof, and an operator later returns it
- **THEN** the invoice is `payment_verifying` after the upload
- **AND** `pending` after the return

Scenario `auction-status-SC-46` keeps its title with its id. The title is
historical: a checked invoice starts no card payment, and one that completes
anyway is recorded and moves nothing.

#### Scenario: auction-status-SC-46 - A checked invoice refuses cancel, reissue, settlement and card payment
**Serves:** Writable primitives - only confirm or return leaves `payment_verifying`

- **GIVEN** an auction order whose invoice status is `payment_verifying`
- **WHEN** an operator attempts to cancel it, reissue it or settle it manually, or the winner tries to start a card payment for it
- **THEN** Grade10 refuses each, and no card is charged
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

#### Scenario: auction-status-SC-55 - A card payment landing on an expired invoice pays it, flagged Paid late
**Serves:** Writable primitives - money that lands after the deadline pays the invoice

- **GIVEN** an auction order whose card invoice of 323225 minor units in HKD is
  `expired`
- **WHEN** a card payment of 323225 minor units in HKD for it completes
- **THEN** the invoice status is `paid`, and the payment is flagged Paid late
- **AND** the order derives as Processing

#### Scenario: auction-status-SC-56 - A card payment landing on a checked invoice moves nothing
**Serves:** Guards - money that lands while proof is checked moves no status

- **GIVEN** an auction order whose invoice is `payment_verifying`
- **WHEN** a card payment for its order total completes against it
- **THEN** Grade10 records the payment, flagged Unexpected status, and counts it
  toward nothing
- **AND** the invoice status is still `payment_verifying`, and the order still
  derives as Payment Verifying

#### Scenario: auction-status-SC-57 - A card payment on a cancelled invoice moves no status
**Serves:** Guards - money that lands on a cancelled order revives nothing

- **GIVEN** an auction order whose invoice was cancelled after the winner had
  started a card payment for its order total
- **WHEN** that card payment completes
- **THEN** Grade10 records the payment, flagged Paid after cancel, and counts it
  toward nothing
- **AND** the invoice status is still `cancelled`, and the order still derives
  as Cancelled
