# grade10-site/auction/auction Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-01, tcs-rules r4

**Out of suite:**

- `grade10-site-auction-auction-SC-65` - a bid moving a catalogue card: `grade10-site-auction-e2e-US07-TC04-1` in the domain suite, and the catalogue live hook's tests in grade10 (task 8.1)
- `grade10-site-auction-auction-SC-66` - an extension restarting a card's countdown: `grade10-site-auction-e2e-US07-TC04-1` in the domain suite, and task 8.1's tests
- `grade10-site-auction-auction-SC-70` - the lot's own timer closing it with no page open: the settle tests in grade10 (task 5.1) and the room's alarm tests (task 6.1); `grade10-site-auction-auction-US11-TC7-1` walks the same close with a page open
- `grade10-site-auction-auction-SC-71` - a read settling an overdue lot: `grade10-site-auction-auction-US11-TC8-1`'s first row, and task 5.1's deferred-settle tests
- `grade10-site-auction-auction-SC-72` - the sweep settling what nothing reached: `grade10-site-auction-auction-US11-TC8-1`'s second row, and task 5.1's sweep tests
- `grade10-site-auction-auction-SC-73` - two settles racing on one lot: task 5.1's race tests over the listing lock; two settles at one instant cannot be placed by hand
- `grade10-site-auction-auction-SC-75` - an older update losing to a newer one: the version trigger tests (task 3.1) and the `higherVersion` tests (task 7.1)
- `grade10-site-auction-auction-SC-76` - a live update carrying only public facts: the room's frame tests (task 6.1)
- `grade10-site-auction-auction-SC-77` - a page with no live connection catching up: `grade10-site-auction-listing-page-US12-TC3-1` on the lot page, and task 8.1's polling tests for the catalogue
- `grade10-site-auction-auction-SC-78` - the flag off leaving the close rules on: `grade10-site-auction-listing-page-US12-TC3-1`'s second row, and task 6.1's flag-off route tests
- `grade10-site-auction-auction-SC-79` - a called-off lot leaving open pages: task 6.1's `gone` frame tests and task 7.1's page tests
- `grade10-site-auction-auction-SC-80` - the public time read: task 6.1's time route tests; the `grade10-site-auction-listing-page-US13` cases read its effect on the countdown
- `grade10-site-auction-auction-SC-63` - a 1-minor-unit first bid on a 0 start: `grade10-site-auction-auto-bidding-US1-TC6-1` in the auto-bidding suite refuses the same amounts through the maximum

## grade10-site-auction-auction-US2: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a lot I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the lot's cap.

### grade10-site-auction-auction-US2-TC15-2: First bid at the opening price is accepted

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* Bid-time authorization holds are disabled.
* `<listing_21>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_21>`) is signed in and on `<listing_21>`.

**Test data:**

| Currency | `<start>` | `<opening price>` |
| --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00), positive start | 20000 minor units (HKD 200.00), the start itself |
| HKD | 500 minor units (HKD 5.00), below the lowest increment | 500 minor units (HKD 5.00), the start itself |
| HKD | 0 minor units (HKD 0.00), zero start | 1000 minor units (HKD 10.00), the lowest increment |
| USD | 0 minor units (USD 0.00), zero start | 100 minor units (USD 1.00), the lowest increment |
| JPY | 0 minor units (JPY 0), zero start | 100 minor units (JPY 100), the lowest increment |

**Steps:**

1. Enter the row's `<opening price>` in the custom maximum on the bid panel.
2. Place the bid.
3. Read Highest bid, the bid count and Recent Bids.

**Expected Results:**

* The bid is accepted.
* Highest bid reads `<opening price>`, never 0.
* The bid count reads 1, and Recent Bids shows the bid as You.

### grade10-site-auction-auction-US2-TC16-2: First bid below a positive starting price is refused, naming it

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
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* Bid-time authorization holds are disabled.
* `<listing_22>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_22>`) is signed in.

**Test data:**

| Currency | `<start>` | `<bid amount>` |
| --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00) | 19999 minor units (HKD 199.99), one minor unit below the start |
| USD | 50000 minor units (USD 500.00) | 49999 minor units (USD 499.99), one minor unit below the start |
| JPY | 20000 minor units (JPY 20,000) | 19999 minor units (JPY 19,999), one minor unit below the start |

