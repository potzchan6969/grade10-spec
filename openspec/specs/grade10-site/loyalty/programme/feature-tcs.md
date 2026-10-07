# grade10-site/loyalty/programme Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-loyalty-programme-US1: Member earns points on qualifying spend

**As a** member,
**I want** my balance to follow the money I spend and keep spent, priced once
at my tier's rate in the programme's own currency,
**so that** what I can redeem is exactly what my qualifying spend earned.

<!-- trace:case id=g10.loyalty-programme.TC-0hf rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC1-1: Activity precedes joining

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
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
A user who has never joined.

**Steps:**

1. Record points for that user.
2. Check the member record and join state.

**Expected Results:**

* A member record exists and holds those points.
* The member is reported as not joined until they join.

<!-- trace:case id=g10.loyalty-programme.TC-szz rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC2-1: Balance counts only unspent unexpired credits and never goes negative

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
A member with a mix of unspent, spent, and expired credits.

**Steps:**

1. Ask for the balance at a given instant.
2. Record a debit against remaining credits.

**Expected Results:**

* The balance counts only credits that are unspent and unexpired at that instant.
* The debit draws only on credits that have points remaining, and the member is never below zero.

<!-- trace:case id=g10.loyalty-programme.TC-f76 rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC3-1: Diamond purchase of HKD 1,000 earns 120 points, floored once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
A Diamond member.

**Steps:**

1. Complete a HKD 1,000 purchase.
2. Check points granted.

**Expected Results:**

* They earn 120 points.
* The point total is floored once after applying the rate and the multiplier, not at each step.

<!-- trace:case id=g10.loyalty-programme.TC-krs rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC4-1: Foreign currency spend is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
None.

**Steps:**

1. Record a spend in a currency the programme does not run in.

**Expected Results:**

* It is refused as invalid, naming both currencies.
* No ledger entry is written.

<!-- trace:case id=g10.loyalty-programme.TC-4ot rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC5-1: Backdated spend keeps its own date

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
A member whose current tier is known.

**Steps:**

1. Record a spend that carries a date in the past.
2. Check expiry, tier contribution, and multiplier.

**Expected Results:**

* Expiry and tier contribution follow that date.
* The multiplier applied is the tier the member holds when it is processed.

<!-- trace:case id=g10.loyalty-programme.TC-owd rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC6-1: Future-dated spend is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
None.

**Steps:**

1. Record a spend that carries a date more than five minutes ahead of now.

**Expected Results:**

* It is refused as invalid.

<!-- trace:case id=g10.loyalty-programme.TC-eva rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC7-1: Retry under the same key records nothing twice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
A caller that already used a mutation key.

**Steps:**

1. Repeat the mutation under that key.
2. Repeat the key with input that differs from the first call.

**Expected Results:**

* The original answer is returned and no new entry is recorded.
* The differing input is refused as a conflict.

<!-- trace:case id=g10.loyalty-programme.TC-vid rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC8-1: Expired credit stops counting immediately

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
A member with a credit whose expiry instant is about to pass.

**Steps:**

1. Wait until that credit's expiry instant passes.
2. Ask for the balance.

**Expected Results:**

* It stops counting toward the balance immediately.

<!-- trace:case id=g10.loyalty-programme.TC-0er rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC9-1: Refunds claw back only what that money still holds

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
A member with a completed purchase that earned points.

**Steps:**

1. Record that refund in two parts and compare to one refund of the combined amount.
2. Refund more than the member still holds from that money.
3. Refund money that has not yet earned anything.
4. Check the tier contribution after a claw-back.

**Expected Results:**

* The split refund total equals one refund of the combined amount.
* The shortfall is recorded by cause and the balance does not go below zero.
* A refund before earning is refused as not found, and a later retry claws back once earning lands.
* Tier contribution of the earning is reduced by the same amount and leaves the qualifying window with that earning.

<!-- trace:case id=g10.loyalty-programme.TC-u6v rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC10-1: Purchase still completes when loyalty is unreachable, and grants once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
The programme is unreachable. A completed purchase is later delivered more than once, including a partial refund path.

**Steps:**

1. Complete a purchase while the programme is unreachable.
2. Restore the programme and wait for the grant.
3. Deliver the same money event more than once.
4. Refund part of a purchase, then another part.

**Expected Results:**

* The purchase still completes for the buyer, and points are granted once the programme is reachable again.
* Points are granted once.
* Each refund claws back only the points its own amount earned.

<!-- trace:case id=g10.loyalty-programme.TC-dgw rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC11-1: Currency mismatch stops the product from starting

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
A product configured to sell in a currency the programme does not run in.

**Steps:**

1. Start the product.

**Expected Results:**

* The product fails to start, naming both currencies.

<!-- trace:case id=g10.loyalty-programme.TC-fxs rev=1 covers=g10.loyalty-programme.SC-amv,g10.loyalty-programme.SC-r8t,g10.loyalty-programme.SC-65a,g10.loyalty-programme.SC-8xw,g10.loyalty-programme.SC-t7x,g10.loyalty-programme.SC-w1x,g10.loyalty-programme.SC-5dr,g10.loyalty-programme.SC-gru,g10.loyalty-programme.SC-lfh,g10.loyalty-programme.SC-f4d,g10.loyalty-programme.SC-jvh,g10.loyalty-programme.SC-85n,g10.loyalty-programme.SC-buc,g10.loyalty-programme.SC-0ua -->
### grade10-site-loyalty-programme-US1-TC12-1: Refused recording is reported, not swallowed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-01

**Pre-conditions:**
The programme will refuse a recording.

**Steps:**

1. Deliver a recording the programme refuses.
2. Check logs and success reporting.

**Expected Results:**

* The refusal is logged and counted by its reason.
* It is never reported as success.

---

## grade10-site-loyalty-programme-US2: Member advances through the tier ladder

**As a** member,
**I want** my tier derived from what I earned and kept when those points
expire,
**so that** the rate I earn at reflects the standing I reached rather than what
my balance happens to be today.

<!-- trace:case id=g10.loyalty-programme.TC-ykd rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### grade10-site-loyalty-programme-US2-TC1-1: Earned tier holds after those points expire

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
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**
A member who reached a tier by earning.

**Steps:**

1. Wait until the points that qualified them expire.
2. Check the member's tier.

**Expected Results:**

* The member keeps that tier.

<!-- trace:case id=g10.loyalty-programme.TC-r5y rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### grade10-site-loyalty-programme-US2-TC2-1: Invitation lapse drops the tier when next evaluated

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**
A member holding a dated invitation that is about to end.

**Steps:**

1. Wait until the invitation passes its end.
2. Evaluate that member.

**Expected Results:**

* The member stops holding that tier from that instant.
* The drop is recorded the next time that member is evaluated.

<!-- trace:case id=g10.loyalty-programme.TC-89y rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### grade10-site-loyalty-programme-US2-TC3-1: Tier history records each move

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**
A member whose effective tier is about to change.

**Steps:**

1. Cause the member's effective tier to change.
2. Read the tier history.

**Expected Results:**

* One entry records the move and what caused it.

<!-- trace:case id=g10.loyalty-programme.TC-df0 rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### grade10-site-loyalty-programme-US2-TC4-1: Invalid ladder stops the product from starting

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**
A ladder that repeats a tier identifier, or has other than exactly one entry tier, or whose entry tier is not first, or whose higher earned tier is cheaper, or whose earned tiers use different windows, or whose time zone is not a real IANA zone.

**Steps:**

1. Start the product with that ladder.

**Expected Results:**

* The product fails to start, naming the identifier, how many entry tiers it found, both amounts, the periods, or the zone as the ladder is wrong.
* No member can hold a tier they skipped past.

