## Purpose

Lets a collector bid without staying on the page: they commit the most they
will pay, and Grade10 bids for them only as far as needed to lead. The
current bid is the second-highest maximum plus the listing increment.

## Feature set

- Committing a maximum
  - Enter a maximum: the collector names the most they will pay
  - Raise only: a commitment can go up, never down
  - Own standing: a bidder sees their maximum and whether they lead
  - Hidden while leading: other bidders see the price, not the cap
- Current bid
  - Two-maximum rule: who leads and the price come only from the two highest maxima
  - Second-highest plus increment: the price is the other maximum plus the listing increment, capped at the leader's maximum
  - Earlier commitment wins a tie: equal maxima leave the first one leading
- Card authorization
  - Hold the maximum: the card hold matches the commitment, not the price
  - Auto bid needs no re-check: a bid Grade10 places uses the existing hold
- Auto bid
  - Counts as a bid: it records, counts, and extends the close
  - Once per commitment: resolve when someone commits, in one bid, not on a timer

## ADDED Requirements

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

### Requirement: Maximum fields

Each accepted commitment SHALL carry these fields. Grade10 SHALL show a
bidder their own row, distinct from the listing's current bid. Grade10
SHALL NOT disclose a leading bidder's maximum to another bidder, to an
unauthenticated reader, or in any public listing fact. The current bid
is the second-highest maximum plus one increment, so that second-highest
amount is implied by the price. A leading maximum is revealed only once
it has been beaten: the new current bid is that maximum plus one
increment, unless the increment would pass the new leader's maximum. An
operator SHALL see every committed maximum and its Accepted At.

| Field | Meaning |
| --- | --- |
| Maximum | Integer minor units in the listing's currency, with that listing's ISO 4217 code |
| Accepted At | When Grade10 accepted this commitment |
| Standing | Leading or not leading, as a fact apart from the current bid |

| Standing | Meaning |
| --- | --- |
| Leading | This commitment is the highest, or it ties the highest and Grade10 accepted it first |
| Not leading | A higher commitment exists, or an equal earlier one does |

#### Scenario: auto-bidding-SC-05 - A bidder reads their own commitment

- **GIVEN** bidder A has committed a maximum of 50000 minor units while the current bid is 25000 minor units
- **WHEN** bidder A opens the listing
- **THEN** they see their own maximum of 50000 minor units
- **AND** they see the current bid of 25000 minor units as a separate fact
- **AND** they see that they lead

#### Scenario: auto-bidding-SC-06 - An overtaken bidder sees that they no longer lead

- **GIVEN** bidder A has been overtaken on a listing
- **WHEN** bidder A opens it
- **THEN** they see that they do not lead
- **AND** they see their own committed maximum unchanged

#### Scenario: auto-bidding-SC-07 - A leader's maximum is not public

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units while the current bid is 25000
- **WHEN** any other bidder reads the listing's public facts
- **THEN** those facts carry the current bid of 25000 minor units
- **AND** they do not carry, and do not allow deriving, A's maximum of 50000

#### Scenario: auto-bidding-SC-08 - An operator can answer a dispute

- **GIVEN** a listing with several committed maximums
- **WHEN** an authorized operator reads its bid history
- **THEN** each commitment shows its bidder, its maximum, and its Accepted At

### Requirement: Two-maximum rule

Only two numbers decide the listing: the highest maximum and the
second-highest. Everyone else is ignored.

The highest is the leader. When two maxima are equal, whoever Grade10
accepted first leads. With only one maximum, the price is the starting
price. With two or more, the current bid SHALL be the lesser of the
leader's maximum and the second-highest maximum plus the listing
increment. The current bid SHALL never exceed the leader's maximum.

Grade10 SHALL use the listing's own configured minimum increment from
`grade10-auction/auction`. It SHALL NOT use any price-banded increment
schedule.

| You see this | Who is leading | The price |
| --- | --- | --- |
| You are the only bidder | You | The starting price |
| Someone bids lower than your maximum | You still lead | Their maximum plus one increment, stopping at your maximum |
| Someone bids higher than your maximum | Them | Your maximum plus one increment, stopping at their maximum |
| Someone matches your maximum | Whoever committed first | That maximum |

