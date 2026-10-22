# grade10-site/auction/winner-order Specification

## Feature set

- Settlement currency
  - Convert once: an HKD order's Subtotal is the sum of its USD lines at 7.85, rounded up to the next cent; no line is converted or rounded on its own
  - Cent rounding: every amount keeps two decimals; a fraction of a cent rounds up where an amount is converted or grossed up; the Order Total is the Subtotal plus the fee
  - Bank transfer fee under HKD: typed in USD, converted at 7.85 and rounded up to the next cent, below the Subtotal and outside the converted sum
  - Rate named once: the Order Summary's conversion note is the one place that names the rate; no invoice, receipt or letter does
  - Same lines on every document: an HKD invoice and receipt list the USD lines, then the HKD Subtotal, fee and total
- Order summary
  - USD lines under HKD: each line reads its USD amount, Shipping & Handling, Insurance and Tax included
  - Subtotal and note: one HKD Subtotal below the lines names the USD sum and the rate
  - Fee and total in HKD: the Payment Processing Fee and the Order Total sit below the Subtotal
  - Unchanged cases: a USD order keeps one Order Total, and before an invoice is sent no HKD amount and no note shows
- Invoice
  - Fee base under HKD: a card fee is computed in HKD on the Subtotal

## REMOVED Feature set

- Settlement currency
  - Fixed conversion:
  - Rate never shown:
  - No USD bid under HKD:
- Order summary
  - Two totals under HKD:

## MODIFIED Requirements

### Requirement: Invoice fields

Each invoice SHALL carry these fields. Every amount SHALL be an integer count
of minor units paired with the order's settlement currency, `USD` or `HKD`,
rendered per `shared/money-amounts`. An invoice exists only once an operator
sends it. An HKD invoice SHALL keep the order's lines in USD and carry a
Subtotal, a payment processing fee and an Order Total in HKD, per "An HKD order
converts each USD line at a fixed rate and rounds it up".

| Field | Notes |
| --- | --- |
| Auction order | The order this invoice is the payable record for. An order holds one current invoice, and any invoices a reissue replaced |
| Settlement currency | `USD` or `HKD`, the winner's choice at setup, per "The winner chooses a settlement currency at order setup". Every amount below is in it, except the lines of an HKD invoice, which keep their USD amounts. A reissue carries the currency the operator chose, and the replaced invoice keeps its own |
| Invoice ID | Given at send, per "Every invoice carries an invoice ID and the order's payment reference". Finds the order, including after a reissue |
| Payment reference | Given at send, on every invoice. Shown to the winner only on a bank transfer invoice. Finds the order, including after a reissue |
| Internal audit number | Given at send, per "Invoices and receipts carry an internal audit number". Never shown to the winner |
| Lot | The single lot invoiced. Named unambiguously, since a winner may hold several |
| Payment method | Card or bank transfer. The winner's choice at send, or the operator's at a reissue |
| Bank rail | On a newly issued bank transfer invoice only: FPS, HK Local or International via SWIFT, the supported rail the winner picked. It decides the bank details the winner reads, per "A bank transfer invoice shows how to pay" |
| Winning bid | The accepted bid that won the lot, excluding every other component. Under HKD it keeps its USD amount and is not converted on its own |
| Buyer's premium | The applicable fee. This capability fixes no rate |
| Shipping & Handling | Quoted by an operator for the order's confirmed delivery address. Zero or more |
| Insurance | Optional. Added by an operator for the order's confirmed delivery address, and greater than zero when added |
| Tax | Optional. Added by an operator for the order, and greater than zero when added. Grade10 defines no rate, jurisdiction or formal tax receipt |
| Subtotal | The sum of the components above. Under HKD, that sum in USD converted once to HKD and rounded up to the next cent |
| Payment processing fee | Priced by the payment method, below. On every invoice, and never dropped |
| Order total | The total payable — the subtotal plus the payment processing fee, to the cent |
| Sent at | When the operator sent the invoice. Stored in UTC |
| Payment deadline | 7 calendar days from Sent at, stopped while proof is checked. Stored in UTC; shown in the viewer's local zone on Winner Order and in `Asia/Hong_Kong` as `GMT+8` on the invoice PDF |
| Replaces invoice | On a replacement invoice only: the prior invoice ID named by `Replaces invoice {id}` |
| Invoice status | Per `grade10-site/auction/order-status`. A replaced invoice holds none |

The payment processing fee SHALL be priced by the invoice's payment method:

| Method | Payment processing fee |
| --- | --- |
| Card | The amount that leaves the subtotal whole after the card rule's fixed amount and percentage of the whole charge, computed below |
| Bank transfer | The amount the operator typed in USD on the quote or the reissue, converted alone under HKD, rounded up to the next cent, below the Subtotal and outside the sum converted. Zero or more |

