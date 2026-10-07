# grade10-site/auction/notifications Specification

## Feature set

- House participation
  - Ordinary letters: collectors outbid by the house, or losing to it, get the letters they would get from a collector
  - Watched sold: watchers of a lot the house wins get the sold letter
  - House never mailed: no letter is addressed to the house

## ADDED Requirements

### Requirement: The house is mailed about nothing, and its bids mail collectors as any bid does

For every message in this capability, a bid placed for the house under
`grade10-site/auction/auto-bidding` SHALL count as a bid by another bidder,
and a lot the house wins under `grade10-site/auction/auction` SHALL count as
a lot that closes with a winner who is not the recipient:

- **Bid activity** - a collector the house outbids SHALL get the outbid
  letter, and other enrolled bidders the new-bid letter, as for a collector's
  bid.
- **Close** - enrolled bidders SHALL get the did-not-win letter and enrolled
  watch-only collectors the watched sold letter, each naming the winning bid
  when it is supplied.
- **No public bid, no letter** - a lower of the house maximum, and a house
  maximum that is not placed, write no public bid and SHALL send no letter.
- **The house** - Grade10 SHALL address no letter of this capability, and no
  winner letter of `grade10-site/auction/notifications-order`, to the house.

No letter SHALL say or imply that a bid, a lead or a win was the house's.

<!-- trace:scenario id=g10.auction-notifications.SC-kl5 rev=1 -->
#### Scenario: grade10-site-auction-notifications-SC-49 - A collector outbid by the house gets the outbid letter
**Serves:** grade10-site-auction-notifications-US-03 - a collector the house outbids hears as usual and can raise

- **GIVEN** a collector who leads a lot with email alerts on
- **WHEN** the house's committed maximum takes the lead from them
- **THEN** Grade10 sends them the outbid letter it sends when a collector
  takes the lead
- **AND** the letter does not say the new leader is the house

<!-- trace:scenario id=g10.auction-notifications.SC-xy1 rev=1 -->
#### Scenario: grade10-site-auction-notifications-SC-50 - A bidder who lost to the house gets the did-not-win letter
**Serves:** grade10-site-auction-notifications-US-06 - a collector who lost to the house hears the lot closed

- **GIVEN** a collector who bid 30000 HKD minor units on a lot with email
  alerts on
- **AND** the lot closes with the house leading at 31000 HKD minor units
- **WHEN** Grade10 sends close-outcome mail for that lot
- **THEN** it sends them the did-not-win letter (campaign
  `lot_closed_didnt_win`), naming a winning bid of 31000 and their bid of
  30000 HKD minor units

<!-- trace:scenario id=g10.auction-notifications.SC-14x rev=1 -->
#### Scenario: grade10-site-auction-notifications-SC-51 - A watcher of a lot the house won gets the watched sold letter
**Serves:** grade10-site-auction-notifications-US-07 - a watcher hears a lot the house won ended sold

- **GIVEN** a collector who watches a lot with email alerts on and never bid
- **AND** the lot closes with the house leading at 31000 HKD minor units
- **WHEN** Grade10 sends close-outcome mail for that lot
- **THEN** it sends them the watched sold letter (campaign
  `lot_watched_sold`) naming Sold for 31000 HKD minor units
- **AND** it does not send them the watched ended letter

<!-- trace:scenario id=g10.auction-notifications.SC-9dh rev=1 -->
#### Scenario: grade10-site-auction-notifications-SC-52 - No letter is addressed to the house
**Serves:** House participation - every letter a lot owes is sent and none reaches the house

- **GIVEN** a lot where the house was outbid, then led, then won at its close
- **WHEN** Grade10 sends every bid-activity, close-outcome and winner letter
  that lot owes
- **THEN** no letter is addressed to the house
- **AND** no auction-won or setup letter is sent for the lot

<!-- trace:scenario id=g10.auction-notifications.SC-mma rev=1 -->
#### Scenario: grade10-site-auction-notifications-SC-53 - A bidder hears the new-bid letter when the house bids
**Serves:** grade10-site-auction-notifications-US-04 - a collector who bid hears the lot moved, whoever moved it

- **GIVEN** a lot where collector A leads and collector B, outbid earlier,
  has email alerts on
- **WHEN** the house's committed maximum places a bid on the lot
- **THEN** Grade10 sends B the new-bid letter it sends when a collector bids
- **AND** the letter does not say the bid is the house's

<!-- trace:scenario id=g10.auction-notifications.SC-mnu rev=1 -->
#### Scenario: grade10-site-auction-notifications-SC-54 - A house lower or a house maximum not placed mails nobody
**Serves:** House participation - bidders hear only of bids they could see

- **GIVEN** two lots, each with enrolled bidders and watchers who have email
  alerts on
- **WHEN** the house maximum on the first reaches its time short of the
  minimum next bid and is not placed, and the placed house maximum on the
  second is lowered without moving its lead or its price
- **THEN** Grade10 sends no outbid, new-bid or other letter for either lot
