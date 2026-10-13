# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review · 0/7
**Drafts styled:** 2026-10-13, tcs-rules r5

## g10.auction-notifications-order.US1: Post-close letters

**As a** customer(winner),
**I want** the letters Grade10 sends about my auction order,
**so that** I know what to do next without guessing.

<!-- trace:case id=g10.auction-notifications-order.TC-8bw rev=3 covers=g10.auction-notifications-order.SC-pyd -->
### g10.auction-notifications-order.US1-TC1: Auction-won letter names the USD winning bid before setup

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
* **Trace:** Post-close letters

**Pre-conditions:**

* A collector wins a USD lot. No settlement currency is selected yet.

**Test data:**

| Field | Value |
| --- | --- |
| `<winning bid>` | USD101.00 (10100 minor units) |

**Steps:**

1. Read the auction-won letter.

**Expected Results:**

* The letter names `<winning bid>` in USD.
* It names no HKD amount and no conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-5o0 rev=3 covers=g10.auction-notifications-order.SC-tfm,g10.auction-notifications-order.SC-3mo -->
### g10.auction-notifications-order.US1-TC2: Payment reminder uses the chosen settlement currency

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* A winner has chosen a settlement currency and an operator is ready to send the invoice.

**Test data:**

| Settlement currency | Winning bid | Payment reminder total |
| --- | --- | --- |
| USD | Any USD winning bid | 312000 minor units in USD |
| HKD | 10100 minor units in USD | 103100 minor units in HKD |

**Steps:**

1. Send the invoice and read the payment-reminder letter.

**Expected Results:**

* The amount is the row's payment-reminder total in its settlement currency.
* The letter does not repeat the USD winning bid.
* Under HKD settlement, the letter names no conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-ew9 rev=1 -->
### g10.auction-notifications-order.US1-TC56: Later payment reminder uses the settlement currency

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
* **Trace:** Post-close letters

**Pre-conditions:**

* A sent invoice remains unpaid; its order has the row's settlement currency.

**Test data:**

| Settlement currency | Reminder amount |
| --- | --- |
| USD | Any amount in USD |
| HKD | 103100 minor units in HKD |

**Steps:**

1. Read a later payment reminder.

**Expected Results:**

* Any amount in the reminder uses the row's settlement currency.
* The reminder includes no USD winning bid under HKD settlement.

<!-- trace:case id=g10.auction-notifications-order.TC-vxo rev=2 covers=g10.auction-notifications-order.SC-16k -->
### g10.auction-notifications-order.US1-TC57: Payment received letters use the settlement currency

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
* **Trace:** Post-close letters

**Pre-conditions:**

* A winner has an order with the row's settlement currency and a recorded payment.

**Test data:**

| Settlement currency | Amount received |
| --- | --- |
| USD | 312000 minor units in USD |
| HKD | 103100 minor units in HKD |

**Steps:**

1. Read the payment-received letter and receipt.

**Expected Results:**

* The received amount and receipt use the row's settlement currency.
* Under HKD settlement, neither prints the USD winning bid or a conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-l6s rev=2 covers=g10.auction-notifications-order.SC-0e7 -->
### g10.auction-notifications-order.US1-TC58: A reissue after a currency change sends the reminder in the new currency

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a pending invoice in HKD.
* admin(operator) can reissue the invoice for `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order with a pending HKD invoice, for a USD lot won at `<winning bid>` |
| `<winning bid>` | USD2,400 (range: >0 minor units) |
| `<new invoice total>` | USD131.21 (13121 minor units) |

**Steps:**

1. admin(operator) changes the settlement currency of `<lot_1>` to USD and reissues the invoice.
2. Open the winner's inbox and the send log.

**Expected Results:**

* One payment-reminder letter exists for the new invoice and names `<new invoice total>` in USD.
* No amount in it reads in HKD.
* The HKD invoice's earlier payment-reminder letter still reads its HKD amounts.
* No invoice-reissued letter exists.

<!-- trace:case id=g10.auction-notifications-order.TC-xsq rev=2 covers=g10.auction-notifications-order.SC-7qg -->
### g10.auction-notifications-order.US1-TC59: The payment overdue letter names the outstanding amount in the settlement currency
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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email and a pending unpaid invoice in HKD, for a USD lot won at `<winning bid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order with a pending HKD invoice and a known payment deadline |
| `<winning bid>` | USD2,400 (range: >0 minor units) |
| `<invoice total>` | HKD1,031.00 (103100 minor units) |

**Steps:**

1. Let the invoice's payment deadline pass so Grade10 sets it to `expired`.
2. Open the winner's inbox and read the letter.

**Expected Results:**

* One payment overdue letter exists for `<lot_1>`.
* It names `<invoice total>` as the outstanding amount in HKD.
* It names no USD amount and no conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-i7q rev=1 -->
### g10.auction-notifications-order.US1-TC60: Internal bidder receives no order letters

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
* **Trace:** Post-close letters

**Pre-conditions:**

* An internal bidder wins and its order is created automatically at lot close.

**Steps:**

1. Read the internal bidder's order letter history after close.

**Expected Results:**

* No order letters are sent to the internal bidder.

## Settled

- None this run. The blind reading's question, which letters keep a USD amount, was answered by the PM as Q18 and the capability's delta as Q24; it needs no entry here.

## Reconciliation

**Cases** - All seven cases remain drafts. `TC-8bw@3` covers SC-pyd; `TC-5o0@3` covers SC-tfm and SC-3mo; `TC-ew9@1` remains unlinked; `TC-vxo@2` covers SC-16k; `TC-l6s@2` SC-0e7; `TC-xsq@2` SC-7qg; and `TC-i7q@1` remains unlinked. Rows use the USD schedule and winning-bid fixtures, with exact converted HKD values where required. The reissue case preserves the prior letter and asserts the payment-reminder letter.

**Scenario coverage** - All six current delta scenarios are covered: SC-pyd, SC-tfm, SC-3mo, SC-16k, SC-0e7 and SC-7qg. Later reminders and the internal bidder no-letter case have no delta scenarios and remain unlinked. At invoice send and reissue, the active post-sale delta names the payment-reminder letter. The separate invoice-reissued letter was removed by product decision; the feature-set term “invoice” means the payment reminder sent with the invoice.
