# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## order-mail-US1: Order notifications

**As a** winner whose invoice is paid by bank transfer,
**I want** letters that match where my payment proof stands,
**so that** I am not told to pay while Grade10 is checking my transfer.

### order-mail-US1-TC1-1: Returned proof sends the proof-not-accepted letter

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email.
* <lot_1> is Payment Verifying with <time left> kept.

**Test data:**

| Field | Value |
| --- | --- |
| <time left> | 2 days 5 hours |
| <external reason> | Amount received does not match |
| <internal reason> | A note for operators only |

**Steps:**

1. An operator returns the invoice with <external reason> and <internal reason>.
2. Open the winner's inbox.
3. Click the letter's CTA.

**Expected Results:**

* One letter names <lot_1>, <external reason> and the time left.
* <internal reason> is not in the letter.
* Step 3 opens <grade10 winner order url> for <lot_1>.

### order-mail-US1-TC2-1: Uploading proof sends no letter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) has a bank transfer invoice, `pending`.

**Steps:**

1. Upload proof and accept the confirm step.
2. Open the winner's inbox and the send log.

**Expected Results:**

* No letter was sent for the upload.
* The send log has no entry for it.

### order-mail-US1-TC3-1: A replayed return sends the letter once

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Post-close letters

**Pre-conditions:**

* <lot_1> was returned once and its letter sent.

**Steps:**

1. Replay the same return event.
2. Read the send log.

**Expected Results:**

* One proof-not-accepted entry exists for that return.

### order-mail-US1-TC4-1: Each separate return sends its own letter

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Post-close letters

**Pre-conditions:**

* <lot_1> was returned, re-uploaded, and is Payment Verifying again.

**Steps:**

1. Return the invoice a second time.
2. Read the send log.

**Expected Results:**

* Two proof-not-accepted letters exist, one per return.
* The second names the second reason.

### order-mail-US1-TC5-1: How the time left reads in the letter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Post-close letters

**Pre-conditions:**

* <lot_1> was returned with <time left>.

**Test data:**

| <time left> |
| --- |
| 1 minute |
| 6 days 23 hours |

**Steps:**

1. Open the proof-not-accepted letter.

**Expected Results:**

* The letter states <time left> in the winner's zone.

**Blocked:** Product - does the letter give a new Pay by datetime or a duration left? Deadlines elsewhere are absolute, no countdown.

### order-mail-US1-TC6-1: No reminder goes out while proof is checked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reminder cadence

**Pre-conditions:**

* <lot_1> became Payment Verifying on day 2 of its invoice.

**Steps:**

1. Let days 3, 6 and 7 of the original schedule pass.
2. Read the send log.

**Expected Results:**

* No day-3, day-6 or final notice was sent.
* No expiry letter was sent.

### order-mail-US1-TC7-1: Reminders resume after a return

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reminder cadence

**Pre-conditions:**

* <lot_1> was Payment Verifying from day 2, then returned with 5 days left.

**Steps:**

1. Let the resumed deadline run to its end, unpaid.
2. Read the send log.

**Expected Results:**

* Day-3, day-6 and final-notice letters are sent.
* Each is timed against the resumed deadline.

**Blocked:** Product - after a return, are reminders re-timed by the pause, and is one whose original time passed during the check sent late or skipped?

### order-mail-US1-TC8-1: Confirmed proof ends the reminder sequence

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
* **Trace:** Reminder cadence

**Pre-conditions:**

* <lot_1> is Payment Verifying with reminders held.

**Steps:**

1. An operator confirms the payment.
2. Let the resumed schedule times pass.
3. Read the send log.

**Expected Results:**

* A payment-received letter names bank transfer.
* No reminder or final notice is sent afterwards.

### order-mail-US1-TC9-1: Card invoice reminders are unaffected

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reminder cadence

**Pre-conditions:**

* <lot_2> has a card invoice, `pending`, never Payment Verifying.

**Steps:**

1. Let day 3 of the invoice pass.
2. Read the send log.

**Expected Results:**

* The day-3 reminder is sent.

## Raised

- Does the proof-not-accepted letter state a new absolute deadline or a duration?
- After a return, are the day-3/day-6/final-notice times shifted by the pause, and is a reminder whose time passed during the check sent late or skipped?
- Does a reissue while Payment Verifying reset the held sequence?

## Reconciliation

**Status:** paused — waiting on the author (@jeffffej0909) for a grilling round on
decisions neither reading could settle: proof on an expired invoice, operator
actions while Payment Verifying, the deadline on an expired reissue, the method
choice before send, reminders and the letter after a return, grace after a
return, what the winner sees of their proof, non-card settlement of a card
invoice, operator files on confirm, file rules, and who reads proof files.

**Blind input manifest hash:** `2c7380f5cdff72fd`
