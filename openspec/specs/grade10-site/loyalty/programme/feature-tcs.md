# grade10-site/loyalty/programme Test Cases

**Status:** pending-review · 0/77
**Drafts styled:** 2026-10-27, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Walk 1: Read the Gold tier card and open Tiers & Benefits from it

Starting state:

* customer(Gold member) is signed in and is on `<loyalty>`.
* The member holds `<balance>` and has `<qualifying points>` qualifying points over the rolling twelve months.

Shared test data:

| Field | Value |
| --- | --- |
| loyalty | The member's Membership page |
| balance | 1380 points (range: 1-79999 points) |
| qualifying points | 640 points (range: 500-79999 points) |

### Route

1. Scroll to the Membership section.
   * The card shows the gold skin with the balance, its checkout worth, the retention run, the earn line and the Benefits control, and no expiry line. `g10.loyalty-programme.US4-TC21`
2. Select the balance figure on the card.
   * The Tiers & Benefits page opens. `g10.loyalty-programme.US4-TC24`

## Background

* The member's surface is `<loyalty>` on the Grade10 site: the membership summary with its two counts, activity, the reward menu and the member's coupons. The operator console is `<loyalty console>` on the admin console; the reward form is `<reward form>`. A till session serves a member through the loyalty terminal's panel; Shopify POS is the till.
* Tiers: Silver, the entry tier; Gold at 500 qualifying points over the rolling twelve months; Black by invitation alone. A purchase earns a base point per HKD 10 of qualifying spend, floored, then the tier's multiplier (Gold 1.2), floored again. A point pays HKD 1 at checkout. The balance expires twelve calendar months after the member's last earning or redemption, on the programme's clock, Hong Kong's.
* An operator is admin with the loyalty permission each case names: read, move points, grant invitations, remove a tier, cancel a redemption, edit rewards.

* The member's surface is `<loyalty>` on the Grade10 site; its first section, "Membership", holds the tier card, a tier-skinned card in silver, gold or black.
* Tiers: Silver, the entry tier; Gold at 500 qualifying points over the rolling twelve months; Black by invitation alone, with no qualifying threshold.
* A point is worth HKD1 at checkout.

## g10.loyalty-programme.US1: Member holds one balance, with tier progress counted apart

**As a** member,
**I want** earning to count toward both and redeeming to spend only the balance,
**so that** spending points cannot take my tier, and losing the balance cannot take it either.

<!-- trace:case id=g10.loyalty-programme.TC-ykd rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### g10.loyalty-programme.US1-TC1: Redeeming spends only the balance, and losing the balance keeps the tier

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**

* A Gold member holds a balance of 600 and tier progress of 600; a reward costs 500.

**Steps:**

1. Redeem the reward, and read the summary.
2. Let the balance's inactivity window pass, inside Gold's validity period; read the summary.

**Expected Results:**

* Step 1 reads a balance of 100 and tier progress still 600, Gold unchanged.
* Step 2 reads a balance of 0, the member still Gold until its validity period ends.

<!-- trace:case id=g10.loyalty-programme.TC-v68 rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### g10.loyalty-programme.US1-TC2: Earning counts toward both, and reaching 500 makes Gold at once; Black is never earned

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**

* A Silver member with tier progress of 470, and no earlier purchase making Gold.

**Steps:**

1. Make a qualifying purchase earning 40 points, and read the summary and tier history.
2. Keep earning any number of points.

**Expected Results:**

* Step 1 raises the balance and the progress by 40, to 510: Gold from that purchase, earned at Silver's rate; one history entry records the move and the earning that caused it, Gold's validity dated from it.
* Step 2 never reaches Black.

<!-- trace:case id=g10.loyalty-programme.TC-r5y rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### g10.loyalty-programme.US1-TC3: A tier ends when its period or invitation does, keeping the balance

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**

* A member holds `<tier>`, with a live balance of 200.

**Test data:**

| `<tier>` | `<ends>` | `<then holds>` |
| --- | --- | --- |
| Gold, earning 300 inside its validity period | the period's end | Silver |
| Gold, earning 500 inside its validity period | the period's end | Gold, for a further twelve months |
| Black, by a dated invitation | the invitation's end | the tier they still hold by earning |

**Steps:**

1. Let `<ends>` pass; read the summary and tier history at the member's next evaluation.

**Expected Results:**

* They hold `<then holds>` from that instant, the drop recorded at that evaluation; the balance still reads 200.

<!-- trace:case id=g10.loyalty-programme.TC-89y rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### g10.loyalty-programme.US1-TC4: After a drop only later earnings count toward the tier again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**

* A member was dropped from Gold at the end of its validity period, having earned 400 in the year before.

**Steps:**

1. Make a small qualifying purchase, and read the tier progress.

**Expected Results:**

* Only earnings after the drop count; the 400 earlier do not.

<!-- trace:case id=g10.loyalty-programme.TC-u32 rev=1 -->
### g10.loyalty-programme.US1-TC5: An operator removes a tier granted in error

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**

* An operator holding the tier-removal permission opens a member granted Black in error, who holds Gold by earning.

**Steps:**

1. Remove Black inside its validity period, with a reason; read the member's tier and history.

**Expected Results:**

* The member holds Gold, the highest tier still held; the history records the removal, who did it and why.

---

## g10.loyalty-programme.US2: Member earns only on what they actually paid

**As a** member,
**I want** points from qualifying goods I paid for, and inactivity to expire the balance,
**so that** a discount, a gift card, or an auction win does not invent earn, and a quiet year empties spendable points.

<!-- trace:case id=g10.loyalty-programme.TC-f76 rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### g10.loyalty-programme.US2-TC1: A purchase earns at the member's rate on what was paid for qualifying goods, floored

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* A `<member>` member completes `<purchase>`.

**Test data:**

| `<member>` | `<purchase>` | `<earns>` |
| --- | --- | --- |
| Gold | HKD 1,000.00 of qualifying goods | 120 |
| Silver | HKD 125.50 of qualifying goods | 12 |
| Gold | HKD 139.00 of qualifying goods | 15, never 16 |
| Silver | HKD 1,000.00 of goods, HKD 200.00 off by a discount | 80 |
| Silver | HKD 1,000.00 of goods, HKD 300.00 paid with a coupon | 70 |
| Silver | HKD 800.00 of goods and HKD 200.00 of shipping, a HKD 100.00 order discount | 72 |
| Silver | HKD 800.00 of goods, 100 points paid toward it | 70 |
| Silver | goods, a shipping charge and a grading service fee | on the goods alone |
| Silver | a gift card | 0 |
| Silver | a store credit top-up | 0 |
| Silver | an auction win | 0 |
| Silver | goods discounted to nothing | 0, and no entry |

**Steps:**

1. Read the earning in activity, and the balance.

**Expected Results:**

* It earned `<earns>` points.

<!-- trace:case id=g10.loyalty-programme.TC-vid rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### g10.loyalty-programme.US2-TC2: A quiet year empties the balance, and any purchase or redemption keeps it alive

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* A member's last activity was `<last>`, on the programme's clock.

**Test data:**

| `<last>` | `<then>` | `<expiry reads>` |
| --- | --- | --- |
| an earning on 3 January at 10:00 | nothing | 3 January next year at 10:00, the whole balance lapsing then |
| an earning eleven months ago | a new earning today | twelve months from today, the oldest points with it |
| an earning eleven months ago | a redemption today | twelve months from today |
| an earning eleven months ago | a spend too small to earn a point | twelve months from today |
| an earning twelve months ago, now lapsed | a new purchase | a fresh balance of its earning alone, twelve months from today |

