## MODIFIED Requirements

### Requirement: The product list displays product tiles and delegates every product action

The product list SHALL display one tile per supplied product, in the order
supplied, using each product's supplied image, category, name, description,
formatted current price, formatted original price, discount label, sold-out
condition, and cart condition. It SHALL report tile activation, the cart
action, and a quantity change through named callbacks, each identifying the
product.

A tile SHALL NOT offer a wishlist control.

The list SHALL NOT format a price, compute a discount, decide whether a product
is sold out, or hold a cart quantity.

#### Scenario: Prices are displayed as supplied

- **GIVEN** a product supplied with a current price of `HKD 105`, an original price of `HKD 123`, and a discount label of `−15%`
- **THEN** the tile displays all three exactly as supplied

#### Scenario: A cart action is reported, not performed

- **WHEN** a shopper activates the cart action on a tile
- **THEN** the action is reported once, identifying that product
- **AND** the tile's cart condition is unchanged until the consumer supplies a new one

#### Scenario: A sold-out product

- **GIVEN** a product supplied as sold out
- **THEN** its tile displays the sold-out treatment and its cart action cannot be activated

#### Scenario: No wishlist control on a tile

- **WHEN** a product tile renders, whether available or sold out
- **THEN** no wishlist control appears on it
