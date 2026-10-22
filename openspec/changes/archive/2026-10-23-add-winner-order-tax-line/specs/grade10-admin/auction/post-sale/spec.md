# Post-Sale — delta

## Feature set

- Tax on the quote
  - Optional amount: empty means no Tax; an added amount is above zero
  - Send: Tax becomes an invoice line and part of the Subtotal
  - Reissue: Tax can be added, changed, or removed with the other quoted amounts
- Resolving an unpaid order
  - One Reissue action: address, payment method, bank transfer fee, shipping, insurance, tax and deadline, always with a reason and at least one change

## MODIFIED Requirements

### Requirement: An operator quotes and sends the invoice

An operator holding payment-processing SHALL prepare and send the invoice for
an auction order in Preparing Invoice:

1. Open the order and read the winner's confirmed delivery address, the
   settlement currency, the payment method the winner chose and, for bank
   transfer, its rail, the winning bid, and the buyer's premium.
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
delivery address, when the order holds no settlement currency, or no rail for
a bank transfer (an internal bidder's order reads its lot's USD and is sent
as `grade10-admin/auction/internal-bid` states, with no currency or rail step), when
Shipping & Handling is missing, when Insurance or Tax is
added at zero, when a bank transfer invoice's fee is not an
integer of zero or more, when Payment Settings holds no card rule for a card
invoice's settlement currency (`CARD_FEE_UNSET`), or when the order total the send
carries differs from the one Grade10 prices on receipt (`QUOTE_CHANGED`). The
`CARD_FEE_UNSET` refusal SHALL say the card fee for that currency is not set
and point to Payment Settings. No send SHALL need the payment provider.
An operator without payment-processing SHALL see the send control visible and
disabled, and Grade10 SHALL refuse the same action on the server.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-7jg rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-48 - Sending the invoice opens the payment window
**Serves:** Quote and send - sending issues the invoice and starts the deadline

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer on
  FPS with a winning bid of 10000 and a buyer's premium of 2000 minor units in
  USD
- **AND** an operator holding payment-processing
- **WHEN** they enter Shipping & Handling of 1000, Insurance of 400 and a bank
  transfer fee of 0 minor units in USD and send the invoice at
  2026-09-12T09:00:00Z
- **THEN** the invoice is `pending` with an order total of 105300 minor units
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


<!-- trace:scenario id=g10adm.auction-post-sale.SC-qv1 rev=2 -->
#### Scenario: post-sale-SC-155 - An invoice sends with tax
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer with
  lines that total 105300 minor units in HKD before Tax
- **WHEN** an operator adds Tax of 800 and a bank transfer fee of 0 minor units
  in USD and sends
- **THEN** the invoice is `pending` with Tax of 6300 minor units in HKD
- **AND** its Subtotal and order total are 111600 minor units in HKD

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

<!-- trace:scenario id=g10adm.auction-post-sale.SC-0op rev=3 -->
#### Scenario: grade10-admin-auction-post-sale-SC-253 - An internal bidder's order quotes USD and sends an HKD invoice on FPS
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an internal bidder's auction order in Preparing Invoice, flagged
  internal, with HKD settlement and bank transfer on FPS, for a USD lot whose
  winning bid is 10100 minor units and buyer's premium is 2020 minor units
- **WHEN** an operator holding payment-processing quotes Shipping & Handling
  of 1001 minor units and a bank transfer fee of 0, both in USD, then sends
- **THEN** the quote names bank transfer on FPS and reads an invoice total of
  103100 minor units in HKD
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

### Requirement: An operator reissues a sent invoice

An operator changes a sent invoice by replacing it with a new one, with a
reason and at least one change.

**One Reissue action** - Reissue is the one way to change an invoice after it
is sent.

**Steps** - An operator holding payment-processing SHALL reissue an order
whose invoice is `pending` or `expired`:

1. Choose Reissue on the order.
2. Change what the winner asked for or the operator decided: delivery address,
   settlement currency, payment method or rail, bank transfer fee, Shipping &
   Handling, Insurance, Tax. Each starts from the current invoice.
3. For bank transfer, read the bank transfer fee: prefilled from the current
   invoice when it was bank transfer, empty after a switch from card. It is
   typed in USD and follows the quote's rules. For card, Grade10 computes the
   fee from the card rule for the settlement currency, as on the quote, and
   fixes it at send.
4. Choose the deadline: keep the current one, or a fresh 7 days from the
   moment the new invoice is sent. On an `expired` invoice only a fresh 7 days
   is offered.
5. Read the previous and the new order total.
6. Give a reason. The reason is mandatory.
7. Send the new invoice.

**At least one change** - Grade10 SHALL refuse a reissue that changes none of
the delivery address, settlement currency, payment method, bank transfer fee,
Shipping & Handling, Insurance, Tax or deadline. A new reason alone is not a
change; a fresh 7 days is. A change from one offered bank rail to another is a
payment-method change, even when both choices are bank transfer.

