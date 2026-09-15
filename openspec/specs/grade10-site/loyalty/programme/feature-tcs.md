# grade10-site/loyalty/programme Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## grade10-site-loyalty-programme-US1: Member earns points on qualifying spend

**As a** member,
**I want** my balance to follow the money I spend and keep spent, priced once
at my tier's rate in the programme's own currency,
**so that** what I can redeem is exactly what my qualifying spend earned.

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

---

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

---

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

---
## grade10-site-loyalty-programme-US5: Operator runs the programme from one console

**As an** operator,
**I want** to find a member and act on their loyalty under my own permissions,
**so that** I can correct, reward and invite without holding powers I was not
given, and every change I made stays provable.

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
