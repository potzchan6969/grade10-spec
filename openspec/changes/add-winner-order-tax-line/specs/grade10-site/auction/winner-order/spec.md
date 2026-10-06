# Winner Order — delta

## Feature set

- Tax on a winner's order
  - Before send: Tax reads TBD with an info tip
  - After send: Tax shows the operator's amount or is absent when none
  - Itemisation: the invoice and receipt carry Tax between Insurance and Subtotal
  - Card fee base: Tax is part of the Subtotal the payment fee grosses up

## MODIFIED Requirements

### Requirement: Invoice fields

Each invoice SHALL carry these fields. Every amount SHALL be an integer count
of minor units paired with the lot's ISO 4217 currency code, rendered per
`shared/money-amounts`. An invoice exists only once an operator sends it.

| Field | Notes |
| --- | --- |
| Auction order | The order this invoice is the payable record for. An order holds one current invoice, and any invoices a reissue replaced |
| Invoice ID | Given at send, per "Every invoice carries an invoice ID and the order's payment reference". Finds the order, including after a reissue |
| Payment reference | Given at send, on every invoice. Shown to the winner only on a bank transfer invoice. Finds the order, including after a reissue |
| Internal audit number | Given at send, per "Invoices and receipts carry an internal audit number". Never shown to the winner |
| Lot | The single lot invoiced. Named unambiguously, since a winner may hold several |
| Payment method | Card or bank transfer. The winner's choice at send, or the operator's at a reissue |
| Winning bid | The accepted bid that won the lot, excluding every other component |
| Buyer's premium | The applicable fee. This capability fixes no rate |
| Shipping & Handling | Quoted by an operator for the order's confirmed delivery address. Zero or more |
| Insurance | Optional. Added by an operator for the order's confirmed delivery address, and greater than zero when added |
| Tax | Optional caller-supplied `taxLine`, added by an operator for the order, and greater than zero when added. Grade10 defines no rate, jurisdiction or formal tax receipt |
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
| Card | The amount that leaves the subtotal whole after the payment provider takes a fixed fee and a percentage of the whole charge, computed below |
| Bank transfer | The amount the operator entered on the quote or the reissue. Zero or more |

For card, Grade10 SHALL read both provider fees for the invoice's currency at
the moment the invoice is sent, SHALL compute the order total as the subtotal
plus the fixed fee divided by one less the percentage, SHALL round that total
up to the next minor unit, and SHALL take the fee as the difference between
the order total and the subtotal.

The fee SHALL be fixed on the invoice once sent. A later change in the
provider's fees SHALL NOT move it; only a reissue SHALL price it again. No
settlement SHALL drop or change it.

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

<!-- trace:scenario id=g10.auction-winner-order.SC-awt rev=1 -->
#### Scenario: winner-order-SC-62 - The fee grosses the subtotal up
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent a card invoice whose subtotal is 312000 minor units in HKD
- **AND** the payment provider's fees for HKD at that moment were 235 minor units and 3.4 per cent
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

<!-- trace:scenario id=g10.auction-winner-order.SC-c6t rev=1 -->
#### Scenario: winner-order-SC-110 - A bank transfer fee is the amount the operator entered
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an operator sent a bank transfer invoice with a subtotal of 312000
  and a bank transfer fee of 5000 minor units in HKD
- **WHEN** the winner reads the invoice
- **THEN** the payment processing fee is 5000 minor units in HKD
- **AND** the order total is 317000 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-16z rev=1 -->
#### Scenario: winner-order-SC-111 - A bank transfer fee of zero reads Free
**Serves:** Invoice - Payment Processing Fee priced by method

- **GIVEN** an operator sent a bank transfer invoice with a subtotal of 312000
  and a bank transfer fee of 0 minor units in HKD
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


### Requirement: Records the winner keeps

Each auction order SHALL carry these records, retrievable by the winner for
the life of their account. Grade10 SHALL archive every invoice PDF, replaced
invoices included, and every receipt PDF, and SHALL keep each retrievable for
at least 7 years, or for the life of the account if longer. Deleting the
account SHALL NOT shorten the 7 years.

