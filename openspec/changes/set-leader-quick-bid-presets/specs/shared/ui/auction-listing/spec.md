## Feature set

- Quick bids
  - Increment steps: three chips at 1×, 2×, and 4× the listing increment
  - Leader base: chips add those steps to the committed maximum
  - Field base: chips add those steps to the current public bid
- Raise floor
  - Leader minimum: a typed raise starts at the maximum plus 100 minor units
  - Separate from chips: the first chip is not that typed minimum

## ADDED Requirements

### Requirement: Quick-bid chips step the listing increment

`ListingAuctionBidCard` SHALL offer three quick-bid amounts: 1×, 2×, and 4×
the listing increment supplied on the view.

When the viewer leads with a committed maximum, those amounts SHALL be that
maximum plus those multiples. When the viewer does not lead, they SHALL be
the current bid plus those multiples.

The first chip SHALL NOT be replaced by the typed raise floor.

#### Scenario: shared-ui-auction-listing-SC-31 - A leader's chips step from the committed max

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer leads with a maximum of
  200000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 204000, 208000, and 216000 HKD minor units

#### Scenario: shared-ui-auction-listing-SC-32 - A collector who does not lead steps from the current bid

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer has a maximum of 116000
  minor units and does not lead
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 124000, 128000, and 136000 HKD minor units

### Requirement: A leader's typed raise floor is max plus 100 minor units

When the viewer leads with a committed maximum and the current bid is below
that maximum, `ListingAuctionBidCard` SHALL set the custom-maximum minimum to
the greater of the listing's minimum next bid and that maximum plus 100
minor units. That floor SHALL NOT be used as the first quick-bid amount.

#### Scenario: shared-ui-auction-listing-SC-33 - A leader's typed minimum stays max plus $1

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, whose minimum next bid is 124000 minor
  units, and whose viewer leads with a maximum of 200000 minor units
- **WHEN** the bid card renders the custom maximum field
- **THEN** the field's minimum is 200100 HKD minor units
- **AND** the first quick-bid amount remains 204000 HKD minor units
