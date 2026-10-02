# grade10-site/auction/auction Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-auction-US2: Collector places a bid inside the window

**As a** bidder,
**I want** a lot I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the lot's cap.

<!-- trace:case id=g10.auction-auction.TC-b19 rev=2 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC5-2: A bid stands when accepted, with nothing held on the card

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* customer(card linked, no bid on `<listing_25>`) is signed in.
* `<listing_25>` is open inside its window.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_25>` | An open HKD listing taking bids, current bid `<current bid>` |
| `<current bid>` | 480000 minor units (HKD 4,800.00) |
| `<bid amount>` | 505000 minor units (HKD 5,050.00), at or above the minimum next bid |

**Steps:**

1. Submit `<bid amount>` on `<listing_25>`.
2. Read the API response.
3. Read the linked card's activity at the card provider.

**Expected Results:**

* Step 2 accepts the bid in the one answer, by the listing's bid rules, with no wait on the card provider.
* Step 3 shows nothing held or charged on the card for `<listing_25>`.

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

* `<listing_21>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_21>`) is signed in and on `<listing_21>`.

**Test data:**

| Currency | `<start>` | `<opening price>` | `<next minimum>` |
| --- | --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00), positive start | 20000 minor units (HKD 200.00), the start itself | 21000 minor units (HKD 210.00) |
| HKD | 500 minor units (HKD 5.00), below the lowest increment | 500 minor units (HKD 5.00), the start itself | 1500 minor units (HKD 15.00) |
| HKD | 0 minor units (HKD 0.00), zero start | 1000 minor units (HKD 10.00), the lowest increment | 2000 minor units (HKD 20.00) |
| USD | 0 minor units (USD 0.00), zero start | 100 minor units (USD 1.00), the lowest increment | 200 minor units (USD 2.00) |
| JPY | 0 minor units (JPY 0), zero start | 100 minor units (JPY 100), the lowest increment | 200 minor units (JPY 200) |

**Steps:**

1. Enter the row's `<opening price>` in the custom maximum on the bid panel.
2. Place the bid.
3. Read Highest bid, the bid count and Recent Bids.
4. Read the minimum next bid.

**Expected Results:**

* The bid is accepted.
* Highest bid reads `<opening price>`, never 0.
* The bid count reads 1, and Recent Bids shows the bid as You.
* Step 4 reads `<next minimum>`, `<opening price>` plus its tier increment.

### grade10-site-auction-auction-US2-TC16-2: First bid below the opening price is refused, naming it

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

* `<listing_22>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_22>`) is signed in.

**Test data:**

| Currency | `<start>` | `<opening price>` | `<bid amount>` |
| --- | --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00) | 20000 minor units (HKD 200.00), the start itself | 19999 minor units (HKD 199.99), one minor unit below |
| USD | 50000 minor units (USD 500.00) | 50000 minor units (USD 500.00), the start itself | 49999 minor units (USD 499.99), one minor unit below |
| JPY | 20000 minor units (JPY 20,000) | 20000 minor units (JPY 20,000), the start itself | 19999 minor units (JPY 19,999), one minor unit below |
| HKD | 0 minor units (HKD 0.00), zero start | 1000 minor units (HKD 10.00), the lowest increment | 999 minor units (HKD 9.99), one minor unit below |
| USD | 0 minor units (USD 0.00), zero start | 100 minor units (USD 1.00), the lowest increment | 99 minor units (USD 0.99), one minor unit below |
| JPY | 0 minor units (JPY 0), zero start | 100 minor units (JPY 100), the lowest increment | 99 minor units (JPY 99), one minor unit below |

**Steps:**

1. Submit a bid of the row's `<bid amount>` on `<listing_22>`.
2. Read the API response.
3. Read `<listing_22>`'s bids and bid count.

**Expected Results:**

* Grade10 refuses the bid, naming `<opening price>` as the minimum.
* No accepted bid is recorded, and the bid count stays 0.

### grade10-site-auction-auction-US2-TC19-1: Two bids at once are judged one after the other

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
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_26>` is open inside its window, current bid `<current bid>`.
* customer A(card linked) and customer B(card linked) are signed in on separate sessions, neither holding a bid on `<listing_26>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_26>` | An open HKD listing taking bids, led by customer C at `<current bid>` with maximum `<current bid>` |
| `<current bid>` | 480000 minor units (HKD 4,800.00) |
| `<increment>` | 8000 minor units (HKD 80.00), the HK$4,000 tier |
| `<bid A>` | 505000 minor units (HKD 5,050.00) |
| `<bid B>` | 600000 minor units (HKD 6,000.00), above `<bid A>` |

