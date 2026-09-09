## MODIFIED Requirements

### Requirement: The store cart drawer exports

The shared UI package SHALL export, from its public entry, exactly these
components for the store cart surface: `CartDrawer`, `CartDrawerHeader`,
`CartDrawerBody`, `CartDrawerFooter`, `CartItem` — and exactly these types:
`CartDrawerProps`, `CartDrawerCopy`, `CartDrawerHeaderProps`,
`CartDrawerHeaderCopy`, `CartDrawerBodyProps`, `CartDrawerFooterProps`,
`CartDrawerFooterCopy`, `CartItemProps`, `CartItemCopy`,
`CartItemStatus`, `CartItemSummary`, and `PromoState`.

The package SHALL NOT export `CartItemSlot` or `CartItemSlotProps`.

`CartDrawerCopy` SHALL include `unavailableItemsRemoved` for the toast shown
when unavailable lines are cleared after open loading, and `emptyTitle` (with
optional `emptyDescription`) for the empty-cart state.

#### Scenario: shared-ui-store-cart-SC-01 - An application imports the cart drawer

- **WHEN** an application imports any export named above from the shared UI package's public entry
- **THEN** the import resolves without error

#### Scenario: shared-ui-store-cart-SC-13 - Drawer copy carries the unavailable-removal toast message

- **WHEN** a consumer supplies `CartDrawerCopy`
- **THEN** the copy includes `unavailableItemsRemoved`

#### Scenario: shared-ui-store-cart-SC-22 - Drawer copy carries the empty-cart title

- **WHEN** a consumer supplies `CartDrawerCopy`
- **THEN** the copy includes `emptyTitle`

### Requirement: Fetching status and price info on open with Boneyard skeletons

When the cart drawer opens, it SHALL fetch fresh product status and pricing data.
During fetching (or when `loading` is active), each `CartItem`, the header item-count
badge, subtotal, discount amount, and estimated total SHALL render in a Boneyard
skeleton loading state. The empty-cart empty state SHALL NOT render while
loading, and the checkout button SHALL be disabled.

#### Scenario: shared-ui-store-cart-SC-08 - Cart opened in loading state

- **GIVEN** an opening or loading cart drawer
- **WHEN** `CartDrawer` renders while `loading` is true
- **THEN** cart items, the header count badge, subtotal, discount amount, and estimated total display Boneyard skeleton loaders
- **AND** the empty-cart empty state is not shown
- **AND** the checkout button is disabled

## ADDED Requirements

### Requirement: The drawer lists items without placeholder slots

`CartDrawer` SHALL render only the cart's line items. It SHALL NOT render
placeholder item slots. When items overflow the body, the list SHALL scroll.

#### Scenario: shared-ui-store-cart-SC-02 - A cart with items lists only those items

- **GIVEN** a cart with 2 items
- **WHEN** `CartDrawer` renders
- **THEN** it renders the 2 items and no placeholder item slots

#### Scenario: shared-ui-store-cart-SC-03 - Overflowing items scroll

- **GIVEN** a cart with 6 items
- **WHEN** `CartDrawer` renders
- **THEN** all 6 items render and the list scrolls when they overflow

### Requirement: An empty cart shows the design-system empty state

When the cart holds 0 visible items and is not loading, `CartDrawer` SHALL
render the design-system `EmptyState` with the consumer-supplied `emptyTitle`
and optional `emptyDescription`. The empty state SHALL NOT include an action
button. The header item-count badge and the footer SHALL be hidden.

#### Scenario: shared-ui-store-cart-SC-04 - Empty cart

- **GIVEN** a cart with 0 items
- **WHEN** `CartDrawer` renders while not loading
- **THEN** the design-system empty state appears with `emptyTitle`
- **AND** the empty state has no action button
- **AND** the item count badge in the header is hidden
- **AND** the footer is hidden entirely

## REMOVED Requirements

### Requirement: The drawer displays a minimum 5-row baseline

**Reason:** Placeholder `CartItemSlot` rows read as incomplete actions and force
hosts to invent a browse handoff the empty cart should not own. Empty carts use
`EmptyState` instead; non-empty carts list items only.

**Migration:** Replaced by "The drawer lists items without placeholder slots"
and "An empty cart shows the design-system empty state". Drop `CartItemSlot`
imports, `onBrowseMore`, and `emptySlotCount`. Supply `emptyTitle` on
`CartDrawerCopy`. Scenario ids `SC-02`–`SC-04` keep their numbers under the new
requirements.
