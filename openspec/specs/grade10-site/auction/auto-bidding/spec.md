# grade10-site/auction/auto-bidding Specification

## Purpose
Lets a collector bid without staying on the page: they commit the most they
will pay, and Grade10 bids for them only as far as needed to lead. The
current bid is the second-highest maximum plus the listing increment.

## Feature set

- Commit a maximum
  - First maximum opens bidding: an accepted cap takes the lead at the starting
    price while the cap itself stays hidden
  - Raise only: a leader may raise their maximum; lowering or withdrawing it is
    refused
  - Validity: a maximum below the listing's minimum next bid is refused
- Own standing
  - Own row: a bidder sees their maximum, the current bid, and whether they lead
    as three distinct facts
  - Maximum stays private: another bidder cannot read or derive the leader's
    cap from public listing facts
- Two-maximum price
  - Current bid from two maxima: the price is the lesser of the leader's
    maximum and the second-highest plus one increment
  - Earlier commitment wins a tie: an equal later maximum is accepted, creates
    the challenger's record followed by the earlier leader's automatic response
    at the same resolved amount, and does not displace the leader
  - One resolution per commitment: Grade10 does not step through intermediate
    increments
- Card authorization
  - Optional authorization: disabled by default; maximum commitments and automatic bids do not wait for or create a bid-time authorization
  - Hold for the maximum: the authorization covers the committed cap, not the
    current bid, and stays one active hold per bidder per listing
  - Failed raise: a raise the card cannot cover leaves the maximum, leader, and
    price unchanged
- Auto-bid as a bid
  - Counted and recorded: a bid Grade10 places counts in the bid count and
    history as placed on that bidder's behalf
  - Extended bidding: a maximum committed before the close counts toward entry,
    an auto bid during extended bidding restarts the timer as a manual bid
    would, and standing maxima do not keep bidding

## Requirements

### Requirement: A bidder commits a maximum

A bidder SHALL:

1. Open an open listing.
2. Enter a **maximum**: the most they authorize Grade10 to bid for them.
3. Confirm with the primary bid action. Grade10 accepts only after a card
   authorization for that maximum is recorded. The panel discloses the
   mechanism in always-on copy.
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

#### Scenario: grade10-site-auction-auto-bidding-SC-01 - A first maximum opens the bidding
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** an open listing with a starting price of 20000 minor units and no bids
- **WHEN** a bidder commits a maximum of 50000 minor units
- **THEN** Grade10 accepts the commitment
- **AND** the current bid is 20000 minor units
- **AND** that bidder leads

#### Scenario: grade10-site-auction-auto-bidding-SC-02 - A maximum below the minimum next bid is refused
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** an open listing whose current bid is 22500 minor units and whose minimum increment is 2500 minor units
- **WHEN** a bidder commits a maximum of 24000 minor units
- **THEN** Grade10 refuses the commitment
- **AND** the current bid and the leader are unchanged

#### Scenario: grade10-site-auction-auto-bidding-SC-03 - A leader raises their own maximum
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** bidder A raises their maximum to 80000 minor units
- **THEN** Grade10 accepts the raise
- **AND** bidder A still leads
- **AND** the current bid is unchanged

#### Scenario: grade10-site-auction-auto-bidding-SC-04 - Lowering a maximum is refused
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

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

#### Scenario: grade10-site-auction-auto-bidding-SC-05 - A bidder reads their own commitment
**Serves:** grade10-site-auction-auto-bidding-US-02 - Collector reads their own maximum and standing

- **GIVEN** bidder A has committed a maximum of 50000 minor units while the current bid is 25000 minor units
- **WHEN** bidder A opens the listing
- **THEN** they see their own maximum of 50000 minor units
- **AND** they see the current bid of 25000 minor units as a separate fact
- **AND** they see that they lead

#### Scenario: grade10-site-auction-auto-bidding-SC-06 - An overtaken bidder sees that they no longer lead
**Serves:** grade10-site-auction-auto-bidding-US-02 - Collector reads their own maximum and standing

- **GIVEN** bidder A has been overtaken on a listing
- **WHEN** bidder A opens it
- **THEN** they see that they do not lead
- **AND** they see their own committed maximum unchanged

#### Scenario: grade10-site-auction-auto-bidding-SC-07 - A leader's maximum is not public
**Serves:** grade10-site-auction-auto-bidding-US-02 - Collector reads their own maximum and standing

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units while the current bid is 25000
- **WHEN** any other bidder reads the listing's public facts
- **THEN** those facts carry the current bid of 25000 minor units
- **AND** they do not carry, and do not allow deriving, A's maximum of 50000

#### Scenario: grade10-site-auction-auto-bidding-SC-08 - An operator can answer a dispute
**Serves:** grade10-site-auction-auto-bidding-US-04 - Operator traces every committed maximum

- **GIVEN** a listing with several committed maximums
- **WHEN** an authorized operator reads its bid history
- **THEN** each commitment shows its bidder, its maximum, and its Accepted At

