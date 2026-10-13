# grade10-admin/auction/payment-settings Test Cases

**Status:** pending-review · 0/7
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-admin-auction-payment-settings-US1: Operator maintains the auction premium minimums

**As an** auction operator with payment processing,
**I want** one place under `/auction` to review and update the minimum buyer
premium for each auction currency,
**so that** invoice amounts follow the configured policy.

<!-- trace:case id=g10adm.auction-payment-settings.TC-7de rev=2 covers=g10adm.auction-payment-settings.SC-erw,g10adm.auction-payment-settings.SC-veg,g10adm.auction-payment-settings.SC-ieg,g10adm.auction-payment-settings.SC-s8d -->
### grade10-admin-auction-payment-settings-US1-TC4-2: An operator without payment processing is refused

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

<!-- trace:case id=g10adm.auction-payment-settings.TC-gof rev=1 covers=g10adm.auction-payment-settings.SC-erw,g10adm.auction-payment-settings.SC-veg,g10adm.auction-payment-settings.SC-ieg,g10adm.auction-payment-settings.SC-s8d,g10adm.auction-payment-settings.SC-qzp -->
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

## grade10-admin-auction-payment-settings-US2: Finance keeps the Stripe card fee rule

**As a** finance operator,
**I want** to set, per currency, the card rule that prices a card invoice's processing fee,
**so that** a card invoice's fee always covers what Stripe takes, without an operator working it out by hand.

<!-- trace:case id=g10adm.auction-payment-settings.TC-df4 rev=1 covers=g10adm.auction-payment-settings.SC-pzf,g10adm.auction-payment-settings.SC-cac,g10adm.auction-payment-settings.SC-5h3,g10adm.auction-payment-settings.SC-su9,g10adm.auction-payment-settings.SC-lon,g10adm.auction-payment-settings.SC-g3v -->
### grade10-admin-auction-payment-settings-US2-TC1-1: No rule until Finance sets one

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

* No card rule has been saved.
* admin(operator whose roles are exactly `finance`) opens Payment settings.

**Steps:**

1. Read the card rule.
2. Set HKD to `3.4`% and `2.35`, leave USD and JPY empty, and save.
3. Reload the tab.

**Expected Results:**

* Before the save, every currency shows no rule.
* After the reload, HKD reads 3.4% and HKD 2.35, with no rule in USD or JPY.
* The save records the finance operator and the time.

<!-- trace:case id=g10adm.auction-payment-settings.TC-eng rev=1 covers=g10adm.auction-payment-settings.SC-pzf,g10adm.auction-payment-settings.SC-cac,g10adm.auction-payment-settings.SC-5h3,g10adm.auction-payment-settings.SC-su9,g10adm.auction-payment-settings.SC-lon,g10adm.auction-payment-settings.SC-g3v -->
### grade10-admin-auction-payment-settings-US2-TC2-1: The rule shows its fee on an example subtotal, and prices a card invoice

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

* No card rule has been saved.
* An order in HKD in Preparing Invoice for card, with a subtotal of 312000 minor units once Shipping & Handling and Insurance are entered.
* admin(operator with payment processing) opens Payment settings.

**Steps:**

1. Type an HKD rule of `3.4`% and `2.35`, and read the example beside it.
2. Save.
3. Open Send invoice on the order, enter the amounts, and read the fee.

**Expected Results:**

* The example reads a fee of HKD 37.63 on a subtotal of HKD 1,000.00, in the console's money format.
* The quote's computed fee reads 11225 and the total 323225 minor units in HKD, read-only with the HKD rule it came from.

<!-- trace:case id=g10adm.auction-payment-settings.TC-40o rev=1 covers=g10adm.auction-payment-settings.SC-pzf,g10adm.auction-payment-settings.SC-cac,g10adm.auction-payment-settings.SC-5h3,g10adm.auction-payment-settings.SC-su9,g10adm.auction-payment-settings.SC-lon,g10adm.auction-payment-settings.SC-g3v -->
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

