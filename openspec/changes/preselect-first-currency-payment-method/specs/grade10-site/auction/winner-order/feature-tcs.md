# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/6
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
* FPS and HK Local read no fee line.

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

## g10.auction-winner-order.US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

<!-- trace:case id=g10.auction-winner-order.TC-eu8 rev=4 covers=g10.auction-winner-order.SC-v59 -->
### g10.auction-winner-order.US9-TC22: The picked rail is recorded with the address where Grade10 holds bank details

Runs once per row of **Test data**.

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

* Grade10 holds the sample bank details for each rail outside production, and Payment Settings holds a card fee rule in `<settlement currency>`.
* customer(winner) holds an order won in USD in Awaiting Setup with a saved home address.

* The winner order under test is `<winner_order_104_1>`.

**Test data:**

| `<settlement currency>` | `<rail>` |
| --- | --- |
| HKD | FPS |
| HKD | HK Local |
| USD | International via SWIFT |

| Field | Value |
| --- | --- |
| winner_order_104_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose `<settlement currency>` and read the method choices.
2. Choose `<rail>` in place of the preselected card, and confirm the delivery address.
3. Reload the order.

**Expected Results:**

* Step 1: Card and the `<rail>` option are offered, and card is selected.
* Step 3: the order records bank transfer on `<rail>` and reads Preparing Invoice.


<!-- trace:case id=g10.auction-winner-order.TC-bmd rev=2 covers=g10.auction-winner-order.SC-8dl -->
### g10.auction-winner-order.US9-TC23: The choice shows each method's fee wording, card selected

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

* Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

* The winner order under test is `<winner_order_105_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_105_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose the home address and reach the payment method choice.
2. Read each method.

**Expected Results:**

* Card reads `Card fee about 3.4% + a fixed amount`.
* Each bank rail reads no fee line.
* Card is selected.


## g10.auction-winner-order.US1: Winner settles a won listing

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the listing I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-miy rev=2 covers=g10.auction-winner-order.SC-wn1 -->
### g10.auction-winner-order.US1-TC51: A confirmation with no method is refused

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

* Grade10 holds HKD and SWIFT bank details, and Payment Settings holds an HKD card fee rule.
* customer(winner) holds an auction order won in USD in Awaiting Setup.

* The winner order under test is `<winner_order_46_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_46_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose the home address, pick USD and International via SWIFT, then switch the currency to HKD so the method clears, and confirm without choosing a method.
2. Reload the order.

**Expected Results:**

* Grade10 refuses the confirmation.
* The order is still Awaiting Setup.


## Reconciliation

| Finding | Disposition |
| --- | --- |
| `TC-ayp` asserted both currencies offered with neither selected; SC-278 now preselects the first offered currency | Revised to rev=2, asserting USD selected and the card method preselected |
| `TC-jfi` asserted HKD fee wording with no method selected; SC-91 now selects card | Revised to rev=2, asserting card selected |
| First-method preselection and the `Pay in {currency}` single-currency read had no case | Added `TC-wq7`, covering SC-305 and SC-306 |
| `TC-bmd` (`US9-TC23`) asserted `Bank fee set on your invoice` and neither method selected; SC-91 rev 3 removes the bank fee line and selects card | Revised to rev=2, asserting no bank fee line and card selected |
| `TC-eu8` (`US9-TC22`) asserted none selected at step 1; SC-305 selects the first method | Revised to rev=4, asserting card selected and a rail chosen in its place |
| `TC-miy` (`US1-TC51`) had the winner choose no method; a preselected radio choice cannot be cleared by the winner | Revised to rev=2, reaching no method through a currency switch that clears it, as SC-94 now states |
