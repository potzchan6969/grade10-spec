# shared/ui/store-cart Specification

## Purpose

The shopping cart drawer: a slide-out drawer listing the cart's items, or the
design-system empty state when it holds nothing, with a price summary,
collapsible promo code redemption and a checkout CTA.

## Feature set

- Drawer export contract
  - Empty copy fields: carries the empty-cart title and optional description on the drawer copy and body props the consumer supplies
- Cart contents
  - Items only: the drawer lists what the cart holds and nothing standing in for an item
  - Empty state: an empty cart shows the design-system empty state with no action
  - Item count badge: tells the shopper how many active items the cart holds, leaving out sold-out and unavailable lines
  - Scroll-fade on overflow: shows there is more above or below the visible items

## REMOVED Feature set

- Cart contents display

## MODIFIED Requirements

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

## ADDED Requirements

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

## REMOVED Requirements

### Requirement: The drawer displays a minimum 5-row baseline

**Reason:** Placeholder `CartItemSlot` rows read as incomplete actions and force
hosts to invent a browse handoff the empty cart should not own. Empty carts use
`EmptyState` instead; non-empty carts list items only.

**Migration:** Replaced by "The drawer lists items without placeholder slots"
and "An empty cart shows the design-system empty state". Drop `CartItemSlot`
imports, `onBrowseMore`, and `emptySlotCount`. Supply `emptyTitle` on
`CartDrawerCopy`. Its scenarios, shared-ui-store-cart-SC-02 to
shared-ui-store-cart-SC-04, retire with it; a test citing one cites
`shared-ui-store-cart-SC-23`, `shared-ui-store-cart-SC-24` or
`shared-ui-store-cart-SC-25` instead.
