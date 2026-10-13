# shared/ui/auction-listing Specification

## Feature set

- Custom maximum ceiling
  - Major-unit cap: USD 10,000,000 whole major units, the one cap; the HKD and JPY caps retire

## MODIFIED Requirements

### Requirement: Custom maximum entry respects a major-unit ceiling

`ListingAuctionBidCard` SHALL accept a custom private-maximum draft up to the listing's ceiling, USD 10000000 whole major units. Its consumer SHALL supply that ceiling in integer minor units on the existing currency-bearing bid view; the shared block SHALL NOT choose currency policy.

| Currency | Ceiling (minor units) | Whole-major ceiling |
| --- | --- | --- |
| USD | 1000000000 | 10000000 |

USD is the one bid currency, so this is the one ceiling. There is no ceiling
for any other currency.

**After cleaning** - The ceiling SHALL apply after whole-major cleaning: non-digits are stripped and a decimal mark and its fraction are discarded without rounding.

**Typed append** - An appended typed digit whose cleaned whole-major value exceeds the ceiling SHALL leave the previous valid draft unchanged.

**Replacement and paste** - An oversized replacement or paste SHALL show the currency's whole-major ceiling, including a paste into an empty field or a paste appended to an existing draft.

**At the ceiling** - Exactly the ceiling SHALL be accepted, including a fractional paste whose whole-major result equals it.

**No ceiling error copy** - Ceiling correction alone SHALL NOT show a maximum-bid, invalid-amount or below-floor message.

**Set and raise** - Set and raise private maximum SHALL share this field and rule.

**Committed amounts** - Committed amounts remain an integer count of minor units at or above the existing floor rules.

<!-- trace:scenario id=g10.shared-auction-listing.SC-9e0 rev=3 -->
#### Scenario: shared-ui-auction-listing-SC-38 - A draft at the ceiling is accepted
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

- **GIVEN** a USD listing bid panel whose custom maximum field is empty
- **WHEN** a collector enters `10000000` into the custom maximum field
- **THEN** the draft shown is `10000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-8ym rev=3 -->
#### Scenario: shared-ui-auction-listing-SC-39 - A typed digit beyond the ceiling restores the previous draft
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

- **GIVEN** a USD listing bid panel whose custom maximum draft is `10000000`
- **WHEN** a collector appends a typed `0`
- **THEN** the draft remains `10000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-wdd rev=3 -->
#### Scenario: shared-ui-auction-listing-SC-40 - A paste beyond the ceiling from an empty field stays empty
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

**Historical title** - The issued title is retained; the result below replaces empty-on-paste with the currency ceiling.

- **GIVEN** a USD listing bid panel whose custom maximum field is empty
- **WHEN** a collector pastes `10000001`
- **THEN** the draft shown is `10000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-z2x rev=3 -->
#### Scenario: shared-ui-auction-listing-SC-41 - A paste beyond the ceiling restores the prior draft
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

**Historical title** - The issued title is retained; the result below replaces paste restoration with the currency ceiling.

- **GIVEN** a USD listing bid panel whose custom maximum draft is `500`
- **WHEN** a collector replaces it by pasting `99999999999`
- **THEN** the draft shown is `10000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-y2e rev=3 -->
#### Scenario: shared-ui-auction-listing-SC-42 - A fractional paste that exceeds after whole-major cleaning restores the prior draft
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

**Historical title** - The issued title is retained; the result below uses the currency ceiling after cleaning.

- **GIVEN** a USD listing bid panel whose custom maximum draft is `500`
- **WHEN** a collector pastes `10000001.99`
- **THEN** the draft shown is `10000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-xxl rev=3 -->
#### Scenario: shared-ui-auction-listing-SC-43 - Raise path restores on overshoot
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

- **GIVEN** a USD listing bid panel showing Raise your private maximum whose custom maximum draft is `10000000`
- **WHEN** a collector appends a typed `1`
- **THEN** the draft remains `10000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-6n7 rev=3 -->
#### Scenario: shared-ui-auction-listing-SC-53 - A fractional paste at the ceiling after cleaning is accepted
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

