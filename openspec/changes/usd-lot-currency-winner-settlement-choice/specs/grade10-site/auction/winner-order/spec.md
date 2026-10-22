# grade10-site/auction/winner-order Specification

## Purpose

What a winner is sent after a lot closes and what they do with it: one order
per lot, a delivery address, settlement currency, payment method and billing
address they choose, an operator's invoice priced for all of them, payment by
card or by a bank transfer on the rail they chose and prove, and the receipt,
tracker and delivery proof the order keeps afterwards.

## Feature set

- Settlement currency
  - Winner's choice: while confirming the order the winner picks USD or HKD, nothing preselected, fixed once the invoice is sent
  - Order in that currency: the invoice, order total, fees, payments, refunds and order letters carry the settlement currency
  - Fixed conversion: HKD is the USD amount at 7.85, each line rounded up to a whole HK$, then summed
  - Rate never shown: no page, invoice, receipt or letter names the rate
  - No USD bid under HKD: an HKD invoice and receipt print no USD winning bid
- Order summary
  - Settlement currency: the summary lines and Order Total read the currency the winner picked
  - HKD lines with USD beneath: each line reads HKD with its USD amount beneath it, and Order Total is one HKD total
- Payment method
  - Methods by currency: HKD offers Card, FPS and HK Local; USD offers Card, HK Local and International via SWIFT
  - Rail chosen at setup: each bank rail is its own choice, not one bank transfer choice
  - Currency change: switching currency before confirming clears a method the new currency does not offer
  - USD card needs a rule: card is offered in USD only once Finance saves a USD card fee rule
- Internal bidder order
  - Automatic settlement: an internal bidder's winning order starts in HKD on bank transfer via FPS at close, with no winner or operator setup step; the operator still sends its invoice
- Bank transfer
  - Rail picked only: the invoice's bank details open on the rail the winner picked and name no other
- Premium minimum
  - One USD minimum: the lower bound of the calculated premium is one USD amount, converted with the premium under HKD

## ADDED Requirements

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

<!-- trace:scenario id=g10.auction-winner-order.SC-d84 rev=1 -->
#### Scenario: winner-order-SC-301 - A reissue carries the currency the operator chose
**Serves:** `winner-order-US-24`, `winner-order-US-26` - the winner's currency is corrected after the invoice is sent

- **GIVEN** an auction order whose invoice was sent in HKD with a Winning Bid
  of 78500 minor units
- **WHEN** an operator reissues it in USD
- **THEN** the new invoice carries a Winning Bid of 10000 minor units in USD
- **AND** the replaced invoice still reads 78500 minor units in HKD

### Requirement: An HKD order converts each USD line at a fixed rate and rounds it up

Grade10 SHALL price an HKD order from the order's USD amounts at one fixed rate
of 7.85 HKD to 1 USD, the same for every order. It SHALL NOT look the rate up,
lock a different one per order, or store one on the invoice.

Grade10 SHALL convert each USD line on its own and round it up to the whole
HK$: the converted amount is a multiple of 100 minor units in HKD. It SHALL
then add the rounded lines. The lines it converts are the winning bid, the
buyer's premium, Shipping & Handling, Insurance, Tax and a bank transfer fee.
It SHALL NOT convert the USD total once.

| USD amount in minor units | Converted, in HKD minor units | Read as |
| ---: | ---: | --- |
| 10000 | 78500 | HK$785.00 |
| 10100 | 79300 | HK$793.00 |
| 1001 | 7900 | HK$79.00 |
| 1 | 100 | HK$1.00 |
| 0 | 0 | HK$0.00 |

For a card order, Grade10 SHALL take the card rule for HKD from Payment
Settings and compute the payment processing fee in HKD on the sum of the
rounded lines, per "Invoice fields". The fee is not converted. The order total
is the HKD subtotal plus that fee.

Grade10 SHALL fix the converted lines and the fee on the invoice when it is
sent. A sent invoice SHALL NOT re-price, and only a reissue SHALL price it
again. Grade10 SHALL show the rate on no page, invoice, receipt or letter.

<!-- trace:scenario id=g10.auction-winner-order.SC-gc6 rev=1 -->
#### Scenario: winner-order-SC-283 - A USD amount converts at 7.85 to an HKD amount
**Serves:** winner-order-US-26 - Winner who settles in HKD reads the invoice and receipt in HKD

- **GIVEN** an auction order whose winner picked HKD, with a hammer price of
  10000 minor units in USD
- **WHEN** an operator sends its invoice
- **THEN** the invoice's Winning Bid is 78500 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-buj rev=1 -->
#### Scenario: winner-order-SC-284 - A fraction rounds up to the whole HK$
**Serves:** winner-order-US-26 - Winner who settles in HKD reads the invoice and receipt in HKD

- **GIVEN** an auction order whose winner picked HKD, with a hammer price of
  10100 minor units in USD
- **WHEN** an operator sends its invoice
- **THEN** the invoice's Winning Bid is 79300 minor units in HKD, not 79285