For card, Grade10 SHALL take the card rule for the settlement currency from
Payment Settings, per `grade10-admin/auction/payment-settings`, at the moment
the invoice is sent, SHALL compute the order total as the subtotal plus the
rule's fixed amount divided by one less its percentage, SHALL round that total
up to the next minor unit, and SHALL take the fee as the difference between
the order total and the subtotal. Grade10 SHALL NOT read the payment
provider's fees. Under HKD the subtotal is the converted HKD Subtotal.

A newly issued bank transfer invoice SHALL carry one supported rail offered for
its settlement currency. An ordinary historical confirmed bank order whose
stored rail is absent SHALL remain readable as bank transfer with an unknown
rail. Grade10 SHALL NOT infer a rail from current Finance settings. Existing
sent invoice amounts, currency, confirmed setup, bank snapshot and document
artifacts SHALL remain unchanged.

The fee SHALL be fixed on the invoice once sent. A later change to the card
rule SHALL NOT move it; only a reissue SHALL price it again. No settlement
SHALL drop or change it.

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

On Winner Order, a USD order's Order Summary SHALL show the fee lines that apply
plus Order Total and no Subtotal row, and an HKD order's SHALL show the
Subtotal, per "The Order Summary reads the settlement currency, with USD beneath
each HKD line". The invoice and receipt itemisation SHALL carry Subtotal for
every order.

No component SHALL be marked as an estimate. Grade10 SHALL NOT show the winner
an invoice amount before an operator has sent it.

<!-- trace:scenario id=g10.auction-winner-order.SC-6nv rev=3 -->
#### Scenario: winner-order-SC-04 - An estimated total is marked as one
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent a bank transfer invoice in USD with a winning bid of
  250000, a buyer's premium of 50000, shipping of 8000, insurance of 4000, tax of 6000 and
  a payment processing fee of 0 minor units
- **WHEN** the winner reads the invoice
- **THEN** the order total is 318000 minor units in USD
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

<!-- trace:scenario id=g10.auction-winner-order.SC-awt rev=2 -->
#### Scenario: winner-order-SC-62 - The fee grosses the subtotal up
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent a card invoice whose subtotal is 312000 minor units in HKD
- **AND** the HKD card rule in Payment Settings when it was sent was 3.4 per cent and 235 minor units
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

<!-- trace:scenario id=g10.auction-winner-order.SC-c6t rev=2 -->
#### Scenario: winner-order-SC-110 - A bank transfer fee is the amount the operator entered
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an operator sent a bank transfer invoice in USD with a subtotal of
  312000 and a bank transfer fee of 5000 minor units in USD
- **WHEN** the winner reads the invoice
- **THEN** the payment processing fee is 5000 minor units in USD
- **AND** the order total is 317000 minor units in USD

<!-- trace:scenario id=g10.auction-winner-order.SC-8gv rev=2 -->
#### Scenario: winner-order-SC-302 - An HKD order converts the bank transfer fee typed in USD
**Serves:** winner-order-US-26 - the winner reads the bank transfer fee beside the Subtotal on the invoice

- **GIVEN** an operator sent a bank transfer invoice in HKD whose USD lines sum
  to 13121 minor units, which convert to a Subtotal of 103000 minor units in
  HKD, with a bank transfer fee of 5000 minor units in USD typed on the quote
- **WHEN** the winner reads the invoice
- **THEN** the payment processing fee is 39250 minor units in HKD
- **AND** the order total is 142250 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-16z rev=2 -->
#### Scenario: winner-order-SC-111 - A bank transfer fee of zero reads Free
**Serves:** Invoice - Payment Processing Fee priced by method

- **GIVEN** an operator sent a bank transfer invoice with a subtotal of 312000
  minor units in HKD and a bank transfer fee of 0 minor units typed in USD
- **WHEN** the winner opens the order
- **THEN** the Payment Processing Fee line is shown and reads Free
- **AND** the order total is 312000 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-ppq rev=1 -->
#### Scenario: winner-order-SC-215 - An invoice with no tax shows no Tax line
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice without adding Tax
- **WHEN** the winner reads the invoice, receipt, or Order Summary
- **THEN** no Tax line is shown

<!-- trace:scenario id=g10.auction-winner-order.SC-deu rev=2 -->
#### Scenario: winner-order-SC-216 - Tax is included in the card fee base
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an HKD invoice whose USD winning bid, buyer's premium, shipping,
  insurance, and Tax sum to 40000 minor units
- **WHEN** Grade10 prices its card payment processing fee
- **THEN** the Subtotal used for the gross-up is 314000 minor units in HKD, the
  converted sum with Tax in it

