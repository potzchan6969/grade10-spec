# shared/ui/auction-order Specification

## Purpose

The shared blocks a store application composes for a winner's auction orders:
the My Auction Orders list, its row and empty state, the order detail, and the
delivery address form. They display what they are given and report what the
winner did; every status, amount and string belongs to the application.

## Feature set

- **Order list**
  - AuctionOrderList: the page body with rows or the empty state.
  - AuctionOrderRow: one order with View lot and one next action.
- **Order detail**
  - AuctionOrderDetail: the four sections and the status-dependent content.
  - AuctionAddressForm: the address fields, errors, Confirm and Cancel.
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

<!-- trace:scenario id=g10.shared-auction-order.SC-qop rev=1 -->
#### Scenario: shared-ui-auction-order-SC-05 - The billing form defaults to delivery
**Serves:** Billing address form - the form starts with one shared address

- **GIVEN** an `AuctionAddressForm` with billing enabled and a complete delivery
  address
- **WHEN** it renders
- **THEN** Same as delivery address is selected
- **AND** no second billing address picker is required

<!-- trace:scenario id=g10.shared-auction-order.SC-wt8 rev=1 -->
#### Scenario: shared-ui-auction-order-SC-06 - The billing form reports two addresses
**Serves:** Billing address form - the form collects a different address

- **GIVEN** an `AuctionAddressForm` with Same as delivery address selected
- **WHEN** the winner clears that choice and selects a saved or one-time address
- **THEN** the form reveals the second address
- **AND** Confirm reports the delivery and billing values separately

<!-- trace:scenario id=g10.shared-auction-order.SC-7db rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-order.SC-duw rev=1 -->
#### Scenario: shared-ui-auction-order-SC-07 - Phone refuses missing country or digits
**Serves:** Address form fields - country-aware phone with empty starting country

- **GIVEN** an `AuctionAddressForm` whose phone country is empty
- **WHEN** Confirm is attempted without selecting a country or entering digits
- **THEN** a refusal shows beside Phone
- **AND** Confirm does not report a phone value

<!-- trace:scenario id=g10.shared-auction-order.SC-2id rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-order.SC-02t rev=1 -->
#### Scenario: shared-ui-auction-order-SC-09 - Personal hides company name
**Serves:** Address form fields - Personal or Company

- **GIVEN** an `AuctionAddressForm` that renders with Personal selected
- **WHEN** it renders
- **THEN** Company Name is not shown
- **AND** Confirm does not report a company name

<!-- trace:scenario id=g10.shared-auction-order.SC-76f rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-order.SC-0cg rev=1 -->
#### Scenario: shared-ui-auction-order-SC-11 - Locality fields stay optional
**Serves:** Address form fields - optional locality

- **GIVEN** an `AuctionAddressForm` with address line 1 and postal code filled
- **WHEN** address line 2 and state are left empty and Confirm is attempted
- **THEN** Confirm reports the address without requiring line 2 or state
- **AND** no Apt./Suite/Building field is shown

### Requirement: The auction-order surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the winner's auction orders — `AuctionOrderList`,
`AuctionOrderRow`, `AuctionOrderEmpty`, `AuctionOrderDetail` and
`AuctionAddressForm` — and exactly these types: `AuctionOrderListProps`,
`AuctionOrderRowProps`, `AuctionOrderRowCopy`, `AuctionOrderEmptyProps`,
`AuctionOrderDetailProps`, `AuctionOrderDetailCopy`,
`AuctionAddressFormProps`, `AuctionAddressFormCopy` and
`AuctionAddressFormValues`.

`AuctionOrderRow` SHALL render the lot's key image and title, the auction,
the winning bid and the order status as the application supplies them, a
**View lot** action, and exactly one next action whose label the application
supplies. It SHALL report which action was selected and SHALL NOT choose the
action from the status itself.

`AuctionOrderDetail` SHALL render the Order Information, Collection Method,
Order Status and Lots sections in that order, and SHALL render in Collection
Method whichever of an address form, a read-only address, or nothing the
application supplies, and an invoice with Pay Now only when the application
supplies one.

`AuctionAddressForm` SHALL render the fields named in
`grade10-site/auction/winner-order`, mark the required ones, show an
application-supplied error beside each field it names, and report Confirm with
the entered values and Cancel. It SHALL NOT validate a phone number's format.

Each of `AuctionOrderRow` and `AuctionAddressForm` SHALL be renderable on its
own.

#### Scenario: shared-ui-auction-order-SC-01 - An application imports the surface
**Serves:** `Order list`, `Order detail` - every name the surface exports resolves

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: shared-ui-auction-order-SC-02 - A row reports its action without choosing it
**Serves:** Order list - a row reports its action without choosing it

- **GIVEN** an `AuctionOrderRow` supplied with the action label Pay Invoice
- **WHEN** the winner selects it
- **THEN** the row reports the next action as selected
- **AND** the label shown is the one supplied

#### Scenario: shared-ui-auction-order-SC-03 - The form shows supplied errors and reports values
**Serves:** Order detail - the form shows supplied errors and reports values

- **GIVEN** an `AuctionAddressForm` supplied with an error for Town/City
- **WHEN** the winner selects Confirm
- **THEN** the error shows beside Town/City
- **AND** the form reports Confirm with the entered values

#### Scenario: shared-ui-auction-order-SC-04 - The detail omits an invoice it was not given
**Serves:** Order detail - the detail omits an invoice it was not given

- **GIVEN** an `AuctionOrderDetail` supplied with no invoice
- **WHEN** it renders
- **THEN** it shows the four sections
- **AND** shows no invoice and no Pay Now