<!-- trace:scenario id=g10.auction-winner-order.SC-ekn rev=1 -->
#### Scenario: winner-order-SC-285 - The HKD total adds up the rounded lines
**Serves:** winner-order-US-26 - Winner who settles in HKD reads the invoice and receipt in HKD

- **GIVEN** an auction order whose winner picked HKD and bank transfer, with a
  hammer price of 10100, a buyer's premium of 2020 and Shipping & Handling of
  1001 minor units in USD, and a bank transfer fee of 0 minor units in USD
- **WHEN** an operator sends its invoice
- **THEN** the invoice's lines are 79300, 15900 and 7900 minor units in HKD
- **AND** the order total is 103100 minor units in HKD, the sum of the lines,
  not 103000

<!-- trace:scenario id=g10.auction-winner-order.SC-qtr rev=1 -->
#### Scenario: winner-order-SC-286 - A card fee on an HKD order is computed in HKD
**Serves:** winner-order-US-26 - Winner who settles in HKD reads the invoice and receipt in HKD

- **GIVEN** an auction order whose winner picked HKD and card
- **AND** an HKD card rule in Payment Settings of 3.4 per cent and 235 minor
  units
- **AND** HKD lines summing to 103100 minor units
- **WHEN** an operator sends its invoice
- **THEN** the payment processing fee is 3873 minor units in HKD
- **AND** the order total is 106973 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-h1a rev=1 -->
#### Scenario: winner-order-SC-287 - A sent HKD invoice does not re-price
**Serves:** winner-order-US-26 - Winner who settles in HKD reads the invoice and receipt in HKD

- **GIVEN** an HKD invoice sent with a Winning Bid of 78500 minor units in HKD
- **WHEN** the winner opens the order after Grade10's conversion figure is
  changed
- **THEN** the invoice still reads 78500 minor units in HKD
- **AND** a reissue made after the change is priced at the new figure

### Requirement: An HKD invoice, receipt and letter carry HKD only

An invoice, a receipt and every order letter sent after the winner picks the
currency, for an HKD order, SHALL state every amount in HKD: the lines, the
fee, the order total, each payment and each refund. They SHALL NOT print the
USD winning bid and SHALL NOT name the conversion rate. The invoice's Winning
Bid line SHALL read the converted HKD line. The won-lot letter, sent at the
close before any currency is picked, is the one order letter that names the
USD winning bid, per `grade10-site/auction/notifications-order`.

An order in USD SHALL read every amount in USD on the same documents.

<!-- trace:scenario id=g10.auction-winner-order.SC-tmf rev=1 -->
#### Scenario: winner-order-SC-288 - An HKD invoice prints no USD winning bid
**Serves:** winner-order-US-26 - Winner who settles in HKD reads the invoice and receipt in HKD

- **GIVEN** an auction order whose winner picked HKD, with a hammer price of
  10000 minor units in USD
- **WHEN** the winner opens the sent invoice and its PDF
- **THEN** every amount reads in HKD, with the Winning Bid at 78500 minor
  units
- **AND** no USD amount and no conversion rate is printed

<!-- trace:scenario id=g10.auction-winner-order.SC-vvm rev=1 -->
#### Scenario: winner-order-SC-289 - An HKD receipt and order letter read HKD
**Serves:** winner-order-US-26 - Winner who settles in HKD reads the invoice and receipt in HKD

- **GIVEN** an HKD order whose invoice total is 103100 minor units in HKD and
  whose payment an operator confirmed
- **WHEN** the winner opens the receipt and reads the payment confirmed letter
- **THEN** the order total and the payment read 103100 minor units in HKD
- **AND** no USD winning bid and no conversion rate appears on either

### Requirement: The Order Summary reads the settlement currency, with USD beneath each HKD line

The Order Summary on Winner Order SHALL show its lines and its Order Total in
the settlement currency the winner picked. For a USD order every line and the
Order Total SHALL read USD. For an HKD order each line SHALL read its converted
HKD amount, with the line's USD amount beneath it, and the Order Total SHALL be
one HKD total, the invoice's Order Total. No USD total shows.

A card order settled in HKD SHALL show the Payment Processing Fee as a line in
HKD, with no USD amount beneath it. Grade10 computes it in HKD from the HKD
card rule on the HKD subtotal, and the Order Total includes it.

Before an invoice is sent the summary SHALL show no HKD amount. The lot card
SHALL keep the winning bid in USD.

<!-- trace:scenario id=g10.auction-winner-order.SC-kdr rev=3 -->
#### Scenario: winner-order-SC-290 - An HKD order's summary reads HKD lines with USD beneath
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** a Pending Payment order whose winner picked HKD and bank transfer,
  with USD lines of 10100, 2020 and 1001 minor units
- **WHEN** the winner opens Winner Order
- **THEN** the Order Summary lines read 79300, 15900 and 7900 minor units in
  HKD
- **AND** beneath each line its USD amount reads 10100, 2020 and 1001 minor
  units
- **AND** Order Total reads 103100 minor units in HKD, and no USD total shows
- **AND** the lot card shows the winning bid of 10100 minor units in USD

