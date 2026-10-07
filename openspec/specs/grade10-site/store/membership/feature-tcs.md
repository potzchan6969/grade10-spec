# grade10-site/store/membership Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-membership-US1: Collector becomes a member without waiting on commerce

**As a** collector,
**I want** my account created even when the commerce provider is down,
**so that** pairing completes on its own, a lost response does not duplicate me, and erasure cannot resurrect the customer.

<!-- trace:case id=g10.store-membership.TC-mdv rev=1 covers=g10.store-membership.SC-z0r,g10.store-membership.SC-07a,g10.store-membership.SC-sho,g10.store-membership.SC-g6t,g10.store-membership.SC-e9u,g10.store-membership.SC-ppr,g10.store-membership.SC-wyy,g10.store-membership.SC-2vf -->
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

<!-- trace:case id=g10.store-membership.TC-6ey rev=1 covers=g10.store-membership.SC-z0r,g10.store-membership.SC-07a,g10.store-membership.SC-sho,g10.store-membership.SC-g6t,g10.store-membership.SC-e9u,g10.store-membership.SC-ppr,g10.store-membership.SC-wyy,g10.store-membership.SC-2vf -->
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

<!-- trace:case id=g10.store-membership.TC-y5j rev=1 covers=g10.store-membership.SC-z0r,g10.store-membership.SC-07a,g10.store-membership.SC-sho,g10.store-membership.SC-g6t,g10.store-membership.SC-e9u,g10.store-membership.SC-ppr,g10.store-membership.SC-wyy,g10.store-membership.SC-2vf -->
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

<!-- trace:case id=g10.store-membership.TC-fje rev=1 covers=g10.store-membership.SC-z0r,g10.store-membership.SC-07a,g10.store-membership.SC-sho,g10.store-membership.SC-g6t,g10.store-membership.SC-e9u,g10.store-membership.SC-ppr,g10.store-membership.SC-wyy,g10.store-membership.SC-2vf -->
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

<!-- trace:case id=g10.store-membership.TC-x7o rev=1 covers=g10.store-membership.SC-z0r,g10.store-membership.SC-07a,g10.store-membership.SC-sho,g10.store-membership.SC-g6t,g10.store-membership.SC-e9u,g10.store-membership.SC-ppr,g10.store-membership.SC-wyy,g10.store-membership.SC-2vf -->
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

<!-- trace:case id=g10.store-membership.TC-k00 rev=1 covers=g10.store-membership.SC-z0r,g10.store-membership.SC-07a,g10.store-membership.SC-sho,g10.store-membership.SC-g6t,g10.store-membership.SC-e9u,g10.store-membership.SC-ppr,g10.store-membership.SC-wyy,g10.store-membership.SC-2vf -->
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

<!-- trace:case id=g10.store-membership.TC-6j2 rev=1 covers=g10.store-membership.SC-z0r,g10.store-membership.SC-07a,g10.store-membership.SC-sho,g10.store-membership.SC-g6t,g10.store-membership.SC-e9u,g10.store-membership.SC-ppr,g10.store-membership.SC-wyy,g10.store-membership.SC-2vf -->
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

<!-- trace:case id=g10.store-membership.TC-a37 rev=1 covers=g10.store-membership.SC-z0r,g10.store-membership.SC-07a,g10.store-membership.SC-sho,g10.store-membership.SC-g6t,g10.store-membership.SC-e9u,g10.store-membership.SC-ppr,g10.store-membership.SC-wyy,g10.store-membership.SC-2vf -->
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
**I want** a dynamic code or my email to identify me, staff to see the name the site knows me by, and staff to spend my points once,
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
* The shop is set to apply HK$ <applied> of <order_1>'s points discount.

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
| <new title> | <points ask_1> | <points ask_1> |
| <new title> | <applied_1> | <applied_1> |
| <older title> | <points ask_1> | <points ask_1> |

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

<!-- trace:case id=g10.store-membership.TC-29g rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
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

<!-- trace:case id=g10.store-membership.TC-2qh rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
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

<!-- trace:case id=g10.store-membership.TC-aau rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
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

<!-- trace:case id=g10.store-membership.TC-h40 rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
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

