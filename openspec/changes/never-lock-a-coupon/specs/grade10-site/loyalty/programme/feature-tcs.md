# grade10-site/loyalty/programme Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## grade10-site-loyalty-programme-US11: Member spends a coupon wherever they are, whatever they left open

**As a** member,
**I want** every coupon I hold to be spendable on the sale in front of me, whatever checkout or counter sale I walked away from,
**so that** changing my mind never costs me the coupon and never makes me wait.

### grade10-site-loyalty-programme-US11-TC1-1: The next checkout takes the coupon and cancels the first order

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) is on <grade10 store url>, signed in, with a line <coupon> applies to in the cart.
* <earlier order> carries <coupon>'s cut and nobody paid it.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<earlier order>` | An online order the member submitted with <coupon> and left unpaid |

**Steps:**

1. Open the cart drawer on <grade10 store url>.
2. Choose <coupon> for this checkout.
3. Submit the checkout.

**Expected Results:**

* The new checkout carries <coupon>'s cut.
* <earlier order> reads cancelled.
* The code minted for <earlier order> is no longer live.

### grade10-site-loyalty-programme-US11-TC2-1: A counter sale keeps its cart and loses the cut

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

* customer(member holding <coupon>) is on <grade10 store url>, signed in, with a line <coupon> applies to in the cart.
* <counter sale A> carries <coupon>'s cut at <shop A> and nobody tendered it.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<counter sale A>` | A till sale at <shop A> holding the member's goods, planned with <coupon> |

**Steps:**

1. Open the cart drawer on <grade10 store url>.
2. Choose <coupon> for this checkout.
3. Submit the checkout.
4. Read <counter sale A> at <shop A>.

**Expected Results:**

* The online checkout carries <coupon>'s cut.
* <counter sale A> still holds its goods and is not cancelled.
* <counter sale A> collects at full price, with no cut for <coupon>.

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

* customer(member holding <coupon>) whose <open checkout> carries <coupon>'s cut, unpaid.
* admin(shop staff) has a till session open for that member at <shop A>, goods rung up.

**Test data:**

| Route | How <coupon> reaches the sale |
| --- | --- |
| The member presents it | They open <coupon> in their own session and the till scans it |
| Staff apply it | They pick <coupon> from the member's panel in the till session |

**Steps:**

1. Reach the coupons in the till session at <shop A>.
2. Put <coupon> on the sale the row's way.
3. Read <open checkout>.

**Expected Results:**

* The counter sale carries <coupon>'s cut.
* <open checkout> reads cancelled.

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

* customer(member holding <coupon>) whose <coupon> is on <counter sale A> at <shop A>, untendered.
* admin(shop staff) has a till session open for that member at <shop B>, goods rung up.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<counter sale A>` | A till sale at <shop A> holding the member's goods, planned with <coupon> |

**Steps:**

1. Apply <coupon> from the member's panel at <shop B>.
2. Read <counter sale A> at <shop A>.

**Expected Results:**

* The sale at <shop B> carries <coupon>'s cut.
* The code minted for <coupon> on <counter sale A> is no longer live.

### grade10-site-loyalty-programme-US11-TC5-1: A sale nobody paid leaves the coupon spendable

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

* customer(member holding <coupon>) is signed in, with <coupon> carried by the row's sale and no money taken for it.

**Test data:**

| Sale carrying <coupon> | What became of it |
| --- | --- |
| An online order | It expired |
| An online order | It was cancelled |
| A till sale at <shop A> | It was abandoned, never tendered |

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read the coupons the member holds.

**Expected Results:**

* <coupon> reads unused.
* <coupon> can be chosen on a new checkout.

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
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) whose <coupon> is claimed by <counter sale A> at <shop A>.
* That member's cart on <grade10 store url> holds a line <coupon> applies to.
* admin(shop staff) has a till session open for that member at <shop A>.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<counter sale A>` | A till sale at <shop A> holding the member's goods, planned with <coupon> |

**Steps:**

1. Read the coupons on <grade10 loyalty url>.
2. Open the cart drawer on <grade10 store url>.
3. Open the member's panel in the till session at <shop A>.

**Expected Results:**

* Every coupon the member holds reads as spendable on all three surfaces.
* No surface names <counter sale A>, or any sale claiming a coupon.

### grade10-site-loyalty-programme-US11-TC7-1: Two sales collect one coupon, which is spent once and reported

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

