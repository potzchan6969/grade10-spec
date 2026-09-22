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
separately while preserving application-owned copy and validation.

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