<!-- trace:scenario id=g10.auction-winner-order.SC-4z7 rev=2 -->
#### Scenario: winner-order-SC-214 - Tax is itemised on the invoice and receipt
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a paid auction order in USD whose invoice includes Tax of 6000 minor
  units in USD
- **WHEN** the winner reads the invoice and receipt
- **THEN** each shows Tax of 6000 minor units in USD between Insurance and
  Subtotal

### Requirement: An HKD order converts each USD line at a fixed rate and rounds it up

This requirement keeps its heading for the requirements that cite it, and
scenarios `winner-order-SC-283` to `winner-order-SC-286` keep their titles with
their ids. The headings and titles are historical.

Grade10 SHALL price an HKD order from the order's USD amounts at one fixed rate
of 7.85 HKD to 1 USD, the same for every order. It SHALL NOT look the rate up,
lock a different one per order, or store one on the invoice.

Grade10 SHALL add the order's USD lines and convert the sum once: the winning
bid, the buyer's premium, Shipping & Handling, Insurance and Tax. The converted
sum is the Subtotal, and Grade10 SHALL round it up to the next minor unit of HKD,
a cent. It SHALL NOT convert or round a line on its own, and SHALL NOT round the
Subtotal or the Order Total to a whole HK$.

| USD sum in minor units | Subtotal, in HKD minor units | Read as |
| ---: | ---: | --- |
| 13121 | 103000 | HK$1,030.00 |
| 25100 | 197035 | HK$1,970.35 |
| 12000 | 94200 | HK$942.00 |
| 4 | 32 | HK$0.32 |
| 1 | 8 | HK$0.08 |

A bank transfer fee converts alone: the operator types it in USD and Grade10
SHALL convert it at the same rate, rounded up to the next cent. It sits below
the Subtotal, SHALL NOT be part of the sum Grade10 converts, and SHALL NOT add to
the USD figure the Order Summary's conversion note names.

For a card order, Grade10 SHALL take the card rule for HKD from Payment
Settings and compute the payment processing fee in HKD on the Subtotal, per
"Invoice fields". The fee is not converted. The Order Total SHALL be the
Subtotal plus the fee, to the cent, and SHALL NOT be rounded again.

Grade10 SHALL fix the Subtotal, the fee and the Order Total on the invoice when
it is sent. A sent invoice SHALL NOT re-price, and only a reissue SHALL price it
again, under this rule. The Order Summary's conversion note is the one place
that names the rate; Grade10 SHALL show the rate on no other page, invoice,
receipt or letter.

<!-- trace:scenario id=g10.auction-winner-order.SC-gc6 rev=2 -->
#### Scenario: winner-order-SC-283 - A USD amount converts at 7.85 to an HKD amount
**Serves:** winner-order-US-26 - the winner checks the invoice's Subtotal against the rate

- **GIVEN** an auction order whose winner picked HKD and bank transfer, with a
  hammer price of 10000 minor units in USD, a buyer's premium of 2000,
  Shipping & Handling of 0 and a bank transfer fee of 0 minor units in USD
- **WHEN** an operator sends its invoice
- **THEN** the invoice's Subtotal is 94200 minor units in HKD, the 12000 minor
  units in USD at 7.85
- **AND** the invoice's Winning Bid stays 10000 minor units in USD

<!-- trace:scenario id=g10.auction-winner-order.SC-buj rev=2 -->
#### Scenario: winner-order-SC-284 - A fraction rounds up to the whole HK$
**Serves:** winner-order-US-26 - the winner checks the invoice's Subtotal against the rate

- **GIVEN** an auction order whose winner picked HKD, with a hammer price of
  10100, a buyer's premium of 2020 and Shipping & Handling of 1001 minor units
  in USD
- **WHEN** an operator sends its invoice
- **THEN** the invoice's Subtotal is 103000 minor units in HKD, not 102999, which
  drops the fraction, and not 103100, the three lines each rounded up to a whole
  HK$

<!-- trace:scenario id=g10.auction-winner-order.SC-ekn rev=2 -->
#### Scenario: winner-order-SC-285 - The HKD total adds up the rounded lines
**Serves:** winner-order-US-26 - the winner checks the invoice's Order Total against its lines

- **GIVEN** an auction order whose winner picked HKD and bank transfer, with USD
  lines of 15000, 3000, 4900, 2000 and 200 minor units, and a bank transfer fee
  of 257 minor units in USD
- **WHEN** an operator sends its invoice
- **THEN** the invoice's Subtotal is 197035 minor units in HKD
- **AND** its payment processing fee is 2018 minor units in HKD
- **AND** its Order Total is 199053 minor units in HKD, not 199100, which rounds
  it up to a whole HK$

<!-- trace:scenario id=g10.auction-winner-order.SC-qtr rev=2 -->
#### Scenario: winner-order-SC-286 - A card fee on an HKD order is computed in HKD
**Serves:** winner-order-US-26 - the winner checks the card fee against the Subtotal

