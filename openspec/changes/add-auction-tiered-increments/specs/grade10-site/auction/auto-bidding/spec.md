# Auto-bidding — delta

## MODIFIED Requirements

### Requirement: Two-maximum rule

Only two numbers decide the listing: the highest maximum and the
second-highest. Everyone else is ignored.

The highest is the leader. When two maxima are equal, whoever Grade10
accepted first leads. With only one maximum, the price is the starting
price. With two or more, the current bid SHALL be the lesser of the
leader's maximum and the second-highest maximum plus one increment. The
current bid SHALL never exceed the leader's maximum.

The increment SHALL be the one `grade10-site/auction/bid-increments` gives for
the tier containing the **second-highest maximum**, read from the
listing's own increment table. That is the amount being beaten, so the
step is the same one a manual bid would have had to clear.

| You see this | Who is leading | The price |
| --- | --- | --- |
| You are the only bidder | You | The starting price |
| Someone bids lower than your maximum | You still lead | Their maximum plus the increment for their maximum's tier, stopping at your maximum |
| Someone bids higher than your maximum | Them | Your maximum plus the increment for your maximum's tier, stopping at their maximum |
| Someone matches your maximum | Whoever committed first | That maximum |

Worked examples. Starting price 20000, on Grade10's house default `HKD`
table, where the tier starting at 20000 has an increment of 2500 and the
tier starting at 50000 has an increment of 5000. A **maximum** is the most
a bidder will pay, not the price they are paying now. The public price is
one increment above the second-highest maximum, unless that would pass the
leader's maximum.

**Case 1 — you commit first**

| What happens | Current bid | Who leads |
| --- | --- | --- |
| You commit a maximum of 50000 | 20000 | You. 50000 is a hidden cap, not the price. |
| They commit a maximum of 22500 | 25000 | You still lead. Price is their 22500 plus 2500, the increment for its tier, not 22500. |
| They raise to 60000 | 55000 | Them. Price is your 50000 plus 5000, the increment for its tier. They do not pay 60000; 55000 is enough to beat you. |

**Case 2 — they commit first, you take the lead, they raise twice**

| What happens | Current bid | Who leads |
| --- | --- | --- |
| They commit a maximum of 22500 | 20000 | Them. 22500 is their hidden cap, not the price. |
| You commit a maximum of 50000 | 25000 | You take the lead. Price is their 22500 plus 2500. You do not pay 50000. |
| They raise to 30000 | 32500 | You still lead. 30000 is below your 50000. Price is their 30000 plus 2500. |
| They raise to 60000 | 55000 | Them. Price is your 50000 plus 5000, the increment for its tier. They do not pay 60000; 55000 is enough to beat you. |

A later commitment equal to the leader's maximum SHALL NOT be refused: it
is accepted, it sets the current bid to that maximum, and it does not
displace the leader.

#### Scenario: auto-bidding-SC-09 - A challenger below the leader's maximum raises the price only

- **GIVEN** a listing on the house default table, where the tier containing 22500 minor units has an increment of 2500
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

- **GIVEN** the listing from the previous scenario, where A's maximum is 50000 minor units and the tier containing 50000 has an increment of 5000
- **WHEN** bidder B raises their maximum to 60000 minor units
- **THEN** bidder B leads
- **AND** the current bid is 55000 minor units

#### Scenario: auto-bidding-SC-12 - The first bidder is overtaken by a higher maximum

- **GIVEN** an open listing with a starting price of 20000 minor units on the house default table
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

- **GIVEN** the listing from the previous scenario, where B's maximum is 50000 minor units and the tier containing 50000 has an increment of 5000
- **WHEN** bidder A raises their maximum to 60000 minor units
- **THEN** bidder A leads
- **AND** the current bid is 55000 minor units

#### Scenario: auto-bidding-SC-15 - The step to lead cannot exceed the new leader's maximum

- **GIVEN** a listing on the house default table, where the tier containing 50000 minor units has an increment of 5000
- **AND** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** bidder B commits a maximum of 51000 minor units
- **THEN** bidder B leads
- **AND** the current bid is 51000 minor units

#### Scenario: auto-bidding-SC-16 - A challenge lands at the two-maximum price, not a ladder

- **GIVEN** a listing on the house default table, starting price 20000 minor units, and no bids
- **AND** bidder A has committed a maximum of 50000 minor units
- **WHEN** bidder B commits a maximum of 80000 minor units
- **THEN** bidder B leads
- **AND** the current bid is 55000 minor units
- **AND** Grade10 has not accepted bids at the intermediate increment amounts between 20000 and 55000

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
