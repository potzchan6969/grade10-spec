# Winner Order — delta

## Feature set

- Tax on a winner's order
  - Before send: Tax reads TBD with an info tip
  - After send: Tax shows the operator's amount or is absent when none
  - Itemisation: the invoice and receipt carry Tax between Insurance and Subtotal
  - Card fee base: Tax is part of the Subtotal the payment fee grosses up

## MODIFIED Requirements

### Requirement: Invoice fields

Each invoice SHALL carry these fields. Every amount SHALL be an integer count
of minor units paired with the lot's ISO 4217 currency code, rendered per
`shared/money-amounts`. An invoice exists only once an operator sends it.

| Field | Notes |
| --- | --- |
| Auction order | The order this invoice is the payable record for. An order holds one current invoice, and any invoices a reissue replaced |
| Invoice ID | Given at send, per "Every invoice carries an invoice ID and the order's payment reference". Finds the order, including after a reissue |
| Payment reference | Given at send, on every invoice. Shown to the winner only on a bank transfer invoice. Finds the order, including after a reissue |
| Internal audit number | Given at send, per "Invoices and receipts carry an internal audit number". Never shown to the winner |
| Lot | The single lot invoiced. Named unambiguously, since a winner may hold several |
| Payment method | Card or bank transfer. The winner's choice at send, or the operator's at a reissue |
| Winning bid | The accepted bid that won the lot, excluding every other component |
| Buyer's premium | The applicable fee. This capability fixes no rate |
| Shipping & Handling | Quoted by an operator for the order's confirmed delivery address. Zero or more |
| Insurance | Optional. Added by an operator for the order's confirmed delivery address, and greater than zero when added |
| Tax | Optional caller-supplied `taxLine`, added by an operator for the order, and greater than zero when added. Grade10 defines no rate, jurisdiction or formal tax receipt |
| Subtotal | The sum of the components above |
| Payment processing fee | Priced by the payment method, below. On every invoice, and never dropped |
| Order total | The total payable — the subtotal plus the payment processing fee |
| Sent at | When the operator sent the invoice. Stored in UTC |
| Payment deadline | 7 calendar days from Sent at, stopped while proof is checked. Stored in UTC; shown in the viewer's local zone on Winner Order and in `Asia/Hong_Kong` as `GMT+8` on the invoice PDF |
| Replaces invoice | On a replacement invoice only: the prior invoice ID named by `Replaces invoice {id}` |
| Invoice status | Per `grade10-site/auction/order-status`. A replaced invoice holds none |

The payment processing fee SHALL be priced by the invoice's payment method:

| Method | Payment processing fee |
| --- | --- |
| Card | The amount that leaves the subtotal whole after the payment provider takes a fixed fee and a percentage of the whole charge, computed below |
| Bank transfer | The amount the operator entered on the quote or the reissue. Zero or more |

For card, Grade10 SHALL read both provider fees for the invoice's currency at
the moment the invoice is sent, SHALL compute the order total as the subtotal
plus the fixed fee divided by one less the percentage, SHALL round that total
up to the next minor unit, and SHALL take the fee as the difference between
the order total and the subtotal.

The fee SHALL be fixed on the invoice once sent. A later change in the
provider's fees SHALL NOT move it; only a reissue SHALL price it again. No
settlement SHALL drop or change it.

Wherever the winner reads the invoice's lines — the order, the receipt, and
any letter that lists them — Grade10 SHALL show Shipping & Handling of zero as
**Free**, SHALL show a Payment Processing Fee of zero as **Free**, SHALL
leave the Insurance line out when the operator added none, and SHALL leave the
Tax line out when the operator added none. Insurance and Payment Processing
Fee are separate lines: omitting Insurance does not replace it with the fee.

Where the Tax line is shown, Winner Order's Order Summary SHALL place it
between Insurance and Payment Processing Fee, and the invoice and receipt PDFs
SHALL place it between Insurance and Subtotal.

