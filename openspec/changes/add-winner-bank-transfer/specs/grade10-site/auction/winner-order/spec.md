## Purpose
What a winner is sent after a lot closes and what they do with it: one order
per lot, a delivery address and a payment method they choose, an operator's
invoice priced for both, payment by card or by a bank transfer they prove,
and the receipt, tracker and delivery proof the order keeps afterwards.

## Feature set

- Payment method
  - Chosen with the address: card or bank transfer, recorded when the winner confirms where to ship
  - Fee range at the choice: fixed text Grade10 sets, with no amount for bank transfer
  - Offered by currency: bank transfer only where bank details are set up
- Invoice
  - Fee priced by method: Payment Processing Fee is the card gross-up or the operator's bank transfer fee, never dropped
  - Identifier formats: an invoice ID and a bank reference built from the listing code, the month and the invoice count; a reissue takes new ones, and an old one still finds the order
  - Listing code: `L` and five characters, fixed for the listing's life, never on the public listing page
  - Internal audit number: one gapless count across invoices and receipts, never shown to the winner
  - Replaced invoice: an invoice a reissue replaced says so and names its replacement
- Bank transfer
  - Three ways to pay: SWIFT, FPS and Hong Kong local bank transfer details, with the bank reference to quote and a Copy Reference Code control
  - Payment proof: one upload of 1 to 5 files, behind a confirm step
  - Payment Verifying: the deadline stops, card Pay and further uploads are hidden
  - Proof not accepted: the latest reason the winner reads, and the deadline running again with the time that was left
- Records the winner keeps
  - Receipt ID and breakdown: every receipt has a unique receipt ID and shows what was billed, paid and left to pay
  - Retention: every invoice and receipt PDF kept at least 7 years, or for the life of the account if longer

## ADDED Requirements

### Requirement: The winner chooses a payment method with the address

When the winner confirms a delivery address on an auction order, Winner Order
SHALL also ask how they will pay:

1. Choose card or bank transfer.
2. Read the fee range Grade10 sets for each method.
3. Confirm the address and the method together.

Grade10 SHALL preselect neither method and SHALL record the chosen method on
the order. The fee range for each
method SHALL be fixed text Grade10 sets; its wording is TBC. The bank transfer
text SHALL name no amount, since an operator sets that fee on the invoice.

Grade10 SHALL offer bank transfer only in a currency with bank details set up.

| Currency | Methods offered |
| --- | --- |
| HKD | Card, bank transfer |
| USD | Card |
| JPY | Card |

Grade10 SHALL refuse a confirmation with no method chosen, and SHALL refuse
bank transfer on an order whose currency does not offer it. Until the invoice
is sent, the winner SHALL be able to change the method the same way they
change the address; nothing is reissued. After send, only an operator changes
it, per "The delivery address locks when the invoice is sent".

#### Scenario: winner-order-SC-90 - The method is recorded with the address
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in HKD Awaiting Address
- **WHEN** the winner confirms a delivery address and chooses bank transfer
- **THEN** the order records bank transfer as its payment method
- **AND** the order derives as Preparing Invoice

#### Scenario: winner-order-SC-91 - The choice shows a fee range and no bank transfer amount
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in HKD Awaiting Address
- **WHEN** the winner reaches the payment method choice
- **THEN** card and bank transfer each show the fee range text Grade10 set
- **AND** the bank transfer text names no amount
- **AND** neither method is selected

#### Scenario: winner-order-SC-92 - A currency with no bank details offers card only
**Serves:** Payment method - bank transfer only where bank details are set up

- **GIVEN** an auction order in USD Awaiting Address
- **WHEN** the winner reaches the payment method choice
- **THEN** only card is offered
- **AND** a confirmation carrying bank transfer for that order is refused

#### Scenario: winner-order-SC-93 - The method can change before the invoice is sent
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD in Preparing Invoice whose recorded method is card
- **WHEN** the winner changes the method to bank transfer and confirms
- **THEN** the order records bank transfer
- **AND** the order is still Preparing Invoice

#### Scenario: winner-order-SC-94 - A confirmation with no method is refused
**Serves:** Payment method - card or bank transfer recorded with the address

- **GIVEN** an auction order in HKD Awaiting Address
- **WHEN** the winner confirms a delivery address without choosing a method
- **THEN** Grade10 refuses the confirmation
- **AND** the order is still Awaiting Address

### Requirement: A bank transfer invoice shows how to pay

While an invoice sent for bank transfer is `pending`, Winner Order SHALL show
these three ways to pay in place of card Pay. Each SHALL ask the winner to
quote the invoice's bank reference, shown beside a **Copy Reference Code**
control that copies it. The account details are TBC.

| Way to pay | Details shown |
| --- | --- |
| SWIFT | Beneficiary name, SWIFT/BIC, account number or IBAN |
| FPS | FPS ID, beneficiary name |
| Hong Kong local bank transfer | Bank name and bank code, beneficiary name, account number |

Grade10 SHALL offer no card Pay control on a bank transfer invoice and SHALL
refuse a card payment attempted against one. A winner who wants to pay by card
asks Grade10, and an operator reissues the invoice.

#### Scenario: winner-order-SC-95 - A bank transfer invoice shows three ways and the reference
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** the winner opens Winner Order
- **THEN** SWIFT, FPS and Hong Kong local bank transfer details are shown with the fields above
- **AND** each asks the winner to quote the bank reference
- **AND** no card Pay control is offered

#### Scenario: winner-order-SC-96 - A card payment on a bank transfer invoice is refused
**Serves:** Bank transfer - card Pay is not offered on a bank transfer invoice

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** a card payment is attempted for that invoice
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

