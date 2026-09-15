# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-admin-auction-listing-US70: Operator attaches one inventory unit to a listing

**As an** auction operator,
**I want** to choose a specific Cert ID or `No Cert ID` for the product I am
listing,
**so that** the listing identifies the physical unit it will sell without
blocking unnumbered stock.

### grade10-admin-auction-listing-US70-TC1-1: Product picker offers explicit unit choices

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-70

**Pre-conditions:**

* An admin holds the auction operate grant.
* One created product has Cert IDs `PSA-123` and `BGS-456`.
* One created product has available stock and no Cert IDs.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Start a listing and select the numbered product.
3. Inspect the Cert ID choices.
4. Select the unnumbered product.
5. Select `No Cert ID` and save quantity three.

**Expected Results:**

* The numbered product offers `PSA-123`, `BGS-456`, and `No Cert ID`.
* The unnumbered product offers `No Cert ID`.
* The saved no-cert listing reserves three aggregate units and no Cert ID.

### grade10-admin-auction-listing-US70-TC2-1: Invalid unit choices are refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-70

**Pre-conditions:**

* An admin holds the auction operate grant.
* A draft listing has product A and Cert ID `PSA-123`.
* `PSA-123` belongs to product A and is held by another active listing.

**Steps:**

1. Open the draft listing.
2. Change the product to product B.
3. Try to save product B with product A's Cert ID.
4. Try to save a listing with the already-held `PSA-123`.
5. Try to create a listing with no explicit unit choice.

**Expected Results:**

* Changing products clears the prior Cert ID choice.
* The wrong-product and already-held choices are refused.
* A missing explicit choice is refused and the listing stays a draft.

---

## grade10-admin-auction-listing-US71: Operator creates and presents the selected unit

**As an** auction operator,
**I want** create to verify the inventory unit I saved and the listing to show
its configured identity,
**so that** a created lot cannot drift from the unit I intended to sell.

### grade10-admin-auction-listing-US71-TC1-1: Create preserves the selected inventory unit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-71

**Pre-conditions:**

* An admin holds the auction operate grant.
* A draft listing has product A, Cert ID `PSA-123`, quantity one, and a
  matching active inventory hold.
* The product schema displays Cert ID.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the draft listing.
3. Create the listing.
4. Open the published listing as a collector.

**Expected Results:**

* The listing becomes `created` without minting a second hold.
* `PSA-123` remains held by the listing.
* The public listing displays `PSA-123` in the configured position.

### grade10-admin-auction-listing-US71-TC2-1: No Cert ID stays hidden on the public listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-71

**Pre-conditions:**

* An admin holds the auction operate grant.
* A draft listing has a product, explicit `No Cert ID`, quantity three, and a
  matching active product-level hold.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Create the complete draft listing.
3. Open the listing as a collector.

**Expected Results:**

* The listing becomes `created`.
* No Cert ID is stored for the listing.
* No Cert ID row or product metadata fallback appears publicly.

