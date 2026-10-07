# grade10-site/loyalty/programme Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-loyalty-programme-US3: Member redeems and can pay with points at checkout

**As a** member,
**I want** a redemption to settle as the reward it is, and points to reduce a bill at the programme's rate,
**so that** I cannot undo a spent reward, and deleting my account ends membership at once.

<!-- trace:case id=g10.loyalty-programme.TC-hb9 rev=2 covers=g10.loyalty-programme.SC-gby,g10.loyalty-programme.SC-j0k -->
### grade10-site-loyalty-programme-US3-TC5-2: A reversal returns points to the running day, and no stock for an unlimited reward

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**

* The programme's clock reads 2026-07-01 10:00.
* customer(member) `<member_A>` earned 600 points at 18:00 on 2026-01-03, redeemed `<reward_limited>` for 100 of them at 18:00 on 2026-01-13, and paid an order earning 10 points at 18:00 on 2026-06-01, so the 510 points they hold lapse at 18:00 on 2027-06-01.
* customer(member) `<member_B>` redeemed `<reward_unlimited>`.
* Neither member has used the coupon their redemption issued.

**Test data:**

| Field | Value |
| --- | --- |
| `<reward_limited>` | A 100-point reward with limited stock |
| `<reward_unlimited>` | A reward with no stock limit |

**Steps:**

1. As admin(operator), reverse `<member_A>`'s redemption of `<reward_limited>`.
2. Read `<member_A>`'s balance and the day it lapses.
3. As admin(operator), reverse `<member_B>`'s redemption of `<reward_unlimited>`.
4. Read `<reward_unlimited>`'s stock.

**Expected Results:**

* Step 2: the balance reads 610 points.
* Step 2: all 610 lapse at 18:00 on 2027-06-01, the day still running.
* Step 2: the 100 returned points lapse neither on 2027-01-03, a year from their earn, nor on 2027-07-01.
* Step 4: no stock is returned for `<reward_unlimited>`.

<!-- trace:case id=g10.loyalty-programme.TC-b8s rev=1 covers=g10.loyalty-programme.SC-guq -->
### grade10-site-loyalty-programme-US3-TC7-1: Points paid at checkout and given back keep the running day, even on an emptied balance

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
* **Trace:** grade10-site-loyalty-programme-US-03

**Pre-conditions:**

* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` earned 600 points on 2026-01-03 and paid 100 of them toward `<order_1>` at 18:00 on 2026-01-13, so every point they hold lapses at 18:00 on 2027-01-13.
* `<before>` holds.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_1>` | A paid order of $300 in qualifying goods: 100 points and $200 in money, which earned 20 points |

| `<before>` | `<return>` | `<balance after>` |
| --- | --- | --- |
| admin(operator) made a correction taking off every point `<member_1>` holds, so the balance is 0 | a refund of every qualifying good in `<order_1>` | 100, the points paid; nothing is left to claw back |
| nothing else has happened, so the balance is 520 | a refund of every qualifying good in `<order_1>` | 600, 520 plus the 100 paid less the 20 earned |
| admin(operator) made a correction taking off every point `<member_1>` holds, so the balance is 0 | admin(operator) returns the points paid toward `<order_1>` from the loyalty admin | 100, the points paid |

**Steps:**

1. Apply `<return>`.
2. Read `<member_1>`'s balance and the day it lapses.

**Expected Results:**

* The balance reads `<balance after>` points.
* The 100 returned points lapse at 18:00 on 2027-01-13.
* The day `<member_1>`'s balance lapses is still 2027-01-13.

---

## grade10-site-loyalty-programme-US6: Operator reverses a redemption a member cannot be given

**As an** operator,
**I want** to return a member's points and void their coupon while it is still unused,
**so that** a reward we cannot honour costs the member nothing.

<!-- trace:case id=g10.loyalty-programme.TC-g5m rev=1 covers=g10.loyalty-programme.SC-guq -->
### grade10-site-loyalty-programme-US6-TC4-1: Points a reversal gives back to an emptied balance keep the running day

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
* **Trace:** grade10-site-loyalty-programme-US-06

**Pre-conditions:**

* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` earned 600 points on 2026-01-03 and redeemed `<reward_1>` for 100 of them at 18:00 on 2026-01-13, so every point they hold lapses at 18:00 on 2027-01-13.
* `<member_1>` has not used the coupon `<reward_1>` issued.
* admin(operator) made a correction taking off every point `<member_1>` holds, so the balance is 0.

**Steps:**

1. As admin(operator), reverse the redemption of `<reward_1>`.
2. Read `<member_1>`'s balance and the day it lapses.

**Expected Results:**

* The balance reads 100 points.
* Those 100 points lapse at 18:00 on 2027-01-13, not twelve months from today.
* The day `<member_1>`'s balance lapses is still 2027-01-13.

## Reconciliation

**Run:** QA1 and QA2 on the programme delta's anchors, accept-review fix round 2, 2026-10-06, in one context with the delta's scenario. Read the delta's `## Feature set`, its `user-journeys.md`, `decisions.md` Q9 and Q10, [Points](../../../../../../../docs/prds/products/grade10-site/loyalty/points.md), [Paying with Points](../../../../../../../docs/prds/products/grade10-site/loyalty/paying-with-points.md) and [Rewards](../../../../../../../docs/prds/products/grade10-site/loyalty/rewards.md), the durable programme suite, and in grade10 the lot restoration and the operator credit's window. The durable cases the copied requirement's other scenarios already reach are unchanged and not restated here.

**Run:** QA1 blind feature pass, accept-review round 3, 2026-10-06, tcs-rules r4, in a fresh context. Read the delta's `## Feature set`, the durable `## Purpose` and `## Feature set`, the delta's `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised`, the pages Points, Rewards, Paying with Points, Operator Console and Profile, this suite above `## Reconciliation`, the durable suite's US2 and US3 cases for id continuity, and both rulebooks. Denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive; an id search surfaced one row of this section, naming a scenario. Took the US3 heading and statement from the delta's journeys, rewrote the durable US3-TC5 as US3-TC5-2 to the running-day rule, and gave US3-TC7 a live-balance row. No new raised question.

**Run:** QA2 rerun after the round 3 blind pass, 2026-10-06, in a fresh context. Joined the three cases with the delta's scenarios and the durable Reversal requirement's. US3-TC5-2 carries the durable case's `trace:case` marker at revision 2, so it revises that case rather than handing its id to a new one. The US3 heading is the journey's title, which the durable suite's heading had lagged; the journeys file restates US-03 and US-06 under `## Context user journeys`, and the reuse check now reads a story titled as the journey the change restates as that journey. The anchors are unchanged.

**Run:** QA2 rerun, accept-review fix round 3, 2026-10-06. Q10 now names an operator's return of points paid at checkout, which runs the same restoration as a refund; the Returned points line, the expiry requirement and `grade10-site-loyalty-programme-SC-232` name it, and US3-TC7-1 gains its row. The scenario and the US6 case take `grade10-site-loyalty-programme-SC-232` and US6-TC4-1, the first numbers no active change or review branch holds; their trace ids are unchanged. The anchors' root group is unchanged.

**Run:** QA2 rerun before accept-review round 4, 2026-10-06, in a fresh context. Joined the three cases with `grade10-site-loyalty-programme-SC-232` and every scenario the copied expiry requirement carries, against the durable suite and the active changes on this capability. The three cases agree with the requirement and with grade10's refund claw-back and points return; no case moved. The anchors are unchanged.

**Run:** accept-review fix round 4, 2026-10-07. Q11 corrects the operator credit onto a balance brought to nothing to the later of a window from its own day and the day still running; `grade10-site-loyalty-programme-SC-180`, `grade10-site-loyalty-programme-SC-98` and `grade10-site-loyalty-programme-SC-99` take revision 2. The durable US2-TC8-1 still reaches the lapsed balance; the running day moving out is reached by the expiry-reminders suite's US1-TC20-1. No case here moved, and the anchors are unchanged.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-loyalty-programme-US3-TC5-2` | Reached, revised | `grade10-site-loyalty-programme-SC-171` and `grade10-site-loyalty-programme-SC-175`: the returned points keep their credits' own dates and count to the later of those and the day still running, which a reversal does not move, and an unlimited reward gets no stock back; revision 1 asserted the credits' dates alone, which on a balance whose day has moved on reads as the earlier day |
| `grade10-site-loyalty-programme-US3-TC7-1` | Reached, wider | `grade10-site-loyalty-programme-SC-232`, points paid at checkout coming back onto a balance brought to nothing, through a refund and through an operator's return; the live-balance row reads the delta's expiry requirement, returned points rejoining the window already running |
| `grade10-site-loyalty-programme-US6-TC4-1` | Reached | `grade10-site-loyalty-programme-SC-232`, the reversal of an unused redemption |

- **Settled** - Q10: points a reversal gives back, and points paid at checkout that a refund or an operator returns, take the day still running, even onto a balance brought to nothing
- **Rejected** - none
- **Contradicted** - none
- **Uncovered** - none this change introduces. The copied expiry requirement carries `grade10-site-loyalty-programme-SC-150` and `grade10-site-loyalty-programme-SC-151` unchanged, and no durable or active suite traces either; `grade10-site-loyalty-programme-SC-183` is traced by `never-lock-a-coupon`'s cases. Both gaps predate this change and belong to the durable suite's refresh, not to a reading of this change's anchors