* customer(member holding <coupon>) whose <counter sale A> collected a deactivated code for <coupon>.
* <later sale> carries <coupon>'s claim and collected its cut.
* Neither sale has settled.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<counter sale A>` | A till sale at <shop A> whose code for <coupon> was deactivated before it collected |
| `<later sale>` | The online order that claimed <coupon> away from <counter sale A> |

**Steps:**

1. Settle <later sale>.
2. Settle <counter sale A>.
3. Read the coupons on <grade10 loyalty url>.

**Expected Results:**

* <coupon> reads used once, spent by <later sale>, the sale that settled first.
* <counter sale A> is reported with the order on it, and spends <coupon> nowhere.

### grade10-site-loyalty-programme-US11-TC8-1: A claim is refused where the earlier checkout will not die

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) is on <grade10 store url>, signed in, with a line <coupon> applies to in the cart.
* <open checkout> carries <coupon>'s cut, unpaid.
* The shop refuses to kill <open checkout>.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<open checkout>` | An online checkout the member left open, carrying <coupon> |

**Steps:**

1. Open the cart drawer on <grade10 store url>.
2. Choose <coupon> for this checkout.
3. Submit the checkout.
4. Read <open checkout>.

**Expected Results:**

* The claim is refused, saying an earlier sale stands.
* No refusal says <coupon> is unavailable.
* <open checkout> still carries <coupon>'s cut.

### grade10-site-loyalty-programme-US11-TC9-1: A coupon on a sale that took the money does not move

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member whose <coupon> is carried by <paid sale>) is on <grade10 store url>, signed in, with a line <coupon> applies to in the cart.
* <paid sale> has been paid.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member redeemed, inside its validity |
| `<paid sale>` | An order carrying <coupon>'s cut that has taken the member's money |

**Steps:**

1. Open the cart drawer on <grade10 store url>.
2. Choose <coupon> for this checkout.

**Expected Results:**

* The claim is refused.
* <paid sale> still carries <coupon>'s cut.

### grade10-site-loyalty-programme-US11-TC10-1: A claim stands where the shop keeps the earlier code

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) is on <grade10 store url>, signed in, with a line <coupon> applies to in the cart.
* <counter sale A> carries <coupon>'s cut at <shop A> and nobody tendered it.
* The shop refuses to deactivate the code minted for <coupon> on <counter sale A>.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<counter sale A>` | A till sale at <shop A> holding the member's goods, planned with <coupon> |

**Steps:**

1. Open the cart drawer on <grade10 store url>.
2. Choose <coupon> for this checkout.
3. Submit the checkout.
4. Stop the shop refusing the deactivation.

**Expected Results:**

* The claim stands, and the checkout carries <coupon>'s cut.
* The deactivation is retried until the shop takes it.
* The code on <counter sale A> is no longer live.

### grade10-site-loyalty-programme-US11-TC11-1: A sale that gave no cut hands the coupon back

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

* customer(member holding <coupon>) whose <sale that gave no cut> promised <coupon> and collected without its cut.
* <sale that gave no cut> has been paid and has not settled.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<sale that gave no cut>` | A till sale at <shop A> planned with <coupon>, tendered at full price |

**Steps:**

1. Settle <sale that gave no cut>.
2. Read the coupons on <grade10 loyalty url>.

**Expected Results:**

* <coupon> reads unused, and can be chosen on a new checkout.
* Nothing is recorded as having come off <sale that gave no cut>.

---

## grade10-site-loyalty-programme-US6: Operator reverses a redemption a member cannot be given

**As an** operator,
**I want** to return a member's points and void their coupon while it is still unused,
**so that** a reward we cannot honour costs the member nothing.

### grade10-site-loyalty-programme-US6-TC1-1: A reversal is refused and names the sale claiming the coupon

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
* **Trace:** grade10-site-loyalty-programme-US-06

**Pre-conditions:**

* customer(member holding <coupon>) whose <coupon> is claimed by <counter sale A>, which can still collect its code.
* admin(holds the permission to reverse a redemption) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<counter sale A>` | A till sale at <shop A> planned with <coupon>, its code still collectable |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Reverse the redemption that issued <coupon>.

**Expected Results:**

* The reversal is refused.
* The refusal names <counter sale A>.

### grade10-site-loyalty-programme-US6-TC2-1: A claim nothing moves stops refusing the operator

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
* **Trace:** grade10-site-loyalty-programme-US-06

**Pre-conditions:**

* customer(member holding <coupon>) whose <coupon> is claimed by <stale counter sale>, tendered by nobody and claimed nowhere else.
* That claim has stood longer than any code minted for it can be collected.
* admin(holds the permission to reverse a redemption) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<coupon>` | A reward coupon the member holds, unused and inside its validity |
| `<stale counter sale>` | A till sale at <shop A> planned with <coupon> and left standing |

**Steps:**

1. Read the coupons on <grade10 loyalty url>.
2. Open that member on <grade10 loyalty admin url>.
3. Reverse the redemption that issued <coupon>.

**Expected Results:**

* Step 1 reads <coupon> as spendable.
* The console takes the reversal, naming no sale.
