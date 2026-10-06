**Author:** @tangconst - 2026-09-09

## Why

Listing tiles multiply the photo against the well gradient. That helped white
studio fills read as transparent; on real catalogue assets it muddies the
image once photos letterbox.

## What Changes

- **Photo as supplied** - the photo draws as supplied in every tile
  status; a sold-out photo takes the sold-out treatment over it
- Manual page [Product Listing Blocks](/p/shared/ui/store-product-listing)
  marks the outcome

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: the photo is not blended into the well

## Impact

- **`@grade10/ui`** - `ProductCardImage` drops `mix-blend-multiply`; Storybook
  shows the result
- **grade10-site** - three surfaces take the change through the submodule pin,
  with no code of their own:
  - **Listing** - `apps/frontend/grade10/src/pages/store/ProductListingPage.tsx`,
    through `ProductBrowse`
  - **Store home row** - `apps/frontend/grade10/src/pages/store/StoreHomePage.tsx`,
    through `ProductCard`
  - **You May Also Like** - `packages/grade10-store/frontend/src/features/products/product/presentation/views/ProductRelatedRail.tsx`,
    through `StoreProductRelatedRail` and `ProductCard`

## Open questions

- R1 - whether the Product Card Image Figma frame is redrawn with the photo
  unblended; the designer answers it in `decisions.md`

## References

- [Product Listing Blocks · Product Tile](../../../docs/prds/products/shared/ui/store-product-listing.md#product-tile)
