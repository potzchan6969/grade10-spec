# grade10-admin/auction/post-sale Specification

## Purpose
Post-sale operators can see, complete and protect the billing address needed
before a winner's invoice is sent.

## Feature set

- Quote and send
  - Quote in USD: the operator types every amount, the bank transfer fee included, in USD, and Grade10 converts it to the settlement currency picked
  - Reissue choice: a changed settlement currency or payment choice, including a bank rail, counts as the required change
  - Rail picked: the quote names the payment rail recorded on the order, not one bank transfer
- Setup
  - Reopen setup: an operator gives a winner in Setup Overdue a fresh 48 hours, with a reason, or records the setup themselves, never after the invoice is sent
  - Telephone record: delivery and billing addresses, settlement currency and payment choice are required when the operator records the winner's setup

## ADDED Requirements

### Requirement: The quote is typed in USD and read in the settlement currency

An operator SHALL type every amount of the quote in USD, the bid currency,
whichever settlement currency the order carries: Shipping & Handling,
Insurance, Tax and the bank transfer fee. The winning bid and the buyer's
premium are USD facts of the order.

**HKD order** - Grade10 SHALL convert each USD line to HKD, per
`grade10-site/auction/winner-order`, "An HKD order converts each USD line at a
fixed rate and rounds it up". The operator SHALL read the subtotal, the
payment processing fee and the order total in HKD, the amount the invoice asks
for, and the quote SHALL show no rate.

**USD order** - Grade10 SHALL convert nothing and the quote SHALL read in USD.

**The rail is named** - The quote SHALL name the payment method the winner
chose and, for bank transfer, the rail: FPS, HK Local or International via
SWIFT.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-8ko rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-251 - An HKD order's quote reads the converted total
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer on
  HK Local with a winning bid of 10100 and a buyer's premium of 2020 minor
  units in USD
- **WHEN** an operator enters Shipping & Handling of 1001 and a bank transfer
  fee of 0 minor units in USD
- **THEN** the quote reads an order total of 103100 minor units in HKD
- **AND** no conversion rate shows on the quote

<!-- trace:scenario id=g10adm.auction-post-sale.SC-c0y rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-252 - A line is typed in USD on an HKD order
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer
- **WHEN** an operator types Shipping & Handling as `10.01`
- **THEN** Grade10 stores 1001 minor units in USD for that line
- **AND** the invoice sent carries that line as 7900 minor units in HKD

## MODIFIED Requirements

### Requirement: The order detail explains its status

Each auction order has its own page, which leads with what to do next.

**Own address** - Each order SHALL open at its own address, which a reload or
a shared link opens again.

**Header** - The page SHALL lead with the derived order status; a Test badge
when the order is on a sandbox lot; one sentence naming the rule that produced
the status; how long the order has waited in it, per "The order detail shows
how long an order has waited"; and the primary action the table names for
that status.

| Status | Primary action |
| --- | --- |
| Awaiting Setup | None |
| Setup Overdue | Reopen setup |
| Preparing Invoice | Send invoice |
| Pending Payment | None |
| Payment Overdue | Reissue |
| Payment Verifying | Check proof |
| Partially Paid | Record payment |
| Preparing Shipment | Dispatch |
| Shipped | Confirm delivery |
| Delivered, Cancelled, Refunded | None |

**More** - Every other action that applies to the order now SHALL sit under
More, and nothing else. With no such action, the page SHALL show no More.

**What else it shows** - The page SHALL also show the order total, what is
paid, and the payment deadline with a countdown or an elapsed indicator; the
payment method; the reissue count for this order and the winner's reissue
history across all of their orders; each invoice the order has held, a
replaced one marked Replaced beside the invoice that replaced it; each
payment with its receipt; each proof file, which opens from the page; the
winner, their account suspension state and its reason; the setup they
confirmed; the shipment; and a link to the source lot and its bid history.

