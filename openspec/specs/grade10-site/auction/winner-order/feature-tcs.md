# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-8q4 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC1-1: A lot closing with a winner opens one order with estimated charges

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(signed in, holds a default shipping address) leads <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot taking bids, led by this collector, closing within a minute |

**Steps:**

1. Wait for <lot_1> to close.
2. Navigate to <winner order url> for <lot_1>.
3. Read Order Summary.

**Expected Results:**

* Step 2: one Winner Order exists for <lot_1>.
* Step 3: shipping, insurance and any tax read as estimates.
* Step 3: the order can be paid.

<!-- trace:case id=g10.auction-winner-order.TC-qaq rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC2-1: With no delivery address the invoice cannot be paid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(signed in, no default shipping address) leads <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot taking bids, led by this collector, closing within a minute |

**Steps:**

1. Wait for <lot_1> to close.
2. Navigate to <winner order url> for <lot_1>.
3. Try to pay.

**Expected Results:**

* Step 2: the winning bid and buyer's premium show.
* Step 2: shipping, insurance and any tax read as still to be calculated.
* Step 3: payment is refused until a delivery address is given.

<!-- trace:case id=g10.auction-winner-order.TC-shz rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC3-1: A pre-filled default address must still be confirmed before paying

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_prefilled>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_prefilled> | An unpaid order whose delivery address is pre-filled from the account default, not confirmed |

**Steps:**

1. Try to pay without confirming the delivery address.

**Expected Results:**

* Payment is refused.
* The order asks the winner to confirm the delivery address.

<!-- trace:case id=g10.auction-winner-order.TC-yuw rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC4-1: Changing the address shows the old and new totals before paying

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_unpaid>.
* <address_far> is saved on the account.

**Test data:**

| Field | Value |
| --- | --- |
| <order_unpaid> | An unpaid HKD order, total <total before> |
| <address_far> | A saved address whose shipping and insurance cost <difference> more |
| <total before> | HKD 3,120.00 (312000 minor units) |
| <difference> | HKD 40.00 (4000 minor units) |
| <total after> | HKD 3,160.00: <total before> plus <difference> |

**Steps:**

1. Change the delivery address to <address_far>.
2. Read the totals before paying.

**Expected Results:**

* The new total reads <total after>, equal to <total before> plus <difference>.
* Both <total before> and <total after> show before payment.
* No separate charge of <difference> is raised.

<!-- trace:case id=g10.auction-winner-order.TC-0p6 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC5-1: The winner's bid hold is released and one fresh charge settles

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer A leads <lot_1> with an open bid-time card authorization.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot taking bids, led by customer A, closing within a minute |

**Steps:**

1. Wait for <lot_1> to close.
2. Read customer A's authorization for <lot_1> at the card provider.
3. Pay the invoice by card.
4. Read customer A's card transactions for <lot_1>.

**Expected Results:**

* Step 2: the authorization is released, never captured.
* Step 4: one new transaction for the final amount.

<!-- trace:case id=g10.auction-winner-order.TC-5vo rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC6-1: A declined card leaves the invoice payable

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_unpaid>.
* <card_declining> is mocked to decline.

**Test data:**

| Field | Value |
| --- | --- |
| <order_unpaid> | An unpaid order inside its payment deadline |
| <card_declining> | A card the provider declines |
| <card_good> | A card the provider accepts |

**Steps:**

1. Pay with <card_declining>.
2. Pay with <card_good>.

**Expected Results:**

* Step 1: the invoice stays unpaid and payable.
* Step 2: payment is accepted; the order reads paid.

<!-- trace:case id=g10.auction-winner-order.TC-vxj rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC7-1: The payment deadline is seven days from the recorded close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* <lot_2> was extended twice and closed with a winner at <close>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_2> | A lot whose close moved twice under extended bidding |
| <close> | 2026-09-03T12:00:00Z, the recorded (moved) close |
| <deadline> | 2026-09-10T12:00:00Z: <close> plus 604800s (7 days) |

**Steps:**

1. Read the payment deadline on <lot_2>'s invoice.
2. Open <winner order url> in a browser set to Asia/Hong_Kong.

**Expected Results:**

* Step 1: the deadline is <deadline>.
* Step 2: it reads in the winner's own time zone.

<!-- trace:case id=g10.auction-winner-order.TC-h5e rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC8-1: Two named saved addresses are both offered on an order

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(signed in, no saved shipping address) won <order_unpaid>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_unpaid> | An unpaid order inside its setup window |
| <address_home> | A shipping address named Home |
| <address_work> | A shipping address named Work |

**Steps:**

1. Save <address_home> and <address_work> to the account address book.
2. Navigate to <winner order url> for <order_unpaid>.
3. Open the delivery address picker.

**Expected Results:**

* Step 1: both addresses are in the address book, each under its name.
* Step 3: both are offered for the order.

<!-- trace:case id=g10.auction-winner-order.TC-hrx rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC9-1: One default address pre-fills a new order

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(signed in) has <address_home> as default and <address_work> saved.

**Test data:**

| Field | Value |
| --- | --- |
| <address_home> | A saved shipping address named Home |
| <address_work> | A saved shipping address named Work |
| <order_new> | An order opened after step 1 |

**Steps:**

1. Set <address_work> as the default.
2. Navigate to <winner order url> for <order_new>.

**Expected Results:**

* Step 1: only <address_work> is marked default.
* Step 2: the delivery address is pre-filled with <address_work>.

<!-- trace:case id=g10.auction-winner-order.TC-jje rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC10-1: Editing a saved address leaves the order's snapshot

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) confirmed <address_home> on <order_unpaid>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_unpaid> | An unpaid order whose delivery address is <address_home> |
| <address_home> | A saved shipping address named Home |
| <new street> | A different address line 1 |

**Steps:**

1. Edit <address_home>'s address line 1 to <new street> in the address book.
2. Navigate to <winner order url> for <order_unpaid>.

**Expected Results:**

* Step 1: the address book shows <new street>.
* Step 2: the order still shows the original address line 1.

<!-- trace:case id=g10.auction-winner-order.TC-5jc rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC11-1: An address an unpaid order uses cannot be archived

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) confirmed <address_work> on <order_unpaid>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_unpaid> | An unpaid order whose delivery address is <address_work> |
| <address_work> | A saved shipping address named Work |

**Steps:**

1. Archive <address_work> in the address book.

**Expected Results:**

* The winner is asked to choose another address for <order_unpaid>.
* <address_work> stays available while the order uses it.

<!-- trace:case id=g10.auction-winner-order.TC-nsg rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC12-1: Add Address opens with no phone country chosen

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |

**Steps:**

1. Open Complete Order Setup.
2. Open Add Address for delivery.
3. Look at the Phone field.

**Expected Results:**

* Phone shows a globe only: no flag, no calling-code divider.
* The placeholder shows an example with a calling code, `+852 12345678`.
* No calling country is chosen.

<!-- trace:case id=g10.auction-winner-order.TC-4gp rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC13-1: Add Address opens on Personal with Company Name hidden

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_setup>, Complete Order Setup open.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |

**Steps:**

1. Open Add Address for delivery.
2. Read the Personal / Company control and the fields below it.

**Expected Results:**

* Personal is selected.
* Company Name is not shown.

<!-- trace:case id=g10.auction-winner-order.TC-rx1 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC14-1: Choosing Company shows a required Company Name

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for <order_setup>, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |

**Steps:**

1. Click Company on the Personal / Company control.
2. Read the fields below it.

**Expected Results:**

* Company is selected.
* Company Name shows, marked required.

<!-- trace:case id=g10.auction-winner-order.TC-51d rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC15-1: A company address without Company Name is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for <order_setup>, Company selected.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |
| Company Name | (empty) |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside Company Name.
* No address is saved or applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-r03 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC16-1: A phone country with no digits is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for <order_setup>, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | (empty) |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside Phone.
* No address is saved or applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-qwo rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC17-1: Phone digits with no country are refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for <order_setup>, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| First name | Alex |
| Last name | Chen |
| Phone country | (not chosen) |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside Phone.
* No address is saved or applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-jo6 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC18-1: An unusual phone format is accepted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for <order_setup>, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| First name | Alex |
| Last name | Chen |
| Phone country | United Kingdom |
| Phone digits | +44 (0)20 7946 0958 |
| Country or region | United Kingdom |
| Town or city | London |
| Address line 1 | 10 Downing St |
| Postal code | SW1A 2AA |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is accepted; no phone-format refusal shows.
* The address is applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-qia rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC19-1: A parseable phone is stored in E.164

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for <order_setup>, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | (415) 555-0100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |
| <stored phone> | +14155550100 |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.
3. Read the phone on the order's delivery address.

**Expected Results:**

* Step 2: the confirm is accepted.
* Step 3: the phone reads <stored phone>.

<!-- trace:case id=g10.auction-winner-order.TC-phu rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC20-1: Address line 2 and state may be left empty

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for <order_setup>, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Address line 2 | (empty) |
| State or province | (empty) |
| Postal code | 94105 |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.
3. Read the order's delivery address.

