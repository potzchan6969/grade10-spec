# grade10-store/loyalty Test Cases

**Status:** pending-review

## loyalty-US-01: Member earns points on qualifying spend

**As a** member,
**I want** my balance to follow the money I spend and keep spent, priced once
at my tier's rate in the programme's own currency,
**so that** what I can redeem is exactly what my qualifying spend earned.

**Covers:**

- `loyalty-SC-01` — Activity precedes joining
- `loyalty-SC-03` — Balance excludes expired and spent points
- `loyalty-SC-04` — A balance never goes negative
- `loyalty-SC-05` — Every debit is fully accounted
- `loyalty-SC-06` — Rounding happens once
- `loyalty-SC-07` — A foreign currency is refused
- `loyalty-SC-08` — Backdated activity keeps its own date
- `loyalty-SC-09` — Future-dated activity is refused
- `loyalty-SC-10` — A retry is free
- `loyalty-SC-11` — A reused key with new input is refused
- `loyalty-SC-12` — Expiry needs no sweep
- `loyalty-SC-13` — A partial sweep converges
- `loyalty-SC-23` — A purchase earns at the member's rate
- `loyalty-SC-35` — A split refund matches a single refund
- `loyalty-SC-36` — A member who already spent the points is not driven negative
- `loyalty-SC-37` — A refund before its earning is not lost
- `loyalty-SC-38` — A claw-back cancels the tier contribution it removes
- `loyalty-SC-39` — Points survive an outage
- `loyalty-SC-40` — A repeated delivery grants nothing twice
- `loyalty-SC-41` — One money event, one identity
- `loyalty-SC-42` — A partial refund claws back only its own part
- `loyalty-SC-43` — A currency mismatch stops the product from starting
- `loyalty-SC-44` — A refused recording is reported, not swallowed

### loyalty-TC-01: Diamond member completes a HKD 1,000 purchase and earns 120 points

**Description:** Proves the programme prices a completed purchase at the
programme's earn rate times the tier multiplier the member actually holds. If
this fails, nothing else in the journey is worth running.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Diamond, which earns 1.2×.
- The member has no other recorded activity, so the balance shows this purchase
  alone.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 1,000 |
| Member tier | Diamond |
| Earn rate | 1 point per HKD 10 |
| Diamond multiplier | 1.2× |
| Points expected | 120 |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Complete a HKD 1,000 purchase as the Diamond member. | The purchase completes. |
| 2 | Read the member's balance. | It holds 120 points. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** actual
- **Behaviour:** positive
- **Type:** smoke
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-23

### loyalty-TC-02: Member's points are floored once after the rate and the multiplier

**Description:** Proves the point total is rounded down a single time at the end
of the calculation. Flooring at each step loses a point the member earned, so
the case compares the two results explicitly.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Diamond, which earns 1.2×.
- The member has no other recorded activity.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 95 |
| At the earn rate | 9.5 points |
| After the 1.2× multiplier | 11.4 points |
| Floored once at the end | 11 points |
| Incorrect result if floored at each step | 10 points |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Complete a HKD 95 purchase as the Diamond member. | The purchase completes. |
| 2 | Read the member's balance. | It holds 11 points. A balance of 11 confirms a single floor; 10 means the floor was applied at each step. |

**Properties:**

- **Severity:** major
- **Priority:** medium
- **Status:** actual
- **Behaviour:** positive
- **Type:** functional
- **Layer:** unit
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-06

### loyalty-TC-03: Points recorded for a user who never joined create a member record that reads as not joined

**Description:** Proves having activity recorded and joining are separate acts:
the record appears on first activity and holds the points, while the member is
still reported as not joined.

**Preconditions:**

- The user has no member record, having never joined and never had anything
  recorded.
- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The user starts on Platinum, which earns 1×.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 500 |
| Points expected | 50 |
| Join date | none |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record a HKD 500 purchase for the user. | A member record exists for that user identity. |
| 2 | Read the member's balance. | It holds 50 points. |
| 3 | Read whether the member has joined. | The member is reported as not joined. |

**Properties:**

- **Severity:** major
- **Priority:** medium
- **Status:** actual
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-01

### loyalty-TC-04: Member's balance counts only credits unspent and unexpired at the instant it is asked for

**Description:** Proves the balance is derived from the ledger at an instant —
spent credits and expired credits are both excluded, and an expired credit stops
counting the moment its window ends rather than when a scheduled pass gets to it.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend,
  with points expiring twelve months after the activity that earned them.
- The member holds Platinum, which earns 1×.
- The member holds the three credits in the test data and nothing else.
- No scheduled expiry pass has run since the earliest credit's window ended.

**Test data:**

| Credit | Earned from | State | Counts toward the balance |
| --- | --- | --- | --- |
| A — 100 points | a HKD 1,000 purchase dated thirteen months ago | expired | no |
| B — 50 points | a HKD 500 purchase dated one month ago | fully spent on a redemption | no |
| C — 40 points | a HKD 400 purchase dated one month ago | unspent and unexpired | yes |
| Balance expected | | | 40 points |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Read the member's balance. | It holds 40 points — credit C alone. |
| 2 | Read the member's balance again at an instant one second before credit C's expiry, with no scheduled expiry pass having run. | It still holds 40 points. |
| 3 | Read the member's balance again at an instant one second after credit C's expiry, with no scheduled expiry pass having run. | It holds 0 points — credit C stopped counting at its expiry instant. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** actual
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-03, loyalty-SC-12

### loyalty-TC-05: Member's debit records which credits it drew from and how much it took from each

**Description:** Proves a debit is fully accounted: the ledger names every
credit it consumed with the amount taken, and those amounts add up to exactly
the debit — no point leaves the ledger unattributed.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Platinum, which earns 1×.
- The member holds the two credits in the test data and nothing else.

**Test data:**

| Field | Value |
| --- | --- |
| Credit A | 60 points, from a HKD 600 purchase |
| Credit B | 50 points, from a HKD 500 purchase |
| Debit | 80 points |
| Total recorded against the debit | 80 points |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record an 80-point debit for the member. | The debit is recorded. |
| 2 | Read what the debit drew from. | It names the credits it took from and how much it took from each. |
| 3 | Add up the amounts recorded against the debit. | They sum to exactly 80 points. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** actual
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-05

### loyalty-TC-06: Backdated spend expires and counts toward tier from its own date, priced at the tier held when processed

