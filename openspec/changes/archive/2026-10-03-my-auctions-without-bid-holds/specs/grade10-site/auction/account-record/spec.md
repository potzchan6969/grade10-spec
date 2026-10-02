# grade10-site/auction/account-record Specification

## Feature set

- **After a close**
  - Losing bidder's card hold: none is taken, so the row says the card was not
    charged and a lost listing is not read as a charge.
- **The Bidding page**
  - Standing while open: says whether the collector still leads, and what the
    next valid bid must clear when they do not; a refused attempt moves
    nothing.

## MODIFIED Requirements

### Requirement: A bid bookmarks the listing on My Auctions

When a signed-in collector places a bid Grade10 accepts on a listing, Grade10
SHALL enroll that listing on My Auctions as a bookmark if it is not already
there. The collector SHALL NOT need a separate Watch for that listing to
appear.

<!-- trace:scenario id=g10.auction-account-record.SC-7on rev=2 -->
#### Scenario: grade10-site-auction-account-record-SC-42 - A first bid enrolls My Auctions
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a signed-in collector who does not watch a listing
- **WHEN** they place a bid on it that Grade10 accepts
- **THEN** that listing is on My Auctions
- **AND** Status reflects their bid standing

## RENAMED Requirements

- FROM: `### Requirement: A bidder's standing while a listing is open`
- TO: `### Requirement: An open listing reads Leading or Outbid`
- FROM: `### Requirement: A losing bidder is told what happened to their card hold`
- TO: `### Requirement: A losing bidder reads that their card was not charged`

### Requirement: An open listing reads Leading or Outbid

A My Auctions row for a listing the collector has bid on SHALL be an
account-facing summary. The detailed index, private action log, and listing
chronology SHALL follow the `grade10-site/auction/bidding-history` contract;
this capability SHALL NOT create a second bidding history or event log.

A listing on My Auctions whose bidding window is open and on which the
collector has bid SHALL carry exactly one of these values in Status.

| State | When |
| --- | --- |
| Leading | The collector's bid is the highest valid bid |
| Outbid | A higher valid bid stands. Carries the minimum next valid bid |

A refused attempt SHALL NOT be a bid. It SHALL add no row to My Auctions and
SHALL move no row's Status: a leader whose raise is refused stays Leading, and
an outbid collector whose raise is refused stays Outbid. The refusal SHALL NOT
appear on My Auctions; the bid panel shows it.

Status SHALL NOT use Ending soon, Scheduled, Live, or Active. Close
urgency SHALL appear with the listing identity.

The row's price SHALL be the auction's current bid on that listing, never the
collector's own bid. A listing past its effective close whose close is not yet
recorded SHALL keep its open Status, SHALL stay in the Active tab, and SHALL
carry no minimum next valid bid.

Every amount SHALL be an integer count of minor units with an ISO 4217 currency
code.

<!-- trace:scenario id=g10.auction-account-record.SC-2h8 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-14 - The highest bidder is Leading
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing on which the collector holds the highest valid bid
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Leading

<!-- trace:scenario id=g10.auction-account-record.SC-ana rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-15 - Outbid carries the minimum next bid
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing on which a higher valid bid than the collector's
  stands
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Outbid
- **AND** the row carries the minimum next valid bid as an integer count of
  minor units with its ISO 4217 currency code

#### Scenario: grade10-site-auction-account-record-SC-69 - A leader whose raise is refused stays Leading
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing on which the collector holds the highest valid bid
- **WHEN** Grade10 refuses their raise
- **AND** they open My Auctions
- **THEN** that listing's Status is Leading
- **AND** the refused raise has not moved the row's price

#### Scenario: grade10-site-auction-account-record-SC-70 - A refused first bid adds no row
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing the collector has neither watched nor bid on
- **WHEN** their first bid on it is refused
- **AND** they open My Auctions
- **THEN** no row for that listing appears in any tab

#### Scenario: grade10-site-auction-account-record-SC-64 - An outbid row shows the auction's price
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** an open listing on which the collector bid 100000 HKD minor units
  and the current bid is 120000 HKD minor units
- **WHEN** they open My Auctions
- **THEN** that row's price is 120000 HKD minor units

#### Scenario: grade10-site-auction-account-record-SC-65 - A lot past its close keeps its standing until the close is recorded
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** a listing past its effective close, whose close is not yet
  recorded, on which the collector holds the highest valid bid
- **WHEN** they open My Auctions
- **THEN** that row is in the Active tab with Status Leading and no minimum
  next valid bid
- **AND** it reads neither Won nor Didn't win

### Requirement: A losing bidder reads that their card was not charged

A listing whose Status is Didn't win SHALL say that the collector's card was
not charged. A listing the collector bid on that was called off SHALL appear
with Didn't win standing carrying the same statement, while the listing
remains published. A Won listing SHALL NOT carry it.

#### Scenario: grade10-site-auction-account-record-SC-68 - A lot lost at the close says the card was not charged
**Serves:** grade10-site-auction-account-record-US-04 - Losing bidder knows they were not charged

- **GIVEN** a closed listing the collector bid on and did not win
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Didn't win
- **AND** the row says their card was not charged

<!-- trace:scenario id=g10.auction-account-record.SC-2e8 rev=2 -->
#### Scenario: grade10-site-auction-account-record-SC-27 - A called-off listing says the card was not charged
**Serves:** grade10-site-auction-account-record-US-04 - Losing bidder knows they were not charged

- **GIVEN** a listing the collector bid on that Grade10 called off and still
  publishes
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Didn't win
- **AND** the row says their card was not charged
