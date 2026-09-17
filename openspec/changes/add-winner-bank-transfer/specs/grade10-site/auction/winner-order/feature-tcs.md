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

* Neither method was selected when the choice opened.
* The confirmation is refused.
* The order still reads Awaiting Address.


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

### winner-order-US1-TC19-1: Every sent invoice carries an invoice ID

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

* The order shows an invoice ID of the form `INV-[YYYYMM]-[listing code]-[SEQ]`.
* The PDF shows the same invoice ID.

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

1. Choose bank transfer.
2. Confirm.

**Expected Results:**

* The order records bank transfer.
* The order still reads Preparing Invoice.


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
* The <invoice_1> PDF says it was replaced and names the invoice ID of <invoice_2>.
* <invoice_1> reads neither Cancelled nor any status of its own.

**Blocked:** Design - is the replaced invoice PDF still reachable by the winner on the order, and where?

### winner-order-US1-TC25-1: The first invoice's identifiers still find the order after a reissue

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

1. Look up an order by the invoice ID, then the bank reference, of <invoice_1>.
2. Look up an order by the invoice ID, then the bank reference, of <invoice_2>.

**Expected Results:**

* <invoice_1> and <invoice_2> carry different invoice IDs and different bank references.
* All four lookups return the order for <lot_1>.


### winner-order-US1-TC26-1: The invoice month is the Hong Kong month it is sent

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* <lot_1> is on <listing_1>, which holds listing code `LK7P2Q`; its address is confirmed and no invoice is sent.
* admin(holds payment-processing) sends the first invoice for <lot_1> at <sent_at>.

**Test data:**

| <sent_at> | <invoice_id> |
| --- | --- |
| 2026-09-30T15:59:59Z | `INV-202609-LK7P2Q-01` |
| 2026-09-30T16:00:00Z | `INV-202610-LK7P2Q-01` |

**Steps:**

1. Read the invoice ID and the bank reference on the order.

**Expected Results:**

* The invoice ID is <invoice_id>.
* The bank reference is `LK7P2Q01`.

### winner-order-US1-TC27-1: A reissue takes the next count and the month it is sent

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

* <lot_1> on <listing_1> has <invoice_1> `INV-202609-LK7P2Q-01`, sent in September 2026, `pending`.
* admin(holds payment-processing) reissues <invoice_1> as <invoice_2> at 2026-10-02T02:00:00Z.

**Steps:**

1. Read the invoice ID and bank reference of <invoice_2>.
2. Look up an order by `LK7P2Q01`.
3. Open the PDF of <invoice_1>.

**Expected Results:**

* <invoice_2> is `INV-202610-LK7P2Q-02` with bank reference `LK7P2Q02`.
* The lookup returns the order for <lot_1>.
* The <invoice_1> PDF names `INV-202610-LK7P2Q-02`.

### winner-order-US1-TC28-1: The invoice count grows to three digits after 99

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
* **Trace:** Invoice

**Pre-conditions:**

* <lot_1> on <listing_1> (code `LK7P2Q`) has a current invoice `INV-202609-LK7P2Q-99`, `pending`.

**Steps:**

1. admin(holds payment-processing) reissues it in September 2026.
2. Read the new invoice ID and bank reference.

**Expected Results:**

* The invoice ID is `INV-202609-LK7P2Q-100`.
* The bank reference is `LK7P2Q100`, 9 characters of capital letters and digits.

### winner-order-US1-TC29-1: A listing code that is already held is replaced before publish

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Invoice

**Pre-conditions:**

* <listing_2> holds listing code <code_1>.
* <listing_3> is a draft whose internal id hashes to <code_1>.

**Steps:**

1. Publish <listing_3>.
2. Read the listing code of <listing_3>.
3. Change the hash method, then read both listing codes again.

**Expected Results:**

* <listing_3> holds a code other than <code_1>, derived by hashing again with a counter.
* The code is `L` followed by 5 characters, none of them `0`, `O`, `1` or `I`, and no lower-case letter.
* After the hash method changes, both listings keep the codes they had.

### winner-order-US1-TC30-1: The public listing page hides the listing code

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Invoice

**Pre-conditions:**

* guest is on <grade10 browse listing url> for <listing_1>, which holds listing code `LK7P2Q`.

**Steps:**

