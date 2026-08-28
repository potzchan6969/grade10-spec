# Store Product Listing — delta

## MODIFIED Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the listing surface — `ProductBrowse`, `FilterPanel`,
`ProductFilter`, `ProductListHeader`, `ProductList`, `ProductCard`, and
`ProductCardImage` — and exactly these types: `AsyncState`, `AsyncAction`,
`ProductSummary`, `ProductAvailability`, `FilterGroup`, `FilterOption`,
`FilterSelection`, `AppliedFilter`, `SortOption`, `UtilityLink`,
`ProductBrowseProps`, `FilterPanelProps`, `ProductFilterProps`,
`ProductListHeaderProps`, `ProductListProps`, `ProductCardProps`,
`ProductCardImageProps`, and the copy type of each of those components.

`ProductAvailability` SHALL name exactly the conditions a tile can be supplied
in — available and out of stock — and SHALL NOT name a condition the listing
never shows.

Each of those components SHALL take the words it renders in a single `copy`
prop of its own copy type, and `ProductBrowseCopy` SHALL be composed of the
copy types of the components `ProductBrowse` renders.

A word every tile renders the same SHALL be supplied once for the list rather
than per tile; a tile SHALL carry only what differs between one product and
the next.

`FilterPanel`, `ProductFilter`, `ProductListHeader`, `ProductList`,
`ProductCard`, and `ProductCardImage` SHALL each be renderable on their own,
outside `ProductBrowse`, so a later surface can reuse one without the others.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: A part is reused alone

- **WHEN** an application renders the product list, the filter panel, the product filter, the list header, a product card, or the product card image without the browse root
- **THEN** it renders and behaves as specified, with no missing-context error and no requirement to supply browse-root props

#### Scenario: A tile is named once

- **GIVEN** a product tile whose card is activatable and whose cart control needs a name
- **WHEN** the consumer supplies the tiles and the words around them
- **THEN** the card's accessible name is the product's own name, supplied once per product
- **AND** the cart control's name comes from the list's copy, supplied once for every tile
- **AND** no prop repeats either

### Requirement: The product list displays product tiles and delegates every product action

The product list SHALL display one tile per supplied product, in the order
supplied, using each product's supplied image, name, formatted current price,
formatted original price, availability, low-stock condition, and in-cart
condition with its supplied count. It SHALL report tile activation and the cart
action through named callbacks, each identifying the product.

Availability and the low-stock condition SHALL be supplied as two separate
facts: a product is supplied as available or out of stock, and separately as
low stock or not. The list SHALL treat a product supplied as available and low
stock exactly as it treats any other available product, other than displaying
the supplied low-stock label. A product supplied as out of stock SHALL NOT
display a low-stock label, whatever the low-stock condition it was supplied
with.

A tile SHALL NOT offer a wishlist control.

A tile SHALL NOT display metadata badges such as collection, series, or
region.

A tile SHALL NOT display a category line, a description, an add button, or a
quantity stepper.

The list SHALL NOT format a price, compute a discount, read an inventory
quantity, decide whether a product is available or low stock, or hold a cart
quantity.

#### Scenario: Prices are displayed as supplied

- **GIVEN** a product supplied with a current price of `HKD 105` and an original price of `HKD 123`
- **THEN** the tile displays both exactly as supplied
- **AND** the original price is shown with strikethrough treatment

#### Scenario: No original price

- **GIVEN** a product supplied with a current price and no original price
- **THEN** only the current price is displayed

#### Scenario: A cart action is reported, not performed

- **WHEN** a shopper activates the cart action on a tile
- **THEN** the action is reported once, identifying that product
- **AND** the tile's cart condition is unchanged until the consumer supplies a new one

#### Scenario: An out-of-stock product

- **GIVEN** a product supplied as out of stock
- **THEN** its tile displays the out-of-stock treatment and its cart action cannot be activated

#### Scenario: A low-stock product

- **GIVEN** a product supplied as available and low stock
- **THEN** its tile displays the supplied low-stock label
- **AND** its cart action can be activated as for any available product

#### Scenario: An available product that is not low stock

