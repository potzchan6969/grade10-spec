# grade10-site/loyalty/programme Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-loyalty-programme-US6: Operator reverses a redemption a member cannot be given

**As an** operator,
**I want** to return a member's points and void their coupon while it is still unused,
**so that** a reward we cannot honour costs the member nothing.

<!-- trace:case id=g10.loyalty-programme.TC-pvr rev=1 covers=g10.loyalty-programme.SC-pkm,g10.loyalty-programme.SC-0nd,g10.loyalty-programme.SC-m7u,g10.loyalty-programme.SC-jqk -->
### grade10-site-loyalty-programme-US6-TC1-1: A reversal is refused while a sale claims the coupon

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
* **Trace:** grade10-site-loyalty-programme-US-06

**Pre-conditions:**

* customer(member holding <coupon>) has <claiming sale> carrying <coupon>, unpaid.
* admin(holds the permission to cancel a redemption) is signed in to the operator API.

**Test data:**

| <claiming sale> | State |
| --- | --- |
| A till sale at <shop A> | Planned with <coupon> under an hour ago, never tendered |
| An online order | Submitted with <coupon>, its checkout open |
| An online order | Expired, its checkout still able to collect |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member bought for <cost> points, unused, inside its validity |
| <cost> | 500 |

**Steps:**

1. Ask to reverse the redemption that issued <coupon>.
2. Read the response.
3. Read the member's balance and coupons.

**Expected Results:**

* Step 2 refuses the reversal, naming <claiming sale>.
* The balance is unchanged.
* <coupon> is still held, unused.

<!-- trace:case id=g10.loyalty-programme.TC-3dp rev=1 covers=g10.loyalty-programme.SC-pkm,g10.loyalty-programme.SC-0nd,g10.loyalty-programme.SC-m7u,g10.loyalty-programme.SC-jqk -->
### grade10-site-loyalty-programme-US6-TC2-1: A reversal goes through once the sale gives the coupon back

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-06

**Pre-conditions:**

* customer(member holding <coupon>) had <coupon> claimed by a sale that has given it back, as the row says.
* admin(holds the permission to cancel a redemption) is signed in to the operator API.

**Test data:**

| How the claim was given back |
| --- |
| A till sale at <shop A> planned with <coupon>, untendered, its last plan over an hour ago |
| A till sale at <shop A> planned with <coupon>, retired by a newer till plan for the member at <shop B> that carries no coupon |
| A till sale at <shop A> planned with <coupon>, retired by an online checkout the member submitted with <other coupon> |
| An online order submitted with <coupon>, then cancelled |
| A checkout that claimed <coupon> and stopped before its order was written, past <sweep horizon> |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member bought for <cost> points, unused, inside its validity |
| <other coupon> | A second reward coupon the member holds, unused, inside its validity |
| <cost> | 500 |
| <sweep horizon> | 25 hours from the claim |

**Steps:**

1. Ask to reverse the redemption that issued <coupon>.
2. Read the response.
3. Read the member's balance and coupons.

**Expected Results:**

* Step 2 takes the reversal and names no sale.
* The balance rises by <cost>.
* <coupon> is void.

### grade10-site-loyalty-programme-US6-TC3-1: A claim outlasts the code minted for it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-06

**Pre-conditions:**

* customer(member holding <coupon>) has <expired order> carrying <coupon>'s claim and its minted code.
* The clock stands at the row's <check time>, and the programme's sweep has run since.
* admin(holds the permission to cancel a redemption) is signed in to the operator API.

**Test data:**

| <check time> | The code | The reversal |
| --- | --- | --- |
| 23 hours after <expired order> was written | Live | Refused, naming <expired order> |
| 24 hours and 30 minutes after <expired order> was written | No longer live | Refused, naming <expired order> |
| 25 hours and 30 minutes after the claim | No longer live | Taken |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity |
| <expired order> | An online order submitted with <coupon> that expired, its checkout still able to collect |

**Steps:**

1. Read <coupon>'s code at the shop.
2. Ask to reverse the redemption that issued <coupon>.
3. Read the response.

