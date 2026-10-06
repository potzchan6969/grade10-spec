# grade10-site/store/membership Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-membership-US2: Member identifies and spends at the till

**As a** member,
**I want** a dynamic code or my email to identify me, and staff to spend my points once,
**so that** a replayed code is refused, a miss discloses nothing, points settle once whether paid online or at the till, and the sale and the paid order show my points as money taken off.

<!-- trace:case id=g10.store-membership.TC-vqd rev=2 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC1-2: Paid online order debits the balance once, by what the shop applied

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* customer(member) is <member_1>, with <order_1> unpaid at the online checkout.
* <order_1>'s points discount was written under <title>.
* The shop is set to apply <applied> of <order_1>'s points discount.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods, worth HK$1 a point |
| <order_1> | An unpaid online order of <member_1>'s carrying a points promise of <points ask_1> |
| <applied_1> | A points amount below <points ask_1> |
| <new title> | Deduction from Points, the title a points discount promised after the switch carries |
| <older title> | Points, the title a draft written before the switch carries |

| <title> | <applied> | Balance falls by |
| --- | --- | --- |
| <new title> | all of <points ask_1> | <points ask_1> |
| <new title> | <applied_1> | <applied_1> |
| <older title> | all of <points ask_1> | <points ask_1> |

**Steps:**

1. Open <grade10 membership url> and note the balance.
2. Open <order_1>'s invoice link.
3. Read the discounts on the invoice page.
4. Pay <order_1>.
5. Open the paid order in the staging shop's admin.
6. Open <grade10 membership url> again.

**Expected Results:**

* Step 3 shows one order discount titled <title>, taking HK$ <points ask_1>.
* Step 5 shows that discount titled <title>, taking HK$ <applied>.
* Step 6's balance is step 1's less the row's amount.
* Activity lists one Points put toward a purchase entry.

<!-- trace:case id=g10.store-membership.TC-pu7 rev=2 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC10-2: Paid till sale debits the balance once, by what the cart took

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) has <till session_1> open, the sale holding <line_1> with <points ask_1> redeemed.
* The sale's points discount was written under <title>, the way the row states.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <line_1> | A product line for sale |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods, worth HK$1 a point |
| <new title> | Deduction from Points, the title a points discount applied after the switch carries |
| <older title> | Points, the title a points discount applied before the switch carries |

| <title> | How it reached the cart |
| --- | --- |
| <new title> | Applied from the member's panel after the switch |
| <older title> | Applied before the switch, then the sale parked and resumed |

**Steps:**

1. Open <grade10 membership url> as <member_1> and note the balance.
2. Read the discounts on the sale's cart in Shopify POS.
3. Tender the sale.
4. Read the sale's receipt.
5. Open the paid order in the staging shop's admin.
6. Open <grade10 membership url> again.

**Expected Results:**

* Step 2 shows one order discount titled <title>, taking HK$ <points ask_1>.
* Step 4's receipt prints the discount titled <title>.
* Step 5 shows that discount titled <title>.
* Step 6's balance is step 1's less the discount's amount.
* Activity lists one Points put toward a purchase entry.

<!-- trace:case id=g10.store-membership.TC-ugc rev=2 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC2-2: Points discount and reward coupon apply to one sale together

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
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) has <till session_1> open, the sale holding <line_1>.
* customer(member) is <member_1>, holding <reward coupon_1>.
* No other discount is on the sale.
* No automatic discount is active at the shop.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <line_1> | A product line for sale |
| <reward coupon_1> | A product coupon <member_1> redeemed from a reward, taking an amount off <line_1> |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods |

**Steps:**

1. Choose <points ask_1> and <reward coupon_1> in the member's panel.
2. Tap Apply.
3. Read the discounts on the sale.

**Expected Results:**

* The sale carries <reward coupon_1> and the points discount together.
* Neither is refused for the other's presence.