**On send** - On send Grade10 SHALL replace the current invoice with a new one
carrying a new invoice ID, bank reference and internal audit number, per
`grade10-site/auction/winner-order`, issue it as `pending` with the chosen
deadline, lock the address and method it carries, write a reissued entry to
the invoice log naming each part that changed, and send the winner the
payment reminder letter, per `grade10-site/auction/notifications-order`.

**Replaced invoice** - The replaced invoice SHALL hold no status of its own and
SHALL NOT be written `cancelled`.

**Payment method** - Only an operator SHALL change an invoice's payment method
or its settlement currency after send.

**Settlement currency** - An operator MAY change the order's settlement
currency, USD or HKD, on a reissue. The new invoice SHALL carry the new
currency, with every line priced from the order's USD amounts, per
`grade10-site/auction/winner-order`, and the replaced invoice SHALL keep its own
currency and amounts. The method and rail the new invoice carries SHALL be ones
the new currency offers, and Grade10 SHALL refuse a reissue that keeps one it
does not.

**Not while checked or paid** - Reissue SHALL NOT be offered, and SHALL be
refused, on an invoice that is `payment_verifying` or `paid`.

**Same refusals as a first send** - Grade10 SHALL refuse a reissue under the
same conditions it refuses a first send.

**Card invoice paid by transfer** - A card invoice whose money arrived any
other way — bank transfer, cash or another method — SHALL be reissued as bank
transfer first, then settled manually at the new invoice's order total. Where
the money arrived at the subtotal, the operator enters a bank transfer fee of
0.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-5km rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-107 - A reissue keeps the deadline when the operator says so
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in USD in Pending Payment whose bank transfer invoice totals 312000 minor units in USD, with a bank transfer fee of 0 and a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator reissues it to a new address with Shipping & Handling 12000 and Insurance 4000 minor units in USD, keeps the deadline, and sends with a reason
- **THEN** the new invoice's order total is 316000 minor units in USD
- **AND** the payment deadline is still 2026-09-19T09:00:00Z
- **AND** the operator saw 312000 and 316000 minor units in USD before sending

<!-- trace:scenario id=g10adm.auction-post-sale.SC-dmi rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-108 - A reissue restarts the deadline when the operator says so
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment with a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator reissues it, chooses a fresh 7 days, and sends at 2026-09-15T10:00:00Z with a reason
- **THEN** the payment deadline is 2026-09-22T10:00:00Z

<!-- trace:scenario id=g10adm.auction-post-sale.SC-vsz rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-109 - A reissue without a reason is refused
**Serves:** Resolving an unpaid order - always with a reason

- **GIVEN** an order in Pending Payment
- **WHEN** an operator attempts to send a reissue without a reason
- **THEN** Grade10 refuses it
- **AND** the current invoice, its amount, and its deadline are unchanged

<!-- trace:scenario id=g10adm.auction-post-sale.SC-oss rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-110 - A switch from card leaves the bank transfer fee empty
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in USD in Pending Payment whose card invoice has a subtotal of 312000 and a fee of 11225 minor units in USD
- **WHEN** an operator reissues it and switches the method to bank transfer on HK Local
- **THEN** the bank transfer fee is empty
- **AND** Grade10 refuses to send until a fee is entered
- **AND** with a fee of 3000 entered, the new invoice is bank transfer at 315000 minor units in USD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-7fn rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-111 - The bank transfer fee starts from the current invoice
**Serves:** Resolving an unpaid order - the bank transfer fee starts from the previous invoice

- **GIVEN** an order in USD whose bank transfer invoice carries a bank transfer fee of 5000 minor units in USD
- **WHEN** an operator opens Reissue on it
- **THEN** the bank transfer fee reads 5000 minor units in USD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-o4m rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-112 - An expired invoice is reissued with a fresh deadline
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order whose invoice is `expired`
- **WHEN** an operator opens Reissue, then sends it at 2026-09-25T09:00:00Z with a reason
- **THEN** keeping the current deadline is not offered
- **AND** the new invoice is `pending` with a deadline of 2026-10-02T09:00:00Z
- **AND** the order derives as Pending Payment

<!-- trace:scenario id=g10adm.auction-post-sale.SC-b9o rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-113 - No reissue while proof is checked or after payment
**Serves:** Resolving an unpaid order - reissue only on a pending or expired invoice

- **GIVEN** one order whose invoice is `payment_verifying` and one whose invoice is `paid`
- **WHEN** an operator opens each
- **THEN** neither offers Reissue
- **AND** Grade10 refuses a reissue attempted on either

<!-- trace:scenario id=g10adm.auction-post-sale.SC-5sm rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-114 - A card invoice paid by transfer is reissued, then settled
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order whose card invoice has a subtotal of 312000 and a fee of 11225 minor units in HKD, and whose winner transferred 312000 minor units in HKD
- **WHEN** an operator reissues it as bank transfer with a bank transfer fee of 0 and a reason, then settles it manually by bank transfer with a reference and proof
- **THEN** the invoice is `paid` at 312000 minor units in HKD
- **AND** the replaced card invoice holds no status and is not `cancelled`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-2fi rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-115 - A replaced invoice is not cancelled
**Serves:** Resolving an unpaid order - one Reissue action

