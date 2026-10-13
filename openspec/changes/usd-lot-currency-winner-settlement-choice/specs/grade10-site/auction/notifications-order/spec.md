# grade10-site/auction/notifications-order Specification

## Feature set

- Post-close letters
  - Won-lot letter keeps the bid: auction-won, sent before a currency is picked, names the US$ winning bid
  - Letters in the settlement currency: invoice, payment reminder, payment received and receipt carry the settlement currency and no USD winning bid

## ADDED Requirements

### Requirement: Order letters read the currency the winner pays in

Only the auction-won letter keeps a USD amount. Grade10 sends it when the lot
closes, before the winner picks a settlement currency, and it SHALL name the
winning bid in USD, with no other currency and no conversion.

Every letter Grade10 sends after the winner confirms setup and that states an
amount SHALL state it in the order's settlement currency, per
`grade10-site/auction/winner-order`: the payment reminder, its day 3 and day 6
reminders, the final notice, payment overdue, payment received and partial
payment received. Those letters SHALL NOT print the USD winning bid and SHALL
NOT name a conversion rate. The receipt PDF attached to a payment-received
letter reads the same currency.

A letter for an invoice an operator reissues in another currency SHALL carry
the new invoice's currency; a letter already sent keeps the currency it was
sent in.

<!-- trace:scenario id=g10.auction-notifications-order.SC-pyd rev=1 -->
#### Scenario: order-mail-SC-63 - The won-lot letter names the USD winning bid
**Serves:** Post-close letters - the won-lot letter is the one letter that keeps the USD bid

- **GIVEN** a lot that closed with a winning bid of 10100 minor units in USD
- **WHEN** Grade10 sends the winner the auction-won letter
- **THEN** the letter names the winning bid as 10100 minor units in USD
- **AND** it names no HKD amount and no conversion rate

<!-- trace:scenario id=g10.auction-notifications-order.SC-tfm rev=1 -->
#### Scenario: order-mail-SC-64 - An HKD invoice's payment reminder reads HKD only
**Serves:** Post-close letters - letters after the winner picks read the settlement currency only

- **GIVEN** an auction order whose winner picked HKD, with a hammer price of
  10100 minor units in USD
- **WHEN** an operator sends its invoice with an order total of 103100 minor
  units in HKD
- **THEN** Grade10 sends the payment-reminder letter naming 103100 minor units
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

<!-- trace:scenario id=g10.auction-notifications-order.SC-16k rev=1 -->
#### Scenario: order-mail-SC-66 - An HKD payment-received letter and its receipt read HKD only
**Serves:** Post-close letters - letters after the winner picks read the settlement currency only

- **GIVEN** an HKD order whose invoice total is 103100 minor units in HKD and
  whose card payment is confirmed
- **WHEN** Grade10 sends the payment-received letter
- **THEN** the letter and the attached receipt PDF name 103100 minor units in
  HKD as the amount paid
- **AND** neither prints a USD winning bid or a conversion rate

<!-- trace:scenario id=g10.auction-notifications-order.SC-7qg rev=1 -->
#### Scenario: order-mail-SC-67 - A payment-overdue letter names the amount in the settlement currency
**Serves:** Post-close letters - letters after the winner picks read the settlement currency only

- **GIVEN** an auction order in HKD whose invoice of 103100 minor units in HKD
  is `pending`
- **WHEN** its payment deadline passes and Grade10 sets the invoice to
  `expired`
- **THEN** Grade10 sends the payment-overdue letter naming 103100 minor units
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

## REMOVED Requirements

None.
