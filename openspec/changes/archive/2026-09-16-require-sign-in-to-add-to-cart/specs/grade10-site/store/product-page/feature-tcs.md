# grade10-site/store/product-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-product-page-US11: Collector signs in to add from the product page

**As a** signed-out collector on a product page,
**I want** Add to cart to open sign-in instead of building a guest cart,
**so that** I only hold lines I can take to members-only checkout.

### grade10-site-store-product-page-US11-TC1-1: Signed-out Add to cart opens sign-in

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
* **Trace:** grade10-site-store-product-page-US-11

**Pre-conditions:**

* customer is signed out and is on <grade10 product url> that offers Add to cart.
* The product is not sold out.

**Steps:**

1. Note the cart line count for that product.
2. Activate Add to cart.
3. Check the dialog and the cart.

**Expected Results:**

* The sign-in dialog opens over the product page.
* No cart gains a line for that product.

### grade10-site-store-product-page-US11-TC2-1: Dismissing sign-in adds nothing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-11

**Pre-conditions:**

* customer is signed out and is on <grade10 product url>.
* Sign-in was opened from Add to cart on that page.

**Steps:**

1. Note the cart line count for that product.
2. Dismiss the sign-in dialog without signing in.
3. Check the session and the cart.

**Expected Results:**

* customer remains signed out on the product page.
* The cart is unchanged for that product.

### grade10-site-store-product-page-US11-TC3-1: Sign-in on the product page completes the add

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
* **Trace:** grade10-site-store-product-page-US-11

**Pre-conditions:**

* customer is signed out and is on <grade10 product url>.
* Sign-in was opened from Add to cart for the chosen variant at quantity <qty_1>.
* Sign-in can complete without leaving the product page.

**Test data:**

| Field | Value |
| --- | --- |
| <qty_1> | 1 |

**Steps:**

1. Complete sign-in successfully while remaining on the product page.
2. Check the sign-in dialog and the cart.

**Expected Results:**

* The sign-in dialog is closed.
* The signed-in member cart holds that variant at <qty_1>.

---

**Out of suite:** none for this change's product-page journey — SC-26, SC-27,
and SC-28 are covered. Existing product-page journeys remain on the durable
capability and sibling product-page changes.
