# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-e2e-US4: Member pays at the till with points and a coupon together

**As a** member,
**I want** staff to take my points and my product coupon off one sale,
**so that** both settle once, when I pay.

### grade10-site-store-e2e-US4-TC1-2: Points and a product coupon settle together on one till sale

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
| <points title> | Deduction from Points, the title the points discount is written under |

**Steps:**

1. Choose <points> points and <product coupon_1> in the member's panel.
2. Tap Apply.
3. Tender the sale.
4. Open the paid order in the staging shop's admin.

**Expected Results:**

* Step 2 puts both on the sale, neither refused for the other.
* The paid order shows a discount titled <points title> taking HK$100.00.
* The paid order shows <product coupon_1>'s code taking HK$50.00.
* The balance drops by exactly <points>, and <product coupon_1> reads spent.