**Steps:**

1. Submit `<bid A>` as customer A and `<bid B>` as customer B on `<listing_26>` at the same moment.
2. Read both API responses.
3. Read `<listing_26>` from the public listing API.

**Expected Results:**

* Each response is one answer: accepted with a standing, or refused.
* customer B leads, and Highest bid reads `<bid A>` plus `<increment>`.
* No lower bid overwrites that Highest bid, whichever response arrived first.

---

## grade10-site-auction-auction-US3: Collector's card hold is released when they are outbid

**As a** bidder,
**I want** one authorization per listing, released when I am outbid,
**so that** a delayed lower hold or a duplicate Stripe event cannot take a second bite.

### grade10-site-auction-auction-US3-TC1-1: Outbid authorization is marked for release

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* customer A holds the active authorization for open listing `<listing_1>`.
* customer B is able to bid on `<listing_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open listing whose current bid is customer A's |
| `<higher bid>` | A valid amount above customer A's current bid |

**Steps:**

1. Submit `<higher bid>` for customer B against `<listing_1>`.
2. Read customer A's authorization state for `<listing_1>`.
3. Read the recorded Stripe release outcome once it arrives.

**Expected Results:**

* Grade10 marks customer A's authorization for asynchronous release.
* Customer A no longer holds an eligible top authorization for `<listing_1>`.
* Grade10 records the Stripe release outcome when it arrives.

### grade10-site-auction-auction-US3-TC2-1: Concurrent bids keep the highest valid outcome

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
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* `<listing_1>` is open and both customers read the same current listing state.

**Test data:**

| Field | Value |
| --- | --- |
| `<bid A>` | A valid amount from customer A |
| `<bid B>` | A different valid amount from customer B, above `<bid A>` |

**Steps:**

1. Submit `<bid A>` and `<bid B>` against `<listing_1>` concurrently.
2. Read the listing's recorded bid order and current bid.

**Expected Results:**

* Grade10 records the bid outcomes in one listing order.
* The current bid is the highest valid accepted amount.
* No lower bid overwrites that current bid.

### grade10-site-auction-auction-US3-TC3-1: Delayed lower authorization cannot land

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
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* Customer A's card authorization for `<listing_1>` is pending at Stripe.
* Grade10 has accepted customer B's higher valid bid before Stripe confirms it.

**Steps:**

1. Let Stripe confirm customer A's lower authorization.
2. Read the authorization state and the listing's current bid.

**Expected Results:**

* Grade10 releases the lower authorization.
* It does not record that lower bid as accepted.
* The current bid is unchanged.

### grade10-site-auction-auction-US3-TC4-1: Invalid or duplicate Stripe event changes nothing twice

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
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* `<listing_1>` has an authorization, release or capture already recorded.

**Test data:**

Runs once per row of **Test data**.

| `<event>` | Grade10 answers |
| --- | --- |
| A webhook whose signature is invalid | rejects the event |
| A webhook whose provider event was already processed | returns the duplicate outcome without another state transition |

**Steps:**

1. Deliver `<event>` to the Stripe webhook endpoint.
2. Read the bid, hold, release, capture, invoice and order state for `<listing_1>`.

**Expected Results:**

* Grade10 answers as the row states.
* No bid, hold, release, capture, invoice or order state is duplicated.

### grade10-site-auction-auction-US3-TC5-1: Incomplete Stripe configuration fails the operation explicitly

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* Required Stripe configuration is absent, or does not support the authorization or capture action the operation needs.

**Steps:**

1. Attempt an Auction operation that requires Stripe against `<listing_1>`.
2. Read the recorded bids and outcomes for `<listing_1>`.

**Expected Results:**

* Grade10 fails the operation, naming the unavailable capability.
* No bid or fixture-backed outcome is created.

### grade10-site-auction-auction-US3-TC6-1: Missed authorization webhook is repaired once

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* Stripe has confirmed customer A's bid authorization for `<listing_1>`.
* Grade10 has not processed that webhook, and holds the provider reference.

**Steps:**

1. Run scheduled reconciliation over the recorded provider reference.
2. Read the authorization outcome for `<listing_1>`.
3. Run the reconciliation a second time.

**Expected Results:**

* Grade10 reads the authorization outcome from Stripe.
* It applies that outcome exactly once.

---

## grade10-site-auction-auction-US4: Collector meets the identity bar on a high-value bid

**As a** collector bidding the bar or more on a lot,
**I want** to be told at once that a verified identity is needed and where to get one,
**so that** the auction records nothing for a bid it cannot take, and I can verify and bid again before the lot closes.

<!-- trace:case id=g10.auction-auction.TC-zsd rev=2 covers=g10.auction-auction.SC-uhh,g10.auction-auction.SC-d78,g10.auction-auction.SC-ndj -->
### grade10-site-auction-auction-US4-TC1-2: Verified bidder's bid at the bar is forwarded as any other

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
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* The user is signed in on `<a verified account>` with `<card>` saved, and is on `<listing_12>`.
* `<listing_12>` is live, inside its window, and its minimum next bid is `<bar>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a verified account>` | An account whose standing is `verified` on the day of the bid |
| `<card>` | Visa ending 4242 |
| `<bar>` | 12000000 minor units (HKD 120,000.00), the bar Grade10 sets on a bid |
| `<listing_12>` | A live HKD listing whose minimum next bid is `<bar>` |
| `<bid at the bar>` | 12000000 minor units (HKD 120,000.00), equal to `<bar>` |

**Steps:**

1. Enter `<bid at the bar>` in the bid field and select **Place Bid**.
2. Read Highest bid and the bid count.
3. Read `<card>`'s activity at the card provider.

**Expected Results:**

* The bid is forwarded and accepted as any other - no refusal names a verified identity.
* Highest bid reads `<bid at the bar>`, and the bid count rises by one.
* Step 3 shows nothing held or charged on `<card>`.

<!-- trace:case id=g10.auction-auction.TC-5gi rev=2 covers=g10.auction-auction.SC-uhh,g10.auction-auction.SC-d78,g10.auction-auction.SC-ndj -->
### grade10-site-auction-auction-US4-TC2-2: Bidder without a verified standing is held at the storefront at and above the bar

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
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* The user is signed in with `<card>` saved on an account whose standing is the one the row names, holds no bid on `<listing_12>`, and is on `<listing_12>`.
* `<listing_12>` is live, inside its window, and its minimum next bid is `<bar>`.

**Test data:**

| Standing | Bid amount | Outcome |
| --- | --- | --- |
| `unverified` | 12000000 minor units (HKD 120,000.00), exactly `<bar>` | Refused; no bid recorded |
| `unverified` | 12500000 minor units (HKD 125,000.00), any bid above `<bar>` | Refused; no bid recorded |
| `expired` | 12000000 minor units (HKD 120,000.00), exactly `<bar>` | Refused; no bid recorded |
| `expired` | 12500000 minor units (HKD 125,000.00), any bid above `<bar>` | Refused; no bid recorded |

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<bar>` | 12000000 minor units (HKD 120,000.00), the bar Grade10 sets on a bid |
| `<listing_12>` | A live HKD listing whose minimum next bid is `<bar>` |

