# grade10-site/auction/availability Specification

## Purpose

Decides, per request, whether the collector's region offers auctions, and
answers a restricted region three ways: no auction entry point renders, a
direct auction address answers the restriction page, and an auction action
is refused before it reaches the auction.

## Feature set

- Region judgement
  - Per-request verdict: each request judged on its observed region, never
    carried from an earlier request
  - Missing signal: a request the region cannot be judged for is treated as
    unrestricted
- Hidden auction surfaces
  - Navigation: the Auction item absent from primary navigation and the
    compact drawer
  - Account menu: no auction entry - My Auctions, watchlist, auction orders
  - Watch controls: none rendered on any surface
- Restricted page
  - Direct auction address: the catalogue, a lot, My Auctions or the bidding
    history answers the restriction page
  - Page content: names the restriction and links the store
- Refused auction actions
  - Mutations refused: bids, auto-bids, card enrollment and watches from a
    restricted region never reach the auction
  - Reads refused: the catalogue, a lot, a standing, the bid record and the
    live channel
- Commitments already made
  - Settling: a winner order, its invoice and its payment stay reachable
  - Withdrawing: unwatching and muting alerts stay open
- Unaffected surfaces
  - Non-auction pages: the store and every other surface render unchanged

## Requirements

### Requirement: Each request is judged on its own observed region

The application SHALL judge whether a request may reach auction surfaces
from the region signal the edge supplies for that request, and SHALL NOT
carry the verdict from an earlier request or session state.

A request whose region signal is missing or unreadable SHALL be treated as
unrestricted.

<!-- trace:scenario id=grade10-site-auction-availability.SC-01 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-01 - Restricted request judged at the edge
**Serves:** grade10-site-auction-availability-US-01 - the collector reaches the site from a restricted region

- **WHEN** a request arrives whose observed region is one where auctions are
  not offered
- **THEN** the request SHALL be judged restricted before any page or action
  is answered

<!-- trace:scenario id=grade10-site-auction-availability.SC-02 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-02 - A moved collector is re-judged
**Serves:** grade10-site-auction-availability-US-01 - the verdict follows the request's region, not the collector

- **GIVEN** a collector whose earlier request was judged restricted
- **WHEN** their next request arrives from an unrestricted region
- **THEN** that request SHALL be answered as unrestricted

<!-- trace:scenario id=grade10-site-auction-availability.SC-03 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-03 - Missing signal fails open
**Serves:** Region judgement - a lookup fault must not lock out unrestricted collectors

- **WHEN** a request arrives with no readable region signal
- **THEN** the request SHALL be answered as unrestricted

### Requirement: A restricted request renders no auction entry point

A response to a restricted request SHALL render none of these auction
surfaces:

| Surface | Absent entries |
| --- | --- |
| Primary navigation and compact drawer | The Auction item |
| Account menu | My Auctions, watchlist and auction order entries |
| Any page | Watch controls, bid panels, auction links and banners |

Non-auction entries on the same surface SHALL render unchanged.

<!-- trace:scenario id=grade10-site-auction-availability.SC-04 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-04 - Navigation hides Auction
**Serves:** grade10-site-auction-availability-US-01 - nothing in the chrome advertises what the region cannot have

- **WHEN** a page is rendered for a restricted request
- **THEN** the Auction item SHALL be absent from the primary navigation and
  the compact drawer, and every non-auction item SHALL be present

<!-- trace:scenario id=grade10-site-auction-availability.SC-05 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-05 - Account menu hides auction entries
**Serves:** grade10-site-auction-availability-US-01 - the signed-in menu holds no auction doors

- **WHEN** the account menu is rendered for a restricted request from a
  signed-in collector
- **THEN** My Auctions, watchlist and auction order entries SHALL be absent

<!-- trace:scenario id=grade10-site-auction-availability.SC-06 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-06 - No watch or bid control renders
**Serves:** grade10-site-auction-availability-US-01 - no surface offers an action that would be refused

- **WHEN** any page is rendered for a restricted request
- **THEN** no watch control, bid panel or auction call-to-action SHALL
  render

### Requirement: A direct auction address answers the restriction page

A restricted request for an auction address — the catalogue, a lot page,
My Auctions or the bidding history — SHALL be answered by the restriction
page, never by the auction surface and never by the not-found surface.

A winner order and its invoice SHALL NOT be answered by the restriction page:
a collector who has already won settles from any region.

