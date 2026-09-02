# shared/ui/store-product-listing Delta

## ADDED Requirements

### Requirement: The listing surface holds no state of its own

The listing surface SHALL receive the search query, the filter selection, the
active sort option, whether more products can be loaded, and whether a load is
in progress as props, and SHALL report every change to them through a named
callback. It SHALL NOT hold any of those values as its own state, and SHALL
NOT change what it displays until the consumer supplies a new value.

#### Scenario: A control does not move on its own

- **GIVEN** a rendered listing surface with a filter option unselected
- **WHEN** a shopper activates that option and the consumer supplies no new selection
- **THEN** the option is still displayed as unselected
- **AND** the change was reported once, naming the filter group and the option

#### Scenario: The consumer drives the display

- **WHEN** the consumer supplies a new search query, filter selection, sort option, load-more state, or product list
- **THEN** the surface displays that value without any further interaction

#### Scenario: Every state is reachable from props

- **WHEN** the surface is rendered with props alone, with no application present
- **THEN** each of loading, empty catalog, no filter matches, error, loading more, and a resolved list of results can be produced

### Requirement: More products load as the shopper scrolls

The listing surface SHALL NOT display pagination. When the consumer supplies
`hasMore` as true and an `onLoadMore` callback, the surface SHALL report
`onLoadMore` once when the shopper scrolls the product list near its end.
It SHALL NOT change which products are displayed until the consumer supplies
a longer product list.

When the consumer supplies `loadingMore` as true while results are otherwise
ready, the surface SHALL append Boneyard skeleton tiles below the displayed
products. The skeleton count SHALL default to ten when the consumer supplies
no `loadMoreSkeletonCount`.

When `hasMore` is false or omitted, no load trigger SHALL be displayed.
When results are loading, empty, or in error, the surface SHALL NOT report
`onLoadMore`.

#### Scenario: More products are reported on scroll

- **GIVEN** a resolved result list, `hasMore` true, and a supplied `onLoadMore` callback
- **WHEN** a shopper scrolls the product list near its end
- **THEN** `onLoadMore` is reported once
- **AND** the displayed products are unchanged until the consumer supplies a longer list

#### Scenario: Loading more shows skeleton tiles

- **GIVEN** a resolved result list and `loadingMore` true
- **THEN** Boneyard skeleton tiles are displayed below the resolved products
- **AND** the resolved products remain displayed above them

#### Scenario: The end of the catalog

- **GIVEN** `hasMore` false
- **THEN** no load trigger is displayed
- **AND** no further load is reported

#### Scenario: Initial load does not report load more

- **GIVEN** results in a loading, empty, or error condition
- **THEN** `onLoadMore` is not reported

### Requirement: Filter groups and result regions resolve independently

The sidebar filter groups and the product results SHALL each be supplied as
an independent asynchronous boundary, each carrying its own loading, empty,
error, and resolved condition. A condition on one SHALL NOT change what the
other displays.

#### Scenario: Results fail while filter groups stand

- **GIVEN** filter groups that have resolved and results that are in an error condition
- **THEN** the sidebar still displays its heading, search field, filter groups, and utility links, still usable
- **AND** the results region displays the supplied error message
- **AND** a retry affordance is offered when the consumer supplied one, reporting activation through a callback

#### Scenario: Filter groups load while results are ready

- **GIVEN** filter groups that are still loading and results that have resolved
- **THEN** the results and their count are displayed
- **AND** the sidebar displays a loading treatment rather than an empty filter list

#### Scenario: One boundary is not inferred from the other

- **WHEN** either boundary is in a loading condition
- **THEN** the surface displays no global blocking treatment over the region that has resolved

### Requirement: The sidebar displays a heading, search, filter groups, and utility links

The filter panel SHALL display a consumer-supplied heading, a search field,
the product filter, and any utility links the consumer supplied, in that
order. It SHALL be a complementary landmark with an accessible name the
consumer supplies.

The search field SHALL display the supplied placeholder and the supplied query
value, and SHALL report each change to the query through a callback. When the
consumer supplies a clear handler and a non-empty query, a clear affordance
SHALL be offered that reports activation through that callback.

The product filter SHALL display each supplied filter group in the order
supplied, each with its label and its options in the order supplied. Each
option SHALL be selectable together with other options in the same group and
in other groups. An option SHALL be displayed as selected only when the
supplied selection contains it. A group whose supplied selection contains no
option SHALL display every option as unselected. That empty selection is valid
and SHALL NOT hide or replace the supplied results — it is the unrestricted
state of the group. Selecting a second option SHALL report it without
clearing the first. A change SHALL name the group and the option.

An option MAY carry a consumer-supplied count, displayed as supplied. A group
whose option list is empty SHALL not be displayed. When a group carries an
expand label, an expand affordance SHALL be offered that reports activation
through a callback naming the group.

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

#### Scenario: No filter selected is unrestricted

- **GIVEN** a filter group whose supplied selection contains no option
- **THEN** every option is displayed as unselected
- **AND** the supplied results are still displayed

