# grade10-site/auction/listing-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

## grade10-site-auction-listing-page-US3: Collector opens an address that names no lot

**As a** collector,
**I want** an address with no published lot to show the Page not found screen,
**so that** I am never shown an empty lot page or the catalogue in its place.

### grade10-site-auction-listing-page-US3-TC3-1: Hidden lot's address shows Page not found

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03

**Pre-conditions:**

* `<lot>` was published, then called off.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot>` | A published lot that an operator called off |

**Steps:**

1. Fetch the address of `<lot>` with scripts turned off.
2. Open the address of `<lot>` in the browser.

**Expected Results:**

* Step 1 returns status 404.
* Step 2 shows the Page not found screen, not the lot and not the catalogue.
