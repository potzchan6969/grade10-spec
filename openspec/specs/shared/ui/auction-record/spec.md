# shared/ui/auction-record Specification

## Purpose
The account auction-record components every store application composes: the
My Auctions page body (breadcrumbs, title with watching-count badge, one
table of bookmarked lots), the row that carries one listing, the empty
state, and the control that watches a listing wherever it is shown. The
components display what they are given and report what the collector did;
what is stored, what a state means, and every string on screen belong to the
application.

## Feature set

- **The record surface exports**
  - Export contract: names the components and types an application imports, so
    the surface lands once and reaches every application unchanged.
  - Independent parts: lets a surface reuse the row or the watch control
    without adopting the whole page.
- **Content ownership**
  - Copy through props: keeps message catalogs in the application and out of
    the shared package.
  - Reporting, not acting: keeps product state and writes on the application's
    side of the boundary.

## Requirements

### Requirement: The auction-record surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the account auction record — `AuctionRecord`,
`WatchingList`, `BiddingList`, `AuctionRecordRow`, `AuctionRecordEmpty`,
`WatchButton`, and `AuctionRecordTabs` — and exactly these types:
`AuctionRecordProps`, `WatchingListProps`, `BiddingListProps`,
`AuctionRecordRowProps`, `AuctionRecordRowCopy`, `AuctionRecordRowState`,
`AuctionRecordEmptyProps`, `AuctionRecordCopy`, `AuctionRecordTabsProps`,
`WatchButtonProps`, `WatchButtonCopy`, `EmailAlertsCopy`, and
`EmailAlertsToastCopy`.

`AuctionRecord` is the My Auctions page body: breadcrumbs slot, page title,
Bidding and Watching sections on one page, in that order — a lot holding the
collector's money is read before one they only follow. A section with no rows
SHALL be omitted; when both sections are empty the page SHALL show one empty
state.
`AuctionRecordTabs` remains exported for transitional surfaces and SHALL NOT
be required for a new My Auctions assembly.

Each of `AuctionRecordRow` and `WatchButton` SHALL be renderable on its own,
outside `AuctionRecord`, so a surface may use the row or the watch control
alone.

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
- **THEN** the Bidding section appears before the Watching section

### Requirement: Every string on the surface is supplied by the application

These components SHALL supply no user-facing string of their own — no state
label, no empty-state copy, no watch or unwatch label, no email-alerts label,
no label for a row's current bid or close, no wording for an email-alerts
confirmation, and no default for any of them. A string not supplied SHALL be
absent rather than replaced by a built-in value.

#### Scenario: shared-ui-auction-record-SC-03 - No label is invented
**Serves:** Content ownership - no label is invented

- **WHEN** an application renders the surface without supplying a state label
- **THEN** no built-in label appears in its place

### Requirement: The surface reports the collector's action rather than performing it

These components SHALL hold no auction product state. `WatchButton` SHALL show
watched, not watched, or a change in progress exactly as the application tells
it to, and SHALL NOT change what it shows on its own when the collector acts.
Acting SHALL report the collector's intent to the application through a
callback named for the event. `WatchButton` SHALL use the same design-system
button and bell treatment as the auction lot details watch control.

When the application tells `WatchButton` it is **locked** (a bid stands on the
lot), the control SHALL show the watching label, SHALL be disabled, and SHALL
NOT report a press.

`AuctionRecordRow` SHALL accept an optional email-alerts control distinct from
unwatch; when supplied with copy and `onEmailAlertsChange`, it SHALL report
the intended on/off value and SHALL NOT invent mute or unwatch behaviour. The
control SHALL show the value the application gives it, and one row's control
SHALL NOT change what another row shows. When the application supplies
confirmation copy, the row SHALL announce the change once the application has
changed the value it gives the control — never on the collector's click
alone.

When the application supplies watch or unwatch confirmation copy on
`WatchButton`, the control SHALL announce once the application has changed the
watched value it gives the control — never on the press alone. When that copy
includes an action label, the announcement SHALL expose it (View My Auctions
on watch; Undo on unwatch). Absent confirmation copy, the control announces
nothing.

#### Scenario: shared-ui-auction-record-SC-04 - The watch control reports and waits
**Serves:** The record surface exports - the watch control reports and waits

- **GIVEN** a `WatchButton` told it is not watched and not locked
- **WHEN** the collector activates it
- **THEN** the component reports the collector's intent to the application
- **AND** it still shows not watched until the application tells it otherwise

#### Scenario: shared-ui-auction-record-SC-05 - A change in progress is shown when told
**Serves:** The record surface exports - a change in progress is shown when told

- **GIVEN** a `WatchButton` told a change is in progress
- **WHEN** it renders
- **THEN** it shows the change as in progress

#### Scenario: shared-ui-auction-record-SC-07 - Email alerts report without unwatching
**Serves:** The record surface exports - email alerts report without unwatching

- **GIVEN** an `AuctionRecordRow` supplied with email-alerts copy and
  `onEmailAlertsChange`
- **WHEN** the collector turns email alerts off
- **THEN** the component reports the intended off value
- **AND** it does not remove the row or invent an unwatch

#### Scenario: shared-ui-auction-record-SC-09 - One row's alerts stand alone
**Serves:** The record surface exports - one row's alerts stand alone

- **GIVEN** an `AuctionRecord` whose rows each carry an email-alerts control
  told alerts are on
- **WHEN** the collector turns one row's alerts off and the application
  changes only that row's value
- **THEN** only that row shows alerts off
- **AND** every other row still shows alerts on

#### Scenario: shared-ui-auction-record-SC-10 - A confirmed change is announced
**Serves:** The record surface exports - a confirmed change is announced

- **GIVEN** an `AuctionRecordRow` supplied with email-alerts confirmation copy
- **WHEN** the application changes the value it gives the control
- **THEN** the row announces the change once, in the supplied wording
- **AND** a row supplied without that copy announces nothing

#### Scenario: shared-ui-auction-record-SC-14 - A locked watch control does not report
**Serves:** Content ownership - a locked watch control does not report

- **GIVEN** a `WatchButton` told it is watched and locked
- **WHEN** it renders
- **THEN** it shows Watching and is not activatable
- **AND** it does not report a press

#### Scenario: shared-ui-auction-record-SC-15 - Watch confirmation announces after the application confirms
**Serves:** Content ownership - watch confirmation announces after the application confirms

- **GIVEN** a `WatchButton` supplied with watch confirmation copy including an
  action label
- **WHEN** the application changes it from not watched to watched
- **THEN** the control announces once in the supplied wording
- **AND** the announcement exposes the supplied action label

### Requirement: A watched-list row carries the lot's key image

`AuctionRecordRow` SHALL accept an optional key image for the listing. When
supplied, the row SHALL show that image beside the listing identity. When not
supplied, the image well SHALL remain without inventing a product photograph.

#### Scenario: shared-ui-auction-record-SC-06 - A row shows the key image when given
**Serves:** Content ownership - a row shows the key image when given

- **GIVEN** an `AuctionRecordRow` supplied with a key image
- **WHEN** it renders
- **THEN** that image is shown on the row
