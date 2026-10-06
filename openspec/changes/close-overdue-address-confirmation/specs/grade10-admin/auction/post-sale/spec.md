# grade10-admin/auction/post-sale Specification

## Feature set

- Resolving an unpaid order
  - Settling an expired invoice: the admin portal is the only place an expired invoice is paid; a reissue is the only way back to the winner's card
  - Expired shortfall: a payment short of the balance keeps the invoice Partially Paid with its real balance and no new self-service deadline
  - Winner cannot pay expired: a card payment Grade10 receives at or after the deadline is refused and not charged
  - Started in time counts: a card payment received before the deadline completes after it, and one that fails, times out or is abandoned writes `expired` when its session ends

## ADDED Requirements

### Requirement: Only an operator settles an expired invoice

Once an invoice is `expired`, the admin portal SHALL be the only place it is
paid. An operator holding payment-processing SHALL record it manually, per
"Manual settlement records the method and its proof". A cumulative exact
payment makes the invoice `paid` and the order derive as Preparing Shipment. A payment
whose cumulative total remains below the invoice total keeps the invoice Partially Paid with its real balance,
and updating it to Paid below 90% of the invoice total is refused, per
"Closing tolerance is explicit and preserves payments"; from 90% the operator
may close it as Paid or keep it Partially Paid. A payment starts no new
self-service deadline and has no manual-settlement detour.
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
| Fails, times out or is abandoned | Grade10 writes `expired` when the session ends, and everything that follows expiry follows from then |

While the card session is open, Grade10 SHALL keep the invoice `pending`,
SHALL NOT write `expired`, and SHALL NOT offer the winner Pay Now. A session
that ends unpaid SHALL count as a failed outcome: the invoice SHALL NOT stay
`pending` once the session is over, and Pay Now SHALL stay closed.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-b5v rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-85 - An operator fully settles an expired invoice
**Serves:** Resolving an unpaid order - settling an expired invoice

- **GIVEN** an auction order whose invoice is `expired`
- **AND** an operator holding payment-processing
- **WHEN** they record a bank transfer settlement with its reference and proof
- **THEN** Grade10 accepts it
- **AND** the invoice is `paid` and the order derives as Preparing Shipment
- **AND** the winner's order shows nothing owed and no card Pay control

<!-- trace:scenario id=g10adm.auction-post-sale.SC-v9x rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-92 - An expired shortfall remains Partially Paid
**Serves:** Resolving an unpaid order - expired shortfall

- **GIVEN** an auction order whose invoice is `expired` with a 100000 minor-unit balance
- **WHEN** an operator holding payment-processing records a 40000 minor-unit payment
- **THEN** the invoice is Partially Paid with 60000 minor units remaining
- **AND** no new self-service deadline or close-as-paid choice is created, because 40000 minor units is below the 90% closing tolerance

<!-- trace:scenario id=g10adm.auction-post-sale.SC-cdi rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-86 - A winner payment received at the deadline is refused
**Serves:** Resolving an unpaid order - winner cannot pay expired

- **GIVEN** an auction order whose payment deadline is 2026-09-19T09:00:00Z
  and whose invoice has no card payment in progress
- **WHEN** Grade10 receives the winner's card payment at 2026-09-19T09:00:00Z
- **THEN** Grade10 refuses it
- **AND** the winner's card is not charged
- **AND** the invoice is `expired`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-d1w rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-87 - A payment started in time completes after the deadline
**Serves:** Resolving an unpaid order - started in time counts

- **GIVEN** an auction order whose payment deadline is 2026-09-19T09:00:00Z
- **AND** Grade10 received the winner's card payment at 2026-09-19T08:59:30Z
- **WHEN** the payment succeeds at 2026-09-19T09:00:20Z
- **THEN** the invoice is `paid` and the order derives as Preparing Shipment
- **AND** the invoice was never `expired`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-xct rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-88 - A payment started in time that fails expires the invoice then
**Serves:** Resolving an unpaid order - started in time counts

- **GIVEN** an auction order whose payment deadline is 2026-09-19T09:00:00Z
- **AND** Grade10 received the winner's card payment at 2026-09-19T08:59:30Z
- **WHEN** the payment is declined at 2026-09-19T09:00:20Z
- **THEN** the invoice is `pending` until 2026-09-19T09:00:20Z
- **AND** Grade10 writes `expired` at 2026-09-19T09:00:20Z

<!-- trace:scenario id=g10adm.auction-post-sale.SC-gof rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-93 - A card session that ends unpaid after the deadline expires the invoice then
**Serves:** Resolving an unpaid order - started in time counts

- **GIVEN** an auction order whose payment deadline is 2026-09-19T09:00:00Z
- **AND** Grade10 received the winner's card payment at 2026-09-19T08:59:30Z
- **WHEN** the card session times out at 2026-09-19T09:30:30Z
- **THEN** the invoice is `pending` with no Pay Now offered until 2026-09-19T09:30:30Z
- **AND** Grade10 writes `expired` at 2026-09-19T09:30:30Z
- **AND** the order reads Payment Overdue with Contact Us and Pay Now stays closed
- **AND** a session the winner abandons at that time reads the same