**Expected Results:**

* Step 2: the confirm is accepted.
* Step 3: line 1 and postal code show; line 2 and state are empty.

<!-- trace:case id=g10.auction-winner-order.TC-2vd rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC21-1: Add Address has no Apt, Suite or Building field

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |

**Steps:**

1. Read every field label on the form.

**Expected Results:**

* No Apt., Suite or Building field shows.
* Address line 2 shows as the optional second line.

<!-- trace:case id=g10.auction-winner-order.TC-4zr rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC22-1: A personal address card is titled with the recipient's name

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner, has <address_personal> saved) is on <winner order url> for <order_setup>, Complete Order Setup open.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| <address_personal> | A saved personal address for Alex Chen, 100 Market St, San Francisco 94105, United States, with phone |

**Steps:**

1. Open the delivery address picker.
2. Read <address_personal>'s card.

**Expected Results:**

* The title reads Alex Chen.
* The body shows street, city or region, and country.
* The body shows no postal code and no phone.

<!-- trace:case id=g10.auction-winner-order.TC-ajg rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC23-1: A company address card is titled with the company name

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner, has <address_company> saved) is on <winner order url> for <order_setup>, Complete Order Setup open.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| <address_company> | A saved company address for Northwind Collectibles, recipient Alex Chen, with phone and postal code |

**Steps:**

1. Open the delivery address picker.
2. Read <address_company>'s card.

**Expected Results:**

* The title reads Northwind Collectibles, not Alex Chen.
* The body shows street, city or region, and country.
* The body shows no postal code and no phone.

<!-- trace:case id=g10.auction-winner-order.TC-u2z rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC24-1: A company delivery address with phone confirms onto the order

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| Kind | Company |
| Company Name | Northwind Collectibles |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Click Company.
2. Fill the fields from **Test data**.
3. Click confirm.
4. Reopen the delivery address picker.

**Expected Results:**

* Step 3: the order's delivery address carries Northwind Collectibles, Alex Chen, phone and 94105.
* Step 4: the card reads Northwind Collectibles, with no phone or postal code.

<!-- trace:case id=g10.auction-winner-order.TC-kqe rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC25-1: Order Summary shows the full delivery and billing addresses after setup

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_setup>, reading Awaiting Setup.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| Kind | Company |
| Company Name | Northwind Collectibles |
| First name | Alex |
| Last name | Chen |
| Phone | +14155550100 |
| Address line 1 | 100 Market St |
| Town or city | San Francisco |
| Postal code | 94105 |
| Country or region | United States |
| Billing | Same as delivery, left ticked |

**Steps:**

1. Open Complete Order Setup.
2. Enter the delivery address from **Test data**.
3. Confirm setup.
4. Read Delivery and Billing on Order Summary.

**Expected Results:**

* Delivery shows company, recipient, phone, 100 Market St, San Francisco 94105 and United States.
* Billing shows the same as Delivery.

<!-- trace:case id=g10.auction-winner-order.TC-apy rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC26-1: A sent invoice with Insurance shows the amount and its tip

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_with_insurance>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_with_insurance> | An order whose sent invoice includes Insurance |
| <insurance_amount> | The Insurance amount on that invoice |

**Steps:**

1. Find Insurance on Order Summary.
2. Hover the Insurance info tooltip.

**Expected Results:**

* Step 1: Insurance reads <insurance_amount>, not TBD.
* Step 2: the tooltip reads `0.9% of the order value during transit.`

<!-- trace:case id=g10.auction-winner-order.TC-aq5 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC27-1: Before the invoice is sent, Insurance reads TBD

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_pre_invoice>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_pre_invoice> | An order whose invoice is not yet sent |

**Steps:**

1. Read the fee rows on Order Summary.
2. Hover the Insurance info tooltip.

**Expected Results:**

* Step 1: Insurance shows with the other fee rows, reading TBD.
* Step 2: the tooltip reads `0.9% of the order value during transit.`

<!-- trace:case id=g10.auction-winner-order.TC-7cb rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC28-1: A sent invoice without Insurance shows no Insurance row

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_without_insurance>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_without_insurance> | An order whose sent invoice has no Insurance |

**Steps:**

1. Read Order Summary.

**Expected Results:**

* No Insurance row and no Insurance tooltip show.

### winner-order-US1-TC29-1: A listing code already held is replaced before publish

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* <listing_2> holds listing code <code_1>.
* <listing_3> is a draft whose internal id hashes to <code_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <code_1> | A listing code in use |

**Steps:**

1. Publish <listing_3>.
2. Read <listing_3>'s listing code.
3. Change the hash method, then read both listing codes.

**Expected Results:**

* Step 2: <listing_3> holds a code other than <code_1>, hashed again with a counter.
* Step 2: `L` and 5 characters; no `0`, `O`, `1`, `I` or lower case.
* Step 3: both listings keep their codes.

### winner-order-US1-TC34-1: The winner sees an operator's edit before send, and cannot change it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_preparing>.
* An operator changed <order_preparing> to <address_work> and bank transfer.

**Test data:**

| Field | Value |
| --- | --- |
| <order_preparing> | An HKD order reading Preparing Invoice, home address and card confirmed |
| <address_work> | A saved address named Work |

**Steps:**

1. Reload the order.
2. Look for address and payment-method controls.

**Expected Results:**

* Step 1: the order shows <address_work> and bank transfer, still Preparing Invoice.
* Step 2: no control changes either.

### winner-order-US1-TC35-1: Archiving an address a confirmed order uses leaves the order's copy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) confirmed <address_work> on <order_preparing>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_preparing> | An order reading Preparing Invoice, <address_work> confirmed |
| <address_work> | A saved address named Work |

**Steps:**

1. Archive <address_work> in the address book.
2. Navigate to <winner order url> for <order_preparing>.

**Expected Results:**

* Step 1: <address_work> is archived.
* Step 2: the order still shows <address_work>.

---

### winner-order-US1-TC36-1: Delivery Add Address offers a complete A–Z country catalogue

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is closed.

**Steps:**

1. Open the Country/Region picker.
2. Scroll the popup from the first option to the last.

**Expected Results:**

* Step 1 opens a popup listing every country and region A–Z, not a short designated set.
* Step 2 keeps the full catalogue available inside the capped-height popup.

### winner-order-US1-TC37-1: Country/Region field label matches the manual wording

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.

**Steps:**

1. Look at the country or region field label beside the picker.

**Expected Results:**

* The label reads Country/Region.

### winner-order-US1-TC38-1: Closed field shows the selected or default country

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is closed with the fixture default Hong Kong selected.

**Steps:**

1. Read the Country/Region field without opening the popup.

**Expected Results:**

* The field shows Hong Kong.
* Country/Region options are not in the tree.

### winner-order-US1-TC39-1: Open catalogue lists every country inside a scrollable popup

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.

**Steps:**

1. Open the Country/Region picker.
2. Scroll within the popup to a mid-alphabet name and to a late-alphabet name.

**Expected Results:**

* Step 1 shows every country and region A–Z in the popup.
* Step 2 scrolls the long list inside a capped height without truncating the catalogue to a short set.

### winner-order-US1-TC40-1: Typing filters the list to matching country names

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open on a long A–Z list.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | hong |

**Steps:**

1. Focus the open Country/Region picker.
2. Type the query from **Test data**.

**Expected Results:**

* Step 2 shows only country or region names that match the query.
* Names that do not match (for example Australia) are not shown.

### winner-order-US1-TC41-1: Autocomplete filter works in isolation on a long list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* A design-system Autocomplete is rendered with a long option list taller than its capped popup height.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | uni |

**Steps:**

1. Open the Autocomplete.
2. Type the query from **Test data**.

**Expected Results:**

* The list shows only options whose labels match the query.
* Non-matching options are not shown.

### winner-order-US1-TC42-1: A query with no match leaves the list empty

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | zzzz-not-a-country |

**Steps:**

1. Type the query from **Test data**.

**Expected Results:**

* The list shows no country or region options.

### winner-order-US1-TC43-1: Filter matches an early-alphabet name

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | afg |

**Steps:**

1. Type the query from **Test data**.

**Expected Results:**

* Afghanistan (or the catalogue name that matches) appears in the filtered list.
* Unrelated late-alphabet names are not shown.

### winner-order-US1-TC44-1: Filter matches a late-alphabet name

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open near the start of the A–Z list.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | zim |

**Steps:**

1. Type the query from **Test data**.

**Expected Results:**

* Zimbabwe (or the catalogue name that matches) appears in the filtered list.
* Unrelated early-alphabet names are not shown.

### winner-order-US1-TC45-1: Choosing a filtered country closes the picker on that selection

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is closed on the fixture default.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | united king |
| Country or region | United Kingdom |

**Steps:**

1. Open the Country/Region picker.
2. Type the query from **Test data**.
3. Select United Kingdom from the filtered matches.

