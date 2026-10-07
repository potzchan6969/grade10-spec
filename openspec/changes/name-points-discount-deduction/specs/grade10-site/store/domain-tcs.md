# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-e2e-US4: Member pays at the till with points and a coupon together

**As a** member,
**I want** staff to take my points and my product coupon off one sale,
**so that** both settle once, when I pay.

<!-- trace:case id=g10.store-domain.TC-gdu rev=2 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-u06,g10.store-membership.SC-wrc,g10.store-membership.SC-uae,g10.store-membership.SC-a70,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-fc9,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
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

## Reconciliation

**Run:** 2026-10-07 · US4-TC1-2 carries never-lock-a-coupon's US4-TC1-1, so its marker names every scenario that serves `grade10-site-store-discounts-US-04` in that change, the thirteen it covers; it had named only the three the durable suite covers. It adds this change's points-title scenarios serving `grade10-site-store-membership-US-02`, and covers `g10.store-membership.SC-uae`, the durable id of `grade10-site-store-membership-SC-77`. The path it walks is unchanged.