<!-- trace:case id=g10.store-membership.TC-x48 rev=2 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC3-2: Points ask above the order total is trimmed, not refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* customer(member) is <member_1>, on <grade10 checkout url> with <line_1> in the cart.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <line_1> | A product line for sale |
| <points ask_2> | A points amount above the order's goods, within <member_1>'s balance |

**Steps:**

1. Ask for <points ask_2>.
2. Submit the checkout.
3. Pay the order.

**Expected Results:**

* Step 2 trims the points discount to the order, refusing nothing.
* Step 3 completes the purchase at the trimmed amount.

<!-- trace:case id=g10.store-membership.TC-6ik rev=2 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC9-2: Abandoned online checkout leaves the points balance untouched

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* customer(member) is <member_1>, with <order_1> unpaid at the online checkout.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods |
| <order_1> | An unpaid online order of <member_1>'s carrying a points promise of <points ask_1> |
| <promise life> | 1 hour, the life of an unpaid promise |

**Steps:**

1. Open <grade10 membership url> and note the balance.
2. Leave <order_1> unpaid past <promise life>.
3. Open <grade10 membership url> again.

**Expected Results:**

* Step 3's balance matches step 1's.
* Activity lists no Points put toward a purchase entry.

<!-- trace:case id=g10.store-membership.TC-0ms rev=2 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC11-2: Spend undone at the till before tender debits nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) has <till session_1> open, the sale holding <line_1> with <points ask_1> redeemed.
* The sale's points discount was written under <title>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <line_1> | A product line for sale |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods, worth HK$1 a point |
| <new title> | Deduction from Points, the title a points discount applied after the switch carries |
| <older title> | Points, the title a points discount applied before the switch carries |

| <title> |
| --- |
| <new title> |
| <older title> |

**Steps:**

1. Open <grade10 membership url> as <member_1> and note the balance.
2. Open the Grade10 extension on the sale.
3. Tap 全部移除 under 此單項目.
4. Read the discounts on the sale's cart in Shopify POS.
5. Tender the sale.
6. Open <grade10 membership url> again.

**Expected Results:**

* Step 4 shows no discount titled <title>.
* Step 6's balance matches step 1's.
* Activity lists no Points put toward a purchase entry.

<!-- trace:case id=g10.store-membership.TC-bz3 rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC12-1: Points discount is found under either title in any letter case

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
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* customer(member) is <member_1>, with <order_2> unpaid through <channel>.
* The shop's paid order for <order_2> is stubbed to title its points discount <written title>, taking all of <points ask_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods, worth HK$1 a point |
| <order_2> | An unpaid order of <member_1>'s carrying a points promise of <points ask_1> |

| <channel> | <written title> |
| --- | --- |
| The online checkout | deduction from points |
| The online checkout | POINTS, with a space before and after |
| A till sale | DEDUCTION FROM POINTS, with a space before and after |
| A till sale | points |

**Steps:**

1. Open <grade10 membership url> and note the balance.
2. Pay <order_2>.
3. Open <grade10 membership url> again.

**Expected Results:**

* Step 3's balance is step 1's less <points ask_1>.
* Activity lists one Points put toward a purchase entry.

<!-- trace:case id=g10.store-membership.TC-sk6 rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC13-1: Discount under a near-miss title is never read as points

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
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* customer(member) is <member_1>, with <order_2> unpaid through <channel>.
* The shop's paid order for <order_2> is stubbed to carry one order discount titled <written title>, taking HK$ <points ask_1>, and no other order discount.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods, worth HK$1 a point |
| <order_2> | An unpaid order of <member_1>'s carrying a points promise of <points ask_1> |

| <channel> | <written title> |
| --- | --- |
| The online checkout | Points discount |
| A till sale | Deduction |

**Steps:**

1. Open <grade10 membership url> and note the balance.
2. Pay <order_2>.
3. Open <grade10 membership url> again.

**Expected Results:**

* Step 3's balance matches step 1's.
* Activity lists no Points put toward a purchase entry.

