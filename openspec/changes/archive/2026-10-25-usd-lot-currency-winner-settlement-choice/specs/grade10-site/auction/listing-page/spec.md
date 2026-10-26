# grade10-site/auction/listing-page Specification

## MODIFIED Requirements

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

<!-- trace:scenario id=g10.auction-listing-page.SC-7c2 rev=2 -->
#### Scenario: grade10-site-auction-listing-page-SC-43 - A leader outbid from another page reads Outbid without a reload
**Serves:** grade10-site-auction-listing-page-US-12 - Collector sees another bid on the lot without reloading

- **GIVEN** a signed-in bidder leading an open `USD` lot at 120000 minor units,
  with its page open
- **WHEN** another bidder's bid of 130000 minor units is accepted from another
  page
- **THEN** the bidder's page shows the current bid 130000 minor units and their
  standing Outbid, with 132500 minor units as the minimum next valid bid,
  without a reload
- **AND** the live update that reached the page names neither bidder