**Steps:**

1. Make `<then>`, and read the balance and the expiry line.

**Expected Results:**

* The expiry reads `<expiry reads>`; a lapsed balance reads 0 at once, and nothing lapsed returns.

<!-- trace:case id=g10.loyalty-programme.TC-0er rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### g10.loyalty-programme.US2-TC3: A refund claws back only what its money earned, never below zero

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* A Silver member's HKD 1,000.00 purchase earned 100 points; the member holds `<holds>`.

**Test data:**

| `<holds>` | `<refund>` | `<balance after>` |
| --- | --- | --- |
| all 100 | HKD 400.00, then HKD 300.00 | 30, as one refund of HKD 700.00 would leave |
| 20, having spent 80 | the whole purchase | 0, the shortfall of 80 recorded |

**Steps:**

1. Refund `<refund>`; read the balance, activity and tier progress.

**Expected Results:**

* The balance reads `<balance after>`; the tier progress falls by what was clawed back.

<!-- trace:case id=g10.loyalty-programme.TC-u6v rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### g10.loyalty-programme.US2-TC4: A purchase completes while loyalty is unreachable, and earns once when it is back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Earning and expiry

**Pre-conditions:**

* The programme cannot be reached.

**Steps:**

1. Complete a qualifying purchase, and read the order.
2. Bring the programme back, and read the member's activity; deliver the same purchase again.

**Expected Results:**

* Step 1 completes the purchase for the buyer.
* Step 2 grants its points once, with nobody acting, and the repeat grants nothing.

---

## g10.loyalty-programme.US3: Member redeems and can pay with points at checkout

**As a** member,
**I want** a redemption to settle as the reward it is, and points to reduce a bill at the programme's rate,
**so that** I cannot undo a spent reward, and deleting my account ends membership at once.

<!-- trace:case id=g10.loyalty-programme.TC-kx7 rev=1 -->
### g10.loyalty-programme.US3-TC1: Points pay toward a purchase at a dollar a point, once, on one balance

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**

* A member who earned online holds 300 points; an HKD 800.00 purchase waits at the counter.

**Steps:**

1. At the till, read the member's balance, and pay 100 points toward the purchase.
2. Read the bill, the balance and activity.

**Expected Results:**

* Step 1 reads the balance the online earning made.
* Step 2 leaves HKD 700.00 to pay, the balance down by 100, with one redemption recorded.

<!-- trace:case id=g10.loyalty-programme.TC-ht4 rev=1 -->
### g10.loyalty-programme.US3-TC2: A redemption of several units debits once, and a quantity past the bound is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**

* A member holds enough points for a per-unit reward.

**Test data:**

| `<quantity>` | `<outcome>` |
| --- | --- |
| 5 | one redemption of five times the unit price, the balance down by exactly that |
| one past the programme's bound | refused naming the bound, nothing recorded |

**Steps:**

1. Redeem the reward at `<quantity>`, and read the balance and activity.

**Expected Results:**

* It reads `<outcome>`.

<!-- trace:case id=g10.loyalty-programme.TC-0ec rev=1 -->
### g10.loyalty-programme.US3-TC3: Deleting the account clears the balance, the tier and the coupons at once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**

* A Gold member inside a live inactivity window holds points, an unused coupon and a pending collection.

**Steps:**

1. Delete the account; as an operator, read the member.

**Expected Results:**

* The balance and tier progress are 0, the coupon void and the collection cancelled, at once.

<!-- trace:case id=g10.loyalty-programme.TC-sb4 rev=1 -->
### g10.loyalty-programme.US3-TC4: A member cannot undo a redemption, nor spend points at an auction

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**

* A member holds points and an unused coupon.

**Test data:**

| `<tried>` |
| --- |
| asking for the coupon's points back from their own surface |
| paying for an auction purchase with points or the coupon |

**Steps:**

1. Try `<tried>`.

**Expected Results:**

* No member surface offers it, or it is refused; the points stay spent and the balance unchanged.

---

## g10.loyalty-programme.US4: Member reads two counts and redeems from one surface

**As a** member,
**I want** my tier, balance, and activity on one surface, in the programme's dates,
**so that** I can join, redeem, and never see the operator's reasons behind an entry.

<!-- trace:case id=g10.loyalty-programme.TC-2dk rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### g10.loyalty-programme.US4-TC1: The summary shows the two counts apart, with one expiry line in its tone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* A member holds a balance of 160 and tier progress of 300, the balance expiring in `<days>` days.

**Test data:**

| `<days>` | `<tone>` |
| --- | --- |
| 120 | plain |
| 9 | warning, saying what keeps the points |
| 0 | warning, saying what keeps the points |

**Steps:**

1. Open `<loyalty>`, and read the membership section.

**Expected Results:**

* The points that decide the tier and the points to spend read as two figures, never summed; one line names the 160 points and the day they go, in the `<tone>` tone.

<!-- trace:case id=g10.loyalty-programme.TC-9tr rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### g10.loyalty-programme.US4-TC6: A member holding no points is shown no expiry line

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* A member holds no live points.

**Steps:**

1. Read the membership section on `<loyalty>`.

**Expected Results:**

* It loads with nothing to spend, and no expiry line.

<!-- trace:case id=g10.loyalty-programme.TC-0hf rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua,g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### g10.loyalty-programme.US4-TC2: Points recorded before joining wait for the member, and joining once dates membership

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Membership and ledger

**Pre-conditions:**

* A user who never joined has earned 50 points on a purchase.

**Steps:**

1. Open `<loyalty>`.
2. Join; then join again.

**Expected Results:**

* Step 1 shows how to join, and the 50 points already held.
* Step 2 dates membership at the first join, the second changing nothing.

<!-- trace:case id=g10.loyalty-programme.TC-vex rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### g10.loyalty-programme.US4-TC3: A member's activity carries nothing operator-facing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* An operator corrected the member's balance with a written reason; the member redeemed a reward since archived.

**Steps:**

1. Read activity on `<loyalty>`.

**Expected Results:**

* The correction reads in member terms, with no operator reason; no entry carries a retry key, a request record, or tier and money arithmetic; the archived reward's entry still names it.

<!-- trace:case id=g10.loyalty-programme.TC-9v2 rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### g10.loyalty-programme.US4-TC4: Dates read in the programme's time zone

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* A member's browser is not in Hong Kong's zone.

**Steps:**

1. Read an expiry date and an activity date on `<loyalty>`.

**Expected Results:**

* Each reads as it does in Hong Kong's zone.

<!-- trace:case id=g10.loyalty-programme.TC-odc rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### g10.loyalty-programme.US4-TC8: A reward coupon shows no code in the member's coupons

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* A member holds an unused reward coupon taking HKD 50.00 off one product, which no sale claims.

**Steps:**

1. Read it in the member's coupons on `<loyalty>`.

**Expected Results:**

* It shows what it takes off, its state and when it ends, with no discount code and nothing to copy one.

<!-- trace:case id=g10.loyalty-programme.TC-9i4 rev=1 covers=g10.loyalty-programme.SC-hp7,g10.loyalty-programme.SC-ixi,g10.loyalty-programme.SC-css,g10.loyalty-programme.SC-g01,g10.loyalty-programme.SC-g5s,g10.loyalty-programme.SC-elq,g10.loyalty-programme.SC-hgd,g10.loyalty-programme.SC-des,g10.loyalty-programme.SC-hlf,g10.loyalty-programme.SC-dcn,g10.loyalty-programme.SC-yob,g10.loyalty-programme.SC-4s4,g10.loyalty-programme.SC-jea,g10.loyalty-programme.SC-bwq,g10.loyalty-programme.SC-dqm,g10.loyalty-programme.SC-x8s,g10.loyalty-programme.SC-xyn -->
### g10.loyalty-programme.US4-TC9: The public menu shows only what a member can buy

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* Rewards stand live, archived and outside their window; nobody is signed in.

