## Feature set

- Following the shop
  - Within seconds: a change the shop reports reaches the listing everywhere within seconds
  - The re-read as the net: a change the shop never reported reaches the listing within 5 minutes
  - While the shop is unreachable: the listing keeps answering from the store's own copy

## ADDED Requirements

### Requirement: The listing follows the shop within seconds

The listing, its count, its sidebar counts and its cards SHALL answer from one
copy of the catalogue the store keeps per shop and reads at every location. A
change the shop reports — a product published, taken down or changed, or its
stock moved — SHALL be applied to that copy from a fresh read of the product
and published within 10 seconds of the report, and a listing view at any
location SHALL answer from a copy no more than 5 seconds behind the newest
published one. A change the shop never reports SHALL reach the copy within
5 minutes, from a whole read of the catalogue.

A copy SHALL hold what the shop answered, never what a report alone said.
Where the read of a product answers older than the report that caused it, the
store SHALL read again rather than publish the older answer.

#### Scenario: grade10-site-store-product-listing-SC-42 - A published product is listed within seconds

- **GIVEN** a listing whose count is N
- **WHEN** the shop publishes a product to the store's channel and reports it
- **THEN** within 10 seconds the listing at any location lists that product
- **AND** its count reads N + 1, and the product's facets count it

#### Scenario: grade10-site-store-product-listing-SC-43 - A product taken down leaves within seconds

- **GIVEN** a listing holding a product
- **WHEN** the shop takes that product off the store's channel and reports it
- **THEN** within 10 seconds no location lists it, and no count counts it

#### Scenario: grade10-site-store-product-listing-SC-44 - A card follows the shop's price and stock

- **GIVEN** a card showing a price and stopping at the shop's count
- **WHEN** the shop changes that product's price or its count and reports it
- **THEN** within 10 seconds the card at any location shows the new price and
  stops at the new count
- **AND** a price order places the card by the new price

#### Scenario: grade10-site-store-product-listing-SC-45 - A change the shop never reported is caught by the re-read

- **GIVEN** a change the shop made without a report reaching the store — a
  facet renamed, or a report lost
- **WHEN** 5 minutes pass
- **THEN** the listing at any location shows the change

#### Scenario: grade10-site-store-product-listing-SC-46 - A read older than the report is not published

- **GIVEN** the shop reports a change before its own reads answer it
- **WHEN** the store reads the product back and the answer is older than the report
- **THEN** the older answer is not published, the read is tried again, and the
  change is listed once the shop answers it

### Requirement: The listing answers while the shop is unreachable

While the shop cannot be read, the listing SHALL keep answering from the copy
it holds — cards, counts and sidebar alike — and SHALL say nothing to the
collector about the shop. The copy SHALL stop moving until the shop answers
again, and every failed read SHALL be recorded.

#### Scenario: grade10-site-store-product-listing-SC-47 - The listing lists while the shop is down

- **GIVEN** a listing that answered while the shop could be read
- **WHEN** the shop stops answering and a collector opens the listing at any location
- **THEN** the listing lists the cards, the count and the sidebar it last held
- **AND** opening a product or reviewing the cart is what waits on the shop
