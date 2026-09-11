## Feature set

- Adaptive filter chrome
  - Narrow viewport: Filter button opens a left drawer for facets; catalogue search stays on the listing
  - Wide viewport: sidebar keeps search above stacked facet groups
  - Facet tabs: in the narrow drawer only, each supplied filter group is a tab so expanding one does not push another down the scroll
  - Drawer actions: Clear and Done are consumer-supplied; Done closes; facet changes still report live

## MODIFIED Requirements

### Requirement: The product list adapts its column count to the available width

The product list SHALL lay out tiles in an auto-fill grid with a minimum tile
width of 240px and gaps of 32px horizontally and vertically. The column
count SHALL grow or shrink with the width remaining for results — after the
fixed sidebar on a wide viewport, and across the full listing width when the
sidebar is not inline. A tile SHALL remain fully readable and its controls
fully operable at every column count.

#### Scenario: shared-ui-store-product-listing-SC-10 - Narrow viewport

- **WHEN** the surface is rendered at mobile width
- **THEN** the list displays one column
- **AND** no content overflows the viewport horizontally
- **AND** facets are reached through a Filter control rather than an inline full-width filter column

#### Scenario: shared-ui-store-product-listing-SC-11 - Wide viewport

- **WHEN** the surface is rendered with enough width for four 240px tiles beside the sidebar
- **THEN** the list displays four columns

### Requirement: Empty and no-match results are distinguished

When results resolve to no products, the surface SHALL display the message the
consumer supplied for that condition, and SHALL allow the consumer to
distinguish an empty catalog from a filter selection that matches nothing by
supplying a different message and an optional action for each.

Filter chrome SHALL remain reachable and usable in both conditions: the
inline sidebar on a wide viewport, and the listing search field plus Filter
control (and its drawer) on a narrow viewport.

#### Scenario: shared-ui-store-product-listing-SC-12 - Filters match nothing

- **GIVEN** a resolved result set with no products and a supplied no-match message
- **THEN** that message is displayed in place of the list
- **AND** the current search query remains displayed on the listing search field
- **AND** the current filter selection remains intact in the filter chrome
- **AND** a clear-filters action is offered when the consumer supplied one, reporting activation through a callback

#### Scenario: shared-ui-store-product-listing-SC-13 - An empty catalog

- **GIVEN** a resolved result set with no products, no filter selected, and a supplied empty message
- **THEN** that message is displayed and no clear-filters action is offered

### Requirement: Filter groups and result regions resolve independently

The filter groups and the product results SHALL each be supplied as an
independent asynchronous boundary, each carrying its own loading, empty,
error, and resolved condition. A condition on one SHALL NOT change what the
other displays.

#### Scenario: shared-ui-store-product-listing-SC-27 - Results fail while filter groups stand

- **GIVEN** filter groups that have resolved and results that are in an error condition
- **THEN** filter chrome still offers its heading, search field, filter groups, and utility links, still usable
- **AND** the results region displays the supplied error message
- **AND** a retry affordance is offered when the consumer supplied one, reporting activation through a callback

#### Scenario: shared-ui-store-product-listing-SC-28 - Filter groups load while results are ready

- **GIVEN** filter groups that are still loading and results that have resolved
- **THEN** the results and their count are displayed
- **AND** the filter chrome displays a loading treatment rather than an empty filter list

#### Scenario: shared-ui-store-product-listing-SC-29 - One boundary is not inferred from the other

- **WHEN** either boundary is in a loading condition
- **THEN** the surface displays no global blocking treatment over the region that has resolved

### Requirement: The sidebar displays a heading, search, filter groups, and utility links

On a wide viewport, the filter panel SHALL display a consumer-supplied
heading, a search field, the product filter, and any utility links the
consumer supplied, in that order. It SHALL be a complementary landmark with
an accessible name the consumer supplies.

On a narrow viewport, the listing SHALL display the search field and a
Filter control whose label the consumer supplies. Activating Filter SHALL
open a left drawer that carries the heading and the product filter. The
drawer SHALL offer Clear and Done actions whose labels the consumer supplies.
Clear SHALL report through the clear-filters callback when the consumer
supplied one. Done SHALL close the drawer. Facet option changes SHALL still
report live through the filter-change callback. Catalogue search SHALL NOT
appear inside the drawer on a narrow viewport. Utility links SHALL NOT appear
inside the drawer on a narrow viewport.

The search field SHALL display the supplied placeholder and the supplied query
value, and SHALL report each change to the query through a callback. When the
consumer supplies a clear handler and a non-empty query, a clear affordance
SHALL be offered that reports activation through that callback.

On a wide viewport, the product filter SHALL display each supplied filter
group that has options in the order supplied, each with its label and its
options. On a narrow viewport inside the filter drawer, when two or more
filter groups with options are supplied, the product filter SHALL present
them as tabs labelled with each group's label, in the order supplied, so
only the active tab's options occupy the facet scroll and expanding one
group SHALL NOT push another group's options down the scroll. Each option
SHALL be selectable together with other options in the same group and in
other groups. An option SHALL be displayed as selected only when the
supplied selection contains it. A group whose supplied selection contains no
option SHALL display every option as unselected. That empty selection is valid
and SHALL NOT hide or replace the supplied results — it is the unrestricted
state of the group. Selecting a second option SHALL report it without
clearing the first. A change SHALL name the group and the option.

