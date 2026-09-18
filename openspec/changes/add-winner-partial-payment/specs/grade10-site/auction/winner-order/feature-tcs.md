# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## winner-order-US12: Winner waits out a partial payment an operator is collecting

**As a** winner whose invoice an operator has started collecting in parts,
**I want** a locked order with Contact Us and a receipt for every payment,
**so that** I have proof of what I paid without tracking a running balance.

### winner-order-US12-TC1-1: The partially paid order is locked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner of `<partially-paid order>`) is on Winner Order.

**Steps:**

1. Read the payment step, settlement alert and receipt area.

**Expected Results:**

* The page reads Partially Paid.
* Pay and a payment deadline are absent.
* The page offers Contact Us and no running balance.
* Each recorded payment has a separate receipt link, oldest first.

## winner-order-US01: Winner settles a won lot

**As a** winner,
**I want** the existing full-payment path to remain available before an operator records a partial payment,
**so that** a normal auction order is unchanged.

**Out of suite:** existing full-payment coverage in the durable Winner Order feature suite.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| The winner sees receipts without a second order or deadline | **Folded in:** `winner-order-SC-139` |