**Description:** Proves a date in the past governs expiry and tier contribution
while the multiplier is the one the member holds at the moment the spend is
processed — the two dates are deliberately different.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend,
  with points expiring twelve months after the activity that earned them.
- The member holds Diamond, which earns 1.2×, at the moment the spend is
  processed.
- The member has no other recorded activity.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 1,000 |
| Date carried by the spend | three months before today |
| Multiplier applied | 1.2×, the tier held when processed |
| Points expected | 120 |
| Expiry expected | twelve months after the date the spend carries |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record the HKD 1,000 spend carrying a date three months in the past. | It is accepted and 120 points are granted, priced at the 1.2× multiplier the member holds now. |
| 2 | Read when the resulting credit expires. | Twelve months after the date the spend carries, not twelve months from today. |
| 3 | Read the tier contribution of that spend. | It falls on the date the spend carries. |

**Properties:**

- **Severity:** major
- **Priority:** medium
- **Status:** actual
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-08

### loyalty-TC-07: Member's mutation repeated under the key it already used answers once and records nothing again

**Description:** Proves retry safety on the happy path: the caller repeating a
mutation under its own key gets the first answer back, and the ledger gains
nothing.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Platinum, which earns 1×.
- The member has no other recorded activity.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 1,000 |
| Retry key | the key the first call supplied |
| Input on the repeat | identical to the first call |
| Points expected in total | 100 |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record the HKD 1,000 purchase under the retry key. | It is accepted and 100 points are granted. |
| 2 | Repeat the same call under the same key with identical input. | The original answer is returned. |
| 3 | Read the member's ledger entries. | No new entry was recorded, and the balance is still 100 points. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** deprecated
- **Retired:** Mis-scoped: SC-10 is a property over all mutations; one hand-written instance gives false confidence. Covered concretely by loyalty-TC-08.
- **Behaviour:** positive
- **Type:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-10

### loyalty-TC-08: The same money event delivered to the programme twice grants its points once

**Description:** Proves a redelivery from the selling product is free. The
programme is the party that must not double-grant, whatever the sender does.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Platinum, which earns 1×.
- The member has no other recorded activity.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 1,000 |
| Deliveries of the same money event | 2 |
| Points expected in total | 100 |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Deliver the money event for the completed HKD 1,000 purchase to the programme. | It is accepted and 100 points are granted. |
| 2 | Deliver the same money event again. | No further points are granted. |
| 3 | Read the member's balance. | It holds 100 points. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** actual
- **Behaviour:** positive
- **Type:** integration
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-40

### loyalty-TC-09: A purchase reaching completed by any path records exactly one money event

**Description:** Proves the money event's identity is the purchase, not the path
that noticed it. Each row drives the same purchase to completed a different way
and must leave one event behind, carrying an identity stable across retries.

**Preconditions:**

- One purchase exists that has not yet reached its completed state.
- The programme is reachable.
- No money event has been recorded for that purchase.

**Test data:**

| Path to completed | Money events recorded |
| --- | --- |
| A payment notification | exactly one |
| A scheduled reconciliation | exactly one |
| A read that repairs it | exactly one |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Drive the purchase to its completed state by the path in the row. | The purchase reaches its completed state. |
| 2 | Read the money events recorded for that purchase. | Exactly one is recorded. |
| 3 | Read the identity carried by that money event, then retry the same path. | The identity is unchanged across the retry, and still exactly one event is recorded. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** integration
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-41

### loyalty-TC-10: Purchase completed while the programme is unreachable earns its points once the programme returns

**Description:** Proves selling does not depend on the programme: the buyer's
purchase completes during the outage, and the points arrive afterwards without a
person re-entering anything.

**Preconditions:**

- The programme is unreachable from the selling product.
- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Platinum, which earns 1×, and has no other recorded activity.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 1,000 |
| Programme state at the moment of sale | unreachable |
| Points expected once reachable | 100 |
| Re-entry by a person | none |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Complete the HKD 1,000 purchase while the programme is unreachable. | The purchase completes for the buyer. |
| 2 | Make the programme reachable again and take no further action. | The points are granted without anyone re-entering them. |
| 3 | Read the member's balance. | It holds 100 points. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** integration
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** manual, automation
- **Trace:** loyalty-SC-39

### loyalty-TC-11: A scheduled expiry pass that stops early reports what it missed and the next pass covers it

**Description:** Proves the expiry pass converges without carrying state between
runs: an interrupted pass says how many members it did not reach, and the next
pass reaches them.

**Preconditions:**

- More members have expiring credits than one pass will reach before it stops.
- No state is carried from any previous pass.

**Test data:**

| Field | Value |
| --- | --- |
| Members with credits due to expire | more than the interrupted pass reaches |
| Members the first pass reaches | fewer than all of them |
| State carried between passes | none |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Run a scheduled expiry pass and stop it before it reaches every member. | The pass reports how many members it did not reach. |
| 2 | Run the next scheduled expiry pass with no state carried over from the first. | It covers the members the first pass did not reach. |

**Properties:**

- **Severity:** normal
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-13

### loyalty-TC-12: Two partial refunds of one purchase each claw back only what their own amount earned

**Description:** Proves a refund is priced against its own share of the money,
not the whole purchase — a second partial refund later must not re-claw what the
first already took.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Platinum, which earns 1×.
- The member has no recorded activity other than the purchase in the test data,
  and has spent none of the points it earned.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 1,000 |
| Points earned | 100 |
| First refund | HKD 300 |
| Points clawed back by the first refund | 30 |
| Second refund | HKD 200 |
| Points clawed back by the second refund | 20 |
| Balance expected at the end | 50 points |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record the HKD 300 refund against the purchase. | 30 points are clawed back. |
| 2 | Record the HKD 200 refund against the same purchase. | 20 points are clawed back. |
| 3 | Read the member's balance. | It holds 50 points. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** destructive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-42

### loyalty-TC-13: A refund split into two parts claws back the same total as one refund of the combined amount

**Description:** Proves splitting a refund changes nothing about the total
removed. The case runs both shapes against identical starting states and
compares the totals.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- Two members each hold Platinum, which earns 1×.
- Each member has one recorded purchase of HKD 1,000 and nothing else, and has
  spent none of the points it earned.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount, each member | HKD 1,000 |
