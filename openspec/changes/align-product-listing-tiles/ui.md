# UI: align product listing tiles

## Screens

### Product listing page — tile region only

[Product Listing `4098:1868`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868)
— the page frame is linked for where the grid sits. Nav, the unpublished
filter tree, the list header pills, pagination, and Footer are out of scope.

### Product card

[Product / Product Card `4200:155`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4200-155)
— `soldOut=false` and `soldOut=true`. Image, badge slot, name, price. Mapped
in code by `packages/ui/src/blocks/store-product-listing/product-card.figma.ts`
(rewritten in this change).

### Product card image

[Product / Product Card Image `4274:10074`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074)
— `state`, `inCart`, `soldOut`, plus BOOLEAN `sale`. Figma does not draw
`soldOut` with `inCart` or `hover`. New Code Connect template in this change.

### Status indicator

[StatusIndicator `4174:37`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4174-37)
— `type` (`dot` | `count`) and `variant` (`default` | `error` | `brand`). The
in-cart count is `count` / `brand`. New primitive in this change.

## Components

From `@grade10/design-system`:

- `Badge` — sale overlay (`brand`), sold-out overlay (`default`), and the
  consumer-supplied `cardProps` slot. Size `sm`. `outline` and `brand` are
  Figma variant options this change maps.
- `IconButton` — cart control. **Changes in this repo:** add Figma rungs
  `variant="secondary"` and `size="md"`. Keep `outline`, `ghost`, `sm`, `xs`.
- `StatusIndicator` — **new in this repo.** `type` and `variant` as above.
  Count contents are the `label` TEXT property, supplied as children.

From `@grade10/ui`:

- `ProductCardImage`, `ProductCardImageProps` — **new.**
- `ProductCard`, `ProductCardProps` — **breaking rewrite.**
- `ProductList`, `ProductListProps`, `ProductSummary` — **breaking** to the
  new tile fields; grid breakpoints unchanged.
- `ProductBrowse`, `ProductBrowseProps` — drop wishlist and quantity-stepper
  callbacks only.

Unchanged in this change: `FilterPanel`, `ProductListHeader`,
`CollectionBanner`, `Pagination`.

## States

### Product card image

| State | Spec scenario |
| --- | --- |
| Photo supplied | `The product card image displays photo, sale, sold-out, and cart overlay` |
| No photo — empty well | `No image source` |
| Sale label on an available product | `A sale label is displayed as supplied` |
| Sold out — dimmed, SOLD OUT, no cart | `A sold-out product` (image requirement) |
| In cart — control + supplied count | `An in-cart count is displayed as supplied` |
| Available, not in cart, rest — no cart control | `A cart action is reported, not performed` (control hidden until hover/focus) |
| Available, not in cart, hover or focus — cart control | `Keyboard reveals the cart control` |
| Cart activation reported, display unchanged | `A cart action is reported, not performed` |
| Rendered without a card | `The image is reused alone` |

### Product card / product list

| State | Spec scenario |
| --- | --- |
| Badges, name, current and original price | `Prices are displayed as supplied`, `Badges are displayed as supplied` |
| Current price only | `No original price` |
| Sold out copy uses disabled treatment | `A sold-out product` (list requirement) |
| Four / two / one columns | `Desktop viewport`, `Narrow viewport` (unchanged) |
