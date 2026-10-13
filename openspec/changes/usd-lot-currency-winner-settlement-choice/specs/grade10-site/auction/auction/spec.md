# grade10-site/auction/auction Specification

## Feature set

- Identity bar on a bid
  - US$15,000 bar: a bid of US$15,000 or more is held at the storefront before the auction hears of it
  - USD comparison: every bid and the bar use USD, so the storefront compares them without conversion

## MODIFIED Requirements

### Requirement: A bid at or above the identity bar needs a verified bidder

The storefront that forwards a bid SHALL compare the bid's amount to the
brand's bar before the auction hears of it. The bar is US$15,000, 1500000
minor units in USD; every bid is in USD, so the comparison converts nothing.
At or above the bar it SHALL forward the bid only for a bidder whose standing
is `verified` on the day of the bid, and SHALL otherwise refuse the bid naming
that a verified identity is needed and where to verify, and the auction
records nothing.
Below the bar a bid SHALL ask nothing about identity. On a brand that deploys
no identity store the bar SHALL not exist.

<!-- trace:scenario id=g10.auction-auction.SC-uhh rev=2 -->
#### Scenario: grade10-site-auction-auction-SC-16 - An unverified bidder above the bar is held at the storefront
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** a signed-in bidder whose standing is `unverified` or `expired`
- **WHEN** they place a bid of the bar or more
- **THEN** the bid is refused as needing a verified identity, and the
  auction records no bid
- **AND** the bid form says: Bids this high need a verified identity. Verify
  from your account, then bid again.

<!-- trace:scenario id=g10.auction-auction.SC-d78 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-17 - A verified bidder above the bar bids
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** a signed-in bidder whose standing is `verified`
- **WHEN** they place a bid of the bar or more
- **THEN** the bid is forwarded to the auction as any other

<!-- trace:scenario id=g10.auction-auction.SC-ndj rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-18 - A bid below the bar asks nothing
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** any signed-in bidder
- **WHEN** they place a bid below the bar
- **THEN** no standing is read and the bid is forwarded as any other

<!-- trace:scenario id=g10.auction-auction.SC-l64 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-110 - A bid of exactly the bar is held
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** a signed-in bidder whose standing is `unverified`
- **WHEN** they place a bid of 1500000 minor units in USD
- **THEN** the bid is refused as needing a verified identity, and the
  auction records no bid

<!-- trace:scenario id=g10.auction-auction.SC-99a rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-111 - A bid just under the bar asks nothing
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** a signed-in bidder whose standing is `unverified`
- **WHEN** they place a bid of 1499900 minor units in USD
- **THEN** no standing is read and the bid is forwarded as any other

## REMOVED Requirements

None.
