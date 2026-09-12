## Feature set

- **One My Auctions table**
  - Single bookmark list: every watched or bid-on listing is one row on one
    page.
  - Bid enrolls the list: placing a bid bookmarks the listing without a
    separate Watch.
  - Order: bid rows before watch-only; soonest close within each band.
- **Your Standing**
  - Open standing: Leading, Outbid, Bid submitted, Bid not accepted.
  - Closed standing: Won and Didn't win; Won carries the auction order's own
    status vocabulary, folded by `revise-auction-winner-invoicing`; Didn't
    win carries hold release.
  - Watch-only: `--`; no Scheduled, Live, Ending soon, or Active as standing.
- **Row actions**
  - Unwatch only without a bid; Email alerts on every row.
  - Removal: unpublished or removed listings leave the table.

## MODIFIED Requirements

### Requirement: A watch outlives the listing it was made on

Grade10 SHALL keep a collector's bookmark on My Auctions when the listing
closes while it remains published, and SHALL show that listing with close
timing under the title and `--` in Your Standing when they have not bid —
rather than removing the row solely because bidding ended.

Grade10 SHALL remove the listing from My Auctions when it unpublishes or
removes that listing (including an unsold listing taken down). Scenario
`grade10-site-auction-account-record-SC-07` records that removal (its title
is historical).

Grade10 SHALL enforce a maximum number of watches per collector. An attempt to
watch beyond that maximum SHALL be refused, SHALL record no watch, and SHALL
tell the collector the maximum has been reached. The maximum's value is a
design decision and is not fixed by this requirement. A bid that enrolls the
list SHALL count toward the same maximum.

#### Scenario: grade10-site-auction-account-record-SC-06 - The watch maximum refuses a further watch

- **GIVEN** a collector holding the maximum number of watches
- **WHEN** they watch another listing
- **THEN** Grade10 refuses it and records no watch
- **AND** the collector is told the maximum has been reached

#### Scenario: grade10-site-auction-account-record-SC-07 - An unpublished listing stays on the page

- **GIVEN** a collector with a listing on My Auctions that Grade10 then
  unpublishes or removes
- **WHEN** they open My Auctions
- **THEN** that listing is not listed

#### Scenario: grade10-site-auction-account-record-SC-40 - A closed published listing stays on My Auctions

- **GIVEN** a collector watching a listing that then closes while Grade10
  still publishes it
- **WHEN** they open My Auctions
- **THEN** that listing is still listed
- **AND** Your Standing is `--` when they have not bid

### Requirement: Watching states

A listing on My Auctions that the collector has not bid on SHALL NOT carry a
bidder standing. Your Standing for that row SHALL be `--`. Close and open
timing SHALL appear with the listing identity, not as Scheduled, Live, Ending
soon, or Active values in Your Standing.

#### Scenario: grade10-site-auction-account-record-SC-08 - A scheduled listing says when it opens

- **GIVEN** a watched listing that is published and whose start has not arrived
- **WHEN** the collector opens My Auctions
- **THEN** that listing's row carries when bidding opens with the listing
  identity
- **AND** Your Standing is `--`

#### Scenario: grade10-site-auction-account-record-SC-09 - Ending soon begins at 60 minutes

- **GIVEN** a watched listing whose recorded close is 60 minutes or less away
  and has not passed
- **WHEN** the collector opens My Auctions
- **THEN** that listing's row carries the close with the listing identity
- **AND** Your Standing is `--` when they have not bid

#### Scenario: grade10-site-auction-account-record-SC-10 - Every way of ending reads as Ended

- **GIVEN** three watched listings the collector has not bid on — one sold,
  one that closed with no winner, and one called off — each still published
- **WHEN** the collector opens My Auctions
- **THEN** all three remain listed
- **AND** each carries `--` in Your Standing

### Requirement: The Watching page orders by close and marks what was bid on

My Auctions SHALL show one table of every listing the collector bookmarks —
by watching or by bidding. A listing SHALL appear at most once. The former
Watching and Bidding sections and the bid-on mark between them SHALL NOT
appear.

Lots on which the collector has placed at least one bid SHALL appear before
lots they only watch. Within each band, listings SHALL order by the soonest
recorded close first, with listings whose bidding is over after those still
open.