Worked examples. Starting price 20000, increment 2500. A **maximum** is
the most a bidder will pay, not the price they are paying now. The
public price is one increment above the second-highest maximum, unless
that would pass the leader's maximum.

**Case 1 — you commit first**

| What happens | Current bid | Who leads |
| --- | --- | --- |
| You commit a maximum of 50000 | 20000 | You. 50000 is a hidden cap, not the price. |
| They commit a maximum of 22500 | 25000 | You still lead. Price is their 22500 plus one increment, not 22500. |
| They raise to 60000 | 52500 | Them. Price is your 50000 plus one increment. They do not pay 60000; 52500 is enough to beat you. |

**Case 2 — they commit first, you take the lead, they raise twice**

| What happens | Current bid | Who leads |
| --- | --- | --- |
| They commit a maximum of 22500 | 20000 | Them. 22500 is their hidden cap, not the price. |
| You commit a maximum of 50000 | 25000 | You take the lead. Price is their 22500 plus one increment. You do not pay 50000. |
| They raise to 30000 | 32500 | You still lead. 30000 is below your 50000. Price is their 30000 plus one increment. |
| They raise to 60000 | 52500 | Them. Price is your 50000 plus one increment. They do not pay 60000; 52500 is enough to beat you. |

A later commitment equal to the leader's maximum SHALL NOT be refused: it
is accepted, it sets the current bid to that maximum, and it does not
displace the leader.

#### Scenario: auto-bidding-SC-09 - A challenger below the leader's maximum raises the price only

- **GIVEN** a listing whose minimum increment is 2500 minor units
- **AND** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** bidder B commits a maximum of 22500 minor units
- **THEN** bidder A still leads
- **AND** the current bid is 25000 minor units

#### Scenario: auto-bidding-SC-10 - A challenger raises again, still below

- **GIVEN** the listing from the previous scenario, with the current bid at 25000 minor units
- **WHEN** bidder B raises their maximum to 30000 minor units
- **THEN** bidder A still leads
- **AND** the current bid is 32500 minor units

#### Scenario: auto-bidding-SC-11 - A challenger above the leader's maximum takes the lead

- **GIVEN** the listing from the previous scenario, where A's maximum is 50000 minor units and the increment is 2500
- **WHEN** bidder B raises their maximum to 60000 minor units
- **THEN** bidder B leads
- **AND** the current bid is 52500 minor units

#### Scenario: auto-bidding-SC-12 - The first bidder is overtaken by a higher maximum

- **GIVEN** an open listing with a starting price of 20000 minor units and a minimum increment of 2500 minor units
- **AND** bidder A has committed a maximum of 22500 minor units and leads at 20000 minor units
- **WHEN** bidder B commits a maximum of 50000 minor units
- **THEN** bidder B leads
- **AND** the current bid is 25000 minor units

#### Scenario: auto-bidding-SC-13 - The overtaken bidder raises but stays below

- **GIVEN** the listing from the previous scenario, where B leads with a maximum of 50000 minor units
- **WHEN** bidder A raises their maximum to 30000 minor units
- **THEN** bidder B still leads
- **AND** the current bid is 32500 minor units

#### Scenario: auto-bidding-SC-14 - The overtaken bidder raises past the leader

- **GIVEN** the listing from the previous scenario, where B's maximum is 50000 minor units and the increment is 2500
- **WHEN** bidder A raises their maximum to 60000 minor units
- **THEN** bidder A leads
- **AND** the current bid is 52500 minor units

#### Scenario: auto-bidding-SC-15 - The step to lead cannot exceed the new leader's maximum

- **GIVEN** a listing whose minimum increment is 2500 minor units
- **AND** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** bidder B commits a maximum of 51000 minor units
- **THEN** bidder B leads
- **AND** the current bid is 51000 minor units

#### Scenario: auto-bidding-SC-16 - A challenge lands at the two-maximum price, not a ladder

- **GIVEN** a listing whose minimum increment is 2500 minor units, starting price 20000 minor units, and no bids
- **AND** bidder A has committed a maximum of 50000 minor units
- **WHEN** bidder B commits a maximum of 80000 minor units
- **THEN** bidder B leads
- **AND** the current bid is 52500 minor units
- **AND** Grade10 has not accepted bids at the intermediate increment amounts between 20000 and 52500