<!-- trace:case id=g10.store-membership.TC-38j rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
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
### grade10-site-store-membership-US2-TC13-1: Paid order with no points title is debited by what is left of the applied total

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
* The shop's paid order for <order_2> is stubbed to carry one order discount titled <written title>, taking <taken>, and <beside>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <points ask_1> | A points amount below both <member_1>'s balance and the order's goods, worth HK$1 a point |
| <applied_1> | A points amount below <points ask_1> |
| <reward coupon_1> | A product coupon <member_1> redeemed from a reward, taking HK$50 off a line of <order_2> |
| <order_2> | An unpaid order of <member_1>'s carrying a points promise of <points ask_1>, and <reward coupon_1> where the row names it |

| <channel> | <written title> | <taken> | <beside> | Balance falls by |
| --- | --- | --- | --- | --- |
| The online checkout | Points discount | HK$ <points ask_1> | no other discount | <points ask_1> |
| A till sale | Deduction | HK$ <applied_1> | no other discount | <applied_1> |
| A till sale | Points off | HK$ <points ask_1> and HK$50 more | no other discount | <points ask_1> |
| A till sale | Deduction | HK$ <applied_1> | <reward coupon_1> taking HK$50, and no other discount | <applied_1> |

**Steps:**

1. Open <grade10 membership url> and note the balance.
2. Pay <order_2>.
3. Open <grade10 membership url> again.

**Expected Results:**

* Step 3's balance is step 1's less the row's amount.
* Activity lists one Points put toward a purchase entry.

<!-- trace:case id=g10.store-membership.TC-pgb rev=1 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-membership.SC-u06,g10.store-membership.SC-wrc -->
### grade10-site-store-membership-US2-TC14-1: Staff discount keyed under either points title leaves nothing to apply

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
* customer(member) is <member_1>, holding <reward coupon_1>.
* Staff keyed a fixed-amount custom order discount titled <keyed title> on the sale in Shopify POS.
* The sale carries no Grade10 order id.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer the platform created, holding a redeemable points balance |
| <shop_1> | A physical store running the Grade10 till |
| <till session_1> | A till session at <shop_1> for <member_1>, opened by their member card |
| <line_1> | A product line for sale |
| <reward coupon_1> | A product coupon <member_1> redeemed from a reward, taking an amount off <line_1> |

| <keyed title> |
| --- |
| Deduction from Points |
| Points |

**Steps:**

1. Open the Grade10 extension on the sale.
2. Read the member's panel under 使用積分.
3. Read the discounts on the sale's cart in Shopify POS.

**Expected Results:**

* Step 2 shows 此單已有其他非會員系統的折扣，請先移除。
* Step 2 offers no points field, no <reward coupon_1> and no Apply button.
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

<!-- trace:case id=g10.store-membership.TC-23a rev=1 covers=g10.store-membership.SC-e9k,g10.store-membership.SC-y0k -->
### grade10-site-store-membership-US2-TC17-1: Till names the member by the site's one rule

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
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

* admin(shop staff) is on <shop_1>'s till.
* customer(member) is <member_1>, signed in to the account as <signed-in address>, in the <member state> of the row.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer |
| <shop_1> | A physical store running the Grade10 till |
| <signed-in address> | `kit.lam@example.com` |

| <member state> | The name reads |
| --- | --- |
| Saved `Kit Collector` as the display name on the profile; the account is named `Kit Lam` | `Kit Collector` |
| Never saved a profile; the account is named `Kit Lam` | `Kit Lam` |
| Never saved a profile; the account holds no name | `kit.lam` |
| Never saved a profile; the store's record holds the placeholder name older records carry; the account is named `Kit Lam` | `Kit Lam` |

**Steps:**

1. Identify <member_1> by typing <signed-in address> in the till's membership modal.
2. Read the member's name in the modal.
3. Find <member_1>'s customer in the shop's own customer search.
4. Read the name on the customer details badge.

**Expected Results:**

* Step 2 reads the row's name.
* Step 4 reads the same name.

<!-- trace:case id=g10.store-membership.TC-zhi rev=1 covers=g10.store-membership.SC-a70,g10.store-membership.SC-y0k -->
### grade10-site-store-membership-US2-TC18-1: Till shows 會員 for a member with no shop name while the account service cannot be reached

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) is on <shop_1>'s till.
* customer(member, never saved a profile, account named `Kit Lam`) is <member_1>, signed in to the account as <signed-in address>.
* The account service's name lookup is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer, holding a points balance and a tier |
| <shop_1> | A physical store running the Grade10 till |
| <signed-in address> | `kit.lam@example.com` |

