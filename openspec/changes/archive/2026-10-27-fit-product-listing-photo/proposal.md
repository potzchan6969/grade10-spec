**Author:** @tangconst - 2026-09-09

## Why

Catalogue photos of slabs and boxes are cropped in the listing tile well, so
the collectible is incomplete until the collector opens the product page.

Metric: none - the tile draws the photo it is given (Q7 in `decisions.md`).

## What Changes

- **Whole photo in the well** - every tile status shows the whole supplied
  photo inside the square well. Leftover space is the well, not a cut edge, and
  a photo that reaches into the well's rounded corners rounds with them.
  Sold-out stays faded
- Manual page [Product Listing Blocks](/p/shared/ui/store-product-listing)
  marks the outcome

## Non-Goals

- **Phone cart visibility** - `show-listing-cart-on-touch`
- **Sort defaults** - `default-listing-sort-to-latest`
- **Photo drawn without multiply** - `drop-product-listing-photo-multiply`
- **Sold-out hover** - `add-store-cross-sell` Q50
- **Boneyard skeleton re-capture**

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: the photo fits the well without cropping

## Impact

- **`@grade10/ui`** - `ProductCardImage` uses contain fit; Storybook stories
  show it
- **grade10 frontend** - the store listing (`ProductListingPage.tsx`) and the
  store home row (`StoreHomePage.tsx`) in `apps/frontend/grade10`, and the
  product page's You May Also Like rail (`ProductRelatedRail.tsx` in
  `packages/grade10-store`), take the change by submodule bump with no code
  change. The fit shipped ahead of acceptance (b632582fe) and is inside the
  application's pin
- **Overlap** - `add-store-cross-sell` Q50 owns hover on a sold-out tile.
  `drop-product-listing-photo-multiply`, its Q1, owns the photo drawn without
  multiply (Q3); this change adds no second requirement for it

## References

- [Product Listing Blocks · Product Tile](../../../docs/prds/products/shared/ui/store-product-listing.md#product-tile)
