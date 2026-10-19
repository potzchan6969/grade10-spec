# grade10-site/auction/bidder-suspension Specification

## MODIFIED Requirements

### Requirement: Suspension stops new bids and leaves standing bids as they are

A suspended account places no new bid, and every bid it already placed keeps
competing.

**No new bids** - While an account is suspended, Grade10 SHALL refuse every new
bid and every raise of a maximum from it, on every lot.

**Standing bids** - A suspension SHALL NOT change any bid the account placed
before it:

- Every maximum the account has on an open lot SHALL stay in force. Auto-bidding
  SHALL resolve the lot with that maximum exactly as it would for an account
  that is not suspended, and it SHALL bid for the account up to its cap.
- A suspended account that holds the highest maximum when a lot closes SHALL
  win that lot. The lot gets its own auction order, invoice and payment
  deadline, as for any winner.
- A lot the account won before the suspension SHALL stay won, and its invoice
  SHALL stay payable.
- Suspension SHALL NOT add, edit or remove any entry in any lot's bid history,
  and SHALL NOT change any lot's current price or leader.

<!-- trace:scenario id=g10.auction-bidder-suspension.SC-def rev=1 -->
#### Scenario: g10.auction-bidder-suspension.SC16 - A lot already won stays won
**Serves:** g10.auction-bidder-suspension.US1 - Collector who misses a deadline loses their auction standing

- **GIVEN** a suspended account that won a lot before the suspension
- **WHEN** the suspension takes effect
- **THEN** that lot is still won by the account
- **AND** its invoice is still payable

<!-- trace:scenario id=g10.auction-bidder-suspension.SC-o11 rev=2 -->
#### Scenario: g10.auction-bidder-suspension.SC12 - A suspended account cannot bid or raise its maximum
**Serves:** g10.auction-bidder-suspension.US1 - Collector who misses a deadline loses their auction standing

- **GIVEN** a suspended account holding a maximum of 50000 USD minor units on
  an open lot
- **WHEN** the collector tries to raise that maximum, and to place a bid on a
  second open lot
- **THEN** Grade10 refuses both
- **AND** the maximum on the first lot is still 50000 USD minor units

<!-- trace:scenario id=g10.auction-bidder-suspension.SC-tsa rev=2 -->
#### Scenario: g10.auction-bidder-suspension.SC13 - Suspension leaves open lots and their history unchanged
**Serves:** g10.auction-bidder-suspension.US2 - Bidder competes on a lot whose leader is suspended

- **GIVEN** an open lot led by an account at a current price of 30000 USD
  minor units, with a second bidder holding a lower maximum
- **WHEN** the leading account is suspended
- **THEN** the account still leads the lot at 30000 USD minor units
- **AND** the lot's bid history has the same entries as before the suspension

<!-- trace:scenario id=g10.auction-bidder-suspension.SC-yn5 rev=2 -->
#### Scenario: g10.auction-bidder-suspension.SC14 - A standing maximum keeps bidding after suspension
**Serves:** g10.auction-bidder-suspension.US2 - Bidder competes on a lot whose leader is suspended

- **GIVEN** a suspended account holding a maximum of 50000 USD minor units on
  an open lot it leads at 30000 USD minor units
- **WHEN** another bidder commits a maximum of 40000 USD minor units
- **THEN** auto-bidding resolves the lot with the suspended account's maximum
  as for any bidder
- **AND** the suspended account still leads, at the price auto-bidding
  resolves

<!-- trace:scenario id=g10.auction-bidder-suspension.SC-1wb rev=1 -->
#### Scenario: g10.auction-bidder-suspension.SC15 - A suspended account wins through a standing maximum
**Serves:** g10.auction-bidder-suspension.US2 - Bidder competes on a lot whose leader is suspended

- **GIVEN** a suspended account holding the highest maximum on an open lot
- **WHEN** the lot closes
- **THEN** the account wins the lot
- **AND** Grade10 creates its auction order with its own invoice and payment
  deadline
