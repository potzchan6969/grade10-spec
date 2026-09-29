# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-03, tcs-rules r1

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to be told what I owe and to pay it without waiting for someone to
call me,
**so that** the lot I won becomes mine on my own schedule inside a deadline I
can see.

<!-- trace:case id=g10.auction-winner-order.TC-8q4 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC1-1: Closing a lot issues one invoice with estimates

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
An open lot whose account holds a default shipping address, with one second until its recorded close.

**Steps:**

1. Wait for the lot to close.
2. Navigate to <the winner's auction order url>.
3. Check the invoice.

**Expected Results:**

* Grade10 creates one auction order, invoice `pending` and fulfilment `unfulfilled`.
* Shipping, insurance, and any tax amount supplied by the separate tax capability are labelled as estimates.
* The invoice can be paid.

<!-- trace:case id=g10.auction-winner-order.TC-qaq rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC2-1: No default shipping address leaves the invoice unpayable

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
An open lot whose account holds no default shipping address, with one second until its recorded close.

**Steps:**

1. Wait for the lot to close.
2. Navigate to <the winner's auction order url>.
3. Attempt to pay the invoice.

**Expected Results:**

* The invoice shows the hammer price and the buyer's premium.
* Shipping, insurance, and any tax amount show as still to be calculated.
* Grade10 refuses the payment until a delivery address is supplied.

<!-- trace:case id=g10.auction-winner-order.TC-shz rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC3-1: Pre-filled default address still needs confirming

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
An auction order whose delivery address is pre-filled from the account's default shipping address and not yet confirmed.

**Steps:**

1. Navigate to <the winner's auction order url>.
2. Attempt to pay without confirming the delivery address.

**Expected Results:**

* Grade10 refuses the payment.
* The order asks the winner to confirm the delivery address.

<!-- trace:case id=g10.auction-winner-order.TC-yuw rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC4-1: Amending the address shows both totals

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
An unpaid auction order whose final amount is 312000 minor units in HKD, and an alternative address that prices shipping and insurance 4000 minor units higher.

**Test data:**

| Field | Value |
| --- | --- |
| Final amount before | 312000 minor units, HKD |
| Final amount after | 316000 minor units, HKD |

**Steps:**

1. Navigate to <the winner's auction order url>.
2. Amend the delivery address to the alternative address.
3. Check the reissued invoice before paying.

**Expected Results:**

* The reissued final amount is 316000 minor units in HKD.
* Both 312000 and 316000 minor units in HKD are shown before payment.
* No separate charge for 4000 minor units is raised.

<!-- trace:case id=g10.auction-winner-order.TC-0p6 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC5-1: Winning hold is released, never captured

**Classification:**

* **Severity:** blocker
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
An open lot whose leading bidder holds an open bid-time authorization, with one second until its recorded close.

**Steps:**

1. Wait for the lot to close.
2. Read <the authorization for that bidder and lot>.
3. Pay the invoice.

**Expected Results:**

* The authorization was released at close and never captured.
* The payment is a single new transaction for the final amount.

<!-- trace:case id=g10.auction-winner-order.TC-5vo rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC6-1: Declined payment leaves the invoice payable

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
An unpaid auction order inside its payment deadline, and a payment method mocked to decline.

**Steps:**

1. Navigate to <the winner's auction order url>.
2. Pay with the declining method.
3. Pay again with a second method.

**Expected Results:**

* After step 2 the invoice status is still `pending`.
* Step 3 is accepted and the invoice status becomes `paid`.

<!-- trace:case id=g10.auction-winner-order.TC-vxj rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC7-1: Deadline is seven days from the extended close

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
A lot extended twice whose recorded close is 2026-09-03T12:00:00Z.

**Test data:**

| Field | Value |
| --- | --- |
| Lot close | 2026-09-03T12:00:00Z |
| Payment deadline | 2026-09-10T12:00:00Z |

**Steps:**

1. Wait for the lot to close.
2. Read the invoice's payment deadline.

**Expected Results:**

* The payment deadline is 2026-09-10T12:00:00Z.
* It is displayed in the winner's own timezone.

---

<!-- trace:case id=g10.auction-winner-order.TC-h5e rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC8-1: An account manages multiple shipping addresses

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
An authenticated account with no saved shipping addresses.

**Steps:**

1. Open the account shipping-address settings.
2. Save a home address and a work address with distinct names.
3. Open an unpaid auction order and open its address selector.

**Expected Results:**

* Both named addresses are available in the account address book.
* The winner can choose either address for the auction order.

<!-- trace:case id=g10.auction-winner-order.TC-hrx rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC9-1: The account has one optional default address

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
An account with home and work addresses, with home set as the default.

**Steps:**

1. Set work as the default shipping address.
2. Open a newly issued unpaid auction order.

**Expected Results:**

* Work is the only default address.
* The new order is pre-filled from work.

<!-- trace:case id=g10.auction-winner-order.TC-jje rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC10-1: Editing an address does not rewrite an order

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
An unpaid order using a saved home address and an account address book containing that address.

**Steps:**

1. Edit the saved home address in account settings.
2. Return to the unpaid auction order.

**Expected Results:**

* The address book shows the edited home address.
* The order still shows the address snapshot selected for it.

<!-- trace:case id=g10.auction-winner-order.TC-5jc rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC11-1: A selected address cannot be archived silently

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
An unpaid order whose selected delivery address is the account's work address.

