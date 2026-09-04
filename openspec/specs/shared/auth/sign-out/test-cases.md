# shared/auth/sign-out Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## shared-auth-sign-out-US1: Collector or operator signs out and lands signed out

**As a** signed-in person,
**I want** the control to show the request in flight and, on success, leave the signed-in surface,
**so that** I know the tap registered and I am not still looking at my account.

### shared-auth-sign-out-US1-TC1-1: Sign-out control is busy until the request settles

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-out-US-01

**Pre-conditions:**
Signed in on <grade10 profile url>. Network manipulation holds the sign-out request in flight.

**Steps:**

1. Navigate to <grade10 profile url>.
2. Activate the sign-out control.
3. Activate the sign-out control again while the request is still running.

**Expected Results:**

* The control shows a busy state until the auth service answers.
* The second activation starts no second request.

### shared-auth-sign-out-US1-TC2-1: Operator sign-out returns the admin panel to sign-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-out-US-01

**Pre-conditions:**
Signed in as an operator on <grade10 admin console url>.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Activate the sign-out control and wait for the auth service to confirm.

**Expected Results:**

* The panel shows its sign-in page.

### shared-auth-sign-out-US1-TC3-1: Collector sign-out returns the grade10 site to marketing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-out-US-01

**Pre-conditions:**
Signed in as a collector on <grade10 profile url>.

**Steps:**

1. Navigate to <grade10 profile url>.
2. Activate the sign-out control and wait for the auth service to confirm.

**Expected Results:**

* The site shows the marketing page.

---

## shared-auth-sign-out-US2: Collector or operator retries a refused sign-out

**As a** signed-in person,
**I want** a refused sign-out named as a failure I can retry,
**so that** a network miss does not leave me signed in with no explanation.

### shared-auth-sign-out-US2-TC1-1: Refused sign-out is reported beside the control

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-out-US-02

**Pre-conditions:**
Signed in on <grade10 profile url>. <The sign-out endpoint> is mocked to refuse the request.

**Steps:**

1. Navigate to <grade10 profile url>.
2. Activate the sign-out control.

**Expected Results:**

* The surface stays signed in.
* Failure feedback appears beside the sign-out control.

### shared-auth-sign-out-US2-TC2-1: Retry clears the failure and can complete

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-out-US-02

**Pre-conditions:**
Signed in on <grade10 profile url> with sign-out failure feedback showing. <The sign-out endpoint> then confirms.

**Steps:**

1. Navigate to <grade10 profile url>.
2. Activate the sign-out control again.

**Expected Results:**

* The failure feedback clears for the new attempt.
* A confirmed answer signs the surface out.
