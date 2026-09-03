# grade10-site/store/shopify-commerce Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-03, tcs-rules r1

## shopify-commerce-US1: Shopper browses the live Shopify catalogue

**As a** shopper,
**I want** the store catalogue to show current Shopify products and availability,
**so that** a product change is not served from a stale cache, and an outage does not invent a price.

### shopify-commerce-US1-TC1-1: Current catalogue shows live product facts

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shopify-commerce-US-01

**Pre-conditions:**
Shopify has a published product with a purchasable variant.

**Steps:**

1. Navigate to <grade10 store catalogue URL>.
2. Observe the product with its purchasable variant.

**Expected Results:**

* The catalogue response includes the product and its current variant price, currency, media, and availability.
* The response contains no Shopify credential or raw Admin API data.

### shopify-commerce-US1-TC2-1: Product changes leave no stale catalogue copy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-01

**Pre-conditions:**
A cached Store response contains a product.

**Steps:**

1. Deliver a verified Shopify product-change event for that product.
2. Request <grade10 store catalogue URL> again.

**Expected Results:**

* The later catalogue response does not serve the product from the invalidated cached response.

### shopify-commerce-US1-TC3-1: Catalogue outage reports an explicit failure

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shopify-commerce-US-01

**Pre-conditions:**
Shopify cannot answer the catalogue request, and no usable cached copy exists.

**Steps:**

1. Navigate to <grade10 store catalogue URL>.
2. Wait for the catalogue request to fail.

**Expected Results:**

* The Store reports an integration-unavailable outcome that identifies the failed read.
* The Store does not report invented availability or price.

---

## shopify-commerce-US2: Shopper checks out with a fifteen-minute hold

**As a** shopper,
**I want** checkout to use live price and inventory and hold finite stock for fifteen minutes,
**so that** an unavailable variant cannot enter, a retry is one handoff, and an expired hold cannot be paid as reserved.

### shopify-commerce-US2-TC1-1: Unavailable variant is refused at checkout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-02

**Pre-conditions:**
Browsing previously showed a variant available, but Shopify now reports it unavailable or insufficient for the requested quantity during checkout.

**Steps:**

1. Request checkout for the variant and quantity.
2. Inspect the checkout outcome.

**Expected Results:**

* The Store refuses checkout naming that item as unavailable.
* No payable local order or Shopify draft order is created.

### shopify-commerce-US2-TC2-1: Checkout uses Shopify's current price

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-02

**Pre-conditions:**
A shopper supplies a cached price for a variant, and Shopify returns a different current price during checkout.

**Steps:**

1. Submit checkout for the variant with the cached price.
2. Read the pending order.

**Expected Results:**

* The pending order uses Shopify's current price.
* The browser-supplied price has no effect.

### shopify-commerce-US2-TC3-1: Checkout retry returns one handoff

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-02

**Pre-conditions:**
The Store has accepted a checkout under an idempotency key.

**Steps:**

1. Retry checkout with the original idempotency key and identical input.
2. Compare the returned handoff with the original.

**Expected Results:**

* The Store returns the same pending order and Shopify checkout URL.
* Exactly one local order, Shopify draft order, and reservation exist for the request.

### shopify-commerce-US2-TC4-1: Finite stock stays held for fifteen minutes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-02

**Pre-conditions:**
A shopper requests a purchasable finite-stock Shopify variant.

**Steps:**

1. Accept checkout for the requested quantity.
2. Attempt another checkout for that quantity before fifteen minutes elapse.

**Expected Results:**

* Shopify reserves the requested quantity for fifteen minutes.
* That quantity is unavailable to another checkout for the reservation's lifetime.

### shopify-commerce-US2-TC5-1: Expired reservation is not recreated

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shopify-commerce-US-02

**Pre-conditions:**
A checkout reservation's fifteen-minute window has elapsed.

**Steps:**

1. Follow the Shopify checkout URL.
2. Observe the result when Shopify cannot sell the requested quantity.

**Expected Results:**

