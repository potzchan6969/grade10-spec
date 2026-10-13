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

### Requirement: Every visible lot has one external lot status

Every lot a collector sees carries one of three statuses, worked out from the
lot alone.

**Three values** - Every lot a collector can see SHALL have exactly one
external lot status.

**Worked out, not saved** - Grade10 SHALL work it out from the lot and SHALL
NOT save it.

| External lot status | The lot |
| --- | --- |
| Upcoming | Published. Bidding has not started |
| Active | Bidding is open, until the lot closes. Includes extended bidding |
| Ended | Bidding is over, with or without a winner. For a lot with a winner, whatever the state of the winner's order |

**From the internal status** - Each internal lot status in
`grade10-admin/auction/post-sale` SHALL map to one external lot status, or to
Hidden:

| Internal lot status | External lot status |
| --- | --- |
| Draft | Hidden |
| Scheduled | Upcoming |
| Live | Active |
| Unsold | Ended |
| Called off | Hidden |
| Awaiting Setup | Ended |
| Preparing Invoice | Ended |
| Pending Payment | Ended |
| Preparing Shipment | Ended |
| Shipped | Ended |
| Delivered | Ended |
| Cancelled | Ended |
| Refunded | Ended |

**Hidden** - A Hidden lot SHALL have no external lot status. Collectors SHALL
NOT see it, as "Hidden lots have no public address" sets out.

**Lot, not order** - The external lot status SHALL describe the lot only. It
SHALL NOT describe a collector's bid or the winner's order. The winner's order
status, set by `grade10-site/auction/order-status`, SHALL be shown separately
in the winner's My Auctions.

**Where it shows** - The designer decides where and how pages show the external
lot status.

<!-- trace:scenario id=g10.auction-lot-status.SC-wpp rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-01 - A lot whose bidding has not started is Upcoming
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** a published lot whose scheduled start has not arrived
- **WHEN** Grade10 works out its external lot status
- **THEN** the status is Upcoming

<!-- trace:scenario id=g10.auction-lot-status.SC-orm rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-02 - A lot open for bidding is Active
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** two lots open for bidding, one closing in a day and one closing in a
  minute
- **WHEN** Grade10 works out their external lot status
- **THEN** both are Active

<!-- trace:scenario id=g10.auction-lot-status.SC-6aa rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-03 - A lot in extended bidding is Active
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** a lot past its scheduled close and in extended bidding
- **WHEN** Grade10 works out its external lot status
- **THEN** the status is Active

<!-- trace:scenario id=g10.auction-lot-status.SC-pmn rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-04 - A lot with a winner is Ended whatever state its order is in
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** four lots with a winner, whose orders are awaiting payment,
  Preparing Shipment, Shipped, and Cancelled
- **WHEN** Grade10 works out their external lot status
- **THEN** all four are Ended

<!-- trace:scenario id=g10.auction-lot-status.SC-flh rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-12 - A lot that ended with no winner is Ended
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** a published lot whose bidding ended with no winner
- **WHEN** Grade10 works out its external lot status
- **THEN** the status is Ended

<!-- trace:scenario id=g10.auction-lot-status.SC-eor rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-05 - The winner sees their order status separately
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** a winner whose order is awaiting payment
- **WHEN** they open My Auctions
- **THEN** the lot's external lot status is Ended
- **AND** their order status is shown separately


## RENAMED Requirements

- FROM: `### Requirement: Collectors never see hidden lots`
- TO: `### Requirement: Hidden lots have no public address`

**Reason** - The [owner's address decision](../../../../decisions.md#decisions) removes the called-off lot's permanent direct-address exception. The former requirement combines that exception with browse removal and bidder history.

**Migration** - Rename this requirement to "Hidden lots have no public address" below. Retain browse, search, watchlist and public-data removal and the bidder's My Auctions exception. Preserve the existing scenario trace identities; revise the direct-address scenario to assert not found when no eligible current holder exists. The complete target block below is the native rename replacement; its existing scenarios retain their permanent identities.

### Requirement: Hidden lots have no public address

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
