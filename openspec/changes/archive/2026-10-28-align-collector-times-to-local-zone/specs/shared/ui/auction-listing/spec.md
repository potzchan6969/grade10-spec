# shared/ui/auction-listing Specification

## Feature set

- Bid history
  - Localized activity: recent and historical rows, collector deadlines, closed-lot close times and tile close lines use the collector's locale and the viewer's time zone
  - Display text: a row's supplied display text replaces its formatted time

## MODIFIED Requirements

### Requirement: Bid history components format activity time

`ListingBidHistoryList` and `ListingUserBidHistory` SHALL require `locale`,
`timeZone`, and `activityTimeCopy` and SHALL format each row with the platform
activity-time rules unless `timeOverride` is set.

`ListingAuctionBidCard` and `ListingAuctionCardSidebar` SHALL require `locale`
and `timeZone` and SHALL thread them to bid history and the collector deadline
line. A closed lot's close is a collector deadline: when it shows a clock it
SHALL be stated in that zone and SHALL name the viewer's zone, as an open lot's
deadline does, and when it shows only a day it SHALL name none.

`AuctionCard` SHALL require `locale` and `timeZone` and SHALL format its
static Ends / Opens / Closed line as a collector deadline in that zone, naming
the viewer's zone.

The viewer's zone is named as `shared/dates-and-times` names it: its short name
in US English (`HKT`, `EDT`), or its offset in English where US English has none
(`GMT+9`), whatever the locale.

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

<!-- trace:scenario id=g10.shared-auction-listing.SC-acp rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-57 - A supplied display text replaces a row's formatted time
**Serves:** Bid history - a supplied display text replaces the formatted time

- **GIVEN** a bid history row that carries `timeOverride` and an accepted instant
- **WHEN** the row renders
- **THEN** its time reads the `timeOverride` text as supplied
- **AND** it shows no formatted activity time
