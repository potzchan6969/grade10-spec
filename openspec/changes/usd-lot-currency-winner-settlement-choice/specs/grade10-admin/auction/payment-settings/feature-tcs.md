# grade10-admin/auction/payment-settings Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** grade10-admin-auction-payment-settings-SC-04, grade10-admin-auction-payment-settings-SC-08, grade10-admin-auction-payment-settings-SC-09, grade10-admin-auction-payment-settings-SC-10, grade10-admin-auction-payment-settings-SC-11

## grade10-admin-auction-payment-settings-US1: Operator maintains the auction premium minimums

**As a** auction operator with payment processing,
**I want** one place under `/auction` to review and update the minimum buyer premium for each auction currency,
**so that** invoice amounts follow the configured policy.

<!-- trace:case id=g10adm.auction-payment-settings.TC-q43 rev=2 -->
### grade10-admin-auction-payment-settings-US1-TC1-2: Initial page shows one USD minimum

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
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* admin(holds the auction settlement permission) is on Payment settings under `/auction`.
* No minimum has been saved yet.

**Steps:**

1. Read the premium minimum.
2. Look for an HKD or JPY premium minimum.

**Expected Results:**

* Step 1: one USD minimum is shown, reading USD0.00.
* Step 2: no HKD or JPY minimum is shown.

<!-- trace:case id=g10adm.auction-payment-settings.TC-nzx rev=2 -->
### grade10-admin-auction-payment-settings-US1-TC2-2: A saved USD minimum persists

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
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* admin(holds the auction settlement permission) is on Payment settings under `/auction`.

**Test data:**

| Field | Value |
| --- | --- |
| `<usd>` | 100 minor units (any whole amount of 0 or more) |

**Steps:**

1. Set the USD minimum to `<usd>`.
2. Save.
3. Reload Payment settings.

**Expected Results:**

* Step 3 shows `<usd>` as saved.
* The save names this operator and the time it was saved.

<!-- trace:case id=g10adm.auction-payment-settings.TC-s5q rev=2 -->
### grade10-admin-auction-payment-settings-US1-TC3-2: Invalid save changes nothing

Runs once per row of **Test data**.

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

* admin(holds the auction settlement permission) is on Payment settings under `/auction`.
* The saved minimum is USD 0 minor units.

**Test data:**

| `<mapping>` | `<refusal>` |
| --- | --- |
| USD -1 minor unit | a negative amount |
| USD 0, EUR 100 minor units | an unsupported currency |

**Steps:**

1. Submit `<mapping>`.
2. Read the saved minimum.

**Expected Results:**

* The save is refused because `<refusal>`.
* USD remains 0 minor units.

<!-- trace:case id=g10adm.auction-payment-settings.TC-gof rev=2 -->
### grade10-admin-auction-payment-settings-US1-TC5-2: Finance saves the minimum in major units, zero included

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
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* The saved USD minimum is `<before>`.
* admin(operator whose roles are exactly `finance`) opens Payment settings under `/auction`.

**Test data:**

| `<before>` | `<typed>` | `<read>` | `<stored>` |
| --- | --- | --- | --- |
| USD0.00 | 5.00 | USD 5.00 | 500 |
| USD5.00 | 0 | USD 0.00 | 0 |

**Steps:**

1. Type `<typed>` as the USD minimum.
2. Save.
3. Reload the tab.

**Expected Results:**

* The save is accepted.
* The tab reads `<read>`, stored as `<stored>` minor units.

<!-- trace:case id=g10adm.auction-payment-settings.TC-6sl rev=1 -->
### grade10-admin-auction-payment-settings-US1-TC6-1: A premium minimum in HKD or JPY is refused

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* The saved USD minimum is 100 minor units.
* admin(operator with payment processing) is on Payment settings under `/auction`.

**Test data:**

| `<currency>` | Why this row |
| --- | --- |
| HKD | A retired minimum currency |
| JPY | A retired minimum currency |

**Steps:**

1. Submit a premium minimum of 100 minor units in `<currency>`.
2. Read the saved minimum.

**Expected Results:**

* Step 1 is refused.
* Step 2 reads USD 100 minor units, unchanged.

## grade10-admin-auction-payment-settings-US2: Finance keeps the Stripe card fee rule

**As a** finance operator,
**I want** to set, per currency, the card rule that prices a card invoice's processing fee,
**so that** a card invoice's fee always covers what Stripe takes, without an operator working it out by hand.

<!-- trace:case id=g10adm.auction-payment-settings.TC-df4 rev=2 -->
### grade10-admin-auction-payment-settings-US2-TC1-2: No rule until Finance sets one

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
2. Set HKD to `3.4`% and `2.35`, leave USD empty, and save.
3. Reload the tab.

**Expected Results:**

* Before the save, USD and HKD each show no rule.
* After the reload, HKD reads 3.4% and HKD 2.35, with no rule in USD.
* The save records the finance operator and the time.

## g10adm.auction-payment-settings.US3: Finance keeps one card rule per settlement currency

**As a** finance operator,
**I want** a card fee rule for USD and one for HKD, and nothing for a currency no winner can pick,
**so that** a winner who settles in either currency can pay by card at a fee that covers what Stripe takes.

