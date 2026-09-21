# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r1

## grade10-admin-auction-listing-US-08: Operator checks a listing's watchers

**As an** auction operator,
**I want** to see how many collectors watch a listing from its Stats dialog,
**so that** I can judge interest beside the bidder count without a second
surface for the same figure.

### grade10-admin-auction-listing-US-08-TC1-1: Stats counts watches across both brands

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
2. Open Stats for that listing.
3. Check the watchers figure.

**Expected Results:**

* Stats shows 3 watchers.
* No watcher is named.

### grade10-admin-auction-listing-US-08-TC2-1: An unwatched listing shows zero in Stats

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
A published listing with no watches. An authorized operator is on <grade10 auction admin listings url>.

**Steps:**

1. Open Stats for that listing.
2. Check the watchers figure.

**Expected Results:**

* Stats shows 0 watchers, not a blank or "-".

### grade10-admin-auction-listing-US-08-TC3-1: A closed listing keeps its watchers in Stats

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

1. Open Stats for the closed listing.
2. Check the watchers figure.

**Expected Results:**

* Stats shows 2 watchers.

### grade10-admin-auction-listing-US-08-TC4-1: The Listings table has no Watchers column

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
An authorized operator on <grade10 auction admin listings url>.

**Steps:**

1. Check the Listings table headings.

**Expected Results:**

* There is no Watchers column.

## Reconciliation

**Run:** Placement rewrite 2026-09-21 for change `add-listing-watchers-column` capability `grade10-admin/auction/listing`. Scope moved from a Listings-table column to the existing Stats dialog; suite rewritten against the revised journeys and feature set.

| Finding | Disposition |
| --- | --- |
| Stats shows cross-brand watch count | **Folded in:** `grade10-admin-auction-listing-SC-81` |
| Unwatched listing shows 0 in Stats | **Folded in:** `grade10-admin-auction-listing-SC-82` |
| Closed listing keeps watchers in Stats | **Folded in:** `grade10-admin-auction-listing-SC-83` |
| Listings table has no Watchers column | **Folded in:** `grade10-admin-auction-listing-SC-86` |
| Draft listing shows watchers on the table | **Rejected:** Stats is not offered on draft/created rows; table no longer carries the count |

**Uncovered anchors:** none for `grade10-admin-auction-listing-US-08` under this change's feature set.
