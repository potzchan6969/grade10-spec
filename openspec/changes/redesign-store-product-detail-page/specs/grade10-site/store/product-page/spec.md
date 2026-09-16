## Feature set

- Product detail context
  - Media gallery: lets a collector inspect every supplied product image without a lightbox.
  - Purchase context: keeps current price, compare-at price, and inventory state together.
  - Item facts: exposes optional product facets and SKU, with static fulfilment guidance.
- Product detail interaction
  - Description disclosure: lets a collector read the full description without losing their place.
  - Quantity purchase: lets a collector choose a quantity and add the product's one sellable item in place.

## MODIFIED Requirements

### Requirement: A card is added to the cart from its own page

A card's page SHALL let a collector add its one sellable product item to the
storefront's cart, without leaving the page and without returning to the grid.
The page SHALL NOT render or require a choice among sizes, options, or
variants. The underlying Shopify sale identifier remains an internal cart
identity and is not a product choice or display label.

After a card is added the collector SHALL still be on that card, and what the
site says the cart holds SHALL account for what was added. Adding the same
product again SHALL increase one cart line.

#### Scenario: grade10-site-store-product-page-SC-07 - A collector adds the grade they chose
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

- **GIVEN** a card with one sellable product item
- **WHEN** a collector opens its product page
- **THEN** the page offers no size, option, or variant choice

#### Scenario: grade10-site-store-product-page-SC-08 - A card with one thing to buy needs no choice
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

- **GIVEN** a card with one sellable product item
- **WHEN** a collector adds it without choosing anything
- **THEN** the cart holds that product item

#### Scenario: grade10-site-store-product-page-SC-09 - The collector keeps their place
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

- **WHEN** a collector adds a card from its page
- **THEN** they are still on that card's address, reading that card
- **AND** what the site says the cart holds has changed to account for it

#### Scenario: grade10-site-store-product-page-SC-10 - The same card twice
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

- **GIVEN** a collector who has already added a product from its page
- **WHEN** they add the same product again
- **THEN** the cart holds the quantity they added, as one line rather than two

### Requirement: A card nobody can buy says so where the buying happens

A card whose one product item is unavailable SHALL say so on its page, in the
place a collector would otherwise buy it. It SHALL NOT show a control that
cannot be used, and it SHALL NOT hide the price it lists.

#### Scenario: grade10-site-store-product-page-SC-11 - Nothing on the card is for sale
**Serves:** grade10-site-store-product-page-US-04 - Collector meets a card with nothing for sale

- **GIVEN** a card whose one product item is unavailable for sale
- **WHEN** a collector opens its page
- **THEN** the page says the product cannot be bought
- **AND** its price is still visible
- **AND** there is nothing to press that would add it

#### Scenario: grade10-site-store-product-page-SC-12 - One grade sold, another still for sale
**Serves:** grade10-site-store-product-page-US-04 - Collector meets a card with nothing for sale

- **GIVEN** a card whose one product item is unavailable for sale
- **WHEN** a collector opens its page
- **THEN** the product is marked unavailable
- **AND** the page offers no alternate size, option, or variant to add

## ADDED Requirements

### Requirement: A product detail page presents complete catalogue context

The product page SHALL render every image supplied for the product in the
catalogue order, with descriptive alternative text, and SHALL render an
accessible placeholder when the catalogue supplies no image. It SHALL show the
product's one sellable item's current price and SHALL show a compare-at price
only when the catalogue supplies one greater than the current price.

When the product item is available and the catalogue supplies a finite
quantity from one through three, the page SHALL show the remaining quantity.
It SHALL hide that low-inventory message when quantity is greater than three,
unknown, or the product item is sold out.

#### Scenario: grade10-site-store-product-page-SC-13 - A product page shows its media and price context
**Serves:** grade10-site-store-product-page-US-06 - Collector reviews a product's catalogue context

- **GIVEN** a product with two images and one sellable item whose current price is 10500 minor units, compare-at price is 12300 minor units, and finite quantity is 3
- **WHEN** a collector opens the product page
- **THEN** the page renders both images in catalogue order with descriptive alternative text
- **AND** it renders the current price and the greater compare-at price
- **AND** it says that only 3 remain

#### Scenario: grade10-site-store-product-page-SC-14 - A product without media has an honest placeholder
**Serves:** grade10-site-store-product-page-US-06 - Collector reviews a product's catalogue context

- **GIVEN** a product with no catalogue images
- **WHEN** a collector opens the product page
- **THEN** the page renders one accessible placeholder in the media gallery
- **AND** it does not render an empty image or an image URL made by the page

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
product contract. The `Shipping fee` and `Hong Kong Grade10 Store` labels are
visually underlined to match the design, but remain non-interactive until real
destinations are specified.

### Requirement: A product description can be disclosed in place

The product page SHALL render a long description collapsed to at most three
lines by default and SHALL provide a button labelled for expansion. The button
SHALL expose its state through `aria-expanded` and SHALL reference the
description region with `aria-controls`. Activating it SHALL expand the full
description and change the button to the collapse action; activating it again
SHALL restore the collapsed state without navigating away.

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
product's one sellable item. The stepper SHALL clamp to that item's finite
available quantity when one is supplied. While an add is pending, the stepper
and add action SHALL be disabled and the action SHALL show its loading state.
After a successful add, the page SHALL remain on the product address, report
the added state, and reflect the resulting cart quantity. If the product item
is not available for sale, the action SHALL be disabled and labelled as sold
out.

#### Scenario: grade10-site-store-product-page-SC-17 - A collector adds a chosen quantity in place
**Serves:** grade10-site-store-product-page-US-08 - Collector adds a product quantity from the product page

- **GIVEN** a product with one available sellable item and finite quantity 3
- **WHEN** a collector changes the stepper to 2 and activates Add to cart
- **THEN** the pending action disables the stepper and add control
- **AND** the page remains on the product address
- **AND** the cart records quantity 2 for the product's sellable item after the add settles
- **AND** the action reports that the item was added

#### Scenario: grade10-site-store-product-page-SC-18 - A sold-out product offers no add action
**Serves:** grade10-site-store-product-page-US-09 - Collector meets a sold-out product

- **GIVEN** a product whose one sellable item is unavailable for sale
- **WHEN** a collector opens the product page
- **THEN** the product remains priced and marked unavailable
- **AND** the purchase action is disabled and labelled sold out
- **AND** no control can add the product to the cart
