# grade10-site/store/discounts Test Cases

**Status:** pending-review · 0/27
**Drafts styled:** 2026-10-06, tcs-rules r4

**Out of suite:** grade10-site-store-discounts-SC-16

## grade10-site-store-discounts-US1: Collector redeems a coupon at checkout

**As a** collector,
**I want** a coupon I hold to cut my order the moment I check out,
**so that** I get the reward I redeemed without needing a second code.

<!-- trace:case id=g10.store-discounts.TC-l5p rev=1 covers=g10.store-discounts.SC-d4g,g10.store-discounts.SC-o8t,g10.store-discounts.SC-s75,g10.store-discounts.SC-9rf,g10.store-discounts.SC-gtt,g10.store-discounts.SC-pl1 -->
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

<!-- trace:case id=g10.store-discounts.TC-vem rev=1 covers=g10.store-discounts.SC-d4g,g10.store-discounts.SC-o8t,g10.store-discounts.SC-s75,g10.store-discounts.SC-9rf,g10.store-discounts.SC-gtt,g10.store-discounts.SC-pl1 -->
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

<!-- trace:case id=g10.store-discounts.TC-fj0 rev=1 covers=g10.store-discounts.SC-d4g,g10.store-discounts.SC-o8t,g10.store-discounts.SC-s75,g10.store-discounts.SC-9rf,g10.store-discounts.SC-gtt,g10.store-discounts.SC-pl1 -->
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

<!-- trace:case id=g10.store-discounts.TC-q9x rev=1 covers=g10.store-discounts.SC-d4g,g10.store-discounts.SC-o8t,g10.store-discounts.SC-s75,g10.store-discounts.SC-9rf,g10.store-discounts.SC-gtt,g10.store-discounts.SC-pl1 -->
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

<!-- trace:case id=g10.store-discounts.TC-e7e rev=1 covers=g10.store-discounts.SC-d4g,g10.store-discounts.SC-o8t,g10.store-discounts.SC-s75,g10.store-discounts.SC-9rf,g10.store-discounts.SC-gtt,g10.store-discounts.SC-pl1 -->
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

<!-- trace:case id=g10.store-discounts.TC-nql rev=1 covers=g10.store-discounts.SC-kr9,g10.store-discounts.SC-qip -->
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

<!-- trace:case id=g10.store-discounts.TC-1hn rev=1 covers=g10.store-discounts.SC-kr9,g10.store-discounts.SC-qip -->
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

<!-- trace:case id=g10.store-discounts.TC-62k rev=1 covers=g10.store-discounts.SC-2qg,g10.store-discounts.SC-5v2,g10.store-discounts.SC-v2s,g10.store-discounts.SC-vsw,g10.store-discounts.SC-na4,g10.store-discounts.SC-cvt,g10.store-discounts.SC-82q -->
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

<!-- trace:case id=g10.store-discounts.TC-kdb rev=1 covers=g10.store-discounts.SC-2qg,g10.store-discounts.SC-5v2,g10.store-discounts.SC-v2s,g10.store-discounts.SC-vsw,g10.store-discounts.SC-na4,g10.store-discounts.SC-cvt,g10.store-discounts.SC-82q -->
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

<!-- trace:case id=g10.store-discounts.TC-nia rev=1 covers=g10.store-discounts.SC-2qg,g10.store-discounts.SC-5v2,g10.store-discounts.SC-v2s,g10.store-discounts.SC-vsw,g10.store-discounts.SC-na4,g10.store-discounts.SC-cvt,g10.store-discounts.SC-82q -->
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

<!-- trace:case id=g10.store-discounts.TC-wae rev=1 covers=g10.store-discounts.SC-2qg,g10.store-discounts.SC-5v2,g10.store-discounts.SC-v2s,g10.store-discounts.SC-vsw,g10.store-discounts.SC-na4,g10.store-discounts.SC-cvt,g10.store-discounts.SC-82q -->
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

