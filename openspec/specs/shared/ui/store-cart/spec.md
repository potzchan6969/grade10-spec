# shared/ui/store-cart Specification

## Purpose

The shopping cart drawer: a slide-out drawer listing the cart's items, or the
design-system empty state when it holds nothing, with a price summary,
collapsible promo code redemption and a checkout CTA.

## Feature set

- Drawer export contract
  - Cart drawer components: one cart surface every store application imports rather than builds
  - Cart drawer types: names the props, copy, item, and promo shapes an application supplies
  - Unavailable status: marks a line whose product is no longer in the store catalogue, distinct from sold out and adjusted
  - Toast copy field: carries the removal message on drawer copy the consumer supplies
  - Empty copy fields: carries the empty-cart title and optional description on the drawer copy and body props the consumer supplies
- Cart contents
  - Items only: the drawer lists what the cart holds and nothing standing in for an item
  - Empty state: an empty cart shows the design-system empty state with no action
  - Item count badge: tells the shopper how many active items the cart holds, leaving out sold-out and unavailable lines
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
- Stock is a ceiling
  - Supplied maximum: a line's stepper stops where the consumer says the shop's count stops
  - No maximum, no ceiling: a line supplied none keeps a stepper that counts on
- What is left, said
  - Supplied remaining count: the line displays how many are left, in the consumer's own words
  - Consumer decides when: the line shows what it is given and judges nothing about scarcity

## Requirements

### Requirement: The store cart drawer exports

The shared UI package SHALL export, from its public entry, exactly these
components for the store cart surface: `CartDrawer`, `CartDrawerHeader`,
`CartDrawerBody`, `CartDrawerFooter`, `CartItem`, `CartPromoSheet`,
`PromoTicket` - and exactly these types: `CartDrawerProps`, `CartDrawerCopy`,
`CartDrawerHeaderProps`, `CartDrawerHeaderCopy`, `CartDrawerBodyProps`,
`CartDrawerFooterProps`, `CartDrawerFooterCopy`, `CartItemProps`,
`CartItemCopy`, `CartItemStatus`, `CartItemSummary`, `CartPromoSheetProps`,
`PromoTicketProps`, `HeldPromoCode`, `PointsState`, `PromoNotice`, and
`PromoState`.

The package SHALL NOT export `CartItemSlot` or `CartItemSlotProps`.

`CartDrawerCopy` SHALL include `unavailableItemsRemoved` for the toast shown
when unavailable lines are cleared after open loading, and `emptyTitle` (with
optional `emptyDescription`) for the empty-cart state. `CartDrawerBodyProps`
SHALL take the same `emptyTitle` and optional `emptyDescription`.

<!-- trace:scenario id=g10.shared-store-cart.SC-fcz rev=2 -->
#### Scenario: shared-ui-store-cart-SC-01 - An application imports the cart drawer
**Serves:** Drawer export contract - an application imports the cart drawer

- **WHEN** an application imports any export named above from the shared UI package's public entry
- **THEN** the import resolves without error

<!-- trace:scenario id=g10.shared-store-cart.SC-sol rev=1 -->
#### Scenario: shared-ui-store-cart-SC-13 - Drawer copy carries the unavailable-removal toast message
**Serves:** shared-ui-store-cart-US-06 - Shopper opens a cart that held a delisted product

- **WHEN** a consumer supplies `CartDrawerCopy`
- **THEN** the copy includes `unavailableItemsRemoved`

<!-- trace:scenario id=g10.shared-store-cart.SC-i9d rev=1 -->
#### Scenario: shared-ui-store-cart-SC-22 - Drawer copy carries the empty-cart title
**Serves:** Drawer export contract - an application words its empty cart

- **WHEN** a consumer supplies `CartDrawerCopy` or `CartDrawerBodyProps`
- **THEN** each requires `emptyTitle`
- **AND** each accepts `emptyDescription` as optional

<!-- trace:scenario id=g10.shared-store-cart.SC-n52 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-43 - The placeholder slot exports are gone
**Serves:** Drawer export contract - an application that imported the placeholder slot drops it

- **WHEN** an application imports `CartItemSlot` or `CartItemSlotProps` from the shared UI package's public entry
- **THEN** the import does not resolve

### Requirement: Cart item status includes unavailable

`CartItemStatus` SHALL be exactly `default`, `adjusted`, `soldOut`, and
`unavailable`.

