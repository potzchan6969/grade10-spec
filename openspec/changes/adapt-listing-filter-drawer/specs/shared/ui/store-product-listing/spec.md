## Feature set

- Adaptive filter chrome
  - Narrow viewport: result count plus pills for sort and each facet group; bottom drawers; no listing search
  - Wide viewport: sidebar keeps search above stacked facet groups
  - Sort: short-name pill; bottom drawer applies on choose and closes
  - Facet pills: label from none / one / many; bottom drawer drafts until Show Results; Clear clears that group’s draft

## MODIFIED Requirements

### Requirement: The product list adapts its column count to the available width

The product list SHALL lay out tiles in an auto-fill grid with a minimum tile
width of 240px and gaps of 32px horizontally and vertically. The column
count SHALL grow or shrink with the width remaining for results — after the
fixed sidebar on a wide viewport, and across the full listing width when the
sidebar is not inline. A tile SHALL remain fully readable and its controls
fully operable at every column count.

#### Scenario: shared-ui-store-product-listing-SC-10 - Narrow viewport
**Serves:** Responsive layout - narrow viewport

- **WHEN** the surface is rendered at mobile width
- **THEN** the list displays one column
- **AND** no content overflows the viewport horizontally
- **AND** facets and sort are reached through pills above the grid, not an inline full-width filter column

#### Scenario: shared-ui-store-product-listing-SC-11 - Wide viewport
**Serves:** Responsive layout - wide viewport

- **WHEN** the surface is rendered with enough width for four 240px tiles beside the sidebar
- **THEN** the list displays four columns

### Requirement: Empty and no-match results are distinguished

When results resolve to no products, the surface SHALL display the message the
consumer supplied for that condition, and SHALL allow the consumer to
distinguish an empty catalog from a filter selection that matches nothing by
supplying a different message and an optional action for each.

Filter chrome SHALL remain reachable and usable in both conditions: the
inline sidebar on a wide viewport, and the narrow pills (and their drawers)
on a narrow viewport.

#### Scenario: shared-ui-store-product-listing-SC-12 - Filters match nothing
**Serves:** Browse states - filters match nothing

- **GIVEN** a resolved result set with no products and a supplied no-match message
- **THEN** that message is displayed in place of the list
- **AND** the current filter selection remains intact in the filter chrome
- **AND** a clear-filters action is offered when the consumer supplied one on a wide viewport, reporting activation through a callback

#### Scenario: shared-ui-store-product-listing-SC-13 - An empty catalog
**Serves:** Browse states - an empty catalog

- **GIVEN** a resolved result set with no products, no filter selected, and a supplied empty message
- **THEN** that message is displayed and no clear-filters action is offered

### Requirement: Filter groups and result regions resolve independently

The filter groups and the product results SHALL each be supplied as an
independent asynchronous boundary, each carrying its own loading, empty,
error, and resolved condition. A condition on one SHALL NOT change what the
other displays.

#### Scenario: shared-ui-store-product-listing-SC-27 - Results fail while filter groups stand
**Serves:** Browse states - results fail while filter groups stand

- **GIVEN** filter groups that have resolved and results that are in an error condition
- **THEN** filter chrome still offers its controls, still usable
- **AND** the results region displays the supplied error message
- **AND** a retry affordance is offered when the consumer supplied one, reporting activation through a callback

#### Scenario: shared-ui-store-product-listing-SC-28 - Filter groups load while results are ready
**Serves:** Browse states - filter groups load while results are ready

- **GIVEN** filter groups that are still loading and results that have resolved
- **THEN** the results and their count are displayed
- **AND** the filter chrome displays a loading treatment rather than an empty filter list

#### Scenario: shared-ui-store-product-listing-SC-29 - One boundary is not inferred from the other
**Serves:** Browse states - one boundary is not inferred from the other

- **WHEN** either boundary is in a loading condition
- **THEN** the surface displays no global blocking treatment over the region that has resolved

### Requirement: The sidebar displays a heading, search, filter groups, and utility links

