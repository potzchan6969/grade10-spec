# grade10-site/auction/listing-page Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-listing-page-US12: Collector sees another bid on the lot without reloading

**As a** collector,
**I want** a bid placed on another page to show on mine with the new price and close, without a reload,
**so that** I bid against the price that stands.

### grade10-site-auction-listing-page-US12-TC5-1: Leader's own standing turns to Outbid without a reload

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* customer A(signed in) leads `<listing_8>` at `<current bid>` with maximum `<user A maximum>`, and is on its lot page.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | An open HKD listing, scheduled close more than an hour away |
| `<current bid>` | 480000 minor units |
| `<user A maximum>` | 500000 minor units |
| `<user B maximum>` | 600000 minor units, above `<user A maximum>` |
| `<increment>` | 8000 minor units (HKD 80.00), the HK$4,000 tier |

**Steps:**

1. As customer A, read the standing on the bid panel.
2. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
3. As customer A, without reloading, read the standing, Highest bid and the next valid bid.

**Expected Results:**

* Step 1 reads Leading, with Your maximum `<user A maximum>`.
* Step 3 reads Outbid, with no reload.
* Step 3 reads Highest bid `<user A maximum>` plus `<increment>`.
* Step 3 shows the next valid bid, Highest bid plus its increment.

---

## grade10-site-auction-listing-page-US14: Bidder waits on a closed lot for its result

**As a** bidder,
**I want** a lot past its close to read Closed until its result is recorded, then Won or Did not win,
**so that** I am never shown a result the auction has not decided.

### grade10-site-auction-listing-page-US14-TC3-1: A bid still confirming at the close reads in existing words

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* Bid-time holds are on.
* customer B leads `<listing_7>`, its close under a minute away.
* customer A(card linked) is signed in and on the lot page for `<listing_7>`.
* customer A's card authorization is held until after the close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | An HKD listing in extended bidding, led by customer B |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Place `<bid amount>` 5 seconds before the close.
2. Read the bid panel.
3. Wait until the close is recorded.
4. Read the bid panel and the lot's state.

**Expected Results:**

* At step 2 the bid panel reads Authorizing….
* At step 4 the bid panel reads "Your bid did not go through." alone, never "The card was not authorized."
* The lot reads Did not win for customer A, with customer B's price as Highest bid.

### grade10-site-auction-listing-page-US14-TC4-2: A bid reaching the auction after the close reads in existing words

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* customer B leads `<listing_9>` at `<leader price>`, its close under a minute away.
* customer A(card linked) is signed in and on the lot page for `<listing_9>`, and has never bid on it.
* Once the page has loaded, customer A's browser blocks the auction's time route, live socket and lot reads, and its device clock runs 30 seconds behind the auction's, so the page keeps its bid controls enabled past the close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | An HKD listing in extended bidding, led by customer B, no cap |
| `<leader price>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Wait until 5 seconds after the close, by the auction's clock.
2. Place `<bid amount>`.
3. Read the bid panel.
4. Unblock the auction, reload the lot page and wait until the close is recorded.
5. Read the lot's state and the bid panel.

**Expected Results:**

* At step 3 the bid panel reads "Your bid did not go through." alone.
* No new label or wording appears for the refused bid.
* At step 5 Highest bid reads `<leader price>`.
* At step 5 customer A's page shows neither Won nor Did not win.

### grade10-site-auction-listing-page-US14-TC5-2: A lone first bid refused past the close leaves the lot Ended with No bids

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* `<listing_10>` is open with no accepted bid, its scheduled close under a minute away.
* customer A(card linked) is signed in and on the lot page for `<listing_10>`.
* Once the page has loaded, customer A's browser blocks the auction's time route, live socket and lot reads, and its device clock runs 30 seconds behind the auction's, so the page keeps its bid controls enabled past the close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | An open HKD listing with no bids, starting price 20000 minor units, extension duration 1800s (30mins), no cap |
| `<bid amount>` | 20000 minor units, the opening price |

**Steps:**

1. Wait until 5 seconds after the scheduled close, by the auction's clock.
2. Place `<bid amount>`.
3. Read the bid panel.
4. Unblock the auction, reload the lot page and wait until the close is recorded.
5. Read Time left, the lot's state and the bid panel.

**Expected Results:**

* At step 3 the bid panel reads "Your bid did not go through." alone.
* At step 5 Time left never read Extended bidding.
* At step 5 the lot reads Ended, with No bids under it.
* At step 5 the page shows neither Won nor Did not win.

### grade10-site-auction-listing-page-US14-TC6-1: A later close turns a Closed page back to Extended bidding

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* `<listing_11>` is in extended bidding, led by customer B, its recorded close under a minute away.
* customer A is on the lot page for `<listing_11>`, with its live updates delayed by 5 seconds.
* customer C(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | An HKD listing in extended bidding, led by customer B, extension duration 1800s (30mins), no cap |
| `<bid amount>` | At or above the minimum next bid |

**Steps:**

1. As customer C, place `<bid amount>` 1 second before the recorded close.
2. As customer A, watch Time left through the recorded close, without reloading.
3. As customer A, read the lot's state and the bid panel once the update arrives.

**Expected Results:**

* Once the close it counted to passes, customer A's page reads Closed with no result and its bid controls disabled.
* At step 3 Time left is labelled Extended bidding and counts to customer C's bid time plus 1800s.
* At step 3 the bid controls are enabled.
* No step shows Won, Did not win or Ended, and the page did not reload.

## Settled

- A bid takes no card hold, so no bid is still confirming at the close: a bid is accepted or refused in one answer, and the lot page never reads Authorizing… (decisions Q3).
- A bid refused past the close is not a bid: the bid form says "Your bid did not go through." and the lot's result is decided as if it was never sent (decisions Q6).

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-listing-page-SC-45` by `grade10-site-auction-listing-page-US14-TC4-2`; `grade10-site-auction-listing-page-SC-47` by the No bids row of the durable `grade10-site-auction-listing-page-US14-TC1-1`, which reads Ended with No bids without a reload, and by `grade10-site-auction-listing-page-US14-TC5-2` for a refused bid past the close
- **Revised** - `grade10-site-auction-listing-page-US14-TC4-2` adds that a bidder whose only bid was refused past the close reads neither Won nor Did not win; `grade10-site-auction-listing-page-US14-TC5-2` replaces a bid still confirming at the close with a bid refused past it. QA1 kept their ids; both move up a revision. `grade10-site-auction-listing-page-US12-TC5-1` and `grade10-site-auction-listing-page-US14-TC6-1` lose the hold switch pre-condition only, `<v>` kept
- **Deprecated** - `grade10-site-auction-listing-page-US14-TC3-1`, a bid still confirming at the close
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none