| Points earned, each member | 100 |
| First member's refund | HKD 1,000 in one part |
| Second member's refund | HKD 400 then HKD 600 |
| Total clawed back, each member | the same number of points |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record the single HKD 1,000 refund for the first member. | The claw-back is recorded. |
| 2 | Record the HKD 400 refund for the second member. | A claw-back is recorded for that part. |
| 3 | Record the HKD 600 refund for the second member. | A claw-back is recorded for that part. |
| 4 | Compare the total clawed back from the second member with the total clawed back from the first. | The two totals are equal. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** destructive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-35

### loyalty-TC-14: A claw-back reduces the tier contribution of the earning it came from by the same amount

**Description:** Proves returned money loses its standing as well as its points:
the tier contribution shrinks by exactly what was clawed back, and it still
leaves the qualifying window when the original earning does.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Platinum, which earns 1×.
- The member has one recorded purchase of HKD 1,000 and nothing else, and has
  spent none of the points it earned.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 1,000 |
| Points earned | 100 |
| Tier contribution before the refund | 100 qualifying points |
| Refund | HKD 1,000 |
| Points clawed back | 100 |
| Tier contribution after the refund | reduced by 100 |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record the HKD 1,000 refund against the purchase. | 100 points are clawed back. |
| 2 | Read the tier contribution of the earning the claw-back came from. | It is reduced by 100 — the same amount that was clawed back. |
| 3 | Read when that contribution leaves the qualifying window. | At the same time the earning it came from does. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** destructive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-38

### loyalty-TC-15: A debit draws only on credits with points remaining and no recorded activity drives the balance below zero

**Description:** Proves the floor under a balance. A debit larger than what the
member holds cannot borrow against exhausted credits, and no sequence of
recorded activity leaves the member owing points.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Platinum, which earns 1×.
- The member holds the credits in the test data and nothing else.

**Test data:**

| Field | Value |
| --- | --- |
| Credit A | 60 points, from a HKD 600 purchase, fully spent |
| Credit B | 40 points, from a HKD 400 purchase, unspent |
| Debit attempted | 100 points |
| Lowest balance permitted | 0 points |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record a 100-point debit for the member. | It draws only on credits that have points remaining — credit A, which is exhausted, is not drawn on. |
| 2 | Read the member's balance. | It is not below zero. |
| 3 | Record further debits against the member. | No sequence of recorded activity drives the balance below zero. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-04

### loyalty-TC-16: A spend in a currency the programme does not run in is refused and writes no ledger entry

**Description:** Proves foreign money is refused rather than converted, that the
refusal names both currencies, and that the ledger is untouched afterwards.

**Preconditions:**

- The programme runs in HKD.
- The member exists and has no other recorded activity.

**Test data:**

| Field | Value |
| --- | --- |
| Programme currency | HKD |
| Spend currency | a currency the programme does not run in |
| Ledger entries expected | none |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record a spend in a currency the programme does not run in. | It is refused as invalid, naming both the programme's currency and the spend's. |
| 2 | Read the member's ledger entries. | No entry was written. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-07

### loyalty-TC-17: A spend dated more than five minutes ahead of now is refused

**Description:** Proves the future-dating limit at its stated edge: a spend
carrying a date beyond five minutes ahead of now is refused as invalid.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member exists and has no other recorded activity.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 1,000 |
| Date carried by the spend | more than five minutes ahead of now |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record the spend carrying a date more than five minutes ahead of now. | It is refused as invalid. |

**Properties:**

- **Severity:** major
- **Priority:** medium
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-09

### loyalty-TC-18: A retry key reused with different input is refused as a conflict

**Description:** Proves a key is bound to the input it first carried. Answering a
changed request from the first call's record would grant or withhold points on
the wrong facts, so the second call is refused instead.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Platinum, which earns 1×.
- A mutation has already been recorded under the retry key in the test data.

**Test data:**

| Field | Value |
| --- | --- |
| First call | a HKD 1,000 purchase under the retry key |
| Second call | a HKD 2,000 purchase under the same retry key |
| Retry key | identical across both calls |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Repeat the call under the same retry key with input that differs from the first. | The call is refused as a conflict. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-11

### loyalty-TC-19: A refund larger than what the member still holds from that money records the shortfall and leaves the balance at zero

**Description:** Proves a member who already spent the points is not driven
negative by a refund. The part that cannot be taken is recorded and counted by
its cause rather than silently dropped.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Platinum, which earns 1×.
- The member has one recorded purchase of HKD 1,000 and has already spent every
  point it earned.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 1,000 |
| Points earned | 100 |
| Points still held from that money | 0 |
| Refund | HKD 1,000 |
| Shortfall expected | 100 points |
| Balance expected | 0 points |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record the HKD 1,000 refund against the purchase. | The refund is accepted and the shortfall is recorded. |
| 2 | Read the shortfall counts. | The shortfall is counted by its cause. |
| 3 | Read the member's balance. | It is 0 points and has not gone below zero. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** destructive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-36

### loyalty-TC-20: A refund naming money that has not yet earned anything is refused, and a later retry claws back once the earning lands

**Description:** Proves a refund arriving ahead of its earning is not lost. It is
refused as not found with nothing recorded, and the same refund retried after the
earning lands takes its points.

**Preconditions:**

- The programme runs in HKD, granting one point per HKD 10 of qualifying spend.
- The member holds Platinum, which earns 1×.
- The purchase the refund names has not yet earned anything in the programme.

**Test data:**

| Field | Value |
| --- | --- |
| Purchase amount | HKD 1,000 |
| Points earned at the moment of the first refund attempt | none |
| Refund | HKD 1,000 |
| Points clawed back on the retry | 100 |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record the HKD 1,000 refund while its purchase has earned nothing. | It is refused as not found. |
| 2 | Read the member's ledger entries. | Nothing was recorded. |
| 3 | Let the earning land, then retry the same refund. | It claws back the 100 points the money earned. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-37

### loyalty-TC-21: A product selling in a currency the programme does not run in fails to start

**Description:** Proves the currency mismatch is caught by the deploy rather than
by the first member who buys something, and that the failure names both
currencies.

**Preconditions:**

- The programme runs in HKD.
- The selling product is configured to sell in a currency the programme does not
  run in.

**Test data:**

| Field | Value |
| --- | --- |
| Programme currency | HKD |
| Product's selling currency | a currency the programme does not run in |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Start the product with that selling currency. | The product fails to start, naming both currencies. |