<!-- trace:case id=g10.store-discounts.TC-14n rev=1 covers=g10.store-discounts.SC-2qg,g10.store-discounts.SC-5v2,g10.store-discounts.SC-v2s,g10.store-discounts.SC-vsw,g10.store-discounts.SC-na4,g10.store-discounts.SC-cvt,g10.store-discounts.SC-82q -->
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

<!-- trace:case id=g10.store-discounts.TC-qeb rev=1 covers=g10.store-discounts.SC-2qg,g10.store-discounts.SC-5v2,g10.store-discounts.SC-v2s,g10.store-discounts.SC-vsw,g10.store-discounts.SC-na4,g10.store-discounts.SC-cvt,g10.store-discounts.SC-82q -->
### grade10-site-store-discounts-US3-TC6-1: A counter sale nobody paid loses its code at the hour

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* admin(shop staff) planned <counter sale A> at <shop A> for customer(member holding <coupon>), with <coupon> on it, and nobody tendered it.
* The clock stands at the row's <check time>.

**Test data:**

| <check time> | The code on <counter sale A> |
| --- | --- |
| 59 minutes after the sale's only plan | Live |
| 61 minutes after the sale's only plan | No longer live |
| 61 minutes after the first plan, 55 minutes after a second plan in the same till session | Live |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> |

**Steps:**

1. Read the code minted for <coupon> on <counter sale A> at the shop.
2. Read <counter sale A> at <shop A>.
3. Read the member's coupons on <grade10 loyalty url>.

**Expected Results:**

* Step 1 reads the code as the row's second column says.
* <counter sale A> is not cancelled and still holds <line_1>.
* <coupon> reads unused.

<!-- trace:case id=g10.store-discounts.TC-dsi rev=1 covers=g10.store-discounts.SC-2qg,g10.store-discounts.SC-5v2,g10.store-discounts.SC-v2s,g10.store-discounts.SC-vsw,g10.store-discounts.SC-na4,g10.store-discounts.SC-cvt,g10.store-discounts.SC-82q -->
### grade10-site-store-discounts-US3-TC8-1: An expired online order keeps its code for the code's whole life

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* customer(member holding <coupon>) has <expired order>, which expired with its checkout still able to collect.
* The clock stands at the row's <check time>.

**Test data:**

| <check time> | The code on <expired order> |
| --- | --- |
| 23 hours after <expired order> was written | Live |
| 24 hours and 30 minutes after <expired order> was written | No longer live |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity |
| <expired order> | An online order the member submitted with <coupon> and never paid, which the store could not close |

**Steps:**

1. Read the code minted for <coupon> on <expired order> at the shop.
2. Read <expired order> in the member's orders.
3. Read the member's coupons on <grade10 loyalty url>.

**Expected Results:**

* Step 1 reads the code as the row's second column says.
* <expired order> is not cancelled.
* <coupon> reads unused.

<!-- trace:case id=g10.store-discounts.TC-93a rev=1 covers=g10.store-discounts.SC-2qg,g10.store-discounts.SC-5v2,g10.store-discounts.SC-v2s,g10.store-discounts.SC-vsw,g10.store-discounts.SC-na4,g10.store-discounts.SC-cvt,g10.store-discounts.SC-82q -->
### grade10-site-store-discounts-US3-TC9-1: A gift on a counter sale nobody paid goes back to the wallet

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* admin(shop staff) planned <counter sale A> at <shop A> for customer(member holding <gift>), with <gift> on it, and nobody tendered it.
* <counter sale A> lost <gift> the row's way.

**Test data:**

| How <counter sale A> lost <gift> |
| --- |
| Its last plan was 61 minutes ago |
| The member submitted <later checkout> with <gift> on <grade10 store url> |
| The member submitted <later checkout> with no coupon and no points on <grade10 store url> |

| Field | Value |
| --- | --- |
| <gift> | A gift reward the member holds, unused, inside its validity, whose threshold <line_1> passes |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <gift> |
| <later checkout> | An online checkout holding <line_1> |