<!-- trace:case id=g10.loyalty-programme.TC-v68 rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### grade10-site-loyalty-programme-US2-TC5-1: 500 qualifying points reach Diamond, not Black

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**
A member who can earn.

**Steps:**

1. Earn until qualifying points inside the rolling twelve months reach 500.
2. Keep earning any number of further points.

**Expected Results:**

* They hold Diamond.
* They never reach Black by earning alone.

---

<!-- trace:case id=g10.loyalty-programme.TC-79a rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### grade10-site-loyalty-programme-US2-TC6-1: Operator points take the date the balance already names

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
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member holding 60 live points) whose whole balance expires on <balance expiry day>.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Credit | Amount | Day the added points expire |
| --- | --- | --- |
| Correction | 50 points | <balance expiry day> |
| Campaign grant | 100 points | <balance expiry day> |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Add the row's credit with a reason.
3. Read the member's expiry line on <grade10 loyalty url>.

**Expected Results:**

* The member's expiry line still reads <balance expiry day>.
* The added points expire on the day the row names.

<!-- trace:case id=g10.loyalty-programme.TC-05i rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### grade10-site-loyalty-programme-US2-TC7-1: Backdated grant joins the window already running

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
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member holding 60 live points) whose whole balance expires on <balance expiry day>.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| Grant | 100 campaign points |
| Date on the grant | <a day before today> |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Add the grant dated <a day before today>, with a reason.
3. Read the member's expiry line on <grade10 loyalty url>.

**Expected Results:**

* The 100 granted points expire on <balance expiry day>.
* The member's expiry line has not moved.

<!-- trace:case id=g10.loyalty-programme.TC-jdg rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### grade10-site-loyalty-programme-US2-TC8-1: Operator points to an empty balance start the window

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
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member holding no live points) whose <lapsed amount> lapsed on <lapse day>.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| Grant | 50 campaign points |
| <lapsed amount> | 200 points |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Add the grant today, with a reason.
3. Read the member's balance and expiry line on <grade10 loyalty url>.

**Expected Results:**

* The balance reads 50 points, expiring twelve months after today.
* The <lapsed amount> that lapsed on <lapse day> does not count again.

<!-- trace:case id=g10.loyalty-programme.TC-zoy rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### grade10-site-loyalty-programme-US2-TC9-1: A reward handed over outright is not the member's activity

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
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member holding 60 live points) whose whole balance expires on <balance expiry day>, with no purchase or redemption since.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Give them a reward outright, taking no points for it.
3. Read the member's expiry line on <grade10 loyalty url>.

**Expected Results:**

* The membership summary loads with one expiry line.
* That line still reads <balance expiry day>.

<!-- trace:case id=g10.loyalty-programme.TC-to5 rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### grade10-site-loyalty-programme-US2-TC10-1: A reversal into a lapsed balance returns nothing spendable

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
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member who paid <points paid> at checkout) whose balance lapsed on <lapse day>, after that payment.
* That payment in points can still be reversed.

**Test data:**

| Field | Value |
| --- | --- |
| <points paid> | 200 points |

**Steps:**

1. Reverse that payment in points.
2. Read the member's balance on <grade10 loyalty url>.

**Expected Results:**

* No points return: no credit against that payment appears in the member's activity.
* The member has nothing to spend.
* The answer names the <points paid> it could not return.

<!-- trace:case id=g10.loyalty-programme.TC-hd9 rev=1 covers=g10.loyalty-programme.SC-4ri,g10.loyalty-programme.SC-s8t,g10.loyalty-programme.SC-jff,g10.loyalty-programme.SC-ehg,g10.loyalty-programme.SC-v4d,g10.loyalty-programme.SC-0nq,g10.loyalty-programme.SC-vif,g10.loyalty-programme.SC-uf6,g10.loyalty-programme.SC-gg6,g10.loyalty-programme.SC-c0x,g10.loyalty-programme.SC-8bq,g10.loyalty-programme.SC-4ir,g10.loyalty-programme.SC-6rj,g10.loyalty-programme.SC-16h,g10.loyalty-programme.SC-5yd,g10.loyalty-programme.SC-4mb,g10.loyalty-programme.SC-76g,g10.loyalty-programme.SC-ay5,g10.loyalty-programme.SC-nmo -->
### grade10-site-loyalty-programme-US2-TC11-1: A refund claws points back without moving the expiry date

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
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member holding 60 live points) whose whole balance expires on <balance expiry day>.
* One of that member's purchases can still be refunded.

**Steps:**

1. Refund that purchase in full.
2. Read the member's balance and expiry line on <grade10 loyalty url>.

**Expected Results:**

* The points that purchase earned leave the balance.
* The expiry line still reads <balance expiry day>.

---

## grade10-site-loyalty-programme-US3: Member redeems points for a reward

**As a** member,
**I want** to spend my points on a reward at the price it carried when I
redeemed it,
**so that** a later reprice, a sell-out or a reversal never changes what that
redemption cost me.

<!-- trace:case id=g10.loyalty-programme.TC-m1l rev=1 covers=g10.loyalty-programme.SC-hp7,g10.loyalty-programme.SC-ixi,g10.loyalty-programme.SC-css,g10.loyalty-programme.SC-g01,g10.loyalty-programme.SC-g5s,g10.loyalty-programme.SC-elq,g10.loyalty-programme.SC-hgd,g10.loyalty-programme.SC-des,g10.loyalty-programme.SC-hlf,g10.loyalty-programme.SC-dcn,g10.loyalty-programme.SC-yob,g10.loyalty-programme.SC-4s4,g10.loyalty-programme.SC-jea,g10.loyalty-programme.SC-bwq,g10.loyalty-programme.SC-dqm,g10.loyalty-programme.SC-x8s,g10.loyalty-programme.SC-xyn -->
### grade10-site-loyalty-programme-US3-TC1-1: Repricing does not rewrite an earlier redemption

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
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**
A member who redeemed a reward.

**Steps:**

1. Change that reward's point cost.
2. Read the earlier redemption.

**Expected Results:**

* The earlier redemption still records the price the member paid.

<!-- trace:case id=g10.loyalty-programme.TC-p5o rev=1 covers=g10.loyalty-programme.SC-hp7,g10.loyalty-programme.SC-ixi,g10.loyalty-programme.SC-css,g10.loyalty-programme.SC-g01,g10.loyalty-programme.SC-g5s,g10.loyalty-programme.SC-elq,g10.loyalty-programme.SC-hgd,g10.loyalty-programme.SC-des,g10.loyalty-programme.SC-hlf,g10.loyalty-programme.SC-dcn,g10.loyalty-programme.SC-yob,g10.loyalty-programme.SC-4s4,g10.loyalty-programme.SC-jea,g10.loyalty-programme.SC-bwq,g10.loyalty-programme.SC-dqm,g10.loyalty-programme.SC-x8s,g10.loyalty-programme.SC-xyn -->
### grade10-site-loyalty-programme-US3-TC2-1: Last unit is not oversold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**
A limited reward with one unit left. Two members redeem at once.

**Steps:**

1. Redeem that last unit as both members at once.

**Expected Results:**

* Exactly one succeeds and the other is refused as out of stock.

<!-- trace:case id=g10.loyalty-programme.TC-yk2 rev=1 covers=g10.loyalty-programme.SC-hp7,g10.loyalty-programme.SC-ixi,g10.loyalty-programme.SC-css,g10.loyalty-programme.SC-g01,g10.loyalty-programme.SC-g5s,g10.loyalty-programme.SC-elq,g10.loyalty-programme.SC-hgd,g10.loyalty-programme.SC-des,g10.loyalty-programme.SC-hlf,g10.loyalty-programme.SC-dcn,g10.loyalty-programme.SC-yob,g10.loyalty-programme.SC-4s4,g10.loyalty-programme.SC-jea,g10.loyalty-programme.SC-bwq,g10.loyalty-programme.SC-dqm,g10.loyalty-programme.SC-x8s,g10.loyalty-programme.SC-xyn -->
### grade10-site-loyalty-programme-US3-TC3-1: Reward outside its window cannot be redeemed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**
A reward that is archived, or outside its live window.

