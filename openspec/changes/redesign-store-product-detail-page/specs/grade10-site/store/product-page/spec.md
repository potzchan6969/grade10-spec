## Feature set

- Product detail context
  - Media gallery: lets a collector inspect every supplied product image without a lightbox.
  - Purchase context: keeps current price, compare-at price, and availability together.
  - Item facts: exposes optional product facets and SKU, with fulfilment guidance in which Shipping fee is text and the store name opens Store Locator, per Free pick-up opens Store Locator.
- Product detail interaction
  - Description disclosure: lets a collector read the full description without losing their place.
  - Quantity purchase: lets a collector choose a quantity and add the product's one sellable item in place.

## ADDED Requirements

### Requirement: A product detail page presents complete catalogue context

The product page SHALL render every image supplied for the product in the
catalogue order, with descriptive alternative text, and SHALL render an
accessible placeholder when the catalogue supplies no image. It SHALL show the
product's one sellable item's current price and SHALL show a compare-at price
only when the catalogue supplies one greater than the current price. It SHALL
NOT show a remaining quantity, as `grade10-site/commerce/product-status`
requires.

<!-- trace:scenario id=g10.store-product-page.SC-n6k rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-13 - A product page shows its media and price context
**Serves:** grade10-site-store-product-page-US-06 - Collector reviews a product's catalogue context

- **GIVEN** a product with two images and one sellable item whose current price is 10500 minor units, compare-at price is 12300 minor units, and finite quantity is 3
- **WHEN** a collector opens the product page
- **THEN** the page renders both images in catalogue order with descriptive alternative text
- **AND** it renders the current price and the greater compare-at price
- **AND** it says nothing about how many remain

<!-- trace:scenario id=g10.store-product-page.SC-dd3 rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-14 - A product without media has an honest placeholder
**Serves:** grade10-site-store-product-page-US-06 - Collector reviews a product's catalogue context

- **GIVEN** a product with no catalogue images
- **WHEN** a collector opens the product page
- **THEN** the page renders one accessible placeholder in the media gallery
- **AND** it does not render an empty image or an image URL made by the page

<!-- trace:scenario id=g10.store-product-page.SC-h7c rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-15 - A product page shows supplied item facts
**Serves:** grade10-site-store-product-page-US-06 - Collector reviews a product's catalogue context

- **GIVEN** a product with supplied product-type, world, and language badges and a SKU
- **WHEN** a collector opens the product page
- **THEN** the page renders the supplied badges as non-interactive labels
- **AND** it renders this static fulfilment copy for every product:
  - `Shipping calculated at checkout. Shipping fee`
  - `Free pick-up at Hong Kong Grade10 Store`
- **AND** it renders the supplied SKU below the fulfilment copy
- **AND** it omits each optional product fact the catalogue did not supply

The fulfilment copy is locale-catalogue copy in v1, not a field from the
product contract. `Shipping fee` is text; the `Hong Kong Grade10 Store` label
opens Store Locator, per `Free pick-up opens Store Locator`.

### Requirement: A product description can be disclosed in place

The product page SHALL render a long description collapsed to at most three
lines by default and SHALL provide a button labelled for expansion. The button
SHALL expose its state through `aria-expanded` and SHALL reference the
description region with `aria-controls`. Activating it SHALL expand the full
description and change the button to the collapse action; activating it again
SHALL restore the collapsed state without navigating away.

<!-- trace:scenario id=g10.store-product-page.SC-yaj rev=1 -->
#### Scenario: grade10-site-store-product-page-SC-16 - A collector expands and collapses the description
**Serves:** grade10-site-store-product-page-US-07 - Collector expands the product description in place

- **GIVEN** a product with a description longer than three lines
- **WHEN** a collector opens the product page
- **THEN** the description is collapsed and the disclosure button has `aria-expanded="false"`
- **WHEN** the collector activates the disclosure button
- **THEN** the full description is visible and the button has `aria-expanded="true"`
- **WHEN** the collector activates the button again
- **THEN** the description is collapsed again and the page remains at the same product address

### Requirement: A product page adds a chosen quantity in place

The product page SHALL render a quantity stepper defaulting to one for the
product's one sellable item. While an add is pending, the stepper and the add
action SHALL be disabled and the action SHALL show its loading state labelled
for adding. After a successful add, the page SHALL open the cart drawer and
reset the quantity stepper to one, and SHALL NOT show an on-page added
confirmation. When the item is sold out, the add action itself SHALL read Sold
out.

<!-- trace:scenario id=g10.store-product-page.SC-lqp rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-17 - A collector adds a chosen quantity in place
**Serves:** grade10-site-store-product-page-US-08 - Collector adds a product quantity from the product page

- **GIVEN** a product with one available sellable item
- **WHEN** a collector changes the stepper to 2 and activates Add to cart
- **THEN** the pending action disables the stepper and add control
- **AND** the add control shows its loading label
- **WHEN** the add settles
- **THEN** the cart drawer opens
- **AND** the quantity stepper resets to one
- **AND** the page shows no on-page added confirmation

<!-- trace:scenario id=g10.store-product-page.SC-xny rev=2 -->
#### Scenario: grade10-site-store-product-page-SC-18 - A sold-out product's add reads Sold out and cannot be pressed
**Serves:** grade10-site-store-product-page-US-09 - Collector meets a sold-out product

- **GIVEN** a product whose one sellable item is sold out
- **WHEN** a collector opens the product page
- **THEN** the add action reads Sold out and cannot be pressed
