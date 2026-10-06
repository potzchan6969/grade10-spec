# UI: Product card photo fit

Layout SoT: Storybook `Store Product Listing/ProductCardImage` (and tiles on
`ProductBrowse`). Historical Figma:
[Product Card Image](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074).

## Screens

### Product card image well

| Surface | Storybook (SoT) | Figma (historical) |
| --- | --- | --- |
| Non-square photo — available, on sale, sold out, in cart | 🚧 `ProductCardImage` → Non Square Photo, a portrait fixture beside `product-card.fixture.png`; the page's `::story` "The full photo in the well" moves to it once it is built | [Product Card Image](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074&m=dev) |
| Available | [`ProductCardImage` → Default](?path=/story/store-product-listing-productcardimage--default) | — |
| On sale | [`ProductCardImage` → Sale](?path=/story/store-product-listing-productcardimage--sale) | — |
| Sold out (inert, listing) | [`ProductCardImage` → Sold Out](?path=/story/store-product-listing-productcardimage--sold-out) | — |
| In cart | [`ProductCardImage` → In Cart](?path=/story/store-product-listing-productcardimage--in-cart) | — |

The existing stories use a square photo, so fit and crop look the same in
them; only the Non Square Photo story shows the well filling the rest.

Sold-out that still opens, including hover scale: `add-store-cross-sell` Q50,
[`ProductCardImage` → Sold Out With Handler](?path=/story/store-product-listing-productcardimage--sold-out-with-handler). Not this change.

## Components

- `ProductCardImage` from `@grade10/ui` — contain fit; the well's gradient
  fills the rest; no multiply blend (SC-64 on
  `drop-product-listing-photo-multiply`); sold-out fade unchanged; hover scale
  unchanged
- `ProductCard` from `@grade10/ui` — composes the image; unchanged export

No new primitive, variant, token, or compound export.

## States

| State | Closes |
| --- | --- |
| Non-square photo, any status: available, sale, sold-out, in cart — whole photo visible, well fills the rest | `shared-ui-store-product-listing-SC-63` |
| Sold-out that opens, photo grows on hover | **Out of suite:** `add-store-cross-sell` Q50 |
| Photo drawn as supplied, no multiply | **Out of suite:** `shared-ui-store-product-listing-SC-64` on `drop-product-listing-photo-multiply` |