The restriction page SHALL state that auctions are not available in the
collector's region and SHALL offer a link to the store.

<!-- trace:scenario id=grade10-site-auction-availability.SC-07 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-07 - Direct catalogue visit
**Serves:** grade10-site-auction-availability-US-02 - the shared link lands on an answer, not a void

- **WHEN** a restricted request asks for the auction catalogue
- **THEN** it SHALL be answered by the restriction page

<!-- trace:scenario id=grade10-site-auction-availability.SC-08 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-08 - Direct lot or account visit
**Serves:** grade10-site-auction-availability-US-02 - an emailed link resolves to the same answer

- **WHEN** a restricted request asks for a lot page, My Auctions or the
  bidding history
- **THEN** it SHALL be answered by the restriction page

<!-- trace:scenario id=grade10-site-auction-availability.SC-08a rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-08a - A winner settles from a restricted region
**Serves:** grade10-site-auction-availability-US-03 - money already committed is never stranded

- **WHEN** a restricted request from the winner asks for their winner order
  or its invoice, or sends its address, payment or proof
- **THEN** it SHALL be answered as it is for any winner

<!-- trace:scenario id=grade10-site-auction-availability.SC-09 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-09 - The page names the restriction
**Serves:** grade10-site-auction-availability-US-02 - the collector reads why, and where they can still go

- **WHEN** the restriction page renders
- **THEN** it SHALL state that auctions are not available in the
  collector's region and SHALL offer a link to the store

### Requirement: An auction action from a restricted region is refused

A bid, auto-bid, card enrollment or watch arriving from a restricted region
SHALL be refused before it reaches the auction, and SHALL record no
commitment: no bid, no watch, no enrollment. An auction data read serving an
auction surface — the catalogue, a lot read, a standing read, the bid record,
a live-update channel — SHALL be refused the same way.

An unwatch and an alert mute SHALL be answered as for any collector, so a
commitment can be withdrawn from anywhere. One public read, whether the
request's region is offered auctions, SHALL be answered to every region.

<!-- trace:scenario id=grade10-site-auction-availability.SC-10 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-10 - A sent bid is refused
**Serves:** grade10-site-auction-availability-US-03 - hidden controls are never the only barrier

- **WHEN** a bid or auto-bid arrives from a restricted region
- **THEN** it SHALL be refused, and the lot's price, leader and maximums
  SHALL NOT change

<!-- trace:scenario id=grade10-site-auction-availability.SC-11 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-11 - A sent watch or order action is refused
**Serves:** grade10-site-auction-availability-US-03 - no commitment recorded that cannot be settled

- **WHEN** a watch arrives from a restricted region
- **THEN** it SHALL be refused, and no watch SHALL be recorded

<!-- trace:scenario id=grade10-site-auction-availability.SC-11b rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-11b - An unwatch from a restricted region is answered
**Serves:** grade10-site-auction-availability-US-03 - withdrawing a commitment is never refused

- **WHEN** an unwatch or an alert mute arrives from a restricted region
- **THEN** it SHALL be answered as it is for any collector

<!-- trace:scenario id=grade10-site-auction-availability.SC-11a rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-11a - An auction read is refused
**Serves:** grade10-site-auction-availability-US-03 - a channel opened by hand carries no auction data

- **WHEN** an auction data read or live-update channel is requested from a
  restricted region
- **THEN** it SHALL be refused, and no lot, standing or order data SHALL be
  returned

### Requirement: Non-auction surfaces are unaffected

A restricted request for a non-auction page SHALL be answered as it is for
any collector, and an unrestricted request SHALL see every auction surface
as it is today.

<!-- trace:scenario id=grade10-site-auction-availability.SC-12 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-12 - The store is unchanged
**Serves:** grade10-site-auction-availability-US-01 - the restriction costs only what cannot be offered

- **WHEN** a restricted request asks for a store or other non-auction page
- **THEN** the page SHALL render as it does for an unrestricted request,
  less the auction entries the chrome hides

<!-- trace:scenario id=grade10-site-auction-availability.SC-13 rev=1 -->
#### Scenario: grade10-site-auction-availability-SC-13 - An unrestricted collector sees everything
**Serves:** grade10-site-auction-availability-US-04 - a rule meant for other regions never touches them

- **WHEN** an unrestricted request asks for any auction surface
- **THEN** it SHALL be answered exactly as before this change