**Steps:**

1. Redeem that reward as a member.

**Expected Results:**

* The redemption is refused.

<!-- trace:case id=g10.loyalty-programme.TC-9i4 rev=1 covers=g10.loyalty-programme.SC-hp7,g10.loyalty-programme.SC-ixi,g10.loyalty-programme.SC-css,g10.loyalty-programme.SC-g01,g10.loyalty-programme.SC-g5s,g10.loyalty-programme.SC-elq,g10.loyalty-programme.SC-hgd,g10.loyalty-programme.SC-des,g10.loyalty-programme.SC-hlf,g10.loyalty-programme.SC-dcn,g10.loyalty-programme.SC-yob,g10.loyalty-programme.SC-4s4,g10.loyalty-programme.SC-jea,g10.loyalty-programme.SC-bwq,g10.loyalty-programme.SC-dqm,g10.loyalty-programme.SC-x8s,g10.loyalty-programme.SC-xyn -->
### grade10-site-loyalty-programme-US3-TC4-1: Public menu shows only live unarchived rewards

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**
The caller is not signed in.

**Steps:**

1. Read the reward menu without signing in.

**Expected Results:**

* It lists only live, unarchived rewards.
* It does not disclose stock counts or edit history.

<!-- trace:case id=g10.loyalty-programme.TC-hb9 rev=1 covers=g10.loyalty-programme.SC-hp7,g10.loyalty-programme.SC-ixi,g10.loyalty-programme.SC-css,g10.loyalty-programme.SC-g01,g10.loyalty-programme.SC-g5s,g10.loyalty-programme.SC-elq,g10.loyalty-programme.SC-hgd,g10.loyalty-programme.SC-des,g10.loyalty-programme.SC-hlf,g10.loyalty-programme.SC-dcn,g10.loyalty-programme.SC-yob,g10.loyalty-programme.SC-4s4,g10.loyalty-programme.SC-jea,g10.loyalty-programme.SC-bwq,g10.loyalty-programme.SC-dqm,g10.loyalty-programme.SC-x8s,g10.loyalty-programme.SC-xyn -->
### grade10-site-loyalty-programme-US3-TC5-1: Reversal restores original expiry and returns stock only when consumed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**
A member who redeemed a limited reward and another who redeemed an unlimited reward.

**Steps:**

1. Reverse the limited redemption and check restored credits.
2. Reverse the unlimited redemption and check stock.

**Expected Results:**

* Each restored credit expires when the credit it came from would have.
* No stock is returned for the unlimited reward.

<!-- trace:case id=g10.loyalty-programme.TC-4id rev=1 covers=g10.loyalty-programme.SC-hp7,g10.loyalty-programme.SC-ixi,g10.loyalty-programme.SC-css,g10.loyalty-programme.SC-g01,g10.loyalty-programme.SC-g5s,g10.loyalty-programme.SC-elq,g10.loyalty-programme.SC-hgd,g10.loyalty-programme.SC-des,g10.loyalty-programme.SC-hlf,g10.loyalty-programme.SC-dcn,g10.loyalty-programme.SC-yob,g10.loyalty-programme.SC-4s4,g10.loyalty-programme.SC-jea,g10.loyalty-programme.SC-bwq,g10.loyalty-programme.SC-dqm,g10.loyalty-programme.SC-x8s,g10.loyalty-programme.SC-xyn -->
### grade10-site-loyalty-programme-US3-TC6-1: Double redemption costs one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**
A signed-in member who can redeem.

**Steps:**

1. Submit the same redemption twice, with or without a reload in between.

**Expected Results:**

* Exactly one redemption is recorded.

---

## grade10-site-loyalty-programme-US4: Member runs their membership from one surface

**As a** member,
**I want** my tier, balance, progress and expiring points on one surface, in
the programme's own dates,
**so that** I can join and read my own activity without being shown the
operating record behind it.

<!-- trace:case id=g10.loyalty-programme.TC-iye rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### grade10-site-loyalty-programme-US4-TC1-1: Joining twice leaves the first join date

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**
A member who can join.

**Steps:**

1. Join more than once.

**Expected Results:**

* The first join date stands and later attempts change nothing.

<!-- trace:case id=g10.loyalty-programme.TC-irz rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### grade10-site-loyalty-programme-US4-TC2-1: Never-joined member is invited and still sees points

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
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**
A member with recorded activity but no join date.

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Check the surface.

**Expected Results:**

* They are shown how to join, and their existing points.

<!-- trace:case id=g10.loyalty-programme.TC-vex rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### grade10-site-loyalty-programme-US4-TC3-1: Member activity hides operator reasons, retry keys and pricing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**
An operator has corrected this member's balance with a written reason.

**Steps:**

1. Navigate to <grade10 loyalty url> as that member.
2. Read activity, including an entry for a reward that has since been archived.

**Expected Results:**

* The operator's reason does not appear anywhere in what the member can read.
* No entry carries a retry key, a request record, or the tier and money arithmetic the entry was priced from.
* The archived-reward entry still names that reward.

<!-- trace:case id=g10.loyalty-programme.TC-9v2 rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### grade10-site-loyalty-programme-US4-TC4-1: Dates read in the programme's time zone

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**
A member whose browser is not in Asia/Hong_Kong.

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read a date the programme computed.

**Expected Results:**

* It reads the same wherever the member is, in the programme's time zone.

<!-- trace:case id=g10.loyalty-programme.TC-2dk rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### grade10-site-loyalty-programme-US4-TC5-1: Membership summary names one expiry line

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
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(member holding <live balance>) whose whole balance expires on <balance expiry day>.

**Test data:**

| Field | Value |
| --- | --- |
| <live balance> | 160 points |

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read the membership section.

**Expected Results:**

* One line names <live balance> and <balance expiry day>.
* No second expiry figure sits beside it.

<!-- trace:case id=g10.loyalty-programme.TC-9tr rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### grade10-site-loyalty-programme-US4-TC6-1: Member holding no points is shown no expiry line

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(member holding no live points).

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read the membership section.

**Expected Results:**

* The membership section loads with nothing to spend.
* No expiry line is shown.

<!-- trace:case id=g10.loyalty-programme.TC-6f6 rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### grade10-site-loyalty-programme-US4-TC7-1: Expiry line warns inside the last 30 days

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(member holding points whose balance expires in `<days>`).

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read the membership section.

**Expected Results:**

* The expiry line is shown in the `<tone>` tone.
* The line says what keeps the points when the tone is the warning one.

**Test data:**

| days | tone |
| --- | --- |
| 9 | warning |
| 0 | warning |
| 120 | plain |

