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

* One letter names <lot_1>, <external reason> and the new payment deadline.
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

### order-mail-US1-TC5-1: The letter gives the new deadline as Pay by a date and time

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

* customer(winner of <lot_1>) has a registered email and a timezone set on the account.
* <lot_1> was returned at <return time> with <time left>.

**Test data:**

| <time left> |
| --- |
| 1 minute |
| 6 days 23 hours |

**Steps:**

1. Open the proof-not-accepted letter.

**Expected Results:**

* The letter reads Pay by <return time> plus <time left>, as a date and time in the winner's zone.
* The letter states no duration left.

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

* No reminder is sent at the moment of the return.
* Day-3, day-6 and final-notice letters are sent once each.
* Each is timed on the running deadline, later by the length of the check.

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

### order-mail-US1-TC10-1: A reminder sent before the check is not sent again

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reminder cadence

**Pre-conditions:**

* <lot_1>'s day-3 reminder was sent.
* <lot_1> then became Payment Verifying and was returned.

**Steps:**

1. Let the resumed deadline run to its end, unpaid.
2. Read the send log.

**Expected Results:**

* One day-3 reminder exists for the invoice.
* The day-6 reminder and the final notice are sent once each.

---

### order-mail-US1-TC11-1: The payment-received letter shows the receipt and attaches its PDF

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Post-close letters

**Pre-conditions:**

* <lot_1> is paid by a Visa card ending 4242, with receipt ID `REC-202609-LK7P2Q-01-P1`.
* The winner's letters are in Traditional Chinese.

**Steps:**

1. Open the payment-received letter for <lot_1>.
2. Open the attached PDF.

**Expected Results:**

* The letter shows `REC-202609-LK7P2Q-01-P1`, the invoice ID, the lot, the itemised lines, the order total and the Visa ending 4242.
* One PDF is attached, and its file name contains `REC-202609-LK7P2Q-01-P1`.
* The PDF shows the same receipt ID, lines, total and payment method, with its labels in Traditional Chinese.
* The invoice-sent letter for <lot_1> has no attachment.

---

### order-mail-US1-TC12-1: A manually recorded payment's receipt keeps proof private

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Post-close letters

**Pre-conditions:**

* An operator settled <lot_1> by cash with an external reference and one proof file.

**Steps:**

1. Open the payment-received letter for <lot_1> and its attached PDF.
2. Deliver the settlement event again.
3. Read the send log for <lot_1>.

**Expected Results:**

* The PDF is marked as manually settled and shows cash and the reference.
* Neither the letter nor the PDF shows the proof file, its name, or the internal audit number.
* The send log holds one payment-received letter with one attachment.

## Historical questions (resolved below)

- Does the proof-not-accepted letter state a new absolute deadline or a duration?
- After a return, are the day-3/day-6/final-notice times shifted by the pause, and is a reminder whose time passed during the check sent late or skipped?
- Does a reissue while Payment Verifying reset the held sequence?

## Reconciliation

**Status:** complete — reconciled on 2026-09-16 after the author's grilling round.

**Blind input manifest hash:** `2c7380f5cdff72fd`

