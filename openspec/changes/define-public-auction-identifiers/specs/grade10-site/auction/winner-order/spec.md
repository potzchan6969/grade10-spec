# grade10-site/auction/winner-order Specification

## Feature set

- Invoice at lot close
  - One invoice per lot: a winner of three lots owes three amounts on three deadlines, never one consolidated bill
  - Estimate-first pricing: the invoice is payable from the moment of close rather than waiting on an address
  - Final amount: names every component a winner is asked to pay, so a total is explicable line by line
  - Buyer's premium: 20% of the winning bid or the currency's minimum charge, whichever is higher, computed by Grade10
  - Invoice premium: 20% of the winning bid
  - Integer amount: rounded to the nearest minor unit
  - Bid-panel boundary: only the rate appears before invoicing
- Premium minimum
  - Currency minimum: the current Auction Payment settings mapping sets the lower bound for the calculated premium
- Delivery address
  - Account-wide address book: the platform keeps at most five named shipping addresses and one optional default for the account
  - Selection and confirmation: a winner chooses a saved address or adds one, then affirms it before payment
  - Amendment and recalculation: a winner corrects the destination and sees what it costs before paying
  - Locking at payment: the order snapshot stops moving once money has changed hands
- Billing address at setup
  - Same as delivery address is selected by default
  - A separate saved or one-time address uses the existing address fields
  - Billing is confirmed with delivery and payment method
- Address snapshots
  - The confirmed billing address is locked on the order
  - Later account-address changes do not rewrite the order
- Invoice and receipt addresses
  - Invoice shows Bill To and Ship To from the order snapshot
  - Receipt keeps the addresses of the invoice it pays
- Payment method
  - Chosen with the address: card or bank transfer, recorded when the winner confirms where to ship
  - Fee range at the choice: fixed text Grade10 sets, with no amount for bank transfer
  - Offered by currency: bank transfer only where bank details are set up
  - Locked on confirmation: once the winner confirms, they change neither the address nor the method; an operator edits them before send and reissues after
- Invoice
  - Fee priced by method: Payment Processing Fee is the card gross-up or the operator's bank transfer fee, never dropped
  - Payment reference: the listing's own code, carried forward as the order's one collector-facing reference once a winner exists; there is no separate public order ID, and it never appears on the public listing page — `grade10-admin/auction/listing` allocates the code, this capability only carries it forward
  - Invoice ID: the payment reference plus a 2-digit issuance sequence; a reissue takes the next sequence and an old invoice ID still finds the order
  - Internal audit number: one gapless count across invoices and receipts, never shown to the winner
  - Replaced invoice: an invoice a reissue replaced says so and names its replacement
- Bank transfer
  - Three ways to pay: SWIFT, FPS and Hong Kong local bank transfer details, with the payment reference to quote; the bank-rail presentation is governed by `add-winner-how-to-pay-rails`
  - Payment proof: one upload of 1 to 3 files (1 required), behind a confirm step
  - Payment Verifying: the deadline stops, Pay with Card and further uploads are hidden
  - Proof not accepted: the latest reason the winner reads, and the deadline running again with the time that was left
- Records the winner keeps
  - Receipt identifier: a receipt for a finalized payment uses the invoice payload plus its unpadded per-invoice sequence; historic receipt IDs remain unchanged
  - Retention: every invoice and receipt PDF kept at least 7 years, or for the life of the account if longer
- Settlement
  - Single fresh charge: one transaction for the final amount, retryable on failure
- Payment deadline
  - Seven days from close: a fixed end to the winner's obligation, unmoved by anything they do to the invoice
- Records the winner keeps
  - Payment receipt: proof of what was paid, itemised, retrievable for the life of the account
  - Shipping tracker: where the lot is once it has left
  - Delivery proof: what the carrier recorded on handover, given what these lots are worth
- Contact Us on locked orders
  - Copy-first ready email: Contact Us opens a dialog with To, Subject and Message; Copy Message is first, Open Mail App is second
  - Subject names invoice or lot: the order's current invoice id when one exists; lot title when setup is overdue and no invoice has been issued
  - Address hidden until open: `support@grade10.com` is not on the order page before Contact Us
  - Editable message field: Message is an editable Textarea with order facts prefilled and space for the winner's question
  - Partial payment body: receipt ids may be listed; the remaining balance stays off the mail

