# grade10-site/auction/listing-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

## grade10-site-auction-listing-page-US3: Collector opens an address that names no lot

**As a** collector,
**I want** an address under the auction's lots that names no published lot to
answer with the site's not-found surface,
**so that** I am never shown an empty lot page or the catalogue in its place.

### grade10-site-auction-listing-page-US3-TC3-1: Hidden lot's address answers not found

Runs once per row of **Test data**.

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

* `<lot>` was once published and is now in the state the row names.

**Test data:**

| `<lot>` |
| --- |
| A lot that closed with no winner |
| A lot an operator called off |

**Steps:**

1. Fetch `<lot>`'s address with no script executing.
2. Open `<lot>`'s address in the browser.

**Expected Results:**

* Step 1 answers with status 404.
* Step 2 shows the site's not-found surface, not the lot and not the catalogue.
