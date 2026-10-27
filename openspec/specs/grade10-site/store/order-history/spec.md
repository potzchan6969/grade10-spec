# grade10-site/store/order-history Specification

## Purpose

The customer order history lets a signed-in collector find their Store orders,
understand which still need attention, and open tracking or one order safely.

## Feature set

- Customer access
  - Signed-in route: Keep one private address for the collector's own orders.
  - Session recovery: Preserve the address while sign-in is completed.
- Order review
  - Active and past groups: Present newest orders Shopify holds, active above those nothing is left to happen on.
  - Order actions: Open one order or a safe carrier tracking page.
- Product pictures
  - Current product identity: Show the first current product picture on earlier and new purchases.
  - Optional pictures: Keep purchase facts readable when picture data is absent or unavailable.
- Page states
  - Loading and retry: Explain reads that have not completed or failed.
  - Empty account: Return a collector with no orders to the Store.

## Requirements

### Requirement: A collector reaches their orders at one private address

The Grade10 site SHALL serve Your Orders at `/profile/orders`. A signed-in
collector SHALL see only orders associated with their account. A collector
without a decided session SHALL remain at that address while the existing
sign-in surface decides the session.

<!-- trace:scenario id=g10.store-order-history.SC-u2y rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-01 - A signed-in collector opens Your Orders
**Serves:** grade10-site-store-order-history-US-01 - Collector reviews active and past orders

- **GIVEN** a signed-in collector with Store orders
- **WHEN** they open `/profile/orders`
- **THEN** the page lists only that collector's orders

<!-- trace:scenario id=g10.store-order-history.SC-si2 rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-02 - A signed-out collector keeps the intended address
**Serves:** grade10-site-store-order-history-US-02 - Collector signs in to the intended order page

- **GIVEN** a collector without a signed-in session
- **WHEN** they open `/profile/orders`
- **THEN** the sign-in surface opens without replacing `/profile/orders`
- **AND** a successful sign-in reveals Your Orders at the same address

### Requirement: Your Orders presents newest active and past orders

The page SHALL present orders newest first. It SHALL list a web order only
once Shopify holds it. It SHALL pass the customer-facing badge defined by
`grade10-site/commerce/order-status` to every order summary. It SHALL classify
an order as Past when that badge is `completed`, `canceled` or `refunded`,
and every other order as Active. It SHALL NOT read whether Shopify archived the order.

Each summary SHALL show the Store-supplied shop order number when it is present
and non-empty, otherwise the Store order id. It SHALL also show the placed date,
customer-facing status, available line items, and the best known total. The best
known total SHALL be the paid amount when present, otherwise the quoted subtotal
when present, and otherwise an explicit pending-total treatment. Amounts SHALL
remain integer minor units paired with their ISO 4217 currency code until
formatted for the collector.

<!-- trace:scenario id=g10.store-order-history.SC-zre rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-03 - Active and past orders are grouped newest first
**Serves:** grade10-site-store-order-history-US-01 - Collector reviews active and past orders

- **GIVEN** a collector with active and past orders created at different times
- **WHEN** Your Orders loads
- **THEN** active orders appear above past orders
- **AND** each group is ordered newest first

<!-- trace:scenario id=g10.store-order-history.SC-4i0 rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-04 - The paid total takes precedence
**Serves:** grade10-site-store-order-history-US-01 - Collector reviews active and past orders

- **GIVEN** an order with a quoted subtotal and a different paid amount
- **WHEN** the order summary renders
- **THEN** its total shows the paid amount
- **AND** the quoted subtotal is not presented as the charge

<!-- trace:scenario id=g10.store-order-history.SC-fun rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-05 - A pending total is not invented
**Serves:** grade10-site-store-order-history-US-01 - Collector reviews active and past orders

- **GIVEN** an order with neither a paid amount nor a quoted subtotal
- **WHEN** the order summary renders
- **THEN** it says the total is pending
- **AND** it does not show a zero amount

<!-- trace:scenario id=g10.store-order-history.SC-yhz rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-12 - A shop order number identifies a summary
**Serves:** grade10-site-store-order-history-US-01 - Collector reviews active and past orders

