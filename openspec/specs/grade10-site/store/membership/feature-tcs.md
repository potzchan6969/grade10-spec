# grade10-site/store/membership Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-membership-US1: Collector becomes a member without waiting on commerce

**As a** collector,
**I want** my account created even when the commerce provider is down,
**so that** pairing completes on its own, a lost response does not duplicate me, and erasure cannot resurrect the customer.

### grade10-site-store-membership-US1-TC1-1: Customer record carries the opaque key, never the account id

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-01

**Pre-conditions:**

* customer(member) is <member>.
* The commerce provider answers.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <member_2> | A member with a verified email address, not yet paired with a commerce customer |

| <member> | Pairing |
| --- | --- |
| <member_1> | updates the customer record |
| <member_2> | creates the customer record |

**Steps:**

1. Let pairing write <member>'s customer record as the row states.
2. Read that customer record at the provider.

**Expected Results:**

* The record carries <member>'s opaque membership key.
* The record carries no platform account identifier.

### grade10-site-store-membership-US1-TC2-1: Account created by a purchase pairs with that purchase's customer

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
* **Trace:** grade10-site-store-membership-US-01

**Pre-conditions:**

* customer(guest) is on <grade10 checkout url>, not signed in.

**Test data:**

| Field | Value |
| --- | --- |
| <unused email_1> | An email address belonging to no account |

**Steps:**

1. Check out with <unused email_1>.
2. Pay the order.
3. Read the pairing of the account created for <unused email_1>.

**Expected Results:**

* An account for <unused email_1> exists once step 2 pays.
* That account pairs with the customer record the purchase made.

### grade10-site-store-membership-US1-TC3-1: Sign-up completes while the commerce provider is unreachable

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-01

**Pre-conditions:**

* customer(collector with no account) is on <grade10 sign-up url>.
* The commerce provider is made unreachable.

**Test data:**

| Field | Value |
| --- | --- |
| <unused email_1> | An email address belonging to no account |

**Steps:**

1. Register with <unused email_1>.
2. Verify <unused email_1>.
3. Make the commerce provider reachable again.
4. Read the new member's commerce customer at the provider.

**Expected Results:**

* Step 1 creates the account without waiting on the provider.
* Step 2 leaves the account usable at once.
* Step 4 finds the member paired, nobody re-running pairing.

### grade10-site-store-membership-US1-TC4-1: Retry after a lost response lands on the same customer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-01

**Pre-conditions:**

* customer(member) is <member_2>.
* The provider is made to drop its response to <member_2>'s customer creation, after creating the customer.

**Test data:**

| Field | Value |
| --- | --- |
| <member_2> | A member with a verified email address, not yet paired with a commerce customer |

**Steps:**

1. Let pairing create <member_2>'s customer record.
2. Let pairing retry.
3. Read the provider's customer records for <member_2>.

**Expected Results:**

* The retry lands on the customer record step 1 created.
* No second customer record exists for <member_2>.

### grade10-site-store-membership-US1-TC5-1: Email already on another member's customer parks visibly

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-01

**Pre-conditions:**

* admin(operator) is on <grade10 admin console url>.
* Pairing has run for <member_3> and could not complete.

**Test data:**

| Field | Value |
| --- | --- |
| <member_3> | A member with a verified email address, not yet paired, whose email address is on <member_4>'s commerce customer |
| <member_4> | A member paired with a commerce customer |

**Steps:**

1. Open the pairing conflicts.
2. Re-run <member_3>'s pairing.
3. Read the count of unpaired members and the oldest one's age.

**Expected Results:**

* Step 1 lists <member_3> parked in a conflict.
* Step 3's unpaired count includes <member_3>, with the oldest age.

### grade10-site-store-membership-US1-TC6-1: Guest checkout with an unverified member's email adopts nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-01

**Pre-conditions:**

* customer A(member who never verified their email) is <member_5>.
* customer B(guest) is on <grade10 checkout url>, not signed in.

**Test data:**

| Field | Value |
| --- | --- |
| <member_5> | A member who already existed and never verified their email address |

**Steps:**

1. Check out as customer B with <member_5>'s email address.
2. Pay the order.
3. Read <member_5>'s pairing.

**Expected Results:**

* Step 2's order is paid.
* <member_5> is not paired with that purchase's customer record.

