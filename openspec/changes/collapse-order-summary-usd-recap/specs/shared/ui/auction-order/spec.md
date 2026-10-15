# shared/ui/auction-order Specification

## Feature set

- Order detail
  - Amount view toggle: a two-option control in the summary heading swaps every row's value for its `subtext` when the application supplies `summary.currencyToggle`; without it, a `subtext` renders under its value

## MODIFIED Requirements

### Requirement: The winner order takes the settlement choice, payment choices, two totals and one rail's bank details

`AuctionWinnerOrder` SHALL take these optional props, each controlled by the
application, and SHALL render and report them without choosing policy. The
consuming applications are the `grade10` site's Winner Order page and
`apps/preview`'s winner order stories.

| Prop | Shape | The block renders |
| --- | --- | --- |
| `settlementCurrency` | `label`, `options` (each a `value` of `AuctionSettlementCurrency`, `USD` or `HKD`, and a `label`), `value` (an option's value or `null`), `onChange` | The settlement currency choice in the setup section, one choice per option, none selected while `value` is `null`; it reports a pick through `onChange` |
| `paymentChoices` | `label`, `byCurrency` (for each `AuctionSettlementCurrency`, a list of `AuctionWinnerOrderPaymentChoice`), `value` (a choice's value or `null`), `onChange`, optional `none` | The choices listed for the currency `settlementCurrency.value` holds, one choice each, none selected while `value` is `null`; it reports a pick through `onChange`. With no currency picked it lists none. With no choice listed for the currency it shows `none` |
| `summary.convertedTotal` | A `label` and a `value`, formatted | A second Order Total line below the first, when supplied and no `summary.currencyToggle` control renders |
| `summary.convertedFee` | A `label` and a `value`, formatted | A Payment Processing Fee row after the separator, below the two total lines, when supplied and no `summary.currencyToggle` control renders |
| `summary.lines[].subtext` | An optional text, formatted | A muted line under that row's value, such as the quoted amount in the other currency; no line when absent |
| `summary.currencyToggle` | `primary` and `secondary` texts, an optional `ariaLabel` | When supplied and any line or the total carries a `subtext`, a two-option control in the summary heading, `primary` picked on mount; on `secondary` every row swaps its `subtext` into the value spot and no `subtext` line renders, and a row with no `subtext` keeps its value. No control shows when nothing carries a `subtext`. The picked view is the block's own and holds only for the mount |
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
no second line when none is supplied, and SHALL derive no amount. Where a
`summary.currencyToggle` control renders, the block SHALL show neither
`summary.convertedTotal` nor `summary.convertedFee` — the converted amounts
travel as `subtext` behind the control instead.

When `summary.convertedFee` is supplied and no `summary.currencyToggle`
control renders, the block SHALL show it as its own row after the separator,
below the total lines, and SHALL NOT add it to either total line. It SHALL
show no such row when none is supplied.

When `summary.currencyToggle` is supplied and any `summary.lines[].subtext`
or `summary.total.subtext` carries text, the block SHALL render a two-option
control in the summary heading labelled `primary` and `secondary`, with
`primary` picked on mount. On `secondary` every row that carries a `subtext`
SHALL render it as its value and SHALL render no `subtext` line, a row
without a `subtext` SHALL keep its value, and on `primary` the summary SHALL
read as supplied. Without `summary.currencyToggle` a `subtext` SHALL render
under its value, and the control SHALL NOT show where nothing carries a
`subtext`. The picked view SHALL be the block's own for the mount; the block
SHALL NOT persist it.

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

- **GIVEN** an `AuctionWinnerOrder` whose summary total reads US$131.21,
  whose `summary.convertedTotal` reads HK$1,031.00 and that is supplied no
  `summary.currencyToggle`
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
  `summary.convertedTotal` reads HK$1,031.00, whose `summary.convertedFee`
  reads HK$38.73 and that is supplied no `summary.currencyToggle`
- **WHEN** it renders
- **THEN** Order Total shows the USD line, then the HKD line
- **AND** the fee row shows after the separator, below both lines
- **AND** neither total line includes the fee

<!-- trace:scenario id=g10.shared-auction-order.SC-s7t rev=2 -->
#### Scenario: shared-ui-auction-order-SC-s7t - A line's subtext renders under its value
**Serves:** `Order detail` - the summary renders a second total line when supplied

- **GIVEN** an `AuctionWinnerOrder` whose summary has a Winning Bid line reading
  HK$793.00 with subtext US$101.00 and a Payment Processing Fee line reading
  HK$38.73 with no subtext, and no `summary.currencyToggle`
- **WHEN** it renders
- **THEN** US$101.00 shows muted under HK$793.00
- **AND** the fee line shows no second line

<!-- trace:scenario id=g10.shared-auction-order.SC-p2v rev=1 -->
#### Scenario: shared-ui-auction-order-SC-31 - Rows swap their subtext into the value spot behind the supplied toggle
**Serves:** `Order detail` - the summary renders a second total line when supplied

- **GIVEN** an `AuctionWinnerOrder` supplied with `summary.currencyToggle`
  reading HKD and USD, a Winning Bid line reading HK$793.00 with subtext
  US$101.00, a Payment Processing Fee line reading HK$38.73 with no subtext,
  and an Order Total reading HK$831.73 with subtext US$101.00
- **WHEN** it renders
- **THEN** the control shows HKD picked, the lines read HK$793.00 and HK$38.73
  and Order Total reads HK$831.73
- **WHEN** the winner picks USD
- **THEN** the Winning Bid reads US$101.00, the fee keeps HK$38.73 and Order
  Total reads US$101.00, with no muted second line
- **WHEN** the winner picks HKD
- **THEN** every amount reads as supplied

<!-- trace:scenario id=g10.shared-auction-order.SC-hc5 rev=1 -->
#### Scenario: shared-ui-auction-order-SC-29 - The bank dialog shows only the rail supplied
**Serves:** `Order detail` - View Bank Details renders only the rail supplied

- **GIVEN** an `AuctionWinnerOrder` supplied with `bankDetails` for the `fps`
  rail
- **WHEN** the winner opens View Bank Details
- **THEN** the dialog shows the FPS rows and the bank reference
- **AND** it shows no tabs and no HK Local or SWIFT rows
