**Author:** @constance - 2026-09-28

## Why

On a narrow lot gallery, a thumbnail strip beside or above the main frame
crowds the stage and duplicates what previous/next and progress already do.
Collectors on phone-width columns need a clear main image without a second
rail of thumbs. Success is a readable stage on stacked layouts, with the
left rail still available when the gallery is wide enough for it.

## What Changes

- When several images are present, show the thumbnail rail only when the
  gallery is wide enough to place it on the left of the main frame.
- On a stacked gallery, hide the rail and keep previous/next plus carousel
  progress.
- Record the rule on `ListingLotGallery` under `shared/ui/auction-listing`,
  and on the collector details gallery under `grade10-site/auction/listing-media`.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `shared/ui/auction-listing`: Several-item gallery strip is width-dependent
  on `ListingLotGallery` (left rail when wide; chevrons and progress when
  stacked).
- `grade10-site/auction/listing-media`: Details-page gallery strip follows
  the same width rule for collectors.

## Impact

- `packages/ui` `ListingLotGallery` and lot PDP layout
- Storybook Pages/Auction/Auction Lot Details and Auction Listing/ListingLotGallery
- `docs/prds/products/shared/ui/auction-listing.md#gallery`
- `docs/prds/products/grade10-site/auction/display.md#auction-details`

## References

- [Listing Page Blocks · Gallery](../../../docs/prds/products/shared/ui/auction-listing.md#gallery)
- [Auction Display · Auction Details](../../../docs/prds/products/grade10-site/auction/display.md#auction-details)
