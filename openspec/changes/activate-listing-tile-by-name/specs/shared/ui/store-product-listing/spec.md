## MODIFIED Requirements

### Requirement: The product list displays product tiles and delegates every product action

The product list SHALL display one tile per supplied product, in the order
supplied, using each product's supplied image, name, formatted current price,
formatted original price, sold-out condition, and in-cart condition with its
supplied count. It SHALL report tile activation and cart quantity changes
through named callbacks, each identifying the product.

When the consumer supplies a tile-activation callback and the product is not
sold out, both the product image and the product name SHALL activate that
callback. When no callback is supplied, the image and the name SHALL remain
inert. When the product is sold out, the image and the name SHALL remain inert
where the consumer supplies a cart handler, and SHALL still activate where an
activation handler is supplied and no cart handler is.

A tile SHALL NOT offer a wishlist control.

A tile SHALL NOT display metadata badges such as collection, series, or
region.

A tile SHALL NOT display a category line, a description, or a standalone add
button separate from the cart control.

The list SHALL NOT format a price, compute a discount, decide whether a
product is sold out, or hold a cart quantity.

<!-- trace:scenario id=g10.shared-store-product-listing.SC-3ob rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-04 - Prices are displayed as supplied
**Serves:** Tile contract - prices are displayed as supplied

- **GIVEN** a product supplied with a current price of `HKD 105` and an original price of `HKD 123`
- **THEN** the tile displays both exactly as supplied
- **AND** the original price is shown with strikethrough treatment

<!-- trace:scenario id=g10.shared-store-product-listing.SC-9ml rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-05 - No original price
**Serves:** Tile contract - no original price

- **GIVEN** a product supplied with a current price and no original price
- **THEN** only the current price is displayed
- **AND** no strikethrough price is shown

<!-- trace:scenario id=g10.shared-store-product-listing.SC-vgm rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-06 - A cart quantity change is reported, not performed
**Serves:** Tile contract - a cart quantity change is reported, not performed

- **WHEN** a shopper changes the cart quantity on a tile through its cart control
- **THEN** the requested quantity is reported once, identifying that product
- **AND** the tile's cart condition is unchanged until the consumer supplies a new one

<!-- trace:scenario id=g10.shared-store-product-listing.SC-bz2 rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-07 - A sold-out product
**Serves:** Tile contract - a sold-out product

- **GIVEN** a product supplied as sold out
- **THEN** its tile displays the sold-out treatment and its cart action cannot be activated

<!-- trace:scenario id=g10.shared-store-product-listing.SC-0cf rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-08 - No wishlist control on a tile
**Serves:** Tile contract - no wishlist control on a tile

- **WHEN** a product tile renders, whether available or sold out
- **THEN** no wishlist control appears on it

<!-- trace:scenario id=g10.shared-store-product-listing.SC-oxx rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-09 - No metadata badges on a tile
**Serves:** Tile contract - no metadata badges on a tile

- **WHEN** a product tile renders
- **THEN** no collection, series, or region badge appears on it

<!-- trace:scenario id=g10.shared-store-product-listing.SC-7pj rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-87 - The product name activates the tile
**Serves:** Tile contract - the product name activates the tile

- **GIVEN** a product that is not sold out and a tile-activation callback
- **WHEN** a shopper activates the product name
- **THEN** tile activation is reported once, identifying that product

<!-- trace:scenario id=g10.shared-store-product-listing.SC-d3u rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-88 - A sold-out name stays inert
**Serves:** Tile contract - a sold-out name stays inert where the tile sells

- **GIVEN** a product supplied as sold out, a tile-activation callback, and a
  cart handler
- **WHEN** the tile renders
- **THEN** the product name does not activate
- **AND** activating the name does not report tile activation

<!-- trace:scenario id=g10.shared-store-product-listing.SC-e9w rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-89 - No activation without a callback
**Serves:** Tile contract - no activation without a callback

- **GIVEN** a product that is not sold out and no tile-activation callback
- **WHEN** the tile renders
- **THEN** the product name does not activate
- **AND** the product image does not activate
