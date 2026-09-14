# grade10-site/store/product-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-product-page-US10: Collector opens Store Locator from free pick-up

**As a** collector,
**I want** free pick-up at Hong Kong Grade10 Store on a product page to open
Store Locator,
**so that** I see the same shop's address and hours before I choose pickup.

### grade10-site-store-product-page-US10-TC1-1: Free pick-up store name opens Store Locator

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-10

**Pre-conditions:**

* The site answers a product page that shows free pick-up at Hong Kong Grade10 Store.
* The site answers Store Locator.

**Steps:**

1. Navigate to <grade10 product url> for a product showing free pick-up.
2. Activate the Hong Kong Grade10 Store name in the free pick-up claim.
3. Check the destination.

**Expected Results:**

* Store Locator renders.
* Location & Hours for Hong Kong Grade10 Store is visible.

---

**Out of suite:** none for this change's product-page journey — SC-25 is covered.
Existing product-page journeys and suites remain on the durable capability and
on `redesign-store-product-detail-page`.
