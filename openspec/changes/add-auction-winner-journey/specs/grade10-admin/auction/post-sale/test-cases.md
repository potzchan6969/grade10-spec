# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-03, tcs-rules r1

## post-sale-US1: Operator resolves an unpaid order

**As an** operator,
**I want** to reissue, settle, or cancel an unpaid order from the order itself,
**so that** a lot whose winner did not pay stops being an open-ended obligation.

### post-sale-US1-TC1-1: Reissue returns an expired order to Pending Payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**
An auction order deriving as Expired, and an operator holding payment-processing.

**Steps:**

1. Navigate to <grade10 auction admin orders url>.
2. Open the Expired order.
3. Reissue the invoice with a reason.

**Expected Results:**

* The invoice status is still `pending` with a new seven-day deadline.
* The order status is Pending Payment.
* The account suspension is unchanged.

### post-sale-US1-TC2-1: Settlement refused without an address confirmation

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**
An unpaid auction order whose delivery address is unchanged from the profile default, and an operator holding payment-processing.

**Steps:**

1. Navigate to <grade10 auction admin orders url> and open that order.
2. Select settle manually.
3. Attempt to commit without confirming the delivery address.

**Expected Results:**

* Grade10 refuses the settlement.
* The invoice status is still `pending`.

### post-sale-US1-TC3-1: Manual settlement before expiry recalculates and commits

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**
An auction order deriving as Pending Payment three days from its deadline, with a final amount of 312000 minor units in HKD, an operator holding payment-processing, and an alternative address pricing 4000 minor units higher.

**Test data:**

| Field | Value |
| --- | --- |
| Final amount before | 312000 minor units, HKD |
| Final amount after | 316000 minor units, HKD |

**Steps:**

1. Navigate to <grade10 auction admin orders url> and open that order.
2. Select settle manually and update the delivery address to the alternative address.
3. Record a settlement method and an external reference, then commit.

**Expected Results:**

* Both 312000 and 316000 minor units in HKD are shown before the commit.
* The payment record is written at 316000 minor units in HKD.
* The order status is Processing and the delivery address is locked.

### post-sale-US1-TC4-1: Cancelling returns the lot to available

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**
An auction order deriving as Expired, and an operator holding payment-processing.

**Steps:**

1. Navigate to <grade10 auction admin orders url> and open the Expired order.
2. Cancel the order with a reason.
3. Read the lot's inventory status.

**Expected Results:**

* The invoice status is `cancelled` and the order status is Cancelled.
* The lot's inventory status is available and it can be listed again.

### post-sale-US1-TC5-1: No runner-up is offered the cancelled lot

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-01

**Pre-conditions:**
An auction order deriving as Expired whose lot had a second-highest bidder, and an operator holding payment-processing.

**Steps:**

1. Navigate to <grade10 auction admin orders url> and open the Expired order.
2. Cancel the order with a reason.
3. Sign in as the second-highest bidder and open <that listing's public url>.

**Expected Results:**

* No offer reaches the second-highest bidder.
* They hold no right to the lot.

---

## post-sale-US2: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment event on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never
engaged.

### post-sale-US2-TC1-1: Failed payment attempts appear in the invoice history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**
An expired auction order whose winner was declined three times before the deadline, and a second expired order whose winner never attempted payment.

**Steps:**

1. Navigate to <grade10 auction admin orders url> and open the first order.
2. Read its invoice history.
3. Open the second order and read its invoice history.

**Expected Results:**

* The first order shows three failed payment attempts with timestamps.
* The second order's history holds only the issued event.

### post-sale-US2-TC2-1: Address at dispatch survives a later edit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**
An auction order dispatched to one address, and an operator holding shipment-processing.

**Steps:**

1. Navigate to <grade10 auction admin orders url> and open that order.
2. Correct the delivery address.
3. Read the fulfilment history.

**Expected Results:**

* The dispatch event still shows the address as it stood at dispatch.
* The correction is a separate later event with its own address snapshot.

### post-sale-US2-TC3-1: Order detail names the rule behind its status

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**
An auction order whose invoice is `pending` and whose deadline elapsed two days ago.

**Steps:**

1. Navigate to <grade10 auction admin orders url> and open that order.
2. Read the order status and the explanation beside it.

**Expected Results:**

* The order status shows as Expired.
* The detail names the rule that produced it, not the label alone.

### post-sale-US2-TC4-1: Reissue history spans all a buyer's orders

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**
A buyer with reissues recorded on three different auction orders.

**Steps:**

1. Navigate to <grade10 auction admin orders url> and open any one of those orders.
2. Read the buyer's reissue history and the order's reissue count.

**Expected Results:**

* The reissue history covers all three orders.
* The reissue count is that of the order on screen.
