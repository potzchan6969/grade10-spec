# grade10-admin/auction/post-sale Specification

## Feature set

- Quote and send
  - Quote in USD: the operator types every amount, the bank transfer fee included, in USD
  - HKD preview: the quote preview reads the USD lines typed, then the HKD Subtotal, fee and total, with no rate
- Order page
  - Sent HKD invoice: the order page lists the USD lines, then the HKD Subtotal, Payment Processing Fee and Total, and the reissue history shows a changed line in USD and the fee and total in HKD

## MODIFIED Requirements

### Requirement: Invoice log history

Every change to an auction order's money SHALL be written as an append-only
invoice log entry, never as a field overwrite. The order's detail SHALL show
these log entries in chronological order. It SHALL also show operators each
invoice's invoice ID, bank reference and internal audit number, and each
receipt's receipt ID and internal audit number, per
`grade10-site/auction/winner-order`.

| Field | Notes |
| --- | --- |
| Log type | Address reopened, address recorded, order edited before send, sent, expired, reissued, proof uploaded, proof confirmed, proof returned, paid, payment recorded, cancelled, refunded, payment attempt failed, flagged payment, flag cleared |
| Timestamp | Stored in UTC, displayed in Hong Kong time for every operator, per "Order dates and times read in Hong Kong time" |
| Invoice ID | The invoice the entry concerns |
| Internal audit number | Sent, reissued, paid and payment recorded entries: the number of the invoice or receipt the entry issued |
| Invoice status after the log entry | |
| Order total at the log entry | Captures amount changes across reissues |
| Amount delta | Where the amount changed from the prior log entry |
| Payment deadline at the log entry | The deadline trail across reissues and returned proof |
| Time left | Proof uploaded and proof returned entries |
| Deadline choice | Reissues only: kept or restarted |
| Changed parts | Order edited before send: delivery address, payment method or both. Reissues: each of delivery address, payment method, payment processing fee, Shipping & Handling, Insurance, Tax and deadline that changed. Each with its value before and after, and Tax with no amount where the invoice carried none. A Shipping & Handling, Insurance or Tax part reads in USD, the amount the operator typed; the payment processing fee and the order total read in the invoice's currency |
| Reissue sequence number | Where the log entry is a reissue |
| Actor | The buyer, the system, or a named operator |
| Payment method | Paid, payment recorded and flagged payment entries: a card with its brand and last four digits, or bank transfer, cash, or other with its description |
| Flag | Flagged payment and flag cleared entries: the flag's kind and the payment it sits on |
| Proof files | Proof uploaded entries: the winner's files. Proof confirmed and payment recorded entries: every file on the payment record |
| External reference | Payment recorded entries only; flag cleared entries: the optional return reference |
| Reason | Mandatory on an operator-initiated log entry that needs one, per "History is append-only and retained". A proof returned entry carries both the external and the internal reason |
| Payment-provider reference | Where one applies |

Grade10 SHALL record failed payment attempts in the invoice log. A buyer who
tried three times with a declining card is a different case from one who never
engaged, and the difference SHALL be visible to whoever decides on
reinstatement.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ua0 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-34 - Failed payment attempts appear in the invoice log
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** a winner whose card was declined three times before the deadline
  elapsed
- **WHEN** an operator reads the invoice log
- **THEN** it shows three failed payment attempts with their timestamps
- **AND** the buyer is distinguishable from one whose history holds only the
  issued log entry

<!-- trace:scenario id=g10adm.auction-post-sale.SC-j3o rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-35 - An amendment's amount change is on the record
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an auction order an operator reissued, changing the order total
  from 312000 to 316000 minor units in HKD
- **WHEN** an operator reads the invoice log
- **THEN** it shows the reissued entry at 316000 minor units in HKD
- **AND** the delta from the prior entry and the deadline choice

<!-- trace:scenario id=g10adm.auction-post-sale.SC-hgz rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-61 - A paid entry names how it was paid
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** one order the winner paid by a Visa card ending 4242 and one an
  operator settled by cash
- **WHEN** an operator reads each invoice log
- **THEN** the first paid entry names a Visa card ending 4242
- **AND** the second names cash, with its proof files

