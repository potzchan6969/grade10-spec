# grade10-site/analytics Test Cases

**Status:** approved
**Reviewed:** 2026-09-30, tcs-rules r4

## Background

* A worker's waiting and held records are read in that worker's own database, its Mixpanel records by state; each sweep also reports the waiting count, the oldest record's age and the held count to Datadog, tagged by product.
* Mixpanel unreachable, a refused record or a lost answer is made by a stubbed Mixpanel on the worker's send path.
* A Mixpanel event is read in the Mixpanel project's events view, by its name and the fact's id.
* The store, auction and loyalty workers sweep every 5 minutes, the vault worker every 15 minutes.

## grade10-site-analytics-US1: Mixpanel events and profiles

**As a** collector,
**I want** browse, bid, and pay recorded as one path without inventing people,
**so that** funnels and cohorts stay honest for the operators who read them.

### grade10-site-analytics-US1-TC18-1: Committed fact reaches Mixpanel on the worker's next sweep

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Delivery

**Pre-conditions:**

* The row's worker has a Mixpanel token.
* Mixpanel accepts sends.
* Nothing waits to be sent from the row's worker.

**Test data:**

| Worker | Fact | Server event | Arrives within |
| --- | --- | --- | --- |
| Store | customer(collector) pays `<order_1>` | Order Paid | 5 minutes |
| Auction | customer(bidder) places a maximum on `<lot_1>` | Bid Placed | 5 minutes |
| Loyalty | customer(member) redeems `<reward_1>` with points | Reward Redeemed | 5 minutes |
| Vault | admin(treasurer) records the payout on `<vault case_1>` | Vault Payout Recorded | 15 minutes |

**Steps:**

1. Commit the row's fact.
2. Read the worker's waiting records count before its next sweep.
3. Wait the row's arrival bound, one sweep interval.
4. Read the row's server event in the Mixpanel project.
5. Read the worker's waiting records count again.

**Expected Results:**

* Step 2 shows one waiting record.
* Step 4 shows the row's server event once, for that fact.
* Step 5 shows zero waiting records.

### grade10-site-analytics-US1-TC19-1: Rolled-back fact sends nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The auction worker has a Mixpanel token.
* Mixpanel accepts sends.
* The auction's write of a maximum on `<lot_2>` is made to fail before it commits.

**Steps:**

1. Place a maximum on `<lot_2>` as customer(bidder).
2. Read `<lot_2>`'s bids.
3. Read the auction worker's waiting records count.
4. Wait 5 minutes.
5. Search the Mixpanel project for Bid Placed on `<lot_2>`.

**Expected Results:**

* Step 2 shows no bid from that maximum.
* Step 3 shows zero waiting records.
* Step 5 finds no Bid Placed for `<lot_2>`.

### grade10-site-analytics-US1-TC20-1: Record survives a worker that stops after the commit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The auction worker has a Mixpanel token.
* Mixpanel accepts sends.
* The auction worker is made to stop straight after the commit of the request that places a maximum.

**Steps:**

1. Place a maximum on `<lot_1>` as customer(bidder).
2. Read the auction worker's waiting records count.
3. Wait 5 minutes.
4. Read Bid Placed for `<lot_1>` in the Mixpanel project.

**Expected Results:**

* Step 1's maximum is accepted.
* Step 2 shows one waiting record.
* Step 4 shows one Bid Placed for that maximum.

### grade10-site-analytics-US1-TC21-1: Outage of hours drains once Mixpanel recovers

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The store worker has a Mixpanel token.
* Mixpanel is made unreachable from the store worker for `<outage length>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<outage length>` | 21600s (6 hours), past the 360s (6 minutes) the old requeues lasted |
| `<paid orders>` | `<order_3>`, `<order_4>`, `<order_5>`, paid at spread times inside the outage |

**Steps:**

1. Pay each of `<paid orders>` as customer(collector) during the outage.
2. Read the store worker's waiting records count and the oldest record's age before the outage ends.
3. End the outage.
4. Wait 20 minutes.
5. Read Order Paid for each of `<paid orders>` in the Mixpanel project.
6. Read the store worker's waiting records count.

**Expected Results:**

