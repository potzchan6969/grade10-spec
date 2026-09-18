# shared/auth/roles Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-r3

## Permission checks

### shared-auth-roles-SC-01: Refund processing is granted to staff and admin

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Permission checks

**Pre-conditions:**

* One caller has role `staff`; another has role `admin`.

**Steps:**

1. Each caller requests the refund action.

**Expected Results:**

* Both callers are allowed by `auction:refund`.

### shared-auth-roles-SC-02: Settlement permission is not required for a refund

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
* **Trace:** Permission checks

**Pre-conditions:**

* A staff caller has refund processing but not payment settlement.

**Steps:**

1. Request the refund action.

**Expected Results:**

* The action is allowed.
* The caller is not granted any settlement permission.

## Settled

## Reconciliation

Pending the reconciled requirement pass.

