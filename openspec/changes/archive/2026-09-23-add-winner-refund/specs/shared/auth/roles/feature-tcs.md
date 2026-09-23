# shared/auth/roles Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## shared-auth-roles-US2: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** refund access to follow the role matrix,
**so that** only the intended roles can record a refund.

### shared-auth-roles-US2-TC1-1: Refund processing is granted to staff and admin

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

### shared-auth-roles-US2-TC2-1: Settlement permission is not required for a refund

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

| Finding | Disposition |
| --- | --- |
| Refund access is separate from settlement access | **Folded in:** `shared-auth-roles-SC-14` and `shared-auth-roles-SC-15` |
