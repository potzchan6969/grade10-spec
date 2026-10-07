## Purpose

How a Grade10 Store order's Shopify payment, fulfilment, return, and order facts
resolve to exactly one customer-facing status badge and an optional secondary
note, so that every surface showing a collector where their order stands derives
the same answer from the same facts.

## Feature set

- Status inputs
  - Named vocabulary: Read four Shopify facts, return state for the note only, and default anything else.
- Badge resolution
  - Ordered precedence: Resolve every combination to one of five badges, never blank.
- Secondary note
  - Confirmed combinations only: Emit a note identifier for a clarified edge case, never display copy.
- Status meaning
  - Conclusion, not delivery: Completed reports a fulfilled, paid, archived order, not carrier confirmation.
  - Pickup withheld: Do not emit a pickup badge while the data model cannot support it.
- Surface consistency
  - One mapping: Every surface showing order status derives it here.
  - The note: Show only a note the mapping emitted.
  - Freshness: Paid in full, refunded or canceled within 5 minutes; any other change to an open order within the hour.

## ADDED Requirements

### Requirement: Order status reads a named vocabulary of Shopify facts

Four Shopify facts about an order decide its status: three decide the badge,
and return state only the note. A value outside a fact's set reads as its
default.

**Named vocabulary** - Order status SHALL be derived from exactly these four
facts about an order, read from these Shopify sources, and from no other
input. The badge SHALL read only order state, payment state and fulfilment
state; return state SHALL feed the note alone.

| Fact | Shopify source | Accepted values | Default | Feeds |
| --- | --- | --- | --- | --- |
| Order state | `cancelledAt`, `closedAt` | `canceled` when `cancelledAt` is set; otherwise `closed` when `closedAt` is set; otherwise `open` | `open` | Badge and note |
| Payment state | `displayFinancialStatus` | `pending`, `authorized`, `partially_paid`, `paid`, `partially_refunded`, `refunded`, `voided`, `expired`, `unknown` | `unknown` | Badge and note |
| Fulfilment state | `displayFulfillmentStatus` | `unfulfilled`, `partially_fulfilled`, `fulfilled`, `in_progress`, `on_hold`, `scheduled`, `open`, `pending_fulfillment`, `restocked`, `request_declined` | `unfulfilled` | Badge and note |
| Return state | `returnStatus` | `returned` when the value is `RETURNED`; every other value is absent | absent | Note |

**Defaults** - A fact that is absent, or carries a value outside its accepted
set, SHALL be read as its default, and SHALL resolve to the same badge and the
same note as that default in every case. A payment state the Store cannot
determine SHALL be read as `unknown`. Shopify values SHALL be compared without
regard to letter case. No value of any fact SHALL prevent a badge from
resolving.

**Not read** - The mapping SHALL NOT read carrier tracking, delivery
estimates, line-item quantities, monetary amounts, or elapsed time.

<!-- trace:scenario id=g10.commerce-order-status.SC-qux rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-01 - An unrecognised Shopify value is indeterminate
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order whose payment state is a value outside the accepted set
- **WHEN** its order status is resolved
- **THEN** the payment state is treated as `unknown`
- **AND** a badge resolves
- **AND** no error is reported to the collector

<!-- trace:scenario id=g10.commerce-order-status.SC-w9f rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-15 - Absent facts read as their defaults
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order with no order, payment, fulfilment or return fact
- **WHEN** its order status is resolved
- **THEN** the badge is `processing`
- **AND** the note identifier is `status-indeterminate`

<!-- trace:scenario id=g10.commerce-order-status.SC-7vs rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-16 - Letter case does not change the result
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order whose `closedAt` is set, payment state is `PAID`, and fulfilment state is `FULFILLED`
- **WHEN** its order status is resolved
- **THEN** the badge is `completed`
- **AND** it is the badge the same order resolves to with `paid` and `fulfilled`

<!-- trace:scenario id=g10.commerce-order-status.SC-unk rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-17 - A carrier status does not move the badge
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order whose order state is `open`, payment state is `paid`, and fulfilment state is `unfulfilled`
- **AND** a shipment on it whose carrier status reads delivered
- **WHEN** its order status is resolved
- **THEN** the badge is `processing`

<!-- trace:scenario id=g10.commerce-order-status.SC-a9h rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-18 - A return with no refund does not move the badge
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order whose order state is `closed`, fulfilment state is `fulfilled`, payment state is `paid`, and return state is `returned`
- **WHEN** its order status is resolved
- **THEN** the badge is `completed`
- **AND** no note identifier is emitted

<!-- trace:scenario id=g10.commerce-order-status.SC-19w rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-19 - A till sale reads through the same rules
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** a counter sale and a web order with the same order, payment, fulfilment and return facts
- **WHEN** the order status of each is resolved
- **THEN** both resolve to the same badge
- **AND** both resolve to the same note identifier, or both to none

