# shared/ui/auction-order Specification

## Feature set

- **Order detail**
  - Two totals: the summary renders a USD total line then a converted HKD total line when the application supplies both
  - One rail dialog: View Bank Details renders only the rail supplied
  - No settlement choice: the order panel never offers a settlement currency or payment method choice; setup in the application owns it

## ADDED Requirements

### Requirement: The winner order takes two totals and one rail's bank details

`AuctionWinnerOrder` SHALL take these optional props, each controlled by the
application, and SHALL render and report them without choosing policy. The
consuming applications are the `grade10` site's Winner Order page and
`apps/preview`'s winner order stories.

| Prop | Shape | The block renders |
| --- | --- | --- |
| `summary.convertedTotal` | A `label` and a `value`, formatted | A second Order Total line below the first, when supplied |
| `summary.convertedFee` | A `label` and a `value`, formatted | A Payment Processing Fee row after the separator, below the two total lines, when supplied |
| `bankDetails` | An `AuctionWinnerOrderBankDetails` | The View Bank Details dialog for the one rail it carries |

An `AuctionWinnerOrderBankDetails` carries one `rail`, a `title`, the rail's
`rows` (each a label and a value), the bank reference as a labelled row, an
optional `qrSrc` and an optional `note`. The dialog SHALL render exactly those
rows, SHALL render no tabs and SHALL name no other rail. A press on View Bank
Details SHALL open it and SHALL also report through the control's callback.

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

<!-- trace:scenario id=g10.shared-auction-order.SC-hc5 rev=1 -->
#### Scenario: shared-ui-auction-order-SC-29 - The bank dialog shows only the rail supplied
**Serves:** `Order detail` - View Bank Details renders only the rail supplied

- **GIVEN** an `AuctionWinnerOrder` supplied with `bankDetails` for the `fps`
  rail
- **WHEN** the winner opens View Bank Details
- **THEN** the dialog shows the FPS rows and the bank reference
- **AND** it shows no tabs and no HK Local or SWIFT rows

## MODIFIED Requirements

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

## REMOVED Requirements

None.
