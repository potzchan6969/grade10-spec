# grade10-site/auction/winner-order Specification

## Feature set

- Settlement currency
  - Convert once: an HKD order's Subtotal is the sum of its USD lines at 7.85, rounded up to the next cent; no line is converted or rounded on its own
  - Cent rounding: every amount keeps two decimals; a fraction of a cent rounds up where an amount is converted or grossed up; the Order Total is the Subtotal plus the fee
  - Bank transfer fee under HKD: typed in USD, converted at 7.85 and rounded up to the next cent, below the Subtotal and outside the converted sum
  - Rate named in the note only: the conversion note names the rate on the Order Summary and under the Subtotal of the invoice and receipt PDFs; the invoice page and the letters do not
  - Same lines on every document: an HKD invoice and receipt list the USD lines, then the HKD Subtotal, fee and total
  - Note on the PDFs: the invoice and receipt PDFs of an HKD order carry the Order Summary's note under the Subtotal; a USD order carries none
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
the USD figure the conversion note names.

For a card order, Grade10 SHALL take the card rule for HKD from Payment
Settings and compute the payment processing fee in HKD on the Subtotal, per
"Invoice fields". The fee is not converted. The Order Total SHALL be the
Subtotal plus the fee, to the cent, and SHALL NOT be rounded again.

Grade10 SHALL fix the Subtotal, the fee and the Order Total on the invoice when
it is sent. A sent invoice SHALL NOT re-price, and only a reissue SHALL price it
again, under this rule. The conversion note under the Subtotal names the rate on
the Order Summary and on the invoice and receipt PDFs. Grade10 SHALL show the
rate on no other page and in no letter, the invoice page included.

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

<!-- trace:scenario id=g10.auction-winner-order.SC-ygl rev=1 -->
#### Scenario: g10.auction-winner-order.SC14 - An HKD invoice sent under the per-line rule reads in the new layout from its stored amounts
**Serves:** winner-order-US-27 - the winner of an invoice sent before this layout reads it

- **GIVEN** a Pending Payment order whose HKD invoice was sent under the per-line
  rule, with USD lines of 10100, 2020 and 1001 minor units, a stored Subtotal of
  103100 minor units in HKD and a stored Order Total of 103100
- **WHEN** the winner opens Winner Order
- **THEN** the Order Summary lists the USD lines, then the Subtotal at the stored
  103100 minor units in HKD, with the note
  `Converted from US$131.21 at 1 USD = 7.85 HKD` under it
- **AND** Order Total reads `HK$1,031.00`, and nothing is re-priced

<!-- trace:scenario id=g10.auction-winner-order.SC-ida rev=2 -->
#### Scenario: g10.auction-winner-order.SC13 - The note names the rate on the Order Summary and the two PDFs, and nowhere else
**Serves:** winner-order-US-26 - the winner finds the rate where the HKD total comes from

- **GIVEN** a sent HKD invoice for an order whose winner picked HKD and bank
  transfer, with USD lines of 10100, 2020 and 1001 minor units, whose payment an
  operator confirmed
- **WHEN** the winner reads the Order Summary, the invoice page, the invoice PDF,
  the receipt PDF, the payment reminder and the payment-received letter
- **THEN** the note under the Subtotal reads
  `Converted from US$131.21 at 1 USD = 7.85 HKD` on the Order Summary, on the
  invoice PDF and on the receipt PDF
- **AND** the invoice page, the payment reminder and the payment-received letter
  name no rate and print no `7.85`

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

A line with no USD fact on record, as on an invoice sent before USD facts were
stored, SHALL read in the settlement currency, and the Subtotal row then carries
no note.

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

<!-- trace:scenario id=g10.auction-winner-order.SC-d50 rev=1 -->
#### Scenario: g10.auction-winner-order.SC15 - A line with no USD fact reads in HKD and the note is dropped
**Serves:** winner-order-US-27 - the winner of an invoice sent before USD facts were stored reads it

- **GIVEN** a Pending Payment order whose HKD invoice was sent with no USD fact
  on record, lines of 79300, 15900 and 7900 minor units in HKD and a stored
  Subtotal and Order Total of 103100 minor units in HKD
- **WHEN** the winner opens Winner Order
- **THEN** the lines read 79300, 15900 and 7900 minor units in HKD
- **AND** the Subtotal reads 103100 minor units in HKD with no note under it
- **AND** nothing is re-priced

### Requirement: Insurance info tooltip

On Winner Order's order summary, Insurance explains itself when the line is
shown.

**Tooltip** - When the Insurance line is shown, Grade10 SHALL offer a brief
info tooltip beside it.

**Copy** - The tooltip SHALL read `0.9% of the order value during transit.`

**Currency** - Under HKD the Insurance line reads in USD, per "The Order Summary
reads the settlement currency, with USD beneath each HKD line".

<!-- trace:scenario id=g10.auction-winner-order.SC-yzf rev=2 -->
#### Scenario: winner-order-SC-169 - A shown Insurance line carries its info tooltip
**Serves:** winner-order-US-01 - the winner reads Order Summary while settling
the lot

- **GIVEN** an operator sent an HKD invoice with Insurance of 4000 minor units in
  USD
- **WHEN** the winner opens Winner Order
- **THEN** the Insurance line shows `US$40.00`
- **AND** the line offers a brief info tooltip
- **AND** the tooltip reads `0.9% of the order value during transit.`

<!-- trace:scenario id=g10.auction-winner-order.SC-2zt rev=1 -->
#### Scenario: winner-order-SC-170 - An absent Insurance line offers no tooltip
**Serves:** winner-order-US-01 - the winner reads Order Summary while settling
the lot

