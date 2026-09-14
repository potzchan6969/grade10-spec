# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-product-listing-US4: Collector narrows the catalogue to what they collect

**As a** collector,
**I want** to narrow the listing by the world a card comes from and the kind of
collectible it is, and to see how many cards sit behind each choice before I
pick one,
**so that** I reach the cards I collect without reading past the ones I do not.

### grade10-site-store-product-listing-US4-TC7-1: A group keeps its live choices and drops its empty one

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**

* Catalogue names a facet group carrying two choices: one counted above zero,
  one counted at zero.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Check the group's choices in the filter panel.

**Expected Results:**

* Choice counted at zero is not offered.
* Choice counted above zero is still offered, with its count.

### grade10-site-store-product-listing-US4-TC8-1: A narrowing cannot resurrect a choice the catalogue never carries

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-04

**Pre-conditions:**

* Catalogue names a facet group carrying one choice it counts nothing behind
  over the whole unnarrowed catalogue, and one choice it counts something
  behind.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Select a choice of a different, unrelated facet group.
3. Check the first group's choices.

**Expected Results:**

* Choice the catalogue never carries stays left off the group.
* Choice the catalogue does carry something for is still offered, at
  whatever the narrowing now counts behind it.
