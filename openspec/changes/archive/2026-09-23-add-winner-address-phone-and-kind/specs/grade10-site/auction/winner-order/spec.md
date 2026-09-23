## Feature set

- Address phone and kind
  - Phone with country: country and digits required; E.164 when parseable; unusual formats accepted; phone country starts empty; placeholder shows an example with calling code
  - Personal or company: Company Name required only for company and hidden on personal; first and last name stay required on both
  - Optional locality: address line 1 and postal code required; address line 2 and state or province optional; no Apt./Suite/Building on this form
  - Picker card title: company name for a company address; recipient first and last name for a personal address
  - Picker card body: street, city or region, and country only — no postal code and no phone
  - Order summary addresses: Delivery and Billing show company when company, recipient name, phone, and full address including postal

## MODIFIED Requirements

### Requirement: The address form refuses empty required fields

In Awaiting Setup the winner SHALL confirm a delivery address and a billing
address with the fields named by the existing address form. Billing SHALL
default to the delivery address and SHALL be confirmed with the delivery
address and payment method.

Confirming with any required field empty SHALL be refused, SHALL show an error
on each empty required field, and SHALL keep the order in Awaiting Setup.
Phone country and digits SHALL be required; a missing phone country or missing
digits SHALL show one field refusal beside Phone. Grade10 SHALL store the phone
as E.164 when parseable and SHALL NOT refuse unusual formats. The winner MAY
untick Same as delivery address and choose a saved or one-time billing address.
Cancel SHALL leave the order in Awaiting Setup with no address confirmed.

#### Scenario: winner-order-SC-152 - Same delivery details bill the order by default
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner on the order-setup form with a complete delivery address
- **WHEN** the winner opens the billing step
- **THEN** Same as delivery address is selected by default
- **AND** the delivery address is shown as the billing address
- **AND** the winner can confirm setup with the delivery address and payment method

#### Scenario: winner-order-SC-153 - A different saved address is captured for billing
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner on the billing step with Same as delivery address selected
- **WHEN** the winner unticks it and chooses a saved address
- **THEN** the second address is used as the billing address
- **AND** the delivery address remains the shipping address
- **AND** both addresses are confirmed with the payment method

#### Scenario: winner-order-SC-185 - An empty phone country is refused
**Serves:** winner-order-US-01 - confirming Add Address without a phone country

- **GIVEN** a winner on Add Address with phone digits entered and phone country empty
- **WHEN** the winner confirms the address
- **THEN** Grade10 refuses applying the address
- **AND** a field refusal shows beside Phone
- **AND** the order stays in Awaiting Setup

#### Scenario: winner-order-SC-186 - Empty phone digits are refused
**Serves:** winner-order-US-01 - confirming Add Address without phone digits

- **GIVEN** a winner on Add Address with a phone country selected and no digits entered
- **WHEN** the winner confirms the address
- **THEN** Grade10 refuses applying the address
- **AND** a field refusal shows beside Phone
- **AND** the order stays in Awaiting Setup

## ADDED Requirements

### Requirement: Add Address collects phone with country

Add Address on Winner Order setup collects the winner's phone with a country
selector.

**Country selector** — The phone field SHALL include a country selector. Phone
country SHALL start empty on Add Address — nothing preselected.

**Placeholder** — When phone country is empty, the phone field SHALL show an
example placeholder with a calling code (`+852 12345678`).

**Required parts** — Phone country and digits SHALL be required.

**Storage** — Grade10 SHALL store the phone as E.164 when parseable. When the
value is not parseable to E.164, Grade10 SHALL still apply the address with the
entered phone value and SHALL NOT refuse it for format.

**Unusual formats** — Grade10 SHALL NOT refuse a phone value because its format
is unusual or fails hard validity checks.

#### Scenario: winner-order-SC-187 - Add Address opens with no phone country preselected
**Serves:** winner-order-US-01 - entering a phone on Add Address

- **GIVEN** a winner opening Add Address on Winner Order setup
- **WHEN** Add Address is shown
- **THEN** phone country is empty with nothing preselected

#### Scenario: winner-order-SC-201 - Phone shows an example placeholder with calling code
**Serves:** winner-order-US-01 - entering a phone on Add Address

- **GIVEN** a winner on Add Address with phone country empty
- **WHEN** the phone field is shown
- **THEN** the placeholder shows an example with a calling code (`+852 12345678`)

#### Scenario: winner-order-SC-188 - A parseable phone is stored as E.164
**Serves:** winner-order-US-01 - saving a phone on Add Address

- **GIVEN** a winner on Add Address with a phone country selected and digits that parse to E.164
- **WHEN** the winner confirms the address
- **THEN** Grade10 stores the phone as E.164
- **AND** the address is applied

#### Scenario: winner-order-SC-189 - An unusual phone format is accepted
**Serves:** winner-order-US-01 - saving a phone that does not pass hard validity

- **GIVEN** a winner on Add Address with a phone country selected and digits in an unusual format
- **WHEN** the winner confirms the address
- **THEN** Grade10 accepts the phone
- **AND** the address is applied
- **AND** no field refusal shows beside Phone for format

#### Scenario: winner-order-SC-197 - A non-parseable phone still applies with the entered value
**Serves:** winner-order-US-01 - saving a phone that does not parse to E.164

- **GIVEN** a winner on Add Address with a phone country selected and digits that do not parse to E.164
- **WHEN** the winner confirms the address
- **THEN** Grade10 applies the address with the entered phone value
- **AND** no field refusal shows beside Phone for format

