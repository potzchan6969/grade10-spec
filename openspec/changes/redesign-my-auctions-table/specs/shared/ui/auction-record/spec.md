## Feature set

- **Table page body**
  - AuctionRecord shell: breadcrumbs, My Auctions title with watching-count
    badge, one table or one empty state.
  - AuctionRecordRow as table row: Auction, Current Bid, Your Standing, Email
    alerts, Unwatch when applicable.
- **Export contract**
  - Required exports: drop WatchingList and BiddingList; keep row, empty,
    WatchButton, transitional tabs.

## MODIFIED Requirements

### Requirement: The auction-record surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the account auction record — `AuctionRecord`,
`AuctionRecordRow`, `AuctionRecordEmpty`, `WatchButton`, and
`AuctionRecordTabs` — and exactly these types: `AuctionRecordProps`,
`AuctionRecordRowProps`, `AuctionRecordRowCopy`, `AuctionRecordRowState`,
`AuctionRecordEmptyProps`, `AuctionRecordCopy`, `AuctionRecordTabsProps`,
`WatchButtonProps`, `WatchButtonCopy`, `EmailAlertsCopy`, and
`EmailAlertsToastCopy`.

`WatchingList`, `BiddingList`, `WatchingListProps`, and `BiddingListProps`
SHALL NOT be required exports for this surface.

`AuctionRecord` is the My Auctions page body: breadcrumbs slot, page title
with a watching-count badge whose value is the number of table rows, and one
table of rows — or one empty state when there are no rows. It SHALL NOT
render separate Bidding and Watching section headings.

`AuctionRecordRow` SHALL render as one table row with columns for the
listing (key image, title link, close), current bid, Your Standing (state
badge when the application supplies a standing label; otherwise the
application-supplied no-standing placeholder such as `--`), Email alerts when
supplied, and Unwatch when supplied. Column widths SHALL follow content
(auto), matching the design-system table primitives.

`AuctionRecordTabs` remains exported for transitional surfaces and SHALL NOT
be required for a new My Auctions assembly.

Each of `AuctionRecordRow` and `WatchButton` SHALL be renderable on its own,
outside `AuctionRecord`, so a surface may use the row or the watch control
alone.

When the application does not supply Unwatch (`onWatchToggle` / watch copy),
the row SHALL omit the Unwatch control. When it does not supply a standing
label, the row SHALL show the application-supplied no-standing placeholder
rather than inventing a state badge.

#### Scenario: shared-ui-auction-record-SC-01 - An application imports the surface
**Serves:** The record surface exports - an application imports the surface

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: shared-ui-auction-record-SC-02 - A part is reused alone
**Serves:** The record surface exports - a part is reused alone

- **WHEN** an application renders `AuctionRecordRow` or `WatchButton` without
  `AuctionRecord`
- **THEN** it renders and behaves as specified, with no missing-context error
  and no requirement to supply page props

#### Scenario: shared-ui-auction-record-SC-08 - Bidding is read before Watching
**Serves:** The record surface exports - bidding is read before Watching

- **GIVEN** an `AuctionRecord` supplied with both bidding rows and watching
  rows
- **WHEN** it renders
- **THEN** the bidding rows appear before the watching-only rows in one table
- **AND** no Bidding or Watching section heading appears

#### Scenario: shared-ui-auction-record-SC-11 - The title badge shows the row count
**Serves:** Table page body - the title badge shows the row count

- **GIVEN** an `AuctionRecord` supplied with four rows
- **WHEN** it renders
- **THEN** the badge beside the page title shows 4

#### Scenario: shared-ui-auction-record-SC-12 - Watch-only standing shows the placeholder
**Serves:** Table page body - watch-only standing shows the placeholder

- **GIVEN** an `AuctionRecordRow` supplied without a standing label and with
  the no-standing placeholder in copy
- **WHEN** it renders
- **THEN** Your Standing shows that placeholder
- **AND** it does not invent a badge label

#### Scenario: shared-ui-auction-record-SC-13 - A bid row omits Unwatch when not supplied
**Serves:** Table page body - a bid row omits Unwatch when not supplied

- **GIVEN** an `AuctionRecordRow` supplied with email-alerts controls and no
  Unwatch props
- **WHEN** it renders
- **THEN** Email alerts are shown
- **AND** Unwatch is absent
