## MODIFIED Requirements

### Requirement: The product list displays product tiles and delegates every product action

The product list SHALL display one tile per supplied product, in the order
supplied, using each product's supplied image, name, formatted current price,
formatted original price, sold-out condition, and in-cart condition with its
supplied count. It SHALL report tile activation and cart quantity changes
through named callbacks, each identifying the product.

A tile SHALL NOT offer a wishlist control.

A tile SHALL NOT display metadata badges such as collection, series, or
region.

A tile SHALL NOT display a category line, a description, or a standalone add
button separate from the cart control.

The list SHALL NOT format a price, compute a discount, decide whether a
product is sold out, or hold a cart quantity.

#### Scenario: store-product-listing-SC-06 - A cart quantity change is reported, not performed

- **WHEN** a shopper changes the cart quantity on a tile through its cart control
- **THEN** the requested quantity is reported once, identifying that product
- **AND** the tile's cart condition is unchanged until the consumer supplies a new one

### Requirement: The product card image displays photo, sale, sold-out, and cart overlay

The product card image SHALL display the supplied photo in a clipped square
well. When no image source is supplied, the well SHALL still render and SHALL
NOT show a fallback photo.

When a sale label is supplied and the product is not sold out, that label SHALL
be displayed on the image. When the product is sold out, the image SHALL use
the sold-out treatment, SHALL display the supplied sold-out label, SHALL NOT
display a sale label, and SHALL NOT display a cart control.

When the product is in the cart and not sold out, the image SHALL display the
cart control with the supplied count collapsed on the control. When the product
is available and not in the cart, the cart control SHALL appear on pointer hover
and when the image receives keyboard focus, and SHALL be hidden otherwise.

Activating the add affordance SHALL expand the cart control into an inline
quantity stepper on the same primary pill. While expanded, decrement and
increment controls SHALL adjust the reported quantity; decrement at quantity
one SHALL report removal. When the expanded control loses focus or pointer
contact and the product remains in the cart, the control SHALL collapse to the
supplied count rather than the add affordance. Reactivating the collapsed
control SHALL expand the stepper again.

Each cart quantity change SHALL be reported through a callback and SHALL NOT
change the in-cart condition until the consumer supplies a new one.

The cart control's accessible names SHALL come from the supplied copy. The
image SHALL contain no default, fallback, or built-in copy.

`ProductCardImage` SHALL be renderable on its own, outside `ProductCard`.

#### Scenario: store-product-listing-SC-49 - An in-cart count is displayed as supplied

- **GIVEN** a product supplied as in the cart with a count of `1`
- **THEN** the collapsed cart control displays `1`
- **AND** the image does not increment, format, or hold that count

#### Scenario: store-product-listing-SC-50 - A cart quantity change is reported, not performed

- **WHEN** a shopper changes quantity through the cart control
- **THEN** the requested quantity is reported once
- **AND** the in-cart condition is unchanged until the consumer supplies a new one

#### Scenario: store-product-listing-SC-53 - The stepper collapses after blur or pointer leave

- **GIVEN** a product supplied as in the cart with a count of `2`
- **WHEN** a shopper expands the cart control, then moves focus or the pointer away
- **THEN** the control collapses to display `2`
- **AND** the add affordance is not shown

#### Scenario: store-product-listing-SC-54 - The collapsed control re-expands

- **GIVEN** a product supplied as in the cart with a count of `2` and a collapsed cart control
- **WHEN** a shopper activates the collapsed control
- **THEN** the inline quantity stepper is displayed on the same pill
