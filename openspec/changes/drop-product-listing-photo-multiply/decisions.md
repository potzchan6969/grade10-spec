## Goals

- The listing photo is drawn as supplied over the well, in every tile status.
  It is not blended into the well gradient.

## Non-Goals

- Photo fit and crop - `fit-product-listing-photo`.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Is the photo blended into the well? | No, in any tile status: the photo draws as supplied, and a sold-out photo takes the sold-out treatment over it. Carried by [Product Listing Blocks · Product Tile](../../../docs/prds/products/shared/ui/store-product-listing.md#product-tile) "Photo as supplied" and the requirement "The product photo is drawn as supplied" - decided by the round | Multiplying against the well so a white studio fill reads as transparent, which muddies a letterboxed catalogue photo |
| Q2 | Is the [Product Card Image](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074) Figma frame redrawn with the photo unblended? | The build's unblended photo is the look until the designer answers. Redrawing the frame, which still draws the photo multiplied, is handed to the redraw-store-product-card-frames change: the designer redraws it in one pass with `fit-product-listing-photo`, which reads the same frame, or keeps it marked historical. Decided 2026-10-07 | Holding this change on a Figma frame for a look already decided and built |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/ui/store-product-listing` | R1 - Is the [Product Card Image](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074) Figma frame redrawn with the photo unblended? It still draws the photo multiplied, and `fit-product-listing-photo` reads the same frame. Options: (a) redraw it, in one pass with `fit-product-listing-photo`; (b) keep it marked historical, so the file draws a look the code no longer has. Raised at review, not by the blind pass; no case or task depends on it | Q2 |