- **GIVEN** a USD listing bid panel whose custom maximum draft is `500`
- **WHEN** a collector pastes `10000000.99`
- **THEN** the draft shown is `10000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-q3n rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-58 - Every supported currency accepts its ceiling in set and raise
**Serves:** Custom maximum ceiling - the collector reviews an amount in the listing currency through either maximum mode

This scenario keeps its title with its id. The title is historical: USD is the
one supported currency.

- **GIVEN** a USD bid panel in set or raise mode with an eligible floor below its ceiling
- **WHEN** the collector enters `10000000` and commits
- **THEN** the draft stays at `10000000` and the callback receives 1000000000 USD minor units

<!-- trace:scenario id=g10.shared-auction-listing.SC-qdv rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-59 - Oversized replacement uses each currency's ceiling
**Serves:** Custom maximum ceiling - the collector reviews an amount in the listing currency through either maximum mode

This scenario keeps its title with its id. The title is historical: USD is the
one supported currency.

- **GIVEN** a USD bid panel in set or raise mode with a valid draft
- **WHEN** the collector replaces the draft with `10000001`, by typing or paste
- **THEN** the draft shows `10000000`, without a ceiling message

<!-- trace:scenario id=g10.shared-auction-listing.SC-2wv rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-60 - A pasted suffix uses the ceiling while a typed suffix restores
**Serves:** Custom maximum ceiling - the collector reviews an amount in the listing currency through either maximum mode

- **GIVEN** a USD bid panel in set or raise mode whose draft equals its ceiling
- **WHEN** the collector appends an extra digit by paste or by typing
- **THEN** paste leaves the ceiling shown, typing retains the previous draft, and neither shows a ceiling message

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

<!-- trace:scenario id=g10.shared-auction-listing.SC-7o5 rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-35 - A leader's chips step from the committed max
**Serves:** Quick bids - a leader's chips step from the committed max

- **GIVEN** a USD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer leads with a maximum of
  200000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 204000, 208000, and 216000 USD minor units

<!-- trace:scenario id=g10.shared-auction-listing.SC-t9f rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-36 - A collector who does not lead steps from the current bid
**Serves:** Quick bids - a collector who does not lead steps from the current bid

- **GIVEN** a USD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer has a maximum of 116000
  minor units and does not lead
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 124000, 128000, and 136000 USD minor units

<!-- trace:scenario id=g10.shared-auction-listing.SC-2s5 rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-52 - Before any bid chip 1x is the opening price
**Serves:** Quick bids - a collector meets the chips on a lot nobody has bid on

- **GIVEN** a USD listing with no accepted bid, whose view carries an
  opening price of 48000 minor units as both its minimum bid and its current
  bid, and an increment of 2000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 48000, 52000, and 56000 USD minor units
- **AND** the 48000 chip is captioned as the next eligible bid

<!-- trace:scenario id=g10.shared-auction-listing.SC-huw rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-61 - A chip stepping past the ceiling is offered at the ceiling
**Serves:** Quick bids - a chip above the ceiling is offered at the ceiling

- **GIVEN** a USD listing whose current bid is 120000 minor units, whose
  increment is 10000 minor units, whose ceiling is 1000000000 minor units,
  and whose viewer leads with a maximum of 999970000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 999980000, 999990000, and 1000000000 USD
  minor units
- **AND** the last chip is captioned as the auction's limit

<!-- trace:scenario id=g10.shared-auction-listing.SC-atq rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-62 - Chips that clamp to the same amount merge to one
**Serves:** Quick bids - chips clamped onto the same amount merge to one

- **GIVEN** a USD listing whose increment is 10000 minor units, whose ceiling
  is 1000000000 minor units, and whose viewer leads with a maximum of
  999990000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the row shows one chip at 1000000000 USD minor units, captioned as
  the auction's limit

### Requirement: A leader's typed raise floor is max plus 100 minor units

When the viewer leads with a committed maximum and the current bid is below
that maximum, `ListingAuctionBidCard` SHALL set the custom-maximum minimum to
the greater of the listing's minimum next bid and that maximum plus 100
minor units. That floor SHALL NOT be used as the first quick-bid amount.

A raise floor that exceeds the view's ceiling SHALL leave no legal amount,
and the card SHALL offer no amount entry.

<!-- trace:scenario id=g10.shared-auction-listing.SC-dv0 rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-37 - A leader's typed minimum stays max plus $1
**Serves:** Raise floor - a leader's typed minimum stays max plus $1

- **GIVEN** a USD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, whose minimum next bid is 124000 minor
  units, and whose viewer leads with a maximum of 200000 minor units
- **WHEN** the bid card renders the custom maximum field
- **THEN** the field's minimum is 200100 USD minor units
- **AND** the first quick-bid amount remains 204000 USD minor units

<!-- trace:scenario id=g10.shared-auction-listing.SC-1mi rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-63 - A raise floor above the ceiling leaves no entry
**Serves:** Raise floor - a raise floor above the ceiling leaves no legal amount

- **GIVEN** a USD listing whose current bid is 999995000 minor units, whose
  increment is 10000 minor units, whose ceiling is 1000000000 minor units,
  and whose viewer leads with a maximum of 999995000 minor units
- **WHEN** the bid card renders
- **THEN** no quick-bid chip, no custom maximum field and no bid action
  render

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

<!-- trace:scenario id=g10.shared-auction-listing.SC-v6g rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-64 - A maximum at the ceiling collapses the entry group
**Serves:** Ceiling reached - the collector's maximum leads the collapsed row

- **GIVEN** a USD listing whose ceiling is 1000000000 minor units and whose
  viewer leads with a maximum of 1000000000 minor units
- **WHEN** the bid card renders
- **THEN** no quick-bid chip, no custom maximum field and no bid action
  render
- **AND** a status row leads with the viewer's maximum of 1000000000 minor
  units, then a line that the auction accepts no higher amount
- **AND** the buyer-fee line renders

<!-- trace:scenario id=g10.shared-auction-listing.SC-cfl rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-65 - A lot priced past the ceiling offers no entry
**Serves:** Ceiling reached - the lot's ceiling leads the collapsed row

- **GIVEN** a USD listing whose minimum next bid exceeds the 1000000000
  minor-unit ceiling and whose viewer holds no maximum
- **WHEN** the bid card renders
- **THEN** no quick-bid chip, no custom maximum field and no bid action
  render
- **AND** a status row names the ceiling amount and a line that bidding has
  reached the highest amount the auction accepts

<!-- trace:scenario id=g10.shared-auction-listing.SC-rnz rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-66 - The collapse outranks the card setup lock
**Serves:** Ceiling reached - the collapse precedes the enrollment lock

- **GIVEN** a USD listing under the needs-card enrollment signal whose viewer
  leads with a maximum of 1000000000 minor units
- **WHEN** the bid card renders
- **THEN** the collapsed status row renders
- **AND** the disabled chips, custom field and link-card action do not render

## REMOVED Requirements

None.
