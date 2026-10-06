# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## winner-order-US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

<!-- trace:case id=g10.auction-winner-order.TC-isg rev=2 covers=g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-8q1 -->
### winner-order-US9-TC2-2: Uploading proof stops the deadline and reads Payment Verifying

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

* customer(winner) is on <winner order url> for <order bt>.

**Test data:**

| Field | Value |
| --- | --- |
| <order bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| <time left> | 3 days 4 hours (273600s) before the payment deadline |
| <proof> | One PDF under 5 MB |

**Steps:**

1. Click Submit Payment Proof.
2. Choose <proof>.
3. Submit the proof.

**Expected Results:**

* A toast reads Proof submitted and We'll verify your payment shortly.
* The order reads Payment Verifying.
* The deadline stops with <time left> kept.
* A default inline Hourglass Alert says Grade10 is verifying the transfer and will email when payment is confirmed: under Order progress on small viewports and under the lot from `lg` up.
* Card Pay, Submit Payment Proof, View Bank Details and further uploads are hidden.
* <proof> and its file name are not shown.

<!-- trace:case id=g10.auction-winner-order.TC-8kk rev=2 covers=g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-8uw -->
### winner-order-US9-TC7-2: Backing out of the confirm step uploads nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order bt>.

**Test data:**

| Field | Value |
| --- | --- |
| <order bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| <proof> | Two PNG files |

**Steps:**

1. Click Submit Payment Proof.
2. Choose <proof>.
3. Read the inline warning that files cannot be added or changed after submission.
4. Cancel without submitting.

**Expected Results:**

* No second confirm screen is shown.
* No proof is stored.
* The order still reads Pending Payment; the deadline runs.
* Submit Payment Proof is still offered.

<!-- trace:case id=g10.auction-winner-order.TC-q03 rev=2 covers=g10.auction-winner-order.SC-uxu -->
### winner-order-US9-TC14-2: An upload cut off part-way leaves the invoice pending

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order bt>.
* The connection is set to drop during upload.

**Test data:**

| Field | Value |
| --- | --- |
| <order bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| <proof> | Three allowed files under 5 MB |

**Steps:**

1. Click Submit Payment Proof.
2. Choose <proof> and submit.
3. Let the connection drop during upload.
4. Restore the connection and submit <proof> again.

**Expected Results:**

* Step 3: Submit Payment Proof stays open with <proof> selected.
* Step 3: a toast reads Proof not submitted and Nothing was saved. Try again.
* Step 3: the order reads Pending Payment; the deadline runs; nothing is stored.
* Step 4: the upload is accepted.

<!-- trace:case id=g10.auction-winner-order.TC-th7 rev=1 covers=g10.auction-winner-order.SC-bb1 -->
### winner-order-US9-TC30-1: Busy proof form blocks every leave route

Runs once per row of **Test data**.

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

* customer(winner) is signed in on <winner order url> for <pending bank-transfer order>.
* Submit Payment Proof is open.

**Test data:**

| <busy work> | <leave route> |
| --- | --- |
| Proof submission in progress | Cancel |
| HEIC conversion in progress | Escape |
| Proof submission in progress | Overlay dismiss |

**Steps:**

1. Start <busy work>.
2. Use <leave route>.

**Expected Results:**

* Submit Payment Proof stays open.
* The form remains locked until <busy work> finishes.

## Reconciliation

**Run input:** QA1 wrote four blind cases from frozen `winner-order-US-09` and
the `Bank transfer` Feature set root. QA2 reconciled those cases against the
proposal, decisions, UI design, technical design, tasks, delta scenarios and
journeys, the durable Winner Order suite, Post-Bidding, and active overlapping
auction changes. This statement records the input to reconciliation, not proof
that implementation works.

| Blind case or scenario | Disposition |
| --- | --- |
| `winner-order-US9-TC28-1` | **Folded into:** `winner-order-US9-TC2-2`. The same successful-upload route now verifies the toast, Payment Verifying Alert and hidden payment controls. |
| `winner-order-US9-TC29-1` | **Folded into:** `winner-order-US9-TC14-2`. The existing interrupted-upload route now verifies the open draft and failure toast before retry. |
| `winner-order-US9-TC31-1` | **Folded into:** `winner-order-US9-TC7-2`. The existing back-out route now verifies inline irreversible microcopy and no second confirm screen. |
| `winner-order-US9-TC30-1` | **Covered:** `winner-order-SC-219`. Busy leave blocking is a distinct route with no durable case. |
| `winner-order-SC-99`, `winner-order-SC-100`, `winner-order-SC-101`, `winner-order-SC-103`, `winner-order-SC-115`, `winner-order-SC-116`, `winner-order-SC-117`, `winner-order-SC-118`, `winner-order-SC-121` and `winner-order-SC-239` | **Covered in durable suite:** unchanged Bank transfer scenarios retain their existing cases. |
| Product questions | **Settled:** none. Decisions Q1-Q16 and the Post-Bidding Payment Verifying alert decide the behavior. |
| Uncovered scenarios | **None.** SC-218, SC-219 and SC-220 map to revised or distinct cases; SC-119 maps to the revised retry case. |