**Steps:**

1. Enter the bid amount the row names in the bid field and select **Place Bid**.
2. Read the refusal on the bid form.
3. Reload `<listing_12>` and read Highest bid and the bid count.
4. Navigate to `<my auctions url>` and look for `<listing_12>`.
5. Navigate to `<grade10 bids url>` and look for `<listing_12>`.

**Expected Results:**

* The bid is refused as needing a verified identity, and the refusal says where to verify from the account.
* Highest bid and the bid count are unchanged - the auction records no bid.
* Step 4 shows no row for `<listing_12>`.
* Step 5 shows no entry for `<listing_12>`.

---

## grade10-site-auction-auction-US11: Bidder is held to the close with everyone else

**As a** bidder,
**I want** a lot to stop taking bids at its close for everyone, and a bid to count when it is accepted before then,
**so that** nobody wins with a bid that arrived after the close.

### grade10-site-auction-auction-US11-TC1-1: Payment confirmed before the effective close counts the bid

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
| Open, scheduled close 20:00:00 UTC, extension duration 0s | 19:59:55 UTC | 20:00:00.000 UTC, exactly the scheduled close, at the limit | 20:00:00 UTC, unchanged |

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
* With no further bid, `<listing_1>` closes at `<recorded close after>` with customer A winning.

### grade10-site-auction-auction-US11-TC2-1: Payment confirmed after the effective close loses and releases its hold

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

