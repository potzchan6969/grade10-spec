## Feature set

- Facet narrowing
  - Catalogue's facets: the panel offers the groups the catalogue names, with the count it puts behind every choice
  - Nothing behind a facet: a group no product reaches is not drawn, so no control can only empty the grid
  - Narrowing in the address: the facets in force are linkable, and going back widens the listing again
- Catalogue-wide order and search
  - Whole-set ordering: an order describes the whole narrowed catalogue rather than the cards already loaded
  - Whole-set search: free text narrows the whole catalogue rather than the cards already loaded
  - Answerable orders only: the menu offers the orders the catalogue can answer, and none it cannot
- Collection as a way in
  - Arrival scope: an address naming a collection opens the listing inside it, with no control offering one
  - Visible and leaveable: the collection in force is named on the listing and can be dismissed
  - One narrowing at a time: applying a facet, free text or an order leaves the collection behind

## MODIFIED Requirements

### Requirement: An address can scope the listing to one collection

The listing SHALL read the collection to scope itself to from the address it
was opened at, and SHALL render narrowed to that collection without the
collector touching a control. An address naming no collection SHALL render the
whole catalogue.

Which collection an address names SHALL NOT change which document the address
serves: the cards themselves already arrive by script, and a collection is a
narrowing of the listing rather than a surface of its own.

An address naming a collection the catalogue has nothing for SHALL render the
whole catalogue rather than an empty listing or a refusal, since a collection
is a way of narrowing what is listed and not a surface of its own.

A collection SHALL NOT be offered as a filter control: it is a way into the
catalogue rather than one of the ways to narrow it. The collection in force
SHALL be named on the listing among the narrowings in force, and dismissing it
SHALL widen the listing to the whole catalogue.

The catalogue narrows by one collection or by a query, never by both. Applying
a facet, free text or an order while a collection is in force SHALL therefore
leave that collection behind, and an address carrying a collection alongside
any of the three SHALL render the query and drop the collection.

Leaving a collection SHALL be reflected in the address, so the collector can
link to what they are looking at, and going back SHALL return the listing to
the previous narrowing.

#### Scenario: grade10-site-store-product-listing-SC-03 - An address opens the listing narrowed

- **WHEN** a collector opens the listing at an address naming a collection the
  catalogue carries
- **THEN** the listing renders showing that collection's cards, with that
  collection shown as the narrowing in force

#### Scenario: grade10-site-store-product-listing-SC-04 - No collection named

- **WHEN** a collector opens the listing at an address naming no collection
- **THEN** the whole catalogue is listed

#### Scenario: grade10-site-store-product-listing-SC-05 - A collection the catalogue has nothing for

- **WHEN** a collector opens the listing at an address naming a collection the
  catalogue has nothing for
- **THEN** the whole catalogue is listed and the surface answers as itself,
  not as not-found

#### Scenario: grade10-site-store-product-listing-SC-06 - Narrowing in the page is linkable

- **GIVEN** a collector on the listing scoped to a collection
- **WHEN** they select a facet choice, enter free text, or choose an order
- **THEN** the listing narrows the whole catalogue by what they asked for, and
  the collection is no longer in force
- **AND** the address names that narrowing and no longer names the collection,
  and opening it afresh renders the same narrowing

#### Scenario: grade10-site-store-product-listing-SC-07 - Back undoes a narrowing

- **GIVEN** a collector who narrowed the listing from within the collection
  their address opened it in
- **WHEN** they go back
- **THEN** the listing is scoped to that collection again

#### Scenario: grade10-site-store-product-listing-SC-08 - The collection in force can be dismissed

- **GIVEN** a collector on the listing scoped to a collection
- **WHEN** they dismiss the collection named among the narrowings in force
- **THEN** the whole catalogue is listed, and the address no longer names that
  collection

#### Scenario: grade10-site-store-product-listing-SC-09 - An address carrying both

- **WHEN** a collector opens the listing at an address naming both a collection
  and a facet choice, free text, or an order
- **THEN** the listing renders narrowed by the facet choice, free text or order
- **AND** the collection is not in force

## ADDED Requirements

### Requirement: The listing narrows by the catalogue's facets

The listing SHALL offer the collector the facet groups the catalogue names, in
the order the catalogue names them, each group listing the choices the
catalogue carries for it with the count the catalogue puts behind each choice.
A count SHALL be the catalogue's own over the whole set the rest of the query
narrows to, never counted from the cards on the page.

Selecting no choice in a group SHALL leave that group unrestricted. A group
SHALL admit more than one choice at once.

