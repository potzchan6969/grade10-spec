## Purpose

Lets a collector mark an auction listing to come back to without bidding
on it. A watch is a private signal that confers no standing in the sale.
Email alerts for a watched listing are a separate preference owned by
`grade10-site/auction/notifications`; watching defaults alerts on, and
unwatching turns them off.

**Terminology.** **Listing** is the domain entity this capability names.
**Lot** is only the collector-facing label for a listing
(`listingLabel` / copy such as `lotLabel`). Requirements and scenarios
speak of listings; they do not invent a lot entity.

## Feature set

- Watching a listing
  - Watch and unwatch: a signed-in collector marks a listing to come back to
  - Unwatch surfaces: listing page, catalogue, and the watched listings list
  - Sign-in required: a signed-out viewer is offered sign-in, not a local watch
  - Idempotent watch: watching twice leaves one watch with the original Watched At
  - Alerts default on: watching turns email alerts on for that listing; unwatching turns them off
- Watch privacy
  - Private signal: only the collector who watched sees it
  - No standing: watching does not bid, reserve, or change the sale
  - Operator count: an operator sees how many collectors watch, across both brands
- Watched list
  - Recency order: most recently watched first
  - Enough to act: each entry shows identity, current bid, and Closes At
  - Survives close: a closed or called-off listing stays until the collector unwatches
  - Email alerts control: the list can mute alerts without unwatching

## ADDED Requirements

### Requirement: A signed-in collector watches and unwatches a listing

A signed-in collector SHALL:

1. Watch a listing from the catalogue or from that listing's own page.
2. See it as watched wherever it is shown to them.
3. Unwatch it from that listing's own page, from the catalogue, or from
   the watched listings surface, including after it has closed or been
   called off.

Watching SHALL require a signed-in collector. A viewer who is not signed
in SHALL be offered sign-in rather than a watch that cannot be stored.
Grade10 SHALL NOT hold a watch only in the browser. Watching the same
listing again SHALL leave one watch, and SHALL NOT create a second or
change the Watched At of the first.

#### Scenario: grade10-site-auction-watchlist-SC-01 - A collector watches a listing

- **GIVEN** a signed-in collector viewing an open listing they do not watch
- **WHEN** they watch it
- **THEN** Grade10 records the watch against that collector and listing
- **AND** the listing shows as watched to them
- **AND** email alerts for that listing are on

#### Scenario: grade10-site-auction-watchlist-SC-02 - A collector unwatches a listing

- **GIVEN** a signed-in collector viewing a listing they watch
- **WHEN** they unwatch it
- **THEN** Grade10 removes the watch
- **AND** the listing shows as not watched to them
- **AND** email alerts for that listing are off

#### Scenario: grade10-site-auction-watchlist-SC-03 - Watching twice leaves one watch

- **GIVEN** a collector who already watches a listing
- **WHEN** a second watch for the same collector and listing is submitted
- **THEN** the collector watches that listing exactly once
- **AND** the Watched At of the original watch is unchanged

#### Scenario: grade10-site-auction-watchlist-SC-04 - A signed-out viewer is offered sign-in

- **GIVEN** a viewer who is not signed in, on a listing
- **WHEN** they attempt to watch it
- **THEN** Grade10 does not record a watch
- **AND** the viewer is offered sign-in

#### Scenario: grade10-site-auction-watchlist-SC-05 - A watch follows the collector, not the browser

- **GIVEN** a collector who watched a listing in one browser
- **WHEN** they sign in on another device and open that listing
- **THEN** it shows as watched

### Requirement: Watch fields

Each watch SHALL carry these fields. Both brands sell the same auction
listings and sign a collector in per brand, so the same listing SHALL
accept a watch from a collector of either brand. A collector SHALL see
only their own watches, on the brand they signed in to. Identity SHALL
be the collector's user id, per `shared/auth/session`.

| Field | Meaning |
| --- | --- |
| Collector | User id of the watching collector |
| Listing | The listing watched |
| Watched At | When Grade10 accepted the first watch; a repeat does not change it |

#### Scenario: grade10-site-auction-watchlist-SC-06 - A watch belongs to one collector

- **GIVEN** a listing watched by a collector on one brand and by a different collector on the other
- **WHEN** each reads the listings they watch
- **THEN** each sees that listing listed once
- **AND** neither sees the other's watch

### Requirement: A watch is private and confers nothing

A watch SHALL be visible only to the collector who made it. Grade10
SHALL NOT disclose to another collector, to an unauthenticated reader,
or in any public listing fact that a listing is watched, who watches it,
or how many collectors watch it.

A watch SHALL confer no standing in the sale. It SHALL NOT affect the
current bid, the leader, bid validity, the close, or any outcome of the
auction, and it SHALL NOT reserve the listing or grant priority.

