# grade10-site/auction/account-record Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## grade10-site-auction-account-record-US3: Follow a listing I won through to delivery

**As a** winner,
**I want** a paid, undispatched Won row to read Preparing Shipment,
**so that** My Auctions matches Winner Order without implying the lot shipped.

<!-- trace:case id=g10.auction-account-record.TC-lvl rev=1 covers=g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb -->
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
* Status badge uses `default`.

### grade10-site-auction-account-record-US3-TC23-1: Shipped Won row keeps the default badge

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

* customer(winner) is on My Auctions with <won_shipped>.

**Test data:**

| Field | Value |
| --- | --- |
| <won_shipped> | A won listing with invoice `paid`, fulfilment `fulfilled`, and no delivery confirmation |

**Steps:**

1. Read Status on that row.

**Expected result:**

* Status reads Shipped.
* Status badge uses `default`.

## Reconciliation

**Run:** 2026-10-07, QA2 for `clarify-auction-shipping-progress-copy`, appended to the durable reconciliation; earlier runs stand.

- **Covered:** `grade10-site-auction-account-record-SC-20` ← `US3-TC20-1`.
- **Covered:** `grade10-site-auction-account-record-SC-23` ← `US3-TC23-1`.
- **Raised:** none.
