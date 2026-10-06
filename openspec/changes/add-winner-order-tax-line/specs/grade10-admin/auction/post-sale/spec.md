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
   payment method the winner chose, the winning bid, and the buyer's premium.
2. Enter Shipping & Handling for that address, an integer count of minor
   units of zero or more in the lot's currency.
3. Optionally add Insurance for that address, an integer count of minor units
   greater than zero in the lot's currency.
4. Optionally add Tax for the order, an integer count of minor units greater
   than zero in the lot's currency.
5. For bank transfer, enter the bank transfer fee: an integer count of minor
   units of zero or more in the lot's currency, with no upper limit. A fee of
   zero reads Free to the winner.
6. Read the subtotal, the payment processing fee, and the order total. For
   card, Grade10 computes the fee from the payment provider's current fees;
   for bank transfer, the fee is the amount entered in step 5.
7. Send the invoice.

On send Grade10 SHALL issue the invoice with invoice status `pending`, an
invoice reference, and the payment method, record Sent at, set the payment
deadline to 7 calendar days from Sent at, lock the delivery address and the
payment method, write a sent entry to the invoice log, and send the winner the
invoice-sent letter, per `grade10-site/auction/notifications-order`.

Grade10 SHALL refuse to send an invoice when the winner has confirmed no
delivery address, when Shipping & Handling is missing, when Insurance or Tax is
added at zero, when a bank transfer invoice's fee is blank or is not an
integer of zero or more, or when a card invoice's payment provider fees cannot
be read. The refusal for unreadable fees SHALL say so, and SHALL name no stored
fee in its place. A bank transfer invoice SHALL NOT need the provider's fees.
An operator without payment-processing SHALL see the send control visible and
disabled, and Grade10 SHALL refuse the same action on the server.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-7jg rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-48 - Sending the invoice opens the payment window
**Serves:** Quote and send - sending issues the invoice and starts the deadline

- **GIVEN** an auction order in Preparing Invoice for bank transfer with a
  winning bid of 250000 and a buyer's premium of 50000 minor units in HKD
- **AND** an operator holding payment-processing
- **WHEN** they enter Shipping & Handling of 8000, Insurance of 4000 and a bank
  transfer fee of 0 minor units in HKD and send the invoice at
  2026-09-12T09:00:00Z
- **THEN** the invoice is `pending` with an order total of 312000 minor units
  in HKD and a payment deadline of 2026-09-19T09:00:00Z
- **AND** the delivery address and payment method are locked
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

<!-- trace:scenario id=g10adm.auction-post-sale.SC-y6v rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-69 - The operator sees the fee before sending
**Serves:** Quote and send - the card fee read before send

- **GIVEN** an auction order in Preparing Invoice for card whose lines total a
  subtotal of 312000 minor units in HKD
- **AND** the payment provider reports fees for HKD of 235 minor units and 3.4 per cent
- **WHEN** an operator holding payment-processing opens the send step
- **THEN** they read a payment processing fee of 11225 and an order total of
  323225 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-xd7 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-70 - Unreadable provider fees refuse the send
**Serves:** Quote and send - a card invoice needs the provider's fees

- **GIVEN** an auction order in Preparing Invoice for card
- **AND** the payment provider's current fees cannot be read
- **WHEN** an operator attempts to send its invoice
- **THEN** Grade10 refuses the send and says the fees could not be read
- **AND** no invoice is issued

<!-- trace:scenario id=g10adm.auction-post-sale.SC-guq rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-63 - An invoice sends without insurance
**Serves:** Quote and send - insurance is optional

- **GIVEN** an auction order in Preparing Invoice for bank transfer with a
  winning bid of 250000 and a buyer's premium of 50000 minor units in HKD
- **WHEN** an operator enters Shipping & Handling of 0 and a bank transfer fee
  of 0, adds no Insurance, and sends
- **THEN** the invoice is `pending` with an order total of 300000 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-xt3 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-68 - Insurance added at zero is refused
**Serves:** Quote and send - insurance is never zero once added

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator adds Insurance of 0 minor units and sends
- **THEN** Grade10 refuses the send
- **AND** no invoice is issued

<!-- trace:scenario id=g10adm.auction-post-sale.SC-75y rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-117 - The quote shows the winner's method
**Serves:** Quote and send - the winner's choice decides how the fee is priced

- **GIVEN** an auction order in Preparing Invoice whose winner chose bank transfer
- **WHEN** an operator holding payment-processing opens the quote
- **THEN** the quote names bank transfer
- **AND** asks for a bank transfer fee instead of showing a provider-priced fee

<!-- trace:scenario id=g10adm.auction-post-sale.SC-0l6 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-118 - A blank bank transfer fee refuses the send
**Serves:** Quote and send - the bank transfer fee is required

- **GIVEN** an auction order in Preparing Invoice for bank transfer
- **WHEN** an operator leaves the bank transfer fee blank, or enters -100 minor units, and sends
- **THEN** Grade10 refuses the send
- **AND** no invoice is issued

<!-- trace:scenario id=g10adm.auction-post-sale.SC-miq rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-119 - A bank transfer fee has no cap and needs no provider fees
**Serves:** Quote and send - zero or more, with no cap

- **GIVEN** an auction order in Preparing Invoice for bank transfer with a subtotal of 312000 minor units in HKD
- **AND** the payment provider's current fees cannot be read
- **WHEN** an operator enters a bank transfer fee of 500000 minor units in HKD and sends
- **THEN** the invoice is `pending` with an order total of 812000 minor units in HKD


