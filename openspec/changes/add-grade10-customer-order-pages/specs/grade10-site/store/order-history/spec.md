## Purpose

The customer order history lets a signed-in collector find their Store orders,
understand which still need attention, and open tracking or one order safely.

## Feature set

- Customer access
  - Signed-in route: Keep one private address for the collector's own orders.
  - Session recovery: Preserve the address while sign-in is completed.
- Order review
  - Active and past groups: Present newest orders in the group their customer status defines.
  - Order actions: Open one order or a safe carrier tracking page.
- Page states
  - Loading and retry: Explain reads that have not completed or failed.
  - Empty account: Return a collector with no orders to the Store.

## ADDED Requirements

### Requirement: A collector reaches their orders at one private address

The Grade10 site SHALL serve Your Orders at `/profile/orders`. A signed-in
collector SHALL see only orders associated with their account. A collector
without a decided session SHALL remain at that address while the existing
sign-in surface decides the session.

#### Scenario: grade10-site-store-order-history-SC-01 - A signed-in collector opens Your Orders

- **GIVEN** a signed-in collector with Store orders
- **WHEN** they open `/profile/orders`
- **THEN** the page lists only that collector's orders

#### Scenario: grade10-site-store-order-history-SC-02 - A signed-out collector keeps the intended address

- **GIVEN** a collector without a signed-in session
- **WHEN** they open `/profile/orders`
- **THEN** the sign-in surface opens without replacing `/profile/orders`
- **AND** a successful sign-in reveals Your Orders at the same address

### Requirement: Your Orders presents newest active and past orders

The page SHALL present orders newest first. It SHALL pass the customer-facing
badge defined by `grade10-site/store/order-status` to every order summary. It
SHALL classify `processing`, `shipped`, and `pickup` as Active, and `completed`,
`canceled`, and `refunded` as Past.

Each summary SHALL show the order id, placed date, customer-facing status,
available line items, and the best known total. The best known total SHALL be
the paid amount when present, otherwise the quoted subtotal when present, and
otherwise an explicit pending-total treatment. Amounts SHALL remain integer
minor units paired with their ISO 4217 currency code until formatted for the
collector.

#### Scenario: grade10-site-store-order-history-SC-03 - Active and past orders are grouped newest first

- **GIVEN** a collector with active and past orders created at different times
- **WHEN** Your Orders loads
- **THEN** active orders appear above past orders
- **AND** each group is ordered newest first

#### Scenario: grade10-site-store-order-history-SC-04 - The paid total takes precedence

- **GIVEN** an order with a quoted subtotal and a different paid amount
- **WHEN** the order summary renders
- **THEN** its total shows the paid amount
- **AND** the quoted subtotal is not presented as the charge

#### Scenario: grade10-site-store-order-history-SC-05 - A pending total is not invented

- **GIVEN** an order with neither a paid amount nor a quoted subtotal
- **WHEN** the order summary renders
- **THEN** it says the total is pending
- **AND** it does not show a zero amount

### Requirement: Order actions use settled Grade10 and carrier addresses

View Details SHALL open `/profile/orders/<order-id>` for the selected order. Track
Order SHALL appear only when the order supplies an absolute `https` carrier URL
with no embedded credentials. Activating Track Order SHALL open that URL in a
new browser context without giving the destination access to the Grade10 page.
A tracking number or carrier name alone SHALL NOT create a tracking action.

#### Scenario: grade10-site-store-order-history-SC-06 - View Details opens one order

- **WHEN** a collector activates View Details for an order
- **THEN** `/profile/orders/<order-id>` opens for that order

#### Scenario: grade10-site-store-order-history-SC-07 - A safe carrier URL enables tracking

- **GIVEN** an order with an absolute `https` carrier URL carrying no credentials
- **WHEN** its summary renders
- **THEN** Track Order appears
- **AND** activating it opens the carrier URL in a new browser context isolated from the Grade10 page

#### Scenario: grade10-site-store-order-history-SC-08 - A tracking number alone stays text-only

- **GIVEN** an order with a carrier and tracking number but no safe carrier URL
- **WHEN** its summary renders
- **THEN** Track Order does not appear

### Requirement: The page distinguishes loading, failure, and no orders

The page SHALL show a loading state until the first order read settles. A failed
read SHALL show a localized error and a retry action without replacing the
page address. When the read succeeds with no orders, the page SHALL show the
designed empty state and a Shop Now action to `/store`.

#### Scenario: grade10-site-store-order-history-SC-09 - The first read is still loading

- **WHEN** the first order read has not settled
- **THEN** the page shows a loading state and no empty-state claim

#### Scenario: grade10-site-store-order-history-SC-10 - A failed read can be retried

- **GIVEN** the order read failed
- **WHEN** the collector activates Retry
- **THEN** the page reads the orders again at `/profile/orders`

#### Scenario: grade10-site-store-order-history-SC-11 - A collector with no orders returns to the Store

- **GIVEN** the order read succeeded with no orders
- **WHEN** Your Orders renders
- **THEN** the designed empty state appears
- **AND** Shop Now opens `/store`
