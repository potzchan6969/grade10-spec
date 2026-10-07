# grade10-site/auction/auction Specification

## Feature set

- Closing a lot the house leads
  - Reads sold: the public facts read sold at the current bid, to the house's pseudonym
  - No order: the close creates no winner order and charges nobody

## MODIFIED Requirements

### Requirement: Auction listing facts are available

Grade10 SHALL publish a catalogue of Auction listings. It SHALL NOT publish or
represent Auction Buy Now listings in this capability.

Auction listings SHALL be absolute: when a listing closes with accepted bids,
the highest accepted bid wins, and that bid may be the house's, placed for an
internal bid under `grade10-admin/auction/internal-bid`. Grade10 SHALL NOT
configure, store, return, or evaluate a reserve amount, reserve state, or
reserve-based no-sale outcome. An internal bid is a house maximum, not a
reserve: no public fact names it, and a lot the house wins closes as
"A lot the house leads at its close is bought in" sets out.

All money facts SHALL be an integer count of minor units paired with an ISO
4217 currency code. A listing's applicable fee, currency, region, and deadline
terms SHALL be an immutable snapshot of the operational policy effective when
the listing becomes available for bidding.

<!-- trace:scenario id=g10.auction-auction.SC-ian rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-01 - A collector browses Auction listings
**Serves:** grade10-site-auction-auction-US-01 - Collector browses Auction listings

- **GIVEN** published Auction listings in Pokémon, MTG, and basketball-card categories
- **WHEN** a collector opens the Auction catalogue
- **THEN** Grade10 returns those Auction listings grouped or identifiable by category
- **AND** it returns no Buy Now listing or purchasable stock count

<!-- trace:scenario id=g10.auction-auction.SC-fec rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-02 - A closed listing is absolute
**Serves:** grade10-site-auction-auction-US-01 - Collector browses Auction listings

- **GIVEN** a listing closes with an accepted highest bid
- **WHEN** Grade10 determines its outcome
- **THEN** that highest accepted bidder wins the listing
- **AND** no reserve condition changes the outcome

<!-- trace:scenario id=g10.auction-auction.SC-djb rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-03 - Money facts use minor units and currency
**Serves:** grade10-site-auction-auction-US-01 - Collector browses Auction listings

- **GIVEN** an Auction listing with a starting price and buyer fee
- **WHEN** Grade10 returns its listing or checkout facts
- **THEN** every monetary amount is an integer minor-unit value and an ISO 4217 currency code
- **AND** no browser-supplied monetary value determines an accepted bid or payable total

## ADDED Requirements

### Requirement: A lot the house leads at its close is bought in

When a listing's leading bid at its effective close is the house's, Grade10
SHALL close it **bought in**:

| Reader | What the close reads as |
| --- | --- |
| A collector, and every public listing fact | Ended, sold at the current bid to the house's listing pseudonym, as any sold lot reads |
| Grade10's records | No winner order, no invoice and no charge to anyone; the stock is released per `grade10-admin/auction/listing` |

Everything else about the close SHALL be as "A due lot is settled at its
close" sets out: the same deadline, the same settlers, and settling twice
changing nothing. The letters the close owes are
`grade10-site/auction/notifications`'s.

<!-- trace:scenario id=g10.auction-auction.SC-a4f rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-103 - A lot the house wins reads sold
**Serves:** `Closing a lot the house leads` - a collector reads a closed lot the house won

- **GIVEN** an `HKD` listing where the house, shown as Bidder 2, leads at
  31000 HKD minor units over collector A, shown as Bidder 1
- **WHEN** the listing closes and a collector reads it
- **THEN** it reads Ended, sold at 31000 HKD minor units
- **AND** the public history marks Bidder 2's bid at 31000 as the winning bid

<!-- trace:scenario id=g10.auction-auction.SC-6am rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-104 - A lot the house wins creates no order
**Serves:** `Closing a lot the house leads` - the settle finds the house on top

- **GIVEN** the listing of `grade10-site-auction-auction-SC-103`
- **WHEN** it closes
- **THEN** Grade10 creates no winner order and no invoice for it
- **AND** nothing is charged to any bidder's card

<!-- trace:scenario id=g10.auction-auction.SC-wqr rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-105 - Settling a house win twice still creates no order
**Serves:** `Closing a lot the house leads` - the timer and a read reach the close together

- **GIVEN** an `HKD` listing past its effective close with the house leading
- **WHEN** its timer and a read settle it at the same moment
- **THEN** it is closed once, sold at its current bid to the house's
  pseudonym, with no winner order

<!-- trace:scenario id=g10.auction-auction.SC-cqt rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-106 - A lot only the house bid on closes sold at the opening price
**Serves:** `Closing a lot the house leads` - the house's lone bid ends a lot as any lone bid does

- **GIVEN** an open `HKD` listing with extended bidding on, a starting price
  of 20000 HKD minor units, and one bid: the house's at 20000, committed
  before its scheduled close
- **WHEN** the scheduled close arrives and extended bidding ends with no other
  bid
- **THEN** a collector reads it Ended, sold at 20000 HKD minor units
- **AND** Grade10 closes it bought in, with no winner order