Unwatching a listing SHALL be offered only when the collector has no bid on
that listing. Unwatching SHALL NOT change any bid. A listing with a bid SHALL
remain on My Auctions until Grade10 unpublishes or removes it, or until the
collector no longer has a bid record that enrolls it — and SHALL NOT offer
Unwatch while a bid stands.

#### Scenario: grade10-site-auction-account-record-SC-11 - The next close is first

- **GIVEN** watched-only listings closing in two hours, in ten minutes, and
  one that closed yesterday
- **WHEN** the collector opens My Auctions
- **THEN** the listing closing in ten minutes is before the one closing in two
  hours
- **AND** the listing that closed yesterday is after both

#### Scenario: grade10-site-auction-account-record-SC-12 - A watched listing they bid on is marked

- **GIVEN** a collector with one listing they only watch and one listing they
  have bid on
- **WHEN** they open My Auctions
- **THEN** the bid listing appears before the watch-only listing
- **AND** each listing appears once

#### Scenario: grade10-site-auction-account-record-SC-13 - Unwatching leaves the bid alone

- **GIVEN** a collector who has bid on a listing on My Auctions
- **WHEN** they read that row
- **THEN** the row offers no Unwatch
- **AND** their standing is unchanged

### Requirement: A bidder's standing while a listing is open

A My Auctions row for a listing the collector has bid on SHALL be an
account-facing summary. The detailed index, private action log, and listing
chronology SHALL follow the `grade10-site/auction/bidding-history` contract;
this capability SHALL NOT create a second bidding history or event log.

A listing on My Auctions whose bidding window is open and on which the
collector has bid SHALL carry exactly one of these values in Your Standing.

| State | When |
| --- | --- |
| Leading | The collector's bid is the highest valid bid |
| Outbid | A higher valid bid stands. Carries the minimum next valid bid |
| Bid submitted | The collector placed a bid Grade10 has not yet accepted |
| Bid not accepted | Grade10 refused the collector's last bid. Carries which of: below the minimum next bid, the window had closed, or card authorization failed |

Your Standing SHALL NOT use Ending soon, Scheduled, Live, or Active. Close
urgency SHALL appear with the listing identity.

Every amount SHALL be an integer count of minor units with an ISO 4217 currency
code.

#### Scenario: grade10-site-auction-account-record-SC-14 - The highest bidder is Leading

- **GIVEN** an open listing on which the collector holds the highest valid bid
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Leading

#### Scenario: grade10-site-auction-account-record-SC-15 - Outbid carries the minimum next bid

- **GIVEN** an open listing on which a higher valid bid than the collector's
  stands
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Outbid
- **AND** the row carries the minimum next valid bid as an integer count of
  minor units with its ISO 4217 currency code

#### Scenario: grade10-site-auction-account-record-SC-16 - A refused bid says why it was refused

- **GIVEN** a collector whose last bid on an open listing was refused for being
  below the minimum next bid
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Bid not accepted
- **AND** the row says the bid was below the minimum next bid

#### Scenario: grade10-site-auction-account-record-SC-17 - A bid awaiting acceptance is not a standing

- **GIVEN** a collector who has placed a bid Grade10 has not yet accepted
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Bid submitted
- **AND** the row does not claim they are Leading

### Requirement: The Bidding page groups by what is still owed

After close, a listing the collector bid on SHALL carry exactly one of **Won**
or **Didn't win** in Your Standing on My Auctions. My Auctions SHALL NOT
present separate Active, Won, and Didn't win section groups. The durable
Bidding History index remains the source for listing-level history and its
Active/Completed filtering.

#### Scenario: grade10-site-auction-account-record-SC-18 - A won listing sits under Won

- **GIVEN** a closed listing whose winner is the collector
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Won

#### Scenario: grade10-site-auction-account-record-SC-19 - A listing lost at close sits under Didn't win

- **GIVEN** a closed listing the collector bid on whose winner is someone else
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Didn't win

### Requirement: A losing bidder is told what happened to their card hold

A listing whose Your Standing is Didn't win on which the collector held a card
authorization SHALL say whether that authorization is still being released or
is released. Grade10 SHALL NOT describe an authorization as released while its
release is still in flight.

A listing the collector bid on that was called off SHALL appear with Didn't
win standing carrying the same statement about their authorization, while the
listing remains published.

#### Scenario: grade10-site-auction-account-record-SC-25 - A release in flight says so

