# UI: Listing tile name activation

Storybook is the layout source of truth for the name activation affordance.
Figma Product Card stays the photo + name + prices frame; it does not draw an
always-underlined link.

## Screens

| Surface | Storybook (SoT) | Figma |
| --- | --- | --- |
| Product card - name activates with photo | [`ProductCard` → Named Once](?path=/story/store-product-listing-productcard--named-once) | [Product Card](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4200-155&m=dev) |
| Browse grid - name reachable when activation supplied | [`ProductBrowse` → Default](?path=/story/store-product-listing-productbrowse--default) | - |
| Preview listing → product detail via name | [`Pages/Store/Product List Page` → Default](?path=/story/pages-store-product-list-page--default) | - |

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `ProductCard` | `@grade10/ui` | Name is a control when `onClick` or `href` is supplied, unless the product is sold out on a tile that sells; underline on hover and on keyboard focus; the tile's one keyboard stop that opens the product, the photo a pointer target only |
| `ProductList`, `ProductBrowse`, `ProductResultsPanel` | `@grade10/ui` | Pass through `onProductClick`; no new export |
| `ProductCardImage` | `@grade10/ui` | Inside a `ProductCard`, the photo opens on a pointer press only, with no keyboard stop and no announcement, so the cart control is the first stop inside it; used alone, it opens where a tile would and keeps its own named, focusable control |

### Work in this repo

- Name control lives on `ProductCard` in `packages/ui`
- No new design-system primitive, variant, or token

## States

| State | Spec scenario | Story |
| --- | --- | --- |
| Name activates with photo | `shared-ui-store-product-listing-SC-87` | [Named Once](?path=/story/store-product-listing-productcard--named-once), [ProductBrowse Default](?path=/story/store-product-listing-productbrowse--default) |
| Sold-out tile inert where it sells, callback and address alike - name plain text, no underline, no focus, no link | `shared-ui-store-product-listing-SC-88` | [`ProductCard` → Sold Out](?path=/story/store-product-listing-productcard--sold-out) |
| No callback and no address - name and photo inert | `shared-ui-store-product-listing-SC-89` | [`ProductCard` → Inert](?path=/story/store-product-listing-productcard--inert) |
| An address and no callback - the name is a link | `shared-ui-store-product-listing-SC-100` | [`ProductCard` → Address Only](?path=/story/store-product-listing-productcard--address-only) |
| Sold-out tile opens where it does not sell | `shared-ui-store-product-listing-SC-97` | [`ProductCard` → Sold Out Opens Where Nothing Sells](?path=/story/store-product-listing-productcard--sold-out-opens-where-nothing-sells) |
| Keyboard reveals the cart control - focus moving into the image shows the cart control, which keeps its own stop | `shared-ui-store-product-listing-SC-51` | [`ProductCard` → Named Once](?path=/story/store-product-listing-productcard--named-once) |
| One stop to open - Tab opens the product from the name alone; the cart keeps its own stop, the photo has none | `shared-ui-store-product-listing-SC-98` | [`ProductCard` → Named Once](?path=/story/store-product-listing-productcard--named-once) |
| The name shows that it opens - underline on hover and on keyboard focus; plain at rest | `shared-ui-store-product-listing-SC-99` | [`ProductCard` → Named Once](?path=/story/store-product-listing-productcard--named-once) |
| The image used alone opens where a tile would, as its own stop named for the product; sold out with a cart handler, no control | `shared-ui-store-product-listing-SC-101` | [`ProductCardImage` → Opens Alone](?path=/story/store-product-listing-productcardimage--opens-alone), [`ProductCardImage` → Sold Out Where It Sells](?path=/story/store-product-listing-productcardimage--sold-out-where-it-sells) |