### Requirement: Every invoice carries an invoice ID and a bank reference

Grade10 SHALL give every invoice, card or bank transfer, an invoice ID and a
bank reference when it is sent. Each SHALL be unique across all invoices.

| Identifier | Format | Example |
| --- | --- | --- |
| Invoice ID | `INV-[YYYYMM]-[LISTING_ID]-[SEQ]` | `INV-202609-LK7P2Q-01` |
| Bank reference | `[LISTING_ID][SEQ]` | `LK7P2Q01` |

| Part | Rule |
| --- | --- |
| `[YYYYMM]` | The year and month the invoice is sent, in Hong Kong time. A reissue sent in a later month carries that month |
| `[LISTING_ID]` | The listing code of the lot's listing, below |
| `[SEQ]` | The count of the listing's invoices: `01` for the first invoice sent, the next number on each reissue. Two digits, then three after `99` |

The bank reference SHALL hold only capital letters and digits, with no hyphen,
space or other symbol. It is 8 characters, or 9 once `[SEQ]` passes `99`, so
it fits SWIFT's 35-character remittance line.

Winner Order and the invoice PDF SHALL show the invoice ID. Grade10 SHALL show
the winner the bank reference only on a bank transfer invoice, per "A bank
transfer invoice shows how to pay"; a card invoice's bank reference is shown to
operators only.

Each listing SHALL hold a listing code, assigned no later than when the listing
is published: `L` followed by 5 characters drawn from capital letters and
digits other than `0`, `O`, `1` and `I`. Grade10 SHALL derive the code from a
hash of the listing's internal id. When the result is already held by another
listing, Grade10 SHALL hash again with a counter until the code is unique. The
code SHALL be stored, unique across all listings, and never changed or reused.
A later change of hash method SHALL NOT move a stored code. The winner SHALL
see the listing code only as part of the invoice ID; the public listing page
SHALL NOT show it.

A reissue replaces the current invoice with a new one, per
`grade10-admin/auction/post-sale`, and the new invoice SHALL take a new invoice
ID and a new bank reference. Looking up the invoice ID or bank reference of any
invoice, including a replaced invoice's, SHALL find its auction order. A
replaced invoice SHALL hold no invoice status of its own and SHALL never read
`cancelled`; the order's invoice status is its current invoice's, per
`grade10-site/auction/order-status`. The PDF of a replaced invoice SHALL say it
was replaced and SHALL name the invoice ID of the invoice that replaced it.

#### Scenario: winner-order-SC-97 - A replaced invoice's identifiers still find the order
**Serves:** Invoice - an old identifier still finds the order after a reissue

- **GIVEN** an auction order whose first invoice an operator replaced with a reissue
- **WHEN** a payment quoting the first invoice's bank reference, or its invoice ID, is looked up
- **THEN** it finds that auction order
- **AND** the order's current invoice carries its own invoice ID and bank reference

#### Scenario: winner-order-SC-98 - A replaced invoice names its replacement
**Serves:** Invoice - a replaced invoice says so and names its replacement

- **GIVEN** an auction order whose first invoice an operator replaced with a reissue
- **WHEN** the first invoice's PDF is opened
- **THEN** it says the invoice was replaced and names the new invoice's invoice ID
- **AND** the first invoice holds no invoice status and does not read `cancelled`

#### Scenario: winner-order-SC-114 - The invoice ID is shown on the order and the PDF
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** one auction order whose invoice was sent for card and one sent for bank transfer
- **WHEN** the winner opens each order and its invoice PDF
- **THEN** each order shows its invoice ID
- **AND** its PDF shows the same invoice ID

#### Scenario: winner-order-SC-122 - The invoice ID and bank reference take the Hong Kong month
**Serves:** Invoice - identifier formats

- **GIVEN** a lot on the listing whose listing code is `LK7P2Q`, with no invoice sent yet
- **WHEN** an operator sends its first invoice at 2026-09-30T17:00:00Z, which is 1 October in Hong Kong
- **THEN** the invoice ID is `INV-202610-LK7P2Q-01`
- **AND** the bank reference is `LK7P2Q01`

#### Scenario: winner-order-SC-123 - A reissue takes the next number and its own month
**Serves:** Invoice - a reissue takes new identifiers

- **GIVEN** an order on listing `LK7P2Q` whose first invoice `INV-202609-LK7P2Q-01` was sent in September 2026
- **WHEN** an operator reissues it at 2026-10-02T02:00:00Z
- **THEN** the new invoice ID is `INV-202610-LK7P2Q-02` and its bank reference is `LK7P2Q02`
- **AND** looking up `LK7P2Q01` or `INV-202609-LK7P2Q-01` finds the same order
- **AND** the first invoice's PDF names `INV-202610-LK7P2Q-02`

#### Scenario: winner-order-SC-124 - The invoice count grows to three digits after 99
**Serves:** Invoice - identifier formats

- **GIVEN** an order on listing `LK7P2Q` whose current invoice is `INV-202609-LK7P2Q-99`
- **WHEN** an operator reissues it in September 2026
- **THEN** the new invoice ID is `INV-202609-LK7P2Q-100`
- **AND** the bank reference is `LK7P2Q100`, 9 characters of capital letters and digits

#### Scenario: winner-order-SC-125 - A listing code that is already held is hashed again
**Serves:** Invoice - listing code

