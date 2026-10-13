## Purpose

Shared auction listing blocks disclose the buyer's premium on the bid panel
before a collector commits a maximum. They are the shared listing product-page
blocks every auction storefront composes: the media gallery, the bid panel,
the bid history, and the details section. The bid history carries accepted
instants so collector activity can be localized without changing the listing's
authoritative event data.

## Feature set

- Custom maximum ceiling
  - Major-unit cap: USD 10,000,000, HKD 80,000,000 and JPY 5,000,000,000 whole major units
  - Restore on overshoot: an appended typed digit that would exceed the cap leaves the prior draft
  - Replacement and paste: an oversized cleaned amount becomes the currency cap
  - Whole-major cleaning: discard a pasted fractional suffix without rounding before checking the cap
  - No ceiling error copy: no maximum-bid or invalid-amount message solely for the ceiling correction
  - Set and raise: the same field rule; exactly the cap is accepted

## MODIFIED Requirements

### Requirement: Custom maximum entry respects a major-unit ceiling

`ListingAuctionBidCard` SHALL accept a custom private-maximum draft up to the listing currency's ceiling. Its consumer SHALL supply that ceiling in integer minor units on the existing currency-bearing bid view; the shared block SHALL NOT choose currency policy.

| Currency | Ceiling (minor units) | Whole-major ceiling |
| --- | --- | --- |
| USD | 1000000000 | 10000000 |
| HKD | 8000000000 | 80000000 |
| JPY | 5000000000 | 5000000000 |

**After cleaning** - The ceiling SHALL apply after whole-major cleaning: non-digits are stripped and a decimal mark and its fraction are discarded without rounding.

**Typed append** - An appended typed digit whose cleaned whole-major value exceeds the ceiling SHALL leave the previous valid draft unchanged.

**Replacement and paste** - An oversized replacement or paste SHALL show the currency's whole-major ceiling, including a paste into an empty field or a paste appended to an existing draft.

**At the ceiling** - Exactly the ceiling SHALL be accepted, including a fractional paste whose whole-major result equals it.

**No ceiling error copy** - Ceiling correction alone SHALL NOT show a maximum-bid, invalid-amount or below-floor message.

**Set and raise** - Set and raise private maximum SHALL share this field and rule.

**Committed amounts** - Committed amounts remain an integer count of minor units at or above the existing floor rules.

<!-- trace:scenario id=g10.shared-auction-listing.SC-9e0 rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-38 - A draft at the ceiling is accepted
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

- **GIVEN** an HKD listing bid panel whose custom maximum field is empty
- **WHEN** a collector enters `80000000` into the custom maximum field
- **THEN** the draft shown is `80000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-8ym rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-39 - A typed digit beyond the ceiling restores the previous draft
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `80000000`
- **WHEN** a collector appends a typed `0`
- **THEN** the draft remains `80000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-wdd rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-40 - A paste beyond the ceiling from an empty field stays empty
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

**Historical title** - The issued title is retained; the result below replaces empty-on-paste with the currency ceiling.

- **GIVEN** an HKD listing bid panel whose custom maximum field is empty
- **WHEN** a collector pastes `80000001`
- **THEN** the draft shown is `80000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-z2x rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-41 - A paste beyond the ceiling restores the prior draft
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

**Historical title** - The issued title is retained; the result below replaces paste restoration with the currency ceiling.

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `500`
- **WHEN** a collector replaces it by pasting `99999999999`
- **THEN** the draft shown is `80000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-y2e rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-42 - A fractional paste that exceeds after whole-major cleaning restores the prior draft
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

**Historical title** - The issued title is retained; the result below uses the currency ceiling after cleaning.

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `500`
- **WHEN** a collector pastes `80000001.99`
- **THEN** the draft shown is `80000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-xxl rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-43 - Raise path restores on overshoot
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

- **GIVEN** an HKD listing bid panel showing Raise your private maximum whose custom maximum draft is `80000000`
- **WHEN** a collector appends a typed `1`
- **THEN** the draft remains `80000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-6n7 rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-53 - A fractional paste at the ceiling after cleaning is accepted
**Serves:** Custom maximum ceiling - the collector reviews a corrected custom amount before committing

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `500`
- **WHEN** a collector pastes `80000000.99`
- **THEN** the draft shown is `80000000`
- **AND** no message appears solely because of the ceiling correction

<!-- trace:scenario id=g10.shared-auction-listing.SC-q3n rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-58 - Every supported currency accepts its ceiling in set and raise
**Serves:** Custom maximum ceiling - the collector reviews an amount in the listing currency through either maximum mode

- **GIVEN** a USD, HKD or JPY bid panel in set or raise mode with an eligible floor below its currency ceiling
- **WHEN** the collector enters respectively `10000000`, `80000000` or `5000000000` and commits
- **THEN** the draft stays at that whole-major amount and the callback receives respectively 1000000000 USD, 8000000000 HKD or 5000000000 JPY minor units

<!-- trace:scenario id=g10.shared-auction-listing.SC-qdv rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-59 - Oversized replacement uses each currency's ceiling
**Serves:** Custom maximum ceiling - the collector reviews an amount in the listing currency through either maximum mode

- **GIVEN** a USD, HKD or JPY bid panel in set or raise mode with a valid draft
- **WHEN** the collector replaces the draft with respectively `10000001`, `80000001` or `5000000001`, by typing or paste
- **THEN** the draft shows respectively `10000000`, `80000000` or `5000000000`, without a ceiling message

<!-- trace:scenario id=g10.shared-auction-listing.SC-2wv rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-60 - A pasted suffix uses the ceiling while a typed suffix restores
**Serves:** Custom maximum ceiling - the collector reviews an amount in the listing currency through either maximum mode

- **GIVEN** a USD, HKD or JPY bid panel in set or raise mode whose draft equals its currency ceiling
- **WHEN** the collector appends an extra digit by paste or by typing
- **THEN** paste leaves the currency ceiling shown, typing retains the previous draft, and neither shows a ceiling message
