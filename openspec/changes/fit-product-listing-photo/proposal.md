**Author:** @tangconst - 2026-09-09

## Why

Catalogue photos of slabs and boxes are cropped in the listing tile well, so
the collectible is incomplete until the collector opens the product page.

Metric: listing sessions where the full product is visible on the tile without
opening the PDP. Unmeasured; this change sets the baseline.

## What Changes

- **Full photo in the well** — every tile status fits the supplied image inside
  the square well without cropping; sold-out stays faded and does not scale on
  hover; available tiles keep the hover scale

## Non-Goals

- **Multiply blend** — `drop-product-listing-photo-multiply`
- **Phone cart visibility** — `show-listing-cart-on-touch`
- **Sort defaults** — `default-listing-sort-to-latest`
- **Boneyard skeleton re-capture**

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: the photo fits the well without cropping

## Impact

- **`@grade10/ui`** — `ProductCardImage` uses contain fit; Storybook stories
  show it
- **Overlap** — `hold-cart-quantity-to-stock` issues SC-56–62; this change
  issues SC-63 and SC-90

## Open questions

- none
