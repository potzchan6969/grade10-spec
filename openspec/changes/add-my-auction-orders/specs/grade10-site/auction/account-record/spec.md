## Feature set

- **Tabs by bidding window**
  - Active, Upcoming, Ended: every row sits in the tab its bidding window names.
  - Landing: My Auctions opens on Active; the title count stays the total.
- **Row actions**
  - Ended alerts: Email alerts show disabled on a closed lot.
  - Won entry: a Won row opens its auction order.

## ADDED Requirements

### Requirement: My Auctions groups its rows into Active, Upcoming and Ended tabs

My Auctions SHALL place every row in exactly one of three tabs, shown in this
order, and SHALL open on Active.

| Tab | Holds listings whose |
| --- | --- |
| Active | Bidding window is open |
| Upcoming | Bidding window has not opened |
| Ended | Bidding is over, however it ended |

A listing SHALL move to the tab its window names when the window changes. The
row order, row content and row actions inside each tab SHALL be those the
table already follows. The page title badge SHALL count the rows across all
three tabs.

A tab with no rows while another tab has rows SHALL say that tab has no lots,
and SHALL NOT be presented as a failure.

#### Scenario: grade10-site-auction-account-record-SC-49 - Each listing sits in the tab its window names

- **GIVEN** a collector watching one listing whose bidding has not opened, one
  whose bidding is open, and one that has closed
- **WHEN** they open each tab of My Auctions
- **THEN** Upcoming lists only the first, Active only the second, and Ended
  only the third

#### Scenario: grade10-site-auction-account-record-SC-50 - A listing moves tab when its window opens

- **GIVEN** a watched listing in the Upcoming tab
- **WHEN** its bidding window opens and the collector reopens My Auctions
- **THEN** the listing is in the Active tab
- **AND** it is not in the Upcoming tab

#### Scenario: grade10-site-auction-account-record-SC-51 - An empty tab is not a failure

- **GIVEN** a collector with Active listings and no Upcoming listings
- **WHEN** they open the Upcoming tab
- **THEN** the tab says it has no lots
- **AND** it does not report an error

#### Scenario: grade10-site-auction-account-record-SC-53 - My Auctions opens on Active

- **GIVEN** a collector with listings in all three tabs
- **WHEN** they open My Auctions
- **THEN** the Active tab is shown

#### Scenario: grade10-site-auction-account-record-SC-54 - The title count covers every tab

- **GIVEN** a collector with one Upcoming, one Active and one Ended listing
- **WHEN** they open My Auctions
- **THEN** the badge beside the page title shows 3

### Requirement: Ended rows lock Email alerts

A row in the Ended tab SHALL show Email alerts disabled, SHALL NOT let the
collector change them, and SHALL leave the listing's alert setting unchanged.

#### Scenario: grade10-site-auction-account-record-SC-52 - Ended rows lock Email alerts

- **GIVEN** a listing in the Ended tab of My Auctions
- **WHEN** the collector tries to change its Email alerts
- **THEN** the control is disabled
- **AND** the listing's alert setting is unchanged

### Requirement: A Won row opens its auction order

A Won row SHALL offer the application-supplied entry point to that lot's
auction order. Selecting it SHALL open the matching order, per
`grade10-site/auction/auction-orders`. The row SHALL remain read-only: it
SHALL NOT record payment, confirm or change an address, or change order status.

#### Scenario: grade10-site-auction-account-record-SC-55 - A Won row opens its order

- **GIVEN** a closed listing whose winner is the collector and whose auction
  order is identified by the row
- **WHEN** the collector selects the row's order entry point
- **THEN** the matching auction order opens
- **AND** no payment, address, or order-status write occurs on My Auctions
