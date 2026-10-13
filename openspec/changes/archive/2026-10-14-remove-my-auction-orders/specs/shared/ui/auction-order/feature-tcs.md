# shared/ui/auction-order Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-12, tcs-rules r4

## g10.shared-auction-order.US1: Address form component contract

**Walked by:** nobody on their own — a component contract; the order detail is walked through `grade10-site/auction/winner-order`, which composes the block

**As a** customer,
**I want** the shared blocks to render what the application supplies,
**so that** Winner Order composes one contract instead of drawing its own.

<!-- trace:case id=g10.shared-auction-order.TC-1f8 rev=2 covers=g10.shared-auction-order.SC-i3e -->
### g10.shared-auction-order.US1-TC21: The current step decides every step's state

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

<!-- trace:case id=g10.shared-auction-order.TC-fjf rev=2 covers=g10.shared-auction-order.SC-qb6 -->
### g10.shared-auction-order.US1-TC22: A press is reported, never acted on

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

**Run:** removal reconciliation, 2026-10-12, for `remove-my-auction-orders`, `shared/ui/auction-order`. The exports requirement is removed and restated as "The winner-order surface exports" with fresh scenario ids; `TC-1f8` and `TC-fjf` move `covers` from the retired `g10.shared-auction-order.SC-qy4`/`SC-ofq` to `SC-i3e`/`SC-qb6` at rev 2. Every other case stays — none names the list, row or empty blocks.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-ui-auction-order-SC-01` to `SC-04`, `SC-13`, `SC-14` | Retired with their requirement | Restated as `SC-15` to `SC-20` under "The winner-order surface exports"; `SC-02`'s row assertion becomes the non-export check `SC-16` |
| `g10.shared-auction-order.TC-1f8`, `TC-fjf` | Kept, re-linked | Same steps and results; `covers` moves to the restated scenarios |
| The list, row and empty blocks | No case | No durable case covered them; the public-exports test and task 1.1's expectation cover the removal |