<!-- trace:case id=g10.store-membership.TC-pgb rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC14-1: Staff discount keyed under either points title refuses Apply

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
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) has <till session_1> open, the sale holding <line_1>.
* Staff keyed a custom order discount titled <keyed title> on the sale in Shopify POS.
* The sale carries no Grade10 order id.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <line_1> | A product line for sale |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods |
| <reward coupon_1> | A product coupon <member_1> redeemed from a reward, taking an amount off <line_1> |

| <keyed title> | <chosen> |
| --- | --- |
| Deduction from Points | <points ask_1> |
| Points | <points ask_1> |
| Deduction from Points | <reward coupon_1> alone, no points |
| Points | <reward coupon_1> alone, no points |

**Steps:**

1. Choose <chosen> in the member's panel.
2. Tap Apply.
3. Read the discounts on the sale's cart in Shopify POS.

**Expected Results:**

* Step 2 refuses Apply, telling staff to remove the other discount first.
* Step 3 shows only the discount staff keyed, unchanged.

<!-- trace:case id=g10.store-membership.TC-64i rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC15-1: Points discount title stays English in every site language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* customer(member) is <member_1>, signed in, with <line_1> in the cart.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <line_1> | A product line for sale, priced above <points ask_1> |
| <points ask_1> | A points amount below both <member_1>'s balance and <line_1>'s price |
| <new title> | Deduction from Points |

| <lang> |
| --- |
| English, the site's default |
| Traditional Chinese, under /tc |

**Steps:**

1. Open <grade10 checkout url> in <lang>.
2. Enter <points ask_1> in the points field.
3. Submit the checkout.
4. Read the discounts on the invoice page.

**Expected Results:**

* Step 1 shows the checkout in <lang>.
* Step 4 shows one order discount titled <new title>, in English.

<!-- trace:case id=g10.store-membership.TC-ngy rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC16-1: Resumed sale carrying the older title takes the new title when applied again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) parked <sale_1> before the switch, holding <line_1> with <points ask_1> applied under <older title>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <sale_1> | A parked sale at <shop_1> for <member_1>, carrying the store's order id |
| <line_1> | A product line for sale |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods, worth HK$1 a point |
| <new title> | Deduction from Points, the title the till writes after the switch |
| <older title> | Points, the title the till wrote before the switch |

**Steps:**

1. Open <grade10 membership url> as <member_1> and note the balance.
2. Resume <sale_1> in Shopify POS.
3. Open the Grade10 extension and scan <member_1>'s member card.
4. Choose <points ask_1> in the member's panel.
5. Tap Apply.
6. Read the discounts on the sale's cart in Shopify POS.
7. Tender the sale.
8. Open <grade10 membership url> again.

**Expected Results:**

* Step 6 shows one order discount titled <new title>, taking HK$ <points ask_1>, and none titled <older title>.
* Step 8's balance is step 1's less <points ask_1>.
* Activity lists one Points put toward a purchase entry.

## Settled

- Order Details' points row keeps its label and shows for an order paid under either title, because it finds the order's points discount through the same title check settlement uses
- A parked sale carrying "Points" and applied again takes the title the till writes now, because Apply takes the sale's own points discount off under either title before it writes
- A discount staff keyed under a points title on a sale the till never marked refuses a coupon-only Apply as well as a points spend, because the order id Apply writes would make it read as the member's

## Reconciliation

- **Raised, landed** — the blind pass asked two questions, each landed in `decisions.md`: whether Order Details' points row changes (Q5: no, and it shows under either title; the row is Order Details' own, so no case here), and which title a resumed "Points" sale takes when staff apply again (Q6: "Deduction from Points"). Q6 is folded as `grade10-site-store-membership-SC-86` and walked by US2-TC16. The second QA2 pass raised one more, landed as Q7 below; nothing is left for the human
- **Folded** — three blind cases carried behaviour no scenario stated; each is real and on the PRD, and each is now in the delta:
  - US2-TC13, a near-miss title never read as points: Store Discounts' settlement step, and grade10 `packages/grade10-store/contracts/test/saleMarks.test.ts` refuses "Deduction" and "Points off" → `grade10-site-store-membership-SC-84` and a sentence on the requirement
  - US2-TC14, a points title staff keyed on a sale the till never marked refusing the spend: Store Discounts' Apply refusals, and grade10 `integrations/shopify-pos/grade10/src/acts/spend.ts` `foreignCartDiscount` → `grade10-site-store-membership-SC-85` and a sentence on the requirement
  - US2-TC15, the title staying English in every site language: Q2 → an AND line on `grade10-site-store-membership-SC-81`