**One timeline** - The invoice log, the fulfilment log and comments SHALL read
as one timeline, oldest first, each entry marked with its kind. An operator
who can open the order SHALL be able to leave a comment of 1 to 2,000
characters. Grade10 SHALL refuse an empty comment, and SHALL NOT let a comment
be edited or deleted once recorded.

**Reading** - An operator who can open the order SHALL read it, open its proof
files and comment on it without payment processing, shipment processing or
refund processing. The page SHALL offer no control that changes who won.

**Actions in dialogs** - Each action SHALL open its own dialog that restates
what will happen before the operator confirms. A refusal SHALL show as a
sentence in that dialog, which stays open with what the operator entered.

**Money in major units** - An operator SHALL type money in the major units of
the currency the field names, `50.00` for US$50.00, and Grade10 SHALL store the
matching count of minor units. The lines of a quote are typed in USD, per "The
quote is typed in USD and read in the settlement currency". An amount received,
paid or refunded is typed in the order's settlement currency.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-i7j rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-37 - The detail explains the status it derived
**Serves:** Queue - the detail explains the status it derived

- **GIVEN** an auction order whose invoice is `expired` two days after its
  payment deadline
- **AND** an operator holding payment processing
- **WHEN** they open it
- **THEN** the order status shows as Payment Overdue
- **AND** the page names the rule that produced it - an invoice whose payment
  deadline passed two days ago unpaid - rather than the label alone
- **AND** Reissue is its primary action

<!-- trace:scenario id=g10adm.auction-post-sale.SC-seg rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-38 - A buyer's reissue history spans all their orders
**Serves:** Queue - a buyer's reissue history spans all their orders

- **GIVEN** a buyer with reissues on three different auction orders
- **WHEN** an operator opens any one of those orders
- **THEN** the detail shows that buyer's reissue history across all three
- **AND** the reissue count for the order in front of them

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ydn rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-162 - An order opens at its own address
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** an operator on an order's page
- **WHEN** they reload it, and a colleague opens its link
- **THEN** both open the same order

<!-- trace:scenario id=g10adm.auction-post-sale.SC-bcb rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-163 - Comments share the timeline
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** an order whose invoice was sent and then paid by card
- **AND** an operator who holds neither payment processing nor shipment
  processing
- **WHEN** they leave a comment, then try to leave an empty one
- **THEN** the timeline shows the sent entry, the paid entry and the comment
  with that operator and its time, oldest first
- **AND** the empty comment is refused

<!-- trace:scenario id=g10adm.auction-post-sale.SC-d8k rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-164 - A refusal keeps the dialog open
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** an operator holding payment processing in the send dialog of an
  order in Preparing Invoice, with Insurance of 40.00 entered and Shipping &
  Handling left blank
- **WHEN** they confirm the send
- **THEN** the dialog stays open with Insurance still 40.00
- **AND** it says in a sentence that Shipping & Handling is needed
- **AND** no invoice is sent

<!-- trace:scenario id=g10adm.auction-post-sale.SC-lc8 rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-165 - Money is typed in major units
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** an order in USD in Preparing Invoice
- **WHEN** an operator types Shipping & Handling as `80.00` and sends
- **THEN** the invoice carries Shipping & Handling of 8000 minor units in USD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-f7t rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-184 - More holds only what applies now
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** a Preparing Shipment order and a Cancelled order, neither flagged
- **AND** an operator holding payment, shipment and refund processing
- **WHEN** they open each
- **THEN** the Preparing Shipment order offers Dispatch as its primary action and
  Refund alone under More
- **AND** the Cancelled order offers no primary action and no More

<!-- trace:scenario id=g10adm.auction-post-sale.SC-59i rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-185 - An order on a sandbox lot reads Test
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** one order on a sandbox lot and one on an ordinary lot
- **WHEN** an operator opens each
- **THEN** the first shows a Test badge beside its status
- **AND** the second shows none

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

