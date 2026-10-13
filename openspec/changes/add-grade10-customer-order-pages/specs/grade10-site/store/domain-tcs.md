# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-09-28, tcs-rules r4

## grade10-site-store-e2e-US6: Collector opens an owned order from Your Orders

**As a** signed-in collector,
**I want** to choose one of my Store orders and inspect its detail,
**so that** the order list and detail page preserve the same order and owner scope.

<!-- trace:case id=g10.store-domain.TC-3id rev=1 covers=g10.store-order-history.SC-u2y,g10.store-order-history.SC-zre,g10.store-order-history.SC-4i0,g10.store-order-history.SC-fun,g10.store-order-history.SC-yhz,g10.store-order-history.SC-3eo,g10.store-order-history.SC-71g,g10.store-order-history.SC-raj,g10.store-order-history.SC-ab2,g10.store-order-history.SC-dta,g10.store-order-history.SC-g9j,g10.store-order-detail.SC-d26,g10.store-order-detail.SC-a2p,g10.store-order-detail.SC-bjc,g10.store-order-detail.SC-0uc,g10.store-order-detail.SC-3mi,g10.store-order-detail.SC-6xb,g10.store-order-detail.SC-ik3,g10.store-order-detail.SC-7ci,g10.store-order-detail.SC-gbw,g10.store-order-detail.SC-cew,g10.store-order-detail.SC-ik7,g10.store-order-detail.SC-4bj,g10.store-order-detail.SC-xz6,g10.store-order-detail.SC-2ah,g10.store-order-detail.SC-4lu,g10.store-order-detail.SC-gzr -->
### grade10-site-store-e2e-US6-TC1-1: View Details preserves the selected order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01, grade10-site-store-order-detail-US-01

**Pre-conditions:**

* customer owns <order> and is signed in.
* <order> appears in the Active or Past group on Your Orders with its Store order id and customer-facing label.

**Test data:**

| Field | Value |
| --- | --- |
| <order> | An owned Store order with a stable Store id and supplied order facts |

**Steps:**

1. Navigate to `/profile/orders`.
2. Check <order>'s summary and customer-facing label.
3. Click View Details for <order>.
4. Check the order detail header and browser address.

**Expected Results:**

* Only <order> appears for the signed-in collector's selected row.
* The summary uses the supplied customer-facing label without replacing the Store id used by the action.
* Step 3 opens `/profile/orders/<order id>`.
* Step 4 shows the same order and does not disclose another order's facts.

## Reconciliation

**Run:** 2026-09-28. The domain reading joined the order-history and
order-detail journeys at their existing View Details handoff. It adds no new
Store read, status rule, or payment behaviour.

| Finding | Disposition |
| --- | --- |
| Your Orders must open the selected owned order detail with the same identity and owner scope | **Folded in:** US6-TC1-1 |
| No other cross-feature path is introduced by this change | **None raised** |
