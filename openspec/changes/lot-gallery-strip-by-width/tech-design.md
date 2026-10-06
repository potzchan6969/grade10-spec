## Context

`ListingLotGallery` already owns its responsive presentation with a local
container query. It renders the thumbnail rail beside the main stage at the
wide presentation and keeps the main stage, chevrons, and `CarouselProgress`
when the gallery stacks. The Grade10 site details page composes that block;
it does not own a second gallery layout rule.

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

## Interfaces and Risks

- `ListingLotGallery` retains its current image and copy props. No public
  export or consumer adapter changes.
- A global viewport breakpoint would misclassify the same block in different
  columns. The local container rule follows the available gallery width.
- Story coverage must exercise both presentations and selection controls so a
  layout change cannot detach the active image from rail or progress state.

## Verification

- Add or update focused component and Storybook interaction coverage for wide
  and stacked several-image galleries, then retain the one-image and empty
  cases.
- Check the details-page preview at both container presentations and confirm
  `ListingGallery` has no changed source or behavior.
- Keep the new feature cases draft for human `/tcs-review` after deployment.
