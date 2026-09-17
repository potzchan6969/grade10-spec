# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## grade10-site-auction-account-record-US3: Follow a listing I won through to delivery

**As a** winner,
**I want** to see what I owe and where my card is,
**so that** I do not have to ask Grade10 what happens next.

### grade10-site-auction-account-record-US3-TC1-1: A won lot under proof check reads Payment Verifying

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in.
* <lot_1> is Payment Verifying.

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Read the <lot_1> row.

**Expected Results:**

* Your Standing reads Won with Payment Verifying.
* View order is offered; no helper lines.

### grade10-site-auction-account-record-US3-TC2-1: The row follows the check outcome

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in.
* An operator <action> on <lot_1>.

**Test data:**

| <action> | <status> |
| --- | --- |
| returned the proof | Pending Payment |
| confirmed the payment | Processing |

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Read the <lot_1> row.

**Expected Results:**

* The row reads <status>.

### grade10-site-auction-account-record-US3-TC3-1: Several won lots each read their own status

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(winner of <lot_1> and <lot_3>) is signed in.
* <lot_1> is Payment Verifying; <lot_3> is Pending Payment.

**Steps:**

1. Navigate to <grade10 my auctions url>.

**Expected Results:**

* <lot_1> reads Payment Verifying.
* <lot_3> reads Pending Payment.

### grade10-site-auction-account-record-US3-TC4-1: Another collector never sees the Payment Verifying row

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer B is signed in.
* <lot_1> is customer A's, Payment Verifying.

**Steps:**

1. Navigate to <grade10 my auctions url>.

**Expected Results:**

* No <lot_1> row is shown.

## Raised

- Does a Payment Verifying row carry anything beyond the badge and View order? Calm Won rows suggest not; assumed so.

## Reconciliation

**Status:** complete — reconciled on 2026-09-16 after the author's grilling round.

**Blind input manifest hash:** `2c7380f5cdff72fd`

| Finding | Disposition |
| --- | --- |
| TC1: a won lot under proof check reads Payment Verifying, View order only | Matches `grade10-site-auction-account-record-SC-60` |
| TC2: the row follows the check outcome | Folded as `grade10-site-auction-account-record-SC-61` |
| TC3: several won lots each read their own status | Reached by the state table and `grade10-site-auction-account-record-SC-23`; no new scenario |
| TC4: another collector never sees the row | Reached by the durable requirement "The record belongs to its owner alone"; no new scenario |
| Raised: does a Payment Verifying row carry anything beyond the badge and View order? | Answered by `grade10-site-auction-account-record-SC-58` and `grade10-site-auction-account-record-SC-60`: no helper lines, no upload control |

**Folded:** `grade10-site-auction-account-record-SC-61`.

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

None of the eleven changes a case here.

**Still blocked:** none.

**Out of suite:** none. The other scenarios in the modified requirement are unchanged by this change and stay with the durable suite.

**Notes:** the capability is walked through `grade10-site-auction-account-record-US-03`, carried as a context journey.
