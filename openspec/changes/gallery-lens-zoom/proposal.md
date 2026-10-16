**Author:** @constance - 2026-10-16

## Why

Inspecting a lot's photo takes a click on a magnifier button and a modal
that covers the page — two steps and a context switch away from the image
the collector was studying. A lens that follows the pointer magnifies in
place, which is the inspection pattern collectors already know from auction
houses and marketplaces. Success is collectors reaching detail without
leaving the gallery.

## What Changes

- `ListingLotGallery` and `ListingGallery` magnify the selected image in
  place with a pointer-following lens instead of a zoom dialog: the lens
  reads the image's `zoomSrc`, moves with the arrow keys when focused, and
  hides on Escape.
- The magnifier IconButton, the "click to zoom" affordance and the zoom
  dialog are removed. A touch pointer does not raise the lens; scroll and
  swipe are unaffected.
- A new `Lens` primitive lands in `@grade10/design-system` (ported from
  Ballmac UI), taking its label and instructions through props.
- Gallery copy gains an optional `zoomInstructions` slot appended to the
  lens group's accessible name.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `shared/ui/auction-listing`: magnification moves in place under a
  pointer-following lens on `ListingLotGallery` and `ListingGallery`; the
  zoom dialog and its control leave; copy gains `zoomInstructions`.

## Impact

- `packages/design-system` `display/lens` primitive and `motion` dependency
- `packages/ui` `ListingLotGallery` and `ListingGallery` blocks, their copy
  types, stories and image `zoomSrc` docs
- `packages/i18n` `auctionListing` catalog keys `clickToZoom` and
  `zoomInstructions` across the four shared locales
- `apps/preview` lot details, product detail and vault asset detail pages
- `docs/prds/products/shared/ui/auction-listing.md#gallery`

## References

- [Listing Page Blocks · Gallery](../../../docs/prds/products/shared/ui/auction-listing.md#gallery)
- [Ballmac Lens](https://ui.ballmac.com/components/lens)
