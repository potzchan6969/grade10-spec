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

#### Scenario: shared-ui-auction-record-SC-01 - An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: shared-ui-auction-record-SC-02 - A part is reused alone

- **WHEN** an application renders `AuctionRecordRow` or `WatchButton` without
  `AuctionRecord`
- **THEN** it renders and behaves as specified, with no missing-context error
  and no requirement to supply page props

#### Scenario: shared-ui-auction-record-SC-08 - Bidding is read before Watching

- **GIVEN** an `AuctionRecord` supplied with both bidding rows and watching
  rows
- **WHEN** it renders
- **THEN** the bidding rows appear before the watching-only rows in one table
- **AND** no Bidding or Watching section heading appears

#### Scenario: shared-ui-auction-record-SC-11 - The title badge shows the row count

- **GIVEN** an `AuctionRecord` supplied with four rows
- **WHEN** it renders
- **THEN** the badge beside the page title shows 4

#### Scenario: shared-ui-auction-record-SC-12 - Watch-only standing shows the placeholder

- **GIVEN** an `AuctionRecordRow` supplied without a standing label and with
  the no-standing placeholder in copy
- **WHEN** it renders
- **THEN** Your Standing shows that placeholder
- **AND** it does not invent a badge label

### Requirement: The surface reports the collector's action rather than performing it

These components SHALL hold no auction product state. `WatchButton` SHALL show
watched, not watched, or a change in progress exactly as the application tells
it to, and SHALL NOT change what it shows on its own when the collector acts.
Acting SHALL report the collector's intent to the application through a
callback named for the event. `WatchButton` SHALL use the same design-system
button and bell treatment as the auction lot details watch control.
`AuctionRecordRow` SHALL accept an optional email-alerts control distinct from
unwatch; when supplied with copy and `onEmailAlertsChange`, it SHALL report
the intended on/off value and SHALL NOT invent mute or unwatch behaviour. The
control SHALL show the value the application gives it, and one row's control
SHALL NOT change what another row shows. When the application supplies
confirmation copy, the row SHALL announce the change once the application has
changed the value it gives the control — never on the collector's click
alone.

When the application does not supply Unwatch (`onWatchToggle` / watch copy),
the row SHALL omit the Unwatch control. When it does not supply a standing
label, the row SHALL show the application-supplied no-standing placeholder
rather than inventing a state badge.

#### Scenario: shared-ui-auction-record-SC-04 - The watch control reports and waits

- **GIVEN** a `WatchButton` told it is not watched
- **WHEN** the collector activates it
- **THEN** the component reports the collector's intent to the application
- **AND** it still shows not watched until the application tells it otherwise

#### Scenario: shared-ui-auction-record-SC-05 - A change in progress is shown when told

- **GIVEN** a `WatchButton` told a change is in progress
- **WHEN** it renders
- **THEN** it shows the change as in progress

#### Scenario: shared-ui-auction-record-SC-07 - Email alerts report without unwatching

- **GIVEN** an `AuctionRecordRow` supplied with email-alerts copy and
  `onEmailAlertsChange`
- **WHEN** the collector turns email alerts off
- **THEN** the component reports the intended off value
- **AND** it does not remove the row or invent an unwatch

#### Scenario: shared-ui-auction-record-SC-09 - One row's alerts stand alone

- **GIVEN** an `AuctionRecord` whose rows each carry an email-alerts control
  told alerts are on
- **WHEN** the collector turns one row's alerts off and the application
  changes only that row's value
- **THEN** only that row shows alerts off
- **AND** every other row still shows alerts on

#### Scenario: shared-ui-auction-record-SC-10 - A confirmed change is announced

- **GIVEN** an `AuctionRecordRow` supplied with email-alerts confirmation copy
- **WHEN** the application changes the value it gives the control
- **THEN** the row announces the change once, in the supplied wording
- **AND** a row supplied without that copy announces nothing

#### Scenario: shared-ui-auction-record-SC-13 - A bid row omits Unwatch when not supplied

- **GIVEN** an `AuctionRecordRow` supplied with email-alerts controls and no
  Unwatch props
- **WHEN** it renders
- **THEN** Email alerts are shown
- **AND** Unwatch is absent
