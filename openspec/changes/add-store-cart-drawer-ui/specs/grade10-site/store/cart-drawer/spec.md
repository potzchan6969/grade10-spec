## Purpose

The Grade10 Store cart drawer lets a collector review and edit the current cart
without leaving the Store surface, then continue through an existing site
address.

## Feature set

- Drawer entry
  - Store overlay: opens one cart over the Store surface the collector is using
  - Preserved place: closing returns the collector to the same site address
- Current cart review
  - Scoped cart: shows the guest or member cart belonging to the current session
  - Fresh facts: starts the Store cart-validation read on every open
  - Unresolved read: never presents held price or availability as current
- Honest cart summary
  - Reviewed lines: shows only facts returned or confirmed by the live read
  - Neutral totals: adds no shipping, promotion, points, tax, or discount claim
- Read-only member tender context
  - Held promo codes: shows the member's current codes answered against the reviewed lines
  - Points ceiling: shows the member's balance and the maximum points the reviewed goods can take
  - No applied tender: keeps codes and points unselected and leaves the subtotal and estimated total unchanged
- Cart changes
  - Scoped edits: quantity and removal change the same cart the drawer opened
  - Delisted cleanup: lets the shared drawer remove unavailable lines once
- Existing ways onward
  - Product: uses the Store's product addresses
  - Checkout handoff: opens the existing checkout surface for its own review

## ADDED Requirements

### Requirement: The cart opens over the current site surface

When the collector activates the Store's Cart control, the site SHALL open one
cart drawer over the current surface without changing the current address. When
the drawer closes, the collector SHALL remain at that address.

#### Scenario: grade10-site-store-cart-drawer-SC-01 - Cart opens without leaving its surface
**Serves:** grade10-site-store-cart-drawer-US-01 - Collector opens the current cart over the Store

- **GIVEN** a collector on a Store surface or checkout
- **WHEN** they activate Cart
- **THEN** one cart drawer opens over that surface
- **AND** the current address does not change

#### Scenario: grade10-site-store-cart-drawer-SC-02 - Closing preserves the current address
**Serves:** grade10-site-store-cart-drawer-US-01 - Collector opens the current cart over the Store

- **GIVEN** an open cart drawer over a Store surface or checkout
- **WHEN** the drawer closes
- **THEN** the collector remains at the address beneath it

### Requirement: The drawer reviews the current scoped cart

The drawer SHALL show the current guest browser cart while the collector is
signed out and the current member cart while they are signed in. Every open
SHALL start the read defined by `grade10-site/store/cart-validation` for that
cart.

While that read is pending, the drawer SHALL use the loading behavior defined
by `shared/ui/store-cart` and SHALL NOT present held price or availability as
confirmed. If the read fails, the drawer SHALL remain unresolved, SHALL keep
Checkout unavailable, and SHALL tell the collector once during that open. A
later open SHALL start another read.

#### Scenario: grade10-site-store-cart-drawer-SC-03 - A signed-out collector sees the guest cart
**Serves:** grade10-site-store-cart-drawer-US-01 - Collector opens the current cart over the Store

- **GIVEN** a signed-out collector whose browser cart holds a line
- **WHEN** they open the cart drawer
- **THEN** the drawer reviews that browser cart

#### Scenario: grade10-site-store-cart-drawer-SC-04 - A signed-in collector sees the member cart
**Serves:** grade10-site-store-cart-drawer-US-01 - Collector opens the current cart over the Store

- **GIVEN** a signed-in collector whose member cart holds a line
- **WHEN** they open the cart drawer
- **THEN** the drawer reviews that member cart
- **AND** it does not substitute a guest browser cart

#### Scenario: grade10-site-store-cart-drawer-SC-05 - Every open starts a current read
**Serves:** grade10-site-store-cart-drawer-US-01 - Collector opens the current cart over the Store

- **GIVEN** a cart drawer whose previous open completed
- **WHEN** the collector opens it again
- **THEN** the drawer starts a new status-and-price read for the current scoped cart

#### Scenario: grade10-site-store-cart-drawer-SC-06 - A read in flight remains unresolved
**Serves:** grade10-site-store-cart-drawer-US-01 - Collector opens the current cart over the Store

- **GIVEN** an opening cart drawer whose status-and-price read has not answered
- **WHEN** the drawer renders
- **THEN** held price and availability are not presented as confirmed
- **AND** Checkout is unavailable

#### Scenario: grade10-site-store-cart-drawer-SC-07 - A failed read tells the collector once
**Serves:** grade10-site-store-cart-drawer-US-01 - Collector opens the current cart over the Store

- **GIVEN** an open cart drawer whose status-and-price read fails
- **WHEN** the unresolved drawer renders more than once during that open
- **THEN** the drawer tells the collector once that the cart could not be checked
- **AND** held price and availability remain unconfirmed
- **AND** Checkout remains unavailable

#### Scenario: grade10-site-store-cart-drawer-SC-08 - Reopening retries a failed read
**Serves:** grade10-site-store-cart-drawer-US-01 - Collector opens the current cart over the Store

- **GIVEN** a collector who closed the drawer after its read failed
- **WHEN** they open the drawer again
- **THEN** the drawer starts a new status-and-price read

### Requirement: The drawer presents only review-backed facts

After a successful read, the drawer SHALL present each retained line and its
summary from these facts:

| Part | Presented fact |
| --- | --- |
| Line | Current title, confirmed quantity, current unit price and currency, and current status |
| Previous price | The prior unit price and currency, only when the read reports a reprice |
| Subtotal | Current unit price multiplied by confirmed quantity for every line except sold-out and unavailable lines |
| Shipping | Localized `Calculated at checkout`, with no calculated amount |
| Estimated total | The same amount and currency as the subtotal |
| Image | Absent while the reviewed cart supplies no authoritative image |
| Promo code | Visible in its closed display-only state; accepts and applies nothing |
| Points | Absent |

