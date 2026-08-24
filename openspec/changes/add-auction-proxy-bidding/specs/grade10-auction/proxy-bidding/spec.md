# Automatic bidding — delta

## Purpose

How a collector bids without being present: they commit the most they will
pay, and Grade10 raises their bid in the listing's own increment only as far
as needed to lead. This capability governs what the current bid becomes, who
leads when two maximums meet, what a bidder may see of another's commitment,
and how the card hold relates to the maximum rather than to the price.

## ADDED Requirements

### Requirement: A bidder commits a maximum

A bidder SHALL bid by committing a **maximum**: the largest amount they
authorize Grade10 to bid for them on that listing. A maximum SHALL be an
integer count of minor units in the listing's currency, paired with that
listing's ISO 4217 currency code.

A maximum SHALL be valid only when it is at least the minimum next bid the
listing already requires. Grade10 SHALL apply every window, authorization, and
validity rule that governs a bid to the committing of a maximum.

Grade10 SHALL bid on a committed bidder's behalf only up to their maximum, and
SHALL never place a bid above it.

#### Scenario: A first maximum opens the bidding

- **GIVEN** an open listing with a starting price of 20000 minor units and no bids
- **WHEN** a bidder commits a maximum of 50000 minor units
- **THEN** Grade10 accepts the commitment
- **AND** the current bid is 20000 minor units
- **AND** that bidder leads

#### Scenario: A maximum below the minimum next bid is refused

- **GIVEN** an open listing whose current bid is 22500 minor units and whose minimum increment is 2500 minor units
- **WHEN** a bidder commits a maximum of 24000 minor units
- **THEN** Grade10 refuses the commitment
- **AND** the current bid and the leader are unchanged

#### Scenario: A maximum outside the window is refused

- **GIVEN** a listing that has closed
- **WHEN** a bidder commits a maximum on it
- **THEN** Grade10 refuses the commitment for the same reason it refuses a bid outside the window

### Requirement: The current bid is derived from the two highest maximums

Grade10 SHALL determine the leader and the current bid from the committed
maximums on the listing, using the listing's own configured minimum increment.
It SHALL NOT use any price-banded increment schedule.

Where `leader` is the highest committed maximum and `challenger` is the next
highest:

- When a challenger commits a maximum **at or below** the leader's maximum,
  the leader SHALL keep the lead and the current bid SHALL become the
  challenger's maximum.
- When a challenger commits a maximum **above** the leader's maximum, the
  challenger SHALL take the lead and the current bid SHALL become the previous
  leader's maximum plus one increment, except that it SHALL NOT exceed the new
  leader's maximum, in which case it SHALL be that maximum.
- When the listing has one committed maximum, the current bid SHALL be the
  starting price.

The current bid SHALL never exceed the leader's maximum.

#### Scenario: A challenger below the leader's maximum raises the price only

- **GIVEN** a listing whose minimum increment is 2500 minor units
- **AND** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** bidder B commits a maximum of 22500 minor units
- **THEN** bidder A still leads
- **AND** the current bid is 22500 minor units

#### Scenario: A challenger raises again, still below

- **GIVEN** the listing from the previous scenario, with the current bid at 22500 minor units
- **WHEN** bidder B raises their maximum to 30000 minor units
- **THEN** bidder A still leads
- **AND** the current bid is 30000 minor units

#### Scenario: A challenger above the leader's maximum takes the lead

- **GIVEN** the listing from the previous scenario, where A's maximum is 50000 minor units and the increment is 2500
- **WHEN** bidder B raises their maximum to 60000 minor units
- **THEN** bidder B leads
- **AND** the current bid is 52500 minor units

#### Scenario: The step to lead cannot exceed the new leader's maximum

- **GIVEN** a listing whose minimum increment is 2500 minor units
- **AND** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** bidder B commits a maximum of 51000 minor units
- **THEN** bidder B leads
- **AND** the current bid is 51000 minor units

#### Scenario: The current bid never passes the leader's maximum

- **WHEN** Grade10 determines any listing's current bid
- **THEN** that amount is at most the leading bidder's committed maximum

### Requirement: An equal maximum leaves the earlier commitment leading

When two bidders hold the same committed maximum on a listing, the bidder
whose commitment Grade10 accepted **first** SHALL lead, and the current bid
SHALL become that maximum.

A later commitment equal to the leader's maximum SHALL NOT displace them, and
SHALL NOT be refused — it is accepted, and it raises the current bid.

#### Scenario: A tie goes to the earlier commitment

- **GIVEN** bidder B leads a listing with a committed maximum of 60000 minor units
- **WHEN** bidder C commits a maximum of 60000 minor units
- **THEN** bidder B still leads
- **AND** the current bid is 60000 minor units

#### Scenario: A tie is not a refusal

- **GIVEN** the listing from the previous scenario
- **WHEN** bidder C reads their own standing on it
- **THEN** their commitment is recorded as accepted
- **AND** they are not the leader

### Requirement: A maximum may be raised and SHALL NOT be lowered

A bidder MAY raise their committed maximum on an open listing at any time the
listing accepts a bid. Grade10 SHALL re-derive the leader and the current bid
on every raise.

Grade10 SHALL refuse to lower or withdraw a committed maximum. A commitment
other bidders have already bid against SHALL NOT be reduced.