- **GIVEN** a listing about to be published whose internal id hashes to a code another listing already holds
- **WHEN** the listing is published
- **THEN** it holds a code Grade10 derived by hashing again with a counter
- **AND** the code is `L` and 5 characters with no `0`, `O`, `1` or `I`, held by no other listing

#### Scenario: winner-order-SC-126 - A stored listing code never moves
**Serves:** Invoice - listing code

- **GIVEN** a published listing whose stored listing code is `LK7P2Q`
- **WHEN** Grade10 changes the hash method it derives codes with
- **THEN** the listing still holds `LK7P2Q`
- **AND** no other listing is given `LK7P2Q`

#### Scenario: winner-order-SC-127 - The public listing page does not show the listing code
**Serves:** Invoice - listing code

- **GIVEN** a published listing whose listing code is `LK7P2Q`
- **WHEN** anyone opens its public listing page
- **THEN** `LK7P2Q` appears nowhere on the page

#### Scenario: winner-order-SC-128 - Only a bank transfer invoice shows the bank reference
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** one order whose `pending` invoice was sent for bank transfer with bank reference `LK7P2Q01`, and one whose `pending` invoice was sent for card
- **WHEN** the winner opens each on Winner Order and chooses Copy Reference Code on the first
- **THEN** the first shows `LK7P2Q01` and the copied text is exactly `LK7P2Q01`
- **AND** the card order shows no bank reference and no Copy Reference Code control

### Requirement: Invoices and receipts carry an internal audit number

Grade10 SHALL give every invoice and every receipt an internal audit number
when it is issued: one gapless sequence shared by invoices and receipts, in
the order they are issued, for example `#00010482`. A replaced invoice SHALL
keep its number, and a reissue SHALL take the next one. The number SHALL NOT
reach the winner: not on any PDF, letter, or Winner Order. Operators read it
per `grade10-admin/auction/post-sale`.

#### Scenario: winner-order-SC-129 - The winner never sees the internal audit number
**Serves:** Invoice - internal audit number

- **GIVEN** a paid order whose invoice holds internal audit number `#00010482` and whose receipt holds `#00010483`
- **WHEN** the winner opens Winner Order, the invoice PDF, the receipt PDF and every letter sent about the order
- **THEN** neither `#00010482` nor `#00010483` appears in any of them

#### Scenario: winner-order-SC-130 - Invoices and receipts share one gapless count
**Serves:** Invoice - internal audit number

- **GIVEN** the last internal audit number issued is `#00010481`
- **WHEN** an operator sends an invoice, then reissues it, then the winner pays the new invoice by card, with nothing else issued meanwhile
- **THEN** the first invoice holds `#00010482`, the new invoice `#00010483` and the receipt `#00010484`
- **AND** the replaced invoice still holds `#00010482`

### Requirement: The winner uploads payment proof once

On an invoice sent for bank transfer whose status is `pending`, the winner
SHALL be able to send Grade10 proof of payment once:

1. Choose 1 to 5 files, each a PDF, JPEG or PNG of at most 10 MB
   (10,485,760 bytes).
2. Read a confirm step saying nothing can be added after upload.
3. Confirm.

On confirm Grade10 SHALL store the files against the invoice, set the invoice
status to `payment_verifying`, stop the payment deadline and record the time
left, per `grade10-site/auction/order-status`, and write a proof-uploaded
entry to the invoice log. The order SHALL derive as Payment Verifying. No
letter is sent.

While the invoice is `payment_verifying`, Winner Order SHALL show no payment
deadline running, SHALL offer no card Pay and no upload, and SHALL refuse a
further upload.

Grade10 SHALL refuse the whole upload and store nothing when any file breaks
step 1, SHALL refuse a confirm with no file, and SHALL refuse an upload on a
card invoice, on any invoice not `pending`, and from anyone but the order's
winner. Leaving the confirm step without confirming SHALL store nothing. An
upload that fails part-way SHALL store nothing and leave the invoice
`pending`, and the winner may upload again; the one upload counts only once
an upload succeeds.

Proof files SHALL be readable by any operator who can open the order, per
`grade10-admin/auction/post-sale`, and never by the winner. Winner Order, the
receipt and every letter SHALL show no proof file and no file name, the
winner's or an operator's. Only the Payment Verifying status shows that proof
was sent.

#### Scenario: winner-order-SC-99 - Uploading proof stops the deadline
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice, `pending`, with a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** the winner uploads two PDF files and confirms at 2026-09-13T09:00:00Z
- **THEN** the invoice is `payment_verifying` and the order derives as Payment Verifying
- **AND** the time left recorded is 6 days
- **AND** Winner Order offers no card Pay and no further upload

#### Scenario: winner-order-SC-100 - Files outside the limits are refused
**Serves:** Bank transfer - one upload of 1 to 5 files

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner confirms six files, or a PNG with a JPEG of 10,485,761 bytes, or a PDF with a GIF
- **THEN** Grade10 refuses each whole upload
- **AND** stores no file
- **AND** the invoice is still `pending`

#### Scenario: winner-order-SC-101 - A second upload is refused
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an invoice that is `payment_verifying`
- **WHEN** an upload is attempted against it
- **THEN** Grade10 refuses it
- **AND** the files already stored are unchanged

#### Scenario: winner-order-SC-102 - Leaving the confirm step uploads nothing
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner chooses one PNG, reads the confirm step, and leaves without confirming
- **THEN** no file is stored
- **AND** the invoice is still `pending` and the winner can upload

#### Scenario: winner-order-SC-103 - No upload on an expired or card invoice
**Serves:** Bank transfer - proof is uploaded only on a pending bank transfer invoice

