# shared-ui/store-cart Specification

## Purpose

The shopping cart drawer surface: a slide-out drawer overlay displaying current
cart items, a 5-slot baseline grid of items and placeholder slots, price summary,
collapsible promo code redemption, and checkout CTA.

## Feature set

- Drawer export contract
  - Cart drawer components: one cart surface every store application imports rather than builds
  - Cart drawer types: names the props, copy, item, and promo shapes an application supplies
  - Unavailable status: marks a line whose product is no longer in the store catalogue, distinct from sold out and adjusted
  - Toast copy field: carries the removal message on drawer copy the consumer supplies
- Cart contents display
  - Five-slot baseline: keeps the drawer's shape steady when the cart holds fewer than five items
  - Item count badge: tells the shopper how many active items the cart holds
  - Scroll-fade on overflow: shows there is more above or below the visible items
- Opening the drawer
  - Fresh status and price read: the drawer opens against current product status and pricing
  - Boneyard skeletons: holds each region's shape while that read is in flight
- Cart refresh cleanup
  - Unavailable line removal: drops delisted catalogue lines after open loading without showing a sold-out row
  - Single removal toast: tells the collector once when any such line left the cart on that open
- Dismissal
  - Three ways out: close button, dimmed backdrop, and Escape all close the drawer
  - Background scroll lock: keeps the page behind the drawer still while it is open
- Checkout handoff
  - Redirecting button state: says the checkout is under way, and returns to its label if it fails
  - Application-owned navigation: the drawer reports the intent; the application creates the session
- Low-stock warning
  - Shown when adjusted: the consumer-supplied warning is visible on an adjusted line
  - Hidden after edit: a quantity change hides it for the rest of that mount

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

### store-cart-US-06: Shopper opens a cart that held a delisted product

**As a** shopper,
**I want** a product that left the catalogue to disappear after the drawer
finishes loading, with one toast,
**so that** I am not shown a sold-out row for something the store no longer
sells.

**Accepted by:**

- `store-cart-SC-01` — An application imports the cart drawer
- `store-cart-SC-10` — Delisted items clear after loading with one toast
- `store-cart-SC-11` — No unavailable items means no removal toast
- `store-cart-SC-12` — Status values are the four named states
- `store-cart-SC-13` — Drawer copy carries the unavailable-removal toast message

### store-cart-US-07: Shopper edits a low-stock line and the warning quiets

**As a** shopper,
**I want** the low-stock warning to hide after I change that line's quantity,
**so that** it does not keep shouting after I have acted, and it returns if the line is adjusted again.

**Accepted by:**

- `store-cart-SC-14` — Adjusted line shows the low-stock warning
- `store-cart-SC-15` — Quantity change hides the warning
- `store-cart-SC-16` — New adjusted status shows the warning again

## Requirements

### Requirement: The store cart drawer exports

The shared UI package SHALL export, from its public entry, exactly these
components for the store cart surface: `CartDrawer`, `CartDrawerHeader`,
`CartDrawerBody`, `CartDrawerFooter`, `CartItem`, `CartItemSlot` — and exactly these types:
`CartDrawerProps`, `CartDrawerCopy`, `CartDrawerHeaderProps`,
`CartDrawerHeaderCopy`, `CartDrawerBodyProps`, `CartDrawerFooterProps`,
`CartDrawerFooterCopy`, `CartItemProps`, `CartItemCopy`, `CartItemSlotProps`,
`CartItemStatus`, `CartItemSummary`, and `PromoState`.

`CartDrawerCopy` SHALL include `unavailableItemsRemoved` for the toast shown
when unavailable lines are cleared after open loading.

#### Scenario: store-cart-SC-01 - An application imports the cart drawer

- **WHEN** an application imports any export named above from the shared UI package's public entry
- **THEN** the import resolves without error

#### Scenario: store-cart-SC-13 - Drawer copy carries the unavailable-removal toast message

- **WHEN** a consumer supplies `CartDrawerCopy`
- **THEN** the copy includes `unavailableItemsRemoved`

