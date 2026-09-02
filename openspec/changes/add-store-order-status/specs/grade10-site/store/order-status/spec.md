## Purpose

How a Grade10 Store order's Shopify payment, fulfilment, return, and order facts
resolve to exactly one customer-facing status badge and an optional secondary
note, so that every surface showing a collector where their order stands derives
the same answer from the same facts.

## Feature set

- Status inputs
  - Named vocabulary: Accept the four Shopify facts and treat anything else as indeterminate.
- Badge resolution
  - Ordered precedence: Resolve every combination to one of five badges, never blank.
- Secondary note
  - Confirmed combinations only: Emit a note identifier for a clarified edge case, never display copy.
- Status meaning
  - Conclusion, not delivery: Completed reports an archived order, not carrier confirmation.
  - Pickup withheld: Do not emit a pickup badge while the data model cannot support it.
- Surface consistency
  - One mapping: Every surface showing order status derives it here.

## User journeys

### order-status-US-01: Collector reads where an order stands

**As a** collector with an order in progress,
**I want** one badge that tells me whether my order is being prepared, on its
way, finished, cancelled, or refunded,
**so that** I am never shown a blank status and never shown a status the surface
invented for a combination nobody defined.

**Accepted by:**

- `order-status-SC-01` — An unrecognised Shopify value is indeterminate
- `order-status-SC-02` — A cancelled order reports Canceled
- `order-status-SC-03` — A voided payment reports Canceled
- `order-status-SC-06` — A fulfilled and archived order reports Completed
- `order-status-SC-07` — A partially fulfilled order reports Shipped
- `order-status-SC-08` — Every remaining combination reports Processing

### order-status-US-02: Collector understands a refund or a hold

**As a** collector whose order was partly refunded or put on hold,
**I want** a note explaining what happened to the part of my order that changed,
**so that** I do not have to contact support to learn whether my items shipped.

**Accepted by:**

- `order-status-SC-04` — A refund outranks fulfilment progress
- `order-status-SC-05` — A held order carrying a partial refund stays Processing
- `order-status-SC-09` — A confirmed combination carries its note
- `order-status-SC-10` — An unconfirmed combination carries no note
- `order-status-SC-11` — The mapping emits no display copy

### order-status-US-03: Collector sees one answer everywhere

**As a** collector who checks an order in more than one place,
**I want** order history and order detail to agree,
**so that** I do not have to decide which surface is telling the truth.

**Accepted by:**

- `order-status-SC-12` — Completed does not assert delivery
- `order-status-SC-13` — Pickup is never emitted in this phase
- `order-status-SC-14` — Two surfaces report one order identically

## ADDED Requirements

### Requirement: Order status reads a named vocabulary of Shopify facts

Order status SHALL be derived from exactly four facts about an order, and from
no other input:

| Fact | Accepted values |
| --- | --- |
| Order state | `open`, `closed`, `cancelled` |
| Payment state | `pending`, `authorized`, `partially_paid`, `paid`, `partially_refunded`, `refunded`, `voided`, `expired`, `unknown` |
| Fulfilment state | `unfulfilled`, `partially_fulfilled`, `fulfilled`, `in_progress`, `on_hold`, `scheduled`, `open`, `pending_fulfillment`, `restocked`, `request_declined` |
| Return state | `returned`, or absent |

An absent fulfilment state SHALL be treated as `unfulfilled`; the two SHALL
resolve to the same badge and the same note in every case.

A payment state the Store cannot determine SHALL be reported as `unknown`. Any
value outside the accepted set for its fact SHALL be treated as `unknown` for
payment, or as `unfulfilled` for fulfilment, and SHALL NOT prevent a badge from
resolving.

The mapping SHALL NOT read carrier tracking, delivery estimates, line-item
quantities, monetary amounts, or elapsed time.

#### Scenario: order-status-SC-01 - An unrecognised Shopify value is indeterminate

- **GIVEN** an order whose payment state is a value outside the accepted set
- **WHEN** its order status is resolved
- **THEN** the payment state is treated as `unknown`
- **AND** a badge resolves
- **AND** no error is reported to the collector

### Requirement: One badge resolves by ordered precedence

Order status SHALL resolve to exactly one of five badges — `processing`,
`shipped`, `completed`, `canceled`, `refunded` — by evaluating these rules in
order and taking the first that matches:

| # | Condition | Badge |
| --- | --- | --- |
| 1 | Order state is `cancelled` | `canceled` |
| 2 | Payment state is `voided` | `canceled` |
| 3 | Payment state is `refunded` or `partially_refunded`, **and** fulfilment state is neither `on_hold` nor `scheduled` | `refunded` |
| 4 | Fulfilment state is `fulfilled` **and** order state is `closed` | `completed` |
| 5 | Fulfilment state is `fulfilled` or `partially_fulfilled` | `shipped` |
| 6 | Otherwise | `processing` |

Every combination of the accepted vocabulary SHALL resolve to a badge. The
mapping SHALL NOT return an empty, absent, or error status for any combination.

Rule 3 SHALL outrank rules 4 and 5, so that money returning to a collector is
reported ahead of fulfilment progress. Rule 3's exclusion of `on_hold` and
`scheduled` SHALL keep an order that is still in progress reported as
`processing`, even when part of it has been refunded.

#### Scenario: order-status-SC-02 - A cancelled order reports Canceled

- **GIVEN** an order whose order state is `cancelled`
- **WHEN** its order status is resolved
- **THEN** the badge is `canceled`
- **AND** the badge is `canceled` for every payment and fulfilment state

#### Scenario: order-status-SC-03 - A voided payment reports Canceled

- **GIVEN** an order whose order state is `open` and whose payment state is `voided`
- **WHEN** its order status is resolved
- **THEN** the badge is `canceled`
- **AND** the badge is not `processing`

#### Scenario: order-status-SC-04 - A refund outranks fulfilment progress

- **GIVEN** an order whose payment state is `partially_refunded` and whose fulfilment state is `fulfilled`
- **WHEN** its order status is resolved
- **THEN** the badge is `refunded`
- **AND** the badge is neither `shipped` nor `completed`

#### Scenario: order-status-SC-05 - A held order carrying a partial refund stays Processing

- **GIVEN** an order whose order state is `open`, whose fulfilment state is `on_hold`, and whose payment state is `partially_refunded`
- **WHEN** its order status is resolved
- **THEN** the badge is `processing`
- **AND** the badge is not `refunded`

#### Scenario: order-status-SC-06 - A fulfilled and archived order reports Completed

- **GIVEN** an order whose order state is `closed`, fulfilment state is `fulfilled`, and payment state is `paid`
- **WHEN** its order status is resolved
- **THEN** the badge is `completed`

#### Scenario: order-status-SC-07 - A partially fulfilled order reports Shipped

- **GIVEN** an order whose order state is `open`, fulfilment state is `partially_fulfilled`, and payment state is `paid`
- **WHEN** its order status is resolved
- **THEN** the badge is `shipped`

#### Scenario: order-status-SC-08 - Every remaining combination reports Processing

- **GIVEN** an order matching none of rules 1 through 5
- **WHEN** its order status is resolved
- **THEN** the badge is `processing`
- **AND** no combination of the accepted vocabulary resolves to an absent badge

### Requirement: A secondary note clarifies a confirmed combination

Order status MAY carry one secondary note identifier alongside its badge. The
note SHALL be resolved by evaluating these rules in order, after the badge is
known, and taking the first that matches:

| # | Condition | Note identifier |
| --- | --- | --- |
| 1 | Badge `canceled`, order state not `cancelled`, payment `voided` | `payment-voided` |
| 2 | Badge `canceled`, payment `pending`, `authorized`, `partially_paid`, or `paid` | `awaiting-refund` |
| 3 | Badge `canceled`, fulfilment `partially_fulfilled` | `cancelled-some-items-shipped` |
| 4 | Badge `refunded`, return state `returned`, payment `partially_refunded` | `items-returned-partial-refund` |
| 5 | Badge `refunded`, return state `returned` | `items-returned` |
| 6 | Badge `refunded`, payment `partially_refunded`, fulfilment `fulfilled` | `partial-refund-shipped` |
| 7 | Badge `refunded`, payment `partially_refunded`, fulfilment `partially_fulfilled` | `partial-refund-partly-shipped` |
| 8 | Badge `refunded`, payment `partially_refunded` | `partial-refund-unshipped` |
| 9 | Badge `refunded`, payment `refunded`, fulfilment `fulfilled`, order state `open` | `refunded-all-items-shipped` |
| 10 | Badge `shipped`, fulfilment `partially_fulfilled` | `some-items-shipped` |
| 11 | Badge `processing`, fulfilment `on_hold`, payment `partially_refunded` | `on-hold-partial-refund` |
| 12 | Badge `processing`, fulfilment `on_hold` | `on-hold` |
| 13 | Badge `processing`, fulfilment `scheduled` | `scheduled` |
| 14 | Badge `processing`, payment `expired` | `payment-expired` |
| 15 | Badge `processing`, payment `unknown` | `status-indeterminate` |
| 16 | Badge `processing`, payment `partially_paid` | `partial-payment-received` |
| 17 | Badge `processing`, payment `authorized` | `payment-authorized` |
| 18 | Badge `processing`, payment `pending` | `awaiting-payment` |
| — | Matching no rule above | No note |