- **GIVEN** an auction order whose winner picked HKD and card
- **AND** an HKD card rule in Payment Settings of 3.4 per cent and 235 minor
  units
- **AND** USD lines of 10100, 2020 and 1001 minor units, which convert to a
  Subtotal of 103000 minor units in HKD
- **WHEN** an operator sends its invoice
- **THEN** the payment processing fee is 3869 minor units in HKD
- **AND** the order total is 106869 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-h1a rev=2 -->
#### Scenario: winner-order-SC-287 - A sent HKD invoice does not re-price
**Serves:** winner-order-US-26 - the winner's invoice keeps the amounts it was sent with

- **GIVEN** an HKD invoice sent with a Subtotal of 103000 minor units in HKD from
  USD lines of 13121 minor units
- **WHEN** the winner opens the order after Grade10's conversion figure is
  changed
- **THEN** the invoice still reads a Subtotal of 103000 minor units in HKD
- **AND** a reissue made after the change is priced at the new figure

<!-- trace:scenario id=g10.auction-winner-order.SC-bk7 rev=1 -->
#### Scenario: g10.auction-winner-order.SC1 - The lines convert once, not one by one
**Serves:** winner-order-US-26 - the winner checks the invoice's Subtotal against the rate

- **GIVEN** an auction order whose winner picked HKD and bank transfer, with USD
  lines of 15000, 3000, 4900, 2000 and 200 minor units and a bank transfer fee of
  0
- **WHEN** an operator sends its invoice
- **THEN** the invoice's Subtotal is 197035 minor units in HKD, the 25100 minor
  units in USD at 7.85
- **AND** it is not 197200, the sum of the five lines each rounded up to a whole
  HK$ on its own

<!-- trace:scenario id=g10.auction-winner-order.SC-tmc rev=1 -->
#### Scenario: g10.auction-winner-order.SC2 - A bank transfer fee converts alone and stays out of the Subtotal
**Serves:** winner-order-US-26 - the winner reads the bank transfer fee beside the Subtotal on the invoice

- **GIVEN** an auction order whose winner picked HKD and bank transfer, with USD
  lines of 10100, 2020 and 992 minor units
- **WHEN** an operator sends its invoice with a bank transfer fee of 257 minor
  units in USD
- **THEN** the invoice's Subtotal is 102930 minor units in HKD, the same as with
  no fee
- **AND** its payment processing fee is 2018 minor units in HKD, 257 at 7.85
  rounded up to the next cent
- **AND** its Order Total is 104948 minor units in HKD, not 104947, which is what
  converting the fee with the lines would give

<!-- trace:scenario id=g10.auction-winner-order.SC-o3a rev=1 -->
#### Scenario: g10.auction-winner-order.SC11 - A reissue prices under the rule and the replaced invoice keeps its amounts
**Serves:** winner-order-US-26 - the winner's replaced invoice keeps the amounts it was sent with

- **GIVEN** an HKD invoice sent with USD lines of 10100, 2020 and 1001 minor units
  and a Subtotal of 103000 minor units in HKD
- **WHEN** an operator reissues it with Shipping & Handling of 2001 minor units
  in USD
- **THEN** the new invoice's Subtotal is 110850 minor units in HKD, the 14121
  minor units in USD at 7.85 rounded up to the next cent
- **AND** the replaced invoice still reads a Subtotal of 103000 minor units in
  HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-ida rev=1 -->
#### Scenario: g10.auction-winner-order.SC13 - Only the Order Summary's note names the rate
**Serves:** winner-order-US-26 - the winner finds the rate once, where the HKD total comes from

- **GIVEN** a sent HKD invoice for an order whose winner picked HKD and bank
  transfer, with USD lines of 10100, 2020 and 1001 minor units, whose payment an
  operator confirmed
- **WHEN** the winner reads the Order Summary, the invoice page, the invoice PDF,
  the receipt PDF, the payment reminder and the payment-received letter
- **THEN** the Order Summary's note under the Subtotal reads
  `Converted from US$131.21 at 1 USD = 7.85 HKD`
- **AND** none of the other five names the rate or prints `7.85`

### Requirement: The Order Summary reads the settlement currency, with USD beneath each HKD line

This requirement keeps its heading for the requirements that cite it, and
scenarios `winner-order-SC-290` and `winner-order-SC-304` keep their titles with
their ids. The headings and titles are historical.

The Order Summary on Winner Order SHALL show its lines and its Order Total in the
order's settlement currency. For a USD order every line and the Order Total SHALL
read USD, with no Subtotal row and no conversion note.

