# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

**Out of suite:** Payment-reminder series, proof letters, fulfilment and cancel
letters — durable and other in-flight changes cover them. This change adds the
setup reminder and setup-overdue only.

## order-mail-US1: Post-close letters

**As a** customer(winner),
**I want** a setup reminder while order setup is incomplete,
**so that** I finish setup before the deadline or know Contact Us is the path.

### order-mail-US1-TC50-1: Setup reminder at close plus 24 hours

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email and has not confirmed setup.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A closed lot with a winner and incomplete setup |

**Steps:**

1. Wait until 24 hours after <lot_1> closed.
2. Open the winner's inbox for <lot_1>.

**Expected Results:**

* One setup-reminder letter names <lot_1> and the setup deadline.

### order-mail-US1-TC54-1: No second setup reminder at close plus 72 hours

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email and has not confirmed setup.
* The setup reminder for <lot_1> at 24 hours has already been sent.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A closed lot with a winner and incomplete setup |

**Steps:**

1. Wait until 72 hours after <lot_1> closed.
2. Open the winner's inbox for <lot_1>.

**Expected Results:**

* No second setup-reminder letter.

### order-mail-US1-TC51-1: Setup overdue at the 48-hour setup deadline

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email and has not confirmed setup.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A closed lot with a winner and incomplete setup |

**Steps:**

1. Wait until 48 hours after <lot_1> closed.
2. Open the winner's inbox for <lot_1>.

**Expected Results:**

* One setup-overdue letter names <lot_1>.
* Contact Us is the primary action.

## Reconciliation

- Setup reminder at 24h only — folded as `order-mail-SC-50`
- No second setup reminder at 72h — folded as `order-mail-SC-54`
- Setup overdue at the setup deadline — folded as `order-mail-SC-51`
