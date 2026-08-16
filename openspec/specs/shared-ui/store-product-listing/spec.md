# shared-ui/store-product-listing Specification

## Purpose
The surface a shopper browses a category on: a filter panel, a result count and
sort control, a grid of product tiles, and pagination. Every store application
renders it from one shared component source, supplying its own catalog content,
copy, and theme. The components render a selection and report a change; which
products match, how they are ordered, and how many pages exist are decided by
the application.
## Requirements
### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the listing surface — `ProductListing`, `ProductFilterPanel`,
`ProductListingToolbar`, and `ProductGrid` — and exactly these types:
`AsyncState`, `AsyncAction`, `ProductSummary`, `FilterGroup`, `FilterOption`,
`FilterSelection`, `SortOption`, `ProductListingProps`,
`ProductFilterPanelProps`, `ProductListingToolbarProps`, and `ProductGridProps`.

`ProductFilterPanel`, `ProductListingToolbar`, and `ProductGrid` SHALL each be
renderable on their own, outside `ProductListing`, so a later surface can reuse
one without the others.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: A part is reused alone

- **WHEN** an application renders the product grid, the filter panel, or the toolbar without the listing root
- **THEN** it renders and behaves as specified, with no missing-context error and no requirement to supply listing-root props

### Requirement: Every listing selection is consumer-controlled

The listing surface SHALL receive the active filter selection, the active sort
option, and the current page number as props, and SHALL report every change to
them through a named callback. It SHALL NOT hold any of those values as its own
state, and SHALL NOT change what it displays until the consumer supplies a new
value.

#### Scenario: A control does not move on its own

- **GIVEN** a rendered listing surface with a filter option unselected
- **WHEN** a shopper activates that option and the consumer supplies no new selection
- **THEN** the option is still displayed as unselected
- **AND** the change was reported once, naming the filter group and the option

#### Scenario: The consumer drives the display

- **WHEN** the consumer supplies a new filter selection, sort option, or page number
- **THEN** the surface displays that value without any further interaction

#### Scenario: Every state is reachable from props

- **WHEN** the surface is rendered with props alone, with no application present
- **THEN** each of loading, empty catalog, no filter matches, error, and a resolved page of results can be produced

### Requirement: Filter and result regions resolve independently

The filter panel content and the product results SHALL each be supplied as an
independent asynchronous boundary, each carrying its own loading, empty, error,
and resolved condition. A condition on one SHALL NOT change what the other
displays.

#### Scenario: Results fail while filters stand

- **GIVEN** filters that have resolved and results that are in an error condition
- **THEN** the filter panel still displays its groups and options, still usable
- **AND** the results region displays the supplied error message
- **AND** a retry affordance is offered when the consumer supplied one, reporting activation through a callback

#### Scenario: Filters load while results are ready

- **GIVEN** filters that are still loading and results that have resolved
- **THEN** the results and their count are displayed
- **AND** the filter panel displays a loading treatment rather than an empty panel

#### Scenario: One boundary is not inferred from the other

- **WHEN** either boundary is in a loading condition
- **THEN** the surface displays no global blocking treatment over the region that has resolved

### Requirement: Filter groups display counts and report a selection

The filter panel SHALL display each supplied filter group under its own label,
with each option's human-readable label and its supplied match count, and SHALL
allow more than one option within a group to be selected at once. It SHALL
report a selection change naming the group and the option, and SHALL display an
option as selected only when the supplied selection contains it.

A group SHALL be displayed in the order supplied, and its options in the order
supplied.

#### Scenario: A count is displayed as supplied

- **GIVEN** a filter option supplied with the count `38`
- **THEN** that option displays `38` alongside its label
- **AND** the panel does not compute, adjust, or recount it

#### Scenario: Two options in one group

- **GIVEN** a filter group with two options and a supplied selection containing both
- **THEN** both are displayed as selected

#### Scenario: A group with no options

- **GIVEN** a supplied filter group whose option list is empty
- **THEN** the group's label is not displayed and the group occupies no space

### Requirement: The toolbar displays the result count and the sort control

The toolbar SHALL display the total result count exactly as the consumer
supplied it, as a formatted string, and SHALL NOT derive it from the number of
products on the current page.

It SHALL display a sort control listing exactly the sort options supplied, in
the order supplied, with the active option marked as selected and named on the
control itself. Choosing an option SHALL report it through a callback and SHALL
dismiss the option list.

#### Scenario: The count is not derived

- **GIVEN** a supplied result count of `38` and a page carrying 8 products
- **THEN** the toolbar displays the supplied `38`

#### Scenario: Sorting is reported