## RENAMED Requirements

- FROM: `### Requirement: Every invoice carries an invoice ID and a bank reference`
- TO: `### Requirement: Every invoice carries an invoice ID and the order's payment reference`

### Requirement: Every invoice carries an invoice ID and the order's payment reference

Every sent invoice carries the order's payment reference and an invoice ID
built from it; a reissue takes the next invoice ID while the payment
reference never changes.

**Payment reference** - The bank reference and payment reference are the same
value; Grade10 SHALL NOT issue a second identifier. The payment reference
SHALL be the winner's order's one collector-facing reference: the listing
code that `grade10-admin/auction/listing` allocates for the lot, carried
forward unchanged once a winner exists on it. This capability SHALL NOT allocate,
derive, or reissue the code; it only consumes the value
`grade10-admin/auction/listing` already holds for the listing. There is no
separate public order ID — the payment reference stands in for one.

**Invoice ID** - Grade10 SHALL give every invoice, card or bank transfer, an
invoice ID when it is sent. Each SHALL be unique across all invoices.

| Identifier | Format | Example |
| --- | --- | --- |
| Payment reference | the listing code, unchanged | `LK423` |
| Invoice ID | `IN-[PAYMENT_REF][SEQ]` | `IN-LK42301` |

| Part | Rule |
| --- | --- |
| `[PAYMENT_REF]` | The order's payment reference, above |
| `[SEQ]` | The count of the order's invoices: `01` for the first invoice sent, the next number on each reissue; it uses at least two digits and continues as `100` after `99` |

**Invariant across reissue** - A reissue replaces the current invoice with a
new one, per `grade10-admin/auction/post-sale`, and the new invoice SHALL take
the next `[SEQ]`. The payment reference SHALL NOT change on a reissue, or at
any other point in the order's life — it is fixed on the listing's first saved
draft and carried forward as-is.

**Where shown** - Winner Order and the invoice PDF SHALL show both the
invoice ID and the payment reference, on every invoice regardless of payment
method; the payment reference is also the value quoted in FPS, local bank
transfer and SWIFT notes on a bank transfer invoice, per "A bank transfer
invoice shows how to pay". Grade10 SHALL NOT show the payment reference, the
invoice ID, or any receipt ID before a winning order exists on the listing;
until then a lot is identified by its title and canonical address. The public
listing page exposes the lower-case code only through that address, per
`grade10-site/auction/listing-page`.

**An old invoice ID still finds the order** - Looking up any invoice's
invoice ID, including a replaced invoice's, or the order's payment reference,
SHALL find the auction order.

**Replaced invoice** - A replaced invoice SHALL hold no invoice status of its
own and SHALL never read `cancelled`; the order's invoice status is its
current invoice's, per `grade10-site/auction/order-status`. The PDF of a
replaced invoice SHALL say it was replaced and SHALL name the invoice ID of
the invoice that replaced it.

**Stripe metadata** - When creating a card payment for the order, Grade10
SHALL write the order's payment reference to the Stripe payment's metadata
under `payment_reference_code`. Stripe's own returned provider reference
SHALL be stored by Grade10 separately from every collector-facing identifier,
used only in internal document filenames created after the payment is
obtained, and SHALL NOT reach the winner on any surface.

<!-- trace:scenario id=g10.auction-winner-order.SC-n8j rev=1 -->
#### Scenario: winner-order-SC-97 - A replaced invoice's identifiers still find the order
**Serves:** winner-order-US-21 - Winner quotes their order

- **GIVEN** an auction order whose first invoice an operator replaced with a reissue
- **WHEN** a payment quoting the first invoice's invoice ID, or the order's payment reference, is looked up
- **THEN** it finds that auction order
- **AND** the order's current invoice carries its own invoice ID, built from the same unchanged payment reference

<!-- trace:scenario id=g10.auction-winner-order.SC-sjx rev=1 -->
#### Scenario: winner-order-SC-98 - A replacement invoice names the invoice it replaces
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** an auction order whose first invoice an operator replaced with a reissue
- **WHEN** the winner opens the replacement invoice's PDF
- **THEN** it shows `Replaces invoice` and the first invoice's invoice ID
- **AND** the first invoice remains retained, holds no invoice status and does not read `cancelled`

