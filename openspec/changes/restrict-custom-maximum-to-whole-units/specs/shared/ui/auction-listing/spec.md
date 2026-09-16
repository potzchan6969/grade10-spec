## ADDED Requirements

### Requirement: Custom maximum entry is whole major units only

`ListingAuctionBidCard` SHALL accept a custom private-maximum draft only as a
whole count of major units in the listing currency. The field SHALL refuse a
typed decimal mark so it never appears in the draft. A pasted string that
holds a decimal mark and fraction SHALL become the integer major-unit digits
before that mark (no rounding). The presence of a discarded fraction alone
SHALL NOT be treated as an invalid amount.

Committed amounts remain an integer count of minor units: each whole major
unit maps by the currency's ISO 4217 exponent.

#### Scenario: shared-ui-auction-listing-SC-24 - A typed decimal mark is refused
**Serves:** Bid enrollment - a typed decimal mark is refused

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `100`
- **WHEN** a collector types `.` into the custom maximum field
- **THEN** the draft remains `100`
- **AND** the decimal mark does not appear in the field

#### Scenario: shared-ui-auction-listing-SC-25 - A pasted fractional amount falls back to the integer major units
**Serves:** Bid enrollment - a pasted fractional amount falls back to the integer major units

- **GIVEN** an HKD listing bid panel with the custom maximum field empty
- **WHEN** a collector pastes `208000.99` into the custom maximum field
- **THEN** the draft shown is `208000`
- **AND** no invalid-amount message appears solely because the paste held a
  fraction
