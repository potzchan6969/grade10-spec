## Feature set

- **Table page body**
  - Tabs: AuctionRecordTabs groups the table and reports the selected tab.
  - Disabled alerts: the row shows Email alerts disabled when told to.

## ADDED Requirements

### Requirement: Tabs group the table and a row can lock its alerts

`AuctionRecordTabs` SHALL group the My Auctions table under the
application-supplied tabs, show the tab the application marks selected, and
report the tab the collector selects. It SHALL NOT decide which listing
belongs to which tab.

When the application marks Email alerts disabled on a row, `AuctionRecordRow`
SHALL show the control disabled and SHALL NOT report a change.

#### Scenario: shared-ui-auction-record-SC-16 - Tabs report the selection

- **GIVEN** an `AuctionRecordTabs` supplied with Active, Upcoming and Ended,
  Active selected
- **WHEN** the collector selects Ended
- **THEN** the component reports Ended as selected
- **AND** it does not move any row itself

#### Scenario: shared-ui-auction-record-SC-17 - Disabled Email alerts report nothing

- **GIVEN** an `AuctionRecordRow` supplied with Email alerts marked disabled
- **WHEN** the collector presses the control
- **THEN** the control is shown disabled
- **AND** no change is reported