### Requirement: Two-maximum rule

Only the highest and second-highest maxima decide the listing price. The
highest maximum leads; equal maxima retain the earlier accepted leader. With
one maximum, the current bid is the starting price. With two or more, the
current bid SHALL be the lesser of the leader's maximum and the second-highest
maximum plus the increment that `grade10-site/auction/bid-increments` selects
for that second-highest maximum.

The current bid SHALL never exceed the leader's maximum. Grade10 SHALL resolve
once per accepted maximum and SHALL NOT step through intermediate bids. When a
newly accepted maximum equals the existing leader's maximum, Grade10 SHALL
retain the earlier leader and SHALL record two ordered public bid records at
the resolved amount: the challenger's accepted action first and the earlier
leader's automatic response second.

For an open `USD` listing with a current bid of **400** minor units, an
applicable increment of **100** minor units, and A leading with a maximum of
**1000** minor units, B's submitted maximum resolves as follows:

| B's submitted maximum | Accepted | Resolved current bid | Resolved status | Public bid records |
| ---: | --- | ---: | --- | --- |
| 450 | No | 400 | A leads | None; B's maximum is refused |
| 500 | Yes | 600 | A leads | B at 500, then A's automatic response at 600 |
| 700 | Yes | 800 | A leads | B at 700, then A's automatic response at 800 |
| 950 | Yes | 1000 | A leads | B at 950, then A's automatic response at 1000 |
| 1000 | Yes | 1000 | A leads | B at 1000, then A's automatic response at 1000 |
| 1001 | Yes | 1001 | B leads | B at 1001 |
| 1100 | Yes | 1100 | B leads | B at 1100 |
| 1120 | Yes | 1100 | B leads | B at 1100 |

Grade10 SHALL retain an accepted challenger's maximum in that bidder's private
history even when the challenger does not lead. The two records in the equal-
maximum row SHALL share the resolution's timestamp group and SHALL NOT represent
intermediate increments.

#### Scenario: grade10-site-auction-auto-bidding-SC-09 - A challenger below the leader's maximum raises the price only
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing where A leads with a maximum of 50000 minor units
- **WHEN** B commits a maximum of 22500 minor units
- **THEN** A still leads
- **AND** the current bid is 23500 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-11 - A challenger above the leader's maximum takes the lead
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing where A leads with a maximum of 800000 minor units
- **WHEN** B commits a maximum of 900000 minor units
- **THEN** B leads
- **AND** the current bid is 820000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-15 - The step to lead cannot exceed the new leader's maximum
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing where A leads with a maximum of 800000 minor units
- **WHEN** B commits a maximum of 810000 minor units
- **THEN** B leads
- **AND** the current bid is 810000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-16 - A challenge lands at the two-maximum price, not a ladder
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing with a starting price of 20000 minor units and A's maximum of 50000 minor units
- **WHEN** B commits a maximum of 80000 minor units
- **THEN** B leads at 54000 minor units
- **AND** Grade10 has not accepted intermediate bids between 20000 and 54000

#### Scenario: grade10-site-auction-auto-bidding-SC-10 - A challenger raises again, still below
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** A leads an HKD listing at a current bid of 23500 minor units
- **WHEN** B raises their maximum from 22500 to 30000 minor units
- **THEN** A still leads at 31000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-12 - The first bidder is overtaken by a higher maximum
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing with starting price 20000 minor units and A's maximum of 22500 minor units
- **WHEN** B commits a maximum of 50000 minor units
- **THEN** B leads at 23500 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-13 - The overtaken bidder raises but stays below
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** B leads an HKD listing with a maximum of 50000 minor units
- **WHEN** A raises their maximum to 30000 minor units
- **THEN** B still leads at 31000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-14 - The overtaken bidder raises past the leader
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** B leads an HKD listing with a maximum of 50000 minor units
- **WHEN** A raises their maximum to 60000 minor units
- **THEN** A leads at 51000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-17 - A tie goes to the earlier commitment
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** B leads with a maximum of 60000 minor units
- **WHEN** C commits the same maximum
- **THEN** B remains the leader and the current bid is 60000 minor units
- **AND** the public history records C's accepted action at 60000 minor units
- **AND** the public history then records B's automatic response at 60000 minor units
- **AND** both records belong to the same resolution timestamp group

#### Scenario: grade10-site-auction-auto-bidding-SC-18 - A tie is not a refusal
**Serves:** grade10-site-auction-auto-bidding-US-02 - Collector reads their own maximum and standing

- **GIVEN** B leads an HKD listing with a maximum of 60000 minor units
- **WHEN** C commits the same maximum
- **THEN** Grade10 accepts C's commitment and reports that C does not lead
- **AND** the public history records C's accepted action followed by B's automatic response
- **AND** both records show the resolved amount of 60000 minor units

### Requirement: The card authorization covers the committed maximum

