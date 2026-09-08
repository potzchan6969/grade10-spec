## ADDED Requirements

### Requirement: The listing surface exports user bid history

The shared UI package SHALL export, from its public entry,
`ListingUserBidHistory` and these types: `ListingUserBidHistoryProps`,
`ListingUserBidHistoryCopy`, and `ListingUserBidHistoryRow`.

`ListingUserBidHistory` SHALL receive a required `copy` object and a `rows`
array. It SHALL supply no default user-visible copy. When `rows` is empty it
SHALL render nothing.

When `rows` is non-empty it SHALL render a link trigger using `copy.link`.
Activating the link SHALL open a dialog titled with `copy.title`, showing
`copy.samePricePriority` as dialog description (equal maxima are ranked by
submission time — earlier wins), and a table with column headers
`copy.amount` and `copy.time`. Each row SHALL show the consumer-supplied
`amountLabel` and formatted time from `acceptedAtMs` (or `timeOverride`).
The table SHALL NOT include a bid-type column. Long histories SHALL scroll
inside the dialog body while the dialog title, description, and close control
remain fixed.

#### Scenario: shared-ui-auction-listing-SC-09 - A signed-in user opens personal bid history

- **GIVEN** `ListingUserBidHistory` rendered with at least one row
- **WHEN** the collector activates the link
- **THEN** a dialog opens showing the same-price priority description and a
  table with amount and time for each supplied row
- **AND** no bid-type column or type badge is shown
- **AND** the dialog closes via the close control or Escape

#### Scenario: shared-ui-auction-listing-SC-10 - No rows means no link

- **GIVEN** `ListingUserBidHistory` rendered with an empty `rows` array
- **WHEN** it renders
- **THEN** no link or dialog is shown

#### Scenario: shared-ui-auction-listing-SC-11 - Long history scrolls inside the dialog

- **GIVEN** `ListingUserBidHistory` rendered with more rows than fit the dialog
  viewport and the dialog open
- **WHEN** the collector scrolls
- **THEN** the table scrolls inside the dialog body
- **AND** the dialog title and same-price priority description remain visible

### Requirement: The auction bid card accepts a recent-bids accessory

`ListingAuctionBidCard` SHALL accept an optional `recentBidsAccessory` node.
When supplied, it SHALL render that node on the trailing edge of the recent-bids
section header. It SHALL NOT require `recentBidsAccessory` to render.

#### Scenario: shared-ui-auction-listing-SC-12 - An accessory composes beside recent bids

- **GIVEN** a bid card with a recent-bids section and a non-empty
  `recentBidsAccessory`
- **WHEN** the card renders
- **THEN** the accessory appears beside the recent-bids label
- **AND** the public recent-bids list below is unchanged