**Steps:**

1. Read <counter sale A> at <shop A>.
2. Navigate to <grade10 loyalty url>.
3. Read <gift> in the member's coupons.

**Expected Results:**

* <counter sale A> is not cancelled and still holds <line_1> and <gift>'s line.
* Step 3 shows <gift> as spendable.

---

## grade10-site-store-discounts-US4: Shop staff spends a member's reward coupon at the till

**As a** member of shop staff,
**I want** a member's reward coupon, a product coupon or a gift, to settle at the till as surely as it does online,
**so that** I can ring it up with the same confidence either channel gives me.

<!-- trace:case id=g10.store-discounts.TC-ye2 rev=1 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
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

<!-- trace:case id=g10.store-discounts.TC-9h9 rev=1 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
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

<!-- trace:case id=g10.store-discounts.TC-rf9 rev=2 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
### grade10-site-store-discounts-US4-TC3-2: A sale a reward was cleared off takes points, and no reward

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
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) has a till session open for customer(member holding <product coupon_1>, <product coupon_2> and at least <points> points), on a sale holding <line_1>.
* <product coupon_1> was applied to the sale, then cleared with 移除所有折扣.

**Test data:**

| Chosen on the sale | Answer |
| --- | --- |
| <product coupon_1> | Refused: a reward has come off this sale, ring it up on a new one |
| <product coupon_2> | Refused: a reward has come off this sale, ring it up on a new one |
| <points> points, and no reward | Taken, and the sale carries the points |

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1>'s own variant |
| <product coupon_2> | A second reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1>'s own variant |
| <points> | 100, worth HK$100.00 |

**Steps:**

1. Choose the row's benefit in the member's panel.
2. Apply the sale.
3. Read <product coupon_1> and <product coupon_2> in the member's coupon wallet.

**Expected Results:**

* Step 2 answers as the row's second column says.
* <product coupon_1> and <product coupon_2> stand live in the wallet.

<!-- trace:case id=g10.store-discounts.TC-pic rev=1 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
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

<!-- trace:case id=g10.store-discounts.TC-w7h rev=1 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
### grade10-site-store-discounts-US4-TC5-1: A sale that collects a reward another sale claims is reported and spends nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* customer(member holding the row's reward) claimed that reward on <later checkout>, which took it off <counter sale A>.
* admin(shop staff) tendered <counter sale A> without planning it again, and its paid order carries what the row names, with the shop's discount allocations.
* <later checkout> is paid with the row's reward on it.
* Neither sale has settled.

**Test data:**

| Reward | What <counter sale A>'s paid order carries | Settled first |
| --- | --- | --- |
| <coupon> | <coupon>'s deactivated code and its cut | <later checkout> |
| <coupon> | <coupon>'s deactivated code and its cut | <counter sale A> |
| <gift> | <gift>'s line, discounted to nothing | <later checkout> |
| <gift> | <gift>'s line, discounted to nothing | <counter sale A> |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <gift> | A gift reward the member holds, unused, inside its validity, whose threshold <line_1> passes |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with the row's reward before <later checkout> claimed it |
| <later checkout> | An online checkout the member submitted with the row's reward on <line_1> |

**Steps:**

1. Settle the sale the row's last column names.
2. Settle the other sale.
3. Read the member's coupons on <grade10 loyalty url>.
4. Read the commerce monitors' alerts for a sale that collected a reward it gave up.

**Expected Results:**

* The row's reward reads used once, by <later checkout>.
* <counter sale A> spends no reward.
* Step 4 shows an alert whose log line names <counter sale A>'s order.

<!-- trace:case id=g10.store-discounts.TC-99b rev=1 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
### grade10-site-store-discounts-US4-TC6-1: A sale paid with what it gave up spends the coupon nobody else claims

Runs once per row of **Test data**.

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