**Steps:**

1. Submit a bid of the row's `<bid amount>` on `<listing_22>`.
2. Read the API response.
3. Read `<listing_22>`'s bids and bid count.

**Expected Results:**

* Grade10 refuses the bid, naming `<start>` as the minimum.
* No accepted bid is recorded, and the bid count stays 0.

### grade10-site-auction-auction-US2-TC17-1: Start on a tier boundary takes that tier's increment, not the one below

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* Bid-time authorization holds are disabled.
* `<listing_23>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_23>`) is signed in.

**Test data:**

| Currency | `<start>`, on a tier boundary | `<first-bid minimum>` | `<bid amount>`, the start plus the lower tier's increment |
| --- | --- | --- | --- |
| USD | 10000 minor units (USD 100.00) | 10500 minor units (USD 105.00) | 10100 minor units (USD 101.00) |
| HKD | 80000 minor units (HKD 800.00) | 84000 minor units (HKD 840.00) | 81000 minor units (HKD 810.00) |
| JPY | 15000 minor units (JPY 15,000) | 15500 minor units (JPY 15,500) | 15100 minor units (JPY 15,100) |

**Steps:**

1. Submit a bid of the row's `<bid amount>` on `<listing_23>`.
2. Read the API response.
3. Read `<listing_23>`'s bids and bid count.

**Expected Results:**

* Grade10 refuses the bid, naming `<first-bid minimum>` as the minimum.
* No accepted bid is recorded, and the bid count stays 0.

### grade10-site-auction-auction-US2-TC18-1: Minimum next bid before any bid is the starting price plus its increment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_24>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.

**Test data:**

| Currency | `<start>` | `<tier increment>` | `<first-bid minimum>` |
| --- | --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00) | 1000 minor units (HKD 10.00) | 21000 minor units (HKD 210.00) |
| HKD | 0 minor units (HKD 0.00) | 1000 minor units (HKD 10.00) | 1000 minor units (HKD 10.00) |
| USD | 0 minor units (USD 0.00) | 100 minor units (USD 1.00) | 100 minor units (USD 1.00) |
| USD | 10000 minor units (USD 100.00), on a tier boundary | 500 minor units (USD 5.00) | 10500 minor units (USD 105.00) |
| JPY | 0 minor units (JPY 0) | 100 minor units (JPY 100) | 100 minor units (JPY 100) |

**Steps:**

1. Read `<listing_24>` from the public listing API.
2. Read the API response's minimum next bid.

**Expected Results:**

* The minimum next bid reads `<start>` plus `<tier increment>` = `<first-bid minimum>`.
* It never reads `<start>` itself, and never 0.

## grade10-site-auction-auction-US11: Bidder is held to the close with everyone else

**As a** bidder,
**I want** a lot to stop taking bids at its close for everyone, and a bid to count only once its payment confirms before then,
**so that** nobody wins with a bid that arrived after the close, and a card hold for a bid that did not count is released.

### grade10-site-auction-auction-US11-TC1-1: Payment confirmed before the effective close counts the bid

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* customer A(card linked) is signed in and on the lot page for `<listing_1>`.
* customer B leads `<listing_1>` at `<leader price>`.
* customer A's card authorization is held until `<confirm time>`.

**Test data:**

| `<listing_1>` state | `<placed at>` | `<confirm time>` | `<recorded close after>` |
| --- | --- | --- | --- |
| Open, scheduled close 20:00:00 UTC | 19:59:50 UTC | 19:59:58 UTC | 20:00:00 UTC, unchanged |
| Extended bidding, recorded close 20:30:00 UTC, extension duration 1800s (30mins), no cap | 20:29:50 UTC | 20:29:58 UTC | 20:59:58 UTC, `<confirm time>` plus 1800s |

| Field | Value |
| --- | --- |
| `<leader price>` | 480000 minor units, HKD |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer A, place `<bid amount>` at `<placed at>`.
2. Read the API response for `<listing_1>` after `<confirm time>`.

**Expected Results:**