**Steps:**

1. Read the reward menu on `<loyalty>`.

**Expected Results:**

* It lists only the live, unarchived rewards, each with its point price and its coupon's validity, disclosing no stock count or edit history.

<!-- trace:case id=g10.loyalty-programme.TC-4id rev=1 covers=g10.loyalty-programme.SC-hp7,g10.loyalty-programme.SC-ixi,g10.loyalty-programme.SC-css,g10.loyalty-programme.SC-g01,g10.loyalty-programme.SC-g5s,g10.loyalty-programme.SC-elq,g10.loyalty-programme.SC-hgd,g10.loyalty-programme.SC-des,g10.loyalty-programme.SC-hlf,g10.loyalty-programme.SC-dcn,g10.loyalty-programme.SC-yob,g10.loyalty-programme.SC-4s4,g10.loyalty-programme.SC-jea,g10.loyalty-programme.SC-bwq,g10.loyalty-programme.SC-dqm,g10.loyalty-programme.SC-x8s,g10.loyalty-programme.SC-xyn -->
### g10.loyalty-programme.US4-TC10: A redemption costs once and its coupon reads at once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* A signed-in member can redeem a reward.

**Steps:**

1. Submit the redemption twice, with a reload between.
2. Read the balance and the coupons.

**Expected Results:**

* One redemption is recorded and charged; its coupon and validity show with no further step.

<!-- trace:case id=g10.loyalty-programme.TC-m1l rev=1 covers=g10.loyalty-programme.SC-hp7,g10.loyalty-programme.SC-ixi,g10.loyalty-programme.SC-css,g10.loyalty-programme.SC-g01,g10.loyalty-programme.SC-g5s,g10.loyalty-programme.SC-elq,g10.loyalty-programme.SC-hgd,g10.loyalty-programme.SC-des,g10.loyalty-programme.SC-hlf,g10.loyalty-programme.SC-dcn,g10.loyalty-programme.SC-yob,g10.loyalty-programme.SC-4s4,g10.loyalty-programme.SC-jea,g10.loyalty-programme.SC-bwq,g10.loyalty-programme.SC-dqm,g10.loyalty-programme.SC-x8s,g10.loyalty-programme.SC-xyn -->
### g10.loyalty-programme.US4-TC11: Repricing or re-dating a reward leaves what was redeemed as it was

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* A member redeemed a reward, its coupon issued.

**Steps:**

1. As an operator, change the reward's cost and its coupon validity.
2. Read the member's redemption and coupon.

**Expected Results:**

* The redemption still reads the price paid, and the coupon the validity it was issued with.

<!-- trace:case id=g10.loyalty-programme.TC-p5o rev=1 covers=g10.loyalty-programme.SC-hp7,g10.loyalty-programme.SC-ixi,g10.loyalty-programme.SC-css,g10.loyalty-programme.SC-g01,g10.loyalty-programme.SC-g5s,g10.loyalty-programme.SC-elq,g10.loyalty-programme.SC-hgd,g10.loyalty-programme.SC-des,g10.loyalty-programme.SC-hlf,g10.loyalty-programme.SC-dcn,g10.loyalty-programme.SC-yob,g10.loyalty-programme.SC-4s4,g10.loyalty-programme.SC-jea,g10.loyalty-programme.SC-bwq,g10.loyalty-programme.SC-dqm,g10.loyalty-programme.SC-x8s,g10.loyalty-programme.SC-xyn -->
### g10.loyalty-programme.US4-TC12: The last unit of a limited reward is not oversold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* A limited reward has one unit left.

**Steps:**

1. Redeem it as two members at once.

**Expected Results:**

* One succeeds; the other is refused as out of stock.

<!-- trace:case id=g10.loyalty-programme.TC-yk2 rev=1 covers=g10.loyalty-programme.SC-hp7,g10.loyalty-programme.SC-ixi,g10.loyalty-programme.SC-css,g10.loyalty-programme.SC-g01,g10.loyalty-programme.SC-g5s,g10.loyalty-programme.SC-elq,g10.loyalty-programme.SC-hgd,g10.loyalty-programme.SC-des,g10.loyalty-programme.SC-hlf,g10.loyalty-programme.SC-dcn,g10.loyalty-programme.SC-yob,g10.loyalty-programme.SC-4s4,g10.loyalty-programme.SC-jea,g10.loyalty-programme.SC-bwq,g10.loyalty-programme.SC-dqm,g10.loyalty-programme.SC-x8s,g10.loyalty-programme.SC-xyn -->
### g10.loyalty-programme.US4-TC13: A reward archived or outside its window cannot be redeemed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* A reward is `<state>`.

**Test data:**

| `<state>` |
| --- |
| archived |
| outside its live window |

**Steps:**

1. Redeem it as a member.

**Expected Results:**

* It is refused, and nothing is spent.

<!-- trace:case id=g10.loyalty-programme.TC-t1c rev=1 -->
### g10.loyalty-programme.US4-TC21: The tier card shows the skin, balance, worth, retention run and earn rate

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(`<tier>` member) is signed in and is on `<loyalty>`, holding `<balance>` and `<qualifying points>` qualifying points over the rolling twelve months.

**Test data:**

| `<tier>` | `<skin>` | `<balance>` | `<worth>` | `<qualifying points>` | `<earn rate>` |
| --- | --- | --- | --- | --- | --- |
| Silver | silver | 740 points (range: 1-79999 points) | HKD740 (`<balance>` at HKD1 a point) | 180 points (range: 0-499 points) | 1× earn rate |
| Gold (500 qualifying points, fixed threshold) | gold | 1380 points (range: 1-79999 points) | HKD1380 (`<balance>` at HKD1 a point) | 640 points (range: 500-79999 points) | 1.2× earn rate |

**Steps:**

1. Scroll to the Membership section.

**Expected Results:**

* The card shows in the `<skin>` skin, naming `<tier>`.
* The balance reads `<balance>`, with `<worth>` beside it as what it pays at checkout.
* The retention run reads `<qualifying points>` against the 500-point qualifying threshold.
* The earn line reads `<earn rate>`.
* The card shows a Benefits control.
* The card shows no expiry date and no line about points expiring. UI matching loyalty-membership-blocks-tiercard--gold

<!-- trace:case id=g10.loyalty-programme.TC-b7k rev=1 -->
### g10.loyalty-programme.US4-TC22: A Black member's card shows no retention run

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Black member, granted by invitation) is signed in and is on `<loyalty>`, holding `<balance>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<balance>` | 5200 points (range: 1-79999 points) |
| `<worth>` | HKD5200 (`<balance>` at HKD1 a point) |

**Steps:**

1. Scroll to the Membership section.

**Expected Results:**

* The card shows in the black skin.
* The balance reads `<balance>`, with `<worth>` beside it as what it pays at checkout.
* The card shows the tier's earn line and a Benefits control.
* The card shows no retention run and no qualifying threshold.

<!-- trace:case id=g10.loyalty-programme.TC-n0z rev=1 -->
### g10.loyalty-programme.US4-TC23: A member with no points sees a zero balance and a zero worth

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Silver member) is signed in and is on `<loyalty>`, holding no points and no qualifying points.

**Steps:**

1. Scroll to the Membership section.

**Expected Results:**

