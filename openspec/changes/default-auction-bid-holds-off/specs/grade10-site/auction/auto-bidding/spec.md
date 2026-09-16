## Feature set

- Optional authorization
  - Disabled by default: maximum commitments and automatic bids do not wait for or create a bid-time authorization
- Mechanism disclosure
  - Default copy: always-on panel subtext and confirm tooltips describe bid-as-needed and raise-only without promising a hold
  - Enabled-hold copy: when holds are on, mechanism copy also states that the hold matches the maximum

## ADDED Requirements

### Requirement: Maximum commitments and automatic bids work without a bid-time authorization

When bid-time authorization holds are disabled, Grade10 SHALL accept a valid
maximum under the auction rules without waiting for or creating a bid-time
authorization. The enabled hold path and maximum rules remain unchanged.

#### Scenario: grade10-site-auction-auto-bidding-SC-25 - A maximum works without a bid-time authorization
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's automatic bids work with or without a hold

- **GIVEN** bid-time authorization holds are disabled and a listing has an accepted maximum
- **WHEN** a challenger commits a higher maximum
- **THEN** Grade10 resolves the two maxima and records the resulting bid without creating or waiting for an authorization

### Requirement: Default mechanism disclosure does not promise a hold

When bid-time authorization holds are disabled, the bid panel's always-on
mechanism subtext and the confirm / auto-bidding tooltips SHALL state that
Grade10 bids only as needed up to the maximum and that the maximum can be
raised but not lowered or cancelled. They SHALL NOT state that a card hold
matches the maximum. When holds are enabled, that mechanism copy SHALL also
state that the hold matches the maximum.

#### Scenario: grade10-site-auction-auto-bidding-SC-28 - Default mechanism copy omits hold language

- **GIVEN** bid-time authorization holds are disabled
- **WHEN** a collector reads the mechanism subtext under Set your private maximum
- **THEN** the copy states bid-as-needed and raise-only
- **AND** the copy does not promise a card hold

#### Scenario: grade10-site-auction-auto-bidding-SC-29 - Enabled-hold mechanism copy names the hold

- **GIVEN** bid-time authorization holds are enabled
- **WHEN** a collector reads the mechanism subtext under Set your private maximum
- **THEN** the copy also states that the hold matches the maximum
