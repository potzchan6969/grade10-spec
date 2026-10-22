# shared/ui/auction-order Specification

## Feature set

- **Order detail**
  - Subtotal and fee rows: `AuctionWinnerOrder` renders `summary.subtotal` under the lines and `summary.feeLines` under it, each between its own separators, then the total
  - Subtotal note: the Subtotal row carries the conversion note the application supplies
  - Summary unchanged without them: a summary with neither prop renders as before

## MODIFIED Requirements

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

When `summary.subtotal` or `summary.feeLines` is supplied the block SHALL draw one
separator above them and another above the total. It SHALL render the Subtotal
and each fee row as supplied, SHALL add the fees to no total and no Subtotal, and
SHALL derive no amount and no note: the application supplies the footnote text.
A summary with neither prop SHALL render as it did before them.

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
