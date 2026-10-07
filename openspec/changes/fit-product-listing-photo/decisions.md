## Goals

- Every listing tile shows the whole supplied photo inside the square well.
  Where the photo is not square, the well fills the rest. Nothing is cropped
  to fill.

## Non-Goals

- The photo drawn without multiply - `drop-product-listing-photo-multiply`
  (Q3).
- Phone cart visibility and sort defaults.
- Hover on a sold-out tile - `add-store-cross-sell` Q50.
- Redrawing the Product Card Image Figma frame with a non-square photo. The
  frame draws a square photo, which looks the same whole or cropped, so this
  change needs no redraw and acceptance does not wait on it. The frame's redraw
  is handed to the redraw-store-product-card-frames change by
  `drop-product-listing-photo-multiply`, its Q2.
- Re-capturing boneyard skeletons.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How does a non-square photo sit in the well? | The whole photo is visible. The well's background fills the leftover space. Carried by the page's Whole photo line and its Product decisions row Whole photo, and the requirement The product photo fits inside the well - decided by the round | Cropping the photo to fill the square |
| Q2 | Does a sold-out photo scale on hover? | Not this change. Hover on a sold-out tile stays as `add-store-cross-sell` Q50 decides it. This change states the hover only through the at-rest clause of the requirement The product photo fits inside the well and the page's Whole photo line - decided by the round | Every sold-out photo never scales, which would reverse Q50 |
| Q3 | Is the photo multiplied onto the well? | No. The photo is drawn as supplied, as `drop-product-listing-photo-multiply` Q1 decides for every tile status, and this change issues no second SHALL. The letterbox sits on that unblended photo. Carried by the page's No multiply line, which `drop-product-listing-photo-multiply` serves - decided by the round | Keeping multiply now that the photo letterboxes |
| Q4 | Does the whole photo stay whole while a tile is hovered? | At rest, yes. The hover is unchanged, as `ui-design.md` keeps it: where the tile grows its photo by 5% on hover, the well may cut the grown photo's edges until the pointer leaves. Shipped at `packages/ui/src/blocks/store-product-listing/product-card-image.tsx:98`. Carried by the page's Whole photo line and its Product decisions row Whole photo, and the requirement The product photo fits inside the well - decided by the round | Growing the photo only inside the well, which shrinks every photo at rest; no growth, which removes the hover `add-store-cross-sell` Q50 drew |
| Q5 | Where does a photo sit when it leaves part of the well empty, and is a small photo enlarged? | Centred, and scaled up or down until it meets the two edges along its longer side, so every tile's photo reads at one size whatever size the shop uploaded. Shipped as `object-contain` at `packages/ui/src/blocks/store-product-listing/product-card-image.tsx:95`. Carried by the page's Whole photo line and its Product decisions row Whole photo, and the requirement The product photo fits inside the well - decided by the round | At its own size, which draws a small upload as a small photo; another position, which no design draws |
| Q6 | Does a photo that reaches into the well's rounded corners lose them? | It rounds with them, which is not a crop. A square photo, or one close enough to square that its corners reach into the well's rounded corners, follows the curve there, and no other part of it is cut. The well is a rounded square that clips what it holds, and the photo carries the same radius, shipped at `packages/ui/src/blocks/store-product-listing/product-card-image.tsx:95` and `:105`. Carried by the page's Whole photo line, "Where a photo reaches into the well's rounded corners, it rounds with them", its Product decisions row Whole photo, and the requirement The product photo fits inside the well - decided by the round | Insetting the photo so its corners clear the curve, which shrinks every square photo; a square-cornered well, which changes the tile's shape |
| Q7 | Is showing the whole photo measured? | No. The tile now draws the photo it is given. Carried by the page's Product decisions row Measure for the whole photo - decided 2026-10-07 by the product owner, on the round's recommendation | Comparing how often slab and box tiles open their product before and after, which can move either way and says little; a new tile event that records each photo's shape, which adds tracking for a rendering fix |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/ui/store-product-listing` | R1 - Is showing the whole photo measured? Options: (a) the rate at which slab and box tiles open their product, before and after the photo fit, whose direction reads either way; (b) a new tile event that records the photo's shape; (c) no measure, since the tile draws the photo it is given | Q7 |
| `shared/ui/store-product-listing` | R2 - Does the whole photo stay whole while a tile is hovered? An available tile's photo still grows on hover, and the input says only that the hover is unchanged. Grown, a photo that fills the well's height or width loses its edges until the pointer leaves. Options: (a) the photo grows and its edges are cut while hovered; (b) the photo grows only inside the well, so no edge is cut; (c) the photo no longer grows | Q4 |
| `shared/ui/store-product-listing` | R3 - Where does a photo sit when it leaves part of the well empty, and is a small photo enlarged? The input says the well fills what the photo leaves, not where the photo sits in it, nor whether a photo smaller than the well grows to meet its edges. Options: centred and enlarged to touch two edges; centred at its own size; another position the designer draws | Q5 |
