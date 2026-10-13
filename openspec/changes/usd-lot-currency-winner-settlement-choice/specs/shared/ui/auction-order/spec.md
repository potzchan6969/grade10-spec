# shared/ui/auction-order Specification

## Feature set

- **Order detail**
  - Settlement currency choice: the setup form offers USD and HKD, nothing preselected, and reports the winner's pick
  - Rail choices: the payment methods are supplied per currency, each bank rail its own choice
  - Two totals: the summary renders a USD total line then a converted HKD total line when the application supplies both
  - One rail dialog: View Bank Details renders only the rail supplied
  - Currency policy: the application supplies the order's settlement currency and payment choices

## ADDED Requirements

### Requirement: The winner order takes the settlement choice, payment choices, two totals and one rail's bank details

`AuctionWinnerOrder` SHALL take these optional props, each controlled by the
application, and SHALL render and report them without choosing policy. The
consuming applications are the `grade10` site's Winner Order page and
`apps/preview`'s winner order stories.

| Prop | Shape | The block renders |
| --- | --- | --- |
| `settlementCurrency` | `label`, `options` (each a `value` of `AuctionSettlementCurrency`, `USD` or `HKD`, and a `label`), `value` (an option's value or `null`), `onChange` | The settlement currency choice in the setup section, one choice per option, none selected while `value` is `null`; it reports a pick through `onChange` |
| `paymentChoices` | `label`, `byCurrency` (for each `AuctionSettlementCurrency`, a list of `AuctionWinnerOrderPaymentChoice`), `value` (a choice's value or `null`), `onChange`, optional `none` | The choices listed for the currency `settlementCurrency.value` holds, one choice each, none selected while `value` is `null`; it reports a pick through `onChange`. With no currency picked it lists none. With no choice listed for the currency it shows `none` |
| `summary.convertedTotal` | A `label` and a `value`, formatted | A second Order Total line below the first, when supplied |
| `summary.convertedFee` | A `label` and a `value`, formatted | A Payment Processing Fee row after the separator, below the two total lines, when supplied |
| `bankDetails` | An `AuctionWinnerOrderBankDetails` | The View Bank Details dialog for the one rail it carries |

An `AuctionWinnerOrderPaymentChoice` carries a `value` of `card` or an
`AuctionPaymentRail` (`fps`, `hk_local` or `swift`), a `label`, a `feeRange`
text and an optional `unavailable` text. A choice with `unavailable` SHALL
render that text and SHALL NOT be selectable. Each rail SHALL be its own
choice; the block SHALL NOT group rails under one bank transfer choice.

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

<!-- trace:scenario id=g10.shared-auction-order.SC-cdc rev=1 -->
#### Scenario: shared-ui-auction-order-SC-21 - The settlement choice offers the options with none selected
**Serves:** `Order detail` - the setup section offers the settlement currency choice

- **GIVEN** an `AuctionWinnerOrder` supplied with `settlementCurrency` options
  USD and HKD and a `value` of `null`
- **WHEN** it renders
- **THEN** USD and HKD are offered
- **AND** neither is selected

<!-- trace:scenario id=g10.shared-auction-order.SC-8j6 rev=1 -->
#### Scenario: shared-ui-auction-order-SC-22 - A currency pick is reported
**Serves:** `Order detail` - the block reports, never acts

- **GIVEN** an `AuctionWinnerOrder` supplied with USD and HKD options
- **WHEN** the winner selects HKD
- **THEN** the block reports HKD through `onChange`
- **AND** makes no request of its own

<!-- trace:scenario id=g10.shared-auction-order.SC-7if rev=1 -->
#### Scenario: shared-ui-auction-order-SC-23 - The payment choices follow the currency picked
**Serves:** `Order detail` - the setup section lists the payment choices the currency offers

- **GIVEN** an `AuctionWinnerOrder` supplied with `paymentChoices` listing card,
  fps and hk_local for HKD and card, hk_local and swift for USD, and
  `settlementCurrency` holding HKD
- **WHEN** it renders
- **THEN** card, FPS and HK Local are offered, each as its own choice
- **AND** no SWIFT choice is offered

<!-- trace:scenario id=g10.shared-auction-order.SC-pd1 rev=1 -->
#### Scenario: shared-ui-auction-order-SC-24 - No currency picked lists no payment choice
**Serves:** `Order detail` - the setup section lists the payment choices the currency offers

- **GIVEN** an `AuctionWinnerOrder` supplied with `paymentChoices` for both
  currencies and `settlementCurrency` holding `null`
- **WHEN** it renders
- **THEN** no payment choice is listed

<!-- trace:scenario id=g10.shared-auction-order.SC-nxj rev=1 -->
#### Scenario: shared-ui-auction-order-SC-25 - An unavailable choice cannot be selected
**Serves:** `Order detail` - the setup section lists the payment choices the currency offers

- **GIVEN** an `AuctionWinnerOrder` whose USD card choice carries `unavailable`
  text
- **WHEN** it renders with USD picked
- **THEN** the card choice shows that text
- **AND** the winner cannot select it

<!-- trace:scenario id=g10.shared-auction-order.SC-bzz rev=1 -->
#### Scenario: shared-ui-auction-order-SC-26 - A cleared value shows no selected choice
**Serves:** `Order detail` - the setup section lists the payment choices the currency offers

- **GIVEN** an `AuctionWinnerOrder` whose `paymentChoices.value` was `swift`
  under USD
- **WHEN** the application supplies HKD and a `value` of `null`
- **THEN** no payment choice is selected

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
`AuctionAddressFormValues`, `AuctionPhoneFieldProps`, `AuctionSettlementCurrency`,
`AuctionPaymentRail`, `AuctionWinnerOrderPaymentChoice`,
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
methods a currency offers; the settlement choice, the payment choices, the two
totals and the bank details follow "The winner order takes the settlement
choice, payment choices, two totals and one rail's bank details".

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
