## 1. Nav contract

- [x] 1.1 Make "Wishlist is not a header control" and "Only the supplied controls appear" pass — `Nav` no longer accepts or renders a wishlist control
- [x] 1.2 Make "Absent surfaces are absent controls" pass — the grade10 shell no longer names wishlist as a deferred header control

Verify: `pnpm run test:stories:design-system`, `pnpm run typecheck`.

## 2. Product tile contract

- [x] 2.1 Make "No wishlist control on a tile" pass — `ProductCard`, `ProductList`, `ProductBrowse`, and `ProductSummary` no longer accept or render a wishlist control

Verify: `pnpm run test:stories:ui`, `pnpm run typecheck`.

## 3. Preview assembly

Depends on groups 1 and 2.

- [x] 3.1 Drop the wishlist handler and label from the preview storefront assembly

Verify: `pnpm run lint`, `pnpm run typecheck`.