For an HKD order the summary SHALL list the invoice's lines in USD: Winning Bid,
Buyer's Premium, Shipping & Handling, and Insurance and Tax when the invoice
carries them. Below them, each group between its own separators, it SHALL show
one Subtotal row in HKD, then the Payment Processing Fee in HKD, then the Order
Total in HKD. The Subtotal is the invoice's Subtotal. No USD total shows.

Every USD line SHALL read with the symbol `US$` and two decimals, as
`US$150.00`.

The Subtotal row SHALL carry the note `Converted from US$X at 1 USD = 7.85 HKD`,
where X is the USD sum of the lines above it. The Payment Processing Fee, card or
bank transfer, SHALL add nothing to X. The note is the one place the summary
names the rate.

The Payment Processing Fee SHALL read in HKD with no USD amount beneath it, and
SHALL read Free when it is zero. Shipping & Handling of zero SHALL read Free.
Insurance and Tax SHALL be left out when the invoice carries none. The Subtotal
and its note SHALL show whatever the lines are. Every amount keeps its two
decimals, and the Order Total reads with its trailing zeros, as in `HK$1,030.00`.

Before an invoice is sent the summary SHALL show no Subtotal row, no HKD amount
and no note. The lot card SHALL keep the winning bid in USD.

<!-- trace:scenario id=g10.auction-winner-order.SC-kdr rev=5 -->
#### Scenario: winner-order-SC-290 - An HKD order's summary reads HKD lines with USD beneath
**Serves:** winner-order-US-27 - the winner checks the HKD total against the USD lines

- **GIVEN** a Pending Payment order whose winner picked HKD and bank transfer,
  with USD lines of 10100, 2020 and 1001 minor units and a bank transfer fee of 0
- **WHEN** the winner opens Winner Order
- **THEN** the Order Summary lines read `US$101.00`, `US$20.20` and `US$10.01`
- **AND** below a separator the Subtotal reads 103000 minor units in HKD, with
  the note `Converted from US$131.21 at 1 USD = 7.85 HKD` under it
- **AND** the Payment Processing Fee reads Free
- **AND** below a separator Order Total reads `HK$1,030.00`, and no USD total
  shows
- **AND** the lot card shows the winning bid of 10100 minor units in USD

<!-- trace:scenario id=g10.auction-winner-order.SC-fq4 rev=4 -->
#### Scenario: winner-order-SC-304 - A card order under HKD shows the HKD fee in the total
**Serves:** winner-order-US-27 - the winner checks the card fee and the HKD total

- **GIVEN** a Pending Payment order whose winner picked HKD and card, with USD
  lines of 10100, 2020 and 1001 minor units
- **AND** an HKD card rule in Payment Settings of 3.4 per cent and 235 minor
  units
- **WHEN** the winner opens Winner Order
- **THEN** the Order Summary lines read `US$101.00`, `US$20.20` and `US$10.01`
- **AND** the Subtotal reads 103000 minor units in HKD
- **AND** the Payment Processing Fee reads 3869 minor units in HKD, with no USD
  amount beneath it
- **AND** Order Total reads `HK$1,068.69`, the invoice's Order Total, and no USD
  total shows

<!-- trace:scenario id=g10.auction-winner-order.SC-59h rev=2 -->
#### Scenario: winner-order-SC-291 - A USD order's summary shows one total
**Serves:** winner-order-US-27 - the winner of a USD order reads one total

- **GIVEN** a Pending Payment order whose winner picked USD
- **WHEN** the winner opens Winner Order
- **THEN** Order Total is one line in USD
- **AND** no HKD amount, no Subtotal row and no conversion note shows

<!-- trace:scenario id=g10.auction-winner-order.SC-ug0 rev=3 -->
#### Scenario: winner-order-SC-292 - The HKD total waits for the invoice
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** an order whose winner picked HKD and whose invoice is not yet sent
- **WHEN** the winner opens Winner Order
- **THEN** the summary shows no Subtotal row, no HKD total, no HKD fee and no
  note
- **AND** the lot card shows the winning bid in USD

<!-- trace:scenario id=g10.auction-winner-order.SC-hcb rev=1 -->
#### Scenario: g10.auction-winner-order.SC8 - The note names the USD lines and not a bank transfer fee
**Serves:** winner-order-US-27 - the winner checks the HKD total against the USD lines

- **GIVEN** a Pending Payment order whose winner picked HKD and bank transfer,
  with USD lines of 15000, 3000, 4900, 2000 and 200 minor units and a bank
  transfer fee of 257 minor units in USD
- **WHEN** the winner opens Winner Order
- **THEN** the note under the Subtotal reads
  `Converted from US$251.00 at 1 USD = 7.85 HKD`
- **AND** the Subtotal reads 197035 minor units in HKD
- **AND** the Payment Processing Fee reads 2018 minor units in HKD, with no USD
  amount beneath it
