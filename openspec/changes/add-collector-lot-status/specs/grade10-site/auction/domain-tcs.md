# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

## grade10-site-auction-e2e-US11: Collector follows an old link to a hidden lot

**As a** collector,
**I want** a called-off lot to be gone everywhere,
**so that** a saved link or an old search never shows me a lot that was withdrawn.

### grade10-site-auction-e2e-US11-TC01-1: Called-off lot is removed from the catalogue and its link

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02, grade10-site-auction-listing-page-US-03

**Pre-conditions:**

* customer saved `<lot address>` while `<lot_1>` was published.
* An operator then called off `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A published lot that an operator called off |
| `<lot address>` | The address of `<lot_1>` |

**Steps:**

1. Navigate to <grade10 auction catalogue url>.
2. Search the catalogue for the title of `<lot_1>`.
3. Open `<lot address>`.

**Expected Results:**

* Step 2 does not find `<lot_1>`.
* Step 3 returns status 404 and shows the Page not found screen.
