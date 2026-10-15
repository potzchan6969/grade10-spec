# grade10-site/auction/winner-order Specification

## Feature set

- Order summary
  - HKD and USD views: an HKD | USD control in the summary heading swaps every amount, Order Total included; HKD is the view the order opens on

## MODIFIED Requirements

### Requirement: The Order Summary reads the settlement currency, with USD beneath each HKD line

The Order Summary on Winner Order SHALL show its lines and its Order Total in
the settlement currency the winner picked. For a USD order every line and the
Order Total SHALL read USD. For an HKD order each line SHALL read its
converted HKD amount, and the Order Total SHALL be one HKD total, the
invoice's Order Total.

An HKD order's summary SHALL carry an HKD | USD control in its heading. On
USD every line SHALL read the lot's USD figure and the Order Total SHALL
read the USD total, the lot's USD figures; on HKD the summary reads as the
invoice does. The control SHALL NOT hold its picked view across visits.

A card order settled in HKD SHALL show the Payment Processing Fee as a line
in HKD in both views, with no USD figure. Grade10 computes it in HKD from the
HKD card rule on the HKD subtotal, and the HKD Order Total includes it. A
bank fee typed in USD SHALL swap with the other lines.

Before an invoice is sent the summary SHALL show no HKD amount and no
control. The lot card SHALL keep the winning bid in USD.

<!-- trace:scenario id=g10.auction-winner-order.SC-kdr rev=4 -->
#### Scenario: winner-order-SC-290 - An HKD order's summary reads HKD lines with USD beneath
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** a Pending Payment order whose winner picked HKD and bank transfer,
  with USD lines of 10100, 2020 and 1001 minor units
- **WHEN** the winner opens Winner Order
- **THEN** the Order Summary lines read 79300, 15900 and 7900 minor units in
  HKD, with the control on HKD and no USD amount shown among them
- **WHEN** the winner picks USD on the control
- **THEN** each line reads its USD amount of 10100, 2020 and 1001 minor units
- **AND** Order Total reads 13121 minor units in USD
- **AND** on HKD Order Total reads 103100 minor units in HKD
- **AND** the lot card shows the winning bid of 10100 minor units in USD

<!-- trace:scenario id=g10.auction-winner-order.SC-fq4 rev=3 -->
#### Scenario: winner-order-SC-304 - A card order under HKD shows the HKD fee in the total
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** a Pending Payment order whose winner picked HKD and card, with USD
  lines of 10100, 2020 and 1001 minor units
- **AND** an HKD card rule in Payment Settings of 3.4 per cent and 235 minor
  units
- **WHEN** the winner opens Winner Order and picks USD on the control
- **THEN** the Order Summary lines read 10100, 2020 and 1001 minor units in
  USD
- **AND** the Payment Processing Fee reads 3873 minor units in HKD, with no
  USD figure
- **AND** Order Total reads 13121 minor units in USD; on HKD it reads 106973
  minor units in HKD, the invoice's Order Total

<!-- trace:scenario id=g10.auction-winner-order.SC-b8x rev=1 -->
#### Scenario: winner-order-SC-305 - The summary swaps between HKD and USD views
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** a Pending Payment order whose winner picked HKD, with USD lines
  present
- **WHEN** the winner opens Winner Order
- **THEN** the Order Summary reads on HKD and the control shows HKD picked
- **WHEN** the winner picks USD
- **THEN** every amount the summary carries swaps to USD, Order Total
  included
- **WHEN** the winner picks HKD
- **THEN** every amount reads HKD again

<!-- trace:scenario id=g10.auction-winner-order.SC-59h rev=2 -->
#### Scenario: winner-order-SC-291 - A USD order's summary shows one total
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** a Pending Payment order whose winner picked USD
- **WHEN** the winner opens Winner Order
- **THEN** Order Total is one line in USD
- **AND** no HKD amount shows
- **AND** no currency control shows

<!-- trace:scenario id=g10.auction-winner-order.SC-ug0 rev=3 -->
#### Scenario: winner-order-SC-292 - The HKD total waits for the invoice
**Serves:** winner-order-US-27 - Winner who settles in HKD reads the Order Summary in HKD

- **GIVEN** an order whose winner picked HKD and whose invoice is not yet sent
- **WHEN** the winner opens Winner Order
- **THEN** the Order Summary reads no HKD amount
- **AND** no currency control shows
