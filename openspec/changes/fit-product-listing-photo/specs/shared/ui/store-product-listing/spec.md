# shared/ui/store-product-listing Specification

## Feature set

- Tile contract
  - Whole photo: the square well shows the whole supplied photo, in every status; the well, not a cropped edge, fills what the photo leaves

## ADDED Requirements

### Requirement: The product photo fits inside the well

The product card image SHALL show the whole supplied photo inside the clipped
square well in every tile status: available, on sale, sold out and in cart.
The photo SHALL be centred in the well and scaled, up or down, until it meets
the two edges along its longer side. Where the photo is not square, the well's
background SHALL fill the rest, and no edge of the photo SHALL be cropped while
the tile is at rest. Where the tile grows its photo on hover, the well MAY clip
the grown photo until the hover ends.

<!-- trace:scenario id=g10.shared-store-product-listing.SC-8fs rev=2 -->
#### Scenario: shared-ui-store-product-listing-SC-63 - The whole photo is visible
**Serves:** Tile contract - the whole photo is visible

- **GIVEN** a product supplied with a photo whose aspect ratio is not square
- **WHEN** the image renders at rest, whether available, on sale, sold out, or in cart
- **THEN** the entire photo is visible inside the well
- **AND** no edge of the photo is cropped by the well
- **AND** the photo is centred and meets the two edges of the well along its longer side, enlarged where it is smaller than the well
- **AND** the well's own background shows in the space the photo leaves