1. Save a USD rule of `4.4`% with no fixed amount.
2. Save an HKD rule of `3.405`% and `2.35`.
3. Save an HKD rule of `100`% and `0.00`.
4. Read the rules.

**Expected Results:**

* Each save is refused.
* The stored rules still hold only HKD 3.4% and 235 minor units.

<!-- trace:case id=g10adm.auction-payment-settings.TC-ape rev=1 covers=g10adm.auction-payment-settings.SC-pzf,g10adm.auction-payment-settings.SC-cac,g10adm.auction-payment-settings.SC-5h3,g10adm.auction-payment-settings.SC-su9,g10adm.auction-payment-settings.SC-lon,g10adm.auction-payment-settings.SC-g3v -->
### grade10-admin-auction-payment-settings-US2-TC4-1: Staff can neither read nor change the card rules

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

1. Request the card rules.
2. Save a card rule.

**Expected Results:**

* Both are refused.
* The stored rules are unchanged.

<!-- trace:case id=g10adm.auction-payment-settings.TC-6it rev=1 covers=g10adm.auction-payment-settings.SC-qak -->
### grade10-admin-auction-payment-settings-US2-TC5-1: Saving a card rule offers card in that currency

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
* **Trace:** grade10-admin-auction-payment-settings-US-02

**Pre-conditions:**

* Payment Settings holds no USD card rule.
* customer(winner) holds an auction order in USD in Awaiting Setup, and on its payment method choice reads that card is not yet available in USD.
* admin(operator whose roles are exactly `finance`) is on Payment settings.

**Steps:**

1. As the finance operator, set USD to `4.4`% and `0.30`, and save.
2. As the winner, reload the order and return to the payment method choice.

**Expected Results:**

* The save is accepted.
* Card is offered on the order, and no longer reads not yet available.

## Reconciliation

**Run:** 2026-09-29. One agent wrote the cases and the scenarios, so the two readings are not independent. The cases were drafted from the Purpose, the Feature set, both journeys, the proposal, the decisions and the linked pages, then joined to the scenarios on their anchors.

**Run:** 2026-10-06, QA2. A fresh reader joined every scenario and every case in this suite on their anchors, against the durable suite the fold lands on.

| Spec scenario | Disposition |
| --- | --- |
| `grade10-admin-auction-payment-settings-SC-01` | Covered by the durable case `grade10-admin-auction-payment-settings-US1-TC1-1` |
| `grade10-admin-auction-payment-settings-SC-02` | Covered by the durable case `grade10-admin-auction-payment-settings-US1-TC2-1` and by `US1-TC5-1` |
| `grade10-admin-auction-payment-settings-SC-03` | Covered by the durable case `grade10-admin-auction-payment-settings-US1-TC3-1` |
| `grade10-admin-auction-payment-settings-SC-04` | Covered by `US1-TC4-2` |
| `grade10-admin-auction-payment-settings-SC-05` | Covered by `US1-TC5-1` |
| `grade10-admin-auction-payment-settings-SC-06`, `SC-07` | Covered by `US2-TC1-1` |
| `grade10-admin-auction-payment-settings-SC-08` | Covered by `US2-TC3-1` |
| `grade10-admin-auction-payment-settings-SC-09`, `SC-11` | Covered by `US2-TC2-1` |
| `grade10-admin-auction-payment-settings-SC-10` | Covered by `US2-TC4-1` |
| `grade10-admin-auction-payment-settings-SC-12` | Was uncovered; added `US2-TC5-1` |
| Contradicted readings | None |

- **Revised** - `grade10-admin-auction-payment-settings-US1-TC4` revises the durable case of that number: the access it refuses moved from settlement to payment processing, which `finance` now passes, so it is `-2` under the durable trace marker at `rev=2`. It was written `US-01-TC4-1`, which the fold read as a second TC4.
- **Restyle owed** - the durable `US1-TC1-1` to `US1-TC3-1` name the settlement permission in their pre-conditions; an operator who holds it still reaches the page, so what they verify is unchanged, and `/tcs-review` restyles them to payment processing.
- **Raised** - the percentage's upper bound landed as decision Q22.