* The bid is accepted at `<confirm time>`, and customer A leads.
* Highest bid reads `<bid amount>`.
* The recorded close reads `<recorded close after>`.

### grade10-site-auction-auction-US11-TC2-1: Payment confirmed after the effective close loses and releases its hold

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* customer A(card linked) is signed in and on the lot page for `<listing_2>`.
* customer B leads `<listing_2>` at `<leader price>`.
* customer A's card authorization is held until `<confirm time>`.

**Test data:**

| `<listing_2>` state | `<effective close>` | `<placed at>` | `<confirm time>` |
| --- | --- | --- | --- |
| Extended bidding, extension duration 1800s (30mins), no cap | 20:30:00 UTC | 20:29:55 UTC | 20:30:01 UTC |
| Open, extension duration 0s | 20:00:00 UTC | 19:59:55 UTC | 20:00:01 UTC |

| Field | Value |
| --- | --- |
| `<leader price>` | 480000 minor units, HKD |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer A, place `<bid amount>` at `<placed at>`.
2. Wait until `<confirm time>` passes.
3. Read the bid panel.
4. Read customer A's card authorization for `<listing_2>`.

**Expected Results:**

* The bid panel reads Your bid did not go through.
* Highest bid stays `<leader price>`, and customer B still leads.
* The recorded close stays `<effective close>`.
* customer A's authorization for `<bid amount>` is released.
* `<listing_2>` closes with customer B winning at `<leader price>`.

### grade10-site-auction-auction-US11-TC3-1: Lone first bid still confirming at the scheduled close leaves the lot unsold

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* `<listing_3>` is open with no accepted bid.
* customer A(card linked) is signed in and on the lot page for `<listing_3>`.
* customer A's card authorization is held until `<confirm time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An open HKD listing with no bids, scheduled close 20:00:00 UTC, extension duration 1800s (30mins) |
| `<starting price>` | 120000 minor units |
| `<placed at>` | 19:59:55 UTC |
| `<confirm time>` | 20:00:03 UTC, after the scheduled close |

**Steps:**

1. As customer A, place `<starting price>` at `<placed at>`.
2. Wait until `<confirm time>` passes.
3. Read the bid panel and the lot's result.
4. Read customer A's card authorization for `<listing_3>`.

**Expected Results:**

* `<listing_3>` never enters extended bidding.
* The bid panel reads Your bid did not go through.
* `<listing_3>` closes unsold at 20:00:00 UTC, reading Ended with No bids.
* customer A's authorization is released.

