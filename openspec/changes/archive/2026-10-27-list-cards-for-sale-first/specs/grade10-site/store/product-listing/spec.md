## MODIFIED Requirements

### Requirement: Order and free text describe the whole catalogue

The listing SHALL narrow by free text and order its cards over the whole set
the query describes, never over the cards already loaded. A collector who asks
for the lowest price SHALL be shown the lowest-priced card for sale in the
narrowed catalogue first, whether or not it had been loaded when they asked.

In every order — latest product, lowest price and highest price, at rest and
inside a collection — every card for sale SHALL be listed before every
sold-out card, and the order asked for SHALL hold within each of the two
groups. A price order SHALL sort a card on the lowest price among its
variants; inside a collection, the shop's own price order holds within each
group.

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

<!-- trace:scenario id=g10.store-product-listing.SC-l5j rev=2 -->
#### Scenario: grade10-site-store-product-listing-SC-13 - An order covers the whole catalogue
**Serves:** grade10-site-store-product-listing-US-05 - Collector orders and searches the whole shop

- **GIVEN** a catalogue holding more cards than one page lists, whose
  lowest-priced card for sale is not among those first listed
- **WHEN** a collector orders the listing by lowest price
- **THEN** that lowest-priced card for sale is listed first

<!-- trace:scenario id=g10.store-product-listing.SC-7b0 rev=1 -->
#### Scenario: grade10-site-store-product-listing-SC-14 - Free text covers the whole catalogue
**Serves:** grade10-site-store-product-listing-US-05 - Collector orders and searches the whole shop

- **GIVEN** a catalogue holding more cards than one page lists, whose only
  match for a collector's words is not among those first listed
- **WHEN** the collector enters those words
- **THEN** that card is listed
- **AND** the address carries the words, so opening it afresh lists the same

<!-- trace:scenario id=g10.store-product-listing.SC-0v2 rev=1 -->
#### Scenario: grade10-site-store-product-listing-SC-15 - The menu offers only answerable orders
**Serves:** `grade10-site-store-product-listing-US-05`, `grade10-site-store-product-listing-US-09` - the menu offers only answerable orders

- **WHEN** a collector opens the sort menu
- **THEN** every order it offers is one the catalogue can answer
- **AND** latest product, lowest price, and highest price are offered
- **AND** popularity is not offered

<!-- trace:scenario id=g10.store-product-listing.SC-xvx rev=1 -->
#### Scenario: grade10-site-store-product-listing-SC-29 - At rest the order is latest
**Serves:** grade10-site-store-product-listing-US-09 - at rest the order is latest

- **WHEN** a collector opens the listing with no order in the address
- **THEN** the listing is ordered by latest product
- **AND** the sort trigger reads `Sort by` followed by the latest option's label
- **AND** that option is marked selected in the menu

<!-- trace:scenario id=g10.store-product-listing.SC-5kb rev=1 -->
#### Scenario: grade10-site-store-product-listing-SC-41 - The resting order is not named in the address
**Serves:** grade10-site-store-product-listing-US-09 - the resting order is not named in the address

- **GIVEN** a collector on the listing with the resting order in force
- **WHEN** they narrow the listing by a facet choice
- **THEN** the address names that choice and names no order
- **AND** opening that address afresh lists the narrowing by latest product

<!-- trace:scenario id=g10.store-product-listing.SC-x5i rev=1 -->
#### Scenario: grade10-site-store-product-listing-SC-39 - A collection opens on the resting order
**Serves:** grade10-site-store-product-listing-US-11 - a collection opens on the resting order

- **WHEN** a collector opens the listing at an address naming a collection and
  no order
- **THEN** that collection's cards are listed by latest product
- **AND** the sort trigger reads `Sort by` followed by the latest option's
  label, and that option is marked selected in the menu

<!-- trace:scenario id=g10.store-product-listing.SC-h0j rev=1 -->
#### Scenario: grade10-site-store-product-listing-SC-57 - Cards for sale list before sold-out ones in every order
**Serves:** grade10-site-store-product-listing-US-05 - Collector orders and searches the whole shop

- **GIVEN** a narrowed catalogue, or a collection, holding cards for sale and
  sold-out cards, with a sold-out card cheaper and newer than every card for
  sale
- **WHEN** a collector orders it by latest product, by lowest price or by
  highest price
- **THEN** every card for sale is listed before every sold-out card
- **AND** within each group the cards follow the order asked for

<!-- trace:scenario id=g10.store-product-listing.SC-59p rev=1 -->
#### Scenario: grade10-site-store-product-listing-SC-58 - A price order sorts on a card's cheapest variant
**Serves:** grade10-site-store-product-listing-US-05 - Collector orders and searches the whole shop

- **GIVEN** two cards for sale, one whose cheapest variant costs less than any
  variant of the other while the item its tile shows costs more
- **WHEN** a collector orders the listing by lowest price
- **THEN** the card with the cheaper variant is listed first
