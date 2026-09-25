## Feature set

- Featured catalogue band
  - Dedicated Featured read: `/auction` loads Featured from its own public answer, separate from All auctions
  - Operator slides: when at least one complete slot is set, `/auction` leads with a full-width carousel of those slides in operator order
  - Slide facts: each slide shows the slot's front page image as banner and slab, lot title, status, client countdown from served close or open, and current bid with a rolling number when the amount changes
  - Bid Now: opens that featured lot's page
  - Progress: dots advance among two or three slides; a single slide needs no multi-dot advance
- Quiet catalogue
  - Featured then All auctions: the only sections on `/auction` in this layout; Featured is absent when no complete slot is set
  - No category section: no Categories heading, tiles, or busy filter chrome
  - Resting All auctions: every visible lot including featured ones, in the catalogue resting order below Featured when Featured is present
- Catalogue watch
  - Shared watch on cards: All auctions cards use the same watch as the lot page and My Auctions; closed lots show none

## ADDED Requirements

### Requirement: Featured leads the catalogue when complete slides are set

`/auction` SHALL open with a Featured band when at least one complete slide is
available, and SHALL omit that band when none are. Featured SHALL be loaded
from its own public read, separate from the All auctions catalogue page.

**Complete slide** — a Featured slot that holds both an eligible lot and its
front page image, and whose lot is published Active or Upcoming at read time
**Order** — slides appear in the operator's slot order
**Absent** — with no complete slide, the page has no Featured band

#### Scenario: grade10-site-auction-auction-SC-43 - Featured appears when a complete slide is set
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** at least one complete Featured slot with a published Active or
  Upcoming lot and its front page image
- **WHEN** a collector opens `/auction`
- **THEN** the page leads with Featured in operator order


#### Scenario: grade10-site-auction-auction-SC-57 - Featured loads from its own public read
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** at least one complete Featured slide
- **WHEN** a collector opens `/auction`
- **THEN** Featured is answered by the dedicated Featured public read
- **AND** that answer includes each slide's front page image and the banner lot facts

#### Scenario: grade10-site-auction-auction-SC-30 - Featured is absent when no complete slide is set
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** every Featured slot is empty or incomplete, or every filled slot's
  lot is no longer published Active or Upcoming
- **WHEN** a collector opens `/auction`
- **THEN** the page shows no Featured band
- **AND** All auctions is the first catalogue section

### Requirement: Each Featured slide shows the curated lot facts

Each Featured slide SHALL show the facts in this table. Money amounts SHALL be
an integer count of minor units paired with an ISO 4217 currency code. The
slide MAY compose `FeaturedAuctionsBanner` with `ListingRollingMoneyDisplay`
and `ListingCountdownDisplay`.

| Fact | Shows |
| --- | --- |
| Front page image | The slot's uploaded image as banner background and lot slab |
| Title | The lot's title |
| Status | The lot's external status |
| Countdown | Client countdown from the served close (Active) or open (Upcoming) |
| Current bid | The served current bid; a rolling number when that amount changes |

#### Scenario: grade10-site-auction-auction-SC-31 - A Featured slide shows front page image, title, status, countdown and bid
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** a complete Featured slide for a published Active lot with a served
  close and a current bid in minor units and ISO currency
- **WHEN** a collector views that slide on `/auction`
- **THEN** the slide shows the slot front page image as banner and slab, the lot title, its
  status, a client countdown from the served close, and the current bid as
  minor units with that currency code

#### Scenario: grade10-site-auction-auction-SC-32 - The current bid rolls when the served amount changes
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** a Featured slide whose served current bid changes while the
  collector is on `/auction`
- **WHEN** the new amount is shown
- **THEN** the current bid updates with a rolling number to the new minor-unit
  amount and currency code

#### Scenario: grade10-site-auction-auction-SC-33 - An Upcoming Featured slide counts down to open
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** a complete Featured slide for a published Upcoming lot with a
  served open time