- **GIVEN** one bank transfer invoice that is `expired` and one card invoice that is `pending`
- **WHEN** an upload is attempted against each
- **THEN** Grade10 refuses both
- **AND** neither invoice changes status

#### Scenario: winner-order-SC-115 - The winner never sees proof files
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose winner uploaded "transfer-slip.pdf", which an operator confirmed after adding a bank statement
- **WHEN** the winner opens Winner Order and the receipt, and requests either stored file
- **THEN** neither file nor its name is shown
- **AND** Grade10 refuses both requests

#### Scenario: winner-order-SC-116 - A file of exactly 10 MB is accepted
**Serves:** Bank transfer - one upload of 1 to 5 files

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner uploads one PDF of 10,485,760 bytes and confirms
- **THEN** the invoice is `payment_verifying`

#### Scenario: winner-order-SC-117 - A card payment while proof is checked is refused
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an invoice that is `payment_verifying`
- **WHEN** a card payment is attempted for it
- **THEN** Grade10 refuses it and makes no charge
- **AND** the invoice is still `payment_verifying`

#### Scenario: winner-order-SC-118 - No upload before send or after payment
**Serves:** Bank transfer - proof is uploaded only on a pending bank transfer invoice

- **GIVEN** one order in Preparing Invoice with bank transfer chosen, and one whose bank transfer invoice is `paid`
- **WHEN** the winner opens each, and an upload is attempted against each
- **THEN** neither offers an upload
- **AND** Grade10 refuses both attempts

#### Scenario: winner-order-SC-119 - An upload that fails part-way stores nothing
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner confirms three files and the upload fails before it completes
- **THEN** no file is stored and the invoice is still `pending`
- **AND** the winner can upload again

#### Scenario: winner-order-SC-121 - Another collector cannot upload proof
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose bank transfer invoice is `pending`, won by another collector
- **WHEN** a signed-in collector who is not its winner attempts an upload against it
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

### Requirement: Returned proof reopens the invoice

When an operator returns a `payment_verifying` invoice to `pending`, per
`grade10-admin/auction/post-sale`, Winner Order SHALL show the operator's
latest external reason and the new payment deadline, which is the moment of return
plus the time left at upload. No grace is added, however little time was
left. The winner SHALL then be able to upload proof again, under the same
rules as the first upload. The operator's internal reason SHALL NOT be shown
to the winner. After a second return Winner Order SHALL show only the latest
external reason; the invoice log keeps every reason, per
`grade10-admin/auction/post-sale`.

#### Scenario: winner-order-SC-104 - A returned invoice shows the reason and the time that was left
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice the winner uploaded proof for at 2026-09-13T09:00:00Z, with a deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator returns it at 2026-09-16T09:00:00Z with the external reason "Amount does not match" and an internal reason
- **THEN** the invoice is `pending` with a payment deadline of 2026-09-22T09:00:00Z
- **AND** Winner Order shows "Amount does not match"
- **AND** Winner Order does not show the internal reason

#### Scenario: winner-order-SC-105 - A returned invoice accepts a new upload
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice an operator returned to `pending`
- **WHEN** the winner uploads one PDF and confirms
- **THEN** the invoice is `payment_verifying`
- **AND** the deadline stops again with the time left recorded

#### Scenario: winner-order-SC-120 - A return adds no grace
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice that became `payment_verifying` with 1 minute left
- **WHEN** an operator returns it at 2026-09-16T09:00:00Z and 2026-09-16T09:01:00Z passes unpaid
- **THEN** the invoice is `expired` and the order reads Pending Payment
- **AND** Winner Order offers no upload and shows Contact Us in its overdue alert

#### Scenario: winner-order-SC-134 - Only the latest return reason is shown
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice an operator returned with the external reason "Amount does not match", then returned again with "Reference missing" after a second upload
- **WHEN** the winner opens Winner Order
- **THEN** it shows "Reference missing"
- **AND** it does not show "Amount does not match"
- **AND** the invoice log holds both reasons

## MODIFIED Requirements

### Requirement: The delivery address locks when the invoice is sent

Grade10 SHALL lock the delivery address and the payment method on an auction
order when an operator sends its invoice, and SHALL offer the winner no
self-service change to either afterwards. The order SHALL show the locked
address and method and that a change goes through Grade10. A change of
address or method after send SHALL happen only through an operator reissue,
per `grade10-admin/auction/post-sale`.

Grade10 SHALL NOT offer a partial refund or a supplementary charge for a
shipping difference discovered after payment.

#### Scenario: winner-order-SC-29 - A sent invoice refuses a self-service address change
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice has been sent and is `pending`
- **WHEN** the winner attempts to change the delivery address
- **THEN** Grade10 refuses the change
- **AND** the order shows the locked address and that a change goes through Grade10

#### Scenario: winner-order-SC-30 - A paid order refuses a self-service address change
**Serves:** `winner-order-US-01`, `winner-order-US-02` - the address stops moving, whether the winner is still settling or already settled

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** the winner attempts to change the delivery address
- **THEN** Grade10 refuses the change
- **AND** the delivery address is unchanged

#### Scenario: winner-order-SC-106 - A sent invoice refuses a self-service method change
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice was sent for card and is `pending`
- **WHEN** the winner attempts to change the payment method to bank transfer
- **THEN** Grade10 refuses the change
- **AND** the invoice's method is still card

### Requirement: The payment deadline is fixed when the invoice is sent

The payment deadline SHALL be 7 calendar days from the moment an operator
sends the invoice. Grade10 SHALL fix it at send, store it in UTC, and display
it in the winner's own timezone on both the invoice and the auction order, per
`shared/dates-and-times`.