**Expected Results:**

* Step 1 reads the code as the row's second column says.
* Step 3 answers as the row's third column says.

---

## grade10-site-loyalty-programme-US7: Member redeems any reward as one coupon

**As a** member,
**I want** every reward I redeem — money off, a gift, or a physical item — to become a coupon with its own kind, discount and scope,
**so that** a physical reward settles like an ordinary purchase and I never wait for a separate collection.

### grade10-site-loyalty-programme-US7-TC1-1: A product coupon at the till mints its code when chosen, and once

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
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* admin(shop staff) has a till session open for customer(member holding <product coupon>) at <shop A>, the member attached to a sale holding <line_1>.
* No code has been minted for <product coupon>.

**Test data:**

| Route | How <product coupon> reaches the sale |
| --- | --- |
| Staff apply it | Staff choose <product coupon> in the member's panel |
| The member shows it | The member opens <product coupon> on their own phone and the till scans it |

| Field | Value |
| --- | --- |
| <product coupon> | A reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1> |
| <line_1> | One HK$780.00 product |
| <points> | 100, worth HK$100.00, within the member's balance |

**Steps:**

1. Read the codes minted for <product coupon> at the shop.
2. Put <product coupon> on the sale the row's way.
3. Apply the sale.
4. Read the codes minted for <product coupon> at the shop.
5. Choose <points> points in the member's panel and apply the sale again.
6. Read the sale's discount codes in Shopify POS.

**Expected Results:**

* Step 1 finds no code for <product coupon>.
* Step 3 puts <product coupon>'s cut on the sale.
* Step 4 finds one code for <product coupon>.
* Step 6 shows exactly one code for <product coupon>, and the sale still carries its cut.

---

## grade10-site-loyalty-programme-US11: Member spends a coupon wherever they are, whatever they left open

**As a** member,
**I want** every coupon I hold to be spendable on the sale in front of me, whatever checkout or counter sale I walked away from,
**so that** changing my mind never costs me the coupon and never makes me wait.

<!-- trace:case id=g10.loyalty-programme.TC-eg8 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-fhj -->
### grade10-site-loyalty-programme-US11-TC1-1: A new checkout takes the coupon off an unpaid online order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) is signed in on <grade10 store url>, with <line_1> in the cart.
* <earlier order> carries <coupon>'s cut, unpaid, in the state the row names.

**Test data:**

| <earlier order> state |
| --- |
| Its checkout open |
| Expired, its checkout still able to collect |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <earlier order> | An online order the member submitted with <coupon> and never paid |

**Steps:**

1. Open the cart drawer.
2. Read the coupons offered.
3. Choose <coupon>.
4. Submit the checkout.
5. Read <earlier order> in the member's orders.
6. Read the code minted for <earlier order> at the shop.
7. Open <earlier order>'s checkout and try to pay it.

**Expected Results:**

* Step 2 offers <coupon> as spendable.
* The new checkout carries <coupon>'s cut.
* <earlier order> reads cancelled.
* The code minted for <earlier order> is no longer live.
* Step 7 takes no payment.

<!-- trace:case id=g10.loyalty-programme.TC-8x5 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-fhj -->
### grade10-site-loyalty-programme-US11-TC2-1: A counter sale keeps its cart and loses the cut

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon> and <other coupon>) is signed in on <grade10 store url>, with <line_1> in the cart.
* admin(shop staff) has <counter sale A> open at <shop A>, planned with <coupon> under an hour ago, untendered.

**Test data:**

| Chosen online |
| --- |
| <coupon> |
| <other coupon> |
| <points> points, and no coupon |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <other coupon> | A second reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <points> | 100, worth HK$100.00, within the member's balance |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> |

**Steps:**

1. Open the cart drawer.
2. Choose the row's benefit.
3. Submit the checkout.
4. Read the code minted for <coupon> on <counter sale A> at the shop.
5. At <shop A>, apply <counter sale A> again.

**Expected Results:**

