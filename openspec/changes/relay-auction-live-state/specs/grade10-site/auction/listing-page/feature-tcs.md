# grade10-site/auction/listing-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-01, tcs-rules r4

## grade10-site-auction-listing-page-US12: Collector sees another bid on the lot without reloading

**As a** collector,
**I want** a bid placed on another page to show on mine with the new price and close, without a reload,
**so that** I bid against the price that stands.

### grade10-site-auction-listing-page-US12-TC1-1: Another session's bid shows its price and bid count without a reload

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>` and bid count `<bid count>`.
* customer A is on the lot page for `<listing_1>`.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open HKD listing with bids, scheduled close more than an hour away |
| `<current bid>` | 480000 minor units |
| `<bid count>` | 3 |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
2. As customer A, without reloading, read Highest bid, the bid count and Time left.

**Expected Results:**

* Highest bid reads `<bid amount>` on customer A's page.
* The bid count reads `<bid count>` plus 1.
* Time left still counts to the scheduled close.
* customer A's page did not reload.

### grade10-site-auction-listing-page-US12-TC2-1: Scheduled close with a bid turns to Extended bidding without a reload

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

* `<listing_2>` is open with one accepted bid, its scheduled close under a minute away.
* customer A is on the lot page for `<listing_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | An open HKD listing with one accepted bid, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |

**Steps:**

1. Watch Time left through the scheduled close, without reloading.
2. Read Time left and its label.

**Expected Results:**

* Time left never reads Closed at the scheduled close.
* Time left is labelled Extended bidding and counts to the scheduled close plus `<extension duration>`.
* The page did not reload.

### grade10-site-auction-listing-page-US12-TC3-1: A page with no live line still catches up without a reload

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>`.
* customer A is on the lot page for `<listing_1>`, under `<condition>`.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| `<condition>` |
| --- |
| The browser's live connection to the auction is blocked |
| The `auction.realtime` flag is off |

| Field | Value |
| --- | --- |
| `<listing_1>` | An open HKD listing with bids, scheduled close more than an hour away |
| `<current bid>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
2. As customer A, wait on the page without reloading.
3. Read Highest bid and the bid count.

**Expected Results:**

* Highest bid reads `<bid amount>` and the bid count includes customer B's bid.
* customer A's page did not reload.

### grade10-site-auction-listing-page-US12-TC4-1: A page that lost its line catches up when it returns

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_1>` is open, before its scheduled close, with Highest bid `<current bid>`.
* customer A is on the lot page for `<listing_1>`.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open HKD listing with bids, scheduled close more than an hour away |
| `<current bid>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Take customer A's browser offline.
2. As customer B, enter `<bid amount>` in the custom maximum on the bid panel and confirm the bid.
3. Bring customer A's browser back online, without reloading.
4. As customer A, read Highest bid and the bid count.

**Expected Results:**

* Highest bid reads `<bid amount>` and the bid count includes customer B's bid.
* customer A's page did not reload.

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

* Bid-time holds are off.
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

### grade10-site-auction-listing-page-US12-TC6-1: Live updates name no bidder and no maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* customer A(signed in) leads `<listing_8>` with maximum `<user A maximum>`.
* customer C(signed out) is on the lot page for `<listing_8>`, with the browser's network inspector recording its live connection.
* customer B(card linked) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | An open HKD listing, scheduled close more than an hour away |
| `<user A maximum>` | 900000 minor units |
| `<user B maximum>` | 600000 minor units, below `<user A maximum>` |

**Steps:**

1. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
2. As customer C, read every message the live connection received after step 1.

**Expected Results:**

* Step 2 shows an update carrying the new price, bid count and close.
* No message carries `<user A maximum>`, an account id, an email or a card detail.
* Any bidder a message names appears only by the lot's pseudonym.

---

## grade10-site-auction-listing-page-US13: Collector reads the same time left as every other page

**As a** collector,
**I want** the lot's countdown to agree with every other page on that lot, whatever my device's clock says,
**so that** the time I see left is the time I have.

### grade10-site-auction-listing-page-US13-TC1-1: Countdown agrees across devices whose clocks disagree

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-listing-page-US-13

**Pre-conditions:**

* `<listing_3>` is open, its close about 10 minutes away.
* customer A is on the lot page for `<listing_3>` on a device whose clock is `<device skew>`.
* customer B is on the same lot page on a device whose clock is correct.

**Test data:**

| `<device skew>` |
| --- |
| 5 minutes ahead |
| 5 minutes behind |

| Field | Value |
| --- | --- |
| `<listing_3>` | An open HKD listing, close about 10 minutes away |

**Steps:**

1. Read Time left on customer A's page and customer B's page at the same moment.
2. Wait 1 minute.
3. Read Time left on both pages at the same moment.

**Expected Results:**

* Both pages read the same Time left, to the second, at step 1.
* Both pages read the same Time left, to the second, at step 3.
* Neither page is off by `<device skew>`.

