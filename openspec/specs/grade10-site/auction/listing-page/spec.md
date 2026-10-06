# grade10-site/auction/listing-page Specification

## Purpose

What one lot's address serves: the lot's own page, in the response before any
script runs, what a shared link unfurls as, and the refusal when the auction
holds no such lot. While the lot is open, the page follows it live: its
countdown on the auction service's clock, each committed bid, extension and
close without a reload, and its result only once the close is recorded.

A lot address names one lot by the id the catalogue already addresses it by.
Every requirement of `grade10-site/site/crawlable-pages` binds it — it is a public
surface, so its title, description, share metadata and sitemap treatment are
that capability's, per lot rather than per page. What a bid must clear, when a
close extends and how a lot is settled stay `grade10-site/auction/auction`'s.

## Feature set

- Lot address
  - Server-rendered lot page: the lot's name, description, sale and bidding
    standing are in the response HTML before any script runs
  - One lot per address: two lot addresses answer with their own lot, their own
    title, meta description and `og:url`
- Shared link preview
  - Open Graph per lot: `og:title`, `og:description` and `og:url` name that lot
    and its own canonical address rather than the auction catalogue
- Unknown lot refusal
  - Catalogue decides: whether an id names a published lot is asked of the
    catalogue at the moment the address is asked for
  - Not-found answer: an address naming no published lot answers 404 with the
    site's not-found surface, never an empty lot page
- Live lot handover
  - Served content persists: once scripts run the same lot is on screen and
    nothing it showed is replaced by a loading placeholder
  - Clock values carry on: a value that follows the clock continues from what
    was served rather than contradicting it
- Watching a lot
  - Watch from the page: a collector marks the lot they are reading, and nothing else on the page moves
  - Watching a lot - the control acts on the addressed lot
  - Watching a lot - watching changes nothing else on the page
  - After bidding, Watching stays locked
  - Closed lot has no watch control
- Catalogue and sitemap
  - Opened from the catalogue: the catalogue reaches a lot's own address
    without a page load
  - No lot in the sitemap: which lots the auction publishes is unknown at build
    time, so no entry is a lot address
- Live lot updates
  - Without a reload: another page's accepted bid, an extension or a close
    shows with the new price, bid count and close
  - Own standing follows: when the lot's version rises, the page reads the
    viewer's own standing again, so Outbid shows without a reload while live
    updates stay anonymous
  - Polling fallback: a page that cannot hold a live line still catches up
- One service clock
  - Service time: the countdown runs on the auction service's clock, whatever
    the device's clock says
  - Probed again: after sleep, a reconnect or a return to the tab, and a
    correction under a second never makes the countdown jump up
  - Rounds up: the last second never reads 0 while the lot takes bids
- Close and result
  - Closed until recorded: past the close, the page shows the existing Closed
    state with no result until the close is recorded
  - Result from the record: Won, Did not win or Unsold comes from the recorded
    result, never from the page's own clock
  - Existing words only: Extended bidding for an extension, and a bid refused
    past the close in the bid form's own words
- Recent bids outcome
  - Winner after close: a closed sold lot crowns its winning public row; a live lot crowns none
  - Equal-max tip: a public row tied on amount with a row above it carries the earlier-leads tip
- Public identifier
  - Code-backed address: the canonical address ends in the lower-case listing
    code, without exposing a separate listing-code field or a code-only route
  - Title stays the reference: a collector and support continue to identify
    and quote a lot by its title and its address, exactly as before the
    listing code existed
  - Canonical address: a called-off listing is removed from browse and search
    but remains directly accessible at its canonical address; explicit hard
    deletion is outside this change and its page accessibility is unspecified

## Requirements

### Requirement: A lot answers at its own address

The site SHALL answer a lot's address with that lot's page: its name, its
description, the sale it runs under, and where its bidding stands — in the
response HTML without any script executing.

Two lot addresses SHALL answer with their own lot — the page a collector
reads is the one the address names, not the catalogue it was reached from.

<!-- trace:scenario id=g10.auction-listing-page.SC-vnl rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-01 - A lot answers whole
**Serves:** grade10-site-auction-listing-page-US-01 - Collector opens a lot at its own address

- **WHEN** a lot address is fetched and no script executes
- **THEN** the response HTML contains that lot's name, its description, and
  where its bidding stands