| Record | When | Contents |
| --- | --- | --- |
| Payment receipt | Payment confirmed, by any route | A receipt ID, then itemised: winning bid, buyer's premium, Shipping & Handling, insurance when added, Tax when added, the subtotal, the payment processing fee, the order total, the invoice ID, the payment method, and the breakdown below |
| Shipping tracker | Fulfilment status is `fulfilled` | Carrier name, tracking number, and a link to the carrier |
| Delivery proof | `delivery_confirmed` is set | Whatever the carrier provided - handover timestamp, signature, proof-of-delivery image |

Each receipt issued after this change SHALL carry a receipt ID, unique across
all such receipts: `RC-[CODE][INVOICE_SEQ]P[RECEIPT_SEQ]`, for example
`RC-LK42301P1`. `[CODE]` is the paid invoice's unchanged payment reference,
`[INVOICE_SEQ]` is that invoice's sequence without the `IN-` prefix, and
`[RECEIPT_SEQ]` counts finalized receipt-bearing payments on that invoice,
starting at `1` without padding. Grade10 SHALL allocate the next sequence
atomically with the finalized full or partial payment. A refund, reversal or
void SHALL allocate no receipt ID or rewrite one already issued. Receipt IDs
issued before this change, including `REC-...` IDs, remain unchanged. Formal
tax-receipt content remains outside this requirement.

Every receipt SHALL show this breakdown:

| Line | Value |
| --- | --- |
| Original Invoice Total | The paid invoice's order total |
| Previous Payments | The payments recorded against that invoice before this payment |
| Current Payment Received | The amount recorded for this payment |
| Remaining Balance Due | The amount still owed after this payment, floored at 0 once the invoice is Paid |

The four lines SHALL appear on receipts for a single full payment, ordered
partial payments, a payment that closes an invoice within the agreed tolerance,
and a confirmed overpayment. A tolerance-close or overpayment SHALL show
`Remaining Balance Due` as `0`; it SHALL NOT add a shortfall, write-off or
negative-credit line.

The values SHALL describe the invoice and payment state when the receipt was
issued. Grade10 SHALL NOT reissue a receipt or mutate an issued receipt after a
refund or reversal. A later receipt's `Previous Payments` value SHALL remain
the value recorded when that later receipt was issued.

This requirement governs receipt contents only. Winner Order's live balance
and its absence from the order page remain governed by the partial-payment
capability.

The receipt SHALL name the payment method:

| Route | Method shown |
| --- | --- |
| Card, paid by the winner | Card, with its brand and last four digits |
| Bank transfer, proof confirmed by an operator | Bank transfer |
| Recorded by an operator | Bank transfer, cash, or the description the operator gave for another method, with the external reference where one was recorded |

A receipt SHALL record the amount settled, the payment method, and the external
reference when one was recorded. No proof file, the winner's or an operator's,
SHALL appear on the receipt. It SHALL carry no settlement-origin badge.

<!-- trace:scenario id=g10.auction-winner-order.SC-49p rev=2 -->
#### Scenario: winner-order-SC-18 - A receipt is itemised and stays retrievable
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order paid at an order total of 316000 minor units in HKD
- **WHEN** the winner opens the order a year later
- **THEN** the receipt shows the winning bid, buyer's premium, Shipping &
  Handling, insurance, Tax when added, the subtotal, the payment processing
  fee, and the order total

<!-- trace:scenario id=g10.auction-winner-order.SC-9qq rev=1 -->
#### Scenario: winner-order-SC-19 - A manually settled receipt records payment facts
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order an operator settled by bank transfer with an
  external reference, after reissuing and replacing an earlier invoice
- **WHEN** the winner opens the receipt
- **THEN** it records the amount settled, which includes the payment processing
  fee, bank transfer as the method, and the external reference
- **AND** it carries no settlement-origin badge
- **AND** it shows no proof file

