## Feature set

- Not-found answer
  - Hidden lots: the address of a Draft or Called off lot gives a 404,
    the same as an address with no published lot

## MODIFIED Requirements

### Requirement: An address that names no lot is refused

The catalogue SHALL be what decides whether an id names a published lot,
asked when the address is asked for. An address under the auction's lots
naming no published lot SHALL answer with status 404 and the site's not-found
screen, never an empty lot page and never the catalogue.

The address of a hidden lot, as `grade10-site/auction/lot-status` defines it,
SHALL give the same response, even if the lot was once published. A hidden lot
is a Draft or Called off lot.

#### Scenario: grade10-site-auction-listing-page-SC-04 - An id the catalogue publishes no lot for
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **WHEN** an address under the auction's lots naming no published lot is
  fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's Page not found screen

#### Scenario: grade10-site-auction-listing-page-SC-05 - A lot the catalogue publishes answers
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **GIVEN** a lot the catalogue publishes
- **WHEN** its address is fetched
- **THEN** the response has status 200 and carries that lot's page

#### Scenario: grade10-site-auction-listing-page-SC-19 - A hidden lot's address shows Page not found
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **GIVEN** a published lot that was called off
- **WHEN** its address is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's Page not found screen
