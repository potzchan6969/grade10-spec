## Feature set

- Bid history
  - Localized activity: recent and historical rows use the collector's locale and stated time zone

## MODIFIED Requirements

### Requirement: Bid history components format activity time

`ListingBidHistoryList` and `ListingUserBidHistory` SHALL require `locale`,
`timeZone`, and `activityTimeCopy` and SHALL format each row with the platform
activity-time rules unless `timeOverride` is set.

`ListingAuctionBidCard` and `ListingAuctionCardSidebar` SHALL require `locale`
and `timeZone` and SHALL thread them to bid history and the collector deadline
line.

`AuctionCard` SHALL require `locale` and `timeZone` and SHALL format its
static Ends / Opens / Closed line as a collector deadline in that zone,
naming the viewer's short zone (`HKT`, `EDT`).

<!-- trace:scenario id=g10.shared-auction-listing.SC-9gi rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-13 - Recent bids show localized activity time
**Serves:** Bid history - recent bids show localized activity time

- **GIVEN** a bid card with history rows carrying `acceptedAtMs`
- **WHEN** it renders with a shipped locale and time zone
- **THEN** each row shows a formatted activity time
- **AND** no row shows a raw millisecond value

<!-- trace:scenario id=g10.shared-auction-listing.SC-tzc rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-55 - A catalogue tile close follows the viewer
**Serves:** Bid history - catalogue tile close follows the viewer

- **GIVEN** the same close instant rendered on `AuctionCard` for `Asia/Hong_Kong` and `America/New_York`
- **WHEN** each card renders its clock line
- **THEN** the clock values differ
- **AND** the Hong Kong line names `HKT`
- **AND** the New York line names `EDT` and does not contain `HKT`