<!-- trace:scenario id=g10adm.auction-post-sale.SC-k8l rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-123 - A reissue names what it changed
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an HKD order an operator reissued, switching the method from card to
  bank transfer, which moved the payment processing fee from 11225 to 0 minor
  units in HKD, and changing Shipping & Handling from 8000 to 12000 minor units
  in USD
- **WHEN** an operator reads the invoice log
- **THEN** the reissued entry names payment method, payment processing fee and
  Shipping & Handling as changed, each with its value before and after, the
  Shipping & Handling values in USD and the fee values in HKD
- **AND** names no other part as changed

<!-- trace:scenario id=g10adm.auction-post-sale.SC-tyi rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-204 - A reissue that changes tax names it with its value before and after
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an HKD order in Pending Payment whose invoice has no Tax
- **AND** an operator reissued it with Tax of 6000 minor units in USD and a reason, changing nothing else
- **WHEN** an operator reads the invoice log
- **THEN** the reissued entry names Tax as the changed part, with no amount before and 6000 minor units in USD after
- **AND** names no other part as changed

<!-- trace:scenario id=g10adm.auction-post-sale.SC-jce rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-124 - A proof check is on the record
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order whose winner uploaded proof, an operator returned it with an external and an internal reason, and the winner uploaded again, which an operator confirmed
- **WHEN** an operator reads the invoice log
- **THEN** it shows proof uploaded, proof returned with both reasons and the time left, proof uploaded, and proof confirmed, in that order
- **AND** each names its actor and timestamp

<!-- trace:scenario id=g10adm.auction-post-sale.SC-dgt rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-132 - Operators read the internal audit numbers
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order whose first invoice holds internal audit number `#00010482`, whose reissued invoice holds `#00010490`, and whose receipt holds `#00010495`
- **WHEN** an operator opens the order and reads its invoice log
- **THEN** the order shows all three numbers against their invoice or receipt
- **AND** the sent entry shows `#00010482`, the reissued entry `#00010490` and the paid entry `#00010495`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-rn1 rev=1 -->
#### Scenario: g10adm.auction-post-sale.SC6 - A reissue of an HKD invoice logs a changed line in USD and the totals in HKD
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an HKD order whose bank transfer invoice has USD lines of 10100, 2020
  and 1001 minor units, a bank transfer fee of 0 and an order total of 103000
  minor units in HKD
- **AND** an operator reissued it with Shipping & Handling of 2001 minor units in
  USD and a reason, changing nothing else
- **WHEN** an operator reads the invoice log
- **THEN** the reissued entry names Shipping & Handling as the changed part, with
  1001 minor units in USD before and 2001 minor units in USD after
- **AND** the entry's order total reads 110850 minor units in HKD and its amount
  delta 7850 minor units in HKD
- **AND** it names no other part as changed

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

**The preview's shape** - The quote preview SHALL write every amount in the
operator shape of `shared/money-amounts`, the ISO code and two decimals, as
`USD 150.00` and `HKD 1,970.35`.

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

<!-- trace:scenario id=g10adm.auction-post-sale.SC-9de rev=1 -->
#### Scenario: g10adm.auction-post-sale.SC4 - The quote preview writes every amount in the operator shape
**Serves:** post-sale-US-21 - the operator reads the HKD total before the winner does

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer with a
  winning bid of 15000 and a buyer's premium of 3000 minor units in USD
- **WHEN** an operator enters Shipping & Handling of 4900, Insurance of 2000,
  Tax of 200 and a bank transfer fee of 257 minor units in USD
- **THEN** the quote lists `USD 150.00`, `USD 30.00`, `USD 49.00`, `USD 20.00`
  and `USD 2.00`
- **AND** below them it reads Subtotal `HKD 1,970.35`, Payment Processing Fee
  `HKD 20.18` and order total `HKD 1,990.53`

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

<!-- trace:scenario id=g10adm.auction-post-sale.SC-y6v rev=3 -->
#### Scenario: grade10-admin-auction-post-sale-SC-69 - The operator sees the fee before sending
**Serves:** Quote and send - the card fee read before send