### grade10-site-auction-auction-US11-TC4-1: With holds off a bid placed in the last second counts

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are off.
* `<listing_4>` is in extended bidding and its recorded close is 20:30:00 UTC.
* customer A(card linked) is signed in and on the lot page for `<listing_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An HKD listing in extended bidding, extension duration 1800s (30mins), no cap, led by customer B |
| `<bid time>` | 20:29:59 UTC, one second before the recorded close |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |
| `<new close>` | 20:59:59 UTC, `<bid time>` plus 1800s |

**Steps:**

1. As customer A, place `<bid amount>` at `<bid time>`.
2. Read the API response for `<listing_4>`.

**Expected Results:**

* The bid is accepted when placed, with no wait for a payment.
* customer A leads and Highest bid reads `<bid amount>`.
* The recorded close reads `<new close>`.

### grade10-site-auction-auction-US11-TC5-1: No bid counts past the bounded late window before the close is recorded

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are off.
* `<listing_5>` has scheduled close 20:00:00 UTC and its extension terms are the row's.
* customer B's bid was accepted on `<listing_5>` at `<last accepted>`.
* Settling `<listing_5>` is held back, so its close is not yet recorded at `<bid time>`.
* customer A(card linked) is signed in and can bid on `<listing_5>`.

**Test data:**

| `<extension duration>` | `<extension cap>` | `<last accepted>` | `<effective close>` | `<bid time>` |
| --- | --- | --- | --- | --- |
| 1800s (30mins) | 600s (10mins) | 20:05:00 UTC | 20:10:00 UTC, the cap | 20:10:01 UTC |
| 1800s (30mins) | 0s | 19:58:00 UTC | 20:00:00 UTC | 20:00:01 UTC |
| 0s | None | 19:58:00 UTC | 20:00:00 UTC | 20:00:01 UTC |

| Field | Value |
| --- | --- |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer A, place `<bid amount>` at `<bid time>`.
2. Read the API response for `<listing_5>`.
3. Let settling resume.
4. Read the lot's result.

**Expected Results:**

* The bid is refused.
* No accepted bid is added, and the recorded close stays `<effective close>`.
* `<listing_5>` closes with customer B winning.

### grade10-site-auction-auction-US11-TC6-1: Extension cap of 0 closes the lot at its scheduled close

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* `<listing_6>` is open with one accepted bid.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | An open listing, scheduled close 20:00:00 UTC, extension duration 1800s (30mins), extension cap 0s |

**Steps:**

1. Wait for the scheduled close.
2. Read the API response for `<listing_6>`.

**Expected Results:**

* `<listing_6>` never entered extended bidding.
* It is closed at 20:00:00 UTC, with its one bidder winning.

### grade10-site-auction-auction-US11-TC7-1: A due lot is recorded closed at its close, not at the sweep

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* customer A leads `<listing_7>` and is on its lot page.
* `<listing_7>`'s recorded close is about two minutes away, and no other bid will be placed.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | An HKD listing in extended bidding, led by customer A |
| `<sweep interval>` | 300s (5mins) |

**Steps:**

1. Wait for the recorded close.
2. Read the lot's result on customer A's open page.

**Expected Results:**

* The lot's close is recorded before the next sweep, well inside `<sweep interval>`, and its close lag is recorded.
* customer A's page reads Closed with no result, then Won, without a reload.

### grade10-site-auction-auction-US11-TC8-1: A lot whose alarm missed is still settled

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* customer A leads `<listing_8>`, and no other bid will be placed.
* The lot's own alarm is disabled for `<listing_8>`.

**Test data:**

| `<who reaches it>` | `<recorded by>` |
| --- | --- |
| A read of `<listing_8>` more than 2s after its recorded close | Right after that read answers |
| Nobody before the five-minute sweep | The next sweep, at most 300s (5mins) after the recorded close |

**Steps:**

1. Wait for `<listing_8>`'s recorded close.
2. Let `<who reaches it>` reach `<listing_8>`.
3. Read the API response for `<listing_8>`.

**Expected Results:**

* `<listing_8>` is recorded closed `<recorded by>`, with customer A winning.
* Before then, `<listing_8>` takes no bid and reports no result.

---

## grade10-site-auction-auction-US12: Bidder keeps a lot open only by moving its price

**As a** bidder,
**I want** extended bidding to restart only when a bid moves the lot's price,
**so that** a leader cannot keep a lot open by raising their own maximum.

### grade10-site-auction-auction-US12-TC1-1: Equal maximum at a higher price extends the lot

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
* **Trace:** grade10-site-auction-auction-US-12

**Pre-conditions:**

* Bid-time holds are off.
* `<listing_9>` is in extended bidding with its recorded close `<time left before bid>` away.
* customer A leads `<listing_9>` at `<leader price>` with maximum `<user A maximum>`.
* customer B(card linked) is signed in on a separate session, on the lot page for `<listing_9>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | An HKD listing in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |
| `<time left before bid>` | 5 minutes |
| `<leader price>` | 100000 minor units |
| `<user A maximum>` | 200000 minor units |
| `<user B maximum>` | 200000 minor units, equal to `<user A maximum>` |

**Steps:**

1. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
2. Read Highest bid, the leader and Time left.

**Expected Results:**

* Highest bid reads `<user B maximum>`.
* customer A still leads, as the earlier maximum.
* Time left reads `<extension duration>` from customer B's bid.

### grade10-site-auction-auction-US12-TC2-1: Leader raising their own maximum leaves the close where it was

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
* **Trace:** grade10-site-auction-auction-US-12

**Pre-conditions:**

