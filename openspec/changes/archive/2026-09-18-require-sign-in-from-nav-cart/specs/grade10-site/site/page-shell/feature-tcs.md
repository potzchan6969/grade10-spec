# grade10-site/site/page-shell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## grade10-site-site-page-shell-US06: Collector opens their cart from the header

**As a** collector,
**I want** the Cart control to take me to my own cart, signing me in first when
I am not,
**so that** the cart I open is the one holding what I picked, rather than an
empty room, from any surface once Store answers the cart drawer.

### grade10-site-site-page-shell-US06-TC1-1: A signed-out collector presses Cart

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-06

**Pre-conditions:**

* customer is signed out and is on a supported site surface whose header offers Cart.

**Steps:**

1. Activate the Cart control in the header.
2. Check the dialog and the cart drawer.

**Expected Results:**

* The sign-in dialog opens over the surface.
* The cart drawer does not open.

### grade10-site-site-page-shell-US06-TC2-1: Sign-in opens the cart they asked for

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-06

**Pre-conditions:**

* customer is signed out and is on a supported site surface whose header offers Cart.
* Sign-in was opened from the Cart control in the header.
* Sign-in can complete without leaving the surface.

**Steps:**

1. Complete sign-in successfully while remaining on the surface.
2. Check the sign-in dialog and the cart drawer.

**Expected Results:**

* The sign-in dialog is closed.
* The cart drawer is open.

### grade10-site-site-page-shell-US06-TC3-1: Dismissing sign-in opens nothing

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
* **Trace:** grade10-site-site-page-shell-US-06

**Pre-conditions:**

* customer is signed out and is on a supported site surface whose header offers Cart.
* Sign-in was opened from the Cart control in the header.

**Steps:**

1. Dismiss the sign-in dialog without signing in.
2. Check the session and the cart drawer.
3. Wait <wait_1> and check the cart drawer again.

**Test data:**

| Field | Value |
| --- | --- |
| <wait_1> | 5 seconds |

**Expected Results:**

* The customer remains signed out on that surface.
* No cart drawer is open, and none opens later.

### grade10-site-site-page-shell-US06-TC4-1: A member presses Cart

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
* **Trace:** grade10-site-site-page-shell-US-06

**Pre-conditions:**

* customer is signed in and is on a supported site surface whose header offers Cart.

**Steps:**

1. Activate the Cart control in the header.
2. Check the cart drawer and the dialog.

**Expected Results:**

* The cart drawer opens.
* No sign-in dialog opens.

---

## Reconciliation

**Run:** 2026-09-18 · the blind suite and the change's scenario reading were reconciled after the Cart ownership decisions.

| Spec scenario | Suite coverage |
| --- | --- |
| grade10-site-site-page-shell-SC-21 | US06-TC1-1 |
| grade10-site-site-page-shell-SC-22 | US06-TC2-1 |
| grade10-site-site-page-shell-SC-23 | US06-TC3-1 |
| grade10-site-site-page-shell-SC-24 | US06-TC4-1 |
| Uncovered anchors | none |
| Contradicted readings | none |
