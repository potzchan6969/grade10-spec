## Feature set

- **Watching a listing**
  - Watch and unwatch: lets a collector mark interest before they are ready to
    bid, from wherever the listing is shown.
  - Private by default: a watch says nothing to anyone but its owner, so
    marking interest costs nothing.
  - Watch limit: keeps the list a considered one and the read bounded.
- **The Watching page**
  - Four listing states: answers whether a listing is open and how soon it
    closes, and refuses to answer more than that.
  - Ordering and the bid marker: puts the next close first and hands a listing
    the collector already bid on over to the Bidding page.
- **The Bidding page**
  - Tab boundary: provides the account entry point and account-level groups;
    the detailed index, filters, and listing story come from
    `grade10-site/auction/bidding-history`.
  - Standing while open: says whether the collector still leads, and what the
    next valid bid must clear when they do not.
  - Auction's price: a bidding row shows the auction's current price, or its
    final price once it closes, never the collector's own bid.
  - Three groups: separates the listings that still need the collector from
    the ones that are finished.
- **After a close**
  - Result from the record: Your Standing reads Won or Didn't win from the
    recorded result, never from the page's own clock.
  - Overdue Status: a won lot whose setup or payment window has passed reads
    Setup Overdue or Payment Overdue
  - Payment Verifying: a won lot whose payment proof waits for an operator reads Payment Verifying
  - Winner's payment and shipment: lets a winner follow their own listing to
    delivery without contacting Grade10.
  - Losing bidder's card hold: says what happened to their authorization, so a
    pending hold is not read as a charge.
- **Reaching the record**
  - Ownership: resolves the record from the session and nothing else.
  - Landing, empty, and failed reads: makes an unused record and a broken one
    tell the collector different things.
- **Tabs by bidding window**
  - Active, Upcoming, Ended: every row sits in the tab its bidding window names.
  - Landing: My Auctions opens on Active; the title count stays the total.
- **Row actions**
  - Ended alerts: Email alerts show disabled on a closed lot.
  - Won entry: a Won row opens its auction order.

## MODIFIED Requirements

### Requirement: A bidder's standing while a listing is open

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
| Bid submitted | The collector placed a bid Grade10 has not yet accepted |
| Bid not accepted | Grade10 refused the collector's last bid. Carries which of: below the minimum next bid, the window had closed, or card authorization failed |

Status SHALL NOT use Ending soon, Scheduled, Live, or Active. Close
urgency SHALL appear with the listing identity.

The row's price SHALL be the auction's current bid on that listing, never the
collector's own bid. A listing past its effective close whose close is not yet
recorded SHALL keep its open Status, SHALL stay in the Active tab, and SHALL
carry no minimum next valid bid.

Every amount SHALL be an integer count of minor units with an ISO 4217 currency
code.

#### Scenario: grade10-site-auction-account-record-SC-14 - The highest bidder is Leading
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing on which the collector holds the highest valid bid
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Leading

#### Scenario: grade10-site-auction-account-record-SC-15 - Outbid carries the minimum next bid
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing on which a higher valid bid than the collector's
  stands
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Outbid
- **AND** the row carries the minimum next valid bid as an integer count of
  minor units with its ISO 4217 currency code

#### Scenario: grade10-site-auction-account-record-SC-16 - A refused bid says why it was refused
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector whose last bid on an open listing was refused for being
  below the minimum next bid
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Bid not accepted
- **AND** the row says the bid was below the minimum next bid

#### Scenario: grade10-site-auction-account-record-SC-17 - A bid awaiting acceptance is not a standing
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector who has placed a bid Grade10 has not yet accepted
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Bid submitted
- **AND** the row does not claim they are Leading

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

### Requirement: The Bidding page groups by what is still owed

After close, a listing the collector bid on SHALL carry exactly one of **Won**
or **Didn't win** in Status on My Auctions, read from the recorded result and
never from the page's own clock. Its price SHALL be the listing's final price,
the same on every bidder's row. My Auctions SHALL NOT
present separate Active, Won, and Didn't win section groups. The durable
Bidding History index remains the source for listing-level history and its
Active/Completed filtering.

#### Scenario: grade10-site-auction-account-record-SC-18 - A won listing sits under Won
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a closed listing whose winner is the collector
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Won

#### Scenario: grade10-site-auction-account-record-SC-19 - A listing lost at close sits under Didn't win
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a closed listing the collector bid on whose winner is someone else
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Didn't win

#### Scenario: grade10-site-auction-account-record-SC-66 - Every bidder's row shows the final price
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** a listing that closed with a winning bid of 150000 HKD minor units,
  on which the collector's own last bid was 120000 HKD minor units
- **WHEN** they open My Auctions
- **THEN** that row reads Didn't win with a price of 150000 HKD minor units
- **AND** the winner's row on their own My Auctions shows 150000 HKD minor
  units

#### Scenario: grade10-site-auction-account-record-SC-67 - A result appears only once the close is recorded
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** a collector leading a listing whose effective close has passed
- **WHEN** the close is recorded with them as the winner
- **THEN** their row reads Won from then on, and did not read Won or Didn't
  win before it
