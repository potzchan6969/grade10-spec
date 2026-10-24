# shared/ui/auction-record Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## g10.shared-auction-record.US1: Content ownership

**As an** application,
**I want** the shared record surface to render supplied status copy,
**so that** order-state vocabulary stays owned by the application.

<!-- trace:case id=g10.shared-auction-record.TC-6rs rev=1 covers=g10.shared-auction-record.SC-bab,g10.shared-auction-record.SC-jun,g10.shared-auction-record.SC-tft,g10.shared-auction-record.SC-xe3,g10.shared-auction-record.SC-rup -->
### g10.shared-auction-record.US1-TC1: My Auctions names the mixed standing and order column Status

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Content ownership

**Pre-conditions:**

* customer(signed in) leads an open lot and won a closed lot whose order is open.

**Steps:**

1. Open My Auctions and read the table's column headers.

**Expected Results:**

* The column holding Leading beside the won lot's order status is headed Status, never Your Standing.
