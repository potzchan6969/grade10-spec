## Feature set

- Product detail context
  - Media gallery: lets a collector inspect every supplied product image without a lightbox.
  - Purchase context: keeps current price, compare-at price, and inventory state together.
  - Item facts: exposes optional product facets, shipping guidance, pickup location, and SKU.
- Product detail interaction
  - Description disclosure: lets a collector read the full description without losing their place.
  - Quantity purchase: lets a collector choose a quantity and add the selected variant in place.

## ADDED Requirements

### Requirement: A product detail page presents complete catalogue context

The product page SHALL render every image supplied for the product in the
catalogue order, with descriptive alternative text, and SHALL render an
accessible placeholder when the catalogue supplies no image. It SHALL show the
currently priced variant's current price and SHALL show a compare-at price only
when the catalogue supplies one greater than the current price.

When the priced variant is available and the catalogue supplies a finite
quantity from one through three, the page SHALL show the remaining quantity.
It SHALL hide that low-inventory message when quantity is greater than three,
unknown, or the variant is sold out.

#### Scenario: grade10-site-store-product-page-SC-13 - A product page shows its media and price context

- **GIVEN** a product with two images and a priced variant whose current price is 10500 minor units, compare-at price is 12300 minor units, and finite quantity is 3
- **WHEN** a collector opens the product page
- **THEN** the page renders both images in catalogue order with descriptive alternative text
- **AND** it renders the current price and the greater compare-at price
- **AND** it says that only 3 remain

#### Scenario: grade10-site-store-product-page-SC-14 - A product without media has an honest placeholder

- **GIVEN** a product with no catalogue images
- **WHEN** a collector opens the product page
- **THEN** the page renders one accessible placeholder in the media gallery
- **AND** it does not render an empty image or an image URL made by the page

#### Scenario: grade10-site-store-product-page-SC-15 - A product page shows supplied item facts

- **GIVEN** a product with supplied product-type, world, and language badges, shipping guidance, pickup location, and a SKU
- **WHEN** a collector opens the product page
- **THEN** the page renders the supplied badges as non-interactive labels
- **AND** it renders the shipping guidance, pickup location, and SKU
- **AND** it omits each optional fact the catalogue did not supply

### Requirement: A product description can be disclosed in place

The product page SHALL render a long description collapsed to at most three
lines by default and SHALL provide a button labelled for expansion. The button
SHALL expose its state through `aria-expanded` and SHALL reference the
description region with `aria-controls`. Activating it SHALL expand the full
description and change the button to the collapse action; activating it again
SHALL restore the collapsed state without navigating away.

#### Scenario: grade10-site-store-product-page-SC-16 - A collector expands and collapses the description

- **GIVEN** a product with a description longer than three lines
- **WHEN** a collector opens the product page
- **THEN** the description is collapsed and the disclosure button has `aria-expanded="false"`
- **WHEN** the collector activates the disclosure button
- **THEN** the full description is visible and the button has `aria-expanded="true"`
- **WHEN** the collector activates the button again
- **THEN** the description is collapsed again and the page remains at the same product address

### Requirement: A product page adds a chosen quantity in place

The product page SHALL render a quantity stepper defaulting to one for the
selected variant. The stepper SHALL clamp to the selected variant's finite
available quantity when one is supplied. While an add is pending, the stepper
and add action SHALL be disabled and the action SHALL show its loading state.
After a successful add, the page SHALL remain on the product address, report
the added state, and reflect the resulting cart quantity. If no variant is
available for sale, the action SHALL be disabled and labelled as sold out.

The existing product-page variant rules remain in force: the page opens on the
priced variant, a collector may choose another available variant, unavailable
variants cannot be added, and adding the same variant increases one cart line.

#### Scenario: grade10-site-store-product-page-SC-17 - A collector adds a chosen quantity in place

- **GIVEN** a product with a selected available variant and finite quantity 3
- **WHEN** a collector changes the stepper to 2 and activates Add to cart
- **THEN** the pending action disables the stepper and add control
- **AND** the page remains on the product address
- **AND** the cart records quantity 2 for the selected variant after the add settles
- **AND** the action reports that the item was added

#### Scenario: grade10-site-store-product-page-SC-18 - A sold-out product offers no add action

- **GIVEN** a product whose variants are all unavailable for sale
- **WHEN** a collector opens the product page
- **THEN** every variant remains priced and marked unavailable as applicable
- **AND** the purchase action is disabled and labelled sold out
- **AND** no control can add the product to the cart
