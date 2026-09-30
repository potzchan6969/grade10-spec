# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r3.0

## winner-order-US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

### winner-order-US9-TC5-1: Successful proof submit toasts and shows Payment Verifying

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <pending_bank_transfer_order>.

**Test data:**

| Field | Value |
| --- | --- |
| <pending_bank_transfer_order> | An auction order whose invoice was sent for bank transfer and is pending |
| <valid_proof> | One PDF under 5 MB with sender name, transfer date and transaction reference filled |

**Steps:**

1. Open Submit Payment Proof from Order summary.
2. Enter <valid_proof>.
3. Choose Submit Payment Proof.

**Expected result:**

* A success toast reads Proof submitted / We'll verify your payment shortly.
* The order reads Payment Verifying.
* Submit Payment Proof and View Bank Details are hidden.

### winner-order-US9-TC6-1: Failed proof upload stays open with the draft

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <pending_bank_transfer_order>.
* Submit Payment Proof is open with a filled draft.

**Test data:**

| Field | Value |
| --- | --- |
| <pending_bank_transfer_order> | An auction order whose invoice was sent for bank transfer and is pending |
| <upload_failure> | The upload fails before it completes |

**Steps:**

1. Confirm Submit Payment Proof with a valid draft.
2. Let <upload_failure> occur.

**Expected result:**

* No file is stored and the invoice stays pending.
* Submit Payment Proof stays open with the draft.
* An error toast reads Proof not submitted / Nothing was saved. Try again.

### winner-order-US9-TC7-1: Leave is blocked while submitting or converting HEIC

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) has Submit Payment Proof open on <pending_bank_transfer_order>.
* Either submit is in flight or HEIC conversion is running.

**Test data:**

| Field | Value |
| --- | --- |
| <pending_bank_transfer_order> | An auction order whose invoice was sent for bank transfer and is pending |

**Steps:**

1. While the form is busy, choose Cancel.
2. Press Escape.
3. Dismiss via the overlay.

**Expected result:**

* The dialog stays open.
* The form stays locked until the busy beat finishes.

### winner-order-US9-TC8-1: Confirm stays inline irreversible microcopy

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <pending_bank_transfer_order>.

**Test data:**

| Field | Value |
| --- | --- |
| <pending_bank_transfer_order> | An auction order whose invoice was sent for bank transfer and is pending |

**Steps:**

1. Open Submit Payment Proof from Order summary.

**Expected result:**

* Irreversible microcopy says nothing can be added or changed after submit.
* No second confirm screen is shown.

### winner-order-US9-TC26-1: No card payment starts while proof is checked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) holds an auction order whose bank transfer invoice is `payment_verifying`.

**Steps:**

1. As the winner, try to start a card payment for the invoice.

**Expected Results:**

* No card payment starts, and no card is charged.
* The invoice is still `payment_verifying`.

### winner-order-US9-TC27-1: A file whose content is not a type Grade10 takes is refused

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

* customer(winner) holds an auction order whose bank transfer invoice is `pending`.

**Steps:**

1. Send Grade10 an upload carrying a GIF file named `slip.jpg`.

**Expected Results:**

* Grade10 refuses the whole upload.
* No file is stored.
* The invoice is still `pending`.

## Reconciliation

- **Covered:** `winner-order-SC-218` ← `US9-TC5-1`; `winner-order-SC-119`
  (modified) ← `US9-TC6-1`; `winner-order-SC-219` ← `US9-TC7-1`;
  `winner-order-SC-220` ← `US9-TC8-1`; `winner-order-SC-117` ← `US9-TC26-1`;
  `winner-order-SC-239` ← `US9-TC27-1`.
- **Raised:** none.
