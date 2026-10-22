# grade10-admin/auction/post-sale Specification

## Feature set

- Quote and send
  - Quote in USD: the operator types every amount, the bank transfer fee included, in USD
  - HKD preview: the quote preview reads the USD lines typed, then the HKD Subtotal, fee and total, with no rate

## MODIFIED Requirements

### Requirement: The quote is typed in USD and read in the settlement currency

An operator SHALL type every amount of the quote in USD, the bid currency,
whichever settlement currency the order carries: Shipping & Handling,
Insurance, Tax and the bank transfer fee. The winning bid and the buyer's
premium are USD facts of the order.

**HKD order** - Grade10 SHALL price the order as `grade10-site/auction/winner-order`
states, "An HKD order converts each USD line at a fixed rate and rounds it up".
The operator SHALL read the USD lines, the winning bid, the buyer's premium,
Shipping & Handling, and Insurance and Tax when added, then the Subtotal, the
payment processing fee and the order total in HKD, the amount the invoice asks
for. The quote SHALL show no HKD amount for a line on its own, no conversion note
and no rate. For card the fee is the HKD card rule on the Subtotal, read-only;
for bank transfer it is the fee the operator typed in USD, converted below the
Subtotal.

**USD order** - Grade10 SHALL convert nothing and the quote SHALL read in USD.

**The rail is named** - The quote SHALL name the payment method the winner
chose and, for bank transfer, the rail: FPS, HK Local or International via
SWIFT. An ordinary historical confirmed bank order with no recorded rail may
read as bank transfer with an unknown rail until the operator supplies a
currently offered rail for a future send.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-8ko rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-251 - An HKD order's quote reads the converted total
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer on
  HK Local with a winning bid of 10100 and a buyer's premium of 2020 minor
  units in USD
- **WHEN** an operator enters Shipping & Handling of 1001 and a bank transfer
  fee of 0 minor units in USD
- **THEN** the quote reads a Subtotal and an order total of 103000 minor units in
  HKD
- **AND** no conversion rate shows on the quote

<!-- trace:scenario id=g10adm.auction-post-sale.SC-c0y rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-252 - A line is typed in USD on an HKD order
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer
- **WHEN** an operator types Shipping & Handling as `10.01`
- **THEN** Grade10 stores 1001 minor units in USD for that line
- **AND** the invoice sent carries that line as 1001 minor units in USD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-nzi rev=1 -->
#### Scenario: g10adm.auction-post-sale.SC1 - A bank transfer quote reads the USD lines, then the HKD Subtotal, fee and total
**Serves:** post-sale-US-21 - the operator reads the HKD total before the winner does

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer on
  HK Local with a winning bid of 10100 and a buyer's premium of 2020 minor units
  in USD
- **WHEN** an operator enters Shipping & Handling of 992 and a bank transfer fee
  of 257 minor units in USD
- **THEN** the quote lists the USD lines of 10100, 2020 and 992 minor units
- **AND** below them it reads a Subtotal of 102930, a payment processing fee of
  2018 and an order total of 104948 minor units in HKD
- **AND** no HKD amount shows beside a USD line, and no rate and no conversion
  note shows

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ox0 rev=1 -->
#### Scenario: g10adm.auction-post-sale.SC2 - A card quote reads the fee computed on the Subtotal
**Serves:** post-sale-US-21 - the operator reads the HKD total before the winner does

- **GIVEN** an auction order in HKD in Preparing Invoice for card, with a
  winning bid of 10100 and a buyer's premium of 2020 minor units in USD
- **AND** the HKD card rule in Payment Settings is 3.4 per cent and 235 minor
  units
- **WHEN** an operator enters Shipping & Handling of 1001 minor units in USD
- **THEN** the quote lists the USD lines of 10100, 2020 and 1001 minor units and
  a Subtotal of 103000 minor units in HKD
- **AND** it reads the payment processing fee of 3869 read-only and an order
  total of 106869 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-du4 rev=1 -->
#### Scenario: g10adm.auction-post-sale.SC3 - The total the operator read is the total sent
**Serves:** post-sale-US-21 - the operator sends the total they read

- **GIVEN** the quote of `g10adm.auction-post-sale.SC1`, which read an order total
  of 104948 minor units in HKD
- **WHEN** the operator sends the invoice
- **THEN** the invoice is `pending` with a Subtotal of 102930, a payment
  processing fee of 2018 and an order total of 104948 minor units in HKD

### Requirement: An operator quotes and sends the invoice

An operator holding payment-processing SHALL prepare and send the invoice for
an auction order in Preparing Invoice:

1. Open the order and read the winner's confirmed delivery address, the
   settlement currency, the payment method the winner chose and, for bank
   transfer, its recorded rail or its explicit historical unknown state, the
   winning bid, and the buyer's premium.