1. Read the page, including its title, URL and page source.

**Expected Results:**

* `LK7P2Q` appears nowhere on the page.

### winner-order-US1-TC31-1: The winner never sees the internal audit number

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
* <lot_1> is paid; its invoice holds `#00010482` and its receipt `#00010483`.

**Steps:**

1. Open the order.
2. Open the invoice PDF and the receipt PDF.
3. Read every letter sent about <lot_1>.

**Expected Results:**

* Neither `#00010482` nor `#00010483` appears anywhere.
* No other internal audit number appears.

### winner-order-US1-TC32-1: Invoices and receipts share one gapless count

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
* **Trace:** Invoice

**Pre-conditions:**

* The last internal audit number issued is `#00010481`.
* Nothing else is issued during the test.

**Steps:**

1. Send <invoice_1> on <lot_1>.
2. Reissue it as <invoice_2>.
3. Pay <invoice_2> by card.

**Expected Results:**

* <invoice_1> holds `#00010482`.
* <invoice_2> holds `#00010483`.
* The receipt holds `#00010484`.
* <invoice_1> still holds `#00010482` after it is replaced.

---

## winner-order-US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

### winner-order-US2-TC4-1: Every receipt carries a receipt ID

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

* The receipt shows a receipt ID ending `-P1`.
* The receipt names the invoice ID it paid.
* The receipt names <method>.

### winner-order-US2-TC5-1: Two receipts never share an ID

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

1. Read the receipt ID of each order.

**Expected Results:**

* The two receipt IDs differ.

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
* An operator reissued the card invoice as bank transfer with fee 0, then settled it at the new Order Total.

**Steps:**

1. Open the receipt PDF.

**Expected Results:**

* Payment Processing Fee reads Free.
* The paid amount equals the new Order Total, which equals the Subtotal.
* The receipt names bank transfer, not card, and is marked manually settled.
* The receipt names the invoice it supersedes.

### winner-order-US2-TC8-1: The winner never sees proof files after payment

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
* <lot_1> was paid by bank transfer: the winner uploaded <file_1>, and an operator confirmed it after adding <file_2>.

**Test data:**

| Field | Value |
| --- | --- |
| <file_1> | transfer-slip.pdf |
| <file_2> | bank-statement.pdf |

**Steps:**

1. Open the order.
2. Open the receipt PDF.

**Expected Results:**

* Neither <file_1> nor <file_2>, nor their names, is shown or linked.
* The receipt reads Bank transfer and names the invoice reference.
* The receipt is not marked manually settled.


### winner-order-US2-TC9-1: A receipt ID takes the payment month and shows the breakdown

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
* <lot_1> has bank transfer invoice `INV-202609-LK7P2Q-02`, order total 317000 minor units in HKD, `payment_verifying`.
* admin(holds payment-processing) confirms its proof at 2026-09-30T16:30:00Z.

**Steps:**

1. Open the receipt PDF.

**Expected Results:**

* The receipt ID is `REC-202610-LK7P2Q-02-P1`.
* Original Invoice Total is 317000 minor units in HKD.
* Previous Payments is 0.
* Current Payment Received is 317000 minor units in HKD.
* Remaining Balance Due is 0.

### winner-order-US2-TC10-1: Invoice and receipt PDFs outlive a deleted account

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* <lot_1> is paid, with a replaced invoice, a current invoice and a receipt.
* The winner deleted their account a year after payment.
* The clock is 6 years after payment.

**Steps:**

1. Retrieve the documents of <lot_1> from the archive.

**Expected Results:**

* The replaced invoice PDF is returned.
* The current invoice PDF is returned.
* The receipt PDF is returned.

---

## winner-order-US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

### winner-order-US9-TC1-1: Bank transfer invoice shows three ways to pay and the bank reference

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
* The bank reference is shown with a Copy Reference Code control, and a request to quote it.
* No card Pay is offered.

**Blocked:** Finance - the account details for each way are still open (TBC in the spec); Product - does the invoice PDF carry them?

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
* The chosen file and its name are not shown on the order.

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

### winner-order-US9-TC5-1: A file of exactly 10,485,760 bytes is accepted

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

1. Choose one PDF of exactly 10,485,760 bytes.
2. Submit and accept the confirm step.

**Expected Results:**