Grade10 SHALL hold a card authorization for a bidder's committed maximum,
not for the current bid. It SHALL keep at most one active authorization
per bidder per listing, and SHALL mark it for asynchronous release when
that bidder is outbid or when the listing closes without them winning,
per `grade10-site/auction/auction`. Because the authorization covers the
maximum, a bid Grade10 places on a bidder's behalf SHALL NOT require a
further card check.

| Event | Authorization |
| --- | --- |
| Commitment accepted | Hold for the committed maximum |
| Raise submitted | Hold for the new maximum, recorded before the raise is accepted |
| Raise authorization fails | Nothing changes |
| Grade10 places a bid on their behalf | No further card check |

#### Scenario: grade10-site-auction-auto-bidding-SC-19 - The hold is the maximum, not the price
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** a listing whose current bid is 22500 minor units
- **WHEN** a bidder commits a maximum of 50000 minor units and it is accepted
- **THEN** Grade10 holds an authorization for 50000 minor units
- **AND** it holds exactly one active authorization for that bidder and listing

#### Scenario: grade10-site-auction-auto-bidding-SC-20 - A raise that cannot be authorized changes nothing
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** A raises to 80000 minor units and the card authorization for 80000 fails
- **THEN** Grade10 refuses the raise
- **AND** A's committed maximum remains 50000 minor units
- **AND** the leader and the current bid are unchanged

#### Scenario: grade10-site-auction-auto-bidding-SC-21 - An auto-bid step needs no new card check
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** bidder A leads with an authorized maximum of 50000 minor units and the current bid is 25000
- **WHEN** a challenger commits a maximum of 30000 minor units
- **THEN** Grade10 raises A's bid on their behalf without a further card authorization
- **AND** the current bid is 32500 minor units
- **AND** A's authorization remains 50000 minor units

### Requirement: A bid Grade10 places counts as a bid

Each accepted commitment SHALL cause one resolution. A resolution computes the
two-maximum result and records the accepted action and any automatic response
required by that result. A result that leaves the current bid unchanged still
records both ordered actions in the equal-maximum case. Grade10 SHALL NOT then
place further bids until another commitment is accepted. It SHALL NOT step
through intermediate increments. Standing maxima SHALL NOT generate bids on a
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
appear in bid history identified as placed on that bidder's behalf, count
toward whether the listing enters extended bidding at its scheduled close,
and move the listing's close under the same extended-bidding rule and cap
that `grade10-site/auction/auction` already governs a manual bid with.

Auto bidding SHALL remain active during extended bidding. A bid Grade10
places during extended bidding SHALL move the close exactly as a manual bid
placed at the same moment would. A bid Grade10 places before the scheduled
close SHALL NOT move the close, as a manual bid would not. Two standing
maxima SHALL NOT keep extending the close on their own.

Scenario `grade10-site-auction-auto-bidding-SC-22` keeps its title with its id.
The title is historical: its extension window is now extended bidding.

#### Scenario: grade10-site-auction-auto-bidding-SC-22 - An auto bid in the extension window extends once
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** a listing in extended bidding, and a leader whose committed maximum has room left
- **WHEN** a challenger's commitment causes Grade10 to raise the leader's bid on their behalf
- **THEN** that bid moves the listing's close exactly as a manual bid at that moment would
- **AND** the listing does not close while that extension stands
- **AND** Grade10 places no further bid until another commitment is accepted

#### Scenario: grade10-site-auction-auto-bidding-SC-23 - An auto bid is counted and recorded
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** Grade10 raises a bidder's bid on their behalf
- **WHEN** a collector reads the listing's bid count and history
- **THEN** the bid count includes that bid
- **AND** the history shows it as placed on that bidder's behalf, not as a manual bid

#### Scenario: grade10-site-auction-auto-bidding-SC-24 - Standing maxima do not keep bidding
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** two bidders have committed maxima and the listing has been resolved to the two-maximum price
- **WHEN** no further commitment is accepted
- **THEN** Grade10 places no further bid on either bidder's behalf
- **AND** the current bid is unchanged

#### Scenario: grade10-site-auction-auto-bidding-SC-26 - A maximum committed before the close counts toward extended bidding
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** an open listing whose only bidder committed a maximum before its
  scheduled close and leads at the starting price
- **WHEN** the scheduled close arrives
- **THEN** the listing enters extended bidding

### Requirement: Maximum commitments and automatic bids work without a bid-time authorization

When bid-time authorization holds are disabled, Grade10 SHALL accept a valid
maximum under the auction rules without waiting for or creating a bid-time
authorization. The enabled hold path and maximum rules remain unchanged.

#### Scenario: grade10-site-auction-auto-bidding-SC-25 - A maximum works without a bid-time authorization
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** bid-time authorization holds are disabled and a listing has an accepted maximum
- **WHEN** a challenger commits a higher maximum
- **THEN** Grade10 resolves the two maxima and records the resulting bid without creating or waiting for an authorization
