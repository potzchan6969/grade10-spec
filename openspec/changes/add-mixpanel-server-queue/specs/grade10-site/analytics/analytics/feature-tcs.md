# grade10-site/analytics Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-site-analytics-US1: Mixpanel events and profiles

**As a** collector,
**I want** browse, bid, and pay recorded as one path without inventing people,
**so that** funnels and cohorts stay honest for the operators who read them.

### grade10-site-analytics-US1-TC18-1: Committed fact reaches Mixpanel on the worker's next sweep

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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
| Vault | treasurer records the payout on `<vault case_1>` | Vault Payout Recorded | 15 minutes |

**Steps:**

1. Commit the row's fact.
2. Read the worker's waiting records count.
3. Wait the row's arrival bound.
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
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The store worker has a Mixpanel token.
* Mixpanel accepts sends.
* The store's write of `<order_2>`'s payment is made to fail after the checkout is accepted.

**Steps:**

1. Pay `<order_2>` as customer(collector).
2. Read `<order_2>`'s payment state.
3. Read the store worker's waiting records count.
4. Wait 5 minutes.
5. Search the Mixpanel project for Order Paid on `<order_2>`.

**Expected Results:**

* Step 2 shows `<order_2>` not paid.
* Step 3 shows zero waiting records.
* Step 5 finds no Order Paid for `<order_2>`.

### grade10-site-analytics-US1-TC20-1: Record survives a worker that stops after the commit

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
* **Status:** draft
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
4. Wait 5 minutes.
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
* **Status:** draft
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

### grade10-site-analytics-US1-TC23-1: Order Paid drain pass that fails and re-runs counts once

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
* **Trace:** Delivery

**Pre-conditions:**

* The store worker has a Mixpanel token.
* Mixpanel accepts sends.
* The store's first pass that drains `<order_6>`'s paid-order due row is made to fail before it commits.

**Steps:**

1. Pay `<order_6>` as customer(collector).
2. Wait for the failed drain pass.
3. Read the store worker's waiting records count.
4. Wait for the next drain pass to commit.
5. Wait 5 minutes.
6. Read Order Paid for `<order_6>` in the Mixpanel project.

**Expected Results:**

* Step 3 shows zero waiting records.
* Step 6 shows Order Paid once for `<order_6>`.

### grade10-site-analytics-US1-TC24-1: Refused record in a batch is held, the rest sent

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
* **Trace:** Delivery

**Pre-conditions:**

* The auction worker has a Mixpanel token.
* Mixpanel accepts sends, except that it refuses the record for `<refused event>`.
* Nothing waits or is held on the auction worker.

**Test data:**

| Field | Value |
| --- | --- |
| `<batch events>` | Lot Watched on `<lot_1>`, Bid Placed on `<lot_1>`, Bidder Outbid on `<lot_1>`, committed before one sweep |
| `<refused event>` | Bid Placed on `<lot_1>` |

**Steps:**

1. Commit the facts behind `<batch events>` before the auction worker's next sweep.
2. Wait for the sweep.
3. Read `<batch events>` in the Mixpanel project.
4. Read the auction worker's waiting and held records counts.
5. Read the alarms on held records.
6. Wait for two more sweeps.
7. Read the held records count and `<refused event>` in the Mixpanel project again.

**Expected Results:**

* Step 3 shows Lot Watched and Bidder Outbid once each, and no Bid Placed.
* Step 4 shows zero waiting records and one held record.
* Step 5 shows an alarm for the held record.
* Step 7 shows one held record and still no Bid Placed; nothing sent it or dropped it.

### grade10-site-analytics-US1-TC25-1: Held profile write never lands over a later one

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
* **Trace:** Delivery

**Pre-conditions:**

* customer(member on Silver) has a user id, and the Mixpanel user profile's Tier is `Silver`.
* The loyalty worker has a Mixpanel token.
* Mixpanel refuses the profile write that sets Tier to `Gold`, and accepts every other send.

**Steps:**

1. Move the member from Silver to Gold.
2. Wait for the loyalty worker's sweep.
3. Read the loyalty worker's held records count.
4. Move the member from Gold to Black.
5. Wait for the loyalty worker's next sweep.
6. Read the Mixpanel user profile's Tier.
7. Wait for two more sweeps.
8. Read the Mixpanel user profile's Tier again.

**Expected Results:**

* Step 3 shows one held record.
* Step 6 shows Tier `Black`; the held write did not delay it.
* Step 8 still shows Tier `Black`.

### grade10-site-analytics-US1-TC26-1: Profile ends on the latest write after an outage

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
6. Wait 5 minutes.
7. Read the Mixpanel user profile's Tier.
8. Read the loyalty worker's waiting records count.

**Expected Results:**

* Step 7 shows Tier `Black`.
* Step 8 shows zero waiting records.

### grade10-site-analytics-US1-TC27-1: Erased account's waiting and held records go with it

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
* **Trace:** Delivery

**Pre-conditions:**

* customer(collector) has a user id.
* The store worker has a Mixpanel token.
* The collector's `<held record>` is held on the store worker.
* Mixpanel is made unreachable from the store worker, and the collector's `<waiting record>` waits there.

**Test data:**

| Field | Value |
| --- | --- |
| `<held record>` | Checkout Started for `<order_7>`, refused by Mixpanel |
| `<waiting record>` | Order Paid for `<order_8>`, paid during the outage |

**Steps:**

1. Erase the collector's account.
2. Read the store worker's waiting and held records counts.
3. Make Mixpanel reachable.
4. Wait 5 minutes.
5. Search the Mixpanel project for the collector's user id.

**Expected Results:**

* Step 2 shows neither `<held record>` nor `<waiting record>`, waiting or held.
* Step 5 finds no Checkout Started for `<order_7>` and no Order Paid for `<order_8>`.
* Step 5 finds the profile write the erasure itself made.

### grade10-site-analytics-US1-TC28-1: Worker with an empty token writes no record

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery

**Pre-conditions:**

* The store worker's Mixpanel token is empty.
* Nothing waits or is held on the store worker.

**Steps:**

1. Pay `<order_9>` as customer(collector).
2. Read `<order_9>`'s payment state.
3. Read the store worker's waiting and held records counts.
4. Read the store worker's log for that payment.

**Expected Results:**

* Step 2 shows `<order_9>` paid.
* Step 3 shows zero waiting and zero held records.
* Step 4 shows a logged no-op for the send.

### grade10-site-analytics-US1-TC29-1: Browser batch failure stays best effort

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
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
5. Wait for the browser to send the batch again, with the page still open.
6. Read Product Viewed for `<product_1>` in the Mixpanel project.

**Expected Results:**

* Step 2's `/api/track` answers 500.
* Step 3 shows zero waiting and zero held records; neither the batch nor its Audience write waits.
* Step 5 sends the batch with the same `$insert_id`s.
* Step 6 shows Product Viewed once.

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
