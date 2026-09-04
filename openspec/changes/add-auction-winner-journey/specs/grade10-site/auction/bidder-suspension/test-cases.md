# grade10-site/auction/bidder-suspension Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-03, tcs-rules r1

## suspension-US1: Collector who misses a deadline loses their auction standing

**As a** collector who let a payment deadline pass,
**I want** to be told plainly that I can no longer bid, what I still owe, and
how to resolve it,
**so that** I understand why my other bids have gone and what it takes to bid
again.

### suspension-US1-TC1-1: Elapsed deadline suspends the account

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** suspension-US-01

**Pre-conditions:**
An auction order whose invoice is `pending` and whose payment deadline is one second away.

**Steps:**

1. Wait for the payment deadline to pass.
2. Sign in as the winner and open <an open listing url>.
3. Attempt to commit a maximum.
4. Open <the winner's account record url>.

**Expected Results:**

* Grade10 refuses the maximum at step 3.
* The winner was notified of the outstanding amount and how to resolve it.
* The account record shows the suspension, its reason, and the causing order.

### suspension-US1-TC2-1: Suspended account can still pay what it owes

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** suspension-US-01

**Pre-conditions:**
A suspended account holding one outstanding invoice.

**Steps:**

1. Sign in as the suspended collector.
2. Navigate to <the winner's auction order url>.
3. Pay the outstanding invoice.

**Expected Results:**

* Grade10 accepts the payment.
* The invoice status becomes `paid`.

### suspension-US1-TC3-1: Standing maxima on open lots are retracted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** suspension-US-01

**Pre-conditions:**
A collector leading two open lots and holding a standing maximum on a third, with an auction order whose payment deadline is one second away.

**Steps:**

1. Wait for the payment deadline to pass.
2. Read each of the three lots' bid histories.
3. Read the leader on each of the two lots the collector led.

**Expected Results:**

* All three maxima are retracted.
* Each retraction is logged as a `bid_retracted_suspension` event.
* Each lot the collector led has re-resolved to the next bidder at their own price.

### suspension-US1-TC4-1: A lot already won stays won

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** suspension-US-01

**Pre-conditions:**
A collector who won a lot before being suspended, with a second unpaid auction order whose payment deadline is one second away.

**Steps:**

1. Wait for the payment deadline to pass.
2. Read the won lot's winner.
3. Open the won lot's auction order.

**Expected Results:**

* The won lot is still won by that collector.
* Its invoice is still payable.

### suspension-US1-TC5-1: Paying does not lift the suspension

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** suspension-US-01

**Pre-conditions:**
A suspended account holding one outstanding invoice.

**Steps:**

1. Sign in as the suspended collector and pay the outstanding invoice in full.
2. Open <an open listing url> and attempt to commit a maximum.
3. Open <the winner's account record url>.

**Expected Results:**

* The invoice status becomes `paid`.
* Grade10 refuses the maximum at step 2.
* The account record still shows the suspension and its reason.
