# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-product-listing-US13: Collector sees why sign-in is asked when adding from the listing

**As a** signed-out collector on the browse listing,
**I want** the sign-in dialog to say I am signing in to add to cart,
**so that** I know why the shop stopped the add.

### grade10-site-store-product-listing-US13-TC1-1: Add to cart sign-in title names why

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-13

**Pre-conditions:**

* customer is signed out and is on <grade10 browse listing url>.
* <card_1> offers a cart control and is not sold out.

**Steps:**

1. Activate Add to cart on <card_1>.
2. Read the sign-in dialog title.

**Expected Results:**

* The dialog title is **Sign In to Add to Cart**.
