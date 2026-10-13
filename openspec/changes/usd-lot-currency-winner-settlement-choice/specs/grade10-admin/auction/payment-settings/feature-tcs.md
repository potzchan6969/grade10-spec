# grade10-admin/auction/payment-settings Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** grade10-admin-auction-payment-settings-SC-04, grade10-admin-auction-payment-settings-SC-08, grade10-admin-auction-payment-settings-SC-09, grade10-admin-auction-payment-settings-SC-10, grade10-admin-auction-payment-settings-SC-11

## grade10-admin-auction-payment-settings-US1: Operator maintains the auction premium minimums

**As a** auction operator with payment processing,
**I want** one place under `/auction` to review and update the minimum buyer premium for each auction currency,
**so that** invoice amounts follow the configured policy.

<!-- trace:case id=g10adm.auction-payment-settings.TC-q43 rev=2 covers=g10adm.auction-payment-settings.SC-erw -->
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

<!-- trace:case id=g10adm.auction-payment-settings.TC-nzx rev=2 covers=g10adm.auction-payment-settings.SC-veg -->
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

<!-- trace:case id=g10adm.auction-payment-settings.TC-s5q rev=2 covers=g10adm.auction-payment-settings.SC-ieg -->
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

<!-- trace:case id=g10adm.auction-payment-settings.TC-gof rev=2 covers=g10adm.auction-payment-settings.SC-qzp -->
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

<!-- trace:case id=g10adm.auction-payment-settings.TC-6sl rev=1 covers=g10adm.auction-payment-settings.SC-ieg -->
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

---

## grade10-admin-auction-payment-settings-US2: Finance keeps the Stripe card fee rule

**As a** finance operator,
**I want** to set, per currency, the card rule that prices a card invoice's processing fee,
**so that** a card invoice's fee always covers what Stripe takes, without an operator working it out by hand.

<!-- trace:case id=g10adm.auction-payment-settings.TC-df4 rev=2 covers=g10adm.auction-payment-settings.SC-pzf,g10adm.auction-payment-settings.SC-cac -->
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

---

## g10adm.auction-payment-settings.US3: Finance keeps one card rule per settlement currency

**As a** finance operator,
**I want** a card fee rule for USD and one for HKD, and nothing for a currency no winner can pick,
**so that** a winner who settles in either currency can pay by card at a fee that covers what Stripe takes.

<!-- trace:case id=g10adm.auction-payment-settings.TC-lto rev=1 covers=g10adm.auction-payment-settings.SC-vst -->
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

<!-- trace:case id=g10adm.auction-payment-settings.TC-xsy rev=1 covers=g10adm.auction-payment-settings.SC-vst -->
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

<!-- trace:case id=g10adm.auction-payment-settings.TC-93a rev=1 covers=g10adm.auction-payment-settings.SC-lpf -->
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

<!-- trace:case id=g10adm.auction-payment-settings.TC-80l rev=1 covers=g10adm.auction-payment-settings.SC-qak,g10adm.auction-payment-settings.SC-rmb -->
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

**Run:** QA2 reconciliation 2026-10-13 for change `usd-lot-currency-winner-settlement-choice`, joining QA1's blind cases with Dev's delta scenarios on `grade10-admin-auction-payment-settings-US-03` and the restated `grade10-admin-auction-payment-settings-US-01` and `grade10-admin-auction-payment-settings-US-02`. Read the change's `proposal.md`, `decisions.md` (Q1 to Q14 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the PRD pages the proposal links. QA1 had read the frozen anchors, `decisions.md` and the PRD only, and no `## Requirements`. Links are post-hoc: a case is linked to a scenario only where its route and Expected Results assert the scenario's THEN; a link that two cases share between them says so.

| Finding | Disposition |
| --- | --- |
| One USD premium minimum, initial 0, saved in major units, replaced whole | **Folded in:** `grade10-admin-auction-payment-settings-SC-01`, `grade10-admin-auction-payment-settings-SC-02` and `grade10-admin-auction-payment-settings-SC-05`, asserted by `g10adm.auction-payment-settings.US1-TC1`, `US1-TC2` and `US1-TC5` |
| A minimum in HKD, JPY or a negative amount is refused and the stored value stays | **Added:** `US1-TC3` reads a negative amount and EUR, and the scenario names HKD, the currency this change retires. `g10adm.auction-payment-settings.US1-TC6` reads the HKD and JPY rows; both link `grade10-admin-auction-payment-settings-SC-03` and between them assert it |
| An operator without payment processing cannot read or write the minimum | **Out of suite:** `grade10-admin-auction-payment-settings-SC-04` - the durable `g10adm.auction-payment-settings.TC-7de` holds it, unchanged |
| Card rules are held for USD and HKD only; a JPY rule is refused with the stored rules unchanged | **Folded in:** `grade10-admin-auction-payment-settings-SC-13`, asserted by `g10adm.auction-payment-settings.US3-TC3`; `g10adm.auction-payment-settings.US3-TC1` reads that only USD and HKD show |
| USD and HKD rules are kept side by side | **Folded in:** `grade10-admin-auction-payment-settings-SC-14`, asserted by `g10adm.auction-payment-settings.US3-TC2`, with the no-JPY clause read by `g10adm.auction-payment-settings.US3-TC1` |
| A USD rule needs no HKD rule, and saving it offers card in USD | **Added:** QA1 read the withdrawal (`US3-TC4`) and not the offer. `g10adm.auction-payment-settings.US3-TC5` asserts `grade10-admin-auction-payment-settings-SC-15` and `grade10-admin-auction-payment-settings-SC-12` |
| No rule until Finance saves one, and a save replaces the rules whole | **Folded in:** `grade10-admin-auction-payment-settings-SC-06` and `grade10-admin-auction-payment-settings-SC-07`, asserted by `g10adm.auction-payment-settings.US2-TC1` |
| Clearing a currency's rule withdraws card there | **Fold candidate:** `g10adm.auction-payment-settings.US3-TC4` carries behaviour the requirement states ("only in a currency with a rule") and no scenario writes. Dev to fold it as a scenario, or the case stays unlinked |
| Half a rule or an out-of-range percentage is refused; a rule grosses the subtotal up; the example shows its fee; staff cannot read or change the rules | **Out of suite:** `grade10-admin-auction-payment-settings-SC-08`, `grade10-admin-auction-payment-settings-SC-09`, `grade10-admin-auction-payment-settings-SC-10` and `grade10-admin-auction-payment-settings-SC-11` - the durable `g10adm.auction-payment-settings.TC-40o`, `TC-eng` and `TC-ape` hold them, and the rule is the same per currency. `grade10-admin-auction-payment-settings-SC-08` now names a USD half rule first and the durable case reads HKD rules; the equivalence is the same validation per currency |

**Uncovered anchors:** none for `grade10-admin-auction-payment-settings-US-01`, `grade10-admin-auction-payment-settings-US-02` or `grade10-admin-auction-payment-settings-US-03`.