- **AND** Order Total reads `HK$1,990.53`

<!-- trace:scenario id=g10.auction-winner-order.SC-lfi rev=1 -->
#### Scenario: g10.auction-winner-order.SC9 - Insurance and Tax read in USD above the Subtotal
**Serves:** winner-order-US-27 - the winner checks the HKD total against the USD lines

- **GIVEN** a Pending Payment order whose winner picked HKD and card, with USD
  lines of 15000, 3000, 4900, 2000 and 200 minor units, Insurance and Tax among
  them
- **AND** an HKD card rule in Payment Settings of 3.4 per cent and 235 minor
  units
- **WHEN** the winner opens Winner Order
- **THEN** the Order Summary lines read, in order, Winning Bid `US$150.00`,
  Buyer's Premium `US$30.00`, Shipping & Handling `US$49.00`, Insurance
  `US$20.00` and Tax `US$2.00`
- **AND** the Subtotal reads 197035 minor units in HKD and the Payment
  Processing Fee 7179 minor units in HKD
- **AND** Order Total reads `HK$2,042.14`

<!-- trace:scenario id=g10.auction-winner-order.SC-8t1 rev=1 -->
#### Scenario: g10.auction-winner-order.SC10 - A zero charge reads Free and an absent line is left out
**Serves:** winner-order-US-27 - the winner reads what a free or absent charge looks like

- **GIVEN** a Pending Payment order whose winner picked HKD and bank transfer,
  with a Winning Bid of 10100 and a Buyer's Premium of 2020 minor units in USD,
  Shipping & Handling of 0, no Insurance, no Tax and a bank transfer fee of 0
- **WHEN** the winner opens Winner Order
- **THEN** Shipping & Handling reads Free and the summary shows no Insurance
  line and no Tax line
- **AND** the Subtotal reads 95142 minor units in HKD, with the note
  `Converted from US$121.20 at 1 USD = 7.85 HKD` under it, and the Payment
  Processing Fee reads Free

### Requirement: The winner chooses a settlement currency at order setup

At order setup the winner SHALL choose the order's settlement currency from
`USD` and `HKD`, in the same step as the delivery address and the payment
method. Grade10 SHALL preselect neither and SHALL refuse a confirmation that
carries no currency. The lot is bid in USD whichever currency the winner picks.

This choice applies to a collector winner. For an internal bidder's win,
`grade10-admin/auction/internal-bid` sets HKD settlement, bank transfer and
FPS at lot close; the internal order does not wait for winner setup.

Until the winner confirms, they SHALL be able to change the currency freely.
Once they confirm, the currency locks for the winner with the address and the
method, per "The delivery address locks when the invoice is sent". An operator
MAY change it before the invoice is sent, and on a reissue after, per
`grade10-admin/auction/post-sale`. A sent invoice SHALL keep its own currency
and amounts; a reissue replaces it with a new invoice in the currency the
operator chose, and the replaced invoice keeps its own.

The invoice, the order total, every fee, every payment and refund, the receipt
and every order letter that states an amount owed or paid SHALL carry the
settlement currency. A winning bid on the lot card SHALL stay in USD. Payment
method availability SHALL follow the settlement currency, per "The winner
chooses a payment method with the address".

`settlement_currency: null` is allowed only before confirmation. A missing
`bank_rail` on an ordinary historical confirmed bank order is a separate
legacy fact and SHALL NOT be treated as a missing currency or filled with a
default rail.

<!-- trace:scenario id=g10.auction-winner-order.SC-o92 rev=1 -->
#### Scenario: winner-order-SC-278 - Setup offers USD and HKD with neither picked
**Serves:** winner-order-US-24 - Winner chooses the currency they pay in

- **GIVEN** an auction order for a lot bid in `USD`, in Awaiting Setup
- **WHEN** the winner opens the setup form
- **THEN** the settlement currency choice offers USD and HKD
- **AND** neither is selected

<!-- trace:scenario id=g10.auction-winner-order.SC-j1l rev=1 -->
#### Scenario: winner-order-SC-279 - A confirmation with no currency is refused
**Serves:** winner-order-US-24 - Winner chooses the currency they pay in

- **GIVEN** an auction order in Awaiting Setup, whose winner has chosen a
  delivery address and a billing address but no currency
- **WHEN** the winner confirms setup
- **THEN** Grade10 refuses the confirmation
- **AND** the order holds no delivery address, no currency and no method, and
  is still Awaiting Setup

<!-- trace:scenario id=g10.auction-winner-order.SC-lq9 rev=1 -->
#### Scenario: winner-order-SC-280 - The winner confirms with the currency they picked
**Serves:** winner-order-US-24 - Winner chooses the currency they pay in

- **GIVEN** an auction order in Awaiting Setup where the winner has picked
  HKD and a method HKD offers
