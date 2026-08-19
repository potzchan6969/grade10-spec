# shared-ui/store-product-listing Specification

## Purpose
The surface a shopper browses a category on: a sidebar with search and
collection navigation, a titled result header with sort and filter controls, a
grid of product tiles, and pagination. Every store application renders it from
one shared component source, supplying its own catalog content, copy, and
theme. The components render a selection and report a change; which products
match, how they are ordered, and how many pages exist are decided by the
application.
## Requirements
### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the listing surface — `ProductBrowse`, `FilterPanel`,
`CollectionMenu`, `CollectionMenuItem`, `ProductListHeader`, `ProductList`, and
`ProductCard` — and exactly these types: `AsyncState`, `AsyncAction`,
`ProductSummary`, `FilterGroup`, `FilterOption`, `FilterSelection`,
`SortOption`, `CollectionOption`, `UtilityLink`, `ProductBrowseProps`,
`FilterPanelProps`, `CollectionMenuProps`, `CollectionMenuItemProps`,
`ProductListHeaderProps`, `ProductListProps`, and `ProductCardProps`.

`FilterPanel`, `CollectionMenu`, `CollectionMenuItem`, `ProductListHeader`,
`ProductList`, and `ProductCard` SHALL each be renderable on their own, outside
`ProductBrowse`, so a later surface can reuse one without the others.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: A part is reused alone

- **WHEN** an application renders the product list, the filter panel, the list header, a collection menu item, or a product card without the browse root
- **THEN** it renders and behaves as specified, with no missing-context error and no requirement to supply browse-root props

### Requirement: Every listing value is consumer-controlled

The listing surface SHALL receive the search query, the active collection, the
active chip-filter selection, the active sort option, any exclusive-filter
values, and the current page number as props, and SHALL report every change to
them through a named callback. It SHALL NOT hold any of those values as its own
state, and SHALL NOT change what it displays until the consumer supplies a new
value.

#### Scenario: A control does not move on its own

- **GIVEN** a rendered listing surface with a chip-filter option unselected
- **WHEN** a shopper activates that option and the consumer supplies no new selection
- **THEN** the option is still displayed as unselected
- **AND** the change was reported once, naming the filter group and the option

#### Scenario: A collection does not move on its own

- **GIVEN** a rendered listing surface with one collection marked active
- **WHEN** a shopper activates a different collection and the consumer supplies no new active collection
- **THEN** the previously active collection is still displayed as active
- **AND** the change was reported once, naming the collection

#### Scenario: The consumer drives the display

- **WHEN** the consumer supplies a new search query, active collection, filter selection, sort option, or page number
- **THEN** the surface displays that value without any further interaction

#### Scenario: Every state is reachable from props

- **WHEN** the surface is rendered with props alone, with no application present
- **THEN** each of loading, empty catalog, no filter matches, error, and a resolved page of results can be produced

### Requirement: Collections and result regions resolve independently

The sidebar collection list and the product results SHALL each be supplied as
an independent asynchronous boundary, each carrying its own loading, empty,
error, and resolved condition. A condition on one SHALL NOT change what the
other displays.

#### Scenario: Results fail while collections stand

- **GIVEN** collections that have resolved and results that are in an error condition
- **THEN** the sidebar still displays its search field, collection menu, and utility links, still usable
- **AND** the results region displays the supplied error message
- **AND** a retry affordance is offered when the consumer supplied one, reporting activation through a callback

#### Scenario: Collections load while results are ready

- **GIVEN** collections that are still loading and results that have resolved
- **THEN** the results and their count are displayed
- **AND** the sidebar displays a loading treatment rather than an empty collection menu

#### Scenario: One boundary is not inferred from the other

- **WHEN** either boundary is in a loading condition
- **THEN** the surface displays no global blocking treatment over the region that has resolved

### Requirement: The sidebar displays search, collections, and utility links

The filter panel SHALL display a search field, a collection menu, and any
utility links the consumer supplied, in that order. It SHALL be a complementary
landmark with an accessible name the consumer supplies.

The search field SHALL display the supplied placeholder and the supplied query
value, and SHALL report each change to the query through a callback. When the
consumer supplies a clear handler and a non-empty query, a clear affordance
SHALL be offered that reports activation through that callback.

