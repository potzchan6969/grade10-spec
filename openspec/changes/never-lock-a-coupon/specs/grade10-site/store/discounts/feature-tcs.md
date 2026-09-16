# grade10-site/store/discounts Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

**Out of suite:** none for this change's journeys — every scenario the delta adds carries a case below. The four scenarios the delta restates unchanged keep whatever the durable capability's own suite gives them.

## grade10-site-store-discounts-US3: Collector keeps the coupon when a checkout cannot take it

**As a** collector,
**I want** a coupon back in my wallet whenever the checkout it was meant for does not complete,
**so that** a refusal or an abandoned order never costs me what I redeemed.

### grade10-site-store-discounts-US3-TC1-1: An expired sale loses its code and collects at full price

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
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* customer(member holding <coupon>) is on <grade10 store url>, signed in, with a line <coupon> applies to in the cart.
* <expired counter sale> carries a live code for <coupon>, and its plan has expired.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<expired counter sale>` | A till sale at <shop A> holding the member's goods, planned with <coupon> and never tendered |

**Steps:**

1. Open the cart drawer on <grade10 store url>.
2. Choose <coupon> for this checkout.
3. Submit the checkout.
4. Read <expired counter sale> at <shop A>.

**Expected Results:**

* The code minted for <coupon> on <expired counter sale> is no longer live.
* <expired counter sale> shows no cut for <coupon>, and is not cancelled.
* <expired counter sale> can still collect at full price.

### grade10-site-store-discounts-US3-TC2-1: A code does not go back on the sale it left

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
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* customer(member holding <coupon>) whose <coupon> now rides <later sale>.
* <counter sale A> lost <coupon>'s code to that claim.
* admin(shop staff) has the till session holding <counter sale A> open at <shop A>.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<counter sale A>` | A till sale at <shop A> whose code for <coupon> was deactivated when <later sale> claimed it |
| `<later sale>` | The online checkout the member claimed <coupon> on |

**Steps:**

1. Open the member's panel in the till session holding <counter sale A>.
2. Apply <coupon> to <counter sale A> again.

**Expected Results:**

* The till refuses <coupon> on <counter sale A>.
* The refusal names a new sale as the remedy.

---

## grade10-site-store-discounts-US4: Shop staff spends a member's product coupon at the till

**As a** member of shop staff,
**I want** a member's product coupon to settle the same way at the till as it does online,
**so that** I can ring it up with the same confidence either channel gives me.

### grade10-site-store-discounts-US4-TC1-1: A sale that collects a deactivated code is reported

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

* customer(member holding <coupon>) claimed <coupon> on <later sale>, which has already settled.
* admin(shop staff) tendered <counter sale A> at <shop A>, which collected a code this store had deactivated.
* <counter sale A> has not settled.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<counter sale A>` | A till sale at <shop A> whose code for <coupon> was deactivated before it collected |
| `<later sale>` | The online order that claimed <coupon> away from <counter sale A> |

**Steps:**

1. Settle <counter sale A>.
2. Read the coupons on <grade10 loyalty url>.

**Expected Results:**

* <coupon> reads used once, spent by <later sale>, the sale that settled first.
* <counter sale A> is reported with the order on it.