### Requirement: Add Address is Personal or Company

Add Address lets the winner mark the address Personal or Company.

**Toggle** — Add Address SHALL offer Personal and Company. Personal SHALL be
selected by default.

**Company Name** — Company Name SHALL be required only when Company is
selected. Company Name SHALL be hidden when Personal is selected. Confirming
while Personal is selected SHALL NOT require Company Name, including after the
winner had entered a company name and switched back to Personal.

**Recipient names** — First name and last name SHALL remain required for both
Personal and Company.

**Picker card title** — A company address SHALL show the company name as the
picker card title. A personal address SHALL show the recipient's first and last
name as the picker card title.

**Picker card body** — The picker card body SHALL show street, city or region,
and country only. It SHALL NOT show postal code or phone.

**Order summary** — After setup is confirmed, Winner Order Delivery address and
Billing address SHALL show the confirmed snapshot: company name when the
address is company, recipient first and last name, phone, and the full address
including postal code.

#### Scenario: winner-order-SC-190 - Personal is selected by default and Company Name is hidden
**Serves:** winner-order-US-01 - choosing a personal address on Add Address

- **GIVEN** a winner opening Add Address on Winner Order setup
- **WHEN** Add Address is shown
- **THEN** Personal is selected
- **AND** Company Name is not shown

#### Scenario: winner-order-SC-191 - Company requires Company Name
**Serves:** winner-order-US-01 - choosing a company address on Add Address

- **GIVEN** a winner on Add Address with Company selected
- **WHEN** the winner confirms with Company Name empty
- **THEN** Grade10 refuses applying the address
- **AND** a field refusal shows beside Company Name
- **AND** the order stays in Awaiting Setup

#### Scenario: winner-order-SC-198 - Switching back to Personal drops the Company Name requirement
**Serves:** winner-order-US-01 - leaving a company name after switching to Personal

- **GIVEN** a winner on Add Address who selected Company, entered a Company Name, then switched to Personal
- **WHEN** the winner confirms with every Personal required field complete
- **THEN** Grade10 applies the address as personal
- **AND** no field refusal shows beside Company Name

#### Scenario: winner-order-SC-192 - A personal saved address shows the recipient name on the picker card
**Serves:** winner-order-US-01 - picking a personal delivery address

- **GIVEN** a winner on the delivery picker with a saved personal address
- **WHEN** the picker lists saved addresses
- **THEN** that address card title is the recipient's first and last name

#### Scenario: winner-order-SC-193 - A company saved address shows the company name on the picker card
**Serves:** winner-order-US-01 - picking a company delivery address

- **GIVEN** a winner on the delivery picker with a saved company address
- **WHEN** the picker lists saved addresses
- **THEN** that address card title is the company name

#### Scenario: winner-order-SC-202 - Picker card body omits postal code and phone
**Serves:** winner-order-US-01 - reading a saved address on the delivery picker

- **GIVEN** a winner on the delivery picker with a saved address that has street, city or region, country, postal code, and phone
- **WHEN** the picker lists that address
- **THEN** the card body shows street, city or region, and country
- **AND** the card body does not show postal code or phone

#### Scenario: winner-order-SC-203 - Order summary shows the full address snapshot
**Serves:** winner-order-US-01 - reading Delivery and Billing after setup

- **GIVEN** a winner who confirmed Complete Order Setup with a company delivery address that includes company name, recipient name, phone, and postal code
- **WHEN** Winner Order shows Delivery address and Billing address
- **THEN** each block shows the company name, recipient name, phone, and full address including postal code

#### Scenario: winner-order-SC-194 - A one-time address applies without saving a sixth
**Serves:** winner-order-US-12 - confirming delivery when five addresses are already saved

- **GIVEN** a winner with five saved shipping addresses on Winner Order setup
- **WHEN** the winner adds a one-time address with Personal or Company, phone country and digits, and the other required fields complete
- **THEN** Grade10 applies the one-time address for this order
- **AND** no sixth address is saved to the account

#### Scenario: winner-order-SC-199 - Billing Add Address uses the same phone and kind rules
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner on billing Add Address after unticking Same as delivery address
- **WHEN** Add Address is shown
- **THEN** Personal or Company and the country-aware phone are offered with the same required fields as delivery Add Address

#### Scenario: winner-order-SC-200 - Billing Company requires Company Name
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner on billing Add Address with Company selected
- **WHEN** the winner confirms with Company Name empty
- **THEN** Grade10 refuses applying the billing address
- **AND** a field refusal shows beside Company Name

### Requirement: Add Address optional locality fields

Add Address collects locality with required and optional parts.

**Required** — Address line 1 and postal code SHALL be required.

**Optional** — Address line 2 and state or province SHALL be optional.
Confirming with them empty SHALL NOT be refused.

**Not collected** — Apt./Suite/Building SHALL NOT be collected on Add Address.

#### Scenario: winner-order-SC-195 - Address line 2 and state may be left empty
**Serves:** winner-order-US-01 - confirming Add Address with only required locality fields

- **GIVEN** a winner on Add Address with address line 1 and postal code filled and address line 2 and state or province empty
- **WHEN** the winner confirms the address with every other required field complete
- **THEN** Grade10 applies the address
- **AND** no field refusal shows beside address line 2 or state or province

#### Scenario: winner-order-SC-196 - Apt./Suite/Building is not collected
**Serves:** winner-order-US-01 - entering locality on Add Address

- **WHEN** a winner is on Add Address on Winner Order setup
- **THEN** Apt./Suite/Building is not shown