#### Scenario: A sidebar filter is reported

- **GIVEN** a filter group with no option selected
- **WHEN** a shopper activates one option and the consumer supplies no new selection
- **THEN** that option is still displayed as unselected
- **AND** every other option in the group stays unselected
- **AND** the change was reported once, naming the group and the option

#### Scenario: Two filter options selected

- **GIVEN** a filter group whose supplied selection contains two options
- **THEN** both options are displayed as selected together

#### Scenario: An empty filter group

- **GIVEN** a resolved filter list that includes a group with no options
- **THEN** that group is not displayed

#### Scenario: A group expand is reported

- **GIVEN** a filter group with a supplied expand label
- **WHEN** a shopper activates the expand affordance
- **THEN** the expand handler is reported once, naming the group

#### Scenario: No utility links

- **GIVEN** no utility links supplied
- **THEN** no utility-link region is displayed

### Requirement: The product list header displays the result count, applied filters, and the sort control

The product list header SHALL display the total result count exactly as the
consumer supplied it, as a formatted string, and SHALL NOT derive the count
from the number of products on the current page. It SHALL NOT display a
separate title.

It SHALL display a sort control listing exactly the sort options supplied, in
the order supplied, with the active option marked as selected. The sort
trigger SHALL display the consumer-supplied trigger label. Choosing an option
SHALL report it through a callback and SHALL dismiss the list. Choosing an
already-active option SHALL report nothing. An empty list of sort options
SHALL hide the sort control.

It SHALL display each supplied applied filter as a chip that can be dismissed,
reporting a change that names the group and the option as unselected. When
the consumer supplies a clear handler and at least one applied filter, a
clear affordance SHALL be offered that reports activation through that
callback. When no applied filter is supplied, the applied-filter region SHALL
occupy no space. Sort and applied filters SHALL be selectable at the same
time.

#### Scenario: The count is not derived

- **GIVEN** a supplied result count of `38` and a page carrying 8 products
- **THEN** the header displays the supplied `38`

#### Scenario: Sorting is reported

- **WHEN** a shopper chooses a sort option other than the active one
- **THEN** that option is reported once through the callback
- **AND** the option list is dismissed
- **AND** the previously active option stays marked as selected until the consumer supplies a new one

#### Scenario: No sort options supplied

- **GIVEN** an empty list of sort options
- **THEN** the sort control is not displayed and the result count is still displayed

#### Scenario: No applied filters

- **GIVEN** no applied filters supplied
- **THEN** the applied-filter region is not displayed
- **AND** the result count is still displayed

#### Scenario: An applied filter is removed

- **GIVEN** a supplied applied filter
- **WHEN** a shopper dismisses that chip and the consumer supplies no new list
- **THEN** the chip is still displayed
- **AND** the change was reported once, naming the group and the option as unselected

#### Scenario: Applied filters are cleared

- **GIVEN** at least one supplied applied filter and a supplied clear handler
- **WHEN** a shopper activates the clear affordance
- **THEN** the clear handler is reported once
- **AND** the chips are still displayed until the consumer supplies a new list

#### Scenario: Sort and applied filters combine

- **WHEN** a sort option is selected and at least one applied filter is supplied
- **THEN** both remain displayed together

## MODIFIED Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the listing surface — `ProductBrowse`, `FilterPanel`,
`ProductFilter`, `ProductListHeader`, `ProductList`, and `ProductCard` — and
exactly these types: `AsyncState`, `AsyncAction`, `ProductSummary`,
`FilterGroup`, `FilterOption`, `FilterSelection`, `AppliedFilter`,
`SortOption`, `UtilityLink`, `ProductBrowseProps`, `FilterPanelProps`,
`ProductFilterProps`, `ProductListHeaderProps`, `ProductListProps`, and
`ProductCardProps`.

`FilterPanel`, `ProductFilter`, `ProductListHeader`, `ProductList`, and
`ProductCard` SHALL each be renderable on their own, outside `ProductBrowse`,
so a later surface can reuse one without the others.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: A part is reused alone

- **WHEN** an application renders the product list, the filter panel, the product filter, the list header, or a product card without the browse root
- **THEN** it renders and behaves as specified, with no missing-context error and no requirement to supply browse-root props

### Requirement: The product list displays product tiles and delegates every product action

The product list SHALL display one tile per supplied product, in the order
supplied, using each product's supplied image, name, formatted current
price, formatted original price, discount label, sold-out condition, and cart
condition. It SHALL report tile activation and the cart action through named
callbacks, each identifying the product.

A tile SHALL NOT offer a wishlist control.

A tile SHALL NOT display metadata badges such as collection, series, or
region.

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

#### Scenario: No metadata badges on a tile

- **WHEN** a product tile renders
- **THEN** no collection, series, or region badge appears on it

### Requirement: The product list adapts its column count to the available width

