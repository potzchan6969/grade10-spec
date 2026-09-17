## Feature set

- Listings table
  - Watchers column: each row shows how many collectors watch the lot, so an operator compares interest at a glance

## ADDED Requirements

### Requirement: The Listings table shows each listing's watchers

Every row shows how many collectors watch the listing, to every operator who
reads the table.

**Watchers column** - The Listings table SHALL show a **Watchers** column on
every row, whatever the listing's state: draft, created, published, closed, or
called off.

**The count** - Each row SHALL show the watch count
`grade10-site/auction/watchlist` defines for that listing: every watch across
both brands, as of when the table loaded.

**Nobody watching** - A listing nobody watches SHALL show 0.

**Not sortable** - The column SHALL NOT be sortable.

**What it does not say** - The column SHALL name no watcher and SHALL NOT
present the count as expected bidders.

**Who sees it** - Every operator who may read the Listings table SHALL see it;
it needs no further grant.

#### Scenario: grade10-admin-auction-listing-SC-81 - The table shows a listing's watchers
**Serves:** grade10-admin-auction-listing-US-08 - Operator compares interest across listings

- **GIVEN** a listing watched by two collectors on one brand and one collector on the other
- **WHEN** an authorized operator opens the Listings table
- **THEN** that listing's row shows 3 under Watchers

#### Scenario: grade10-admin-auction-listing-SC-82 - An unwatched listing shows zero
**Serves:** grade10-admin-auction-listing-US-08 - Operator compares interest across listings

- **GIVEN** a draft listing nobody watches
- **WHEN** an authorized operator opens the Listings table
- **THEN** that listing's row shows 0 under Watchers

#### Scenario: grade10-admin-auction-listing-SC-83 - A closed listing keeps its watchers
**Serves:** grade10-admin-auction-listing-US-08 - Operator compares interest across listings

- **GIVEN** a closed listing still watched by two collectors
- **WHEN** an authorized operator opens the Listings table
- **THEN** that listing's row shows 2 under Watchers