### grade10-site-store-membership-US1-TC7-1: Crash mid-erasure finishes removal without re-creating the customer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-01

**Pre-conditions:**

* customer(member) is <member_1>, signed in.
* Erasure is made to fail after the provider removes <member_1>'s customer record, before it finishes.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |

**Steps:**

1. Delete <member_1>'s account.
2. Let automatic pairing repair run.
3. Read the provider's customer records for <member_1> once erasure finishes.

**Expected Results:**

* The removal is retried to completion.
* Step 2 re-creates no customer record for <member_1>.

### grade10-site-store-membership-US1-TC8-1: Customer created by a retry racing erasure is removed

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-01

**Pre-conditions:**

* customer(member) is <member_2>, signed in.
* Pairing for <member_2> is retrying.

**Test data:**

| Field | Value |
| --- | --- |
| <member_2> | A member with a verified email address, not yet paired with a commerce customer |

**Steps:**

1. Delete <member_2>'s account.
2. Let the pairing retry create <member_2>'s customer record while erasure completes.
3. Read the provider's customer records for <member_2>.

**Expected Results:**

* The customer record step 2 created is found and removed.

---

## grade10-site-store-membership-US2: Member identifies and spends at the till

**As a** member,
**I want** a dynamic code or my email to identify me, and staff to spend my points once,
**so that** a replayed code is refused, a miss discloses nothing, and points settle once whether paid online or at the till.

### grade10-site-store-membership-US2-TC1-1: Paid online order debits the balance once, by what the shop applied

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* customer(member) is <member_1>, with <order_1> unpaid at the online checkout.
* The shop is set to apply <applied> of <order_1>'s Points discount.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods |
| <order_1> | An unpaid online order of <member_1>'s carrying a Points promise of <points ask_1> |
| <applied_1> | A points amount below <points ask_1> |

| <applied> | Balance falls by |
| --- | --- |
| all of <points ask_1> | <points ask_1> |
| <applied_1> | <applied_1> |

**Steps:**

1. Open <grade10 membership url> and note the balance.
2. Pay <order_1>.
3. Open <grade10 membership url> again.

**Expected Results:**

* Step 3's balance is step 1's less the row's amount.
* Activity lists one Points put toward a purchase entry.

### grade10-site-store-membership-US2-TC10-1: Paid till sale debits the balance once, by what the cart took

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

* admin(shop staff) has <till session_1> open, the sale holding <line_1> with <points ask_1> redeemed.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <line_1> | A product line for sale |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods |

**Steps:**

1. Open <grade10 membership url> as <member_1> and note the balance.
2. Tender the sale.
3. Open <grade10 membership url> again.

**Expected Results:**

* Step 3's balance is step 1's less the sale's Points discount.
* Activity lists one Points put toward a purchase entry.

### grade10-site-store-membership-US2-TC2-1: Points discount and reward coupon apply to one sale together

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

* The sale carries <reward coupon_1> and the Points discount together.
* Neither is refused for the other's presence.

### grade10-site-store-membership-US2-TC3-1: Points ask above the order total is trimmed, not refused

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

* Step 2 trims the Points discount to the order, refusing nothing.
* Step 3 completes the purchase at the trimmed amount.

### grade10-site-store-membership-US2-TC4-1: Typed email lookup is recorded with staff and location labels

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) is on <shop_1>'s till, claiming <staff label_1> and <location label_1>.
* customer(member) is <member_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <staff label_1> | The staff label claimed at <shop_1>'s till |
| <location label_1> | The location label claimed for <shop_1>'s till |

**Steps:**

1. Identify <member_1> by typing their exact email address.
2. Read the lookups recorded for <member_1>.

**Expected Results:**

* One lookup is recorded with <staff label_1> and <location label_1>.
* It records that <member_1> was identified by typed email.

### grade10-site-store-membership-US2-TC5-1: Disabled membership surface still lets the till complete sales

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

* admin A(store manager) is on <grade10 admin console url>.
* admin B(shop staff) is on <shop_1>'s till, the sale holding <line_1> and <member_1>'s commerce customer.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <line_1> | A product line for sale |

**Steps:**

1. Turn off the Terminal enabled switch for <shop_1>, as admin A.
2. Tender the sale, as admin B.
3. Open <grade10 membership url> as <member_1>.

