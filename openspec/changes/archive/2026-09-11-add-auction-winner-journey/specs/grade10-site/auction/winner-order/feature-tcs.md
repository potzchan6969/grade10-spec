# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-03, tcs-rules r1

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to be told what I owe and to pay it without waiting for someone to
call me,
**so that** the lot I won becomes mine on my own schedule inside a deadline I
can see.

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

## winner-order-US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for
records.

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
