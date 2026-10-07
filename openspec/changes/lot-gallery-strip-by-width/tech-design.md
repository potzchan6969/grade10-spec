## Context

`ListingLotGallery` already owns its responsive presentation with a local
container query. It renders the thumbnail rail beside the main stage at the
wide presentation and keeps the main stage, chevrons, and `CarouselProgress`
when the gallery stacks. The Grade10 site details page composes that block;
it does not own a second gallery layout rule. Its existing accepted SC-22 also
requires the details gallery to request `thumb`, `detail`, and `zoom` sources.

## Decisions

1. **Keep the width decision in `ListingLotGallery`**
   - The block's own container determines whether a several-image gallery can
     place the rail beside the stage. The durable contract describes that fit,
     not a viewport breakpoint or a named threshold.
   - The details page supplies images and copy without a layout prop.

2. **Keep navigation when the rail is hidden**
   - A stacked several-image gallery keeps the existing previous and next
     controls and `CarouselProgress`. The selected image remains the same when
     the presentation changes.
   - One image keeps no rail or previous/next. An empty gallery keeps no item
     or previous/next.

3. **Leave `ListingGallery` outside the change**
   - The older gallery's strip rules and its consumers are unaffected. The
     plan changes only `ListingLotGallery`, its stories, and the details-page
     evidence that composes it.

4. **Preserve the three named image sources and zoom**
   - Extend `ListingLotGalleryImage` with optional `thumbSrc` and `zoomSrc`;
     `src` remains the main-frame source and the fallback for either optional
     source. The visible rail uses `thumbSrc`, the stage uses `src`, and the
     open zoom dialog uses `zoomSrc` for the selected image.
   - Add consumer-supplied `copy.zoom`. The Grade10 page supplies its existing
     `clickToZoom` catalog copy and maps `thumb`, `detail`, and `zoom` from the
     image's existing paths through `auctionAssetUrl`.
   - Mount the existing design-system `Dialog` only while zoom is open, so the
     zoom source loads on demand. Changing the selected image closes the
     dialog; opening it again shows that selection.

## Interfaces and Risks

- The `ListingLotGallery` export remains; its image and copy props gain the
  named sources and zoom label without removing existing fields. The app
  adapter supplies those sources from the existing media paths.
- A global viewport breakpoint would misclassify the same block in different
  columns. The local container rule follows the available gallery width.
- The rail's thumbnail source must be loaded only while the rail is visible;
  a CSS-hidden image can still start a request. Coverage must exercise both
  presentations and preserve the selected image, controls, and zoom source.

## Verification

- Add focused Storybook interaction coverage for distinct rail, stage, and
  zoom sources; opening and closing zoom; both responsive presentations; and
  the one-image and empty cases.
- Verify the details page requests `thumb` only with the visible rail,
  `detail` in the stage, and `zoom` when the selected image opens in zoom.
- Confirm `ListingGallery` has no changed source or behavior.
- Keep the new feature cases draft for human `/tcs-review` after deployment.