| `<listing_2>` state | `<recorded close>` | `<effective close>` | `<placed at>` | `<confirm time>` |
| --- | --- | --- | --- | --- |
| Extended bidding, extension duration 1800s (30mins), no cap | 20:30:00 UTC | 20:30:00 UTC, the recorded close | 20:29:55 UTC | 20:30:01 UTC |
| Extended bidding, extension duration 1800s (30mins), no cap | 20:30:00 UTC | 20:30:00 UTC, the recorded close | 20:29:55 UTC | 20:30:00.000 UTC, exactly the effective close, at the limit |
| Open, extension duration 0s | 20:00:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 19:59:55 UTC | 20:00:01 UTC |

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

* The bid panel reads "Your bid did not go through." alone, never "The card was not authorized."
* Highest bid stays `<leader price>`, and customer B still leads.
* The recorded close stays `<recorded close>`.
* customer A's authorization for `<bid amount>` is released.
* `<listing_2>` closes with customer B winning at `<leader price>`.

### grade10-site-auction-auction-US11-TC3-1: Lone first bid still confirming at the scheduled close leaves the lot unsold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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
* The bid panel reads "Your bid did not go through." alone, never "The card was not authorized."
* `<listing_3>` closes unsold at 20:00:00 UTC, reading Ended with No bids.
* customer A's authorization is released.

### grade10-site-auction-auction-US11-TC4-1: A bid placed in the last second counts when accepted

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

### grade10-site-auction-auction-US11-TC5-1: No bid counts at or after the effective close while the close is unrecorded

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

* `<listing_5>` has scheduled close 20:00:00 UTC and its extension terms are the row's.
* customer B's bid was accepted on `<listing_5>` at `<last accepted>`.
* Settling `<listing_5>` is held back, so its close is not yet recorded at `<bid time>`.
* customer A(card linked) is signed in and can bid on `<listing_5>`.

**Test data:**

| `<extension duration>` | `<extension cap>` | `<last accepted>` | `<effective close>` | `<bid time>` |
| --- | --- | --- | --- | --- |
| 1800s (30mins) | 600s (10mins) | 20:05:00 UTC | 20:10:00 UTC, the cap | 20:10:00 UTC, at the limit |
| 1800s (30mins) | 600s (10mins) | 20:05:00 UTC | 20:10:00 UTC, the cap | 20:10:01 UTC |
| 1800s (30mins) | None | 20:10:00 UTC | 20:40:00 UTC, the recorded close | 20:40:00 UTC, at the limit |
| 1800s (30mins) | None | 20:10:00 UTC | 20:40:00 UTC, the recorded close | 20:40:01 UTC |
| 1800s (30mins) | 0s | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:00.001 UTC, at the limit |
| 1800s (30mins) | 0s | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:01 UTC |
| 0s | None | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:00.001 UTC, at the limit |
| 0s | None | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:01 UTC |

| Field | Value |
| --- | --- |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer A, place `<bid amount>` at `<bid time>`.
2. Read the API response for `<listing_5>`.
3. Let settling resume.
4. Read the lot's result.

**Expected Results:**

* Step 1 is refused.
* At step 2 no accepted bid is added, the recorded close does not move, and `<listing_5>` is still not recorded closed.
* At step 4 `<listing_5>` is closed with customer B winning.

### grade10-site-auction-auction-US11-TC11-1: Leader's raise confirmed after the close loses, the earlier lead stands

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* customer A leads `<listing_13>` at `<leader price>` with maximum `<user A maximum>`, its authorization held.
* customer A's authorization for `<raised maximum>` is held until `<confirm time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_13>` | An HKD listing in extended bidding, recorded close 20:30:00 UTC, extension duration 1800s (30mins), no cap |
| `<leader price>` | 530000 minor units |
| `<user A maximum>` | 800000 minor units |
| `<raised maximum>` | 900000 minor units |
| `<placed at>` | 20:29:55 UTC |
| `<confirm time>` | 20:30:01 UTC, after the effective close |

**Steps:**

1. As customer A, raise the maximum to `<raised maximum>` at `<placed at>`.
2. Wait until `<listing_13>` is recorded closed.
3. Read the API response for `<listing_13>`.
4. Read customer A's card authorizations for `<listing_13>`.

**Expected Results:**

* `<listing_13>` closes at 20:30:00 UTC, customer A winning at `<leader price>`.
* customer A's maximum stays `<user A maximum>`.
* The authorization for `<raised maximum>` is released.
* The authorization for `<user A maximum>` is kept.

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

---

## grade10-site-auction-auction-US13: Runner-up takes the lead when the leader's account is erased

**As a** bidder whose maximum is the highest left on a lot,
**I want** to take the lead at a price set by the maxima still standing when the leader's account is erased,
**so that** the lot keeps a leader and I never pay more than the price stood at before.