<!-- trace:case id=g10.loyalty-programme.TC-odc rev=1 covers=g10.loyalty-programme.SC-y12,g10.loyalty-programme.SC-7o9,g10.loyalty-programme.SC-wn3,g10.loyalty-programme.SC-xep,g10.loyalty-programme.SC-y8v,g10.loyalty-programme.SC-vlc,g10.loyalty-programme.SC-urv,g10.loyalty-programme.SC-axq,g10.loyalty-programme.SC-n7b,g10.loyalty-programme.SC-xur,g10.loyalty-programme.SC-evb,g10.loyalty-programme.SC-7zl,g10.loyalty-programme.SC-ftq,g10.loyalty-programme.SC-v0h,g10.loyalty-programme.SC-69a,g10.loyalty-programme.SC-b22,g10.loyalty-programme.SC-2t5,g10.loyalty-programme.SC-bwm,g10.loyalty-programme.SC-w02,g10.loyalty-programme.SC-ksg,g10.loyalty-programme.SC-5db,g10.loyalty-programme.SC-2hc,g10.loyalty-programme.SC-ir1,g10.loyalty-programme.SC-3y1,g10.loyalty-programme.SC-9k2,g10.loyalty-programme.SC-puq,g10.loyalty-programme.SC-x24,g10.loyalty-programme.SC-pt4,g10.loyalty-programme.SC-xig,g10.loyalty-programme.SC-lde,g10.loyalty-programme.SC-2fe,g10.loyalty-programme.SC-7vs,g10.loyalty-programme.SC-38k,g10.loyalty-programme.SC-nnv,g10.loyalty-programme.SC-qmv,g10.loyalty-programme.SC-99v,g10.loyalty-programme.SC-wu2,g10.loyalty-programme.SC-6kj,g10.loyalty-programme.SC-zdb,g10.loyalty-programme.SC-yh1,g10.loyalty-programme.SC-l3t,g10.loyalty-programme.SC-phf,g10.loyalty-programme.SC-5u1,g10.loyalty-programme.SC-y9e,g10.loyalty-programme.SC-lig,g10.loyalty-programme.SC-tzp,g10.loyalty-programme.SC-dml,g10.loyalty-programme.SC-q28,g10.loyalty-programme.SC-eol,g10.loyalty-programme.SC-j0k,g10.loyalty-programme.SC-ipk -->
### grade10-site-loyalty-programme-US4-TC8-1: The member's coupon list shows no code for a reward coupon

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(member holding <coupon>), which no sale claims.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off one product |

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read <coupon> in the member's coupons.

**Expected Results:**

* Step 2 shows what <coupon> takes off, its state and when it ends.
* <coupon> shows no discount code and no action to copy one.

---

## grade10-site-loyalty-programme-US5: Operator runs the programme from one console

**As an** operator,
**I want** to find a member and act on their loyalty under my own permissions,
**so that** I can correct, reward and invite without holding powers I was not
given, and every change I made stays provable.

<!-- trace:case id=g10.loyalty-programme.TC-ssz rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC1-1: Live grants can be listed; unknown and entry tiers are refused

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
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**
Signed in as an operator who can grant invitations. Live grants exist.

**Steps:**

1. Navigate to <grade10 loyalty admin url>.
2. List invitations.
3. Grant a tier the programme does not define.
4. Grant the entry tier.

**Expected Results:**

* Every live grant is listed with its member, tier, reason and end date.
* An unknown tier is refused as not found and nothing is recorded.
* An entry-tier grant is refused as invalid.

<!-- trace:case id=g10.loyalty-programme.TC-6en rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC2-1: Action without permission is refused and stays recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**
Signed in as an operator without the action's permission. The operator log can accept entries.

**Steps:**

1. Attempt an action their role does not allow.
2. Try to alter or remove a recorded operator action.
3. Attempt an action that would change something but has nowhere to record it.

**Expected Results:**

* The action is refused.
* Verifying the log reports the position at which a rewrite breaks.
* An unrecordable action is refused rather than run unrecorded.

<!-- trace:case id=g10.loyalty-programme.TC-1lu rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC3-1: Correction does not move a member up; campaign grant does

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**
Signed in as an operator who can move points. A member below Diamond.

**Steps:**

1. Correct that member's balance.
2. Grant campaign or sign-up points to another member.

**Expected Results:**

* Corrected points are spendable and progress toward the next tier is unchanged.
* Campaign or sign-up points count toward the next tier.

<!-- trace:case id=g10.loyalty-programme.TC-1an rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC4-1: Console sections match permissions and a missing second factor opens the gate

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**
An operator holding only the loyalty read permission. A second operator whose role allows an action but whose session has no verified second factor.

**Steps:**

1. Open the console as the read-only operator.
2. Share the address of a member view.
3. Attempt an allowed action without a verified second factor.

**Expected Results:**

* The read-only operator can find and read members, and no section offering point movement, invitations, rewards or the operator log is shown.
* The same member opens for the recipient of the shared address.
* The console takes the second operator to verify, and the action completes afterwards.

<!-- trace:case id=g10.loyalty-programme.TC-7u6 rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC5-1: Stale console reports the failed decode

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**
The console reads a response whose shape it does not recognise.

**Steps:**

1. Navigate to <grade10 loyalty admin url>.
2. Trigger that unrecognised response.

**Expected Results:**

* It reports which call failed to decode, rather than showing missing values.

<!-- trace:case id=g10.loyalty-programme.TC-6ar rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC6-1: Loyalty permission alone shows no identities

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**
Signed in as an operator holding loyalty permissions but not the identity permission.

**Steps:**

1. Find a member in the loyalty console.

**Expected Results:**

* The member's loyalty state is shown.
* No name or email address is shown.

<!-- trace:case id=g10.loyalty-programme.TC-84a rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC7-1: Service connection cannot read identities; a failed read does not blank them

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**
A service holding a connection to the identity system, with no operator session carrying the identity permission.

**Steps:**

1. Request identities through that connection.
2. As an operator with identity permission, read member identities.
3. Unreach the identity system and open a member in the console.

**Expected Results:**

* The service request is refused.
* The log records who read, which records, and how many, and does not record names or email addresses.
* The console reports the failure and no member is shown with a blank identity.

<!-- trace:case id=g10.loyalty-programme.TC-80a rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC8-1: Restart lands one window from today

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
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* customer(member holding 120 live points) whose whole balance expires on <balance expiry day>, inside the next twelve months.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| Reason | Goodwill for a delayed order |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Restart their expiry window, giving the reason.
3. Open the operator log.

**Expected Results:**

* The whole balance now expires twelve months after today.
* The log carries the restart and the reason the operator gave.

<!-- trace:case id=g10.loyalty-programme.TC-d9g rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC9-1: Restart writes off what already lapsed

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
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* customer(member whose <lapsed amount> lapsed on <lapse day>), holding <points after lapse> recorded after that day.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lapsed amount> | 200 points |
| <points after lapse> | 50 points |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Restart their expiry window, giving a reason.
3. Read the member's balance and expiry date.

**Expected Results:**

* The <lapsed amount> stays written off and does not return.
* Only the <points after lapse> expire, twelve months after today.

<!-- trace:case id=g10.loyalty-programme.TC-dol rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC10-1: Restart leaves a window already further out

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
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* customer(member holding 120 live points) whose whole balance expires on <far expiry day>, more than twelve months from today.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Restart their expiry window, giving a reason.
3. Read the member's expiry date.

**Expected Results:**

* The console takes the restart.
* The expiry date still reads <far expiry day>.

<!-- trace:case id=g10.loyalty-programme.TC-spz rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC11-1: Restart moves no points and reaches no activity

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
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* customer(member holding <live balance>) whose activity list ends with <last activity>.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| <live balance> | 160 points |
| <last activity> | A redemption the member made |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Restart their expiry window, giving a reason.
3. Read the member's activity on <grade10 loyalty url>.

**Expected Results:**

* The balance still reads <live balance>.
* The activity list still ends with <last activity>, and names no restart.

