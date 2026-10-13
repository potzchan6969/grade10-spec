# grade10-site/auction/winner-order Specification

## Feature set

- Records the winner keeps
  - Cancelled order notice: explains the terminal date, retained lot and winning bid
  - Contact Us: gives the winner the only next action, with the `order cancelled` ready email

## MODIFIED Requirements

### Requirement: The ready email names the invoice or the lot and the reason

The ready email's subject and body identify the order so support can open it
without a follow-up.

**Subject** - For `order cancelled` the subject SHALL be
`Auction lot {lot title}: order cancelled`, invoice or not. Otherwise, when
the order's current invoice id exists, the subject SHALL be
`Auction order {invoice id}: {reason}`. When no invoice id exists (including
setup overdue before send), the subject SHALL be
`Auction lot {lot title}: {reason}`.

**Reason** - On Winner Order the reason fragment SHALL be one of
`setup overdue`, `payment overdue`, `partial payment`, or `order cancelled`.
A Cancelled Winner Order is locked, so it offers Contact Us under "Contact Us
opens a copy-first ready email" with the `order cancelled` reason. The
operator's cancellation category and note SHALL NOT appear in the subject or
body.

**Body** - Message SHALL greet Grade10, say the winner needs help with this
auction order, name the lot title, name the status label for the reason
(`Setup overdue`, `Payment overdue`, `Partially paid`, or `Cancelled`), and
leave space for the winner's question. When an invoice id exists and the reason
is not setup overdue, the body SHALL name that invoice id; a Cancelled order
that never had an invoice names none.

**Partial payment** - When the reason is partial payment, the body MAY list
receipt ids and MUST NOT name the remaining balance. When no receipt id
exists yet, the body SHALL list none.

<!-- trace:scenario id=g10.auction-winner-order.SC-g9z rev=1 -->
#### Scenario: winner-order-SC-164 - Setup overdue names the lot, not an invoice
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose setup deadline has passed with no invoice
  issued, for lot title "Charizard Base Set PSA 10"
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction lot Charizard Base Set PSA 10: setup overdue`
- **AND** Message names that lot title and status Setup overdue
- **AND** Message names no invoice id

<!-- trace:scenario id=g10.auction-winner-order.SC-30l rev=2 -->
#### Scenario: winner-order-SC-165 - Payment overdue names the invoice
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose payment deadline has passed unpaid, with
  current invoice id `IN-LK42301` and lot title "Charizard Base Set PSA 10"
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42301: payment overdue`
- **AND** Message names that invoice id, that lot title, and status Payment
  overdue

<!-- trace:scenario id=g10.auction-winner-order.SC-kjq rev=2 -->
#### Scenario: winner-order-SC-166 - Partial payment may list receipts and never the balance
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** a partially paid auction order with current invoice id
  `IN-LK42301`, lot title "Charizard Base Set PSA 10", and receipt ids
  `RC-LK42301P1` and `RC-LK42301P2`
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42301: partial payment`
- **AND** Message may list those receipt ids
- **AND** Message names no remaining balance

<!-- trace:scenario id=g10.auction-winner-order.SC-hx5 rev=2 -->
#### Scenario: winner-order-SC-168 - A reissued invoice uses the current invoice id
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose payment deadline has passed unpaid after a
  reissue, with current invoice id `IN-LK42302` and a replaced invoice id
  `IN-LK42301`
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42302: payment overdue`
- **AND** Subject does not name `IN-LK42301`

<!-- trace:scenario id=g10.auction-winner-order.SC-e1w rev=1 -->
#### Scenario: winner-order-SC-275 - Contact Us on a cancelled order names the lot and the cancellation
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** a cancelled auction order for lot title "Charizard Base Set PSA 10", with current invoice id `IN-LK42301` and an operator cancellation category and note
- **WHEN** the winner chooses Contact Us
- **THEN** Subject is `Auction lot Charizard Base Set PSA 10: order cancelled`
- **AND** Message names that lot title, that invoice id and status Cancelled
- **AND** neither Subject nor Message names the cancellation category or note

## ADDED Requirements

### Requirement: Winner Order explains cancellation without exposing the reason

For a cancelled auction order, Winner Order SHALL show the cancellation date as a
day-only date in the viewer's local zone, the lot and winning bid, and Contact Us as the only next action. It SHALL not show
the operator's category or note, SHALL not show a stepper or payment action,
and SHALL preserve the order's retained facts.

<!-- trace:scenario id=g10.auction-winner-order.SC-1fb rev=2 -->
#### Scenario: winner-order-SC-143 - Cancelled keeps the lot and winning bid visible
**Serves:** winner-order-US-13 - Winner learns their order was cancelled

- **GIVEN** a cancelled auction order with a lot and winning bid
- **WHEN** the winner opens Winner Order
- **THEN** it shows Cancelled on the recorded day in the viewer's local zone, the lot and winning bid
- **AND** it shows Contact Us only, without the internal reason