### grade10-site-auction-auction-US13-TC1-1: Highest maximum left leads, priced from the maxima left

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
* **Trace:** grade10-site-auction-auction-US-13

**Pre-conditions:**

* `<listing_27>` is open inside its window, with the row's maxima committed in the row's order.
* customer A leads `<listing_27>` at `<price before>`.
* customer A has no unpaid order or open fulfilment, so nothing stops the erasure.
* customer B is signed in on a separate session.

**Test data:**

| customer A maximum | customer B maximum | customer C maximum | `<price before>` | `<price after>` | Leader after |
| --- | --- | --- | --- | --- | --- |
| 200000 minor units (HKD 2,000.00), first | 150000 minor units (HKD 1,500.00) | 120000 minor units (HKD 1,200.00) | 154000 minor units (HKD 1,540.00), customer B's maximum plus 4000 | 124000 minor units (HKD 1,240.00), customer C's maximum plus 4000 | customer B |
| 200000 minor units (HKD 2,000.00), first | 121000 minor units (HKD 1,210.00) | 120000 minor units (HKD 1,200.00) | 125000 minor units (HKD 1,250.00), customer B's maximum plus 4000 | 121000 minor units (HKD 1,210.00), capped at customer B's maximum | customer B |
| 150000 minor units (HKD 1,500.00), first | 150000 minor units (HKD 1,500.00), second | 120000 minor units (HKD 1,200.00) | 150000 minor units (HKD 1,500.00), equal maxima, customer A earlier | 124000 minor units (HKD 1,240.00), customer C's maximum plus 4000 | customer B |

| Field | Value |
| --- | --- |
| `<listing_27>` | An open HKD listing, starting price 20000 minor units (HKD 200.00), scheduled close more than an hour away |
| Increment | 4000 minor units (HKD 40.00), the HK$800 tier, at every maximum above |

**Steps:**

1. Read `<listing_27>` from the public listing API.
2. Erase customer A's account through the account-erasure procedure.
3. Read `<listing_27>` from the public listing API.
4. As customer B, read their own standing on `<listing_27>`.

**Expected Results:**

* Step 1 reads Highest bid `<price before>`, led by customer A.
* Step 3 reads Highest bid `<price after>`, the next maximum left plus one increment, capped at the new leader's maximum.
* Step 3's Highest bid is never above `<price before>`.
* Step 4 reads the row's leader after: customer B leads, with their own maximum unchanged.
* customer A's maxima appear nowhere on `<listing_27>`.

### grade10-site-auction-auction-US13-TC2-1: Erasing the only bidder leaves the lot with no leader

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
* **Trace:** grade10-site-auction-auction-US-13

**Pre-conditions:**

