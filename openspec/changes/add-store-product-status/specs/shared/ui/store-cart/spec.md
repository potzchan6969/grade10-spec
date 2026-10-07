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