**Steps:**

1. Try to archive the work address in account settings.

**Expected Results:**

* Grade10 asks the winner to select another address for that order.
* The work address remains available while it is selected by the order.

---

<!-- trace:case id=g10.auction-winner-order.TC-nsg rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC12-1: Add Address opens with phone country unset

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

* customer(winner) is on <the winner's auction order url> inside the address setup deadline.

**Steps:**

1. Open Complete Order Setup.
2. Open Add Address for delivery.
3. Inspect the Phone field before choosing a calling country.

**Expected Results:**

* Phone shows a globe only, with no flag and no calling-code divider.
* `+852 12345678` placeholder appears with a small gap after the globe.
* No calling country is preselected.

<!-- trace:case id=g10.auction-winner-order.TC-4gp rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC13-1: Personal is selected and Company Name stays hidden

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

* customer(winner) is on delivery Add Address in Complete Order Setup.

**Steps:**

1. Inspect the Personal / Company control on first open.
2. Scan the fields below it.

**Expected Results:**

* Personal is selected on the segmented control.
* Company Name is not shown.

<!-- trace:case id=g10.auction-winner-order.TC-rx1 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC14-1: Company selection reveals required Company Name

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

* customer(winner) is on delivery Add Address with Personal selected.

**Steps:**

1. Select Company on the Personal / Company control.
2. Inspect the fields below it.

**Expected Results:**

* Company is selected on the segmented control.
* Company Name appears as a required field.

<!-- trace:case id=g10.auction-winner-order.TC-51d rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC15-1: Empty Company Name is refused on Company

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

* customer(winner) is on delivery Add Address with Company selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Fill every required field except Company Name.
2. Attempt to confirm the address.

**Expected Results:**

* Grade10 refuses the confirm.
* A refusal appears beside Company Name.
* No address is saved or applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-r03 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC16-1: Empty phone digits are refused

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

* customer(winner) is on delivery Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | (empty) |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Select a phone country.
2. Leave the national number empty.
3. Fill every other required field.
4. Attempt to confirm the address.

**Expected Results:**

* Grade10 refuses the confirm.
* A refusal appears beside Phone.
* No address is saved or applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-qwo rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC17-1: Confirm without a phone country is refused

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

* customer(winner) is on delivery Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | (unset) |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Type digits into Phone without choosing a calling country.
2. Fill every other required field.
3. Attempt to confirm the address.

**Expected Results:**

* Grade10 refuses the confirm.
* A refusal appears beside Phone.
* No address is saved or applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-jo6 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC18-1: Unusual phone format is accepted on confirm

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

* customer(winner) is on delivery Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | United Kingdom |
| Phone digits | +44 (0)20 7946 0958 |
| Country or region | United Kingdom |
| Town or city | London |
| Address line 1 | 10 Downing St |
| Postal code | SW1A 2AA |

**Steps:**

1. Select the phone country.
2. Enter the unusual phone digits.
3. Fill every other required field.
4. Confirm the address.

**Expected Results:**

* Grade10 accepts the confirm.
* No hard phone-format refusal appears.
* The address is applied to the order.

<!-- trace:case id=g10.auction-winner-order.TC-qia rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC19-1: Parseable phone is stored as E.164

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

* customer(winner) is on delivery Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | (415) 555-0100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |
| Stored phone | +14155550100 |

**Steps:**

1. Enter the phone digits with punctuation.
2. Fill every other required field.
3. Confirm the address.
4. Read the stored phone on the order address snapshot.

**Expected Results:**

* Step 3 succeeds.
* The stored phone reads +14155550100.

<!-- trace:case id=g10.auction-winner-order.TC-phu rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC20-1: Address confirms with optional line 2 and state empty

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

* customer(winner) is on delivery Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
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

1. Fill every required field.
2. Leave address line 2 and state or province empty.
3. Confirm the address.

**Expected Results:**

* Grade10 accepts the confirm.
* The order address snapshot shows the entered line 1 and postal code.
* Address line 2 and state or province are empty on the snapshot.

<!-- trace:case id=g10.auction-winner-order.TC-2vd rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC21-1: Add Address collects no Apt or Suite field

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

* customer(winner) is on delivery Add Address.

**Steps:**

1. Scan every field label on the form.

**Expected Results:**

* No Apt., Suite, or Building field is shown.
* Address line 2 remains available as the optional second line.

<!-- trace:case id=g10.auction-winner-order.TC-4zr rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC22-1: Personal saved address card title is recipient name

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

* customer(winner) is on Complete Order Setup delivery picker.
* A saved personal delivery address exists for Alex Chen.

**Steps:**

1. Open the delivery address picker.
2. Read the card title on the Alex Chen personal address.

**Expected Results:**

* The card title reads Alex Chen.
* It does not read a company name.
* The card body shows street, city or region, and country.
* The card body does not show postal code or phone.

<!-- trace:case id=g10.auction-winner-order.TC-ajg rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC23-1: Company saved address card title is company name

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

* customer(winner) is on Complete Order Setup delivery picker.
* A saved company delivery address exists for Northwind Collectibles with recipient Alex Chen.

**Steps:**

1. Open the delivery address picker.
2. Read the card title on the Northwind Collectibles company address.

**Expected Results:**