* `<listing_28>` is open inside its window, and customer A's maximum is its only maximum.
* customer A has no unpaid order or open fulfilment, so nothing stops the erasure.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_28>` | An open HKD listing, starting price 20000 minor units (HKD 200.00), led by customer A alone at the starting price |
| customer A maximum | 200000 minor units (HKD 2,000.00) |

**Steps:**

1. Erase customer A's account through the account-erasure procedure.
2. Read `<listing_28>` from the public listing API.

**Expected Results:**

* `<listing_28>` has no leader and no current bid.
* The next bid must reach 20000 minor units (HKD 200.00), the opening price.
* customer A's maximum appears nowhere on `<listing_28>`.

### grade10-site-auction-auction-US13-TC3-1: Erasing a bidder re-prices the lot from the maxima left, never upward

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
* **Trace:** grade10-site-auction-auction-US-13

**Pre-conditions:**

* `<listing_32>` is open inside its window, with the row's maxima committed in the order given, and Highest bid `<price before>`.
* The erased customer has no unpaid order or open fulfilment, so nothing stops the erasure.

**Test data:**

| Maxima, in the order committed | `<price before>` | Erased | Leader after | `<price after>` |
| --- | --- | --- | --- | --- |
| customer A 20000, customer B 15000, customer C 12000 | 15500 | customer B | customer A | 12500, customer C's maximum plus 500 |
| customer A 20000 raised to 50000 after customer B 19800, customer C 10000 | 20000 | customer C | customer A | 20000, unchanged: customer B's maximum plus 500 is 20300, above `<price before>` |
| customer A 20000, customer B 15000, customer C 11000 | 15500 | customer C | customer A | 15500, unchanged, on the same bid |
| customer A 20000, customer B 15000 | 15500 | customer A | customer B | 10000, the opening price |

| Field | Value |
| --- | --- |
| `<listing_32>` | An open USD listing, opening price 10000 minor units (USD 100.00), scheduled close more than an hour away; every amount above is in USD minor units |
| Increment | 500 minor units (USD 5.00), the USD 100 tier, at every next maximum above |

**Steps:**

1. Read `<listing_32>` from the public listing API, noting its scheduled close.
2. Erase the row's erased customer's account through the account-erasure procedure.
3. Read `<listing_32>` from the public listing API.

**Expected Results:**

* Step 1 reads Highest bid `<price before>`.
* Step 3 reads Highest bid `<price after>`, led by the row's leader after.
* Step 3's Highest bid is never above `<price before>`.
* Step 3's scheduled close is the one noted at step 1.
* The erased customer's maxima appear nowhere on `<listing_32>`.

---

## grade10-site-auction-auction-US14: Bidder reads why a bid was refused, and nothing else moves

**As a** bidder,
**I want** a refused bid to say why on the bid form and to leave no trace anywhere else,
**so that** I never read a bid I did not place as one I did.

### grade10-site-auction-auction-US14-TC1-1: A refused bid says why on the bid form and places nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14

**Pre-conditions:**

* customer(card linked, account in the row's state) is signed in and on the lot page for `<listing_29>`.
* customer holds no bid on `<listing_29>` and does not watch it.
* `<listing_29>` is in the row's lot state.

**Test data:**

| Refused when | Account state | Lot state | Amount entered | The bid form says |
| --- | --- | --- | --- | --- |
| Below the next minimum | In good standing | Open, minimum next bid `<next minimum>` | 512900 minor units (HKD 5,129), one major unit below `<next minimum>` | Minimum bid is, naming `<next minimum>` |
| Above the currency's ceiling | In good standing | Open | 8000000100 minor units (HKD 80,000,001.00), one major unit above the ceiling | Maximum bid is, naming the ceiling, HKD 80,000,000 |
| Bidding suspended on the account | Bidding suspended | Open | `<next minimum>` | Bidding is suspended on this account. Contact Us to resolve it. |
| Account banned from bidding | Banned from bidding | Open | `<next minimum>` | This account cannot bid. |
| After the close | In good standing | Past its effective close, its close not yet recorded, the page's live updates held back | `<next minimum>` | Your bid did not go through. |

| Field | Value |
| --- | --- |
| `<listing_29>` | An HKD listing led by customer B at `<current bid>`, bid count `<bid count>` |
| `<current bid>` | 505000 minor units (HKD 5,050.00) |
| `<next minimum>` | 513000 minor units (HKD 5,130.00), `<current bid>` plus its 8000 increment |
| `<bid count>` | 3 |

**Steps:**

1. Enter the row's amount entered in the custom maximum on the bid panel.
2. Place the bid.
3. Read the bid form.
4. Reload the lot page and read Highest bid, the bid count, Recent Bids and the bid panel's standing.
5. Navigate to `<my auctions url>` and look for `<listing_29>`.
6. Navigate to `<grade10 bids url>` and look for `<listing_29>`.

**Expected Results:**

* Step 3 shows the row's words on the bid form.
* Step 4 reads Highest bid `<current bid>`, bid count `<bid count>`, and Recent Bids as before, with no row for the customer.
* Step 4 shows no Leading or Outbid standing for the customer.
* Step 5 shows no row for `<listing_29>`.
* Step 6 shows no entry for `<listing_29>`.

### grade10-site-auction-auction-US14-TC2-1: A rival's refused bid moves nothing for the leader

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14

**Pre-conditions:**

* customer A leads `<listing_30>` at `<current bid>`, and is signed in on the lot page.
* customer B(card linked, no bid on `<listing_30>`) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_30>` | An open HKD listing led by customer A, maximum 800000 minor units (HKD 8,000.00) |
| `<current bid>` | 505000 minor units (HKD 5,050.00) |
| `<below minimum>` | 512900 minor units (HKD 5,129), one major unit below `<current bid>` plus its 8000 increment |

**Steps:**

1. As customer B, enter `<below minimum>` in the custom maximum and place the bid.
2. As customer A, read Highest bid, Recent Bids and the bid panel's standing, without reloading.
3. As customer A, navigate to `<my auctions url>` and read `<listing_30>`'s row.
4. As customer A, read their mailbox for a letter about `<listing_30>` sent after step 1.

**Expected Results:**

