## Feature set

- Custom maximum ceiling
  - Major-unit cap: draft cannot exceed 9,999,999,999 whole major units
  - Restore on overshoot: paste or keystroke that would exceed leaves the previous valid draft
  - No ceiling error copy: refuse is silent, same feel as refusing a decimal mark

## ADDED Requirements

### Requirement: Custom maximum entry respects a major-unit ceiling

`ListingAuctionBidCard` SHALL accept a custom private-maximum draft only when
the whole major-unit integer is at most 9,999,999,999, regardless of listing
currency. The ceiling applies after whole-major cleaning (non-digits stripped;
a decimal mark and its fraction discarded). An edit — typed or pasted — whose
cleaned major-unit value would exceed that ceiling SHALL leave the previous
valid draft unchanged, including when that draft is empty. The field SHALL NOT
clamp the draft to the ceiling. Exactly 9,999,999,999 SHALL be accepted. The
refuse alone SHALL NOT show an invalid-amount or below-floor message. Set and
raise private maximum share this field and this rule.

Committed amounts remain an integer count of minor units at or above the
existing floor rules.

#### Scenario: shared-ui-auction-listing-SC-38 - A draft at the ceiling is accepted

- **GIVEN** an HKD listing bid panel whose custom maximum field is empty
- **WHEN** a collector enters `9999999999` into the custom maximum field
- **THEN** the draft shown is `9999999999`

#### Scenario: shared-ui-auction-listing-SC-39 - A typed digit beyond the ceiling restores the previous draft

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `9999999999`
- **WHEN** a collector types `0` into the custom maximum field
- **THEN** the draft remains `9999999999`

#### Scenario: shared-ui-auction-listing-SC-40 - A paste beyond the ceiling from an empty field stays empty

- **GIVEN** an HKD listing bid panel with the custom maximum field empty
- **WHEN** a collector pastes `10000000000` into the custom maximum field
- **THEN** the draft remains empty
- **AND** no invalid-amount message appears solely because of the rejected
  paste

#### Scenario: shared-ui-auction-listing-SC-41 - A paste beyond the ceiling restores the prior draft

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `500`
- **WHEN** a collector pastes `99999999999` into the custom maximum field
- **THEN** the draft remains `500`

#### Scenario: shared-ui-auction-listing-SC-42 - A fractional paste that exceeds after whole-major cleaning restores the prior draft

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `500`
- **WHEN** a collector pastes `10000000000.99` into the custom maximum field
- **THEN** the draft remains `500`

#### Scenario: shared-ui-auction-listing-SC-43 - Raise path restores on overshoot

- **GIVEN** an HKD listing bid panel showing Raise your private maximum whose
  custom maximum draft is `9999999999`
- **WHEN** a collector types `1` into the custom maximum field
- **THEN** the draft remains `9999999999`