Nothing the winner does SHALL move the deadline — not a failed payment, and
not leaving the order untouched — except uploading payment proof, which stops
it, per "The winner uploads payment proof once". While the invoice is
`payment_verifying` the deadline SHALL NOT run. When an operator returns the
proof, the deadline SHALL be the moment of return plus the time left at
upload. Otherwise only an operator SHALL set a new deadline, by reissuing the
invoice, per `grade10-admin/auction/post-sale`.

An auction order with no sent invoice SHALL have no payment deadline, and its
invoice status SHALL never become `expired`. The winner-facing address confirm
window is separate and does not write `expired` on the invoice.

When the deadline passes with the invoice `pending`, Grade10 SHALL set the
invoice status to `expired`, per `grade10-site/auction/order-status`. The
order still reads Pending Payment. The winner SHALL NOT be offered card
payment or proof upload while the invoice is `expired`; the order SHALL show
Contact Us in its overdue alert. An operator SHALL restore self-service
payment only by reissuing the invoice to `pending`, or SHALL settle manually
or cancel, per `grade10-admin/auction/post-sale`.

#### Scenario: winner-order-SC-31 - The deadline is seven days from send
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice an operator sent at
  2026-09-12T09:00:00Z
- **WHEN** the winner reads the invoice
- **THEN** the payment deadline is 2026-09-19T09:00:00Z
- **AND** it is displayed in the winner's own timezone as an absolute datetime
- **AND** no countdown is shown

#### Scenario: winner-order-SC-33 - A declined payment does not move the deadline
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose sent invoice has a payment deadline of
  2026-09-19T09:00:00Z
- **WHEN** the winner's card is declined twice
- **THEN** the payment deadline is still 2026-09-19T09:00:00Z

#### Scenario: winner-order-SC-37 - An expired invoice refuses card payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** the winner opens the order
- **THEN** Grade10 offers no card Pay control
- **AND** the overdue alert carries Contact Us
- **AND** a card payment attempt for that invoice is refused

#### Scenario: winner-order-SC-107 - A deadline that passes while proof is checked expires nothing
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an invoice that became `payment_verifying` at 2026-09-13T09:00:00Z with a deadline of 2026-09-19T09:00:00Z
- **WHEN** 2026-09-20T09:00:00Z arrives with no operator action
- **THEN** the invoice is still `payment_verifying`
- **AND** the order derives as Payment Verifying

### Requirement: Winner Order shows five progress steps

Winner Order SHALL present settlement progress as five steps in this order:
**Address**, **Invoice**, **Payment**, **Shipped**, **Completed**. The steps
SHALL be presentation only and SHALL NOT replace the nine-value derived order
status vocabulary in `grade10-site/auction/order-status`.

| Current step | Derived order status |
| --- | --- |
| Address | Awaiting Address |
| Invoice | Preparing Invoice |
| Payment | Pending Payment (invoice `pending` or `expired`) or Payment Verifying |
| Shipped | Processing or Shipped |
| Completed | Delivered |

When the derived order status is **Cancelled** or **Refunded**, Winner Order
SHALL show no progress stepper.

Step subtext SHALL use day-only dates in the winner's zone. While Address is
current and awaiting confirm, subtext SHALL read `Confirm by {date}`. While
Payment is current and the invoice is `pending`, subtext SHALL read
`Pay by {date}`. While the invoice is `payment_verifying`, Payment subtext
SHALL name no date. Description copy SHALL wrap so five columns do not
overflow.

#### Scenario: winner-order-SC-54 - Pending Payment highlights the Payment step
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose derived status is Pending Payment
- **WHEN** the winner opens Winner Order
- **THEN** the progress stepper marks Payment as the current step
- **AND** Address and Invoice are complete

#### Scenario: winner-order-SC-55 - Processing maps under Shipped
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose derived status is Processing
- **WHEN** the winner opens Winner Order
- **THEN** the progress stepper marks Shipped as the current step
- **AND** does not invent a Processing step label

#### Scenario: winner-order-SC-56 - Cancelled hides the stepper
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose derived status is Cancelled
- **WHEN** the winner opens Winner Order
- **THEN** no progress stepper is shown

#### Scenario: winner-order-SC-66 - Progress dates are day-only
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice is `pending` with a payment deadline
  of 2026-09-26T03:00:00Z
- **WHEN** the winner opens Winner Order
- **THEN** Payment step subtext reads Pay by with the day-only date
- **AND** the Pay control still shows the absolute datetime with time

#### Scenario: winner-order-SC-108 - Payment Verifying stays on the Payment step with no date
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose derived status is Payment Verifying
- **WHEN** the winner opens Winner Order
- **THEN** the progress stepper marks Payment as the current step
- **AND** the Payment subtext names no date

### Requirement: The winner can view the sent invoice as a PDF

Once an operator has sent an invoice on an auction order, Winner Order SHALL
offer the winner a control to view and download the current invoice as a PDF.
The control SHALL use a PDF icon with the label **Invoice** (accessible name
Invoice PDF). The control SHALL be hidden while the invoice status is
`not_issued` and SHALL be hidden when the invoice status is `cancelled`. The
PDF SHALL carry the invoice ID and the payment method it was sent for.

#### Scenario: winner-order-SC-57 - A sent invoice offers its PDF
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `pending`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers view and download of the invoice PDF

#### Scenario: winner-order-SC-64 - No invoice PDF before send
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `not_issued`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no invoice PDF control