* The online checkout carries the row's benefit.
* The code on <counter sale A> is no longer live.
* <counter sale A> is not cancelled and still holds <line_1>.
* Step 5 is refused, telling staff the sale has closed and to ring the goods on a new one.

<!-- trace:case id=g10.loyalty-programme.TC-dcb rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-fhj -->
### grade10-site-loyalty-programme-US11-TC3-1: A till claims the coupon an open checkout holds

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) has <open checkout> carrying <coupon>'s cut, unpaid.
* admin(shop staff) has a till session open for that member at <shop A>, with <line_1> rung up.

**Test data:**

| Route | How <coupon> reaches the sale |
| --- | --- |
| Staff apply it | Staff choose <coupon> in the member's panel |
| The member shows it | The member opens <coupon> on their own phone and the till scans it |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <open checkout> | An online checkout the member submitted with <coupon> and left unpaid |

**Steps:**

1. Open the member's panel in the till session.
2. Read the coupons the panel lists.
3. Put <coupon> on the sale the row's way.
4. Apply the sale.
5. Read <open checkout> in the member's orders.

**Expected Results:**

* Step 2 lists <coupon> as spendable, naming no sale.
* Step 4 puts <coupon>'s cut on the sale.
* <open checkout> reads cancelled, and its code is no longer live.

<!-- trace:case id=g10.loyalty-programme.TC-8wc rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-fhj -->
### grade10-site-loyalty-programme-US11-TC4-1: A second till takes the coupon from the first

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) has <counter sale A> at <shop A>, planned with <coupon> under an hour ago, untendered.
* admin(shop staff) has a till session open for that member at <shop B>, with <line_2> rung up.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> and <line_2> |
| <line_1> | One HK$780.00 product, on <counter sale A> |
| <line_2> | One HK$780.00 product, at <shop B> |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> |

**Steps:**

1. Choose <coupon> in the member's panel at <shop B>.
2. Apply the sale at <shop B>.
3. Read the code minted for <coupon> on <counter sale A> at the shop.
4. Read <counter sale A> at <shop A>.

**Expected Results:**

* Step 2 puts <coupon>'s cut on the sale at <shop B>.
* The code on <counter sale A> is no longer live.
* <counter sale A> is not cancelled and still holds <line_1>.

<!-- trace:case id=g10.loyalty-programme.TC-i0e rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-fhj -->
### grade10-site-loyalty-programme-US11-TC5-1: A coupon an unpaid sale claims still reads spendable

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) is signed in, with <line_1> in the cart.
* <claiming sale> carries <coupon>, in the state the row names.

**Test data:**

| <claiming sale> | State |
| --- | --- |
| An online order | Its checkout open |
| An online order | Expired, its checkout still able to collect |
| An online order | Cancelled |
| An online order | Cancelled, before the programme was told to give <coupon> back |
| An online order | Paid, not yet settled |
| A till sale at <shop A> | Planned under an hour ago, never tendered |
| A till sale at <shop A> | Its last plan over an hour ago, never tendered |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read the coupons the member holds.
3. Navigate to <grade10 store url>.
4. Open the cart drawer.
5. Read the coupons offered.

**Expected Results:**

* Step 2 lists <coupon> as unused.
* Step 5 offers <coupon> as spendable.

<!-- trace:case id=g10.loyalty-programme.TC-1q0 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-fhj -->
### grade10-site-loyalty-programme-US11-TC6-1: No surface names the sale claiming a coupon

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) has <counter sale A> at <shop A>, planned with <coupon> under an hour ago, untendered.
* That member is signed in on <grade10 store url>, with <line_1> in the cart.
* admin(shop staff) has a till session open for that member at <shop B>.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding the member's goods, planned with <coupon> |

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read <coupon> in the member's coupons.
3. Navigate to <grade10 store url>.
4. Open the cart drawer.
5. Read <coupon> in the coupons offered.
6. Open the member's panel at <shop B>.
7. Read <coupon> in the panel.

**Expected Results:**

