## Feature set

- Optional authorization
  - Disabled by default: a valid bid does not wait for or create a bid-time authorization hold

## ADDED Requirements

### Requirement: A standard bid does not require a bid-time authorization

When bid-time authorization holds are disabled, Grade10 SHALL accept a valid
bid without waiting for or creating a bid-time authorization. The existing
hold-backed behavior remains governed by
`grade10-site/auction/bid-payment-method` when enabled.

#### Scenario: grade10-site-auction-auction-SC-23 - The default bid path creates no authorization hold

- **GIVEN** bid-time authorization holds are disabled
- **WHEN** a collector submits a valid bid on an open listing
- **THEN** Grade10 accepts the bid according to the listing's bid rules without waiting for Stripe
- **AND** it creates no bid-time authorization