2. Enter Shipping & Handling for that address, an integer count of minor
   units of zero or more in USD.
3. Optionally add Insurance for that address, an integer count of minor units
   greater than zero in USD.
4. Optionally add Tax for the order, an integer count of minor units greater
   than zero in USD.
5. For bank transfer, enter the bank transfer fee: an integer count of minor
   units of zero or more in USD, with no upper limit. An empty field is zero,
   and a fee of zero reads Free to the winner.
6. Read the subtotal, the payment processing fee, and the order total in the
   settlement currency, per "The quote is typed in USD and read in the
   settlement currency". For card, Grade10 computes the fee from the card rule
   for the settlement currency in Payment Settings, per
   `grade10-admin/auction/payment-settings`, and the operator does not enter
   it; for bank transfer, the fee is the amount entered in step 5.
7. Send the invoice.

On send Grade10 SHALL issue the invoice with invoice status `pending`, an
invoice reference, and the payment method, record Sent at, set the payment
deadline to 7 calendar days from Sent at, lock the delivery address and the
payment method, write a sent entry to the invoice log, and send the winner the
payment reminder letter, per `grade10-site/auction/notifications-order`.

Grade10 SHALL refuse to send an invoice when the winner has confirmed no
delivery address, when the order holds no settlement currency, or when a new
confirmation or future operator transition has no supported rail for a bank
transfer (an internal bidder's order reads its lot's USD and is sent
as `grade10-admin/auction/internal-bid` states, with no currency or rail step), when
Shipping & Handling is missing, when Insurance or Tax is
added at zero, when a bank transfer invoice's fee is not an
integer of zero or more, when Payment Settings holds no card rule for a card
invoice's settlement currency (`CARD_FEE_UNSET`), or when the order total the send
carries differs from the one Grade10 prices on receipt (`QUOTE_CHANGED`). The
`CARD_FEE_UNSET` refusal SHALL say the card fee for that currency is not set
and point to Payment Settings. No send SHALL need the payment provider.

For an ordinary historical order already confirmed for bank transfer whose
rail was never recorded, a first future send is allowed only after the operator
supplies a currently offered rail. Grade10 SHALL NOT issue a rail-less invoice,
and SHALL preserve any existing setup, sent invoice facts, bank snapshot and
document artifacts while the order remains in the unknown read state.
An operator without payment-processing SHALL see the send control visible and
disabled, and Grade10 SHALL refuse the same action on the server.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-7jg rev=3 -->
#### Scenario: grade10-admin-auction-post-sale-SC-48 - Sending the invoice opens the payment window
**Serves:** Quote and send - sending issues the invoice and starts the deadline

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer on
  FPS with a winning bid of 10000 and a buyer's premium of 2000 minor units in
  USD
- **AND** an operator holding payment-processing
- **WHEN** they enter Shipping & Handling of 1000, Insurance of 400 and a bank
  transfer fee of 0 minor units in USD and send the invoice at
  2026-09-12T09:00:00Z
- **THEN** the invoice is `pending` with an order total of 105190 minor units
  in HKD and a payment deadline of 2026-09-19T09:00:00Z
- **AND** the delivery address, settlement currency and payment method are
  locked
- **AND** the order derives as Pending Payment

<!-- trace:scenario id=g10adm.auction-post-sale.SC-rrz rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-49 - No invoice is sent without a confirmed address
**Serves:** Quote and send - no invoice without a confirmed address

- **GIVEN** an auction order in Awaiting Setup
- **WHEN** an operator attempts to send its invoice
- **THEN** Grade10 refuses it
- **AND** the order is still Awaiting Setup

<!-- trace:scenario id=g10adm.auction-post-sale.SC-sjw rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-50 - Staff cannot send an invoice
**Serves:** Quote and send - the send needs payment-processing

- **GIVEN** an operator whose roles are exactly `staff`
- **WHEN** they open an auction order in Preparing Invoice
- **THEN** the send control is visible and disabled
- **AND** Grade10 refuses a send from them on the server

<!-- trace:scenario id=g10adm.auction-post-sale.SC-y6v rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-69 - The operator sees the fee before sending
**Serves:** Quote and send - the card fee read before send

- **GIVEN** an auction order in Preparing Invoice for card whose lines total a
  subtotal of 312000 minor units in HKD
- **AND** the HKD card rule in Payment Settings is 3.4 per cent and 235 minor units
- **WHEN** an operator holding payment-processing opens the send step
- **THEN** they read a payment processing fee of 11225 and an order total of
  323225 minor units in HKD

Scenario `grade10-admin-auction-post-sale-SC-70` keeps its title with its id.
The title is historical: a card invoice is refused when its currency has no
card rule.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-xd7 rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-70 - Unreadable provider fees refuse the send
**Serves:** Quote and send - a card invoice needs a card rule for its currency