**Expected Results:**

* Step 3 closes the popup.
* The field shows United Kingdom.
* Options are no longer in the tree.

### winner-order-US1-TC46-1: Empty Country/Region is refused beside the field

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* Country/Region has no value selected.
* Other required address fields that the form needs are filled.

**Steps:**

1. Activate Confirm or Use This Address with Country/Region empty.

**Expected Results:**

* A field refusal appears beside Country/Region.
* The address is not applied with an empty country or region.

### winner-order-US1-TC47-1: Catalogue includes both early and late alphabet partitions

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.

**Steps:**

1. Open the Country/Region picker.
2. Note whether an early-alphabet name and a late-alphabet name both appear in the list.

**Expected Results:**

* The open list includes names from the start of the A–Z range and from near the end.
* The set is not limited to a short designated sample.

---

## winner-order-US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt PDF that says how I paid, what was paid before it and what
is still owed, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

<!-- trace:case id=g10.auction-winner-order.TC-h7f rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC1-1: The receipt itemises what was paid and sums to the total

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_paid>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_paid> | An HKD order paid in full at <final amount> |
| <final amount> | HKD 3,160.00 (316000 minor units) |

**Steps:**

1. Download the receipt PDF.
2. Read its lines.

**Expected Results:**

* Winning bid, buyer's premium, shipping, insurance, any tax and final amount show.
* The lines sum to <final amount>.
* It names how it was paid.

<!-- trace:case id=g10.auction-winner-order.TC-qvc rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC4-1: A single full payment's receipt reads zero before and zero left

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_paid>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_paid> | An HKD order with invoice total <total>, paid by one payment of <total> |
| <total> | HKD 1,000.00 (100000 minor units) |

**Steps:**

1. Download the receipt PDF.

**Expected Results:**

* Original Invoice Total <total>; Previous Payments 0.
* Current Payment Received <total>; Remaining Balance Due 0.

<!-- trace:case id=g10.auction-winner-order.TC-myw rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC5-1: Receipts for part payments carry the running history in order

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_parts>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_parts> | An HKD order with invoice total <total>, paid <payment 1> then <payment 2> |
| <total> | HKD 1,000.00 |
| <payment 1> | HKD 400.00 |
| <payment 2> | HKD 300.00 |

| Receipt | Previous Payments | Current Payment Received | Remaining Balance Due |
| --- | --- | --- | --- |
| First | 0 | HKD 400.00 | HKD 600.00: <total> − <payment 1> |
| Second | HKD 400.00 | HKD 300.00 | HKD 300.00: <total> − <payment 1> − <payment 2> |

**Steps:**

1. Open the Receipt PDF row.
2. Open the first receipt, then the second.

**Expected Results:**

* Step 1: both receipts are listed on one row, oldest first.
* Step 2: each shows Original Invoice Total <total> and its row's values.

<!-- trace:case id=g10.auction-winner-order.TC-gss rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC6-1: A receipt that closes within tolerance reads zero left

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_tolerance>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_tolerance> | An HKD order, total <total>, paid <paid before>, then closed Paid by an operator recording <closing payment> within the closing tolerance |
| <total> | HKD 1,000.00 |
| <paid before> | HKD 900.00 |
| <closing payment> | HKD 50.00 |

**Steps:**

1. Open the receipt for <closing payment>.

**Expected Results:**

* Original Invoice Total <total>; Previous Payments <paid before>.
* Current Payment Received <closing payment>; Remaining Balance Due 0.
* No shortfall or write-off line shows.

<!-- trace:case id=g10.auction-winner-order.TC-b4d rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC7-1: An overpayment's receipt records the whole payment and zero left

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_over>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_over> | An HKD order, total <total>, with an operator-confirmed payment of <payment> |
| <total> | HKD 1,000.00 |
| <payment> | HKD 1,100.00 |

**Steps:**

1. Open the receipt.

**Expected Results:**

* Original Invoice Total <total>; Previous Payments 0.
* Current Payment Received <payment>; Remaining Balance Due 0.
* No negative balance or credit line shows.

<!-- trace:case id=g10.auction-winner-order.TC-vmr rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC8-1: A later refund or reversal leaves issued receipts unchanged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_three>.
* The second payment was later refunded or reversed.

**Test data:**

| Field | Value |
| --- | --- |
| <order_three> | An HKD order, total HKD 1,000.00, paid HKD 200.00, HKD 300.00, HKD 100.00 in that order, one receipt each |

| Receipt | Previous Payments | Current Payment Received | Remaining Balance Due |
| --- | --- | --- | --- |
| First | 0 | HKD 200.00 | HKD 800.00 |
| Second | HKD 200.00 | HKD 300.00 | HKD 500.00 |
| Third | HKD 500.00 | HKD 100.00 | HKD 400.00 |

**Steps:**

1. Open each receipt in turn.

**Expected Results:**

* Each still shows its row's values.
* No receipt was reissued.

<!-- trace:case id=g10.auction-winner-order.TC-4zy rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC2-1: A dispatched lot shows the carrier and tracking link

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_shipped>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_shipped> | A paid order dispatched with <carrier> and <tracking number> |

**Steps:**

1. Read the shipment section.
2. Click <tracking number>.

**Expected Results:**

* Step 1: <carrier> and <tracking number> show.
* Step 2: the carrier's tracking page opens.

<!-- trace:case id=g10.auction-winner-order.TC-l8v rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC3-1: Delivery proof keeps the carrier's timestamp and signature

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-02

**Pre-conditions:**

* <order_shipped> is dispatched.
* The carrier delivery feed is mocked to report delivery with <handover time> and <signature>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_shipped> | A paid, dispatched order |
| <handover time> | The handover timestamp in the carrier's report |
| <signature> | The signature image in the carrier's report |

**Steps:**

1. Wait for the delivery report to be processed.
2. Navigate to <winner order url> for <order_shipped>.
3. Open the delivery proof.

**Expected Results:**

* <handover time> and <signature> show, not only a delivered flag.

### winner-order-US2-TC9-1: A receipt ID takes the payment month and the receipt shows the breakdown

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_verifying>.
* admin(holds payment-processing) confirms its proof at <confirm time>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_verifying> | An HKD order, invoice `INV-202609-LK7P2Q-02`, total <total>, reading Payment Verifying |
| <total> | HKD 3,170.00 (317000 minor units) |
| <confirm time> | 2026-09-30T16:30:00Z, October in Hong Kong |
| <receipt id> | `REC-202610-LK7P2Q-02-P1` |

**Steps:**

1. Download the receipt PDF.

**Expected Results:**

* The receipt ID is <receipt id>.
* Original Invoice Total <total>; Previous Payments 0.
* Current Payment Received <total>; Remaining Balance Due 0.

### winner-order-US2-TC10-1: Invoice and receipt PDFs outlive a deleted account

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-02

**Pre-conditions:**

* <order_paid> is paid, with a replaced invoice, a current invoice and a receipt.
* Its winner deleted the account a year after payment.
* The clock is 6 years after payment, inside the 7-year retention.

**Test data:**

| Field | Value |
| --- | --- |
| <order_paid> | A paid order whose invoice was once reissued |

**Steps:**

1. Retrieve <order_paid>'s documents from the archive.

**Expected Results:**

* The replaced invoice, current invoice and receipt PDFs are all returned.

### winner-order-US2-TC11-1: A repeated payment confirmation keeps one receipt ID

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-02

**Pre-conditions:**

* <order_paid> was paid by card; its receipt ID is <receipt id>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_paid> | A card-paid order |
| <receipt id> | `REC-202609-LK7P2Q-01-P1` |

**Steps:**

1. Deliver the same payment confirmation for <order_paid> again.
2. Open the receipt on <winner order url> for <order_paid>.

**Expected Results:**

* The receipt ID is still <receipt id>.
* No second receipt ID or audit number exists for <order_paid>.

---

## winner-order-US3: Winner checks the buyer's premium on an invoice

**As a** winner,
**I want** the buyer's premium on my invoice to follow one published rule,
**so that** I can check what I am charged on top of my winning bid.

### winner-order-US3-TC5-1: The invoice's Buyer's Premium follows the published rule

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-03

**Pre-conditions:**

* customer(winner) won a lot at <winning bid>, and its invoice was sent.
* The currency's premium minimum in Auction Payment settings is <minimum> at send.
* customer is on the order's Winner Order page.

**Test data:**

| Winning bid | Minimum | Buyer's Premium | Rule |
| --- | --- | --- | --- |
| HKD 10,000.00 (1000000 minor units) | HKD 0.00 | HKD 2,000.00 | 20% of the winning bid |
| JPY 1003 | JPY 0 | JPY 201 | 20% is 200.6, rounded half up |
| JPY 1002 | JPY 0 | JPY 200 | 20% is 200.4, rounded half up |
| HKD 500.00 (50000 minor units) | HKD 200.00 (20000 minor units) | HKD 200.00 | The minimum, higher than 20% (HKD 100.00) |

