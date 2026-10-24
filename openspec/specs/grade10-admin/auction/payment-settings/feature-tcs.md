# grade10-admin/auction/payment-settings Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* Payment settings is a tab under `/auction` in the admin. A finance operator holds `auction:payment`; a staff operator's roles are exactly `staff`.
* A card fee rule is a percentage and a fixed amount; Grade10 grosses the subtotal up by it, so the fee on a subtotal S is (S + fixed) / (1 − percentage) − S.

## Walk 1: Finance sets the premium minimum and the card rules

Starting state:

- No premium minimum and no card rule has been saved.
- customer(winner) holds a USD auction order in Awaiting Setup, whose payment choice reads card not yet available in USD.
- admin(finance) is on Payment settings.

### Route

1. Read the tab.
   - One USD premium minimum reading USD0.00, and empty USD and HKD card rules; no HKD or JPY minimum and no JPY rule. `g10adm.auction-payment-settings.US1-TC1`
2. Type 5.00 as the USD minimum, Save and reload.
   - The minimum reads USD5.00. `g10adm.auction-payment-settings.US1-TC2`
3. Type an HKD rule of 3.4% and 2.35, and read the example.
   - The example reads a fee of HKD37.63 on HKD1,000.00. `g10adm.auction-payment-settings.US2-TC2`
4. Type a USD rule of 4.4% and 0.30, Save and reload.
   - USD reads 4.4% and USD0.30, HKD 3.4% and HKD2.35. `g10adm.auction-payment-settings.US3-TC2`
5. As the winner, reload the order's payment choice.
   - Card is offered. `g10adm.auction-payment-settings.US2-TC5`

## g10adm.auction-payment-settings.US1: Operator maintains the auction premium minimums

**As a** auction operator with payment processing,
**I want** one place under `/auction` to review and update the minimum buyer premium for each auction currency,
**so that** invoice amounts follow the configured policy.

<!-- trace:case id=g10adm.auction-payment-settings.TC-q43 rev=2 -->
### g10adm.auction-payment-settings.US1-TC1: The tab opens on one USD premium minimum of zero

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* No premium minimum has been saved; admin(finance) is on Payment settings.

**Steps:**

1. Read the premium minimum.

**Expected Results:**

* One USD minimum reads USD0.00; no HKD or JPY minimum shows.

<!-- trace:case id=g10adm.auction-payment-settings.TC-nzx rev=2 -->
### g10adm.auction-payment-settings.US1-TC2: A USD minimum saves in dollars, zero included, with who saved it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* The saved USD minimum is `<before>`; admin(finance) is on Payment settings.

**Test data:**

| `<before>` | `<typed>` | `<reads>` |
| --- | --- | --- |
| USD0.00 | 1.00 | USD1.00 |
| USD0.00 | 5.00 | USD5.00 |
| USD5.00 | 0 | USD0.00 |

**Steps:**

1. Type `<typed>` as the USD minimum and Save.
2. Reload the tab.

**Expected Results:**

* Step 1 is accepted; step 2 reads `<reads>`, with this operator and the time it was saved.

<!-- trace:case id=g10adm.auction-payment-settings.TC-s5q rev=2 -->
### g10adm.auction-payment-settings.US1-TC3: A negative minimum is refused and changes nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* The saved USD minimum is USD0.00; admin(finance) is on Payment settings.

**Steps:**

1. Type -1 as the USD minimum and Save.
2. Reload the tab.

**Expected Results:**

* Step 1 is refused, saying the amount cannot be negative.
* Step 2 reads USD0.00.

<!-- trace:case id=g10adm.auction-payment-settings.TC-7de rev=2 covers=g10adm.auction-payment-settings.SC-erw,g10adm.auction-payment-settings.SC-veg,g10adm.auction-payment-settings.SC-ieg,g10adm.auction-payment-settings.SC-s8d -->
### g10adm.auction-payment-settings.US1-TC4: A staff operator cannot reach Payment settings

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* The saved USD minimum is USD5.00 and the HKD card rule 3.4% and HKD2.35; admin(staff) is signed in.

**Steps:**

1. Open `/auction` and look for Payment settings.
2. Open Payment settings' address directly.

**Expected Results:**

* Step 1 offers no Payment settings tab.
* Step 2 refuses access and shows neither the minimum nor a card rule.

---

## g10adm.auction-payment-settings.US2: Finance keeps the Stripe card fee rule

**As a** finance operator,
**I want** to set, per currency, the card rule that prices a card invoice's processing fee,
**so that** a card invoice's fee always covers what Stripe takes, without an operator working it out by hand.

<!-- trace:case id=g10adm.auction-payment-settings.TC-df4 rev=2 -->
### g10adm.auction-payment-settings.US2-TC1: No card rule shows until Finance saves one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-02

**Pre-conditions:**

* No card rule has been saved; admin(finance) is on Payment settings.

**Steps:**

1. Read the card rules.
2. Set HKD to 3.4% and 2.35, leave USD empty, Save and reload.

**Expected Results:**

* Step 1: USD and HKD each show no rule.
* Step 2: HKD reads 3.4% and HKD2.35 with this operator and the time; USD shows no rule.

