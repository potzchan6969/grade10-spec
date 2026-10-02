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
  - Existing words only: Authorizing… while a payment confirms, Your bid did
    not go through for a bid that did not count, Extended bidding for an
    extension
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

## ADDED Requirements

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

#### Scenario: grade10-site-auction-listing-page-SC-29 - Another page's bid shows without a reload
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** two collectors with the same open lot's page open
- **WHEN** one places a bid that is accepted
- **THEN** the other's page shows the new current bid, bid count and recent
  bids without a reload

#### Scenario: grade10-site-auction-listing-page-SC-30 - An extension restarts the countdown
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a collector on the page of a lot in extended bidding
- **WHEN** a price-moving bid from another page sets a later recorded close
- **THEN** the countdown counts to the new recorded close at once, labelled
  Extended bidding, without a reload

#### Scenario: grade10-site-auction-listing-page-SC-31 - The scheduled close shows Extended bidding
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a collector on the page of a lot with an accepted bid and extended
  bidding on
- **WHEN** its scheduled close passes
- **THEN** the page shows Extended bidding and counts to the new recorded
  close
- **AND** it shows no result

#### Scenario: grade10-site-auction-listing-page-SC-32 - A page without a live connection catches up
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a collector on an open lot's page that cannot open a live
  connection
- **WHEN** a bid from another page is accepted
- **THEN** the page shows the new current bid on its next poll, without a
  reload

#### Scenario: grade10-site-auction-listing-page-SC-41 - A page that lost its live connection catches up when it returns
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a collector on an open lot's page whose live connection dropped
- **WHEN** a bid from another page is accepted, and the connection then
  returns
- **THEN** the page shows the new current bid and bid count without a reload

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

#### Scenario: grade10-site-auction-listing-page-SC-33 - A wrong device clock shows the right time left
**Serves:** grade10-site-auction-listing-page-US-13 - Collector reads the same time left as every other page

- **GIVEN** two devices on the same lot's page, one whose clock is 5 minutes
  fast
- **WHEN** both pages show the countdown
- **THEN** both show the same whole seconds left

#### Scenario: grade10-site-auction-listing-page-SC-34 - The last second does not read 0
**Serves:** grade10-site-auction-listing-page-US-13 - Collector reads the same time left as every other page

- **GIVEN** a lot page whose deadline is 0.4 seconds away on the auction
  service's clock
- **WHEN** the countdown shows
- **THEN** it reads 1 second

#### Scenario: grade10-site-auction-listing-page-SC-35 - A return to the tab reads the clock again
**Serves:** grade10-site-auction-listing-page-US-13 - Collector reads the same time left as every other page

- **GIVEN** a lot page in a tab left in the background while the device slept
- **WHEN** the collector returns to the tab
- **THEN** the page reads the auction service's clock again and the countdown
  shows the time left on it

#### Scenario: grade10-site-auction-listing-page-SC-36 - A small correction never adds time
**Serves:** grade10-site-auction-listing-page-US-13 - Collector reads the same time left as every other page

- **GIVEN** a lot page whose countdown reads 30 seconds
- **WHEN** a new reading of the service clock moves it back by 0.5 seconds
- **THEN** the countdown does not read more than 30 seconds

#### Scenario: grade10-site-auction-listing-page-SC-44 - The last seconds count in whole seconds
**Serves:** grade10-site-auction-listing-page-US-13 - Collector reads the same time left as every other page

- **GIVEN** a lot page whose deadline is 9.5 seconds away on the auction
  service's clock
- **WHEN** the countdown shows, and again 6.4 seconds later
- **THEN** it reads 10 seconds, then 4 seconds
- **AND** it never shows tenths of a second

### Requirement: A lot shows its result only once the close is recorded

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
| A bid's payment is confirming | Authorizing… |
| A bid that did not count: one confirmed after the close, or one placed at or after it | Your bid did not go through, alone, without the sentence that the card was not authorized |
| A price-moving bid extends the lot | Extended bidding |

#### Scenario: grade10-site-auction-listing-page-SC-37 - The winner reads Closed, then Won
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a bidder leading a lot on its page
- **WHEN** the effective close passes and the close is recorded later
- **THEN** until it is recorded the page shows Closed with no result, and
  never Ended or Did not win
- **AND** once it is recorded the page shows Won, without a reload

#### Scenario: grade10-site-auction-listing-page-SC-38 - A losing bidder reads Did not win from the record
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a bidder who was outbid on a lot whose page they have open
- **WHEN** the close is recorded with another winner
- **THEN** the page shows Did not win, without a reload

#### Scenario: grade10-site-auction-listing-page-SC-39 - A bid confirmed after the close did not go through
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a bidder whose bid shows Authorizing… as the lot's effective close
  passes, on a lot another bidder leads
- **WHEN** its payment confirms after the close
- **THEN** the page shows Your bid did not go through, and not that the card
  was not authorized
- **AND** once the close is recorded the page shows Did not win, with the
  current bid as it stood without that bid

#### Scenario: grade10-site-auction-listing-page-SC-40 - No new state appears between the close and the result
**Serves:** `Close and result` - the page between the effective close and the recorded close

- **GIVEN** a lot page past the effective close with the close not yet
  recorded
- **WHEN** the page shows the lot
- **THEN** its status reads Closed with no result, and no label names a
  closing or final-deadline state

#### Scenario: grade10-site-auction-listing-page-SC-42 - A later close returns the page to Extended bidding
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a lot page showing Closed with no result past the deadline it
  counted to
- **WHEN** a later recorded close arrives for that lot
- **THEN** the page shows Extended bidding and counts to the later close
- **AND** its bid controls are enabled again

#### Scenario: grade10-site-auction-listing-page-SC-45 - A bid at the close reads only that it did not go through
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a bidder on the page of a lot whose effective close has just passed,
  before the page has disabled its bid controls
- **WHEN** they place a bid and Grade10 refuses it as past the close
- **THEN** the page shows Your bid did not go through, and not that the card
  was not authorized

#### Scenario: grade10-site-auction-listing-page-SC-46 - A lot with no winner reads Ended with No bids
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a bidder whose lone first bid on a lot was still confirming at its
  scheduled close, with the lot's page open
- **WHEN** the close is recorded with no winner
- **THEN** the page shows Ended, with No bids under it, without a reload
- **AND** it shows neither Won nor Did not win