The collection menu SHALL list each supplied collection in the order supplied,
marking exactly one as active when the consumer supplies an active collection
identifier, and SHALL report a collection change through a callback naming the
chosen collection. A collection SHALL be displayed as active only when its
identifier matches the supplied active collection.

Utility links SHALL be displayed in the order supplied, each with the
supplied label and destination. When no utility links are supplied, that
region SHALL occupy no space.

#### Scenario: Search is displayed and reported as supplied

- **GIVEN** a supplied search query of `pika`
- **THEN** the search field displays `pika`
- **WHEN** a shopper edits the field and the consumer supplies no new query
- **THEN** the field still displays `pika`
- **AND** the change was reported once through the callback

#### Scenario: Search clear is offered only when appropriate

- **GIVEN** a non-empty supplied search query and a supplied clear handler
- **THEN** a clear affordance is displayed
- **WHEN** a shopper activates it
- **THEN** the clear handler is reported once
- **AND** the field still displays the supplied query until the consumer supplies a new one

#### Scenario: No clear affordance without a handler

- **GIVEN** a non-empty supplied search query and no clear handler
- **THEN** no clear affordance is displayed

#### Scenario: A collection is displayed as active

- **GIVEN** an active collection identifier of `pokemon`
- **THEN** only the collection with that identifier is displayed as active

#### Scenario: A collection change is reported

- **GIVEN** an active collection of `pokemon`
- **WHEN** a shopper activates `dragon-ball` and the consumer supplies no new active collection
- **THEN** `pokemon` is still displayed as active
- **AND** `dragon-ball` was reported once through the callback

#### Scenario: An empty collection list

- **GIVEN** a resolved collection list with no collections
- **THEN** the collection menu is not displayed

#### Scenario: No utility links

- **GIVEN** no utility links supplied
- **THEN** no utility-link region is displayed

### Requirement: The product list header displays the title, result count, and controls

The product list header SHALL display a consumer-supplied title and the total
result count exactly as the consumer supplied it, as a formatted string, and
SHALL NOT derive the count from the number of products on the current page.
It SHALL NOT supply a default title.

It SHALL display a sort control listing exactly the sort options supplied, in
the order supplied, with the active option marked as selected. Choosing an
option SHALL report it through a callback. When the active option names a
paired identifier, a further activation of that same control SHALL report the
paired identifier instead, and SHALL rotate the option's trailing control
180°. Choosing an already-active option that has no pair SHALL report nothing.

It SHALL display each supplied chip-filter group as a row of options that can
be selected together, reporting a change that names the group and the option,
and SHALL display an option as selected only when the supplied selection
contains it. A group whose supplied selection contains no option SHALL display
every option as unselected. That empty selection is valid and SHALL NOT hide
or replace the supplied results — it is the unrestricted state of the group.
Selecting a second option SHALL report it without clearing the first, so both
can be selected together. It SHALL display each supplied exclusive-filter group as a
dropdown listing exactly those options, marking the supplied value as
selected and naming it on the trigger. Choosing an exclusive option SHALL
report the group and the option and SHALL dismiss the list. The trigger SHALL
still name the previously selected option until the consumer supplies a new
value.

A chip-filter group or exclusive-filter group whose option list is empty SHALL
not be displayed. An empty list of sort options SHALL hide the sort control.
Sort, chip filters, and exclusive filters SHALL be selectable at the same
time.

#### Scenario: The count is not derived

- **GIVEN** a supplied result count of `38` and a page carrying 8 products
- **THEN** the header displays the supplied `38`

#### Scenario: The title is displayed as supplied

- **WHEN** the header is rendered with a title
- **THEN** that title is displayed exactly as supplied
- **AND** no fallback title is shown

#### Scenario: Sorting is reported

- **WHEN** a shopper chooses a sort option other than the active one
- **THEN** that option is reported once through the callback
- **AND** the previously active option stays marked as selected until the consumer supplies a new one

#### Scenario: A paired sort option reverses on a second activation

- **GIVEN** an active sort option that names a paired identifier
- **WHEN** a shopper activates that same control again
- **THEN** the paired identifier is reported once
- **AND** the trailing control is shown rotated 180° once the consumer supplies the paired identifier as the active option

#### Scenario: No sort options supplied

- **GIVEN** an empty list of sort options
- **THEN** the sort control is not displayed and the title and result count are still displayed

#### Scenario: No chip filter selected