* Bid-time holds are off.
* `<listing_10>` is in extended bidding, its recorded close `<close before raise>`.
* customer A leads `<listing_10>` at `<leader price>` with maximum `<user A maximum>`, and is on its lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | An HKD listing in extended bidding, extension duration 1800s (30mins), no cap |
| `<close before raise>` | 3 minutes after the raise |
| `<leader price>` | 530000 minor units |
| `<user A maximum>` | 800000 minor units |
| `<raised maximum>` | 900000 minor units |

**Steps:**

1. Select **Raise**, enter `<raised maximum>` and confirm.
2. Read Your maximum, Highest bid and Time left.
3. Wait until `<close before raise>` with no further bid.
4. Read the lot's result.

**Expected Results:**

* Your maximum reads `<raised maximum>`.
* Highest bid stays `<leader price>`.
* The recorded close stays `<close before raise>`, and Time left keeps counting to it.
* The lot closes at `<close before raise>`, customer A winning at `<leader price>`.

## Settled

- The first-bid minimum on a listing with no accepted bid is its opening price: the starting price, or the lowest increment on a 0 start; one increment above the current bid applies from the second bid (decisions Q19, Q27).
- A first bid of 0, or of one minor unit, on a 0 start is a non-goal; no case asserts either.
- The price a lone maximum stands at on a 0 start is auto-bidding's case, not this suite's.

## Reconciliation

**Run:** QA2, 2026-10-01. QA1's blind pass read the frozen Purpose and Feature set, the change's journeys, `proposal.md`, `decisions.md` with its empty `## Raised`, the linked pages under `docs/prds/` (auction display and bidding, the auction service), `openspec/config.yaml`'s context, the durable suites and the change's domain draft with their `## Reconciliation` stripped, and the two rulebooks; it was denied every `## Requirements` section, `openspec/specs/` beyond those, and the archive. QA2 read both readings, the three deltas, `tech-design.md`, `tasks.md` and the en, ko, zh-Hans and zh-Hant catalogues. It is a statement, not proof.

- **Joined** - `grade10-site-auction-auction-US11-TC1-1` into `grade10-site-auction-auction-SC-69`, its first row held by the durable `grade10-site-auction-auction-SC-21`; `grade10-site-auction-auction-US11-TC2-1` into `grade10-site-auction-auction-SC-67`, its bid panel words into `grade10-site-auction-listing-page-SC-39`; `grade10-site-auction-auction-US11-TC3-1` into `grade10-site-auction-auction-SC-68`; `grade10-site-auction-auction-US11-TC5-1` into `grade10-site-auction-auction-SC-85`, `grade10-site-auction-auction-SC-84` and `grade10-site-auction-auction-SC-07b` by row, with the refusal while settling is held back into `grade10-site-auction-auction-SC-74`; `grade10-site-auction-auction-US11-TC6-1` into `grade10-site-auction-auction-SC-84`; `grade10-site-auction-auction-US11-TC7-1` into `grade10-site-auction-auction-SC-70`; `grade10-site-auction-auction-US11-TC8-1` into `grade10-site-auction-auction-SC-71` and `grade10-site-auction-auction-SC-72`; `grade10-site-auction-auction-US12-TC1-1` into `grade10-site-auction-auction-SC-82`; `grade10-site-auction-auction-US12-TC2-1` into `grade10-site-auction-auction-SC-81`
- **Raised, folded into spec** - `grade10-site-auction-auction-US11-TC4-1`, a bid counting when placed with holds off: the requirement stated it and no scenario did, now `grade10-site-auction-auction-SC-86`, cited in tasks 4.1 and 4.2
- **Raised, escalated** - the Bounded late window leaf reading as the end of all extended bidding, landed as Q14; this change and `allow-zero-starting-price` both modifying the window requirement, landed as Q15
- **Raised, rejected** - none this run
- **Covered at domain** - `grade10-site-auction-e2e-US07-TC03-2`, a price-moving bid in extended bidding restarting the timer on an open page, the durable `grade10-site-auction-auction-SC-06` under Q5
- **Covered at domain** - `grade10-site-auction-e2e-US07-TC04-1`, the catalogue card and the lot page agreeing after an extension, `grade10-site-auction-auction-SC-65` and `grade10-site-auction-auction-SC-66`
- **Covered at domain** - `grade10-site-auction-e2e-US12-TC01-1`, one result on the lot page and My Auctions once the close is recorded
- **Out of suite** - the scenarios listed under the header, each serving a Feature-set group rather than a journey and naming where it is decided
- **Patched, not re-run** - `grade10-site-auction-auction-US11-TC7-1` drops its one-second bound and asserts a close recorded before the next sweep with its lag recorded: the proposal measures the close lag rather than asserting it, and the PRD's "about a second" is the normal case, not a bound. It keeps `<v>`
- **Settled by the artifacts, not raised** - where the late window ends with no cap, or a cap at or above the duration: the late window bounds only a lot whose extended bidding is not yet recorded; once it is, the effective close is the recorded close, which each price-moving bid moves, up to the scheduled close plus any cap, so lot C closes at 21:05 (the window requirement's Effective close and steps 5 to 7, the tech design's clock table). The bidding PRD's and the auction service PRD's 🚧 lines, which read as a hard end, were reworded to say so. No auction journey walks Live relay, Live cards or Service time: the rulebook lets a group-served scenario be closed by a domain case or `**Out of suite:**`, which is how they are closed here. Between the close and the recorded close the public status stays Active and the page shows Closed with no result (Q3, `grade10-site-auction-auction-SC-71`)
- **Unchanged durable cases** - `grade10-site-auction-auction-US2-TC10-1` holds under Q5, since its bids come from a non-leader and move the price; it stays `actual`
- **Contradicted** - none
- **Uncovered anchors** - none: `grade10-site-auction-auction-US-11` has eight cases, `grade10-site-auction-auction-US-12` two, and the Closing a due lot, Live relay, Live cards and Service time leaves close through the header's list
- **Not walked by any case** - `grade10-site-auction-auction-SC-83`, a bid at exactly the scheduled close with extension off: an exact millisecond cannot be placed by hand, so task 4.1's tests decide it

