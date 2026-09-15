# grade10-site/store/product-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-product-page-US12: Collector sees why sign-in is asked when adding from the product page

**As a** signed-out collector on a product page,
**I want** the sign-in dialog to say I am signing in to add to cart,
**so that** I know why the shop stopped the add.

### grade10-site-store-product-page-US12-TC1-1: Add to cart sign-in title names why

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
* **Trace:** grade10-site-store-product-page-US-12

**Pre-conditions:**

* customer is signed out and is on <grade10 product url> that offers Add to cart.
* The product is not sold out.

**Steps:**

1. Activate Add to cart.
2. Read the sign-in dialog title.

**Expected Results:**

* The dialog title is **Sign In to Add to Cart**.