* admin(shop staff) planned <counter sale A> at <shop A> for customer(member holding the row's reward), with that reward on it.
* <counter sale A> ran out its hour, and its cart still carries what the row names.
* No other sale claims the row's reward.
* admin(shop staff) tendered <counter sale A> without planning it again, and its paid order names the shop's discount allocations.

**Test data:**

| Reward | What the paid sale carries |
| --- | --- |
| <coupon> | <coupon>'s deactivated code and its cut |
| <gift> | <gift>'s line, discounted to nothing |

| Field | Value |
| --- | --- |
| <coupon> | A reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1>'s own variant |
| <gift> | A gift reward the member holds, unused, inside its validity |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding <line_1> |

**Steps:**

1. Settle <counter sale A>.
2. Read the member's coupons on <grade10 loyalty url>.
3. Read the commerce monitors' alerts for a sale that collected a reward it gave up.

**Expected Results:**

* The row's reward reads used once, by <counter sale A>.
* Step 3 shows an alert whose log line names <counter sale A>'s order.

<!-- trace:case id=g10.store-discounts.TC-ofg rev=1 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
### grade10-site-store-discounts-US4-TC7-1: A counter sale a newer promise retired takes no new plan

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
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* customer(member holding <coupon>, <other coupon> and at least <points> points) claimed <coupon> on <later checkout>, which took it off <counter sale A>.
* admin(shop staff) has the till session holding <counter sale A> open at <shop A>, still live, under an hour since its last plan.

**Test data:**

| Chosen on <counter sale A> |
| --- |
| <coupon> |
| <other coupon> |
| <points> points |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <other coupon> | A second reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <points> | 100, worth HK$100.00 |
| <line_1> | One HK$780.00 product, on <counter sale A> |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> before <later checkout> claimed it |
| <later checkout> | An online checkout the member submitted with <coupon> |

**Steps:**

1. Choose the row's benefit in the member's panel.
2. Apply the sale.
3. Read <later checkout> in the member's orders.
4. Read the member's coupons on <grade10 loyalty url>.

**Expected Results:**

* Step 2 is refused, telling staff the sale has closed and to ring the goods on a new one.
* <later checkout> still carries <coupon>'s cut.
* <coupon> and <other coupon> read unused in the wallet.

<!-- trace:case id=g10.store-discounts.TC-uwj rev=1 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
### grade10-site-store-discounts-US4-TC8-1: A counter sale that closed takes no new plan, nor does a fresh scan on its cart

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
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) planned <counter sale A> at <shop A> for customer(member holding <coupon> and at least <points> points), with <coupon> on it.
* <counter sale A> stands the row's way.
* admin(shop staff) has a till session for that member open on the cart the row names.

**Test data:**

| Where <counter sale A> stands | The till session and cart |
| --- | --- |
| Tendered, and its paid order has reached the store | <counter sale A>'s own session, still open, on the next cart, with <line_1> rung up and the member on it |
| Its last plan was 61 minutes ago, never tendered | A new session from scanning the member's card again, on <counter sale A>'s cart |
| Retired, never tendered: the member submitted <later checkout> on <grade10 store url> | A new session from scanning the member's card again, on <counter sale A>'s cart |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <points> | 100, worth HK$100.00 |
| <line_1> | One HK$780.00 product, on <counter sale A> |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> |
| <later checkout> | An online checkout the member submitted with <coupon>, after <counter sale A> was planned |

**Steps:**

1. Choose <points> points in the member's panel.
2. Apply the sale.
3. Read the cart's discount codes in Shopify POS.
4. Read <counter sale A>'s order.

**Expected Results:**

* Step 2 is refused, telling staff the sale has closed and to ring the goods on a new one.
* Step 3 shows no code minted by step 2.
* <counter sale A>'s order still holds <line_1> and is not rewritten.

<!-- trace:case id=g10.store-discounts.TC-6h1 rev=1 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
### grade10-site-store-discounts-US4-TC9-1: A gift at the till goes on as its own line and carries no code

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
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* No automatic discount is active at the shop.
* admin(shop staff) has a till session open for customer(member holding <gift>) at <shop A>, on a sale holding <line_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <gift> | A gift reward the member holds, unused, inside its validity, whose threshold <line_1> passes |
| <line_1> | One HK$780.00 product |