- **WHEN** a shopper opens the sort control and chooses an option other than the active one
- **THEN** that option is reported once through the callback
- **AND** the option list is dismissed
- **AND** the control still names the previously active option until the consumer supplies a new one

#### Scenario: No sort options supplied

- **GIVEN** an empty list of sort options
- **THEN** the sort control is not displayed and the result count is still displayed

### Requirement: The grid displays product tiles and delegates every product action

The product grid SHALL display one tile per supplied product, in the order
supplied, using each product's supplied image, category, name, description,
formatted current price, formatted original price, discount label, sold-out
condition, and cart condition. It SHALL report tile activation, the cart
action, a quantity change, and the wishlist action through named callbacks,
each identifying the product.

The grid SHALL NOT format a price, compute a discount, decide whether a product
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

### Requirement: The grid adapts its column count to the available width

The product grid SHALL display four columns at desktop width, two at tablet
width, and one at mobile width, at the design system's token breakpoints. A
tile SHALL remain fully readable and its controls fully operable at every
column count.

#### Scenario: Narrow viewport

- **WHEN** the surface is rendered at mobile width
- **THEN** the grid displays one column
- **AND** no content overflows the viewport horizontally

#### Scenario: Desktop viewport

- **WHEN** the surface is rendered at desktop width
- **THEN** the grid displays four columns

### Requirement: Pagination reflects and reports the page

The listing surface SHALL display pagination when the supplied page count is
greater than one, marking the supplied current page as active, and SHALL report
a page change through a callback without changing the displayed page itself.

Previous SHALL be unavailable on the first page and next SHALL be unavailable
on the last. Pagination SHALL NOT be displayed when the supplied page count is
one or zero.

#### Scenario: A page change is reported

- **GIVEN** a supplied page count of 10 and a current page of 2
- **WHEN** a shopper activates page 3
- **THEN** page 3 is reported once
- **AND** page 2 is still displayed as active until the consumer supplies a new page

#### Scenario: The ends of the range

- **GIVEN** a current page of 1
- **THEN** previous cannot be activated
- **AND** on the last page, next cannot be activated

#### Scenario: A single page

- **GIVEN** a supplied page count of 1
- **THEN** no pagination is displayed

### Requirement: Empty and no-match results are distinguished

When results resolve to no products, the surface SHALL display the message the
consumer supplied for that condition, and SHALL allow the consumer to
distinguish an empty catalog from a filter selection that matches nothing by
supplying a different message and an optional action for each.

The filter panel SHALL remain displayed and usable in both conditions.

#### Scenario: Filters match nothing

- **GIVEN** a resolved result set with no products and a supplied no-match message
- **THEN** that message is displayed in place of the grid
- **AND** the filter panel is still displayed with the current selection intact
- **AND** a clear-filters action is offered when the consumer supplied one, reporting activation through a callback

#### Scenario: An empty catalog

- **GIVEN** a resolved result set with no products, no filter selected, and a supplied empty message
- **THEN** that message is displayed and no clear-filters action is offered

### Requirement: Every string on the surface is consumer-supplied

Every human-readable string the listing surface displays SHALL be supplied by
the consumer, including group labels, option labels, the result-count string,
sort option labels, empty and error messages, accessible names, and every
heading. The components SHALL contain no default, fallback, or built-in copy,
and SHALL NOT read a message catalog.

#### Scenario: Nothing renders unsupplied copy

- **WHEN** the surface is rendered with only its required props
- **THEN** every string displayed traces to a prop the consumer supplied
- **AND** no store name, catalog term, currency, or locale appears that the consumer did not supply

#### Scenario: A second locale needs no source change

- **WHEN** a consumer supplies the same props with every string translated
- **THEN** the surface displays the translated strings with no change to the package

### Requirement: The surface is navigable and announced

The filter panel SHALL be a complementary landmark and the results region a
region with an accessible name the consumer supplies. Every filter option, sort
option, tile action, and pagination control SHALL be operable by keyboard alone,
with a visible focus indicator, and SHALL expose its selected, active, or
unavailable state to assistive technology through native semantics.

A change to the displayed result count SHALL be announced without moving focus.

#### Scenario: Keyboard-only operation

- **WHEN** a shopper using a keyboard alone moves through the surface
- **THEN** every filter option, the sort control and its options, every tile action, and every pagination control can be reached and activated
- **AND** the focused element is visibly indicated at each step

#### Scenario: State is exposed natively

- **WHEN** assistive technology inspects a selected filter option, the active sort option, the active page, and an unavailable previous control
- **THEN** each state is reported through native semantics rather than styling alone

#### Scenario: A result count change is announced

- **WHEN** the consumer supplies a new result count after a filter change
- **THEN** the new count is announced
- **AND** focus stays where the shopper left it