An authorized operator SHALL be able to see how many collectors watch a
listing, in order to judge interest. That count SHALL include every
watch on that listing across both brands. An operator SHALL NOT be shown
a watch as a commitment to buy.

#### Scenario: grade10-site-auction-watchlist-SC-07 - A watch count is not public

- **GIVEN** a listing watched by several collectors
- **WHEN** any collector or unauthenticated reader reads its public facts
- **THEN** those facts carry no watch count and no watcher identity

#### Scenario: grade10-site-auction-watchlist-SC-08 - One collector cannot see another's watch

- **GIVEN** two signed-in collectors, one of whom watches a listing
- **WHEN** the other opens that listing
- **THEN** it shows as not watched to them

#### Scenario: grade10-site-auction-watchlist-SC-09 - Watching does not change the sale

- **GIVEN** an open listing with a current bid and a leader
- **WHEN** a collector watches it
- **THEN** the current bid, the leader, and the close are unchanged
- **AND** no bid validity rule is affected

#### Scenario: grade10-site-auction-watchlist-SC-10 - An operator counts every watch on a listing

- **GIVEN** a listing watched by two collectors on one brand and one collector on the other
- **WHEN** an authorized operator reads that listing's watch count
- **THEN** the count is 3

### Requirement: A collector reads the listings they watch

Grade10 SHALL show a signed-in collector the listings they watch, most
recently watched first. A collector who watches nothing SHALL be shown
that they watch nothing, and SHALL NOT be shown an error or an empty
page with no explanation. Each entry SHALL lead to that listing.

A watch SHALL survive its listing's close, call-off, or being won by
another collector. Grade10 SHALL NOT remove a watch for those reasons.
A collector SHALL be able to unwatch such a listing.

#### Scenario: grade10-site-auction-watchlist-SC-11 - The list is ordered by when each watch was made

- **GIVEN** a collector who watched listing A, then listing B, then listing C
- **WHEN** they read the listings they watch
- **THEN** the order is C, B, A

#### Scenario: grade10-site-auction-watchlist-SC-12 - A collector watching nothing

- **GIVEN** a signed-in collector who watches no listing
- **WHEN** they read the listings they watch
- **THEN** they are told they watch nothing
- **AND** no error is shown

#### Scenario: grade10-site-auction-watchlist-SC-13 - An entry leads to its listing

- **GIVEN** a collector reading the listings they watch
- **WHEN** they open an entry
- **THEN** they arrive at that listing

#### Scenario: grade10-site-auction-watchlist-SC-14 - A collector unwatches a closed listing

- **GIVEN** a collector watching a closed listing
- **WHEN** they unwatch it
- **THEN** the watch is removed
- **AND** the listing no longer appears in the listings they watch

#### Scenario: grade10-site-auction-watchlist-SC-18 - A collector unwatches from the watched list

- **GIVEN** a signed-in collector reading the listings they watch
- **WHEN** they unwatch an entry on that list
- **THEN** Grade10 removes the watch
- **AND** that listing no longer appears in the listings they watch
- **AND** email alerts for that listing are off
- **AND** they did not have to open the listing's own page

#### Scenario: grade10-site-auction-watchlist-SC-19 - Muting alerts leaves the watch

- **GIVEN** a signed-in collector watching a listing with email alerts on
- **WHEN** they turn email alerts off for that listing
- **THEN** the listing remains watched
- **AND** email alerts for that listing are off

### Requirement: Watched-list entry fields

Each entry SHALL carry enough to decide whether to act, in the shape
that listing's own surface uses. A closed listing SHALL be shown as
closed. A called-off listing SHALL be shown as called off rather than
as still open. A close SHALL follow `dates-and-times`.

| Field | Meaning |
| --- | --- |
| Listing | Identity of the watched listing |
| Current bid | Same shape as that listing's own surface |
| Closes At | Same shape as that listing's close |
| Sale state | Open, closed, or called off |

#### Scenario: grade10-site-auction-watchlist-SC-15 - An entry carries the facts needed to act

- **GIVEN** a collector watching an open listing
- **WHEN** they read the listings they watch
- **THEN** that entry shows the listing's identity, its current bid, and its close

#### Scenario: grade10-site-auction-watchlist-SC-16 - A closed listing stays in the list

- **GIVEN** a collector watching a listing that then closes
- **WHEN** they read the listings they watch
- **THEN** that listing is still listed
- **AND** it is shown as closed

#### Scenario: grade10-site-auction-watchlist-SC-17 - A called-off listing is shown as called off

- **GIVEN** a collector watching a listing an operator then calls off
- **WHEN** they read the listings they watch
- **THEN** that listing is shown as called off, not as open