**Expected Results:**

* Step 2 completes as a normal sale.
* Activity shows Points earned for the sale.

### grade10-site-store-membership-US2-TC6-1: Stopping email-assisted spending leaves card spending and email lookup

**Classification:**

* **Severity:** major
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

* admin A(store manager) is on <grade10 admin console url>.
* admin B(shop staff) is on <shop_1>'s till, the sale holding <line_1>.
* customer(member) is <member_1>, showing <code_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <line_1> | A product line for sale |
| <code_1> | An unused identification code on <member_1>'s member card |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods |

**Steps:**

1. Turn off the Email spend switch for <shop_1>, as admin A.
2. Scan <code_1>, as admin B.
3. Redeem <points ask_1> against the sale.
4. Identify <member_1> by typing their exact email address.

**Expected Results:**

* Step 3 puts <points ask_1> Points off the sale.
* Step 4 still finds <member_1> and reads their membership.

### grade10-site-store-membership-US2-TC7-1: Replayed identification code is refused, naming its first use

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
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) is on <shop_1>'s till.
* customer(member) is <member_1>, showing <code_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <code_1> | An unused identification code on <member_1>'s member card |

**Steps:**

1. Scan <code_1>.
2. Scan <code_1> again.
3. Open <member_1>'s member card on <grade10 membership url>.

**Expected Results:**

* Step 2 is refused, naming <shop_1> and the first use's time.
* Step 3's card shows the same.

### grade10-site-store-membership-US2-TC8-1: Email lookup miss discloses only that no member was found

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
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) is on <shop_1>'s till.

**Test data:**

| Field | Value |
| --- | --- |
| <shop_1> | A physical store running the Grade10 till |
| <unused email_1> | An email address belonging to no account |
| <member_2> | A member with a verified email address, not yet paired with a commerce customer |

**Steps:**

1. Identify a member by typing <unused email_1>.
2. Identify a member by typing <member_2>'s email address.
3. Compare the two answers.

**Expected Results:**

* Both answers say only that no member was found.
* The two answers are identical.

### grade10-site-store-membership-US2-TC9-1: Abandoned online checkout leaves the points balance untouched

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
| <order_1> | An unpaid online order of <member_1>'s carrying a Points promise of <points ask_1> |
| <promise life> | 1 hour, the life of an unpaid promise |

**Steps:**

1. Open <grade10 membership url> and note the balance.
2. Leave <order_1> unpaid past <promise life>.
3. Open <grade10 membership url> again.

**Expected Results:**

* Step 3's balance matches step 1's.
* Activity lists no Points put toward a purchase entry.

### grade10-site-store-membership-US2-TC11-1: Spend undone at the till before tender debits nothing

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

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <line_1> | A product line for sale |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods |

**Steps:**

1. Open <grade10 membership url> as <member_1> and note the balance.
2. Undo the spend on the sale before tender.
3. Open <grade10 membership url> again.

**Expected Results:**

* Step 3's balance matches step 1's.
* Activity lists no Points put toward a purchase entry.

---

## grade10-site-store-membership-US3: Member's in-store order earns through attribution

**As a** member,
**I want** a physical-store order recorded once and attributed by evidence,
**so that** a sale before I registered is not lost, two claimers cannot both win, and a gift card earns nothing.

### grade10-site-store-membership-US3-TC1-1: Guest sale before registration is attributed with evidence and earns

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
* **Trace:** grade10-site-store-membership-US-03

**Pre-conditions:**

* admin(operator) is on <grade10 admin console url>.
* <till order_1> was paid as a guest sale before <member_6> registered.

**Test data:**

| Field | Value |
| --- | --- |
| <shop_1> | A physical store running the Grade10 till |
| <till order_1> | A paid guest sale at <shop_1>, recorded with no owner and no customer on the sale |
| <member_6> | A member who registered after <till order_1> was paid |
| <evidence_1> | What the operator saw tying <till order_1> to <member_6> |
| <earning_1> | <till order_1>'s qualifying goods at 1 point per $10, times <member_6>'s tier multiplier |

**Steps:**

1. Open <till order_1>.
2. Attribute <till order_1> to <member_6> with <evidence_1>.
3. Open <grade10 membership url> as <member_6>.

**Expected Results:**