* Every order in step 1 is paid; none is refused for the outage.
* Step 2 shows three waiting records, the oldest aged from `<order_3>`'s payment.
* Step 2 shows zero held records.
* Step 5 shows Order Paid once for each of `<paid orders>`.
* Step 6 shows zero waiting records.

### grade10-site-analytics-US1-TC22-1: Send accepted but seen as failed counts once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The loyalty worker has a Mixpanel token.
* Mixpanel accepts the loyalty worker's next send, and the worker is made to see that send as failed.

**Steps:**

1. Redeem `<reward_1>` with points as customer(member).
2. Wait for the loyalty worker's sweep to send and see the send fail.
3. Wait for the next sweep.
4. Read Reward Redeemed for `<reward_1>` in the Mixpanel project.
5. Read the loyalty worker's waiting records count.

**Expected Results:**

* Step 3's sweep sends the same record again, with the same `$insert_id`, event name, time and distinct_id.
* Step 4 shows Reward Redeemed once.
* Step 5 shows zero waiting records.

### grade10-site-analytics-US1-TC23-1: Replayed paid webhook keeps one Order Paid record

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The store worker has a Mixpanel token.
* Mixpanel is made unreachable from the store worker.
* customer(collector) has paid `<order_6>`, and its Order Paid waits on the store worker.

**Steps:**

1. Read the store worker's waiting Order Paid records for `<order_6>`.
2. Deliver `<order_6>`'s paid-order webhook to the store again.
3. Wait for the store's next sweep.
4. Read the store worker's waiting Order Paid records for `<order_6>` again.
5. Make Mixpanel reachable.
6. Wait 20 minutes.
7. Read Order Paid for `<order_6>` in the Mixpanel project.

**Expected Results:**

* Step 1 shows one waiting record.
* Step 4 still shows one waiting record.
* Step 7 shows Order Paid once for `<order_6>`.

### grade10-site-analytics-US1-TC24-1: Refused record in a batch is held, the rest sent

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The auction worker has a Mixpanel token.
* Mixpanel accepts sends, except that it refuses the record for `<refused event>`.
* Nothing waits or is held on the auction worker.

**Test data:**

| Field | Value |
| --- | --- |
| `<batch events>` | Lot Watched on `<lot_1>`, Lot Watched on `<lot_3>`, Bid Placed on `<lot_1>`, by one customer(bidder), committed before one sweep |
| `<refused event>` | Bid Placed on `<lot_1>` |

**Steps:**

1. Commit the facts behind `<batch events>` before the auction worker's next sweep.
2. Wait for the sweep.
3. Read `<batch events>` in the Mixpanel project.
4. Read the auction worker's waiting and held records counts.
5. Read the auction's held-records alarm in Datadog.
6. Wait for two more sweeps.
7. Read the held records count and `<refused event>` in the Mixpanel project again.

**Expected Results:**

* Step 3 shows Lot Watched once each for `<lot_1>` and `<lot_3>`, and no Bid Placed.
* Step 4 shows zero waiting records and one held record.
* Step 5 shows the alarm raised for the held record.
* Step 7 shows one held record and still no Bid Placed; nothing sent it or dropped it.

### grade10-site-analytics-US1-TC25-1: Held profile write never lands over a later one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* customer A(member on Silver) has a user id, and their Mixpanel user profile's Tier is `Silver`.
* customer B(member on Silver) has a user id.
* The loyalty worker has a Mixpanel token.
* Mixpanel refuses the profile write that sets customer A's Tier to `Gold`, and accepts every other send.

**Steps:**

1. Move customer A from Silver to Gold.
2. Move customer B from Silver to Gold before the loyalty worker's next sweep.
3. Wait for the loyalty worker's sweep.
4. Read the loyalty worker's held records count.
5. Move customer A from Gold to Black.
6. Wait for the loyalty worker's next sweep.
7. Read customer A's Mixpanel user profile's Tier.
8. Wait for two more sweeps.
9. Read customer A's Mixpanel user profile's Tier again.

**Expected Results:**

* Step 4 shows one held record, customer A's Gold write.
* Step 7 shows Tier `Black`; the held write did not delay it.
* Step 9 still shows Tier `Black`.

### grade10-site-analytics-US1-TC26-1: Profile ends on the latest write after an outage

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* customer(member on Silver) has a user id, and the Mixpanel user profile's Tier is `Silver`.
* The loyalty worker has a Mixpanel token.
* Mixpanel is made unreachable from the loyalty worker.