<!-- trace:scenario id=g10.auction-winner-order.SC-fq4 rev=2 -->
#### Scenario: winner-order-SC-304 - A card order under HKD shows the HKD fee in the total
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** a Pending Payment order whose winner picked HKD and card, with USD
  lines of 10100, 2020 and 1001 minor units
- **AND** an HKD card rule in Payment Settings of 3.4 per cent and 235 minor
  units
- **WHEN** the winner opens Winner Order
- **THEN** the Order Summary lines read 79300, 15900 and 7900 minor units in
  HKD, each with its USD amount beneath it
- **AND** the Payment Processing Fee reads 3873 minor units in HKD, with no USD
  amount beneath it
- **AND** Order Total reads 106973 minor units in HKD, the invoice's Order
  Total, and no USD total shows

<!-- trace:scenario id=g10.auction-winner-order.SC-59h rev=1 -->
#### Scenario: winner-order-SC-291 - A USD order's summary shows one total
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** a Pending Payment order whose winner picked USD
- **WHEN** the winner opens Winner Order
- **THEN** Order Total is one line in USD
- **AND** no HKD amount shows

<!-- trace:scenario id=g10.auction-winner-order.SC-ug0 rev=2 -->
#### Scenario: winner-order-SC-292 - The HKD total waits for the invoice
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** an order whose winner picked HKD and whose invoice is not yet sent
- **WHEN** the winner opens Winner Order
- **THEN** the summary shows no HKD total and no HKD fee
- **AND** the lot card shows the winning bid in USD

## MODIFIED Requirements

### Requirement: Invoice fields

Each invoice SHALL carry these fields. Every amount SHALL be an integer count
of minor units paired with the order's settlement currency, `USD` or `HKD`,
rendered per `shared/money-amounts`. An invoice exists only once an operator
sends it. An HKD invoice SHALL carry the converted lines, per "An HKD order
converts each USD line at a fixed rate and rounds it up".

| Field | Notes |
| --- | --- |
| Auction order | The order this invoice is the payable record for. An order holds one current invoice, and any invoices a reissue replaced |
| Settlement currency | `USD` or `HKD`, the winner's choice at setup, per "The winner chooses a settlement currency at order setup". Every amount below is in it. A reissue carries the currency the operator chose, and the replaced invoice keeps its own |
| Invoice ID | Given at send, per "Every invoice carries an invoice ID and the order's payment reference". Finds the order, including after a reissue |
| Payment reference | Given at send, on every invoice. Shown to the winner only on a bank transfer invoice. Finds the order, including after a reissue |
| Internal audit number | Given at send, per "Invoices and receipts carry an internal audit number". Never shown to the winner |
| Lot | The single lot invoiced. Named unambiguously, since a winner may hold several |
| Payment method | Card or bank transfer. The winner's choice at send, or the operator's at a reissue |
| Bank rail | On a bank transfer invoice only: FPS, HK Local or International via SWIFT, the rail the winner picked. It decides the bank details the winner reads, per "A bank transfer invoice shows how to pay" |
| Winning bid | The accepted bid that won the lot, excluding every other component. In HKD it is the converted line, and the USD bid is not printed |
| Buyer's premium | The applicable fee. This capability fixes no rate |
| Shipping & Handling | Quoted by an operator for the order's confirmed delivery address. Zero or more |
| Insurance | Optional. Added by an operator for the order's confirmed delivery address, and greater than zero when added |
| Tax | Optional. Added by an operator for the order, and greater than zero when added. Grade10 defines no rate, jurisdiction or formal tax receipt |
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
| Card | The amount that leaves the subtotal whole after the card rule's fixed amount and percentage of the whole charge, computed below |
| Bank transfer | The amount the operator typed in USD on the quote or the reissue, converted with the other lines under HKD. Zero or more |

For card, Grade10 SHALL take the card rule for the settlement currency from
Payment Settings, per `grade10-admin/auction/payment-settings`, at the moment
the invoice is sent, SHALL compute the order total as the subtotal plus the
rule's fixed amount divided by one less its percentage, SHALL round that total
up to the next minor unit, and SHALL take the fee as the difference between
the order total and the subtotal. Grade10 SHALL NOT read the payment
provider's fees.

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

<!-- trace:scenario id=g10.auction-winner-order.SC-8gv rev=1 -->
#### Scenario: winner-order-SC-302 - An HKD order converts the bank transfer fee typed in USD
**Serves:** winner-order-US-26 - Winner who settles in HKD reads the invoice and receipt in HKD

- **GIVEN** an operator sent a bank transfer invoice in HKD whose lines total
  103100 minor units in HKD, with a bank transfer fee of 5000 minor units in
  USD typed on the quote
- **WHEN** the winner reads the invoice
- **THEN** the payment processing fee is 39300 minor units in HKD
- **AND** the order total is 142400 minor units in HKD

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

### Requirement: Grade10 computes the buyer's premium

Grade10 SHALL compute every invoice's buyer's premium in USD, the bid
currency; no operator SHALL enter, waive or change it. The premium SHALL be
the larger of:

