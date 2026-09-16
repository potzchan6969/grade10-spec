## Feature set

- Catalogue
  - Resting order: Active lots by soonest close, then Upcoming by soonest
    start, then Ended by most recent close
  - Total order: two lots that would tie are settled on the lot record, so the
    order holds whole or a page at a time

## ADDED Requirements

### Requirement: The catalogue has one resting order

The Auction catalogue SHALL list the lots a collector can see by their external
lot status, in the order this table reads, as `grade10-site/auction/lot-status`
defines those statuses:

| External lot status | Ordered by |
| --- | --- |
| **Active** | Soonest close first |
| **Upcoming** | Soonest start first |
| **Ended** | Most recent close first |

Two lots one status orders alike SHALL be ordered by their lot record, so the
catalogue's order is total. The order SHALL be the one the catalogue answers
with, not one applied to the lots already read: reading the catalogue a page at
a time SHALL list the lots in the same order as reading it whole, and SHALL
list no lot twice and skip none.

A collector MAY ask for another order the catalogue can answer; it replaces the
resting order and is settled on the lot record the same way.

#### Scenario: grade10-site-auction-auction-SC-25 - Open lots lead the catalogue
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** lots of all three statuses, among them an Ended lot that closed
  before an Active lot closes
- **WHEN** a collector opens the Auction catalogue
- **THEN** every Active lot is listed before every Upcoming lot
- **AND** every Upcoming lot is listed before every Ended lot

#### Scenario: grade10-site-auction-auction-SC-26 - Each status has its own order
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** two Active lots closing an hour apart, two Upcoming lots starting a
  day apart, and two Ended lots closed a week apart
- **WHEN** a collector opens the Auction catalogue
- **THEN** the Active lots are listed soonest close first
- **AND** the Upcoming lots are listed soonest start first
- **AND** the Ended lots are listed most recent close first

#### Scenario: grade10-site-auction-auction-SC-27 - A tie is settled the same way every read
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** two lots of one status that its order cannot tell apart
- **WHEN** the catalogue is read twice
- **THEN** the two lots are in the same order both times

#### Scenario: grade10-site-auction-auction-SC-28 - Paging does not change the order
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** a catalogue holding more lots than one page lists
- **WHEN** it is read a page at a time to the end
- **THEN** the lots are in the same order as reading the catalogue whole
- **AND** no lot is listed twice and none is missing
