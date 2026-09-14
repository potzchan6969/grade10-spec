## Feature set

- Catalogue
  - Resting order: open lots by soonest close, then lots not yet open by
    soonest start, then ended lots by most recent close
  - Total order: two lots that would tie are settled on the lot record, so the
    order holds whole or a page at a time

## ADDED Requirements

### Requirement: The catalogue has one resting order

The Auction catalogue SHALL order the lots a collector can see by their
external lot status, as `grade10-site/auction/lot-status` defines it:

| Band | Lots | Ordered by |
| --- | --- | --- |
| 1 | Active | Soonest close first |
| 2 | Upcoming | Soonest start first |
| 3 | Ended | Most recent close first |

Two lots a band orders alike SHALL be ordered by their lot record, so the
catalogue's order is total. The order SHALL be the one the catalogue answers
with, not one applied to the lots already read: reading the catalogue a page at
a time SHALL list the lots in the same order as reading it whole, and SHALL
list no lot twice and skip none.

A collector MAY ask for another order the catalogue can answer; it replaces the
resting order and is settled on the lot record the same way.

#### Scenario: grade10-site-auction-auction-SC-19 - Open lots lead the catalogue

- **GIVEN** lots in all three bands, among them an Ended lot that closed before
  an Active lot closes
- **WHEN** a collector opens the Auction catalogue
- **THEN** every Active lot is listed before every Upcoming lot
- **AND** every Upcoming lot is listed before every Ended lot

#### Scenario: grade10-site-auction-auction-SC-20 - Each band has its own order

- **GIVEN** two Active lots closing an hour apart, two Upcoming lots starting a
  day apart, and two Ended lots closed a week apart
- **WHEN** a collector opens the Auction catalogue
- **THEN** the Active lots are listed soonest close first
- **AND** the Upcoming lots are listed soonest start first
- **AND** the Ended lots are listed most recent close first

#### Scenario: grade10-site-auction-auction-SC-21 - A tie is settled the same way every read

- **GIVEN** two lots in one band that the band's order cannot tell apart
- **WHEN** the catalogue is read twice
- **THEN** the two lots are in the same order both times

#### Scenario: grade10-site-auction-auction-SC-22 - Paging does not change the order

- **GIVEN** a catalogue holding more lots than one page lists
- **WHEN** it is read a page at a time to the end
- **THEN** the lots are in the same order as reading the catalogue whole
- **AND** no lot is listed twice and none is missing