- **GIVEN** a chip-filter group whose supplied selection contains no option
- **THEN** every option is displayed as unselected
- **AND** the supplied results are still displayed

#### Scenario: A chip filter is reported

- **GIVEN** a chip-filter group with no option selected
- **WHEN** a shopper activates one option and the consumer supplies no new selection
- **THEN** that option is still displayed as unselected
- **AND** every other option in the group stays unselected
- **AND** the change was reported once, naming the group and the option

#### Scenario: Two chip filter options selected

- **GIVEN** a chip-filter group whose supplied selection contains two options
- **THEN** both options are displayed as selected together

#### Scenario: An exclusive filter is reported

- **WHEN** a shopper opens an exclusive-filter dropdown and chooses an option other than the active one
- **THEN** that option is reported once, naming the group and the option
- **AND** the option list is dismissed
- **AND** the trigger still names the previously active option until the consumer supplies a new one

#### Scenario: An exclusive filter with no options

- **GIVEN** an exclusive-filter group whose option list is empty
- **THEN** that dropdown is not displayed

#### Scenario: Sort and filters combine

- **WHEN** a sort option, a chip-filter option, and an exclusive-filter option are each selected
- **THEN** all three remain displayed as selected together

### Requirement: The product list displays product tiles and delegates every product action

The product list SHALL display one tile per supplied product, in the order
supplied, using each product's supplied image, tags, name, formatted current
price, formatted original price, discount label, sold-out condition, and cart
condition. It SHALL report tile activation and the cart action through named
callbacks, each identifying the product.

A tile SHALL NOT offer a wishlist control.

The list SHALL NOT format a price, compute a discount, decide whether a product
is sold out, or hold a cart quantity.

#### Scenario: Prices are displayed as supplied

- **GIVEN** a product supplied with a current price of `HKD 105`, an original price of `HKD 123`, and a discount label of `SALE`
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

### Requirement: The product list adapts its column count to the available width

The product list SHALL lay out tiles in an auto-fill grid with a minimum tile
width of 260px (Figma's product card width) and gaps of 20px horizontally and
24px vertically. The column count SHALL grow or shrink with the width remaining
after the fixed sidebar. A tile SHALL remain fully readable and its controls
fully operable at every column count.

#### Scenario: Narrow viewport

- **WHEN** the surface is rendered at mobile width
- **THEN** the list displays one column
- **AND** no content overflows the viewport horizontally

#### Scenario: Wide viewport

- **WHEN** the surface is rendered with enough width for four 260px tiles
- **THEN** the list displays four columns

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

The sidebar SHALL remain displayed and usable in both conditions.

#### Scenario: Filters match nothing

- **GIVEN** a resolved result set with no products and a supplied no-match message
- **THEN** that message is displayed in place of the list
- **AND** the sidebar is still displayed with the current search query, active collection, and header filter selection intact
- **AND** a clear-filters action is offered when the consumer supplied one, reporting activation through a callback

#### Scenario: An empty catalog

- **GIVEN** a resolved result set with no products, no filter selected, and a supplied empty message
- **THEN** that message is displayed and no clear-filters action is offered

### Requirement: Every string on the surface is consumer-supplied

Every human-readable string the listing surface displays SHALL be supplied by
the consumer, including collection labels, search placeholder and label,
utility-link labels, group labels, option labels, the result-count string,
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
region with an accessible name the consumer supplies. Every search field,
collection option, utility link, sort option, chip-filter option,
exclusive-filter option, tile action, and pagination control SHALL be
operable by keyboard alone, with a visible focus indicator, and SHALL expose
its selected, active, or unavailable state to assistive technology through
native semantics.

A change to the displayed result count SHALL be announced without moving focus.

#### Scenario: Keyboard-only operation

- **WHEN** a shopper using a keyboard alone moves through the surface
- **THEN** the search field, every collection option, every utility link, every sort and filter control, every tile action, and every pagination control can be reached and activated
- **AND** the focused element is visibly indicated at each step

#### Scenario: State is exposed natively

- **WHEN** assistive technology inspects the active collection, a selected chip-filter option, the active sort option, the active page, and an unavailable previous control
- **THEN** each state is reported through native semantics rather than styling alone

#### Scenario: A result count change is announced

- **WHEN** the consumer supplies a new result count after a filter change
- **THEN** the new count is announced
- **AND** focus stays where the shopper left it
