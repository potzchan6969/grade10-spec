## Feature set

- External lot status
  - Three values: one set of statuses for every collector page, separate from
    the internal lot status
  - Worked out, not saved: taken from the lot, so it always matches the lot
  - Lot, not order: the winner's order status is shown separately
  - Preparing Shipment maps to Ended (was Processing)
- Hidden lots
  - Browse removal: Draft and Called off lots stay out of browse, search
    and watchlist
  - Released address: a called-off lot no longer answers at its former
    public address
  - Bidder exception: a collector who bid on a called-off lot still sees it in
    My Auctions
- Listing data
  - Status in the listing data: every page uses the same value

## MODIFIED Requirements

### Requirement: Collectors never see hidden lots

A draft lot is absent from every collector page. A called-off lot is absent
from browse, search, watchlist and public listing data. A collector who bid on
it still sees it in My Auctions.

**Hidden lots** - A hidden lot is a lot whose internal lot status is Draft or
Called off.

**Browse removal** - Collectors SHALL NOT discover a called-off lot through
catalogue, search, filters, watchlist or public listing data. A called-off
lot SHALL NOT answer at its former address. That released address follows
current-holder lookup in `grade10-site/auction/listing-page`, and its listing
code SHALL NOT provide an alternate route. A draft remains unavailable.

**Bidder exception** - A collector who bid on a called-off lot SHALL still see
it in My Auctions, where the row says their card was not charged, per
`grade10-site/auction/account-record`. No other collector SHALL see it.

<!-- trace:scenario id=g10.auction-lot-status.SC-me0 rev=1 -->
#### Scenario: g10.auction-lot-status.SC6 - A draft lot is not in the catalogue, but an unsold lot is
**Serves:** grade10-site-auction-lot-status-US-02 - Collector does not see draft or called-off lots

- **GIVEN** a draft lot, and a published lot whose bidding ended with no winner
- **WHEN** a collector opens the auction catalogue
- **THEN** the draft lot is not listed
- **AND** the unsold lot is listed as Ended

<!-- trace:scenario id=g10.auction-lot-status.SC-pe2 rev=1 -->
#### Scenario: g10.auction-lot-status.SC7 - A called-off lot is removed from the catalogue
**Serves:** grade10-site-auction-lot-status-US-02 - Collector does not see draft or called-off lots

- **GIVEN** a published lot that an operator then calls off
- **WHEN** a collector opens the auction catalogue
- **THEN** the lot is not listed

<!-- trace:scenario id=g10.auction-lot-status.SC-cox rev=1 -->
#### Scenario: g10.auction-lot-status.SC8 - A called-off lot is removed from the watchlist
**Serves:** grade10-site-auction-lot-status-US-02 - Collector does not see draft or called-off lots

- **GIVEN** a collector watching one lot that ends with no winner and one lot
  that is called off
- **WHEN** they open their watchlist
- **THEN** the called-off lot is not listed
- **AND** the unsold lot is listed as Ended

<!-- trace:scenario id=g10.auction-lot-status.SC-yoe rev=1 -->
#### Scenario: g10.auction-lot-status.SC9 - A bidder still sees a called-off lot
**Serves:** grade10-site-auction-lot-status-US-03 - Bidder sees what happened to a called-off lot

- **GIVEN** a collector who bid on a lot that an operator then called off
- **WHEN** they open My Auctions
- **THEN** the lot is listed
- **AND** the row says their card was not charged
- **AND** a collector who did not bid on the lot does not see it

<!-- trace:scenario id=g10.auction-lot-status.SC-w9d rev=2 -->
#### Scenario: g10.auction-lot-status.SC13 - A called-off lot no longer answers at its former address
**Serves:** grade10-site-auction-lot-status-US-02 - the collector follows an address after its lot is withdrawn

- **GIVEN** a published lot that is called off and no new eligible holder of its former slug
- **WHEN** a collector opens the former address directly
- **THEN** the response is Page not found with status 404
- **AND** the called-off lot remains absent from catalogue, search and watchlist
- **AND** its listing code does not resolve as an alternate address

<!-- trace:scenario id=g10.auction-lot-status.SC-cmh rev=1 -->
#### Scenario: g10.auction-lot-status.SC14 - Reuse does not replace the bidder history
**Serves:** grade10-site-auction-lot-status-US-03 - the bidder checks the outcome of the lot they bid on

- **GIVEN** a collector bid on a called-off lot whose former slug now belongs to a different public lot
- **WHEN** the bidder opens My Auctions
- **THEN** their called-off lot remains recorded with the existing no-charge result; it is not replaced by the new slug holder, and a collector who did not bid cannot see that called-off record