* Step 2's claim records <evidence_1>.
* Activity shows <earning_1> Points earned for <till order_1>.

### grade10-site-store-membership-US3-TC2-1: Same till order by webhook and sweep is recorded once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-03

**Pre-conditions:**

* <provider order_1> is paid at the commerce provider.

**Test data:**

| Field | Value |
| --- | --- |
| <shop_1> | A physical store running the Grade10 till |
| <provider order_1> | A sale paid at <shop_1>'s till, not yet recorded |

**Steps:**

1. Deliver <provider order_1>'s paid webhook.
2. Run the sweep over <provider order_1>.
3. Read the orders recorded for <provider order_1>.

**Expected Results:**

* Exactly one order is recorded for <provider order_1>.

### grade10-site-store-membership-US3-TC3-1: Platform's own checkout order is not recorded a second time

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-03

**Pre-conditions:**

* <web order_1> is already recorded.

**Test data:**

| Field | Value |
| --- | --- |
| <web order_1> | A paid order the platform's own checkout created |

| <carrier> | Records for <web order_1> |
| --- | --- |
| a webhook | one |
| the sweep | one |

**Steps:**

1. Deliver <web order_1> by <carrier>.
2. Read the orders recorded for <web order_1>.

**Expected Results:**

* No second record is created for <web order_1>.

### grade10-site-store-membership-US3-TC7-1: Duplicate refund on an ownerless order lands once on attribution

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
* **Trace:** grade10-site-store-membership-US-03

**Pre-conditions:**

* admin(operator) is on <grade10 admin console url>.

**Test data:**

| Field | Value |
| --- | --- |
| <shop_1> | A physical store running the Grade10 till |
| <till order_1> | A paid guest sale at <shop_1>, recorded with no owner and no customer on the sale |
| <member_6> | A member who registered after <till order_1> was paid |
| <evidence_1> | What the operator saw tying <till order_1> to <member_6> |
| <refund_1> | A refund of part of <till order_1>'s goods |

**Steps:**

1. Deliver <refund_1> twice.
2. Attribute <till order_1> to <member_6> with <evidence_1>.
3. Read <till order_1>'s refunds and <member_6>'s Activity.

**Expected Results:**

* <refund_1> is recorded once.
* Step 2 applies <refund_1> to <member_6>.

### grade10-site-store-membership-US3-TC4-1: Gift card bought online earns no points

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
* **Trace:** grade10-site-store-membership-US-03

**Pre-conditions:**

* customer(member) is <member_1>, with <gift card order_1> unpaid at the online checkout.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <line_1> | A product line for sale |
| <gift card line_1> | A gift card line |
| <gift card order_1> | An online order of <member_1>'s holding <gift card line_1> and <line_1> |

**Steps:**

1. Pay <gift card order_1>.
2. Read the earning priced for <gift card order_1>.

**Expected Results:**

* <gift card line_1>'s amount earns no points.

### grade10-site-store-membership-US3-TC9-1: Gift card sold at the till earns no points

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
* **Trace:** grade10-site-store-membership-US-03

**Pre-conditions:**

* admin(shop staff) is on <shop_1>'s till, the sale holding <gift card line_1>, <line_1> and <member_1>'s commerce customer.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <line_1> | A product line for sale |
| <gift card line_1> | A gift card line |

**Steps:**

1. Tender the sale.
2. Read the earning priced for the sale.

**Expected Results:**

* <gift card line_1>'s amount earns no points.

### grade10-site-store-membership-US3-TC5-1: Points spent at the till lower that sale's earning

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
* **Trace:** grade10-site-store-membership-US-03

**Pre-conditions:**

* admin(shop staff) has <till session_1> open, the sale holding <line_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <line_1> | A product line for sale |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods |

**Steps:**

1. Redeem <points ask_1> against the sale.
2. Tender the sale.
3. Read the earning priced for the sale.

**Expected Results:**

* Earning is priced on <line_1>'s amount less <points ask_1>.

### grade10-site-store-membership-US3-TC6-1: Racing attributions leave one live claim, refusing the other

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
* **Trace:** grade10-site-store-membership-US-03

**Pre-conditions:**

* admin A(operator) and admin B(operator) are on <grade10 admin console url>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till order_1> | A paid guest sale at <shop_1>, recorded with no owner and no customer on the sale |
| <member_6> | A member who registered after <till order_1> was paid |