#### Scenario: winner-order-SC-65 - A cancelled order hides the invoice PDF
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `cancelled`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no invoice PDF control

#### Scenario: winner-order-SC-109 - A reissued order offers the current invoice
**Serves:** Invoice - a replaced invoice says so and names its replacement

- **GIVEN** an auction order whose first invoice an operator replaced with a reissue
- **WHEN** the winner opens the invoice PDF from Winner Order
- **THEN** it is the new invoice, carrying the new invoice ID

### Requirement: The winner can view the payment receipt as a PDF

After payment is confirmed on an auction order — by the winner's card, by an
operator confirming the winner's bank transfer proof, or by operator manual
settlement — Winner Order SHALL offer the winner a control to view and
download the itemised payment receipt as a PDF. The control SHALL use a PDF
icon with the label **Receipt** (accessible name Receipt PDF) and SHALL sit on
the same row as the invoice PDF when both exist. The control SHALL be hidden
before payment, while the invoice is `payment_verifying`, and when Cancelled.

#### Scenario: winner-order-SC-67 - A paid order offers its receipt PDF
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers view and download of the receipt PDF
- **AND** the Invoice PDF control remains available on the same row

#### Scenario: winner-order-SC-68 - No receipt PDF before payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `pending` or `payment_verifying`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no receipt PDF control

### Requirement: Invoice fields

Each invoice SHALL carry these fields. Every amount SHALL be an integer count
of minor units paired with the lot's ISO 4217 currency code, rendered per
`shared/money-amounts`. An invoice exists only once an operator sends it.

| Field | Notes |
| --- | --- |
| Auction order | The order this invoice is the payable record for. An order holds one current invoice, and any invoices a reissue replaced |
| Invoice ID | Given at send, per "Every invoice carries an invoice ID and a bank reference". Finds the order, including after a reissue |
| Bank reference | Given at send, on every invoice. Shown to the winner only on a bank transfer invoice. Finds the order, including after a reissue |
| Internal audit number | Given at send, per "Invoices and receipts carry an internal audit number". Never shown to the winner |
| Lot | The single lot invoiced. Named unambiguously, since a winner may hold several |
| Payment method | Card or bank transfer. The winner's choice at send, or the operator's at a reissue |
| Winning bid | The accepted bid that won the lot, excluding every other component |
| Buyer's premium | The applicable fee. This capability fixes no rate |
| Shipping & Handling | Quoted by an operator for the order's confirmed delivery address. Zero or more |
| Insurance | Optional. Added by an operator for the order's confirmed delivery address, and greater than zero when added |
| Tax | An optional line reserved for the separate tax change; no rate or regime is defined here |
| Subtotal | The sum of the components above |
| Payment processing fee | Priced by the payment method, below. On every invoice, and never dropped |
| Order total | The total payable — the subtotal plus the payment processing fee |
| Sent at | When the operator sent the invoice. Stored in UTC |
| Payment deadline | 7 calendar days from Sent at, stopped while proof is checked. Stored in UTC, displayed in the winner's own zone |
| Replaced by | On a replaced invoice only: the invoice that replaced it |
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
**Free**, SHALL show a Payment Processing Fee of zero as **Free**, and SHALL
leave the Insurance line out when the operator added none. Insurance and
Payment Processing Fee are separate lines: omitting Insurance does not replace
it with the fee.

On Winner Order's order summary, Grade10 SHALL offer brief info tooltips beside
**Buyer’s Premium**, **Shipping & Handling**, and **Payment Processing Fee**
when those lines are shown. The Payment Processing Fee tooltip SHALL describe
the fee for the invoice's method briefly and SHALL NOT restate the gross-up
formula.

The on-page Winner Order summary MAY omit a separate Subtotal row and show the
fee lines that apply plus Order Total; the invoice and receipt itemisation
SHALL still carry Subtotal.

No component SHALL be marked as an estimate. Grade10 SHALL NOT show the winner
an invoice amount before an operator has sent it.

#### Scenario: winner-order-SC-04 - An estimated total is marked as one
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent a bank transfer invoice with a winning bid of
  250000, a buyer's premium of 50000, shipping of 8000, insurance of 4000 and
  a payment processing fee of 0 minor units in HKD
- **WHEN** the winner reads the invoice
- **THEN** the order total is 312000 minor units in HKD
- **AND** no component is marked as an estimate

#### Scenario: winner-order-SC-05 - A confirmed address makes the total firm
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose winner confirmed a delivery address
- **AND** an operator sent an invoice with Shipping & Handling quoted for that
  address, with Insurance when added
- **WHEN** the winner reads the invoice
- **THEN** its total is the order total for that address
- **AND** no component is marked as an estimate

#### Scenario: winner-order-SC-62 - The fee grosses the subtotal up
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent a card invoice whose subtotal is 312000 minor units in HKD
- **AND** the payment provider's fees for HKD at that moment were 235 minor units and 3.4 per cent
- **WHEN** the winner reads the invoice
- **THEN** the payment processing fee is 11225 minor units in HKD
- **AND** the order total is 323225 minor units in HKD

#### Scenario: winner-order-SC-63 - A manually settled order keeps its fee
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a bank transfer invoice with a subtotal of 312000 and a payment
  processing fee of 5000 minor units in HKD
- **WHEN** an operator settles it manually and the winner reads the receipt
- **THEN** the payment processing fee of 5000 minor units in HKD is shown
- **AND** the amount settled is the order total of 317000 minor units in HKD