<!-- trace:scenario id=g10adm.auction-post-sale.SC-qv1 rev=1 -->
#### Scenario: post-sale-SC-155 - An invoice sends with tax
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in Preparing Invoice for bank transfer with lines
  totalling 312000 minor units in HKD before Tax
- **WHEN** an operator adds Tax of 6000 and a bank transfer fee of 0 minor units
  in HKD and sends
- **THEN** the invoice is `pending` with a Subtotal and order total of 318000
  minor units in HKD

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


### Requirement: An operator reissues a sent invoice

An operator changes a sent invoice by replacing it with a new one, with a
reason and at least one change.

**One Reissue action** - Reissue is the one way to change an invoice after it
is sent.

**Steps** - An operator holding payment-processing SHALL reissue an order
whose invoice is `pending` or `expired`:

1. Choose Reissue on the order.
2. Change what the winner asked for or the operator decided: delivery address,
   payment method, bank transfer fee, Shipping & Handling, Insurance, Tax. Each
   starts from the current invoice.
3. For bank transfer, read the bank transfer fee: prefilled from the current
   invoice when it was bank transfer, empty after a switch from card. It
   follows the quote's rules. For card, Grade10 prices the fee at send from the
   payment provider's current fees.
4. Choose the deadline: keep the current one, or a fresh 7 days from the
   moment the new invoice is sent. On an `expired` invoice only a fresh 7 days
   is offered.
5. Read the previous and the new order total.
6. Give a reason. The reason is mandatory.
7. Send the new invoice.

**At least one change** - Grade10 SHALL refuse a reissue that changes none of
the delivery address, payment method, bank transfer fee, Shipping & Handling,
Insurance, Tax or deadline. A new reason alone is not a change; a fresh 7 days is.

**On send** - On send Grade10 SHALL replace the current invoice with a new one
carrying a new invoice ID, bank reference and internal audit number, per
`grade10-site/auction/winner-order`, issue it as `pending` with the chosen
deadline, lock the address and method it carries, write a reissued entry to
the invoice log naming each part that changed, and send the winner the
invoice-reissued letter.

**Replaced invoice** - The replaced invoice SHALL hold no status of its own and
SHALL NOT be written `cancelled`.

**Payment method** - Only an operator SHALL change an invoice's payment method
after send.

**Not while checked or paid** - Reissue SHALL NOT be offered, and SHALL be
refused, on an invoice that is `payment_verifying` or `paid`.

**Same refusals as a first send** - Grade10 SHALL refuse a reissue under the
same conditions it refuses a first send.

**Card invoice paid by transfer** - A card invoice whose money arrived any
other way — bank transfer, cash or another method — SHALL be reissued as bank
transfer first, then settled manually at the new invoice's order total. Where
the money arrived at the subtotal, the operator enters a bank transfer fee of
0.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-5km rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-107 - A reissue keeps the deadline when the operator says so
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice totals 312000 minor units in HKD, with a bank transfer fee of 0 and a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator reissues it to a new address with Shipping & Handling 12000 and Insurance 4000 minor units in HKD, keeps the deadline, and sends with a reason
- **THEN** the new invoice's order total is 316000 minor units in HKD
- **AND** the payment deadline is still 2026-09-19T09:00:00Z
- **AND** the operator saw 312000 and 316000 minor units in HKD before sending

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

<!-- trace:scenario id=g10adm.auction-post-sale.SC-oss rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-110 - A switch from card leaves the bank transfer fee empty
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose card invoice has a subtotal of 312000 and a fee of 11225 minor units in HKD
- **WHEN** an operator reissues it and switches the method to bank transfer
- **THEN** the bank transfer fee is empty
- **AND** Grade10 refuses to send until a fee is entered
- **AND** with a fee of 3000 entered, the new invoice is bank transfer at 315000 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-7fn rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-111 - The bank transfer fee starts from the current invoice
**Serves:** Resolving an unpaid order - the bank transfer fee starts from the previous invoice

- **GIVEN** an order whose bank transfer invoice carries a bank transfer fee of 5000 minor units in HKD
- **WHEN** an operator opens Reissue on it
- **THEN** the bank transfer fee reads 5000 minor units in HKD

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

<!-- trace:scenario id=g10adm.auction-post-sale.SC-e28 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-125 - A switch to card prices the fee at send
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice has a subtotal of 312000 and a bank transfer fee of 0 minor units in HKD
- **AND** the payment provider reports fees for HKD of 235 minor units and 3.4 per cent
- **WHEN** an operator reissues it as card with a reason and sends
- **THEN** the new invoice is card with a payment processing fee of 11225 and an order total of 323225 minor units in HKD
- **AND** the operator entered no fee

<!-- trace:scenario id=g10adm.auction-post-sale.SC-vme rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-126 - Unreadable provider fees refuse a card reissue
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **AND** the payment provider's current fees cannot be read
- **WHEN** an operator reissues it as card with a reason and sends
- **THEN** Grade10 refuses the reissue and says the fees could not be read
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


<!-- trace:scenario id=g10adm.auction-post-sale.SC-qtj rev=1 -->
#### Scenario: post-sale-SC-158 - A reissue changes tax
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice has no Tax
- **WHEN** an operator reissues it with Tax of 6000 minor units in HKD and a
  reason, changing nothing else
- **THEN** the new invoice includes Tax of 6000 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-kdq rev=1 -->
#### Scenario: post-sale-SC-210 - A reissue removes tax
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice includes Tax of 6000
  minor units in HKD
- **WHEN** an operator reissues it removing Tax and giving a reason, changing
  nothing else
- **THEN** Grade10 accepts it as a change
- **AND** the new invoice has no Tax line
- **AND** its Subtotal is 6000 minor units lower than the replaced invoice's
