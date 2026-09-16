# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## post-sale-US1: Operator works the listing queue by outcome

**As an** auction operator,
**I want** each listing labelled with one outcome I can filter, with rows that need me highlighted,
**so that** I work awaiting wire without mixing it with a Stripe capture.

### post-sale-US1-TC1-1: A row waiting on proof reads Payment Verifying and needs action

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying.

**Steps:**

1. Find the <order_1> row.

**Expected Results:**

* The outcome reads Payment Verifying.
* The row carries the needs-action treatment.

### post-sale-US1-TC2-1: Filtering by Payment Verifying lists only those orders

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
* **Trace:** post-sale-US-01

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <count> orders are Payment Verifying; others are Pending Payment.

**Test data:**

| <count> |
| --- |
| 0 |
| 1 |
| 3 |

**Steps:**

1. Filter the queue to Payment Verifying.

**Expected Results:**

* Exactly <count> rows show, all Payment Verifying.

### post-sale-US1-TC3-1: The treatment follows the order after the check

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-01

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <order_1> was Payment Verifying, then an operator <action>.

**Test data:**

| <action> | <outcome> | <flag> |
| --- | --- | --- |
| confirmed it | Processing | shown |
| returned it, deadline not passed | Pending Payment | not shown |

**Steps:**

1. Find the <order_1> row.

**Expected Results:**

* The outcome reads <outcome>.
* Needs action is <flag>.

---

## post-sale-US7: Operator resolves an unpaid order

**As an** operator,
**I want** to reissue, settle, or cancel an unpaid order from the order itself,
**so that** a lot whose winner did not pay stops being an open-ended obligation.

### post-sale-US7-TC5-1: Reissue changes the address with a reason

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent card invoice, `pending`.

**Test data:**

| <deadline choice> | <deadline outcome> |
| --- | --- |
| keep | unchanged from the old invoice |
| restart | 7 days from the reissue |

**Steps:**

1. Open Reissue.
2. Choose <address_2>, enter Shipping & Handling and a reason.
3. Choose <deadline choice> and reissue.

**Expected Results:**

* A new invoice is `pending` for <address_2>.
* The deadline is <deadline outcome>.
* The old invoice reads as replaced, not Cancelled.

### post-sale-US7-TC6-1: Reissue without a reason is refused

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent invoice, `pending`.

**Steps:**

1. Open Reissue.
2. Change Insurance.
3. Leave the reason empty and reissue.

**Expected Results:**

* The reissue is refused, asking for a reason.
* The current invoice is unchanged.

### post-sale-US7-TC7-1: Switching card to bank transfer starts the fee empty

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent card invoice, `pending`, HKD.

**Steps:**

1. Open Reissue.
2. Choose bank transfer.
3. Read the bank transfer fee field.

**Expected Results:**

* The fee field is empty.
* The card fee is not carried over.

### post-sale-US7-TC8-1: A bank transfer reissue prefills the previous fee

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice with fee <fee_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <fee_1> | An amount above 0 |
| <fee_2> | A different amount above 0 |

**Steps:**

1. Open Reissue.
2. Read the fee field.
3. Change it to <fee_2>, add a reason and reissue.

**Expected Results:**

* Step 2 shows <fee_1>.
* The new invoice carries <fee_2>.

### post-sale-US7-TC9-1: Bank transfer fee values that are refused

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* Reissue is open on <order_1> with bank transfer chosen.

**Test data:**

| <fee> |
| --- |
| blank |
| -1 |
| a value finer than the currency's smallest unit |
| text |

**Steps:**

1. Enter <fee> and a reason.
2. Reissue.

**Expected Results:**

* The reissue is refused at the fee.
* The current invoice is unchanged.

### post-sale-US7-TC10-1: Bank transfer fee values that are accepted

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* Reissue is open on <order_1> with bank transfer chosen.

**Test data:**