### Requirement: An operator edits the address or method before send

Before the invoice is sent, an operator changes the delivery address, the
settlement currency or the payment method for the winner, with a reason.

**Edit before send** - Once the winner confirms, only an operator changes the
order's delivery address, settlement currency or payment method before the
invoice is sent, per `grade10-site/auction/winner-order`. An operator holding
payment-processing SHALL be able to do so on an auction order in Preparing
Invoice, on the winner's request:

1. Open the order and read the address, settlement currency, method and rail
   the winner confirmed.
2. Enter a new delivery address, choose the other settlement currency, choose
   another payment method or rail, or any of them.
3. Enter a reason. It is required.
4. Commit.

| Rule | Value |
| --- | --- |
| Order status after the edit | Preparing Invoice |
| Changes allowed | Delivery address, settlement currency, payment method or rail, or any of them. At least one SHALL differ from what the order holds |
| Method after the edit | One the settlement currency after the edit offers, per `grade10-site/auction/winner-order`. A currency change that leaves the held method unoffered SHALL name another in the same edit |
| Bank transfer | A rail the settlement currency offers and where Grade10 holds that rail's bank details; refused otherwise |
| Card | Refused where Payment Settings holds no card fee rule for the settlement currency |
| Invoice log entry | Order edited before send: the named operator, the reason, each part that changed, and its value before and after |
| Preparing Invoice waiting time | Unchanged. It counts from the winner's confirmation, per "The order detail shows how long an order has waited" |

**After the edit** - The order SHALL hold the new address as its snapshot and
the new settlement currency, method and rail, and Winner Order SHALL show
them.

**Refused** - Grade10 SHALL refuse an edit with no reason, and an edit that
changes nothing.

**After send** - The edit SHALL NOT be offered once the invoice is sent; a
change after send is a reissue, per "An operator reissues a sent invoice".

**Without payment-processing** - An operator without payment-processing SHALL
see the edit control visible and disabled, and Grade10 SHALL refuse the same
action on the server.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ys6 rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-135 - An edit before send is recorded with its reason
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order in HKD in Preparing Invoice whose winner confirmed the home address and card
- **AND** an operator holding payment-processing
- **WHEN** they change the address to the work address and the method to bank transfer on FPS, with the reason "Winner asked by email"
- **THEN** the order holds the work address and bank transfer on FPS
- **AND** the order is still Preparing Invoice
- **AND** the invoice log shows an order edited before send entry naming the operator, the reason, and the address and method before and after

<!-- trace:scenario id=g10adm.auction-post-sale.SC-13r rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-136 - An edit without a reason is refused
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator holding payment-processing commits a new address with the reason empty
- **THEN** Grade10 refuses it
- **AND** the order keeps the address the winner confirmed

<!-- trace:scenario id=g10adm.auction-post-sale.SC-7b2 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-137 - Staff cannot edit before send
**Serves:** Quote and send - edit before send

- **GIVEN** an operator whose roles are exactly `staff`
- **WHEN** they open an auction order in Preparing Invoice
- **THEN** the edit control is visible and disabled
- **AND** Grade10 refuses an edit from them on the server

<!-- trace:scenario id=g10adm.auction-post-sale.SC-j60 rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-138 - A USD order cannot be edited to bank transfer
**Serves:** Quote and send - edit before send

This scenario keeps its title with its id. The title is historical: a USD order
may be edited to bank transfer on HK Local or International via SWIFT, and is
refused only a rail USD does not offer.

- **GIVEN** an auction order in USD in Preparing Invoice whose winner confirmed card
- **WHEN** an operator holding payment-processing changes the method to bank transfer on FPS with a reason
- **THEN** Grade10 refuses it
- **AND** the order still holds card

