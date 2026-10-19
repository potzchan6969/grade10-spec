## Purpose

Shared auction listing blocks disclose the buyer's premium on the bid panel
before a collector commits a maximum. They are the shared listing product-page
blocks every auction storefront composes: the media gallery, the bid panel,
the bid history, and the details section. The bid history carries accepted
instants so collector activity can be localized without changing the listing's
authoritative event data.

## Feature set

- Quick bids
  - Increment steps: three chips at 1×, 2×, and 4× the listing increment
  - Leader base: chips add those steps to the committed maximum
  - Field base: chips add those steps to the current public bid
  - Opening base: before any bid, chip 1x is the opening price, the next eligible bid
  - Ceiling clamp: a chip above the supplied ceiling is offered at the ceiling, captioned as the limit
  - Merged chips: chips landing on the same amount merge to one
- Raise floor
  - Leader minimum: a typed raise starts at the maximum plus 100 minor units
  - Separate from chips: the first chip is not that typed minimum
  - Ceiling bound: a raise floor above the ceiling leaves no legal amount
- Ceiling reached
  - Collapsed entry: no chips, no custom field and no bid action when no legal amount exists
  - Two readings: the collector's own maximum leads the row, or the lot's ceiling does
  - Fee stays: the buyer-fee line survives the collapse
  - Precedence: the collapse outranks the needs-card lock

## MODIFIED Requirements

### Requirement: Quick-bid chips step the listing increment

`ListingAuctionBidCard` SHALL offer three quick-bid amounts: 1×, 2×, and 4×
the listing increment supplied on the view.

When the viewer leads with a committed maximum, those amounts SHALL be that
maximum plus those multiples. When the viewer does not lead, they SHALL be
the current bid plus those multiples, except that before any bid the 1×
amount SHALL be the view's minimum bid, the opening price itself; the 2× and
4× amounts still add their multiples to the current bid on the view.

A stepped amount above the view's ceiling SHALL be offered at the ceiling,
captioned as the auction's limit rather than the amount's delta. Chips that
would show the same amount SHALL merge to one chip, so the row MAY hold fewer
than three chips.

The first chip SHALL NOT be replaced by the typed raise floor.

<!-- trace:scenario id=g10.shared-auction-listing.SC-7o5 rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-35 - A leader's chips step from the committed max
**Serves:** Quick bids - a leader's chips step from the committed max

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer leads with a maximum of
  200000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 204000, 208000, and 216000 HKD minor units

<!-- trace:scenario id=g10.shared-auction-listing.SC-t9f rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-36 - A collector who does not lead steps from the current bid
**Serves:** Quick bids - a collector who does not lead steps from the current bid

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer has a maximum of 116000
  minor units and does not lead
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 124000, 128000, and 136000 HKD minor units

<!-- trace:scenario id=g10.shared-auction-listing.SC-2s5 rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-52 - Before any bid chip 1x is the opening price
**Serves:** Quick bids - a collector meets the chips on a lot nobody has bid on

- **GIVEN** an HKD listing with no accepted bid, whose view carries an
  opening price of 48000 minor units as both its minimum bid and its current
  bid, and an increment of 2000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 48000, 52000, and 56000 HKD minor units
- **AND** the 48000 chip is captioned as the next eligible bid

<!-- trace:scenario id=g10.shared-auction-listing.SC-huw rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-61 - A chip stepping past the ceiling is offered at the ceiling
**Serves:** Quick bids - a chip above the ceiling is offered at the ceiling

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 10000 minor units, whose ceiling is 8000000000 minor units,
  and whose viewer leads with a maximum of 7999970000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 7999980000, 7999990000, and 8000000000 HKD
  minor units
- **AND** the last chip is captioned as the auction's limit

<!-- trace:scenario id=g10.shared-auction-listing.SC-atq rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-62 - Chips that clamp to the same amount merge to one
**Serves:** Quick bids - chips clamped onto the same amount merge to one

