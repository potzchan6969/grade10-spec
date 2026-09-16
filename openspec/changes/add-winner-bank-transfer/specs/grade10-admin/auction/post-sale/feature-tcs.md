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

1. Record a bank transfer settlement at the Subtotal.

**Expected Results:**

* The settlement is refused, pointing to reissue.
* The invoice stays `pending`.

**Blocked:** Product - is this refused outright, or only because the amount is not the Order Total?

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
* <order_1> has an invoice, `pending`.

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
* <order_1> has an invoice, `pending`.

**Steps:**

1. Record a settlement at the Order Total with no proof file.

**Expected Results:**

* The settlement is refused, asking for proof.
* The invoice stays `pending`.

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
* <order_1> has a <method> invoice with fee <fee>, `pending`.

**Test data:**

| <method> | <fee> |
| --- | --- |
| card | the card gross-up |
| bank transfer | an amount above 0 |

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

* No such action is offered.
* Step 2 is refused; the invoice is unchanged.

### post-sale-US7-TC19-1: Reissue is withheld while proof is checked

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

**Steps:**

1. Look for Reissue.

**Expected Results:**

* Reissue is not offered until the proof is confirmed or returned.

**Blocked:** Product - is Reissue offered while Payment Verifying?

### post-sale-US7-TC20-1: Reissue on an expired invoice with the deadline kept

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

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a card invoice, `expired`.

**Steps:**

1. Open Reissue, change Insurance, add a reason.
2. Choose keep for the deadline.

**Expected Results:**

* Keep is not offered, or the reissue is refused.

**Blocked:** Product - what does keep mean for an already passed deadline?

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

**Blocked:** Product - where the operator searches by reference, and whether a reissue changes it.

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

* The return entry shows both reasons.
* The confirm entry lists the proof files.
* Entries are in time order.

**Blocked:** Product - is the winner's upload itself an invoice log entry?

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

**Blocked:** Product - is there a limit on files the operator may add on top of the winner's five?

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

### post-sale-US10-TC5-1: Return is not offered once the invoice has expired

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
* <order_1> has a bank transfer invoice with winner proof, and is expired.

**Steps:**

1. Look for Return and Confirm.

**Expected Results:**

* Return is not offered.
* Confirm or settlement is still offered.

**Blocked:** Product - how an invoice with proof becomes expired while its deadline is stopped, and what the operator sees.

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
* The invoice stays `paid`; no return letter goes out.

**Blocked:** Engineering and Product - what the second operator is told.

### post-sale-US10-TC8-1: Winner proof files are private to operators with the grant

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

**Steps:**

1. Request a proof file as admin(without payment-processing).
2. Request it signed out.

**Expected Results:**

* Both requests are refused.

**Blocked:** Product and Engineering - which grants may view winner proof files.

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

**Status:** paused — waiting on the author (@jeffffej0909) for a grilling round on
decisions neither reading could settle: proof on an expired invoice, operator
actions while Payment Verifying, the deadline on an expired reissue, the method
choice before send, reminders and the letter after a return, grace after a
return, what the winner sees of their proof, non-card settlement of a card
invoice, operator files on confirm, file rules, and who reads proof files.

**Blind input manifest hash:** `2c7380f5cdff72fd`
