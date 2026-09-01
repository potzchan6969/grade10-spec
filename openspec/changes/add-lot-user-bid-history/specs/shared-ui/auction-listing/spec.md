## ADDED Requirements

### Requirement: The listing surface exports user bid history

The shared UI package SHALL export, from its public entry,
`ListingUserBidHistory` and these types: `ListingUserBidHistoryProps`,
`ListingUserBidHistoryCopy`, and `ListingUserBidHistoryRow`.

`ListingUserBidHistory` SHALL receive a required `copy` object and a `rows`
array. It SHALL supply no default user-visible copy. When `rows` is empty it
SHALL render nothing.

When `rows` is non-empty it SHALL render a link trigger using `copy.link`.
Activating the link SHALL open a dialog titled with `copy.title` containing a
table with column headers `copy.amount`, `copy.type`, and `copy.time`. Each
row SHALL show the consumer-supplied `amountLabel`, `bidTypeLabel` inside a
badge whose variant is `outline` when `bidType` is `manual` and `info` when
`bidType` is `auto`, and `timeLabel`. Long histories SHALL scroll inside the
dialog body while the dialog title and close control remain fixed.

#### Scenario: auction-listing-SC-09 - A signed-in user opens personal bid history

- **GIVEN** `ListingUserBidHistory` rendered with at least one row
- **WHEN** the collector activates the link
- **THEN** a dialog opens showing a table with amount, type badge, and time for
  each supplied row
- **AND** the dialog closes via the close control or Escape

#### Scenario: auction-listing-SC-10 - No rows means no link

- **GIVEN** `ListingUserBidHistory` rendered with an empty `rows` array
- **WHEN** it renders
- **THEN** no link or dialog is shown

#### Scenario: auction-listing-SC-11 - Long history scrolls inside the dialog

- **GIVEN** `ListingUserBidHistory` rendered with more rows than fit the dialog
  viewport and the dialog open
- **WHEN** the collector scrolls
- **THEN** the table scrolls inside the dialog body
- **AND** the dialog title remains visible

### Requirement: The auction bid card accepts a recent-bids accessory

`ListingAuctionBidCard` SHALL accept an optional `recentBidsAccessory` node.
When supplied, it SHALL render that node on the trailing edge of the recent-bids
section header. It SHALL NOT require `recentBidsAccessory` to render.

#### Scenario: auction-listing-SC-12 - An accessory composes beside recent bids

- **GIVEN** a bid card with a recent-bids section and a non-empty
  `recentBidsAccessory`
- **WHEN** the card renders
- **THEN** the accessory appears beside the recent-bids label
- **AND** the public recent-bids list below is unchanged