<!-- trace:scenario id=g10.auction-listing-page.SC-4q9 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-02 - Two lots, two pages
**Serves:** grade10-site-auction-listing-page-US-01 - Collector opens a lot at its own address

- **WHEN** two lot addresses are fetched
- **THEN** each response carries its own lot's name and standing, and its own
  title, meta description and `og:url`

### Requirement: A shared lot link unfurls as the lot

A lot address SHALL carry Open Graph title, description and URL naming that
lot and its own canonical address, readable without executing scripts. A
shared lot link SHALL NOT unfurl as the auction catalogue.

<!-- trace:scenario id=g10.auction-listing-page.SC-mda rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-03 - A preview fetcher reads a lot
**Serves:** grade10-site-auction-listing-page-US-02 - Collector shares a lot link

- **WHEN** a lot address is fetched and no script executes
- **THEN** the response carries `og:title`, `og:description` and `og:url`
  naming that lot and its own address
- **AND** none of them names the auction catalogue in its place

### Requirement: An address that names no lot is refused

The catalogue SHALL be what decides whether an id names a published lot,
asked when the address is asked for. An address under the auction's lots
naming no published lot SHALL answer with status 404 and the site's not-found
screen, never an empty lot page and never the catalogue.

The address of a Draft lot SHALL give the same 404 response, even if it was
once published. A called-off lot's canonical address SHALL continue to serve
its public listing page after it is removed from browse and search, as
`grade10-site/auction/lot-status` defines.

<!-- trace:scenario id=g10.auction-listing-page.SC-s88 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-04 - An id the catalogue publishes no lot for
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **WHEN** an address under the auction's lots naming no published lot is
  fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's Page not found screen

<!-- trace:scenario id=g10.auction-listing-page.SC-jj1 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-05 - A lot the catalogue publishes answers
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **GIVEN** a lot the catalogue publishes
- **WHEN** its address is fetched
- **THEN** the response has status 200 and carries that lot's page

<!-- trace:scenario id=g10.auction-listing-page.SC-c13 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-19 - A hidden lot's address shows Page not found
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **GIVEN** a draft lot that is not published
- **WHEN** an address naming that lot is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's Page not found screen

### Requirement: A served lot becomes live without blanking

A lot is live — bids move under it, and its close approaches while it is
read. The document served for a lot SHALL carry that lot as it stood when the
response was made, and once scripts run the same lot SHALL be on screen with
its served content still present. Nothing the document showed SHALL be
replaced by a loading placeholder, and a value that follows the clock SHALL
carry on from what was served rather than disagreeing with it.

<!-- trace:scenario id=g10.auction-listing-page.SC-c09 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-06 - The served lot stays on screen
**Serves:** grade10-site-auction-listing-page-US-04 - Collector reads a live lot while scripts load

- **GIVEN** a lot address served with that lot in the document
- **WHEN** scripts finish loading
- **THEN** the same lot is on screen with its served name, description and
  standing still present
- **AND** none of them is replaced by a loading placeholder

<!-- trace:scenario id=g10.auction-listing-page.SC-y8j rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-07 - A value that follows the clock carries on
**Serves:** grade10-site-auction-listing-page-US-04 - Collector reads a live lot while scripts load

- **GIVEN** a lot whose page shows how long its bidding has left
- **WHEN** scripts finish loading
- **THEN** what is on screen continues from what the document carried, rather
  than contradicting it

### Requirement: A lot is reached from the catalogue

The catalogue SHALL open a lot's own address from that lot, without a page
load.

The sitemap lists the surfaces the build writes a document for, and a lot is
not one of them: which lots the auction publishes is not known when the site
is built.

<!-- trace:scenario id=g10.auction-listing-page.SC-fl9 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-08 - A lot is opened from the catalogue
**Serves:** grade10-site-auction-listing-page-US-05 - Collector reaches a lot from the catalogue

- **GIVEN** a collector reading the auction catalogue
- **WHEN** they open a lot it lists
- **THEN** that lot's address is what they are on, showing that lot's page

<!-- trace:scenario id=g10.auction-listing-page.SC-aga rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-09 - The sitemap names no lot
**Serves:** grade10-site-auction-listing-page-US-05 - Collector reaches a lot from the catalogue

