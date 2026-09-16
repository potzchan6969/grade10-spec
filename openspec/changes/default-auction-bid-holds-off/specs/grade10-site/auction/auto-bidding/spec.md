## Feature set

- Optional authorization
  - Disabled by default: maximum commitments and automatic bids do not wait for or create a bid-time authorization

## ADDED Requirements

### Requirement: Maximum commitments and automatic bids work without a bid-time authorization

When bid-time authorization holds are disabled, Grade10 SHALL accept a valid
maximum under the auction rules without waiting for or creating a bid-time
authorization. The enabled hold path and maximum rules remain unchanged.

#### Scenario: grade10-site-auction-auto-bidding-SC-25 - A maximum works without a bid-time authorization

- **GIVEN** bid-time authorization holds are disabled and a listing has an accepted maximum
- **WHEN** a challenger commits a higher maximum
- **THEN** Grade10 resolves the two maxima and records the resulting bid without creating or waiting for an authorization
