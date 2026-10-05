# UI: Listing tile name activation

Storybook is the layout source of truth for the name activation affordance.
Figma Product Card stays the photo + name + prices frame; it does not draw an
always-underlined link.

## Screens

| Surface | Storybook (SoT) | Figma |
| --- | --- | --- |
| Product card — name activates with photo | [`ProductCard` → Named Once](?path=/story/store-product-listing-productcard--named-once) | [Product Card](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4200-155&m=dev) |
| Browse grid — name reachable when activation supplied | [`ProductBrowse` → Default](?path=/story/store-product-listing-productbrowse--default) | — |
| Preview listing → product detail via name | [`Pages/Store/Product List Page` → Default](?path=/story/pages-store-product-list-page--default) | — |

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `ProductCard` | `@grade10/ui` | Name is a control when `onClick` is supplied, unless the product is sold out on a tile that sells; hover / focus underline; the tile's one keyboard stop, the photo a pointer target only |
| `ProductList`, `ProductBrowse`, `ProductResultsPanel` | `@grade10/ui` | Pass through `onProductClick`; no new export |
| `ProductCardImage` | `@grade10/ui` | Photo opens on a pointer press only; no keyboard stop and not announced, so the cart control is the first stop inside it |

### Work in this repo

- Name control lives on `ProductCard` in `packages/ui`
- No new design-system primitive, variant, or token

## States

| State | Spec scenario | Story |
| --- | --- | --- |
| Name activates with photo | `shared-ui-store-product-listing-SC-87` | [Named Once](?path=/story/store-product-listing-productcard--named-once), [ProductBrowse Default](?path=/story/store-product-listing-productbrowse--default) |
| Sold-out tile inert where it sells — name plain text, no underline, no focus | `shared-ui-store-product-listing-SC-88` | [`ProductCard` → Sold Out](?path=/story/store-product-listing-productcard--sold-out) |
| No callback — name and photo inert | `shared-ui-store-product-listing-SC-89` | Omit `onClick` / `onProductClick` in isolation stories |
| Sold-out tile opens where it does not sell | `shared-ui-store-product-listing-SC-94` | [`ProductCard` → Sold Out Opens Where Nothing Sells](?path=/story/store-product-listing-productcard--sold-out-opens-where-nothing-sells) |
| One keyboard stop — Tab reaches the name and the cart, not the photo | `shared-ui-store-product-listing-SC-95` | [`ProductCard` → Named Once](?path=/story/store-product-listing-productcard--named-once) |
| The name shows that it opens — underline on hover and focus; plain at rest | `shared-ui-store-product-listing-SC-96` | [`ProductCard` → Named Once](?path=/story/store-product-listing-productcard--named-once) |