- **Folded from the implementation** — US2-TC14 and `grade10-site-store-membership-SC-85` refused only a points spend over a points title staff keyed, and Store Discounts said a coupon alone is not refused. The till refuses a coupon-only Apply there too, because the order id Apply writes would make the keyed discount read as the member's (grade10 `integrations/shopify-pos/grade10/src/acts/spend.ts:343`, tested at `spend.test.ts:562`). Q7 corrects the page, the requirement's sentence and `grade10-site-store-membership-SC-85`; US2-TC14 gains two coupon-only rows and task 1.6 cites both titles
- **Revised** — US2-TC1, US2-TC10 and US2-TC11 now assert the title on the invoice, the cart, the receipt and the paid order under both titles, so each moves to revision 2, and their covers name the six scenarios this change adds. US2-TC12 gains the surrounding spaces `grade10-site-store-membership-SC-83` names. US2-TC15's first result read a URL from a row that named no address; it now reads the site's language. US2-TC2, US2-TC3 and US2-TC9 move to revision 2, naming the points discount by its role rather than the older title, and every revised case names the Activity entry by its label, Points put toward a purchase
- **Contradicted** — none: where a case and a scenario state the same behaviour they agree
- **Scenarios walked** — `grade10-site-store-membership-SC-81` by US2-TC1 online, US2-TC10 at the till with its receipt, US2-TC15 in each language, and `grade10-site-store-e2e-US4-TC1-2` beside a product coupon; `grade10-site-store-membership-SC-82` by US2-TC10's older-title row, held through tender, and US2-TC11, stripped under either title; `grade10-site-store-membership-SC-83` by US2-TC1's older-title row and US2-TC12; `grade10-site-store-membership-SC-84` by US2-TC13; `grade10-site-store-membership-SC-85` by US2-TC14, a points spend and a coupon alone under each title; `grade10-site-store-membership-SC-86` by US2-TC16
- **Out of suite** — `grade10-site-store-membership-SC-82`'s lowercase "points" on a marked sale, and the discount coming off before the order id: neither shows at the counter, so the till extension's tests that task 1.6 cites decide them, grade10 `integrations/shopify-pos/grade10/src/acts/flow.test.ts`
- **Carried, not this change's** — `grade10-site-store-membership-SC-16`, `grade10-site-store-membership-SC-72` and `grade10-site-store-membership-SC-73` are carried word for word; US2-TC3, US2-TC2 and US2-TC9 walk them, and US2-TC1, US2-TC10 and US2-TC11 walk `grade10-site-store-membership-SC-73` again under both titles
- **Cases added after the reconciliation** — US2-TC16, written from Q6 and `grade10-site-store-membership-SC-86`, so it is not blind

**Run:** QA2 reconciliation on 2026-10-06 for `name-points-discount-deduction`, `grade10-site/store/membership`, run twice; the second pass, in a fresh context, re-read each case and scenario against US-02 and the feature set's Points discount group. Read this suite, the change's `domain-tcs.md`, the delta `spec.md` and `user-journeys.md`, the proposal, `decisions.md`, `tech-design.md`, `tasks.md`, the durable membership spec, suite and store `domain-tcs.md`, the PRD pages Paying with Points, Shopify Integration, Store Discounts and Order Details, and grade10 `packages/grade10-store/contracts/src/saleMarks.ts`, `integrations/shopify-pos/grade10/src/acts/spend.ts` and `flow.ts`. The blind pass left no Run line, so what it read is not recorded.