**Run:** blind feature pass of `allow-zero-starting-price`, 2026-09-29, folded into this change 2026-10-01. Read: the bundle's `outline.md` (Purpose and Feature set), `durable-user-journeys.md`, `change-user-journeys.md`, `proposal.md`, `decisions.md`, `prd-bidding.md`, `existing-feature-tcs.md` (Reconciliation stripped), `domain-tcs.md` (Reconciliation stripped); `docs/governance/specs-to-test-cases.md`, `docs/governance/tcs-conventions.md`, the `spec-to-tcs` skill, `openspec/config.yaml`; this change's auto-bidding `feature-tcs.md` for shape only, its Reconciliation ignored. Denied: every `## Requirements` section, this change's `spec.md`, `openspec/specs/`, `openspec/changes/archive/` and every other change.

- **Joined:** `grade10-site-auction-auction-US2-TC15-2` decides `grade10-site-auction-auction-SC-62`; `grade10-site-auction-auction-US2-TC16-2` decides `grade10-site-auction-auction-SC-64`.
- **Out of suite:** `grade10-site-auction-auction-SC-63` - a 1-minor-unit first bid on a 0 start is walked by `grade10-site-auction-auto-bidding-US1-TC6-1` in this change's auto-bidding suite, which refuses the same amounts through the maximum.
- **Revised on Q19's answer:** the pass was written on the round's first call, the starting price plus its increment on every start. The author's answer made the minimum the opening price, so `grade10-site-auction-auction-US2-TC15-1` and `grade10-site-auction-auction-US2-TC16-1` were rewritten as their `-2`, and `grade10-site-auction-auction-US2-TC17-1` (the tier a first bid clears) and `grade10-site-auction-auction-US2-TC18-1` (the published minimum, now `grade10-site/auction/bid-increments`' suite's) are deprecated. Patched, not re-run.
- **Raised, decided by the round:** what quick-bid chip 1x reads before any bid (Q28), and whether `grade10-site-auction-auction-US-02` is the walk for the first-bid rule (Q29). Neither moves a scenario.
- **Level check:** the pass found `grade10-site-auction-e2e-US03-TC01-1` bidding at the starting price, which the opening price keeps; no domain revision.
- **Raised, rejected:** none.
- **Uncovered anchors:** none.
