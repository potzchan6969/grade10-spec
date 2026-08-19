# UI: remove wishlist control

## Screens

- [Nav `4171:9937`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9937)
  — mapped by `packages/design-system/src/components/layout/nav.figma.ts`.
  The published set still draws a heart; code no longer renders one.
- [Product Card `4200:155`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4200-155)
  — mapped by `packages/ui/src/blocks/store-product-listing/product-card.figma.ts`.
  The published set still draws a heart on available tiles; code no longer
  renders one.

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `Nav` | `@grade10/design-system` | **BREAKING:** `onWishlistClick` and `wishlistLabel` removed. Search, account, and cart stay handler-gated. |
| `ProductCard` | `@grade10/ui` | **BREAKING:** `onWishlistClick` and `wishlistLabel` removed. |
| `ProductList` | `@grade10/ui` | **BREAKING:** `onProductWishlistClick` removed. |
| `ProductBrowse` | `@grade10/ui` | **BREAKING:** `onProductWishlistClick` removed. |
| `ProductSummary` | `@grade10/ui` | **BREAKING:** `wishlistLabel` removed. |

No new component, variant, or token.

## States

| State | Spec scenario |
| --- | --- |
| Header with no wishlist control | Wishlist is not a header control |
| Header showing only the supplied controls | Only the supplied controls appear; Absent surfaces are absent controls |
| Available product tile with no heart | No wishlist control on a tile |
| Sold-out product tile with no heart | No wishlist control on a tile; A sold-out product |
