# grade10-admin/auction/post-sale Specification

## Feature set

- Queue
  - Three states before an invoice: Awaiting Setup waits on the winner, Setup
    Overdue needs operator action after the address deadline, and Preparing
    Invoice waits on an operator after a confirmed address
  - Setup Overdue derives when an unconfirmed order's persisted 48-hour address
    deadline passes. Preparing Invoice has no address-deadline state, and its
    payment Overdue timer starts only after invoice send and winner visibility
  - Expired invoices: an order whose invoice has expired reads Pending Payment and is highlighted as needing action
- Quote and send
  - Operator quote: Shipping & Handling, and Insurance when added, are priced by a person for the winner's confirmed address
  - Send opens the window: sending issues the invoice, locks the address, and starts the 7-day deadline
  - Re-quote on request: an address change after send is re-priced and reissued by an operator, who decides what happens to the deadline
- Resolving an unpaid order
  - Manual settlement: a non-card payment is recorded with its method, its reference, and proof of it
  - Settling an expired invoice: the admin portal is the only place an expired invoice is paid; a reissue is the only way back to the winner's card
  - Cancellation: now also available before an invoice is sent, for an order the operator decides not to pursue
- Audit trail
  - Payment method on the record: every paid entry says how it was paid

## ADDED Requirements

### Requirement: Only an operator settles an expired invoice

Once an invoice is `expired`, the admin portal SHALL be the only place it is
paid. An operator holding payment-processing SHALL record it manually, per
`grade10-admin/auction/post-sale`'s manual settlement. A cumulative exact
payment makes the invoice `paid` and the order derive as Preparing Shipment. A payment
whose cumulative total remains below the invoice total keeps the invoice Partially Paid with its real balance;
it starts no new self-service deadline and has no manual-settlement detour.
In either case the winner's order shows no card Pay control.

Grade10 SHALL offer the winner no way to pay an expired invoice. A card payment
Grade10 receives from the winner at or after the payment deadline SHALL be
refused, and the winner's card SHALL NOT be charged. A reissue SHALL be the only
way back to the winner's card: it returns the invoice to `pending` with a fresh
seven days, per "An operator resolves an unpaid order".

A payment started in time SHALL count. When Grade10 received the winner's card
payment before the deadline and its outcome arrives after it:

| Outcome after the deadline | Behaviour |
| --- | --- |
| Succeeds | The invoice becomes `paid`. It is never written `expired` |
| Fails | Grade10 writes `expired` when the failure arrives, and everything that follows expiry follows from then |

While that outcome is awaited, Grade10 SHALL keep the invoice `pending` and
SHALL NOT write `expired`.

An operator without payment-processing SHALL be offered no settle or reissue
control on an expired invoice, and Grade10 SHALL refuse both actions from them.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-b5v rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-85 - An operator fully settles an expired invoice
**Serves:** Resolving an unpaid order - the admin portal is the only place an expired invoice is paid

- **GIVEN** an auction order whose invoice is `expired`
- **AND** an operator holding payment-processing
- **WHEN** they record a bank transfer settlement with its reference and proof
- **THEN** Grade10 accepts it
- **AND** the invoice is `paid` and the order derives as Preparing Shipment
- **AND** the winner's order shows nothing owed and no card Pay control

<!-- trace:scenario id=g10adm.auction-post-sale.SC-v9x rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-92 - An expired shortfall remains Partially Paid
**Serves:** Resolving an unpaid order - an expired invoice retains its real balance

- **GIVEN** an auction order whose invoice is `expired` with a 100000 minor-unit balance
- **WHEN** an operator holding payment-processing records a 40000 minor-unit payment
- **THEN** the invoice is Partially Paid with 60000 minor units remaining
- **AND** no new self-service deadline is created

<!-- trace:scenario id=g10adm.auction-post-sale.SC-cdi rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-86 - A winner payment received at the deadline is refused
**Serves:** Resolving an unpaid order - the winner cannot pay an expired invoice

- **GIVEN** an auction order whose payment deadline is 2026-09-19T09:00:00Z
  and whose invoice has no card payment in progress
- **WHEN** Grade10 receives the winner's card payment at 2026-09-19T09:00:00Z
- **THEN** Grade10 refuses it
- **AND** the winner's card is not charged
- **AND** the invoice is `expired`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-d1w rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-87 - A payment started in time completes after the deadline
**Serves:** Resolving an unpaid order - a payment started in time counts

- **GIVEN** an auction order whose payment deadline is 2026-09-19T09:00:00Z
- **AND** Grade10 received the winner's card payment at 2026-09-19T08:59:30Z
- **WHEN** the payment succeeds at 2026-09-19T09:00:20Z
- **THEN** the invoice is `paid` and the order derives as Preparing Shipment
- **AND** the invoice was never `expired`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-xct rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-88 - A payment started in time that fails expires the invoice then
**Serves:** Resolving an unpaid order - a payment started in time counts

- **GIVEN** an auction order whose payment deadline is 2026-09-19T09:00:00Z
- **AND** Grade10 received the winner's card payment at 2026-09-19T08:59:30Z
- **WHEN** the payment is declined at 2026-09-19T09:00:20Z
- **THEN** the invoice is `pending` until 2026-09-19T09:00:20Z
- **AND** Grade10 writes `expired` at 2026-09-19T09:00:20Z

<!-- trace:scenario id=g10adm.auction-post-sale.SC-g73 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-89 - An operator without the grant cannot settle an expired invoice
**Serves:** Resolving an unpaid order - settling needs payment-processing

- **GIVEN** an auction order whose invoice is `expired`
- **AND** an operator who does not hold payment-processing
- **WHEN** they open the order
- **THEN** no settle or reissue control is offered
- **AND** Grade10 refuses either action if it is attempted
- **AND** the invoice is still `expired`
