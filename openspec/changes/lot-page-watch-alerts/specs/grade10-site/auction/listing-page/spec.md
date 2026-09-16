## MODIFIED Requirements

### Requirement: A lot's page offers to watch it

A lot's page SHALL offer a signed-in collector a control that watches and
unwatches that lot when bidding on that lot is **still open**, they have
**no bid** on it, and SHALL show whether they currently watch it. The control
SHALL act on the lot the address names and no other.

When the collector **has bid** on that lot while it is still open, the control
SHALL show **Watching** in a disabled state and SHALL NOT unwatch. A bid
bookmarks the lot; watching is not optional while the bid stands.

When the lot is **closed** — sold, unsold, called off, or any other close —
the page SHALL NOT show the watch control.

Watching or unwatching from this page SHALL NOT navigate away from the lot,
and SHALL NOT change the lot's bidding standing, its close, or anything else
the page carries — except the watch control itself and any toast the page
announces.

What a watch is, who may hold one, how many, Undo, and where bookmarked lots
are read belong to `grade10-site/auction/account-record`.

Scenario ids in this capability start at `grade10-site-auction-listing-page-SC-10`: the nine
scenarios this capability already carries were written before ids were
required, and `grade10-site-auction-listing-page-SC-01` through `grade10-site-auction-listing-page-SC-09` are reserved
for them.

#### Scenario: grade10-site-auction-listing-page-SC-10 - A collector watches the lot they are reading
**Serves:** grade10-site-auction-listing-page-US-06 - Watch a lot and open My Auctions from the toast

- **GIVEN** a signed-in collector on a published lot's own page who does not
  watch it and has not bid on it
- **WHEN** they use the watch control
- **THEN** the page shows the lot as watched
- **AND** they are still on that lot's page

#### Scenario: grade10-site-auction-listing-page-SC-11 - The control acts on the addressed lot
**Serves:** Watching a lot - the control acts on the addressed lot

- **GIVEN** two published lots with their own addresses
- **WHEN** a collector watches the lot from one of those addresses
- **THEN** only the lot that address names is watched

#### Scenario: grade10-site-auction-listing-page-SC-12 - Watching changes nothing else on the page
**Serves:** Watching a lot - watching changes nothing else on the page

- **GIVEN** a signed-in collector on a live lot's page who has not bid on it
- **WHEN** they watch it
- **THEN** the lot's bidding standing and its close are unchanged

#### Scenario: grade10-site-auction-listing-page-SC-13 - A bid locks Watching on the lot page
**Serves:** grade10-site-auction-listing-page-US-08 - After bidding, Watching stays locked

- **GIVEN** a signed-in collector on a published lot's own page who has bid
  on that lot
- **WHEN** the page shows the watch control
- **THEN** the control shows Watching and is disabled
- **AND** activating it does not unwatch the lot

#### Scenario: grade10-site-auction-listing-page-SC-18 - A closed lot has no watch control
**Serves:** grade10-site-auction-listing-page-US-09 - Closed lot has no watch control

- **GIVEN** a signed-in collector on a closed lot's page (sold or unsold)
- **WHEN** the page renders
- **THEN** the watch control is absent
## ADDED Requirements

### Requirement: The lot page announces watch and unwatch

When a signed-in collector with **no bid** on the lot successfully watches
it from that lot's page, Grade10 SHALL announce that email alerts are on for
the lot, in wording aligned with My Auctions email-alerts-on copy, and SHALL
offer a toast action labelled **View My Auctions** that opens My Auctions.

When they successfully unwatch from that lot's page, Grade10 SHALL announce
that the lot left My Auctions / email alerts are off for it, in wording
aligned with My Auctions Unwatch, and SHALL offer **Undo** that restores the
watch without finding the lot again.

#### Scenario: grade10-site-auction-listing-page-SC-14 - Watch announces alerts and My Auctions
**Serves:** grade10-site-auction-listing-page-US-06 - Watch a lot and open My Auctions from the toast

- **GIVEN** a signed-in collector on a lot's page who does not watch it and
  has not bid on it
- **WHEN** they watch it and Grade10 records the watch
- **THEN** a toast says email alerts are on for this lot
- **AND** the toast offers **View My Auctions**, which opens My Auctions

#### Scenario: grade10-site-auction-listing-page-SC-15 - Unwatch announces and can be undone
**Serves:** grade10-site-auction-listing-page-US-07 - Unwatch from the lot and undo

- **GIVEN** a signed-in collector on a lot's page who watches it and has not
  bid on it
- **WHEN** they unwatch it and Grade10 records the removal
- **THEN** a toast says the lot is unwatched and email alerts for it are off
- **AND** Undo puts the listing back on My Auctions without opening the lot
  again

### Requirement: A first bid on the lot announces alerts once

When a signed-in collector's bid bookmarks a lot (auto-watch), Grade10 SHALL
announce that email alerts are on for that lot **at most once per listing
per collector**, recorded on the account. The announcement SHALL happen when
that bid bookmarks the lot. Later visits to the lot page SHALL NOT show that
toast again for the same collector and listing.

#### Scenario: grade10-site-auction-listing-page-SC-16 - The first bid toast fires once
**Serves:** grade10-site-auction-listing-page-US-08 - After bidding, Watching stays locked

- **GIVEN** a signed-in collector who has never been shown the bid-alerts
  toast for listing L
- **WHEN** their bid bookmarks L
- **THEN** a toast says email alerts are on for this lot
- **AND** Grade10 records that the toast was shown for that collector and L

#### Scenario: grade10-site-auction-listing-page-SC-17 - A later visit stays quiet
**Serves:** grade10-site-auction-listing-page-US-08 - After bidding, Watching stays locked

- **GIVEN** a signed-in collector for whom Grade10 already recorded the
  bid-alerts toast for listing L
- **WHEN** they open L's page again
- **THEN** that toast does not appear
