# grade10-admin/auction/payment-settings Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r1

## grade10-admin-auction-payment-settings-US1: Operator maintains the auction premium minimums

**As a** settlement-authorized auction operator,
**I want** one place under `/auction` to review and update the minimum buyer
premium for each auction currency,
**so that** invoice amounts follow the configured policy.

### grade10-admin-auction-payment-settings-US-01-TC1-1: Initial page shows every supported currency

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
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* A settlement-authorized operator opens `/auction` and selects Payment settings.

**Steps:**

1. Read the currency rows.

**Expected Results:**

* USD shows 0 minor units.
* HKD shows 0 minor units.
* JPY shows 0 minor units.

### grade10-admin-auction-payment-settings-US-01-TC2-1: Complete mapping save persists all values

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* A settlement-authorized operator can edit the mapping.

**Steps:**

1. Save USD 100, HKD 500, and JPY 100 minor units.
2. Reload the page.

**Expected Results:**

* All three values are returned as saved.
* The save identifies the operator and timestamp.

### grade10-admin-auction-payment-settings-US-01-TC3-1: Invalid save changes nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* The current mapping is USD 0, HKD 0, and JPY 0 minor units.

**Steps:**

1. Submit a mapping with a negative amount or unsupported currency.

**Expected Results:**

* The save is refused.
* The prior mapping remains unchanged.

### grade10-admin-auction-payment-settings-US-01-TC4-1: Missing settlement permission refuses access

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* An operator lacks the auction settlement permission.

**Steps:**

1. Request Payment settings.
2. Attempt to save a mapping.

**Expected Results:**

* Both operations are refused.

## Raised

- The latest product reading confirms one fixed 20% premium rate and editable currency minimums under `/auction`; no unresolved product question remains.

## Settled

## Reconciliation

**Run:** 2026-09-16; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none.