- **WHEN** the sitemap is fetched
- **THEN** no entry is a lot address
- **AND** none carries an unfilled parameter in place of one

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

<!-- trace:scenario id=g10.auction-listing-page.SC-z67 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-10 - A collector watches the lot they are reading
**Serves:** grade10-site-auction-listing-page-US-06 - Watch an auction and open My Auctions from the toast

- **GIVEN** a signed-in collector on a published lot's own page who does not
  watch it and has not bid on it
- **WHEN** they use the watch control
- **THEN** the page shows the lot as watched
- **AND** they are still on that lot's page

<!-- trace:scenario id=g10.auction-listing-page.SC-vl7 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-11 - The control acts on the addressed lot
**Serves:** Watching a lot - the control acts on the addressed lot

- **GIVEN** two published lots with their own addresses
- **WHEN** a collector watches the lot from one of those addresses
- **THEN** only the lot that address names is watched

<!-- trace:scenario id=g10.auction-listing-page.SC-irg rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-12 - Watching changes nothing else on the page
**Serves:** Watching a lot - watching changes nothing else on the page

- **GIVEN** a signed-in collector on a live lot's page who has not bid on it
- **WHEN** they watch it
- **THEN** the lot's bidding standing and its close are unchanged

<!-- trace:scenario id=g10.auction-listing-page.SC-krh rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-13 - A bid locks Watching on the lot page
**Serves:** grade10-site-auction-listing-page-US-08 - After bidding, Watching stays locked

- **GIVEN** a signed-in collector on a published lot's own page who has bid
  on that lot
- **WHEN** the page shows the watch control
- **THEN** the control shows Watching and is disabled
- **AND** activating it does not unwatch the lot

<!-- trace:scenario id=g10.auction-listing-page.SC-n70 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-18 - A closed lot has no watch control
**Serves:** grade10-site-auction-listing-page-US-09 - Closed lot has no watch control

- **GIVEN** a signed-in collector on a closed lot's page (sold or unsold)
- **WHEN** the page renders
- **THEN** the watch control is absent

### Requirement: The lot page announces watch and unwatch

Watching or unwatching from the lot page shows a toast with one action on it.

**Watch** - When a signed-in collector with **no bid** on the lot successfully
watches it from that lot's page, Grade10 SHALL announce that email alerts are
on for the auction, in wording aligned with My Auctions email-alerts-on copy, and
SHALL offer a toast action labelled **View My Auctions** that opens My
Auctions.

**Unwatch** - When they successfully unwatch from that lot's page, Grade10
SHALL announce that the auction left My Auctions / email alerts are off for it, in
wording aligned with My Auctions Unwatch, and SHALL offer **Undo** that
restores the watch without finding the lot again.

<!-- trace:scenario id=g10.auction-listing-page.SC-omp rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-14 - Watch announces alerts and My Auctions
**Serves:** grade10-site-auction-listing-page-US-06 - Watch an auction and open My Auctions from the toast

- **GIVEN** a signed-in collector on a lot's page who does not watch it and
  has not bid on it
- **WHEN** they watch it and Grade10 records the watch
- **THEN** a toast says email alerts are on for this auction
- **AND** the toast offers **View My Auctions**, which opens My Auctions

<!-- trace:scenario id=g10.auction-listing-page.SC-15a rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-15 - Unwatch announces and can be undone
**Serves:** grade10-site-auction-listing-page-US-07 - Unwatch from the auction and undo

- **GIVEN** a signed-in collector on a lot's page who watches it and has not
  bid on it
- **WHEN** they unwatch it and Grade10 records the removal
- **THEN** a toast says the auction is unwatched and email alerts for it are off
- **AND** Undo puts the listing back on My Auctions without opening the lot
  again

### Requirement: A first bid on the lot announces alerts once

The bid that bookmarks a lot shows the alerts toast once, and later visits stay
quiet.

**Once per listing per collector** - When a signed-in collector's bid bookmarks
a lot (auto-watch), Grade10 SHALL announce that email alerts are on for that
lot **at most once per listing per collector**, recorded on the account.

**When** - The announcement SHALL happen when that bid bookmarks the lot.

**Later visits** - Later visits to the lot page SHALL NOT show that toast again
for the same collector and listing.

