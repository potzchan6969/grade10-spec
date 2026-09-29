# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-28, tcs-rules r4

## grade10-site-store-e2e-US6: Collector opens an owned order from Your Orders

**As a** signed-in collector,
**I want** to choose one of my Store orders and inspect its detail,
**so that** the order list and detail page preserve the same order and owner scope.

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
