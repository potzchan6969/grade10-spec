# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

**Out of suite:** none for this change's new scenarios; the scenarios it restates unchanged keep their durable cases.

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

### winner-order-US1-TC42-1: A rule with a zero part, or no rule, reads as the schedule holds it

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
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Grade10 holds HKD bank details.
* The fee schedule holds the row's card and bank transfer rules.
* customer(winner) holds an auction order in the row's currency in Awaiting Setup.

**Test data:**

| Currency | Card rule | Bank transfer rule | Card reads | Bank transfer reads |
| --- | --- | --- | --- | --- |
| HKD | 3.4% + HK$0.00 | 0% + HK$50.00 | `3.4% processing fee` | `HK$50.00 processing fee` |
| USD | none | none | `Set on your invoice` | not offered |

**Steps:**

1. Open Winner Order and start setup.
2. Choose a delivery address and reach the payment method choice.
3. Read the text beside each method.

**Expected Results:**

* Card reads the row's **Card reads**.
* Bank transfer reads the row's **Bank transfer reads**.
* No fee amount is shown.

### winner-order-US1-TC43-1: Production offers card only until Finance confirms the account

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Grade10 holds no HKD bank details, as in production.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Start setup, choose the home address and reach the payment method choice.
2. Send Grade10 a setup confirmation carrying the home address and bank transfer.
3. Reload the order.

**Expected Results:**

* Only card is offered.
* Grade10 refuses the confirmation.
* The order is still Awaiting Setup, with no delivery address and no method recorded.

### winner-order-US1-TC44-1: Setup ends on a review, and leaving it records nothing

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

* Grade10 holds HKD bank details.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Choose the home address, bank transfer, and billing the same as delivery.
2. Read the review.
3. Close setup, and confirm leaving when asked.
4. Reload the order.
5. Make the same choices again and confirm from the review.

**Expected Results:**

* The review shows the home address for delivery and for billing, and bank transfer.
* It says the choices lock once confirmed and only Grade10 can change them after.
* Closing setup asks first.
* After leaving, the order is still Awaiting Setup with no delivery address, billing address or method recorded.
* After confirming, the order reads Preparing Invoice and shows the three choices with Contact Us and no control to change them.

### winner-order-US1-TC45-1: The Next step panel leads every status

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds an auction order in the row's status.
* The winner's zone is Hong Kong.

**Test data:**

| Status | The panel says | It also offers |
| --- | --- | --- |
| Awaiting Setup | Choose delivery, payment and billing by the setup deadline | Complete Order Setup |
| Setup Overdue | `Missed setup deadline:` and the day-only date | Nothing |
| Preparing Invoice | Grade10 is preparing the invoice; the 7 days to pay start when it arrives; no date or time for it | Nothing |
| Pending Payment, card invoice of 323225 minor units in HKD due 2026-10-06T10:00:00Z | Pay HK$3,232.25 by card by 6 October 2026, 18:00 | Nothing |
| Pending Payment, bank transfer | Transfer the order total quoting the bank reference, then send proof, by the deadline | Nothing |
| Pending Payment, proof returned | The reason Grade10 gave and the new payment deadline | Nothing |
| Payment Verifying | Grade10 is checking the transfer; the deadline is paused | Nothing |
| Payment Overdue | The payment deadline has passed | Nothing |
| Partially Paid | Part of the order is paid and Grade10 will be in touch about the rest; no amount and no deadline | Nothing |
| Processing | Grade10 is preparing the shipment | Nothing |
| Shipped | The carrier and the tracking number | Track shipment |
| Delivered | The day it was delivered | Nothing |
| Cancelled | The day it was cancelled | Nothing |
| Refunded | The order was refunded | View refund details |

**Steps:**

1. Open Winner Order on a phone-width screen.
2. Read the first section of the page.

**Expected Results:**

* The Next step panel is the first section, above the Order Summary.
* It says what the row's **The panel says** holds.
* It offers Contact Us and the row's **It also offers**.
* It names no balance, no payment proof file and no internal note.
* Where the order is payable, its pay controls sit in the Order Summary, not in the panel.

### winner-order-US1-TC46-1: Returning from a card payment records it once

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

* customer(winner) holds an auction order in Pending Payment whose card invoice totals 323225 minor units in HKD.
* The provider's notice for the payment is held back.

**Steps:**

1. Choose Pay with Card and complete the hosted payment with a test card.
2. Return to Winner Order and watch the page.
3. Release the provider's notice for the same payment.
4. Reload the order.

**Expected Results:**

* The page reads Confirming payment, then Processing, without a reload.
* The order holds one payment and one receipt for 323225 minor units in HKD, before and after the notice.

### winner-order-US1-TC47-1: A return naming another collector's payment records nothing

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is signed in and holds an auction order in Pending Payment.
* customer(other collector) completed a card payment for their own order.

**Steps:**

1. As the winner, return to Winner Order naming the other collector's payment.

**Expected Results:**

* Grade10 answers as if that order did not exist.
* Neither order records a payment.

### winner-order-US1-TC48-1: An overdue order says so in the Next step panel, not an alert

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds an auction order that reached the row's status as the row says.

**Test data:**

| Status | How it got there | The panel says | Not offered |
| --- | --- | --- | --- |
| Setup Overdue | The 48-hour setup window passed with no confirmed setup | `Missed setup deadline:` and the day-only date | Complete Order Setup |
| Payment Overdue | The card invoice's payment deadline passed unpaid | The payment deadline has passed | Pay with Card |
| Payment Overdue | Proof was returned with 1 minute left, and that minute passed | The payment deadline has passed | Proof upload |

**Steps:**

