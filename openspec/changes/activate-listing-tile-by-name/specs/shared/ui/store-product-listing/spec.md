## MODIFIED Requirements

### Requirement: The product list displays product tiles and delegates every product action

The product list SHALL display one tile per supplied product, in the order
supplied, using each product's supplied image, name, formatted current price,
formatted original price, sold-out condition, and in-cart condition with its
supplied count. It SHALL report tile activation and cart quantity changes
through named callbacks, each identifying the product.

When the consumer supplies a tile-activation callback and the product is not
sold out, both the product image and the product name SHALL activate that
callback. When no callback is supplied, or the product is sold out, the image
and the name SHALL remain inert.

A tile SHALL NOT offer a wishlist control.

A tile SHALL NOT display metadata badges such as collection, series, or
region.

A tile SHALL NOT display a category line, a description, or a standalone add
button separate from the cart control.

The list SHALL NOT format a price, compute a discount, decide whether a
product is sold out, or hold a cart quantity.

#### Scenario: shared-ui-store-product-listing-SC-04 - Prices are displayed as supplied

- **GIVEN** a product supplied with a current price of `HKD 105` and an original price of `HKD 123`
- **THEN** the tile displays both exactly as supplied
- **AND** the original price is shown with strikethrough treatment

#### Scenario: shared-ui-store-product-listing-SC-05 - No original price

- **GIVEN** a product supplied with a current price and no original price
- **THEN** only the current price is displayed
- **AND** no strikethrough price is shown

#### Scenario: shared-ui-store-product-listing-SC-06 - A cart quantity change is reported, not performed

- **WHEN** a shopper changes the cart quantity on a tile through its cart control
- **THEN** the requested quantity is reported once, identifying that product
- **AND** the tile's cart condition is unchanged until the consumer supplies a new one

#### Scenario: shared-ui-store-product-listing-SC-07 - A sold-out product

- **GIVEN** a product supplied as sold out
- **THEN** its tile displays the sold-out treatment and its cart action cannot be activated

#### Scenario: shared-ui-store-product-listing-SC-08 - No wishlist control on a tile

- **WHEN** a product tile renders, whether available or sold out
- **THEN** no wishlist control appears on it

#### Scenario: shared-ui-store-product-listing-SC-09 - No metadata badges on a tile

- **WHEN** a product tile renders
- **THEN** no collection, series, or region badge appears on it

#### Scenario: shared-ui-store-product-listing-SC-87 - The product name activates the tile

- **GIVEN** a product that is not sold out and a tile-activation callback
- **WHEN** a shopper activates the product name
- **THEN** tile activation is reported once, identifying that product

#### Scenario: shared-ui-store-product-listing-SC-88 - A sold-out name stays inert

- **GIVEN** a product supplied as sold out and a tile-activation callback
- **WHEN** the tile renders
- **THEN** the product name does not activate
- **AND** activating the name does not report tile activation

#### Scenario: shared-ui-store-product-listing-SC-89 - No activation without a callback

- **GIVEN** a product that is not sold out and no tile-activation callback
- **WHEN** the tile renders
- **THEN** the product name does not activate
- **AND** the product image does not activate
