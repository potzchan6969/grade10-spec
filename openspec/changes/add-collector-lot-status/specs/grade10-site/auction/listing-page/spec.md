## Feature set

- Not-found answer
  - Hidden lots: an address naming a lot that never opened, ended unsold, or
    was called off answers not found, like one naming no published lot

## MODIFIED Requirements

### Requirement: An address that names no lot is refused

The catalogue SHALL be what decides whether an id names a published lot,
asked when the address is asked for. An address under the auction's lots
naming no published lot SHALL answer with status 404 and the site's not-found
surface, never an empty lot page and never the catalogue.

An address naming a lot that `grade10-site/auction/lot-status` hides — one that
never opened, closed with no winner, or was called off — SHALL answer the same
way, even when that lot was once published.

#### Scenario: grade10-site-auction-listing-page-SC-04 - An id the catalogue publishes no lot for

- **WHEN** an address under the auction's lots naming no published lot is
  fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's not-found surface

#### Scenario: grade10-site-auction-listing-page-SC-05 - A lot the catalogue publishes answers

- **GIVEN** a lot the catalogue publishes
- **WHEN** its address is fetched
- **THEN** the response has status 200 and carries that lot's page

#### Scenario: grade10-site-auction-listing-page-SC-19 - A hidden lot's address answers not found

- **GIVEN** a once-published lot that closed with no winner, and one that was
  called off
- **WHEN** either lot's address is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's not-found surface