* The Store does not extend or recreate the reservation automatically.
* The buyer is told to begin checkout again and the unavailable item is identified.

### shopify-commerce-US2-TC6-1: Backorder is refused when stock cannot be held

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-02

**Pre-conditions:**
A shopper requests checkout with one or more items, and Shopify cannot reserve the requested quantity of one checkout line.

**Steps:**

1. Submit checkout for the requested items.
2. Inspect the checkout outcome.

**Expected Results:**

* The Store refuses checkout naming that item as unavailable.
* The Store does not offer a backorder, create a payable draft order, or create a replacement reservation.

### shopify-commerce-US2-TC7-1: Checkout handoff exposes only a Shopify URL

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-02

**Pre-conditions:**
The Store has accepted a checkout.

**Steps:**

1. Request the checkout handoff.
2. Inspect the returned URL and response fields.

**Expected Results:**

* The URL is Shopify-hosted.
* No Storefront or Admin credential, payment secret, or unvalidated external return URL is present in the response.

---

## shopify-commerce-US3: Shopper is signed in or linked after payment

**As a** shopper,
**I want** an existing Grade10 email to sign in before handoff, and a guest email to become an account after payment,
**so that** I am not duplicated and I can read the order through magic-link sign-in.

### shopify-commerce-US3-TC1-1: Existing customer signs in before handoff

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shopify-commerce-US-03

**Pre-conditions:**
A shopper begins checkout and supplies an email belonging to an existing Grade10 account.

**Steps:**

1. Submit the existing account email.
2. Observe the checkout handoff step.

**Expected Results:**

* The Store prompts Grade10 email magic-link sign-in before it creates a Shopify checkout handoff.
* No additional Grade10 account or Shopify customer link is created.

### shopify-commerce-US3-TC2-1: Guest payment creates one linked account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-03

**Pre-conditions:**
A guest checkout email belongs to no Grade10 account.

**Steps:**

1. Complete the Shopify checkout for the guest email.
2. Read the resulting Grade10 account association.
3. Use Grade10 email magic-link sign-in to access the order.

**Expected Results:**

* The Store creates or links exactly one Grade10 account to that Shopify customer.
* The buyer can access the order through Grade10 email magic-link sign-in.

### shopify-commerce-US3-TC3-1: Paid buyer returns to the protected order URL

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shopify-commerce-US-03

**Pre-conditions:**
A shopper completes a Shopify checkout with a Grade10 order, and Shopify confirms payment.

**Steps:**

1. Follow the post-payment return.
2. Observe the returned address and order page access.

**Expected Results:**

* The buyer is returned to that order's permanent Grade10 URL.
* The order page is available only through the matching Grade10 account.

### shopify-commerce-US3-TC4-1: Missing Shopify configuration fails loudly

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-03

**Pre-conditions:**
The Store attempts an operation requiring Shopify configuration, but a required credential or API-version setting is missing.

**Steps:**

1. Start the operation.
2. Inspect the failure outcome and its data source.

**Expected Results:**

* The affected Store operation fails loudly naming the missing setting.
* The Store does not silently use fixture data or another payment/shipping source outside an explicitly configured development environment.

---

## shopify-commerce-US4: Customer reads their own orders

**As a** signed-in customer,
**I want** to list my orders and open one by its permanent URL,
**so that** I cannot read another customer's order, and payment is shown apart from shipping.

### shopify-commerce-US4-TC1-1: Paid order stays separate from shipping

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shopify-commerce-US-04

**Pre-conditions:**
Shopify reports an order paid but with no fulfilment.

**Steps:**

1. Read the order as a customer or authorized administrator.
2. Observe payment and shipping states.

**Expected Results:**

* Payment is reported as paid and shipping as unfulfilled or not-ready.
* The order is not reported shipped or delivered.

### shopify-commerce-US4-TC2-1: Partial fulfilment shows every shipment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shopify-commerce-US-04

**Pre-conditions:**
Shopify reports two fulfilments for an order, one shipped with tracking and one unfulfilled.

**Steps:**

