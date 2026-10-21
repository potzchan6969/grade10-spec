# grade10-site/auction/account-record Specification

## MODIFIED Requirements

### Requirement: The Bidding page groups by what is still owed

After close, a listing the collector bid on SHALL carry exactly one of **Won**
or **Didn't win** in Status on My Auctions, read from the recorded result and
never from the page's own clock. Its price SHALL be the listing's final price,
the same on every bidder's row. My Auctions SHALL NOT
present separate Active, Won, and Didn't win section groups. The durable
Bidding History index remains the source for listing-level history and its
Active/Completed filtering.

<!-- trace:scenario id=g10.auction-account-record.SC-44t rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-18 - A won listing sits under Won
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a closed listing whose winner is the collector
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Won

<!-- trace:scenario id=g10.auction-account-record.SC-5y1 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-19 - A listing lost at close sits under Didn't win
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a closed listing the collector bid on whose winner is someone else
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Didn't win

<!-- trace:scenario id=g10.auction-account-record.SC-b5w rev=2 -->
#### Scenario: grade10-site-auction-account-record-SC-66 - Every bidder's row shows the final price
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** a listing that closed with a winning bid of 150000 USD minor units,
  on which the collector's own last bid was 120000 USD minor units
- **WHEN** they open My Auctions
- **THEN** that row reads Didn't win with a price of 150000 USD minor units
- **AND** the winner's row on their own My Auctions shows 150000 USD minor
  units

<!-- trace:scenario id=g10.auction-account-record.SC-fkr rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-67 - A result appears only once the close is recorded
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** a collector leading a listing whose effective close has passed
- **WHEN** the close is recorded with them as the winner
- **THEN** their row reads Won from then on, and did not read Won or Didn't
  win before it

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
recorded SHALL keep its open Status, SHALL stay an open row, and SHALL
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

<!-- trace:scenario id=g10.auction-account-record.SC-n1y rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-69 - A leader whose raise is refused stays Leading
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing on which the collector holds the highest valid bid
- **WHEN** Grade10 refuses their raise
- **AND** they open My Auctions
- **THEN** that listing's Status is Leading
- **AND** the refused raise has not moved the row's price

<!-- trace:scenario id=g10.auction-account-record.SC-8te rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-70 - A refused first bid adds no row
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing the collector has neither watched nor bid on
- **WHEN** their first bid on it is refused
- **AND** they open My Auctions
- **THEN** no row for that listing appears in the list

<!-- trace:scenario id=g10.auction-account-record.SC-dsc rev=2 -->
#### Scenario: grade10-site-auction-account-record-SC-71 - An outbid collector whose raise is refused stays Outbid
**Serves:** grade10-site-auction-account-record-US-02 - a refused raise leaves the collector reading the standing they had

- **GIVEN** an open `USD` listing on which the collector is Outbid with a
  maximum of 25000 USD minor units, at a current bid of 30000 USD minor units
  and a minimum next bid of 30500 USD minor units
- **WHEN** they raise their maximum to 30300 USD minor units, and Grade10
  refuses it as below the minimum
- **AND** they open My Auctions
- **THEN** that listing's Status is Outbid
- **AND** the row's price is still 30000 USD minor units

<!-- trace:scenario id=g10.auction-account-record.SC-fao rev=2 -->
#### Scenario: grade10-site-auction-account-record-SC-64 - An outbid row shows the auction's price
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** an open listing on which the collector bid 100000 USD minor units
  and the current bid is 120000 USD minor units
- **WHEN** they open My Auctions
- **THEN** that row's price is 120000 USD minor units

<!-- trace:scenario id=g10.auction-account-record.SC-abi rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-65 - A lot past its close keeps its standing until the close is recorded
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** a listing past its effective close, whose close is not yet
  recorded, on which the collector holds the highest valid bid
- **WHEN** they open My Auctions
- **THEN** that row has Status Leading and no minimum
  next valid bid
- **AND** it reads neither Won nor Didn't win