<!-- trace:case id=g10adm.auction-payment-settings.TC-eng rev=1 covers=g10adm.auction-payment-settings.SC-pzf,g10adm.auction-payment-settings.SC-cac,g10adm.auction-payment-settings.SC-5h3,g10adm.auction-payment-settings.SC-su9,g10adm.auction-payment-settings.SC-lon,g10adm.auction-payment-settings.SC-g3v -->
### g10adm.auction-payment-settings.US2-TC2: A rule shows its fee on an example subtotal and prices a card invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-02

**Pre-conditions:**

* No card rule has been saved; an HKD card order is in Preparing Invoice, with a subtotal of HKD3,120 once Shipping & Handling and Insurance are entered.
* admin(finance) is on Payment settings.

**Steps:**

1. Type an HKD rule of 3.4% and 2.35, and read the example beside it.
2. Save.
3. Open Send invoice on the order, enter the amounts, and read the fee.

**Expected Results:**

* Step 1 reads a fee of HKD37.63 on a subtotal of HKD1,000.00.
* Step 3 reads a fee of HKD112.25 and a total of HKD3,232.25, read-only beside the HKD rule it came from.

<!-- trace:case id=g10adm.auction-payment-settings.TC-40o rev=1 covers=g10adm.auction-payment-settings.SC-pzf,g10adm.auction-payment-settings.SC-cac,g10adm.auction-payment-settings.SC-5h3,g10adm.auction-payment-settings.SC-su9,g10adm.auction-payment-settings.SC-lon,g10adm.auction-payment-settings.SC-g3v -->
### g10adm.auction-payment-settings.US2-TC3: Half a rule or a percentage out of range is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-02

**Pre-conditions:**

* The HKD card rule is 3.4% and HKD2.35, and no USD rule is saved; admin(finance) is on Payment settings.

**Test data:**

| `<rule>` |
| --- |
| USD 4.4% with no fixed amount |
| HKD 3.405% and 2.35 |
| HKD 100% and 0.00 |

**Steps:**

1. Type `<rule>` and Save.
2. Reload the tab.

**Expected Results:**

* Step 1 is refused, saying which value is wrong.
* Step 2 still reads HKD 3.4% and HKD2.35, and no USD rule.

<!-- trace:case id=g10adm.auction-payment-settings.TC-6it rev=1 covers=g10adm.auction-payment-settings.SC-qak -->
### g10adm.auction-payment-settings.US2-TC5: Saving a card rule offers card in that currency

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-auction-payment-settings-US-02

**Pre-conditions:**

* No USD card rule is saved; customer(winner) holds a USD auction order in Awaiting Setup, whose payment choice reads card not yet available in USD.
* admin(finance) is on Payment settings.

**Steps:**

1. As admin, set USD to 4.4% and 0.30, and Save.
2. As the winner, reload the order's payment choice.

**Expected Results:**

* Step 2 offers card, and no longer reads not yet available.

---

## g10adm.auction-payment-settings.US3: Finance keeps one card rule per settlement currency

**As a** finance operator,
**I want** a card fee rule for USD and one for HKD, and nothing for a currency no winner can pick,
**so that** a winner who settles in either currency can pay by card at a fee that covers what Stripe takes.

<!-- trace:case id=g10adm.auction-payment-settings.TC-lto rev=1 -->
### g10adm.auction-payment-settings.US3-TC1: Card rules are offered for USD and HKD, and no other currency

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-03

**Pre-conditions:**

* No card rule has been saved; admin(finance) is on Payment settings.

**Steps:**

1. Read the card rules.

**Expected Results:**

* A USD rule and an HKD rule show, each empty; no JPY or other currency shows.

<!-- trace:case id=g10adm.auction-payment-settings.TC-xsy rev=1 -->
### g10adm.auction-payment-settings.US3-TC2: The USD and HKD rules save apart, either without the other

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-03

**Pre-conditions:**

* No card rule has been saved; admin(finance) is on Payment settings.

**Test data:**

| `<usd>` | `<hkd>` |
| --- | --- |
| 4.4% and 0.30 | 3.4% and 2.35 |
| 4.4% and 0.30 | empty |

**Steps:**

1. Set USD to `<usd>` and HKD to `<hkd>`, Save and reload.

**Expected Results:**

* USD reads `<usd>` in USD, and HKD reads `<hkd>` in HKD or no rule; neither overwrites the other.

<!-- trace:case id=g10adm.auction-payment-settings.TC-c9t rev=1 -->
### g10adm.auction-payment-settings.US3-TC4: Clearing a currency's rule withdraws card there

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-auction-payment-settings-US-03

**Pre-conditions:**

* The USD card rule is 4.4% and USD0.30; customer(winner) holds a USD auction order in Awaiting Setup, whose payment choice offers card.
* admin(finance) is on Payment settings.

**Steps:**

1. As admin, clear the USD rule and Save.
2. As the winner, reload the order's payment choice.

**Expected Results:**

* Step 2 reads card not yet available in USD.

---

## Settled

- One fixed 20% premium rate; one USD premium minimum, zero or more, edited under `/auction`.