- **GIVEN** an auction order in HKD in Preparing Invoice for card whose USD lines
  are a winning bid of 25000, a buyer's premium of 5000, Shipping & Handling of
  8000 and Insurance of 2000 minor units, which convert to a Subtotal of 314000
  minor units in HKD
- **AND** the HKD card rule in Payment Settings is 3.4 per cent and 235 minor units
- **WHEN** an operator holding payment-processing opens the send step
- **THEN** they read a payment processing fee of 11296 and an order total of
  325296 minor units in HKD

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

<!-- trace:scenario id=g10adm.auction-post-sale.SC-miq rev=4 -->
#### Scenario: grade10-admin-auction-post-sale-SC-119 - A bank transfer fee has no cap and needs no provider fees
**Serves:** Quote and send - zero or more, with no cap

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer with
  USD lines of 10000, 2000, 1000 and 400 minor units, which convert to a
  Subtotal of 105190 minor units in HKD
- **WHEN** an operator enters a bank transfer fee of 50000 minor units in USD
  and sends
- **THEN** the invoice carries a bank transfer fee of 392500 minor units in HKD
- **AND** the invoice is `pending` with an order total of 497690 minor units
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

<!-- trace:scenario id=g10adm.auction-post-sale.SC-omk rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-168 - Grade10 computes the card fee
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for card whose USD lines
  are a winning bid of 25000, a buyer's premium of 5000, Shipping & Handling of
  8000 and Insurance of 2000 minor units, which convert to a Subtotal of 314000
  minor units in HKD
- **AND** the HKD card rule is 3.4 per cent and 235 minor units
- **WHEN** an operator holding payment processing opens the quote and sends
- **THEN** the invoice is `pending` with a payment processing fee of 11296 and
  an order total of 325296 minor units in HKD
- **AND** the quote showed the fee read-only with the HKD card rule it came
  from

<!-- trace:scenario id=g10adm.auction-post-sale.SC-t9u rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-169 - The card fee tracks the subtotal until send
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for card whose USD lines
  are a winning bid of 25000, a buyer's premium of 5000, Shipping & Handling of
  8000 and Insurance of 2000 minor units, whose Subtotal of 314000 minor units
  in HKD makes the fee read the computed 11296
- **AND** the HKD card rule is 3.4 per cent and 235 minor units
- **WHEN** an operator raises Shipping & Handling to 8500 minor units in USD, so
  the Subtotal is 317925 minor units in HKD
- **THEN** the fee reads 11434 and the order total 329359 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-hto rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-171 - A switch to bank transfer starts the fee empty
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose card invoice has a subtotal of
  314000 and a fee of 11296 minor units in HKD
- **WHEN** an operator reissues it and switches the method to bank transfer
- **THEN** the payment processing fee reads empty, which is zero
- **AND** the operator reads 325296 as the previous and 314000 minor units in
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
5. Read the same preview as a first send, the USD lines, then the Subtotal, the
   payment processing fee and the order total in HKD, with the previous order
   total beside the new one.
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
does not. A confirmed ordinary historical order whose bank rail is absent may
be read as unknown, but a reissue SHALL require a currently offered rail and
SHALL NOT fabricate a replacement snapshot from current Finance settings.

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

<!-- trace:scenario id=g10adm.auction-post-sale.SC-5sm rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-114 - A card invoice paid by transfer is reissued, then settled
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order whose card invoice has a subtotal of 314000 and a fee of 11296 minor units in HKD, and whose winner transferred 314000 minor units in HKD
- **WHEN** an operator reissues it as bank transfer with a bank transfer fee of 0 and a reason, then settles it manually by bank transfer with a reference and proof
- **THEN** the invoice is `paid` at 314000 minor units in HKD
- **AND** the replaced card invoice holds no status and is not `cancelled`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-2fi rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-115 - A replaced invoice is not cancelled
**Serves:** Resolving an unpaid order - one Reissue action

- **GIVEN** an order in Pending Payment
- **WHEN** an operator reissues its invoice with a reason
- **THEN** the order's invoice status is the new invoice's, `pending`
- **AND** the order does not derive as Cancelled and the lot is not returned to available