| <fee> | <fee reads> |
| --- | --- |
| 0 | Free |
| 1 minor unit | That amount |
| An amount larger than the Subtotal | That amount, not capped |

**Steps:**

1. Enter <fee> and a reason.
2. Reissue.

**Expected Results:**

* The new invoice carries Payment Processing Fee <fee reads>.

### post-sale-US7-TC11-1: Switching to card prices the fee from the provider

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The fee is the gross-up read at reissue.
* No fee is typed by the operator.

### post-sale-US7-TC12-1: A card reissue is refused when provider fees cannot be read

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.
* The payment provider's fees cannot be read.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The reissue is refused and says why.
* The current invoice is unchanged.

### post-sale-US7-TC13-1: A card invoice paid by transfer is reissued then settled

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a card invoice, `pending`.
* The winner transferred exactly the Subtotal.

**Steps:**

1. Reissue as bank transfer with fee 0 and a reason.
2. Record settlement at the new Order Total, with one proof file.

**Expected Results:**

* The new invoice reads fee Free, total equal to Subtotal.
* The invoice is `paid`; the order reads Processing.

### post-sale-US7-TC14-1: Settling a card invoice as a transfer without reissue is refused

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a card invoice, `pending`.

**Steps:**

1. Record a settlement at the Subtotal with one proof file, once per method: bank transfer, cash, other.

**Expected Results:**

* Each settlement is refused, pointing to reissue.
* The invoice stays `pending`.


### post-sale-US7-TC15-1: Settlement at an amount other than the Order Total is refused

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`, Order Total <total>.

**Test data:**

| <amount> |
| --- |
| <total> minus 1 minor unit |
| <total> plus 1 minor unit |

**Steps:**

1. Record a settlement of <amount> with one proof file.

**Expected Results:**

* The settlement is refused.
* The invoice stays `pending`.

### post-sale-US7-TC16-1: Operator settlement needs proof and goes straight to paid

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`.

**Test data:**

| <proof> | <outcome> |
| --- | --- |
| 1 file | paid, never Payment Verifying |
| 5 files | paid, never Payment Verifying |

**Steps:**

1. Record a settlement at the Order Total with <proof>.

**Expected Results:**

* The outcome is <outcome>.

### post-sale-US7-TC23-1: Operator settlement without proof is refused

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`.

**Steps:**

1. Record a settlement at the Order Total with no proof file.

**Expected Results:**

* The settlement is refused, asking for proof.
* The invoice stays `pending`.

### post-sale-US7-TC24-1: One bad proof file refuses the whole settlement

Runs once per row of **Test data**.

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`.

**Test data:**

| <bad file> |
| --- |
| A JPEG of 10,485,761 bytes |
| A GIF |

**Steps:**

1. Attach one valid PDF and <bad file>.
2. Commit the settlement with a reference.

**Expected Results:**

* The commit is refused.
* No file is stored; the invoice stays `pending`.

### post-sale-US7-TC25-1: The first bank transfer quote asks for the fee

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice with bank transfer chosen by the winner.
* The payment provider's fees cannot be read.

**Test data:**

| <fee> | <outcome> |
| --- | --- |
| blank | The send is refused; no invoice is issued |
| -100 | The send is refused; no invoice is issued |
| 0 | The invoice is sent; its fee reads Free |
| more than the Subtotal | The invoice is sent with that fee, not capped |

**Steps:**

1. Open the quote.
2. Enter Shipping & Handling and <fee>.
3. Send the invoice.

**Expected Results:**

* Step 1 names bank transfer and asks for a bank transfer fee.
* <outcome>

### post-sale-US7-TC17-1: Settlement keeps the Payment Processing Fee line

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice with fee <fee>, `pending`.

**Test data:**

| <fee> |
| --- |
| 0, read as Free |
| an amount above 0 |

**Steps:**

1. Record a settlement at the Order Total with one proof file.
2. Read the paid invoice.

**Expected Results:**