**Properties:**

- **Severity:** blocker
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** unit
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-43

### loyalty-TC-22: A recording the programme refuses is logged and counted by reason, never reported as success

**Description:** Proves a refusal from the programme reaches the operators who
have to act on it. A refusal reported as success would leave points missing with
nothing to find them by.

**Preconditions:**

- The selling product is delivering a money event to the programme.
- The programme will refuse that recording.

**Test data:**

| Field | Value |
| --- | --- |
| Recordings delivered | 1 |
| Programme answer | a refusal |
| Reasons counted | the refusal's own reason |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Deliver the recording the programme will refuse. | The programme refuses it. |
| 2 | Read the selling product's log. | The refusal is logged. |
| 3 | Read the counts the selling product keeps. | The refusal is counted by its reason, and it is not reported as a success. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** integration
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-44

## loyalty-US-02: Member advances through the tier ladder

**As a** member,
**I want** my tier derived from what I earned and kept when those points
expire,
**so that** the rate I earn at reflects the standing I reached rather than what
my balance happens to be today.

**Covers:**

- `loyalty-SC-14` — Earned tier holds after points expire
- `loyalty-SC-15` — An invitation lapse is observed, not scheduled
- `loyalty-SC-16` — Tier history records each move
- `loyalty-SC-17` — Two tiers share an identifier
- `loyalty-SC-18` — No entry tier, or more than one
- `loyalty-SC-19` — The entry tier is not the lowest rung
- `loyalty-SC-20` — A higher tier is cheaper than the one below it
- `loyalty-SC-21` — Earned tiers measure over different windows
- `loyalty-SC-22` — The programme names a zone that does not exist
- `loyalty-SC-24` — The second tier is reached by spending
- `loyalty-SC-25` — The top tier cannot be bought

### loyalty-TC-23: Member reaching 500 qualifying points inside the rolling twelve months holds Diamond

**Description:** Proves the one tier a member can reach by spending is reached at
its stated threshold. If this fails, the ladder does nothing for a member and the
rest of the journey has no standing to test.

**Preconditions:**

- The programme grants one point per HKD 10 of qualifying spend.
- The member starts on Platinum, which earns 1×.
- The member has no recorded activity older than the rolling twelve months.

**Test data:**

| Field | Value |
| --- | --- |
| Qualifying points inside the rolling twelve months | 500 |
| Purchases that reach it | HKD 5,000 of qualifying spend at 1× |
| Tier expected | Diamond |
| Diamond multiplier | 1.2× |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record qualifying spend until the member's qualifying points inside the rolling twelve months reach 500. | The spend is accepted. |
| 2 | Read the member's tier. | The member holds Diamond. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** smoke
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-24

### loyalty-TC-24: Member keeps the tier they earned after the points that qualified them expire

**Description:** Proves a tier reached by earning ratchets up. Expiry takes the
points out of the balance without taking the standing they bought.

**Preconditions:**

- The programme grants one point per HKD 10 of qualifying spend, with points
  expiring twelve months after the activity that earned them.
- The member reached Diamond on 500 qualifying points and has no other activity.

**Test data:**

| Field | Value |
| --- | --- |
| Qualifying points that won the tier | 500 |
| Tier held before expiry | Diamond |
| Tier expected after those points expire | Diamond |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Let the points that qualified the member for Diamond pass their expiry. | The points stop counting toward the balance. |
| 2 | Read the member's tier. | The member still holds Diamond. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-14

### loyalty-TC-25: Each change of a member's effective tier writes one history entry naming what caused it

**Description:** Proves a tier move is recorded once, with its cause, so a
member's standing can be explained later without re-deriving it.

**Preconditions:**

- The programme grants one point per HKD 10 of qualifying spend.
- The member starts on Platinum, which earns 1×, and has no recorded activity.

**Test data:**

| Field | Value |
| --- | --- |
| Tier before | Platinum |
| Tier after | Diamond |
| Qualifying points recorded | 500 inside the rolling twelve months |
| History entries expected for the move | 1 |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record enough qualifying spend to move the member from Platinum to Diamond. | The member's effective tier changes to Diamond. |
| 2 | Read the member's tier history. | One entry records the move and what caused it. |

**Properties:**

- **Severity:** normal
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-16

### loyalty-TC-26: A dated invitation that passes its end stops the member holding that tier from that instant

**Description:** Proves a lapse is observed rather than scheduled: the member
stops holding the invited tier the instant the grant's end passes, and the drop
is written the next time that member is evaluated.

**Preconditions:**

- The member holds Black through a dated invitation whose end is in the test
  data.
- The member has not earned their way to any tier above Platinum.
- No evaluation of this member has run since the grant's end passed.

**Test data:**

| Field | Value |
| --- | --- |
| Tier granted | Black |
| Grant end | a date the case lets pass |
| Tier expected after that instant | not Black |
| Tier-history entry for the drop | written at the next evaluation |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Let the grant's end date pass. | The grant is no longer live. |
| 2 | Read the member's tier. | The member no longer holds Black, from the instant the grant ended. |
| 3 | Read the member's tier history. | The drop is recorded at the evaluation that read the member. |

**Properties:**

- **Severity:** major
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-15

### loyalty-TC-27: A member never reaches the top tier by earning, however many points they earn

**Description:** Proves the invitation-only tier cannot be bought. Earning is the
only lever a member controls, and it must never reach Black on its own.

**Preconditions:**

- The programme grants one point per HKD 10 of qualifying spend.
- The member holds no invitation to any tier.
- Black is invitation only.

**Test data:**

| Field | Value |
| --- | --- |
| Qualifying points earned | any number, including far beyond the Diamond threshold of 500 |
| Invitations held | none |
| Tier expected | never Black |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Record qualifying spend well beyond the 500 points that reach Diamond. | The spend is accepted and the points are granted. |
| 2 | Read the member's tier. | The member has not reached Black by earning alone. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-25

### loyalty-TC-28: A ladder whose higher tier asks no more qualifying points than the tier beneath it stops the product from starting

**Description:** Proves an inverted or level ladder is caught at boot and names
both amounts, so no member can hold a tier they skipped past.

**Preconditions:**

- The product is configured with the ladder in the test data.
- The product is not running.

**Test data:**