| Status | Meaning |
| --- | --- |
| `default` | Line is active and sellable as shown |
| `adjusted` | Quantity was reduced for low stock; row stays visible |
| `soldOut` | Variant has no stock; row stays visible with sold-out treatment |
| `unavailable` | Product is no longer in the store catalogue; removed after open loading |

<!-- trace:scenario id=g10.shared-store-cart.SC-0wv rev=1 -->
#### Scenario: shared-ui-store-cart-SC-12 - Status values are the four named states
**Serves:** shared-ui-store-cart-US-06 - Shopper opens a cart that held a delisted product

- **WHEN** a consumer assigns `CartItemStatus` on a cart line
- **THEN** the allowed values are only `default`, `adjusted`, `soldOut`, and
  `unavailable`

### Requirement: Item count badge excludes sold-out items

`CartDrawerHeader` SHALL display, beside the drawer title, the count of active
lines, counting each line once whatever its quantity, and SHALL NOT count
sold-out or unavailable lines towards it. When the drawer is not loading and
that count is 0, it SHALL show no count.

<!-- trace:scenario id=g10.shared-store-cart.SC-9dd rev=1 -->
#### Scenario: shared-ui-store-cart-SC-05 - Sold out item present
**Serves:** shared-ui-store-cart-US-02 - Shopper reviews what the cart holds

- **GIVEN** a cart with 1 active item and 1 sold-out item
- **WHEN** `CartDrawer` renders
- **THEN** the header badge displays `1`

<!-- trace:scenario id=g10.shared-store-cart.SC-fy2 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-49 - Unavailable item present
**Serves:** shared-ui-store-cart-US-06 - Shopper opens a cart that held a delisted product

- **GIVEN** a cart with 1 active item and 1 item with status `unavailable` that the consumer has not yet removed
- **WHEN** `CartDrawer` renders while not loading
- **THEN** the header badge displays `1`
- **AND** the unavailable item is not rendered

<!-- trace:scenario id=g10.shared-store-cart.SC-dcr rev=1 -->
#### Scenario: shared-ui-store-cart-SC-50 - An item counts once whatever its quantity
**Serves:** shared-ui-store-cart-US-02 - Shopper reviews what the cart holds

- **GIVEN** a cart with 2 active items, one of quantity 3 and one of quantity 1
- **WHEN** `CartDrawer` renders while not loading
- **THEN** the header badge displays `2`

### Requirement: Dismissal and scroll lock

`CartDrawer` SHALL close when the shopper activates the close button, clicks the
dimmed backdrop overlay, or presses the <kbd>Escape</kbd> key. When open,
background body scrolling SHALL be prevented.

<!-- trace:scenario id=g10.shared-store-cart.SC-yb1 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-06 - Backdrop tap or Escape key
**Serves:** shared-ui-store-cart-US-04 - Shopper dismisses the cart drawer

- **GIVEN** an open cart drawer
- **WHEN** the backdrop overlay is clicked or the Escape key is pressed
- **THEN** the `onClose` callback is called

### Requirement: Scroll-fade on body overflow

When cart items exceed the visible body container, `CartDrawerBody` SHALL display
shadcn scroll-fade mask styling at the top and bottom edges to indicate scrollable content.

<!-- trace:scenario id=g10.shared-store-cart.SC-utr rev=1 -->
#### Scenario: shared-ui-store-cart-SC-07 - Overflowing items hint scrollability
**Serves:** shared-ui-store-cart-US-02 - Shopper reviews what the cart holds

- **GIVEN** a cart with overflowing items
- **WHEN** `CartDrawerBody` renders
- **THEN** the body container applies the `scroll-fade` utility class

### Requirement: Fetching status and price info on open with Boneyard skeletons

When the cart drawer opens, it SHALL request fresh product status and pricing
through `onFetchStatusAndPrice`, or follow a controlled `loading`. While
loading, the empty-cart empty state SHALL NOT render.

**Cart with lines** - While loading, each `CartItem`, the header item-count
badge, subtotal, discount amount, and estimated total SHALL render in a
Boneyard skeleton loading state, and the checkout button SHALL be disabled.

**Cart with no lines** - While loading, the body SHALL show neither rows nor
the empty state, the header item-count badge SHALL render its skeleton, and the
footer SHALL stay hidden.

**Unread cart** - The drawer cannot tell a cart nobody has read from an empty
one, so a consumer that has not yet read the cart's lines SHALL hold `loading`.
A consumer that has read the cart and found no lines SHALL NOT hold `loading`
for a status-and-price read that failed.