On Winner Order's order summary, Grade10 SHALL offer brief info tooltips beside
**Buyer’s Premium**, **Shipping & Handling**, **Insurance**, and **Payment Processing Fee**
when those lines are shown. The Payment Processing Fee tooltip SHALL describe
the fee for the invoice's method briefly and SHALL NOT restate the gross-up
formula.

The on-page Winner Order summary MAY omit a separate Subtotal row and show the
fee lines that apply plus Order Total; the invoice and receipt itemisation
SHALL still carry Subtotal.

No component SHALL be marked as an estimate. Grade10 SHALL NOT show the winner
an invoice amount before an operator has sent it.

<!-- trace:scenario id=g10.auction-winner-order.SC-6nv rev=2 -->
#### Scenario: winner-order-SC-04 - An estimated total is marked as one
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent a bank transfer invoice with a winning bid of
  250000, a buyer's premium of 50000, shipping of 8000, insurance of 4000, tax of 6000 and
  a payment processing fee of 0 minor units in HKD
- **WHEN** the winner reads the invoice
- **THEN** the order total is 318000 minor units in HKD
- **AND** no component is marked as an estimate

<!-- trace:scenario id=g10.auction-winner-order.SC-33a rev=1 -->
#### Scenario: winner-order-SC-05 - A confirmed address makes the total firm
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose winner confirmed a delivery address
- **AND** an operator sent an invoice with Shipping & Handling quoted for that
  address, with Insurance when added
- **WHEN** the winner reads the invoice
- **THEN** its total is the order total for that address
- **AND** no component is marked as an estimate

<!-- trace:scenario id=g10.auction-winner-order.SC-awt rev=1 -->
#### Scenario: winner-order-SC-62 - The fee grosses the subtotal up
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent a card invoice whose subtotal is 312000 minor units in HKD
- **AND** the payment provider's fees for HKD at that moment were 235 minor units and 3.4 per cent
- **WHEN** the winner reads the invoice
- **THEN** the payment processing fee is 11225 minor units in HKD
- **AND** the order total is 323225 minor units in HKD

Scenario `winner-order-SC-63` keeps its title with its id. The title is
historical: a manually settled order keeps its payment processing fee.

<!-- trace:scenario id=g10.auction-winner-order.SC-6if rev=1 -->
#### Scenario: winner-order-SC-63 - A manually settled order carries no fee
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a bank transfer invoice with a subtotal of 312000 and a payment
  processing fee of 5000 minor units in HKD
- **WHEN** an operator settles it manually and the winner reads the receipt
- **THEN** the payment processing fee of 5000 minor units in HKD is shown
- **AND** the amount settled is the order total of 317000 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-w9w rev=1 -->
#### Scenario: winner-order-SC-38 - Shipping & Handling of zero reads Free
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with Shipping & Handling of 0 minor units in HKD
- **WHEN** the winner opens the order
- **THEN** the Shipping & Handling line reads Free

<!-- trace:scenario id=g10.auction-winner-order.SC-k0e rev=1 -->
#### Scenario: winner-order-SC-39 - An invoice with no insurance shows no Insurance line
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice without adding insurance
- **WHEN** the winner opens the order
- **THEN** no Insurance line is shown
- **AND** the Payment Processing Fee line is still shown, whatever the method
- **AND** the order total is the sum of the lines that are shown

<!-- trace:scenario id=g10.auction-winner-order.SC-4lu rev=1 -->
#### Scenario: winner-order-SC-69 - Fee lines carry info tooltips
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with Buyer’s Premium, Shipping &
  Handling, and Payment Processing Fee
- **WHEN** the winner opens Winner Order
- **THEN** each of those three lines offers a brief info tooltip
- **AND** the Payment Processing Fee tooltip does not describe the gross-up
  formula

