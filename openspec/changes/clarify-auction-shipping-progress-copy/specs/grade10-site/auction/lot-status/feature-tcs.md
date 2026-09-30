# grade10-site/auction/lot-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## grade10-site-auction-lot-status-US1: Collector sees whether a lot can still be bid on

**As a** collector,
**I want** a closed lot with a Preparing Shipment order to still read Ended,
**so that** the lot status stays separate from the winner's order status.

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

- **Covered:** mapping Preparing Shipment → Ended under
  `grade10-site-auction-lot-status-SC-01`'s requirement ← `US1-TC1-1`.
- **Raised:** none.