| <surface> | <route> |
| --- | --- |
| The till's membership modal | Identify <member_1> by typing <signed-in address> in the modal |
| The customer details badge | Find <member_1>'s customer in the shop's own customer search |

**Steps:**

1. <route>.
2. Read the name, tier and balance on <surface>.

**Expected Results:**

* Step 2 reads 會員 as the name.
* Step 2 still shows <member_1>'s tier and balance.

<!-- trace:case id=g10.store-membership.TC-g53 rev=1 covers=g10.store-membership.SC-jjw,g10.store-membership.SC-y0k -->
### grade10-site-store-membership-US2-TC19-1: A name saved on the profile shows at the till through an account-service outage

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) is on <shop_1>'s till.
* customer(member, saved <saved name> as the display name on the profile, account named `Kit Lam`) is <member_1>, signed in to the account as <signed-in address>.
* The account service's name lookup is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer |
| <shop_1> | A physical store running the Grade10 till |
| <signed-in address> | `kit.lam@example.com` |
| <saved name> | `Kit Collector` |

**Steps:**

1. Identify <member_1> by typing <signed-in address> in the till's membership modal.
2. Read the member's name in the modal.
3. Find <member_1>'s customer in the shop's own customer search.
4. Read the name on the customer details badge.

**Expected Results:**

* Step 2 reads <saved name>, not 會員.
* Step 4 reads <saved name>.

<!-- trace:case id=g10.store-membership.TC-80o rev=1 covers=g10.store-membership.SC-ymg -->
### grade10-site-store-membership-US2-TC20-1: Till is sent an 80-character name whole

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) is on <shop_1>'s till.
* customer(member, saved <long name> as the display name on the profile) is <member_1>, signed in to the account as <signed-in address>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer |
| <shop_1> | A physical store running the Grade10 till |
| <signed-in address> | `kit.lam@example.com` |
| <long name> | 80 Latin characters, the display name's limit |

**Steps:**

1. Identify <member_1> by typing <signed-in address> in the till's membership modal.
2. Read the API response that answers the modal.
3. Find <member_1>'s customer in the shop's own customer search.
4. Read the API response that answers the customer details badge.

**Expected Results:**

* Step 2 names the member <long name>, all 80 characters.
* Step 4 names the member <long name>, all 80 characters.

---

## grade10-site-store-membership-US3: Member's in-store order earns through attribution

**As a** member,
**I want** a physical-store order recorded once and attributed by evidence,
**so that** a sale before I registered is not lost, two claimers cannot both win, and a gift card earns nothing.

<!-- trace:case id=g10.store-membership.TC-u7j rev=1 covers=g10.store-membership.SC-1h1,g10.store-membership.SC-uj6,g10.store-membership.SC-fzf,g10.store-membership.SC-6ux,g10.store-membership.SC-3rh,g10.store-membership.SC-gnr,g10.store-membership.SC-8p9,g10.store-membership.SC-fqu -->
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

<!-- trace:case id=g10.store-membership.TC-od4 rev=1 covers=g10.store-membership.SC-1h1,g10.store-membership.SC-uj6,g10.store-membership.SC-fzf,g10.store-membership.SC-6ux,g10.store-membership.SC-3rh,g10.store-membership.SC-gnr,g10.store-membership.SC-8p9,g10.store-membership.SC-fqu -->
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

<!-- trace:case id=g10.store-membership.TC-9m7 rev=1 covers=g10.store-membership.SC-1h1,g10.store-membership.SC-uj6,g10.store-membership.SC-fzf,g10.store-membership.SC-6ux,g10.store-membership.SC-3rh,g10.store-membership.SC-gnr,g10.store-membership.SC-8p9,g10.store-membership.SC-fqu -->
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

<!-- trace:case id=g10.store-membership.TC-qdb rev=1 covers=g10.store-membership.SC-1h1,g10.store-membership.SC-uj6,g10.store-membership.SC-fzf,g10.store-membership.SC-6ux,g10.store-membership.SC-3rh,g10.store-membership.SC-gnr,g10.store-membership.SC-8p9,g10.store-membership.SC-fqu -->
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

