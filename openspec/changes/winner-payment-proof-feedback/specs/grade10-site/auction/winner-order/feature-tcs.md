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

## Reconciliation

- **Covered:** `winner-order-SC-218` ← `US9-TC5-1`; `winner-order-SC-119`
  (modified) ← `US9-TC6-1`; `winner-order-SC-219` ← `US9-TC7-1`;
  `winner-order-SC-220` ← `US9-TC8-1`.
- **Raised:** none.