- **GIVEN** an HKD listing whose increment is 10000 minor units, whose ceiling
  is 8000000000 minor units, and whose viewer leads with a maximum of
  7999990000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the row shows one chip at 8000000000 HKD minor units, captioned as
  the auction's limit

### Requirement: A leader's typed raise floor is max plus 100 minor units

When the viewer leads with a committed maximum and the current bid is below
that maximum, `ListingAuctionBidCard` SHALL set the custom-maximum minimum to
the greater of the listing's minimum next bid and that maximum plus 100
minor units. That floor SHALL NOT be used as the first quick-bid amount.

A raise floor that exceeds the view's ceiling SHALL leave no legal amount,
and the card SHALL offer no amount entry.

<!-- trace:scenario id=g10.shared-auction-listing.SC-dv0 rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-37 - A leader's typed minimum stays max plus $1
**Serves:** Raise floor - a leader's typed minimum stays max plus $1

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, whose minimum next bid is 124000 minor
  units, and whose viewer leads with a maximum of 200000 minor units
- **WHEN** the bid card renders the custom maximum field
- **THEN** the field's minimum is 200100 HKD minor units
- **AND** the first quick-bid amount remains 204000 HKD minor units

<!-- trace:scenario id=g10.shared-auction-listing.SC-1mi rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-63 - A raise floor above the ceiling leaves no entry
**Serves:** Raise floor - a raise floor above the ceiling leaves no legal amount

- **GIVEN** an HKD listing whose current bid is 7999995000 minor units, whose
  increment is 10000 minor units, whose ceiling is 8000000000 minor units,
  and whose viewer leads with a maximum of 7999995000 minor units
- **WHEN** the bid card renders
- **THEN** no quick-bid chip, no custom maximum field and no bid action
  render

## ADDED Requirements

### Requirement: The bid panel offers no entry when no amount is legal

When the amount floor exceeds the view's ceiling, `ListingAuctionBidCard`
SHALL render no quick-bid chips, no custom maximum field and no bid action.
It SHALL render a status row naming the amount reached and a line that the
auction accepts no higher amount.

A viewer holding a committed maximum SHALL see that maximum lead the row,
with the private-maximum explanation behind its Info trigger. A viewer
holding none SHALL see the ceiling amount lead the row. The raise-mechanism
line SHALL NOT render.

The buyer-fee line SHALL render while the viewer is signed in. The collapse
SHALL take precedence over the needs-card enrollment lock.

<!-- trace:scenario id=g10.shared-auction-listing.SC-v6g rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-64 - A maximum at the ceiling collapses the entry group
**Serves:** Ceiling reached - the collector's maximum leads the collapsed row

- **GIVEN** an HKD listing whose ceiling is 8000000000 minor units and whose
  viewer leads with a maximum of 8000000000 minor units
- **WHEN** the bid card renders
- **THEN** no quick-bid chip, no custom maximum field and no bid action
  render
- **AND** a status row leads with the viewer's maximum of 8000000000 minor
  units, then a line that the auction accepts no higher amount
- **AND** the buyer-fee line renders

<!-- trace:scenario id=g10.shared-auction-listing.SC-cfl rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-65 - A lot priced past the ceiling offers no entry
**Serves:** Ceiling reached - the lot's ceiling leads the collapsed row

- **GIVEN** an HKD listing whose minimum next bid exceeds the 8000000000
  minor-unit ceiling and whose viewer holds no maximum
- **WHEN** the bid card renders
- **THEN** no quick-bid chip, no custom maximum field and no bid action
  render
- **AND** a status row names the ceiling amount and a line that bidding has
  reached the highest amount the auction accepts

<!-- trace:scenario id=g10.shared-auction-listing.SC-rnz rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-66 - The collapse outranks the card setup lock
**Serves:** Ceiling reached - the collapse precedes the enrollment lock

- **GIVEN** an HKD listing under the needs-card enrollment signal whose viewer
  leads with a maximum of 8000000000 minor units
- **WHEN** the bid card renders
- **THEN** the collapsed status row renders
- **AND** the disabled chips, custom field and link-card action do not render
