# UI: Listing cart on touch and narrow viewports

Layout SoT: Storybook `Store Product Listing/ProductCardImage` and
`ProductBrowse` at a narrow width. Historical Figma:
[Product Card Image](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074).

## Screens

- Product card image — Storybook `ProductCardImage`, `ProductBrowse` Narrow

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `ProductCardImage` | `@grade10/ui` | **Delta:** coarse / `hover:none` and `max-lg` keep cart visible; fine pointer on a wide viewport still hover + focus-within |

## States

| State | Spec scenario |
| --- | --- |
| Coarse / no-hover cart visible | `shared-ui-store-product-listing-SC-65` |
| Narrow viewport cart visible | `shared-ui-store-product-listing-SC-66` |
| Fine pointer hover / keyboard (wide) | existing `SC-51` |
| Does not sell | existing `SC-55` |
