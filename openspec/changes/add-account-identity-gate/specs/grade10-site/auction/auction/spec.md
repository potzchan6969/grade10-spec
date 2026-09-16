## Feature set

- The identity bar on a bid
  - Held at the storefront: a bid at or above the bar is held before the auction hears of it
  - A verified bidder above the bar bids; another is sent to verify

## ADDED Requirements

### Requirement: A bid at or above the identity bar needs a verified bidder

The storefront that forwards a bid SHALL compare the bid's amount to the
brand's bar before the auction hears of it. At or above the bar it SHALL
forward the bid only for a bidder whose standing is `verified` on the day of
the bid, and SHALL otherwise refuse the bid naming that a verified identity is
needed and where to verify — no hold is taken and the auction records nothing.
Below the bar a bid SHALL ask nothing about identity. On a brand that deploys
no identity store the bar SHALL not exist.

#### Scenario: grade10-site-auction-auction-SC-16 - An unverified bidder above the bar is held at the storefront
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** a signed-in bidder whose standing is `unverified` or `expired`
- **WHEN** they place a bid of the bar or more
- **THEN** the bid is refused as needing a verified identity, the auction
  records no bid and takes no hold, and the bidder is told to verify from
  their account

#### Scenario: grade10-site-auction-auction-SC-17 - A verified bidder above the bar bids
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** a signed-in bidder whose standing is `verified`
- **WHEN** they place a bid of the bar or more
- **THEN** the bid is forwarded to the auction as any other

#### Scenario: grade10-site-auction-auction-SC-18 - A bid below the bar asks nothing
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** any signed-in bidder
- **WHEN** they place a bid below the bar
- **THEN** no standing is read and the bid is forwarded as any other