* The card title reads Northwind Collectibles.
* It does not read Alex Chen.
* The card body shows street, city or region, and country.
* The card body does not show postal code or phone.

<!-- trace:case id=g10.auction-winner-order.TC-u2z rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC24-1: Company delivery address with phone confirms successfully

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

* customer(winner) is on delivery Add Address inside the address setup deadline.

**Test data:**

| Field | Value |
| --- | --- |
| Kind | Company |
| Company name | Northwind Collectibles |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Select Company.
2. Fill every required field, including Company Name and phone.
3. Confirm the address.
4. Reopen the delivery address picker.

**Expected Results:**

* Step 3 succeeds.
* The delivery address on the order carries Northwind Collectibles, Alex Chen, a phone with country and digits, and postal code 94105.
* Step 4 shows the address card title as Northwind Collectibles.
* Step 4 card body does not show the phone or postal code.

<!-- trace:case id=g10.auction-winner-order.TC-kqe rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC25-1: Order summary shows the full address snapshot after setup

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

* customer(winner) is on Winner Order Awaiting Setup inside the address setup deadline.

**Test data:**

| Field | Value |
| --- | --- |
| Kind | Company |
| Company name | Northwind Collectibles |
| First name | Alex |
| Last name | Chen |
| Phone | +14155550100 |
| Address line 1 | 100 Market St |
| Town or city | San Francisco |
| Postal code | 94105 |
| Country or region | United States |
| Billing | Same as delivery |

**Steps:**

1. Complete Order Setup with the company delivery address from **Test data** and Same as delivery checked.
2. Read Delivery address and Billing address on the Order summary.

**Expected Results:**

* Delivery shows Northwind Collectibles, Alex Chen, the phone, 100 Market St, San Francisco with 94105, and United States.
* Billing matches Delivery.
* The values are the full snapshot, not the lean picker card body alone.

---

<!-- trace:case id=g10.auction-winner-order.TC-apy rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC26-1: Invoice with Insurance shows the amount and tip

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

* customer(winner) is signed in on <the winner's auction order url> for <order_with_insurance>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_with_insurance> | An auction order whose sent invoice includes Insurance |
| <insurance_amount> | The Insurance money amount on that invoice |

**Steps:**

1. Open <the winner's auction order url> for <order_with_insurance>.
2. Find Insurance on the order summary.
3. Open the Insurance info tooltip.

**Expected Results:**

* Insurance shows <insurance_amount>.
* Insurance does not read TBD.
* The Insurance info tooltip opens.
* The tooltip reads `0.9% of the order value during transit.`

<!-- trace:case id=g10.auction-winner-order.TC-aq5 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC27-1: Pre-invoice summary shows Insurance as TBD

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

* customer(winner) is signed in on <the winner's auction order url> for <order_pre_invoice>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_pre_invoice> | An auction order before the invoice is sent |

**Steps:**

1. Open <the winner's auction order url> for <order_pre_invoice>.
2. Read the order summary fee rows.
3. Open the Insurance info tooltip.

**Expected Results:**

* Insurance is shown with the other fee rows.
* Insurance reads TBD.
* The tooltip reads `0.9% of the order value during transit.`

<!-- trace:case id=g10.auction-winner-order.TC-7cb rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC28-1: Sent invoice without Insurance omits the row

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

* customer(winner) is signed in on <the winner's auction order url> for <order_without_insurance>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_without_insurance> | An auction order whose sent invoice includes no Insurance |

**Steps:**

1. Open <the winner's auction order url> for <order_without_insurance>.
2. Read the order summary.

**Expected Results:**

* The order summary shows no Insurance row.
* No Insurance tooltip is shown.

## winner-order-US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt that says what was billed, paid before it, paid now and
what is still owed, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for
records.

<!-- trace:case id=g10.auction-winner-order.TC-h7f rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC1-1: Receipt itemises what was paid

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
An auction order paid at a final amount of 316000 minor units in HKD.

**Steps:**

1. Navigate to <the winner's auction order url>.
2. Open the payment receipt.

**Expected Results:**

* The receipt shows hammer price, buyer's premium, shipping, insurance, any tax amount supplied by the separate tax capability, and final amount.
* Those components sum to 316000 minor units in HKD.

<!-- trace:case id=g10.auction-winner-order.TC-qvc rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC4-1: A full payment receipt shows zero previous and remaining

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

* An auction order has an invoice total of 100000 minor units in HKD and one confirmed payment of 100000 minor units.

**Steps:**

1. Open the payment receipt.

**Expected Results:**

* Original Invoice Total is 100000 minor units in HKD.
* Previous Payments is 0.
* Current Payment Received is 100000 minor units in HKD.
* Remaining Balance Due is 0.

<!-- trace:case id=g10.auction-winner-order.TC-myw rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC5-1: Ordered partial receipts preserve the payment history

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

* An auction order has an invoice total of 100000 minor units in HKD.
* Its first payment is 40000 minor units and its second payment is 30000 minor units, recorded in that order.

**Steps:**

1. Open the receipt for the first payment.
2. Open the receipt for the second payment.

**Expected Results:**

* The first receipt shows Original Invoice Total 100000, Previous Payments 0, Current Payment Received 40000 and Remaining Balance Due 60000, all in minor units of HKD.
* The second receipt shows Original Invoice Total 100000, Previous Payments 40000, Current Payment Received 30000 and Remaining Balance Due 30000, all in minor units of HKD.