<!-- trace:case id=g10.store-membership.TC-j7p rev=1 covers=g10.store-membership.SC-1h1,g10.store-membership.SC-uj6,g10.store-membership.SC-fzf,g10.store-membership.SC-6ux,g10.store-membership.SC-3rh,g10.store-membership.SC-gnr,g10.store-membership.SC-8p9,g10.store-membership.SC-fqu -->
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

<!-- trace:case id=g10.store-membership.TC-gcq rev=1 covers=g10.store-membership.SC-1h1,g10.store-membership.SC-uj6,g10.store-membership.SC-fzf,g10.store-membership.SC-6ux,g10.store-membership.SC-3rh,g10.store-membership.SC-gnr,g10.store-membership.SC-8p9,g10.store-membership.SC-fqu -->
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

<!-- trace:case id=g10.store-membership.TC-2oq rev=1 covers=g10.store-membership.SC-1h1,g10.store-membership.SC-uj6,g10.store-membership.SC-fzf,g10.store-membership.SC-6ux,g10.store-membership.SC-3rh,g10.store-membership.SC-gnr,g10.store-membership.SC-8p9,g10.store-membership.SC-fqu -->
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

<!-- trace:case id=g10.store-membership.TC-jsz rev=1 covers=g10.store-membership.SC-1h1,g10.store-membership.SC-uj6,g10.store-membership.SC-fzf,g10.store-membership.SC-6ux,g10.store-membership.SC-3rh,g10.store-membership.SC-gnr,g10.store-membership.SC-8p9,g10.store-membership.SC-fqu -->
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

<!-- trace:case id=g10.store-membership.TC-bqx rev=1 covers=g10.store-membership.SC-1h1,g10.store-membership.SC-uj6,g10.store-membership.SC-fzf,g10.store-membership.SC-6ux,g10.store-membership.SC-3rh,g10.store-membership.SC-gnr,g10.store-membership.SC-8p9,g10.store-membership.SC-fqu -->
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

<!-- trace:case id=g10.store-membership.TC-76a rev=1 covers=g10.store-membership.SC-uae,g10.store-membership.SC-soj,g10.store-membership.SC-aar -->
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

<!-- trace:case id=g10.store-membership.TC-exa rev=1 covers=g10.store-membership.SC-uae,g10.store-membership.SC-soj,g10.store-membership.SC-aar -->
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

<!-- trace:case id=g10.store-membership.TC-8zt rev=1 covers=g10.store-membership.SC-uae,g10.store-membership.SC-soj,g10.store-membership.SC-aar -->
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

<!-- trace:case id=g10.store-membership.TC-vwn rev=1 covers=g10.store-membership.SC-uae,g10.store-membership.SC-soj,g10.store-membership.SC-aar -->
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

## Settled

- Order Details' points row keeps its label and shows for an order paid under either title, because it finds the order's points discount through the same title check settlement uses
- A parked sale carrying "Points" and applied again takes the title the till writes now, because Apply takes the sale's own points discount off under either title before it writes
- A discount staff keyed under a points title on a sale the till never marked refuses a coupon-only Apply as well as a points spend: the panel offers no points field, no coupons and no Apply, because the order id Apply writes would make it read as the member's
- A paid order whose discounts carry neither points title is debited like one that names none, the applied total less every other instrument, never more than promised, because a shop can retitle the points discount and still take the money off
- Order Details shows no Points row on an order whose shop named no points discount, even where its points were debited, because the debit worked out from the rest of the applied total can hold money staff took off by hand
- A member with a name saved on the profile is named by it at the till through an account-service outage; only a member with none shows 會員.
- The till and the badge are sent the member's name whole; the till lays it out.

## Reconciliation

- **Raised** - the blind pass asked two questions, each landed in `decisions.md`: whether Order Details' points row changes (Q5: no, and it shows under either title; the row is Order Details' own, so no case here), and which title a resumed "Points" sale takes when staff apply again (Q6: "Deduction from Points"). Q6 is folded as `grade10-site-store-membership-SC-86` and walked by US2-TC16. The second QA2 pass raised one more, landed as Q7 below, and the acceptance review one, landed as Q8. The third pass raised one more, landed as Q9: Order Details leaves its Points row off an order whose shop named no points discount, though Q8 debits its points, because that debit can hold a staff discount. The row is Order Details' own, so no case here
- **Folded** - three blind cases carried behaviour no scenario stated; each is real and on the PRD, and each is now in the delta:
  - US2-TC13, a paid order whose discounts carry neither points title: Store Discounts' settlement step → `grade10-site-store-membership-SC-84` and a sentence on the requirement
  - US2-TC14, a points title staff keyed on a sale the till never marked refusing the spend: Store Discounts' Apply refusals, and grade10 `integrations/shopify-pos/grade10/src/acts/spend.ts` `foreignCartDiscount` → `grade10-site-store-membership-SC-85` and a sentence on the requirement
  - US2-TC15, the title staying English in every site language: Q2 → an AND line on `grade10-site-store-membership-SC-81`
