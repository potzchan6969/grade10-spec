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
  - Three ways to pay: SWIFT, FPS and Hong Kong local bank transfer details, with the payment reference to quote and copy controls for account number, amount due, and payment reference
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

## MODIFIED Requirements

### Requirement: Every invoice carries an invoice ID and a bank reference

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

#### Scenario: winner-order-SC-97 - A replaced invoice's identifiers still find the order
**Serves:** winner-order-US-17 - Winner quotes their order

- **GIVEN** an auction order whose first invoice an operator replaced with a reissue
- **WHEN** a payment quoting the first invoice's invoice ID, or the order's payment reference, is looked up
- **THEN** it finds that auction order
- **AND** the order's current invoice carries its own invoice ID, built from the same unchanged payment reference

#### Scenario: winner-order-SC-98 - A replaced invoice names its replacement
**Serves:** winner-order-US-18 - Winner reviews invoice and payment details

- **GIVEN** an auction order whose first invoice an operator replaced with a reissue
- **WHEN** the winner opens the first invoice's PDF
- **THEN** it says the invoice was replaced and names the new invoice's invoice ID
- **AND** the first invoice holds no invoice status and does not read `cancelled`

#### Scenario: winner-order-SC-114 - The invoice ID is shown on the order and the PDF
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** one auction order whose invoice was sent for card and one sent for bank transfer
- **WHEN** the winner opens each order and its invoice PDF
- **THEN** each order shows its invoice ID and its payment reference
- **AND** its PDF shows the same invoice ID
- **AND** the card order's payment reference is shown exactly as the bank transfer order's is

#### Scenario: winner-order-SC-122 - The invoice ID and bank reference use the payment reference
**Serves:** winner-order-US-18 - Winner reviews invoice and payment details

- **GIVEN** a lot on an order whose payment reference is `LK423`, with no invoice sent yet
- **WHEN** an operator sends its first invoice
- **THEN** the invoice ID is `IN-LK42301`

#### Scenario: winner-order-SC-123 - A reissue takes the next invoice number
**Serves:** Invoice - a reissue takes a new invoice ID while the payment reference stays put

- **GIVEN** an order whose payment reference is `LK423` and whose first invoice `IN-LK42301` was sent
- **WHEN** an operator reissues it
- **THEN** the new invoice ID is `IN-LK42302`
- **AND** the order's payment reference is still `LK423`, unchanged by the reissue
- **AND** looking up `IN-LK42301`, `IN-LK42302`, or `LK423` all find the same order
- **AND** the first invoice's PDF names `IN-LK42302`

#### Scenario: winner-order-SC-124 - The invoice count grows to three digits after 99
**Serves:** Invoice - a reissue takes a new invoice ID while the payment reference stays put

- **GIVEN** an order whose payment reference is `LK423` and whose latest invoice is `IN-LK42399`
- **WHEN** an operator reissues it
- **THEN** the new invoice ID is `IN-LK423100`
- **AND** the payment reference remains `LK423`

#### Scenario: winner-order-SC-125 - A listing code that is already held is hashed again
**Serves:** winner-order-US-17 - Winner quotes their order

- **GIVEN** a listing-code candidate collides with an active code or retained reservation
- **WHEN** its draft is first saved
- **THEN** allocation retries and stores a distinct valid 5-character code

#### Scenario: winner-order-SC-126 - A stored listing code never moves
**Serves:** winner-order-US-17 - Winner quotes their order

- **GIVEN** a listing already stores payment reference `LK423`
- **WHEN** the allocator implementation changes
- **THEN** the listing and its order continue to use `LK423`

#### Scenario: winner-order-SC-127 - The public listing page does not show the listing code
**Serves:** winner-order-US-17 - Winner quotes their order

- **GIVEN** a listing whose payment reference is `LK423`
- **WHEN** its public page or shared preview is fetched
- **THEN** the payment reference appears only as the lower-case canonical URL suffix
- **AND** no public representation exposes a labelled payment-reference field

#### Scenario: winner-order-SC-128 - Only a bank transfer invoice shows the bank reference
**Serves:** winner-order-US-18 - Winner reviews invoice and payment details