### Requirement: One badge resolves by ordered precedence

Every order gets one of five badges, taken from the first rule that matches.

**Ordered precedence** - Order status SHALL resolve to exactly one of five
badges — `processing`, `shipped`, `completed`, `canceled`, `refunded` — by
evaluating these rules in order and taking the first that matches:

| # | Condition | Badge |
| --- | --- | --- |
| 1 | Order state is `canceled` | `canceled` |
| 2 | Payment state is `voided` | `canceled` |
| 3 | Payment state is `refunded` or `partially_refunded`, **and** fulfilment state is neither `on_hold` nor `scheduled` | `refunded` |
| 4 | Fulfilment state is `fulfilled`, payment state is `paid`, **and** order state is `closed` | `completed` |
| 5 | Fulfilment state is `fulfilled` or `partially_fulfilled` | `shipped` |
| 6 | Otherwise | `processing` |

**Never blank** - Every combination of the accepted vocabulary SHALL resolve
to a badge. The mapping SHALL NOT return an empty, absent, or error status for
any combination.

**Refund first** - Rule 3 SHALL outrank rules 4 and 5, so that money returning
to a collector is reported ahead of fulfilment progress. Rule 3's exclusion of
`on_hold` and `scheduled` SHALL keep an order that is still in progress
reported as `processing`, even when part of it has been refunded.

<!-- trace:scenario id=g10.commerce-order-status.SC-ln4 rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-02 - A canceled order reports Canceled
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order whose order state is `canceled`
- **WHEN** its order status is resolved
- **THEN** the badge is `canceled`
- **AND** the badge is `canceled` for every payment and fulfilment state

<!-- trace:scenario id=g10.commerce-order-status.SC-5n2 rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-03 - A voided payment reports Canceled
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order whose order state is `open` and whose payment state is `voided`
- **WHEN** its order status is resolved
- **THEN** the badge is `canceled`
- **AND** the badge is not `processing`

<!-- trace:scenario id=g10.commerce-order-status.SC-o4y rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-04 - A refund outranks fulfilment progress
**Serves:** grade10-site-commerce-order-status-US-02 - Collector understands a refund or a hold

- **GIVEN** an order whose payment state is `partially_refunded` and whose fulfilment state is `fulfilled`
- **WHEN** its order status is resolved
- **THEN** the badge is `refunded`
- **AND** the badge is neither `shipped` nor `completed`

<!-- trace:scenario id=g10.commerce-order-status.SC-0st rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-05 - A held order carrying a partial refund stays Processing
**Serves:** grade10-site-commerce-order-status-US-02 - Collector understands a refund or a hold

- **GIVEN** an order whose order state is `open`, whose fulfilment state is `on_hold`, and whose payment state is `partially_refunded`
- **WHEN** its order status is resolved
- **THEN** the badge is `processing`
- **AND** the badge is not `refunded`

<!-- trace:scenario id=g10.commerce-order-status.SC-r3l rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-06 - A fulfilled and archived order reports Completed
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order whose order state is `closed`, fulfilment state is `fulfilled`, and payment state is `paid`
- **WHEN** its order status is resolved
- **THEN** the badge is `completed`

<!-- trace:scenario id=g10.commerce-order-status.SC-oyu rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-07 - A partially fulfilled order reports Shipped
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order whose order state is `open`, fulfilment state is `partially_fulfilled`, and payment state is `paid`
- **WHEN** its order status is resolved
- **THEN** the badge is `shipped`

<!-- trace:scenario id=g10.commerce-order-status.SC-3ua rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-08 - Every remaining combination reports Processing
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order matching none of rules 1 through 5
- **WHEN** its order status is resolved
- **THEN** the badge is `processing`
- **AND** no combination of the accepted vocabulary resolves to an absent badge

<!-- trace:scenario id=g10.commerce-order-status.SC-nmr rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-20 - A fulfilled order not yet archived reports Shipped
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order whose order state is `open`, fulfilment state is `fulfilled`, and payment state is `paid`
- **WHEN** its order status is resolved
- **THEN** the badge is `shipped`

<!-- trace:scenario id=g10.commerce-order-status.SC-hpt rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-21 - A fulfilled and archived order not yet paid in full reports Shipped
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order whose order state is `closed`, fulfilment state is `fulfilled`, and payment state is `partially_paid`
- **WHEN** its order status is resolved
- **THEN** the badge is `shipped`
- **AND** the badge is not `completed`