**Steps:**

1. Read Order Summary.
2. Hover the Buyer's Premium info tooltip.

**Expected Results:**

* Step 1: the winning bid line reads <winning bid>.
* Step 1: Buyer's Premium reads the row's value.
* Step 1: the total equals the sum of the lines shown.
* Step 2: a brief tooltip explains Buyer's Premium.

---

## winner-order-US5: Winner misses the payment deadline

**As a** winner whose invoice deadline has passed unpaid,
**I want** Winner Order to read Payment Overdue with Contact Us and no card Pay,
**so that** I know self-service payment has stopped and how to reach Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-uup rev=1 covers=g10.auction-winner-order.SC-9vf -->
### winner-order-US5-TC1-1: Past the payment deadline the order reads Payment Overdue with Contact Us

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-05

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An order whose payment deadline passed unpaid |

**Steps:**

1. Read the status and the inline alert.
2. Look for payment controls.

**Expected Results:**

* Step 1: the order reads Payment Overdue, with Contact Us.
* Step 2: no card Pay is offered and no payment deadline shows.

### winner-order-US5-TC2-1: A cancelled order shows no stepper and no invoice PDF

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-05

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_cancelled>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_cancelled> | An unpaid order an operator cancelled |

**Steps:**

1. Read the page.

**Expected Results:**

* No progress stepper shows.
* No invoice PDF control shows.

---

## winner-order-US7: Winner misses the address deadline

**As a** winner who did not confirm a delivery address within 48 hours of lot close,
**I want** Winner Order to read Setup Overdue with Contact Us and no Confirm,
**so that** I know self-service setup has stopped and how to reach Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-2in rev=1 covers=g10.auction-winner-order.SC-36a,g10.auction-winner-order.SC-k2b -->
### winner-order-US7-TC1-1: Past the setup deadline the order reads Setup Overdue with Contact Us

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_setup_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup_overdue> | An order whose setup deadline, 172800s (48 hours) after the close, passed with setup incomplete |

**Steps:**

1. Read the status and the inline alert.
2. Look for setup controls.

**Expected Results:**

* Step 1: the order reads Setup Overdue, with Contact Us.
* Step 2: no Confirm and no address editing are offered.

---

## winner-order-US6: Losing bidder gets their hold back when the lot closes

**As a** bidder who did not win,
**I want** the card hold my bids put there lifted as soon as the lot closes,
**so that** losing an auction does not leave my money reserved until the
authorization expires on its own.

### winner-order-US6-TC1-1: A losing bidder's card hold is released at the close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-06

**Pre-conditions:**

* customer A holds a card authorization for their bid on <lot_1>.
* customer B leads <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot taking bids, bid on by customer A and led by customer B, about to close |

**Steps:**

1. Let <lot_1> close with customer B winning.
2. Read the authorization for customer A and <lot_1> at the card provider.

**Expected Results:**

* customer A's authorization is released, not left to expire.
* No charge is captured on customer A's card.

### winner-order-US6-TC2-1: Every hold a losing bidder's bids placed is released

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-06

**Pre-conditions:**

* customer A bid on <lot_1> more than once, each bid authorized on their card.
* customer B leads <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot taking bids, with several bids from customer A, led by customer B, about to close |

**Steps:**

1. Let <lot_1> close with customer B winning.
2. Read every authorization for customer A and <lot_1> at the card provider.

**Expected Results:**

* No authorization for customer A and <lot_1> is left held.

---

## winner-order-US8: Winner pays an invoice with a policy premium

**As a** winner of an auction lot,
**I want** my invoice to calculate the stated buyer premium correctly using the
current currency minimum,
**so that** the amount I pay is explainable and collectible.

<!-- trace:case id=g10.auction-winner-order.TC-n3p rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->
### winner-order-US8-TC1-1: The invoice charges 20% of the winning bid as premium

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
* **Trace:** winner-order-US-08

**Pre-conditions:**

* The HKD premium minimum is 0.
* An invoice is created for <order_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_1> | An HKD order won at <winning bid> |
| <winning bid> | HKD 2,500.00 (250000 minor units) |
| <premium> | HKD 500.00: 20% of <winning bid> |

**Steps:**

1. Read the API response for <order_1>'s invoice.

**Expected Results:**

* Buyer's premium is <premium>.
* The total includes <premium>.

<!-- trace:case id=g10.auction-winner-order.TC-zt4 rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->
### winner-order-US8-TC2-1: A currency minimum above 20% becomes the premium

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-08

**Pre-conditions:**

* The HKD premium minimum is <minimum>.

**Test data:**

| Field | Value |
| --- | --- |
| <minimum> | HKD 200.00 (20000 minor units) |
| <winning bid> | HKD 5.00 (500 minor units) |
| 20% of <winning bid> | HKD 1.00 (100 minor units) |

**Steps:**

1. Compute the premium for <winning bid>.

**Expected Results:**

* The premium is <minimum>, not 20% of <winning bid>.

<!-- trace:case id=g10.auction-winner-order.TC-dd3 rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->
### winner-order-US8-TC3-1: With a zero minimum, 20% is rounded half up

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-08

**Pre-conditions:**

* The JPY premium minimum is 0.

**Test data:**

| Field | Value |
| --- | --- |
| <winning bid> | JPY 1003 |
| <premium> | JPY 201: 20% is 200.6, rounded half up |

**Steps:**

1. Compute the premium for <winning bid>.

**Expected Results:**

* The premium is <premium>.

<!-- trace:case id=g10.auction-winner-order.TC-i06 rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->
### winner-order-US8-TC4-1: A sent invoice keeps its premium when the minimum changes

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
* **Trace:** winner-order-US-08

**Pre-conditions:**

* <order_2>'s invoice was sent while the HKD minimum was 0.

**Test data:**

| Field | Value |
| --- | --- |
| <order_2> | An HKD order won at HKD 5.00, invoice sent with premium HKD 1.00 |
| <new minimum> | HKD 200.00 |

**Steps:**

1. Set the HKD premium minimum to <new minimum>.
2. Read the API response for <order_2>'s sent invoice.
3. Reissue <order_2>'s invoice.
4. Read the API response for the reissued invoice.

**Expected Results:**

* Step 2: the premium is still HKD 1.00.
* Step 4: the premium is <new minimum>.

---

## winner-order-US12: Winner confirms delivery when five addresses are already saved

**As a** winner with five saved shipping addresses,
**I want** to confirm a different address for this order without saving a sixth,
**so that** a full address book does not block settlement before the address deadline.

<!-- trace:case id=g10.auction-winner-order.TC-mv4 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC1-1: Add Address at the five-address cap shows phone and kind

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on <winner order url> for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.

**Expected Results:**

* The Personal / Company control shows, Personal selected, Company Name hidden.
* Phone shows a country selector and number input, no country chosen.

<!-- trace:case id=g10.auction-winner-order.TC-yzv rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC2-1: At the cap a one-time personal address confirms without saving

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on <winner order url> for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| First name | Jordan |
| Last name | Lee |
| Phone country | United States |
| Phone digits | 2125550147 |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.
3. Fill the fields from **Test data**, Save this address for future orders unticked.
4. Confirm the address for this order.
5. Open the account address book.

**Expected Results:**

* Step 4: the order's delivery address is the entered address, with phone.
* Step 5: the book still holds five addresses.

<!-- trace:case id=g10.auction-winner-order.TC-jfw rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC3-1: At the cap a company address without Company Name or phone is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on delivery Add new address for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| Kind | Company |
| Company Name | (empty) |
| First name | Jordan |
| Last name | Lee |
| Phone country | (not chosen) |
| Phone digits | (empty) |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |

**Steps:**

1. Click Company.
2. Fill the fields from **Test data**, Save this address for future orders unticked.
3. Click confirm.

**Expected Results:**

* The confirm is refused, with messages beside Company Name and Phone.
* The order's delivery address is unchanged.
* The book still holds five addresses.

<!-- trace:case id=g10.auction-winner-order.TC-8e5 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC4-1: At the cap, Add new address still opens

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on <winner order url> for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.

**Expected Results:**

* The address form opens; no message blocks it.

<!-- trace:case id=g10.auction-winner-order.TC-0hi rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC5-1: At the cap a one-time address sets the order's delivery and saves nothing

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on <winner order url> for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| <address_new> | A complete personal shipping address not in the book |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address.
3. Enter <address_new>, Save this address for future orders unticked.
4. Confirm the address for this order.
5. Open the account address book.

**Expected Results:**

* Step 4: the order's delivery address is <address_new>.
* Step 5: the book still holds five addresses.

<!-- trace:case id=g10.auction-winner-order.TC-nbn rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC6-1: A one-time address sits as a draft at the top of the picker

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on <winner order url> for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| <address_new> | A complete personal shipping address not in the book |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address and enter <address_new>.
3. Click Use this address.

**Expected Results:**

* <address_new> shows as a draft entry at the top of the picker.
* The five saved addresses list below it.