- **Folded from the implementation** - US2-TC14 and `grade10-site-store-membership-SC-85` refused only a points spend over a points title staff keyed, and Store Discounts said a coupon alone is not refused. The till refuses a coupon-only Apply there too, because the order id Apply writes would make the keyed discount read as the member's (grade10 `integrations/shopify-pos/grade10/src/acts/spend.ts:343`, tested at `spend.test.ts:562`). Q7 corrects the page, the requirement's sentence and `grade10-site-store-membership-SC-85`, and task 1.6 cites both titles
- **Folded from the implementation, at acceptance review** - US2-TC13 and `grade10-site-store-membership-SC-84` said a paid order whose only order discount carries a near-miss title debits nothing, read from the title check's test alone (grade10 `packages/grade10-store/contracts/test/saleMarks.test.ts`). Settlement reads that order like one that names no discounts: the applied total less every other instrument, never more than promised (grade10 `packages/grade10-store/backend/src/services/coupons/money.ts:34-46`, tested at `test/services/coupons/settle.test.ts:75`). Q8 corrects the pages, the requirement's sentence and `grade10-site-store-membership-SC-84`; US2-TC13 keeps its id and revision, since neither was ever accepted, and now expects that debit, capped at the promise
- **Revised** - US2-TC1, US2-TC10 and US2-TC11 now assert the title on the invoice, the cart, the receipt and the paid order under both titles, so each moves to revision 2, and their covers name the six scenarios this change adds. US2-TC12 gains the surrounding spaces `grade10-site-store-membership-SC-83` names. US2-TC15's first result read a URL from a row that named no address; it now reads the site's language. US2-TC2, US2-TC3 and US2-TC9 move to revision 2, naming the points discount by its role rather than the older title, and every revised case names the Activity entry by its label, Points put toward a purchase
- **Revised at the third pass** - US2-TC14's keyed discount is a fixed amount, as `grade10-site-store-membership-SC-85` says: the till reads a points title only off a fixed custom order discount (grade10 `integrations/shopify-pos/grade10/src/acts/spend.ts:231-238`), so a rate staff keyed as "Points" lets a coupon alone go on. `grade10-site-store-membership-SC-82` gains the requirement's till sentence, that an offer or a code the shop titled "Points" is neither counted nor taken off, which no scenario carried
- **Revised at the fifth pass** - US2-TC14 and `grade10-site-store-membership-SC-85` had staff choose points or a coupon and tap Apply. The till never gets that far: a points title keyed on an unmarked sale takes the points field, the coupons and the Apply button off the panel, which shows only 此單已有其他非會員系統的折扣，請先移除。 (grade10 `integrations/shopify-pos/grade10/src/acts/view.ts:475-480`, drawn by `extensions/till/src/draw/benefits.ts:160-170`). The scenario now states what the panel offers, and US2-TC14 reads the panel and the cart under each title, one walk proving a points spend and a coupon alone refused
- **Revised at the sixth pass** - US2-TC13 gains a row with a reward coupon beside the retitled discount: its rows carried no other instrument, so nothing proved `grade10-site-store-membership-SC-84`'s "less every other instrument", and a debit of the whole applied total would have passed. The coupon's HK$50 comes off the applied total before the debit (grade10 `packages/grade10-store/backend/src/services/coupons/money.ts` `discountBesidesPointsMinor`, `services/loyalty/pointsSpend.ts` `pointsCapture`). Q9's answer joins `## Settled`, where Q5 to Q8 already were
- **Trace** - `grade10-site-store-e2e-US4-TC1-2` covers `g10.store-membership.SC-uae`, the one durable id `grade10-site-store-membership-SC-77` has. add-account-profile moves that scenario to US-02, which this case's Trace names; SC-uaf, which it replaces, is add-account-profile's id for the same scenario, outside this stack
- **Journey** - US-02's want gains add-account-profile's clause, staff seeing the name the site knows the member by, so both changes carry one US-02 and either change folds it whole. No id moves: add-account-profile moved its own scenarios and cases past this change's
- **Revised at the seventh pass** - `grade10-site-store-e2e-US4-TC1-2` carries never-lock-a-coupon's US4-TC1-1, which names all thirteen scenarios serving `grade10-site-store-discounts-US-04` in that change; its marker named only the durable three, and now names all thirteen. US2-TC1's applied column read "HK$ all of <points ask_1>" at step 5; it now holds the amount alone
- **Rejected** - none
- **Uncovered** - none: every scenario serving US-02 in the Points discount group is walked above, carried, or out of suite with its verifier named
- **Contradicted** - none: where a case and a scenario state the same behaviour they agree
- **Scenarios walked** - `grade10-site-store-membership-SC-81` by US2-TC1 online, US2-TC10 at the till with its receipt, US2-TC15 in each language, and `grade10-site-store-e2e-US4-TC1-2` beside a product coupon; `grade10-site-store-membership-SC-82` by US2-TC10's older-title row, held through tender, and US2-TC11, stripped under either title; `grade10-site-store-membership-SC-83` by US2-TC1's older-title row and US2-TC12; `grade10-site-store-membership-SC-84` by US2-TC13; `grade10-site-store-membership-SC-85` by US2-TC14 under each title, the panel offering neither points nor a coupon; `grade10-site-store-membership-SC-86` by US2-TC16
- **Out of suite** - `grade10-site-store-membership-SC-82`'s lowercase "points" on a marked sale, the discount coming off before the order id, and an offer or a code titled "Points" left alone: none shows at the counter without a shop set up to fake it, so the till extension's tests that task 1.6 cites decide them, grade10 `integrations/shopify-pos/grade10/src/acts/flow.test.ts` and `spend.test.ts:349`. `grade10-site-store-membership-SC-84`'s first result, that no discount is read as the points discount, moves no balance US2-TC13 could tell apart; the title check's test decides it, grade10 `packages/grade10-store/contracts/test/saleMarks.test.ts`
- **Carried, not this change's** - `grade10-site-store-membership-SC-16`, `grade10-site-store-membership-SC-72` and `grade10-site-store-membership-SC-73` are carried word for word; US2-TC3, US2-TC2 and US2-TC9 walk them, and US2-TC1, US2-TC10 and US2-TC11 walk `grade10-site-store-membership-SC-73` again under both titles
- **Cases added after the reconciliation** - US2-TC16, written from Q6 and `grade10-site-store-membership-SC-86`, so it is not blind