| Field | Value |
| --- | --- |
| Lower earned tier threshold | a number of qualifying points |
| Higher earned tier threshold | no more than the tier beneath it asks |
| Expected outcome | the product fails to start |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Start the product with that ladder. | The product fails to start, naming both amounts. |
| 2 | Read which tier any member holds under that configuration. | No member holds a tier they skipped past, because the product did not start. |

**Properties:**

- **Severity:** blocker
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** unit
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-20

### loyalty-TC-29: An ambiguous ladder or an unreal time zone stops the product from starting

**Description:** Proves each remaining shape of ambiguity is refused at boot
rather than when a member is evaluated, and that the failure says which fault it
found. One row per fault, each started on its own.

**Preconditions:**

- The product is not running.
- Every other part of the programme's configuration is valid, so the row under
  test is the only fault.

**Test data:**

| Configuration fault | The product |
| --- | --- |
| A ladder repeating a tier identifier | fails to start, naming the identifier |
| A ladder with other than exactly one tier every member starts on | fails to start, saying how many it found |
| A ladder whose starting tier is not first in the ladder | fails to start |
| Two earned tiers counting qualifying points over different periods | fails to start, naming the periods |
| A programme time zone that is not a real IANA zone | fails to start, naming it |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Start the product with the configuration in the row. | The product fails to start with the outcome the row states. |

**Properties:**

- **Severity:** blocker
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** unit
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-17, loyalty-SC-18, loyalty-SC-19, loyalty-SC-21, loyalty-SC-22

## loyalty-US-03: Member redeems points for a reward

**As a** member,
**I want** to spend my points on a reward at the price it carried when I
redeemed it,
**so that** a later reprice, a sell-out or a reversal never changes what that
redemption cost me.

**Covers:**

- `loyalty-SC-29` — Repricing does not rewrite history
- `loyalty-SC-30` — Stock is not oversold
- `loyalty-SC-31` — A reward outside its window cannot be redeemed
- `loyalty-SC-32` — The public menu shows only what a member can buy
- `loyalty-SC-33` — Restored points keep their original expiry
- `loyalty-SC-34` — An unlimited reward returns no stock
- `loyalty-SC-63` — A double redemption costs one

### loyalty-TC-30: Member's redemption still records the price they paid after the reward is repriced

**Description:** Proves a redemption remembers its own cost. Repricing the reward
afterwards must leave the earlier redemption reading exactly what the member paid
at the time.

**Preconditions:**

- A reward is on the menu at the point cost in the test data.
- The member holds at least that many unspent, unexpired points.
- The member has made no other redemption.

**Test data:**

| Field | Value |
| --- | --- |
| Reward cost when redeemed | the cost the reward carried at that moment |
| Reward cost after repricing | a different cost |
| Cost recorded on the earlier redemption | the cost the member paid |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Redeem the reward as the member. | The redemption is recorded at the cost the reward carries now. |
| 2 | Change the reward's point cost to a different number. | The reward's menu price changes. |
| 3 | Read the member's earlier redemption. | It still records the price the member paid. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** smoke
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-29

### loyalty-TC-31: The reward menu read without signing in lists only live, unarchived rewards and discloses no stock or edit history

**Description:** Proves the public menu is a shopping list, not an operating
record: nothing archived or out of its window appears, and stock counts and edit
history stay out of it.

**Preconditions:**

- The menu holds a live unarchived reward, an archived reward, and a reward
  outside its live window.
- At least one of those rewards is limited in stock.
- The reader is not signed in.

**Test data:**

| Reward on the menu | Appears to a reader who is not signed in |
| --- | --- |
| Live and unarchived | yes |
| Archived | no |
| Outside its live window | no |
| Stock counts | never |
| Edit history | never |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Read the reward menu without signing in. | It lists only the live, unarchived rewards. |
| 2 | Inspect what the menu discloses about each listed reward. | Neither stock counts nor edit history are disclosed. |

**Properties:**

- **Severity:** major
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** security
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-32

### loyalty-TC-32: Member submitting the same redemption twice, with or without a reload between, is charged once

**Description:** Proves an accidental double submit costs nothing. A reload
between the two attempts must not turn one redemption into two.

**Preconditions:**

- A reward is live on the menu at the point cost in the test data.
- The member holds enough unspent, unexpired points for one redemption of it.
- The member has made no other redemption.

**Test data:**

| Field | Value |
| --- | --- |
| Submissions of the same redemption | 2 |
| Reload between them | once with, once without |
| Redemptions expected | exactly 1 |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Submit the redemption as the member. | The redemption is recorded. |
| 2 | Submit the same redemption again without reloading. | No second redemption is recorded. |
| 3 | Reload the surface and submit the same redemption again. | No second redemption is recorded. |
| 4 | Read the member's redemptions. | Exactly one is recorded. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** regression
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-63

### loyalty-TC-33: Reversing a redemption returns each credit carrying the expiry the credit it came from would have had

**Description:** Proves a reversal restores points without extending their life.
Each restored credit is its own entry and expires when the credit it was taken
from would have.

**Preconditions:**

- The programme expires points twelve months after the activity that earned
  them.
- The member's redemption consumed credits earned on different dates, so the
  restored credits carry different expiries.
- The redemption has not been reversed.

**Test data:**

| Field | Value |
| --- | --- |
| Credits the redemption consumed | credits earned on different dates |
| Entries expected on reversal | one per consumed credit |
| Expiry of each restored credit | the expiry the credit it came from would have had |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Reverse the redemption. | Each consumed credit is returned as its own entry. |
| 2 | Read the expiry of each restored credit. | Each expires when the credit it came from would have, not on a fresh clock. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** destructive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-33

### loyalty-TC-34: Reversing a redemption of an unlimited reward returns no stock

**Description:** Proves stock comes back only when a unit was actually consumed.
An unlimited reward never held a unit, so a reversal must return none.

**Preconditions:**

- A reward with unlimited stock is on the menu.
- The member has redeemed that reward and the redemption has not been reversed.

**Test data:**

| Field | Value |
| --- | --- |
| Reward stock | unlimited |
| Units consumed by the redemption | none |
| Stock returned on reversal | none |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Reverse the redemption of the unlimited reward. | The reversal is recorded. |
| 2 | Read the reward's stock. | No stock was returned. |

**Properties:**

- **Severity:** normal
- **Priority:** medium
- **Status:** draft
- **Behaviour:** destructive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-34