- **GIVEN** an auction order in HKD in Preparing Invoice for card
- **AND** Payment Settings holds no HKD card rule
- **WHEN** an operator attempts to send its invoice
- **THEN** Grade10 refuses the send with `CARD_FEE_UNSET`
- **AND** the refusal says the HKD card fee is not set and points to Payment
  Settings
- **AND** no invoice is issued

<!-- trace:scenario id=g10adm.auction-post-sale.SC-guq rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-63 - An invoice sends without insurance
**Serves:** Quote and send - insurance is optional

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer with
  a winning bid of 10000 and a buyer's premium of 2000 minor units in USD
- **WHEN** an operator enters Shipping & Handling of 0 and a bank transfer fee
  of 0, adds no Insurance, and sends
- **THEN** the invoice is `pending` with an order total of 94200 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-xt3 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-68 - Insurance added at zero is refused
**Serves:** Quote and send - insurance is never zero once added

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator adds Insurance of 0 minor units and sends
- **THEN** Grade10 refuses the send
- **AND** no invoice is issued

<!-- trace:scenario id=g10adm.auction-post-sale.SC-75y rev=3 -->
#### Scenario: grade10-admin-auction-post-sale-SC-117 - The quote shows the winner's method
**Serves:** Quote and send - the winner's choice decides how the fee is priced

- **GIVEN** an auction order in Preparing Invoice whose winner chose bank
  transfer on the FPS rail
- **WHEN** an operator holding payment-processing opens the quote
- **THEN** the quote names bank transfer and the FPS rail
- **AND** asks for a bank transfer fee in USD instead of showing a fee computed
  from the card rule

<!-- trace:scenario id=g10adm.auction-post-sale.SC-0l6 rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-118 - A blank bank transfer fee refuses the send
**Serves:** Quote and send - the bank transfer fee is zero or more, with no cap

This scenario keeps its title with its id. The title is historical: a blank
bank transfer fee is now zero and sends as Free; only a fee that is not an
integer of zero or more refuses the send.

- **GIVEN** an auction order in Preparing Invoice for bank transfer
- **WHEN** an operator enters a bank transfer fee of -100 minor units and sends
- **THEN** Grade10 refuses the send
- **AND** no invoice is issued

<!-- trace:scenario id=g10adm.auction-post-sale.SC-miq rev=3 -->
#### Scenario: grade10-admin-auction-post-sale-SC-119 - A bank transfer fee has no cap and needs no provider fees
**Serves:** Quote and send - zero or more, with no cap

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer with
  lines that total a subtotal of 105300 minor units in HKD
- **WHEN** an operator enters a bank transfer fee of 50000 minor units in USD
  and sends
- **THEN** the invoice carries a bank transfer fee of 392500 minor units in HKD
- **AND** the invoice is `pending` with an order total of 497800 minor units
  in HKD


<!-- trace:scenario id=g10adm.auction-post-sale.SC-qv1 rev=3 -->
#### Scenario: post-sale-SC-155 - An invoice sends with tax
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer with
  USD lines that total 13400 minor units before Tax
- **WHEN** an operator adds Tax of 800 and a bank transfer fee of 0 minor units
  in USD and sends
- **THEN** the invoice is `pending` with Tax of 800 minor units in USD
- **AND** its Subtotal and order total are 111470 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-36t rev=1 -->
#### Scenario: post-sale-SC-156 - An invoice sends without tax
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator leaves Tax empty and sends an otherwise valid quote
- **THEN** the invoice is sent without Tax

<!-- trace:scenario id=g10adm.auction-post-sale.SC-g1u rev=1 -->
#### Scenario: post-sale-SC-157 - Tax added at zero is refused
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator adds Tax of 0 minor units and sends
- **THEN** Grade10 refuses the send
- **AND** no invoice is issued

<!-- trace:scenario id=g10adm.auction-post-sale.SC-lxd rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-243 - A USD order's quote converts nothing
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in USD in Preparing Invoice for bank transfer on
  HK Local with a winning bid of 250000 and a buyer's premium of 50000 minor
  units in USD
- **WHEN** an operator enters Shipping & Handling of 8000, Insurance of 4000
  and a bank transfer fee of 0 minor units in USD and sends
- **THEN** the invoice is `pending` with an order total of 312000 minor units
  in USD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-0op rev=4 -->
#### Scenario: grade10-admin-auction-post-sale-SC-253 - An internal bidder's order quotes USD and sends an HKD invoice on FPS
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an internal bidder's auction order in Preparing Invoice, flagged
  internal, with HKD settlement and bank transfer on FPS, for a USD lot whose
  winning bid is 10100 minor units and buyer's premium is 2020 minor units
- **WHEN** an operator holding payment-processing quotes Shipping & Handling
  of 1001 minor units and a bank transfer fee of 0, both in USD, then sends
- **THEN** the quote names bank transfer on FPS and reads an invoice total of
  103000 minor units in HKD
