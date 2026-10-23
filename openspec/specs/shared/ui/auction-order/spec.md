# shared/ui/auction-order Specification

## Purpose

The shared blocks a store application composes for a winner's auction order:
the order detail and the address form for delivery and billing. They display
what they are given and report what the winner did; every status, amount and
string belongs to the application.

## Feature set

- **Order list**
  - AuctionOrderList: the page body with rows or the empty state.
  - AuctionOrderRow: one order with View lot and one next action.
- **Order detail**
  - AuctionOrderDetail: the four sections and the status-dependent content.
  - AuctionAddressForm: the address fields, errors, Confirm and Cancel.
  - AuctionWinnerOrder: the four sections and the status-dependent content.
  - Two totals: the summary renders a USD total line then a converted HKD total line when the application supplies both
  - One rail dialog: View Bank Details renders only the rail supplied
  - No settlement choice: the order panel never offers a settlement currency or payment method choice; setup in the application owns it
  - Subtotal and fee rows: `AuctionWinnerOrder` renders `summary.subtotal` under the lines and `summary.feeLines` under it as one group between two separators, then the total
  - Subtotal note: the Subtotal row carries the conversion note the application supplies
  - Summary unchanged without them: a summary with neither prop renders as before
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

### Requirement: The winner-order surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the winner's auction order — `AuctionWinnerOrder`,
`AuctionAddressForm` and `AuctionPhoneField` — and exactly these types and
helpers: `AuctionWinnerOrderProps`, `AuctionWinnerOrderCopy`,
`AuctionWinnerOrderStep`, `AuctionAddressFormProps`, `AuctionAddressFormCopy`,
`AuctionAddressFormValues`, `AuctionPhoneFieldProps`, `AuctionPaymentRail`,
`AuctionWinnerOrderBankDetails`, `auctionPhoneSoftReady` and
`auctionPhoneConfirmValue`.

`AuctionWinnerOrder` SHALL render the header, Order Progress, the lot card,
the alerts and the sidebar that `grade10-site/auction/winner-order` names,
from the parts the application supplies. It SHALL derive each progress
step's state from the current step it is given and show no progress when
given none. It SHALL take every string through its props, amounts and dates
already formatted, and report each press through a callback; a PDF or
tracking link SHALL open the URL the application supplies. It SHALL NOT fetch,
write or read an order status, convert an amount or choose which payment
methods a currency offers; the two totals and the bank details follow "The
winner order takes two totals and one rail's bank details". It SHALL NOT offer
a settlement currency or payment method choice.

`AuctionAddressForm` SHALL render the fields named in
`grade10-site/auction/winner-order`, mark the required ones, show an
application-supplied error beside each field it names, and report Confirm with
the entered values and Cancel. It SHALL NOT validate a phone number's format.

`AuctionAddressForm` SHALL be renderable on its own.

<!-- trace:scenario id=g10.shared-auction-order.SC-xdd rev=1 -->
#### Scenario: shared-ui-auction-order-SC-15 - An application imports the surface
**Serves:** `Order detail` - every name the surface exports resolves

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

<!-- trace:scenario id=g10.shared-auction-order.SC-tm6 rev=1 -->
#### Scenario: shared-ui-auction-order-SC-16 - The order list blocks are not exported
**Serves:** `Order detail` - the surface exports only what a page composes

- **WHEN** the shared UI package's public entry is read
- **THEN** it exports none of `AuctionOrderList`, `AuctionOrderRow`,
  `AuctionOrderEmpty`, and none of `AuctionOrderListProps`,
  `AuctionOrderRowProps`, `AuctionOrderRowCopy` or `AuctionOrderEmptyProps`

<!-- trace:scenario id=g10.shared-auction-order.SC-10a rev=1 -->
#### Scenario: shared-ui-auction-order-SC-17 - The form shows supplied errors and reports values
**Serves:** `Order detail` - the form shows supplied errors and reports values

- **GIVEN** an `AuctionAddressForm` supplied with an error for Town/City
- **WHEN** the winner selects Confirm
- **THEN** the error shows beside Town/City
- **AND** the form reports Confirm with the entered values

<!-- trace:scenario id=g10.shared-auction-order.SC-8eq rev=1 -->
#### Scenario: shared-ui-auction-order-SC-18 - The detail omits an invoice it was not given
**Serves:** `Order detail` - the detail omits an invoice it was not given

- **GIVEN** an `AuctionWinnerOrder` supplied with no invoice PDF and no pay
  control
- **WHEN** it renders
- **THEN** it shows the order summary's lines
- **AND** shows no Invoice PDF link and no pay control

<!-- trace:scenario id=g10.shared-auction-order.SC-i3e rev=1 -->
#### Scenario: shared-ui-auction-order-SC-19 - The page body derives its steps
**Serves:** `Order detail` - the block derives the progress from the current step

