# grade10-site/auction/account-record Specification

## Feature set

- **After a close**
  - Losing bidder's card hold: none is taken, so the row says the card was not
    charged and a lost listing is not read as a charge.
- **The Bidding page**
  - Standing while open: says whether the collector still leads, and what the
    next valid bid must clear when they do not; a refused attempt adds no row
    and moves no Status, so a leader stays Leading and an outbid collector
    stays Outbid.

## MODIFIED Requirements

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
SHALL change no row's Status or price: a leader whose raise is refused stays
Leading, and an outbid collector whose raise is refused stays Outbid. The
refusal SHALL NOT appear on My Auctions; the bid form shows it.

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

#### Scenario: grade10-site-auction-account-record-SC-71 - An outbid collector whose raise is refused stays Outbid
**Serves:** grade10-site-auction-account-record-US-02 - a refused raise leaves the collector reading the standing they had

- **GIVEN** an open listing on which the collector is Outbid at a current bid
  of 30000 HKD minor units
- **WHEN** Grade10 refuses their raise to 20000 HKD minor units
- **AND** they open My Auctions
- **THEN** that listing's Status is Outbid
- **AND** the row's price is still 30000 HKD minor units

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
