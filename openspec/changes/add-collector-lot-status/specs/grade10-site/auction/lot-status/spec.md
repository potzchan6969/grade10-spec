## Purpose

The status a collector reads for an auction lot — Upcoming, Active, or Ended —
derived from the lot and never stored, and which lots no collector surface shows
at all. It fixes the statuses and their mapping; whether and where a screen shows
them is design's.

## Feature set

- Collector vocabulary
  - Three statuses: one small set of statuses every collector surface can use,
    apart from the operator's outcome list
  - Derived, never stored: read from the lot, so it cannot disagree with it
  - The lot, not the order: a winner's order status stays a separate fact
- Hidden lots
  - Never shown: a lot that never opened, ended unsold, or was called off is
    absent from every collector surface
  - Bidder exception: a bidder still reads a called-off lot in their own record,
    with their card hold
- Public contract
  - Status in the listing read: every surface reads the same status

## ADDED Requirements

### Requirement: A lot shows a collector one status

Every lot a collector can see SHALL carry exactly one collector status. Grade10
SHALL derive it from the lot and SHALL NOT store it.

| Collector status | The lot | Operator outcome, in `grade10-admin/auction/post-sale` |
| --- | --- | --- |
| Upcoming | Published, bidding has not opened | Scheduled |
| Active | Bidding open, until the lot closes, extended bidding included | Live |
| Ended | Bidding over with a winner, whatever the state of the winner's order | Every outcome after a winner |

A Draft, Unsold or Called off lot SHALL carry no collector status; it is hidden,
per "Hidden lots appear on no collector surface".

The collector status SHALL describe the lot, not a collector's standing and not
a winner's order. A winner's order status, per
`grade10-site/auction/order-status`, SHALL remain a separate fact on their own
record. Whether and where a surface shows the collector status is design's.

#### Scenario: grade10-site-auction-lot-status-SC-01 - A lot whose bidding has not opened is Upcoming

- **GIVEN** a published lot whose scheduled start has not arrived
- **WHEN** a collector's surface reads its status
- **THEN** its collector status is Upcoming

#### Scenario: grade10-site-auction-lot-status-SC-02 - A lot open for bidding is Active

- **GIVEN** a lot whose bidding is open, one with a day to its close and one
  with a minute
- **WHEN** a collector's surface reads their statuses
- **THEN** both are Active

#### Scenario: grade10-site-auction-lot-status-SC-03 - A lot in extended bidding is Active

- **GIVEN** a lot past its scheduled close and in extended bidding
- **WHEN** a collector's surface reads its status
- **THEN** its collector status is Active

#### Scenario: grade10-site-auction-lot-status-SC-04 - A won lot is Ended whatever its order's state

- **GIVEN** three won lots, whose orders are awaiting payment, shipped, and
  cancelled
- **WHEN** a collector's surface reads their statuses
- **THEN** all three are Ended

#### Scenario: grade10-site-auction-lot-status-SC-05 - A winner reads their order apart from the lot

- **GIVEN** a winner whose order is awaiting payment
- **WHEN** they open their own record
- **THEN** the lot's collector status is Ended
- **AND** their order status is shown as its own fact

### Requirement: Hidden lots appear on no collector surface

A lot that is Draft, closed with no winner, or called off SHALL NOT appear on
any collector surface: not in the catalogue, its search or its filters; not at
its own address, which SHALL answer as `grade10-site/auction/listing-page`
answers an address naming no published lot; and not on the watched list.

A collector who placed a bid on a called-off lot SHALL still read that lot in
their own record, with what happened to their card hold, per
`grade10-site/auction/account-record`. No other collector SHALL.

#### Scenario: grade10-site-auction-lot-status-SC-06 - A draft or unsold lot is not in the catalogue

- **GIVEN** a draft lot and a lot that closed with no winner
- **WHEN** a collector reads the auction catalogue
- **THEN** neither lot is listed

#### Scenario: grade10-site-auction-lot-status-SC-07 - A called-off lot leaves the catalogue

- **GIVEN** a published lot that an operator then calls off
- **WHEN** a collector reads the auction catalogue
- **THEN** that lot is not listed

#### Scenario: grade10-site-auction-lot-status-SC-08 - A hidden lot leaves the watched list

- **GIVEN** a collector watching one lot that closes with no winner and one that
  is called off
- **WHEN** they read the lots they watch
- **THEN** neither lot is listed

#### Scenario: grade10-site-auction-lot-status-SC-09 - A bidder still reads a called-off lot

- **GIVEN** a collector who bid on a lot that an operator then called off
- **WHEN** they open their own record
- **THEN** that lot is listed with what happened to their card hold
- **AND** a collector who did not bid on it does not see it

### Requirement: The listing read carries the collector status

A public listing read SHALL carry the lot's collector status as one of
Upcoming, Active, or Ended. It SHALL NOT return a hidden lot.

#### Scenario: grade10-site-auction-lot-status-SC-10 - A consumer reads the collector status

- **WHEN** a customer application reads a public listing for an open lot
- **THEN** it carries the collector status Active
- **AND** the status is one of Upcoming, Active, or Ended

#### Scenario: grade10-site-auction-lot-status-SC-11 - A listing read returns no hidden lot

- **GIVEN** a lot that closed with no winner and one that was called off
- **WHEN** a customer application reads the public listings
- **THEN** neither lot is returned
