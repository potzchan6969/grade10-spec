## Purpose

Lets a collector mark an auction listing to come back to without bidding
on it. A watch is a private signal that confers no standing in the sale,
and it is the trigger auction mail fires on.

## Feature set

- Watching a listing
  - Watch and unwatch: a signed-in collector marks a listing to come back to
  - Sign-in required: a signed-out viewer is offered sign-in, not a local watch
  - Idempotent watch: watching twice leaves one watch with the original Watched At
- Watch privacy
  - Private signal: only the collector who watched sees it
  - No standing: watching does not bid, reserve, or change the sale
  - Operator count: an operator sees how many collectors watch, across both brands
- Watched list
  - Recency order: most recently watched first
  - Enough to act: each entry shows identity, current bid, and Closes At
  - Survives close: a closed or called-off listing stays until the collector unwatches

## User journeys

### watchlist-US-01: Watch a lot to come back to it

As a signed-in collector, I want to mark a lot to come back to without
bidding on it, so that I can leave the page and find it again without
searching.

**Accepted by:** `watchlist-SC-01`, `watchlist-SC-03`, `watchlist-SC-04`,
`watchlist-SC-05`, `watchlist-SC-06`, `watchlist-SC-07`, `watchlist-SC-08`,
`watchlist-SC-09`

### watchlist-US-02: Unwatch a lot I no longer follow

As a signed-in collector, I want to remove a watch, including after the
lot has closed or been called off, so that my list only holds lots I
still mean to follow.

**Accepted by:** `watchlist-SC-02`, `watchlist-SC-14`

### watchlist-US-03: Read the lots I watch

As a signed-in collector, I want to see the lots I watch, most recently
watched first, with enough to decide whether to act, so that I can return
to a lot from one place.

**Accepted by:** `watchlist-SC-11`, `watchlist-SC-12`, `watchlist-SC-13`,
`watchlist-SC-15`, `watchlist-SC-16`, `watchlist-SC-17`

### watchlist-US-04: Judge interest from the watch count

As an auction operator, I want to see how many collectors watch a lot,
across both brands, so that I can judge interest without treating a
watch as a commitment to buy.

**Accepted by:** `watchlist-SC-10`

## ADDED Requirements

### Watching a listing
------------------

### Requirement: A signed-in collector watches and unwatches a lot

A signed-in collector SHALL:

1. Watch a listing from the catalogue or from that listing's own page.
2. See it as watched wherever it is shown to them.
3. Unwatch it, including after it has closed or been called off.

Watching SHALL require a signed-in collector. A viewer who is not signed
in SHALL be offered sign-in rather than a watch that cannot be stored.
Grade10 SHALL NOT hold a watch only in the browser. Watching the same
listing again SHALL leave one watch, and SHALL NOT create a second or
change the Watched At of the first.

#### Scenario: watchlist-SC-01 - A collector watches a lot

- **GIVEN** a signed-in collector viewing an open lot they do not watch
- **WHEN** they watch it
- **THEN** Grade10 records the watch against that collector and lot
- **AND** the lot shows as watched to them

#### Scenario: watchlist-SC-02 - A collector unwatches a lot

- **GIVEN** a signed-in collector viewing a lot they watch
- **WHEN** they unwatch it
- **THEN** Grade10 removes the watch
- **AND** the lot shows as not watched to them

#### Scenario: watchlist-SC-03 - Watching twice leaves one watch

- **GIVEN** a collector who already watches a lot
- **WHEN** a second watch for the same collector and lot is submitted
- **THEN** the collector watches that lot exactly once
- **AND** the Watched At of the original watch is unchanged

#### Scenario: watchlist-SC-04 - A signed-out viewer is offered sign-in

- **GIVEN** a viewer who is not signed in, on a lot
- **WHEN** they attempt to watch it
- **THEN** Grade10 does not record a watch
- **AND** the viewer is offered sign-in

#### Scenario: watchlist-SC-05 - A watch follows the collector, not the browser

