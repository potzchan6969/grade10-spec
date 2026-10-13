# shared/ui/auction-order Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** shared-ui-auction-order-SC-15, shared-ui-auction-order-SC-16, shared-ui-auction-order-SC-17, shared-ui-auction-order-SC-19, shared-ui-auction-order-SC-20

## g10.shared-auction-order.US1: Address form component contract

**Walked by:** nobody on their own - a component contract; the order detail and the address form are walked through `grade10-site/auction/winner-order`, which composes the blocks

**As a** customer,
**I want** the shared blocks to render what the application supplies,
**so that** Winner Order composes one contract instead of drawing its own.

<!-- trace:case id=g10.shared-auction-order.TC-2fz rev=1 covers=g10.shared-auction-order.SC-cdc -->
### g10.shared-auction-order.US1-TC23: Setup offers USD and HKD without a selection

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its setup form and no settlement currency chosen.

**Steps:**

1. Read the settlement currency choices and selected value.

**Expected Results:**

* The form offers USD and HKD only.
* Neither currency is selected.

<!-- trace:case id=g10.shared-auction-order.TC-3cr rev=1 covers=g10.shared-auction-order.SC-8j6 -->
### g10.shared-auction-order.US1-TC24: Winner currency choice calls the supplied callback

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with no currency chosen and a spy on its currency callback.

**Test data:**

| Settlement currency |
| --- |
| USD |
| HKD |

**Steps:**

1. Choose the row's settlement currency.
2. Read the spy.

**Expected Results:**

* The row's choice reads selected.
* The callback is called once with the row's currency.

<!-- trace:case id=g10.shared-auction-order.TC-giz rev=1 covers=g10.shared-auction-order.SC-7if -->
### g10.shared-auction-order.US1-TC25: Payment methods follow the selected currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` receives different payment methods for USD and HKD.

**Test data:**

| Settlement currency | Supplied methods | Expected choices |
| --- | --- | --- |
| USD | card, hk_local and swift | Card, HK Local and SWIFT; no FPS |
| HKD | card, fps and hk_local | Card, FPS and HK Local; no SWIFT |

**Steps:**

1. Choose the row's currency.
2. Read the payment method choices.

**Expected Results:**

* Only the row's expected choices appear, as separate choices.

<!-- trace:case id=g10.shared-auction-order.TC-kiy rev=1 covers=g10.shared-auction-order.SC-7if -->
### g10.shared-auction-order.US1-TC26: Each bank rail is its own choice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with HKD selected and two HKD bank rails supplied.

**Steps:**

1. Read the payment method choices.
2. Choose the second bank rail.

**Expected Results:**

* Each rail appears as a separate choice.
* The second rail reads selected.

<!-- trace:case id=g10.shared-auction-order.TC-bu1 rev=3 covers=g10.shared-auction-order.SC-z03,g10.shared-auction-order.SC-m7x -->
### g10.shared-auction-order.US1-TC27: HKD summary keeps USD lines and orders both totals

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered for an HKD order with USD line items and totals.

**Test data:**

| Field | Value |
| --- | --- |
| USD line items | 10100, 2020 and 1001 minor units |
| USD total | 13121 minor units |
| HKD total | 103100 minor units |
| HKD card fee | 3873 minor units |

**Steps:**

1. Read the line items and totals from top to bottom.

**Expected Results:**

* The three line items remain in USD.
* Order Total shows 13121 minor units in USD, then 103100 minor units in HKD.
* The fee reads 3873 minor units in HKD after the separator, below both totals.
* Neither total includes the fee.

<!-- trace:case id=g10.shared-auction-order.TC-p6m rev=2 covers=g10.shared-auction-order.SC-hc5 -->
### g10.shared-auction-order.US1-TC28: Bank details show only the supplied rail

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` receives details for the row's selected bank rail.

**Test data:**

| Selected rail |
| --- |
| FPS |
| HK Local |
| International via SWIFT |

**Steps:**

1. Choose View Bank Details.
2. Read the dialog.

**Expected Results:**

* One dialog shows only the selected rail's details and reference.
* No rail tabs or copy controls appear.

<!-- trace:case id=g10.shared-auction-order.TC-62a rev=1 covers=g10.shared-auction-order.SC-pd1 -->
### g10.shared-auction-order.US1-TC29: No method appears before currency selection

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` receives USD and HKD methods with no currency chosen.

**Steps:**

1. Read the payment method choices and selected value.

**Expected Results:**

* No payment method appears or is selected.

<!-- trace:case id=g10.shared-auction-order.TC-pm2 rev=1 covers=g10.shared-auction-order.SC-nxj -->
### g10.shared-auction-order.US1-TC30: A payment method supplied as unavailable shows its text and cannot be chosen
**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its setup form and USD chosen.
* The USD card choice is supplied with an unavailable text, with a spy on the payment method callback.

**Steps:**

1. Read the card choice.
2. Try to choose the card choice.
3. Read the spy.

**Expected Results:**

* The card choice shows the unavailable text it was supplied.
* The card choice cannot be chosen.
* The payment method callback is not called.

<!-- trace:case id=g10.shared-auction-order.TC-y6r rev=1 covers=g10.shared-auction-order.SC-bzz -->
### g10.shared-auction-order.US1-TC31: Parent clears a method absent from new currency

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* The setup form is rendered with USD selected and a selected USD bank rail that HKD does not offer.

**Steps:**

1. Read the selected method.
2. Switch to HKD.
3. Read the method choices and selected value.

**Expected Results:**

* The USD bank rail is cleared when HKD is supplied with no selected method.
* No HKD method is selected.

<!-- trace:case id=g10.shared-auction-order.TC-mvr rev=1 covers=g10.shared-auction-order.SC-k6i -->
### g10.shared-auction-order.US1-TC32: Summary shows one total when conversion is absent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* The summary receives a USD total and no converted total.

**Steps:**

1. Read the summary totals.

**Expected Results:**

* One USD Order Total appears.
* No amount is derived or converted by the block.

<!-- trace:case id=g10.shared-auction-order.TC-9r5 rev=1 covers=g10.shared-auction-order.SC-8eq -->
### g10.shared-auction-order.US1-TC33: Order detail omits controls it was not given

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* The order summary receives no invoice PDF and no pay control.

**Steps:**

1. Read the order summary and look for an invoice link or pay control.

**Expected Results:**

* The summary shows its supplied lines.
* No invoice link or pay control appears.

## Settled

- None this run. The blind reading raised nothing that needed an answer here; the one contract question went to `decisions.md` `## Raised` and landed as Q26.

## Reconciliation

See `openspec/changes/usd-lot-currency-winner-settlement-choice/qa2-site-shared.md` for this QA2 run’s full case and scenario dispositions, coverage limits, and remaining unchanged gap.