<!-- trace:case id=g10.loyalty-programme.TC-xmn rev=1 covers=g10.loyalty-programme.SC-pgz,g10.loyalty-programme.SC-zl6,g10.loyalty-programme.SC-pft,g10.loyalty-programme.SC-6nn,g10.loyalty-programme.SC-qs7,g10.loyalty-programme.SC-qko,g10.loyalty-programme.SC-6ll,g10.loyalty-programme.SC-do3,g10.loyalty-programme.SC-64s,g10.loyalty-programme.SC-tje,g10.loyalty-programme.SC-fiu,g10.loyalty-programme.SC-svj,g10.loyalty-programme.SC-bnc,g10.loyalty-programme.SC-3vv,g10.loyalty-programme.SC-qia,g10.loyalty-programme.SC-bu3 -->
### grade10-site-loyalty-programme-US5-TC12-1: Form names the expiry day before the points are written

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Member | Balance | What the form names |
| --- | --- | --- |
| <live member> | 60 points expiring <balance expiry day> | <balance expiry day>, joining the window already running |
| <lapsed member> | no live points | twelve months from today, starting the member's window |

**Steps:**

1. Open the row's member on <grade10 loyalty admin url>.
2. Open the form that adds points.

**Expected Results:**

* The form names the day the row gives, before anything is written.
* It says whether those points start the member's window or join one.

---

## grade10-site-loyalty-programme-US6: Operator reverses a redemption a member cannot be given

**As an** operator,
**I want** to return a member's points and void their coupon while it is still unused,
**so that** a reward we cannot honour costs the member nothing.

<!-- trace:case id=g10.loyalty-programme.TC-pvr rev=1 covers=g10.loyalty-programme.SC-pkm,g10.loyalty-programme.SC-dd5,g10.loyalty-programme.SC-l3j,g10.loyalty-programme.SC-0nd,g10.loyalty-programme.SC-8ec,g10.loyalty-programme.SC-gby,g10.loyalty-programme.SC-m7u,g10.loyalty-programme.SC-jqk,g10.loyalty-programme.SC-t6q -->
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
| A checkout that stopped before its order was written | Claimed 6 minutes ago, with no claim on <coupon> since |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member bought for <cost> points, unused, inside its validity, scoped to the whole order |
| <cost> | 500 |

**Steps:**

1. Ask to reverse the redemption that issued <coupon>.
2. Read the response.
3. Read the member's balance and coupons.

**Expected Results:**

* Step 2 refuses the reversal, naming <claiming sale>.
* The balance is unchanged.
* <coupon> is still held, unused.

<!-- trace:case id=g10.loyalty-programme.TC-3dp rev=1 covers=g10.loyalty-programme.SC-pkm,g10.loyalty-programme.SC-dd5,g10.loyalty-programme.SC-l3j,g10.loyalty-programme.SC-0nd,g10.loyalty-programme.SC-8ec,g10.loyalty-programme.SC-gby,g10.loyalty-programme.SC-m7u,g10.loyalty-programme.SC-jqk,g10.loyalty-programme.SC-t6q -->
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
| <coupon> | A reward coupon the member bought for <cost> points, unused, inside its validity, scoped to the whole order |
| <other coupon> | A second reward coupon the member holds, unused, inside its validity, scoped to the whole order |
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

<!-- trace:case id=g10.loyalty-programme.TC-h5h rev=1 covers=g10.loyalty-programme.SC-pkm,g10.loyalty-programme.SC-dd5,g10.loyalty-programme.SC-l3j,g10.loyalty-programme.SC-0nd,g10.loyalty-programme.SC-8ec,g10.loyalty-programme.SC-gby,g10.loyalty-programme.SC-m7u,g10.loyalty-programme.SC-jqk,g10.loyalty-programme.SC-t6q -->
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

<!-- trace:case id=g10.loyalty-programme.TC-gbd rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### grade10-site-loyalty-programme-US7-TC6-1: A product coupon at the till mints its code when chosen, and once

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
| <product coupon> | A reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1>'s own variant |
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

<!-- trace:case id=g10.loyalty-programme.TC-eg8 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
* The shop accepts closing <earlier order>'s checkout.

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

<!-- trace:case id=g10.loyalty-programme.TC-8x5 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### grade10-site-loyalty-programme-US11-TC2-1: A counter sale keeps its cart and loses its claim

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
* admin(shop staff) has <counter sale A> open at <shop A> in its own till session, still live, planned with <coupon> and untendered.

**Test data:**

| Chosen online |
| --- |
| <coupon> |
| <other coupon> |
| <points> points, and no coupon |
| Nothing: no coupon and no points |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <other coupon> | A second reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <points> | 100, worth HK$100.00, within the member's balance |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> |

**Steps:**

1. Open the cart drawer.
2. Choose what the row names.
3. Submit the checkout.
4. Read the code minted for <coupon> on <counter sale A> at the shop.
5. At <shop A>, apply <counter sale A> again.

**Expected Results:**

* The online checkout carries what the row names, and nothing else.
* The code on <counter sale A> is no longer live.
* <counter sale A> is not cancelled and still holds <line_1>.
* Step 5 is refused, telling staff the sale has closed and to ring the goods on a new one.

<!-- trace:case id=g10.loyalty-programme.TC-dcb rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
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

<!-- trace:case id=g10.loyalty-programme.TC-8wc rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### grade10-site-loyalty-programme-US11-TC4-1: A plan at a second till retires the first till's sale

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

* customer(member holding <coupon>, <other coupon> and at least <points> points) has <counter sale A> at <shop A>, planned with <coupon> under an hour ago, untendered.
* admin(shop staff) has a till session open for that member at <shop B>, with <line_2> rung up.

**Test data:**

| Chosen at <shop B> |
| --- |
| <coupon> |
| <other coupon> |
| <points> points, and no coupon |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to the whole order |
| <other coupon> | A second reward coupon the member holds, unused, inside its validity, scoped to <line_2>'s own variant |
| <points> | 100, worth HK$100.00, within the member's balance |
| <line_1> | One HK$780.00 product, on <counter sale A> |
| <line_2> | One HK$780.00 product, at <shop B> |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> |

**Steps:**

1. Choose what the row names in the member's panel at <shop B>.
2. Apply the sale at <shop B>.
3. Read the code minted for <coupon> on <counter sale A> at the shop.
4. Read <counter sale A> at <shop A>.
5. Read <coupon> in the member's coupons on <grade10 loyalty url>.

**Expected Results:**

* Step 2 puts what the row names on the sale at <shop B>.
* The code on <counter sale A> is no longer live.
* <counter sale A> is not cancelled and still holds <line_1>.
* Step 5 lists <coupon> as unused.

<!-- trace:case id=g10.loyalty-programme.TC-i0e rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
| A checkout that stopped before its order was written | Claimed over five minutes ago |
| A checkout that stopped before its order was written | Claimed under five minutes ago |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
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

<!-- trace:case id=g10.loyalty-programme.TC-1q0 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### grade10-site-loyalty-programme-US11-TC6-1: No member or till surface shows a coupon's claim, its sale or its code

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
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
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
* None of them shows the code minted for <coupon> on <counter sale A>.

<!-- trace:case id=g10.loyalty-programme.TC-1jv rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
| <coupon> | A reward coupon the member holds, unused and inside its validity, scoped to the whole order |
| <counter sale A> | A till sale at <shop A> whose code for <coupon> was deactivated before it collected |
| <later sale> | The online order that claimed <coupon> away from <counter sale A> |

**Steps:**

1. Settle <later sale>.
2. Settle <counter sale A>.
3. Read the coupons on <grade10 loyalty url>.

**Expected Results:**

* <coupon> reads used once, spent by <later sale>, the sale that settled first.
* <counter sale A> is reported with the order on it, and spends <coupon> nowhere.

<!-- trace:case id=g10.loyalty-programme.TC-y4l rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
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

<!-- trace:case id=g10.loyalty-programme.TC-x5l rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
| <coupon> | A reward coupon the member redeemed, inside its validity, scoped to <line_1>'s own variant |
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