1. 20% of the hammer price (read by the winner as Winning Bid) alone,
   rounded half up to the nearest minor unit, and
2. the premium minimum, the one USD amount Payment Settings holds, per
   `grade10-admin/auction/payment-settings`.

Shipping, insurance and tax SHALL NOT be part of its base. The premium SHALL be
an integer count of minor units in USD. For an HKD order the premium is one
line and converts with the others, per "An HKD order converts each USD line at
a fixed rate and rounds it up"; there is no second minimum in HKD.

A minimum of 0 SHALL mean no minimum. A changed rate or minimum SHALL apply
to invoices sent or reissued after it takes effect; an invoice already sent
SHALL keep its amounts.

<!-- trace:scenario id=g10.auction-winner-order.SC-zhu rev=2 -->
#### Scenario: winner-order-SC-40 - The premium is 20% of the winning bid
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the premium minimum is 20000 minor units in USD
- **AND** an auction order with a hammer price of 250000 minor units in USD
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 50000 minor units in USD
- **AND** the operator was not asked to enter it

<!-- trace:scenario id=g10.auction-winner-order.SC-b16 rev=2 -->
#### Scenario: winner-order-SC-41 - The minimum charge applies when it is higher
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the premium minimum is 20000 minor units in USD
- **AND** an auction order with a hammer price of 50000 minor units in USD
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 20000 minor units in USD

<!-- trace:scenario id=g10.auction-winner-order.SC-2mz rev=2 -->
#### Scenario: winner-order-SC-42 - A zero minimum leaves the rounded 20%
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the premium minimum is 0
- **AND** an auction order with a hammer price of 1003 minor units in USD
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 201 minor units in USD

<!-- trace:scenario id=g10.auction-winner-order.SC-ip8 rev=2 -->
#### Scenario: winner-order-SC-43 - A sent invoice keeps its premium when the minimum changes
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** an invoice sent with a hammer price of 50000 and a buyer's premium of 10000 minor units in USD while the premium minimum was 0
- **WHEN** the premium minimum changes to 20000 minor units
- **THEN** that invoice's buyer's premium stays 10000 minor units in USD
- **AND** an invoice reissued for that order afterwards carries 20000 minor units in USD

### Requirement: An invoice calculates the buyer's premium

When Grade10 creates or reissues an auction invoice, the buyer's premium SHALL
be the larger of 20% of the winning bid and the current premium minimum, one
USD amount. The percentage amount is rounded to the nearest minor unit with
half values rounded up. A minimum of 0 means no minimum. The premium SHALL be
included in the invoice final amount and in every invoice receipt, converted
with the other lines under HKD. A bid panel SHALL disclose only the 20% rate; it SHALL not display this
calculated amount before an invoice exists.

<!-- trace:scenario id=g10.auction-winner-order.SC-30s rev=2 -->
#### Scenario: grade10-site-auction-winner-order-SC-46 - Invoice carries 20% of the winning bid
**Serves:** winner-order-US-08 - Winner pays an invoice with a policy premium

- **GIVEN** a winning bid of 250000 USD minor units
- **WHEN** Grade10 creates the winner's invoice in USD
- **THEN** the invoice buyer's premium is 50000 USD minor units
- **AND** the final amount includes that 50000 USD premium

<!-- trace:scenario id=g10.auction-winner-order.SC-ml2 rev=1 -->
#### Scenario: grade10-site-auction-winner-order-SC-47 - Fractional minor-unit premium rounds deterministically
**Serves:** winner-order-US-08 - Winner pays an invoice with a policy premium

- **GIVEN** a winning bid of 101 USD minor units
- **WHEN** Grade10 creates the winner's invoice
- **THEN** the buyer's premium is 20 USD minor units
- **AND** the amount is an integer minor-unit value

### Requirement: The winner chooses a payment method with the address

The winner picks a settlement currency and a payment method at the same time as
the delivery address, and the picks lock with it.

**Chosen with the address** - When the winner confirms a delivery address on
an auction order, Winner Order SHALL also ask how they will pay:

1. Choose USD or HKD as the settlement currency, per "The winner chooses a
   settlement currency at order setup".
2. Choose a payment method that currency offers.
3. Read the fee range Grade10 sets for each method.
4. Confirm the address, the currency and the method together.

**No preselection** - Grade10 SHALL preselect no currency and no method, and
SHALL record the chosen method on the order. Until the winner picks a
currency, Winner Order SHALL offer no method.

**Methods by currency** - The methods follow the settlement currency picked:

| Settlement currency | Methods offered |
| --- | --- |
| HKD | Card, FPS, HK Local |
| USD | Card, HK Local, International via SWIFT |

FPS, HK Local and International via SWIFT are bank rails. Each rail SHALL be
its own choice at setup, and Grade10 SHALL NOT offer one bank transfer choice
that lists the rails after the winner confirms. A rail is a bank transfer
method, and the order SHALL record the rail the winner picked.

**Fee range at the choice** - The fee range for each method SHALL be text
Grade10 sets:

| Method | Reads |
| --- | --- |
| Card | `Card fee about {percentage}% + a fixed amount` |
| FPS, HK Local, International via SWIFT | `Bank fee set on your invoice` |

`{percentage}` SHALL be the percentage of the card fee rule Payment Settings
holds for the currency picked, as Finance saved it. Finance MAY set it to any
value Payment Settings accepts, and the text SHALL read that value, not a fixed
figure. The bank rail text SHALL name no amount, since an operator sets that
fee on the invoice.

**Offered where Grade10 can take it** - Grade10 SHALL offer each method only
where it can take the payment:

| Method | Offered where |
| --- | --- |
| Card | Payment Settings holds a card fee rule for the settlement currency, per `grade10-admin/auction/payment-settings` |
| A bank rail | Grade10 holds that rail's bank details |

| Where | Bank details Grade10 holds |
| --- | --- |
| Outside production | Sample accounts for each rail |
| Production | The accounts Finance confirms for each rail; none until then |

**Card not yet available** - In a currency with no card fee rule, the choice
SHALL show card as not yet available in that currency, and the winner SHALL
NOT be able to choose it. Once Finance saves a card fee rule for the currency,
card SHALL be offered on every order in it that the winner has not yet
confirmed.

**Currency change** - A winner who switches currency before confirming SHALL
keep the method they chose only where the new currency offers it. Otherwise
Grade10 SHALL clear the method, preselect none and refuse a confirmation until
the winner chooses one.

**Neither method** - Where the currency offers neither card nor a bank rail,
Winner Order SHALL say that payment is not yet available in the order's
currency and offer Contact Us, per "Contact Us opens a copy-first ready
email", and Grade10 SHALL refuse a confirmation as one with no method chosen.
The setup deadline SHALL keep running: the order reads Setup Overdue once it
passes, as any unconfirmed order does, and an operator reopens or records setup
by hand, per `grade10-admin/auction/post-sale`.

**Refused** - Grade10 SHALL refuse a confirmation with no method chosen, and
SHALL refuse a method the settlement currency does not offer or that is not
offered where Grade10 cannot take it. A refused confirmation SHALL record
neither the address, the currency nor the method.

**Locked on confirmation** - Until the winner confirms, they SHALL be able to
change the currency and the method freely. Once they confirm, both lock for the
winner, per "The delivery address locks when the invoice is sent". An operator
MAY change either before the invoice is sent, and on a reissue after, per
`grade10-admin/auction/post-sale`.

Scenarios `winner-order-SC-92` and `winner-order-SC-226` keep their titles
with their ids. The titles are historical: each rail is offered or withheld on
its own bank details, and card on its own rule.

<!-- trace:scenario id=g10.auction-winner-order.SC-oyi rev=1 -->
#### Scenario: winner-order-SC-293 - HKD offers card, FPS and HK Local
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup, where Payment Settings holds an
  HKD card fee rule and Grade10 holds FPS, HK Local and SWIFT bank details
- **WHEN** the winner picks HKD
- **THEN** card, FPS and HK Local are offered, each as its own choice
- **AND** International via SWIFT is not offered

<!-- trace:scenario id=g10.auction-winner-order.SC-crs rev=1 -->
#### Scenario: winner-order-SC-294 - USD offers card, HK Local and SWIFT
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup, where Payment Settings holds a
  USD card fee rule and Grade10 holds FPS, HK Local and SWIFT bank details
- **WHEN** the winner picks USD
- **THEN** card, HK Local and International via SWIFT are offered, each as its
  own choice
- **AND** FPS is not offered

<!-- trace:scenario id=g10.auction-winner-order.SC-4lj rev=1 -->
#### Scenario: winner-order-SC-295 - Switching currency clears a method the new currency does not offer
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD and
  International via SWIFT, and has not confirmed
- **WHEN** the winner switches the currency to HKD
- **THEN** no method is selected
- **AND** a confirmation without a new choice is refused

<!-- trace:scenario id=g10.auction-winner-order.SC-6un rev=1 -->
#### Scenario: winner-order-SC-296 - Switching currency keeps a method both currencies offer
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD and HK
  Local, and has not confirmed
- **WHEN** the winner switches the currency to HKD
- **THEN** HK Local stays selected

<!-- trace:scenario id=g10.auction-winner-order.SC-vbp rev=1 -->
#### Scenario: winner-order-SC-297 - USD card waits for a USD card fee rule
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD, where
  Payment Settings holds no USD card fee rule and Grade10 holds HK Local and
  SWIFT bank details
- **WHEN** the winner reaches the payment method choice
- **THEN** card reads that it is not yet available in USD and cannot be chosen
- **AND** HK Local and International via SWIFT are offered

<!-- trace:scenario id=g10.auction-winner-order.SC-rge rev=1 -->
#### Scenario: winner-order-SC-298 - A method the currency does not offer is refused
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD
- **WHEN** a confirmation carrying FPS reaches Grade10
- **THEN** Grade10 refuses it
- **AND** the order records neither the address, the currency nor the method