* The card shows in the silver skin.
* The balance reads 0 points, with a worth of HKD0 beside it.
* The card still shows its retention run, its earn line and the Benefits control.

<!-- trace:case id=g10.loyalty-programme.TC-w5h rev=1 -->
### g10.loyalty-programme.US4-TC24: Selecting anywhere on the tier card opens Tiers & Benefits

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Gold member) is signed in and is on `<loyalty>`, scrolled to the Membership section.

**Test data:**

| `<where>` |
| --- |
| The balance figure on the card |
| The Benefits control on the card |
| The earn line on the card |

**Steps:**

1. Select `<where>`.

**Expected Results:**

* The Tiers & Benefits page opens.

<!-- trace:case id=g10.loyalty-programme.TC-q8d rev=1 -->
### g10.loyalty-programme.US4-TC25: The tier card reads in the member's language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Gold member) is signed in with the site language set to `<language>`, holding 1380 points (range: 1-79999 points).

**Test data:**

| `<language>` |
| --- |
| English |
| Traditional Chinese |
| Simplified Chinese |
| Korean |

**Steps:**

1. Open `<loyalty>`.
2. Scroll to the Membership section.

**Expected Results:**

* The card's balance, points, qualifying and Benefits words read in `<language>`, and none shows a missing-text key or another language.
* The balance figure and its worth are the same as in English.

---

## g10.loyalty-programme.US5: Operator runs the programme from one console

**As an** operator,
**I want** each action behind a named permission, with a record that cannot be rewritten,
**so that** I can correct, reverse, and find a member without holding powers I was not given.

<!-- trace:case id=g10.loyalty-programme.TC-ssz rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### g10.loyalty-programme.US5-TC1: Live invitations are listed, and a grant of an unknown or the entry tier is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Tiers and invitations

**Pre-conditions:**

* An operator who may grant invitations; live grants stand.

**Steps:**

1. On `<loyalty console>`, list invitations.
2. Grant a tier the programme does not define; then the entry tier.

**Expected Results:**

* Step 1 lists every live grant with its member, tier, reason and end date.
* Step 2 refuses the first as not found and the second as invalid, recording nothing.

<!-- trace:case id=g10.loyalty-programme.TC-6en rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### g10.loyalty-programme.US5-TC2: An action needs its own permission, and the record cannot be rewritten

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* An operator holds only the point-movement permission.

**Steps:**

1. Try to remove a member's tier.
2. Try an action the log cannot record.
3. Alter a recorded action, and verify the log.

**Expected Results:**

* Steps 1 and 2 are refused, nothing happening.
* Step 3's verification names the position at which the log breaks.

<!-- trace:case id=g10.loyalty-programme.TC-1lu rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### g10.loyalty-programme.US5-TC3: A correction is spendable without moving the member up, and a campaign grant moves them up

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Operator console

**Pre-conditions:**

* An operator who may move points opens a Silver member with tier progress 450.

**Test data:**

| `<credit>` | `<progress after>` |
| --- | --- |
| a correction of 100 | 450, still Silver |
| a campaign grant of 100 | 550, Gold |

**Steps:**

1. Add `<credit>` with a reason; read the member's summary.

**Expected Results:**

* The balance rises by 100, spendable; the progress reads `<progress after>`.

<!-- trace:case id=g10.loyalty-programme.TC-6ar rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### g10.loyalty-programme.US5-TC6: A loyalty permission alone shows no identity, and the identity read is recorded

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Operator console

**Pre-conditions:**

* An operator holds `<grants>`.

**Test data:**

| `<grants>` | `<shows>` |
| --- | --- |
| loyalty permissions alone | the member's loyalty state, and no name or email |
| loyalty permissions and the identity permission | the name and email, the log recording who read which records and how many, without the names |
| both, the identity system unreachable | the failure, and no member with a blank identity |

**Steps:**

1. Find a member on `<loyalty console>`.

**Expected Results:**

* It shows `<shows>`.

<!-- trace:case id=g10.loyalty-programme.TC-1an rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### g10.loyalty-programme.US5-TC4: Sections follow the permissions, a member view can be shared, and a missing second factor opens the gate

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* Operator A holds only loyalty read; operator B may move points, their session not second-factor verified.

**Steps:**

1. As A, open the console, find a member and share the view's address.
2. As B, open the shared address, and add points.

**Expected Results:**

* Step 1 reads members, offering no point movement, expiry restart, invitations, rewards or tier removal.
* Step 2 opens the same member; adding points takes B to verify, then completes.

<!-- trace:case id=g10.loyalty-programme.TC-7u6 rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### g10.loyalty-programme.US5-TC5: A stale console reports which call it could not read

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* The console receives a response whose shape it does not recognise.

**Steps:**

1. Open the view that reads it.

**Expected Results:**

* It names the call that failed to decode, not showing missing values.

<!-- trace:case id=g10.loyalty-programme.TC-xmn rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3,g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### g10.loyalty-programme.US5-TC12: Points an operator adds take the date the form names first

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* An operator who may move points opens `<member>`.

**Test data:**

| `<member>` | `<added>` | `<expiry>` |
| --- | --- | --- |
| a member holding 60 live points, expiring on `<balance expiry>` | a correction of 50 today | `<balance expiry>`, joining the window already running |
| the same | a campaign grant of 100 dated a day before today | `<balance expiry>` |
| a member whose 200 points lapsed | a campaign grant of 50 today | twelve months from today, starting the window; the 200 never returning |

**Steps:**

1. Open the form that adds points, and read the day it names.
2. Add `<added>` with a reason; read the member's balance and expiry line on `<loyalty>`.

**Expected Results:**

* Step 1 names `<expiry>` before anything is written, saying whether it joins or starts the window.
* Step 2's added points expire on `<expiry>`, the window otherwise unmoved.

<!-- trace:case id=g10.loyalty-programme.TC-zoy rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### g10.loyalty-programme.US5-TC13: A reward handed over outright is not the member's activity

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* A member holds 60 live points expiring on `<balance expiry>`, with no activity since.

**Steps:**

1. As an operator, give them a reward outright, taking no points; read their expiry line.

**Expected Results:**

* It still reads `<balance expiry>`.

<!-- trace:case id=g10.loyalty-programme.TC-80a rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### g10.loyalty-programme.US5-TC8: Restarting the window sets it twelve months from today, never shorter, reviving nothing and moving no points

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* An operator who may move points opens `<member>`.

**Test data:**

| `<member>` | `<expiry after>` |
| --- | --- |
| holding 160 live points expiring within twelve months, their activity ending with a redemption | twelve months from today |
| whose 200 points lapsed, holding 50 recorded since | twelve months from today for the 50, the 200 staying written off |
| holding 120 points expiring more than twelve months out | unchanged |

**Steps:**

1. Restart the member's expiry window with the reason Goodwill for a delayed order.
2. Read the member's balance, expiry and activity, and the operator log.

**Expected Results:**

* The expiry reads `<expiry after>`; the balance is unchanged and activity names no restart; the log carries the restart and its reason.

---

## g10.loyalty-programme.US6: Operator reverses a redemption a member cannot be given

**As an** operator,
**I want** to return a member's points and void their coupon while it is still unused,
**so that** a reward we cannot honour costs the member nothing.

<!-- trace:case id=g10.loyalty-programme.TC-49a rev=1 -->
### g10.loyalty-programme.US6-TC1: Reversing a redemption returns its points with their expiry and voids its coupon

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-06

**Pre-conditions:**

* A member redeemed 300 points, from earnings expiring on `<expiry>`, for a reward of unlimited stock; its coupon is unused and no sale claims it.

