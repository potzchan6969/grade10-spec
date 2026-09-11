# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

## grade10-site-auction-e2e-US11: Collector follows an old link to a lot that cannot sell

**As a** collector,
**I want** a lot that was called off or did not sell to be gone wherever I look for it,
**so that** a saved link or an old search never shows me a lot nobody can buy.

### grade10-site-auction-e2e-US11-TC01-1: Called-off lot is gone from the catalogue and its link

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

* customer has `<lot address>` saved from when `<lot_1>` was published.
* An operator then called off `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A once-published lot an operator called off |
| `<lot address>` | `<lot_1>`'s own address |

**Steps:**

1. Navigate to <grade10 auction catalogue url>.
2. Search the catalogue for `<lot_1>`'s title.
3. Open `<lot address>`.

**Expected Results:**

* Step 2 finds no `<lot_1>`.
* Step 3 answers with status 404 and shows the site's not-found surface.