On a wide viewport, the filter panel SHALL display a consumer-supplied
heading, a search field, the product filter, and any utility links the
consumer supplied, in that order. It SHALL be a complementary landmark with
an accessible name the consumer supplies.

On a narrow viewport, the listing SHALL NOT display a listing search field and
SHALL NOT open facets from a left Filter drawer. It SHALL display the result
count and a row of pills: one for sort when sort options are supplied, and one
for each supplied filter group that has options, in group order.

The search field (wide only) SHALL display the supplied placeholder and the
supplied query value, and SHALL report each change to the query through a
callback. When the consumer supplies a clear handler and a non-empty query, a
clear affordance SHALL be offered that reports activation through that
callback.

On a wide viewport, the product filter SHALL display each supplied filter
group that has options in the order supplied, each with its label and its
options. Each option SHALL be selectable together with other options in the
same group and in other groups. An option SHALL be displayed as selected only
when the supplied selection contains it. A group whose supplied selection
contains no option SHALL display every option as unselected. That empty
selection is valid and SHALL NOT hide or replace the supplied results — it is
the unrestricted state of the group. Selecting a second option SHALL report it
without clearing the first. A change SHALL name the group and the option.

An option MAY carry a consumer-supplied count, displayed as supplied. A group
whose option list is empty SHALL not be displayed. When a group carries an
expand label on a wide viewport, an expand affordance SHALL be offered that
reports activation through a callback naming the group. When a group carries a
collapse label on a wide viewport, a collapse affordance SHALL be offered that
reports activation through a callback naming the group.

Utility links SHALL be displayed in the order supplied on a wide viewport,
each with the supplied label and destination. When no utility links are
supplied, that region SHALL occupy no space.

#### Scenario: shared-ui-store-product-listing-SC-30 - Search is displayed and reported as supplied
**Serves:** Filters and sort - search is displayed and reported as supplied

- **GIVEN** a wide viewport and a supplied search query of `pika`
- **THEN** the search field displays `pika`
- **WHEN** a shopper edits the field and the consumer supplies no new query
- **THEN** the field still displays `pika`
- **AND** the change was reported once through the callback

#### Scenario: shared-ui-store-product-listing-SC-31 - Search clear is offered only when appropriate
**Serves:** Filters and sort - search clear is offered only when appropriate

- **GIVEN** a wide viewport, a non-empty supplied search query, and a supplied clear handler
- **THEN** a clear affordance is displayed
- **WHEN** a shopper activates it
- **THEN** the clear handler is reported once
- **AND** the field still displays the supplied query until the consumer supplies a new one

#### Scenario: shared-ui-store-product-listing-SC-32 - No clear affordance without a handler
**Serves:** No defaulted content - no clear affordance without a handler

- **GIVEN** a wide viewport, a non-empty supplied search query, and no clear handler
- **THEN** no clear affordance is displayed

#### Scenario: shared-ui-store-product-listing-SC-33 - No filter selected is unrestricted
**Serves:** Filters and sort - no filter selected is unrestricted

- **GIVEN** a filter group whose supplied selection contains no option
- **THEN** every option is displayed as unselected
- **AND** the supplied results are still displayed

#### Scenario: shared-ui-store-product-listing-SC-34 - A sidebar filter is reported
**Serves:** Filters and sort - a sidebar filter is reported

- **GIVEN** a filter group with no option selected
- **WHEN** a shopper activates one option and the consumer supplies no new selection
- **THEN** that option is still displayed as unselected
- **AND** every other option in the group stays unselected
- **AND** the change was reported once, naming the group and the option

#### Scenario: shared-ui-store-product-listing-SC-35 - Two filter options selected
**Serves:** Filters and sort - two filter options selected

- **GIVEN** a filter group whose supplied selection contains two options
- **THEN** both options are displayed as selected together

#### Scenario: shared-ui-store-product-listing-SC-36 - An empty filter group
**Serves:** Filters and sort - an empty filter group

- **GIVEN** a resolved filter list that includes a group with no options
- **THEN** that group is not displayed

#### Scenario: shared-ui-store-product-listing-SC-37 - A group expand is reported
**Serves:** Filters and sort - a group expand is reported