- **GIVEN** a closed listing the collector did not win, whose authorization
  Grade10 has marked for release and whose release is not complete
- **WHEN** they open My Auctions
- **THEN** the row says the hold is being released
- **AND** it does not say the hold is released

#### Scenario: grade10-site-auction-account-record-SC-26 - A completed release says so

- **GIVEN** the same listing once its release is complete
- **WHEN** the collector opens My Auctions
- **THEN** the row says the hold is released

#### Scenario: grade10-site-auction-account-record-SC-27 - A called-off listing tells the bidder about the hold

- **GIVEN** a listing the collector bid on that Grade10 called off and still
  publishes
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Didn't win
- **AND** the row says what happened to their authorization

### Requirement: Landing, empty, and failed reads

My Auctions SHALL open as one page. It SHALL NOT land on separate Bidding or
Watching sections.

An empty My Auctions (no rows) SHALL offer a way into the catalogue, and SHALL
NOT be presented as a failure.

A read Grade10 could not complete SHALL be shown as a failure that can be
retried, and SHALL NOT be shown as an empty record.

A value that follows the clock — a close, a current bid, a minimum next bid —
that Grade10 could not refresh SHALL be shown as not current rather than
presented as current.

The page title SHALL carry a badge whose count equals the number of rows on
the table.

#### Scenario: grade10-site-auction-account-record-SC-30 - A bidder lands on Bidding

- **GIVEN** a collector who has bid on at least one listing
- **WHEN** they open their auction record
- **THEN** they see one My Auctions table that includes that listing
- **AND** they are not sent to a separate Bidding section

#### Scenario: grade10-site-auction-account-record-SC-31 - A collector who has never bid lands on Watching

- **GIVEN** a collector who has never placed a bid and watches at least one
  listing
- **WHEN** they open their auction record
- **THEN** they see one My Auctions table
- **AND** each row's Your Standing is `--`

#### Scenario: grade10-site-auction-account-record-SC-32 - An empty Watching page offers the catalogue

- **GIVEN** a collector with no listings on My Auctions
- **WHEN** they open it
- **THEN** the page offers a way into the auction catalogue
- **AND** it does not report an error

#### Scenario: grade10-site-auction-account-record-SC-33 - A failed read is not an empty record

- **GIVEN** a collector whose record Grade10 cannot read
- **WHEN** they open it
- **THEN** the page reports that the read failed and offers to retry
- **AND** it does not show an empty record

#### Scenario: grade10-site-auction-account-record-SC-34 - A value that could not be refreshed says so

- **GIVEN** a record whose rows are shown but whose current bid could not be
  refreshed
- **WHEN** the collector reads it
- **THEN** that value is shown as not current

#### Scenario: grade10-site-auction-account-record-SC-41 - The title badge matches the row count

- **GIVEN** a collector with three listings on My Auctions
- **WHEN** they open it
- **THEN** the badge beside the page title shows 3

## ADDED Requirements

### Requirement: A bid bookmarks the listing on My Auctions

When a signed-in collector places a bid on a listing, Grade10 SHALL enroll
that listing on My Auctions as a bookmark if it is not already there. The
collector SHALL NOT need a separate Watch for that listing to appear.

#### Scenario: grade10-site-auction-account-record-SC-42 - A first bid enrolls My Auctions

- **GIVEN** a signed-in collector who does not watch a listing
- **WHEN** they place a bid on it
- **THEN** that listing is on My Auctions
- **AND** Your Standing reflects their bid standing

### Requirement: Watch-only rows offer Unwatch; bid rows offer Email alerts only

Every My Auctions row SHALL offer Email alerts when the application supplies
that control. A row for a listing the collector has not bid on SHALL offer
Unwatch. A row for a listing they have bid on SHALL NOT offer Unwatch.

#### Scenario: grade10-site-auction-account-record-SC-43 - Watch-only can be unwatched

- **GIVEN** a collector watching a listing they have not bid on
- **WHEN** they unwatch it from My Auctions
- **THEN** the listing leaves My Auctions
- **AND** Email alerts for that listing turn off with the watch

#### Scenario: grade10-site-auction-account-record-SC-44 - A bid row keeps Email alerts without Unwatch

- **GIVEN** a collector with a bid on a listing on My Auctions
- **WHEN** they read that row
- **THEN** the row offers Email alerts
- **AND** it does not offer Unwatch
