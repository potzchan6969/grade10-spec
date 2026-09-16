## Purpose

Shared listing bid-panel blocks stay aligned with authorize-only launch: lost
standing does not show card-release banner copy.

## Feature set

- Lost standing
  - Badge only: Did not win remains; no authorization-release banner

## ADDED Requirements

### Requirement: Lost standing does not show card-release banner copy

`ListingAuctionBidCard` SHALL NOT require a `cardRelease` copy field. When
viewer standing is lost, the card SHALL show the Did not win status treatment
and SHALL NOT render authorization-release banner copy under that standing.

#### Scenario: shared-ui-auction-listing-SC-46 - Lost standing omits release banner

- **GIVEN** a closed listing where the viewer lost
- **WHEN** the bid card renders
- **THEN** Did not win status is shown
- **AND** no card-authorization-release banner copy is shown