- **GIVEN** a filter group with a supplied expand label on a wide viewport
- **WHEN** a shopper activates the expand affordance
- **THEN** the expand callback is reported once, naming the group

#### Scenario: shared-ui-store-product-listing-SC-86 - A group collapse is reported
**Serves:** Adaptive filter chrome - a group collapse is reported

- **GIVEN** a filter group with a supplied collapse label on a wide viewport
- **WHEN** a shopper activates the collapse affordance
- **THEN** the collapse callback is reported once, naming the group

#### Scenario: shared-ui-store-product-listing-SC-38 - No utility links
**Serves:** No defaulted content - no utility links

- **GIVEN** no utility links supplied
- **THEN** no utility-link region is displayed

### Requirement: The product list header displays the result count, applied filters, and the sort control

On a wide viewport, the product list header SHALL display the total result
count exactly as the consumer supplied it, as a formatted string, and SHALL
NOT derive the count from the number of products on the current page. It SHALL
NOT display a separate title.

On a wide viewport it SHALL display a sort control listing exactly the sort
options supplied, in the order supplied, with the active option marked as
selected. The sort trigger SHALL display the consumer-supplied trigger label
when supplied, otherwise the active option’s label. Choosing an option SHALL
report it through a callback and SHALL dismiss the list. Choosing an
already-active option SHALL report nothing. An empty list of sort options
SHALL hide the sort control.

On a wide viewport it SHALL display each supplied applied filter as a chip that
can be dismissed, reporting a change that names the group and the option as
unselected. When the consumer supplies a clear handler and at least one
applied filter, a clear affordance SHALL be offered that reports activation
through that callback. When no applied filter is supplied, the applied-filter
region SHALL occupy no space. Sort and applied filters SHALL be selectable at
the same time.

On a narrow viewport the header region SHALL follow the narrow pill chrome in
*Narrow viewports use sort and facet pills with bottom drawers* instead of
chips and a dropdown sort trigger.

#### Scenario: shared-ui-store-product-listing-SC-39 - The count is not derived
**Serves:** Filters and sort - the count is not derived

- **GIVEN** a supplied result count of `38` and a page carrying 8 products
- **THEN** the header displays the supplied `38`

#### Scenario: shared-ui-store-product-listing-SC-40 - Sorting is reported
**Serves:** Filters and sort - sorting is reported

- **WHEN** a shopper chooses a sort option other than the active one
- **THEN** that option is reported once through the callback
- **AND** the option list is dismissed
- **AND** the previously active option stays marked as selected until the consumer supplies a new one

#### Scenario: shared-ui-store-product-listing-SC-41 - No sort options supplied
**Serves:** Filters and sort - no sort options supplied

- **GIVEN** an empty list of sort options
- **THEN** the sort control is not displayed and the result count is still displayed

#### Scenario: shared-ui-store-product-listing-SC-42 - No applied filters
**Serves:** Filters and sort - no applied filters

- **GIVEN** a wide viewport and no applied filters supplied
- **THEN** the applied-filter region is not displayed
- **AND** the result count is still displayed

#### Scenario: shared-ui-store-product-listing-SC-43 - An applied filter is removed
**Serves:** Filters and sort - an applied filter is removed

- **GIVEN** a wide viewport and a supplied applied filter
- **WHEN** a shopper dismisses that chip
- **THEN** a change is reported naming the group and the option as unselected

#### Scenario: shared-ui-store-product-listing-SC-44 - Applied filters are cleared
**Serves:** Filters and sort - applied filters are cleared

- **GIVEN** a wide viewport, at least one supplied applied filter, and a supplied clear handler
- **WHEN** a shopper activates the clear affordance
- **THEN** the clear handler is reported once
- **AND** the chips are still displayed until the consumer supplies a new list

#### Scenario: shared-ui-store-product-listing-SC-45 - Sort and applied filters combine
**Serves:** Filters and sort - sort and applied filters combine

- **GIVEN** a wide viewport
- **WHEN** a sort option is selected and at least one applied filter is supplied
- **THEN** both remain displayed together

