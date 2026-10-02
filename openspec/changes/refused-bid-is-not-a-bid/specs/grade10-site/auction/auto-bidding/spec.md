# grade10-site/auction/auto-bidding Specification

## Feature set

- Commit a maximum
  - No card hold: committing or raising a maximum takes nothing from the card,
    and a raise is accepted or refused on the auction's rules alone

## MODIFIED Requirements

### Requirement: A bidder commits a maximum

A bidder SHALL:

1. Open an open listing.
2. Enter a **maximum**: the most they authorize Grade10 to bid for them.
3. Confirm with the primary bid action. Grade10 accepts or refuses the
   maximum in the same answer, and takes nothing from the card. The panel
   discloses the mechanism in always-on copy.
4. See their own maximum, distinct from the current bid, and whether they
   lead.
5. Raise that maximum later, or leave it standing.

A maximum SHALL be valid only when it is at least the minimum next bid
the listing already requires. Grade10 SHALL apply every window,
card, and validity rule that `grade10-site/auction/auction` already governs a
bid with to the committing of a maximum.

Grade10 SHALL bid on a committed bidder's behalf only up to their
maximum. A bidder SHALL be able to raise their maximum on an open listing
at any time that listing accepts a bid. Grade10 SHALL refuse to lower or
withdraw a committed maximum.

<!-- trace:scenario id=g10.auction-auto-bidding.SC-71q rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-01 - A first maximum opens the bidding
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** an open listing with a starting price of 20000 minor units and no bids
- **WHEN** a bidder commits a maximum of 50000 minor units
- **THEN** Grade10 accepts the commitment
- **AND** the current bid is 20000 minor units
- **AND** that bidder leads

<!-- trace:scenario id=g10.auction-auto-bidding.SC-ec3 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-02 - A maximum below the minimum next bid is refused
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** an open listing whose current bid is 22500 minor units and whose minimum increment is 2500 minor units
- **WHEN** a bidder commits a maximum of 24000 minor units
- **THEN** Grade10 refuses the commitment
- **AND** the current bid and the leader are unchanged

<!-- trace:scenario id=g10.auction-auto-bidding.SC-2eu rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-03 - A leader raises their own maximum
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** bidder A raises their maximum to 80000 minor units
- **THEN** Grade10 accepts the raise
- **AND** bidder A still leads
- **AND** the current bid is unchanged

<!-- trace:scenario id=g10.auction-auto-bidding.SC-6h6 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-04 - Lowering a maximum is refused
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** a bidder with a committed maximum of 50000 minor units on an open listing
- **WHEN** they commit a maximum of 30000 minor units on that listing
- **THEN** Grade10 refuses it
- **AND** their committed maximum remains 50000 minor units

## RENAMED Requirements

- FROM: `### Requirement: Maximum commitments and automatic bids work without a bid-time authorization`
- TO: `### Requirement: Maximum commitments and automatic bids take nothing from the card`

### Requirement: Maximum commitments and automatic bids take nothing from the card

Committing or raising a maximum SHALL take nothing from the card: nothing is
held, authorized or charged, and acceptance SHALL NOT wait on the payment
provider. A raise SHALL be accepted or refused on the auction's rules alone. A
bid Grade10 places on a bidder's behalf SHALL need no card step. Only the
winner pays, under `grade10-site/auction/bid-payment-method`.

<!-- trace:scenario id=g10.auction-auto-bidding.SC-0yu rev=2 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-25 - A maximum resolves with nothing held on the card
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** a listing with an accepted maximum
- **WHEN** a challenger commits a higher maximum
- **THEN** Grade10 resolves the two maxima and records the resulting bids in
  the same answer
- **AND** nothing is held, authorized or charged on either bidder's card

#### Scenario: grade10-site-auction-auto-bidding-SC-32 - A raise is judged on the auction's rules alone
**Serves:** grade10-site-auction-auto-bidding-US-01 - a leader raises their maximum

- **GIVEN** bidder A leads an `HKD` listing with a committed maximum of 50000
  HKD minor units at a current bid of 25000 HKD minor units
- **WHEN** A raises their maximum to 80000 HKD minor units
- **THEN** Grade10 accepts the raise in the same answer, with nothing taken
  from the card
- **AND** when A then submits 80000 HKD minor units again, Grade10 refuses it
  and the bid form says: Your new maximum must be higher than your current
  one.

## REMOVED Requirements

### Requirement: The card authorization covers the committed maximum

**Reason:** No card authorization is taken for a maximum, so there is no hold
to size, raise or release, and no raise fails on the card.

**Migration:** "Maximum commitments and automatic bids take nothing from the
card" states that a bid placed on a bidder's behalf needs no card step.
`grade10-site-auction-auto-bidding-SC-19`,
`grade10-site-auction-auto-bidding-SC-20` and
`grade10-site-auction-auto-bidding-SC-21` retire.
