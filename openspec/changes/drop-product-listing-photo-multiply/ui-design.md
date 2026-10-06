# UI: Product card photo as supplied

## Screens

### Product card image well

| Surface | Storybook (SoT) | Figma (historical) |
| --- | --- | --- |
| Available | [`ProductCardImage` → Default](?path=/story/store-product-listing-productcardimage--default) | [Product Card Image](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074) |
| On sale | [`ProductCardImage` → Sale](?path=/story/store-product-listing-productcardimage--sale) | none |
| In cart | [`ProductCardImage` → In Cart](?path=/story/store-product-listing-productcardimage--in-cart) | none |
| Sold out, where the tile sells | [`ProductCardImage` → Sold Out](?path=/story/store-product-listing-productcardimage--sold-out) | none |
| Sold out, where nothing sells | [`ProductCardImage` → Sold Out With Handler](?path=/story/store-product-listing-productcardimage--sold-out-with-handler) | none |

The Figma frame still draws the photo multiplied. Whether the designer redraws
it is open (R1).

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `ProductCardImage` | `@grade10/ui` | Unchanged export; the photo drops `mix-blend-multiply` |

No new primitive, variant, token or catalog key.

## States

### Product card image well

| State | Shows | Anchor | Closes |
| --- | --- | --- | --- |
| Available | Photo as supplied; a white fill stays white in the grey well | `Tile contract` | `shared-ui-store-product-listing-SC-64` |
| On sale | Photo as supplied; a white fill stays white in the grey well | `Tile contract` | `shared-ui-store-product-listing-SC-64` |
| In cart | Photo as supplied; a white fill stays white in the grey well | `Tile contract` | `shared-ui-store-product-listing-SC-64` |
| Sold out | Photo as supplied, under the sold-out treatment | `Tile contract` | `shared-ui-store-product-listing-SC-64a` |
