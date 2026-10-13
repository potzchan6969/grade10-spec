# shared/ui/store-product-listing Specification

## Feature set

- Tile contract
  - Photo as supplied: the photo draws as supplied in every tile status, never blended into the well

## ADDED Requirements

### Requirement: The product photo is drawn as supplied

The product card image SHALL NOT blend the supplied photo into the well in any
tile status: available, on sale, in cart or sold out. A sold-out photo takes
the sold-out treatment over that unblended photo.

<!-- trace:scenario id=g10.shared-store-product-listing.SC-ws9 rev=2 -->
#### Scenario: shared-ui-store-product-listing-SC-64 - An available, on-sale or in-cart photo is drawn as supplied
**Serves:** Tile contract - a tile's photo shows in its well as the shop supplied it

- **GIVEN** a product with a supplied photo that is available, on sale or in the cart
- **WHEN** its product card image is rendered
- **THEN** the photo is not blended into the well
- **AND** a white fill in the photo shows white inside the grey well

<!-- trace:scenario id=g10.shared-store-product-listing.SC-ta3 rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-64a - A sold-out photo takes the sold-out treatment unblended
**Serves:** Tile contract - a sold-out tile's photo shows as supplied under its sold-out treatment

- **GIVEN** a product with a supplied photo that is sold out
- **WHEN** its product card image is rendered, whether or not it opens
- **THEN** the photo is not blended into the well
- **AND** the sold-out treatment is displayed over it
