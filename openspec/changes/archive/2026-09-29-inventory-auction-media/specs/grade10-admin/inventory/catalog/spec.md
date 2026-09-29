## Purpose

Gives Grade10 one stock snapshot per catalogue product, quantity-based
application reservations with remaining / sold / vaulted / released tracking,
admin oversight by explicit `holder_kind`, an append-only trace of every count
transition, and an ordered reusable media gallery for Auction listings.

## Feature set

- Product assets
  - Reusable gallery: inventory admins prepare ordered images and video on a catalogue product for Auction listings
  - Auction eligibility: product assets follow the Auction listing media policy, so an operator can select them into a listing

## ADDED Requirements

### Requirement: Product assets are an ordered reusable gallery

A product has an ordered gallery of reusable media assets.

While the product is editable, an authorized inventory admin SHALL be able to
add, replace, remove, reorder, and clear its assets. A product gallery MAY be
empty and SHALL hold at most eight assets. An operation that would add a ninth
asset SHALL be refused and SHALL leave the gallery unchanged.

Each asset SHALL be one JPEG, PNG, WebP, AVIF, MP4, WebM, or QuickTime file.
An unsupported type, an empty file, or a file larger than 104857600 bytes
SHALL be refused and SHALL leave the gallery unchanged.

A product asset SHALL be available for selection by listings of that product.
The same product asset MAY be selected by more than one listing.

#### Scenario: grade10-admin-inventory-catalog-SC-123 - Inventory admin orders a product gallery
**Serves:** grade10-admin-inventory-catalog-US-74 - inventory admin keeps an ordered reusable gallery

- **GIVEN** an editable product and an authorized inventory admin
- **WHEN** they add supported assets and arrange them
- **THEN** Grade10 stores the assets in that order
- **AND** the gallery may contain from zero through eight assets

#### Scenario: grade10-admin-inventory-catalog-SC-124 - Invalid product assets are refused
**Serves:** grade10-admin-inventory-catalog-US-74 - inventory admin keeps a valid gallery

- **GIVEN** an editable product and an authorized inventory admin
- **WHEN** they add an unsupported, empty, over-104857600-byte, or ninth asset
- **THEN** Grade10 refuses the operation
- **AND** the product gallery is unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-125 - Inventory admin maintains an editable product gallery
**Serves:** grade10-admin-inventory-catalog-US-74 - inventory admin maintains product media

- **GIVEN** an editable product with ordered assets and an authorized inventory admin
- **WHEN** they replace, remove, reorder, or clear assets
- **THEN** Grade10 applies the requested change
- **AND** clearing the gallery leaves the product with zero assets

#### Scenario: grade10-admin-inventory-catalog-SC-126 - Unauthorized product-gallery management is refused
**Serves:** grade10-admin-inventory-catalog-US-74 - product media follows inventory administration access

- **GIVEN** a caller without inventory-admin access
- **WHEN** they attempt to change a product gallery
- **THEN** Grade10 refuses the request under the existing admin authorization behavior
- **AND** the product gallery is unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-127 - A product asset is reusable across listings
**Serves:** grade10-admin-inventory-catalog-US-74 - product media can serve more than one listing

- **GIVEN** a product asset
- **WHEN** authorized operators select it for two listings of that product
- **THEN** each listing may save the asset
- **AND** selecting it for one listing does not remove it from the product or the other listing