<!-- trace:case id=g10.loyalty-programme.TC-bq5 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
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

<!-- trace:case id=g10.loyalty-programme.TC-4wf rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
* The paid order carries what the row's second column says, with the shop's discount allocations.

**Test data:**

| Reward | The paid order carries |
| --- | --- |
| <coupon> | No code and no cut for <coupon> |
| <gift> | No line for <gift>'s product discounted to nothing |

| Field | Value |
| --- | --- |
| <coupon> | A reward product coupon the member holds, unused, inside its validity, scoped to the whole order |
| <gift> | A gift reward the member holds, unused, inside its validity |
| <counter sale A> | A till sale at <shop A> planned with the row's reward |

**Steps:**

1. Settle <counter sale A>.
2. Read the member's coupons on <grade10 loyalty url>.

**Expected Results:**

* The row's reward reads unused.
* <counter sale A> records no use of the row's reward.

<!-- trace:case id=g10.loyalty-programme.TC-flp rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
| <coupon> | A reward coupon the member holds, inside its validity, scoped to the whole order |
| <sale A> | A till sale at <shop A> planned with <coupon> |
| <key A> | The retry key <sale A>'s claim was made under: its order id |

**Steps:**

1. Ask the programme to claim <coupon> for <sale A> under <key A>.
2. Read the answer.
3. Read the member's coupons.

**Expected Results:**

* Step 2 answers as the row's second column says.
* <coupon> is used at most once.

<!-- trace:case id=g10.loyalty-programme.TC-t7v rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <line_1> | One HK$780.00 product |
| <sale A> | A till sale at <shop A> holding <line_1> |

**Steps:**

1. Choose <coupon> in the member's panel.
2. Apply the sale.
3. Read the discount codes on <sale A>.

**Expected Results:**

* Step 2 puts <coupon>'s cut on <sale A>.
* <sale A> carries exactly one code for <coupon>.

<!-- trace:case id=g10.loyalty-programme.TC-msl rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
* admin(holds the permission to cancel a redemption) is signed in to the operator API.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <line_1> | One HK$780.00 product |
| <cancelled order> | An online order the member submitted with <coupon>, then cancelled |

**Steps:**

1. Choose <coupon> in the member's panel.
2. Apply the sale.
3. Ask to reverse the redemption that issued <coupon>.

**Expected Results:**

* Step 2 puts <coupon>'s cut on the sale, and does not say <coupon> is unavailable.
* Step 3 is refused, naming the till sale rather than <cancelled order>.

<!-- trace:case id=g10.loyalty-programme.TC-kid rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
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

<!-- trace:case id=g10.loyalty-programme.TC-wd1 rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
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
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
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

<!-- trace:case id=g10.loyalty-programme.TC-zip rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### grade10-site-loyalty-programme-US11-TC17-1: A claim a stopped checkout left is taken back once it is five minutes old

Runs once per row of **Test data**.

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

* customer(member holding <coupon>) has <coupon> claimed by <stopped checkout>, and the store holds no order for it.
* The claim was made as long ago as the row's <claim age>.
* The member is at the row's place, with <line_1> on the sale.

**Test data:**

| Place | How <coupon> is chosen | <claim age> | Step 2 answers | Step 4 names |
| --- | --- | --- | --- | --- |
| A till session at <shop A>, admin(shop staff) serving | Staff choose <coupon> in the member's panel and apply the sale | 6 minutes | Puts <coupon>'s cut on the sale | The till sale |
| Signed in on <grade10 store url> | The member chooses <coupon> in the cart drawer and submits the checkout | 6 minutes | Puts <coupon>'s cut on the checkout | The new checkout's order |
| A till session at <shop A>, admin(shop staff) serving | Staff choose <coupon> in the member's panel and apply the sale | 2 minutes | Refuses, saying an earlier sale stands | <stopped checkout>'s order |
| Signed in on <grade10 store url> | The member chooses <coupon> in the cart drawer and submits the checkout | 2 minutes | Refuses, saying an earlier sale stands | <stopped checkout>'s order |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <line_1> | One HK$780.00 product |
| <stopped checkout> | A checkout the member started with <coupon>, stopped after the programme claimed <coupon> and before the store wrote its order |

**Steps:**

1. Choose <coupon> the row's way.
2. Read the answer.
3. Read <coupon> in the member's coupons.
4. Read the order <coupon>'s claim names in the programme.

**Expected Results:**

* Step 2 answers as the row's fourth column says.
* Step 2 does not say <coupon> is unavailable.
* Step 3 lists <coupon> as unused.
* Step 4 names the order the row's last column says.

<!-- trace:case id=g10.loyalty-programme.TC-ixy rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### grade10-site-loyalty-programme-US11-TC18-1: A coupon outlives the code an expired order let die

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) is signed in on <grade10 store url>, with <line_1> in the cart.
* <expired order> carries <coupon>'s claim and the code minted for it.
* The clock stands at <check time>, and the programme's sweep has run since.
* admin(operator) is signed in to the operator API.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, its validity running past <check time>, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <expired order> | An online order the member submitted with <coupon> that expired, its checkout still able to collect |
| <check time> | 25 hours and 30 minutes after <coupon> was claimed for <expired order> |

**Steps:**

1. Read the code minted for <coupon> on <expired order> at the shop.
2. Navigate to <grade10 loyalty url>.
3. Read <coupon> in the member's coupons.
4. Read the forfeit count for <coupon>'s reward.
5. Navigate to <grade10 store url>.
6. Open the cart drawer.
7. Choose <coupon>.
8. Submit the checkout.

**Expected Results:**

* Step 1 reads the code as no longer live.
* Step 3 lists <coupon> as unused, not lapsed.
* Step 4 counts no forfeit for <coupon>.
* Step 8 is not refused, and the checkout carries <coupon>'s cut.

<!-- trace:case id=g10.loyalty-programme.TC-hfo rev=1 covers=g10.loyalty-programme.SC-lbx,g10.loyalty-programme.SC-lfq,g10.loyalty-programme.SC-m19,g10.loyalty-programme.SC-hxh,g10.loyalty-programme.SC-avv,g10.loyalty-programme.SC-ail,g10.loyalty-programme.SC-fwa,g10.loyalty-programme.SC-oc6,g10.loyalty-programme.SC-pxx,g10.loyalty-programme.SC-h5a,g10.loyalty-programme.SC-f9s,g10.loyalty-programme.SC-6ok,g10.loyalty-programme.SC-4ph,g10.loyalty-programme.SC-11m,g10.loyalty-programme.SC-7xj,g10.loyalty-programme.SC-qhr,g10.loyalty-programme.SC-lft,g10.loyalty-programme.SC-br3,g10.loyalty-programme.SC-ef4,g10.loyalty-programme.SC-z6m,g10.loyalty-programme.SC-fhj,g10.loyalty-programme.SC-f9r,g10.loyalty-programme.SC-6jz,g10.loyalty-programme.SC-5v5 -->
### grade10-site-loyalty-programme-US11-TC19-1: A sale whose order is written over a minute after its claim is refused

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
* **Trace:** grade10-site-loyalty-programme-US-11

**Pre-conditions:**

* customer(member holding <coupon>) is at the row's place, with <line_1> on the sale.
* The store's write of the sale's order is held back the row's <write delay> past the programme's claim on <coupon>.

**Test data:**