**Steps:**

1. Choose <gift> in the member's panel.
2. Apply the sale.
3. Read the sale's lines and discount codes in Shopify POS.
4. Tender the sale.
5. Navigate to <grade10 loyalty url>.
6. Read <gift> in the member's coupons.

**Expected Results:**

* Step 3 shows <gift>'s product as its own line, discounted to nothing.
* Step 3 shows no discount code for <gift>.
* Step 6 shows <gift> used once.

<!-- trace:case id=g10.store-discounts.TC-8y2 rev=1 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
### grade10-site-store-discounts-US4-TC10-1: A reward POS's own remove-all took off does not go back on the sale

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) has a till session open for customer(member holding <product coupon_1>, <product coupon_2> and at least <points> points), on a sale holding <line_1>.
* <product coupon_1> was applied to the sale, then taken off with POS's own 管理折扣 → 全部移除.

**Test data:**

| Chosen on the sale | Answer |
| --- | --- |
| <product coupon_1> | Refused: a reward has come off this sale, ring it up on a new one |
| <product coupon_2> | Refused: a reward has come off this sale, ring it up on a new one |
| <points> points, and no reward | Taken, and the sale carries the points |

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1>'s own variant |
| <product coupon_2> | A second reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1>'s own variant |
| <points> | 100, worth HK$100.00 |

**Steps:**

1. Choose the row's benefit in the member's panel.
2. Apply the sale.
3. Read <product coupon_1> and <product coupon_2> in the member's coupon wallet.

**Expected Results:**

* Step 2 answers as the row's second column says.
* <product coupon_1> and <product coupon_2> stand live in the wallet.

<!-- trace:case id=g10.store-discounts.TC-hz8 rev=1 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
### grade10-site-store-discounts-US4-TC11-1: A fresh scan on an open sale's cart continues it with its one code

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) planned <counter sale A> at <shop A> for customer(member holding <coupon> and at least <points> points), with <coupon> on it, <plan age> ago.
* Nobody tendered <counter sale A>, and its own till session has expired.
* The member is still on <counter sale A>'s cart in Shopify POS.

**Test data:**

| <plan age> |
| --- |
| 12 minutes |
| 59 minutes |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <points> | 100, worth HK$100.00 |
| <line_1> | One HK$780.00 product, on <counter sale A> |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> |

**Steps:**

1. Scan the member's card on <counter sale A>'s cart.
2. Choose <points> points in the member's panel, with <coupon> still on the sale.
3. Apply the sale.
4. Read the cart's discount codes in Shopify POS.
5. Read <counter sale A>'s order.

**Expected Results:**

* Step 3 goes through, and the sale carries <points> points and <coupon>'s cut.
* Step 4 shows only the code minted for <coupon> when <counter sale A> was planned.
* Step 3 planned <counter sale A>'s own order, which holds <line_1>, is not retired, and keeps that code live.

<!-- trace:case id=g10.store-discounts.TC-f3f rev=1 covers=g10.store-discounts.SC-fc9,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
### grade10-site-store-discounts-US4-TC12-1: A fresh scan of another member never continues an open sale

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
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) planned <counter sale A> at <shop A> for customer A(member holding <coupon>), with <coupon> on it, 12 minutes ago.
* Nobody tendered <counter sale A>, and its own till session has expired.
* customer A is still on <counter sale A>'s cart in Shopify POS.
* customer B(member holding at least <points> points) is at the counter.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon customer A holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <points> | 100, worth HK$100.00 |
| <line_1> | One HK$780.00 product, on <counter sale A> |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> |

**Steps:**

1. Scan customer B's card on <counter sale A>'s cart.
2. Choose <points> points in customer B's panel.
3. Apply the sale.
4. Read <counter sale A>'s order.

**Expected Results:**