**Run:** QA2 reconciliation on 2026-10-06 for `name-points-discount-deduction`, `grade10-site/store/membership`, run seven times. The seventh pass, on 2026-10-07 in a fresh context, re-read every case and scenario against US-02 and the Points discount group, every marker against the scenarios serving its journeys across the stack below this change, never-lock-a-coupon's store `domain-tcs.md` and discounts delta, and grade10 `services/coupons/money.ts` and `services/loyalty/pointsSpend.ts`. The sixth pass, in a fresh context, re-read every case and scenario against US-02 and the Points discount group, the change's `domain-tcs.md` covers against every scenario in the store serving its two journeys, and grade10 `services/coupons/money.ts`, `services/loyalty/pointsSpend.ts`, `services/orders/readOrder.ts`, `acts/spend.ts`, `acts/flow.ts`, `acts/view.ts` and `extensions/till/src/draw/benefits.ts`. The fifth pass, in a fresh context, re-read every case and scenario against US-02 and the Points discount group, with grade10 `acts/view.ts`, `extensions/till/src/draw/benefits.ts`, `services/coupons/money.ts`, `services/loyalty/pointsSpend.ts` and their tests, and every grade10 line the suite and `decisions.md` cite. The fourth pass, after the acceptance review's second round, re-read `grade10-site-store-membership-SC-82`, US2-TC10 and US2-TC11 against the requirement's case rule, now stated for every reader, and its till sentence, which now names a code beside an offer; neither case moves. The third pass, in a fresh context after the acceptance review's Q8, re-read every case and scenario against US-02 and the Points discount group, with grade10 `services/coupons/money.ts`, `services/loyalty/pointsSpend.ts`, `services/orders/readOrder.ts`, `acts/spend.ts` and their tests. The second pass, in a fresh context, re-read each case and scenario against US-02 and the feature set's Points discount group. Read this suite, the change's `domain-tcs.md`, the delta `spec.md` and `user-journeys.md`, the proposal, `decisions.md`, `tech-design.md`, `tasks.md`, the durable membership spec, suite and store `domain-tcs.md`, the PRD pages Paying with Points, Shopify Integration, Store Discounts and Order Details, and grade10 `packages/grade10-store/contracts/src/saleMarks.ts`, `integrations/shopify-pos/grade10/src/acts/spend.ts` and `flow.ts`. The blind pass left no Run line, so what it read is not recorded.