- **GIVEN** an `AuctionWinnerOrder` supplied with Payment as the current step
- **WHEN** it renders
- **THEN** Address and Invoice read complete, Payment current, Shipping and
  Completed upcoming

<!-- trace:scenario id=g10.shared-auction-order.SC-qb6 rev=1 -->
#### Scenario: shared-ui-auction-order-SC-20 - The page body reports a press
**Serves:** `Order detail` - the block reports, never acts

- **GIVEN** an `AuctionWinnerOrder` supplied with a pay control
- **WHEN** the winner selects it
- **THEN** the block reports the press through the pay callback
- **AND** makes no request of its own

### Requirement: The winner order takes two totals and one rail's bank details

`AuctionWinnerOrder` SHALL take these optional props, each controlled by the
application, and SHALL render and report them without choosing policy. The
consuming applications are the `grade10` site's Winner Order page and
`apps/preview`'s winner order stories.

| Prop | Shape | The block renders |
| --- | --- | --- |
| `summary.convertedTotal` | A `label` and a `value`, formatted | A second Order Total line below the first, when supplied |
| `summary.convertedFee` | A `label` and a `value`, formatted | A Payment Processing Fee row after the separator, below the two total lines, when supplied |
| `summary.subtotal` | A `label`, a `value` and an optional `footnote`, formatted | A Subtotal row after a separator below the lines, with its footnote muted under it when supplied |
| `summary.feeLines` | Rows, each a `label`, a `value` and an optional `tooltip`, formatted | Fee rows after the Subtotal, in the order supplied, before the total's separator |
| `summary.lines[].subtext` | An optional text, formatted | A muted line under that row's value, such as the quoted amount in the other currency; no line when absent |
| `bankDetails` | An `AuctionWinnerOrderBankDetails` | The View Bank Details dialog for the one rail it carries |

An `AuctionWinnerOrderBankDetails` carries one `rail`, a `title`, the rail's
`rows` (each a label and a value), the bank reference as a labelled row, an
optional `qrSrc` and an optional `note`. The dialog SHALL render exactly those
rows, SHALL render no tabs and SHALL name no other rail. A press on View Bank
Details SHALL open it and SHALL also report through the control's callback.

When `summary.subtotal` is supplied or `summary.feeLines` holds at least one row,
the block SHALL draw one separator above them and another above the total. It SHALL render the Subtotal
and each fee row as supplied, SHALL add the fees to no total and no Subtotal, and
SHALL derive no amount and no note: the application supplies the footnote text.
A summary with neither prop SHALL render as it did before them.

Each prop draws on its own, as supplied. A `summary.subtotal` with no
`summary.feeLines` draws the Subtotal alone, fee lines with no Subtotal draw the
fees alone, an empty `summary.feeLines` draws no row and no separator, and a
Subtotal with no `footnote` draws no note. When the application supplies both
these props and the older `summary.convertedTotal` or `summary.convertedFee`,
both sets draw. The block picks no policy between them; the application supplies
one set.

The block SHALL show the first Order Total line as supplied and, when
`summary.convertedTotal` is supplied, the second line below it. It SHALL show
no second line when none is supplied, and SHALL derive no amount.

When `summary.convertedFee` is supplied the block SHALL show it as its own row
after the separator, below the total lines, and SHALL NOT add it to either
total line. It SHALL show no such row when none is supplied.

<!-- trace:scenario id=g10.shared-auction-order.SC-z03 rev=1 -->
#### Scenario: shared-ui-auction-order-SC-27 - Two total lines render when both are supplied
**Serves:** `Order detail` - the summary renders a second total line when supplied

- **GIVEN** an `AuctionWinnerOrder` whose summary total reads US$131.21 and
  whose `summary.convertedTotal` reads HK$1,031.00
- **WHEN** it renders
- **THEN** Order Total shows the USD line, then the HKD line below it

<!-- trace:scenario id=g10.shared-auction-order.SC-k6i rev=1 -->
#### Scenario: shared-ui-auction-order-SC-28 - One total line renders when no second is supplied
**Serves:** `Order detail` - the summary renders a second total line when supplied

- **GIVEN** an `AuctionWinnerOrder` whose summary total reads US$131.21 and
  that is supplied no `summary.convertedTotal`
- **WHEN** it renders
- **THEN** Order Total shows one line
- **AND** no converted amount is derived or shown

<!-- trace:scenario id=g10.shared-auction-order.SC-m7x rev=1 -->
#### Scenario: shared-ui-auction-order-SC-30 - A converted fee renders after the separator below the totals
**Serves:** `Order detail` - the summary renders a second total line when supplied

- **GIVEN** an `AuctionWinnerOrder` whose summary total reads US$131.21, whose
  `summary.convertedTotal` reads HK$1,031.00 and whose `summary.convertedFee`
  reads HK$38.73
