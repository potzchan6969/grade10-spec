# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## grade10-site-auction-account-record-US8: Winner revisits a partially paid order

**As a** winner with an order being collected in parts,
**I want** My Auctions to keep the Won row linked to the order,
**so that** I can return to the locked payment record.

<!-- trace:case id=g10.auction-account-record.TC-hc2 rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ewb,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-xi1,g10.auction-account-record.SC-91a,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-fn7,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb,g10.auction-account-record.SC-2e8,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-5we,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-zid -->
### grade10-site-auction-account-record-US8-TC1-1: A partially paid Won row opens Winner Order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Pre-conditions:**

* customer owns a Won lot whose order is Partially Paid.

**Steps:**

1. Open My Auctions and read the Won row.
2. Select View order.

**Expected Results:**

* The row status is Partially Paid with its warning treatment.
* View order opens the Partially Paid Winner Order.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| The Won row remains linked while collection is partial | **Folded in:** `grade10-site-auction-account-record-SC-62` |
