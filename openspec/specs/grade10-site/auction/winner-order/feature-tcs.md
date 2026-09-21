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

## winner-order-US8: Winner pays an invoice with a policy premium

**As a** winner of an auction lot,
**I want** my invoice to calculate the stated buyer premium correctly and meet
the current currency minimum,
**so that** the amount I pay is explainable and collectible.

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

* Contact Us is shown.
* No card Pay control is offered.

---

## winner-order-US7: Winner misses the address deadline

**As a** winner who did not confirm a delivery address within 48 hours of lot close,
**I want** clear Contact Us and no Confirm control,
**so that** I know self-service address confirmation has stopped and how to reach Grade10.

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

* Contact Us is shown.
* No Confirm control is offered.

---

## winner-order-US16: Winner emails Grade10 from a locked order

**As a** winner whose payment access has closed,
**I want** a ready email with this order's details that I can copy into any mail app,
**so that** I can reach Grade10 without a system mail client, and support can find the order.

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


## Settled

- Partial-payment letter Contact Us is in scope with the same ready mailto

- Subject uses the order's current invoice id after a reissue


- Expired ends self-service card pay (author @tangconst, 2026-09-15).
- Progress is presentation only; eight status names stay.
- Absolute deadline datetime; no countdown.
- 48-hour address confirm window; missed window hides Confirm and shows Contact Us (Storybook 2026-09-16).
- Insurance remains optional and separate from Payment Processing Fee.
- Receipt PDF after payment on the same row as Invoice.
- Fee tooltips on Buyer’s Premium, Shipping & Handling, and Payment Processing Fee (brief fee copy).

## Reconciliation

**Run:** 2026-09-16; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none.