- **GIVEN** a collector who watched a lot in one browser
- **WHEN** they sign in on another device and open that lot
- **THEN** it shows as watched

### Requirement: Watch fields

Each watch SHALL carry these fields. Both brands sell the same auction
listings and sign a collector in per brand, so the same listing SHALL
accept a watch from a collector of either brand. A collector SHALL see
only their own watches, on the brand they signed in to. Identity SHALL
be the collector's user id, per `shared-auth/session`.

| Field | Meaning |
| --- | --- |
| Collector | User id of the watching collector |
| Listing | The listing watched |
| Watched At | When Grade10 accepted the first watch; a repeat does not change it |

#### Scenario: watchlist-SC-06 - A watch belongs to one collector

- **GIVEN** a lot watched by a collector on one brand and by a different collector on the other
- **WHEN** each reads the lots they watch
- **THEN** each sees that lot listed once
- **AND** neither sees the other's watch

### Watch privacy
-------------

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

#### Scenario: watchlist-SC-07 - A watch count is not public

- **GIVEN** a lot watched by several collectors
- **WHEN** any collector or unauthenticated reader reads its public facts
- **THEN** those facts carry no watch count and no watcher identity

#### Scenario: watchlist-SC-08 - One collector cannot see another's watch

- **GIVEN** two signed-in collectors, one of whom watches a lot
- **WHEN** the other opens that lot
- **THEN** it shows as not watched to them

#### Scenario: watchlist-SC-09 - Watching does not change the sale

- **GIVEN** an open lot with a current bid and a leader
- **WHEN** a collector watches it
- **THEN** the current bid, the leader, and the close are unchanged
- **AND** no bid validity rule is affected

#### Scenario: watchlist-SC-10 - An operator counts every watch on a lot

- **GIVEN** a lot watched by two collectors on one brand and one collector on the other
- **WHEN** an authorized operator reads that lot's watch count
- **THEN** the count is 3

### Watched list
------------

### Requirement: A collector reads the lots they watch

Grade10 SHALL show a signed-in collector the listings they watch, most
recently watched first. A collector who watches nothing SHALL be shown
that they watch nothing, and SHALL NOT be shown an error or an empty
page with no explanation. Each entry SHALL lead to that listing.

A watch SHALL survive its listing's close, call-off, or being won by
another collector. Grade10 SHALL NOT remove a watch for those reasons.
A collector SHALL be able to unwatch such a listing.

#### Scenario: watchlist-SC-11 - The list is ordered by when each watch was made

- **GIVEN** a collector who watched lot A, then lot B, then lot C
- **WHEN** they read the lots they watch
- **THEN** the order is C, B, A

#### Scenario: watchlist-SC-12 - A collector watching nothing

- **GIVEN** a signed-in collector who watches no lot
- **WHEN** they read the lots they watch
- **THEN** they are told they watch nothing
- **AND** no error is shown

#### Scenario: watchlist-SC-13 - An entry leads to its lot

- **GIVEN** a collector reading the lots they watch
- **WHEN** they open an entry
- **THEN** they arrive at that lot

#### Scenario: watchlist-SC-14 - A collector unwatches a closed lot

- **GIVEN** a collector watching a closed lot
- **WHEN** they unwatch it
- **THEN** the watch is removed
- **AND** the lot no longer appears in the lots they watch

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

#### Scenario: watchlist-SC-15 - An entry carries the facts needed to act

- **GIVEN** a collector watching an open lot
- **WHEN** they read the lots they watch
- **THEN** that entry shows the lot's identity, its current bid, and its close

#### Scenario: watchlist-SC-16 - A closed lot stays in the list

- **GIVEN** a collector watching a lot that then closes
- **WHEN** they read the lots they watch
- **THEN** that lot is still listed
- **AND** it is shown as closed

#### Scenario: watchlist-SC-17 - A called-off lot is shown as called off

- **GIVEN** a collector watching a lot an operator then calls off
- **WHEN** they read the lots they watch
- **THEN** that lot is shown as called off, not as open
