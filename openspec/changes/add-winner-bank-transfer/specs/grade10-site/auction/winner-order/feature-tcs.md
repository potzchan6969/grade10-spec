# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is going and how I pay.

### winner-order-US1-TC12-1: Confirming the address records card as the payment method

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url> for <lot_1>, status Awaiting Address.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A closed HKD lot won by the customer, address window open |

**Steps:**

1. Choose a saved delivery address.
2. Choose card.
3. Confirm the address.

**Expected Results:**

* The order reads Preparing Invoice.
* The order records card as its payment method.
* Confirmed address and card both show on the order.

### winner-order-US1-TC13-1: Bank transfer is offered and recorded for an HKD lot

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url> for <lot_1>, status Awaiting Address.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A closed HKD lot won by the customer, address window open |

**Steps:**

1. Choose a saved delivery address.
2. Choose bank transfer.
3. Confirm the address.

**Expected Results:**

* The order reads Preparing Invoice.
* The order records bank transfer as its payment method.

### winner-order-US1-TC14-1: Bank transfer is not offered without bank details

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_2>) is signed in on <grade10 winner order url> for <lot_2>, status Awaiting Address.

**Test data:**

| <lot_2> currency | Bank details set up | Outcome |
| --- | --- | --- |
| USD | No | Card only |
| JPY | No | Card only |

**Steps:**

1. Open the payment method choice.
2. Read the methods offered.

**Expected Results:**

* Only card is offered.
* Confirming records card.

### winner-order-US1-TC15-1: Each method shows its fixed fee range text

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url> for <lot_1>, status Awaiting Address.

**Steps:**

1. Open the payment method choice.
2. Read the text beside card and beside bank transfer.

**Expected Results:**

* Each method shows the fee range text Grade10 set.
* The bank transfer text names no amount.
* The text is the same for every lot value.

**Blocked:** Product - the fee range wording for each method is still open.

### winner-order-US1-TC16-1: Confirming with no payment method chosen

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url> for <lot_1>, status Awaiting Address.

**Steps:**

1. Choose a saved delivery address.
2. Leave the payment method unchosen.
3. Confirm the address.

**Expected Results:**

* The confirmation is refused and asks for a method.
* The order still reads Awaiting Address.

**Blocked:** Product - is a method required at confirm, or is one preselected by default?

### winner-order-US1-TC17-1: Card invoice prices the fee as the provider gross-up

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a sent card invoice, status `pending`.

**Test data:**

| Field | Value |
| --- | --- |
| <subtotal> | The invoice Subtotal |
| <card fee> | The gross-up Grade10 read from the provider at send |

**Steps:**

1. Open the order summary.
2. Open the invoice PDF.

**Expected Results:**

* Payment Processing Fee reads <card fee>, not Free.
* Order Total reads <subtotal> plus <card fee>.
* The PDF shows the same lines, with Subtotal.

### winner-order-US1-TC18-1: Bank transfer invoice shows the operator fee, zero as Free

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a sent bank transfer invoice with fee <bank fee>, status `pending`.

**Test data:**

| <bank fee> | <fee reads> |
| --- | --- |
| 0 | Free |
| <an amount above 0> | That amount in HKD |

**Steps:**

1. Open the order summary.
2. Read the Payment Processing Fee line and Order Total.

**Expected Results:**

* Payment Processing Fee reads <fee reads>.
* Order Total reads <subtotal> plus <bank fee>.

### winner-order-US1-TC19-1: Every sent invoice carries an invoice reference

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a sent invoice, status `pending`.

**Test data:**

| Invoice method |
| --- |
| Card |
| Bank transfer |

**Steps:**

1. Open the order.
2. Open the invoice PDF.

**Expected Results:**

* The order shows the invoice reference.
* The PDF shows the same reference.

### winner-order-US1-TC20-1: Card invoice shows card Pay and no bank details

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a sent card invoice, status `pending`.

**Steps:**

1. Open the payment area.

**Expected Results:**

* Card Pay is offered.
* No bank transfer details show.
* No proof upload is offered.

### winner-order-US1-TC21-1: Two won lots keep their own payment methods

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1> and <lot_3>) is signed in.
* <lot_1> has a card invoice; <lot_3> a bank transfer invoice, both `pending`.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_3> | A second closed HKD lot won by the same customer |

**Steps:**

1. Open <grade10 winner order url> for <lot_1>.
2. Open <grade10 winner order url> for <lot_3>.

**Expected Results:**

* Step 1 shows card Pay and the card fee.
* Step 2 shows bank details and the bank transfer fee.

### winner-order-US1-TC22-1: The winner cannot change the payment method after send

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a sent card invoice, status `pending`.

**Steps:**

1. Look for a control to change the payment method.
2. Send a method change for <lot_1> from outside the page.