<!-- trace:case id=g10adm.auction-payment-settings.TC-lto rev=1 -->
### g10adm.auction-payment-settings.US3-TC1: Card rules are held for USD and HKD, and for no other currency

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
* **Trace:** grade10-admin-auction-payment-settings-US-03

**Pre-conditions:**

* No card rule has been saved.
* admin(operator whose roles are exactly `finance`) opens Payment settings under `/auction`.

**Steps:**

1. Read the card rules.

**Expected Results:**

* A USD rule and an HKD rule are shown, each empty.
* No JPY rule is shown.
* No other currency is shown.

<!-- trace:case id=g10adm.auction-payment-settings.TC-xsy rev=1 -->
### g10adm.auction-payment-settings.US3-TC2: The USD and HKD rules are kept apart

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
* **Trace:** grade10-admin-auction-payment-settings-US-03

**Pre-conditions:**

* No card rule has been saved.
* admin(operator whose roles are exactly `finance`) opens Payment settings under `/auction`.

**Steps:**

1. Set USD to `4.4`% and `0.30`.
2. Set HKD to `3.4`% and `2.35`.
3. Save.
4. Reload the tab.

**Expected Results:**

* The save is accepted.
* USD reads 4.4% and USD 0.30.
* HKD reads 3.4% and HKD 2.35.
* Neither rule overwrites the other.

<!-- trace:case id=g10adm.auction-payment-settings.TC-93a rev=1 -->
### g10adm.auction-payment-settings.US3-TC3: A JPY card rule is refused

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
* **Trace:** grade10-admin-auction-payment-settings-US-03

**Pre-conditions:**

* The HKD card rule is 3.4% and 235 minor units, and no other rule is stored.
* admin(operator with payment processing).

**Steps:**

1. Save a JPY rule of `3.4`% and `100`.
2. Read the rules.

**Expected Results:**

* Step 1 is refused.
* The stored rules still hold only HKD 3.4% and 235 minor units.

<!-- trace:case id=g10adm.auction-payment-settings.TC-c9t rev=1 -->
### g10adm.auction-payment-settings.US3-TC4: Clearing a currency's rule withdraws card there

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-03

**Pre-conditions:**

* Payment Settings holds a USD card rule of 4.4% and 30 minor units.
* customer(winner) holds an auction order in USD in Awaiting Setup, and on its payment method choice reads that card is offered.
* admin(operator whose roles are exactly `finance`) opens Payment settings under `/auction`.

**Steps:**

1. As the finance operator, clear the USD rule and save.
2. As the winner, reload the order and return to the payment method choice.

**Expected Results:**

* The save is accepted.
* Card is no longer offered in USD and reads not yet available.

<!-- trace:case id=g10adm.auction-payment-settings.TC-80l rev=1 -->
### g10adm.auction-payment-settings.US3-TC5: Saving a USD rule with HKD empty offers card in USD

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
* **Trace:** grade10-admin-auction-payment-settings-US-03

**Pre-conditions:**

* No card rule has been saved.
* customer(winner) holds an auction order in USD in Awaiting Setup, and on its payment method choice reads that card is not yet available in USD.
* admin(operator whose roles are exactly `finance`) opens Payment settings under `/auction`.

**Steps:**

1. As the finance operator, set USD to `4.4`% and `0.30`, leave HKD empty, and save.
2. Reload the tab.
3. As the winner, reload the order and return to the payment method choice.

**Expected Results:**

* The save is accepted.
* USD reads 4.4% and USD 0.30, and HKD reads no rule.
* Card is offered on the order.

## Settled

- None this run. Every blind reading either folded into a scenario or went to `decisions.md` `## Raised`.



## Reconciliation

**Run:** Independent QA2, 2026-10-14. Reconciled the QA1 blind cases with current delta scenarios against the frozen anchors. Read the current PRD, decisions, journeys, delta requirements, technical design and durable baseline. Full case ledger and source paths: `openspec/changes/usd-lot-currency-winner-settlement-choice/qa2-admin.md`.

- **Retained:** All 11 active case IDs, revisions, routes and classifications remain draft. All payment-settings anchors have active cases.
- **Coverage:** The single USD premium minimum, the USD/HKD-only card-rule mapping and separate per-currency rules remain asserted by the retained cases. No case claims a JPY card rule or premium minimum.
- **Out of suite:** The existing entries for permission gates, malformed rule writes and example fee calculations remain because their full THEN is not asserted by a case in this feature suite.
- **Raised:** None. Q11 and Q13 settle the supported currencies and USD card-rule launch requirement.

### Focused QA2 - 2026-10-14

- **Feature set:** The prepared fold removes the retired per-currency premium minimums and legacy Stripe card-fee label. It retains one USD premium minimum, a default of USD 0, payment-processing access, and card rules for USD and HKD only. This resolves the payment-settings feature-set finding against decisions Q4, Q11 and Q13 and the current PRD.
- **Coverage:** No requirement, scenario, journey, case ID, or case text changed. The 11 active draft cases, their existing dispositions, and the five out-of-suite entries above remain unchanged. The feature-set correction creates no new case gap and does not extend the suite's coverage claim.