<!-- trace:scenario id=g10.auction-listing-page.SC-arf rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-16 - The first bid toast fires once
**Serves:** grade10-site-auction-listing-page-US-08 - After bidding, Watching stays locked

- **GIVEN** a signed-in collector who has never been shown the bid-alerts
  toast for listing L
- **WHEN** their bid bookmarks L
- **THEN** a toast says email alerts are on for this auction
- **AND** Grade10 records that the toast was shown for that collector and L

<!-- trace:scenario id=g10.auction-listing-page.SC-bs7 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-17 - A later visit stays quiet
**Serves:** grade10-site-auction-listing-page-US-08 - After bidding, Watching stays locked

- **GIVEN** a signed-in collector for whom Grade10 already recorded the
  bid-alerts toast for listing L
- **WHEN** they open L's page again
- **THEN** that toast does not appear

### Requirement: A lot page follows the lot live

While a lot page is open, it SHALL show each committed bid, extension and close
on its lot without a reload: the current bid, the bid count, the recent bids
and the recorded close. An extension SHALL restart the countdown toward the
new recorded close at once, labelled Extended bidding. A page that cannot hold
a live connection SHALL catch up by polling.

When a committed change raises the lot's version, the page SHALL read the
signed-in viewer's own standing again, so Outbid and the minimum next valid
bid show without a reload. The standing comes from that viewer's own read;
live updates stay anonymous.

<!-- trace:scenario id=g10.auction-listing-page.SC-o37 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-29 - Another page's bid shows without a reload
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** two collectors with the same open lot's page open
- **WHEN** one places a bid that is accepted
- **THEN** the other's page shows the new current bid, bid count and recent
  bids without a reload

<!-- trace:scenario id=g10.auction-listing-page.SC-ohm rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-30 - An extension restarts the countdown
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a collector on the page of a lot in extended bidding
- **WHEN** a price-moving bid from another page sets a later recorded close
- **THEN** the countdown counts to the new recorded close at once, labelled
  Extended bidding, without a reload

<!-- trace:scenario id=g10.auction-listing-page.SC-b9n rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-31 - The scheduled close shows Extended bidding
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a collector on the page of a lot with an accepted bid and extended
  bidding on
- **WHEN** its scheduled close passes
- **THEN** the page shows Extended bidding and counts to the new recorded
  close
- **AND** it shows no result

<!-- trace:scenario id=g10.auction-listing-page.SC-sux rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-32 - A page without a live connection catches up
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a collector on an open lot's page that cannot open a live
  connection
- **WHEN** a bid from another page is accepted
- **THEN** the page shows the new current bid on its next poll, without a
  reload

<!-- trace:scenario id=g10.auction-listing-page.SC-2d0 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-41 - A page that lost its live connection catches up when it returns
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a collector on an open lot's page whose live connection dropped
- **WHEN** a bid from another page is accepted, and the connection then
  returns
- **THEN** the page shows the new current bid and bid count without a reload

<!-- trace:scenario id=g10.auction-listing-page.SC-7c2 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-43 - A leader outbid from another page reads Outbid without a reload
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a signed-in bidder leading an open `HKD` lot at 120000 minor units,
  with its page open
- **WHEN** another bidder's bid of 130000 minor units is accepted from another
  page
- **THEN** the bidder's page shows the current bid 130000 minor units and their
  standing Outbid, with 134000 minor units as the minimum next valid bid,
  without a reload
- **AND** the live update that reached the page names neither bidder

### Requirement: A lot counts down on the auction service's clock

A lot page SHALL count down on the auction service's clock, never the
device's. It SHALL read that clock when it opens and again after the device
sleeps, after its live connection reconnects, and when the collector returns
to the tab. A correction of less than one second SHALL NOT make a displayed
countdown go up.

A countdown SHALL round up to the whole second, so it reads 0 only once the
deadline has passed. It SHALL show whole seconds only, the last 10 seconds
included.

<!-- trace:scenario id=g10.auction-listing-page.SC-9c0 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-33 - A wrong device clock shows the right time left
**Serves:** grade10-site-auction-listing-page-US-13 - Collector reads the same time left as every other page

- **GIVEN** two devices on the same lot's page, one whose clock is 5 minutes
  fast
- **WHEN** both pages show the countdown
- **THEN** both show the same whole seconds left

