# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## winner-order-US4: Winner pays an invoice by card

**As a** winner
**I want** to see the full invoice and pay it by card, even if a first attempt does not finish
**so that** the lot moves to Processing without contacting Grade10.

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
* An expired invoice still has Pay Now available and the order still reads
  Pending Payment.

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

### winner-order-US4-TC5-1: A completed payment shows Confirming payment before Processing

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
* The order does not read Processing.

### winner-order-US4-TC6-1: A recorded payment reads Processing

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

* The order status reads Processing.

---

## winner-order-US7: Winner confirms where a won lot ships

**As a** winner
**I want** to fill in and confirm a delivery address on the order
**so that** Grade10 can quote shipping to the right place.

### winner-order-US7-TC1-1: Order page shows four sections and timed status steps

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) holds an order that reached Awaiting Address, Preparing Invoice, Pending Payment and Processing.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Scroll to the Order Status section.

**Expected Results:**

* Order Information, Collection Method, Order Status, Lots appear in order.
* Step 2 lists the four statuses in the order reached.
* Each status shows the date and time reached.

### winner-order-US7-TC5-1: Timeline uses the auction-order read model timestamps

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) holds an order whose auction-order read model returns a
  recorded timestamp for each reached status.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Read the Order Status section.

**Expected Results:**

* Each status shows the timestamp returned for that status.
* No timestamp is replaced with the page-load time.

### winner-order-US7-TC2-1: Preparing Invoice shows the address and no payment

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) holds an order in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 auction order url>.

**Expected Results:**

* The confirmed address is shown.
* No invoice and no Pay Now are shown.

### winner-order-US7-TC3-1: A complete address with optional fields empty is accepted

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) holds an order in Awaiting Address.

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

### winner-order-US7-TC4-1: Empty required fields are refused with field errors

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) holds an order in Awaiting Address.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Fill every required field except Town/City and Postal Code.
3. Click Confirm.

**Expected Results:**

* The address is refused.
* An error shows on Town/City and on Postal Code.
* The order status still reads Awaiting Address.