* The upload is accepted.
* The order reads Payment Verifying.


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

1. Choose one PDF of 10,485,761 bytes, with two small PNGs.
2. Submit the upload.

**Expected Results:**

* The whole upload is refused, naming the 10 MB limit.
* None of the three files is stored.
* The order still reads Pending Payment.


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
| Four PDFs and one HEIC image |

**Steps:**

1. Choose <file>.
2. Submit the upload.

**Expected Results:**

* The whole upload is refused, naming PDF, JPEG and PNG.
* Nothing is stored; the order still reads Pending Payment.


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

* Payment is the current step, and its subtext names no date.
* No payment deadline is shown as running.


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
2. Send a proof upload for <lot_1> from outside the page.

**Expected Results:**

* No proof upload is offered.
* The overdue alert shows Contact Us.
* Step 2 is refused; the invoice stays `expired`.


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
* No file is stored.
* Upload is offered again, and a new upload is accepted.


### winner-order-US9-TC15-1: The bank reference fits every way to pay

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

1. Read the bank reference.

**Expected Results:**

* It is the listing code followed by the two-digit invoice count, for example `LK7P2Q01`.
* It is 8 characters, capital letters and digits only, with no hyphen, space or other symbol.
* It fits on one 35-character SWIFT remittance line.

### winner-order-US9-TC17-1: A file whose content is not its extension

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in.
* <lot_1> has a bank transfer invoice, status `pending`.

**Steps:**

1. Send an upload holding one executable renamed to .pdf.

**Expected Results:**

* The whole upload is refused.
* Nothing is stored; the invoice stays `pending`.

**Blocked:** Engineering - is the file type checked by content or by extension?

### winner-order-US9-TC18-1: A card payment on a bank transfer invoice is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in.
* <lot_1> has a bank transfer invoice, status `pending`.

**Steps:**

1. Send a card payment for <lot_1> from outside the page.

**Expected Results:**

* The payment is refused; no charge is made.
* The invoice stays `pending`.

### winner-order-US9-TC19-1: The old deadline passing while proof is checked expires nothing

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* <lot_1> became Payment Verifying before its payment deadline.

**Steps:**

1. Let the original payment deadline pass with no operator action.
2. Open <grade10 winner order url> for <lot_1> as its winner.

**Expected Results:**

* The invoice is still `payment_verifying`.
* The order reads Payment Verifying.

### winner-order-US9-TC20-1: Copy Reference Code copies the bank reference, on bank transfer only

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <lot_1> and <lot_3>) is signed in.
* <lot_1> has a `pending` bank transfer invoice with bank reference `LK7P2Q01`.
* <lot_3> has a `pending` card invoice.

**Steps:**

1. Open <grade10 winner order url> for <lot_1> and choose Copy Reference Code.
2. Paste the clipboard.
3. Open <grade10 winner order url> for <lot_3>.

**Expected Results:**

* The pasted text is exactly `LK7P2Q01`, with no space.
* <lot_3> shows no bank reference and no Copy Reference Code control.

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

### winner-order-US10-TC5-1: A return adds no grace

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

* The order reads Pending Payment; the invoice is `expired`.
* Upload is hidden; the overdue alert shows Contact Us.


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

### winner-order-US10-TC7-1: Only the latest return reason is shown after a second return

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
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in.
* <lot_1> was returned twice, with <reason 1> and then <reason 2>.

**Test data:**

| Field | Value |
| --- | --- |
| <reason 1> | Amount received does not match |
| <reason 2> | Reference missing |

**Steps:**

1. Open <grade10 winner order url> for <lot_1>.
2. Read the return reasons shown.

**Expected Results:**

* <reason 2> is shown.
* <reason 1> is not shown.

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

## Reconciliation

**Status:** complete — reconciled on 2026-09-16 after the author's grilling round, and patched the same day with the author's identifier decisions. Four cases stay blocked; see Still blocked.

**Blind input manifest hash:** `2c7380f5cdff72fd`