#### Scenario: winner-order-SC-38 - Shipping & Handling of zero reads Free
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with Shipping & Handling of 0 minor units in HKD
- **WHEN** the winner opens the order
- **THEN** the Shipping & Handling line reads Free

#### Scenario: winner-order-SC-39 - An invoice with no insurance shows no Insurance line
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice without adding insurance
- **WHEN** the winner opens the order
- **THEN** no Insurance line is shown
- **AND** the Payment Processing Fee line is still shown, whatever the method
- **AND** the order total is the sum of the lines that are shown

#### Scenario: winner-order-SC-69 - Fee lines carry info tooltips
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with Buyer’s Premium, Shipping &
  Handling, and Payment Processing Fee
- **WHEN** the winner opens Winner Order
- **THEN** each of those three lines offers a brief info tooltip
- **AND** the Payment Processing Fee tooltip does not describe the gross-up
  formula

#### Scenario: winner-order-SC-110 - A bank transfer fee is the amount the operator entered
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an operator sent a bank transfer invoice with a subtotal of 312000
  and a bank transfer fee of 5000 minor units in HKD
- **WHEN** the winner reads the invoice
- **THEN** the payment processing fee is 5000 minor units in HKD
- **AND** the order total is 317000 minor units in HKD

#### Scenario: winner-order-SC-111 - A bank transfer fee of zero reads Free
**Serves:** Invoice - Payment Processing Fee priced by method

- **GIVEN** an operator sent a bank transfer invoice with a subtotal of 312000
  and a bank transfer fee of 0 minor units in HKD
- **WHEN** the winner opens the order
- **THEN** the Payment Processing Fee line is shown and reads Free
- **AND** the order total is 312000 minor units in HKD

### Requirement: The delivery address is confirmed before payment

Grade10 SHALL require the winner to confirm a delivery address and a payment
method on the auction order before an operator can send its invoice. When an
account default exists, Grade10 SHALL pre-fill the address from it, but the
default SHALL not become the order's destination until the winner confirms or
selects an address. Grade10 SHALL pre-select no payment method.

| Condition | Behaviour |
| --- | --- |
| Account has a default shipping address | Grade10 pre-fills it. The winner still confirms explicitly |
| Account has no default shipping address | The address is empty. The winner adds one and confirms it |
| Account has multiple saved addresses | Grade10 lets the winner choose one, then confirms the selected address for this order |
| Winner changes the address or method before the invoice is sent | The order takes the new snapshot and stays ready for a quote. Nothing is reissued |
| Winner asks to change the address or method after the invoice is sent | Refused on the order. An operator reissues on request |
| Winner adds or edits an address | Grade10 offers to save it to the account address book. The order keeps a snapshot |

#### Scenario: winner-order-SC-07 - A pre-filled default still needs confirming
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order pre-filled from the account's default shipping address
- **WHEN** the winner leaves the order without confirming that address
- **THEN** the order's derived status is still Awaiting Address
- **AND** an operator cannot send its invoice

#### Scenario: winner-order-SC-08 - An amendment does not touch the address book by default
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner amending the delivery address on one auction order
- **AND** they leave the offer to save the amendment to the account address book untaken
- **WHEN** they confirm the amendment
- **THEN** that auction order carries the amended address
- **AND** their saved address book is unchanged

### Requirement: The bid-time hold is released, never captured

When a bid-time authorization exists, Grade10 SHALL release it on every bidder
of a closing lot, winner and losing bidders alike, and SHALL NOT leave a losing
bidder's authorization to expire on its own.

Grade10 SHALL NOT capture or increment a bid-time authorization as any part
of settlement. The winner SHALL pay by the method the invoice was sent for:

| Invoice method | How the winner pays |
| --- | --- |
| Card | A single new card transaction for the order total, against a stored card or another card they enter |
| Bank transfer | A transfer they make themselves, then proof uploaded per "The winner uploads payment proof once" |

Cash and every other method are recorded by an operator alone, per
`grade10-admin/auction/post-sale`.

Releasing an authorization that has already expired SHALL succeed as a
no-op. Grade10 SHALL NOT treat an expired authorization as a failure.

A refused or failed card payment SHALL NOT void the invoice. While a card
invoice's status is `pending`, it SHALL remain payable by card and the winner
SHALL be able to retry with the same or a different card. When the invoice
status is `expired` or `payment_verifying`, Grade10 SHALL NOT offer or accept
winner card payment.

#### Scenario: winner-order-SC-12 - The winning hold is released and the invoice is a fresh charge
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner holding an open bid-time authorization on the closing lot
- **WHEN** the lot closes
- **THEN** Grade10 releases that authorization at close without capturing it
- **AND** after an operator later sends a card invoice, the winner's payment is a
  single new transaction for the order total

#### Scenario: winner-order-SC-13 - An expired hold releases as a no-op
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner whose bid-time authorization expired before the lot closed
- **WHEN** the lot closes
- **THEN** Grade10 records the release as successful
- **AND** creates the auction order as normal

#### Scenario: winner-order-SC-14 - A losing bidder's hold is released at close
**Serves:** winner-order-US-01 - the lot close that opens the winner's order also frees every losing hold

- **GIVEN** a lot closing with one winner and three losing bidders holding
  open authorizations
- **WHEN** the lot closes
- **THEN** Grade10 releases all three losing authorizations
- **AND** does not wait for them to expire

#### Scenario: winner-order-SC-15 - A declined payment leaves the invoice payable
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an unpaid card invoice inside its payment deadline
- **WHEN** the winner's payment is declined
- **THEN** the invoice status remains `pending`
- **AND** the winner can retry with the same or a different card