### loyalty-TC-35: Two members redeeming the last unit of a limited reward at once leave exactly one succeeding

**Description:** Proves a limited reward is never oversold under a race. One
member gets the unit and the other is told it is out of stock.

**Preconditions:**

- A limited reward is live on the menu with exactly one unit left.
- Two members each hold enough unspent, unexpired points to redeem it.
- Neither member has redeemed it before.

**Test data:**

| Field | Value |
| --- | --- |
| Units left | 1 |
| Members redeeming | 2, at the same moment |
| Redemptions expected to succeed | 1 |
| Redemptions expected to be refused | 1, as out of stock |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Have both members redeem the last unit at the same moment. | Exactly one redemption succeeds. |
| 2 | Read the answer the other member received. | It is refused as out of stock. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-30

### loyalty-TC-36: A reward that is archived or outside its live window cannot be redeemed

**Description:** Proves the menu's lifecycle is enforced at redemption, not only
in what the menu shows. Each row is a reward a member must not be able to buy.

**Preconditions:**

- The member holds enough unspent, unexpired points for each reward in the test
  data.
- The member is signed in.

**Test data:**

| Reward state | Redemption |
| --- | --- |
| Archived | refused |
| Outside its live window | refused |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Redeem the reward in the row as the member. | The redemption is refused. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-31

## loyalty-US-04: Member runs their membership from one surface

**As a** member,
**I want** my tier, balance, progress and expiring points on one surface, in
the programme's own dates,
**so that** I can join and read my own activity without being shown the
operating record behind it.

**Covers:**

- `loyalty-SC-02` — Joining is idempotent
- `loyalty-SC-59` — An operator's reason stays out of a member's view
- `loyalty-SC-60` — Retry keys and internal pricing stay out of a member's view
- `loyalty-SC-61` — A retired reward is still readable in history
- `loyalty-SC-62` — A member who never joined is invited to
- `loyalty-SC-64` — Dates read in the programme's time zone

### loyalty-TC-37: Member with recorded activity but no join date is shown how to join, alongside the points they already hold

**Description:** Proves the surface opens for someone the programme already
holds points for. Hiding the points until they join, or hiding the invitation to
join, both fail this case.

**Preconditions:**

- The programme grants one point per HKD 10 of qualifying spend.
- The member has recorded activity and no join date.
- The member is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| Recorded activity | a HKD 1,000 purchase |
| Points held | 100 |
| Join date | none |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open the membership surface as that member. | The surface shows how to join. |
| 2 | Read the points on that surface. | The 100 points the member already holds are shown. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** smoke
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** manual, automation
- **Trace:** loyalty-SC-62

### loyalty-TC-38: Member joining more than once keeps the first join date

**Description:** Proves joining is idempotent: a second attempt, however it is
made, leaves the record exactly as the first left it.

**Preconditions:**

- The member has recorded activity and no join date.
- The member is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| Join attempts | 2 |
| Join date expected | the date of the first attempt |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Join as that member. | The member is recorded as joined, with today's date. |
| 2 | Join again as the same member. | Nothing changes. |
| 3 | Read the member's join date. | It is the date of the first join. |

**Properties:**

- **Severity:** normal
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-02

### loyalty-TC-39: A date the programme computed reads the same in the programme's time zone wherever the member is

**Description:** Proves the programme's own dates do not shift under the reader.
A member abroad must read the same expiry date as a member at home.

**Preconditions:**

- The programme runs on Asia/Hong_Kong time.
- The member has at least one credit with a computed expiry date on the surface.
- The member is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| Programme time zone | Asia/Hong_Kong |
| Reader's own time zone | two different zones, one either side of the programme's |
| Date expected | the same in both readings |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Read a date the programme computed with the reader in the first time zone. | The date reads in the programme's time zone. |
| 2 | Read the same date with the reader in the second time zone. | It reads the same as in step 1. |

**Properties:**

- **Severity:** normal
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** compatibility
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-64

### loyalty-TC-40: Member's activity entry for a reward that has since been archived still names that reward

**Description:** Proves history survives the menu. Archiving a reward must not
turn a member's own past entry into something they cannot read.

**Preconditions:**

- The member redeemed a reward that is now archived.
- The member is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| Reward state at redemption | live |
| Reward state now | archived |
| Entry expected | still names the reward |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open the member's own activity. | The activity list renders. |
| 2 | Read the entry for the archived reward. | It still names that reward. |

**Properties:**

- **Severity:** normal
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-61

### loyalty-TC-41: An operator's written reason for a correction never appears in what the member can read

**Description:** Proves the operator's own words stay on the operating record.
The reason is written for auditors, and disclosing it to the member is a leak.

**Preconditions:**

- An operator has corrected the member's balance with a written reason.
- The member is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| Correction | an operator adjustment with a written reason |
| Reason expected in the member's view | nowhere |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open the member's own membership surface and activity. | Both render, and the corrected balance is shown. |
| 2 | Search everything the member can read for the operator's written reason. | It appears nowhere. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** security
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-59

### loyalty-TC-42: A member's activity carries no retry key, request record or the pricing arithmetic behind an entry

**Description:** Proves the member's view is theirs, not the operating record.
Retry keys, request records and the tier and money arithmetic an entry was priced
from all stay out of it.

**Preconditions:**

- The member has activity recorded through a mutation that carried a retry key.
- At least one entry was priced from a money amount and a tier multiplier.
- The member is signed in.

**Test data:**

| What must not appear | In the member's activity |
| --- | --- |
| A retry key | never |
| A request record | never |
| The tier and money arithmetic an entry was priced from | never |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open the member's own activity. | The activity list renders, each entry naming what it was for. |
| 2 | Inspect every entry for the material in the test data. | No entry carries a retry key, a request record, or the tier and money arithmetic it was priced from. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** security
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-60

## loyalty-US-05: Operator runs the programme from one console

**As an** operator,
**I want** to find a member and act on their loyalty under my own permissions,
**so that** I can correct, reward and invite without holding powers I was not
given, and every change I made stays provable.

**Covers:**

