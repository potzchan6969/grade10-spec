# grade10-site/auction/order-status Specification

## Feature set

- Derived order status
  - Preparing Shipment: display name for invoice `paid` and fulfilment `unfulfilled` (was Processing)

## MODIFIED Requirements

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
