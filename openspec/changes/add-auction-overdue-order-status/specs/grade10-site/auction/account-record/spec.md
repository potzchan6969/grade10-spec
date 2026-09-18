## Feature set

- After a close
  - Overdue Status rows: names the missed setup or payment window in My Auctions

## ADDED Requirements

### Requirement: My Auctions names overdue orders in the Status column

The My Auctions list SHALL call the mixed standing and order-state column
Status. A missed setup deadline SHALL render Setup Overdue and an expired
invoice SHALL render Payment Overdue. Both rows SHALL retain View order and
the same lot and winning-bid facts as the Won row.

#### Scenario: grade10-site-auction-account-record-SC-63 - My Auctions names both overdue states
**Serves:** grade10-site-auction-account-record-US-09 - Winner finds an overdue order in My Auctions

- **GIVEN** one order in Setup Overdue and one in Payment Overdue
- **WHEN** the winner reads My Auctions
- **THEN** the column header is Status
- **AND** the two rows show their matching overdue labels and View order