#### Scenario: winner-order-SC-35 - The winner is offered card payment only
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice was sent for card and is `pending`
- **WHEN** the winner opens the order to pay
- **THEN** Grade10 offers card payment
- **AND** shows no bank transfer details, no proof upload, and no cash or other method

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
| Delivery proof | `delivery_confirmed` is set | Whatever the carrier provided — handover timestamp, signature, proof-of-delivery image |

Every receipt SHALL carry a receipt ID, unique across all receipts:
`REC-[YYYYMM]-[LISTING_ID]-[SEQ]-P[INDEX]`, for example
`REC-202609-LK7P2Q-01-P1`. `[LISTING_ID]` and `[SEQ]` are the paid invoice's.
`[YYYYMM]` is the year and month the payment was confirmed, in Hong Kong time.
`[INDEX]` counts the payments on the invoice; an invoice takes one payment, so
every receipt ends `-P1`.

Every receipt SHALL show this breakdown:

| Line | Value |
| --- | --- |
| Original Invoice Total | The paid invoice's order total |
| Previous Payments | 0 |
| Current Payment Received | The amount this payment settled |
| Remaining Balance Due | 0 |

The receipt SHALL name the payment method:

| Route | Method shown |
| --- | --- |
| Card, paid by the winner | Card, with its brand and last four digits |
| Bank transfer, proof confirmed by an operator | Bank transfer |
| Recorded by an operator | Bank transfer, cash, or the description the operator gave for another method, with the external reference where one was recorded |

A receipt for a confirmed bank transfer SHALL NOT be marked as manually
settled. A receipt for a manually settled order SHALL be marked as manually settled,
SHALL be visually distinguishable from a card-settled receipt, and SHALL
record the amount settled, the payment method, the external reference, and a
pointer to any invoice it supersedes. No proof file, the winner's or an
operator's, SHALL appear on the receipt.

#### Scenario: winner-order-SC-18 - A receipt is itemised and stays retrievable
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order paid at an order total of 316000 minor units in HKD
- **WHEN** the winner opens the order a year later
- **THEN** the receipt shows the winning bid, buyer's premium, Shipping &
  Handling, insurance, any tax amount supplied by the separate tax capability,
  the subtotal, the payment processing fee, and the order total

#### Scenario: winner-order-SC-19 - A manually settled receipt says so
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order an operator settled by bank transfer with an
  external reference, after reissuing and replacing an earlier invoice
- **WHEN** the winner opens the receipt
- **THEN** it is marked as manually settled and is distinguishable from a
  card-settled receipt
- **AND** it records the amount settled, which includes the payment processing
  fee, bank transfer as the method, the external reference, and the invoice it
  supersedes
- **AND** it shows no proof file

#### Scenario: winner-order-SC-20 - The tracker appears once the lot is dispatched
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose fulfilment status has just become
  `fulfilled` with a tracking number attached
- **WHEN** the winner opens the order
- **THEN** it shows the carrier name, the tracking number, and a link to the
  carrier

#### Scenario: winner-order-SC-21 - Delivery proof records what the carrier provided
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** a dispatched auction order for which the carrier reports delivery
  with a handover timestamp and a signature
- **WHEN** `delivery_confirmed` is set
- **THEN** the order records that timestamp and that signature
- **AND** does not reduce them to a bare confirmation flag

#### Scenario: winner-order-SC-36 - A card receipt names the card
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order the winner paid by a Visa card ending 4242
- **WHEN** the winner opens the receipt
- **THEN** the payment method reads as a Visa card ending 4242

#### Scenario: winner-order-SC-112 - Every receipt carries a receipt ID
**Serves:** Records the winner keeps - receipt ID and breakdown

- **GIVEN** one order paid by card, one confirmed from bank transfer proof, and one settled manually
- **WHEN** the winner opens each receipt
- **THEN** each carries a receipt ID ending `-P1`
- **AND** each names its invoice ID

#### Scenario: winner-order-SC-113 - A confirmed bank transfer receipt names bank transfer
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose bank transfer proof an operator confirmed at an order total of 317000 minor units in HKD
- **WHEN** the winner opens the receipt
- **THEN** the payment method reads Bank transfer and the amount paid is 317000 minor units in HKD
- **AND** it is not marked as manually settled
- **AND** it shows no proof file and no file name

#### Scenario: winner-order-SC-131 - A receipt ID takes the paid invoice and the payment month
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an order whose bank transfer invoice `INV-202609-LK7P2Q-02` has an order total of 317000 minor units in HKD
- **WHEN** an operator confirms its proof at 2026-09-30T16:30:00Z, which is 1 October in Hong Kong, and the winner opens the receipt
- **THEN** the receipt ID is `REC-202610-LK7P2Q-02-P1`
- **AND** it shows Original Invoice Total 317000, Previous Payments 0, Current Payment Received 317000 and Remaining Balance Due 0, in minor units of HKD

#### Scenario: winner-order-SC-132 - Two receipts never share an ID
**Serves:** Records the winner keeps - receipt ID and breakdown

- **GIVEN** two paid orders on different listings
- **WHEN** the winner opens both receipts
- **THEN** the two receipt IDs differ

#### Scenario: winner-order-SC-133 - Invoice and receipt PDFs outlive a deleted account
**Serves:** Records the winner keeps - retention

- **GIVEN** a paid order with a replaced invoice, its current invoice and a receipt, whose winner deleted their account a year after payment
- **WHEN** Grade10 retrieves the order's documents 6 years after payment
- **THEN** the replaced invoice PDF, the current invoice PDF and the receipt PDF are all returned
