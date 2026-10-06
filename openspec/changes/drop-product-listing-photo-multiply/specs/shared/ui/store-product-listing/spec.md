## ADDED Requirements

### Requirement: The product photo is drawn without multiply blend

The product card image SHALL draw the supplied photo without a multiply blend
against the well.

<!-- trace:scenario id=g10.shared-store-product-listing.SC-ws9 rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-64 - The photo is not multiplied
**Serves:** Tile contract - the photo is not multiplied

- **WHEN** the product card image renders a supplied photo
- **THEN** the photo is drawn without a multiply blend against the well
