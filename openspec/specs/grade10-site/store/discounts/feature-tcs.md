# grade10-site/store/discounts Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

**Out of suite:** grade10-site-store-discounts-SC-16

## grade10-site-store-discounts-US1: Collector redeems a coupon at checkout

**As a** collector,
**I want** a coupon I hold to cut my order the moment I check out,
**so that** I get the reward I redeemed without needing a second code.

### grade10-site-store-discounts-US1-TC1-1: Submitted checkout carries the product coupon's own code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-01

**Pre-conditions:**

* No automatic discount is active at the shop.
* customer(member paired with a Shopify customer) is on <grade10 checkout url> holding <product coupon_1>, with <line_1> in the cart.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |

**Steps:**

1. Choose <product coupon_1>.
2. Submit the checkout.
3. Read the draft order at the shop.

**Expected Results:**

* Step 2 mints <product coupon_1>'s single-use discount code.
* The draft order carries that code.
* No line on the draft order carries a welded discount.

### grade10-site-store-discounts-US1-TC2-1: Editing the cart mints no coupon code

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-01

**Pre-conditions:**

* No automatic discount is active at the shop.
* customer(member) has the cart drawer open on <grade10 store url>, with <line_1> in the cart and <product coupon_1> picked.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |
| <line_3> | One HK$100.00 product |

**Steps:**

1. Add <line_3> to the cart.
2. Remove <line_3> from the cart.
3. Read the shop's discount codes for <product coupon_1>.

**Expected Results:**

* The cart price re-previews with <product coupon_1>'s cut after each edit.
* No Shopify discount code exists for <product coupon_1>.

### grade10-site-store-discounts-US1-TC3-1: Gift comes off by its own full-cut code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-01

**Pre-conditions:**

* No automatic discount is active at the shop.
* customer(member paired with a Shopify customer) is on <grade10 checkout url> holding <gift_1>, with <line_1> in the cart.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <gift_1> | A live gift of <gift product>, for goods of HK$500.00 or more |
| <gift product> | One HK$100.00 product |

**Steps:**

1. Choose <gift_1>.
2. Submit the checkout.
3. Read the draft order at the shop.

**Expected Results:**

* The draft order carries <gift product> at a full cut, through <gift_1>'s own single-use code.
* <gift product>'s line carries no discount of its own.

### grade10-site-store-discounts-US1-TC4-1: Reward coupon settles reporting its own customer-scoped code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-01

**Pre-conditions:**

* No automatic discount is active at the shop.
* customer(member paired with a Shopify customer) is on <grade10 checkout url> holding <reward coupon_1>, with <line_1> in the cart.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <reward coupon_1> | A live coupon redeemed from a loyalty reward, taking HK$50.00 off <line_1> |

**Steps:**

1. Choose <reward coupon_1>.
2. Submit the checkout.
3. Pay the order.
4. Read the paid order at the shop.

**Expected Results:**

* Step 2's order carries <reward coupon_1>'s own single-use code, scoped to the member's Shopify customer.
* The paid order reports that code.
* No line carries a welded discount.

### grade10-site-store-discounts-US1-TC5-1: Facet-scoped coupon takes only from the lines its facet reaches

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-01

**Pre-conditions:**

* No automatic discount is active at the shop.
* customer(member paired with a Shopify customer) is on <grade10 checkout url> holding <facet coupon_1>, with <inside line> and <outside line> in the cart.

**Test data:**

| Field | Value |
| --- | --- |
| <facet coupon_1> | A live coupon for a fixed HK$500.00, scoped to one catalogue facet choice |
| <inside line> | One HK$5.00 product carrying that facet choice |
| <outside line> | One HK$780.00 product not carrying it |

**Steps:**

1. Choose <facet coupon_1>.
2. Submit the checkout.
3. Pay the order.
4. Read the paid order at the shop and in grade10.

**Expected Results:**

* The minted code names only <inside line>'s variant.
* The shop records HK$5.00 taken off <inside line>, nothing off <outside line>, not HK$500.00.
* Grade10 records the same HK$5.00 for <facet coupon_1>.

---

## grade10-site-store-discounts-US2: Collector holding more than one eligible coupon picks which one to spend

**As a** collector,
**I want** to be asked which coupon to apply when my basket qualifies for more than one,
**so that** I choose the one I want rather than losing one to a silent rule.

### grade10-site-store-discounts-US2-TC1-1: Two eligible coupons ask the collector to choose one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-02

**Pre-conditions:**

* No automatic discount is active at the shop.
* customer(member) holds <product coupon_1> and <order coupon_1>, with <line_1> in the cart.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |
| <order coupon_1> | A live order coupon that takes HK$20.00 off the whole order |

**Steps:**

1. Navigate to <grade10 checkout url>.
2. Choose <order coupon_1>.
3. Submit the checkout.
4. Read the draft order at the shop.

**Expected Results:**

* Step 1 asks the collector to choose exactly one coupon.
* The draft order carries <order coupon_1>'s code and no other coupon.

### grade10-site-store-discounts-US2-TC2-1: A second discount is refused, not stacked

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-02

**Pre-conditions:**

* customer(member) is on <grade10 checkout url> with <line_1> in the cart, and the order already carries <order coupon_1>'s code.
* The member holds <second>, and the basket qualifies for it.

**Test data:**

| <second> |
| --- |
| A live typed discount code |
| A second live order coupon |
| A live product coupon |
| A live gift |
| A live reward coupon |

**Steps:**

1. Apply <second> to the same order.
2. Read the order's discount codes.

**Expected Results:**

* <second> is refused.
* The order still carries <order coupon_1>'s code alone.

---

## grade10-site-store-discounts-US3: Collector keeps the coupon when a checkout cannot take it

