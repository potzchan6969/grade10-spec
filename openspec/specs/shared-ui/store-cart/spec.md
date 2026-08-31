# shared-ui/store-cart Specification

## Purpose

The shopping cart drawer surface: a slide-out drawer overlay displaying current
cart items, a 5-slot baseline grid of items and placeholder slots, price summary,
collapsible promo code redemption, and checkout CTA.

## Feature set

- Drawer export contract
  - Cart drawer components: one cart surface every store application imports rather than builds
  - Cart drawer types: names the props, copy, item, and promo shapes an application supplies
- Cart contents display
  - Five-slot baseline: keeps the drawer's shape steady when the cart holds fewer than five items
  - Item count badge: tells the shopper how many active items the cart holds
  - Scroll-fade on overflow: shows there is more above or below the visible items
- Opening the drawer
  - Fresh status and price read: the drawer opens against current product status and pricing
  - Boneyard skeletons: holds each region's shape while that read is in flight
- Dismissal
  - Three ways out: close button, dimmed backdrop, and Escape all close the drawer
  - Background scroll lock: keeps the page behind the drawer still while it is open
- Checkout handoff
  - Redirecting button state: says the checkout is under way, and returns to its label if it fails
  - Application-owned navigation: the drawer reports the intent; the application creates the session

## User journeys

### store-cart-US-01: Application imports the cart drawer surface

**As an** application,
**I want** every cart drawer component and type available from the shared UI
package's public entry,
**so that** I compose the drawer from its parts rather than defining them
myself.

**Accepted by:**

- `store-cart-SC-01` — An application imports the cart drawer

### store-cart-US-02: Shopper reviews what the cart holds

**As a** shopper,
**I want** the drawer to show my items on a five-row baseline, with a count
that ignores sold-out items and an edge fade when there are more,
**so that** I can see what I am buying without the drawer changing shape as
the cart fills.

**Accepted by:**

- `store-cart-SC-02` — Fewer than 5 items
- `store-cart-SC-03` — 5 or more items
- `store-cart-SC-04` — Empty cart
- `store-cart-SC-05` — Sold out item present
- `store-cart-SC-07` — Overflowing items hint scrollability

### store-cart-US-03: Shopper opens the cart on current prices

**As a** shopper,
**I want** the drawer to read fresh product status and pricing when it opens,
showing skeletons while that read is in flight,
**so that** I decide against the current prices rather than stale ones.

**Accepted by:**

- `store-cart-SC-08` — Cart opened in loading state

### store-cart-US-04: Shopper dismisses the cart drawer

**As a** shopper,
**I want** to close the drawer from its close button, the backdrop, or the
Escape key, with the page behind it held still,
**so that** I can leave the cart without losing my place on the page beneath
it.

**Accepted by:**

- `store-cart-SC-06` — Backdrop tap or Escape key

### store-cart-US-05: Shopper proceeds from the cart to checkout

**As a** shopper,
**I want** the checkout button to show it is redirecting while the
application creates the session,
**so that** I know the checkout is under way, and see the button return to
its label if it fails.

**Accepted by:**

- `store-cart-SC-09` — Shopper proceeds to checkout

## Requirements

### Requirement: The store cart drawer exports

The shared UI package SHALL export, from its public entry, exactly these
components for the store cart surface: `CartDrawer`, `CartDrawerHeader`,
`CartDrawerBody`, `CartDrawerFooter`, `CartItem`, `CartItemSlot` — and exactly these types:
`CartDrawerProps`, `CartDrawerCopy`, `CartDrawerHeaderProps`,
`CartDrawerHeaderCopy`, `CartDrawerBodyProps`, `CartDrawerFooterProps`,
`CartDrawerFooterCopy`, `CartItemProps`, `CartItemCopy`, `CartItemSlotProps`,
`CartItemStatus`, `CartItemSummary`, and `PromoState`.

#### Scenario: store-cart-SC-01 - An application imports the cart drawer

- **WHEN** an application imports any export named above from the shared UI package's public entry
- **THEN** the import resolves without error