**Steps:**

1. As an operator, reverse the redemption with a reason.
2. Read the member's balance, expiry, tier progress and coupons, and the reward's stock.

**Expected Results:**

* The 300 points return, expiring on `<expiry>`; the tier progress is unchanged; the coupon can no longer be used; no stock is returned.

<!-- trace:case id=g10.loyalty-programme.TC-dkc rev=1 -->
### g10.loyalty-programme.US6-TC2: A reversal is refused while the coupon is used or a sale claims it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-06

**Pre-conditions:**

* A member's redeemed coupon is `<state>`.

**Test data:**

| `<state>` | `<refusal names>` |
| --- | --- |
| used on a sale | the coupon as used |
| claimed by a sale that can still collect its code | that sale |
| claimed by an online order that expired, its code still collectable | that order |

**Steps:**

1. As an operator, reverse the redemption.

**Expected Results:**

* It is refused, naming `<refusal names>`; the points stay spent.

<!-- trace:case id=g10.loyalty-programme.TC-kh2 rev=1 -->
### g10.loyalty-programme.US6-TC3: A reversal into a lapsed balance returns nothing, saying why

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-06

**Pre-conditions:**

* A member's inactivity window has passed since they redeemed a coupon, still unused.

**Steps:**

1. As an operator, reverse the redemption; read the answer and the member's balance.

**Expected Results:**

* No points come back; the balance stays 0, the answer naming the points not returned and why.

<!-- trace:case id=g10.loyalty-programme.TC-y4s rev=1 -->
### g10.loyalty-programme.US6-TC4: A refunded sale does not return the coupon it spent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-06

**Pre-conditions:**

* A sale spent a member's coupon, and 50 points paid toward it.

**Steps:**

1. Refund the sale; read the member's coupons and balance.

**Expected Results:**

* The coupon stays used and the points it cost stay spent; the 50 points paid toward the sale are returned.

---

## g10.loyalty-programme.US7: Member redeems any reward as one coupon

**As a** member,
**I want** every reward I redeem — money off, a gift, or a physical item — to become a coupon with its own kind, discount and scope,
**so that** a physical reward settles like an ordinary purchase and I never wait for a separate collection.

<!-- trace:case id=g10.loyalty-programme.TC-7zz rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### g10.loyalty-programme.US7-TC14: Redeeming any reward leaves a coupon at once, with nothing to collect

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* A Free item reward of a variant costs 100 points; a signed-in member holds at least 100.

**Steps:**

1. Redeem it from the menu on `<loyalty>`, and open the coupons.

**Expected Results:**

* The balance falls by 100; a coupon from the reward shows available, with no collection step and nothing waiting.

<!-- trace:case id=g10.loyalty-programme.TC-9xj rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### g10.loyalty-programme.US7-TC8: A coupon takes off online what its discount and scope name

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* A member holds an unused coupon redeemed from `<reward>`, with `<basket>` in the online basket; variant 1 is in world 1, priced above HKD 20.00, variant 2 in another world.

**Test data:**

| `<reward>` | `<basket>` | `<taken off>` |
| --- | --- | --- |
| HKD 20.00 off, named variant 1 | variants 1 and 2 | HKD 20.00, from variant 1's line |
| 10% off the whole order, at most HKD 100.00 | HKD 2,000.00 of goods | HKD 100.00 |
| 10% off the whole order, no maximum | HKD 2,000.00 of goods | HKD 200.00 |
| 10% off the whole order, no maximum | variants 1 and 2 | 10% of each line |
| HKD 20.00 off, a filter of world 1 | variants 1 and 2 | HKD 20.00, from variant 1's line |
| a Free item of variant 1 | variants 1 and 2 | variant 1's price, from its line |
| a gift of a variant, minimum spend HKD 500.00 | exactly HKD 500.00 of goods | nothing; a free line for the gift added |

**Steps:**

1. At checkout, apply the coupon, and read each line and the total.

**Expected Results:**

* It shows `<taken off>`, every line the scope does not match at full price.

<!-- trace:case id=g10.loyalty-programme.TC-ixx rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### g10.loyalty-programme.US7-TC9: A gift's coupon is refused below its minimum spend or with the gift already held

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* A member holds a coupon from a gift reward, minimum spend HKD 500.00, with `<basket>` in the online basket.

**Test data:**

| `<basket>` |
| --- |
| HKD 499.99 of goods |
| HKD 500.00 of goods, the gift among them |

**Steps:**

1. At checkout, apply the coupon, and read the lines and total.

**Expected Results:**

* It is refused; no free line is added and the total is unchanged.

<!-- trace:case id=g10.loyalty-programme.TC-fzq rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### g10.loyalty-programme.US7-TC12: A free item's coupon never adds its item online

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* A member holds a coupon from a Free item reward of variant 1, with only variant 2 in the basket.

**Steps:**

1. At checkout, apply the coupon, and read the lines and total.

**Expected Results:**

* It is refused, nothing matching it; no variant 1 line is added and the total is unchanged.

<!-- trace:case id=g10.loyalty-programme.TC-gbd rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### g10.loyalty-programme.US7-TC6: A product coupon reaches the till from the panel or the member's phone, minting one code

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* Shop staff serve a member at shop A, the sale holding an HKD 780.00 product; the member holds an unused coupon taking HKD 50.00 off that product's variant, with no code minted.

**Test data:**

| `<route>` |
| --- |
| staff choose it in the member's panel |
| the member opens it on their phone and the till scans it |

**Steps:**

1. Put the coupon on the sale by `<route>`, and apply the sale; read the codes minted.
2. Choose 100 points in the panel and apply the sale again; read the sale's discount codes in Shopify POS.

**Expected Results:**

* Step 1 puts its cut on the sale, minting one code.
* Step 2 shows exactly one code for it, the cut still on the sale.

<!-- trace:case id=g10.loyalty-programme.TC-xnm rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### g10.loyalty-programme.US7-TC10: A free item or a gift goes on at the till as a free line

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* A member holds a coupon from `<reward>`, the panel open at the till; the sale holds `<sale>`.

**Test data:**

| `<reward>` | `<sale>` | `<reads>` |
| --- | --- | --- |
| a Free item of variant 1 | one variant 1 and nothing else | variant 1's line at nothing, a total of HKD 0.00 |
| a gift of a variant, minimum spend HKD 500.00 | HKD 500.00 of goods, no gift | a gift line at nothing, every other line at full price, no discount code |

**Steps:**

1. Apply it, by the panel or the member presenting it; read the sale.
2. Complete the sale, and open the member's coupons.

**Expected Results:**

* Step 1 reads `<reads>`.
* Step 2 completes as an ordinary sale with no collection step; the coupon reads used.

<!-- trace:case id=g10.loyalty-programme.TC-t2k rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### g10.loyalty-programme.US7-TC7: A coupon scoped to products or a filter is online only at the till

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* A member holds an unused HKD 20.00 coupon from `<reward>`; the till sale holds variant 1; staff have the panel open.

**Test data:**

| `<reward>` | `<applied by>` | `<outcome>` |
| --- | --- | --- |
| named products, saved in the form | staff, from the panel | not applied |
| a catalog filter, saved in the form | staff, from the panel | not applied |
| named products, for online and in store through the admin API | staff, from the panel | not applied |
| named products, for online and in store through the admin API | the member, from their phone | not offered |
| a catalog filter, for online and in store through the admin API | the member, from their phone | not offered |
| named products, for in store alone through the admin API | the member, from their phone | not offered |

**Steps:**

1. Find the coupon in the panel, and apply it by `<applied by>`.

