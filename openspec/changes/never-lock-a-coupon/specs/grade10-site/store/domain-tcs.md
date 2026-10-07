# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-e2e-US4: Member pays at the till with points and a coupon together

**As a** member,
**I want** staff to take my points and my product coupon off one sale,
**so that** both settle once, when I pay.

<!-- trace:case id=g10.store-domain.TC-gdu rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-u06,g10.store-membership.SC-wrc,g10.store-membership.SC-uaf,g10.store-membership.SC-a70,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-fc9,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
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

## Reconciliation

**Run:** 2026-10-07 · carried US4-TC1-1 with its id, revision and words, so its marker names every scenario that serves `grade10-site-store-discounts-US-04` in this change; the path it walks is unchanged.