- **AND** the invoice is `pending` with its USD facts and HKD settlement lines
- **AND** the operator needed no currency or rail setup step before the send

<!-- trace:scenario id=g10adm.auction-post-sale.SC-b44 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-244 - The quote names the SWIFT rail
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in USD in Preparing Invoice whose winner chose
  bank transfer on the International via SWIFT rail
- **WHEN** an operator holding payment-processing opens the quote
- **THEN** the quote names bank transfer and International via SWIFT, and no
  other rail
- **AND** asks for a bank transfer fee in USD

### Requirement: The payment processing fee follows the invoice's payment method

The invoice's payment method decides where its payment processing fee comes
from.

**Card is computed** - A card invoice's fee SHALL be Grade10's own: the card
rule for the settlement currency, per `grade10-admin/auction/payment-settings`,
grossed up so Grade10 keeps the subtotal whole. Under HKD the subtotal is the
converted HKD Subtotal. The operator SHALL NOT enter or edit it. Grade10 SHALL compute it from the current subtotal each time the
quote or a reissue is opened, and fix it at send or reissue. The quote SHALL
show it read-only, with the rule it came from.

**No card rule refuses** - Where Payment Settings holds no card rule for the
settlement currency, a card invoice is neither sent nor reissued, per "An operator
quotes and sends the invoice". Grade10 SHALL NOT guess a fee.

**Bank transfer is typed** - A bank transfer invoice's fee SHALL be the
operator's own: an integer count of minor units of zero or more in USD, with no
upper limit. Under HKD it converts alone at the fixed rate, rounded up to the
next cent, and sits below the Subtotal. An empty field SHALL be zero, and a fee of zero reads Free to the winner.

**On a reissue** - The fee SHALL be editable only where the reissued invoice
is bank transfer, starting from the current invoice while the method stays
bank transfer. A switch to card SHALL price the fee from the card rule; a
switch to bank transfer SHALL start it empty, which reads zero.

**Never priced again** - A sent invoice SHALL keep its fee. A later change to
the card rule or to the premium minimum SHALL change no sent invoice; only a
reissue re-prices a card fee or lets the operator retype a bank transfer fee.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-qvj rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-167 - No card rule refuses the send
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in USD in Preparing Invoice for card
- **AND** Payment Settings holds no USD card rule
- **WHEN** an operator holding payment processing opens the quote and attempts
  to send
- **THEN** Grade10 refuses with `CARD_FEE_UNSET`
- **AND** the dialog says the USD card fee is not set and points to Payment
  Settings

<!-- trace:scenario id=g10adm.auction-post-sale.SC-omk rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-168 - Grade10 computes the card fee
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for card with a
  subtotal of 312000 minor units
- **AND** the HKD card rule is 3.4 per cent and 235 minor units
- **WHEN** an operator holding payment processing opens the quote and sends
- **THEN** the invoice is `pending` with a payment processing fee of 11225 and
  an order total of 323225 minor units in HKD
- **AND** the quote showed the fee read-only with the HKD card rule it came
  from

<!-- trace:scenario id=g10adm.auction-post-sale.SC-t9u rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-169 - The card fee tracks the subtotal until send
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for card with a
  subtotal of 312000 minor units, whose fee reads the computed 11225
- **AND** the HKD card rule is 3.4 per cent and 235 minor units
- **WHEN** an operator raises Shipping & Handling so the subtotal is 316000
  minor units
- **THEN** the fee reads 11366 and the order total 327366 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-hto rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-171 - A switch to bank transfer starts the fee empty
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose card invoice has a subtotal of
  312000 and a fee of 11225 minor units in HKD
- **WHEN** an operator reissues it and switches the method to bank transfer
- **THEN** the payment processing fee reads empty, which is zero
- **AND** the operator reads 323225 as the previous and 312000 minor units in
  HKD as the new order total

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ltc rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-172 - A reissue that keeps bank transfer keeps its typed fee
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in USD in Pending Payment whose bank transfer invoice has a
  subtotal of 312000 and a fee of 5000 minor units in USD
- **WHEN** an operator reissues it, raising Shipping & Handling so the subtotal
  is 316000 minor units, and keeps bank transfer
- **THEN** the payment processing fee still reads 5000 minor units in USD,
  editable by the operator

<!-- trace:scenario id=g10adm.auction-post-sale.SC-tj1 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-193 - A sent invoice keeps its fee when the card rule changes
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an order in Pending Payment whose card invoice carries a payment
  processing fee of 11225 minor units in HKD, computed from the HKD card rule
  of 3.4 per cent and 235 minor units
- **WHEN** an operator changes the HKD card rule to 3.9 per cent and 235 minor
  units
- **THEN** the invoice still carries the fee of 11225 minor units in HKD
- **AND** its order total is unchanged