<!-- trace:scenario id=g10.shared-store-cart.SC-dvb rev=2 -->
#### Scenario: shared-ui-store-cart-SC-08 - Cart opened in loading state
**Serves:** shared-ui-store-cart-US-03 - Shopper opens the cart on current prices

- **GIVEN** an opening or loading cart drawer whose cart has lines
- **WHEN** `CartDrawer` renders while `loading` is true
- **THEN** cart items, the header count badge, subtotal, discount amount, and estimated total display Boneyard skeleton loaders
- **AND** the empty-cart empty state is not shown
- **AND** the checkout button is disabled

<!-- trace:scenario id=g10.shared-store-cart.SC-4pd rev=1 -->
#### Scenario: shared-ui-store-cart-SC-40 - Cart with no lines opened in loading state
**Serves:** shared-ui-store-cart-US-03 - Shopper opens the cart on current prices

- **GIVEN** a loading cart drawer whose cart has no lines
- **WHEN** `CartDrawer` renders while `loading` is true
- **THEN** the body shows neither item rows nor the empty-cart empty state
- **AND** the header count badge displays its Boneyard skeleton
- **AND** the footer is hidden entirely

<!-- trace:scenario id=g10.shared-store-cart.SC-etj rev=1 -->
#### Scenario: shared-ui-store-cart-SC-48 - A cart nobody has read never shows the empty state
**Serves:** shared-ui-store-cart-US-03 - Shopper opens the cart on current prices

- **GIVEN** a consumer that has never read the cart's lines, its first read still pending or failed
- **WHEN** the drawer is open
- **THEN** the consumer holds `loading`
- **AND** the empty-cart empty state is not shown
- **AND** the footer is hidden

<!-- trace:scenario id=g10.shared-store-cart.SC-25l rev=1 -->
#### Scenario: shared-ui-store-cart-SC-51 - A cart read empty shows the empty state when its price check fails
**Serves:** shared-ui-store-cart-US-03 - Shopper opens the cart on current prices

- **GIVEN** a consumer that has read the cart and found no lines
- **AND** its status-and-price read failed
- **WHEN** the drawer is open
- **THEN** the consumer does not hold `loading`
- **AND** the design-system empty state shows and the footer is hidden

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

<!-- trace:scenario id=g10.shared-store-cart.SC-jbs rev=1 -->
#### Scenario: shared-ui-store-cart-SC-10 - Delisted items clear after loading with one toast
**Serves:** shared-ui-store-cart-US-06 - Shopper opens a cart that held a delisted product

- **GIVEN** an open cart drawer whose status-and-price loading has finished
- **AND** the cart includes at least one item with status `unavailable` and at
  least one item that is not `unavailable`
- **WHEN** the drawer applies post-loading cleanup
- **THEN** each `unavailable` item is removed via `onRemoveItem`
- **AND** no `unavailable` item is shown as a cart row
- **AND** exactly one toast appears with the `unavailableItemsRemoved` message
- **AND** non-unavailable items remain in the cart

<!-- trace:scenario id=g10.shared-store-cart.SC-pvs rev=1 -->
#### Scenario: shared-ui-store-cart-SC-11 - No unavailable items means no removal toast
**Serves:** shared-ui-store-cart-US-06 - Shopper opens a cart that held a delisted product

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

<!-- trace:scenario id=g10.shared-store-cart.SC-ubk rev=1 -->
#### Scenario: shared-ui-store-cart-SC-09 - Shopper proceeds to checkout
**Serves:** shared-ui-store-cart-US-05 - Shopper proceeds from the cart to checkout

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

<!-- trace:scenario id=g10.shared-store-cart.SC-8f7 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-14 - Adjusted line shows the low-stock warning
**Serves:** shared-ui-store-cart-US-07 - Shopper edits a low-stock line and the warning quiets

- **GIVEN** a cart line with status `adjusted`
- **WHEN** `CartItem` renders
- **THEN** the low-stock warning copy is visible

<!-- trace:scenario id=g10.shared-store-cart.SC-lju rev=1 -->
#### Scenario: shared-ui-store-cart-SC-15 - Quantity change hides the warning
**Serves:** shared-ui-store-cart-US-07 - Shopper edits a low-stock line and the warning quiets