| Finding | Disposition |
| --- | --- |
| `order-mail-US1-TC1-1`: returned proof sends the letter | Matches `order-mail-SC-20`; the case now expects the new payment deadline, per decision 5 |
| `order-mail-US1-TC2-1`: uploading proof sends no letter | Matches `order-mail-SC-21` |
| `order-mail-US1-TC3-1`: a replayed return sends the letter once | Reached by the durable requirement "Letters are idempotent and per order"; no new scenario |
| `order-mail-US1-TC4-1`: each separate return sends its own letter | Folded as `order-mail-SC-26` |
| `order-mail-US1-TC5-1`: how the time left reads | Settled by decision 5; the case now expects Pay by a date and time, with no duration; matches `order-mail-SC-20` |
| `order-mail-US1-TC6-1`: no reminder while proof is checked | Matches `order-mail-SC-23`; no expiry letter follows from `auction-status-SC-40` |
| `order-mail-US1-TC7-1`: reminders resume after a return | Settled by decision 5; matches `order-mail-SC-24`; "not sent at the return" folded as `order-mail-SC-27` |
| `order-mail-US1-TC8-1`: confirmed proof ends the sequence | Matches `order-mail-SC-22` and "cancel every outstanding reminder the moment payment is received" |
| `order-mail-US1-TC9-1`: card invoice reminders are unaffected | Reached by `order-mail-SC-04` and the reminder rule; no new scenario |
| `order-mail-SC-25`: a reminder already sent is not repeated | No case reached it; added `order-mail-US1-TC10-1` |
| Raised: absolute deadline or a duration? | Absolute; decision 5 |
| Raised: are reminder times shifted by the pause, and is a missed one sent late? | Shifted; not sent late; decision 5 |
| Raised: does a reissue while Payment Verifying reset the held sequence? | Moot; a reissue is refused while Payment Verifying (decision 2) |
| Folded from #466 (`add-auction-winner-receipt`) | The receipt in the payment-received letter and its PDF attachment, with the `REC-` receipt ID in place of #466's `R-<year>-<six digits>`. The author decided the receipt email attaches the receipt PDF and the invoice email attaches none. Folded as `order-mail-SC-28` to `order-mail-SC-31`, walked by `order-mail-US1-TC11-1` and `order-mail-US1-TC12-1`; the earlier rule that no letter attaches a PDF is replaced |

**Folded:** `order-mail-SC-26`, `order-mail-SC-27`, `order-mail-SC-28`, `order-mail-SC-29`, `order-mail-SC-30`, `order-mail-SC-31`.

**Rejected:** none.

**Settled by the author** (grilling round, 2026-09-16):

1. **Proof on an expired invoice**: refused. Return stays refused on an expired invoice as a guard; it cannot be reached, because the deadline stops while proof is checked.
2. **Operator actions while Payment Verifying**: Confirm or Return only. Cancel, Reissue and manual settlement are refused.
3. **Deadline on an expired reissue**: always a fresh 7 days from send. Keeping the current deadline is offered only on a `pending` invoice.
4. **Method choice**: nothing preselected. A confirmation without a method is refused. The winner changes the method freely until the invoice is sent; after that only an operator does.
5. **After a return**: reminders resume on the paused clock. A reminder whose time passed during the check is not sent late, and one already sent is not repeated. The proof-not-accepted letter gives the new deadline as a date and time in the winner's zone ("Pay by …") and the external reason.
6. **Grace after a return**: none. The return prompt shows the time left, so the operator can reissue with a fresh 7 days instead.
7. **What the winner sees of proof**: a confirmed-proof receipt reads Bank transfer and is not marked manually settled. No proof file or file name reaches the winner anywhere; only the Payment Verifying state shows that proof was sent.
8. **Non-card settlement of a card invoice**: reissue as bank transfer first (fee usually 0), then record the settlement. Settlement is always at the current invoice's full order total.
9. **Operator files on Confirm**: 0 to 5, PDF, JPEG or PNG, 10 MB each.
10. **File rules**: 10 MB is 10,485,760 bytes. One wrong or oversize file refuses the whole upload and stores nothing. An upload that fails part-way stores nothing and may be retried; the one-upload rule applies once an upload succeeds.
11. **Who reads proof files**: any operator who can open the order; never the winner.

Decision 5 changed `order-mail-US1-TC1-1`, `order-mail-US1-TC5-1` and `order-mail-US1-TC7-1`.

**Still blocked:** none.

**Out of suite:** none. `order-mail-SC-01` to `order-mail-SC-11` are unchanged by this change and stay with the durable suite.

**Notes:** the capability is walked by nobody on its own; cases trace the Feature set groups.