- **GIVEN** an order in Pending Payment
- **WHEN** an operator reissues its invoice with a reason
- **THEN** the order's invoice status is the new invoice's, `pending`
- **AND** the order does not derive as Cancelled and the lot is not returned to available

<!-- trace:scenario id=g10adm.auction-post-sale.SC-e28 rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-125 - A switch to card prices the fee at send
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice has a subtotal of 312000 and a bank transfer fee of 0 minor units in HKD
- **AND** the HKD card rule in Payment Settings is 3.4 per cent and 235 minor units
- **WHEN** an operator reissues it as card with a reason and sends
- **THEN** the new invoice is card with a payment processing fee of 11225 and an order total of 323225 minor units in HKD
- **AND** the operator entered no fee

Scenario `grade10-admin-auction-post-sale-SC-126` keeps its title with its id.
The title is historical: a card reissue is refused when the currency has no
card rule.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-vme rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-126 - Unreadable provider fees refuse a card reissue
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an HKD order in Pending Payment whose invoice is bank transfer
- **AND** Payment Settings holds no HKD card rule
- **WHEN** an operator reissues it as card with a reason and sends
- **THEN** Grade10 refuses the reissue with `CARD_FEE_UNSET`
- **AND** the refusal says the HKD card fee is not set and points to Payment
  Settings
- **AND** the current invoice is unchanged

<!-- trace:scenario id=g10adm.auction-post-sale.SC-cu3 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-133 - A reissue that changes only the reason is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice `INV-202609-LK7P2Q-01` has a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator opens Reissue, keeps the deadline, changes nothing else, and sends with a reason
- **THEN** Grade10 refuses it as changing nothing
- **AND** the current invoice is still `INV-202609-LK7P2Q-01`, at the same amount and deadline

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ysk rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-134 - A fresh deadline alone is a change
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice has a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator reissues it changing only the deadline to a fresh 7 days, and sends at 2026-09-15T10:00:00Z with a reason
- **THEN** the new invoice is `pending` with a payment deadline of 2026-09-22T10:00:00Z
- **AND** the reissued entry names the deadline as the only changed part


<!-- trace:scenario id=g10adm.auction-post-sale.SC-qtj rev=2 -->
#### Scenario: post-sale-SC-158 - A reissue changes tax
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in USD in Pending Payment whose invoice has no Tax
- **WHEN** an operator reissues it with Tax of 6000 minor units in USD and a
  reason, changing nothing else
- **THEN** the new invoice includes Tax of 6000 minor units in USD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-kdq rev=2 -->
#### Scenario: post-sale-SC-210 - A reissue removes tax
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in USD in Pending Payment whose invoice includes Tax of
  6000 minor units in USD
- **WHEN** an operator reissues it removing Tax and giving a reason, changing
  nothing else
- **THEN** Grade10 accepts it as a change
- **AND** the new invoice has no Tax line
- **AND** its Subtotal is 6000 minor units lower than the replaced invoice's

<!-- trace:scenario id=g10adm.auction-post-sale.SC-2g5 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-245 - A reissue changes the settlement currency
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice on HK Local
  is in HKD with a Winning Bid of 78500 minor units
- **WHEN** an operator reissues it in USD, keeping HK Local, with a reason and
  nothing else changed
- **THEN** the new invoice is in USD with a Winning Bid of 10000 minor units
- **AND** the replaced invoice still reads 78500 minor units in HKD
- **AND** the reissued entry names the settlement currency as a changed part

<!-- trace:scenario id=g10adm.auction-post-sale.SC-4va rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-246 - A reissue that keeps a rail the new currency does not offer is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice is in HKD
  on FPS
- **WHEN** an operator reissues it in USD, keeping FPS, with a reason
- **THEN** Grade10 refuses the reissue
- **AND** the current invoice is unchanged

<!-- trace:scenario id=g10adm.auction-post-sale.SC-r31 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-254 - A rail-only change from FPS to HK Local is a reissue change
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an order in Pending Payment whose HKD bank transfer invoice uses
  FPS, and both FPS and HK Local details are configured for HKD
- **WHEN** an operator reissues it on HK Local with the same currency, fee,
  quote, address and deadline, and gives a reason
- **THEN** Grade10 accepts the reissue because the bank rail changed
- **AND** the new invoice snapshots HK Local details and the replaced invoice
  keeps its FPS details unchanged
- **AND** the reissued entry names the bank rail as a changed part

<!-- trace:scenario id=g10adm.auction-post-sale.SC-r32 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-255 - A rail-only change from HK Local to SWIFT is a reissue change
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an order in Pending Payment whose USD bank transfer invoice uses
  HK Local, and both HK Local and SWIFT details are configured for USD
- **WHEN** an operator reissues it on International via SWIFT with the same
  currency, fee, quote, address and deadline, and gives a reason
- **THEN** Grade10 accepts the reissue because the bank rail changed
- **AND** the new invoice snapshots SWIFT details and the replaced invoice
  keeps its HK Local details unchanged
- **AND** the reissued entry names the bank rail as a changed part
