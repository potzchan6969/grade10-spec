# shared/ui/store-product-listing Specification

## Feature set

- Surface exports
  - Named components: browse, filters, header, list, card, and image from the package entry
  - Reusable parts: each part renders without `ProductBrowse`
- Tile contract
  - Supplied facts: price, sold-out, cart action, and image are displayed as given
  - One way in: the photo and the name open the product alike, where the tile opens
- Selling is opt-in
  - Supplied handler: the cart control is drawn where the consumer can act on a quantity, and nowhere else
  - No standing default: a control is never drawn over nothing, so a press cannot be swallowed
- Browse states
  - Loading, empty, failed: the application drives display through props
- Filters and sort
  - Reported changes: search, filters, and sort are displayed and reported, never decided by the blocks
- Responsive layout
  - Column count: the list answers the width it is given, and the consumer sets none of it
- Load more
  - Reported reach: arriving at the end is reported like any other change, never acted on by the blocks
  - Loading more: the wait for the next products is shown without disturbing the ones already read
- Accessibility
  - Keyboard and announcements: controls are operable without a pointer; busy and count changes are announced
- No defaulted content
  - Application-owned copy: nothing visible is invented by the listing
- Stock is a ceiling
  - Supplied maximum: the cart control stops where the consumer says the shop's count stops
  - No maximum, no ceiling: a consumer that supplies none keeps a control that counts on
- What is left, said
  - Supplied remaining count: the card displays how many are left, in the consumer's own words
  - Consumer decides when: the card shows what it is given and judges nothing about scarcity

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

Where the tile opens, the name SHALL be its one keyboard stop and the one
control assistive technology announces for the product, taking the keys its
native control takes; the image SHALL open on a pointer press and SHALL NOT be
a second stop. A name that opens SHALL show it by an underline on hover and on
keyboard focus; a name that does not open SHALL be plain text.

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
- **AND** activating the product image reports the same activation once more

<!-- trace:scenario id=g10.shared-store-product-listing.SC-d3u rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-88 - A sold-out tile stays inert where it sells
**Serves:** Tile contract - a sold-out tile stays inert where it sells

- **GIVEN** a product supplied as sold out, a tile-activation callback and a cart handler
- **WHEN** a shopper presses the product name and the product image
- **THEN** no tile activation is reported
- **AND** neither the name nor the image is offered as a control

<!-- trace:scenario id=g10.shared-store-product-listing.SC-e9w rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-89 - No activation without a callback
**Serves:** Tile contract - no activation without a callback

- **GIVEN** a product that is not sold out and no tile-activation callback
- **WHEN** the tile renders
- **THEN** the product name does not activate
- **AND** the product image does not activate

<!-- trace:scenario id=g10.shared-store-product-listing.SC-t2f rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-97 - A sold-out tile opens where it does not sell
**Serves:** Tile contract - a sold-out tile opens where it does not sell

- **GIVEN** a product supplied as sold out, a tile-activation callback and no cart handler
- **WHEN** a shopper activates the product name, then the product image
- **THEN** tile activation is reported once for each, identifying that product
- **AND** the tile keeps the sold-out treatment

<!-- trace:scenario id=g10.shared-store-product-listing.SC-ou9 rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-98 - A tile that opens is one stop
**Serves:** Accessibility - a tile that opens is one stop

- **GIVEN** a product that is not sold out, a tile-activation callback and a cart handler
- **WHEN** a shopper moves through the tile with the Tab key
- **THEN** focus stops on the product name and on the cart control, and not on the product image
- **AND** assistive technology announces one control named for the product
- **AND** Enter or Space on the focused name reports tile activation once

<!-- trace:scenario id=g10.shared-store-product-listing.SC-30a rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-99 - The name shows that it opens
**Serves:** Tile contract - the name shows that it opens

- **GIVEN** a tile that opens, and a tile that does not
- **WHEN** a shopper hovers over each name and moves keyboard focus through each tile
- **THEN** the name that opens is underlined on hover and on focus, and plain at rest
- **AND** the name that does not open is plain text throughout and takes no focus

### Requirement: The product card image displays photo, sale, sold-out, and cart overlay

The product card image SHALL display the supplied photo in a clipped square
well. When no image source is supplied, the well SHALL still render and SHALL
NOT show a fallback photo.

When a sale label is supplied and the product is not sold out, that label SHALL
be displayed on the image. When the product is sold out, the image SHALL use
the sold-out treatment, SHALL display the supplied sold-out label, SHALL NOT
display a sale label, and SHALL NOT display a cart control.

The cart control SHALL be displayed only where the consumer supplies a way to
report a quantity change. A surface that merchandises rather than sells offers
none, and no default stands in for one: a control drawn over nothing takes a
shopper's press and swallows it.

Where one is supplied and the product is in the cart and not sold out, the
image SHALL display the cart control with the supplied count collapsed on the
control. Where one is supplied and the product is available and not in the
cart:

