# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r1

## grade10-admin-auction-listing-US8: Operator compares interest across listings

**As an** auction operator,
**I want** to see how many collectors watch each listing from the Listings table,
**so that** I can tell which lots draw interest without opening each one.

### grade10-admin-auction-listing-US8-TC1-1: Listings table counts watches across both brands

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Pre-conditions:**
A published listing watched by two collectors on Grade10 and one collector on ZZZ. An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Check the Watchers column for that listing's row.

**Expected Results:**

* The row shows 3.
* No watcher is named.

### grade10-admin-auction-listing-US8-TC2-1: A draft nobody watches shows zero

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Pre-conditions:**
A draft listing with no watches. An authorized operator is on <grade10 auction admin listings url>.

**Steps:**

1. Check the Watchers column for the draft's row.

**Expected Results:**

* The row shows 0, not a blank or "-".

### grade10-admin-auction-listing-US8-TC3-1: A closed listing keeps its watchers

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Pre-conditions:**
A closed listing still watched by two collectors. An authorized operator is on <grade10 auction admin listings url>.

**Steps:**

1. Check the Watchers column for the closed listing's row.

**Expected Results:**

* The row shows 2.