<!-- trace:scenario id=g10.auction-winner-order.SC-v59 rev=2 -->
#### Scenario: winner-order-SC-90 - The method is recorded with the address
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in Awaiting Setup, where Grade10 holds FPS bank
  details
- **WHEN** the winner confirms a delivery address, picks HKD and chooses FPS
- **THEN** the order records bank transfer as its payment method, on the FPS
  rail
- **AND** the order derives as Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-8dl rev=2 -->
#### Scenario: winner-order-SC-91 - The choice shows a fee range and no bank transfer amount
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD, where
  Grade10 holds FPS and HK Local bank details and Payment Settings holds an
  HKD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** card reads `Card fee about 3.4% + a fixed amount`
- **AND** FPS and HK Local each read `Bank fee set on your invoice`, naming no
  amount
- **AND** no method is selected

<!-- trace:scenario id=g10.auction-winner-order.SC-o4y rev=1 -->
#### Scenario: winner-order-SC-303 - The card fee range reads the percentage of the currency picked
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup, where Payment Settings holds an
  HKD card fee rule of 3.4 per cent and a USD card fee rule of 4.4 per cent
- **WHEN** the winner picks USD, then switches to HKD
- **THEN** card reads `Card fee about 4.4% + a fixed amount` under USD
- **AND** card reads `Card fee about 3.4% + a fixed amount` under HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-1aa rev=2 -->
#### Scenario: winner-order-SC-92 - A currency with no bank details offers card only
**Serves:** Payment method - bank transfer only where bank details are set up

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD, where
  Grade10 holds HK Local bank details and no FPS bank details, and Payment
  Settings holds an HKD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** card and HK Local are offered
- **AND** FPS is not offered
- **AND** a confirmation carrying FPS for that order is refused

<!-- trace:scenario id=g10.auction-winner-order.SC-pt5 rev=2 -->
#### Scenario: winner-order-SC-93 - The method can change until the winner confirms
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD, where
  Grade10 holds HK Local bank details and Payment Settings holds an HKD card
  fee rule, on which the winner has chosen card and not yet confirmed
- **WHEN** the winner changes the choice to HK Local and confirms the address
- **THEN** the order records bank transfer, on the HK Local rail
- **AND** the order derives as Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-wn1 rev=2 -->
#### Scenario: winner-order-SC-94 - A confirmation with no method is refused
**Serves:** Payment method - card or bank transfer recorded with the address

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD
- **WHEN** the winner confirms a delivery address without choosing a method
- **THEN** Grade10 refuses the confirmation
- **AND** the order is still Awaiting Setup

<!-- trace:scenario id=g10.auction-winner-order.SC-er5 rev=2 -->
#### Scenario: winner-order-SC-226 - Production offers card only until Finance confirms the account
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD, in
  production, where Grade10 holds no FPS and no HK Local bank details and
  Payment Settings holds an HKD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** only card is offered
- **AND** a confirmation carrying the home address and FPS is refused
- **AND** the order holds no delivery address and no method

<!-- trace:scenario id=g10.auction-winner-order.SC-7y2 rev=2 -->
#### Scenario: winner-order-SC-248 - A currency with no card fee rule does not offer card
**Serves:** Payment method - card only where Finance set a card fee rule

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD,
  outside production, where Grade10 holds the sample bank details and Payment
  Settings holds no HKD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** card reads that it is not yet available in HKD and cannot be chosen
- **AND** FPS and HK Local are offered
- **AND** a confirmation carrying card for that order is refused
- **AND** the order holds no delivery address and no method

<!-- trace:scenario id=g10.auction-winner-order.SC-cz1 rev=2 -->
#### Scenario: winner-order-SC-249 - A currency with neither method cannot confirm setup
**Serves:** Payment method - card only where Finance set a card fee rule

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD, where
  Payment Settings holds no USD card fee rule and Grade10 holds no HK Local
  and no SWIFT bank details
- **WHEN** the winner reaches the payment method choice
- **THEN** the page says payment is not yet available in USD and offers
  Contact Us
- **AND** neither card nor a bank rail can be chosen
- **AND** Grade10 refuses a confirmation of the delivery address
- **AND** the order is still Awaiting Setup, holding no delivery address and no
  method

<!-- trace:scenario id=g10.auction-winner-order.SC-ii6 rev=2 -->
#### Scenario: winner-order-SC-257 - The setup deadline runs where no method is offered
**Serves:** winner-order-US-07 - Winner misses the address deadline

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD, where
  Payment Settings holds no USD card fee rule and Grade10 holds no HK Local
  and no SWIFT bank details, whose winner has not confirmed setup
- **WHEN** 48 hours pass from the lot's close
- **THEN** the order reads Setup Overdue
- **AND** an operator holding payment processing can reopen or record its
  setup

<!-- trace:scenario id=g10.auction-winner-order.SC-zk3 rev=1 -->
#### Scenario: winner-order-SC-305 - The step opens with the currency's first method selected
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup offered USD and HKD, where
  Payment Settings holds a USD card fee rule and Grade10 holds HK Local and
  SWIFT bank details
