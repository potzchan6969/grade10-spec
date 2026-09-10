## MODIFIED Requirements

### Requirement: A collector watches a listing from where it is shown

Grade10 SHALL let a signed-in collector watch and unwatch a listing from that
listing's own page and from the catalogue that lists it, **when they have no
bid on that listing**. A watch SHALL be private to the collector who made it:
no other collector's record changes, and no count of watchers appears on any
public surface.

Unwatching SHALL be reversible immediately after the act, without the
collector finding the listing again.

A watch attempt carrying no session SHALL record no watch. Grade10 SHALL NOT
hold a watch for an anonymous visitor.

When the collector watches from a listing's own page, Grade10 SHALL announce
that email alerts are on for that listing and SHALL offer a way to open My
Auctions from that announcement. When they unwatch from a listing's own page,
Grade10 SHALL announce the removal (email alerts off for that listing) and
SHALL offer Undo.

#### Scenario: grade10-site-auction-account-record-SC-01 - A collector watches from a listing's page

- **GIVEN** a signed-in collector reading a published listing's own page who
  has not bid on it
- **WHEN** they watch it
- **THEN** that listing is on My Auctions
- **AND** the listing's page shows it as watched
- **AND** a toast says email alerts are on for this lot with **View My
  Auctions**, which opens My Auctions

#### Scenario: grade10-site-auction-account-record-SC-02 - A collector watches from the catalogue

- **GIVEN** a signed-in collector reading the auction catalogue
- **WHEN** they watch a listing without opening it
- **THEN** that listing is on My Auctions
- **AND** they are still on the catalogue

#### Scenario: grade10-site-auction-account-record-SC-03 - Unwatching can be undone

- **GIVEN** a collector who has just unwatched a listing from its page and
  has not bid on it
- **WHEN** they undo that act
- **THEN** the listing is on My Auctions again
- **AND** they did not have to find the listing a second time

#### Scenario: grade10-site-auction-account-record-SC-04 - A watch without a session is not recorded

- **GIVEN** a visitor carrying no session
- **WHEN** they attempt to watch a listing
- **THEN** Grade10 records no watch
- **AND** no watch appears for any collector

#### Scenario: grade10-site-auction-account-record-SC-05 - A watch is private

- **GIVEN** one collector who watches a listing and a second collector who does
  not
- **WHEN** the second collector reads that listing's page, the catalogue, and
  their own record
- **THEN** nothing tells them the first collector watches it
- **AND** no watcher count is shown

### Requirement: The Watching page orders by close and marks what was bid on

The Watching page SHALL order listings by the soonest recorded close first,
with listings whose bidding is over after those still open.

A watched listing the collector has also bid on SHALL be marked as one they bid
on and SHALL open that listing's row on the Bidding page in one step.

Unwatching a listing SHALL be offered only when the collector has **no bid**
on that listing. Unwatching SHALL NOT change any bid. A listing with a bid
SHALL stay bookmarked; Grade10 SHALL NOT offer Unwatch while a bid stands.

#### Scenario: grade10-site-auction-account-record-SC-11 - The next close is first

- **GIVEN** watched listings closing in two hours, in ten minutes, and one that
  closed yesterday
- **WHEN** the collector opens their Watching page
- **THEN** the listing closing in ten minutes is before the one closing in two
  hours
- **AND** the listing that closed yesterday is after both

#### Scenario: grade10-site-auction-account-record-SC-12 - A watched listing they bid on is marked

- **GIVEN** a collector who watches a listing and has placed a bid on it
- **WHEN** they open their Watching page
- **THEN** that listing is marked as one they bid on
- **AND** opening the mark takes them to that listing on the Bidding page

#### Scenario: grade10-site-auction-account-record-SC-13 - Unwatching leaves the bid alone

- **GIVEN** a collector who has bid on a listing
- **WHEN** they read that listing's page or My Auctions
- **THEN** Grade10 offers no Unwatch for that listing
- **AND** the listing remains bookmarked with their standing unchanged

## ADDED Requirements

### Requirement: A bid bookmarks the lot and announces alerts once

Placing a bid on a listing SHALL bookmark that listing on My Auctions without
a separate Watch. Grade10 SHALL turn email alerts on for that listing by
default (same enrolment as watching).

When that bid first bookmarks the listing for the collector, Grade10 SHALL
announce that email alerts are on for the lot **at most once per listing per
collector**. That fact SHALL be stored on the account. A later bid, page
view, or device SHALL NOT show the same announcement again for that pair.

#### Scenario: grade10-site-auction-account-record-SC-35 - A bid bookmarks without a separate Watch

- **GIVEN** a signed-in collector who has not watched listing L
- **WHEN** they place a bid on L that Grade10 accepts as bookmarking L
- **THEN** L is on My Auctions
- **AND** they did not need a separate Watch for L to appear

#### Scenario: grade10-site-auction-account-record-SC-36 - The bid-alerts toast is once per lot

- **GIVEN** a signed-in collector who has never been shown the bid-alerts
  toast for listing L
- **WHEN** their bid bookmarks L
- **THEN** a toast says email alerts are on for this lot
- **AND** a second successful bid on L does not show that toast again