* Steps 2, 5 and 7 show <coupon> as spendable.
* None of them shows a claimed state.
* None of them names <counter sale A>.

<!-- trace:case id=g10.loyalty-programme.TC-1jv rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-fhj -->
### grade10-site-loyalty-programme-US11-TC7-1: Two sales collect one coupon, which is spent once and reported

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) whose <counter sale A> collected a deactivated code for <coupon>.
* <later sale> carries <coupon>'s claim and collected its cut.
* Neither sale has settled.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused and inside its validity |
| <counter sale A> | A till sale at <shop A> whose code for <coupon> was deactivated before it collected |
| <later sale> | The online order that claimed <coupon> away from <counter sale A> |

**Steps:**

1. Settle <later sale>.
2. Settle <counter sale A>.
3. Read the coupons on <grade10 loyalty url>.

**Expected Results:**

* <coupon> reads used once, spent by <later sale>, the sale that settled first.
* <counter sale A> is reported with the order on it, and spends <coupon> nowhere.

<!-- trace:case id=g10.loyalty-programme.TC-y4l rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-fhj -->
### grade10-site-loyalty-programme-US11-TC8-1: A claim is refused where the earlier checkout cannot be closed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) has <open checkout> carrying <coupon>'s cut, unpaid.
* The shop is set to refuse closing <open checkout>.
* The member is at the row's place, with <line_1> on the sale.

**Test data:**

| Place | How <coupon> is chosen |
| --- | --- |
| Signed in on <grade10 store url> | The member chooses <coupon> in the cart drawer and submits the checkout |
| A till session at <shop A>, admin(shop staff) serving | Staff choose <coupon> in the member's panel and apply the sale |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <open checkout> | An online checkout the member submitted with <coupon> and left unpaid |

**Steps:**

1. Choose <coupon> the row's way.
2. Read the answer.
3. Read <open checkout> in the member's orders.

**Expected Results:**

* Step 2 refuses <coupon>, saying an earlier sale stands.
* Step 2 does not say <coupon> is unavailable.
* <open checkout> is not cancelled and still carries <coupon>'s cut.

<!-- trace:case id=g10.loyalty-programme.TC-x5l rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-fhj -->
### grade10-site-loyalty-programme-US11-TC9-1: A coupon on a sale that took the money does not move

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) has <paid sale> carrying <coupon>'s cut, which has taken the member's money and not yet settled.
* The member is at the row's place, with <line_1> on the sale.

**Test data:**

| Place | How <coupon> is chosen |
| --- | --- |
| Signed in on <grade10 store url> | The member chooses <coupon> in the cart drawer and submits the checkout |
| A till session at <shop A>, admin(shop staff) serving | Staff choose <coupon> in the member's panel and apply the sale |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member redeemed, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <paid sale> | An online order carrying <coupon>'s cut, paid |

**Steps:**

1. Choose <coupon> the row's way.
2. Read the answer.
3. Read <paid sale> in the member's orders.

**Expected Results:**

* Step 2 refuses <coupon>, saying an earlier sale stands.
* Step 2 does not say <coupon> is unavailable.
* <paid sale> still carries <coupon>'s cut.

<!-- trace:case id=g10.loyalty-programme.TC-bq5 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-fhj -->
### grade10-site-loyalty-programme-US11-TC10-1: A claim stands where the shop keeps the earlier code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) is signed in on <grade10 store url>, with <line_1> in the cart.
* <counter sale A> at <shop A> was planned with <coupon> under an hour ago, untendered.
* The shop is set to refuse deactivating the code minted for <coupon> on <counter sale A>.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding the member's goods, planned with <coupon> |

**Steps:**

1. Open the cart drawer.
2. Choose <coupon>.
3. Submit the checkout.
4. Set the shop to accept the deactivation.
5. Read the code minted for <coupon> on <counter sale A> at the shop.

**Expected Results:**

* Step 3 is not refused, and the checkout carries <coupon>'s cut.
* After step 4, the code on <counter sale A> is no longer live.