* Step 3 is refused, telling staff the sale carries another customer, and plans nothing onto <counter sale A>'s order.
* Step 4 shows the order still naming customer A and holding <line_1>.
* Step 4 shows no points of customer B on the order.

## Settled

- A counter sale tendered after its coupon left, with no new plan, collects with the cut, because the shop honours a code a cart already carries; it spends the coupon where no other sale claims it, and is reported either way
- A gift on a counter sale carries no code; when its claim leaves — at the hour, or claimed elsewhere — its line stays on the cart, and a sale paid showing that line is settled by it as by a code
- A sale that collects a deactivated code is reported to an operator by the commerce monitors' alert, whose log line names the order
- A counter sale a newer promise retired, one whose coupon was claimed elsewhere among them, takes no new plan, points included, and the till asks staff to ring the goods on a new sale; a sale a reward was cleared off still takes points, and no reward
- A till session lives ten minutes and a sale's hour outlasts it, so a sale that ran out its hour is reached again only by a fresh scan, and that scan is refused as a closed sale where the cart still carries its reward's code. A fresh scan on a cart whose sale of the same member is still open continues that sale and its code (Q27)
- A reward taken off by POS's own 管理折扣 → 全部移除 is cleared off the sale the same as by 移除所有折扣
- A fresh scan on the cart of the member's own closed sale that carries no reward's code is not refused: the apply takes that sale's gift lines and points off the cart and opens a new sale, and a cart tendered without a new apply is settled against the closed sale, a gift's line on it reported (Q31)

## Reconciliation

**Run:** QA1, 2026-10-06, a fresh blind pass in update mode. It read the Purpose and Feature set of both delta specs, both journeys files, `proposal.md`, `decisions.md` with its Raised table, the Coupons, Rewards, Discounts and Shopify Integration pages, the two rulebooks, the store domain suite and this suite with their Reconciliation stripped, and the durable suites' case headings for id continuity. It was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive. Two shell reads leaked by accident: one line of the discounts Reconciliation at HEAD, and the tail of the discounts Reconciliation after US3-TC8-1, US3-TC9-1 and US4-TC5-1 were drafted and the US4-TC11-1 split was planned; nothing was drafted from them, and the discounts pass is not blind past that point. It does not record whether it read `grade10-site-store-discounts-US-04` before or after its retitle from a product coupon to a reward coupon, so the discounts pass is owed a fresh QA1 reading of the retitled journey. It is a statement, not proof.

**Run:** QA2, 2026-10-06, tcs-rules r4, in a fresh context after QA1's update pass. It read both readings, the delta, `tech-design.md`, `tasks.md`, `decisions.md` with its Raised table, the Discounts and Coupons pages, and the application repository where a decision cites it, and checked the suite with `tcs:validate` on the folded store and `trace validate`.

