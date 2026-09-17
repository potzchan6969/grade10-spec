## ADDED Requirements

### Requirement: The product photo fits inside the well

The whole photo shows inside the well, in every tile status.

**Fitted** - The product card image SHALL display the supplied photo fitted
inside the clipped square well so the whole photo is visible.

**Letterbox** - Where the photo's aspect ratio differs from the square, the
well's background SHALL letterbox the remainder.

**No crop** - The photo SHALL NOT be cropped to fill the well.

**Every status** - This SHALL hold for every tile status: available, on sale,
sold out, and in cart.

**Sold out** - A sold-out photo SHALL remain fully visible under the sold-out
treatment (including reduced opacity) and SHALL NOT scale on hover.

#### Scenario: shared-ui-store-product-listing-SC-63 - The whole photo is visible
**Serves:** Tile contract - the whole photo is visible

- **GIVEN** a product supplied with a photo whose aspect ratio is not square
- **WHEN** the image renders, whether available, on sale, sold out, or in cart
- **THEN** the entire photo is visible inside the well
- **AND** no edge of the photo is cropped by the well

#### Scenario: shared-ui-store-product-listing-SC-90 - Sold-out does not scale on hover
**Serves:** Tile contract - sold-out does not scale on hover

- **GIVEN** a product supplied as sold out
- **WHEN** a shopper hovers the image on a fine pointer
- **THEN** the photo does not scale