- **GIVEN** one pending invoice sent for card and one pending invoice sent for bank transfer
- **WHEN** the winner opens each invoice
- **THEN** both show the payment reference
- **AND** the card invoice requires no separate bank-reference identifier

#### Scenario: winner-order-SC-218 - The payment reference is shown unconditionally, not gated by payment method
**Serves:** winner-order-US-18 - Winner reviews invoice and payment details

- **GIVEN** one order whose `pending` invoice was sent for bank transfer, and one whose `pending` invoice was sent for card
- **WHEN** the winner opens each on Winner Order
- **THEN** both orders show the payment reference
- **AND** the bank transfer order's copy control for the payment reference copies exactly the payment reference

#### Scenario: winner-order-SC-219 - Stripe metadata carries the payment reference and never the provider reference to the winner
**Serves:** winner-order-US-18 - Winner reviews invoice and payment details

- **GIVEN** an auction order paid by card
- **WHEN** Grade10 creates the Stripe payment for that order
- **THEN** the Stripe payment's metadata carries `payment_reference_code` equal to the order's payment reference
- **AND** Stripe's own returned provider reference appears on no surface the winner reads

### Requirement: A finalized payment carries a receipt ID

Grade10 SHALL issue a receipt ID only when a full or partial payment has
finalized. The ID SHALL identify the invoice it pays and the receipt's sequence
within that invoice. This requirement changes only receipts issued after this
change is delivered; historical receipt IDs remain unchanged.

| Identifier | Format | Example |
| --- | --- | --- |
| Receipt ID | `RC-[CODE][INVOICE_SEQ]P[RECEIPT_SEQ]` | `RC-LK42301P1` |

| Part | Rule |
| --- | --- |
| `[CODE]` | The order's unchanged payment reference |
| `[INVOICE_SEQ]` | The sent invoice's sequence, without the `IN-` prefix |
| `[RECEIPT_SEQ]` | The count of finalized receipt-bearing payments for that invoice, starting at `1` and never padded |

**Allocation** - Grade10 SHALL allocate the next invoice-scoped receipt
sequence atomically with the finalized receipt. A refund, reversal or void
SHALL NOT allocate a receipt ID or rewrite one already issued. Formal
tax-receipt content remains outside this requirement.

#### Scenario: winner-order-SC-221 - A finalized first payment receives the new receipt ID
**Serves:** winner-order-US-18 - Winner reviews invoice and payment details

- **GIVEN** invoice `IN-LK42301` for an order whose payment reference is `LK423`
- **AND** it has no finalized receipt-bearing payment
- **WHEN** its first full or partial payment finalizes
- **THEN** its receipt ID is `RC-LK42301P1`

#### Scenario: winner-order-SC-222 - Each finalized payment advances only its invoice's receipt sequence
**Serves:** winner-order-US-18 - Winner reviews invoice and payment details

- **GIVEN** invoice `IN-LK42301` has receipts through `RC-LK42301P9`
- **WHEN** another partial payment for it finalizes
- **THEN** the receipt ID is `RC-LK42301P10`
- **AND** a finalized payment on invoice `IN-LK42302` starts at `RC-LK42302P1`

#### Scenario: winner-order-SC-223 - Historical and non-payment events do not receive the new receipt ID
**Serves:** winner-order-US-18 - Winner reviews invoice and payment details

- **GIVEN** a historical receipt ID is `REC-202609-LK7P2Q-01-P1`
- **WHEN** the receipt is read after this change is delivered
- **THEN** its ID remains unchanged
- **AND** a refund, reversal or void creates no receipt ID

#### Scenario: winner-order-SC-220 - Nothing identifying the lot's order is shown before a winner exists
**Serves:** winner-order-US-17 - Winner quotes their order

- **GIVEN** a lot that has not yet closed, and the same lot just after it closes with no winner
- **WHEN** anyone reads the lot outside a winning order
- **THEN** no payment reference, invoice ID, or receipt ID is shown for it
- **AND** the lot is identified only by its title