- **WHEN** it renders
- **THEN** Order Total shows the USD line, then the HKD line
- **AND** the fee row shows after the separator, below both lines
- **AND** neither total line includes the fee

<!-- trace:scenario id=g10.shared-auction-order.SC-s7t rev=1 -->
#### Scenario: shared-ui-auction-order-SC-s7t - A line's subtext renders under its value
**Serves:** `Order detail` - the summary renders a second total line when supplied

- **GIVEN** an `AuctionWinnerOrder` whose summary has a Winning Bid line reading
  HK$793.00 with subtext US$101.00 and a Payment Processing Fee line reading
  HK$38.73 with no subtext
- **WHEN** it renders
- **THEN** US$101.00 shows muted under HK$793.00
- **AND** the fee line shows no second line

<!-- trace:scenario id=g10.shared-auction-order.SC-hc5 rev=1 -->
#### Scenario: shared-ui-auction-order-SC-29 - The bank dialog shows only the rail supplied
**Serves:** `Order detail` - View Bank Details renders only the rail supplied

- **GIVEN** an `AuctionWinnerOrder` supplied with `bankDetails` for the `fps`
  rail
- **WHEN** the winner opens View Bank Details
- **THEN** the dialog shows the FPS rows and the bank reference
- **AND** it shows no tabs and no HK Local or SWIFT rows

<!-- trace:scenario id=g10.shared-auction-order.SC-7su rev=1 -->
#### Scenario: g10.shared-auction-order.SC1 - The Subtotal and fee rows render between separators, then the total
**Serves:** `Order detail` - the summary renders the Subtotal and fee rows the application supplies

- **GIVEN** an `AuctionWinnerOrder` whose summary lines read Winning Bid, Buyer's
  Premium and Shipping & Handling in USD, whose `summary.subtotal` reads
  Subtotal HK$1,030.00, whose `summary.feeLines` holds Payment Processing Fee
  HK$38.69 and whose total reads Order Total HK$1,068.69
- **WHEN** it renders
- **THEN** the rows read, in order, the three lines, a separator, Subtotal, Payment
  Processing Fee, a separator and Order Total
- **AND** the block shows two separators in the summary and adds no amount

<!-- trace:scenario id=g10.shared-auction-order.SC-i5t rev=1 -->
#### Scenario: g10.shared-auction-order.SC2 - The Subtotal carries the note the application supplies
**Serves:** `Order detail` - the summary renders the Subtotal and fee rows the application supplies

- **GIVEN** an `AuctionWinnerOrder` whose `summary.subtotal` carries the footnote
  `Converted from US$131.21 at 1 USD = 7.85 HKD` and whose fee row carries none
- **WHEN** it renders
- **THEN** the footnote shows muted under the Subtotal row
- **AND** no footnote shows under the fee row or the total

<!-- trace:scenario id=g10.shared-auction-order.SC-eei rev=1 -->
#### Scenario: g10.shared-auction-order.SC3 - A summary without them renders as before
**Serves:** `Order detail` - the summary renders the Subtotal and fee rows the application supplies

- **GIVEN** an `AuctionWinnerOrder` supplied neither `summary.subtotal` nor
  `summary.feeLines`, with lines and a total
- **WHEN** it renders
- **THEN** the summary shows the lines, one separator and the total
- **AND** no Subtotal row and no fee row shows

<!-- trace:scenario id=g10.shared-auction-order.SC-rs4 rev=1 -->
#### Scenario: g10.shared-auction-order.SC4 - Each prop draws on its own
**Serves:** `Order detail` - the summary renders the Subtotal and fee rows the application supplies

- **GIVEN** three `AuctionWinnerOrder` summaries: one supplied a `summary.subtotal`
  with no footnote and no `summary.feeLines`, one supplied `summary.feeLines` with
  no `summary.subtotal`, and one supplied an empty `summary.feeLines` and no
  `summary.subtotal`
- **WHEN** each renders
- **THEN** the first draws the Subtotal row with no note and no fee row
- **AND** the second draws the fee rows and no Subtotal row
- **AND** the third draws no row and no separator for them, so its summary shows
  the lines, one separator and the total

<!-- trace:scenario id=g10.shared-auction-order.SC-5gy rev=1 -->
#### Scenario: g10.shared-auction-order.SC5 - Both sets draw when both are supplied
**Serves:** `Order detail` - the summary renders the Subtotal and fee rows the application supplies

- **GIVEN** an `AuctionWinnerOrder` supplied `summary.subtotal`, `summary.feeLines`
  and the older `summary.convertedTotal` and `summary.convertedFee`
- **WHEN** it renders
- **THEN** the Subtotal and fee rows draw, and the converted Order Total and
  converted fee draw too
- **AND** the block adds no amount to any of them and drops none