- **GIVEN** an order with a Store-supplied shop order number
- **WHEN** its summary renders
- **THEN** the shop order number identifies the order
- **AND** View Details still targets the order's immutable Store order id

<!-- trace:scenario id=g10.store-order-history.SC-3eo rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-13 - An older order falls back to its Store id
**Serves:** grade10-site-store-order-history-US-01 - Collector reviews active and past orders

- **GIVEN** an order with no non-empty shop order number
- **WHEN** its summary renders
- **THEN** the Store order id identifies the order
- **AND** no shop order number is invented

### Requirement: Order actions use settled Grade10 and carrier addresses

View Details SHALL open `/profile/orders/<order-id>` using the selected order's
immutable Store order id, including when the summary displays a different shop
order number. Track Order SHALL appear only when the order supplies an absolute
`https` carrier URL with no embedded credentials. Activating Track Order SHALL
open that URL in a new browser context without giving the destination access to
the Grade10 page. A tracking number or carrier name alone SHALL NOT create a
tracking action.

<!-- trace:scenario id=g10.store-order-history.SC-71g rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-06 - View Details opens one order
**Serves:** grade10-site-store-order-history-US-01 - Collector reviews active and past orders

- **WHEN** a collector activates View Details for an order
- **THEN** `/profile/orders/<order-id>` opens for that order

<!-- trace:scenario id=g10.store-order-history.SC-raj rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-07 - A safe carrier URL enables tracking
**Serves:** grade10-site-store-order-history-US-01 - Collector reviews active and past orders

- **GIVEN** an order with an absolute `https` carrier URL carrying no credentials
- **WHEN** its summary renders
- **THEN** Track Order appears
- **AND** activating it opens the carrier URL in a new browser context isolated from the Grade10 page

<!-- trace:scenario id=g10.store-order-history.SC-ab2 rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-08 - A tracking number alone stays text-only
**Serves:** grade10-site-store-order-history-US-01 - Collector reviews active and past orders

- **GIVEN** an order with a carrier and tracking number but no safe carrier URL
- **WHEN** its summary renders
- **THEN** Track Order does not appear

### Requirement: The page distinguishes loading, failure, and no orders

The page SHALL show a loading state until the first order read settles. A failed
read SHALL show a localized error and a retry action without replacing the
page address. When the read succeeds with no orders, the page SHALL show the
designed empty state and a Shop Now action to `/store`.

<!-- trace:scenario id=g10.store-order-history.SC-dta rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-09 - The first read is still loading
**Serves:** grade10-site-store-order-history-US-01 - Collector reviews active and past orders

- **WHEN** the first order read has not settled
- **THEN** the page shows a loading state and no empty-state claim

<!-- trace:scenario id=g10.store-order-history.SC-g9j rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-10 - A failed read can be retried
**Serves:** grade10-site-store-order-history-US-01 - Collector reviews active and past orders

- **GIVEN** the order read failed
- **WHEN** the collector activates Retry
- **THEN** the page reads the orders again at `/profile/orders`

<!-- trace:scenario id=g10.store-order-history.SC-li6 rev=1 -->
#### Scenario: grade10-site-store-order-history-SC-11 - A collector with no orders returns to the Store
**Serves:** grade10-site-store-order-history-US-03 - Collector starts shopping from an empty account

- **GIVEN** the order read succeeded with no orders
- **WHEN** Your Orders renders
- **THEN** the designed empty state appears
- **AND** Shop Now opens `/store`

### Requirement: Current product pictures identify recorded purchases

Your Orders SHALL show each available first current product picture beside its
matching recorded item, including purchases made before picture support. A
later catalogue edit SHALL be reflected when the order is read again. Pictures
SHALL NOT replace recorded titles, quantities, currency, prices, totals,
status, tracking or order actions.

| Picture State | Required Outcome |
| --- | --- |
| Current first product picture available | Show it in the existing item frame |
| Catalogue alt text absent, empty or whitespace-only | Use the recorded item title as the image's accessible name |
| Meaningful catalogue alt text supplied | Preserve that accessible name |
| Product or picture unavailable | Keep the existing placeholder and purchase facts |
| Picture lookup fails | Record a diagnostic and keep the order list and its actions usable |
| Image resource fails to load | Keep other order facts and actions usable |