The drawer SHALL NOT claim a promotion, points credit, shipping amount, tax, or
other discount unless a later capability supplies an applied quote.

#### Scenario: grade10-site-store-cart-drawer-SC-09 - A successful read fills the reviewed summary
**Serves:** grade10-site-store-cart-drawer-US-01 - Collector opens the current cart over the Store

- **GIVEN** a cart with one available line and one sold-out line
- **WHEN** the drawer's status-and-price read succeeds
- **THEN** both retained lines show their current reviewed facts
- **AND** the subtotal includes the available line and excludes the sold-out line

#### Scenario: grade10-site-store-cart-drawer-SC-10 - Unsupported adjustments remain neutral
**Serves:** grade10-site-store-cart-drawer-US-01 - Collector opens the current cart over the Store

- **GIVEN** a successful cart read with no image or applied quote
- **WHEN** the drawer shows its summary
- **THEN** no product image is shown
- **AND** shipping reads `Calculated at checkout`
- **AND** estimated total equals subtotal
- **AND** no promotion or points credit is applied

### Requirement: Drawer changes stay on the current cart

A quantity change or removal in the drawer SHALL update the same scoped cart
the drawer opened. After loading finishes, unavailable-line cleanup SHALL use
the removal and single-notice behavior defined by `shared/ui/store-cart`.

#### Scenario: grade10-site-store-cart-drawer-SC-11 - A collector edits the opened cart
**Serves:** grade10-site-store-cart-drawer-US-02 - Collector edits the reviewed cart

- **GIVEN** an available line in an open reviewed cart
- **WHEN** the collector changes its quantity or removes it
- **THEN** the current guest or member cart records that change

#### Scenario: grade10-site-store-cart-drawer-SC-12 - Delisted lines leave once
**Serves:** grade10-site-store-cart-drawer-US-02 - Collector edits the reviewed cart

- **GIVEN** a completed cart read with more than one unavailable line
- **WHEN** the drawer applies its post-loading cleanup
- **THEN** each unavailable line is removed once from the current scoped cart
- **AND** one cleanup notice is shown for that open

### Requirement: Drawer actions use existing site addresses

The drawer SHALL close before opening a product or checkout. A product line
SHALL open that product's existing address. Checkout SHALL open the existing
`/checkout` surface, which remains responsible for its own live read and
checkout creation.

#### Scenario: grade10-site-store-cart-drawer-SC-13 - A line opens its product
**Serves:** grade10-site-store-cart-drawer-US-03 - Collector continues from the cart drawer

- **GIVEN** an open reviewed cart with a retained line
- **WHEN** the collector activates that line
- **THEN** the drawer closes
- **AND** the line's existing Store product address opens

#### Scenario: grade10-site-store-cart-drawer-SC-15 - Checkout uses the existing surface
**Serves:** grade10-site-store-cart-drawer-US-03 - Collector continues from the cart drawer

- **GIVEN** an open cart drawer whose status-and-price read is not pending or failed
- **WHEN** the collector activates Checkout
- **THEN** the drawer closes
- **AND** the existing `/checkout` surface opens
- **AND** no checkout is created by the drawer

### Requirement: A signed-in collector sees current tender facts without applying them

After the drawer has a successful review for a signed-in collector, it SHALL
show the held promo codes and their answers for the reviewed lines. A code that
cannot be used SHALL remain visible with its refusal, and a code that can be
used SHALL remain unselected. The drawer SHALL NOT apply a promo code or points
from these reads, and its subtotal and estimated total SHALL remain the
reviewed subtotal.

#### Scenario: grade10-site-store-cart-drawer-SC-16 - Held promo codes answer the reviewed basket
**Serves:** grade10-site-store-cart-drawer-US-04 - Collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector whose cart review succeeds
- **AND** the member holds one applicable promo code and one inapplicable code
- **WHEN** the collector opens the promo-code view in the cart drawer
- **THEN** both current codes are shown
- **AND** the applicable code is shown as usable without being selected
- **AND** the inapplicable code shows the answer explaining why it cannot be used
- **AND** no promo discount is shown in the drawer summary

#### Scenario: grade10-site-store-cart-drawer-SC-17 - Points show the basket ceiling without changing the total
**Serves:** grade10-site-store-cart-drawer-US-04 - Collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector whose cart review succeeds
- **AND** the points read quotes a balance and a maximum for the reviewed goods
- **WHEN** the collector opens the points view in the cart drawer
- **THEN** the balance, conversion rate, and maximum points and amount are shown
- **AND** no points amount is applied
- **AND** the subtotal and estimated total remain the reviewed subtotal

#### Scenario: grade10-site-store-cart-drawer-SC-18 - Guests and unresolved reviews receive no stale tender facts
**Serves:** grade10-site-store-cart-drawer-US-04 - Collector reads tender choices for the reviewed basket

- **GIVEN** a guest collector, or a collector whose cart review is pending or failed
- **WHEN** the cart drawer renders
- **THEN** member-only promo and points facts are not shown
- **AND** no member-only tender read is required to render the cart review state

#### Scenario: grade10-site-store-cart-drawer-SC-19 - Tender facts follow the latest reviewed basket
**Serves:** grade10-site-store-cart-drawer-US-04 - Collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector whose drawer has shown promo and points facts for a reviewed basket
- **WHEN** the cart changes or the drawer closes and opens again
- **THEN** the previous tender facts are not presented as current
- **AND** the drawer shows only the next successful reads for the latest reviewed basket
