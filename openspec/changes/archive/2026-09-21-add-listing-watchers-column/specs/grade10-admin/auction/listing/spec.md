## Feature set

- Listings Stats
  - Watchers in Stats: opening Stats shows how many collectors watch the lot, so an operator judges interest beside the bidder count
  - No table column: the Listings table does not show the watch count

## ADDED Requirements

### Requirement: The Listings Stats dialog shows the listing's watchers

Opening Stats on a listing that offers it shows how many collectors watch the
listing, to every operator who may open Stats.

**Watchers in Stats** - The Listings Stats dialog SHALL show the watch count
`grade10-site/auction/watchlist` defines for that listing: every watch across
both brands, as of when Stats loaded.

**Nobody watching** - A listing nobody watches SHALL show 0.

**What it does not say** - The dialog SHALL name no watcher and SHALL NOT
present the count as expected bidders.

**Who sees it** - Every operator who may open Stats SHALL see the count; it
needs no further grant.

#### Scenario: grade10-admin-auction-listing-SC-81 - Stats shows a listing's watchers
**Serves:** grade10-admin-auction-listing-US-08 - Operator checks a listing's watchers

- **GIVEN** a listing that offers Stats, watched by two collectors on one brand and one collector on the other
- **WHEN** an authorized operator opens Stats for that listing
- **THEN** Stats shows 3 watchers

#### Scenario: grade10-admin-auction-listing-SC-82 - An unwatched listing shows zero in Stats
**Serves:** grade10-admin-auction-listing-US-08 - Operator checks a listing's watchers

- **GIVEN** a listing that offers Stats and nobody watches
- **WHEN** an authorized operator opens Stats for that listing
- **THEN** Stats shows 0 watchers

#### Scenario: grade10-admin-auction-listing-SC-83 - A closed listing keeps its watchers in Stats
**Serves:** grade10-admin-auction-listing-US-08 - Operator checks a listing's watchers

- **GIVEN** a closed listing that offers Stats and is still watched by two collectors
- **WHEN** an authorized operator opens Stats for that listing
- **THEN** Stats shows 2 watchers

### Requirement: The Listings table does not show a Watchers column

The Listings table SHALL NOT show a Watchers column. The watch count SHALL
reach the operator only through Stats.

#### Scenario: grade10-admin-auction-listing-SC-86 - The Listings table has no Watchers column
**Serves:** grade10-admin-auction-listing-US-08 - Operator checks a listing's watchers

- **GIVEN** an authorized operator on the Listings table
- **WHEN** the table renders
- **THEN** there is no Watchers column