#### Scenario: auto-bidding-SC-17 - A tie goes to the earlier commitment

- **GIVEN** bidder B leads a listing with a committed maximum of 60000 minor units
- **WHEN** bidder C commits a maximum of 60000 minor units
- **THEN** bidder B still leads
- **AND** the current bid is 60000 minor units

#### Scenario: auto-bidding-SC-18 - A tie is not a refusal

- **GIVEN** the listing from the previous scenario
- **WHEN** bidder C reads their own standing on it
- **THEN** their commitment is recorded as accepted
- **AND** they are not the leader

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

#### Scenario: auto-bidding-SC-19 - The hold is the maximum, not the price

- **GIVEN** a listing whose current bid is 22500 minor units
- **WHEN** a bidder commits a maximum of 50000 minor units and it is accepted
- **THEN** Grade10 holds an authorization for 50000 minor units
- **AND** it holds exactly one active authorization for that bidder and listing

#### Scenario: auto-bidding-SC-20 - A raise that cannot be authorized changes nothing

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** A raises to 80000 minor units and the card authorization for 80000 fails
- **THEN** Grade10 refuses the raise
- **AND** A's committed maximum remains 50000 minor units
- **AND** the leader and the current bid are unchanged

#### Scenario: auto-bidding-SC-21 - An auto-bid step needs no new card check

- **GIVEN** bidder A leads with an authorized maximum of 50000 minor units and the current bid is 25000
- **WHEN** a challenger commits a maximum of 30000 minor units
- **THEN** Grade10 raises A's bid on their behalf without a further card authorization
- **AND** the current bid is 32500 minor units
- **AND** A's authorization remains 50000 minor units

### Requirement: A bid Grade10 places counts as a bid

Each accepted commitment SHALL cause one resolution. A resolution
computes the two-maximum result and, if the current bid changes, records
a single bid at that price. Grade10 SHALL NOT then place further bids
until another commitment is accepted. It SHALL NOT step through
intermediate increments. Standing maxima SHALL NOT generate bids on a
timer or a schedule.

Worked example. Starting price 20000, increment 2500.

1. You commit a maximum of 50000. Grade10 resolves once: you lead at
   20000. It does not then raise 22500, 25000, 27500 toward 50000.
2. They commit a maximum of 80000. Grade10 resolves once: they lead at
   52500 (your 50000 plus one increment). It does not then raise 55000,
   57500 toward 80000.
3. Neither commits again. The price stays 52500. Grade10 places no bid
   on a timer.
4. You raise your maximum to 90000. That is a new commitment. Grade10
   resolves once: you lead at 82500 (their 80000 plus one increment).
   Done until the next commitment.

A bid Grade10 places on a bidder's behalf SHALL be treated as an accepted
bid in every respect: it SHALL count toward the listing's bid count,
appear in bid history identified as placed on that bidder's behalf, and
extend the listing's close under the same extension rule and cap that
`grade10-auction/auction` already governs a manual bid with.

Auto bidding SHALL remain active during the extension window. A bid
Grade10 places inside that window SHALL move the close exactly as a
manual bid placed at the same moment would. Two standing maxima SHALL
NOT keep extending the close on their own.

#### Scenario: auto-bidding-SC-22 - An auto bid in the extension window extends once

- **GIVEN** a listing inside its extension window, and a leader whose committed maximum has room left
- **WHEN** a challenger's commitment causes Grade10 to raise the leader's bid on their behalf
- **THEN** that bid moves the listing's close exactly as a manual bid at that moment would
- **AND** the listing does not close while that extension stands
- **AND** Grade10 places no further bid until another commitment is accepted

#### Scenario: auto-bidding-SC-23 - An auto bid is counted and recorded

- **GIVEN** Grade10 raises a bidder's bid on their behalf
- **WHEN** a collector reads the listing's bid count and history
- **THEN** the bid count includes that bid
- **AND** the history shows it as placed on that bidder's behalf, not as a manual bid

#### Scenario: auto-bidding-SC-24 - Standing maxima do not keep bidding

- **GIVEN** two bidders have committed maxima and the listing has been resolved to the two-maximum price
- **WHEN** no further commitment is accepted
- **THEN** Grade10 places no further bid on either bidder's behalf
- **AND** the current bid is unchanged
