# grade10-site/auction/lot-status Specification

## MODIFIED Requirements

### Requirement: Collectors never see hidden lots

A draft lot is absent from every collector page. A called-off lot is absent
from browse, search, watchlist and public listing data, but its canonical
listing page remains directly accessible; a collector who bid on it also sees
it in My Auctions.

**Hidden lots** - A hidden lot is a lot whose internal lot status is Draft or
Called off.

**Browse removal** - Collectors SHALL NOT discover a called-off lot through
catalogue, search, filters, watchlist or public listing data. Its canonical
listing page remains directly accessible by its original address, per
`grade10-site/auction/listing-page`; the listing code is not an alternate
route. A draft has no public address and remains unavailable.

**Bidder exception** - A collector who bid on a called-off lot SHALL still see
it in My Auctions, where the row says their card was not charged, per
`grade10-site/auction/account-record`. No other collector SHALL see it.

<!-- trace:scenario id=g10.auction-lot-status.SC-me0 rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-06 - A draft lot is not in the catalogue, but an unsold lot is
**Serves:** grade10-site-auction-lot-status-US-02 - Collector does not see draft or called-off lots

- **GIVEN** a draft lot, and a published lot whose bidding ended with no winner
- **WHEN** a collector opens the auction catalogue
- **THEN** the draft lot is not listed
- **AND** the unsold lot is listed as Ended

<!-- trace:scenario id=g10.auction-lot-status.SC-pe2 rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-07 - A called-off lot is removed from the catalogue
**Serves:** grade10-site-auction-lot-status-US-02 - Collector does not see draft or called-off lots

- **GIVEN** a published lot that an operator then calls off
- **WHEN** a collector opens the auction catalogue
- **THEN** the lot is not listed

<!-- trace:scenario id=g10.auction-lot-status.SC-cox rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-08 - A called-off lot is removed from the watchlist
**Serves:** grade10-site-auction-lot-status-US-02 - Collector does not see draft or called-off lots

- **GIVEN** a collector watching one lot that ends with no winner and one lot
  that is called off
- **WHEN** they open their watchlist
- **THEN** the called-off lot is not listed
- **AND** the unsold lot is listed as Ended

<!-- trace:scenario id=g10.auction-lot-status.SC-yoe rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-09 - A bidder still sees a called-off lot
**Serves:** grade10-site-auction-lot-status-US-03 - Bidder sees what happened to a called-off lot

- **GIVEN** a collector who bid on a lot that an operator then called off
- **WHEN** they open My Auctions
- **THEN** the lot is listed
- **AND** the row says their card was not charged
- **AND** a collector who did not bid on the lot does not see it

<!-- trace:scenario id=g10.auction-lot-status.SC-w9d rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-13 - A called-off lot stays reachable at its canonical address
**Serves:** grade10-site-auction-lot-status-US-02 - Collector does not see draft or called-off lots

- **GIVEN** a published lot whose canonical address and listing code are
  permanently reserved
- **WHEN** an operator calls the lot off and a collector opens its canonical
  address directly
- **THEN** the address serves the lot's public listing page
- **AND** the lot remains absent from catalogue, search and watchlist
- **AND** the listing code does not resolve as an alternate address