<!-- trace:case id=g10.loyalty-programme.TC-4wf rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-fhj -->
### grade10-site-loyalty-programme-US11-TC11-1: A sale that gave no cut hands the coupon back

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding the row's reward) has <counter sale A> planned with that reward, tendered, not yet settled.
* The paid order carries what the row's second column says.

**Test data:**

| Reward | The paid order carries |
| --- | --- |
| <coupon> | No code and no cut for <coupon> |
| <gift> | No line for <gift>'s product discounted to nothing |

| Field | Value |
| --- | --- |
| <coupon> | A reward product coupon the member holds, unused, inside its validity |
| <gift> | A gift reward the member holds, unused, inside its validity |
| <counter sale A> | A till sale at <shop A> planned with the row's reward |

**Steps:**

1. Settle <counter sale A>.
2. Read the member's coupons on <grade10 loyalty url>.

**Expected Results:**

* The row's reward reads unused.
* <counter sale A> records no use of the row's reward.

### grade10-site-loyalty-programme-US11-TC12-1: A claim given back no longer answers its retry key

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) had <coupon> claimed for <sale A> under <key A>.
* That claim is in the state the row names.

**Test data:**

| Claim under <key A> | Asking again under <key A> |
| --- | --- |
| Standing: <sale A> carries <coupon>'s cut | Answers with the same claim, recording nothing new |
| Given back: <sale A>'s plan was refused after it claimed <coupon>, before any code was minted | Makes a new claim |
| Collected: <sale A> was paid with <coupon>'s cut and has settled | Refused, as <coupon> is already used |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, inside its validity |
| <sale A> | A till sale at <shop A> planned with <coupon> |
| <key A> | The retry key <sale A>'s claim was made under: its order id |

**Steps:**

1. Ask the programme to claim <coupon> for <sale A> under <key A>.
2. Read the answer.
3. Read the member's coupons.

**Expected Results:**

* Step 2 answers as the row's second column says.
* <coupon> is used at most once.

### grade10-site-loyalty-programme-US11-TC13-1: A till sale whose plan was refused claims the coupon on its next plan

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* admin(shop staff) has a till session open for customer(member holding <coupon>) at <shop A>, on <sale A>.
* <sale A>'s last plan named <coupon> and was refused after it claimed <coupon>, before any code was minted, so the claim was given back.
* What refused that plan is cleared.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <sale A> | A till sale at <shop A> holding <line_1> |

**Steps:**

1. Choose <coupon> in the member's panel.
2. Apply the sale.
3. Read the discount codes on <sale A>.

**Expected Results:**

* Step 2 puts <coupon>'s cut on <sale A>.
* <sale A> carries exactly one code for <coupon>.

### grade10-site-loyalty-programme-US11-TC14-1: A coupon a cancelled order has not yet given back is taken at the till

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) had <cancelled order> carrying <coupon>, now cancelled.
* The programme has not yet been told to give <coupon> back from <cancelled order>.
* admin(shop staff) has a till session open for that member at <shop A>, with <line_1> rung up.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <cancelled order> | An online order the member submitted with <coupon>, then cancelled |

**Steps:**

1. Choose <coupon> in the member's panel.
2. Apply the sale.
3. Ask to reverse the redemption that issued <coupon>.

**Expected Results:**

* Step 2 puts <coupon>'s cut on the sale, and does not say <coupon> is unavailable.
* Step 3 is refused, naming the till sale rather than <cancelled order>.

### grade10-site-loyalty-programme-US11-TC15-1: A claim moves the coupon off a tendered counter sale whose order has not arrived

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) is signed in on <grade10 store url>, with <line_1> in the cart.
* admin(shop staff) tendered <counter sale A> at <shop A> with <coupon>'s cut on it.
* The paid order for <counter sale A> has not reached the store.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> |

**Steps:**

1. Open the cart drawer.
2. Choose <coupon>.
3. Submit the checkout.
4. Read the code minted for <coupon> on <counter sale A> at the shop.

**Expected Results:**

