# grade10-admin/auction/payment-settings Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-admin-auction-payment-settings-US1: Operator maintains the auction premium minimums

**As an** auction operator with payment processing,
**I want** one place under `/auction` to review and update the minimum buyer
premium for each auction currency,
**so that** invoice amounts follow the configured policy.

### grade10-admin-auction-payment-settings-US-01-TC4-1: An operator without payment processing is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* admin(operator whose roles are exactly `staff`).

**Steps:**

1. Request Payment settings.
2. Attempt to save a mapping.

**Expected Results:**

* Both operations are refused.
* The stored mapping is unchanged.

### grade10-admin-auction-payment-settings-US1-TC5-1: Finance saves the minimums in major units, zero included

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
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* The mapping is USD 0, HKD 0 and JPY 0 minor units.
* admin(operator whose roles are exactly `finance`) opens Payment settings under `/auction`.

**Steps:**

1. Type HKD `5.00`, leave USD and JPY at `0`, and save.
2. Reload the tab.

**Expected Results:**

* The save is accepted.
* The tab reads HKD 5.00, USD 0.00 and JPY 0, stored as 500, 0 and 0 minor units.

---

## grade10-admin-auction-payment-settings-US2: Finance keeps the payment processing fee schedule

**As a** finance operator,
**I want** to set, per currency, the card and the bank transfer rule each invoice's processing fee starts from,
**so that** the fee an operator quotes covers what the payment costs Grade10 without anyone working it out by hand.

### grade10-admin-auction-payment-settings-US2-TC1-1: A new schedule holds no rule until Finance sets one

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
* **Trace:** grade10-admin-auction-payment-settings-US-02

**Pre-conditions:**

* No fee schedule has been saved.
* admin(operator whose roles are exactly `finance`) opens Payment settings.

**Steps:**

1. Read the fee schedule.
2. Set HKD card to `3.4`% and `2.35`, and HKD bank transfer to `0`% and `0.00`, leave USD and JPY empty, and save.
3. Reload the tab.

**Expected Results:**

* Before the save, card and bank transfer show no rule in every currency.
* After the reload, HKD card reads 3.4% and HKD 2.35 and HKD bank transfer 0% and HKD 0.00, with no rule in USD or JPY.
* The schedule records the finance operator and the time of the save.

### grade10-admin-auction-payment-settings-US2-TC2-1: Each rule shows its fee on an example subtotal, and quotes start from it

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
* **Trace:** grade10-admin-auction-payment-settings-US-02

**Pre-conditions:**

* No fee schedule has been saved.
* An order in HKD in Preparing Invoice for card, with a subtotal of 312000 minor units once Shipping & Handling and Insurance are entered.
* admin(operator with payment processing) opens Payment settings.

**Steps:**

1. Type an HKD card rule of `3.4`% and `2.35`, and read the example beside it.
2. Save.
3. Open Send invoice on the order, enter the amounts, and read the fee.

**Expected Results:**

* The example reads a fee of HKD 37.63 on a subtotal of HKD 1,000.00, in the console's money format.
* The quote's fee starts at 11225 and the total at 323225 minor units in HKD.

### grade10-admin-auction-payment-settings-US2-TC3-1: Half a rule or a percentage out of range is refused

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
* **Trace:** grade10-admin-auction-payment-settings-US-02

**Pre-conditions:**

* The HKD card rule is 3.4% and 235 minor units, and no other rule is stored.
* admin(operator with payment processing).

**Steps:**

1. Save a USD card rule of `4.4`% with no fixed amount.
2. Save an HKD card rule of `3.405`% and `2.35`.
3. Save an HKD card rule of `100`% and `0.00`.
4. Read the schedule.

**Expected Results:**

* Each save is refused.
* The schedule still holds only the HKD card rule of 3.4% and 235 minor units.

### grade10-admin-auction-payment-settings-US2-TC4-1: Staff can neither read nor change the schedule

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-payment-settings-US-02

**Pre-conditions:**

* admin(operator whose roles are exactly `staff`).

**Steps:**

1. Request the fee schedule.
2. Save a fee schedule.

**Expected Results:**

* Both are refused.
* The stored schedule is unchanged.

## Reconciliation

**Run:** 2026-09-29. One agent wrote the cases and the scenarios, so the two readings are not independent. The cases were drafted from the Purpose, the Feature set, both journeys, the proposal, the decisions and the linked pages, then joined to the scenarios on their anchors.

| Spec scenario | Suite coverage |
| --- | --- |
| `grade10-admin-auction-payment-settings-SC-04` | US-01-TC4-1 |
| `grade10-admin-auction-payment-settings-SC-02`, `SC-05` | US1-TC5-1 |
| `grade10-admin-auction-payment-settings-SC-01`, `SC-03` | the durable cases US-01-TC1-1 and US-01-TC3-1, through their journey |
| `grade10-admin-auction-payment-settings-SC-06`, `SC-07` | US2-TC1-1 |
| `grade10-admin-auction-payment-settings-SC-09`, `SC-11` | US2-TC2-1 |
| `grade10-admin-auction-payment-settings-SC-08` | US2-TC3-1 |
| `grade10-admin-auction-payment-settings-SC-10` | US2-TC4-1 |
| Uncovered scenarios | none |
| Contradicted readings | none |

- **Re-worded** - US-01-TC4-1 reads payment processing in place of the settlement permission, which `finance` now passes.
- **Raised** - the percentage's upper bound landed as decision Q22.