<!-- trace:case id=g10.auction-winner-order.TC-j6u rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC7-1: At the cap, saving a new address is refused with a reason

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on <winner order url> for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| <address_new> | A complete personal shipping address not in the book |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address and enter <address_new>.
3. Click Save this address for future orders.
4. Hover the info icon beside it.

**Expected Results:**

* Step 3: the checkbox is disabled and stays unticked.
* Step 4: a short reason says the book is full.

<!-- trace:case id=g10.auction-winner-order.TC-go0 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC8-1: Below the cap, a new address can be saved

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, four saved shipping addresses) is on <winner order url> for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| <address_new> | A complete personal shipping address not in the book |

**Steps:**

1. Open the delivery address picker.
2. Click Add new address and enter <address_new>.
3. Tick Save this address for future orders.
4. Confirm the address for this order.
5. Open the account address book.

**Expected Results:**

* Step 3: the checkbox is enabled and ticks.
* Step 5: the book holds five, including <address_new>.

<!-- trace:case id=g10.auction-winner-order.TC-tz6 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC9-1: Removing a saved address frees a slot for saving

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses including <address_home>) is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| <address_home> | A saved address named Home, used by no unpaid order |
| <order_setup> | An order inside its setup window, setup incomplete |
| <address_new> | A complete personal shipping address not in the book |

**Steps:**

1. Remove <address_home> from the address book.
2. Navigate to <winner order url> for <order_setup>.
3. Click Add new address in the delivery picker and enter <address_new>.
4. Click Save this address for future orders.

**Expected Results:**

* Step 1: the book holds four addresses.
* Step 4: the checkbox is enabled and ticks.

<!-- trace:case id=g10.auction-winner-order.TC-s5g rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC10-1: Editing a saved address at the cap takes no extra slot

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses including <address_home>) is on the account address book.

**Test data:**

| Field | Value |
| --- | --- |
| <address_home> | A saved address named Home |
| <new street> | A different address line 1 |

**Steps:**

1. Open <address_home> for editing.
2. Change address line 1 to <new street>.
3. Save.

**Expected Results:**

* The book still holds five addresses.
* <address_home> shows once, with <new street>.

<!-- trace:case id=g10.auction-winner-order.TC-yru rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC11-1: A book already over the cap keeps every address and still refuses saves

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner) holds six saved shipping addresses, seeded from before the cap.
* customer is on <winner order url> for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| <address_new> | A complete personal shipping address not in the book |

**Steps:**

1. Open the account address book in a new tab.
2. On the order, click Add new address in the delivery picker and enter <address_new>.
3. Click Save this address for future orders.

**Expected Results:**

* Step 1: all six addresses are listed.
* Step 3: the checkbox is disabled and stays unticked.

---

## winner-order-US11: Winner bills a won lot to a different address

**As a** winner who pays from a different address than the one the lot ships to,
**I want** to give that billing address when I confirm where to ship,
**so that** my invoice and receipt show who is billed as well as where the lot goes.

<!-- trace:case id=g10.auction-winner-order.TC-qlk rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### winner-order-US11-TC1-1: Billing Add Address has phone and Personal or Company

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on Complete Order Setup for <order_setup>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |

**Steps:**

1. Untick Same as delivery address.
2. Open Add Address for billing.

**Expected Results:**

* The Personal / Company control shows above the fields, Personal selected.
* Phone shows a country selector, starting empty with a globe only.
* Company Name is hidden.

<!-- trace:case id=g10.auction-winner-order.TC-9ch rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### winner-order-US11-TC2-1: A billing address with no phone digits is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on billing Add Address for <order_setup>, Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| First name | Alex |
| Last name | Chen |
| Phone country | Canada |
| Phone digits | (empty) |
| Country or region | Canada |
| Town or city | Toronto |
| Address line 1 | 1 Front St |
| Postal code | M5E 1B2 |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside Phone.
* The order's billing address is unchanged.

<!-- trace:case id=g10.auction-winner-order.TC-dno rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### winner-order-US11-TC3-1: A company billing address without Company Name is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on billing Add Address for <order_setup>, Company selected.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| Company Name | (empty) |
| First name | Alex |
| Last name | Chen |
| Phone country | Canada |
| Phone digits | 4165550100 |
| Country or region | Canada |
| Town or city | Toronto |
| Address line 1 | 1 Front St |
| Postal code | M5E 1B2 |

**Steps:**

1. Fill the fields from **Test data**.
2. Click confirm.

**Expected Results:**

* The confirm is refused, with a message beside Company Name.
* The order's billing address is unchanged.

<!-- trace:case id=g10.auction-winner-order.TC-7ax rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### winner-order-US11-TC4-1: A company billing address applies apart from delivery

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on Complete Order Setup for <order_setup>, delivery confirmed to <address_sf>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup> | An order inside its setup window, setup incomplete |
| <address_sf> | A personal address for Alex Chen, 100 Market St, San Francisco |
| Kind | Company |
| Company Name | Northwind Billing Ltd |
| First name | Alex |
| Last name | Chen |
| Phone country | Canada |
| Phone digits | 4165550199 |
| Country or region | Canada |
| Town or city | Toronto |
| Address line 1 | 1 Front St |
| Postal code | M5E 1B2 |

**Steps:**

1. Untick Same as delivery address.
2. Open billing Add Address.
3. Fill the billing fields from **Test data**.
4. Confirm billing.

**Expected Results:**

* Delivery still reads <address_sf>.
* Billing reads Northwind Billing Ltd, Toronto, with the phone.

---

## winner-order-US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

### winner-order-US9-TC1-1: A bank-transfer invoice shows three ways to pay and the reference

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
* **Trace:** winner-order-US-09

**Blocked:** Finance - the account details for each way are still open; Product - does the invoice PDF carry them?

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_bt>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. Open the payment area.
2. Read the payment instructions.

**Expected Results:**

* SWIFT, FPS and Hong Kong local transfer details show.
* The bank reference shows, with a copy control and a request to quote it.
* No card Pay is offered.

### winner-order-US9-TC2-1: Uploading proof stops the deadline and reads Payment Verifying

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_bt>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| <time left> | 3 days 4 hours (273600s) before the payment deadline |
| <proof> | One PDF under 5 MB |

**Steps:**

1. Click Submit Payment Proof.
2. Choose <proof>.
3. Submit, then accept the confirm step.

**Expected Results:**

* The order reads Payment Verifying.
* The deadline stops with <time left> kept.
* Card Pay and further upload are hidden.
* <proof> and its file name are not shown.

### winner-order-US9-TC3-1: One to three files of each allowed type are accepted

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_bt>.

**Test data:**

| Files |
| --- |
| 1 JPEG (lower limit) |
| 1 PNG |
| 1 HEIC |
| 3 files mixing PDF, JPEG and PNG (upper limit) |

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. Click Submit Payment Proof.
2. Choose the row's files.
3. Submit, then accept the confirm step.

**Expected Results:**

* The upload is accepted, every file kept (HEIC stored as JPEG).
* The order reads Payment Verifying.

### winner-order-US9-TC4-1: Too few or too many files are refused

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_bt>.

**Test data:**

| Files |
| --- |
| 0 files |
| 4 files, each allowed and under 5 MB |

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. Click Submit Payment Proof.
2. Choose the row's files.
3. Submit.

**Expected Results:**

* The upload is refused and says why.
* The order still reads Pending Payment; the deadline runs.

### winner-order-US9-TC5-1: A file of exactly 5 MB is accepted

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_bt>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| <proof> | One PDF of 5242880 bytes (5 MiB), at the limit |

**Steps:**

1. Click Submit Payment Proof.
2. Choose <proof>.
3. Submit, then accept the confirm step.

**Expected Results:**

* The upload is accepted.
* The order reads Payment Verifying.

### winner-order-US9-TC6-1: A file of another type refuses the whole upload

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_bt>.

**Test data:**

| Files |
| --- |
| A GIF image |
| A Word document |
| Four PDFs and one HEIC image |

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. Click Submit Payment Proof.
2. Choose the row's files.
3. Submit.

**Expected Results:**

* The whole upload is refused, naming the allowed types.
* Nothing is stored; the order still reads Pending Payment.

### winner-order-US9-TC7-1: Backing out of the confirm step uploads nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_bt>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| <proof> | Two PNG files |

**Steps:**

1. Click Submit Payment Proof.
2. Choose <proof>.
3. Submit, then cancel at the confirm step.

**Expected Results:**

* No proof is stored.
* The order still reads Pending Payment; the deadline runs.
* Submit Payment Proof is still offered.

### winner-order-US9-TC8-1: While proof is checked, no deadline runs

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_verifying>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_verifying> | An order reading Payment Verifying |

**Steps:**

1. Read the progress stepper's Payment step and the deadline.

**Expected Results:**

* Payment is the current step, its subtext naming no date.
* No payment deadline shows as running.

### winner-order-US9-TC9-1: A second upload is refused while Payment Verifying

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* <order_verifying> reads Payment Verifying for customer A.

