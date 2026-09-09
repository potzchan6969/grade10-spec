# UI: Product card photo fit

Layout SoT: Storybook `Store Product Listing/ProductCardImage` (and tiles on
`ProductBrowse`). Historical Figma:
[Product Card Image](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074).

## Screens

- Product card image well — Storybook `ProductCardImage` / `ProductCard`

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `ProductCardImage` | `@grade10/ui` | **Delta:** `object-contain`; letterbox on well gradient; sold-out full photo faded, no hover scale |
| `ProductCard` | `@grade10/ui` | Composes the image; unchanged export |

## States

| State | Spec scenario |
| --- | --- |
| Non-square photo, any status | `shared-ui-store-product-listing-SC-63` |
| Sold-out, no hover scale | `shared-ui-store-product-listing-SC-66` |
| Sale / in-cart / no image | existing `SC-46`–`SC-55` |