<!-- trace:scenario id=g10.commerce-order-status.SC-9sm rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-22 - A partly fulfilled order reports Shipped once paid and archived
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order whose order state is `closed`, fulfilment state is `partially_fulfilled`, and payment state is `paid`
- **WHEN** its order status is resolved
- **THEN** the badge is `shipped`
- **AND** the badge is not `completed`

<!-- trace:scenario id=g10.commerce-order-status.SC-1b0 rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-23 - A scheduled order carrying a refund stays Processing
**Serves:** grade10-site-commerce-order-status-US-02 - Collector understands a refund or a hold

- **GIVEN** an order whose order state is `open`, fulfilment state is `scheduled`, and payment state is `refunded`
- **WHEN** its order status is resolved
- **THEN** the badge is `processing`
- **AND** the note identifier is `scheduled`

### Requirement: A secondary note clarifies a confirmed combination

A badge can carry one note identifier, chosen by the first rule that matches,
and the message catalogs hold its words.

**Confirmed combinations only** - Order status MAY carry one secondary note
identifier alongside its badge. The note SHALL be resolved by evaluating these
rules in order, after the badge is known, and taking the first that matches:

| # | Condition | Note identifier |
| --- | --- | --- |
| 1 | Badge `canceled`, order state not `canceled`, payment `voided` | `payment-voided` |
| 2 | Badge `canceled`, payment `partially_paid` or `paid` | `awaiting-refund` |
| 3 | Badge `canceled`, fulfilment `partially_fulfilled` | `canceled-some-items-shipped` |
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

**No note** - A combination matching no rule SHALL carry its badge and no
note. The mapping SHALL NOT substitute a generic note for an unmatched
combination, because a badge resolved by rule alone is a correct answer and
invented reassurance is not.

**Identifier, not copy** - The mapping SHALL emit a note **identifier**, never
display text. A surface that displays a note SHALL take its words from the
message catalogs, keyed by that identifier, so that a note is not pinned to
one language or one brand.

<!-- trace:scenario id=g10.commerce-order-status.SC-t5o rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-09 - A confirmed combination carries its note
**Serves:** Secondary note - a partial refund before shipping names its note for the surface that shows one

- **GIVEN** an order whose order state is `open`, fulfilment state is `unfulfilled`, and payment state is `partially_refunded`
- **WHEN** its order status is resolved
- **THEN** the badge is `refunded`
- **AND** the note identifier is `partial-refund-unshipped`

<!-- trace:scenario id=g10.commerce-order-status.SC-x4g rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-10 - An unconfirmed combination carries no note
**Serves:** Secondary note - an order no confirmed note fits leaves that surface its badge alone

- **GIVEN** an order whose order state is `open`, fulfilment state is `in_progress`, and payment state is `paid`
- **WHEN** its order status is resolved
- **THEN** the badge is `processing`
- **AND** no note identifier is emitted

<!-- trace:scenario id=g10.commerce-order-status.SC-34p rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-11 - The mapping emits no display copy
**Serves:** Secondary note - the message catalogs, not the rule, give that surface its words

- **GIVEN** any order that resolves to a note
- **WHEN** its order status is resolved
- **THEN** the result carries a note identifier from the table above
- **AND** it carries no human-readable status or note text

<!-- trace:scenario id=g10.commerce-order-status.SC-zkk rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-24 - A return chooses the refund's note
**Serves:** Secondary note - a return names which refund note that surface shows

- **GIVEN** an order whose order state is `open`, fulfilment state is `fulfilled`, payment state is `partially_refunded`, and return state is `returned`
- **WHEN** its order status is resolved
- **THEN** the badge is `refunded`
- **AND** the note identifier is `items-returned-partial-refund`

<!-- trace:scenario id=g10.commerce-order-status.SC-7ce rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-25 - Only a completed return reads as returned
**Serves:** Secondary note - a return only requested leaves that surface the refund note

- **GIVEN** an order whose order state is `open`, fulfilment state is `fulfilled`, payment state is `refunded`, and Shopify return status is `RETURN_REQUESTED`
- **WHEN** its order status is resolved
- **THEN** the badge is `refunded`
- **AND** the note identifier is `refunded-all-items-shipped`

<!-- trace:scenario id=g10.commerce-order-status.SC-cvt rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-26 - A voided payment carries the void's note
**Serves:** Secondary note - a voided payment names its note for the surface that shows one

- **GIVEN** an order whose order state is `open` and payment state is `voided`
- **WHEN** its order status is resolved
- **THEN** the badge is `canceled`
- **AND** the note identifier is `payment-voided`

<!-- trace:scenario id=g10.commerce-order-status.SC-zdo rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-27 - A held order carrying a partial refund carries the hold's refund note
**Serves:** Secondary note - a held order carrying a partial refund names one note for both

