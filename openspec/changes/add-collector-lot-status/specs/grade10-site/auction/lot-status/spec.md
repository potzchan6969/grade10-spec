## Purpose

The external lot status is the status collectors see for an auction lot:
Upcoming, Active or Ended, worked out from the lot and never saved. This
capability also sets which lots collectors never see.

## Feature set

- External lot status
  - Three values: one set of statuses for every collector page, separate from
    the internal lot status
  - Worked out, not saved: taken from the lot, so it always matches the lot
  - Lot, not order: the winner's order status is shown separately
- Hidden lots
  - Never shown: Draft and Called off lots do not appear on any
    collector page
  - Bidder exception: a collector who bid on a called-off lot still sees it in
    My Auctions
- Listing data
  - Status in the listing data: every page uses the same value

## ADDED Requirements

### Requirement: Every visible lot has one external lot status

Every lot a collector can see SHALL have exactly one external lot status.
Grade10 SHALL work it out from the lot and SHALL NOT save it.

| External lot status | The lot |
| --- | --- |
| Upcoming | Published. Bidding has not started |
| Active | Bidding is open, until the lot closes. Includes extended bidding |
| Ended | Bidding is over, with or without a winner. For a lot with a winner, whatever the state of the winner's order |

Each internal lot status in `grade10-admin/auction/post-sale` SHALL map to one
external lot status, or to Hidden:

| Internal lot status | External lot status |
| --- | --- |
| Draft | Hidden |
| Scheduled | Upcoming |
| Live | Active |
| Unsold | Ended |
| Called off | Hidden |
| Awaiting Address | Ended |
| Preparing Invoice | Ended |
| Pending Payment | Ended |
| Processing | Ended |
| Shipped | Ended |
| Delivered | Ended |
| Cancelled | Ended |
| Refunded | Ended |

A Hidden lot SHALL have no external lot status. Collectors SHALL NOT see it, as
"Collectors never see hidden lots" sets out.

The external lot status SHALL describe the lot only. It SHALL NOT describe a
collector's bid or the winner's order. The winner's order status, set by
`grade10-site/auction/order-status`, SHALL be shown separately in the winner's
My Auctions. The designer decides where and how pages show the external lot
status.

#### Scenario: grade10-site-auction-lot-status-SC-01 - A lot whose bidding has not started is Upcoming

- **GIVEN** a published lot whose scheduled start has not arrived
- **WHEN** Grade10 works out its external lot status
- **THEN** the status is Upcoming

#### Scenario: grade10-site-auction-lot-status-SC-02 - A lot open for bidding is Active

- **GIVEN** two lots open for bidding, one closing in a day and one closing in a
  minute
- **WHEN** Grade10 works out their external lot status
- **THEN** both are Active

#### Scenario: grade10-site-auction-lot-status-SC-03 - A lot in extended bidding is Active

- **GIVEN** a lot past its scheduled close and in extended bidding
- **WHEN** Grade10 works out its external lot status
- **THEN** the status is Active

#### Scenario: grade10-site-auction-lot-status-SC-04 - A lot with a winner is Ended whatever state its order is in

- **GIVEN** three lots with a winner, whose orders are awaiting payment, shipped
  and cancelled
- **WHEN** Grade10 works out their external lot status
- **THEN** all three are Ended

#### Scenario: grade10-site-auction-lot-status-SC-12 - A lot that ended with no winner is Ended

- **GIVEN** a published lot whose bidding ended with no winner
- **WHEN** Grade10 works out its external lot status
- **THEN** the status is Ended

#### Scenario: grade10-site-auction-lot-status-SC-05 - The winner sees their order status separately

- **GIVEN** a winner whose order is awaiting payment
- **WHEN** they open My Auctions
- **THEN** the lot's external lot status is Ended
- **AND** their order status is shown separately

### Requirement: Collectors never see hidden lots

A hidden lot is a lot whose internal lot status is Draft or Called off.
Collectors SHALL NOT see a hidden lot anywhere on the auction site:

- **Catalogue** — the lot SHALL NOT be listed, and catalogue search and filters
  SHALL NOT return it
- **Lot page** — the lot's address SHALL give the same 404 response as an
  address with no published lot, per `grade10-site/auction/listing-page`
- **Watchlist** — the lot SHALL NOT be listed

A collector who bid on a called-off lot SHALL still see it in My Auctions. When
that bid has a bid-time authorization, the row carries the note that its card
hold was released, per
`grade10-site/auction/account-record`. No other collector SHALL see it.

#### Scenario: grade10-site-auction-lot-status-SC-06 - A draft lot is not in the catalogue, but an unsold lot is

- **GIVEN** a draft lot, and a published lot whose bidding ended with no winner
- **WHEN** a collector opens the auction catalogue
- **THEN** the draft lot is not listed
- **AND** the unsold lot is listed as Ended

#### Scenario: grade10-site-auction-lot-status-SC-07 - A called-off lot is removed from the catalogue

- **GIVEN** a published lot that an operator then calls off
- **WHEN** a collector opens the auction catalogue
- **THEN** the lot is not listed

#### Scenario: grade10-site-auction-lot-status-SC-08 - A called-off lot is removed from the watchlist

- **GIVEN** a collector watching one lot that ends with no winner and one lot
  that is called off
- **WHEN** they open their watchlist
- **THEN** the called-off lot is not listed
- **AND** the unsold lot is listed as Ended

#### Scenario: grade10-site-auction-lot-status-SC-09 - A bidder still sees a called-off lot

- **GIVEN** a collector who bid on a lot that an operator then called off
- **WHEN** they open My Auctions
- **THEN** the lot is listed
- **AND** when the bid has a bid-time authorization, the row says that its card hold was released
- **AND** a collector who did not bid on the lot does not see it

### Requirement: Listing data includes the external lot status

The public listing data SHALL include the lot's external lot status: Upcoming,
Active or Ended. It SHALL NOT include hidden lots.

#### Scenario: grade10-site-auction-lot-status-SC-10 - Listing data includes the external lot status

- **WHEN** a customer application reads the public listing data for a lot open
  for bidding
- **THEN** the data includes the external lot status Active

#### Scenario: grade10-site-auction-lot-status-SC-11 - Listing data leaves out called-off lots

- **GIVEN** a lot whose bidding ended with no winner, and a lot that was called
  off
- **WHEN** a customer application reads the public listing data
- **THEN** the called-off lot is not included
- **AND** the unsold lot is included with the external lot status Ended