- on a wide viewport with a fine pointer and hover, the cart control SHALL
  appear on pointer hover and when keyboard focus moves into the image, and
  SHALL be hidden otherwise
- on a coarse pointer, where hover is not available, or below the wide
  listing breakpoint, the cart control SHALL remain visible without hover

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

<!-- trace:scenario id=g10.shared-store-product-listing.SC-uoy rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-46 - No image source
**Serves:** Tile contract - no image source

- **WHEN** the image is rendered without an image source
- **THEN** the well is still displayed
- **AND** no fallback photo is shown

<!-- trace:scenario id=g10.shared-store-product-listing.SC-la7 rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-47 - A sale label is displayed as supplied
**Serves:** Tile contract - a sale label is displayed as supplied

- **GIVEN** an available product supplied with a sale label of `SALE`
- **THEN** that label is displayed on the image
- **AND** no other sale copy is shown

<!-- trace:scenario id=g10.shared-store-product-listing.SC-exb rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-48 - A sold-out product
**Serves:** Tile contract - a sold-out product

- **GIVEN** a product supplied as sold out with a sold-out label of `SOLD OUT`
- **THEN** the image uses the sold-out treatment
- **AND** the supplied `SOLD OUT` label is displayed
- **AND** no sale label is displayed
- **AND** no cart control is displayed or operable

<!-- trace:scenario id=g10.shared-store-product-listing.SC-eds rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-49 - An in-cart count is displayed as supplied
**Serves:** Tile contract - an in-cart count is displayed as supplied

- **GIVEN** a product supplied as in the cart with a count of `1`
- **THEN** the collapsed cart control displays `1`
- **AND** the image does not increment, format, or hold that count

<!-- trace:scenario id=g10.shared-store-product-listing.SC-0xx rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-50 - A cart quantity change is reported, not performed
**Serves:** Tile contract - a cart quantity change is reported, not performed

- **WHEN** a shopper changes quantity through the cart control
- **THEN** the requested quantity is reported once
- **AND** the in-cart condition is unchanged until the consumer supplies a new one

<!-- trace:scenario id=g10.shared-store-product-listing.SC-yv9 rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-51 - Keyboard reveals the cart control
**Serves:** Tile contract - keyboard reveals the cart control

- **GIVEN** an available product that is not in the cart
- **WHEN** a shopper moves keyboard focus into the image
- **THEN** the cart control is displayed and can be activated from the keyboard
- **AND** the focused control is visibly indicated

<!-- trace:scenario id=g10.shared-store-product-listing.SC-3n1 rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-52 - The image is reused alone
**Serves:** Tile contract - the image is reused alone

- **WHEN** an application renders the product card image without a product card
- **THEN** it renders and behaves as specified, with no missing-context error

<!-- trace:scenario id=g10.shared-store-product-listing.SC-ck1 rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-53 - The stepper collapses after blur or pointer leave
**Serves:** Tile contract - the stepper collapses after blur or pointer leave

- **GIVEN** a product supplied as in the cart with a count of `2`
- **WHEN** a shopper expands the cart control, then moves focus or the pointer away
- **THEN** the control collapses to display `2`
- **AND** the add affordance is not shown

<!-- trace:scenario id=g10.shared-store-product-listing.SC-z64 rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-54 - The collapsed control re-expands
**Serves:** Tile contract - the collapsed control re-expands

- **GIVEN** a product supplied as in the cart with a count of `2` and a collapsed cart control
- **WHEN** a shopper activates the collapsed control
- **THEN** the inline quantity stepper is displayed on the same pill

<!-- trace:scenario id=g10.shared-store-product-listing.SC-ezf rev=1 -->
#### Scenario: shared-ui-store-product-listing-SC-55 - A surface that does not sell
**Serves:** Tile contract - a surface that does not sell

- **GIVEN** an available product rendered without a way to report a quantity change
- **WHEN** a shopper hovers the image and moves keyboard focus through the tile
- **THEN** no cart control is displayed at either moment
- **AND** the product's own activation still reports

#### Scenario: shared-ui-store-product-listing-SC-65 - Coarse pointer keeps the cart visible
**Serves:** Responsive layout - coarse pointer keeps the cart visible

- **GIVEN** an available product that is not in the cart, with a way to report a quantity change
- **AND** the pointer is coarse or hover is not available
- **THEN** the cart control is displayed without hover
- **AND** it can be activated

#### Scenario: shared-ui-store-product-listing-SC-66 - Narrow viewport keeps the cart visible
**Serves:** Responsive layout - narrow viewport keeps the cart visible

- **GIVEN** an available product that is not in the cart, with a way to report a quantity change
- **AND** the surface is below the wide listing breakpoint
- **THEN** the cart control is displayed without hover
- **AND** it can be activated