<!-- trace:scenario id=g10adm.auction-post-sale.SC-htz rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-139 - An edit does not reset the waiting time
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order whose winner confirmed an address at 2026-09-12T09:00:00Z
- **WHEN** an operator edits its address with a reason at 2026-09-14T09:00:00Z
- **AND** an operator opens the order at 2026-09-15T09:00:00Z
- **THEN** the page shows it has waited 72 hours since the winner's confirmation
- **AND** it reads Preparing Invoice with no Overdue mark

<!-- trace:scenario id=g10adm.auction-post-sale.SC-pp0 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-247 - An operator changes the settlement currency before send
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order in HKD in Preparing Invoice whose winner confirmed
  bank transfer on HK Local
- **AND** an operator holding payment-processing
- **WHEN** they change the settlement currency to USD with the reason "Winner
  picked the wrong currency"
- **THEN** the order holds USD and bank transfer on HK Local, and is still
  Preparing Invoice
- **AND** the invoice log shows an order edited before send entry naming
  settlement currency as a changed part, HKD before and USD after

<!-- trace:scenario id=g10adm.auction-post-sale.SC-xsv rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-248 - A currency change that leaves the method unoffered is refused
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order in USD in Preparing Invoice whose winner confirmed
  bank transfer on International via SWIFT
- **WHEN** an operator holding payment-processing changes the settlement
  currency to HKD with a reason and names no other method
- **THEN** Grade10 refuses it
- **AND** the order still holds USD and International via SWIFT

<!-- trace:scenario id=g10adm.auction-post-sale.SC-0ew rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-249 - A USD order is edited to SWIFT
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order in USD in Preparing Invoice whose winner confirmed
  card, where Grade10 holds SWIFT bank details
- **WHEN** an operator holding payment-processing changes the method to bank
  transfer on International via SWIFT with a reason
- **THEN** the order holds bank transfer on International via SWIFT
- **AND** the order is still Preparing Invoice

### Requirement: The payment processing fee follows the invoice's payment method

The invoice's payment method decides where its payment processing fee comes
from.

**Card is computed** - A card invoice's fee SHALL be Grade10's own: the card
rule for the settlement currency, per `grade10-admin/auction/payment-settings`,
grossed up so Grade10 keeps the subtotal whole. The operator SHALL NOT enter
or edit it. Grade10 SHALL compute it from the current subtotal each time the
quote or a reissue is opened, and fix it at send or reissue. The quote SHALL
show it read-only, with the rule it came from.

**No card rule refuses** - Where Payment Settings holds no card rule for the
settlement currency, a card invoice is neither sent nor reissued, per "An operator
quotes and sends the invoice". Grade10 SHALL NOT guess a fee.

**Bank transfer is typed** - A bank transfer invoice's fee SHALL be the
operator's own: an integer count of minor units of zero or more in USD, with no
upper limit, which converts with the other lines under HKD. An empty field
SHALL be zero, and a fee of zero reads Free to the winner.

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

### Requirement: A send or reissue carries the total the operator read

What the operator read is what the winner is sent.

**The total read** - A send and a reissue SHALL carry the order total the
operator read. Grade10 SHALL price the invoice again from the same inputs when
it receives it, and SHALL refuse it when its order total differs from the one
carried.

**After a refusal** - The dialog SHALL show the order total the operator read
and the new one, and keep every amount the operator entered, so they read the
new total before they send again.

**The deadline** - Before the operator sends, the dialog SHALL show, to the
minute and in Hong Kong time, the payment deadline the send will set: 7
calendar days from the moment of send, or the current deadline on a reissue
that keeps it.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-hgh rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-170 - A total that changed since it was read refuses the send
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in USD in Preparing Invoice for bank transfer with
  a winning bid of 250000, a buyer's premium of 50000, Shipping & Handling of
  8000, Insurance of 4000 and a payment processing fee of 0 minor units, which
  an operator reads as an order total of 312000 minor units
