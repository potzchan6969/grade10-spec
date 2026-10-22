# grade10-site/auction/notifications-order Specification

## Feature set

- Post-close letters
  - Letters list lines as the invoice does: a letter that lists lines, the receipt letter, lists the USD lines, then the HKD Subtotal, fee and total, and names no rate
  - Totals in HKD: a letter that names only a total reads the HKD Order Total
  - Letters in the settlement currency: every letter after the winner picks states its amounts in the settlement currency; the won-lot letter names the USD winning bid alone, and the payment-received letter lists USD lines

## MODIFIED Requirements

### Requirement: Order letters read the currency the winner pays in

The auction-won letter, which Grade10 sends when the lot closes and before the
winner picks a settlement currency, SHALL name the winning bid in USD, with no
other currency and no conversion.

Every letter Grade10 sends after the winner confirms setup and that states an
amount SHALL state it in the order's settlement currency, per
`grade10-site/auction/winner-order`. A letter that names only a total, the
payment reminder, its day 3 and day 6 reminders, the final notice, payment
overdue and partial payment received, SHALL name the Order Total, in HKD for an
HKD order. It SHALL print no USD winning bid and SHALL NOT name a conversion
rate.

The payment-received letter lists the order's lines as the invoice does. For an
HKD order it SHALL list the Winning Bid, the Buyer's Premium, Shipping &
Handling, and Insurance and Tax when the invoice carries them, each in USD, then
the Subtotal, the Payment Processing Fee and the Order Total in HKD, per
`grade10-site/auction/winner-order`, "An HKD invoice and receipt list the USD
lines, then the HKD Subtotal, fee and Order Total". It SHALL name no conversion
rate and carry no conversion note. The receipt PDF attached to it reads the same
lines. For a USD order it SHALL list every line, the fee and the Order Total in
USD.

A letter for an invoice an operator reissues in another currency SHALL carry
the new invoice's currency; a letter already sent keeps the currency it was
sent in.

Scenario `order-mail-SC-66` keeps its title with its id. The title is
historical: the letter lists USD lines above its HKD total.

<!-- trace:scenario id=g10.auction-notifications-order.SC-pyd rev=1 -->
#### Scenario: order-mail-SC-63 - The won-lot letter names the USD winning bid
**Serves:** Post-close letters - the won-lot letter is the one letter that keeps the USD bid

- **GIVEN** a lot that closed with a winning bid of 10100 minor units in USD
- **WHEN** Grade10 sends the winner the auction-won letter
- **THEN** the letter names the winning bid as 10100 minor units in USD
- **AND** it names no HKD amount and no conversion rate

<!-- trace:scenario id=g10.auction-notifications-order.SC-tfm rev=2 -->
#### Scenario: order-mail-SC-64 - An HKD invoice's payment reminder reads HKD only
**Serves:** Post-close letters - letters after the winner picks read the settlement currency only

- **GIVEN** an auction order whose winner picked HKD, with USD lines of 10100,
  2020 and 1001 minor units
- **WHEN** an operator sends its invoice with an order total of 103000 minor
  units in HKD
- **THEN** Grade10 sends the payment-reminder letter naming 103000 minor units
  in HKD as the invoice total
- **AND** the letter prints no USD winning bid and no conversion rate

<!-- trace:scenario id=g10.auction-notifications-order.SC-3mo rev=1 -->
#### Scenario: order-mail-SC-65 - A USD invoice's payment reminder reads USD
**Serves:** Post-close letters - letters after the winner picks read the settlement currency only

- **GIVEN** an auction order whose winner picked USD
- **WHEN** an operator sends its invoice with an order total of 312000 minor
  units in USD
- **THEN** Grade10 sends the payment-reminder letter naming 312000 minor units
  in USD as the invoice total

<!-- trace:scenario id=g10.auction-notifications-order.SC-16k rev=2 -->
#### Scenario: order-mail-SC-66 - An HKD payment-received letter and its receipt read HKD only
**Serves:** `Post-close letters`, `grade10-site/auction/winner-order#winner-order-US-26` - the winner keeps a receipt letter that matches the invoice they paid

- **GIVEN** an HKD order paid by card, with USD lines of 10100, 2020 and 1001
  minor units, a Subtotal of 103000, a Payment Processing Fee of 3869 and an
  Order Total of 106869 minor units in HKD
- **AND** the card payment is confirmed
- **WHEN** Grade10 sends the payment-received letter
- **THEN** the letter lists Winning Bid `US$101.00`, Buyer's Premium `US$20.20`
  and Shipping & Handling `US$10.01`
- **AND** below them it lists Subtotal `HK$1,030.00`, Payment Processing Fee
  `HK$38.69` and Order Total `HK$1,068.69`, and names 106869 minor units in HKD
  as the amount paid
- **AND** the letter prints no conversion rate and no conversion note

<!-- trace:scenario id=g10.auction-notifications-order.SC-7qg rev=2 -->
#### Scenario: order-mail-SC-67 - A payment-overdue letter names the amount in the settlement currency
**Serves:** Post-close letters - letters after the winner picks read the settlement currency only

- **GIVEN** an auction order in HKD whose invoice of 103000 minor units in HKD
  is `pending`
- **WHEN** its payment deadline passes and Grade10 sets the invoice to
  `expired`
- **THEN** Grade10 sends the payment-overdue letter naming 103000 minor units
  in HKD as the outstanding amount
- **AND** the letter prints no USD amount

<!-- trace:scenario id=g10.auction-notifications-order.SC-0e7 rev=1 -->
#### Scenario: order-mail-SC-68 - A reissue in another currency sends the new currency
**Serves:** Post-close letters - letters after the winner picks read the settlement currency only

- **GIVEN** an auction order whose HKD invoice an operator reissues in USD with
  an order total of 13121 minor units in USD
- **WHEN** the reissue is committed
- **THEN** Grade10 sends the payment reminder for the new invoice naming 13121
  minor units in USD
- **AND** the HKD invoice's earlier letter is unchanged

<!-- trace:scenario id=g10.auction-notifications-order.SC-uv3 rev=1 -->
#### Scenario: g10.auction-notifications-order.SC1 - A free charge reads Free in the payment-received letter
**Serves:** `Post-close letters`, `grade10-site/auction/winner-order#winner-order-US-26` - the winner keeps a receipt letter that matches the invoice they paid

- **GIVEN** an HKD order paid by bank transfer, with a Winning Bid of 10100 and a
  Buyer's Premium of 2020 minor units in USD, Shipping & Handling of 0, no
  Insurance, no Tax and a bank transfer fee of 0
- **WHEN** Grade10 sends the payment-received letter
- **THEN** Shipping & Handling reads Free, and the letter lists no Insurance
  line and no Tax line
- **AND** Subtotal reads `HK$951.42`, Payment Processing Fee reads Free and
  Order Total reads `HK$951.42`

<!-- trace:scenario id=g10.auction-notifications-order.SC-3g9 rev=1 -->
#### Scenario: g10.auction-notifications-order.SC2 - A USD payment-received letter lists its lines in USD
**Serves:** `Post-close letters`, `grade10-site/auction/winner-order#winner-order-US-26` - the winner of a USD order keeps a receipt letter in USD

- **GIVEN** a USD order whose invoice has lines of 10100, 2020 and 1001 minor
  units and an Order Total of 13121 minor units in USD, and whose card payment
  is confirmed
- **WHEN** Grade10 sends the payment-received letter
- **THEN** the letter lists the three lines and the Order Total in USD
- **AND** it shows no HKD amount
