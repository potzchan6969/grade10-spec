## Purpose

Grade10's card-auction capability lets collectors browse an Auction listing and
place a bid on their card on file within its scheduled window, closes each
listing at its effective close, and relays every committed change to the pages
open on it. A **listing** is the sole customer-facing term for one auctioned
card.

## Feature set

- Refused attempts
  - Said on the bid form: refusals show inline in existing words except an above-ceiling response, which shows no maximum-bid message, automatic retry or response-driven field reset

## MODIFIED Requirements

### Requirement: A refused bid places nothing

A bid Grade10 refuses SHALL place nothing. It SHALL write no bid, no standing,
no bidding-history entry and no My Auctions row, and SHALL move nothing: not
the price, the leader, the close, the bid count, any bidder's maximum or row,
nor the listing's version, so no open page is sent an update. A bid refused
past the effective close starts the close after it is answered, under "A due
lot is settled at its close"; that close moves the version, and the refusal
does not. The bidder's record SHALL never show a refused attempt.

The bid form SHALL say why under the bid action, in the words below, and
nowhere else: never in a toast, and never in the words the server sent. An
above-ceiling response SHALL show no maximum-bid message or generic refusal
message, SHALL NOT reset the custom field from the response, and SHALL NOT
automatically retry.

| Refused when | Code | The bid form says |
| --- | --- | --- |
| The amount is not a whole count of minor units above zero, checked by the bid form before it sends | None: the request is never sent | Enter a valid amount. |
| At or above the identity bar without a verified identity, at the storefront | `IDENTITY_REQUIRED` | Bids this high need a verified identity. Verify from your account, then bid again. |
| Below the minimum next bid | `AMOUNT_TOO_LOW` | Minimum bid is {amount}. with the minimum next bid |
| Above the currency's ceiling | `AMOUNT_TOO_HIGH` | No message |
| Not above the bidder's own maximum on the listing | `MAXIMUM_NOT_RAISED` | Your new maximum must be higher than your current one. |
| No linked card, or the bidder was never registered with one | `PAYMENT_METHOD_REQUIRED`, `NOT_REGISTERED` | Link a card to bid. |
| Another card after the first accepted bid on the listing | `PAYMENT_METHOD_REFUSED` | This listing's card is locked after the first accepted bid. |
| Bidding is suspended on the account | `SUSPENDED` | Bidding is suspended on this account. Contact Us to resolve it. |
| The account is banned from bidding | `BANNED` | This account cannot bid. |
| Before the start or at or after the effective close, an unknown listing, another currency, an erased bidder, or a refusal with no row above | `NOT_BIDDABLE`, `LISTING_NOT_FOUND`, `CURRENCY_MISMATCH`, `BIDDER_DELETED` | Your bid did not go through. |

The auction's request schema refuses an amount that is not a whole count of
minor units above zero before `INVALID_AMOUNT` can be answered, so the bid form
never shows that code. Where several refusals apply, the first in this order
answers: unknown listing, not biddable, not registered, suspended, banned, erased
bidder, another currency, above the ceiling, maximum not raised, below the
minimum, no card, another card. The storefront answers the identity bar before
the auction hears of the bid.

Each refusal the auction service answers SHALL be one structured operational
log entry at the auction service, naming the bidder, the listing, the code, the
maximum sent and, where the refusal names one, the floor or the ceiling: the
minimum next bid or the currency's highest maximum. The entry is for operators and SHALL NOT reach the bidder's record.

<!-- trace:scenario id=g10.auction-auction.SC-rl3 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-89 - A refused first bid leaves no trace
**Serves:** grade10-site-auction-auction-US-14 - a collector's first bid on a lot is refused because the price moved

- **GIVEN** an open `HKD` listing at a current bid of 120000 HKD minor units,
  whose minimum next bid is 124000 HKD minor units, and a collector with a
  linked card and no bid on it
- **WHEN** they submit a maximum of 122000 HKD minor units
- **THEN** the bid form says Minimum bid is {amount}. with 124000 HKD minor
  units
- **AND** the listing is on neither their My Auctions nor their bidding
  history
- **AND** the current bid, the leader and the bid count are unchanged

<!-- trace:scenario id=g10.auction-auction.SC-lu0 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-90 - An Outbid bidder's refused raise leaves their row where it was
**Serves:** grade10-site-auction-auction-US-14 - an Outbid bidder's raise is refused because the price moved

- **GIVEN** bidder B, Outbid with a maximum of 110000 HKD minor units on an
  open `HKD` listing whose minimum next bid is 124000 HKD minor units
- **WHEN** B submits a maximum of 122000 HKD minor units
- **THEN** the bid form says Minimum bid is {amount}. with 124000 HKD minor
  units
- **AND** B's My Auctions row still reads Outbid, in the same place
- **AND** B's maximum stays 110000 HKD minor units and their bidding history
  gains no entry

<!-- trace:scenario id=g10.auction-auction.SC-fnt rev=2 -->
#### Scenario: grade10-site-auction-auction-SC-91 - Each refusal reads in its own words
**Serves:** grade10-site-auction-auction-US-14 - the bidder reads why a bid was refused

- **WHEN** a bid is refused for any reason the refusal table names
- **THEN** the bid form shows that row's words under the bid action, except
  an above-ceiling response, which shows no message
- **AND** no toast opens

<!-- trace:scenario id=g10.auction-auction.SC-nh5 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-92 - The server's words never reach the bid form
**Serves:** grade10-site-auction-auction-US-14 - a refusal the bid form has no words of its own for

- **WHEN** the auction refuses a bid with a code the table gives no words of
  its own, or with a message of its own
- **THEN** the bid form says Your bid did not go through.
- **AND** none of the server's message shows

<!-- trace:scenario id=g10.auction-auction.SC-ulv rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-93 - A refusal is kept for operators only
**Serves:** grade10-site-auction-auction-US-14 - an operator reads a refusal the bidder's record never shows

- **GIVEN** the refused first bid of `grade10-site-auction-auction-SC-89`
- **WHEN** the auction service answers the refusal
- **THEN** it writes one operational log entry naming the bidder, the listing,
  `AMOUNT_TOO_LOW`, 122000 HKD minor units sent and a floor of 124000 HKD minor
  units
- **AND** nothing of the refusal reaches the bidder's record, bidding history
  or My Auctions
<!-- trace:scenario id=g10.auction-auction.SC-cfg rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-103 - A defensive above-ceiling answer shows no message

**Serves:** grade10-site-auction-auction-US-14 - the bidder reviews their amount after a defensive refusal

- **GIVEN** an open listing and a bidder reviewing a custom maximum
- **WHEN** the service answers `AMOUNT_TOO_HIGH`, with or without a ceiling or a server message
- **THEN** no maximum-bid message, generic refusal message or toast appears
- **AND** the response does not reset the custom draft or submit another attempt
- **AND** the refused bid leaves every record and listing fact unchanged as required above
