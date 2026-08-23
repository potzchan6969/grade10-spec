## ADDED Requirements

### Requirement: The product card image displays photo, sale, sold-out, and cart overlay

The product card image SHALL display the supplied photo in a clipped square
well. When no image source is supplied, the well SHALL still render and SHALL
NOT show a fallback photo.

When a sale label is supplied and the product is not sold out, that label SHALL
be displayed on the image. When the product is sold out, the image SHALL use
the sold-out treatment, SHALL display the supplied sold-out label, SHALL NOT
display a sale label, and SHALL NOT display a cart control.

When the product is in the cart and not sold out, the image SHALL display the
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

- **GIVEN** an available product supplied with a sale label of `SALE`
- **THEN** that label is displayed on the image
- **AND** no other sale copy is shown

#### Scenario: A sold-out product

- **GIVEN** a product supplied as sold out with a sold-out label of `SOLD OUT`
- **THEN** the image uses the sold-out treatment
- **AND** the supplied `SOLD OUT` label is displayed
- **AND** no sale label is displayed
- **AND** no cart control is displayed or operable

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

## MODIFIED Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the listing surface — `ProductBrowse`, `FilterPanel`,
`CollectionMenu`, `CollectionMenuItem`, `ProductListHeader`, `ProductList`,
`ProductCard`, and `ProductCardImage` — and exactly these types: `AsyncState`,
`AsyncAction`, `ProductSummary`, `FilterGroup`, `FilterOption`,
`FilterSelection`, `SortOption`, `CollectionOption`, `UtilityLink`,
`ProductBrowseProps`, `FilterPanelProps`, `CollectionMenuProps`,
`CollectionMenuItemProps`, `ProductListHeaderProps`, `ProductListProps`,
`ProductCardProps`, and `ProductCardImageProps`.

`FilterPanel`, `CollectionMenu`, `CollectionMenuItem`, `ProductListHeader`,
`ProductList`, `ProductCard`, and `ProductCardImage` SHALL each be renderable
on their own, outside `ProductBrowse`, so a later surface can reuse one
without the others.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: A part is reused alone

- **WHEN** an application renders the product list, the filter panel, the list header, a collection menu item, a product card, or the product card image without the browse root
- **THEN** it renders and behaves as specified, with no missing-context error and no requirement to supply browse-root props

### Requirement: The product list displays product tiles and delegates every product action

The product list SHALL display one tile per supplied product, in the order
supplied, using each product's supplied image, badge slot, name, formatted
current price, formatted original price, sale label, sold-out condition, and
in-cart condition with its supplied count. It SHALL report tile activation and
the cart action through named callbacks, each identifying the product.

The list SHALL NOT format a price, compute a discount, decide whether a product
is sold out, hold a cart quantity, or display a category line, description, add
button, wishlist control, or quantity stepper.

#### Scenario: Prices are displayed as supplied

- **GIVEN** a product supplied with a current price of `HKD 105` and an original price of `HKD 123`
- **THEN** the tile displays both exactly as supplied
- **AND** the original price is shown with strikethrough treatment

#### Scenario: Badges are displayed as supplied

- **GIVEN** a product supplied with badges `Pokémon`, `M4`, and `JP`
- **THEN** the tile displays those three in the order supplied
- **AND** the tile does not invent, omit, or restyle them as a category line

#### Scenario: A cart action is reported, not performed

- **WHEN** a shopper activates the cart action on a tile
- **THEN** the action is reported once, identifying that product
- **AND** the tile's in-cart condition is unchanged until the consumer supplies a new one

#### Scenario: A sold-out product

- **GIVEN** a product supplied as sold out
- **THEN** its tile displays the sold-out treatment
- **AND** its cart action cannot be activated

#### Scenario: No original price

- **GIVEN** a product supplied with a current price and no original price
- **THEN** only the current price is displayed
- **AND** no strikethrough price is shown

#### Scenario: No wishlist control on a tile

- **WHEN** a product tile renders, whether available or sold out
- **THEN** no wishlist control appears on it