- **WHEN** the winner reaches the payment method choice
- **THEN** USD is selected and card is selected
- **AND** the winner can still choose HK Local or International via SWIFT
  before confirming

<!-- trace:scenario id=g10.auction-winner-order.SC-mw8 rev=1 -->
#### Scenario: winner-order-SC-306 - A single settlement currency names itself and offers no picker
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup that settles in HKD only, where
  Payment Settings holds an HKD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** the choice reads `Pay in HKD` and offers no currency picker
- **AND** card is selected

### Requirement: A bank transfer invoice shows how to pay

A pending bank transfer invoice tells the winner where to send the money and
what reference to quote.

**Two entry points** - While an invoice sent for bank transfer is `pending`,
Winner Order's order summary SHALL offer **Submit Payment Proof** as the
primary control and **View Bank Details** as a secondary control immediately under
it. **View Bank Details** SHALL open the View Bank Details dialog. **Submit Payment
Proof** SHALL open the Submit Payment Proof dialog. Grade10 SHALL hide both
controls whenever Pay is hidden, including while the invoice is `payment_verifying`.

**View Bank Details** - The View Bank Details dialog SHALL show the total amount
due in the invoice's currency and the details of the one rail the winner
picked, and SHALL name no other rail and offer no tabs. It SHALL show that
rail's fields as labelled detail rows without copy controls, then the invoice's
bank reference as a labelled detail row without a copy control, and a warning
that the winner must enter the reference in the bank app's memo or remarks
field. Live account details and the FPS QR come from Finance-owned
configuration. Grade10 snapshots the picked rail's approved instructions on
the issued bank-transfer invoice; the preview uses Grade10 Finance Limited and
HSBC Hong Kong samples.

| Rail picked | Details shown |
| --- | --- |
| FPS | FPS ID, account name, scannable FPS QR |
| HK Local | Bank name, bank code, branch code, full account number including bank and branch code |
| International via SWIFT | Beneficiary name, beneficiary address, bank name, bank address (main branch address, city, country), SWIFT/BIC, full account number or IBAN; after the payment reference, a note to choose OUR for transfer fees so Grade10 receives the full order total |

**Submit Payment Proof** - Submit Payment Proof SHALL be a separate dialog
titled Submit Payment Proof. It SHALL NOT show amount due, transfer reference,
or any rail's details. Proof upload rules stay under "The winner uploads
payment proof once".

**No card Pay** - Grade10 SHALL offer no card Pay control on a bank transfer
invoice and SHALL refuse a card payment attempted against one. A winner who
wants to pay by card asks Grade10, and an operator reissues the invoice.

Scenarios `winner-order-SC-95`, `winner-order-SC-181`, `winner-order-SC-182`
and `winner-order-SC-183` keep their titles with their ids. The titles are
historical: the dialog shows the one rail picked, with no tabs and no default.

<!-- trace:scenario id=g10.auction-winner-order.SC-bmm rev=2 -->
#### Scenario: winner-order-SC-95 - A bank transfer invoice shows three ways and the reference
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose invoice was sent for bank transfer on the HK Local rail and is `pending`
- **WHEN** the winner opens View Bank Details
- **THEN** the HK Local details are shown with the fields above
- **AND** no FPS or SWIFT details and no rail tabs are shown
- **AND** the bank reference is shown after the fields
- **AND** no card Pay control is offered

<!-- trace:scenario id=g10.auction-winner-order.SC-dvp rev=1 -->
#### Scenario: winner-order-SC-96 - A card payment on a bank transfer invoice is refused
**Serves:** Bank transfer - card Pay is not offered on a bank transfer invoice

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** a card payment is attempted for that invoice
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

<!-- trace:scenario id=g10.auction-winner-order.SC-zbt rev=1 -->
#### Scenario: winner-order-SC-180 - Order summary offers Submit Payment Proof and View Bank Details
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** the winner opens Winner Order
- **THEN** Order summary shows Submit Payment Proof
- **AND** View Bank Details sits under it
- **AND** View Bank Details opens the View Bank Details dialog
- **AND** Submit Payment Proof opens the Submit Payment Proof dialog

<!-- trace:scenario id=g10.auction-winner-order.SC-zx9 rev=2 -->
#### Scenario: winner-order-SC-181 - View Bank Details opens on FPS
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose invoice was sent for bank transfer on the FPS rail and is `pending`
- **WHEN** the winner opens View Bank Details
- **THEN** FPS ID, account name and an FPS QR are shown
- **AND** no HK Local or SWIFT details are shown

<!-- trace:scenario id=g10.auction-winner-order.SC-tf6 rev=2 -->
#### Scenario: winner-order-SC-182 - HK Local tab shows branch code
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose invoice was sent for bank transfer on the HK Local rail and is `pending`
- **WHEN** the winner opens View Bank Details
- **THEN** bank name, bank code, branch code and the full account number including bank and branch code are shown