A group the catalogue names no choices for SHALL NOT be drawn. On a listing
nothing narrows, neither SHALL a group the catalogue counts nothing behind any
choice of: a control whose only effect is to empty the grid is worse than no
control. A listing left with no group to draw SHALL draw no facet group and
SHALL say nothing in place of one — a shop that has configured no facets is not
a fault the collector is told about. Searching and ordering are not facets and
SHALL stay offered either way.

Once a narrowing is in force, every group the catalogue names choices for SHALL
be offered however little is counted behind them: nothing behind a choice is
then the query's doing rather than the shop's, and the collector needs the
groups to widen by. A choice the collector has selected SHALL remain selected
and selectable however little is counted behind it, since a selection nobody
can undo is a trap.

What each group is called SHALL be the site's own words in the language the
listing is read in; what each choice is called SHALL be the catalogue's, and
SHALL render as the shop authored it.

The worlds a shop carries grow without bound, so the panel SHALL offer the
first five and an invitation to show the rest, named for the group; taking it
SHALL offer every world the catalogue names. The collectible types are a
taxonomy the platform closes rather than one a shop grows, and SHALL be offered
whole however many the catalogue names.

The facets in force SHALL be reflected in the address, so the collector can
link to what they are looking at, and going back SHALL return the listing to
the previous narrowing.

#### Scenario: grade10-site-store-product-listing-SC-10 - The panel is the catalogue's facets

- **WHEN** a collector opens the listing and the catalogue names facet groups
  with choices behind them
- **THEN** the panel offers one group per facet the catalogue names, in the
  catalogue's order
- **AND** each choice is shown with the count the catalogue puts behind it

#### Scenario: grade10-site-store-product-listing-SC-11 - A facet narrowing is linkable

- **GIVEN** a collector on the unscoped listing
- **WHEN** they select a facet choice
- **THEN** the listing lists the catalogue narrowed to that choice, and the
  address names it
- **AND** opening that address afresh renders the same narrowing
- **WHEN** they go back
- **THEN** the listing is unnarrowed again

#### Scenario: grade10-site-store-product-listing-SC-12 - A shop with no facets configured

- **WHEN** a collector opens the listing and the catalogue names no facet
  group, or counts nothing behind every choice of every group it names
- **THEN** the catalogue is listed, and no facet group is drawn
- **AND** nothing is said in place of the groups
- **AND** the search field and the sort menu are still offered

#### Scenario: grade10-site-store-product-listing-SC-16 - A long facet group is capped

- **GIVEN** a catalogue naming more than five worlds, and more than five
  collectible types
- **WHEN** a collector opens the listing
- **THEN** five worlds are offered, with an invitation to show the rest named
  for the group
- **AND** every collectible type the catalogue names is offered
- **WHEN** the collector takes that invitation
- **THEN** every world the catalogue names is offered

#### Scenario: grade10-site-store-product-listing-SC-17 - A narrowing that starves the catalogue

- **GIVEN** a collector on the listing who has selected a choice the catalogue
  now counts nothing behind, leaving every choice of the other group counted
  at nothing too
- **WHEN** the listing renders
- **THEN** both groups are still offered, with their counts as the catalogue
  answers them
- **AND** the selected choice is still shown selected, and can be unselected
- **WHEN** the collector unselects it
- **THEN** the listing widens again

### Requirement: Order and free text describe the whole catalogue

The listing SHALL narrow by free text and order its cards over the whole set
the query describes, never over the cards already loaded. A collector who asks
for the lowest price SHALL be shown the lowest-priced card in the narrowed
catalogue first, whether or not it had been loaded when they asked.

The listing SHALL offer only orders the catalogue can answer. At rest no order
is in force and the catalogue's own order is listed; the collector chooses one,
and no order is chosen for them.

The free text and the order in force SHALL be reflected in the address, so the
collector can link to what they are looking at, and going back SHALL return the
listing to the previous narrowing.

#### Scenario: grade10-site-store-product-listing-SC-13 - An order covers the whole catalogue

- **GIVEN** a catalogue holding more cards than one page lists, whose
  lowest-priced card is not among those first listed
- **WHEN** a collector orders the listing by lowest price
- **THEN** that lowest-priced card is listed first

#### Scenario: grade10-site-store-product-listing-SC-14 - Free text covers the whole catalogue

- **GIVEN** a catalogue holding more cards than one page lists, whose only
  match for a collector's words is not among those first listed
- **WHEN** the collector enters those words
- **THEN** that card is listed
- **AND** the address carries the words, so opening it afresh lists the same

#### Scenario: grade10-site-store-product-listing-SC-15 - The menu offers only answerable orders

- **WHEN** a collector opens the sort menu
- **THEN** every order it offers is one the catalogue can answer
- **AND** no order is in force until the collector chooses one