- **AND** the premium minimum is then raised to 60000 minor units in USD
- **WHEN** the operator sends the invoice
- **THEN** Grade10 refuses the send, and the dialog shows 312000 as the total
  read and 322000 minor units in USD as the new one
- **AND** Shipping & Handling and Insurance still read 8000 and 4000
- **AND** no invoice is issued

<!-- trace:scenario id=g10adm.auction-post-sale.SC-gks rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-194 - The dialog shows the deadline the send sets
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator reads its send dialog at 2026-09-12T09:00:00Z and sends
  it then
- **THEN** the dialog showed a payment deadline of 2026-09-19T09:00:00Z, to the
  minute, in Hong Kong time
- **AND** the invoice carries that deadline

### Requirement: An operator reopens the address form

An operator holding payment-processing SHALL be able to reopen setup, the
address form, on an auction order in Setup Overdue whose address deadline has
passed. Reopen setup is that status's primary action, per "The order detail
explains its status":

1. Open the order and read when its address deadline passed and how many times
   the address form has already been reopened.
2. Give a reason. The reason is mandatory.
3. Commit.

On commit Grade10 SHALL set the order's address deadline to 48
hours from the moment of the reopen, per
`grade10-site/auction/winner-order`, and SHALL write a reopened entry to the
invoice log carrying the named operator, the timestamp and the reason.

A reopen SHALL write no status directly. Its reopened facts SHALL derive
Awaiting Setup. Its invoice status SHALL stay `not_issued`, and no order SHALL
be suspended or cancelled by it. Grade10 SHALL place no limit on how many times
one order's address form is reopened.

Grade10 SHALL refuse a reopen when the reason is missing, when the order's
address deadline has not passed, when the order already has a confirmed address,
when the order's invoice has been sent, since setup was already confirmed
before the send, and when the order's invoice status is `cancelled`, since cancellation has
already returned the lot to available stock. An operator without
payment-processing SHALL see the reopen control visible and disabled, and
Grade10 SHALL refuse the same action on the server.

An operator holding payment-processing SHALL also be able to record setup,
the delivery address, billing address, settlement currency and payment method
or rail the winner would confirm, without reopening the address form, only for an unconfirmed Setup
Overdue order whose invoice status is `not_issued`, so a winner who gives their
setup by telephone is quoted in one step. The reason is mandatory. Recording
setup SHALL NOT reopen the window and SHALL NOT let the winner write again.
Grade10 SHALL refuse it without a reason, after address confirmation, after
invoice send and on a cancelled order. Grade10
SHALL write an address-recorded invoice-log entry carrying the named operator,
timestamp and reason. An operator without payment-processing SHALL see the
record control visible and disabled, and Grade10 SHALL refuse the same action
on the server.

**A currency and a method it offers** - Grade10 SHALL refuse a record that
names no settlement currency, and SHALL refuse to record a payment method the
settlement currency does not offer, per `grade10-site/auction/winner-order`:
card where Payment Settings holds no card fee rule for the currency, and a bank
rail the currency does not offer or where Grade10 holds no bank details for
that rail. A reopen in a currency that offers neither method SHALL still be
allowed, and the winner then reads that payment is not yet available, with
Contact Us, per `grade10-site/auction/winner-order`.

**One order at a time** - Grade10 SHALL serialize the winner's address write,
the reopen, the record of setup and the invoice send under the order's
boundary, so each reads the state the one before it left.

Reopening and recording setup each need payment-processing, per "Payment and
shipment are separate grants", and each carries a reason, per "History is
append-only and retained".

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ehu rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-75 - A reopen gives a fresh 48 hours
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in Setup Overdue whose address deadline was
  at 2026-09-14T09:00:00Z
- **AND** an operator holding payment-processing
- **WHEN** they reopen the address form with a reason at 2026-09-16T14:00:00Z
- **THEN** the order's address deadline is 2026-09-18T14:00:00Z
- **AND** the order derives as Awaiting Setup from its reopened window
- **AND** the winner can confirm a delivery address again