* Payment Processing Fee still reads <fee>.
* The paid amount includes it.

### post-sale-US7-TC18-1: Staff without payment processing cannot reissue or check proof

Runs once per row of **Test data**.

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(without payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is <state>.

**Test data:**

| <state> |
| --- |
| Pending Payment |
| Payment Verifying |

**Steps:**

1. Look for Reissue, settle, confirm and return.
2. Send a reissue from outside the page.

**Expected Results:**

* Each action is visible and disabled.
* Step 2 is refused; the invoice is unchanged.

### post-sale-US7-TC19-1: Only Confirm and Return while proof is checked

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
* **Testability:** manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying.

**Test data:**

| <action> |
| --- |
| Reissue |
| Settle manually |
| Cancel order |

**Steps:**

1. Look for <action>.
2. Send <action> for <order_1> from outside the page.

**Expected Results:**

* <action> is not offered; Confirm and Return are.
* Step 2 is refused; the order stays Payment Verifying.


### post-sale-US7-TC20-1: Reissue on an expired invoice offers only a fresh 7 days

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a card invoice, `expired`.

**Steps:**

1. Open Reissue, change Insurance, add a reason.
2. Read the deadline choices.
3. Send a reissue that keeps the deadline from outside the page.

**Expected Results:**

* Only a fresh 7 days from send is offered.
* Step 3 is refused; the invoice stays `expired`.


### post-sale-US7-TC21-1: Reissue with nothing changed

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent invoice, `pending`.

**Steps:**

1. Open Reissue.
2. Add only a reason and reissue.

**Expected Results:**

* The reissue is refused as changing nothing.

**Blocked:** Product - is a reason-only reissue allowed, for example to restart the deadline alone?

### post-sale-US7-TC22-1: An old invoice reference still finds the order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <order_1> had <invoice_1> replaced by <invoice_2>.

**Steps:**

1. Search the queue by <invoice_1>'s reference.

**Expected Results:**

* <order_1> is found.
* It shows <invoice_2> as current.

**Blocked:** Design - where the operator searches by invoice reference.

---

## post-sale-US8: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment log entry on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

### post-sale-US8-TC5-1: The log names what a reissue changed

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(auction operator) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> was reissued changing <parts> with <reason>.

**Test data:**

| <parts> |
| --- |
| address only |
| payment method and bank transfer fee |
| Shipping & Handling, Insurance and deadline restarted |

**Steps:**

1. Open the invoice log.

**Expected Results:**

* One reissue entry names <parts> and <reason>.
* Unchanged parts are not named.

### post-sale-US8-TC6-1: The log keeps the proof check with both reasons

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(auction operator) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> was uploaded, returned with <external reason> and <internal reason>, re-uploaded and confirmed.

**Steps:**

1. Open the invoice log.

**Expected Results:**

* Each upload is an entry with the time left.
* The return entry shows both reasons.
* The confirm entry lists the proof files.
* Entries are in time order.


### post-sale-US8-TC7-1: A replaced invoice stays readable on the order

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(auction operator) is on <order_1> in <grade10 auction admin post-sale url>.
* <invoice_1> was replaced by <invoice_2>.

**Steps:**

1. Open <invoice_1> and its PDF.

**Expected Results:**

* <invoice_1> shows no status of its own, never Cancelled.
* Its PDF names <invoice_2>.

---

## post-sale-US10: Operator checks a winner's payment proof

**As a** payment operator,
**I want** to see the proof a winner uploaded against the invoice, then confirm the payment or return the invoice with a reason,
**so that** money I can match settles the order, and a winner whose proof I cannot match knows why and keeps the time they had.

### post-sale-US10-TC1-1: Confirming proof settles the invoice with the winner's files

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying with <files> uploaded.

**Test data:**

| Field | Value |
| --- | --- |
| <files> | 5 files: PDF, JPEG and PNG |

**Steps:**

1. Open the proof on the invoice.
2. Confirm the payment.

**Expected Results:**

* Step 1 shows every one of <files>.
* The invoice is `paid`; the order reads Processing.
* <files> are recorded as the payment proof.

### post-sale-US10-TC2-1: The operator adds their own proof when confirming

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying with 1 winner file.

**Steps:**

1. Add one bank statement file.
2. Confirm the payment.

**Expected Results:**

* The proof lists the winner file and the operator file.
* The invoice is `paid`.


### post-sale-US10-TC3-1: Returning proof shows time left and resumes the deadline

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying with <time left> kept.

**Test data:**

| Field | Value |
| --- | --- |
| <time left> | 2 days 5 hours |

**Steps:**

1. Open Return.
2. Enter an external and an internal reason.
3. Return.

**Expected Results:**

* Step 1 shows <time left>.
* The invoice is `pending`, deadline now plus <time left>.
* The order reads Pending Payment.

### post-sale-US10-TC4-1: Return is refused without both reasons

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying.

**Test data:**

| <reasons> |
| --- |
| neither |
| external only |
| internal only |

**Steps:**

1. Open Return.
2. Enter <reasons>.
3. Return.

**Expected Results:**

* The return is refused, naming the missing reason.
* The order stays Payment Verifying.

### post-sale-US10-TC5-1: Confirm and Return are not offered on an expired invoice

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `expired`, with no proof.

**Steps:**

1. Look for Return and Confirm.
2. Send a Return for <order_1> from outside the page.

**Expected Results:**

* Neither Return nor Confirm is offered.
* Reissue, settle and cancel are offered.
* Step 2 is refused; the invoice stays `expired`.


### post-sale-US10-TC6-1: Check actions are not offered on a pending order

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`, no proof.

**Steps:**

1. Look for Confirm and Return.

**Expected Results:**

* Neither is offered.

### post-sale-US10-TC7-1: A second operator acting on the same check is refused

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* Two admin(holds payment-processing) have <order_1> open, Payment Verifying.

**Steps:**

1. Operator A confirms.
2. Operator B returns.

**Expected Results:**

* Step 2 is refused.
* The invoice stays `paid`; no proof-not-accepted letter goes out.


### post-sale-US10-TC8-1: Who can read the winner's proof files

Runs once per row of **Test data**.

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* <order_1> is Payment Verifying with winner files.

**Test data:**

| <requester> | <outcome> |
| --- | --- |
| admin(without payment-processing), able to open <order_1> | The file is returned |
| customer(winner of <order_1>) | Refused |
| A signed-out request | Refused |

**Steps:**

1. Request a proof file on <order_1> as <requester>.

**Expected Results:**

* The request is <outcome>.

### post-sale-US10-TC9-1: One bad operator file refuses the confirm

Runs once per row of **Test data**.

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying.

**Test data:**

| <operator files> |
| --- |
| One PDF and one JPEG of 10,485,761 bytes |
| Six PDFs |

**Steps:**

1. Attach <operator files>.
2. Confirm the payment.

**Expected Results:**

* The confirm is refused.
* No operator file is stored; the order stays Payment Verifying.

## Raised

- The Quote and send group (payment method on the quote, bank transfer fee at first send) has no journey in this change's journeys file; post-sale-US-05 lives only in revise-auction-winner-invoicing. Fee validation is covered here through Reissue only. Should this change carry US-05 as a context journey?
- Is Reissue offered while Payment Verifying?
- What does keep the deadline mean on an expired invoice?
- Is a reason-only reissue allowed?
- Is settling a card invoice as a transfer refused without a reissue?
- Where does an operator search by invoice reference, and does a reissue change the reference?
- How can a Payment Verifying invoice be expired, given its deadline is stopped?
- Is the winner upload an invoice log entry?
- Is there a cap on operator-added proof files on confirm?
- What happens when two operators act on the same proof check?
- Which grants may view winner proof files?

## Reconciliation

**Status:** complete — reconciled on 2026-09-16 after the author's grilling round. Two cases stay blocked; see Still blocked.

**Blind input manifest hash:** `2c7380f5cdff72fd`

| Finding | Disposition |
| --- | --- |
| `post-sale-US1-TC1-1`, `post-sale-US1-TC2-1`: Payment Verifying rows and the filter | Match `grade10-admin-auction-post-sale-SC-116` |
| `post-sale-US1-TC3-1`: the treatment follows the check | Reached by the outcome table and `grade10-admin-auction-post-sale-SC-21` |
| `post-sale-US7-TC5-1`: reissue with a new address, deadline kept or restarted | Matches `grade10-admin-auction-post-sale-SC-107` and `grade10-admin-auction-post-sale-SC-108` |
| `post-sale-US7-TC6-1`: reissue without a reason | Matches `grade10-admin-auction-post-sale-SC-109` |
| `post-sale-US7-TC7-1`, `post-sale-US7-TC8-1`: the bank transfer fee on a reissue | Match `grade10-admin-auction-post-sale-SC-110` and `grade10-admin-auction-post-sale-SC-111` |
| `post-sale-US7-TC9-1`, `post-sale-US7-TC10-1`: refused and accepted fee values | Reached by the quote's fee rule, `grade10-admin-auction-post-sale-SC-118` and `grade10-admin-auction-post-sale-SC-119` |
| `post-sale-US7-TC11-1`: a switch to card prices the fee from the provider | Folded as `grade10-admin-auction-post-sale-SC-125` |
| `post-sale-US7-TC12-1`: a card reissue with unreadable provider fees | Folded as `grade10-admin-auction-post-sale-SC-126` |
| `post-sale-US7-TC13-1`: a card invoice paid by transfer | Matches `grade10-admin-auction-post-sale-SC-114` |
| `post-sale-US7-TC14-1`: settling a card invoice without a reissue | Settled by decision 8: refused for every method; `grade10-admin-auction-post-sale-SC-121` now says so, and the case now tries all three methods |
| `post-sale-US7-TC15-1`: settlement at another amount | Folded as `grade10-admin-auction-post-sale-SC-130` |
| `post-sale-US7-TC16-1`, `post-sale-US7-TC23-1`: proof required, straight to paid | Match `grade10-admin-auction-post-sale-SC-55`, `grade10-admin-auction-post-sale-SC-56` and `grade10-admin-auction-post-sale-SC-60`; cases now set a bank transfer invoice, per decision 8 |
| `post-sale-US7-TC17-1`: settlement keeps the fee line | Matches `grade10-admin-auction-post-sale-SC-67`. Its card row contradicted decision 8 and now reads a bank transfer fee of 0 |
| `post-sale-US7-TC18-1`: an operator without the grant | Matches `grade10-admin-auction-post-sale-SC-25` and `grade10-admin-auction-post-sale-SC-106`. The case said "not offered"; the durable rule, carried unchanged, is "visible and disabled", so the case now says that |
| `post-sale-US7-TC19-1`: reissue while proof is checked | Settled by decision 2; the case now covers reissue, settlement and cancel; matches `grade10-admin-auction-post-sale-SC-113`, `grade10-admin-auction-post-sale-SC-120` and `grade10-admin-auction-post-sale-SC-127` |
| `post-sale-US7-TC20-1`: keeping the deadline on an expired invoice | Settled by decision 3; matches `grade10-admin-auction-post-sale-SC-112` |
| `post-sale-US7-TC21-1`: a reissue that changes nothing | Not decided. Kept draft and blocked |
| `post-sale-US7-TC22-1`: an old reference still finds the order | Matches `winner-order-SC-97`: each invoice has its own reference. Where the operator searches stays open |
| `post-sale-US8-TC5-1`: the log names what a reissue changed | Matches `grade10-admin-auction-post-sale-SC-123` |
| `post-sale-US8-TC6-1`: the log keeps the proof check | Matches `grade10-admin-auction-post-sale-SC-124`: the upload is a log entry. The blocked line is removed |
| `post-sale-US8-TC7-1`: a replaced invoice stays readable | Matches `grade10-admin-auction-post-sale-SC-115` and `winner-order-SC-98` |
| `post-sale-US10-TC1-1`: confirming proof | Matches `grade10-admin-auction-post-sale-SC-100` |
| `post-sale-US10-TC2-1`: operator files on confirm | Settled by decision 9; matches `grade10-admin-auction-post-sale-SC-101` |
| `post-sale-US10-TC3-1`: return shows the time left | Matches `grade10-admin-auction-post-sale-SC-102` |
| `post-sale-US10-TC4-1`: a return needs both reasons | Matches `grade10-admin-auction-post-sale-SC-103` |
| `post-sale-US10-TC5-1`: Return on an expired invoice | Settled by decision 1: the guard stays, but an expired invoice never holds proof. The case now uses an expired invoice with no proof; matches `grade10-admin-auction-post-sale-SC-105` |
| `post-sale-US10-TC6-1`: no check actions on a pending order | Matches `grade10-admin-auction-post-sale-SC-105` and `grade10-admin-auction-post-sale-SC-122` |
| `post-sale-US10-TC7-1`: two operators on one check | Folded as `grade10-admin-auction-post-sale-SC-129`. What the second operator is told is design, so the blocked line is removed |
| `post-sale-US10-TC8-1`: who reads winner proof files | Settled by decision 11: any operator who can open the order. The case expected a refusal for an operator without payment-processing; it now expects the file. Folded into `grade10-admin-auction-post-sale-SC-106` |
| `grade10-admin-auction-post-sale-SC-62`: one bad proof file refuses the settlement | Changed by decision 10; no case reached it; added `post-sale-US7-TC24-1` |
| `grade10-admin-auction-post-sale-SC-117`, `grade10-admin-auction-post-sale-SC-118`, `grade10-admin-auction-post-sale-SC-119`: the first bank transfer quote | No case reached them directly; added `post-sale-US7-TC25-1`, which traces the Quote and send group |
| `grade10-admin-auction-post-sale-SC-128`: a bad operator file refuses the confirm | New for decisions 9 and 10; added `post-sale-US10-TC9-1` |
| `grade10-admin-auction-post-sale-SC-104`: only the external reason reaches the winner | Reached from the winner side by `winner-order-US10-TC2-1` and `order-mail-US1-TC1-1` |

**Folded:** `grade10-admin-auction-post-sale-SC-125`, `grade10-admin-auction-post-sale-SC-126`, `grade10-admin-auction-post-sale-SC-127`, `grade10-admin-auction-post-sale-SC-128`, `grade10-admin-auction-post-sale-SC-129`, `grade10-admin-auction-post-sale-SC-130`.

**Rejected:** none.

**Settled by the author** (grilling round, 2026-09-16):

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

Decisions 1, 2, 3, 8, 9, 10 and 11 changed the cases named above.

**Still blocked:**

- `post-sale-US7-TC21-1` — Product: may an operator send a reissue that changes nothing but the reason, for example to restart the deadline?
- `post-sale-US7-TC22-1` — Design: where an operator searches by invoice reference.

**Out of suite:** none.

**Notes:**

- **Quote and send**: the first bank transfer quote is also walked through the Reissue cases (`post-sale-US7-TC7-1` to `post-sale-US7-TC10-1`), because the quote journey `post-sale-US-05` exists only in `revise-auction-winner-invoicing` and cannot be carried here as context. The validator allows a Feature set group on a walked capability's trace, so `post-sale-US7-TC25-1` traces "Quote and send" directly.
- **Opposite statement**: `post-sale-US7-TC18-1` said controls are not offered; the carried durable rule says visible and disabled. This change did not decide it; the case follows the durable rule. Flag it if the author meant otherwise.