## ADDED Requirements

### Requirement: Narrow viewports use sort and facet pills with bottom drawers

Below the wide breakpoint, `ProductBrowse` SHALL NOT stack a full-width
inline filter column, SHALL NOT show a listing search field, and SHALL NOT
open a left Filter drawer. It SHALL show the result count and a horizontal
row of pills.

When sort options are supplied, a sort pill SHALL show the active option’s
short label when the consumer supplies one, otherwise the active option’s
label. Activating the sort pill SHALL open a bottom drawer listing the sort
options. Choosing an option other than the active one SHALL report it through
the sort callback and SHALL close the drawer. Choosing the active option SHALL
close the drawer and SHALL NOT report. Closing without a new choice SHALL
leave the active sort unchanged.

For each supplied filter group that has options, a facet pill SHALL show:

- the group label when that group’s supplied selection is empty
- that option’s label when exactly one option is selected
- the group’s compact label and the selected count when two or more options
  are selected (e.g. World (2))

Activating a facet pill SHALL open a bottom drawer for that group only. Opening
SHALL seed a draft from the supplied selection for that group and SHALL request
group expand when the group carries an expand label. Toggling options SHALL
change only the draft until Show Results. Show Results SHALL apply the draft
for that group through the filter-change callback (selecting and unselecting
as needed to match the draft), then close the drawer. Clear SHALL empty the
draft for that group and SHALL NOT apply until Show Results. Escape or an
outside press SHALL close without applying the draft.

On a narrow viewport the applied-filter chip row SHALL NOT be displayed.

#### Scenario: shared-ui-store-product-listing-SC-80 - Narrow chrome shows count and pills
**Serves:** Adaptive filter chrome - narrow chrome shows count and pills

- **GIVEN** the surface at a narrow viewport with sort options and two filter groups with options
- **THEN** the result count is displayed
- **AND** a sort pill and a pill for each filter group are displayed
- **AND** no listing search field is displayed
- **AND** no left Filter control is displayed

#### Scenario: shared-ui-store-product-listing-SC-81 - Sort applies on choose
**Serves:** Adaptive filter chrome - sort applies on choose

- **GIVEN** an open sort bottom drawer and an inactive sort option
- **WHEN** a shopper activates that option
- **THEN** that option is reported once through the sort callback
- **AND** the drawer closes

#### Scenario: shared-ui-store-product-listing-SC-82 - Facet pill labels follow selection
**Serves:** Adaptive filter chrome - facet pill labels follow selection

- **GIVEN** a narrow viewport and a Types group with no selection
- **THEN** the Types pill shows the group label
- **WHEN** the consumer supplies a selection of exactly `Booster Box`
- **THEN** the Types pill shows `Booster Box`
- **WHEN** the consumer supplies a selection of two options in Worlds
- **THEN** the Worlds pill shows the compact label with count `2`

#### Scenario: shared-ui-store-product-listing-SC-83 - Facet draft applies on Show Results
**Serves:** Adaptive filter chrome - facet draft applies on Show Results

- **GIVEN** an open Worlds bottom drawer seeded from an empty selection
- **WHEN** a shopper selects two options in the draft, then activates Show Results
- **THEN** both options are reported as selected through the filter-change callback
- **AND** the drawer closes
- **AND** options not in the draft that were previously selected are reported as unselected

#### Scenario: shared-ui-store-product-listing-SC-84 - Facet Clear empties the draft only
**Serves:** Adaptive filter chrome - facet Clear empties the draft only

- **GIVEN** an open Types bottom drawer whose draft contains one option
- **WHEN** a shopper activates Clear
- **THEN** the draft shows no option selected
- **AND** no filter-change is reported until Show Results

#### Scenario: shared-ui-store-product-listing-SC-85 - Wide viewport stacks facet groups
**Serves:** Adaptive filter chrome - wide viewport stacks facet groups

- **GIVEN** the surface at a wide viewport with two filter groups with options
- **THEN** both groups' labels and options are offered in a stack in the sidebar
- **AND** the listing search field is displayed in the sidebar
- **AND** no narrow pill row is offered