* Step 1 is refused on customer B's bid form.
* Step 2 reads Highest bid `<current bid>`, Recent Bids unchanged, and customer A still Leading.
* Step 3's row reads Leading, with Current bid `<current bid>`.
* Step 4 finds no new-bid or outbid letter.

### grade10-site-auction-auction-US14-TC3-1: A bid whose answer is lost reads by the bidder's standing

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
* **Trace:** grade10-site-auction-auction-US-14

**Pre-conditions:**

* customer(card linked) is signed in and on the lot page for `<listing_31>`, holding the row's standing before the bid.
* The network is manipulated to drop the bid at the row's point.

**Test data:**

| Standing before | Bid sent | Dropped | The bid form reads | Standing after |
| --- | --- | --- | --- | --- |
| No bid | A first maximum of `<maximum>` | The answer, after the auction accepts the bid | Placed, Leading with Your maximum `<maximum>` | Leading, Your maximum `<maximum>`, a row on My Auctions |
| No bid | A first maximum of `<maximum>` | The request, before the auction receives it | Could not place this bid. | No bid, no row on My Auctions |
| Leading, Your maximum `<maximum>` | A raise to `<raised maximum>` | The answer, after the auction accepts the raise | Placed, Leading with Your maximum `<raised maximum>` | Leading, Your maximum `<raised maximum>` |
| Leading, Your maximum `<maximum>` | A raise to `<raised maximum>` | The request, before the auction receives it | Could not place this bid. | Leading, Your maximum `<maximum>` |

| Field | Value |
| --- | --- |
| `<listing_31>` | An open HKD listing with no other bidder, starting price 20000 minor units (HKD 200.00) |
| `<maximum>` | 50000 minor units (HKD 500.00) |
| `<raised maximum>` | 80000 minor units (HKD 800.00) |

**Steps:**

1. Enter the row's bid in the custom maximum on the bid panel.
2. Place the bid.
3. Wait until the bid form settles.
4. Read the bid form.
5. Reload the lot page and read the bid panel's standing.
6. Navigate to `<my auctions url>` and look for `<listing_31>`.

**Expected Results:**

* Step 4 reads the row's words on the bid form, never both placed and refused.
* Step 5 reads the row's standing after.
* Step 6 agrees with the row's standing after.

---

## Settled

