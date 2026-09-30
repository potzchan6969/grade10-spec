# grade10-site/auction/account-record Specification (delta)

## Purpose

My Auctions money on a bidding row matches the auction the collector bid on,
not only their own last bid.

## ADDED Requirements

### Requirement: Bidding row shows auction top

Active and Ended bidding rows on My Auctions SHALL show the auction's current
or winning top amount. A losing bidder's Ended row SHALL show that same top
with Didn’t win.

#### Scenario: Loser reads the hammer

- **GIVEN** collector B lost an auction that closed at amount H
- **WHEN** B opens My Auctions Ended
- **THEN** the row for that auction shows H and Didn’t win

## MODIFIED Requirements

None.