- `loyalty-SC-26` — A grant names an unknown tier
- `loyalty-SC-27` — A grant names the entry tier
- `loyalty-SC-28` — Live grants can be found
- `loyalty-SC-45` — A permission is required per action
- `loyalty-SC-46` — The record survives an attempt to rewrite it
- `loyalty-SC-47` — An action with no place to record it does not run
- `loyalty-SC-48` — A correction does not move a member up
- `loyalty-SC-49` — A campaign grant moves a member up
- `loyalty-SC-50` — Sections match permissions
- `loyalty-SC-51` — A missing second factor opens the gate
- `loyalty-SC-52` — A stale console reports what broke
- `loyalty-SC-53` — A member can be found again later
- `loyalty-SC-54` — A loyalty permission alone shows no identities
- `loyalty-SC-55` — A service connection is not an authorisation
- `loyalty-SC-56` — Identity is never served from a shared cache
- `loyalty-SC-57` — An identity read is recorded without copying the identities
- `loyalty-SC-58` — A failed identity read does not degrade to blanks

### loyalty-TC-43: Operator holding only the loyalty read permission finds members and is shown no other section

**Description:** Proves the console shows what the operator may actually do. A
read-only operator gets member search and nothing that moves points, grants
invitations, edits rewards or opens the operator log.

**Preconditions:**

- The operator holds the loyalty read permission and no other loyalty
  permission.
- The operator's session is resolved and, where the environment enforces it,
  carries a verified second factor.
- At least one member exists to find.

**Test data:**

| Console section | Shown to an operator holding only the loyalty read permission |
| --- | --- |
| Find and read members | yes |
| Point movement | no |
| Invitations | no |
| Rewards | no |
| Operator log | no |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open the console as that operator. | The console renders. |
| 2 | Find a member and open them. | The member's loyalty state is shown. |
| 3 | Read which sections the console offers. | No section offering point movement, invitations, rewards or the operator log is shown. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** smoke
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** manual, automation
- **Trace:** loyalty-SC-50

### loyalty-TC-44: Operator's correction gives spendable points and leaves progress toward the next tier unchanged

**Description:** Proves a correction is a balance fix, not a reward. The member
can spend what the operator added, and their standing does not move because of
it.

**Preconditions:**

- The operator holds the permission to move points.
- The operator's session is resolved and, where the environment enforces it,
  carries a verified second factor.
- The member's progress toward the next tier is known before the correction.

**Test data:**

| Field | Value |
| --- | --- |
| Correction | a number of points, with a written reason |
| Points spendable afterwards | the corrected amount |
| Progress toward the next tier | unchanged |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Correct the member's balance with a written reason. | The correction is recorded. |
| 2 | Read the member's balance and spend against it. | The points are spendable. |
| 3 | Read the member's progress toward the next tier. | It is unchanged. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-48

### loyalty-TC-45: Operator's campaign grant counts toward the member's next tier

**Description:** Proves the other half of the pair: campaign or sign-up points
are a reward, so they push the member up the ladder as earned points do.

**Preconditions:**

- The operator holds the permission to move points.
- The operator's session is resolved and, where the environment enforces it,
  carries a verified second factor.
- The member's progress toward the next tier is known before the grant.

**Test data:**

| Field | Value |
| --- | --- |
| Grant | campaign or sign-up points, with a written reason |
| Progress toward the next tier | increased by the granted points |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Grant the member campaign points with a written reason. | The grant is recorded. |
| 2 | Read the member's progress toward the next tier. | The granted points count toward it. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-49

### loyalty-TC-46: Operator lists invitations and sees every live grant with its member, tier, reason and end date

**Description:** Proves a grant can be found again by someone who did not issue
it — the precondition for revoking one.

**Preconditions:**

- The operator holds the permission to grant invitations.
- The operator's session is resolved and, where the environment enforces it,
  carries a verified second factor.
- At least one live grant exists, carrying a reason and an end date.

**Test data:**

| Field | Value |
| --- | --- |
| Live grants | at least one, with a reason and an end date |
| Listed per grant | member, tier, reason and end date |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | List invitations as that operator. | Every live grant is listed. |
| 2 | Read one listed grant. | It carries its member, tier, reason and end date. |

**Properties:**

- **Severity:** major
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-28

### loyalty-TC-47: Operator whose session has no verified second factor is taken to verify and the action then completes

**Description:** Proves a missing second factor is a gate, not a refusal. The
operator their role already allows is sent to verify and lands back on the action
they asked for.

**Preconditions:**

- The environment enforces a second factor.
- The operator's role allows the action they will attempt.
- The operator's session carries no verified second factor.

**Test data:**

| Field | Value |
| --- | --- |
| Operator's role | allows the attempted action |
| Second factor on the session | none |
| Outcome expected | the action completes after verifying |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Attempt the action in the console. | The console takes the operator to verify, rather than reporting a refusal. |
| 2 | Verify the second factor. | Verification is accepted for that session. |
| 3 | Complete the action. | The action completes. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** usability
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** manual, automation
- **Trace:** loyalty-SC-51

### loyalty-TC-48: A member view's address opens the same member for whoever it is shared with

**Description:** Proves a member view can be handed to a colleague. The address
names the member, so the recipient does not have to search for them again.

**Preconditions:**

- Two operators each hold the loyalty read permission.
- Each operator's session is resolved and, where the environment enforces it,
  carries a verified second factor.
- The member being opened exists.

**Test data:**

| Field | Value |
| --- | --- |
| Shared item | the address of the member view |
| Member expected for the recipient | the same member |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open a member in the console as the first operator and take the address of that view. | The member's view renders and its address can be taken. |
| 2 | Open that address as the second operator. | The same member opens. |

**Properties:**

- **Severity:** normal
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** usability
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-53

### loyalty-TC-49: A response carrying identity is marked for that caller alone and never stored in a shared cache

**Description:** Proves identity does not leak sideways through caching. The
response is marked as belonging to its caller, and no shared cache keeps a copy
another caller could be served.

**Preconditions:**

- The operator holds the identity permission and a verified second factor on
  their session.
- The console is reading member identities.

**Test data:**

| Field | Value |
| --- | --- |
| Response | one carrying identity |
| Marking expected | belongs to that caller alone |
| Copies in a shared cache | none |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Read member identities as that operator. | A response carrying identity is returned. |
| 2 | Read how that response is marked. | It is marked as belonging to that caller alone. |
| 3 | Inspect every shared cache on the path. | The response is not stored in any of them. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** security
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-56

### loyalty-TC-50: An identity read is logged as who read what and how many, without the names or email addresses

