# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## grade10-site-auction-account-record-US3: Follow a listing I won through to delivery

**As a** winner,
**I want** a paid, undispatched Won row to read Preparing Shipment,
**so that** My Auctions matches Winner Order without implying the lot shipped.

### grade10-site-auction-account-record-US3-TC20-1: Paid undispatched Won row reads Preparing Shipment

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(winner) is on My Auctions with <won_preparing_shipment>.

**Test data:**

| Field | Value |
| --- | --- |
| <won_preparing_shipment> | A won listing with invoice `paid` and fulfilment `unfulfilled` |

**Steps:**

1. Read Status on that row.

**Expected result:**

* Status reads Preparing Shipment.

## Reconciliation

- **Covered:** `grade10-site-auction-account-record-SC-20` ← `US3-TC20-1`.
- **Raised:** none.
