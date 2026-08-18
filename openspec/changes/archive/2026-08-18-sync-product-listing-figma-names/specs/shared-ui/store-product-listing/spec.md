# Store Product Listing — delta

## ADDED Requirements

### Requirement: The collection banner displays store-supplied trail, title, and description

The collection banner SHALL display the supplied breadcrumbs, collection name,
and description, and SHALL NOT supply a default for any of them. When an image
source is supplied it SHALL display that image; when it is omitted, only the
copy remains.

#### Scenario: Copy is displayed as supplied

- **WHEN** the banner is rendered with a collection name and description
- **THEN** both are displayed exactly as supplied

#### Scenario: No image

- **WHEN** the banner is rendered without an image source
- **THEN** the breadcrumbs, collection name, and description are still displayed
- **AND** no fallback image is shown

## MODIFIED Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the listing surface — `ProductBrowse`, `CollectionBanner`,
`FilterPanel`, `ProductListHeader`, `ProductList`, and `ProductCard` — and
exactly these types: `AsyncState`, `AsyncAction`, `ProductSummary`,
`FilterGroup`, `FilterOption`, `FilterSelection`, `SortOption`,
`ProductBrowseProps`, `CollectionBannerProps`, `FilterPanelProps`,
`ProductListHeaderProps`, `ProductListProps`, and `ProductCardProps`.

`CollectionBanner`, `FilterPanel`, `ProductListHeader`, `ProductList`, and
`ProductCard` SHALL each be renderable on their own, outside `ProductBrowse`,
so a later surface can reuse one without the others.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: A part is reused alone

- **WHEN** an application renders the product list, the filter panel, the list header, a product card, or the collection banner without the browse root
- **THEN** it renders and behaves as specified, with no missing-context error and no requirement to supply browse-root props

### Requirement: The product list header displays the result count and the sort control

The product list header SHALL display the total result count exactly as the
consumer supplied it, as a formatted string, and SHALL NOT derive it from the
number of products on the current page.

It SHALL display a sort control listing exactly the sort options supplied, in
the order supplied, with the active option marked as selected and named on the
control itself. Choosing an option SHALL report it through a callback and SHALL
dismiss the option list.

#### Scenario: The count is not derived

- **GIVEN** a supplied result count of `38` and a page carrying 8 products
- **THEN** the header displays the supplied `38`

#### Scenario: Sorting is reported

- **WHEN** a shopper opens the sort control and chooses an option other than the active one
- **THEN** that option is reported once through the callback
- **AND** the option list is dismissed
- **AND** the control still names the previously active option until the consumer supplies a new one

#### Scenario: No sort options supplied

- **GIVEN** an empty list of sort options
- **THEN** the sort control is not displayed and the result count is still displayed

### Requirement: The product list displays product tiles and delegates every product action

The product list SHALL display one tile per supplied product, in the order
supplied, using each product's supplied image, category, name, description,
formatted current price, formatted original price, discount label, sold-out
condition, and cart condition. It SHALL report tile activation, the cart
action, a quantity change, and the wishlist action through named callbacks,
each identifying the product.

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

### Requirement: The product list adapts its column count to the available width

The product list SHALL display four columns at desktop width, two at tablet
width, and one at mobile width, at the design system's token breakpoints. A
tile SHALL remain fully readable and its controls fully operable at every
column count.

#### Scenario: Narrow viewport

- **WHEN** the surface is rendered at mobile width
- **THEN** the list displays one column
- **AND** no content overflows the viewport horizontally

#### Scenario: Desktop viewport

- **WHEN** the surface is rendered at desktop width
- **THEN** the list displays four columns