<!-- trace:scenario id=g10.auction-winner-order.SC-12a rev=1 -->
#### Scenario: winner-order-SC-114 - The invoice ID is shown on the order and the PDF
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** one auction order whose invoice was sent for card and one sent for bank transfer
- **WHEN** the winner opens each order and its invoice PDF
- **THEN** each order shows its invoice ID and its payment reference
- **AND** its PDF shows the same invoice ID
- **AND** the card order's payment reference is shown exactly as the bank transfer order's is

<!-- trace:scenario id=g10.auction-winner-order.SC-q9s rev=1 -->
#### Scenario: winner-order-SC-122 - The invoice ID and payment reference use the payment reference
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** a lot on an order whose payment reference is `LK423`, with no invoice sent yet
- **WHEN** an operator sends its first invoice
- **THEN** the invoice ID is `IN-LK42301`

<!-- trace:scenario id=g10.auction-winner-order.SC-8dg rev=1 -->
#### Scenario: winner-order-SC-123 - A reissue takes the next invoice number
**Serves:** Invoice - a reissue takes a new invoice ID while the payment reference stays put

- **GIVEN** an order whose payment reference is `LK423` and whose first invoice `IN-LK42301` was sent
- **WHEN** an operator reissues it
- **THEN** the new invoice ID is `IN-LK42302`
- **AND** the order's payment reference is still `LK423`, unchanged by the reissue
- **AND** looking up `IN-LK42301`, `IN-LK42302`, or `LK423` all find the same order
- **AND** the first invoice's PDF names `IN-LK42302`

<!-- trace:scenario id=g10.auction-winner-order.SC-qt4 rev=1 -->
#### Scenario: winner-order-SC-124 - The invoice count grows to three digits after 99
**Serves:** Invoice - a reissue takes a new invoice ID while the payment reference stays put

- **GIVEN** an order whose payment reference is `LK423` and whose latest invoice is `IN-LK42399`
- **WHEN** an operator reissues it
- **THEN** the new invoice ID is `IN-LK423100`
- **AND** the payment reference remains `LK423`

<!-- trace:scenario id=g10.auction-winner-order.SC-upc rev=1 -->
#### Scenario: winner-order-SC-125 - A listing code that is already held is hashed again
**Serves:** winner-order-US-21 - Winner quotes their order

- **GIVEN** a listing-code candidate collides with an active code or retained reservation
- **WHEN** its draft is first saved
- **THEN** allocation retries and stores a distinct valid 5-character code

<!-- trace:scenario id=g10.auction-winner-order.SC-g6f rev=1 -->
#### Scenario: winner-order-SC-126 - A stored listing code never moves
**Serves:** winner-order-US-21 - Winner quotes their order

- **GIVEN** a listing already stores payment reference `LK423`
- **WHEN** the allocator implementation changes
- **THEN** the listing and its order continue to use `LK423`

<!-- trace:scenario id=g10.auction-winner-order.SC-1pz rev=1 -->
#### Scenario: winner-order-SC-127 - The public listing page does not show the listing code
**Serves:** winner-order-US-21 - Winner quotes their order

- **GIVEN** a listing whose payment reference is `LK423`
- **WHEN** its public page or shared preview is fetched
- **THEN** the payment reference appears only as the lower-case canonical URL suffix
- **AND** no public representation exposes a labelled payment-reference field

<!-- trace:scenario id=g10.auction-winner-order.SC-ly9 rev=1 -->
#### Scenario: winner-order-SC-128 - Each invoice shows the payment reference
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** one pending invoice sent for card and one pending invoice sent for bank transfer
- **WHEN** the winner opens each invoice
- **THEN** both show the payment reference
- **AND** the card invoice requires no separate bank-reference identifier

#### Scenario: winner-order-SC-244 - The payment reference is shown unconditionally, not gated by payment method
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** one order whose `pending` invoice was sent for bank transfer, and one whose `pending` invoice was sent for card
- **WHEN** the winner opens each on Winner Order
- **THEN** both orders show the payment reference