1. Read the order as a customer or authorized administrator.
2. Inspect the reported fulfilments and tracking facts.

**Expected Results:**

* Shipping is reported as partially fulfilled.
* Both fulfilments are exposed, and tracking facts are exposed only for the shipped fulfilment.

### shopify-commerce-US4-TC3-1: Unconfirmed delivery keeps the last shipment state

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shopify-commerce-US-04

**Pre-conditions:**
Shopify reports a tracked shipment without carrier delivery confirmation.

**Steps:**

1. Read the order.
2. Observe the shipment state and delivery state.

**Expected Results:**

* The shipment's last reported state is displayed.
* The order and shipment are not displayed as delivered.

### shopify-commerce-US4-TC4-1: Another customer's order is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-04

**Pre-conditions:**
A customer is signed in to Grade10 and an order belongs to another customer.

**Steps:**

1. Request the other customer's order.
2. Inspect the refusal response.

**Expected Results:**

* The Store refuses the request.
* The response contains no payment, shipping, tracking, or address information.

### shopify-commerce-US4-TC5-1: Permanent order URL prompts for its account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shopify-commerce-US-04

**Pre-conditions:**
A customer copies a permanent Grade10 order URL and no authenticated session for that order's Grade10 account exists.

**Steps:**

1. Open <permanent Grade10 order URL>.
2. Observe the access prompt and response data.

**Expected Results:**

* Grade10 prompts email magic-link sign-in.
* No order, payment, shipping, tracking, or address information is returned.

### shopify-commerce-US4-TC6-1: Order history lists only the account's orders

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shopify-commerce-US-04

**Pre-conditions:**
An authenticated customer has ongoing or past Grade10 orders.

**Steps:**

1. Open <grade10 order history URL>.
2. Observe the ongoing and past order lists.

**Expected Results:**

* The Store lists that account's ongoing and past orders.
* Every order belonging to another account is excluded.

### shopify-commerce-US4-TC7-1: Customer order view has no dispute action

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shopify-commerce-US-04

**Pre-conditions:**
A customer views an order in this release.

**Steps:**

1. Look for post-purchase actions.
2. Inspect the available actions.

**Expected Results:**

* The Store provides no action to submit a dispute or request a refund.

---

## shopify-commerce-US5: Staff refund is reflected without a customer-started dispute

**As a** staff operator,
**I want** a refund I take in Shopify to show on the Grade10 order,
**so that** a duplicate or invalid webhook cannot rewrite it, and a miss is repaired.

### shopify-commerce-US5-TC1-1: Invalid webhook changes no order state

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-05

**Pre-conditions:**
The Store receives a Shopify webhook request with a missing or invalid signature.

**Steps:**

1. Submit the webhook request.
2. Inspect the response and the order state.

**Expected Results:**

* The Store rejects the request before parsing its payload.
* No order, payment, or shipping state changes.

### shopify-commerce-US5-TC2-1: Duplicate webhook applies only once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-05

**Pre-conditions:**
The Store has already processed a verified Shopify event.

**Steps:**

1. Deliver the same Shopify event again.
2. Deliver it again after the duplicate response.
3. Inspect the recorded event and order transition.

**Expected Results:**

* The Store records and applies the event once.
* Every later delivery returns without repeating a transition.

### shopify-commerce-US5-TC3-1: Missed webhook is repaired from Shopify

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-05

**Pre-conditions:**
A pending Store order's Shopify order is paid and fulfilled, and its corresponding webhook was not processed.

**Steps:**

1. Read the order or run reconciliation.
2. Read the order again.

**Expected Results:**

* The Store updates the order from Shopify's payment and fulfilment facts.

### shopify-commerce-US5-TC4-1: Staff refund appears in payment status

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shopify-commerce-US-05

**Pre-conditions:**
Shopify confirms a refund initiated by staff for a paid order.

**Steps:**

1. Deliver the refund event or run reconciliation.
2. Read the order.

**Expected Results:**

* The Store reports the refund in that order's payment status.