<!-- trace:scenario id=g10.auction-winner-order.SC-0wc rev=1 -->
#### Scenario: winner-order-SC-20 - The tracker appears once the lot is dispatched
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose fulfilment status has just become
  `fulfilled` with a tracking number attached
- **WHEN** the winner opens the order
- **THEN** it shows the carrier name, the tracking number, and a link to the
  carrier

<!-- trace:scenario id=g10.auction-winner-order.SC-8xb rev=1 -->
#### Scenario: winner-order-SC-21 - Delivery proof records what the carrier provided
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** a dispatched auction order for which the carrier reports delivery
  with a handover timestamp and a signature
- **WHEN** `delivery_confirmed` is set
- **THEN** the order records that timestamp and that signature
- **AND** does not reduce them to a bare confirmation flag

<!-- trace:scenario id=g10.auction-winner-order.SC-g94 rev=1 -->
#### Scenario: winner-order-SC-36 - A card receipt names the card
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order the winner paid by a Visa card ending 4242
- **WHEN** the winner opens the receipt
- **THEN** the payment method reads as a Visa card ending 4242

<!-- trace:scenario id=g10.auction-winner-order.SC-f2w rev=2 -->
#### Scenario: winner-order-SC-112 - Every receipt carries a receipt ID
**Serves:** Records the winner keeps - receipt ID and breakdown

- **GIVEN** one post-change order paid by card, one confirmed from bank transfer
  proof, and one settled manually
- **WHEN** the winner opens each receipt
- **THEN** each carries a receipt ID in the `RC-[CODE][INVOICE_SEQ]P1` form
- **AND** each names its invoice ID

<!-- trace:scenario id=g10.auction-winner-order.SC-vxf rev=1 -->
#### Scenario: winner-order-SC-113 - A confirmed bank transfer receipt names bank transfer
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose bank transfer proof an operator confirmed at an order total of 317000 minor units in HKD
- **WHEN** the winner opens the receipt
- **THEN** the payment method reads Bank transfer and the amount paid is 317000 minor units in HKD
- **AND** it is not marked as manually settled
- **AND** it shows no proof file and no file name

<!-- trace:scenario id=g10.auction-winner-order.SC-kiz rev=2 -->
#### Scenario: winner-order-SC-131 - A receipt ID takes the paid invoice and the payment month
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an order whose bank transfer invoice is `IN-LK7P2Q02` and has an
  order total of 317000 minor units in HKD
- **WHEN** an operator confirms its first payment proof and the winner opens the receipt
- **THEN** the receipt ID is `RC-LK7P2Q02P1`
- **AND** it shows Original Invoice Total 317000, Previous Payments 0, Current Payment Received 317000 and Remaining Balance Due 0, in minor units of HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-e8v rev=1 -->
#### Scenario: winner-order-SC-132 - Two receipts never share an ID
**Serves:** Records the winner keeps - receipt ID and breakdown

- **GIVEN** two paid orders on different listings
- **WHEN** the winner opens both receipts
- **THEN** the two receipt IDs differ

<!-- trace:scenario id=g10.auction-winner-order.SC-pvg rev=2 -->
#### Scenario: winner-order-SC-135 - A repeated confirmation keeps one receipt ID
**Serves:** Records the winner keeps - receipt ID and breakdown

- **GIVEN** an auction order whose receipt ID is `RC-LK7P2Q01P1`
- **WHEN** the payment confirmation is delivered again
- **THEN** the receipt ID is still `RC-LK7P2Q01P1`
- **AND** no other receipt ID and no other internal audit number is issued

<!-- trace:scenario id=g10.auction-winner-order.SC-xqw rev=1 -->
#### Scenario: winner-order-SC-133 - Invoice and receipt PDFs outlive a deleted account
**Serves:** Records the winner keeps - retention