- **Agreed** — `grade10-site-store-discounts-SC-19` by US3-TC6-1, its third row planning twice inside one live session; `grade10-site-store-discounts-SC-21` by US4-TC5-1, a coupon and a gift in both settling orders; `grade10-site-store-discounts-SC-28` by US4-TC9-1; `grade10-site-store-discounts-SC-24` by US4-TC7-1, from the sale's own live session, since a lapsed session answers that it expired. US3-TC9-1 walks a gift's claim leaving a counter sale at the hour, when claimed elsewhere and when a checkout carrying nothing retires it, which `grade10-site-loyalty-programme-SC-205`, `grade10-site-loyalty-programme-SC-191` and `grade10-site-loyalty-programme-SC-234` state for any coupon, with the line staying as Q15, Q17 and Q18 settle
- **Raised, folded into spec** — US3-TC8-1 held that an online order that only expires keeps its code while its checkout can collect: `grade10-site-store-discounts-SC-26` (Q6); its second row reads the code dying 24 hours from the order, as Q12 sets. US4-TC10-1 held that a reward POS's own 管理折扣 → 全部移除 took off does not go back on the sale, which the requirement's "cleared off it" states and `grade10-site-store-discounts-SC-17` named only by 移除所有折扣: that scenario's GIVEN names both, at its second revision. US4-TC8-1's paid row held that a sale whose paid order arrived takes no new plan: `grade10-site-store-discounts-SC-29`
- **Raised by QA2, landed** — US4-TC8-1's hour row and US3-TC6-1's third row planned a till sale an hour after its last plan in its own session. A till session lives ten minutes (`pos/deps.ts:54`), so that plan never comes: staff are told the session expired and scan again, and the fresh scan would mint a second code beside the dead one. Q19 refuses a fresh scan on the cart of a closed sale that still carries its reward code; `grade10-site-store-discounts-SC-27` walks it, the requirement carries it, and tasks 10.5 and 10.6 build it. US4-TC8-1 walks the paid sale from its own session and the hour from a fresh scan
- **Blocked** — US4-TC11-1, a fresh scan on the cart of a sale still open, 12 minutes after its plan. The requirement refuses a fresh scan only on a closed sale, and the case reads a refusal, which is one of Raised R1's three answers. It stays draft with `**Blocked:**` naming the product manager; R1's answer rewrites its step 3, adds the open sale's scenario and moves task 10.6. Q19 and R1 are corrected to say the delta refuses only a closed sale meanwhile
- **Rewritten to the spec** — US4-TC7-1, drafted as US3-TC7-1, took points on a counter sale whose coupon was claimed elsewhere. The Discounts page says that sale takes no new plan, so every row is refused naming a new sale, and it traces US-04, where `grade10-site-store-discounts-SC-24` serves. The durable US4-TC3-1 is rewritten for `grade10-site-store-discounts-SC-17`'s second revision, another reward refused too, and `grade10-site-store-discounts-SC-22`, points still taken, as US4-TC3-2 under its marker's second revision. US4-TC5-1 reads the commerce monitors' alert, the reader Q16 names, and its title names a code another sale claims, since US4-TC6-1 spends the coupon nobody claims. US3-TC9-1 asserts the gift's line staying on every row (Q18)
- **Raised by the blind pass, landed** — Q14 in US4-TC5-1 and US4-TC6-1; Q15 in US4-TC6-1's gift row and US3-TC9-1; Q16 in the alert both read; Q17 in US3-TC9-1's third row
- **Written from the scenarios, so not blind** — US4-TC6-1 for `grade10-site-store-discounts-SC-23` and `grade10-site-store-discounts-SC-25`
- **Retraced** — `grade10-site-store-discounts-SC-17`, `grade10-site-store-discounts-SC-18`, `grade10-site-store-discounts-SC-23`, `grade10-site-store-discounts-SC-25` and `grade10-site-store-discounts-SC-28` served feature-set groups while the cases that walk them trace US-04; each serves US-04. `grade10-site-store-discounts-SC-16` served US-03 while listed out of suite; it serves `An ephemeral code, minted once` under its unchanged requirement, and the US-03 markers drop it. `grade10-site-store-discounts-US-04` names a reward coupon, a product coupon or a gift, since `grade10-site-store-discounts-SC-25` and `grade10-site-store-discounts-SC-28` serve it with a gift (Q8); its so-that and every case's steps stand
- **Carried for their markers** — the durable US3-TC1-1 to US3-TC5-1, US4-TC1-1, US4-TC2-1 and US4-TC4-1 are carried with their ids, revisions and words, so their markers list exactly the scenarios serving their journey, as every marker this change carries does
- **Contradicted** — none. The one opposite reading, points on a sale whose coupon was claimed elsewhere, is settled by the Discounts page
- **Restated unchanged** — `grade10-site-store-discounts-SC-01`, `grade10-site-store-discounts-SC-08`, `grade10-site-store-discounts-SC-05`, `grade10-site-store-discounts-SC-06`, `grade10-site-store-discounts-SC-02`, `grade10-site-store-discounts-SC-12`, `grade10-site-store-discounts-SC-11`, `grade10-site-store-discounts-SC-13`, `grade10-site-store-discounts-SC-07`, `grade10-site-store-discounts-SC-14` and `grade10-site-store-discounts-SC-18` keep the durable suite's US1-TC1-1, US1-TC4-1, US1-TC2-1, US1-TC1-1, US1-TC3-1, US3-TC3-1, US3-TC2-1, US3-TC5-1, US4-TC1-1, US4-TC2-1 and US4-TC4-1. Online a gift still rides its own code, so US1-TC3-1 stands
- **Uncovered anchors** — none. No domain case walks a sale nobody paid, so none is covered at domain

