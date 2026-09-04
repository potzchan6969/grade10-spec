## ADDED Requirements

### Requirement: Bid history rows carry accepted instants

`ListingBidHistoryRow` SHALL carry `acceptedAtMs: number` and MAY carry
`timeOverride?: string` for states that are not a timestamp.

`ListingUserBidHistoryRow` SHALL carry `acceptedAtMs: number` and MAY carry
`timeOverride?: string`.

#### Scenario: auction-listing-SC-22 - A bid row preserves its accepted instant

- **GIVEN** a bid history row with an accepted instant and a row representing a non-timestamp state
- **WHEN** the rows are passed to the bid history surface
- **THEN** the accepted row provides its `acceptedAtMs` for activity-time formatting
- **AND** the non-timestamp row may provide `timeOverride` for its displayed state

### Requirement: Bid history components format activity time

`ListingBidHistoryList` and `ListingUserBidHistory` SHALL require `locale`,
`timeZone`, and `activityTimeCopy` and SHALL format each row with the platform
activity-time rules unless `timeOverride` is set.

`ListingAuctionBidCard` and `ListingAuctionCardSidebar` SHALL require `locale`
and `timeZone` and SHALL thread them to bid history and the collector deadline
line.

#### Scenario: shared-ui-auction-listing-SC-13 - Recent bids show localized activity time

- **GIVEN** a bid card with history rows carrying `acceptedAtMs`
- **WHEN** it renders with a shipped locale and time zone
- **THEN** each row shows a formatted activity time
- **AND** no row shows a raw millisecond value