- **GIVEN** an operator sent an invoice without adding Insurance
- **WHEN** the winner opens Winner Order
- **THEN** no Insurance line is shown
- **AND** no Insurance tooltip is offered

### Requirement: Tax info tooltip

On Winner Order's Order Summary, Tax explains itself whenever the line is shown.

**Tooltip** - Grade10 SHALL offer a brief info tooltip beside Tax whenever the
Tax line is shown.

**Copy** - The tooltip SHALL read `Set by Grade10 for where your order ships.
Some orders have none.`

**Currency** - Under HKD the Tax line reads in USD, per "The Order Summary reads
the settlement currency, with USD beneath each HKD line".

<!-- trace:scenario id=g10.auction-winner-order.SC-d0w rev=2 -->
#### Scenario: winner-order-SC-217 - A shown Tax line carries its info tooltip
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an HKD invoice with Tax of 6000 minor units in USD
- **WHEN** the winner reads Order Summary
- **THEN** the Tax line shows `US$60.00`
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

## ADDED Requirements

### Requirement: An HKD invoice and receipt list the USD lines, then the HKD Subtotal, fee and Order Total

The invoice page, the invoice PDF and every receipt PDF of an HKD order, a
part-payment receipt included, SHALL list the order's lines in USD, then the Subtotal, the Payment Processing Fee and the
Order Total in HKD, in that order. The lines are the Winning Bid, the Buyer's
Premium, Shipping & Handling, and Insurance and Tax when the invoice carries
them. The Subtotal, the fee and the Order Total are the invoice's, per "An HKD
order converts each USD line at a fixed rate and rounds it up". Every amount
keeps its two decimals, zeros included.

The invoice PDF and every receipt PDF of an HKD order SHALL carry the
conversion note `Converted from US$X at 1 USD = 7.85 HKD` directly under the
Subtotal row, drawn muted, where X is the USD sum of the lines above the
Subtotal, as the Order Summary's note reads it. The Payment Processing Fee,
card or bank transfer, SHALL add nothing to X, and the note is absent when a
line has no USD fact on record. The invoice page SHALL name no conversion rate
and carry no conversion note. Shipping & Handling of zero and a Payment Processing Fee of zero SHALL read
Free, and Insurance and Tax SHALL be left out when the invoice carries none, per
"Invoice fields".

A receipt's Original Invoice Total, Previous Payments, Current Payment Received
and Remaining Balance Due SHALL read in HKD, each payment counted against the
Order Total, and SHALL sit below the lines the receipt lists.

An order in USD SHALL read every amount in USD on the same documents, and its
Subtotal row SHALL carry no note.

<!-- trace:scenario id=g10.auction-winner-order.SC-8ig rev=2 -->
#### Scenario: g10.auction-winner-order.SC3 - An HKD invoice PDF lists the USD lines, then the HKD total
**Serves:** winner-order-US-26 - the winner keeps an invoice that shows what the lot cost in USD and what they pay in HKD

- **GIVEN** an auction order whose winner picked HKD and bank transfer, with USD
  lines of 10100, 2020 and 1001 minor units and a bank transfer fee of 0
- **WHEN** the winner opens the sent invoice PDF
- **THEN** the lot's row reads Winning Bid `US$101.00`, Buyer's Premium
  `US$20.20` and Total `US$121.20`, and Shipping & Handling reads `US$10.01`
- **AND** below them Subtotal reads `HK$1,030.00`, Payment Processing Fee reads
  Free and Order Total reads `HK$1,030.00`

<!-- trace:scenario id=g10.auction-winner-order.SC-81v rev=2 -->
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

<!-- trace:scenario id=g10.auction-winner-order.SC-63n rev=1 -->
#### Scenario: g10.auction-winner-order.SC16 - An HKD invoice PDF carries the conversion note under the Subtotal
**Serves:** winner-order-US-26 - the winner checks the invoice PDF's Subtotal against the rate

- **GIVEN** the order of `g10.auction-winner-order.SC3`, with USD lines of 10100,
  2020 and 1001 minor units
- **WHEN** the winner opens the sent invoice PDF
- **THEN** directly under Subtotal `HK$1,030.00`, and above Payment Processing
  Fee, the note reads `Converted from US$131.21 at 1 USD = 7.85 HKD`, drawn muted
- **AND** the figure is the USD sum of the three lines, 13121 minor units, as on
  the Order Summary's note

<!-- trace:scenario id=g10.auction-winner-order.SC-dfs rev=1 -->
#### Scenario: g10.auction-winner-order.SC17 - Every HKD receipt PDF carries the same note under the Subtotal
**Serves:** winner-order-US-26 - the winner checks each receipt PDF's Subtotal against the rate

- **GIVEN** the order of `g10.auction-winner-order.SC3`, with a receipt for a full
  payment of 103000 minor units in HKD and a receipt for a part payment of 30000
  minor units in HKD
- **WHEN** the winner opens each receipt PDF
- **THEN** each reads, directly under Subtotal `HK$1,030.00`, the note
  `Converted from US$131.21 at 1 USD = 7.85 HKD`, drawn muted
- **AND** each draws its payment breakdown below the lines and carries no note
  there

<!-- trace:scenario id=g10.auction-winner-order.SC-ela rev=1 -->
#### Scenario: g10.auction-winner-order.SC18 - A USD order's invoice and receipt PDFs carry no note
**Serves:** winner-order-US-26 - the winner of a USD order reads documents without a conversion

- **GIVEN** the USD order of `g10.auction-winner-order.SC7`, paid in full
- **WHEN** the winner opens the invoice PDF and the receipt PDF
- **THEN** neither draws a note under the Subtotal, and no row or gap sits between
  Subtotal and Payment Processing Fee
- **AND** neither prints a rate or `7.85`

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