| Place | How <coupon> is chosen | <write delay> | Step 2 answers |
| --- | --- | --- | --- |
| Signed in on <grade10 store url> | The member chooses <coupon> in the cart drawer and submits the checkout | 50 seconds | Goes through, the checkout carrying <coupon>'s cut |
| Signed in on <grade10 store url> | The member chooses <coupon> in the cart drawer and submits the checkout | 70 seconds | Refused: "This checkout took too long. Submit it again." |
| A till session at <shop A>, admin(shop staff) serving | Staff choose <coupon> in the member's panel and apply the sale | 70 seconds | Refused: 此單處理時間過長，請再套用一次。 |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, scoped to <line_1>'s own variant |
| <line_1> | One HK$780.00 product |

**Steps:**

1. Choose <coupon> the row's way.
2. Read the answer.
3. Read the member's orders.
4. Read <coupon> in the member's coupons on <grade10 loyalty url>.

**Expected Results:**

* Step 2 answers as the row's last column says.
* Step 2 does not say <coupon> is unavailable or that the rewards could not be read.
* Step 3 shows an order for the sale only where step 2 went through.
* Step 4 lists <coupon> as unused.

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

## Reconciliation

**Run:** QA1, 2026-10-06, a fresh blind pass in update mode. It read the Purpose and Feature set of both delta specs, both journeys files, `proposal.md`, `decisions.md` with its Raised table, the Coupons, Rewards, Discounts and Shopify Integration pages, the two rulebooks, the store domain suite and this suite with their Reconciliation stripped, and the durable suites' case headings for id continuity. It was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive. Two shell reads leaked by accident: one line of the discounts Reconciliation at HEAD, and the tail of the discounts Reconciliation after US3-TC8-1, US3-TC9-1 and US4-TC5-1 were drafted and the US4-TC11-1 split was planned; nothing was drafted from them, and the discounts pass is not blind past that point. It is a statement, not proof.

**Run:** QA2, 2026-10-06, tcs-rules r4, in a fresh context after QA1's update pass. It read both readings, the delta, `tech-design.md`, `tasks.md`, `decisions.md` with its Raised table, the Coupons, Rewards and Discounts pages, and the application repository where a decision cites it, and checked the suite with `tcs:validate` on the folded store and `trace validate`.

- **Agreed** — `grade10-site-loyalty-programme-SC-190` by US11-TC1-1; `grade10-site-loyalty-programme-SC-192` by US11-TC3-1; `grade10-site-loyalty-programme-SC-193` by US11-TC4-1; `grade10-site-loyalty-programme-SC-194` by US11-TC8-1, online and at the till; `grade10-site-loyalty-programme-SC-200` by US11-TC9-1; `grade10-site-loyalty-programme-SC-201` by US11-TC10-1; `grade10-site-loyalty-programme-SC-202` by US11-TC11-1, a gift's row among them; `grade10-site-loyalty-programme-SC-196` by US11-TC6-1 and US11-TC5-1; `grade10-site-loyalty-programme-SC-197` by US11-TC5-1; `grade10-site-loyalty-programme-SC-198` by US6-TC1-1; `grade10-site-loyalty-programme-SC-199` by US6-TC2-1's last row; `grade10-site-loyalty-programme-SC-205` by US6-TC2-1's first row, with the code and the cart in `grade10-site-store-discounts-US3-TC6-1`; the release in `grade10-site-loyalty-programme-SC-238` by US11-TC18-1, from the member's side
- **Raised, folded into spec** — US6-TC3-1 held that a claim outlasts the code minted for it: `grade10-site-loyalty-programme-SC-238` and one sentence on the reversal requirement (Q12). US11-TC15-1 held that a claim moves the coupon off a tendered counter sale whose order has not arrived, the counter half of Q13: `grade10-site-loyalty-programme-SC-239`. US11-TC16-1 held that two sales claiming one coupon at once leave one live claim, which the requirement's "exactly one sale claims a coupon at a time" states: `grade10-site-loyalty-programme-SC-240`. US11-TC18-1 held that a coupon whose code died with its expired order reads unused rather than lapsed, which the requirement `A spent redemption stays spent when its artifact expires` states and no scenario did: `grade10-site-loyalty-programme-SC-233` (Q24), with a step on the case reading the forfeit count and task 14.3 citing it. Every US-11 marker lists it
- **Rewritten to the spec** — US11-TC2-1 had staff re-plan the counter sale at full price and be told the coupon left; the Discounts page's `A retired counter sale keeps its cart` line says the sale takes no new plan, so step 5 is refused naming a new sale, as `grade10-site-store-discounts-SC-24` says, from the sale's own live session, since a lapsed session answers that it expired. Its title and `grade10-site-loyalty-programme-SC-191`'s name the sale losing its claim, which both assert. US11-TC12-1 gave a claim back by a later sale claiming it; an online order that loses its claim is cancelled, so the rows follow the till route Q11 names, for `grade10-site-loyalty-programme-SC-204`, `grade10-site-loyalty-programme-SC-235` and `grade10-site-loyalty-programme-SC-236`. US6-TC3-1 set a claim older than 25 hours with its code still live, which cannot arise once the code runs from its order's creation (Q12); it walks the two clocks. US11-TC1-1's expired row has the shop close the earlier checkout, since an online order expires only when its checkout could not be closed; one the shop still will not close is US11-TC8-1's
- **Retired** — US11-TC7-1, deprecated by the blind pass: it had the sale that settled first spend the coupon, where Q14 has the claiming sale spend it whichever settles first. `grade10-site-store-discounts-US4-TC5-1` holds its purpose, settling both sales in both orders
- **Raised by the blind pass, landed** — Q11 in US11-TC12-1 and US11-TC13-1; Q12 in US6-TC3-1; Q13 in US11-TC9-1 and US11-TC15-1; Q24 in US11-TC18-1
- **Written from the scenarios, so not blind** — US11-TC13-1 for `grade10-site-loyalty-programme-SC-203`; US11-TC14-1 for `grade10-site-loyalty-programme-SC-237`, with the operator its reversal step needs; US11-TC17-1 for `grade10-site-loyalty-programme-SC-241` and `grade10-site-loyalty-programme-SC-242`, reading which order the claim names after each answer; US7-TC6-1 for `grade10-site-loyalty-programme-SC-166` and `grade10-site-loyalty-programme-SC-172`; the retired rows on US11-TC2-1 and US6-TC2-1 for `grade10-site-loyalty-programme-SC-234`; US11-TC5-1's rows for a cancelled order the programme has not yet been told about and for a checkout that stopped before its order was written, for `grade10-site-loyalty-programme-SC-196`
- **Scenarios narrowed to their requirement** — `grade10-site-loyalty-programme-SC-166` and `grade10-site-loyalty-programme-SC-172` asserted a code for any coupon at the till, where a gift has its own line and no code (Q8); both name a product coupon at their second revision, and the gift's line at the till is `grade10-site-store-discounts-US4-TC9-1`'s. `grade10-site-loyalty-programme-SC-148` showed the member the coupon's code, which the Profile page's `Your coupons` row does not name and `A redemption settles as a coupon, whatever the reward` withholds (Q21); the membership-surface requirement drops the code, and the scenario reads the coupon and its validity at its second revision. No durable US-04 case asserts the code. The `Coupon wallet` line and `grade10-site-loyalty-programme-SC-196` read every coupon the member holds as spendable, which a lapsed, void or wrong-channel coupon is not; both say a coupon a sale claims reads as it would unclaimed (Q5), and US11-TC5-1 and US11-TC6-1 hold a coupon unused and inside its validity, so both stand. `grade10-site-loyalty-programme-SC-120` reads a coupon passing its validity where it read a discount code (Q24), at its second revision. Its title still names a code, because `validate:changes` refuses a carried scenario whose title moved
- **Requirement narrowed to its neighbour** — the requirement told the member nothing when a claim was released, which read against `grade10-site/store/membership`'s correction notice for a till spend the member was told landed. It says nothing tells the member a claim moved, and leaves that notice to membership. No case asserted the wider sentence
- **Renumbered** - on this capability `earn-boosts` issues scenarios 206 to 223, `align-reward-editor-design` 224 to 231 and the cases US7-TC1-1 to US7-TC5-1, and `add-point-expiry-reminders` 232 and US6-TC4-1, each on its own branch. This change's new scenarios are 233 to 242 and its US-07 case is US7-TC6-1; the US6 cases keep TC1 to TC3, which `add-point-expiry-reminders` numbers above. Trace ids, revisions and words did not move
- **Contradicted** — none. The one opposite reading, a counter sale whose coupon left still taking a plan, is settled by the Discounts page
- **Restated unchanged** — `grade10-site-loyalty-programme-SC-62`, `grade10-site-loyalty-programme-SC-63`, `grade10-site-loyalty-programme-SC-64` and `grade10-site-loyalty-programme-SC-174` by the durable US-04 cases; `grade10-site-loyalty-programme-SC-159`, `grade10-site-loyalty-programme-SC-160`, `grade10-site-loyalty-programme-SC-161` and `grade10-site-loyalty-programme-SC-162` by the durable US-03 cases and US7-TC6-1; `grade10-site-loyalty-programme-SC-168`, `grade10-site-loyalty-programme-SC-169` and `grade10-site-loyalty-programme-SC-170` by the durable US-04 cases and the US6 cases; `grade10-site-loyalty-programme-SC-171`, `grade10-site-loyalty-programme-SC-173` and `grade10-site-loyalty-programme-SC-175` by the durable US-04 cases, `grade10-site-loyalty-programme-SC-171` by the US6 cases too, and walked step by step in US3-TC5-1 and US2-TC10-1. `grade10-site-loyalty-programme-SC-120` is joined by the durable US-03 markers and walked by none of them, before this change and after it
- **Uncovered, before this change and after it** — `grade10-site-loyalty-programme-SC-10` and `grade10-site-loyalty-programme-SC-11`, restated unchanged. The durable US1-TC7-1 walks both, but it traces US-01 and they serve the `Membership and ledger` group, so the coverage rule joins no case to them; the next suite refresh owes that group a case. `grade10-site-loyalty-programme-SC-166`, `grade10-site-loyalty-programme-SC-167` and `grade10-site-loyalty-programme-SC-172` were uncovered before this change and are reached through US6 and US7, as is `grade10-site-loyalty-programme-SC-183`, which this delta does not restate
- **Walked in the neighbour's suite** — `grade10-site-loyalty-programme-SC-195`, a coupon two sales collected is spent once, is joined by the US-11 markers and walked by none of their cases since US11-TC7-1 was retired. `grade10-site-store-discounts-US4-TC5-1` walks it in both settling orders, because the settlement is `grade10-site/store/discounts`' own requirement
- **Uncovered anchors** — none