<!-- trace:scenario id=g10.auction-listing-page.SC-60y rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-34 - The last second does not read 0
**Serves:** grade10-site-auction-listing-page-US-13 - Collector reads the same time left as every other page

- **GIVEN** a lot page whose deadline is 0.4 seconds away on the auction
  service's clock
- **WHEN** the countdown shows
- **THEN** it reads 1 second

<!-- trace:scenario id=g10.auction-listing-page.SC-v0i rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-35 - A return to the tab reads the clock again
**Serves:** grade10-site-auction-listing-page-US-13 - Collector reads the same time left as every other page

- **GIVEN** a lot page in a tab left in the background while the device slept
- **WHEN** the collector returns to the tab
- **THEN** the page reads the auction service's clock again and the countdown
  shows the time left on it

<!-- trace:scenario id=g10.auction-listing-page.SC-7y3 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-36 - A small correction never adds time
**Serves:** grade10-site-auction-listing-page-US-13 - Collector reads the same time left as every other page

- **GIVEN** a lot page whose countdown reads 30 seconds
- **WHEN** a new reading of the service clock moves it back by 0.5 seconds
- **THEN** the countdown does not read more than 30 seconds

<!-- trace:scenario id=g10.auction-listing-page.SC-qxe rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-44 - The last seconds count in whole seconds
**Serves:** grade10-site-auction-listing-page-US-13 - Collector reads the same time left as every other page

- **GIVEN** a lot page whose deadline is 9.5 seconds away on the auction
  service's clock
- **WHEN** the countdown shows, and again 6.4 seconds later
- **THEN** it reads 10 seconds, then 4 seconds
- **AND** it never shows tenths of a second

### Requirement: A lot reads Closed until its close is recorded, then its result

Past the lot's effective close and until its close is recorded, the page SHALL
show the existing Closed state with no result, the current bid as it stood,
and the bid controls disabled. It SHALL NOT work out a result from its own
clock. Once the close is recorded, the page SHALL show the recorded result.
When a later recorded close arrives instead, the page SHALL return to Extended
bidding.

| Viewer | Recorded result | Shows |
| --- | --- | --- |
| The winner | Sold | Won |
| Another bidder | Sold | Did not win |
| Anyone else | Sold | The winning bid |
| Anyone | No winner | Ended, with No bids under it |

The page SHALL use only existing words for the moments around the close:

| Moment | Words |
| --- | --- |
| A bid refused as placed at or after the close | Your bid did not go through. - the bid form's own words for that refusal, under the bid action |
| A price-moving bid extends the lot | Extended bidding |

<!-- trace:scenario id=g10.auction-listing-page.SC-rgt rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-37 - The winner reads Closed, then Won
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a bidder leading a lot on its page
- **WHEN** the effective close passes and the close is recorded later
- **THEN** until it is recorded the page shows Closed with no result, and
  never Ended or Did not win
- **AND** once it is recorded the page shows Won, without a reload

<!-- trace:scenario id=g10.auction-listing-page.SC-76f rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-38 - A losing bidder reads Did not win from the record
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a bidder who was outbid on a lot whose page they have open
- **WHEN** the close is recorded with another winner
- **THEN** the page shows Did not win, without a reload

#### Scenario: grade10-site-auction-listing-page-SC-40 - No new state appears between the close and the result
**Serves:** `Close and result` - the page between the effective close and the recorded close

- **GIVEN** a lot page past the effective close with the close not yet
  recorded
- **WHEN** the page shows the lot
- **THEN** its status reads Closed with no result, and no label names a
  closing or final-deadline state

<!-- trace:scenario id=g10.auction-listing-page.SC-ygz rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-42 - A later close returns the page to Extended bidding
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a lot page showing Closed with no result past the deadline it
  counted to
- **WHEN** a later recorded close arrives for that lot
- **THEN** the page shows Extended bidding and counts to the later close
- **AND** its bid controls are enabled again

<!-- trace:scenario id=g10.auction-listing-page.SC-31a rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-45 - A bid at the close reads only that it did not go through
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a bidder on the page of a lot whose effective close has just passed,
  before the page has disabled its bid controls
- **WHEN** they place a bid and Grade10 refuses it as past the close
- **THEN** the bid form shows Your bid did not go through. under the bid
  action, and no other words about the bid

