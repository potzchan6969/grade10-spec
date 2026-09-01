## Purpose

When a cart line's product has left the catalogue, the drawer drops it after open loading and tells the collector once, rather than showing a sold-out row for something no longer sold.

## Feature set

- Cart refresh cleanup
  - Unavailable line removal: Drop delisted catalogue lines after open loading without showing a sold-out row.
  - Single removal toast: Tell the collector once when any such line left the cart on that open.
- Cart item contract
  - Unavailable status: Mark a line whose product is no longer in the store catalogue, distinct from sold out and adjusted.
  - Toast copy field: Carry the removal message on drawer copy the consumer supplies.

## User journeys

### store-cart-US-06: Shopper opens a cart that held a delisted product

**As a** shopper,
**I want** a product that left the catalogue to disappear after the drawer finishes loading, with one toast,
**so that** I am not shown a sold-out row for something the store no longer sells.

**Accepted by:**

- `store-cart-SC-01` — An application imports the cart drawer
- `store-cart-SC-10` — Delisted items clear after loading with one toast
- `store-cart-SC-11` — No unavailable items means no removal toast
- `store-cart-SC-12` — Status values are the four named states
- `store-cart-SC-13` — Drawer copy carries the unavailable-removal toast message

## ADDED Requirements

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

## MODIFIED Requirements

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
