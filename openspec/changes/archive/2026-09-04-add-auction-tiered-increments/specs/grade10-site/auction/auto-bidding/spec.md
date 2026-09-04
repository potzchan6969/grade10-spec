# Auto-bidding — delta

## Feature set

- Tiered proxy price
  - Same policy: proxy bidding takes its increment from Grade10's schedule
  - One resolution: a new maximum records only its resulting public price

## MODIFIED Requirements

### Requirement: Two-maximum rule

Only the highest and second-highest maxima decide the listing price. The
highest maximum leads; equal maxima retain the earlier accepted leader. With
one maximum, the current bid is the starting price. With two or more, the
current bid SHALL be the lesser of the leader's maximum and the second-highest
maximum plus the increment that `grade10-site/auction/bid-increments` selects
for that second-highest maximum.

The current bid SHALL never exceed the leader's maximum. Grade10 SHALL resolve
once per accepted maximum and SHALL NOT step through intermediate bids.

#### Scenario: grade10-site-auction-auto-bidding-SC-09 - A challenger below the leader's maximum raises the price only

- **GIVEN** an HKD listing where A leads with a maximum of 50000 minor units
- **WHEN** B commits a maximum of 22500 minor units
- **THEN** A still leads
- **AND** the current bid is 23500 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-11 - A challenger above the leader's maximum takes the lead

- **GIVEN** an HKD listing where A leads with a maximum of 800000 minor units
- **WHEN** B commits a maximum of 900000 minor units
- **THEN** B leads
- **AND** the current bid is 820000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-15 - The step to lead cannot exceed the new leader's maximum

- **GIVEN** an HKD listing where A leads with a maximum of 800000 minor units
- **WHEN** B commits a maximum of 810000 minor units
- **THEN** B leads
- **AND** the current bid is 810000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-16 - A challenge lands at the two-maximum price, not a ladder

- **GIVEN** an HKD listing with a starting price of 20000 minor units and A's maximum of 50000 minor units
- **WHEN** B commits a maximum of 80000 minor units
- **THEN** B leads at 54000 minor units
- **AND** Grade10 has not accepted intermediate bids between 20000 and 54000

#### Scenario: grade10-site-auction-auto-bidding-SC-10 - A challenger raises again, still below

- **GIVEN** A leads an HKD listing at a current bid of 23500 minor units
- **WHEN** B raises their maximum from 22500 to 30000 minor units
- **THEN** A still leads at 31000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-12 - The first bidder is overtaken by a higher maximum

- **GIVEN** an HKD listing with starting price 20000 minor units and A's maximum of 22500 minor units
- **WHEN** B commits a maximum of 50000 minor units
- **THEN** B leads at 23500 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-13 - The overtaken bidder raises but stays below

- **GIVEN** B leads an HKD listing with a maximum of 50000 minor units
- **WHEN** A raises their maximum to 30000 minor units
- **THEN** B still leads at 31000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-14 - The overtaken bidder raises past the leader

- **GIVEN** B leads an HKD listing with a maximum of 50000 minor units
- **WHEN** A raises their maximum to 60000 minor units
- **THEN** A leads at 51000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-17 - A tie goes to the earlier commitment

- **GIVEN** B leads with a maximum of 60000 minor units
- **WHEN** C commits the same maximum
- **THEN** B remains the leader and the current bid is 60000 minor units

#### Scenario: grade10-site-auction-auto-bidding-SC-18 - A tie is not a refusal

- **GIVEN** B leads an HKD listing with a maximum of 60000 minor units
- **WHEN** C commits the same maximum
- **THEN** Grade10 accepts C's commitment and reports that C does not lead
