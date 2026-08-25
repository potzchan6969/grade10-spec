## Purpose

Lets a collector bid without staying on the page: they commit the most they
will pay, and Grade10 raises their bid in the listing's own increment only as
far as needed to lead.

## Feature set

- Committing a maximum
  - Enter a maximum: the collector names the most they will pay
  - Raise only: a commitment can go up, never down
  - Own standing: a bidder sees their maximum and whether they lead
  - Hidden while leading: other bidders see the price, not the cap
- Current bid
  - Two-maximum rule: leader and price come from the top two commitments
  - Earlier commitment wins a tie: equal maximums leave the first one leading
- Card authorization
  - Hold the maximum: the card hold matches the commitment, not the price
  - Proxy needs no re-check: a step Grade10 places uses the existing hold
- Proxy bid
  - Counts as a bid: it records, counts, and extends the close

## ADDED Requirements

### Committing a maximum
---------------------

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
authorization, and validity rule that `grade10-auction/auction` already
governs a bid with to the committing of a maximum.

Grade10 SHALL bid on a committed bidder's behalf only up to their
maximum. A bidder SHALL be able to raise their maximum on an open listing
at any time that listing accepts a bid. Grade10 SHALL refuse to lower or
withdraw a committed maximum.

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

### Requirement: Maximum fields

Each accepted commitment SHALL carry these fields. Grade10 SHALL show a
bidder their own row, distinct from the listing's current bid. Grade10
SHALL NOT disclose a leading bidder's maximum to another bidder, to an
unauthenticated reader, or in any public listing fact. Once a bidder has
been overtaken, the current bid reveals the maximum they held, because
the new current bid is that maximum plus one increment. That disclosure
is permitted. No other bidder's maximum SHALL be derivable from a public
listing fact. An operator SHALL see every committed maximum and its
accepted instant.

| Field | Meaning |
| --- | --- |
| Maximum | Integer minor units in the listing's currency, with that listing's ISO 4217 code |
| Accepted instant | When Grade10 accepted this commitment |
| Leading | Whether this bidder currently leads |

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

#### Scenario: A leader's maximum is not public

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units while the current bid is 22500
- **WHEN** any other bidder reads the listing's public facts
- **THEN** those facts carry the current bid of 22500 minor units
- **AND** they do not carry, and do not allow deriving, A's maximum of 50000

#### Scenario: An operator can answer a dispute

- **GIVEN** a listing with several committed maximums
- **WHEN** an authorized operator reads its bid history
- **THEN** each commitment shows its bidder, its maximum, and the time it was accepted

### Current bid
-----------

### Requirement: Current bid states

Grade10 SHALL determine the leader and the current bid from the committed
maximums on the listing, using the listing's own configured minimum
increment from `grade10-auction/auction`. It SHALL NOT use any
price-banded increment schedule. The current bid SHALL never exceed the
leader's maximum.

| Situation | Leader | Current bid |
| --- | --- | --- |
| One committed maximum | That bidder | The starting price |
| Challenger at or below the leader's maximum | Previous leader | The challenger's maximum |
| Challenger above the leader's maximum | The challenger | The previous leader's maximum plus one increment, capped at the new leader's maximum |
| Two equal maximums | The commitment Grade10 accepted first | That maximum |

A later commitment equal to the leader's maximum SHALL NOT be refused: it
is accepted, it raises the current bid to that maximum, and it does not
displace the leader.

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

### Card authorization
------------------

### Requirement: The card authorization covers the committed maximum

Grade10 SHALL hold a card authorization for a bidder's committed maximum,
not for the current bid. It SHALL keep at most one active authorization
per bidder per listing, and SHALL mark it for asynchronous release when
that bidder is outbid or when the listing closes without them winning,
per `grade10-auction/auction`. Because the authorization covers the
maximum, a bid Grade10 places on a bidder's behalf SHALL NOT require a
further card check.

| Event | Authorization |
| --- | --- |
| Commitment accepted | Hold for the committed maximum |
| Raise submitted | Hold for the new maximum, recorded before the raise is accepted |
| Raise authorization fails | Nothing changes |
| Grade10 places a bid on their behalf | No further card check |

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

### Proxy bid
---------

### Requirement: A bid Grade10 places counts as a bid

A bid Grade10 places on a bidder's behalf SHALL be treated as an accepted
bid in every respect: it SHALL count toward the listing's bid count,
appear in bid history identified as placed on that bidder's behalf, and
extend the listing's close under the same extension rule and cap that
`grade10-auction/auction` already governs a manual bid with.

Automatic bidding SHALL remain active during the extension window. A bid
Grade10 places inside that window SHALL move the close exactly as a
manual bid placed at the same instant would.

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