**Run:** QA2, 2026-10-06, tcs-rules r4, in a fresh context after accept-review fix round 2. It read both suites, both deltas, `tech-design.md`, `decisions.md` with its Raised table and the Discounts page, and checked the suite with `tcs:validate` and `trace validate`. The retitled `grade10-site-store-discounts-US-04` names a reward coupon, a product coupon or a gift; the blind gift cases US4-TC5-1, US4-TC6-1 and US4-TC9-1 were drafted under its earlier title, so the retitle moves no case. Whether QA1's update pass read it before or after the retitle is still unrecorded, as the QA1 run says.

- **A fresh scan of the same member (Q19), agreed** - US4-TC8-1's hour row scans the same member onto the cart of their closed sale, which the requirement names; no case scans another member onto it, which the durable `A second person steps up` line handles
- **Allocations scope (Q22), rewritten to the spec** - the settlement requirement is scoped to a sale that names the shop's allocations, so US4-TC5-1's and US4-TC6-1's pre-conditions now have the paid order name them. US4-TC9-1 settles a gift by its line, which the transport requirement reads whatever the order names. No case walks a sale that names none
- **Renumbered, agreed** - the Agreed bullet cites `grade10-site-loyalty-programme-SC-234`, the programme scenario once issued as 224
- **Still blocked** - US4-TC11-1 waits on Raised R1, as above
- **Uncovered anchors** - none

**Run:** QA2, 2026-10-07, tcs-rules r4, in a fresh context after QA1's update pass on the fresh scan. That pass left no run line, so whether it was blind is unrecorded. It read both suites, both deltas, `tech-design.md`, `tasks.md`, `decisions.md` with its Raised table, the Discounts page and the application repository, and checked the suite with `tcs:validate` and `trace validate`.

- **A fresh scan on an open sale's cart (Q27), unblocked and agreed** - US4-TC11-1 walks `grade10-site-store-discounts-SC-30` at 12 and at 59 minutes after the plan, inside the sale's hour; the block recorded above is cleared
- **A fresh scan on a retired sale's cart, agreed** - US4-TC8-1's third row scans the member onto the cart of a sale a newer promise retired, which the requirement refuses as a closed sale carrying a reward's code
- **Another member's fresh scan (Q30), rewritten to the page** - US4-TC12-1 read only that nothing lands on the open sale. Step 6 of the Discounts page refuses an apply while another customer is on the cart, so step 3 is refused saying so. It takes `g10.store-discounts.TC-f3f`
- **Uncovered anchors** - none

**Run:** QA2, 2026-10-07, tcs-rules r4, in a fresh context after accept-review settled Raised R5 as Q31. It read this suite, the delta, `tech-design.md`, `decisions.md` with its Raised table, the Discounts and Coupons pages and the application repository's till apply, and checked the suite with `validate:changes`, `tcs:validate` and `trace validate`. No anchor moved and the delta did not change.

- **A fresh scan on a closed sale's cart that carries no reward's code (Q31), settled as built** - the run above raised it as R5. The requirement refuses a fresh scan only on a closed sale whose cart carries a reward's code, and the extension's apply takes the closed sale's gift lines and points off before it plans (`acts/flow.ts:1085-1089`, `:646-651`), so no gift's line stays beside the new sale. No scenario states it and no case walks it; a cart tendered without a new apply is US3-TC9-1's and US4-TC6-1's
- **Uncovered anchors** - none