The product list SHALL lay out tiles in an auto-fill grid with a minimum tile
width of 240px and gaps of 32px horizontally and vertically. The column
count SHALL grow or shrink with the width remaining after the fixed sidebar.
A tile SHALL remain fully readable and its controls fully operable at every
column count.

#### Scenario: Narrow viewport

- **WHEN** the surface is rendered at mobile width
- **THEN** the list displays one column
- **AND** no content overflows the viewport horizontally

#### Scenario: Wide viewport

- **WHEN** the surface is rendered with enough width for four 240px tiles
- **THEN** the list displays four columns

### Requirement: Empty and no-match results are distinguished

When results resolve to no products, the surface SHALL display the message the
consumer supplied for that condition, and SHALL allow the consumer to
distinguish an empty catalog from a filter selection that matches nothing by
supplying a different message and an optional action for each.

The sidebar SHALL remain displayed and usable in both conditions.

#### Scenario: Filters match nothing

- **GIVEN** a resolved result set with no products and a supplied no-match message
- **THEN** that message is displayed in place of the list
- **AND** the sidebar is still displayed with the current search query and filter selection intact
- **AND** a clear-filters action is offered when the consumer supplied one, reporting activation through a callback

#### Scenario: An empty catalog

- **GIVEN** a resolved result set with no products, no filter selected, and a supplied empty message
- **THEN** that message is displayed and no clear-filters action is offered

### Requirement: Every string on the surface is consumer-supplied

Every human-readable string the listing surface displays SHALL be supplied by
the consumer, including filter-group labels, option labels, counts, expand
labels, search placeholder and label, utility-link labels, the result-count
string, the sort trigger label, sort option labels, applied-filter labels,
the clear-filters label, empty and error messages, accessible names, and every
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
filter option, expand affordance, utility link, sort option, applied-filter
chip, clear-filters control, and tile action SHALL be operable by keyboard
alone, with a visible focus indicator, and SHALL expose its selected or
active state to assistive technology through native semantics.

While more products are loading, the results region SHALL expose a busy state
without moving focus.

A change to the displayed result count SHALL be announced without moving focus.

#### Scenario: Keyboard-only operation

- **WHEN** a shopper using a keyboard alone moves through the surface
- **THEN** the search field, every filter option, every expand affordance, every utility link, the sort control, every applied-filter chip, the clear-filters control, and every tile action can be reached and activated
- **AND** the focused element is visibly indicated at each step

#### Scenario: State is exposed natively

- **WHEN** assistive technology inspects a selected filter option, the active sort option, and an applied-filter chip
- **THEN** each state is reported through native semantics rather than styling alone

#### Scenario: Loading more is announced as busy

- **GIVEN** a resolved result list and `loadingMore` true
- **THEN** the results region is exposed as busy
- **AND** focus stays where the shopper left it

#### Scenario: A result count change is announced

- **WHEN** the consumer supplies a new result count after a filter change
- **THEN** the new count is announced
- **AND** focus stays where the shopper left it

## REMOVED Requirements

### Requirement: Every listing value is consumer-controlled

**Reason:** Every value it named is gone or renamed — the active collection,
the chip-filter selection, the exclusive-filter values, and the page number.
What the surface now receives is stated by "The listing surface holds no state
of its own", which keeps the same rule over the new set.

**Migration:** None beyond the prop changes the replacing requirements name.

### Requirement: Collections and result regions resolve independently

**Reason:** There is no collection boundary to resolve. The sidebar's
asynchronous boundary now carries filter groups, described by "Filter groups
and result regions resolve independently".

**Migration:** Supply the sidebar boundary as `groups` instead of
`collections`. Its loading, empty, error, and resolved conditions are
unchanged.

### Requirement: The sidebar displays search, collections, and utility links

**Reason:** The collection menu leaves the sidebar; multi-select filter groups
take its place. Replaced by "The sidebar displays a heading, search, filter
groups, and utility links".

**Migration:** Stop importing `CollectionMenu`, `CollectionMenuItem`, and
`CollectionOption`. Pass `groups` and a filter `selection` instead of
`collections` and `activeCollection`, and supply the sidebar heading.

### Requirement: The product list header displays the title, result count, and controls

**Reason:** The header no longer carries a title, sort chips with a paired
reversal, chip-filter groups, or an exclusive-filter dropdown. Replaced by
"The product list header displays the result count, applied filters, and the
sort control".

**Migration:** Stop passing `title`, `chipFilters`, and `selectFilters`.
Pass `sortTriggerLabel` and `appliedFilters`. Filter groups move to the
sidebar's `groups`.

### Requirement: Pagination reflects and reports the page

**Reason:** The list loads more as the shopper scrolls, described by "More
products load as the shopper scrolls". No page exists to reflect or report.

**Migration:** Stop passing `page`, `pageCount`, `onPageChange`,
`previousLabel`, `nextLabel`, `paginationLabel`, and `morePagesLabel`.
Pass `hasMore`, `loadingMore`, and `onLoadMore`, appending to the
supplied product list when `onLoadMore` is reported.
