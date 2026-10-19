# grade10-site/auction/lot-status Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## grade10-site-auction-lot-status-US1: Collector sees whether a lot can still be bid on

**As a** collector,
**I want** a closed lot with a Preparing Shipment order to still read Ended,
**so that** the lot status stays separate from the winner's order status.

<!-- trace:case id=g10.auction-lot-status.TC-1ik rev=1 covers=g10.auction-lot-status.SC-wpp,g10.auction-lot-status.SC-orm,g10.auction-lot-status.SC-6aa,g10.auction-lot-status.SC-pmn,g10.auction-lot-status.SC-flh,g10.auction-lot-status.SC-eor,g10.auction-lot-status.SC-l6k -->
### grade10-site-auction-lot-status-US1-TC1-1: Preparing Shipment maps to Ended

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-01

**Pre-conditions:**

* A closed lot with a winner whose order derives as Preparing Shipment.

**Steps:**

1. Read external lot status.

**Expected result:**

* External lot status is Ended.

## Reconciliation

**Run:** 2026-10-07, QA2 for `clarify-auction-shipping-progress-copy`, appended to the durable reconciliation; earlier runs stand.

- **Covered:** mapping Preparing Shipment → Ended under
  `grade10-site-auction-lot-status-SC-04`'s requirement ← `US1-TC1-1`.
- **Raised:** none.