#### Scenario: winner-order-SC-245 - Stripe metadata carries the payment reference and never the provider reference to the winner
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** an auction order paid by card
- **WHEN** Grade10 creates the Stripe payment for that order
- **THEN** the Stripe payment's metadata carries `payment_reference_code` equal to the order's payment reference
- **AND** Stripe's own returned provider reference appears on no surface the winner reads

## MODIFIED Requirements

### Requirement: Records the winner keeps

Each auction order SHALL carry these records, retrievable by the winner for
the life of their account. Grade10 SHALL archive every invoice PDF, replaced
invoices included, and every receipt PDF, and SHALL keep each retrievable for
at least 7 years, or for the life of the account if longer. Deleting the
account SHALL NOT shorten the 7 years.

| Record | When | Contents |
| --- | --- | --- |
| Payment receipt | Payment confirmed, by any route | A receipt ID, then itemised: winning bid, buyer's premium, Shipping & Handling, insurance when added, any tax amount, the subtotal, the payment processing fee, the order total, the invoice ID, the payment method, and the breakdown below |
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

<!-- trace:scenario id=g10.auction-winner-order.SC-49p rev=1 -->
#### Scenario: winner-order-SC-18 - A receipt is itemised and stays retrievable
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order paid at an order total of 316000 minor units in HKD
- **WHEN** the winner opens the order a year later
- **THEN** the receipt shows the winning bid, buyer's premium, Shipping &
  Handling, insurance, any tax amount supplied by the separate tax capability,
  the subtotal, the payment processing fee, and the order total

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

### Requirement: The ready email names the invoice or the lot and the reason

The ready email's subject and body identify the order so support can open it
without a follow-up.

**Subject** - When the order's current invoice id exists, the subject SHALL be
`Auction order {invoice id}: {reason}`. When no invoice id exists (including
setup overdue before send), the subject SHALL be
`Auction lot {lot title}: {reason}`.

**Reason** - On Winner Order the reason fragment SHALL be one of
`setup overdue`, `payment overdue`, or `partial payment`.

**Body** - Message SHALL greet Grade10, say the winner needs help with this
auction order, name the lot title, name the status label for the reason
(`Setup overdue`, `Payment overdue`, or `Partially paid`), and leave space
for the winner's question. When an invoice id exists and the reason is not
setup overdue, the body SHALL name that invoice id.

**Partial payment** - When the reason is partial payment, the body MAY list
receipt ids and MUST NOT name the remaining balance. When no receipt id
exists yet, the body SHALL list none.

<!-- trace:scenario id=g10.auction-winner-order.SC-g9z rev=1 -->
#### Scenario: winner-order-SC-164 - Setup overdue names the lot, not an invoice
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose setup deadline has passed with no invoice
  issued, for lot title "Charizard Base Set PSA 10"
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction lot Charizard Base Set PSA 10: setup overdue`
- **AND** Message names that lot title and status Setup overdue
- **AND** Message names no invoice id

<!-- trace:scenario id=g10.auction-winner-order.SC-30l rev=2 -->
#### Scenario: winner-order-SC-165 - Payment overdue names the invoice
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose payment deadline has passed unpaid, with
  current invoice id `IN-LK42301` and lot title "Charizard Base Set PSA 10"
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42301: payment overdue`
- **AND** Message names that invoice id, that lot title, and status Payment
  overdue

<!-- trace:scenario id=g10.auction-winner-order.SC-kjq rev=2 -->
#### Scenario: winner-order-SC-166 - Partial payment may list receipts and never the balance
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** a partially paid auction order with current invoice id
  `IN-LK42301`, lot title "Charizard Base Set PSA 10", and receipt ids
  `RC-LK42301P1` and `RC-LK42301P2`
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42301: partial payment`
- **AND** Message may list those receipt ids
- **AND** Message names no remaining balance

<!-- trace:scenario id=g10.auction-winner-order.SC-hx5 rev=2 -->
#### Scenario: winner-order-SC-168 - A reissued invoice uses the current invoice id
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose payment deadline has passed unpaid after a
  reissue, with current invoice id `IN-LK42302` and a replaced invoice id
  `IN-LK42301`
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42302: payment overdue`
- **AND** Subject does not name `IN-LK42301`