<!-- trace:scenario id=g10.auction-winner-order.SC-oii rev=2 -->
#### Scenario: winner-order-SC-183 - SWIFT tab shows OUR note after payment reference
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in USD whose invoice was sent for bank transfer on the International via SWIFT rail and is `pending`
- **WHEN** the winner opens View Bank Details
- **THEN** beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC and the full account number or IBAN are shown
- **AND** the payment reference and memo warning are shown
- **AND** a note after the payment reference tells the winner to choose OUR for transfer fees so Grade10 receives the full order total

<!-- trace:scenario id=g10.auction-winner-order.SC-fm9 rev=2 -->
#### Scenario: winner-order-SC-184 - Submit Payment Proof is proof-only
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** the winner opens Submit Payment Proof from Order summary
- **THEN** the dialog title is Submit Payment Proof
- **AND** amount due and transfer reference are not shown
- **AND** no rail's details are shown

<!-- trace:scenario id=g10.auction-winner-order.SC-i03 rev=1 -->
#### Scenario: winner-order-SC-299 - The rail picked at setup is the rail the invoice shows
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order whose winner confirmed setup in HKD with FPS
- **AND** an operator sent its invoice for bank transfer
- **WHEN** the winner opens View Bank Details
- **THEN** only the FPS details are shown

### Requirement: A lot close opens an order that waits for the winner's address

At lot close Grade10 SHALL, for the winner:

1. Create one auction order for the lot, with invoice status `not_issued` and
   fulfilment status `unfulfilled`, per `grade10-site/auction/order-status`.
2. Notify the winner that they have won and ask them to confirm a delivery
   address, per `grade10-site/auction/notifications-order`.

Grade10 SHALL NOT issue an invoice at lot close, and SHALL offer the winner no
way to pay until an operator has sent one.

When the winner confirms a delivery address, the order SHALL become ready for
an operator to quote, per `grade10-admin/auction/post-sale`. From then on the
winner SHALL NOT change the address, per "The delivery address locks when the
invoice is sent".

When a lot's leading bid at its close is the house's, under
`grade10-site/auction/auction`, the winner is the internal bidder of
`grade10-admin/auction/internal-bid` that the lot's internal bid names.
Grade10 SHALL create its one auction order in step 1, flagged internal, and
SHALL, in place of step 2 and the winner's setup:

- Take the internal bidder's billing address as it stands at the close as
  the order's delivery address and billing address, and set settlement
  currency to `HKD`, payment method to `bank_transfer` and rail to `fps`, all
  at the close. The order is ready for an operator to quote and send an
  invoice and never waits on an address deadline. The lot and its winning bid
  remain USD, per
  `grade10-admin/auction/internal-bid`.
- Send no letter of `grade10-site/auction/notifications-order` for the order,
  at the close or after it, to the internal bidder or to anyone.

The close SHALL write the internal order's currency and rail together with its
confirmed address and method. It SHALL NOT leave these fields null for an
operator to fill, and SHALL NOT issue an invoice.

Order creation and the winner notice SHALL be idempotent. A lot
close delivered more than once SHALL produce one auction order.

<!-- trace:scenario id=g10.auction-winner-order.SC-l0b rev=1 -->
#### Scenario: winner-order-SC-26 - A lot close asks for an address, not payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a lot closing with a winner
- **WHEN** the lot closes
- **THEN** Grade10 creates one auction order with invoice status `not_issued`
  and fulfilment status `unfulfilled`
- **AND** issues no invoice
- **AND** asks the winner to confirm a delivery address

<!-- trace:scenario id=g10.auction-winner-order.SC-2p8 rev=2 -->
#### Scenario: winner-order-SC-27 - A repeated lot close creates nothing twice
**Serves:** Invoice at lot close - a repeated lot close creates nothing twice

- **GIVEN** a lot whose close has already created an auction order
- **WHEN** that same lot close is delivered again
- **THEN** Grade10 leaves one auction order
- **AND** does not notify the winner a second time

<!-- trace:scenario id=g10.auction-winner-order.SC-sko rev=1 -->
#### Scenario: winner-order-SC-28 - Confirming an address readies the order for a quote
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order waiting for its winner's address
- **WHEN** the winner confirms a delivery address
- **THEN** the order's derived status is Preparing Invoice
- **AND** the winner is offered no way to pay yet

<!-- trace:scenario id=g10.auction-winner-order.SC-los rev=7 -->
#### Scenario: winner-order-SC-277 - A lot an internal bidder wins opens its order with the internal bidder's address
**Serves:** `grade10-admin/auction/internal-bid#grade10-admin-auction-internal-bid-US-06`

- **GIVEN** a `USD` lot where the house leads at 10100 minor units over
  collector A, its internal bid naming an internal bidder whose billing
  address is in Hong Kong
- **WHEN** the lot closes
- **THEN** Grade10 creates one auction order for the internal bidder, flagged
  internal, with invoice status `not_issued` and settlement currency `HKD`
- **AND** the order holds that billing address as its delivery and billing
  address, with `bank_transfer` on `fps`, and derives as Preparing Invoice
- **AND** the order records the lot's 10100 minor-unit winning bid in USD
- **AND** no invoice is issued, no winner or operator setup step is required,
  and no won, address or other letter is sent for it

## REMOVED Requirements

None.