- **GIVEN** a product supplied as available and not low stock
- **THEN** no low-stock label is displayed on its tile

#### Scenario: Low stock is ignored on an out-of-stock product

- **GIVEN** a product supplied as out of stock and low stock
- **THEN** the tile displays the out-of-stock treatment
- **AND** no low-stock label is displayed

#### Scenario: Availability is never derived

- **GIVEN** a product supplied as available with no quantity supplied at all
- **THEN** the tile displays it as available
- **AND** the list requests no quantity and derives no condition of its own

#### Scenario: No wishlist control on a tile

- **WHEN** a product tile renders, whether available or out of stock
- **THEN** no wishlist control appears on it

#### Scenario: No metadata badges on a tile

- **WHEN** a product tile renders
- **THEN** no collection, series, or region badge appears on it

### Requirement: The product card image displays photo, sale, availability, and cart overlay

The product card image SHALL display the supplied photo in a clipped square
well. When no image source is supplied, the well SHALL still render and SHALL
NOT show a fallback photo.

When a sale label is supplied and the product is available, that label SHALL
be displayed on the image. When the product is out of stock, the image SHALL
use the out-of-stock treatment, SHALL display the supplied out-of-stock label,
SHALL NOT display a sale label, and SHALL NOT display a cart control.

When the product is available and supplied as low stock, the image SHALL
display the supplied low-stock label. It SHALL display at most one of the sale
and low-stock labels; when both are supplied for the same product, the
low-stock label SHALL be the one displayed, because what a collector can still
get is worth more than what it costs. The out-of-stock treatment SHALL suppress
both.

When the product is in the cart and available, the image SHALL display the
cart control with the supplied count on it. When the product is available and
not in the cart, the cart control SHALL appear on pointer hover and when the
image receives keyboard focus, and SHALL be hidden otherwise. Activating the
cart control SHALL report once through a callback and SHALL NOT change the
in-cart condition until the consumer supplies a new one.

The cart control's accessible name SHALL be the one the consumer supplied. The
image SHALL contain no default, fallback, or built-in copy.

`ProductCardImage` SHALL be renderable on its own, outside `ProductCard`.

#### Scenario: No image source

- **WHEN** the image is rendered without an image source
- **THEN** the well is still displayed
- **AND** no fallback photo is shown

#### Scenario: A sale label is displayed as supplied

- **GIVEN** an available product supplied with a sale label of `SALE` and not supplied as low stock
- **THEN** that label is displayed on the image
- **AND** no other sale copy is shown

#### Scenario: An out-of-stock product

- **GIVEN** a product supplied as out of stock with an out-of-stock label of `SOLD OUT`
- **THEN** the image uses the out-of-stock treatment
- **AND** the supplied `SOLD OUT` label is displayed
- **AND** no sale label is displayed
- **AND** no low-stock label is displayed
- **AND** no cart control is displayed or operable

#### Scenario: A low-stock label is displayed as supplied

- **GIVEN** an available product supplied as low stock with a low-stock label of `LOW STOCK`
- **THEN** that label is displayed on the image
- **AND** the cart control behaves as it does for any available product

#### Scenario: Low stock wins over a sale label

- **GIVEN** an available product supplied as low stock with both a sale label and a low-stock label
- **THEN** the low-stock label is displayed
- **AND** the sale label is not displayed

#### Scenario: An in-cart count is displayed as supplied

- **GIVEN** a product supplied as in the cart with a count of `1`
- **THEN** the cart control is displayed with `1`
- **AND** the image does not increment, format, or hold that count

#### Scenario: A cart action is reported, not performed

- **WHEN** a shopper activates the cart control
- **THEN** the action is reported once
- **AND** the in-cart condition is unchanged until the consumer supplies a new one

#### Scenario: Keyboard reveals the cart control

- **GIVEN** an available product that is not in the cart
- **WHEN** a shopper moves keyboard focus onto the image
- **THEN** the cart control is displayed and can be activated from the keyboard
- **AND** the focused control is visibly indicated

#### Scenario: The image is reused alone

- **WHEN** an application renders the product card image without a product card
- **THEN** it renders and behaves as specified, with no missing-context error