- **WHEN** the winner confirms the delivery address
- **THEN** the order records HKD as its settlement currency
- **AND** the order derives as Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-8c6 rev=1 -->
#### Scenario: winner-order-SC-281 - A USD order is priced in USD without conversion
**Serves:** winner-order-US-24 - Winner chooses the currency they pay in

- **GIVEN** an auction order whose winner picked USD, with a hammer price of
  250000 minor units in USD
- **WHEN** an operator sends its invoice
- **THEN** the invoice's Winning Bid is 250000 minor units in USD
- **AND** the buyer's premium is 50000 minor units in USD
- **AND** no line is converted

<!-- trace:scenario id=g10.auction-winner-order.SC-k63 rev=1 -->
#### Scenario: winner-order-SC-282 - A sent invoice keeps its currency
**Serves:** winner-order-US-24 - Winner chooses the currency they pay in

- **GIVEN** an auction order whose invoice was sent in HKD
- **WHEN** a write that is not an operator's reissue sets the order's
  settlement currency to USD
- **THEN** Grade10 refuses the write
- **AND** the order and its invoice still carry HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-rau rev=1 -->
#### Scenario: winner-order-SC-300 - An operator changes the currency before the invoice is sent
**Serves:** `winner-order-US-24`, `grade10-admin/auction/post-sale#post-sale-US-05` - the winner's pick is corrected before the quote

- **GIVEN** an auction order in Preparing Invoice whose winner confirmed HKD and
  HK Local
- **WHEN** an operator holding payment-processing changes the settlement
  currency to USD with a reason
- **THEN** the order records USD, and the winner reads Winner Order in USD
- **AND** the winner's own write to the currency is still refused

<!-- trace:scenario id=g10.auction-winner-order.SC-d84 rev=2 -->
#### Scenario: winner-order-SC-301 - A reissue carries the currency the operator chose
**Serves:** `winner-order-US-24`, `winner-order-US-26` - the winner's currency is corrected after the invoice is sent

- **GIVEN** an auction order whose invoice was sent in HKD with USD lines of
  10000 and 2000 minor units, a Winning Bid of 10000, and a Subtotal of 94200
  minor units in HKD
- **WHEN** an operator reissues it in USD
- **THEN** the new invoice carries a Winning Bid of 10000 minor units in USD
- **AND** the replaced invoice still reads a Winning Bid of 10000 minor units in
  USD and a Subtotal of 94200 minor units in HKD

## ADDED Requirements

### Requirement: An HKD invoice and receipt list the USD lines, then the HKD Subtotal, fee and Order Total

The invoice page, the invoice PDF and every receipt PDF of an HKD order, a
part-payment receipt included, SHALL list the order's lines in USD, then the Subtotal, the Payment Processing Fee and the
Order Total in HKD, in that order. The lines are the Winning Bid, the Buyer's
Premium, Shipping & Handling, and Insurance and Tax when the invoice carries
them. The Subtotal, the fee and the Order Total are the invoice's, per "An HKD
order converts each USD line at a fixed rate and rounds it up". Every amount
keeps its two decimals, zeros included.

These documents SHALL name no conversion rate and carry no conversion note.
Shipping & Handling of zero and a Payment Processing Fee of zero SHALL read
Free, and Insurance and Tax SHALL be left out when the invoice carries none, per
"Invoice fields".

A receipt's Original Invoice Total, Previous Payments, Current Payment Received
and Remaining Balance Due SHALL read in HKD, each payment counted against the
Order Total, and SHALL sit below the lines the receipt lists.

An order in USD SHALL read every amount in USD on the same documents.

<!-- trace:scenario id=g10.auction-winner-order.SC-8ig rev=1 -->
#### Scenario: g10.auction-winner-order.SC3 - An HKD invoice PDF lists the USD lines, then the HKD total
**Serves:** winner-order-US-26 - the winner keeps an invoice that shows what the lot cost in USD and what they pay in HKD

- **GIVEN** an auction order whose winner picked HKD and bank transfer, with USD
  lines of 10100, 2020 and 1001 minor units and a bank transfer fee of 0
- **WHEN** the winner opens the sent invoice PDF
- **THEN** the lot's row reads Winning Bid `US$101.00`, Buyer's Premium
  `US$20.20` and Total `US$121.20`, and Shipping & Handling reads `US$10.01`
- **AND** below them Subtotal reads `HK$1,030.00`, Payment Processing Fee reads
  Free and Order Total reads `HK$1,030.00`
- **AND** no conversion rate and no conversion note is printed

<!-- trace:scenario id=g10.auction-winner-order.SC-81v rev=1 -->
#### Scenario: g10.auction-winner-order.SC4 - An HKD receipt PDF lists the same lines and the payment in HKD
**Serves:** winner-order-US-26 - the winner keeps a receipt that matches the invoice they paid

