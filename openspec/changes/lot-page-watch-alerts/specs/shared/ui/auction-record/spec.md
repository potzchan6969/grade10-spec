## MODIFIED Requirements

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

- **GIVEN** a `WatchButton` told it is not watched and not locked
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

#### Scenario: shared-ui-auction-record-SC-11 - A locked watch control does not report

- **GIVEN** a `WatchButton` told it is watched and locked
- **WHEN** it renders
- **THEN** it shows Watching and is not activatable
- **AND** it does not report a press

#### Scenario: shared-ui-auction-record-SC-12 - Watch confirmation announces after the application confirms

- **GIVEN** a `WatchButton` supplied with watch confirmation copy including an
  action label
- **WHEN** the application changes it from not watched to watched
- **THEN** the control announces once in the supplied wording
- **AND** the announcement exposes the supplied action label
