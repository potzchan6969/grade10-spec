# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-10-19, tcs-rules r5

## g10.auction-winner-order.US24: Winner chooses the currency they pay in

**As a** winner of a lot bid in USD,
**I want** to settle in USD or HKD when I set the order up,
**so that** I pay in the currency my money is already in.

<!-- trace:case id=g10.auction-winner-order.TC-ayp rev=2 covers=g10.auction-winner-order.SC-o92 -->
### g10.auction-winner-order.US24-TC1: Order setup offers USD and HKD with the first offered preselected

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* A winner is on setup for a won listing whose auction bids were in USD.
* Payment Settings holds a card fee rule in HKD and Grade10 holds FPS and HK Local bank details.

**Steps:**

1. Read the settlement currency and payment method choices.

**Expected Results:**

* USD and HKD are offered; the first offered — USD — is selected.
* Card, FPS and HK Local are offered, and Card is selected.
* The setup is not yet confirmed; the order stays Awaiting Setup until the winner confirms.

## g10.auction-winner-order.US25: Winner picks a payment method their currency offers

**As a** winner who has picked a settlement currency,
**I want** to see only the payment methods that currency offers, with each Hong Kong and overseas bank rail named,
**so that** I choose a way to pay that works for the account I will send it from.

<!-- trace:case id=g10.auction-winner-order.TC-jfi rev=2 covers=g10.auction-winner-order.SC-8dl -->
### g10.auction-winner-order.US25-TC6: Each HKD method reads its fee wording and card is selected

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in HKD.
* customer(winner) holds `<winner_order_191_1>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_191_1 | An order won in USD, in Awaiting Setup; bind its identity only |

**Steps:**

1. Choose the home address, pick HKD and read its payment choices.

**Expected Results:**

* HKD is the selected settlement currency.
* Card reads `Card fee about 3.4% + a fixed amount` and is selected.
* FPS and HK Local each read `Bank fee set on your invoice`, naming no amount.

<!-- trace:case id=g10.auction-winner-order.TC-wq7 rev=1 covers=g10.auction-winner-order.SC-zk3,g10.auction-winner-order.SC-mw8 -->
### g10.auction-winner-order.US25-TC9: The first offered method is preselected, and one currency names itself

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* customer(winner) holds `<winner_order>` in Awaiting Setup with a saved home address, on the row's currency offer.

**Test data:**

| Row | Currencies offered | Card fee rule | Opens reading | Selected method |
| --- | --- | --- | --- | --- |
| Both | USD and HKD | HKD rule | Pay in picker, USD selected | Card |
| HKD only | HKD | HKD rule | `Pay in HKD`, no picker | Card |
| HKD only, no card rule | HKD | none | `Pay in HKD`, no picker | FPS, card not selectable |

| Field | Value |
| --- | --- |
| winner_order | An order won in USD, in Awaiting Setup on the row's currency offer; bind its identity only |

**Steps:**

1. Read the settlement currency choice and each payment method.
2. Where both currencies are offered, choose a different method and confirm setup.

**Expected Results:**

* Step 1 reads the row's **Opens reading** and **Selected method**; a method the currency cannot take is not preselected.
* Step 2's confirmation records the method the winner chose, and the order derives as Preparing Invoice.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| `TC-ayp` asserted both currencies offered with neither selected; SC-278 now preselects the first offered currency | Revised to rev=2, asserting USD selected and the card method preselected |
| `TC-jfi` asserted HKD fee wording with no method selected; SC-91 now selects card | Revised to rev=2, asserting card selected |
| First-method preselection and the `Pay in {currency}` single-currency read had no case | Added `TC-wq7`, covering SC-305 and SC-306 |
