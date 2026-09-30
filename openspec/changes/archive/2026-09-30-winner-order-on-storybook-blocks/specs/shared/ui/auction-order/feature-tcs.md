# shared/ui/auction-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r4

**Out of suite:** shared-ui-auction-order-SC-01 to SC-04 are covered by the block's stories and the public exports test.

## shared-ui-auction-order-US1: Address form component contract

**Walked by:** nobody on their own — a component contract; the Winner Order page body is walked through `grade10-site/auction/winner-order`, which composes the block

**As a** customer,
**I want** the shared address form to collect personal or company addresses with a country-aware phone,
**so that** Winner Order setup can confirm delivery and billing through one contract.

<!-- trace:case id=g10.shared-auction-order.TC-1f8 rev=1 covers=g10.shared-auction-order.SC-qy4 -->
### shared-ui-auction-order-US1-TC21-1: The current step decides every step's state

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

* `AuctionWinnerOrder` is rendered with Payment as the current step.

**Steps:**

1. Read the five steps.

**Expected Results:**

* Address and Invoice read complete.
* Payment reads current.
* Shipping and Completed read upcoming.

<!-- trace:case id=g10.shared-auction-order.TC-fjf rev=1 covers=g10.shared-auction-order.SC-ofq -->
### shared-ui-auction-order-US1-TC22-1: A press is reported, never acted on

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

* `AuctionWinnerOrder` is rendered with a pay control and a spy on its callback.

**Steps:**

1. Choose the pay control.

**Expected Results:**

* The pay callback is called once.
* No network request is made.

## Reconciliation

| Scenario | Case | Finding |
| --- | --- | --- |
| shared-ui-auction-order-SC-13 | shared-ui-auction-order-US1-TC21-1 | Agree |
| shared-ui-auction-order-SC-14 | shared-ui-auction-order-US1-TC22-1 | Agree |