**As a** collector,
**I want** a coupon back in my wallet whenever the checkout it was meant for does not complete,
**so that** a refusal or an abandoned order never costs me what I redeemed.

### grade10-site-store-discounts-US3-TC1-1: Shop's larger sale sets the coupon aside and keeps the order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* <site discount_1> is the only automatic discount active at the shop, and it does not combine with <product coupon_2>'s code.
* customer(member) is on <grade10 checkout url> holding <product coupon_2>, with <line_2> and <line_1> in the cart.

**Test data:**

| Field | Value |
| --- | --- |
| <site discount_1> | `ALL 5% OFF`, an automatic discount of 5% off the whole order |
| <line_1> | One HK$780.00 product |
| <line_2> | One HK$5.00 product |
| <product coupon_2> | A live product coupon that takes HK$5.00 off <line_2> |

**Steps:**

1. Choose <product coupon_2>.
2. Submit the checkout.
3. Open the member's coupon wallet.

**Expected Results:**

* The order completes at the shop's price, `ALL 5% OFF` taking HK$39.25 and no coupon cut.
* The member is told the sale gave more than the coupon.
* <product coupon_2> is back in the wallet, unused.

### grade10-site-store-discounts-US3-TC2-1: A mint the shop refuses refuses the checkout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* customer(member) is on <grade10 checkout url> holding <product coupon_1>, with <line_1> in the cart.
* The shop is set to refuse minting <product coupon_1>'s code.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |

**Steps:**

1. Choose <product coupon_1>.
2. Submit the checkout.
3. Read the member's orders.
4. Open the member's coupon wallet.

**Expected Results:**

* Step 2 is refused, naming <product coupon_1>.
* No order is left behind.
* <product coupon_1> is still spendable.

### grade10-site-store-discounts-US3-TC3-1: A member with no paired Shopify customer is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* customer(member whose Shopify customer pairing has not converged) is on <grade10 checkout url> holding <product coupon_1>, with <line_1> in the cart.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |

**Steps:**

1. Apply <product coupon_1> to the checkout.
2. Read the shop's discount codes for <product coupon_1>.

**Expected Results:**

* Step 1 is refused, naming the pairing as the reason.
* No discount code is minted for <product coupon_1>.

### grade10-site-store-discounts-US3-TC4-1: Unknown catalogue facets refuse the coupon rather than guess

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* customer(member) is on <grade10 checkout url> holding <facet coupon_1>, with <inside line> in the cart.
* The catalogue is made unable to return <inside line>'s facets.

**Test data:**

| Field | Value |
| --- | --- |
| <facet coupon_1> | A live coupon for a fixed HK$500.00, scoped to one catalogue facet choice |
| <inside line> | One HK$5.00 product carrying that facet choice |

**Steps:**

1. Choose <facet coupon_1>.
2. Submit the checkout.
3. Read the shop's discount codes for <facet coupon_1>.

**Expected Results:**

* <facet coupon_1> is refused.
* No discount code is minted.

### grade10-site-store-discounts-US3-TC5-1: A dead order's unspent code is deactivated

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* customer(member) has <order_1>, an unpaid order carrying <product coupon_1>'s minted, unspent code.

**Test data:**

| <ending> |
| --- |
| <order_1> is canceled |
| <order_1> fails |

**Steps:**

1. End <order_1> as <ending> states.
2. Read <product coupon_1>'s code at the shop.
3. Open the member's coupon wallet.

**Expected Results:**

* The code is deactivated.
* <product coupon_1> is back with the member.

---

## grade10-site-store-discounts-US4: Shop staff spends a member's product coupon at the till

**As a** member of shop staff,
**I want** a member's product coupon to settle the same way at the till as it does online,
**so that** I can ring it up with the same confidence either channel gives me.

### grade10-site-store-discounts-US4-TC1-1: Till coupon settles by its own code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* No automatic discount is active at the shop.
* admin(shop staff) has a till session open for customer(member) holding <product coupon_1>, on a sale holding <line_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |

**Steps:**

1. Apply <product coupon_1> from the member's panel.
2. Tender the sale.
3. Read the paid order at the shop and the member's coupon wallet.

**Expected Results:**

* The paid order names <product coupon_1>'s own single-use code, with no welded line discount.
* <product coupon_1> reads spent in the wallet.

### grade10-site-store-discounts-US4-TC2-1: Re-planned sale keeps one code for its coupon

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* No automatic discount is active at the shop.
* admin(shop staff) has a till session open for customer(member), on a sale holding <line_1> and carrying <product coupon_1>'s minted code.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |

**Steps:**

1. Apply the sale again with <product coupon_1> still chosen.
2. Read the discount codes on the sale.

**Expected Results:**

* The sale carries exactly one code for <product coupon_1>.

### grade10-site-store-discounts-US4-TC3-1: Coupon cleared with 移除所有折扣 cannot go back on the sale

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) has a till session open for customer(member) holding <product coupon_1>, on a sale holding <line_1>.
* <product coupon_1> was applied to the sale, then cleared with 移除所有折扣.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |

**Steps:**

1. Apply <product coupon_1> to the same sale again.
2. Read <product coupon_1> in the member's coupon wallet.

**Expected Results:**

* Step 1 is refused: the coupon has come off this sale, ring it up on a new one.
* <product coupon_1> stands live in the wallet.

### grade10-site-store-discounts-US4-TC4-1: Code the paid sale does not name stops standing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) rang up a till sale for customer(member) whose record carries <product coupon_1>'s minted code.
* The sale is paid, and its paid order does not name that code.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |

**Steps:**

1. Wait for the sale to settle.
2. Read <product coupon_1>'s code at the shop.
3. Read the member's order history and notifications.

**Expected Results:**

* The code no longer stands at the shop.
* Nothing shows the member the code as money saved on the sale.