- **WHEN** a collector views that slide
- **THEN** the countdown runs from the served open

### Requirement: Bid Now opens the featured lot

Each Featured slide SHALL offer Bid Now. Activating it SHALL open that featured
lot's page.

#### Scenario: grade10-site-auction-auction-SC-34 - Bid Now opens the featured lot's page
**Serves:** grade10-site-auction-auction-US-08 - Collector opens a Featured lot to bid

- **GIVEN** a Featured slide for a lot
- **WHEN** the collector activates Bid Now
- **THEN** that lot's page opens

### Requirement: Progress advances among two or three Featured slides

When Featured holds two or three complete slides, `/auction` SHALL show
progress that advances among them. A single complete slide SHALL NOT require
multi-dot advance. Progress MAY use `CarouselProgress`.

#### Scenario: grade10-site-auction-auction-SC-35 - Progress advances among two or three slides
**Serves:** grade10-site-auction-auction-US-07 - Collector advances Featured slides

- **GIVEN** two or three complete Featured slides on `/auction`
- **WHEN** the collector advances with the progress control
- **THEN** each curated slide becomes visible in turn without leaving Featured

#### Scenario: grade10-site-auction-auction-SC-36 - One Featured slide needs no multi-dot advance
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** exactly one complete Featured slide
- **WHEN** a collector views Featured
- **THEN** that slide is shown
- **AND** multi-dot advance among slides is not required

### Requirement: The catalogue layout is Featured then All auctions only

On `/auction` in this layout, the only catalogue sections SHALL be Featured
(when present) and All auctions. The page SHALL NOT show a Categories heading,
category tiles, or busy filter chrome.

#### Scenario: grade10-site-auction-auction-SC-37 - The quiet layout has no category section
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** a collector opens `/auction` with or without Featured
- **WHEN** the page is shown
- **THEN** there is no Categories heading, no category tiles, and no busy
  filter chrome
- **AND** the only catalogue sections are Featured when present and All
  auctions


#### Scenario: grade10-site-auction-auction-SC-42 - The catalogue address stays /auction without a category query
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** a collector opens the Auction catalogue from the Auction nav
- **WHEN** the page is shown
- **THEN** the address is `/auction` with no category query

### Requirement: All auctions cards use the shared watch

Each All auctions card that may be watched SHALL offer the same watch as the
lot page and My Auctions. A closed lot's card SHALL show no watch. The card MAY
compose `AuctionCard` with `WatchButton`.

#### Scenario: grade10-site-auction-auction-SC-38 - A signed-in collector watches from an All auctions card
**Serves:** grade10-site-auction-auction-US-09 - Collector watches from an All auctions card

- **GIVEN** a signed-in collector reading an open lot on All auctions
- **WHEN** they toggle watch on that card
- **THEN** the lot is watched or unwatched the same way as on the lot page and
  My Auctions

#### Scenario: grade10-site-auction-auction-SC-39 - A closed lot's card shows no watch
**Serves:** grade10-site-auction-auction-US-09 - Collector watches from an All auctions card

- **GIVEN** an Ended lot on All auctions
- **WHEN** a collector reads its card
- **THEN** the card shows no watch control


#### Scenario: grade10-site-auction-auction-SC-41 - Featured remains when All auctions is empty
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** at least one complete Featured slide and no lots in All auctions
- **WHEN** a collector opens `/auction`
- **THEN** Featured is shown
- **AND** All auctions shows that there are no auctions

## MODIFIED Requirements

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

**All auctions** — every visible lot, including lots that also appear in
Featured, in that resting order. When Featured is present, All auctions SHALL
sit below it.

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

#### Scenario: grade10-site-auction-auction-SC-40 - Featured lots still appear in All auctions below Featured
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** at least one complete Featured slide and that lot also among the
  visible catalogue lots
- **WHEN** a collector opens `/auction`
- **THEN** All auctions sits below Featured
- **AND** the featured lot appears again in All auctions in the resting order