### Requirement: Cart item status includes unavailable

`CartItemStatus` SHALL be exactly `default`, `adjusted`, `soldOut`, and
`unavailable`.

| Status | Meaning |
| --- | --- |
| `default` | Line is active and sellable as shown |
| `adjusted` | Quantity was reduced for low stock; row stays visible |
| `soldOut` | Variant has no stock; row stays visible with sold-out treatment |
| `unavailable` | Product is no longer in the store catalogue; removed after open loading |

#### Scenario: store-cart-SC-12 - Status values are the four named states

- **WHEN** a consumer assigns `CartItemStatus` on a cart line
- **THEN** the allowed values are only `default`, `adjusted`, `soldOut`, and
  `unavailable`

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

### Requirement: Unavailable items are removed silently after open loading

After the cart drawer finishes its open status-and-price loading, every line
whose status is `unavailable` SHALL be removed from the cart through
`onRemoveItem` and SHALL NOT render as a cart row (including sold-out
treatment). When one or more such lines are removed on that open, `CartDrawer`
SHALL show exactly one toast whose message is the consumer-supplied
`unavailableItemsRemoved` copy. When no line is `unavailable`, `CartDrawer`
SHALL NOT show that toast.

`unavailable` means the product is no longer in the store catalogue (taken off
sale). It is not `soldOut` and not `adjusted`.

#### Scenario: store-cart-SC-10 - Delisted items clear after loading with one toast

- **GIVEN** an open cart drawer whose status-and-price loading has finished
- **AND** the cart includes at least one item with status `unavailable` and at
  least one item that is not `unavailable`
- **WHEN** the drawer applies post-loading cleanup
- **THEN** each `unavailable` item is removed via `onRemoveItem`
- **AND** no `unavailable` item is shown as a cart row
- **AND** exactly one toast appears with the `unavailableItemsRemoved` message
- **AND** non-unavailable items remain in the cart

#### Scenario: store-cart-SC-11 - No unavailable items means no removal toast

- **GIVEN** an open cart drawer whose status-and-price loading has finished
- **AND** no cart item has status `unavailable`
- **WHEN** the drawer applies post-loading cleanup
- **THEN** no toast with the `unavailableItemsRemoved` message is shown
- **AND** no item is removed solely for being unavailable

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

### Requirement: Low-stock adjustment warning hides after the shopper edits quantity

When a cart line’s status is `adjusted`, `CartItem` SHALL show the
consumer-supplied low-stock warning copy. After the shopper changes that
line’s quantity through the stepper, `CartItem` SHALL hide the warning for
the remainder of that mount while status remains `adjusted`, and SHALL still
invoke `onQuantityChange` with the new quantity. Removing the line (including
decrement-at-minimum remove) SHALL remove the row and therefore the warning.
When the line’s status leaves `adjusted` and later becomes `adjusted` again,
`CartItem` SHALL show the warning again. When `CartItem` mounts with status
`adjusted`, it SHALL show the warning (a remount with status still `adjusted`
shows the warning again).

#### Scenario: store-cart-SC-14 - Adjusted line shows the low-stock warning

- **GIVEN** a cart line with status `adjusted`
- **WHEN** `CartItem` renders
- **THEN** the low-stock warning copy is visible

#### Scenario: store-cart-SC-15 - Quantity change hides the warning

- **GIVEN** a cart line with status `adjusted` showing the low-stock warning
- **AND** the stepper can change quantity without removing the line
- **WHEN** the shopper changes the line’s quantity
- **THEN** the low-stock warning is no longer visible
- **AND** `onQuantityChange` is invoked with the new quantity

#### Scenario: store-cart-SC-16 - New adjusted status shows the warning again

- **GIVEN** a cart line that was `adjusted` and whose warning was hidden after
  a quantity change
- **WHEN** the line’s status becomes not `adjusted` and then `adjusted` again
- **THEN** the low-stock warning is visible again
