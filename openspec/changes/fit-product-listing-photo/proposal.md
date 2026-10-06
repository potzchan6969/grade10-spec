**Author:** @tangconst - 2026-09-09

## Why

Catalogue photos of slabs and boxes are cropped in the listing tile well, so
the collectible is incomplete until the collector opens the product page.

Metric: listing sessions where the full product is visible on the tile without
opening the PDP. Unmeasured; this change sets the baseline.

## What Changes

- **Full photo in the well** — every tile status fits the supplied image inside
  the square well without cropping. Leftover space is the well, not a cut
  edge. The photo is not multiplied onto the well; that SHALL is
  `drop-product-listing-photo-multiply`. Sold-out stays faded. Hover scale on
  a sold-out tile that still opens stays with `add-store-cross-sell` Q50
- Manual page [Product Listing Blocks](/p/shared/ui/store-product-listing)
  marks the outcome

## Non-Goals

- **Phone cart visibility** — `show-listing-cart-on-touch`
- **Sort defaults** — `default-listing-sort-to-latest`
- **Sold-out hover scale** — `add-store-cross-sell` Q50
- **Boneyard skeleton re-capture**

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: the photo fits the well without cropping

## Impact

- **`@grade10/ui`** — `ProductCardImage` uses contain fit; Storybook stories
  show it
- **Overlap** — `drop-product-listing-photo-multiply` folds no multiply
  (SC-64); `add-store-cross-sell` Q50 owns hover scale on a sold-out tile
  that opens. Dev narrows or drops this change's SC-90 so it does not reverse
  Q50, and does not add a second no-multiply requirement.

## Open questions

- none — Q1–Q3 are in `decisions.md`

## References

- [Product Listing Blocks · Product Tile](../../../docs/prds/products/shared/ui/store-product-listing.md#product-tile)
