# grade10-site/auction/auction Test Cases

**Status:** in-review
**Reviewed:** 2026-09-10, tcs-rules r3.0

## grade10-site-auction-auction-US2: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a bid accepted only when it meets the increment inside the scheduled window,
**so that** a late valid bid can extend the close without passing the cap.

### grade10-site-auction-auction-US2-TC1-1: Late bid extends the close by the listing duration

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**
An open listing whose extension window is 1800 seconds and extension duration is 1800 seconds, with 1800 seconds or less until its recorded close.

**Steps:**

1. Submit a valid bid at time T.
2. Read the listing's recorded close.

**Expected Results:**

* Grade10 accepts the bid.
* The listing close becomes T plus 1800 seconds.

### grade10-site-auction-auction-US2-TC2-1: Extension cap limits an otherwise eligible extension

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**
An open listing with an extension cap and a recorded close already at that cap.

**Steps:**

1. Submit a valid bid inside the listing's extension window.
2. Read the listing's recorded close.

**Expected Results:**

* Grade10 accepts the bid.
* The recorded close does not move beyond the configured cap.

### grade10-site-auction-auction-US2-TC3-1: Window and duration may differ

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**
An open listing whose extension window is 300 seconds and extension duration is 1800 seconds, with 300 seconds or less remaining.

**Steps:**

1. Submit a valid bid at time T with 300 seconds or less remaining.
2. Read the listing's recorded close.
3. Submit another valid bid with more than 300 seconds remaining before the new close.

**Expected Results:**

* The first bid moves the close to T plus 1800 seconds.
* The second bid does not extend the close.

### grade10-site-auction-auction-US2-TC4-1: Extension off does not move the close

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**
An open listing whose extension window and extension duration are both zero, with one second remaining.

**Steps:**

1. Submit a valid bid.
2. Read the listing's recorded close.

**Expected Results:**

* Grade10 accepts the bid.
* The recorded close is unchanged.

---

## grade10-site-auction-auction-US1: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

### grade10-site-auction-auction-US1-TC1-1: Public listing read exposes extension policy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**
A published listing with extension window 1800 seconds, extension duration 1800 seconds, and an optional extension cap.

**Steps:**

1. Read the public listing contract.

**Expected Results:**

* The contract uses listing and extension terminology.
* It exposes extension window, extension duration, and extension cap when set.
* It exposes no reserve state.

---

## grade10-site-auction-auction-US3: Collector's card hold is released when they are outbid

**As a** bidder,
**I want** one authorization per listing, released when I am outbid,
**so that** a delayed lower hold or a duplicate Stripe event cannot take a second bite.

### grade10-site-auction-auction-US3-TC1-1: Outbid authorization is marked for release

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
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
* **Status:** actual
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
* **Status:** actual
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
* **Status:** actual
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
* **Status:** actual
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
* **Status:** actual
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

### grade10-site-auction-auction-US2-TC5-1: The default bid path creates no authorization hold

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

* Bid-time authorization holds are disabled.
* A collector is signed in on an open listing with a valid linked card.

**Steps:**

1. Submit a valid bid on the open listing.
2. Read the bid result and the listing's bid-time authorizations.

**Expected Results:**

* Grade10 accepts the bid according to the listing's bid rules without waiting for Stripe.
* No bid-time authorization is created.