**Expected Results:**

* Step 1 finds no method control on the order.
* Step 2 is refused; the invoice method stays card.
* The fee and Order Total are unchanged.

### winner-order-US1-TC23-1: The winner changes the method before the invoice is sent

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> reads Preparing Invoice with card recorded.

**Steps:**

1. Change the delivery address details.
2. Choose bank transfer.
3. Confirm again.

**Expected Results:**

* The order records bank transfer.
* The order still reads Preparing Invoice.

**Blocked:** Product - may the winner change the method before send, and only together with the address?

### winner-order-US1-TC24-1: A replaced invoice reads as replaced and names its replacement

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* An operator reissued <invoice_1> as <invoice_2>.

**Test data:**

| Field | Value |
| --- | --- |
| <invoice_1> | The first sent invoice on <lot_1> |
| <invoice_2> | The invoice that replaced it |

**Steps:**

1. Open the order.
2. Open the PDF of <invoice_1>.

**Expected Results:**

* The order shows <invoice_2> as the current invoice.
* The <invoice_1> PDF says <invoice_2> replaced it.
* <invoice_1> reads neither Cancelled nor any status of its own.

**Blocked:** Design - is the replaced invoice PDF still reachable by the winner on the order, and where?

### winner-order-US1-TC25-1: The first invoice reference still finds the order after a reissue

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* An operator reissued <invoice_1> on <lot_1> as <invoice_2>.

**Test data:**

| Field | Value |
| --- | --- |
| <invoice_1> | The first sent invoice on <lot_1> |
| <invoice_2> | The invoice that replaced it |

**Steps:**

1. Look up an order by the reference of <invoice_1>.
2. Look up an order by the reference of <invoice_2>.

**Expected Results:**

* Both lookups return the order for <lot_1>.

**Blocked:** Product - does a reissue keep the same reference or issue a new one, and who looks it up (operator search only)?

---

## winner-order-US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

### winner-order-US2-TC4-1: Every receipt carries a receipt number

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> is paid by <method>.

**Test data:**

| <method> |
| --- |
| Card payment |
| Bank transfer confirmed by an operator |
| Operator-recorded cash settlement |

**Steps:**

1. Open the receipt PDF.

**Expected Results:**

* The receipt shows a receipt number.
* The receipt names <method>.

### winner-order-US2-TC5-1: Two receipts never share a number

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer holds paid orders <lot_1> and <lot_3>.

**Steps:**

1. Read the receipt number of each order.

**Expected Results:**

* The two receipt numbers differ.

### winner-order-US2-TC6-1: A bank transfer receipt keeps the Payment Processing Fee line

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> was paid by bank transfer with fee <bank fee>.

**Test data:**

| <bank fee> | <fee reads> |
| --- | --- |
| 0 | Free |
| <an amount above 0> | That amount in HKD |

**Steps:**

1. Open the receipt PDF.

**Expected Results:**

* Payment Processing Fee reads <fee reads>.
* The paid amount equals the invoice Order Total.
* The receipt names bank transfer and the invoice reference.

### winner-order-US2-TC7-1: A card invoice settled by transfer reads as bank transfer

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* An operator reissued the card invoice as bank transfer with fee 0, then settled it at the Subtotal.

**Steps:**

1. Open the receipt PDF.

**Expected Results:**

* Payment Processing Fee reads Free.
* The paid amount equals the Subtotal.
* The receipt names bank transfer, not card.

### winner-order-US2-TC8-1: The receipt never shows proof files

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> was settled with operator-added proof files.

**Steps:**

1. Open the receipt area and receipt PDF.

**Expected Results:**

* No operator proof file is shown or linked.
* The method and reference are shown.

**Blocked:** Product - does the winner still see the proof files they uploaded themselves after payment?

---

## winner-order-US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

### winner-order-US9-TC1-1: Bank transfer invoice shows three ways to pay and the reference

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a sent bank transfer invoice, status `pending`.

**Steps:**

1. Open the payment area.
2. Read the payment instructions.

**Expected Results:**

* SWIFT, FPS and Hong Kong local transfer details are shown.
* The invoice reference is shown, with a request to quote it.
* No card Pay is offered.

**Blocked:** Finance - the bank details for each way are still open; also confirm whether the invoice PDF carries them.

### winner-order-US9-TC2-1: Uploading proof moves the order to Payment Verifying

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a bank transfer invoice, status `pending`, <time left> to pay.

**Test data:**

| Field | Value |
| --- | --- |
| <time left> | 3 days 4 hours before the invoice deadline |

**Steps:**

1. Choose one PDF file under 10 MB.
2. Submit the upload.
3. Accept the confirm step.

**Expected Results:**