<!-- trace:scenario id=g10adm.auction-post-sale.SC-8of rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-76 - A reopen without a reason is refused
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order whose address deadline was 2026-09-14T09:00:00Z
- **WHEN** an operator attempts to reopen the address form without a reason
- **THEN** Grade10 refuses it
- **AND** the address deadline has still passed

<!-- trace:scenario id=g10adm.auction-post-sale.SC-u12 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-77 - An operator without the grant cannot reopen
**Serves:** Setup - reopen setup or record it

- **GIVEN** an operator who does not hold payment-processing
- **WHEN** they open an auction order whose address deadline has passed
- **THEN** the reopen control is visible and disabled
- **AND** Grade10 refuses the reopen on the server if it is attempted

<!-- trace:scenario id=g10adm.auction-post-sale.SC-lh7 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-78 - A third reopen is allowed
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order whose address form has been reopened twice and whose
  address deadline has passed again
- **WHEN** an operator holding payment-processing reopens it a third time with
  a reason
- **THEN** Grade10 accepts the reopen
- **AND** the address deadline is 48 hours from that reopen

<!-- trace:scenario id=g10adm.auction-post-sale.SC-blu rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-79 - The reopen is on the invoice log
**Serves:** Audit trail - the reopen names who did it and why

- **GIVEN** an auction order an operator reopened with a reason
- **WHEN** an operator reads the invoice log
- **THEN** it holds a reopened entry with the named operator, its timestamp
  and that reason

<!-- trace:scenario id=g10adm.auction-post-sale.SC-pqn rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-80 - Reopening before the deadline is refused
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in Awaiting Setup whose address deadline is
  at 2026-09-18T14:00:00Z
- **WHEN** an operator attempts to reopen the address form at 2026-09-17T10:00:00Z
- **THEN** Grade10 refuses it
- **AND** the address deadline is still 2026-09-18T14:00:00Z

<!-- trace:scenario id=g10adm.auction-post-sale.SC-w78 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-81 - No reopen once the invoice is sent
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order whose invoice an operator has sent
- **WHEN** an operator attempts to reopen its address form
- **THEN** Grade10 refuses it
- **AND** the delivery address stays locked, changeable only by a re-quote

<!-- trace:scenario id=g10adm.auction-post-sale.SC-egm rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-82 - A confirmed address cannot reopen
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in Preparing Invoice with a confirmed address,
  no sent invoice, and an address deadline that has passed
- **WHEN** an operator attempts to reopen its address form with a reason
- **THEN** Grade10 refuses it
- **AND** the order remains Preparing Invoice

<!-- trace:scenario id=g10adm.auction-post-sale.SC-jy7 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-83 - A cancelled order refuses a reopen
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order an operator cancelled before any invoice was sent,
  whose lot has returned to available stock
- **WHEN** an operator attempts to reopen its address form
- **THEN** Grade10 refuses it
- **AND** the order still derives as Cancelled
- **AND** the lot stays in available stock

<!-- trace:scenario id=g10adm.auction-post-sale.SC-2g4 rev=3 -->
#### Scenario: grade10-admin-auction-post-sale-SC-84 - An operator records setup without reopening
**Serves:** `grade10-admin/auction/post-sale#post-sale-US-20` - Operator records setup given by telephone

- **GIVEN** an auction order in Setup Overdue whose address deadline was
  at 2026-09-14T09:00:00Z
- **WHEN** an operator holding payment-processing records the delivery address,
  billing address, settlement currency and payment method the winner gave them
  by telephone
- **THEN** Grade10 accepts it
- **AND** the order derives as Preparing Invoice
- **AND** the address deadline has still passed, so the winner cannot change it

<!-- trace:scenario id=g10adm.auction-post-sale.SC-t9v rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-90 - Address write, reopen, record and send serialize
**Serves:** Setup - reopen setup or record it

