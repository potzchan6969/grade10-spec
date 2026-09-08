# shared/ui/auction-record Specification

## Purpose
The account auction-record components every store application composes: the
two-page frame, the two lists, the row that carries one listing's standing, the
empty state, and the control that watches a listing wherever it is shown. The
components display what they are given and report what the collector did;
what is stored, what a state means, and every string on screen belong to the
application.

## Feature set

- **The record surface exports**
  - Export contract: names the components and types an application imports, so
    the surface lands once and reaches every application unchanged.
  - Independent parts: lets a surface reuse the row or the watch control
    without adopting the whole frame.
- **Content ownership**
  - Copy through props: keeps message catalogs in the application and out of
    the shared package.
  - Reporting, not acting: keeps product state and writes on the application's
    side of the boundary.

## Requirements

### Requirement: The auction-record surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the account auction record — `AuctionRecordTabs`,
`WatchingList`, `BiddingList`, `AuctionRecordRow`, `AuctionRecordEmpty`, and
`WatchButton` — and exactly these types: `AuctionRecordTabsProps`,
`WatchingListProps`, `BiddingListProps`, `AuctionRecordRowProps`,
`AuctionRecordRowState`, `AuctionRecordEmptyProps`, `AuctionRecordCopy`,
`WatchButtonProps`, and `WatchButtonCopy`.

Each of those components SHALL be renderable on its own, outside
`AuctionRecordTabs`, so a surface may use the row or the watch control alone.

#### Scenario: shared-ui-auction-record-SC-01 - An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: shared-ui-auction-record-SC-02 - A part is reused alone

- **WHEN** an application renders `AuctionRecordRow` or `WatchButton` without
  `AuctionRecordTabs`
- **THEN** it renders and behaves as specified, with no missing-context error
  and no requirement to supply frame props

### Requirement: Every string on the surface is supplied by the application

These components SHALL supply no user-facing string of their own — no state
label, no empty-state copy, no watch or unwatch label, and no default for any
of them. A string not supplied SHALL be absent rather than replaced by a
built-in value.

#### Scenario: shared-ui-auction-record-SC-03 - No label is invented

- **WHEN** an application renders the surface without supplying a state label
- **THEN** no built-in label appears in its place

### Requirement: The surface reports the collector's action rather than performing it

These components SHALL hold no auction product state. `WatchButton` SHALL show
watched, not watched, or a change in progress exactly as the application tells
it to, and SHALL NOT change what it shows on its own when the collector acts.
Acting SHALL report the collector's intent to the application through a
callback named for the event.

#### Scenario: shared-ui-auction-record-SC-04 - The watch control reports and waits

- **GIVEN** a `WatchButton` told it is not watched
- **WHEN** the collector activates it
- **THEN** the component reports the collector's intent to the application
- **AND** it still shows not watched until the application tells it otherwise

#### Scenario: shared-ui-auction-record-SC-05 - A change in progress is shown when told

- **GIVEN** a `WatchButton` told a change is in progress
- **WHEN** it renders
- **THEN** it shows the change as in progress