* Step 3 is not refused, and the checkout carries <coupon>'s cut.
* The code on <counter sale A> is no longer live.

### grade10-site-loyalty-programme-US11-TC16-1: Two sales claiming one coupon at once leave one live claim

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* admin(shop staff) has till sessions open for customer(member holding <coupon>) at <shop A> and at <shop B>, with <line_1> rung up at each.
* Neither sale carries <coupon>.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |

**Steps:**

1. Apply both sales with <coupon> at the same moment.
2. Read both answers.
3. Read the codes minted for <coupon> at the shop.
4. Read the member's coupons.

**Expected Results:**

* Neither answer says <coupon> is unavailable.
* Step 3 finds exactly one live code for <coupon>.
* <coupon> reads unused.

## Settled

- A claim given back makes a new claim under the same retry key; the sale that asks again is a till sale re-planned after a plan refused once it had claimed. An online order that loses its claim is cancelled and never asks again
- The programme's sweep waits 25 hours from the claim, and a reward's code lives 24 hours from its order's creation, so the sweep never frees a coupon whose code is live
- An online checkout the provider reports collected refuses a new claim by name; a counter sale is not known to be paid until its order arrives, so a claim moves its coupon
- A counter sale a newer promise retired takes no new plan; staff ring the goods on a new sale
- A coupon two sales collected is spent by the sale that claims it, whichever settles first
- Two sales claiming one coupon at once leave one live claim, and neither is told the coupon is unavailable
- The cart drawer offers a coupon an ended order of the member's still claims, because the claim takes it back first

## Reconciliation

**Run:** 2026-10-06, QA2 reconciliation of the blind feature pass styled the same day, tcs-rules r4, run again in a fresh context after the accept review. The blind pass recorded no bundle of its own; it was run under `planning-dev`'s contract, which gives it the outline's `## Purpose` and `## Feature set`, the journeys, the proposal, `decisions.md` with its `## Raised` table, the linked PRD pages and the durable suite for id continuity, and denies it every `## Requirements` section. QA2 read both readings, the delta, `tech-design.md`, `tasks.md`, the Coupons, Rewards and Discounts pages, and the application repository where a decision cites it.

