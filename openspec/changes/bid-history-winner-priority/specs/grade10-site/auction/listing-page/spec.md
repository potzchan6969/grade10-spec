# grade10-site/auction/listing-page Specification

## Feature set

- Recent bids outcome
  - Winner after close: a closed sold lot crowns its winning public row; a live lot crowns none
  - Equal-max tip: a public row tied on amount with a row above it carries the earlier-leads tip

## ADDED Requirements

### Requirement: Recent bids crown the closed winner and explain a tied maximum

The lot page SHALL set the public Recent bids flags that
`shared/ui/auction-listing` draws, from the lot's own bids.

- **Winner** - once the lot's close is recorded as sold, the won public row
  carries `isWinner`; no other row does, and no row on a lot that is live,
  Closed without a result, or ended without a winner.
- **Tied maximum** - public rows with the same amount are listed in the
  order their maximums were set: the leading or won row first, then the row
  whose bidder set that maximum earlier, and that order holds once both are
  outbid. A row carries `samePricePriority` when another row with its amount
  is listed above it. This holds at the current price and at any older tie
  lower down.
- **Copy** - the page supplies the winner name and the equal-max tip in the
  collector's language.

#### Scenario: grade10-site-auction-listing-page-SC-48 - A sold lot crowns its winning bid
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a lot whose close is recorded as sold to customer A
- **WHEN** a collector reads its Recent bids
- **THEN** customer A's winning row shows a crown named Winner after the amount
- **AND** no other row shows a crown
- **AND** the same lot read while live showed no crown on any row

#### Scenario: grade10-site-auction-listing-page-SC-49 - A tied maximum that came second carries the tip
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a live lot where customer B's maximum matched customer A's earlier maximum, so both public rows show the same amount and customer A leads
- **WHEN** a collector reads its Recent bids
- **THEN** customer B's row carries the Info tip saying that when maximums match, the earlier one leads
- **AND** customer A's leading row carries no tip

#### Scenario: grade10-site-auction-listing-page-SC-50 - A lot without a winner crowns no bid
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a lot past its close whose result is not yet recorded, and a lot whose close is recorded with no winner
- **WHEN** a collector reads each lot's Recent bids
- **THEN** no row on either lot shows a crown

#### Scenario: grade10-site-auction-listing-page-SC-51 - An older tie lower down keeps its tip
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a live lot whose Recent bids hold two rows tied at an amount below the current price, from customer A's earlier maximum and customer B's later one
- **WHEN** a collector reads its Recent bids
- **THEN** customer B's row at that amount carries the Info tip
- **AND** customer A's row at that amount carries none