**Steps:**

1. Move the member from Silver to Gold.
2. Wait for a sweep to fail.
3. Move the member from Gold to Black.
4. Wait for a sweep to fail.
5. Make Mixpanel reachable.
6. Wait 20 minutes.
7. Read the Mixpanel user profile's Tier.
8. Read the loyalty worker's waiting records count.

**Expected Results:**

* Step 7 shows Tier `Black`.
* Step 8 shows zero waiting records.

### grade10-site-analytics-US1-TC27-1: Erased account's waiting and held records go with it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* customer(member on Silver) has a user id.
* The loyalty worker has a Mixpanel token.
* The member's `<held record>` is held on the loyalty worker.
* Mixpanel is made unreachable from the loyalty worker, and the member's `<waiting record>` waits there.

**Test data:**

| Field | Value |
| --- | --- |
| `<held record>` | Reward Redeemed for `<reward_2>`, refused by Mixpanel |
| `<waiting record>` | Reward Redeemed for `<reward_3>`, redeemed during the outage |

**Steps:**

1. Erase the member's account.
2. Read the loyalty worker's waiting and held records for the member.
3. Make Mixpanel reachable.
4. Wait 20 minutes.
5. Search the Mixpanel project for the member's user id.

**Expected Results:**

* Step 2 shows neither `<held record>` nor `<waiting record>`, waiting or held.
* Step 5 finds no Reward Redeemed for `<reward_2>` or `<reward_3>`.
* Step 5 finds the profile write the erasure itself made: Member false, no Tier.

### grade10-site-analytics-US1-TC28-1: Worker with an empty token writes no record

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The store worker runs with an empty Mixpanel token since its last deploy.
* Nothing waits or is held on the store worker.

**Steps:**

1. Pay `<order_9>` as customer(collector).
2. Read `<order_9>`'s payment state.
3. Read the store worker's waiting and held records counts.
4. Read the store worker's log since that deploy.

**Expected Results:**

* Step 2 shows `<order_9>` paid.
* Step 3 shows zero waiting and zero held records.
* Step 4 shows the store's Mixpanel records are off, its token empty.

### grade10-site-analytics-US1-TC29-1: Browser batch failure stays best effort

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* customer(collector) is signed in on `<grade10 store url>`.
* The store worker has a Mixpanel token.
* Mixpanel is made unreachable from the store worker.
* Nothing waits or is held on the store worker.

**Steps:**

1. Open `<product_1>`'s page on `<grade10 store url>`.
2. Wait for the browser to post its client batch to `/api/track`.
3. Read the store worker's waiting and held records counts.
4. Make Mixpanel reachable.
5. Wait for the browser's next flush, with the page still open.
6. Read Product Viewed for `<product_1>` in the Mixpanel project.

**Expected Results:**

* Step 2's `/api/track` answers 500.
* Step 3 shows zero waiting and zero held records; neither the batch nor its Audience write waits.
* Step 5 sends the batch with the same `$insert_id`s.
* Step 6 shows Product Viewed once.

## Settled

- An event with neither a user nor a device is refused and its fact still
  commits; no Delivery rule states it, since Q13 decided it and today's send
  path already runs it.

## Reconciliation

**Run:** 2026-09-29 · blind pass read `## Purpose` and `## Feature set`,
`user-journeys.md` (Walked by nobody), `proposal.md`, `decisions.md`, and
Product Analytics · Delivery and Mixpanel Events. Denied: every
`## Requirements` section and `openspec/changes/archive/`. The durable suite
was read for ids only, its `## Reconciliation` stripped.

- **Uncovered anchors** - none; every Delivery leaf carries a case.
- **Folded in** - a worker stopping right after the commit still sends
  (TC20) and the erasure's own profile write is still sent (TC27) became
  lines of the scenarios on those rules.
- **Dropped and recorded** - an event with no user and no device is refused
  and the fact commits (Q13); it runs today, is no Delivery leaf, and the
  outline's first draft of it as a requirement was removed.
- **Raised** - five questions, each answered in `decisions.md` under
  `## Raised`: a backlog drained over several sweeps, which answers are a
  refusal, a token emptied with records waiting, device-only records at
  erasure, and a held profile write passed by a later one.
