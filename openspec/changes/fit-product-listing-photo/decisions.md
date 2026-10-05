## Goals

- Every listing tile shows the whole supplied photo inside the square well.
  Where the photo is not square, the well letterboxes the rest. Nothing is
  cropped to fill.
- That photo is drawn as supplied. It is not multiplied onto the well.

## Non-Goals

- Phone cart visibility and sort defaults.
- Hover scale on a sold-out tile that still opens — `add-store-cross-sell` Q50.
- Re-capturing boneyard skeletons.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How does a non-square photo sit in the well? | The whole photo is visible. The well's background fills the leftover space - decided by the round | Cropping the photo to fill the square |
| Q2 | Does a sold-out photo scale on hover? | Not this change. A sold-out tile that still opens grows on hover, as `add-store-cross-sell` Q50. A sold-out tile that stays inert does not. This change only fits the photo - decided by the round | Every sold-out photo never scales, which would reverse Q50 |
| Q3 | Is the photo multiplied onto the well? | No. The photo is drawn as supplied. The requirement stays on `drop-product-listing-photo-multiply` (SC-64). This change does not issue a second SHALL. The letterbox sits on that unblended photo - decided by the round | Keeping multiply now that the photo letterboxes |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