<!-- trace:case id=g10.auction-winner-order.TC-gss rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC6-1: A tolerance-close receipt floors the remaining balance at zero

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

* An auction order has an invoice total of 100000 minor units in HKD.
* 90000 minor units have already been paid.
* The operator records a 5000-minor-unit payment and closes the invoice as Paid within the agreed closing tolerance.

**Steps:**

1. Open the receipt for the closing payment.

**Expected Results:**

* Original Invoice Total is 100000 minor units in HKD.
* Previous Payments is 90000 minor units in HKD.
* Current Payment Received is 5000 minor units in HKD.
* Remaining Balance Due is 0.
* The receipt contains no shortfall or write-off line.

<!-- trace:case id=g10.auction-winner-order.TC-b4d rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC7-1: A confirmed overpayment receipt records the full payment

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

* An auction order has an invoice total of 100000 minor units in HKD.
* The operator confirms a payment of 110000 minor units.

**Steps:**

1. Open the payment receipt.

**Expected Results:**

* Original Invoice Total is 100000 minor units in HKD.
* Previous Payments is 0.
* Current Payment Received is 110000 minor units in HKD.
* Remaining Balance Due is 0.
* The receipt contains no negative balance or credit line.

<!-- trace:case id=g10.auction-winner-order.TC-vmr rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC8-1: A refund or reversal does not rewrite issued receipts

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

* An auction order has an invoice total of 100000 minor units in HKD.
* Payments of 20000, 30000 and 10000 minor units were recorded in that order, with one receipt issued for each.
* The second payment is later refunded or reversed.

**Steps:**

1. Open the first receipt.
2. Open the second receipt.
3. Open the third receipt.

**Expected Results:**

* The first receipt still shows Previous Payments 0, Current Payment Received 20000 and Remaining Balance Due 80000.
* The second receipt still shows Previous Payments 20000, Current Payment Received 30000 and Remaining Balance Due 50000.
* The third receipt still shows Previous Payments 50000, Current Payment Received 10000 and Remaining Balance Due 40000.
* No issued receipt is reissued.

<!-- trace:case id=g10.auction-winner-order.TC-4zy rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC2-1: Tracker appears once the lot is dispatched

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
A paid auction order the warehouse has just dispatched with a tracking number attached.

**Steps:**

1. Navigate to <the winner's auction order url>.
2. Check the shipping tracker.

**Expected Results:**

* The order shows the carrier name and the tracking number.
* The tracking number links to the carrier.

<!-- trace:case id=g10.auction-winner-order.TC-l8v rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC3-1: Delivery proof keeps what the carrier sent

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
A dispatched auction order for which <the carrier delivery feed> is mocked to report delivery with a handover timestamp and a signature.

**Steps:**

1. Wait for the delivery confirmation to be processed.
2. Navigate to <the winner's auction order url>.
3. Check the delivery proof.

**Expected Results:**

* The order records the handover timestamp and the signature.
* Neither is reduced to a bare confirmation flag.

## winner-order-US8: Winner pays an invoice with a policy premium

**As a** winner of an auction lot,
**I want** my invoice to calculate the stated buyer premium correctly and meet
the current currency minimum,
**so that** the amount I pay is explainable and collectible.

<!-- trace:case id=g10.auction-winner-order.TC-n3p rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->
### winner-order-US8-TC1-1: Invoice applies the fixed premium

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-08

**Pre-conditions:**

* The winning bid is 250000 HKD minor units and an invoice is being created.

**Steps:**

1. Read the invoice lines and total.

**Expected Results:**

* Buyer premium is 50000 HKD minor units.
* The total includes the premium.

<!-- trace:case id=g10.auction-winner-order.TC-zt4 rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->
### winner-order-US8-TC2-1: A configured minimum replaces a lower percentage premium

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-08

**Pre-conditions:**

* The HKD minimum buyer premium is 20000 minor units.
* The winning bid is 500 HKD minor units.

**Steps:**

1. Create the winner invoice.

**Expected Results:**

* The premium is 20000 HKD minor units, not 1000 HKD minor units.

<!-- trace:case id=g10.auction-winner-order.TC-dd3 rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->
### winner-order-US8-TC3-1: A zero minimum rounds the percentage premium

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-08

**Pre-conditions:**

* The JPY minimum buyer premium is 0 minor units.
* The winning bid is 1003 JPY minor units.

**Steps:**

1. Create the winner invoice.

**Expected Results:**

* The premium is 201 JPY minor units.

<!-- trace:case id=g10.auction-winner-order.TC-i06 rev=1 covers=g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->
### winner-order-US8-TC4-1: A sent invoice keeps its premium after the minimum changes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-08

**Pre-conditions:**

* An invoice was sent with a 0 HKD minimum and a 500 HKD winning bid.

**Steps:**

1. Change the HKD minimum buyer premium to 20000 minor units.
2. Read the sent invoice.
3. Reissue the invoice.

**Expected Results:**

* The sent invoice still shows a 100 HKD premium.
* The reissued invoice shows a 20000 HKD premium.

## winner-order-US9: Winner confirms delivery when five addresses are already saved

**As a** winner with five saved shipping addresses,
**I want** to confirm a different address for this order without saving a sixth,
**so that** a full address book does not block settlement before the address deadline.

