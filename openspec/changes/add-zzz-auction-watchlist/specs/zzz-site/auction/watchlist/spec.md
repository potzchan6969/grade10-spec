## Purpose

Lets a signed-in ZZZ collector mark an auction listing to come back to, on
ZZZ, with the meaning `grade10-site/auction/watchlist` gives a watch: a
private signal that confers no standing in the sale. ZZZ carries the two
surfaces watching needs and nothing else of the auction.

## Feature set

- Watching a listing
  - Listing page: a listing's own ZZZ address shows its title, where it
    stands, its close and Watch
  - Sign-in first: a signed-out collector who presses Watch is asked to sign
    in, and no watch is recorded
  - Closed listing: no Watch control
- Watched list
  - Recency order: most recently watched first, as the shared auction keeps it
  - Enough to act: each row shows the title, the current bid, the close and
    Unwatch, and opens the listing's ZZZ page
  - Its own brand: a ZZZ watch never shows on Grade10, nor a Grade10 watch on ZZZ
- What ZZZ does not carry
  - No catalogue, bidding, winner order or bidding history on ZZZ

## ADDED Requirements

### Requirement: A ZZZ collector watches a listing from its page

ZZZ SHALL answer a listing at `/auction/listings/<listing id>` with its
title, its leading bid or, with no bid, the first amount it takes, and its
close in the collector's own zone. An open listing SHALL offer Watch; a
closed one SHALL offer none.

A signed-in collector's Watch SHALL record a watch for ZZZ through the shared
auction, and a second press SHALL unwatch it. A signed-out collector's Watch
SHALL open sign-in and record nothing.

<!-- trace:scenario id=zzz-site-auction-watchlist.SC-01 rev=1 -->
#### Scenario: zzz-site-auction-watchlist-SC-01 - A signed-in collector watches a listing
**Serves:** zzz-site-auction-watchlist-US-01 - mark a listing to come back to

- **GIVEN** a signed-in collector on an open listing's ZZZ page
- **WHEN** they press Watch
- **THEN** the listing is watched for ZZZ and the control reads Watching

<!-- trace:scenario id=zzz-site-auction-watchlist.SC-02 rev=1 -->
#### Scenario: zzz-site-auction-watchlist-SC-02 - A signed-out collector is asked to sign in
**Serves:** zzz-site-auction-watchlist-US-01 - no watch is kept in the browser

- **GIVEN** a signed-out collector on an open listing's ZZZ page
- **WHEN** they press Watch
- **THEN** sign-in opens and no watch is recorded

### Requirement: A ZZZ collector reads and unwatches their watched listings

ZZZ SHALL answer `/auction/watching` for a signed-in collector with their
ZZZ watches, most recently watched first, each row naming the listing, its
current bid and its close, opening the listing's ZZZ page and offering
Unwatch. A signed-out collector SHALL be asked to sign in.

<!-- trace:scenario id=zzz-site-auction-watchlist.SC-03 rev=1 -->
#### Scenario: zzz-site-auction-watchlist-SC-03 - The watched list reads and unwatches
**Serves:** zzz-site-auction-watchlist-US-02 - return to a listing from one place

- **GIVEN** a signed-in collector who watches one listing on ZZZ
- **WHEN** they open their watched listings
- **THEN** the row names the listing with its current bid and close
- **AND** pressing Unwatch removes the watch