* The order reads Payment Verifying.
* The deadline stops with <time left> kept.
* Card Pay and further upload are hidden.

### winner-order-US9-TC3-1: One to five files of each allowed type are accepted

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a bank transfer invoice, status `pending`.

**Test data:**

| <files> |
| --- |
| 1 JPEG (lower limit) |
| 1 PNG |
| 5 files mixing PDF, JPEG and PNG (upper limit) |

**Steps:**

1. Choose <files>.
2. Submit and accept the confirm step.

**Expected Results:**

* The upload is accepted, all <files> kept.
* The order reads Payment Verifying.

### winner-order-US9-TC4-1: Too few or too many files are refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a bank transfer invoice, status `pending`.

**Test data:**

| <files> |
| --- |
| 0 files |
| 6 files, each allowed and under 10 MB |

**Steps:**

1. Choose <files>.
2. Submit the upload.

**Expected Results:**

* The upload is refused and says why.
* The order still reads Pending Payment; the deadline runs.

### winner-order-US9-TC5-1: A file at the 10 MB limit is accepted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a bank transfer invoice, status `pending`.

**Steps:**

1. Choose one PDF of exactly 10 MB.
2. Submit and accept the confirm step.

**Expected Results:**

* The upload is accepted.
* The order reads Payment Verifying.

**Blocked:** Product - is 10 MB 10,000,000 bytes or 10,485,760 bytes?

### winner-order-US9-TC16-1: A file over the 10 MB limit is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a bank transfer invoice, status `pending`.

**Steps:**

1. Choose one PDF of 10 MB plus 1 byte, with two small PNGs.
2. Submit the upload.

**Expected Results:**

* The upload is refused, naming the 10 MB limit.
* The order still reads Pending Payment.

**Blocked:** Product - is 10 MB 10,000,000 bytes or 10,485,760 bytes, and is the whole set refused?

### winner-order-US9-TC6-1: A file of another type is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a bank transfer invoice, status `pending`.

**Test data:**

| <file> |
| --- |
| A GIF image |
| A Word document |
| An executable renamed to .pdf |
| Four PDFs and one HEIC image |

**Steps:**

1. Choose <file>.
2. Submit the upload.

**Expected Results:**

* The upload is refused, naming PDF, JPEG and PNG.
* Nothing is stored; the order still reads Pending Payment.

**Blocked:** Engineering - is the type checked by content or by extension, and does one bad file refuse the whole set?

### winner-order-US9-TC7-1: Backing out of the confirm step uploads nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a bank transfer invoice, status `pending`.

**Steps:**

1. Choose two PNG files.
2. Submit the upload.
3. Cancel at the confirm step.

**Expected Results:**

* No proof is stored.
* The order still reads Pending Payment; the deadline runs.
* Upload is still offered.

### winner-order-US9-TC8-1: What the deadline reads while proof is checked

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> reads Payment Verifying.

**Steps:**

1. Read the deadline and the Payment step.

**Expected Results:**

* The page says the deadline is on hold.
* No Pay by date is shown as running.

**Blocked:** Design - what Winner Order shows for the deadline and time left while Payment Verifying.

### winner-order-US9-TC9-1: No further upload is accepted while Payment Verifying

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* <lot_1> reads Payment Verifying for customer(winner of <lot_1>).

**Steps:**

1. Send a second proof upload for <lot_1> from outside the page.

**Expected Results:**

* The upload is refused.
* The first proof set is unchanged.

### winner-order-US9-TC10-1: Card payment is refused while Payment Verifying

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* <lot_1> reads Payment Verifying for customer(winner of <lot_1>).

**Steps:**

1. Send a card payment for <lot_1> from outside the page.

**Expected Results:**

* The payment is refused; no charge is made.
* The invoice still reads `payment_verifying`.

### winner-order-US9-TC11-1: Proof upload is not offered where it does not apply

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_4>) is signed in on <grade10 winner order url> for <lot_4>.

**Test data:**

| <lot_4> state |
| --- |
| Preparing Invoice, bank transfer chosen |
| Card invoice, `pending` |
| Paid bank transfer invoice |

**Steps:**

1. Open the payment area.

**Expected Results:**

* No proof upload is offered.

### winner-order-US9-TC12-1: Upload on an expired bank transfer invoice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a bank transfer invoice, status `expired`.

**Steps:**

1. Open the payment area.

**Expected Results:**

* No proof upload is offered.
* The overdue alert shows Contact Us.

**Blocked:** Product - may a winner upload proof after the deadline, and if so what status follows?

### winner-order-US9-TC13-1: Another collector cannot upload proof to the order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer B is signed in.
* <lot_1> belongs to customer A, bank transfer invoice `pending`.

**Steps:**

1. As customer B, send a proof upload for <lot_1>.
2. As customer B, request <lot_1>'s uploaded proof.

