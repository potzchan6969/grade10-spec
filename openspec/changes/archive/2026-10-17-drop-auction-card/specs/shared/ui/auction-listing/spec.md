# shared/ui/auction-listing Specification

## Purpose

Shared auction listing blocks disclose the buyer's premium on the bid panel
before a collector commits a maximum. They are the shared listing product-page
blocks every auction storefront composes: the media gallery, the bid panel,
the bid history, and the details section. The bid history carries accepted
instants so collector activity can be localized without changing the listing's
authoritative event data.

## Feature set

- Surface exports
  - Named components: gallery, bid panel, and details from the package entry
  - Reusable parts: the gallery renders without the bid panel
- Gallery sources
  - Distinct addresses: thumbnail, main frame, and zoom each have their own source
  - Fallback to src: an omitted thumb or zoom uses the main source
- Gallery strip
  - Several items: more than one image shows a strip; one item does not
  - Lot gallery by width: ListingLotGallery shows a left rail when wide enough beside the stage; stacked keeps previous/next and progress only
- Consumer labels
  - Supplied copy: accessible names come from the application
- Bid history
  - Accepted instants: bid rows retain the accepted time needed for formatting
  - Localized activity: recent and historical rows, collector deadlines, closed-lot close times and tile close lines use the collector's locale and the viewer's time zone
  - Display text: a row's supplied display text replaces its formatted time
- Personal bid history
  - Named export: ListingUserBidHistory and its copy, props, and row types
  - Empty rows: the block renders nothing
  - Dialog: two peer tabs for bid-sequence and maximum rows, amount and time only, no bid-type column
  - Consumer composition: the bid card keeps the personal-bidding accessory beside recent bids
  - Supplied copy: the personal-bidding link, title, tabs, columns, and empty state come from the consumer
- Personal bidding dialog
  - Maximums tab: accepted configure and raise rows with amount and time
  - Bids tab: auto-bid sequence rows with amount and time
  - Consumer composition: the bid card keeps the personal-bidding accessory beside recent bids
  - Supplied copy: every user-visible string arrives through props
- Bid enrollment
  - Named exports: the enrollment setup blocks and the signal the bid card reads
  - Setup gates: continuing waits on a card and an attestation
  - Enrollment signal: the bid card shows standing, or disables what a collector cannot yet do
- Bid card accessory
  - Optional recentBidsAccessory: trailing edge of the recent-bids header
- Buyer-fee disclosure
  - Inline rate: the bid panel names the 20% buyer fee under the bid action
  - No tooltip: the fee copy does not carry a buyer-fee tooltip slot
- Quick bids
  - Increment steps: three chips at 1×, 2×, and 4× the listing increment
  - Leader base: chips add those steps to the committed maximum
  - Field base: chips add those steps to the current public bid
  - Opening base: before any bid, chip 1x is the opening price, the next eligible bid
- Raise floor
  - Leader minimum: a typed raise starts at the maximum plus 100 minor units
  - Separate from chips: the first chip is not that typed minimum
- Lost standing
  - Badge only: Did not win remains, with no banner
- Custom maximum ceiling
  - Major-unit cap: USD 10,000,000, HKD 80,000,000 and JPY 5,000,000,000 whole major units
  - Restore on overshoot: an appended typed digit that would exceed the cap leaves the prior draft
  - No ceiling error copy: no maximum-bid or invalid-amount message solely for the ceiling correction
  - Replacement and paste: an oversized cleaned amount becomes the currency cap
  - Whole-major cleaning: discard a pasted fractional suffix without rounding before checking the cap
  - Set and raise: the same field rule; exactly the cap is accepted
- Public bid history outcome
  - Winner crown: closed sold winning row shows a primary crown after the amount
  - Equal-max tip: a row tied on amount with a row above it shows an Info tip in the amount tone
  - Live lots: no winner crown

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

The catalogue lot tile `AuctionLotCard` SHALL require `locale` and `timeZone`.
A tile whose lot has not closed SHALL keep the countdown it draws and SHALL
read its open or close as a collector deadline in that zone to a screen
reader; a closed tile SHALL draw that collector deadline, with a closed
prefix, as its close line. Either line names the viewer's zone.

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

- **GIVEN** the same close instant rendered on a closed `AuctionLotCard` for `Asia/Hong_Kong` and `America/New_York`
- **WHEN** each tile's close line is read
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
