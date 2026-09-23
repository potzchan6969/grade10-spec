# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-23, tcs-rules r3.0

## grade10-admin-auction-listing-US2: Operator puts a gallery on a listing

**As an** auction operator,
**I want** to choose product media, add listing-only photographs and video, and order them together,
**so that** a collector judges the item from a complete gallery.

### grade10-admin-auction-listing-US2-TC1-1: Listing saves mixed media from its selected product

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**

* An admin(auction operator) edits a listing whose selected product has reusable media.

**Steps:**

1. Select product media, add a direct upload, interleave their order, and save.
2. Change the source product gallery and reopen the listing.

**Expected Results:**

* The listing retains one ordered mixed gallery.
* Later product-gallery changes do not alter the saved listing.

## Settled

- Asset selection uses existing listing-edit authorization; unauthorized requests are refused.

## Reconciliation

**Run:** Blind pass read the listing outline, journey, decisions, and marked PRD; it was denied requirements and scenarios.

- **Raised, folded into spec:** selected-product filtering, mixed ordering, combined bounds, Save-time availability, and snapshot stability are covered by `grade10-admin-auction-listing-SC-87` through `SC-92`.
