# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-e2e-US1: Collector enters a collection and opens a product

**As a** collector,
**I want** to move from a collection on the Store front door to a product's
own page,
**so that** I can inspect the card I chose in the catalogue.

### grade10-site-store-e2e-US1-TC1-1: Collection tile leads to its product page

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-home-US-02, grade10-site-store-product-listing-US-02, grade10-site-store-product-page-US-02

**Pre-conditions:**

* <collection> is listed on the Store front door and holds <product>.
* <product> is listed in <collection>.

**Test data:**

| Field | Value |
| --- | --- |
| <collection> | A catalogue collection with at least one product |
| <product> | A product listed in <collection> |

**Steps:**

1. Navigate to <grade10 store url>.
2. Open the tile for <collection>.
3. Check the collection shown as the listing narrowing.
4. Open the card for <product>.

**Expected Results:**

* The Store front door renders with <collection> as a collection tile.
* The browse listing shows <collection> as the narrowing in force.
* Step 4 opens <product>'s own product page.

---

## grade10-site-store-e2e-US2: Collector buys a merchandised product from its page

**As a** collector,
**I want** to open a card from the Store front door and add my chosen variant,
**so that** I can buy without returning to the listing.

### grade10-site-store-e2e-US2-TC1-1: Merchandised card adds the chosen variant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-home-US-03, grade10-site-store-product-page-US-03

**Pre-conditions:**

* <product> is in the merchandised row for the first collection the catalogue lists.
* <product> has more than one variant for sale, including <variant>.

**Test data:**

| Field | Value |
| --- | --- |
| <product> | A product in the merchandised row with more than one variant for sale |
| <variant> | An available variant different from the variant selected on opening |

**Steps:**

1. Navigate to <grade10 store url>.
2. Open the card for <product> in the merchandised row.
3. Choose <variant> on the product page.
4. Add the chosen variant to the cart.

**Expected Results:**

* The merchandised row offers no way into the cart.
* Step 2 opens <product>'s own product page.
* The cart holds <variant>, not the variant selected on opening, and the page remains at <product>'s address.

---

## grade10-site-store-e2e-US3: Collector checks a sold-out product from the front door

**As a** collector,
**I want** a sold-out card in the merchandised row to remain marked sold out
when I open it,
**so that** I can tell an unavailable card from a broken purchase page.

### grade10-site-store-e2e-US3-TC1-1: Sold-out card keeps its status on the product page

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-home-US-03, grade10-site-store-home-US-06, grade10-site-store-product-page-US-04

**Pre-conditions:**

* <product> is in the merchandised row and all its variants are unavailable for sale.

**Test data:**

| Field | Value |
| --- | --- |
| <product> | A merchandised product with every variant unavailable for sale |

**Steps:**

1. Navigate to <grade10 store url>.
2. Check the status shown for <product> in the merchandised row.
3. Open the card for <product>.
4. Check the purchase area on the product page.

**Expected Results:**

* The merchandised row marks <product> as sold out and offers no way into the cart.
* Step 3 opens <product>'s own product page.
* The product page keeps every variant priced, labels the purchase action sold out, and offers no control that adds the product.

---

## grade10-site-store-e2e-US4: Member pays at the till with points and a coupon together

**As a** member,
**I want** staff to take my points and my product coupon off one sale,
**so that** both settle once, when I pay.

### grade10-site-store-e2e-US4-TC1-1: Points and a product coupon settle together on one till sale

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-02, grade10-site-store-discounts-US-04

**Pre-conditions:**

* No automatic discount is active at the shop.
* admin(shop staff) has a till session open for customer(member holding <product coupon_1> and at least <points> points), on a sale holding <line_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |
| <points> | 100, worth HK$100.00 |

**Steps:**

1. Choose <points> points and <product coupon_1> in the member's panel.
2. Apply them to the sale.
3. Tender the sale.
4. Read the paid order at the shop.

**Expected Results:**

* Step 2 puts both on the sale, neither refused for the other.
* The paid order shows Points taking HK$100.00 and <product coupon_1>'s code taking HK$50.00.
* The balance drops by exactly <points>, and <product coupon_1> reads spent.

---

## grade10-site-store-e2e-US5: Member identified from a wallet pass spends at the till

**As a** member,
**I want** staff to scan the pass in my phone wallet and take my spend from the right place,
**so that** I am served from my lock screen and a code anybody could photograph never moves my points.

### grade10-site-store-e2e-US5-TC1-1: Google Wallet pass opens a session that spends points

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-06, grade10-site-store-membership-US-02

**Pre-conditions:**

* No automatic discount is active at the shop.
* customer(member with a live Google Wallet pass and at least <points> points) is at the counter.
* admin(shop staff) has a sale holding <line_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <points> | 100, worth HK$100.00 |

**Steps:**

1. Scan the member's Google Wallet pass.
2. Apply <points> points from the member's panel.
3. Tender the sale.

**Expected Results:**

* Step 1 opens a session for the member, as a scanned member card does.
* Step 2 applies the points.
* The member's balance drops once, by <points>, when the sale is paid.

### grade10-site-store-e2e-US5-TC2-1: Apple Wallet pass refuses the spend and the card pays it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-08, grade10-site-store-membership-US-02

**Pre-conditions:**

* No automatic discount is active at the shop.
* customer(member with a live Apple Wallet pass and at least <points> points) is at the counter, member card open on the site.
* admin(shop staff) has a sale holding <line_1> and a session opened from the member's Apple Wallet pass.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <points> | 100, worth HK$100.00 |

**Steps:**

1. Apply <points> points from the member's panel.
2. Scan the member card on the member's phone.
3. Apply <points> points from the member's panel.
4. Tender the sale.

**Expected Results:**

* Step 1 is refused, not hidden.
* Step 3 applies the points.
* The member's balance drops once, by <points>, when the sale is paid.
