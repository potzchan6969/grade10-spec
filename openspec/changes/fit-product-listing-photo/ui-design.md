# UI: Product card photo fit

Layout SoT: Storybook `Store Product Listing/ProductCardImage` (and tiles on
`ProductBrowse`). Historical Figma:
[Product Card Image](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074).

## Screens

### Product card image well

| Surface | Storybook (SoT) | Figma (historical) |
| --- | --- | --- |
| Non-square photo: portrait in available, on sale, sold out and in cart; landscape and a small portrait, available | 🚧 `ProductCardImage` → Non Square Photo, six wells side by side, its fixtures beside `product-card.fixture.png`; the page's `::story` "The whole photo in the well" moves to it once it is built | [Product Card Image](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074&m=dev) |
| Available, a square photo filling the well | [`ProductCardImage` → Default](?path=/story/store-product-listing-productcardimage--default) | — |
| On sale | [`ProductCardImage` → Sale](?path=/story/store-product-listing-productcardimage--sale) | — |
| Sold out (inert, listing) | [`ProductCardImage` → Sold Out](?path=/story/store-product-listing-productcardimage--sold-out) | — |
| In cart | [`ProductCardImage` → In Cart](?path=/story/store-product-listing-productcardimage--in-cart) | — |

The four single-status stories keep their square photo, which fills the well;
`Default`'s play test reads it at all four edges, its corners rounded with the
well's. Only the Non Square Photo story shows the well filling the rest.

The Figma frame draws a square photo, which looks the same whole or cropped,
so this change needs no redraw and acceptance does not wait on it. The frame's
redraw is handed to the redraw-store-product-card-frames change by
`drop-product-listing-photo-multiply`, its Q2.

Sold-out that still opens, including hover scale: `add-store-cross-sell` Q50,
[`ProductCardImage` → Sold Out With Handler](?path=/story/store-product-listing-productcardimage--sold-out-with-handler). Not this change.

## Components

- `ProductCardImage` from `@grade10/ui` - contain fit; the well's gradient
  fills the rest; drawn without multiply, as `drop-product-listing-photo-multiply`
  Q1 decides for every tile status; sold-out fade unchanged; hover scale
  unchanged
- `ProductCard` from `@grade10/ui` - composes the image; unchanged export

No new primitive, variant, token, or compound export.

## States

### Product card image well

| State | Shows | Anchor | Closes |
| --- | --- | --- | --- |
| Portrait, available | Whole photo, centred, top and bottom at the well's edges; the well beside it | `Tile contract` | `shared-ui-store-product-listing-SC-63` |
| Portrait, on sale | Whole photo, centred, top and bottom at the well's edges; the well beside it | `Tile contract` | `shared-ui-store-product-listing-SC-63` |
| Portrait, sold out | Whole photo, faded, centred, top and bottom at the well's edges; the well beside it | `Tile contract` | `shared-ui-store-product-listing-SC-63` |
| Portrait, in cart | Whole photo, centred, top and bottom at the well's edges; the well beside it | `Tile contract` | `shared-ui-store-product-listing-SC-63` |
| Landscape, available | Whole photo, centred, left and right at the well's edges; the well above and below it | `Tile contract` | `shared-ui-store-product-listing-SC-63` |
| Small portrait, available | Whole photo, enlarged until top and bottom meet the well's edges, centred; the well beside it | `Tile contract` | `shared-ui-store-product-listing-SC-63` |
| Square, available | Whole photo at all four edges, its corners rounded with the well's | `Tile contract` | `shared-ui-store-product-listing-SC-63a` |
| Available, hovered | The photo grows; the well may cut its edges until the pointer leaves | `Tile contract` | **Out of suite:** a permission, not an outcome (Q4) |
| Sold-out that opens, photo grows on hover | The sold-out photo grows on hover | `Tile contract` | **Out of suite:** `add-store-cross-sell` Q50 |
| Photo drawn as supplied, no multiply | The photo as the shop supplied it, not blended into the well | `Tile contract` | **Out of suite:** the requirement on `drop-product-listing-photo-multiply`, its Q1 |