**Run:** 2026-10-07, seventh QA2 reconciliation, in a fresh context, after product settled Q10, Q11, Q12 and Q16 on the profile: a default name the collector leaves as shown stays the account's, which the till's name order already reads, so no case moved. Before it, the sixth, over the same reading: no case moved. Before it, the fifth, after the third accept review: the requirement names the failure as an account service that cannot be reached or does not answer, where "gives no name" read as an account with no name, and `grade10-site-store-membership-SC-90` now states the placeholder. No case moved; US2-TC18's title takes the requirement's words. Before it, the fourth, in a fresh context, over the same reading: US2-TC17 gained a row. Before it, the third; after the second accept review the new scenarios and cases were renumbered above the ids concurrent changes claim, and no case moved. Read: this suite, the delta `spec.md` and `user-journeys.md`, the durable membership suite for the cases the carried scenarios already have, `proposal.md`, `decisions.md`, `tech-design.md`, `tasks.md`, the Shopify Integration and Member Card in a Wallet pages, and the application repository's `memberName` and POS directory. The blind pass recorded no Run line of its own, so its bundle is not stated here.

- **Raised, settled by the round** - a saved name through an account-service outage (Q21): the till shows the saved name, `grade10-site-store-membership-SC-87`, walked by US2-TC19; the pass's half is settled in the wallet suite. A long name in the till's modal (Q22): the requirement sends it whole, and US2-TC20 asserted it with no scenario to reach; `grade10-site-store-membership-SC-89` now states it, as `grade10-site-store-wallet-member-card-SC-59` does for the pass
- **Added to the spec** - US2-TC17's three rows assert the name order the requirement states at the till, and no scenario stated it: `grade10-site-store-membership-SC-88` only holds the badge to the till's name. `grade10-site-store-membership-SC-90` now states the order, and US2-TC17 and the domain walk trace it
- **Rewritten to the page** - US2-TC17 gains a member whose record holds the placeholder name older records carry, read as the account name, since the Profile page's A name nobody chose line holds the till to the default too; `grade10-site-store-membership-SC-90` now states it, so the row asserts no more than its scenario
- **Rejected** - none
- **Contradicted** - none
- **Cases added after the reconciliation** - US2-TC19 (`grade10-site-store-membership-SC-87`), US2-TC20 (`grade10-site-store-membership-SC-89`): written from the decisions the blind pass raised, so they are not blind
- **Carried unchanged** - the modified requirement changes only the name clause; its other scenarios keep their durable cases. `grade10-site-store-membership-SC-77` now serves US-02, whose journey says staff spend points once, where the durable spec has it serve US-04; its outcome is word for word, and durable US4-TC2 still reaches it; `/tcs-review` moves that case under US2 when the change folds
- **Left to the domain** - nothing: `grade10-site-store-e2e-US9-TC1-1` reads a saved name at the till, and US2-TC17 still asserts it with the badge
- **Uncovered** - none

| Scenario | Reached by |
| --- | --- |
| `grade10-site-store-membership-SC-75` | durable US4-TC1, US4-TC4 |
| `grade10-site-store-membership-SC-76` | durable US4-TC3 |
| `grade10-site-store-membership-SC-77` | durable US4-TC2 |
| `grade10-site-store-membership-SC-78` | US2-TC18 |
| `grade10-site-store-membership-SC-87` | US2-TC19 |
| `grade10-site-store-membership-SC-88` | US2-TC17, US2-TC18, US2-TC19 |
| `grade10-site-store-membership-SC-89` | US2-TC20 |
| `grade10-site-store-membership-SC-90` | US2-TC17; at domain, `grade10-site-store-e2e-US9-TC1-1` |
