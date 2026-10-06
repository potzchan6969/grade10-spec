**Author:** @tangconst - 2026-09-09

## Why

Catalogue photos of slabs and boxes are cropped in the listing tile well, so
the collectible is incomplete until the collector opens the product page.

Metric: ❓ product manager - R1 in `decisions.md`.

## What Changes

- **Full photo in the well** — every tile status fits the supplied image inside
  the square well without cropping. Leftover space is the well, not a cut
  edge. Sold-out stays faded
- Manual page [Product Listing Blocks](/p/shared/ui/store-product-listing)
  marks the outcome

## Non-Goals

- **Phone cart visibility** — `show-listing-cart-on-touch`
- **Sort defaults** — `default-listing-sort-to-latest`
- **No multiply on the photo** — `drop-product-listing-photo-multiply`
- **Sold-out hover** — `add-store-cross-sell` Q50
- **Boneyard skeleton re-capture**

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: the photo fits the well without cropping

## Impact

- **`@grade10/ui`** — `ProductCardImage` uses contain fit; Storybook stories
  show it
- **grade10 frontend** — the store listing (`ProductListingPage.tsx`) and the
  store home row (`StoreHomePage.tsx`) in `apps/frontend/grade10`, and the
  product page's You May Also Like rail (`ProductRelatedRail.tsx` in
  `packages/grade10-store`), take the change by submodule bump with no code
  change. The fit shipped ahead of acceptance (b632582fe) and is inside the
  application's pin, c1a6d0286
- **Overlap** — `add-store-cross-sell` Q50 owns hover on a sold-out tile.
  `drop-product-listing-photo-multiply` owns the photo drawn without multiply
  (Q3); this change adds no second requirement for it

## Open questions

- **Metric** — R1 in `decisions.md`, owed by the product manager

## References

- [Product Listing Blocks · Product Tile](../../../docs/prds/products/shared/ui/store-product-listing.md#product-tile)
