## MODIFIED Requirements

### Requirement: Order and free text describe the whole catalogue

The listing SHALL narrow by free text and order its cards over the whole set
the query describes, never over the cards already loaded. A collector who asks
for the lowest price SHALL be shown the lowest-priced card in the narrowed
catalogue first, whether or not it had been loaded when they asked.

The listing SHALL offer only orders the catalogue can answer: latest product,
lowest price, and highest price. It SHALL NOT offer a popularity order.

At rest the listing SHALL open with latest product in force. The sort trigger
SHALL read as `Sort by` followed by the active option's label. Choosing another
option SHALL put that order in force and update the trigger the same way. No
other resting order SHALL stand in for latest.

An order SHALL apply to the set in force rather than to the catalogue alone: a
collection SHALL open on latest product too, and SHALL be listed in whatever
order the collector chooses while it is in force.

The resting order SHALL NOT be named in the address. An address naming no order
asks for it, so a link carries latest product without spelling it out, and a
link naming another order carries that one.

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
- **AND** latest product, lowest price, and highest price are offered
- **AND** popularity is not offered

#### Scenario: grade10-site-store-product-listing-SC-29 - At rest the order is latest

- **WHEN** a collector opens the listing with no order in the address
- **THEN** the listing is ordered by latest product
- **AND** the sort trigger reads `Sort by` followed by the latest option's label
- **AND** that option is marked selected in the menu

#### Scenario: grade10-site-store-product-listing-SC-41 - The resting order is not named in the address

- **GIVEN** a collector on the listing with the resting order in force
- **WHEN** they narrow the listing by a facet choice
- **THEN** the address names that choice and names no order
- **AND** opening that address afresh lists the narrowing by latest product

#### Scenario: grade10-site-store-product-listing-SC-39 - A collection opens on the resting order

- **WHEN** a collector opens the listing at an address naming a collection and
  no order
- **THEN** that collection's cards are listed by latest product
- **AND** the sort trigger reads `Sort by` followed by the latest option's
  label, and that option is marked selected in the menu

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
a facet or free text while a collection is in force SHALL therefore leave that
collection behind, and an address carrying a collection alongside either SHALL
render the query and drop the collection.

An order is not one of the ways the catalogue narrows: it orders whatever set
is in force. Choosing an order while a collection is in force SHALL leave that
collection in force and list its cards in that order, and an address naming a
collection and an order SHALL render that collection in that order.

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
- **WHEN** they select a facet choice or enter free text
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
  and a facet choice or free text
- **THEN** the listing renders narrowed by the facet choice or free text
- **AND** the collection is not in force

#### Scenario: grade10-site-store-product-listing-SC-40 - An order holds the collection it was chosen in

- **GIVEN** a collector on the listing scoped to a collection
- **WHEN** they choose another order
- **THEN** that collection's cards are listed in that order, and the collection
  is still in force and still named among the narrowings
- **AND** the address names the collection and the order, and opening it afresh
  renders the same