Order item responses SHALL allow absent `imageSrc` and `imageAlt` fields.
When supplied, each field SHALL be a string. A compatible response without
picture fields SHALL remain readable with the existing placeholder. Picture
availability SHALL NOT change which collector can read an order.

<!-- trace:scenario id=g10.store-order-history.SC-qrm rev=1 -->
#### Scenario: g10.store-order-history.SC1 - Earlier purchases show their matching current pictures
**Serves:** g10.store-order-history.US5 - the collector recognises earlier purchases before opening one

- **GIVEN** earlier orders with different recorded items and available current product pictures
- **WHEN** the collector opens Your Orders
- **THEN** each item shows its own product's first current picture
- **AND** its recorded title, quantity, currency, price, line total, order total, status and tracking remain unchanged

<!-- trace:scenario id=g10.store-order-history.SC-2qr rev=1 -->
#### Scenario: g10.store-order-history.SC2 - A later catalogue picture replaces an earlier display
**Serves:** g10.store-order-history.US5 - the collector recognises earlier purchases before opening one

- **GIVEN** an earlier purchase whose product's first picture has changed since a previous order read
- **WHEN** the collector reads Your Orders again
- **THEN** that item shows the new first current picture
- **AND** its recorded purchase facts remain unchanged

<!-- trace:scenario id=g10.store-order-history.SC-1ry rev=1 -->
#### Scenario: g10.store-order-history.SC3 - Unavailable pictures preserve the order list
**Serves:** g10.store-order-history.US5 - the collector recognises earlier purchases before opening one

- **GIVEN** recorded items whose products are removed, unpublished or supply no picture
- **WHEN** Your Orders loads successfully
- **THEN** each affected item keeps the existing placeholder
- **AND** the recorded items, order facts and available actions remain visible

<!-- trace:scenario id=g10.store-order-history.SC-r6e rev=1 -->
#### Scenario: g10.store-order-history.SC4 - Blank alt text uses each recorded title
**Serves:** g10.store-order-history.US5 - the collector recognises earlier purchases before opening one

- **GIVEN** pictured items with absent, empty, whitespace-only or meaningful catalogue alt text
- **WHEN** their summaries render
- **THEN** each blank alt uses that item's recorded title as the image's accessible name
- **AND** meaningful supplied alt text remains the accessible name

<!-- trace:scenario id=g10.store-order-history.SC-cb4 rev=1 -->
#### Scenario: g10.store-order-history.SC5 - Picture lookup failure preserves successful order reads
**Serves:** g10.store-order-history.US5 - the collector recognises earlier purchases before opening one

- **GIVEN** the collector's order facts are readable but the picture lookup fails
- **WHEN** Your Orders loads
- **THEN** the affected items keep the existing placeholder
- **AND** the successful list, purchase facts, View Details and any valid tracking action remain usable
- **AND** the picture lookup failure has a diagnostic record

<!-- trace:scenario id=g10.store-order-history.SC-ds5 rev=1 -->
#### Scenario: g10.store-order-history.SC6 - Legacy responses preserve pictureless summaries
**Serves:** g10.store-order-history.US5 - the collector recognises earlier purchases before opening one

- **GIVEN** a compatible order response without picture fields on its items
- **WHEN** the current application reads that response
- **THEN** Your Orders renders the recorded items with the existing placeholder
- **AND** absent picture fields do not turn the successful read into an error

<!-- trace:scenario id=g10.store-order-history.SC-a5w rev=1 -->
#### Scenario: g10.store-order-history.SC7 - Image resource failure leaves order actions usable
**Serves:** g10.store-order-history.US5 - the collector recognises earlier purchases before opening one

- **GIVEN** a supplied picture whose image resource fails to load
- **WHEN** the collector reads its order summary
- **THEN** the recorded purchase facts remain readable
- **AND** View Details and any valid tracking action remain usable