#### Scenario: A leader raises their own maximum

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** bidder A raises their maximum to 80000 minor units
- **THEN** Grade10 accepts the raise
- **AND** bidder A still leads
- **AND** the current bid is unchanged

#### Scenario: Lowering a maximum is refused

- **GIVEN** a bidder with a committed maximum of 50000 minor units on an open listing
- **WHEN** they commit a maximum of 30000 minor units on that listing
- **THEN** Grade10 refuses it
- **AND** their committed maximum remains 50000 minor units

### Requirement: A maximum is hidden while it leads

Grade10 SHALL NOT disclose a bidder's committed maximum to another bidder,
to an unauthenticated reader, or in any public listing fact, while that
bidder leads.

Once a bidder has been overtaken, the current bid necessarily reveals the
maximum they held, because the new current bid is that maximum plus one
increment. That disclosure is permitted. No other bidder's maximum SHALL be
derivable from a public listing fact.

An operator SHALL see every committed maximum and its commit time, so a
dispute can be answered.

#### Scenario: A leader's maximum is not public

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units while the current bid is 22500
- **WHEN** any other bidder reads the listing's public facts
- **THEN** those facts carry the current bid of 22500 minor units
- **AND** they do not carry, and do not allow deriving, A's maximum of 50000

#### Scenario: An operator can answer a dispute

- **GIVEN** a listing with several committed maximums
- **WHEN** an authorized operator reads its bid history
- **THEN** each commitment shows its bidder, its maximum, and the time it was accepted

### Requirement: A bidder sees their own maximum

Grade10 SHALL show an authenticated bidder their own committed maximum on a
listing, distinct from that listing's current bid, and SHALL show whether they
currently lead.

#### Scenario: A bidder reads their own commitment

- **GIVEN** bidder A has committed a maximum of 50000 minor units while the current bid is 22500 minor units
- **WHEN** bidder A opens the listing
- **THEN** they see their own maximum of 50000 minor units
- **AND** they see the current bid of 22500 minor units as a separate fact
- **AND** they see that they lead

#### Scenario: An overtaken bidder sees that they no longer lead

- **GIVEN** bidder A has been overtaken on a listing
- **WHEN** bidder A opens it
- **THEN** they see that they do not lead
- **AND** they see their own committed maximum unchanged

### Requirement: The card authorization covers the committed maximum

Grade10 SHALL hold a card authorization for a bidder's **committed maximum**,
not for the current bid. Raising a maximum SHALL raise that authorization
before the raise is accepted; a raise whose authorization does not succeed
SHALL NOT change the leader or the current bid.

Grade10 SHALL keep at most one active authorization per bidder per listing, and
SHALL mark it for asynchronous release when that bidder is outbid or when the
listing closes without them winning, exactly as it does for a manual bid.

Because the authorization covers the maximum, a bid Grade10 places on a
bidder's behalf SHALL NOT require a further card check.

#### Scenario: The hold is the maximum, not the price

- **GIVEN** a listing whose current bid is 22500 minor units
- **WHEN** a bidder commits a maximum of 50000 minor units and it is accepted
- **THEN** Grade10 holds an authorization for 50000 minor units
- **AND** it holds exactly one active authorization for that bidder and listing

#### Scenario: A raise that cannot be authorized changes nothing

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** A raises to 80000 minor units and the card authorization for 80000 fails
- **THEN** Grade10 refuses the raise
- **AND** A's committed maximum remains 50000 minor units
- **AND** the leader and the current bid are unchanged

#### Scenario: A proxy step needs no new card check

- **GIVEN** bidder A leads with an authorized maximum of 50000 minor units and the current bid is 22500
- **WHEN** a challenger raises the current bid to 30000 minor units
- **THEN** Grade10 raises A's bid on their behalf without a further card authorization
- **AND** A's authorization remains 50000 minor units

#### Scenario: An overtaken bidder's hold is released

- **GIVEN** bidder A holds an authorization for their committed maximum
- **WHEN** a challenger commits a maximum above A's and takes the lead
- **THEN** Grade10 marks A's authorization for asynchronous release

### Requirement: A bid Grade10 places counts as a bid

A bid Grade10 places on a bidder's behalf SHALL be treated as an accepted bid
in every respect: it SHALL count toward the listing's bid count, appear in bid
history identified as placed on that bidder's behalf, and extend the listing's
close under the same extension rule that governs a manual bid.

Automatic bidding SHALL remain active during the extension window. A bid
Grade10 places inside that window SHALL move the close exactly as a manual bid
placed at the same instant would.

#### Scenario: A proxy bid extends the close

- **GIVEN** a listing inside its extension window, and a leader whose committed maximum has room left
- **WHEN** a challenger's commitment causes Grade10 to raise the leader's bid on their behalf
- **THEN** that bid moves the listing's close exactly as a manual bid at that instant would
- **AND** the listing does not close while that extension stands

#### Scenario: A proxy bid is counted and recorded

- **GIVEN** Grade10 raises a bidder's bid on their behalf
- **WHEN** a collector reads the listing's bid count and history
- **THEN** the bid count includes that bid
- **AND** the history shows it as placed on that bidder's behalf, not as a manual bid

#### Scenario: Two maximums with room left keep extending

- **GIVEN** two bidders inside the extension window whose committed maximums both exceed the current bid
- **WHEN** each raise triggers the other's automatic bid
- **THEN** each accepted bid moves the close under the extension rule
- **AND** bidding ends only when one maximum is exhausted or the listing's extension cap is reached