<!-- trace:case id=g10.auction-winner-order.TC-8e5 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US9-TC1-1: Winner opens Add new address when the account book already holds five saved addresses

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
An authenticated winner account with exactly five saved shipping addresses, viewing <the winner's auction order url> before the address deadline.

**Steps:**

1. Open the order's Confirm Delivery Address selector.
2. Select Add new address.

**Expected Results:**

* The Add new address form opens.
* No message blocks the form from opening.

<!-- trace:case id=g10.auction-winner-order.TC-0hi rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US9-TC2-1: Winner confirms a one-time delivery address for the order when the book is full

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
An authenticated winner account with exactly five saved shipping addresses, viewing <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| New address | <a new shipping address's full details> |

**Steps:**

1. Open the order's Confirm Delivery Address selector.
2. Select Add new address.
3. Enter the new address's details in the form.
4. Leave Save this address for future orders unselected.
5. Confirm the address for this order.

**Expected Results:**

* The order's delivery address is set to the entered address.
* The account's saved address count remains five.

<!-- trace:case id=g10.auction-winner-order.TC-nbn rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US9-TC3-1: A one-time address entered at the cap sits as a draft at the top of the address picker

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
An authenticated winner account with exactly five saved shipping addresses, viewing <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| New address | <a new shipping address's full details> |

**Steps:**

1. Open the order's Confirm Delivery Address selector.
2. Select Add new address and enter the new address's details.
3. Select Use this address.

**Expected Results:**

* The one-time address appears as a draft entry at the top of the address picker list.
* The five saved addresses remain listed below the draft entry.

<!-- trace:case id=g10.auction-winner-order.TC-j6u rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US9-TC4-1: Save this address for future orders is refused when the book already holds five addresses

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
An authenticated winner account with exactly five saved shipping addresses, viewing <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| New address | <a new shipping address's full details> |

**Steps:**

1. Open the order's Confirm Delivery Address selector.
2. Select Add new address and enter the new address's details.
3. Attempt to select Save this address for future orders.

**Expected Results:**

* The Save this address for future orders checkbox is disabled and unchecked.
* An Info tooltip beside the checkbox states a short reason the save is refused.

<!-- trace:case id=g10.auction-winner-order.TC-go0 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US9-TC5-1: Save this address for future orders remains available below the cap

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
An authenticated winner account with exactly four saved shipping addresses, viewing <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| New address | <a new shipping address's full details> |

**Steps:**

1. Open the order's Confirm Delivery Address selector.
2. Select Add new address and enter the new address's details.
3. Select Save this address for future orders.
4. Confirm the address for this order.

**Expected Results:**

* The Save this address for future orders checkbox is enabled and can be checked.
* The new address is added to the account's saved address book, bringing the saved count to five.

<!-- trace:case id=g10.auction-winner-order.TC-tz6 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US9-TC6-1: Removing a saved address frees a slot so saving becomes available again

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
An authenticated winner account with exactly five saved shipping addresses, including <a saved address named "Home">.

**Steps:**

1. Remove <a saved address named "Home"> from the account's shipping address book.
2. Open <the winner's auction order url>'s Confirm Delivery Address selector.
3. Select Add new address and enter <a new shipping address's full details>.
4. Attempt to select Save this address for future orders.

**Expected Results:**

* The account's saved address count is four after the removal.
* The Save this address for future orders checkbox is enabled.

<!-- trace:case id=g10.auction-winner-order.TC-s5g rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US9-TC7-1: Editing a saved address at the cap does not consume an additional slot

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
An authenticated winner account with exactly five saved shipping addresses, including <a saved address named "Home">.

**Test data:**

| Field | Value |
| --- | --- |
| Updated field on "Home" | <an updated street address> |

**Steps:**

1. Open <a saved address named "Home"> for editing.
2. Change the address's street field to the updated value.
3. Save the edit.

**Expected Results:**

* The account's saved address count remains five.
* The address book shows the edited entry once, with the updated value.

<!-- trace:case id=g10.auction-winner-order.TC-yru rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US9-TC8-1: An account already holding more than five saved addresses keeps them and still refuses new saves

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
* **Trace:** winner-order-US-12

**Pre-conditions:**
An authenticated winner account with six saved shipping addresses, held from before the cap took effect, viewing <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| New address | <a new shipping address's full details> |

**Steps:**

1. Open the account's shipping address book.
2. Open the order's Confirm Delivery Address selector.
3. Select Add new address and enter the new address's details.
4. Attempt to select Save this address for future orders.

**Expected Results:**

* All six existing saved addresses remain listed in the account's address book.
* The Save this address for future orders checkbox is disabled and unchecked for the new address.

## Raised

- The latest product reading confirms that invoice creation remains the point at which the 20% premium amount is calculated; no unresolved product question remains.

## winner-order-US5: Winner misses the payment deadline

**As a** winner whose invoice deadline has passed unpaid,
**I want** clear Contact Us and no card Pay,
**so that** I know self-service payment has stopped and how to reach Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-uup rev=1 covers=g10.auction-winner-order.SC-9vf -->
### winner-order-US5-TC1-1: Payment overdue still shows Contact Us and hides Pay

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
* **Trace:** winner-order-US-05

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Check the inline alert and payment controls.

**Expected Results:**

* The page reads Payment Overdue.
* Contact Us is shown.
* No card Pay control is offered.
* The payment deadline is absent.