**Expected Results:**

* The panel marks it online only; it is `<outcome>`, the price unchanged; where the member tries from their phone, the coupon carries no Use at the counter.

<!-- trace:case id=g10.loyalty-programme.TC-q9z rev=2 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### g10.loyalty-programme.US7-TC11: The menu says where a reward's coupon can be spent, before it is redeemed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* `<reward>`, HKD 20.00 off, is live, saved through the admin API for `<channels>`.

**Test data:**

| `<reward>` | `<channels>` | `<menu reads>` |
| --- | --- | --- |
| named products | online and in store | Online store only |
| a catalog filter | online and in store | Online store only |
| named products | in store alone | Online store only |
| named variants | online and in store | no channel |
| named variants | online alone | Online store only |

**Steps:**

1. Read the reward on the menu on `<loyalty>`.

**Expected Results:**

* It reads `<menu reads>`.

---

## g10.loyalty-programme.US8: Member sees what a channel does to their points, before and after

**As a** member,
**I want** a channel's own spending limit disclosed before points leave, and every activity entry to name the channel it came from,
**so that** I always know what happened to my balance and why.

<!-- trace:case id=g10.loyalty-programme.TC-uq9 rev=1 -->
### g10.loyalty-programme.US8-TC1: A channel's own limit is told before points leave, and every entry names its channel

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-08

**Pre-conditions:**

* A member pays with points on a channel that settles through something that cannot be spent elsewhere; they also earned online and at a shop.

**Steps:**

1. Choose to pay with points on that channel, and read what is said before confirming.
2. Read activity on `<loyalty>`.

**Expected Results:**

* Step 1 discloses the channel's limit before any points leave.
* Step 2 names the channel of each entry, in member terms.

---

## g10.loyalty-programme.US9: Operator authors a reward's full definition from the console

**As an** operator,
**I want** the reward form to set a reward's kind, discount, scope and combine setting,
**so that** publishing any reward never needs the admin API.

<!-- trace:case id=g10.loyalty-programme.TC-nzm rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC1: A money-off reward is authored from the console alone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* An operator who may edit rewards is on `<reward form>` for a new reward; variant 1's product holds two variants.

**Test data:**

| `<discount>` | `<scope>` | `<stacks with>` |
| --- | --- | --- |
| HKD 20.00 off | named variant 1 | the store default |
| 10%, no maximum | the whole order | product discounts alone |
| 10%, at most HKD 100.00 | named variant 1 | the store default |

**Steps:**

1. Click Money off; enter `<discount>`, `<scope>` and `<stacks with>`, a new name and a cost of 100.
2. Click Create reward, and open it from the rewards list.

**Expected Results:**

* It is listed, and reopens as Money off with `<discount>`, `<scope>` and `<stacks with>`, an empty maximum left empty.

<!-- trace:case id=g10.loyalty-programme.TC-bju rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC2: A free item is created from one variant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* An operator is on `<reward form>` for a new reward.

**Steps:**

1. Click Free item, and read the form.
2. Pick variant 2, then variant 1; name it, cost it 100, and read the rail's coupon sentence.
3. Create it, and open it from the list.

**Expected Results:**

* Step 1 shows one item picker and the minimum spend, the coupon terms and menu entry, and no discount or scope.
* Step 2 holds variant 1 alone; the sentence takes variant 1 off once it is in the basket, never saying it adds it.
* Step 3 lists it taking everything off variant 1, reopening as Free item with variant 1.

<!-- trace:case id=g10.loyalty-programme.TC-7q7 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC3: A stored product coupon reopens as the kind its definition is

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* `<stored>` was created in the form.

**Test data:**

| `<stored>` | `<reopens as>` |
| --- | --- |
| everything free, named variant 1 alone, minimum spend HKD 500.00, stacking with product discounts alone | Free item, variant 1, HKD 500.00, product discounts alone, its duplicate the same |
| everything free, named variants 1 and 2 | Money off, as stored |
| 100%, at most HKD 100.00, named variant 1 | Money off, as stored |
| 90%, named variant 1 | Money off, as stored |
| everything free, a named one-variant product | Money off, as stored |
| everything free, the whole order | Money off, as stored |

**Steps:**

1. Open it from the rewards list; open More and click Duplicate.

**Expected Results:**

* It, and its duplicate, read `<reopens as>`.

<!-- trace:case id=g10.loyalty-programme.TC-xlj rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC6: A gift with a purchase is created and reopens as a gift

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* An operator is on `<reward form>` for a new reward.

**Steps:**

1. Click Gift with a purchase, pick variant 1, enter HKD 500.00 as the minimum spend, name and cost it.
2. Create it, and open it.

**Expected Results:**

* Step 1 shows a gift picker and the minimum spend, no discount or scope.
* Step 2 lists it, reopening as Gift with a purchase, variant 1 and HKD 500.00.

<!-- trace:case id=g10.loyalty-programme.TC-gm2 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC7: A scope of products or a filter saves the reward online only

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* An operator is on `<reward form>` for a new HKD 20.00 Money off reward, Both chosen under Where it can be spent.

**Test data:**

| `<scope>` | `<before saving>` | `<on reopening>` |
| --- | --- | --- |
| named product 1 | the online-only note; Online chosen, In store and Both unavailable | Online |
| a filter of world 1 | the online-only note; Online chosen, In store and Both unavailable | Online |
| named variant 1 | no note; Both | Both |
| the whole order | no note; Both | Both |
| named product 1, then named variant 1 | no note; Both | Both |

**Steps:**

1. Choose `<scope>`, and read the channels; name, cost and create it, and reopen it.

**Expected Results:**

* Before saving it reads `<before saving>`; on reopening, `<on reopening>`.

<!-- trace:case id=g10.loyalty-programme.TC-2kx rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC12: A product-scoped reward stored for the till saves online only

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* A reward was saved through the admin API as HKD 20.00 off named product 1, for online and in store.

**Test data:**

| `<edit>` | `<channels>` |
| --- | --- |
| none | Online |
| its scope changed to named variant 1 | Both |

**Steps:**

1. Open it, and read the channels; make `<edit>`, save and reload.

**Expected Results:**

* It opens with Online chosen, In store and Both unavailable; after the save it reads `<channels>`.

<!-- trace:case id=g10.loyalty-programme.TC-0t9 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC8: A money-off reward edited into a free item reopens as one

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* A live HKD 20.00 Money off reward on the whole order.

**Steps:**

1. Open it, click Free item, pick variant 1, save and reload.

**Expected Results:**

* Opening notes that a new kind reaches only later redemptions; the discount and scope hide; it reloads as Free item, variant 1, with no amount or scope carried over.

<!-- trace:case id=g10.loyalty-programme.TC-k4w rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC18: A kind moved to from another opens empty

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* An operator is on `<reward form>` for a new reward.

**Steps:**

1. Click Free item and pick variant 1; click Money off, and read it; click Free item again, and read it.

**Expected Results:**

* Money off opens on an amount with none entered and named variants with none picked; Free item opens with no item picked.

<!-- trace:case id=g10.loyalty-programme.TC-90b rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC9: A reward missing a part is not created, the save bar naming it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* An operator is on `<reward form>` for a new reward, named and costed, `<choice>` chosen with `<gap>`.

**Test data:**

| `<choice>` | `<gap>` |
| --- | --- |
| Free item | no item picked |
| Money off, the whole order | no amount |
| Money off, HKD 20.00, named products | no product picked |
| Money off, HKD 20.00, a catalog filter | no filter value |
| Gift with a purchase | no gift picked |
| Gift with a purchase, variant 1 | no minimum spend |
| Gift with a purchase, variant 1 | a minimum spend of HKD 0.00 |
| Money off, HKD 20.00, the whole order, in a window | Live until a day before Live from |