<!-- trace:scenario id=g10adm.auction-post-sale.SC-e28 rev=3 -->
#### Scenario: grade10-admin-auction-post-sale-SC-125 - A switch to card prices the fee at send
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice has a subtotal of 314000 and a bank transfer fee of 0 minor units in HKD
- **AND** the HKD card rule in Payment Settings is 3.4 per cent and 235 minor units
- **WHEN** an operator reissues it as card with a reason and sends
- **THEN** the new invoice is card with a payment processing fee of 11296 and an order total of 325296 minor units in HKD
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

<!-- trace:scenario id=g10adm.auction-post-sale.SC-2g5 rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-245 - A reissue changes the settlement currency
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice on HK Local
  is in HKD with USD lines of 10000 and 2000 minor units, a Winning Bid of 10000
  and a Subtotal of 94200 minor units in HKD
- **WHEN** an operator reissues it in USD, keeping HK Local, with a reason and
  nothing else changed
- **THEN** the new invoice is in USD with a Winning Bid of 10000 minor units
- **AND** the replaced invoice still reads a Winning Bid of 10000 minor units in
  USD and a Subtotal of 94200 minor units in HKD
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

<!-- trace:scenario id=g10adm.auction-post-sale.SC-xvo rev=1 -->
#### Scenario: g10adm.auction-post-sale.SC5 - The reissue dialog shows the preview with the previous total beside the new
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose HKD bank transfer invoice has USD
  lines of 10100, 2020 and 1001 minor units, a bank transfer fee of 0 and an
  order total of 103000 minor units in HKD
- **WHEN** an operator opens Reissue and raises Shipping & Handling to 2001
  minor units in USD
- **THEN** the dialog lists the USD lines of 10100, 2020 and 2001 minor units
- **AND** below them it reads a Subtotal of 110850 and an order total of 110850
  minor units in HKD, with the previous order total of 103000 beside the new one

## ADDED Requirements

### Requirement: The order page lists a sent HKD invoice's USD lines, then its HKD Subtotal, fee and Total

The order page SHALL show an HKD order's current invoice as the quote preview
shows it: the USD lines, which are the Winning Bid, the Buyer's Premium,
Shipping & Handling, and Insurance and Tax when the invoice carries them, then
the Subtotal, the Payment Processing Fee and the Total in HKD. It SHALL show no
HKD amount beside a line, and no conversion rate or note. Every amount reads in
the operator shape of `shared/money-amounts`. The Subtotal, the fee and the
Total are the invoice's, per `grade10-site/auction/winner-order`, "An HKD order
converts each USD line at a fixed rate and rounds it up".

The page SHALL list a USD invoice's lines, fee and Total in USD, as before.

The reissue history reads per "Invoice log history": a changed line in USD, and
the fee and the total in HKD.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-dz1 rev=1 -->
#### Scenario: g10adm.auction-post-sale.SC7 - The order page lists a sent HKD invoice as USD lines, then the HKD Subtotal, fee and Total
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** an order in Pending Payment whose HKD bank transfer invoice was sent
  with USD lines of 10100, 2020 and 992 minor units and a bank transfer fee of
  257 minor units in USD
- **WHEN** an operator opens the order
- **THEN** the invoice lists `USD 101.00`, `USD 20.20` and `USD 9.92`
- **AND** below them it reads Subtotal `HKD 1,029.30`, Payment Processing Fee
  `HKD 20.18` and Total `HKD 1,049.48`
- **AND** no HKD amount shows beside a line

<!-- trace:scenario id=g10adm.auction-post-sale.SC-59j rev=1 -->
#### Scenario: g10adm.auction-post-sale.SC8 - The order page lists a sent USD invoice in USD
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** an order in Pending Payment whose USD bank transfer invoice was sent
  with lines of 10100, 2020 and 1001 minor units and a bank transfer fee of 500
  minor units in USD
- **WHEN** an operator opens the order
- **THEN** the invoice lists `USD 101.00`, `USD 20.20` and `USD 10.01`, Payment
  Processing Fee `USD 5.00` and Total `USD 136.21`
- **AND** no HKD amount shows