**Test data:**

| Field | Value |
| --- | --- |
| <order_verifying> | customer A's order, proof uploaded, reading Payment Verifying |

**Steps:**

1. As customer A, send a second proof upload for <order_verifying> through the API.

**Expected Results:**

* The upload is refused.
* The first proof set is unchanged.

### winner-order-US9-TC10-1: A card payment is refused while Payment Verifying

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* <order_verifying> reads Payment Verifying for customer A.

**Test data:**

| Field | Value |
| --- | --- |
| <order_verifying> | customer A's order, proof uploaded, reading Payment Verifying |

**Steps:**

1. As customer A, send a card payment for <order_verifying> through the API.

**Expected Results:**

* The payment is refused; no charge is made.
* The order still reads Payment Verifying.

### winner-order-US9-TC11-1: Proof upload is not offered where it does not apply

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order>.

**Test data:**

| Order state |
| --- |
| Preparing Invoice, bank transfer chosen |
| Card invoice sent, unpaid |
| Bank-transfer invoice paid |

**Steps:**

1. Open the payment area.

**Expected Results:**

* No proof upload is offered.

### winner-order-US9-TC12-1: An expired bank-transfer invoice takes no proof

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_bt_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt_overdue> | A bank-transfer order past its payment deadline, unpaid |

**Steps:**

1. Open the payment area.
2. Send a proof upload for <order_bt_overdue> through the API.

**Expected Results:**

* Step 1: no proof upload is offered; the overdue alert shows Contact Us.
* Step 2: the upload is refused; the order still reads Payment Overdue.

### winner-order-US9-TC13-1: Another collector can neither upload nor read the proof

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* <order_bt> belongs to customer A.
* customer B is signed in, in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. As customer B, send a proof upload for <order_bt> through the API.
2. As customer B, request <order_bt>'s proof.

**Expected Results:**

* Both requests are refused.
* <order_bt> still reads Pending Payment.

### winner-order-US9-TC14-1: An upload cut off part-way leaves the invoice pending

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_bt>.
* The connection is set to drop during upload.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| <proof> | Three allowed files under 5 MB |

**Steps:**

1. Click Submit Payment Proof.
2. Choose <proof>, submit and accept the confirm step.
3. Restore the connection and reload the order.
4. Upload <proof> again.

**Expected Results:**

* Step 3: the order reads Pending Payment; the deadline runs; nothing is stored.
* Step 4: the upload is accepted.

### winner-order-US9-TC15-1: The bank reference fits every way to pay

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* <order_bt>'s invoice is sent.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| <listing code> | LK7P2Q, the listing's code |
| <reference> | LK7P2Q01: <listing code> then the two-digit invoice count |

**Steps:**

1. Read <order_bt>'s bank reference.

**Expected Results:**

* It reads <reference>.
* 8 characters, capitals and digits only, no hyphen, space or symbol.
* It fits one 35-character SWIFT remittance line.

### winner-order-US9-TC16-1: A file over 5 MB refuses the whole upload

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_bt>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| <proof> | One PDF of 5242881 bytes (5 MiB + 1 byte) with two small PNGs |

**Steps:**

1. Click Submit Payment Proof.
2. Choose <proof>.
3. Submit.

**Expected Results:**

* The whole upload is refused, naming the 5 MB limit.
* None of the three files is stored; the order still reads Pending Payment.

### winner-order-US9-TC17-1: A file whose content is not its extension is refused

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Blocked:** Engineering - is the file type checked by content or by extension?

**Pre-conditions:**

* customer A's <order_bt> reads Pending Payment.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| <proof> | An executable renamed to .pdf |

**Steps:**

1. As customer A, send <proof> as a proof upload through the API.

**Expected Results:**

* The whole upload is refused.
* Nothing is stored; the order still reads Pending Payment.

### winner-order-US9-TC18-1: A card payment on a bank-transfer invoice is refused

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer A's <order_bt> reads Pending Payment.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |

**Steps:**

1. As customer A, send a card payment for <order_bt> through the API.

**Expected Results:**

* The payment is refused; no charge is made.
* The order still reads Pending Payment.

### winner-order-US9-TC19-1: The old deadline passing during the check expires nothing

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* <order_verifying> reached Payment Verifying before its payment deadline.

**Test data:**

| Field | Value |
| --- | --- |
| <order_verifying> | An order reading Payment Verifying, no operator action yet |

**Steps:**

1. Move the clock past the original payment deadline.
2. Open <winner order url> for <order_verifying> as its winner.

**Expected Results:**

* The order still reads Payment Verifying, not Payment Overdue.

### winner-order-US9-TC20-1: The reference copy control copies it exactly, on bank transfer only

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner of <order_bt> and <order_card>) is signed in.
* The browser may use the clipboard.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bt> | An HKD order with a sent bank-transfer invoice, reading Pending Payment |
| <reference> | LK7P2Q01, <order_bt>'s bank reference |
| <order_card> | An order with a sent card invoice, unpaid |

**Steps:**

1. Open <winner order url> for <order_bt>.
2. Click the copy control beside the bank reference, then paste.
3. Open <winner order url> for <order_card>.

**Expected Results:**

* Step 2 pastes exactly <reference>, no space.
* Step 3 shows no bank reference and no copy control.

---

## winner-order-US10: Winner's payment proof is not accepted

**As a** winner whose payment proof Grade10 could not match,
**I want** to read why and how long I have left,
**so that** I can send the right proof or pay again before the deadline.

### winner-order-US10-TC2-1: The operator's internal reason never reaches the winner

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_returned>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_returned> | A bank-transfer order whose proof an operator returned with <external reason> and <internal reason> |
| <external reason> | Amount received does not match |
| <internal reason> | A note for operators only |

**Steps:**

1. Read the order.
2. Download the invoice PDF and read it.

**Expected Results:**

* <external reason> shows.
* <internal reason> appears on neither.

### winner-order-US10-TC3-1: After a return the winner can upload again

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_returned>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_returned> | A bank-transfer order whose proof was returned, inside its deadline |
| <proof> | One new PDF under 5 MB |

**Steps:**

1. Click Submit Payment Proof.
2. Choose <proof>, submit and accept the confirm step.

**Expected Results:**

* The order reads Payment Verifying again.
* The deadline stops with the time then left.

### winner-order-US10-TC4-1: Time left at the edges survives a return

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-10

**Pre-conditions:**

* <order_verifying> reads Payment Verifying with the row's <time left> kept.

**Test data:**

| Time left |
| --- |
| 60s (1 minute) |
| 604740s (6 days 23 hours 59 minutes) |

| Field | Value |
| --- | --- |
| <order_verifying> | A bank-transfer order reading Payment Verifying |

**Steps:**

1. Return the proof at <return time>.
2. Read the API response for the new deadline.

**Expected Results:**

* The deadline is <return time> plus the row's time left.

### winner-order-US10-TC5-1: A return adds no grace once the time left runs out

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
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_returned_late>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_returned_late> | A bank-transfer order returned with 60s left, and that minute has passed |

**Steps:**

1. Read the status and the payment area.

**Expected Results:**

* The order reads Payment Overdue.
* Proof upload is hidden; the overdue alert shows Contact Us.

### winner-order-US10-TC6-1: A second return keeps the time left at the second upload

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
* **Trace:** winner-order-US-10

**Pre-conditions:**

* <order_verifying> was returned once, uploaded again with <time left 2> kept, and reads Payment Verifying.

**Test data:**

| Field | Value |
| --- | --- |
| <order_verifying> | A bank-transfer order on its second check |
| <time left 2> | The time left at the second upload |

**Steps:**

1. Return the proof again at <return time>.
2. Read the API response for the new deadline.

**Expected Results:**

* The deadline is <return time> plus <time left 2>.

### winner-order-US10-TC8-1: Returned proof shows the reason and the deadline resumes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) chose bank transfer and uploaded proof for <order_verifying>.
* An operator returned the proof with <return reason>.
* customer is on <order_verifying>'s Winner Order page.

**Test data:**

| Field | Value |
| --- | --- |
| <order_verifying> | An order whose invoice was sent, proof uploaded <time left> before its payment deadline |
| <time left> | 3 days (259200s), a time inside the 7-day payment window |
| <return reason> | The reason text the operator entered for the winner |
| <return time> | 1 day after the upload |

**Steps:**

1. Read the order status and the alert.
2. Read the payment deadline.

**Expected Results:**

* Step 1: the order no longer reads Payment Verifying.
* Step 1: <return reason> is shown to the winner.
* Step 2: Pay by reads <return time> plus <time left>.
* Step 2: Submit Payment Proof and View Bank Details are offered again.

### winner-order-US10-TC9-1: Only the latest return reason is shown

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner)'s proof for <order_verifying> was returned with <first reason>.
* The winner uploaded proof again, and it was returned with <second reason>.
* customer is on <order_verifying>'s Winner Order page.

**Test data:**

