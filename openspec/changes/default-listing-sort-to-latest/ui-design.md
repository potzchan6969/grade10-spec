# UI: Listing sort at rest

Layout SoT: Storybook `Store Product Listing/ProductBrowse` and
`ProductListHeader`. Historical Figma:
[Product List Header](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-14117).

## Screens

- Product browse header — Storybook `ProductListHeader` / `ProductBrowse`

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `ProductListHeader` | `@grade10/ui` | Trigger copy supplied as `Sort by <option>` |
| `ProductBrowse` | `@grade10/ui` | Passes sort options and value through |

Fixtures: Latest, Lowest price, Highest price; resting `sortValue` latest;
no Popularity.

## States

| State | Spec scenario |
| --- | --- |
| Menu without popularity | `grade10-site-store-product-listing-SC-15` |
| Resting latest selected | `grade10-site-store-product-listing-SC-22` |