**Steps:**

1. Click Create reward; click the gap in the save bar; click ← Rewards.

**Expected Results:**

* The save bar names `<gap>`, the window's end shown on Live until; clicking it focuses its field; no reward is listed under the name.

<!-- trace:case id=g10.loyalty-programme.TC-p8e rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC19: A window of one day is saved

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* An operator is on `<reward form>` for a new HKD 20.00 reward on the whole order.

**Steps:**

1. Choose In a window with a day after today as Live from and Live until; name, cost, create and open it.

**Expected Results:**

* Live until shows no error; it is listed scheduled, reading that day for both.

<!-- trace:case id=g10.loyalty-programme.TC-vet rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC14: The basket check states what the coupon would take off a basket

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* An operator has `<coupon>` complete in `<reward form>`; variant 1 is priced under HKD 500.00 and above HKD 20.00, variant 2 at or above HKD 500.00.

**Test data:**

| `<coupon>` | `<basket>` | `<verdict>` |
| --- | --- | --- |
| Money off HKD 20.00, named variant 1 | one variant 1 | HKD 20.00 off |
| Money off HKD 20.00, named variant 1 | one variant 2 | nothing in the basket matches the scope |
| Money off HKD 0.01, named variant 1 | one line of two variant 1 | the discount cannot split |
| Gift of a third variant, minimum HKD 500.00 | one variant 2 | adds the gift free, goods unchanged |
| Gift of a third variant, minimum HKD 500.00 | variant 2 and the gift | the gift is already in the basket |
| Gift of a third variant, minimum HKD 500.00 | one variant 1 | under the minimum spend |
| Free item of variant 1, minimum HKD 500.00 | variants 1 and 2 | variant 1's price off |
| Free item of variant 1, minimum HKD 500.00 | one variant 2 | nothing in the basket matches the scope |
| Free item of variant 1, minimum HKD 500.00 | one variant 1 alone | under the minimum spend |

**Steps:**

1. In the rail's basket check, add `<basket>` by search, and read the verdict; click ← Rewards for a new reward.

**Expected Results:**

* It reads `<verdict>` in a tinted box, the lines as added and none added by the check; a new reward left unsaved is not listed.

<!-- trace:case id=g10.loyalty-programme.TC-3z2 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC15: The basket check asks for a finished coupon, then a line

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* An operator is on `<reward form>` for a new reward.

**Steps:**

1. Read the basket check; enter HKD 20.00 off the whole order, read it; add one variant 1, read it.

**Expected Results:**

* It asks for the coupon to be finished, then for a line, then shows HKD 20.00 taken off.

<!-- trace:case id=g10.loyalty-programme.TC-27v rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC16: The basket check names a catalogue it cannot read

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* Looking a basket line up in the catalogue fails.

**Steps:**

1. Enter HKD 20.00 off the whole order; add one variant 1 by search, and read the verdict.

**Expected Results:**

* It says the catalogue could not be read, in an error tint, taking nothing off and asking to try again.

<!-- trace:case id=g10.loyalty-programme.TC-rlp rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC13: A reward stored with a retired handover keeps it until a choice is made

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* A reward is stored as `<handover>`, which the form cannot create.

**Test data:**

| `<handover>` | `<menu card>` |
| --- | --- |
| a manual handover | No coupon limit |
| a counter collection of variant 1 within 7 days | Collect in store within 7 days |

**Steps:**

1. Read its terms in the list, and open it.
2. Rename it and save; read it through the admin API.
3. Duplicate it; then, in the original, choose Money off, HKD 20.00, the whole order, and save; read it again.

**Expected Results:**

* Step 1 marks it retired, and opens with a note naming the retired handover, no card chosen, no field, the menu card reading `<menu card>` and the basket check asking for a finished coupon.
* Step 2 keeps the handover under the new name.
* Step 3's duplicate opens on Money off; the original is stored as a product coupon of HKD 20.00 off the whole order.

<!-- trace:case id=g10.loyalty-programme.TC-2c3 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC17: Archive takes the reward off the menu

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* A live reward is on the menu; a member is signed in apart.

**Steps:**

1. Open it, open More, and click Archive.
2. As the member, read the menu on `<loyalty>`.

**Expected Results:**

* More lists Duplicate and Archive; Archive returns to the list.
* The menu no longer shows it.

<!-- trace:case id=g10.loyalty-programme.TC-y2e rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### g10.loyalty-programme.US9-TC11: The reward editor follows the approved layout

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* An operator opens `<reward form>` for a new reward in a window `<width>` wide; the list holds a live, a scheduled and a sold-out reward.

**Test data:**

| `<width>` | `<rail>` |
| --- | --- |
| 1280px | beside the form |
| 400px | under the form |

**Steps:**

1. Read from the top; click Money off; scroll to the end; click ← Rewards.

**Expected Results:**

* ← Rewards sits above the title, the kinds as three cards; discount and scope are segmented controls, HKD before each amount, the rail holding the menu card, the coupon sentence and the basket check `<rail>`; the save bar stays on screen; the list shows each state as a tinted badge.

---

## g10.loyalty-programme.US10: Operator cancels a redemption under its own permission

**As an** operator,
**I want** cancelling a redemption gated by its own permission,
**so that** being trusted to move points does not also trust me to undo what a member redeemed.

<!-- trace:case id=g10.loyalty-programme.TC-th8 rev=1 -->
### g10.loyalty-programme.US10-TC1: Cancelling a redemption needs its own permission

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-10

**Pre-conditions:**

* A member's redemption has an unused coupon; an operator holds `<grants>`.

**Test data:**

| `<grants>` | `<outcome>` |
| --- | --- |
| the point-movement permission alone | no cancel offered; one sent directly refused |
| the redemption-cancel permission | the redemption cancelled, the points returned, who and why recorded |

**Steps:**

1. Open the member's redemption on `<loyalty console>`, and cancel it.

**Expected Results:**

* It reads `<outcome>`.

---

## g10.loyalty-programme.US11: Member spends a coupon wherever they are, whatever they left open

**As a** member,
**I want** every coupon I hold to be spendable on the sale in front of me, whatever checkout or counter sale I walked away from,
**so that** changing my mind never costs me the coupon and never makes me wait.

<!-- trace:case id=g10.loyalty-programme.TC-eg8 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### g10.loyalty-programme.US11-TC1: A new checkout takes the coupon off an unpaid online order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* A signed-in member holds an unused coupon applying to an HKD 780.00 product in the cart; an earlier order of theirs carries the coupon's cut, unpaid, `<earlier order>`; the shop accepts closing its checkout.

**Test data:**

| `<earlier order>` |
| --- |
| its checkout open |
| expired, its checkout still able to collect |

**Steps:**

1. Open the cart drawer, and read the coupons offered; choose the coupon and submit the checkout.
2. Read the earlier order in the member's orders and its code at the shop; open its checkout and try to pay.

**Expected Results:**

* Step 1 offers the coupon as spendable, and the new checkout carries its cut.
* Step 2 reads the earlier order cancelled, its code no longer live, and takes no payment.

<!-- trace:case id=g10.loyalty-programme.TC-8x5 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### g10.loyalty-programme.US11-TC2: A counter sale keeps its cart and loses its claim

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* A signed-in member holds two unused coupons scoped to an HKD 780.00 product in the cart, and 100 points; staff hold sale A at shop A open, live, planned with the first coupon and untendered.

**Test data:**

