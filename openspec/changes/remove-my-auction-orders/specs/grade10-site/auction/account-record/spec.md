# grade10-site/auction/account-record Specification

## MODIFIED Requirements

### Requirement: A Won row opens its auction order

A Won row SHALL offer the application-supplied entry point to that lot's
auction order. Selecting it SHALL open the matching order, per
`grade10-site/auction/winner-order`. The row SHALL remain read-only: it
SHALL NOT record payment, confirm or change an address, or change order status.

<!-- trace:scenario id=g10.auction-account-record.SC-we1 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-55 - A Won row opens its order
**Serves:** grade10-site-auction-account-record-US-07 - Collector reads My Auctions by bidding window

- **GIVEN** a closed listing whose winner is the collector and whose auction
  order is identified by the row
- **WHEN** the collector selects the row's order entry point
- **THEN** the matching auction order opens
- **AND** no payment, address, or order-status write occurs on My Auctions
