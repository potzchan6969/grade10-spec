## Goals

- Several lot images show a left thumbnail rail only when the gallery is
  wide enough for that rail beside the main frame.
- A stacked several-image gallery hides the rail and keeps previous/next
  and carousel progress.
- One image still shows no strip; an empty gallery still shows no item and
  no previous/next.

## Non-Goals

- Changing `ListingGallery` (the older zoom-dialog gallery) strip rules.
- Changing image sizes, alt text, zoom, or admin upload rules.
- Renaming package exports or folding `ListingGallery` into
  `ListingLotGallery` in this change.
- PDP column ratios (tablet half/half, desktop sidebar width) as
  requirements — layout only.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When several images are present, must the thumbnail strip always show? | No — show the left rail only when the gallery is wide enough for it beside the main frame; stacked layouts hide the rail - decided by the round | Always show the strip whenever there are two or more items |
| Q2 | What replaces the strip on a stacked several-image gallery? | Previous/next and carousel progress remain; no substitute strip below the stage - decided by the round | Keep a horizontal strip under the progress; omit previous/next when the strip is hidden |
| Q3 | Does this rule apply to `ListingGallery` as well as `ListingLotGallery`? | `ListingLotGallery` and the site details gallery that compose it only; leave `ListingGallery` unchanged - decided by the round | One strip rule for every gallery export in the package |
| Q4 | Is the width threshold a named product value? | No — “wide enough for a left rail beside the main frame” is the product rule; the implementation threshold stays in code - decided by the round | Publishing a pixel or rem breakpoint as a durable requirement |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/auction-listing | When several images are stacked, must a strip still sit under the stage? | Q2 |
| shared/ui/auction-listing | Does the width rule also change `ListingGallery`? | Q3 |
| grade10-site/auction/listing-media | When the rail is hidden on a stacked details gallery, is size `thumb` still required? | Q1 |