### grade10-site-auction-listing-page-US13-TC2-1: Last second never reads 0 while the lot takes bids

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-13

**Pre-conditions:**

* `<listing_4>` is open with no accepted bid, its close under a minute away.
* customer A is on the lot page for `<listing_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An open HKD listing with no bids, extension duration 1800s (30mins) |
| `<last moment>` | 0.4 seconds before the close |

**Steps:**

1. Watch Time left from 10 seconds before the close.
2. Read Time left at `<last moment>`.
3. Read Time left just after the close passes.

**Expected Results:**

* Through step 1 Time left shows whole seconds only, never tenths.
* At step 2 Time left reads 1 second, never 0.
* At step 3 Time left reads 0 or the lot reads Closed.

### grade10-site-auction-listing-page-US13-TC3-1: Countdown corrects itself after the page was away

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
* **Trace:** grade10-site-auction-listing-page-US-13

**Pre-conditions:**

* `<listing_3>` is open, its close about 10 minutes away.
* customer A is on the lot page for `<listing_3>`.
* customer B is on the same lot page on a device whose clock is correct.

**Test data:**

| `<away>` |
| --- |
| customer A's device sleeps for 1 minute |
| customer A's browser goes offline for 1 minute, then reconnects |
| customer A switches to another tab for 1 minute, then back |

| Field | Value |
| --- | --- |
| `<listing_3>` | An open HKD listing, close about 10 minutes away |
| `<clock change>` | customer A's device clock set 2 minutes ahead |

**Steps:**

1. Make `<clock change>` while `<away>`.
2. Return to the lot page, without reloading.
3. Read Time left on customer A's page and customer B's page at the same moment.

**Expected Results:**

* Both pages read the same Time left, to the second.

### grade10-site-auction-listing-page-US13-TC4-1: A sub-second correction never makes the countdown jump up

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-13

**Pre-conditions:**

* `<listing_3>` is open, its close about 10 minutes away.
* customer A is on the lot page for `<listing_3>`.
* The auction service's time, read on customer A's return, is `<correction>` earlier than the page's countdown assumes, so the new reading would add time.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An open HKD listing, close about 10 minutes away |
| `<correction>` | 0.6 seconds, under a second |

**Steps:**

1. Switch to another tab.
2. Switch back to the lot page.
3. Watch Time left for 5 seconds.

**Expected Results:**

* Time left never reads a higher value than it read the moment before.

---

## grade10-site-auction-listing-page-US14: Bidder waits on a closed lot for its result

**As a** bidder,
**I want** a lot past its close to read Closed until its result is recorded, then Won or Did not win,
**so that** I am never shown a result the auction has not decided.

### grade10-site-auction-listing-page-US14-TC1-1: Closed shows until the close is recorded, then the result

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* `<listing_5>` is in the state the row gives, its close under a minute away, and no further bid will be placed.
* `<viewer>` is signed in and on the lot page for `<listing_5>`.

**Test data:**

| `<listing_5>` | `<viewer>` | `<result>` |
| --- | --- | --- |
| Led by customer A | customer A | Won |
| Led by customer A, customer B outbid | customer B | Did not win |
| Open with no accepted bid | customer A | Ended, with No bids under it |

**Steps:**

1. Watch the lot through its close, without reloading.
2. Read the lot's state until the result appears.

**Expected Results:**

* Once the close passes, the page reads Closed with no result.
* The page then reads `<result>`, without a reload.

### grade10-site-auction-listing-page-US14-TC2-1: A delayed close keeps Closed and never guesses a result

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* customer A leads `<listing_6>` and is on its lot page.
* `<listing_6>`'s close is under a minute away, and no further bid will be placed.
* Recording `<listing_6>`'s close is held back until the next sweep.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | An HKD listing led by customer A |

**Steps:**

1. Watch the lot through its close, without reloading.
2. Wait 30 seconds.
3. Reload the lot page.
4. Wait until the close is recorded.

**Expected Results:**

* Through steps 1 to 3 the page reads Closed with no result.
* No step shows Won, Did not win or Ended before the close is recorded.
* After step 4 the page reads Won, without a reload.

### grade10-site-auction-listing-page-US14-TC3-1: A bid still confirming at the close reads in existing words

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

### grade10-site-auction-listing-page-US14-TC4-1: A bid reaching the auction after the close reads in existing words

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

* Bid-time holds are off.
* customer B leads `<listing_9>` at `<leader price>`, its close under a minute away.
* customer A(card linked) is signed in and on the lot page for `<listing_9>`.
* customer A's bid requests are delayed so they reach the auction 10 seconds after they are sent.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | An HKD listing in extended bidding, led by customer B, no cap |
| `<leader price>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Place `<bid amount>` 3 seconds before the close.
2. Wait until the close is recorded.
3. Read the bid panel and the lot's state.

**Expected Results:**

* The bid panel reads "Your bid did not go through." alone, never "The card was not authorized."
* No new label or wording appears for the late bid.
* Highest bid reads `<leader price>`, and the lot reads Did not win for customer A.

