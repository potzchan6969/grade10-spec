## Feature set

- Personal bidding dialog
  - Maximums tab: accepted configure and raise rows with amount and time
  - Bids tab: auto-bid sequence rows with amount and time
- Consumer composition
  - Accessory slot: bid card still hosts the personal-bidding entry beside recent bids
  - Supplied copy: every user-visible string arrives through props

## ADDED Requirements

### Requirement: The listing surface exports personal bidding history

The shared UI package SHALL export, from its public entry,
`ListingUserBidHistory` and these types: `ListingUserBidHistoryProps`,
`ListingUserBidHistoryCopy`, `ListingUserBidHistoryRow`, and
`ListingUserMaximumHistoryRow`.

`ListingUserBidHistory` SHALL receive a required `copy` object,
`maximumRows`, and `bidRows`. It SHALL supply no default user-visible copy.
When both `maximumRows` and `bidRows` are empty it SHALL render nothing.

When either list is non-empty it SHALL render a link trigger using
`copy.link`. Activating the link SHALL open a dialog titled with `copy.title`,
showing `copy.description` as dialog description and two peer tabs in order
labeled `copy.bidsTab` then `copy.maximumsTab`. The dialog SHALL NOT render a
sticky current-maximum summary; the live private maximum remains on the bid
panel outside this block.

The **Bid placed** tab SHALL render a table with column headers
`copy.bidAmount` and `copy.time`. Each `ListingUserBidHistoryRow` SHALL show
`amountLabel` and formatted time from `acceptedAtMs` (or `timeOverride`). The
**Your maximums** tab SHALL render a table with column headers
`copy.maximumAmount` and `copy.time`. Each `ListingUserMaximumHistoryRow`
SHALL show the consumer-supplied `amountLabel` and formatted time from
`acceptedAtMs` (or `timeOverride`) only. It SHALL NOT show a Set, Raised, or
other status word on the row. Neither tab table SHALL include a bid-type
column.

The dialog SHALL select `copy.bidsTab` as the initial active tab whenever it
opens, including when `bidRows` is empty. When `bidRows` is empty and that tab
is active, it SHALL show a frameless design-system `EmptyState` using
`copy.emptyBidsTitle` and `copy.emptyBidsDescription`. Title, description, and tab list
SHALL stay fixed while only the active table scrolls inside the dialog body.

`ListingUserBidHistoryRow` and `ListingUserMaximumHistoryRow` SHALL each carry
`acceptedAtMs: number` and MAY carry `timeOverride?: string`.
`ListingUserBidHistory` SHALL continue to require `locale`, `timeZone`, and
`activityTimeCopy` and SHALL format each row with the platform activity-time
rules unless `timeOverride` is set.

This requirement supersedes the single-table personal bid-history dialog shape
previously proposed under `add-lot-user-bid-history`.

#### Scenario: shared-ui-auction-listing-SC-31 - Collector opens Your bidding with both lists
**Serves:** Personal bidding dialog - collector opens Your bidding with both lists

- **GIVEN** `ListingUserBidHistory` rendered with at least one maximum row and
  at least one bid-sequence row
- **WHEN** the collector activates the link
- **THEN** a dialog opens titled from `copy.title`
- **AND** the dialog shows no sticky current-maximum summary
- **AND** the initial tab is the bids tab
- **AND** the tab order is bids tab, then maximums tab
- **AND** each tab shows only its own amount and time columns with no bid-type
  column
- **AND** the dialog closes via the close control or Escape

#### Scenario: shared-ui-auction-listing-SC-32 - Bid placed stays the default when no bids were placed
**Serves:** Personal bidding dialog - bid placed stays the default when no bids were placed

- **GIVEN** `ListingUserBidHistory` rendered with at least one maximum row and
  an empty `bidRows` array
- **WHEN** the collector opens the dialog
- **THEN** the initial tab is the bids tab and shows a frameless `EmptyState`
  with `copy.emptyBidsTitle` and `copy.emptyBidsDescription`
- **AND** activating the maximums tab shows the supplied maximum rows

#### Scenario: shared-ui-auction-listing-SC-33 - No personal rows means no link
**Serves:** Personal bidding dialog - no personal rows means no link

- **GIVEN** `ListingUserBidHistory` rendered with empty `maximumRows` and empty
  `bidRows`
- **WHEN** it renders
- **THEN** no link or dialog is shown

#### Scenario: shared-ui-auction-listing-SC-34 - Active tab scrolls under a fixed chrome
**Serves:** Personal bidding dialog - active tab scrolls under a fixed chrome

- **GIVEN** `ListingUserBidHistory` rendered with more rows on the active tab
  than fit the dialog viewport and the dialog open
- **WHEN** the collector scrolls
- **THEN** only the active table scrolls inside the dialog body
- **AND** the dialog title, description, and tab list remain visible
