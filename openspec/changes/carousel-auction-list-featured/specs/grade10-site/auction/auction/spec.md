## Feature set

- Featured catalogue band
  - Dedicated Featured read: `/auction` loads Featured from its own public answer, separate from All auctions
  - Operator slides: when at least one complete slot is set, `/auction` leads with a full-width carousel of those slides in operator order
  - Slide facts: each slide shows the slot's front page image as banner and slab (load failure falls back to the lot's first gallery image, else the stage default background), lot title, status chrome by lot status, relative Ends in / Opens in from served close or open, and money on Active only (current bid rolls when the amount increases after first paint; Upcoming shows no money until the lot opens)
  - Open lot: Bid Now on Active or View Auction on Upcoming opens that lot's details page
  - Progress: dots advance among two or three slides; on a small viewport stage previous/next and swipe also advance; a single slide needs no multi-dot advance or stage previous/next
- Quiet catalogue
  - Featured then All auctions: the only sections on `/auction` in this layout; Featured is absent when no complete slot is set
  - No category section: no Categories heading, tiles, or busy filter chrome
  - Resting All auctions: every visible lot including featured ones, in the catalogue resting order below Featured when Featured is present
  - All auctions load more: infinite scroll appends the next batch; Boneyard skeleton cards while that batch settles; no pagination
  - Upcoming cards hide money: an Upcoming All auctions card shows no starting bid until the lot is Active
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
| Front page image | The slot's uploaded image as banner background and lot slab; if it fails to load, the lot's first gallery image, else the stage default background |
| Title | The lot's title |
| Status | Active: LIVE BIDDING with a live status dot. Upcoming: UPCOMING with no live status dot |
| Countdown | Relative **Ends in** (Active) or **Opens in** (Upcoming) with the All auctions short remaining form; no Extended label; recorded close moves with the same freshness as the live current bid |
| Money | Active: served current bid; rolls when that amount **increases** after first paint. Upcoming: no money until the lot opens |
| Open lot | Active: Bid Now. Upcoming: View Auction. Either opens that lot's details page |

#### Scenario: grade10-site-auction-auction-SC-31 - A Featured slide shows front page image, title, status, countdown and bid
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** a complete Featured slide for a published Active lot with a served
  close and a current bid in minor units and ISO currency
- **WHEN** a collector views that slide on `/auction`
- **THEN** the slide shows the slot front page image as banner and slab, the lot title,
  LIVE BIDDING with a live status dot, relative Ends in from the served close,
  and the current bid as minor units with that currency code

#### Scenario: grade10-site-auction-auction-SC-32 - The current bid rolls when the served amount increases
**Serves:** grade10-site-auction-auction-US-10 - Collector sees a live Featured bid and clock

- **GIVEN** an Active Featured slide whose served current bid **increases** after
  first paint while the collector is on `/auction`
- **WHEN** the new amount is shown
- **THEN** the current bid updates with a rolling number to the new minor-unit
  amount and currency code

#### Scenario: grade10-site-auction-auction-SC-33 - An Upcoming Featured slide counts down to open
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** a complete Featured slide for a published Upcoming lot with a
  served open time
- **WHEN** a collector views that slide
- **THEN** the slide shows UPCOMING with no live status dot, View Auction, and
  Opens in from the served open
- **AND** the slide shows no starting bid and no money amount

### Requirement: Bid Now or View Auction opens the lot details page

An Active Featured slide SHALL offer Bid Now. An Upcoming Featured slide SHALL
offer View Auction. Activating either SHALL open that lot's details page.

#### Scenario: grade10-site-auction-auction-SC-34 - Bid Now opens an Active lot's details page
**Serves:** grade10-site-auction-auction-US-08 - Collector opens a Featured lot

- **GIVEN** an Active Featured slide
- **WHEN** the collector activates Bid Now
- **THEN** that lot's details page opens

#### Scenario: grade10-site-auction-auction-SC-58 - View Auction opens an Upcoming lot's details page
**Serves:** grade10-site-auction-auction-US-08 - Collector opens a Featured lot

- **GIVEN** an Upcoming Featured slide
- **WHEN** the collector activates View Auction
- **THEN** that lot's details page opens

### Requirement: Progress advances among two or three Featured slides

When Featured holds two or three complete slides, `/auction` SHALL show
progress that advances among them. On a small viewport the stage SHALL also
offer previous/next and horizontal swipe to advance among those slides. A
single complete slide SHALL NOT require multi-dot advance or stage previous/next.
Progress MAY use `CarouselProgress`.

#### Scenario: grade10-site-auction-auction-SC-35 - Progress advances among two or three slides
**Serves:** grade10-site-auction-auction-US-07 - Collector advances Featured slides

- **GIVEN** two or three complete Featured slides on `/auction`
- **WHEN** the collector advances with the progress control, or on a small
  viewport with stage previous/next or a horizontal swipe
- **THEN** each curated slide becomes visible in turn without leaving Featured

#### Scenario: grade10-site-auction-auction-SC-36 - One Featured slide needs no multi-dot advance
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** exactly one complete Featured slide
- **WHEN** a collector views Featured
- **THEN** that slide is shown
- **AND** multi-dot advance among slides is not required
- **AND** stage previous/next is not required

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

### Requirement: All auctions loads more as the collector scrolls

All auctions SHALL NOT show pagination controls. When more lots remain than the
list has shown, scrolling near the end of All auctions SHALL load the next
batch. While that batch is loading, All auctions SHALL append Boneyard skeleton
cards below the lots already shown and SHALL keep those lots visible. When no
further lots remain, no load trigger SHALL appear.

#### Scenario: grade10-site-auction-auction-SC-59 - More All auctions lots load on scroll
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** All auctions holds more lots than the first batch shows
- **WHEN** the collector scrolls near the end of the shown lots
- **THEN** the next batch of lots is loaded
- **AND** lots already shown stay visible
- **AND** the combined list stays in the catalogue resting order

#### Scenario: grade10-site-auction-auction-SC-60 - Loading more shows skeleton cards
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** All auctions is loading the next batch
- **WHEN** the collector reads the list
- **THEN** Boneyard skeleton cards appear below the lots already shown
- **AND** those lots remain visible above the skeletons

### Requirement: Upcoming catalogue cards withhold money until open

An Upcoming lot on Featured or on an All auctions card SHALL NOT show a starting
bid or other money amount. Money SHALL appear once the lot is Active (Featured
current bid; All auctions current bid).

#### Scenario: grade10-site-auction-auction-SC-61 - An Upcoming All auctions card shows no money
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** an Upcoming lot on All auctions
- **WHEN** a collector reads its card
- **THEN** the card shows no starting bid and no money amount
- **AND** the card still shows Opens in from the served open

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
