# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-product-listing-US12: Collector signs in to add from the listing

**As a** signed-out collector on the browse listing,
**I want** Add to cart to open sign-in instead of building a guest cart,
**so that** I only hold lines I can take to members-only checkout.

### grade10-site-store-product-listing-US12-TC1-1: Signed-out Add to cart opens sign-in

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
* **Trace:** grade10-site-store-product-listing-US-12

**Pre-conditions:**

* customer is signed out and is on <grade10 browse listing url>.
* <card_1> offers a cart control and is not sold out.

**Steps:**

1. Note the cart line count for <card_1>.
2. Activate Add to cart on <card_1>.
3. Check the dialog and the cart.

**Expected Results:**

* The sign-in dialog opens over the listing.
* No cart gains a line for <card_1>.

### grade10-site-store-product-listing-US12-TC2-1: Dismissing sign-in adds nothing

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
* **Trace:** grade10-site-store-product-listing-US-12

**Pre-conditions:**

* customer is signed out and is on <grade10 browse listing url>.
* Sign-in was opened from Add to cart on <card_1>.

**Steps:**

1. Note the cart line count for <card_1>.
2. Dismiss the sign-in dialog without signing in.
3. Check the session and the cart.

**Expected Results:**

* customer remains signed out on the listing.
* The cart is unchanged for <card_1>.

### grade10-site-store-product-listing-US12-TC3-1: Sign-in on the listing completes the add

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
* **Trace:** grade10-site-store-product-listing-US-12

**Pre-conditions:**

* customer is signed out and is on <grade10 browse listing url>.
* Sign-in was opened from Add to cart on <card_1> for quantity <qty_1>.
* Sign-in can complete without leaving the listing.

**Test data:**

| Field | Value |
| --- | --- |
| <qty_1> | 1 |

**Steps:**

1. Complete sign-in successfully while remaining on the listing.
2. Check the sign-in dialog and the cart.

**Expected Results:**

* The sign-in dialog is closed.
* The signed-in member cart holds <card_1> at <qty_1>.

---

**Out of suite:** none for this change's listing journey — SC-44, SC-45, and
SC-46 are covered. Existing listing journeys remain on the durable capability
and sibling listing changes.