---

## winner-order-US7: Winner misses the address deadline

**As a** winner who did not confirm a delivery address within 48 hours of lot close,
**I want** clear Contact Us and no Confirm control,
**so that** I know self-service address confirmation has stopped and how to reach Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-2in rev=1 covers=g10.auction-winner-order.SC-36a,g10.auction-winner-order.SC-k2b -->
### winner-order-US7-TC1-1: Setup overdue still shows Contact Us and hides Confirm

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) is signed in on <the winner's auction order url> for <order_setup_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup_overdue> | An auction order whose setup deadline has passed with setup incomplete |

**Steps:**

1. Open <the winner's auction order url> for <order_setup_overdue>.
2. Check the inline alert and setup controls.

**Expected Results:**

* The page reads Setup Overdue.
* Contact Us is shown.
* No Confirm control is offered.
* Address editing is absent.

---

## winner-order-US16: Winner emails Grade10 from a locked order

**As a** winner whose payment access has closed,
**I want** a ready email with this order's details that I can copy into any mail app,
**so that** I can reach Grade10 without a system mail client, and support can find the order.

<!-- trace:case id=g10.auction-winner-order.TC-iro rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC1-1: Contact Us opens the copy-first Email Grade10 dialog

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

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us on the inline alert.

**Expected Results:**

* The Email Grade10 dialog opens.
* The dialog shows To, Subject and Message.
* No toast that only names the support address replaces the dialog.
* No mail client opens as the Contact Us action itself.

<!-- trace:case id=g10.auction-winner-order.TC-le5 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC2-1: Dialog To is support at grade10.com

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

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Read the To field.

**Expected Results:**

* To is `support@grade10.com`.

<!-- trace:case id=g10.auction-winner-order.TC-ta0 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC3-1: Setup overdue subject names the lot and omits an invoice id

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

* customer(winner) is signed in on <the winner's auction order url> for <order_setup_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_setup_overdue> | An auction order past the setup deadline with no invoice issued |
| <lot_title> | The lot title on that order |

**Steps:**

1. Open <the winner's auction order url> for <order_setup_overdue>.
2. Click Contact Us.
3. Read the Subject field.

**Expected Results:**

* Subject is `Auction lot <lot_title>: setup overdue`.
* Subject contains no invoice id.

<!-- trace:case id=g10.auction-winner-order.TC-gxu rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC4-1: Payment overdue subject names the invoice id

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

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |
| <invoice_id> | The issued invoice id on that order |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Read the Subject field.

**Expected Results:**

* Subject is `Auction order <invoice_id>: payment overdue`.

<!-- trace:case id=g10.auction-winner-order.TC-rt4 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC5-1: Partially paid subject names invoice and lists receipts without remaining balance

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

* customer(winner) is signed in on <the winner's auction order url> for <order_partially_paid>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_partially_paid> | An auction order in Partially Paid with at least one recorded receipt |
| <invoice_id> | The invoice id on that order |
| <receipt_ids> | The receipt ids listed for that invoice |

**Steps:**

1. Open <the winner's auction order url> for <order_partially_paid>.
2. Click Contact Us.
3. Read the Subject and Message fields.

**Expected Results:**

* Subject is `Auction order <invoice_id>: partial payment`.
* Message lists <receipt_ids>.
* Message does not show the remaining balance owed.

<!-- trace:case id=g10.auction-winner-order.TC-28a rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC6-1: Partially paid with several receipts lists each receipt id

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

* customer(winner) is signed in on <the winner's auction order url> for <order_partially_paid_many>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_partially_paid_many> | An auction order in Partially Paid with two or more receipt ids |
| <receipt_ids> | Every receipt id on that invoice, oldest first |

**Steps:**

1. Open <the winner's auction order url> for <order_partially_paid_many>.
2. Click Contact Us.
3. Read the Message field.

**Expected Results:**

* Message lists every id in <receipt_ids>.
* Message still omits the remaining balance.

<!-- trace:case id=g10.auction-winner-order.TC-59a rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC7-1: Support address stays off the order until the dialog opens

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

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Scan the order page before Contact Us.
3. Click Contact Us.
4. Read the To field.

**Expected Results:**

* Before step 3, `support@grade10.com` is not shown on the order page.
* After step 3, To shows `support@grade10.com`.

<!-- trace:case id=g10.auction-winner-order.TC-a9f rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC8-1: Copy Message is first and Open Mail App is second

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

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Check the dialog footer actions.

**Expected Results:**

* Copy Message is the primary footer action.
* Open Mail App is the secondary outline action.

<!-- trace:case id=g10.auction-winner-order.TC-mtb rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC9-1: Message is an editable textarea with footer-only full copy

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

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |
| <winner_question> | A short question the winner types into Message |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Check the Message field and copy controls beside To, Subject and Message.
4. Type <winner_question> into the blank area of Message.

**Expected Results:**

* Message is an editable multi-line field with order facts already filled and space for the winner's question.
* To and Subject each have an in-place copy control.
* Message has no icon copy beside it.
* The only full-email copy control is Copy Message in the footer.
* Step 4 keeps the typed <winner_question> in Message.