**Run:** QA2, 2026-10-06, tcs-rules r4, in a fresh context after accept-review fix round 2. It read both suites, both deltas, `tech-design.md`, `tasks.md`, `decisions.md` with its Raised table, the Coupons, Rewards and Discounts pages, and the application repository where a decision cites it, and checked both suites with `validate:changes`, `tcs:validate`, `trace validate` and `check:manual`. No anchor moved since the run above: the journey set and the feature set's root groups are unchanged, and `Settlement by kind` and `Coupon wallet` are items under `Rewards and redemption` and `Member surface`.

- **Settlement by kind, agreed** - US7-TC6-1 mints a product coupon's code when it is chosen, and a gift's line at the till is `grade10-site-store-discounts-US4-TC9-1`'s; no case mints a code when a coupon is issued
- **Coupon wallet narrowed, agreed** - US11-TC6-1 walks the member's coupons, the cart drawer and the till panel, and its title names a member or till surface, as `grade10-site-loyalty-programme-SC-196`'s does; US6-TC1-1 has the operator's refusal name the sale, as `grade10-site-loyalty-programme-SC-198` asks
- **Allocations scope (Q22), rewritten to the spec** - the requirement spends a coupon only where a sale that names the shop's allocations shows its cut, and on a sale that names none the Discounts page's open fallback would spend a coupon on its variant alone. US11-TC11-1's coupon row reads a sale with no cut, so its pre-condition now has the paid order name the shop's discount allocations. No case walks a sale that names none
- **The membership surface exports (Q21), agreed** - `CouponList` carries a code only where the consumer passes one. `grade10-site-loyalty-programme-SC-123`, `grade10-site-loyalty-programme-SC-124`, `grade10-site-loyalty-programme-SC-125`, `grade10-site-loyalty-programme-SC-185` and `grade10-site-loyalty-programme-SC-186` are carried unchanged and keep the durable US-04 cases, none of which asserts a code; US11-TC6-1 reads no code on any row
- **Renumbered, agreed** - the scenarios once issued as 224 to 232 are `grade10-site-loyalty-programme-SC-234` to `grade10-site-loyalty-programme-SC-242`, and US7-TC5-1 is US7-TC6-1, above `align-reward-editor-design` and `add-point-expiry-reminders`. No citation of the old numbers is left in the change or on the pages, and no trace id here is held by `earn-boosts`, `align-reward-editor-design` or `add-point-expiry-reminders`
- **Case trace id reissued, agreed** - US11-TC18-1 takes `g10.loyalty-programme.TC-ixy` at its first revision, since `align-reward-editor-design`'s US7-TC3-1 holds the id it had; its covers list is unchanged
- **Covers, agreed** - every case's marker lists every scenario its journey's delta carries; `grade10-site-loyalty-programme-SC-233` is on every US-11 marker
- **Uncovered anchors** - none

**Run:** QA2, 2026-10-07, tcs-rules r4, in a fresh context after QA1's update pass on the fresh scan, the late order write and the code-free coupon list. That pass left no run line, so whether it was blind is unrecorded. It read both suites, both deltas, `tech-design.md`, `tasks.md`, `decisions.md` with its Raised table, the Coupons, Profile and Discounts pages, and the application repository, and checked both suites with `tcs:validate` and `trace validate`. No anchor moved: US-04 joins the journeys file as context for `grade10-site-loyalty-programme-SC-243`, and the feature set's root groups are unchanged.

- **The coupon list carries no reward code, agreed** - US4-TC8-1 walks `grade10-site-loyalty-programme-SC-243`'s reward coupon in the member's wallet. Its store-coupon half is `CouponList`'s contract alone: no consumer passes a code (Q29), so no member surface reaches it and no case here walks it
- **A late order write is refused, agreed** - US11-TC19-1 walks `grade10-site-loyalty-programme-SC-244` either side of the minute
- **Markers** - US4-TC8-1 takes `g10.loyalty-programme.TC-odc` and US11-TC19-1 `g10.loyalty-programme.TC-hfo`, each listing every scenario its journey's delta carries. US4-TC1-1, US4-TC3-1 and US4-TC4-1 are carried with their words, and lack **Suites** as the durable suite does
- **Uncovered anchors** - none

**Run:** QA2, 2026-10-07, tcs-rules r4, in a fresh context after accept-review settled Raised R4 as Q32. It read this suite, the delta, `tech-design.md`, `tasks.md`, `decisions.md` with its Raised table, the Coupons page and the application repository's till plan, and checked the suite with `validate:changes`, `tcs:validate` and `trace validate`. No anchor moved.

- **A late order write is refused, rewritten to the spec** - the requirement and `grade10-site-loyalty-programme-SC-244` name a sale online or at the till and the words each reads, since the till plan writes its order through the same promise. US11-TC19-1 gains a till row and a place column, step 2 reads the words on each refused row, and its title names a sale. Its marker and covers list are unchanged
- **Uncovered anchors** - none
