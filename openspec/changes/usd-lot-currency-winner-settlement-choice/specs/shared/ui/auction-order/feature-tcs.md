# shared/ui/auction-order Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** shared-ui-auction-order-SC-15, shared-ui-auction-order-SC-16, shared-ui-auction-order-SC-17, shared-ui-auction-order-SC-19, shared-ui-auction-order-SC-20

## g10.shared-auction-order.US1: Address form component contract

**Walked by:** nobody on their own - a component contract; the order detail and the address form are walked through `grade10-site/auction/winner-order`, which composes the blocks

**As a** customer,
**I want** the shared blocks to render what the application supplies,
**so that** Winner Order composes one contract instead of drawing its own.

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

**Cases** - All 4 cases remain drafts. `TC-bu1@3` covers SC-z03 and SC-m7x; `TC-p6m@2` SC-hc5; `TC-mvr@1` SC-k6i; and `TC-9r5@1` SC-8eq. The settlement currency and payment method choice cases were retired with the choice itself.

**Scenario coverage** - Five of 10 scenarios are covered. `SC-xdd` and `SC-tm6` use the public-exports test; `SC-10a` uses durable `TC-g9u` and `TC-l1e`; `SC-i3e` uses durable `TC-1f8`; and `SC-qb6` uses durable `TC-fjf`. These scenarios describe unchanged behavior.