<!-- trace:case id=g10.auction-winner-order.TC-vdc rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC10-1: Copy Message copies the ready email including the current Message

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

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.
* The clipboard is available to the browser.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |
| <invoice_id> | The issued invoice id on that order |
| <winner_question> | A short question typed into Message |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Type <winner_question> into Message.
4. Click Copy Message.
5. Paste into a plain-text field.

**Expected Results:**

* The paste includes To `support@grade10.com`.
* The paste includes Subject `Auction order <invoice_id>: payment overdue`.
* The paste includes the Message text with <winner_question>.

<!-- trace:case id=g10.auction-winner-order.TC-mq9 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC11-1: Open Mail App uses the current subject and body

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

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |
| <invoice_id> | The issued invoice id on that order |
| <winner_question> | A short question typed into Message |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Type <winner_question> into Message.
4. Activate Open Mail App.
5. Inspect the `mailto:` target.

**Expected Results:**

* The link addresses `support@grade10.com`.
* The mailto subject is `Auction order <invoice_id>: payment overdue`.
* The mailto body includes <winner_question>.

<!-- trace:case id=g10.auction-winner-order.TC-ovr rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC12-1: In-place To and Subject copy do not replace Copy Message

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

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue>.
* The clipboard is available to the browser.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue> | An auction order whose payment deadline has passed unpaid |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue>.
2. Click Contact Us.
3. Activate the To copy control and paste.
4. Activate the Subject copy control and paste.

**Expected Results:**

* Step 3 pastes only `support@grade10.com`.
* Step 4 pastes only the Subject text.
* Copy Message remains available in the footer for the full ready email.

<!-- trace:case id=g10.auction-winner-order.TC-9co rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### winner-order-US16-TC13-1: A reissued invoice uses the current invoice id in Subject

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

* customer(winner) is signed in on <the winner's auction order url> for <order_payment_overdue_reissued>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_payment_overdue_reissued> | An auction order payment-overdue after a reissue |
| <current_invoice_id> | The current invoice id on that order |
| <replaced_invoice_id> | The replaced invoice id on that order |

**Steps:**

1. Open <the winner's auction order url> for <order_payment_overdue_reissued>.
2. Click Contact Us.
3. Read the Subject field.

**Expected Results:**

* Subject is `Auction order <current_invoice_id>: payment overdue`.
* Subject does not name <replaced_invoice_id>.


## winner-order-US11: Winner bills a won lot to a different address

**As a** winner who pays from a different address than the one the lot ships to,
**I want** to give that billing address when I confirm where to ship,
**so that** my invoice and receipt show who is billed as well as where the lot goes.

<!-- trace:case id=g10.auction-winner-order.TC-qlk rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### winner-order-US11-TC1-1: Billing Add Address shows phone and Personal or Company

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

* customer(winner) is on Complete Order Setup with billing set to differ from delivery.

**Steps:**

1. Open Add Address for billing.
2. Inspect the form controls and fields.

**Expected Results:**

* Personal / Company control is shown above the address fields.
* Phone shows a country selector and national number input.
* Phone country starts empty with a globe only.
* Company Name is hidden while Personal is selected.

<!-- trace:case id=g10.auction-winner-order.TC-9ch rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### winner-order-US11-TC2-1: Billing Add Address refuses empty phone

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

* customer(winner) is on billing Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | Canada |
| Phone digits | (empty) |
| Country or region | Canada |
| Town or city | Toronto |
| Address line 1 | 1 Front St |
| Postal code | M5E 1B2 |

**Steps:**

1. Select a phone country.
2. Leave the national number empty.
3. Fill every other required billing field.
4. Attempt to confirm the billing address.

**Expected Results:**

* Grade10 refuses the confirm.
* A refusal appears beside Phone.
* Billing address on the order stays unchanged.

<!-- trace:case id=g10.auction-winner-order.TC-dno rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### winner-order-US11-TC3-1: Billing company address requires Company Name

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

* customer(winner) is on billing Add Address with Company selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | Canada |
| Phone digits | 4165550100 |
| Country or region | Canada |
| Town or city | Toronto |
| Address line 1 | 1 Front St |
| Postal code | M5E 1B2 |

**Steps:**

1. Fill every required field except Company Name.
2. Attempt to confirm the billing address.

**Expected Results:**

* Grade10 refuses the confirm.
* A refusal appears beside Company Name.
* Billing address on the order stays unchanged.

<!-- trace:case id=g10.auction-winner-order.TC-7ax rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### winner-order-US11-TC4-1: Billing address with phone and kind applies separately from delivery

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

* customer(winner) is on Complete Order Setup with a confirmed personal delivery address for Alex Chen in San Francisco.

**Test data:**

| Field | Value |
| --- | --- |
| Billing kind | Company |
| Billing company name | Northwind Billing Ltd |
| Billing first name | Alex |
| Billing last name | Chen |
| Billing phone country | Canada |
| Billing phone digits | 4165550199 |
| Billing country or region | Canada |
| Billing town or city | Toronto |
| Billing address line 1 | 1 Front St |
| Billing postal code | M5E 1B2 |

**Steps:**

1. Untick billing same as delivery.
2. Open billing Add Address.
3. Enter the company billing address with phone country and digits.
4. Confirm billing.
5. Read delivery and billing on the setup form.

**Expected Results:**

* Step 4 succeeds.
* Delivery still shows the San Francisco personal address.
* Billing shows Northwind Billing Ltd with the entered Toronto address and phone.

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

