## Feature set

- Prices and window
  - Writable before publish: starting price, close, extension duration, and
    cap can change until the listing is live

## MODIFIED Requirements

### Requirement: Prices and window are writable before publish

While a listing is `draft` or `created`, an authorized operator SHALL be able
to set:

- **Currency** — an operator chooses an ISO 4217 three-letter code from the
  platform's supported currency list. Omitted at create SHALL store Grade10's
  store currency (`HKD`).
- **Starting price** — integer minor units greater than zero when set. Empty
  is allowed only while `draft`.
- **Minimum increment** — integer minor units greater than zero when set.
  Empty is allowed only while `draft`.
- The form SHALL show each entered minor-unit price as a separately formatted
  decimal amount in the selected currency, so an operator can verify its
  decimal placement before saving.
- **Starts at** — the scheduled bidding open. Empty is allowed only while
  `draft`.
- **Scheduled close at** — the published close. Empty is allowed only while
  `draft`. When both starts at and scheduled close at are set, scheduled
  close at MUST be after starts at. At create, scheduled close at MUST also
  be after now.
- **Extension duration (seconds)** — how long extended bidding runs after the
  scheduled close, and after each bid during it, per
  `grade10-site/auction/auction`. A whole number ≥ 0. Zero turns extended
  bidding off. Empty on draft is allowed. Omitted at create SHALL store
  `1800`.
- **Extension cap (seconds)** — optional whole number ≥ 0, or absent for an
  uncapped listing. The close MUST NOT move past scheduled close at plus
  this cap. A cap below the extension duration is a hard final deadline,
  not an error.

A listing SHALL carry no extension window, and this form SHALL NOT offer one.

Scenario `grade10-admin-auction-listing-SC-27` keeps its title with its id. The
title is historical: any extension window is now refused, with or without a
duration.

A write of any of these fields on a `published`, `closed`, `settled`, or
`canceled` listing SHALL be refused. The effective close is not an operator
field: extended bidding writes it, and this form SHALL NOT accept it.

**Sandbox** SHALL be writable only while `draft`. A sandbox listing runs on
test-mode payment credentials instead of live money, so the house can
rehearse a sale. A write of sandbox on a `created` or later listing SHALL
be refused.

#### Scenario: grade10-admin-auction-listing-SC-24 - Operator corrects a created listing's starting price
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing with starting price 100000 minor units `HKD`
- **WHEN** an authorized operator sets starting price to 150000 minor units
- **THEN** Grade10 stores 150000 minor units `HKD`
- **AND** the listing remains created

#### Scenario: grade10-admin-auction-listing-SC-25 - Published listing refuses a price change
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a published listing with starting price 100000 minor units
- **WHEN** an operator sets starting price to 150000 minor units
- **THEN** Grade10 refuses the write
- **AND** the starting price remains 100000 minor units

#### Scenario: grade10-admin-auction-listing-SC-26 - Scheduled close at in the past is refused at create
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft listing whose scheduled close at is not after now
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-27 - Extension window without a duration is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing
- **WHEN** an operator submits an extension window of 1800 seconds
- **THEN** Grade10 refuses the write
- **AND** the listing's extension settings are unchanged

#### Scenario: grade10-admin-auction-listing-SC-27a - Omitted extension fields default to 30 minutes
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft listing with every required field set and no extension
  duration supplied
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 stores an extension duration of 1800 seconds

#### Scenario: grade10-admin-auction-listing-SC-28 - Sandbox cannot change after create
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing that was drafted as sandbox
- **WHEN** an operator clears sandbox
- **THEN** Grade10 refuses the write
- **AND** the listing remains sandbox

#### Scenario: grade10-admin-auction-listing-SC-70 - A negative extension duration is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing
- **WHEN** an operator sets an extension duration of -60 seconds
- **THEN** Grade10 refuses the write
- **AND** the listing's extension settings are unchanged