- **GIVEN** an order whose order state is `open`, fulfilment state is `on_hold`, and payment state is `partially_refunded`
- **WHEN** its order status is resolved
- **THEN** the badge is `processing`
- **AND** the note identifier is `on-hold-partial-refund`

<!-- trace:scenario id=g10.commerce-order-status.SC-er5 rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-28 - An expired payment reads Processing with its note
**Serves:** Secondary note - an expired payment names its note for the surface that shows one

- **GIVEN** an order whose order state is `open`, fulfilment state is `unfulfilled`, and payment state is `expired`
- **WHEN** its order status is resolved
- **THEN** the badge is `processing`
- **AND** the note identifier is `payment-expired`

### Requirement: Completed reports a concluded order, not a delivery

Completed says the order is concluded; no badge says a parcel arrived.

**Conclusion, not delivery** - The `completed` badge SHALL mean that an order
is fulfilled, paid, and archived. It SHALL NOT be presented as, or derived
from, carrier-confirmed delivery, and resolving it SHALL NOT require a
delivery fact.

**No delivery claim** - No badge SHALL assert that a shipment reached the
collector.

<!-- trace:scenario id=g10.commerce-order-status.SC-hv0 rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-12 - Completed does not assert delivery
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** an order that resolves to the `completed` badge
- **WHEN** the order has no carrier delivery confirmation
- **THEN** the badge still resolves to `completed`
- **AND** no surface derives a delivered state from that badge

### Requirement: Pickup is not emitted in this phase

No order gets a pickup badge yet, and the shared components keep their pickup
rung.

**Pickup withheld** - The mapping SHALL NOT emit a pickup badge, because
Grade10 does not yet distinguish a pickup order from a shipped order in the
underlying data. An order awaiting collection in a physical store SHALL
resolve through the ordered rules like any other order.

**Components unchanged** - This requirement SHALL NOT remove a pickup rung
from any shared component or design-system contract; withholding the value is
a mapping decision, not a component change.

<!-- trace:scenario id=g10.commerce-order-status.SC-4h5 rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-13 - Pickup is never emitted in this phase
**Serves:** grade10-site-commerce-order-status-US-01 - Collector reads where an order stands

- **GIVEN** any combination of the accepted vocabulary
- **WHEN** its order status is resolved
- **THEN** the badge is one of `processing`, `shipped`, `completed`, `canceled`, or `refunded`
- **AND** no pickup badge is emitted

### Requirement: Every surface showing order status derives it from this mapping

Every surface that shows an order's status takes it from this mapping, over
one stored copy of the order's Shopify facts.

**One mapping** - Every Grade10 Store surface that shows a collector the state
of an order SHALL derive its badge, and any note it displays, from this
mapping. A surface SHALL NOT define its own combination-to-badge rules, and
SHALL NOT display a badge that contradicts the one this mapping resolves for
the same order.

**The note** - A surface MAY choose not to display the secondary note. A
surface SHALL NOT display a note the mapping did not emit for that order.

**Freshness** - Every surface SHALL resolve an order's status from one stored
copy of its Shopify facts. An order that Shopify reports paid in full,
refunded or canceled SHALL reach that copy within 5 minutes. Any other change
to an order Shopify holds open and placed in the last 90 days - its
fulfilment, archive or return, or a payment voided or expired - SHALL reach it
within an hour.

<!-- trace:scenario id=g10.commerce-order-status.SC-nwz rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-14 - Two surfaces report one order identically
**Serves:** grade10-site-commerce-order-status-US-03 - Collector sees one answer everywhere

- **GIVEN** one order read by two surfaces that both show its status
- **WHEN** both resolve its order status from the same four facts
- **THEN** both display the same badge
- **AND** a surface that displays the note displays the identifier this mapping emitted

<!-- trace:scenario id=g10.commerce-order-status.SC-22a rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-29 - A refund reaches both surfaces within 5 minutes
**Serves:** grade10-site-commerce-order-status-US-03 - Collector sees one answer everywhere

- **GIVEN** an order whose order state is `open`, fulfilment state is `fulfilled`, and payment state is `paid`
- **WHEN** Shopify reports a full refund of the order
- **THEN** within 5 minutes the stored copy reads payment state `refunded`
- **AND** both surfaces then display the badge `refunded`

<!-- trace:scenario id=g10.commerce-order-status.SC-s28 rev=1 -->
#### Scenario: grade10-site-commerce-order-status-SC-30 - An archive reaches both surfaces within an hour
**Serves:** grade10-site-commerce-order-status-US-03 - Collector sees one answer everywhere

- **GIVEN** an order placed in the last 90 days whose order state is `open`, fulfilment state is `fulfilled`, and payment state is `paid`
- **WHEN** the shop archives the order in Shopify
- **THEN** within an hour the stored copy reads order state `closed`
- **AND** both surfaces then display the badge `completed`