- **GIVEN** a Setup Overdue order, with invoice `not_issued` and no confirmed address
- **WHEN** a winner address write, an operator reopen, an operator record of
  setup and an operator invoice send are submitted concurrently
- **THEN** Grade10 serializes the operations under the order boundary
- **AND** the final address snapshot and persisted deadline match the last
  committed transition
- **AND** no partial address overwrite is possible
- **AND** a send that commits carries the setup the transition before it left,
  and one refused for lack of setup changes nothing

<!-- trace:scenario id=g10adm.auction-post-sale.SC-su0 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-91 - Address recording is logged
**Serves:** Setup - the reopen and phone-recorded setup name who did them and why

- **GIVEN** an operator records setup supplied by phone without reopening
- **WHEN** another operator reads the invoice log
- **THEN** it contains an address-recorded entry with the named operator,
  timestamp and reason

<!-- trace:scenario id=g10adm.auction-post-sale.SC-sxy rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-211 - A record without a reason is refused
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in Setup Overdue whose address deadline was
  at 2026-09-14T09:00:00Z
- **WHEN** an operator holding payment-processing attempts to record setup
  without a reason
- **THEN** Grade10 refuses it
- **AND** the order is still in Setup Overdue, holding no recorded address

<!-- trace:scenario id=g10adm.auction-post-sale.SC-z4g rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-212 - Recording setup after the address is confirmed is refused
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in Preparing Invoice with a confirmed address
  and no sent invoice
- **WHEN** an operator holding payment-processing attempts to record setup
  with a reason
- **THEN** Grade10 refuses it
- **AND** the confirmed address is unchanged

<!-- trace:scenario id=g10adm.auction-post-sale.SC-7jb rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-213 - Recording setup after the invoice is sent is refused
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order whose invoice an operator has sent
- **WHEN** an operator holding payment-processing attempts to record setup
  with a reason
- **THEN** Grade10 refuses it
- **AND** the delivery address stays locked, changeable only by a reissue

<!-- trace:scenario id=g10adm.auction-post-sale.SC-8fx rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-214 - A cancelled order refuses recorded setup
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order an operator cancelled before any invoice was sent
- **WHEN** an operator holding payment-processing attempts to record setup
  with a reason
- **THEN** Grade10 refuses it
- **AND** the order still derives as Cancelled

<!-- trace:scenario id=g10adm.auction-post-sale.SC-zuz rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-215 - Recording setup refuses a payment method the currency does not offer
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in USD Setup Overdue, where Payment Settings holds
  no USD card fee rule
- **WHEN** an operator holding payment-processing records a delivery
  address, a billing address and card as the method, with a reason
- **THEN** Grade10 refuses it
- **AND** the order holds no recorded address and no method, and is still in
  Setup Overdue

<!-- trace:scenario id=g10adm.auction-post-sale.SC-l05 rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-216 - A reopen is allowed in a currency that offers no method
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in USD Setup Overdue, where Payment Settings holds
  no USD card fee rule and Grade10 holds no HK Local and no SWIFT bank details
- **WHEN** an operator holding payment-processing reopens the address form with a
  reason
- **THEN** Grade10 accepts the reopen and the order derives as Awaiting Setup
- **AND** the winner reads that payment is not yet available in USD, with
  Contact Us, and cannot confirm

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ppk rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-250 - Recording setup without a currency is refused
**Serves:** `grade10-admin/auction/post-sale#post-sale-US-20` - Operator records setup given by telephone

- **GIVEN** an auction order in Setup Overdue whose address deadline has passed
- **WHEN** an operator holding payment-processing records a delivery address, a
  billing address and bank transfer on HK Local with a reason, and names no
  settlement currency
- **THEN** Grade10 refuses it
- **AND** the order holds no recorded address and no currency, and is still in
  Setup Overdue

## REMOVED Requirements

None.