An option MAY carry a consumer-supplied count, displayed as supplied. A group
whose option list is empty SHALL not be displayed. When a group carries an
expand label on a wide viewport, an expand affordance SHALL be offered that
reports activation through a callback naming the group. The narrow filter
drawer SHALL NOT offer that expand affordance; it SHALL show the full option
list the consumer supplies for each group.

Utility links SHALL be displayed in the order supplied on a wide viewport,
each with the supplied label and destination. When no utility links are
supplied, that region SHALL occupy no space.

#### Scenario: shared-ui-store-product-listing-SC-30 - Search is displayed and reported as supplied

- **GIVEN** a supplied search query of `pika`
- **THEN** the search field displays `pika`
- **WHEN** a shopper edits the field and the consumer supplies no new query
- **THEN** the field still displays `pika`
- **AND** the change was reported once through the callback

#### Scenario: shared-ui-store-product-listing-SC-31 - Search clear is offered only when appropriate

- **GIVEN** a non-empty supplied search query and a supplied clear handler
- **THEN** a clear affordance is displayed
- **WHEN** a shopper activates it
- **THEN** the clear handler is reported once
- **AND** the field still displays the supplied query until the consumer supplies a new one

#### Scenario: shared-ui-store-product-listing-SC-32 - No clear affordance without a handler

- **GIVEN** a non-empty supplied search query and no clear handler
- **THEN** no clear affordance is displayed

#### Scenario: shared-ui-store-product-listing-SC-33 - No filter selected is unrestricted

- **GIVEN** a filter group whose supplied selection contains no option
- **THEN** every option is displayed as unselected
- **AND** the supplied results are still displayed

#### Scenario: shared-ui-store-product-listing-SC-34 - A sidebar filter is reported

- **GIVEN** a filter group with no option selected
- **WHEN** a shopper activates one option and the consumer supplies no new selection
- **THEN** that option is still displayed as unselected
- **AND** every other option in the group stays unselected
- **AND** the change was reported once, naming the group and the option

#### Scenario: shared-ui-store-product-listing-SC-35 - Two filter options selected

- **GIVEN** a filter group whose supplied selection contains two options
- **THEN** both options are displayed as selected together

#### Scenario: shared-ui-store-product-listing-SC-36 - An empty filter group

- **GIVEN** a resolved filter list that includes a group with no options
- **THEN** that group is not displayed

#### Scenario: shared-ui-store-product-listing-SC-37 - A group expand is reported

- **GIVEN** a filter group with a supplied expand label on a wide viewport
- **WHEN** a shopper activates the expand affordance
- **THEN** the expand callback is reported once, naming the group

#### Scenario: shared-ui-store-product-listing-SC-38 - No utility links

- **GIVEN** no utility links supplied
- **THEN** no utility-link region is displayed

## ADDED Requirements

### Requirement: Narrow viewports open facets in a left drawer

Below the wide breakpoint, `ProductBrowse` SHALL NOT stack a full-width
inline filter column above the results. It SHALL offer a Filter control that
opens a left drawer for facets. Escape, an outside press, and Done SHALL
close the drawer. Opening and closing the drawer SHALL NOT clear the search
query or the filter selection.

#### Scenario: shared-ui-store-product-listing-SC-80 - Filter opens a left drawer

- **GIVEN** the surface at a narrow viewport width
- **WHEN** a shopper activates Filter
- **THEN** a left drawer opens with the facet tabs
- **AND** the catalogue search field remains on the listing outside the drawer

#### Scenario: shared-ui-store-product-listing-SC-81 - Done closes without clearing selection

- **GIVEN** an open filter drawer and a selected facet option
- **WHEN** a shopper activates Done
- **THEN** the drawer closes
- **AND** that option remains selected until the consumer supplies a new selection

### Requirement: Facet groups are presented as tabs in the narrow drawer

On a narrow viewport inside the filter drawer, when two or more filter groups
with options are supplied, the product filter SHALL present them as tabs.
Activating a tab SHALL show that group's options without scrolling another
group's options into view underneath an expanded list. On a wide viewport the
product filter SHALL stack groups, not tabs.

#### Scenario: shared-ui-store-product-listing-SC-82 - Expanding one group does not bury another

- **GIVEN** the surface at a narrow viewport with an open filter drawer and two filter groups with options
- **WHEN** a shopper activates the second group's tab
- **THEN** that group's options are shown
- **AND** the first group's options are not occupying the facet scroll beneath them

#### Scenario: shared-ui-store-product-listing-SC-83 - Wide viewport stacks facet groups

- **GIVEN** the surface at a wide viewport with two filter groups with options
- **THEN** both groups' labels and options are offered in a stack
- **AND** no facet tab list is offered