## Feature set

- Following the shop
  - Within seconds: a change the shop reports reaches the listing everywhere within seconds of the shop's read answering it
  - The re-read as the net: a change the shop never reported reaches the listing within 5 minutes
  - A quiet location answers too: a location holding no copy answers from the store's, without reading the shop
  - While the shop is unreachable: the listing keeps answering from the store's own copy

## ADDED Requirements

### Requirement: The listing follows the shop within seconds

A listing not narrowed to a collection — its cards, its count and its sidebar
counts — SHALL answer from one copy of the catalogue the store keeps per shop
and reads at every location. On the shop's report of a change — a product
published, taken down or changed, or its stock moved — the store SHALL read
that product back from the shop, and read again every 2 seconds while the
shop answers older than the report, for up to 60 seconds. A product the shop
reported changed and then answers nothing for, twice, SHALL leave the copy;
one the shop reported created and answers nothing for SHALL be left to the
whole read. The change SHALL reach the listing at every location within 10
seconds of the shop's read answering it. A change the shop never reports, or
one its reads did not answer within 60 seconds, SHALL reach the listing within
5 minutes, from a whole read of the catalogue.

A copy SHALL hold what the shop answered, never what a report alone said, and
a read older than the report that caused it SHALL NOT be published.

#### Scenario: grade10-site-store-product-listing-SC-42 - A published product is listed within seconds

- **GIVEN** a listing whose count is N
- **WHEN** the shop publishes a product to the store's channel and reports it
- **THEN** within 10 seconds of the shop's read answering that product, the listing at any location lists it
- **AND** its count reads N + 1, and the product's facets count it

#### Scenario: grade10-site-store-product-listing-SC-43 - A product taken down leaves within seconds

- **GIVEN** a listing holding a product
- **WHEN** the shop takes that product off the store's channel and reports it
- **THEN** within 10 seconds of the shop's read no longer answering it, no location lists it, and no count counts it

#### Scenario: grade10-site-store-product-listing-SC-44 - A card follows the shop's price and stock

- **GIVEN** a card showing a price and stopping at the shop's count
- **WHEN** the shop changes that product's price or its count and reports it
- **THEN** within 10 seconds of the shop's read answering the new price and count, the card at any location shows the new price and stops at the new count
- **AND** a price order places the card by the new price

#### Scenario: grade10-site-store-product-listing-SC-45 - A change the shop never reported is caught by the re-read

- **GIVEN** a change the shop made without a report reaching the store — a facet renamed, or a report lost
- **WHEN** 5 minutes pass
- **THEN** the listing at any location shows the change

#### Scenario: grade10-site-store-product-listing-SC-46 - A read older than the report is not published

- **GIVEN** the shop reports a change before its own reads answer it
- **WHEN** the store reads the product back and the answer is older than the report, or is nothing
- **THEN** the older answer is not published, the store reads again every 2 seconds, and the change is listed once the shop answers it
- **AND** a product the shop reported created but still answers nothing for after 60 seconds is left to the whole read

#### Scenario: grade10-site-store-product-listing-SC-48 - A location holding no copy answers from the one the store keeps

- **GIVEN** a location that has not served the listing, and a copy the store already holds
- **WHEN** a collector opens the listing there
- **THEN** the listing answers the same cards, count and sidebar a location that has already served it answers
- **AND** nothing reads the catalogue from the shop to answer it

### Requirement: The listing answers while the shop is unreachable

While the shop cannot be read, the listing SHALL keep answering from the copy
it holds — cards, counts and sidebar alike — and SHALL say nothing to the
collector about the shop. The copy SHALL stop moving until the shop answers
again.

#### Scenario: grade10-site-store-product-listing-SC-47 - The listing lists while the shop is down

- **GIVEN** a listing that answered while the shop could be read
- **WHEN** the shop stops answering and a collector opens the listing at any location
- **THEN** the listing lists the cards, the count and the sidebar it last held
- **AND** the listing goes on answering the same cards, count and sidebar until the shop answers again
- **AND** opening a product or reviewing the cart is what waits on the shop