A combination matching no rule SHALL carry its badge and no note. The mapping
SHALL NOT substitute a generic note for an unmatched combination, because a
badge resolved by rule alone is a correct answer and invented reassurance is
not.

The mapping SHALL emit a note **identifier**, never display text. Translated
copy for each identifier SHALL be answered by the message catalogs, so that a
note is not pinned to one language or one brand.

#### Scenario: order-status-SC-09 - A confirmed combination carries its note

- **GIVEN** an order whose order state is `open`, fulfilment state is `unfulfilled`, and payment state is `partially_refunded`
- **WHEN** its order status is resolved
- **THEN** the badge is `refunded`
- **AND** the note identifier is `partial-refund-unshipped`

#### Scenario: order-status-SC-10 - An unconfirmed combination carries no note

- **GIVEN** an order whose order state is `open`, fulfilment state is `in_progress`, and payment state is `paid`
- **WHEN** its order status is resolved
- **THEN** the badge is `processing`
- **AND** no note identifier is emitted

#### Scenario: order-status-SC-11 - The mapping emits no display copy

- **GIVEN** any order that resolves to a note
- **WHEN** its order status is resolved
- **THEN** the result carries a note identifier from the table above
- **AND** it carries no human-readable status or note text

### Requirement: Completed reports a concluded order, not a delivery

The `completed` badge SHALL mean that an order is fulfilled, paid, and archived.
It SHALL NOT be presented as, or derived from, carrier-confirmed delivery, and
resolving it SHALL NOT require a delivery fact.

No badge SHALL assert that a shipment reached the collector.

#### Scenario: order-status-SC-12 - Completed does not assert delivery

- **GIVEN** an order that resolves to the `completed` badge
- **WHEN** the order has no carrier delivery confirmation
- **THEN** the badge still resolves to `completed`
- **AND** no surface derives a delivered state from that badge

### Requirement: Pickup is not emitted in this phase

The mapping SHALL NOT emit a pickup badge, because Grade10 does not yet
distinguish a pickup order from a shipped order in the underlying data. An order
awaiting collection in a physical store SHALL resolve through the ordered rules
like any other order.

This requirement SHALL NOT remove a pickup rung from any shared component or
design-system contract; withholding the value is a mapping decision, not a
component change.

#### Scenario: order-status-SC-13 - Pickup is never emitted in this phase

- **GIVEN** any combination of the accepted vocabulary
- **WHEN** its order status is resolved
- **THEN** the badge is one of `processing`, `shipped`, `completed`, `canceled`, or `refunded`
- **AND** no pickup badge is emitted

### Requirement: Every surface showing order status derives it from this mapping

Every Grade10 Store surface that shows a collector the state of an order SHALL
derive its badge, and any note it displays, from this mapping. A surface SHALL
NOT define its own combination-to-badge rules, and SHALL NOT display a badge
that contradicts the one this mapping resolves for the same order.

A surface MAY choose not to display the secondary note. A surface SHALL NOT
display a note the mapping did not emit for that order.

#### Scenario: order-status-SC-14 - Two surfaces report one order identically

- **GIVEN** one order read by two surfaces that both show its status
- **WHEN** both resolve its order status from the same four facts
- **THEN** both display the same badge
- **AND** a surface that displays the note displays the identifier this mapping emitted
