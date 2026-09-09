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

#### Scenario: grade10-site-store-product-listing-SC-22 - At rest the order is latest

- **WHEN** a collector opens the listing with no order in the address
- **THEN** the listing is ordered by latest product
- **AND** the sort trigger reads `Sort by` followed by the latest option's label
- **AND** that option is marked selected in the menu