<!-- trace:scenario id=g10.auction-listing-page.SC-45u rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-47 - A lot nobody bid on reads Ended with No bids
**Serves:** grade10-site-auction-listing-page-US-14 - a collector with the page open waits on a lot that took no bid

- **GIVEN** a lot with no accepted bid, its page open
- **WHEN** the close is recorded with no winner
- **THEN** the page shows Closed, then Ended with No bids under it, without a
  reload
- **AND** it shows neither Won nor Did not win

### Requirement: Recent bids crown the closed winner and explain a tied maximum

The lot page SHALL set the public Recent bids flags that
`shared/ui/auction-listing` draws, from the lot's own bids.

- **Winner** - once the lot's close is recorded as sold, the won public row
  carries `isWinner`; no other row does, and no row on a lot that is live,
  Closed without a result, or ended without a winner.
- **Tied maximum** - public rows with the same amount are listed in the
  order their maximums were set: the leading or won row first, then the row
  whose bidder set that maximum earlier, and that order holds once both are
  outbid. A row carries `samePricePriority` when another row with its amount
  is listed above it. This holds at the current price and at any older tie
  lower down.
- **Copy** - the page supplies the winner name and the equal-max tip in the
  collector's language.

<!-- trace:scenario id=g10.auction-listing-page.SC-kwb rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-48 - A sold lot crowns its winning bid
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a lot whose close is recorded as sold to customer A
- **WHEN** a collector reads its Recent bids
- **THEN** customer A's winning row shows a crown named Winner after the amount
- **AND** no other row shows a crown
- **AND** the same lot read while live showed no crown on any row

<!-- trace:scenario id=g10.auction-listing-page.SC-c97 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-49 - A tied maximum that came second carries the tip
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a live lot where customer B's maximum matched customer A's earlier maximum, so both public rows show the same amount and customer A leads
- **WHEN** a collector reads its Recent bids
- **THEN** customer B's row carries the Info tip saying that when maximums match, the earlier one leads
- **AND** customer A's leading row carries no tip

<!-- trace:scenario id=g10.auction-listing-page.SC-xz7 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-50 - A lot without a winner crowns no bid
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a lot past its close whose result is not yet recorded, and a lot whose close is recorded with no winner
- **WHEN** a collector reads each lot's Recent bids
- **THEN** no row on either lot shows a crown

<!-- trace:scenario id=g10.auction-listing-page.SC-s2c rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-51 - An older tie lower down keeps its tip
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a live lot whose Recent bids hold two rows tied at an amount below the current price, from customer A's earlier maximum and customer B's later one
- **WHEN** a collector reads its Recent bids
- **THEN** customer B's row at that amount carries the Info tip
- **AND** customer A's row at that amount carries none

### Requirement: The listing code is only exposed through the canonical address

Every listing carries a stable opaque listing code, allocated on its first
saved draft. A generated canonical address ends with that code in lower case;
the public page does not make the code a separate field or an alternate route.

- **Canonical address** - A listing that keeps its generated slug SHALL answer
  at `/auction/listings/<normalized title>-<lowercase code>`. The canonical
  URL and `og:url` SHALL use that address.
- **No separate field** - The server-rendered page, embedded state,
  client-fetched data, visible page fields, `og:title`, `og:description`, page
  title and meta description SHALL NOT expose a labelled listing-code or
  payment-reference field. A previously cached preview MAY persist; Grade10
  provides no purge or regeneration guarantee.
- **Sitemap** - No sitemap entry SHALL expose a listing-code field.
- **Not-found response** - The response for an address naming no listing or a
  draft lot SHALL NOT contain the listing code, including in any error detail.
- **Does not resolve as an address** - The listing code SHALL NOT work as an
  alternate way to reach the lot's address; fetching the auction's
  lot-address path with the listing code in place of the lot's own address
  SHALL answer the same as any address naming no published lot.
- **Called-off direct address** - Calling a listing off SHALL remove it from
  browse and search while its canonical address remains directly accessible.
  The listing code SHALL remain a non-route and SHALL NOT be accepted as the
  public address. Explicit hard deletion is outside this change; this
  requirement does not state what its page does.
- **Stays true once an order exists** - Once the code becomes the order's
  payment reference on other surfaces, this capability SHALL continue to
  expose it only through the canonical URL suffix.