### grade10-site-auction-listing-page-US14-TC5-1: A lone first bid still confirming at the close leaves the lot Ended with No bids

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* Bid-time holds are on.
* `<listing_10>` is open with no accepted bid, its scheduled close under a minute away.
* customer A(card linked) is signed in and on the lot page for `<listing_10>`.
* customer A's card authorization is held until after the scheduled close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | An open HKD listing with no bids, starting price 20000 minor units, extension duration 1800s (30mins), no cap |
| `<bid amount>` | 20000 minor units, the opening price |

**Steps:**

1. Place `<bid amount>` 5 seconds before the scheduled close.
2. Read the bid panel.
3. Wait until the close is recorded, without reloading.
4. Read the bid panel and the lot's state.

**Expected Results:**

* At step 2 the bid panel reads Authorizing….
* Time left never reads Extended bidding at the scheduled close.
* At step 4 the lot reads Ended, with No bids under it, and neither Won nor Did not win.
* At step 4 the bid panel reads "Your bid did not go through." alone, never "The card was not authorized."

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

* Bid-time holds are off.
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

## Reconciliation

**Run:** QA2 rerun, 2026-10-01, for change `relay-auction-live-state`. Joined QA1's blind cases, written from the re-frozen anchors (Purpose, Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` with `## Raised`, and the change's `domain-tcs.md`), with the delta scenarios SC-29 to SC-46, `tech-design.md` and `tasks.md`. QA1 was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive. QA2 added US14-TC5 and US14-TC6 for scenarios no blind case reached.

| Finding | Disposition |
| --- | --- |
| US12-TC1: another session's bid shows price and bid count without a reload | **Folded in:** `grade10-site-auction-listing-page-SC-29` |
| US12-TC2: the scheduled close with a bid turns to Extended bidding | **Folded in:** `grade10-site-auction-listing-page-SC-31` |
| US12-TC3: a page with the live line blocked, or `auction.realtime` off, catches up by polling | **Folded in:** `grade10-site-auction-listing-page-SC-32`; the flag-off row also walks `grade10-site-auction-auction-SC-77` |
| US12-TC4: a page that lost its line catches up when it returns | **Folded in:** `grade10-site-auction-listing-page-SC-41` |
| US12-TC5: the leader's standing turns to Outbid with the next valid bid, without a reload | **Folded in:** `grade10-site-auction-listing-page-SC-43` (Q12) |
| US12-TC6: live updates carry no maximum, account, email or card | **Folded in:** `grade10-site-auction-listing-page-SC-43` (AND clause); the frame contract is `grade10-site-auction-auction-SC-76` |
| US13-TC1: countdowns agree across devices whose clocks disagree | **Folded in:** `grade10-site-auction-listing-page-SC-33` |
| US13-TC2: the last second reads 1, whole seconds only | **Folded in:** `grade10-site-auction-listing-page-SC-34`, `grade10-site-auction-listing-page-SC-44` (Q31) |
| US13-TC3: sleep, reconnect and a tab return re-read the clock | **Folded in:** `grade10-site-auction-listing-page-SC-35` |
| US13-TC4: a sub-second correction never raises the countdown | **Folded in:** `grade10-site-auction-listing-page-SC-36` |
| US14-TC1: Closed with no result until recorded, then Won, Did not win, or Ended with No bids | **Folded in:** `grade10-site-auction-listing-page-SC-37`, `grade10-site-auction-listing-page-SC-38`, `grade10-site-auction-listing-page-SC-40`; the no-bid row is the requirement's No winner row |
| US14-TC2: a close held to the sweep keeps Closed through a reload and never guesses | **Folded in:** `grade10-site-auction-listing-page-SC-37`, `grade10-site-auction-listing-page-SC-40` |
| US14-TC3: a hold confirming after the close reads "Your bid did not go through." alone, then Did not win | **Folded in:** `grade10-site-auction-listing-page-SC-39` (Q13) |
| US14-TC4: a bid reaching the auction after the close reads the same words alone | **Folded in:** `grade10-site-auction-listing-page-SC-45` (Q13) |
| `grade10-site-auction-listing-page-SC-46`: a lone first bid confirming at the scheduled close; no blind case walked the pending bid | **Added:** `grade10-site-auction-listing-page-US14-TC5-1`. It also answers QA1's third raised question on the lot page: Ended with No bids, neither Won nor Did not win (Q1) |
| `grade10-site-auction-listing-page-SC-42`: a later recorded close returns a Closed page to Extended bidding; no blind case reached it | **Added:** `grade10-site-auction-listing-page-US14-TC6-1` |

- **Covered at domain** — `grade10-site-auction-e2e-US07-TC03-2` walks `grade10-site-auction-listing-page-SC-30`: a price-moving bid in extended bidding restarts the open page's countdown, labelled Extended bidding, without a reload

**Uncovered anchors:** none. `grade10-site-auction-listing-page-US-04` is a context journey; this change adds no scenario serving it, and its durable cases stand.