- Nothing is held or charged on a card when a collector bids; no case reads a card authorization, a payment confirmation, an Authorizing state or a bid-time hold switch, and every case that did is deprecated or rewritten here (decisions Q1, Q3, Q5).
- A refused high-value bid creates no auction bid, no My Auctions row and no Bidding History entry.
- A refused attempt writes nothing the bidder reads beyond the bid form; its operational log is the operators' record, has no customer surface, and takes no case in this suite (decisions Q6, Q7).
- The refusal words for no linked card and for another card after the first accepted bid are `grade10-site/auction/bid-payment-method`'s cases; the bar's refusal is US4's; a maximum not above the bidder's own is the domain suite's `grade10-site-auction-e2e-US04-TC03-2`.
- An erasure is run by the account-erasure procedure, which has no console surface, so the erased-leader cases run at the API layer.
- Concurrent bids keep their case under US2, now that US3 is retired: the lot's lock judges each bid against what the one before it committed.
- A first bid whose answer is lost still bookmarks the lot and shows no alerts toast; the retry follow-on change brings the toast back (decisions Q15).
- Re-standing a lot after an erasure writes no letter to its new leader (decisions Q16).

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-auction-SC-23` by `grade10-site-auction-auction-US2-TC5-2`; `grade10-site-auction-auction-SC-10`, moved to `grade10-site-auction-auction-US-02` with grade10-site-auction-auction-US-03 retired, by `grade10-site-auction-auction-US2-TC19-1`; `grade10-site-auction-auction-SC-86` by `grade10-site-auction-auction-US11-TC4-1`; `grade10-site-auction-auction-SC-16` by `grade10-site-auction-auction-US4-TC2-2`; `grade10-site-auction-auction-SC-89` by the first row of `grade10-site-auction-auction-US14-TC1-1`; `grade10-site-auction-auction-SC-90` by `grade10-site-auction-account-record-US2-TC6-1` and `grade10-site-auction-bidding-history-US1-TC7-1`; `grade10-site-auction-auction-SC-91` by the rows of `grade10-site-auction-auction-US14-TC1-1`, with the card refusals in `grade10-site-auction-bid-payment-method-US1-TC8-1` and `grade10-site-auction-bid-payment-method-US1-TC9-1` and the bar in `grade10-site-auction-auction-US4-TC2-2`; `grade10-site-auction-auction-SC-94` and `grade10-site-auction-auction-SC-95` by `grade10-site-auction-auction-US14-TC3-1`; `grade10-site-auction-auction-SC-96` by `grade10-site-auction-auction-US13-TC1-1`; `grade10-site-auction-auction-SC-101` by `grade10-site-auction-auction-US13-TC2-1`
- **Covered at domain** - `grade10-site-auction-e2e-US04-TC03-2` reads the bid form's words for a maximum not raised, the row of `grade10-site-auction-auction-SC-91` this suite leaves to it
- **Added by QA2** - `grade10-site-auction-auction-US13-TC3-1`, one row each for `grade10-site-auction-auction-SC-97`, `grade10-site-auction-auction-SC-98`, `grade10-site-auction-auction-SC-99` and `grade10-site-auction-auction-SC-100`: erasing a bidder who is not the leader, a leader whose maximum outgrew the price, and one maximum left. It also reads that the scheduled close does not move. No blind case erased anyone but the leader
- **Corrected** - `grade10-site-auction-auction-US13-TC2-1` read only that Highest bid is never above the price before; `grade10-site-auction-auction-SC-101` states no leader and no current bid, with the next bid at the opening price, and the case reads that. `grade10-site-auction-auction-US2-TC19-1` traced the Feature set group Card on file; it traces `grade10-site-auction-auction-US-02`
- **Revised** - `grade10-site-auction-auction-US2-TC5-2`, `grade10-site-auction-auction-US4-TC1-2` and `grade10-site-auction-auction-US4-TC2-2` stop reading a hold, so they move up a revision and back to draft. `grade10-site-auction-auction-US2-TC15-2`, `grade10-site-auction-auction-US2-TC16-2`, `grade10-site-auction-auction-US11-TC4-1`, `grade10-site-auction-auction-US11-TC5-1`, `grade10-site-auction-auction-US12-TC1-1` and `grade10-site-auction-auction-US12-TC2-1` lose the hold switch pre-condition only, a draft restyle with `<v>` kept
- **Deprecated** - every `grade10-site-auction-auction-US3` case, with its journey; `grade10-site-auction-auction-US11-TC1-1`, `grade10-site-auction-auction-US11-TC2-1`, `grade10-site-auction-auction-US11-TC3-1` and `grade10-site-auction-auction-US11-TC11-1`, which read a payment confirming around the close
- **Raised, answered** - Q15: a first bid whose answer is lost still bookmarks the lot, with no alerts toast. Q16: re-standing a lot after an erasure writes no letter to its new leader. Both as grade10 runs, recommended; answers in `## Settled`
- **Settled by the artifacts** - a refused attempt on a lot later sold leaves that collector reading as a non-bidder (Q6); an erasure never moves the close (the erasure requirement's rule 6); the refusal log names the floor or the ceiling the refusal names (the refusal requirement)
- **Out of suite** - `grade10-site-auction-auction-SC-92` and the invalid-amount row, which the bid form checks before sending, and the refusal order of `grade10-site-auction-auction-SC-91`: grade10's `bidRefusalCopy.test.ts` and `usePlaceBid.test.tsx`, since a person cannot make the auction send its own words or several refusals at once. `grade10-site-auction-auction-SC-93`: the operational log has no customer surface; grade10's refusal-log test, task 2.1. `grade10-site-auction-auction-SC-102`: grade10's `eraseBidder.spec.ts`, since the re-stood lot must then reach its close
- **Reworded** - `grade10-site-auction-auction-SC-04` and `grade10-site-auction-auction-SC-08` lose the card authorization from what they assert, "no accepted bid or card authorization" reading "no bid" and "card authorization facts" reading "card facts", with the same meaning; their coverage is as on main
- **Retired** - grade10-site-auction-auction-SC-67, grade10-site-auction-auction-SC-68 and grade10-site-auction-auction-SC-69, a payment confirming around the close, leave "A bid counts when it is accepted" (Q3); grade10-site-auction-auction-SC-09, grade10-site-auction-auction-SC-11, grade10-site-auction-auction-SC-12, grade10-site-auction-auction-SC-14 and grade10-site-auction-auction-SC-15 retire with their removed requirements. No retired id is reissued
- **Contradicted** - none
- **Uncovered anchors** - none. The window and settle scenarios changed only in their hold wording and their Serves lines, and the durable `grade10-site-auction-auction-US2` and `grade10-site-auction-auction-US11` cases still assert them; `grade10-site-auction-auction-SC-73` stays out of suite as main records