* customer(winner) with exactly five saved shipping addresses is on <the winner's auction order url> before the address deadline.

**Steps:**

1. Open the Confirm Delivery Address selector.
2. Select Add new address.
3. Inspect the form.

**Expected Results:**

* Personal / Company control is shown.
* Phone shows a country selector and national number input with no country preselected.
* Company Name is hidden while Personal is selected.

<!-- trace:case id=g10.auction-winner-order.TC-yzv rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC2-1: One-time personal address at the cap collects phone and confirms

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

* customer(winner) with exactly five saved shipping addresses is on <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Jordan |
| Last name | Lee |
| Phone country | United States |
| Phone digits | 2125550147 |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |

**Steps:**

1. Open Add new address.
2. Fill every required field, including phone country and digits.
3. Leave Save this address for future orders unselected.
4. Confirm the address for this order.

**Expected Results:**

* Step 4 succeeds.
* The order delivery address is the entered one-time address with phone country and digits.
* The account still holds exactly five saved addresses.

<!-- trace:case id=g10.auction-winner-order.TC-jfw rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### winner-order-US12-TC3-1: One-time company address at the cap requires Company Name and phone

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

* customer(winner) with exactly five saved shipping addresses is on Add new address for delivery.

**Test data:**

| Field | Value |
| --- | --- |
| Kind | Company |
| Company name | (empty) |
| First name | Jordan |
| Last name | Lee |
| Phone country | (unset) |
| Phone digits | (empty) |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |

**Steps:**

1. Select Company.
2. Fill name and locality fields only.
3. Leave Company Name, phone country, and phone digits empty.
4. Leave Save this address for future orders unselected.
5. Attempt to confirm the one-time address.

**Expected Results:**

* Grade10 refuses the confirm.
* Refusals appear beside Company Name and Phone.
* The order delivery address stays unchanged.
* The account still holds exactly five saved addresses.

---

## winner-order-US14: Winner sees a refunded order as Refunded

**As a** winner whose order Grade10 refunded because they were not happy with the item,
**I want** Winner Order to read Refunded, with the amount returned below the invoice total and a way to see Amount, Transfer to, Reason and Note — brand and last four for a card, or masked destination with the bank name under it for a transfer — whether I had paid in full or in part and wherever the card is, and my invoice and receipts still there,
**so that** I know the order is closed and still hold the record of what I paid.

<!-- trace:case id=g10.auction-winner-order.TC-xfb rev=1 covers=g10.auction-winner-order.SC-zfp,g10.auction-winner-order.SC-yhv -->
### winner-order-US14-TC1-1: Refunded keeps the invoice and receipts

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

* customer(winner of `<refunded order>`) is on Winner Order.

**Steps:**

1. Read the status, stepper, actions and receipt links.
2. Open the refund details from the inline alert.

**Expected Results:**

* The order reads Refunded.
* Pay, address editing and shipment actions are absent.
* The invoice and every existing receipt remain downloadable.
* No refund letter is required by this surface.
* Refund details show Amount, then Transfer to, then Reason, then Note when the operator recorded one.
* Transfer to uses `PaymentMethodCard` with the card brand logo and only the last four digits, or a bank icon with the masked destination on the primary line and the free-text bank name as secondary text under it. Not the full number or proof.
* A card refund shows no Reference.
* Note is omitted when the operator left none.

## winner-order-US15: Winner sees an overpayment returned

**As a** winner who paid more than the order,
**I want** only the difference returned below the invoice total, while the lot, the shipping and the amount I should have paid stay, with a way to see why,
**so that** I know the sale still stands.

<!-- trace:case id=g10.auction-winner-order.TC-pca rev=1 covers=g10.auction-winner-order.SC-7m4 -->
### winner-order-US15-TC1-1: An overpayment keeps the order open

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

* customer(winner of `<overpaid order>`) is on Winner Order after the
  overpayment difference was returned.

**Steps:**

1. Read the order status, invoice lines, returned amount and refund details.

**Expected Results:**

* The order status and invoice lines are unchanged.
* Only the returned difference appears below Order Total.
* The refund details can be opened without exposing operator proof or a Stripe provider reference.

## winner-order-US17: Winner matches a bank refund against their own statement

**As a** winner whose refund was sent by bank transfer,
**I want** the reference the operator sent it under, beside the amount and where it went,
**so that** I can find the credit on my statement without asking Customer Service.

<!-- trace:case id=g10.auction-winner-order.TC-3s7 rev=1 covers=g10.auction-winner-order.SC-u8s -->
### winner-order-US17-TC1-1: Bank refund details show destination and reference

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

* customer(winner of `<bank-refunded order>`) is on Winner Order after a bank
  transfer refund was recorded with no operator note.

**Steps:**

1. Open the refund details from the inline alert.

**Expected Results:**

* The details show Amount, then Transfer to, then Reference, then Reason.
* Transfer to shows a bank icon, the masked destination on the primary line, and the free-text bank name as secondary text under it.
* Reference shows the operator's bank provider reference.
* Note is not shown.
* Proof and the full account number are not shown.

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

## winner-order-US10: Winner's payment proof is not accepted

**As a** winner whose payment proof Grade10 could not match,
**I want** to read why and how long I have left,
**so that** I can send the right proof or pay again before the deadline.

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


## Settled

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

## Reconciliation

**Run:** 2026-09-16; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none.
