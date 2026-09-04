# shared/auth/roles Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-04, tcs-rules r2

## shared-auth-roles-US2: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** each action allowed only when my role grants that permission,
**so that** support cannot set roles, staff cannot ban, and an unknown permission grants nothing.

### shared-auth-roles-US2-TC8-1: Staff can write the auction catalogue

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**
Signed in as an operator whose only role is `staff`.

**Steps:**

1. Take an auction write action.

**Expected Results:**

* The system allows it.

### shared-auth-roles-US2-TC9-1: Reading a case is not reading its identity document

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**
Signed in as a person holding `vault:read` and not `kyc:read`.

**Steps:**

1. Open a vault case.
2. Ask for the identity document behind it.

**Expected Results:**

* The case is shown.
* The document is refused.

---

## shared-auth-roles-US3: Case work and money sit in different hands

**As an** operator,
**I want** the grants that run a case and the grants that pay against it to sit in different roles,
**so that** nobody provisioned to type bank references can open a customer's identity document.

### shared-auth-roles-US3-TC1-1: Staff run a case and cannot pay against it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**
Signed in as an operator whose only role is `staff`.

**Steps:**

1. Run a vault case and a lending case.
2. Try to record a vault payout.
3. Try to record a lending repayment.
4. Try to record an auction payment.

**Expected Results:**

* The case actions are allowed.
* The payout, the repayment, and the auction payment are all refused.

### shared-auth-roles-US3-TC2-1: A treasurer moves money and sees no identity document

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**
Signed in as an operator whose only role is `treasurer`.

**Steps:**

1. Read a vault case.
2. Record its payout.
3. Ask for the identity document behind that case.
4. Try to run the case itself.

**Expected Results:**

* Reading the case and recording its payout are allowed.
* The identity document is refused.
* Running the case is refused.