#### Scenario: grade10-site-auction-listing-page-SC-20 - The served response uses the generated canonical address
**Serves:** Public identifier - the collector opens the code-backed canonical address without receiving a separate identifier field

- **GIVEN** a published lot with generated slug `charizard-psa-10-lk423`
- **WHEN** its address is fetched and no script executes
- **THEN** the canonical address is `/auction/listings/charizard-psa-10-lk423`
- **AND** the response exposes no labelled listing-code or payment-reference field

<!-- trace:scenario id=g10.auction-listing-page.SC-oq9 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-21 - A shared lot preview uses the canonical address
**Serves:** grade10-site-auction-listing-page-US-10 - Collector shares the lot by its title and canonical URL

- **GIVEN** a published lot with generated slug `charizard-psa-10-lk423`
- **WHEN** a preview fetcher reads the lot's address
- **THEN** `og:url` is `/auction/listings/charizard-psa-10-lk423`
- **AND** `og:title`, `og:description`, the page title and meta description contain no labelled listing-code or payment-reference field

#### Scenario: grade10-site-auction-listing-page-SC-22 - Client-fetched lot data carries no separate listing code
**Serves:** Public identifier - the page does not expose the code as data apart from its canonical address

- **GIVEN** a published lot with its listing code allocated
- **WHEN** scripts finish loading and the page's client code requests lot
  data over the network
- **THEN** no response body carries a separate listing-code or payment-reference field

<!-- trace:scenario id=g10.auction-listing-page.SC-51n rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-23 - Support resolves a lot from its title alone
**Serves:** grade10-site-auction-listing-page-US-11 - Collector contacts support about a lot and is identified by title, not a code neither of them has

- **GIVEN** a collector contacting support about a published lot
- **WHEN** support looks up the lot the collector names
- **THEN** support identifies it from the lot's title and address
- **AND** neither the collector nor support needs or is shown the listing
  code to do so

#### Scenario: grade10-site-auction-listing-page-SC-24 - A not-found response carries no listing code
**Serves:** Public identifier - the guard extending to the refusal path, not only lots that resolve

- **GIVEN** an address under the auction's lots naming no published lot
- **WHEN** the address is fetched
- **THEN** the response is the site's Page not found screen
- **AND** nothing in the response, including any error detail, names a
  listing code

#### Scenario: grade10-site-auction-listing-page-SC-25 - The page does not display the listing code once scripts run
**Serves:** Public identifier - the page keeps the code out of labelled collector-facing fields after scripts finish

- **GIVEN** a published lot's generated canonical address
- **WHEN** scripts finish running
- **THEN** the same lot remains on screen with its served title, description
  and standing
- **AND** neither the rendered page nor its current source contains a labelled listing-code or payment-reference field

#### Scenario: grade10-site-auction-listing-page-SC-26 - A listing code does not resolve as a lot address
**Serves:** Public identifier - the guard against the code working as another way to reach or identify a lot

- **GIVEN** a published lot with its listing code allocated
- **WHEN** the auction's lot-address path is fetched with that listing code
  in place of the lot's own address
- **THEN** the response answers the same as any address naming no published
  lot
- **AND** the site's not-found screen is shown, not that lot's page

<!-- trace:scenario id=g10.auction-listing-page.SC-dc3 rev=1 -->
#### Scenario: grade10-site-auction-listing-page-SC-27 - A public listing keeps the code out of labelled fields once an order exists
**Serves:** grade10-site-auction-listing-page-US-11 - Collector contacts support about a won lot without a separate code field on the listing page

- **GIVEN** a lot whose auction closed with a winning bid, so an order now
  exists on it
- **WHEN** its address is fetched on grade10-site
- **THEN** the response and share preview use the canonical address
- **AND** neither the response, its share preview, nor any client-fetched
  data carries a labelled listing-code or payment-reference field

#### Scenario: grade10-site-auction-listing-page-SC-28 - A called-off listing keeps its canonical address
**Serves:** Public identifier - the canonical address remains usable after the lot leaves browse and search

- **GIVEN** a listing whose code and canonical address were allocated
- **WHEN** the listing is called off before close and its canonical address is
  opened directly
- **THEN** the address still resolves to that listing
- **AND** the listing is absent from browse and search
- **AND** substituting the listing code for the canonical address does not
  resolve the listing
