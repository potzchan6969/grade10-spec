## Feature set

- Committed maximum
  - Suspension carve-out: the one case in which a standing maximum leaves an open lot without the bidder withdrawing it

## MODIFIED Requirements

### Requirement: A bidder commits a maximum

A bidder SHALL:

1. Open an open listing.
2. Enter a **maximum**: the most they authorize Grade10 to bid for them.
3. Confirm. Grade10 accepts only after a card authorization for that
   maximum is recorded.
4. See their own maximum, distinct from the current bid, and whether they
   lead.
5. Raise that maximum later, or leave it standing.

A maximum SHALL be valid only when it is at least the minimum next bid
the listing already requires. Grade10 SHALL apply every window,
authorization, and validity rule that `grade10-site/auction/auction` already
governs a bid with to the committing of a maximum.

Grade10 SHALL bid on a committed bidder's behalf only up to their
maximum. A bidder SHALL be able to raise their maximum on an open listing
at any time that listing accepts a bid. Grade10 SHALL refuse to lower or
withdraw a committed maximum.

Grade10 itself SHALL retract a committed maximum in one case: when the
bidder's account is suspended from auction activity, per
`grade10-site/auction/bidder-suspension`. That retraction is Grade10's, not
the bidder's — a bidder SHALL still have no way to lower or withdraw their
own maximum, whether or not they are suspended.

#### Scenario: auto-bidding-SC-01 - A first maximum opens the bidding

- **GIVEN** an open listing with a starting price of 20000 minor units and no bids
- **WHEN** a bidder commits a maximum of 50000 minor units
- **THEN** Grade10 accepts the commitment
- **AND** the current bid is 20000 minor units
- **AND** that bidder leads

#### Scenario: auto-bidding-SC-02 - A maximum below the minimum next bid is refused

- **GIVEN** an open listing whose current bid is 22500 minor units and whose minimum increment is 2500 minor units
- **WHEN** a bidder commits a maximum of 24000 minor units
- **THEN** Grade10 refuses the commitment
- **AND** the current bid and the leader are unchanged

#### Scenario: auto-bidding-SC-03 - A leader raises their own maximum

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** bidder A raises their maximum to 80000 minor units
- **THEN** Grade10 accepts the raise
- **AND** bidder A still leads
- **AND** the current bid is unchanged

#### Scenario: auto-bidding-SC-04 - Lowering a maximum is refused

- **GIVEN** a bidder with a committed maximum of 50000 minor units on an open listing
- **WHEN** they commit a maximum of 30000 minor units on that listing
- **THEN** Grade10 refuses it
- **AND** their committed maximum remains 50000 minor units

#### Scenario: auto-bidding-SC-25 - A suspended bidder cannot withdraw their own maximum

- **GIVEN** a suspended bidder with a committed maximum on an open listing that
  Grade10 has not yet retracted
- **WHEN** they attempt to withdraw that maximum themselves
- **THEN** Grade10 refuses it
- **AND** the maximum is retracted only by Grade10's own suspension retraction