| Field | Value |
| --- | --- |
| <order_verifying> | An order paid by bank transfer, inside its payment window |
| <first reason> | Amount does not match |
| <second reason> | Reference missing from the transfer |

**Steps:**

1. Read the page.

**Expected Results:**

* <second reason> is shown.
* <first reason> is not shown.
* No proof file or file name is shown.

### winner-order-US10-TC10-1: Returned proof sends Proof not accepted with the new Pay by

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) uploaded proof for <order_verifying>; no letter was sent on upload.

**Test data:**

| Field | Value |
| --- | --- |
| <order_verifying> | An order paid by bank transfer, <time left> before its payment deadline at upload |
| <time left> | 3 days (259200s) |
| <return reason> | The reason text the operator enters for the winner |

**Steps:**

1. Have an operator return the proof with <return reason>.
2. Read the mail sent to the winner's registered email.

**Expected Results:**

* One Proof not accepted letter carrying <return reason>.
* Its Pay by equals the return time plus <time left>.
* No payment reminder was sent while the proof was under check.

---

## winner-order-US16: Winner emails Grade10 from a locked order

**As a** winner whose payment access has closed,
**I want** a ready email with this order's details that I can copy into any mail app,
**so that** I can reach Grade10 without a system mail client, and support can find the order.

<!-- trace:case id=g10.auction-winner-order.TC-iro rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC1-1: Contact Us opens the copy-first email dialog

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An order whose payment deadline passed unpaid |

**Steps:**

1. Click Contact Us on the inline alert.

**Expected Results:**

* A dialog opens with To, Subject and Message.
* No mail app opens, and no toast naming only the address replaces the dialog.

<!-- trace:case id=g10.auction-winner-order.TC-le5 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC2-1: The dialog addresses support@grade10.com

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An order whose payment deadline passed unpaid |

**Steps:**

1. Click Contact Us.
2. Read To.

**Expected Results:**

* To reads `support@grade10.com`.

<!-- trace:case id=g10.auction-winner-order.TC-ta0 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC3-1: A setup-overdue Subject names the lot and no invoice

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_setup_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup_overdue> | An order past its setup deadline, no invoice issued |
| <lot_title> | The lot title on that order |

**Steps:**

1. Click Contact Us.
2. Read Subject.

**Expected Results:**

* Subject reads `Auction lot <lot_title>: setup overdue`, with no invoice id.

<!-- trace:case id=g10.auction-winner-order.TC-gxu rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC4-1: A payment-overdue Subject names the invoice

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An order whose payment deadline passed unpaid |
| <invoice_id> | That order's invoice id |

**Steps:**

1. Click Contact Us.
2. Read Subject.

**Expected Results:**

* Subject reads `Auction order <invoice_id>: payment overdue`.

<!-- trace:case id=g10.auction-winner-order.TC-rt4 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC5-1: A partial-payment email lists receipts and never the balance

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_partially_paid>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_partially_paid> | An order reading Partially Paid, with one receipt |
| <invoice_id> | That order's invoice id |
| <receipt_ids> | That invoice's receipt ids |

**Steps:**

1. Click Contact Us.
2. Read Subject and Message.

**Expected Results:**

* Subject reads `Auction order <invoice_id>: partial payment`.
* Message lists <receipt_ids>.
* Message shows no remaining balance.

<!-- trace:case id=g10.auction-winner-order.TC-28a rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC6-1: With several receipts, each receipt id is listed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_partially_paid_many>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_partially_paid_many> | An order reading Partially Paid, with three receipts |
| <receipt_ids> | Every receipt id on that invoice, oldest first |

**Steps:**

1. Click Contact Us.
2. Read Message.

**Expected Results:**

* Message lists every id in <receipt_ids>.
* Message shows no remaining balance.

<!-- trace:case id=g10.auction-winner-order.TC-59a rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC7-1: The support address is hidden until Contact Us opens

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An order whose payment deadline passed unpaid |

**Steps:**

1. Search the page for `support@grade10.com`.
2. Click Contact Us.

**Expected Results:**

* Step 1: the address is not on the page.
* Step 2: To shows `support@grade10.com`.

<!-- trace:case id=g10.auction-winner-order.TC-a9f rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC8-1: Copy Message comes first, Open Mail App second

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An order whose payment deadline passed unpaid |

**Steps:**

1. Click Contact Us.
2. Read the dialog footer.

**Expected Results:**

* Copy Message is the primary action, first.
* Open Mail App is the secondary action, second.

<!-- trace:case id=g10.auction-winner-order.TC-mtb rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC9-1: Message is editable; only the footer copies the whole email

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An order whose payment deadline passed unpaid |
| <winner_question> | A short question typed into Message |

**Steps:**

1. Click Contact Us.
2. Look at the copy controls beside To, Subject and Message.
3. Type <winner_question> into Message, below the prefilled facts.

**Expected Results:**

* Step 1: Message is a multi-line field, order facts prefilled.
* Step 2: To and Subject each have a copy control; Message has none.
* Step 3: Message keeps <winner_question>.

<!-- trace:case id=g10.auction-winner-order.TC-vdc rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC10-1: Copy Message copies To, Subject and the edited Message

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_payment_overdue>.
* The browser may use the clipboard.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An order whose payment deadline passed unpaid |
| <invoice_id> | That order's invoice id |
| <winner_question> | A short question typed into Message |

**Steps:**

1. Click Contact Us.
2. Type <winner_question> into Message.
3. Click Copy Message.
4. Paste into a plain-text field.

**Expected Results:**

* The paste holds To `support@grade10.com`.
* It holds Subject `Auction order <invoice_id>: payment overdue`.
* It holds Message with <winner_question>.

<!-- trace:case id=g10.auction-winner-order.TC-mq9 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC11-1: Open Mail App carries the current Subject and Message

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An order whose payment deadline passed unpaid |
| <invoice_id> | That order's invoice id |
| <winner_question> | A short question typed into Message |

**Steps:**

1. Click Contact Us.
2. Type <winner_question> into Message.
3. Read the Open Mail App link target.

**Expected Results:**

* It is a `mailto:` to `support@grade10.com`.
* Its subject is `Auction order <invoice_id>: payment overdue`.
* Its body includes <winner_question>.

<!-- trace:case id=g10.auction-winner-order.TC-ovr rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC12-1: The To and Subject copy controls copy only their field

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_payment_overdue>.
* The browser may use the clipboard.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An order whose payment deadline passed unpaid |

**Steps:**

1. Click Contact Us.
2. Click the copy control beside To, then paste.
3. Click the copy control beside Subject, then paste.

**Expected Results:**

* Step 2 pastes only `support@grade10.com`.
* Step 3 pastes only the Subject.
* Copy Message stays in the footer.

<!-- trace:case id=g10.auction-winner-order.TC-9co rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC13-1: After a reissue, Subject names the current invoice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_payment_overdue_reissued>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue_reissued> | An order payment-overdue after its invoice was reissued |
| <current_invoice_id> | The current invoice id |
| <replaced_invoice_id> | The replaced invoice id |

**Steps:**

1. Click Contact Us.
2. Read Subject.

**Expected Results:**

* Subject reads `Auction order <current_invoice_id>: payment overdue`.
* It does not name <replaced_invoice_id>.

---

## winner-order-US14: Winner sees a refunded order as Refunded

**As a** winner whose order Grade10 refunded because they were not happy with the item,
**I want** Winner Order to read Refunded, with the amount returned below the invoice total and a way to see Amount, Transfer to, Reason and Note — brand and last four for a card, or masked destination with the bank name under it for a transfer — whether I had paid in full or in part and wherever the card is, and my invoice and receipts still there,
**so that** I know the order is closed and still hold the record of what I paid.

<!-- trace:case id=g10.auction-winner-order.TC-xfb rev=1 covers=g10.auction-winner-order.SC-zfp,g10.auction-winner-order.SC-yhv -->
### winner-order-US14-TC1-1: A card-refunded order reads Refunded and keeps its records

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
* **Trace:** winner-order-US-14

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_refunded>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_refunded> | A paid order refunded to the card, with an operator note |
| <refund amount> | The amount returned |

**Steps:**

1. Read the status, actions and receipt links.
2. Read below Order Total.
3. Open the refund details from the inline alert.

**Expected Results:**

* Step 1: the order reads Refunded; no stepper, Pay, address or shipment action.
* Step 1: the invoice and every receipt still download.
* Step 2: <refund amount> shows below Order Total.
* Step 3: Amount, Transfer to, Reason, then Note, in that order.
* Step 3: Transfer to shows the card brand and last four only; no Reference.

---

## winner-order-US15: Winner sees an overpayment returned

**As a** winner who paid more than the order,
**I want** only the difference returned below the invoice total, while the lot, the shipping and the amount I should have paid stay, with a way to see why,
**so that** I know the sale still stands.