1. Open Winner Order.
2. Read the Next step panel and look for any other overdue notice.
3. Try the row's **Not offered** action through Grade10's API.

**Expected Results:**

* The Next step panel says what the row's **The panel says** holds and offers Contact Us.
* The page shows no separate overdue alert.
* The row's **Not offered** action is not on the page, and trying it changes nothing and charges no card.

---

## winner-order-US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

### winner-order-US9-TC22-1: Each method shows its fee rule, and bank transfer is recorded with the address

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

* Grade10 holds HKD bank details.
* The fee schedule holds HKD card 3.4% + HK$2.35 and HKD bank transfer 0% + HK$0.00.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Start setup, choose a delivery address and reach the payment method choice.
2. Read the text beside each method.
3. Choose bank transfer and confirm from the review.

**Expected Results:**

* Card reads `3.4% + HK$2.35 processing fee`.
* Bank transfer reads `Free`.
* Neither method is selected before the winner chooses.
* After confirming, the order records bank transfer and reads Preparing Invoice.

### winner-order-US9-TC23-1: The transaction reference reaches the operator only

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

* customer(winner) holds an auction order whose bank transfer invoice is `pending`.

**Steps:**

1. Open Submit Payment Proof, choose one PDF and enter the transaction reference `FT26091300042`.
2. Confirm.
3. As admin(operator with payment processing), open the order and check the proof.
4. As the winner, open Winner Order.

**Expected Results:**

* The order reads Payment Verifying.
* The operator reads `FT26091300042` with the PDF.
* The winner sees neither the transaction reference nor the file.

### winner-order-US9-TC24-1: A HEIC photo is sent as a JPEG

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) holds an auction order whose bank transfer invoice is `pending`.
* A HEIC photo of a transfer slip, taken on a phone.

**Steps:**

1. Open Submit Payment Proof, choose the HEIC photo and confirm.
2. As admin(operator with payment processing), open the proof.

**Expected Results:**

* The order reads Payment Verifying.
* The file the operator opens is a JPEG.

### winner-order-US9-TC25-1: An unconverted HEIC file is refused

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) holds an auction order whose bank transfer invoice is `pending`.

**Steps:**

1. Send Grade10 an upload carrying an unconverted HEIC photo named `slip.jpg`.

**Expected Results:**

* Grade10 refuses it, naming PDF, PNG and JPEG as the types it takes.
* No file is stored.
* The invoice is still `pending`.

### winner-order-US9-TC26-1: No card payment starts while proof is checked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) holds an auction order whose bank transfer invoice is `payment_verifying`.

**Steps:**

1. As the winner, try to start a card payment for the invoice.

**Expected Results:**

* No card payment starts, and no card is charged.
* The invoice is still `payment_verifying`.

---

## winner-order-US16: Winner emails Grade10 from a locked order

**As a** winner whose payment access has closed,
**I want** a ready email with this order's details that I can copy into any mail app,
**so that** I can reach Grade10 without a system mail client, and support can find the order.

### winner-order-US16-TC14-1: Contact Us names the order's status

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
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) holds an auction order in the row's status, with current invoice id `IN-LK42301` and lot title "Charizard Base Set PSA 10".

**Test data:**

| Status | Subject |
| --- | --- |
| Payment Verifying | `Auction order IN-LK42301: payment verifying` |
| Partially Paid | `Auction order IN-LK42301: partially paid` |

**Steps:**

1. Open Winner Order.
2. Choose Contact Us in the Next step panel.

**Expected Results:**

* Before the dialog opens, `support@grade10.com` is not on the order page.
* A dialog opens with To `support@grade10.com`, Subject and Message, and Copy Message is its first footer action.
* Subject reads the row's **Subject**.
* Message names the invoice id, the lot title and the row's status.
* Message names no remaining balance.

## Settled

- A fee rule with one part zero leaves that part out, `3.4% processing fee` or `HK$50.00 processing fee`, and both parts zero read `Free`.
- Leaving setup before confirming records none of the three choices; confirming records all three together.
- The winner changes no choice after confirming; an operator reopens or records setup.
- Bank details are held per currency on each lane: the sample account outside production, and none in production until Finance confirms Grade10's account.

## Reconciliation

**Run:** The same agent wrote the blind cases and the scenarios, so the two readings are not independent. The cases were written from the Feature set, the journeys, the proposal, the decisions and the linked PRD sections, then joined to the scenarios on their anchors.

- **Folded:** the decisions' raised rows each landed as a scenario - Q21 as `winner-order-SC-225`, Q23 as `winner-order-SC-232`, Q24 as the lock the review states in `winner-order-SC-231`, and Q25 as `winner-order-SC-226`.
- **Covered:** `winner-order-SC-224` and `-SC-225` ← `US1-TC42-1`; `-SC-226` ← `US1-TC43-1`; `-SC-231` and `-SC-232` ← `US1-TC44-1`; `-SC-233` to `-SC-235` ← `US1-TC45-1`; `-SC-236` and `-SC-237` ← `US1-TC46-1`; `-SC-238` ← `US1-TC47-1`; `-SC-37`, `-SC-71` and `-SC-120` ← `US1-TC48-1`; `-SC-90` and `-SC-91` ← `US9-TC22-1`; `-SC-229` ← `US9-TC23-1`; `-SC-227` ← `US9-TC24-1`; `-SC-228` ← `US9-TC25-1`; `-SC-117` ← `US9-TC26-1`; `-SC-160`, `-SC-161`, `-SC-166` and `-SC-230` ← `US16-TC14-1`.
- **Kept with the durable suite:** the restated scenarios whose lines did not move, and `winner-order-SC-93`, whose one change is that Grade10 holds HKD bank details.
- **Out of suite:** none.
