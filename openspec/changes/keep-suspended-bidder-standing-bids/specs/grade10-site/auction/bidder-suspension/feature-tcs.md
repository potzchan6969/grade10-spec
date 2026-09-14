# grade10-site/auction/bidder-suspension Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## suspension-US1: Collector who misses a deadline loses their auction standing

**As a** collector who let a payment deadline pass,
**I want** to be told plainly that I can no longer bid, what I still owe, and
how to resolve it,
**so that** I understand what I can still do and what it takes to bid again.

### suspension-US1-TC1-1: Elapsed deadline suspends the account

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
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
* **Suites:** smoke, regression
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
* **Status:** deprecated
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke, regression
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
* **Suites:** smoke, regression
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
* **Suites:** smoke, regression
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

### suspension-US1-TC6-1: Suspended account cannot bid or raise its maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** suspension-US-01

**Pre-conditions:**
customer(suspended) holds a maximum of 50000 HKD minor units on <listing_1> and is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_1> | An open lot where the customer holds a maximum of 50000 HKD minor units |
| <listing_2> | A second open lot where the customer holds no bid |

**Steps:**

1. Navigate to <listing_1>.
2. Try to raise the maximum.
3. Navigate to <listing_2>.
4. Try to place a bid.

**Expected Results:**

* Grade10 refuses the raise at step 2.
* Grade10 refuses the bid at step 4.
* The maximum on <listing_1> is still 50000 HKD minor units.

---

## suspension-US2: Bidder competes on a lot whose leader is suspended

**As a** bidder on a lot led by an account that is then suspended,
**I want** the lot's price, leader and bid history to stay as they were,
**so that** the bids I placed against that account still count as I made them.

### suspension-US2-TC1-1: Suspension leaves an open lot and its history unchanged

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
* **Trace:** suspension-US-02

**Pre-conditions:**

* <listing_3> is open, led by customer A at a current price of 30000 HKD minor units.
* customer B holds a lower maximum on <listing_3>.
* customer A has an auction order whose payment deadline is one second away.

**Steps:**

1. Navigate to <listing_3> and note its bid history.
2. Wait for the payment deadline to pass.
3. Reload <listing_3>.

**Expected Results:**

* customer A still leads at 30000 HKD minor units.
* The bid history has the same entries as at step 1.

### suspension-US2-TC2-1: Standing maximum keeps bidding after suspension

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** suspension-US-02

**Pre-conditions:**

* customer A is suspended and leads <listing_4> at 30000 HKD minor units with a maximum of 50000 HKD minor units.
* customer B is signed in.

**Steps:**

1. As customer B, navigate to <listing_4>.
2. Commit a maximum of 40000 HKD minor units.
3. Read the lot's leader and current price.

**Expected Results:**

* customer A still leads <listing_4>.
* The current price is what auto-bidding resolves for these two maximums.

### suspension-US2-TC3-1: Suspended account wins through a standing maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** suspension-US-02

**Pre-conditions:**
customer A is suspended and holds the highest maximum on <listing_5>, which is about to close.

**Steps:**

1. Wait for <listing_5> to close.
2. Sign in as customer A.
3. Open the auction order for <listing_5>.

**Expected Results:**

* customer A wins <listing_5>.
* The auction order has its own invoice and payment deadline.