### Requirement: The drawer displays a minimum 5-row baseline

When the cart holds fewer than 5 items, `CartDrawer` SHALL render empty
`CartItemSlot` placeholders following the items to complete a 5-row baseline.
When the cart holds 5 or more items, `CartDrawer` SHALL NOT render empty slot
placeholders and SHALL scroll all items.

#### Scenario: store-cart-SC-02 - Fewer than 5 items

- **GIVEN** a cart with 2 items
- **WHEN** `CartDrawer` renders
- **THEN** it renders the 2 items followed by 3 `CartItemSlot` placeholders

#### Scenario: store-cart-SC-03 - 5 or more items

- **GIVEN** a cart with 6 items
- **WHEN** `CartDrawer` renders
- **THEN** all 6 items render and no `CartItemSlot` placeholders are shown

#### Scenario: store-cart-SC-04 - Empty cart

- **GIVEN** a cart with 0 items
- **WHEN** `CartDrawer` renders
- **THEN** 5 `CartItemSlot` placeholders render
- **AND** the item count badge in the header is hidden
- **AND** the footer is hidden entirely

### Requirement: Item count badge excludes sold-out items

`CartDrawerHeader` SHALL display the count of active items in the cart and
SHALL NOT count sold-out items towards the badge total.

#### Scenario: store-cart-SC-05 - Sold out item present

- **GIVEN** a cart with 1 active item and 1 sold-out item
- **WHEN** `CartDrawer` renders
- **THEN** the header badge displays `1`

### Requirement: Dismissal and scroll lock

`CartDrawer` SHALL close when the shopper activates the close button, clicks the
dimmed backdrop overlay, or presses the <kbd>Escape</kbd> key. When open,
background body scrolling SHALL be prevented.

#### Scenario: store-cart-SC-06 - Backdrop tap or Escape key

- **GIVEN** an open cart drawer
- **WHEN** the backdrop overlay is clicked or the Escape key is pressed
- **THEN** the `onClose` callback is called

### Requirement: Scroll-fade on body overflow

When cart items exceed the visible body container, `CartDrawerBody` SHALL display
shadcn scroll-fade mask styling at the top and bottom edges to indicate scrollable content.

#### Scenario: store-cart-SC-07 - Overflowing items hint scrollability

- **GIVEN** a cart with overflowing items
- **WHEN** `CartDrawerBody` renders
- **THEN** the body container applies the `scroll-fade` utility class

### Requirement: Fetching status and price info on open with Boneyard skeletons

When the cart drawer opens, it SHALL fetch fresh product status and pricing data.
During fetching (or when `loading` is active), each `CartItem`, the header item-count
badge, subtotal, discount amount, and estimated total SHALL render in a Boneyard
skeleton loading state. Empty `CartItemSlot` placeholders SHALL NOT render while
loading, and the checkout button SHALL be disabled.

#### Scenario: store-cart-SC-08 - Cart opened in loading state

- **GIVEN** an opening or loading cart drawer
- **WHEN** `CartDrawer` renders while `loading` is true
- **THEN** cart items, the header count badge, subtotal, discount amount, and estimated total display Boneyard skeleton loaders
- **AND** no `CartItemSlot` placeholders are shown
- **AND** the checkout button is disabled

### Requirement: Checkout enters a redirecting state

When the shopper activates an enabled checkout button, `CartDrawerFooter` SHALL
show the button in a loading state with the consumer-provided
`checkoutRedirecting` label and SHALL invoke `onCheckout`. The shared component
SHALL NOT navigate; the consuming application owns creating a checkout session
and redirecting (for example to Shopify Checkout). While redirecting, the
button SHALL remain in the loading state until navigation occurs or `onCheckout`
rejects, in which case the button SHALL return to its enabled label.

#### Scenario: store-cart-SC-09 - Shopper proceeds to checkout

- **GIVEN** an enabled checkout button
- **WHEN** the shopper activates it
- **THEN** the button shows a loading state labeled with `checkoutRedirecting`
- **AND** `onCheckout` is invoked