- **GIVEN** a cart line with status `adjusted` showing the low-stock warning
- **AND** the stepper can change quantity without removing the line
- **WHEN** the shopper changes the line’s quantity
- **THEN** the low-stock warning is no longer visible
- **AND** `onQuantityChange` is invoked with the new quantity

<!-- trace:scenario id=g10.shared-store-cart.SC-7il rev=1 -->
#### Scenario: shared-ui-store-cart-SC-16 - New adjusted status shows the warning again
**Serves:** shared-ui-store-cart-US-07 - Shopper edits a low-stock line and the warning quiets

- **GIVEN** a cart line that was `adjusted` and whose warning was hidden after
  a quantity change
- **WHEN** the line’s status becomes not `adjusted` and then `adjusted` again
- **THEN** the low-stock warning is visible again

### Requirement: A cart line's stepper stops at its supplied maximum

A line's stepper SHALL NOT invoke `onQuantityChange` with a quantity above the
maximum the consumer supplies for that line. At that maximum the increment
control SHALL be inoperable and SHALL be exposed as unavailable to assistive
technology.

Where the consumer supplies no maximum for a line, its stepper SHALL report
whatever quantity the shopper asks for. `CartItem` SHALL NOT derive a maximum
from the line's quantity or its status.

Decrement is unaffected at the maximum, and removal at quantity one SHALL go
on being reported as it is today.

<!-- trace:scenario id=g10.shared-store-cart.SC-zdl rev=1 -->
#### Scenario: shared-ui-store-cart-SC-17 - The stepper stops at the maximum
**Serves:** shared-ui-store-cart-US-08 - Shopper raises a line to the last unit the shop has

- **GIVEN** a line supplied with a quantity of `2` and a maximum of `2`
- **WHEN** the shopper activates its increment control
- **THEN** `onQuantityChange` is not invoked
- **AND** the control is exposed as unavailable

<!-- trace:scenario id=g10.shared-store-cart.SC-27k rev=1 -->
#### Scenario: shared-ui-store-cart-SC-18 - No maximum supplied
**Serves:** shared-ui-store-cart-US-08 - Shopper raises a line to the last unit the shop has

- **GIVEN** a line supplied with a quantity of `2` and no maximum
- **WHEN** the shopper activates its increment control
- **THEN** `onQuantityChange` is invoked with `3`

<!-- trace:scenario id=g10.shared-store-cart.SC-38a rev=1 -->
#### Scenario: shared-ui-store-cart-SC-19 - Decrement still works at the maximum
**Serves:** shared-ui-store-cart-US-08 - Shopper raises a line to the last unit the shop has

- **GIVEN** a line supplied with a quantity of `2` and a maximum of `2`
- **WHEN** the shopper activates its decrement control
- **THEN** `onQuantityChange` is invoked with `1`

### Requirement: A cart line displays a supplied remaining count

A line SHALL display a remaining count where the consumer supplies one for
that line, and none where the consumer supplies none. The count SHALL be
displayed as supplied: `CartItem` SHALL NOT derive it, format it, or decide
from it that a line is nearly out.

A line displaying the low-stock warning SHALL be able to display both, since
one says what was already changed and the other says what is left.

<!-- trace:scenario id=g10.shared-store-cart.SC-0n8 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-20 - A remaining count is displayed as supplied
**Serves:** shared-ui-store-cart-US-08 - Shopper raises a line to the last unit the shop has

- **GIVEN** a line supplied with a remaining count of `Only 2 left`
- **WHEN** the drawer is rendered
- **THEN** `Only 2 left` is displayed on that line
- **AND** no other remaining-count copy is shown

<!-- trace:scenario id=g10.shared-store-cart.SC-pvg rev=1 -->
#### Scenario: shared-ui-store-cart-SC-21 - No remaining count supplied
**Serves:** shared-ui-store-cart-US-08 - Shopper raises a line to the last unit the shop has

- **GIVEN** a line supplied with no remaining count
- **WHEN** the drawer is rendered
- **THEN** no remaining count is displayed on that line

### Requirement: The drawer lists items without placeholder slots

The drawer lists what the cart holds and nothing standing in for an item.

**Line items only** - `CartDrawer` SHALL render only the cart's line items.

**No placeholder slots** - It SHALL NOT render placeholder item slots.

**Overflow** - When items overflow the body, the list SHALL scroll.

<!-- trace:scenario id=g10.shared-store-cart.SC-e4c rev=1 -->
#### Scenario: shared-ui-store-cart-SC-23 - A cart with items lists only those items
**Serves:** shared-ui-store-cart-US-02 - Shopper reviews what the cart holds

