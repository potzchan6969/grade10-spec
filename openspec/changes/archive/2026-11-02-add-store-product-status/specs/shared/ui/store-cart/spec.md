## Feature set

- Drawer export contract
  - Unavailable status: marks a line whose product left the store's sales channel or whose variant no longer exists, distinct from sold out and adjusted

## MODIFIED Requirements

### Requirement: Cart item status includes unavailable

`CartItemStatus` SHALL be exactly `default`, `adjusted`, `soldOut`, and
`unavailable`. The consumer SHALL assign each line the status its cart review
answers; for Grade10, `grade10-site/store/cart-validation` decides it.

| Status | Meaning |
| --- | --- |
| `default` | The shop can fill the line as it stands |
| `adjusted` | The quantity was reduced to what the shop can fill; the row stays visible |
| `soldOut` | The shop no longer offers the variant for sale; the row stays visible with sold-out treatment |
| `unavailable` | The product left the store's sales channel, or the variant no longer exists; removed after open loading |

<!-- trace:scenario id=g10.shared-store-cart.SC-0wv rev=1 -->
#### Scenario: shared-ui-store-cart-SC-12 - Status values are the four named states
**Serves:** shared-ui-store-cart-US-06 - Shopper opens a cart that held a delisted product

- **WHEN** a consumer assigns `CartItemStatus` on a cart line
- **THEN** the allowed values are only `default`, `adjusted`, `soldOut`, and
  `unavailable`

### Requirement: Unavailable items are removed silently after open loading

After the cart drawer finishes its open status-and-price loading, every line
whose status is `unavailable` SHALL be removed from the cart through
`onRemoveItem` and SHALL NOT render as a cart row (including sold-out
treatment). When one or more such lines are removed on that open, `CartDrawer`
SHALL show exactly one toast whose message is the consumer-supplied
`unavailableItemsRemoved` copy. When no line is `unavailable`, `CartDrawer`
SHALL NOT show that toast.

`unavailable` means what `Cart item status includes unavailable` states. It is
not `soldOut` and not `adjusted`.

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