**Steps:**

1. Attribute <till order_1> to <member_6> as admin A and to <member_1> as admin B, concurrently.
2. Read the claims on <till order_1>.

**Expected Results:**

* Exactly one claim lives.
* The other attribution is refused, naming the claim's holder.

### grade10-site-store-membership-US3-TC8-1: Revoked claim claws back points, re-attribution earns correctly

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
* **Trace:** grade10-site-store-membership-US-03

**Pre-conditions:**

* admin(operator) is on <grade10 admin console url>.

**Test data:**

| Field | Value |
| --- | --- |
| <shop_1> | A physical store running the Grade10 till |
| <till order_2> | A paid sale at <shop_1>, wrongly attributed to <member_7> |
| <member_7> | A member holding the points <till order_2>'s claim granted |
| <member_8> | The member <till order_2> truly belongs to |
| <evidence_2> | What the operator saw tying <till order_2> to <member_8> |
| <earning_2> | <till order_2>'s qualifying goods at 1 point per $10, times <member_8>'s tier multiplier |

**Steps:**

1. Revoke <member_7>'s claim on <till order_2>.
2. Attribute <till order_2> to <member_8> with <evidence_2>.
3. Read <member_7>'s and <member_8>'s Activity.

**Expected Results:**

* Step 1 claws back the points <till order_2> granted <member_7>.
* <member_8>'s Activity shows <earning_2> Points earned for <till order_2>.

---

## grade10-site-store-membership-US4: Member is told once a staff-assisted spend or coupon lands at the till

**As a** member,
**I want** to be notified once a staff-assisted spend or coupon at the till actually lands, not while it is still a claim that could be trimmed or walked away from,
**so that** my phone stays the record of what actually happened, without ever showing the code.

### grade10-site-store-membership-US4-TC1-1: Applied till spend notifies the member before tender, without the code

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-04

**Pre-conditions:**

* admin(shop staff) has <till session_1> open, the sale holding <line_1>.
* customer(member) is <member_1>, with notices reaching their phone.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <line_1> | A product line for sale |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods |

**Steps:**

1. Choose <points ask_1> in the member's panel.
2. Tap Apply.
3. Check <member_1>'s phone before tender.

**Expected Results:**

* Step 3 finds a notice.
* It names the points, the amount and <shop_1>'s location.
* It carries no code.

### grade10-site-store-membership-US4-TC4-1: Paid till sale notifies the member of a coupon without the code

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
* **Trace:** grade10-site-store-membership-US-04

**Pre-conditions:**

* admin(shop staff) has <till session_1> open, the sale holding <line_1>.
* customer(member) is <member_1>, holding <reward coupon_1>, with notices reaching their phone.
* The till's report of what landed after Apply is blocked.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <line_1> | A product line for sale |
| <reward coupon_1> | A product coupon <member_1> redeemed from a reward, taking an amount off <line_1> |

**Steps:**

1. Choose <reward coupon_1> in the member's panel.
2. Tap Apply.
3. Tender the sale.
4. Check <member_1>'s phone.

**Expected Results:**

* A notice arrives after the paid order.
* It names the points, the amount and <shop_1>'s location.
* It carries no code.

### grade10-site-store-membership-US4-TC2-1: Same spend submitted twice records one redemption

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
* **Trace:** grade10-site-store-membership-US-04

**Pre-conditions:**

* admin(shop staff) has <till session_1> open, the sale holding <line_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <line_1> | A product line for sale |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods |

**Steps:**

1. Submit the spend of <points ask_1> twice in quick succession.
2. Read the redemptions recorded for <till session_1>.

**Expected Results:**

* Exactly one redemption is recorded.
* Both submissions answer the same.

### grade10-site-store-membership-US4-TC3-1: Landed notice is corrected when the sale is never paid

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-04

**Pre-conditions:**

* admin(shop staff) has <till session_1> open, with <points ask_1> applied to the sale.
* <member_1> was notified the spend landed.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods |
| <promise life> | 1 hour, the life of an unpaid promise |

**Steps:**

1. Walk away from the sale without tender.
2. Wait past <promise life>.
3. Check <member_1>'s phone.

**Expected Results:**

* <member_1> receives a correction notice.
