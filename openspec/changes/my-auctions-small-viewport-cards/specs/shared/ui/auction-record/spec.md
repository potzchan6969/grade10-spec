## Feature set

- The record surface exports
  - Export contract: names the components and types an application imports, so
    the surface lands once and reaches every application unchanged.
  - Independent parts: lets a surface reuse the row or the watch control
    without adopting the whole page.
  - Small-viewport cards: below `md`, AuctionRecord lists each lot as a card
    with the same facts; from `md`, the five-column table
  - Card hit target: below `md`, the whole card opens the lot or Winner Order
    via the row `href`; Unwatch and Email alerts stay separately tappable
- Content ownership
  - Copy through props: keeps message catalogs in the application and out of
    the shared package.
  - Reporting, not acting: keeps product state and writes on the application's
    side of the boundary.
  - Status column copy: names the mixed standing and order-state column plainly

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
with a watching-count badge whose value is the number of bookmarked lots,
and one list of those lots — or one empty state when there are none. It
SHALL NOT render separate Bidding and Watching section headings.

From the `md` breakpoint up, `AuctionRecord` SHALL render that list as one
table of rows, and `AuctionRecordRow` SHALL render as one table row with
columns for the listing (key image, title link, close), current bid, Status
(state badge when the application supplies a standing label; otherwise the
application-supplied no-standing placeholder such as `--`), Email alerts when
supplied, and Unwatch when supplied. Column widths SHALL follow content
(auto), matching the design-system table primitives.

Below `md`, `AuctionRecord` SHALL render that list as stacked cards — one
card per lot — without requiring horizontal scroll of the page content to
reach those facts or actions. It SHALL NOT show the table column header row
on that small-viewport surface.

Each small-viewport card SHALL carry:

- Identity: key image, Status badge when the application supplies a standing
  label, title, and close or detail when supplied
- Current bid on one line with its fact label
- A footer when Email alerts, Unwatch, or View order (or the application's
  equivalent label such as Setup) is supplied — Unwatch or View order on the
  left; Email alerts label and switch on the right

When the application supplies `href` (or `onOpen`), the whole card SHALL be
the primary hit target that opens that destination (listing or Winner Order).
Unwatch and Email alerts SHALL remain separately tappable and SHALL NOT be
swallowed by the card hit target. The title on the card SHALL NOT be a nested
link when the card itself is the hit target.

`AuctionRecordTabs` remains exported for transitional surfaces and SHALL NOT
be required for a new My Auctions assembly.

Each of `AuctionRecordRow` and `WatchButton` SHALL be renderable on its own,
outside `AuctionRecord`, so a surface may use the row or the watch control
alone. A row rendered alone MAY keep the table-row presentation; when the
application asks for `presentation="card"`, the row SHALL use the card
surface above.

When the application does not supply Unwatch (`onWatchToggle` / watch copy),
the row SHALL omit the Unwatch control. When it does not supply a standing
label, the table row SHALL show the application-supplied no-standing
placeholder rather than inventing a state badge; on the card surface the
Status badge MAY be omitted instead of showing that placeholder.

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
- **THEN** the bidding lots appear before the watching-only lots in one list
- **AND** no Bidding or Watching section heading appears

#### Scenario: shared-ui-auction-record-SC-11 - The title badge shows the row count
**Serves:** The record surface exports - the title badge shows the row count

- **GIVEN** an `AuctionRecord` supplied with four rows
- **WHEN** it renders
- **THEN** the badge beside the page title shows 4

#### Scenario: shared-ui-auction-record-SC-12 - Watch-only standing shows the placeholder
**Serves:** The record surface exports - watch-only standing shows the placeholder

- **GIVEN** an `AuctionRecordRow` supplied without a standing label and with
  the no-standing placeholder in copy
- **WHEN** it renders as a table row
- **THEN** Status shows that placeholder
- **AND** it does not invent a badge label

#### Scenario: shared-ui-auction-record-SC-13 - A bid row omits Unwatch when not supplied
**Serves:** The record surface exports - a bid row omits Unwatch when not supplied

- **GIVEN** an `AuctionRecordRow` supplied with email-alerts controls and no
  Unwatch props
- **WHEN** it renders
- **THEN** Email alerts are shown
- **AND** Unwatch is absent

#### Scenario: shared-ui-auction-record-SC-17 - Below md each lot is a card without sideways scroll
**Serves:** The record surface exports - small-viewport cards

- **GIVEN** an `AuctionRecord` supplied with bidding and watching lots
- **WHEN** it renders below the `md` breakpoint
- **THEN** each lot appears as a stacked card with identity, current bid on
  one line, Status badge when labelled, and a footer for Email alerts /
  Unwatch / View order when supplied
- **AND** those facts and actions are reachable without horizontal scroll of
  the page content
- **AND** the table column header row is not shown

#### Scenario: shared-ui-auction-record-SC-18 - From md the five-column table remains
**Serves:** The record surface exports - table from md

- **GIVEN** an `AuctionRecord` supplied with bidding and watching lots
- **WHEN** it renders from the `md` breakpoint up
- **THEN** the lots appear in one five-column table with the column header row

#### Scenario: shared-ui-auction-record-SC-19 - Below md the whole card opens the lot or order
**Serves:** The record surface exports - card hit target

- **GIVEN** an `AuctionRecord` card for a lot whose row supplies `href`
- **WHEN** the collector activates the card body below `md`
- **THEN** that `href` opens (listing or Winner Order)
- **AND** Unwatch and Email alerts on that card remain separately tappable