| Finding | Disposition |
| --- | --- |
| `winner-order-US1-TC12-1`, `winner-order-US1-TC13-1`: the method is recorded with the address | Match `winner-order-SC-90` |
| `winner-order-US1-TC14-1`: no bank transfer without bank details | Matches `winner-order-SC-92` |
| `winner-order-US1-TC15-1`: fixed fee range text per method | Matches `winner-order-SC-91`; the wording stays TBC, so the case stays blocked |
| `winner-order-US1-TC16-1`: confirming with no method | Settled by decision 4; matches `winner-order-SC-94`; "nothing preselected" added to `winner-order-SC-91` and to the case |
| `winner-order-US1-TC17-1`: the card fee is the gross-up | Matches `winner-order-SC-62` |
| `winner-order-US1-TC18-1`: the bank transfer fee, zero as Free | Matches `winner-order-SC-110` and `winner-order-SC-111` |
| `winner-order-US1-TC19-1`: every invoice shows its reference on the order and PDF | Folded as `winner-order-SC-114`; now reads invoice ID, per decision 12 |
| `winner-order-US1-TC20-1`: a card invoice shows card Pay only | Matches `winner-order-SC-35` |
| `winner-order-US1-TC21-1`: two lots keep their own methods | Reached by `winner-order-SC-35` and `winner-order-SC-95`, which hold per order; no new scenario |
| `winner-order-US1-TC22-1`: no method change after send | Matches `winner-order-SC-106` |
| `winner-order-US1-TC23-1`: method change before send | Settled by decision 4; matches `winner-order-SC-93`; the case no longer changes the address as well |
| `winner-order-US1-TC24-1`: a replaced invoice names its replacement | Matches `winner-order-SC-98` and `winner-order-SC-109`; where the winner reaches the replaced PDF stays open |
| `winner-order-US1-TC25-1`: the first reference still finds the order | Matches `winner-order-SC-97`; the scenarios give each invoice its own reference, so the case now expects two references; blocked line removed. Decision 15 adds the invoice ID and bank reference lookups |
| `winner-order-US2-TC4-1`: every receipt has a number | Matches `winner-order-SC-112` |
| `winner-order-US2-TC5-1`: two receipts never share a number | Settled by decision 17; folded as `winner-order-SC-132`; blocked line removed |
| `winner-order-US2-TC6-1`: a bank transfer receipt keeps the fee line | Matches `winner-order-SC-63` and `winner-order-SC-113` |
| `winner-order-US2-TC7-1`: a card invoice settled by transfer reads as bank transfer | Settled by decision 8; matches `winner-order-SC-19` and `grade10-admin-auction-post-sale-SC-114`; the case now settles at the new order total |
| `winner-order-US2-TC8-1`: the receipt never shows proof files | Settled by decision 7; the case now covers the winner's own file and the order page; matches `winner-order-SC-113` and `winner-order-SC-115` |
| `winner-order-US9-TC1-1`: three ways to pay and the reference | Matches `winner-order-SC-95`; the account details are TBC and whether the PDF carries them is open, so the case stays blocked |
| `winner-order-US9-TC2-1`: upload moves the order to Payment Verifying | Matches `winner-order-SC-99`; "no file name shown" added per decision 7 |
| `winner-order-US9-TC3-1`, `winner-order-US9-TC4-1`: one to five files | Match `winner-order-SC-99` and `winner-order-SC-100` |
| `winner-order-US9-TC5-1`: a file at the 10 MB limit | Settled by decision 10; folded as `winner-order-SC-116` |
| `winner-order-US9-TC16-1`: a file over 10 MB | Settled by decision 10; matches `winner-order-SC-100`, which now refuses the whole upload |
| `winner-order-US9-TC6-1`: a file of another type | Settled by decision 10 for the whole set; matches `winner-order-SC-100`. The renamed-executable row moved to `winner-order-US9-TC17-1`, which stays blocked |
| `winner-order-US9-TC7-1`: backing out stores nothing | Matches `winner-order-SC-102` |
| `winner-order-US9-TC8-1`: the deadline while proof is checked | Answered by `winner-order-SC-108` and the upload requirement: no date, no running deadline. The case now expects that; the blocked line is removed |
| `winner-order-US9-TC9-1`: no second upload | Matches `winner-order-SC-101` |
| `winner-order-US9-TC10-1`: card payment refused while Payment Verifying | Folded as `winner-order-SC-117` |
| `winner-order-US9-TC11-1`: upload not offered where it does not apply | Folded as `winner-order-SC-118`; the card row matches `winner-order-SC-103` |
| `winner-order-US9-TC12-1`: upload on an expired invoice | Settled by decision 1; matches `winner-order-SC-103` and `winner-order-SC-37` |
| `winner-order-US9-TC13-1`: another collector cannot upload or read proof | Folded as `winner-order-SC-121`; reading proof matches `winner-order-SC-115` and decision 11 |
| `winner-order-US9-TC14-1`: an upload that fails part-way | Settled by decision 10; folded as `winner-order-SC-119`. What the winner is told is design |
| `winner-order-US9-TC15-1`: the reference fits the SWIFT limit | Settled by decision 12; reached by the bank reference rule beside `winner-order-SC-122`; the case now checks length and characters; blocked line removed |
| `winner-order-US10-TC1-1`, `winner-order-US10-TC2-1`: reason and restarted deadline, internal reason hidden | Match `winner-order-SC-104` and `winner-order-SC-105` |
| `winner-order-US10-TC3-1`: upload again after a return | Matches `winner-order-SC-105` |
| `winner-order-US10-TC4-1`: time left at the edges | Reached by the rule in `winner-order-SC-104`; no new scenario |
| `winner-order-US10-TC5-1`: no time left after a return | Settled by decision 6; folded as `winner-order-SC-120`. The case said the invoice "reads Expired"; it now reads Pending Payment with the overdue alert, per `auction-status-SC-06` |
| `winner-order-US10-TC6-1`: a second return keeps the second time left | Matches `winner-order-SC-105`. Its line "both returns and their reasons stay on the order" was not decided for the winner; it moved to `winner-order-US10-TC7-1` |
| `winner-order-US10-TC7-1`: earlier return reasons after a second return | Settled by decision 21; folded as `winner-order-SC-134`; the case now expects only the latest reason; blocked line removed |
| `winner-order-SC-96`: a card payment on a bank transfer invoice is refused | No case reached it; added `winner-order-US9-TC18-1` |
| `winner-order-SC-107`: a deadline passing while proof is checked | No case reached it; added `winner-order-US9-TC19-1` |
| `winner-order-SC-122`, `winner-order-SC-123`, `winner-order-SC-124`: identifier formats and a reissue's new identifiers | From the author's decisions 12 to 15, not from a case; added `winner-order-US1-TC26-1`, `winner-order-US1-TC27-1` and `winner-order-US1-TC28-1` |
| `winner-order-SC-125`, `winner-order-SC-126`, `winner-order-SC-127`: the listing code | From decisions 13 and 18, not from a case; added `winner-order-US1-TC29-1` and `winner-order-US1-TC30-1` |
| `winner-order-SC-128`: the bank reference and Copy Reference Code on bank transfer only | From decisions 12 and 20, not from a case; added `winner-order-US9-TC20-1`; `winner-order-US9-TC1-1` now reads the bank reference |
| `winner-order-SC-129`, `winner-order-SC-130`: the internal audit number | From decision 19, not from a case; added `winner-order-US1-TC31-1` and `winner-order-US1-TC32-1` |
| `winner-order-SC-131`: the receipt ID and breakdown | From decisions 16 and 17, not from a case; added `winner-order-US2-TC9-1`; `winner-order-US2-TC4-1` now reads the receipt ID |
| `winner-order-SC-133`: documents outlive a deleted account | From decision 20, not from a case; added `winner-order-US2-TC10-1` |