- **GIVEN** the order of `g10.auction-winner-order.SC3`, paid in full at its
  Order Total of 103000 minor units in HKD
- **WHEN** the winner opens the receipt PDF
- **THEN** it lists the same USD lines, Subtotal `HK$1,030.00`, Payment
  Processing Fee Free and Order Total `HK$1,030.00`
- **AND** Original Invoice Total reads `HK$1,030.00`, Previous Payments
  `HK$0.00`, Current Payment Received `HK$1,030.00` and Remaining Balance Due
  `HK$0.00`
- **AND** no conversion rate and no conversion note is printed

<!-- trace:scenario id=g10.auction-winner-order.SC-rsv rev=1 -->
#### Scenario: g10.auction-winner-order.SC5 - The invoice page lists Insurance and Tax in USD and a card fee in HKD
**Serves:** winner-order-US-26 - the winner reads the same lines on the invoice page as in the Order Summary

- **GIVEN** a sent card invoice for an HKD order, with USD lines of 15000, 3000,
  4900, 2000 and 200 minor units, Insurance and Tax among them
- **AND** an HKD card rule in Payment Settings of 3.4 per cent and 235 minor
  units when it was sent
- **WHEN** the winner opens the invoice page
- **THEN** the lines read Winning Bid `US$150.00`, Buyer's Premium `US$30.00`,
  Shipping & Handling `US$49.00`, Insurance `US$20.00` and Tax `US$2.00`
- **AND** below them Subtotal reads `HK$1,970.35`, Payment Processing Fee
  `HK$71.79` and Order Total `HK$2,042.14`
- **AND** the page names no conversion rate

<!-- trace:scenario id=g10.auction-winner-order.SC-7q5 rev=1 -->
#### Scenario: g10.auction-winner-order.SC6 - A free charge reads Free on the documents and the Subtotal still shows
**Serves:** winner-order-US-26 - the winner reads what a free or absent charge looks like on the documents

- **GIVEN** an HKD order's sent invoice with a Winning Bid of 10100 and a Buyer's
  Premium of 2020 minor units in USD, Shipping & Handling of 0, no Insurance, no
  Tax and a bank transfer fee of 0
- **WHEN** the winner opens the invoice PDF
- **THEN** Shipping & Handling reads Free, and no Insurance line and no Tax line
  shows
- **AND** Subtotal reads `HK$951.42`, Payment Processing Fee reads Free and
  Order Total reads `HK$951.42`

<!-- trace:scenario id=g10.auction-winner-order.SC-ukk rev=1 -->
#### Scenario: g10.auction-winner-order.SC7 - A USD order's documents stay in USD
**Serves:** winner-order-US-26 - the winner of a USD order reads every document in USD

- **GIVEN** an auction order whose winner picked USD and bank transfer, with
  lines of 10100, 2020 and 1001 minor units in USD and a bank transfer fee of 0
- **WHEN** the winner opens the invoice PDF and the invoice page
- **THEN** every line, the Subtotal at 13121 minor units, the Payment Processing
  Fee and the Order Total at 13121 minor units read in USD
- **AND** no HKD amount shows

<!-- trace:scenario id=g10.auction-winner-order.SC-g3i rev=1 -->
#### Scenario: g10.auction-winner-order.SC12 - A part-payment receipt lists the lines above its breakdown
**Serves:** winner-order-US-26 - the winner keeps a receipt for each part payment that matches the invoice

- **GIVEN** the order of `g10.auction-winner-order.SC3`, on which an operator
  recorded a first payment of 30000 minor units in HKD
- **WHEN** the winner opens that payment's receipt PDF
- **THEN** it lists the same USD lines, Subtotal `HK$1,030.00`, Payment
  Processing Fee Free and Order Total `HK$1,030.00`
- **AND** below them Original Invoice Total reads `HK$1,030.00`, Previous
  Payments `HK$0.00`, Current Payment Received `HK$300.00` and Remaining Balance
  Due `HK$730.00`

## REMOVED Requirements

### Requirement: An HKD invoice, receipt and letter carry HKD only

**Reason:** Product decided that an HKD winner reads what the lot cost in USD on
every document: the invoice, the receipt and the receipt letter list the USD
lines, then the HKD Subtotal, fee and Order Total (`decisions.md` Q2 and Q9).
The rule that every amount reads HKD and no USD winning bid prints no longer
holds for them.

**Migration:** "An HKD invoice and receipt list the USD lines, then the HKD
Subtotal, fee and Order Total" states the invoice page and both PDFs, and
`grade10-site/auction/notifications-order`, "Order letters read the currency the
winner pays in", states the letters. A letter that names only a total still
reads that total in HKD and prints no USD winning bid.
