# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

### winner-order-US1-TC12-1: Invoice with Insurance shows the amount and tip

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

* customer(winner) is signed in on <the winner's auction order url> for <order_with_insurance>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_with_insurance> | An auction order whose sent invoice includes Insurance |
| <insurance_amount> | The Insurance money amount on that invoice |

**Steps:**

1. Open <the winner's auction order url> for <order_with_insurance>.
2. Find Insurance on the order summary.
3. Open the Insurance info tooltip.

**Expected Results:**

* Insurance shows <insurance_amount>.
* Insurance does not read TBD.
* The Insurance info tooltip opens.
* The tooltip reads `0.9% of the order value during transit.`

---

### winner-order-US1-TC13-1: Pre-invoice summary shows Insurance as TBD

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

* customer(winner) is signed in on <the winner's auction order url> for <order_pre_invoice>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_pre_invoice> | An auction order before the invoice is sent |

**Steps:**

1. Open <the winner's auction order url> for <order_pre_invoice>.
2. Read the order summary fee rows.
3. Open the Insurance info tooltip.

**Expected Results:**

* Insurance is shown with the other fee rows.
* Insurance reads TBD.
* The tooltip reads `0.9% of the order value during transit.`

---

### winner-order-US1-TC14-1: Sent invoice without Insurance omits the row

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_without_insurance>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_without_insurance> | An auction order whose sent invoice includes no Insurance |

**Steps:**

1. Open <the winner's auction order url> for <order_without_insurance>.
2. Read the order summary.

**Expected Results:**

* The order summary shows no Insurance row.
* No Insurance tooltip is shown.

## Reconciliation

**Run:** 2026-09-21; scenario draft from the requirements reading; suite from the blind reading; neither saw the other's draft before join.

- **Raised:** none — the decided frontier already closed label, Free processing fee, tip copy, and pre-invoice TBD.
- **Folded:** tip-copy coverage from blind `US1-TC14-1` folded into `winner-order-SC-169` and `winner-order-SC-171` (and into `US1-TC12-1` / `US1-TC13-1` expected results); separate tip-only case dropped as duplicate.
- **Covered:** `winner-order-SC-169` ← `US1-TC12-1`; `winner-order-SC-171` ← `US1-TC13-1`; `winner-order-SC-170` ← `US1-TC14-1`.
- **Uncovered anchors:** none.
- **Out of suite:** omit-when-none after send for the Insurance *line* (not only the tip) remains durable `winner-order-SC-39` under Invoice fields; this change's `SC-170` only adds that an absent line offers no Insurance tip.