- **Agreed** — `grade10-site-loyalty-programme-SC-190` by US11-TC1-1; `grade10-site-loyalty-programme-SC-192` by US11-TC3-1; `grade10-site-loyalty-programme-SC-193` by US11-TC4-1; `grade10-site-loyalty-programme-SC-194` by US11-TC8-1, which also walks the till; `grade10-site-loyalty-programme-SC-200` by US11-TC9-1; `grade10-site-loyalty-programme-SC-201` by US11-TC10-1; `grade10-site-loyalty-programme-SC-202` by US11-TC11-1; `grade10-site-loyalty-programme-SC-196` by US11-TC6-1 and US11-TC5-1; `grade10-site-loyalty-programme-SC-197` by US11-TC5-1; `grade10-site-loyalty-programme-SC-198` by US6-TC1-1; `grade10-site-loyalty-programme-SC-199` by US6-TC2-1's last row; `grade10-site-loyalty-programme-SC-205` by US6-TC2-1's first row, with the code and the cart in `grade10-site-store-discounts-US3-TC6-1`
- **Raised, folded into spec** — US6-TC3-1 held that a claim outlasts the code minted for it, which no scenario stated: `grade10-site-loyalty-programme-SC-210` and one sentence on the reversal requirement (Q12). US11-TC15-1 held that a claim moves the coupon off a tendered counter sale whose order has not arrived, the counter half of Q13 that no scenario stated: `grade10-site-loyalty-programme-SC-211`. US11-TC16-1 held that two sales claiming one coupon at once leave one live claim, which the requirement's "exactly one sale claims a coupon at a time" states and no scenario did: `grade10-site-loyalty-programme-SC-212`
- **Rewritten to the spec** — US11-TC2-1 had staff re-plan the counter sale at full price and be told the coupon left; the Discounts page's `A retired counter sale keeps its cart` line says the sale takes no new plan, so step 5 is refused naming a new sale, as `grade10-site-store-discounts-SC-24` says. US11-TC12-1 gave a claim back by a later sale claiming it and had the programme take that sale's cut; the programme moves no cut, and an online order that loses its claim is cancelled, so the rows follow the till route Q11 names, for `grade10-site-loyalty-programme-SC-204`, `grade10-site-loyalty-programme-SC-207` and `grade10-site-loyalty-programme-SC-208`. US6-TC3-1 set a claim older than 25 hours with its code still live, which cannot arise once the code runs from its order's creation (Q12); it now walks the two clocks, for `grade10-site-loyalty-programme-SC-210`
- **Retired** — US11-TC7-1, deprecated by the blind pass: it had the sale that settled first spend the coupon, where Q14 has the claiming sale spend it whichever settles first. Its purpose is held by `grade10-site-store-discounts-US4-TC5-1`, which settles both sales in both orders
- **Raised by the blind pass, landed** — Q11 in US11-TC12-1 and US11-TC13-1; Q12 in US6-TC3-1 and `grade10-site-loyalty-programme-SC-210`; Q13 in US11-TC9-1, US11-TC15-1, `grade10-site-loyalty-programme-SC-200` and `grade10-site-loyalty-programme-SC-211`
- **Cases added after the reconciliation** — US11-TC13-1 (`grade10-site-loyalty-programme-SC-203`) and US11-TC14-1 (`grade10-site-loyalty-programme-SC-209`); a second row on US11-TC2-1 and a third on US6-TC2-1 (`grade10-site-loyalty-programme-SC-206`), US11-TC2-1 also reaching `grade10-site-loyalty-programme-SC-191`; a row on US11-TC5-1 for a cancelled order whose coupon the programme has not yet been given back (`grade10-site-loyalty-programme-SC-196`). Written from the scenarios, so they are not blind
- **Design corrected to the page** — `tech-design.md` let the cart drawer hide a coupon while a cancelled order's release had not drained, where the Coupons page's `What the member is shown` row and `grade10-site-loyalty-programme-SC-196` read every coupon as spendable. The drawer now offers a coupon any order of the member's claims, since the claim takes it back first (tasks 9.5, 9.6); a claim a crashed checkout left with no order row stays hidden until the sweep, a risk the design names
- **Scenarios narrowed to their requirement** — `grade10-site-loyalty-programme-SC-166` and `grade10-site-loyalty-programme-SC-172` asserted a code for any coupon at the till, where the requirement, after Q8, gives a gift its own line and no code. Both now name a product coupon, at their second revision. The durable suite holds no US-07 section, so no case reached either; US7-TC1-1 is added for both, written from the scenarios and not blind. The gift's own line at the till is `grade10-site-store-discounts-US4-TC9-1`'s
- **Contradicted** — none left. The one opposite reading, a counter sale whose coupon left still taking a plan, is settled by the Discounts page
- **Restated unchanged** — `grade10-site-loyalty-programme-SC-10` and `grade10-site-loyalty-programme-SC-11` by the durable US1-TC7-1; `grade10-site-loyalty-programme-SC-171` and `grade10-site-loyalty-programme-SC-175` by US3-TC5-1; `grade10-site-loyalty-programme-SC-173` by US2-TC10-1. This change moves none of them
- **Uncovered, before this change and after it** — `grade10-site-loyalty-programme-SC-159` to `grade10-site-loyalty-programme-SC-162`, `grade10-site-loyalty-programme-SC-167` to `grade10-site-loyalty-programme-SC-170` and `grade10-site-loyalty-programme-SC-174`, restated unchanged. The durable suite holds no section for US-06 to US-10, which `pnpm run tcs:validate` already reports; the next suite refresh owes them cases
- **Uncovered anchors** — none

### Out of suite

* `grade10-site-loyalty-programme-SC-195` - a coupon two sales collected is spent once: `grade10-site-store-discounts-US4-TC5-1`, which settles both sales in both orders. The settlement it walks is `grade10-site/store/discounts`' own requirement.
