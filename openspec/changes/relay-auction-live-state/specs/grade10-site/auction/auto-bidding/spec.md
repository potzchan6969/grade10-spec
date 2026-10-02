# grade10-site/auction/auto-bidding Specification

## Feature set

- Commit a maximum
  - First maximum opens bidding: an accepted cap takes the lead at the opening
    price - the starting price, or the currency's lowest increment on a 0 start -
    while the cap itself stays hidden
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

## MODIFIED Requirements

### Requirement: Two-maximum rule

Only the highest and second-highest maxima decide the listing price. The
highest maximum leads; equal maxima retain the earlier accepted leader. With
one maximum, the current bid is the starting price; on a listing that starts
at 0 it SHALL be the increment `grade10-site/auction/bid-increments` selects
for 0, never 0. With two or more, the
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

<!-- trace:scenario id=g10.auction-auto-bidding.SC-arz rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-09 - A challenger below the leader's maximum raises the price only
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing where A leads with a maximum of 50000 minor units
- **WHEN** B commits a maximum of 22500 minor units
- **THEN** A still leads
- **AND** the current bid is 23500 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-5mw rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-11 - A challenger above the leader's maximum takes the lead
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing where A leads with a maximum of 800000 minor units
- **WHEN** B commits a maximum of 900000 minor units
- **THEN** B leads
- **AND** the current bid is 820000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-hvc rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-15 - The step to lead cannot exceed the new leader's maximum
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing where A leads with a maximum of 800000 minor units
- **WHEN** B commits a maximum of 810000 minor units
- **THEN** B leads
- **AND** the current bid is 810000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-wgx rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-16 - A challenge lands at the two-maximum price, not a ladder
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing with a starting price of 20000 minor units and A's maximum of 50000 minor units
- **WHEN** B commits a maximum of 80000 minor units
- **THEN** B leads at 54000 minor units
- **AND** Grade10 has not accepted intermediate bids between 20000 and 54000

<!-- trace:scenario id=g10.auction-auto-bidding.SC-edj rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-10 - A challenger raises again, still below
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** A leads an HKD listing at a current bid of 23500 minor units
- **WHEN** B raises their maximum from 22500 to 30000 minor units
- **THEN** A still leads at 31000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-bqs rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-12 - The first bidder is overtaken by a higher maximum
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing with starting price 20000 minor units and A's maximum of 22500 minor units
- **WHEN** B commits a maximum of 50000 minor units
- **THEN** B leads at 23500 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-xwb rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-13 - The overtaken bidder raises but stays below
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** B leads an HKD listing with a maximum of 50000 minor units
- **WHEN** A raises their maximum to 30000 minor units
- **THEN** B still leads at 31000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-n5u rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-14 - The overtaken bidder raises past the leader
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** B leads an HKD listing with a maximum of 50000 minor units
- **WHEN** A raises their maximum to 60000 minor units
- **THEN** A leads at 51000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-52s rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-17 - A tie goes to the earlier commitment
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** B leads with a maximum of 60000 minor units
- **WHEN** C commits the same maximum
- **THEN** B remains the leader and the current bid is 60000 minor units
- **AND** the public history records C's accepted action at 60000 minor units
- **AND** the public history then records B's automatic response at 60000 minor units
- **AND** both records belong to the same resolution timestamp group

<!-- trace:scenario id=g10.auction-auto-bidding.SC-eiw rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-18 - A tie is not a refusal
**Serves:** grade10-site-auction-auto-bidding-US-02 - Collector reads their own maximum and standing

- **GIVEN** B leads an HKD listing with a maximum of 60000 minor units
- **WHEN** C commits the same maximum
- **THEN** Grade10 accepts C's commitment and reports that C does not lead
- **AND** the public history records C's accepted action followed by B's automatic response
- **AND** both records show the resolved amount of 60000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-30 - A lone maximum on a 0 start stands at the lowest increment
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector opens bidding on a lot that starts at nothing

- **GIVEN** an open `HKD` listing with a starting price of 0 and no bids
- **WHEN** a collector commits a maximum of 50000 minor units
- **THEN** Grade10 accepts the commitment and that collector leads
- **AND** the current bid is 1000 minor units, not 0
- **AND** the public history records one bid, that collector's, at 1000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-30a - A second maximum on a 0 start clears one increment above the opening price
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** an open `HKD` listing with a starting price of 0, where A's
  maximum of 50000 minor units stands alone at 1000 minor units
- **WHEN** B commits a maximum of 1000 minor units
- **THEN** Grade10 refuses it and names 2000 minor units as the minimum
- **AND** A still leads at 1000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-31 - A lone bidder on a 0 start never wins at 0
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector opens bidding on a lot that starts at nothing

- **GIVEN** a `USD` listing with a starting price of 0 and one committed maximum of 100 minor units
- **WHEN** the listing closes with no other commitment
- **THEN** that collector wins at 100 minor units