| `<chosen online>` |
| --- |
| the first coupon |
| the second coupon |
| 100 points, no coupon |
| nothing |

**Steps:**

1. In the cart drawer choose `<chosen online>`, and submit the checkout.
2. Read the first coupon's code on sale A at the shop; at shop A, apply sale A again.

**Expected Results:**

* Step 1's checkout carries `<chosen online>` and nothing else.
* Step 2 reads the code no longer live; sale A is not cancelled and still holds the product, and applying it is refused, telling staff the sale has closed and to ring the goods on a new one.

<!-- trace:case id=g10.loyalty-programme.TC-dcb rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### g10.loyalty-programme.US11-TC3: A till claims the coupon an open checkout holds

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* A member's online checkout carries their coupon's cut, unpaid; staff serve them at shop A with the coupon's HKD 780.00 product rung up.

**Test data:**

| `<route>` |
| --- |
| staff choose the coupon in the member's panel |
| the member opens it on their phone and the till scans it |

**Steps:**

1. Open the member's panel, and read the coupons listed.
2. Put the coupon on the sale by `<route>`, and apply the sale; read the online checkout in the member's orders.

**Expected Results:**

* Step 1 lists the coupon as spendable, naming no sale.
* Step 2 puts its cut on the sale; the online checkout reads cancelled, its code no longer live.

<!-- trace:case id=g10.loyalty-programme.TC-8wc rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### g10.loyalty-programme.US11-TC4: A plan at a second till retires the first till's sale

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* A member's sale A at shop A was planned with their whole-order coupon under an hour ago, untendered; staff serve them at shop B with an HKD 780.00 product rung up; they also hold a second coupon for that product and 100 points.

**Test data:**

| `<chosen at shop B>` |
| --- |
| the whole-order coupon |
| the second coupon |
| 100 points, no coupon |

**Steps:**

1. Choose `<chosen at shop B>` in the panel, and apply the sale at shop B.
2. Read the whole-order coupon's code on sale A, sale A at shop A, and the member's coupons on `<loyalty>`.

**Expected Results:**

* Step 1 puts `<chosen at shop B>` on the sale.
* Step 2 reads the code no longer live, sale A not cancelled and still holding its goods, and the whole-order coupon unused.

<!-- trace:case id=g10.loyalty-programme.TC-i0e rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### g10.loyalty-programme.US11-TC5: A coupon an unpaid sale claims still reads spendable

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* A signed-in member holds an unused coupon for the HKD 780.00 product in the cart; `<claiming sale>` carries it.

**Test data:**

| `<claiming sale>` |
| --- |
| an online order, its checkout open |
| an online order, expired, its checkout still able to collect |
| an online order, cancelled |
| an online order, cancelled before the programme was told to give the coupon back |
| an online order, paid, not yet settled |
| a till sale at shop A, planned under an hour ago, never tendered |
| a till sale at shop A, last planned over an hour ago, never tendered |
| a checkout that stopped before its order was written, claimed over five minutes ago |
| a checkout that stopped before its order was written, claimed under five minutes ago |

**Steps:**

1. Read the member's coupons on `<loyalty>`; open the cart drawer, and read the coupons offered.

**Expected Results:**

* The coupon is listed unused, and offered as spendable.

<!-- trace:case id=g10.loyalty-programme.TC-1q0 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### g10.loyalty-programme.US11-TC6: No member or till surface shows a coupon's claim, its sale or its code

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* A member's sale A at shop A was planned with their coupon under an hour ago, untendered; they are signed in with the coupon's product in the cart; staff serve them at shop B.

**Steps:**

1. Read the coupon in the member's coupons on `<loyalty>`, in the cart drawer, and in the panel at shop B.

**Expected Results:**

* Each shows it spendable, with no claimed state, no mention of sale A and no code.

<!-- trace:case id=g10.loyalty-programme.TC-y4l rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### g10.loyalty-programme.US11-TC8: A claim is refused while an earlier sale stands

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* A member's `<earlier sale>` carries their coupon's cut; they are at `<place>` with its HKD 780.00 product on the sale.

**Test data:**

| `<earlier sale>` | `<place>` |
| --- | --- |
| an online checkout, unpaid, the shop refusing to close it | signed in, choosing it in the cart drawer and submitting |
| an online checkout, unpaid, the shop refusing to close it | a till at shop A, staff choosing it in the panel and applying the sale |
| an online order, paid, not yet settled | signed in, choosing it in the cart drawer and submitting |
| an online order, paid, not yet settled | a till at shop A, staff choosing it in the panel and applying the sale |

**Steps:**

1. Choose the coupon, and read the answer; read the earlier sale in the member's orders.

**Expected Results:**

* The coupon is refused, saying an earlier sale stands, never that it is unavailable; the earlier sale is not cancelled and still carries its cut.

<!-- trace:case id=g10.loyalty-programme.TC-bq5 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### g10.loyalty-programme.US11-TC10: A claim stands over a counter sale whose code stays live or whose order has not arrived

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* A signed-in member holds an unused coupon for the HKD 780.00 product in the cart; their sale A at shop A carries it, `<sale A>`.

**Test data:**

| `<sale A>` |
| --- |
| planned under an hour ago, untendered, the shop refusing to deactivate its code |
| tendered with the coupon's cut, its paid order not yet reaching the store |

**Steps:**

1. In the cart drawer choose the coupon, and submit the checkout.
2. Let the shop accept deactivations; read the coupon's code on sale A.

**Expected Results:**

* Step 1 is not refused, and the checkout carries the coupon's cut.
* Step 2 reads the code no longer live.

<!-- trace:case id=g10.loyalty-programme.TC-ixy rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### g10.loyalty-programme.US11-TC18: A coupon outlives the code an expired order let die

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* A signed-in member's expired order, its checkout still able to collect, claimed their coupon 25 hours 30 minutes ago, and the programme's sweep has run since; the coupon's validity runs on; its product is in the cart.

**Steps:**

1. Read the order's code at the shop, and the coupon in the member's coupons on `<loyalty>`.
2. As an operator, read the forfeit count for the coupon's reward.
3. In the cart drawer choose the coupon, and submit the checkout.

**Expected Results:**

* Step 1 reads the code no longer live, the coupon unused, not lapsed.
* Step 2 counts no forfeit for it.
* Step 3 is not refused, and the checkout carries its cut.

---

## Settled

- A claim given back makes a new claim under the same retry key; the sale that asks again is a till sale re-planned after a plan refused once it had claimed. An online order that loses its claim is cancelled and never asks again
- The programme's sweep waits 25 hours from the claim, and a reward's code lives 24 hours from its order's creation, so the sweep never frees a coupon whose code is live
- An online checkout the provider reports collected refuses a new claim by name; a counter sale is not known to be paid until its order arrives, so a claim moves its coupon
- A counter sale a newer promise retired takes no new plan; staff ring the goods on a new sale
- A coupon two sales collected is spent by the sale that claims it, whichever settles first
- Two sales claiming one coupon at once leave one live claim, and neither is told the coupon is unavailable
- The cart drawer offers a coupon an ended order of the member's still claims, because the claim takes it back first, and one a checkout left when it stopped before its order was written; a claim on that coupon is refused by name while the claim is under five minutes old, since its sale may still be submitting
- A reward's code dies with its sale and forfeits nothing: the coupon goes back to the wallet unused, and only a coupon passing its own validity is counted as forfeit
- A sale, online or at the till, whose order is written more than a minute after its claim is refused with a cause of its own: the member reads that the checkout took too long and to submit it again, staff that the sale took too long and to apply it again (Q32)