<!-- trace:case id=g10.auction-winner-order.TC-pca rev=1 covers=g10.auction-winner-order.SC-7m4 -->
### winner-order-US15-TC1-1: A returned overpayment leaves the order and invoice standing

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
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_overpaid>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_overpaid> | A paid order where the difference over the total was returned |
| <difference> | The amount returned |

**Steps:**

1. Read the status and invoice lines.
2. Read below Order Total.
3. Open the refund details.

**Expected Results:**

* Step 1: status and invoice lines are unchanged; it does not read Refunded.
* Step 2: only <difference> shows as returned.
* Step 3: the details open, showing no proof and no provider reference.

---

## winner-order-US17: Winner matches a bank refund against their own statement

**As a** winner whose refund was sent by bank transfer,
**I want** the reference the operator sent it under, beside the amount and where it went,
**so that** I can find the credit on my statement without asking Customer Service.

<!-- trace:case id=g10.auction-winner-order.TC-3s7 rev=1 covers=g10.auction-winner-order.SC-u8s -->
### winner-order-US17-TC1-1: A bank refund shows the masked destination and its reference

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
* **Trace:** winner-order-US-17

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_bank_refunded>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_bank_refunded> | A paid order refunded by bank transfer, no operator note |
| <bank reference> | The provider reference the operator recorded |

**Steps:**

1. Open the refund details from the inline alert.

**Expected Results:**

* Amount, Transfer to, Reference, then Reason, in that order; no Note.
* Transfer to shows a bank icon, masked destination, bank name beneath.
* Reference reads <bank reference>.
* No proof and no full account number show.

---

## winner-order-US4: Winner pays an invoice by card

**As a** winner
**I want** to see the full invoice and pay it by card, even if a first attempt does not finish
**so that** the lot moves to Preparing Shipment without contacting Grade10.

### winner-order-US4-TC1-1: An unpaid order shows invoice, Pay Now, address and lot

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds an order in Pending Payment, with invoice status
  `pending` or `expired`.

**Steps:**

1. Navigate to <grade10 auction order url>.

**Expected Results:**

* Every invoice line and Pay Now are shown.
* The confirmed delivery address and the lot are shown.
* An expired invoice still reads Pending Payment and offers Contact Us instead
  of Pay Now.

### winner-order-US4-TC2-1: Order Information reads Invoice Status, not Paid Status

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds an order whose invoice status is paid.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Scroll to Order Information.

**Expected Results:**

* Invoice Status reads Paid.
* No Paid Status label appears.

### winner-order-US4-TC3-1: A timed-out payment session leaves the invoice payable

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds an order in Pending Payment.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Click Pay Now.
3. Wait until the payment session times out.
4. Return to <grade10 auction order url>.

**Expected Results:**

* The page says payment was not completed.
* The order still reads Pending Payment.
* Pay Now is available.

### winner-order-US4-TC4-1: Pay Now after an abandoned session starts a fresh one

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds a Pending Payment order whose last payment session was abandoned.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Click Pay Now.

**Expected Results:**

* A new payment session opens.
* It charges the same invoice amount.

### winner-order-US4-TC5-1: A completed payment shows Confirming payment before Preparing Shipment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) completed a hosted card session, but the authenticated
  auction-order read model has not yet recorded the invoice as paid.

**Steps:**

1. Navigate to <grade10 auction order url>.

**Expected Results:**

* The page shows Confirming payment.
* The order does not read Preparing Shipment.

### winner-order-US4-TC6-1: A recorded payment reads Preparing Shipment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds an order whose authenticated auction-order read model
  returns invoice status `paid` and fulfilment status `unfulfilled`.

**Steps:**

1. Navigate to <grade10 auction order url>.

**Expected Results:**

* The order status reads Preparing Shipment.

---

## winner-order-US19: Winner confirms where a won lot ships

**As a** winner
**I want** to fill in and confirm a delivery address on the order
**so that** Grade10 can quote shipping to the right place.

### winner-order-US19-TC1-1: Order page shows four sections and timed status steps

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order that reached Awaiting Setup, Preparing Invoice, Pending Payment and Preparing Shipment.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Scroll to the Order Status section.

**Expected Results:**

* Order Information, Collection Method, Order Status, Lots appear in order.
* Step 2 lists the four statuses in the order reached.
* Each status shows the date and time reached.

### winner-order-US19-TC5-1: Timeline uses the auction-order read model timestamps

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order whose auction-order read model returns a
  recorded timestamp for each reached status.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Read the Order Status section.

**Expected Results:**

* Each status shows the timestamp returned for that status.
* No timestamp is replaced with the page-load time.

### winner-order-US19-TC2-1: Preparing Invoice shows the address and no payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 auction order url>.

**Expected Results:**

* The confirmed address is shown.
* No invoice and no Pay Now are shown.

### winner-order-US19-TC3-1: A complete address with optional fields empty is accepted

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order in Awaiting Setup.

**Test data:**

| Field | Value |
| --- | --- |
| First Name, Last Name, Country/Region, Town/City, Address Line 1, State/Province/Region, Postal Code | Filled |
| Phone | <a phone number of unusual length and format> |
| Company Name, Address Line 2, Apt./Suite/Building | Empty |

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Fill the address form with **Test data**.
3. Click Confirm.

**Expected Results:**

* The address is accepted.
* The order status reads Preparing Invoice.

### winner-order-US19-TC4-1: Empty required fields are refused with field errors

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
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order in Awaiting Setup.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Fill every required field except Town/City and Postal Code.
3. Click Confirm.

**Expected Results:**

* The address is refused.
* An error shows on Town/City and on Postal Code.
* The order status still reads Awaiting Setup.

---

## Settled

- `winner-order-US3-TC1` is held by `winner-order-US8-TC1`: the same premium claim, under the policy-premium journey.
- `winner-order-US3-TC2` is held by `winner-order-US8-TC2`: the same premium claim, under the policy-premium journey.
- `winner-order-US3-TC3` is held by `winner-order-US8-TC3`: the same premium claim, under the policy-premium journey.
- `winner-order-US3-TC4` is held by `winner-order-US8-TC4`: the same premium claim, under the policy-premium journey.
- `configure-auction-buyer-charges` archived its premium cases as `winner-order-US7-TC2`, `winner-order-US7-TC3` and `winner-order-US7-TC4`; `winner-order-US8-TC2` to `winner-order-US8-TC4` hold them, and `winner-order-US7` is the address-deadline journey.
- `winner-order-US10-TC1` is held by `winner-order-US10-TC8`, and `winner-order-US10-TC7` by `winner-order-US10-TC9`.

- `winner-order-US9-TC1` is `winner-order-US12-TC4`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC2` is `winner-order-US12-TC5`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC3` is `winner-order-US12-TC6`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC4` is `winner-order-US12-TC7`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC5` is `winner-order-US12-TC8`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC6` is `winner-order-US12-TC9`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC7` is `winner-order-US12-TC10`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- `winner-order-US9-TC8` is `winner-order-US12-TC11`: an address-cap case filed under US9 before the journeys were renumbered, moved to US12, the journey it traces.
- The premium amount is calculated at invoice creation; the bid panel shows the rate only.

- Non-parseable phone still applies with the entered value; E.164 only when parseable
- Missing phone country or digits share one refusal beside Phone
- Switching back to Personal drops the Company Name requirement
- Billing country or region list parity stays the open PRD question, outside this change

- Partial-payment letter Contact Us is in scope with the same ready mailto

- Subject uses the order's current invoice id after a reissue


- Expired ends self-service card pay (author @tangconst, 2026-09-15).
- Progress is presentation only; status names stay derived from order facts,
  including Payment Overdue and Setup Overdue.
- Absolute deadline datetime; no countdown.
- 48-hour address confirm window; missed window hides Confirm and shows Contact Us (Storybook 2026-09-16).
- Insurance remains optional and separate from Payment Processing Fee.
- Receipt PDF after payment on the same row as Invoice.
- Fee tooltips on Buyer’s Premium, Shipping & Handling, Insurance, and Payment
  Processing Fee (brief fee copy); the Insurance copy is `0.9% of the order
  value during transit.`
- Receipt and invoice identifier formats remain out of scope.
- Winner Order's live balance remains out of scope; only receipt values are
  covered here.
- Receipt contents after a tolerance-close or confirmed overpayment use
  `Remaining Balance Due = 0`.
- Refunds and reversals preserve issued receipts; this suite does not define
  what a later payment may do.

- Closed Country/Region field state belongs to design-system Autocomplete, not a Winner Order case
- Long-list scrollport is presentation on ui-design; catalogue completeness is the Country/Region requirement
- Early and late alphabet filter partitions are redundant with the catalogue and search requirements
- Choosing a filtered country is the design-system Autocomplete selection contract
- Autocomplete unit-layer filter is out of suite in design-system tests and stories
- Letter typeahead on Select is superseded by searchable Autocomplete on Country/Region
- Catalogue display locale stays the open PRD question
- Shippable destinations only stays the open PRD question

## Reconciliation

**Run:** 2026-09-16; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none.