- **GIVEN** a cart with 2 items
- **WHEN** `CartDrawer` renders
- **THEN** it renders the 2 items and no placeholder item slots

<!-- trace:scenario id=g10.shared-store-cart.SC-j31 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-24 - Overflowing items scroll
**Serves:** shared-ui-store-cart-US-02 - Shopper reviews what the cart holds

- **GIVEN** a cart with 6 items
- **WHEN** `CartDrawer` renders
- **THEN** all 6 items render and the list scrolls when they overflow

### Requirement: An empty cart shows the design-system empty state

An empty cart shows the empty state and hides what has nothing to show.

**Empty state** - When the cart holds 0 visible items and is not loading,
`CartDrawer` SHALL render the design-system `EmptyState` with a cart icon, the
consumer-supplied `emptyTitle`, and `emptyDescription` where the consumer
supplies one. Where no `emptyDescription` is supplied, the empty state SHALL
show the icon and title alone. `CartDrawerBody` SHALL do the same when it
receives no items and is not loading.

**Visible items** - A line with status `unavailable` is not a visible item, so
a cart holding only such lines SHALL show the empty state while the drawer
removes them with its one removal toast. A `soldOut` line is a visible item, so
a cart holding only sold-out lines SHALL list them and show the footer, not the
empty state.

**No action button** - The empty state SHALL NOT include an action button.

**Footer hidden** - While the empty state shows, the footer SHALL be hidden.

<!-- trace:scenario id=g10.shared-store-cart.SC-xfz rev=1 -->
#### Scenario: shared-ui-store-cart-SC-25 - Empty cart
**Serves:** shared-ui-store-cart-US-02 - Shopper reviews what the cart holds

- **GIVEN** a cart with no visible items
- **AND** drawer copy that supplies `emptyTitle` and `emptyDescription`
- **WHEN** `CartDrawer` renders while not loading
- **THEN** the design-system empty state shows a cart icon, `emptyTitle` and `emptyDescription`
- **AND** the empty state has no action button
- **AND** the item count badge in the header is hidden
- **AND** the footer is hidden entirely

<!-- trace:scenario id=g10.shared-store-cart.SC-62u rev=1 -->
#### Scenario: shared-ui-store-cart-SC-41 - Empty cart without a description
**Serves:** shared-ui-store-cart-US-02 - Shopper reviews what the cart holds

- **GIVEN** a cart with no visible items
- **AND** drawer copy that supplies `emptyTitle` and no `emptyDescription`
- **WHEN** `CartDrawer` renders while not loading
- **THEN** the design-system empty state shows a cart icon and `emptyTitle` and no description
- **AND** the empty state has no action button

<!-- trace:scenario id=g10.shared-store-cart.SC-gx1 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-44 - A body composed on its own shows the empty state
**Serves:** shared-ui-store-cart-US-02 - Shopper reviews what the cart holds

- **GIVEN** `CartDrawerBody` with no items, `emptyTitle` and `emptyDescription`
- **WHEN** it renders while not loading
- **THEN** the design-system empty state shows a cart icon, `emptyTitle` and `emptyDescription`
- **AND** the empty state has no action button

<!-- trace:scenario id=g10.shared-store-cart.SC-psl rev=1 -->
#### Scenario: shared-ui-store-cart-SC-42 - A cart of delisted lines ends empty
**Serves:** shared-ui-store-cart-US-06 - Shopper opens a cart that held a delisted product

- **GIVEN** an open cart drawer whose status-and-price loading has finished
- **AND** every cart item has status `unavailable`
- **WHEN** the drawer applies post-loading cleanup
- **THEN** each item is removed via `onRemoveItem`
- **AND** exactly one toast appears with the `unavailableItemsRemoved` message
- **AND** the design-system empty state appears and the footer is hidden
- **AND** the item count badge in the header is hidden

<!-- trace:scenario id=g10.shared-store-cart.SC-tou rev=1 -->
#### Scenario: shared-ui-store-cart-SC-45 - A cart of only sold-out lines is not empty
**Serves:** shared-ui-store-cart-US-02 - Shopper reviews what the cart holds

- **GIVEN** a cart whose every line has status `soldOut`
- **WHEN** `CartDrawer` renders while not loading
- **THEN** every line renders with its sold-out treatment
- **AND** the empty state is not shown
- **AND** the item count badge in the header is hidden
- **AND** the footer is shown