<!-- trace:scenario id=g10.auction-winner-order.SC-c6t rev=1 -->
#### Scenario: winner-order-SC-110 - A bank transfer fee is the amount the operator entered
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an operator sent a bank transfer invoice with a subtotal of 312000
  and a bank transfer fee of 5000 minor units in HKD
- **WHEN** the winner reads the invoice
- **THEN** the payment processing fee is 5000 minor units in HKD
- **AND** the order total is 317000 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-16z rev=1 -->
#### Scenario: winner-order-SC-111 - A bank transfer fee of zero reads Free
**Serves:** Invoice - Payment Processing Fee priced by method

- **GIVEN** an operator sent a bank transfer invoice with a subtotal of 312000
  and a bank transfer fee of 0 minor units in HKD
- **WHEN** the winner opens the order
- **THEN** the Payment Processing Fee line is shown and reads Free
- **AND** the order total is 312000 minor units in HKD


<!-- trace:scenario id=g10.auction-winner-order.SC-ppq rev=1 -->
#### Scenario: winner-order-SC-215 - An invoice with no tax shows no Tax line
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice without adding Tax
- **WHEN** the winner reads the invoice, receipt, or Order Summary
- **THEN** no Tax line is shown

<!-- trace:scenario id=g10.auction-winner-order.SC-deu rev=1 -->
#### Scenario: winner-order-SC-216 - Tax is included in the card fee base
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an invoice whose winning bid, buyer's premium, shipping, insurance,
  and Tax total 318000 minor units in HKD
- **WHEN** Grade10 prices its card payment processing fee
- **THEN** the Subtotal used for the gross-up is 318000 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-4z7 rev=1 -->
#### Scenario: winner-order-SC-214 - Tax is itemised on the invoice and receipt
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a paid auction order whose invoice includes Tax of 6000 minor units
  in HKD
- **WHEN** the winner reads the invoice and receipt
- **THEN** each shows Tax of 6000 minor units in HKD between Insurance and
  Subtotal


## ADDED Requirements

### Requirement: Tax info tooltip

On Winner Order's Order Summary, Tax explains itself whenever the line is shown.

**Tooltip** - Grade10 SHALL offer a brief info tooltip beside Tax whenever the
Tax line is shown.

**Copy** - The tooltip SHALL read `Set by Grade10 for where your order ships.
Some orders have none.`

<!-- trace:scenario id=g10.auction-winner-order.SC-d0w rev=1 -->
#### Scenario: winner-order-SC-217 - A shown Tax line carries its info tooltip
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with Tax of 6000 minor units in HKD
- **WHEN** the winner reads Order Summary
- **THEN** the Tax line shows 6000 minor units in HKD
- **AND** the Tax line sits between Insurance and Payment Processing Fee
- **AND** it offers an info tooltip reading `Set by Grade10 for where your order
  ships. Some orders have none.`

<!-- trace:scenario id=g10.auction-winner-order.SC-mph rev=1 -->
#### Scenario: winner-order-SC-212 - An absent Tax line offers no tooltip
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice without adding Tax
- **WHEN** the winner reads Order Summary
- **THEN** no Tax line is shown
- **AND** no Tax tooltip is offered

### Requirement: Tax before the invoice is sent

Before an operator sends the invoice, Order Summary names Tax without an amount.

**Before send** - Before an operator has sent the invoice, Winner Order's Order
Summary SHALL show Tax as TBD with the other fee rows.

**No amount** - Grade10 SHALL NOT show a calculated Tax amount before the
operator sends the invoice.

<!-- trace:scenario id=g10.auction-winner-order.SC-1ok rev=1 -->
#### Scenario: winner-order-SC-213 - Tax reads TBD before the invoice is sent
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order before an operator has sent its invoice
- **WHEN** the winner reads Order Summary
- **THEN** Tax is shown as TBD with the other fee rows
- **AND** no calculated Tax amount is shown
- **AND** the Tax line offers its info tooltip