**Folded:** `winner-order-SC-114`, `winner-order-SC-115`, `winner-order-SC-116`, `winner-order-SC-117`, `winner-order-SC-118`, `winner-order-SC-119`, `winner-order-SC-120`, `winner-order-SC-121`. From the author's identifier answers, not from a case: `winner-order-SC-122`, `winner-order-SC-123`, `winner-order-SC-124`, `winner-order-SC-125`, `winner-order-SC-126`, `winner-order-SC-127`, `winner-order-SC-128`, `winner-order-SC-129`, `winner-order-SC-130`, `winner-order-SC-131`, `winner-order-SC-132`, `winner-order-SC-133`, `winner-order-SC-134`.

**Rejected:** none.

**Settled by the author** (grilling round, 2026-09-16; decisions 12 to 23 from the identifier patch, 2026-09-16, source `docs/references/grade10-invoicing-identifiers.md`):

1. **Proof on an expired invoice**: refused. Return stays refused on an expired invoice as a guard; it cannot be reached, because the deadline stops while proof is checked.
2. **Operator actions while Payment Verifying**: Confirm or Return only. Cancel, Reissue and manual settlement are refused.
3. **Deadline on an expired reissue**: always a fresh 7 days from send. Keeping the current deadline is offered only on a `pending` invoice.
4. **Method choice**: nothing preselected. A confirmation without a method is refused. The winner changes the method freely until the invoice is sent; after that only an operator does.
5. **After a return**: reminders resume on the paused clock. A reminder whose time passed during the check is not sent late, and one already sent is not repeated. The proof-not-accepted letter gives the new deadline as a date and time in the winner's zone ("Pay by …") and the external reason.
6. **Grace after a return**: none. The return prompt shows the time left, so the operator can reissue with a fresh 7 days instead.
7. **What the winner sees of proof**: a confirmed-proof receipt reads Bank transfer and is not marked manually settled. No proof file or file name reaches the winner anywhere; only the Payment Verifying state shows that proof was sent.
8. **Non-card settlement of a card invoice**: reissue as bank transfer first (fee usually 0), then record the settlement. Settlement is always at the current invoice's full order total.
9. **Operator files on Confirm**: 0 to 5, PDF, JPEG or PNG, 10 MB each.
10. **File rules**: 10 MB is 10,485,760 bytes. One wrong or oversize file refuses the whole upload and stores nothing. An upload that fails part-way stores nothing and may be retried; the one-upload rule applies once an upload succeeds.
11. **Who reads proof files**: any operator who can open the order; never the winner.
12. **Identifier formats**: invoice ID `INV-[YYYYMM]-[LISTING_ID]-[SEQ]`, receipt ID `REC-[YYYYMM]-[LISTING_ID]-[SEQ]-P[INDEX]`, bank reference `[LISTING_ID][SEQ]` of 8 or 9 capital letters and digits, with a Copy Reference Code control. It fits SWIFT's 35-character line.
13. **Listing code**: `L` and 5 characters with no `0`, `O`, `1` or `I`, hashed from the listing's internal id, hashed again with a counter on a clash, stored, unique, never changed or reused, and assigned by publish.
14. **Invoice count**: `01` for the first invoice, the next number on each reissue; three digits after `99`.
15. **Reissue**: a new invoice ID and bank reference; an old one still finds the order; the replaced PDF names the new invoice ID.
16. **Month**: the invoice's send month and the receipt's payment month, in Hong Kong time.
17. **Receipt**: always `-P1` here; the paid invoice's code and count; a breakdown of Original Invoice Total, Previous Payments 0, Current Payment Received, Remaining Balance Due 0. Receipt IDs are unique.
18. **Where the code shows**: to the winner only inside the invoice ID; operators search by it; never on the public listing page.
19. **Internal audit number**: one gapless count across invoices and receipts, never shown to the winner, shown to operators; a replaced invoice keeps its number.
20. **Retention and bank reference**: every invoice and receipt PDF kept at least 7 years, or the life of the account if longer, and 7 years after deletion. Every invoice has a bank reference; the winner sees it only on bank transfer.
21. **Return reasons**: Winner Order shows only the latest; the invoice log keeps all.
22. **Reissue with no change**: refused; a new reason alone is not a change.
23. **Operator search**: by listing code, invoice ID or bank reference.

Decisions 1, 4, 6, 7, 8 and 10 changed the cases named above in the grilling round; decisions 12, 15, 17 and 21 changed them in the identifier patch.

**Still blocked:**

- `winner-order-US1-TC15-1` — Product: the fee range wording for each method.
- `winner-order-US1-TC24-1` — Design: where the winner reaches a replaced invoice's PDF.
- `winner-order-US9-TC1-1` — Finance: the account details; Product: whether the invoice PDF carries them.
- `winner-order-US9-TC17-1` — Engineering: whether file type is checked by content or by extension.

**Out of suite:** none. The scenarios this change carries unchanged from `revise-auction-winner-invoicing` and `fix-buyer-premium` stay with their suites.

**Notes:** `winner-order-SC-14` serves `winner-order-US-01`, as in the draft. The raised question "can a card invoice ever be Payment Verifying?" is answered by `winner-order-SC-103`: no.
