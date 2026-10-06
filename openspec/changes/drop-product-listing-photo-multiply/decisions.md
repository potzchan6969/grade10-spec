## Goals

- The listing photo is drawn as supplied over the well, in every tile status.
  It is not blended into the well gradient.

## Non-Goals

- Photo fit and crop — `fit-product-listing-photo`.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Is the photo blended into the well? | No, in any tile status: the photo draws as supplied, and a sold-out photo takes the sold-out treatment over it. Carried by [Product Listing Blocks · Product Tile](../../../docs/prds/products/shared/ui/store-product-listing.md#product-tile) "No multiply" and the requirement "The product photo is drawn as supplied" - decided by the round | Multiplying against the well so a white studio fill reads as transparent — it muddies a letterboxed catalogue photo |
| Q2 | Is the Product Card Image Figma frame redrawn with the photo unblended? | Yes, by the design hand, in one pass with `fit-product-listing-photo`, which reads the same frame; acceptance does not wait on it. The code is the look (Q1), and the play tests of `tasks.md` 1.1 fail if a Figma-to-code pass brings multiply back. Until the redraw, `ui-design.md` marks the frame historical - decided by the round | Keeping the frame as it is, which leaves the file drawing a look the code no longer has |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/store-product-listing | Review: should the [Product Card Image](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074) frame be redrawn with the photo unblended, or stay marked historical? The same frame backs `fit-product-listing-photo`, so one answer covers both. Owner: designer. Recommended: redraw it. | Q2 |