- **GIVEN** a paid order with a replaced invoice, its current invoice and a receipt, whose winner deleted their account a year after payment
- **WHEN** Grade10 retrieves the order's documents 6 years after payment
- **THEN** the replaced invoice PDF, the current invoice PDF and the receipt PDF are all returned

<!-- trace:scenario id=g10.auction-winner-order.SC-r8w rev=1 -->
#### Scenario: winner-order-SC-247 - A finalized first payment receives the new receipt ID
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** invoice `IN-LK42301` for an order whose payment reference is `LK423`
- **AND** it has no finalized receipt-bearing payment
- **WHEN** its first full or partial payment finalizes
- **THEN** its receipt ID is `RC-LK42301P1`

<!-- trace:scenario id=g10.auction-winner-order.SC-k31 rev=1 -->
#### Scenario: winner-order-SC-222 - Each finalized payment advances only its invoice's receipt sequence
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** invoice `IN-LK42301` has receipts through `RC-LK42301P9`
- **WHEN** another partial payment for it finalizes
- **THEN** the receipt ID is `RC-LK42301P10`
- **AND** a finalized payment on invoice `IN-LK42302` starts at `RC-LK42302P1`

<!-- trace:scenario id=g10.auction-winner-order.SC-4mt rev=1 -->
#### Scenario: winner-order-SC-223 - Historical and non-payment events do not receive the new receipt ID
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** a historical receipt ID is `REC-202609-LK7P2Q-01-P1`
- **WHEN** the receipt is read after this change is delivered
- **THEN** its ID remains unchanged
- **AND** a refund, reversal or void creates no receipt ID

<!-- trace:scenario id=g10.auction-winner-order.SC-6pw rev=1 -->
#### Scenario: winner-order-SC-246 - Nothing identifying the lot's order is shown before a winner exists
**Serves:** winner-order-US-21 - Winner quotes their order

- **GIVEN** a lot that has not yet closed, and the same lot just after it closes with no winner
- **WHEN** anyone reads the lot outside a winning order
- **THEN** no payment reference, invoice ID, or receipt ID is shown for it
- **AND** the lot is identified only by its title

## ADDED Requirements

### Requirement: Tax info tooltip

On Winner Order's Order Summary, Tax explains itself whenever the line is shown.

**Tooltip** - Grade10 SHALL offer a brief info tooltip beside Tax whenever the
Tax line is shown.

**Copy** - The tooltip SHALL read `Set by Grade10 for where your order ships.
Some orders have none.`

<!-- trace:scenario id=g10.auction-winner-order.SC-d0w rev=1 -->
#### Scenario: winner-order-SC-217 - A shown Tax line carries its info tooltip
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with Tax of 6000 minor units in HKD
- **WHEN** the winner reads Order Summary
- **THEN** the Tax line shows 6000 minor units in HKD
- **AND** the Tax line sits between Insurance and Payment Processing Fee
- **AND** it offers an info tooltip reading `Set by Grade10 for where your order
  ships. Some orders have none.`

<!-- trace:scenario id=g10.auction-winner-order.SC-mph rev=1 -->
#### Scenario: winner-order-SC-212 - An absent Tax line offers no tooltip
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice without adding Tax
- **WHEN** the winner reads Order Summary
- **THEN** no Tax line is shown
- **AND** no Tax tooltip is offered

### Requirement: Tax before the invoice is sent

Before an operator sends the invoice, Order Summary names Tax without an amount.

**Before send** - Before an operator has sent the invoice, Winner Order's Order
Summary SHALL show Tax as TBD with the other fee rows.

**No amount** - Grade10 SHALL NOT show a calculated Tax amount before the
operator sends the invoice.

<!-- trace:scenario id=g10.auction-winner-order.SC-1ok rev=1 -->
#### Scenario: winner-order-SC-213 - Tax reads TBD before the invoice is sent
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order before an operator has sent its invoice
- **WHEN** the winner reads Order Summary
- **THEN** Tax is shown as TBD with the other fee rows
- **AND** no calculated Tax amount is shown
- **AND** the Tax line offers its info tooltip
