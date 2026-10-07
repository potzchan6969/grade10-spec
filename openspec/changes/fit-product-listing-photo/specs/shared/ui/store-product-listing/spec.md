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
background SHALL fill the rest. No edge of the photo SHALL be cropped while the
tile is at rest. Where the photo reaches into the well's rounded corners, it
SHALL follow their curve; that is not a crop. Where the tile grows its photo
on hover, the well MAY clip the grown photo until the hover ends.

<!-- trace:scenario id=g10.shared-store-product-listing.SC-8fs rev=3 -->
#### Scenario: shared-ui-store-product-listing-SC-63 - The whole photo is visible
**Serves:** Tile contract - the whole photo is visible

- **GIVEN** a product supplied with a photo that is not square, whose corners clear the well's rounded corners
- **WHEN** the image renders at rest, whether available, on sale, sold out, or in cart
- **THEN** the entire photo is visible inside the well
- **AND** no edge of the photo is cropped by the well
- **AND** the photo is centred and meets the two edges of the well along its longer side, enlarged where it is smaller than the well
- **AND** the well's own background shows in the space the photo leaves

<!-- trace:scenario id=g10.shared-store-product-listing.SC-vsm rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-63a - A photo that reaches the well's corners rounds with them
**Serves:** Tile contract - a photo that reaches into the well's rounded corners rounds with them

- **GIVEN** a product supplied with a square photo, or one close enough to square that its corners reach into the well's rounded corners
- **WHEN** the image renders at rest
- **THEN** the photo is centred and meets the two edges of the well along its longer side, all four where it is square
- **AND** where it reaches into the well's rounded corners, it follows their curve
- **AND** no other part of the photo is cropped by the well
