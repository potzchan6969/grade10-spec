**Author:** @tangconst - 2026-09-09

## Why

Listing tiles multiply the photo against the well gradient. That helped white
studio fills read as transparent; on real catalogue assets it muddies the
image once photos letterbox.

## What Changes

- **No multiply on the photo** — the image draws as supplied over the well
  gradient
- Manual page [Product Listing Blocks](/p/shared/ui/store-product-listing)
  marks the outcome

## Non-Goals

- **Photo fit / crop** — `fit-product-listing-photo`
- **Phone cart** — `show-listing-cart-on-touch`
- **Sort** — `default-listing-sort-to-latest`

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: the photo is not multiply-blended

## Impact

- **`@grade10/ui`** — `ProductCardImage` drops `mix-blend-multiply`; Storybook
  shows the result
- **Scenario id** — SC-64

## Open questions

- none — Q1 is in `decisions.md`

## References

- [Product Listing Blocks · Product Tile](../../../docs/prds/products/shared/ui/store-product-listing.md#product-tile)