**Description:** Proves the log proves the read without becoming a second copy of
the identity data it was written to police.

**Preconditions:**

- The operator holds the identity permission and a verified second factor on
  their session.
- The members whose identities are read exist in the identity system.

**Test data:**

| Field | Value |
| --- | --- |
| Records read | more than one |
| Logged | who read, which records, and how many |
| Never logged | the names or the email addresses themselves |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Read member identities as that operator. | The identities are returned to the operator. |
| 2 | Read the operator log entry for that read. | It records who read, which records, and how many. |
| 3 | Search that log entry for the names and email addresses. | Neither appears in it. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** security
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-57

### loyalty-TC-51: An operator without an action's permission is refused that action

**Description:** Proves each operator power is held separately. Holding one
loyalty permission must not carry another, so the case attempts an action the
operator was not given.

**Preconditions:**

- The operator holds at least one loyalty permission but not the one the
  attempted action requires.
- The operator's session is resolved and, where the environment enforces it,
  carries a verified second factor.

**Test data:**

| Field | Value |
| --- | --- |
| Permission held | one that does not cover the attempted action |
| Permission the action requires | not held |
| Outcome expected | the action is refused |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Attempt the action the operator has no permission for. | The action is refused. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** security
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-45

### loyalty-TC-52: An operator action with nowhere to record it is refused rather than run unrecorded

**Description:** Proves the record is a condition of acting, not a by-product.
When the log cannot take the entry, the change must not happen at all.

**Preconditions:**

- The operator holds the permission for the action and, where the environment
  enforces it, a verified second factor.
- The operator log cannot accept a new entry.

**Test data:**

| Field | Value |
| --- | --- |
| Action attempted | one that changes something |
| Place to record it | none |
| Outcome expected | refused, and nothing changed |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Attempt the action while the log cannot accept an entry. | The action is refused rather than run unrecorded. |
| 2 | Read what the action would have changed. | It is unchanged. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** security
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-47

### loyalty-TC-53: Altering or removing a recorded operator action makes verification report where the log breaks

**Description:** Proves the log is tamper-evident. Whoever rewrites history has
to leave a break that verification can name by position.

**Preconditions:**

- The operator log holds several recorded actions.
- Verifying the log before the tampering reports no break.

**Test data:**

| Tampering | Verification |
| --- | --- |
| A recorded action is altered | reports the position at which the log breaks |
| A recorded action is removed | reports the position at which the log breaks |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Apply the tampering in the row to the recorded log. | The log now differs from what was recorded. |
| 2 | Verify the log. | It reports the position at which the log breaks. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** destructive
- **Type:** security
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-46

### loyalty-TC-54: A grant naming a tier the programme does not define, or the tier every member starts on, is refused

**Description:** Proves an invitation can only ever name a tier that is actually
invitable. Each row is a grant that must not take effect.

**Preconditions:**

- The operator holds the permission to grant invitations.
- The operator's session is resolved and, where the environment enforces it,
  carries a verified second factor.
- The member being granted exists.

**Test data:**

| Tier the grant names | Outcome |
| --- | --- |
| A tier the programme does not define | refused as not found, nothing recorded |
| Platinum, the tier every member starts on | refused as invalid |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Grant the member the tier in the row. | The grant is refused with the outcome the row states. |
| 2 | Read the member's live invitations. | Nothing was recorded. |

**Properties:**

- **Severity:** major
- **Priority:** medium
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-26, loyalty-SC-27

### loyalty-TC-55: A console reading a response whose shape it does not recognise names the call that failed to decode

**Description:** Proves a console left behind by a deployed change says so.
Rendering missing values instead would let an operator act on a page that is
quietly wrong.

**Preconditions:**

- The operator holds the permission for the section they open.
- One call the console makes answers in a shape the console does not recognise.

**Test data:**

| Field | Value |
| --- | --- |
| Response shape | one the console does not recognise |
| Expected report | names which call failed to decode |
| Missing values shown | none |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open the console section that makes that call. | The console reports which call failed to decode. |
| 2 | Read what the section renders. | No missing values are shown in place of the data. |

**Properties:**

- **Severity:** major
- **Priority:** medium
- **Status:** draft
- **Behaviour:** negative
- **Type:** usability
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** manual, automation
- **Trace:** loyalty-SC-52

### loyalty-TC-56: An operator holding loyalty permissions but not the identity permission sees loyalty state and no identity

**Description:** Proves the identity boundary holds inside the console. Loyalty
permissions buy loyalty state, never a name or an email address.

**Preconditions:**

- The operator holds loyalty permissions but not the identity permission.
- The operator's session is resolved and, where the environment enforces it,
  carries a verified second factor.
- The member exists and has a name and an email address in the identity system.

**Test data:**

| Field | Value |
| --- | --- |
| Permissions held | loyalty, without the identity permission |
| Loyalty state | shown |
| Name and email address | not shown |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Find the member as that operator. | The member's loyalty state is shown. |
| 2 | Read everything the view discloses about the member. | No name and no email address is shown. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** security
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-54

### loyalty-TC-57: A service holding a connection to the identity system is refused identities without an operator session carrying the identity permission

**Description:** Proves a machine-to-machine connection is not an authorisation.
The operator's own session is what buys an identity read, and nothing else
substitutes for it.

**Preconditions:**

- A service holds a connection to the identity system.
- No operator session carrying the identity permission is presented with the
  request.

**Test data:**

| Field | Value |
| --- | --- |
| Connection to the identity system | held |
| Operator session carrying the identity permission | none |
| Outcome expected | refused |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Request identities over that connection without an operator session carrying the identity permission. | The request is refused. |

**Properties:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** security
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** loyalty-SC-55

### loyalty-TC-58: An unreachable identity system is reported, and no member is shown with a blank identity

**Description:** Proves a failed identity read fails loudly. A blank where a name
should be reads as a member without one, which is a different and wrong fact.

**Preconditions:**

- The operator holds the identity permission and a verified second factor on
  their session.
- The identity system cannot be reached.

**Test data:**

| Field | Value |
| --- | --- |
| Identity system | unreachable |
| Expected report | the failure is reported |
| Members shown with a blank identity | none |

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Open a view that reads member identities while the identity system cannot be reached. | The console reports the failure. |
| 2 | Read the members the view lists. | No member is shown with a blank identity. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** usability
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** manual, automation
- **Trace:** loyalty-SC-58
