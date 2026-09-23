# shared/ui/auction-order Specification

## Purpose

The shared auction-order address form lets an application collect delivery and
billing addresses — including personal or company kind and a country-aware
phone — without owning the address-book or order rules.

## Feature set

- Address form fields
  - Personal or Company: Company Name required only for company and hidden on personal
  - Country-aware phone: country and digits required; E.164 when parseable; unusual formats accepted; phone country starts empty
  - Optional locality: address line 2 and state optional; line 1 and postal code required; no Apt./Suite/Building
- Billing address form
  - Same as delivery address is checked by default
  - Unchecking it reveals a second saved or one-time address
  - The application owns copy, validation and submitted values
- Address form export
  - `AuctionAddressForm` carries kind and phone with the billing choice
  - The component remains controlled and renderable on its own

## Requirements

### Requirement: The address form reports delivery and billing values

For its billing variant, `AuctionAddressForm` SHALL expose Same as delivery
address selected by default. Clearing that choice SHALL reveal a second saved
or one-time address. Confirm SHALL report delivery and billing values
separately, including address kind and phone for each reported address, while
preserving application-owned copy and application-supplied field errors.

#### Scenario: shared-ui-auction-order-SC-05 - The billing form defaults to delivery
**Serves:** Billing address form - the form starts with one shared address

- **GIVEN** an `AuctionAddressForm` with billing enabled and a complete delivery
  address
- **WHEN** it renders
- **THEN** Same as delivery address is selected
- **AND** no second billing address picker is required

#### Scenario: shared-ui-auction-order-SC-06 - The billing form reports two addresses
**Serves:** Billing address form - the form collects a different address

- **GIVEN** an `AuctionAddressForm` with Same as delivery address selected
- **WHEN** the winner clears that choice and selects a saved or one-time address
- **THEN** the form reveals the second address
- **AND** Confirm reports the delivery and billing values separately

#### Scenario: shared-ui-auction-order-SC-12 - Confirm reports kind and phone with addresses
**Serves:** Address form export - `AuctionAddressForm` carries kind and phone with the billing choice

- **GIVEN** an `AuctionAddressForm` with a complete delivery address including
  address kind and phone
- **WHEN** Confirm succeeds
- **THEN** Confirm reports address kind and phone with the delivery values
- **AND** when Same as delivery address is selected, Confirm reports the same
  kind and phone for billing

### Requirement: AuctionAddressForm collects phone with country

`AuctionAddressForm` collects phone with a country selector.

**Country selector** — The phone field SHALL include a country selector. Phone
country SHALL start empty — nothing preselected — when the application supplies
no initial phone country.

**Required parts** — Phone country and digits SHALL be required before Confirm
reports a phone value. Missing country or digits SHALL be refused beside Phone
(soft local refuse when the application has not supplied a phone error).

**Storage** — Confirm SHALL report the phone as E.164 when parseable. When the
value is not parseable to E.164, Confirm SHALL still report the entered phone
value and SHALL NOT refuse it for format.

**Unusual formats** — The form SHALL NOT refuse a phone value solely because it
fails hard validity checks.

#### Scenario: shared-ui-auction-order-SC-07 - Phone refuses missing country or digits
**Serves:** Address form fields - country-aware phone with empty starting country

- **GIVEN** an `AuctionAddressForm` whose phone country is empty
- **WHEN** Confirm is attempted without selecting a country or entering digits
- **THEN** a refusal shows beside Phone
- **AND** Confirm does not report a phone value

#### Scenario: shared-ui-auction-order-SC-08 - Phone accepts unusual formats and reports E.164 when parseable
**Serves:** Address form fields - E.164 when parseable; unusual formats accepted

- **GIVEN** an `AuctionAddressForm` with a selected country and digits entered
- **WHEN** Confirm is attempted with a value that is not strictly valid but includes digits
- **THEN** Confirm reports the phone value
- **AND** reports E.164 when the value is parseable

### Requirement: AuctionAddressForm is Personal or Company

`AuctionAddressForm` lets the winner choose Personal or Company.

**Toggle** — The form SHALL offer Personal and Company. Personal SHALL be the
default when the application supplies no initial kind.

**Company Name** — Company Name SHALL be required only when Company is selected
and SHALL be hidden when Personal is selected. Confirm while Personal is
selected SHALL report an empty company name.

**Recipient names** — First name and last name SHALL remain required for both
Personal and Company.

#### Scenario: shared-ui-auction-order-SC-09 - Personal hides company name
**Serves:** Address form fields - Personal or Company

- **GIVEN** an `AuctionAddressForm` that renders with Personal selected
- **WHEN** it renders
- **THEN** Company Name is not shown
- **AND** Confirm does not report a company name

#### Scenario: shared-ui-auction-order-SC-10 - Company requires company name
**Serves:** Address form fields - Personal or Company

- **GIVEN** an `AuctionAddressForm` with Company selected
- **WHEN** Confirm is attempted without a company name
- **THEN** a refusal shows beside Company Name
- **AND** Confirm does not report a company name

### Requirement: AuctionAddressForm optional locality fields

`AuctionAddressForm` collects locality with required and optional parts.

**Required** — Address line 1 and postal code SHALL be required.

**Optional** — Address line 2 and state SHALL be optional.

**Not collected** — Apt./Suite/Building SHALL NOT be shown.

#### Scenario: shared-ui-auction-order-SC-11 - Locality fields stay optional
**Serves:** Address form fields - optional locality

- **GIVEN** an `AuctionAddressForm` with address line 1 and postal code filled
- **WHEN** address line 2 and state are left empty and Confirm is attempted
- **THEN** Confirm reports the address without requiring line 2 or state
- **AND** no Apt./Suite/Building field is shown
