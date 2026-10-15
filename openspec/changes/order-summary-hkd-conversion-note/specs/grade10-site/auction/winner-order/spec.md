# grade10-site/auction/winner-order Specification

## Feature set

- Order summary
  - HKD one-currency summary: for an HKD order every line and the Order Total read HKD, and a note under the total names the USD figure converted and the fixed rate
- Settlement currency
  - Rate named once: the Order Summary's conversion note is the one surface that names the rate; every other page, invoice, receipt or letter names none

## MODIFIED Requirements

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
again. The Order Summary's conversion note is the one surface that names the
rate; Grade10 SHALL show the rate on no other page, invoice, receipt or
letter.

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

### Requirement: The Order Summary reads the settlement currency, with USD beneath each HKD line

The Order Summary on Winner Order SHALL show its lines and its Order Total in
the settlement currency the winner picked. For a USD order every line and the
Order Total SHALL read USD. For an HKD order each line SHALL read its
converted HKD amount, and the Order Total SHALL be one HKD total, the
invoice's Order Total. No USD amount shows on a line and no USD total shows.

Beneath the Order Total an HKD order's summary SHALL name the conversion in
one note: the USD figure the converted lines carry and the fixed rate, as
"Converted from US$131.21 at 1 USD = 7.85 HKD". The figure is the converted
lines' USD total — a card fee computed in HKD adds nothing to it, while a
bank fee typed in USD counts as a converted line.

A card order settled in HKD SHALL show the Payment Processing Fee as a line in
HKD, with no USD amount. Grade10 computes it in HKD from the HKD card rule on
the HKD subtotal, and the Order Total includes it.

Before an invoice is sent the summary SHALL show no HKD amount and no note.
The lot card SHALL keep the winning bid in USD.

<!-- trace:scenario id=g10.auction-winner-order.SC-kdr rev=4 -->
#### Scenario: winner-order-SC-290 - An HKD order's summary reads HKD lines with USD beneath
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** a Pending Payment order whose winner picked HKD and bank transfer,
  with USD lines of 10100, 2020 and 1001 minor units
- **WHEN** the winner opens Winner Order
- **THEN** the Order Summary lines read 79300, 15900 and 7900 minor units in
  HKD, with no USD amount among them
- **AND** Order Total reads 103100 minor units in HKD, the invoice's Order
  Total, and no USD total shows
- **AND** beneath the Order Total a note reads "Converted from US$131.21 at
  1 USD = 7.85 HKD", naming the USD figure converted and the fixed rate
- **AND** the lot card shows the winning bid of 10100 minor units in USD

<!-- trace:scenario id=g10.auction-winner-order.SC-fq4 rev=3 -->
#### Scenario: winner-order-SC-304 - A card order under HKD shows the HKD fee in the total
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** a Pending Payment order whose winner picked HKD and card, with USD
  lines of 10100, 2020 and 1001 minor units
- **AND** an HKD card rule in Payment Settings of 3.4 per cent and 235 minor
  units
- **WHEN** the winner opens Winner Order
- **THEN** the Order Summary lines read 79300, 15900 and 7900 minor units in
  HKD, with no USD amount among them
- **AND** the Payment Processing Fee reads 3873 minor units in HKD, with no
  USD amount
- **AND** Order Total reads 106973 minor units in HKD, the invoice's Order
  Total
- **AND** the note names the converted USD figure alone — "Converted from
  US$131.21 at 1 USD = 7.85 HKD" — the HKD fee adding nothing to it

<!-- trace:scenario id=g10.auction-winner-order.SC-59h rev=2 -->
#### Scenario: winner-order-SC-291 - A USD order's summary shows one total
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** a Pending Payment order whose winner picked USD
- **WHEN** the winner opens Winner Order
- **THEN** Order Total is one line in USD
- **AND** no HKD amount shows
- **AND** no conversion note shows

<!-- trace:scenario id=g10.auction-winner-order.SC-ug0 rev=3 -->
#### Scenario: winner-order-SC-292 - The HKD total waits for the invoice
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** an order whose winner picked HKD and whose invoice is not yet sent
- **WHEN** the winner opens Winner Order
- **THEN** the summary shows no HKD total, no HKD fee and no conversion note
- **AND** the lot card shows the winning bid in USD