**Expected Results:**

* Both requests are refused.
* <lot_1> still reads Pending Payment.

### winner-order-US9-TC14-1: An upload that fails part-way leaves the invoice pending

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> has a bank transfer invoice, status `pending`.
* The connection drops during upload.

**Steps:**

1. Submit three files and accept the confirm step.
2. Reload the order.

**Expected Results:**

* The order still reads Pending Payment; the deadline runs.
* Upload is offered again.

**Blocked:** Product - what the winner is told, and whether any files already received are kept.

### winner-order-US9-TC15-1: The invoice reference fits the SWIFT reference limit

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* <lot_1> has a sent bank transfer invoice.

**Steps:**

1. Read the invoice reference.

**Expected Results:**

* It fits in 4 lines of 35 characters.

---

## winner-order-US10: Winner's payment proof is not accepted

**As a** winner whose payment proof Grade10 could not match,
**I want** to read why and how long I have left,
**so that** I can send the right proof or pay again before the deadline.

### winner-order-US10-TC1-1: A returned proof shows the reason and restarts the deadline

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in.
* <lot_1> reads Payment Verifying with <time left> kept.
* An operator returned it with <external reason> at <return time>.

**Test data:**

| Field | Value |
| --- | --- |
| <time left> | 2 days 5 hours |
| <external reason> | The reason the operator wrote for the winner |
| <return time> | When the operator returned the invoice |

**Steps:**

1. Open <grade10 winner order url> for <lot_1>.
2. Read the order status, the reason and the deadline.

**Expected Results:**

* The order reads Pending Payment with <external reason>.
* The deadline is <return time> plus <time left>.
* Bank details and proof upload are offered again.

### winner-order-US10-TC2-1: The internal reason is never shown to the winner

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in.
* An operator returned <lot_1> with <external reason> and <internal reason>.

**Test data:**

| Field | Value |
| --- | --- |
| <external reason> | Amount received does not match |
| <internal reason> | A note for operators only |

**Steps:**

1. Open <grade10 winner order url> for <lot_1>.
2. Read the order and the invoice PDF.

**Expected Results:**

* <external reason> is shown.
* <internal reason> appears nowhere.

### winner-order-US10-TC3-1: The winner uploads again after a return

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url>.
* <lot_1> was returned to Pending Payment.

**Steps:**

1. Choose one new PDF.
2. Submit and accept the confirm step.

**Expected Results:**

* The order reads Payment Verifying again.
* The deadline stops with the time then left.

### winner-order-US10-TC4-1: Time left at the edges survives a return

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-10

**Pre-conditions:**

* <lot_1> reads Payment Verifying with <time left> kept.

**Test data:**

| <time left> |
| --- |
| 1 minute |
| 6 days 23 hours 59 minutes |

**Steps:**

1. Return the invoice at <return time>.
2. Read the new deadline.

**Expected Results:**

* The deadline is <return time> plus <time left>.

### winner-order-US10-TC5-1: A returned invoice with no time left expires at once

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in.
* <lot_1> was returned with 1 minute left, and that minute has passed.

**Steps:**

1. Open <grade10 winner order url> for <lot_1>.

**Expected Results:**

* The invoice reads Expired under Pending Payment.
* Upload is hidden; the overdue alert shows Contact Us.

**Blocked:** Product - does the winner get any grace after a return, however little time was left?

### winner-order-US10-TC6-1: A second return keeps the time left at the second upload

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-10

**Pre-conditions:**

* <lot_1> was returned once, re-uploaded with <time left 2> kept, and is Payment Verifying.

**Test data:**

| Field | Value |
| --- | --- |
| <time left 2> | The time left when the second upload was made |

**Steps:**

1. Return the invoice again at <return time>.

**Expected Results:**

* The deadline is <return time> plus <time left 2>.
* Both returns and their reasons stay on the order.

## Raised

- Is a payment method required at address confirmation, or is one preselected?
- May the winner change the method before send, and only by re-confirming the address?
- Does a reissue keep the invoice reference or issue a new one, and who uses the reference to find the order?
- Where does the winner reach a replaced invoice PDF?
- Is 10 MB decimal or binary?
- Is file type checked by content or extension, and does one bad file refuse the whole set?
- What does Winner Order show for the deadline while Payment Verifying?
- May a winner upload proof on an expired invoice? If so, what status follows, and how can an operator later find it expired?
- Can a card invoice ever be Payment Verifying? The input says card Pay is blocked there, but upload is only offered on bank transfer invoices.
- What happens on a part-failed upload?
- Does a return grant any grace when almost no time was left?
- Does the winner still see their own proof files after payment or after a return?
- Does the bank transfer invoice PDF carry the three sets of bank details?
