# grade10-site/auction/auction Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-05, tcs-rules r2

## grade10-site-auction-auction-US4: Collector meets the identity bar on a high-value bid

**As a** collector bidding the bar or more on a lot,
**I want** to be told at once that a verified identity is needed and where to get one,
**so that** my card is not held for a bid the auction cannot take, and I can verify and bid again before the lot closes.

### grade10-site-auction-auction-US4-TC1-1: Verified bidder's bid at the bar is forwarded as any other

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

* The user is signed in on `<a verified account>` with `<card>` saved, and is on `<listing_1>`.
* `<listing_1>` is live, inside its window, and its minimum next bid is `<bar>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a verified account>` | An account whose standing is `verified` on the day of the bid |
| `<card>` | Visa ending 4242 |
| `<bar>` | 12000000 HKD minor units (HKD 120,000.00), the bar Grade10 sets on a bid |
| `<listing_1>` | A live listing in HKD whose minimum next bid is `<bar>` |
| `<bid at the bar>` | 12000000 minor units, equal to `<bar>` |

**Steps:**

1. Enter `<bid at the bar>` in the bid field and select **Place Bid**.
2. Read Highest bid and the bid count.

**Expected Results:**

* The bid is forwarded and accepted as any other — no refusal names a verified identity.
* Highest bid reads `<bid at the bar>`, and one hold for it stands against `<card>`.

### grade10-site-auction-auction-US4-TC2-1: Bidder without a verified standing is held at the storefront at and above the bar

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

* The user is signed in with `<card>` saved on an account whose standing is the one the row names, and is on `<listing_1>`.
* `<listing_1>` is live, inside its window, and its minimum next bid is `<bar>`.

**Test data:**

| Standing | Bid amount | Outcome |
| --- | --- | --- |
| `unverified` | 12000000 minor units, exactly `<bar>` | Refused; no bid recorded, no hold taken |
| `unverified` | 12500000 minor units, above `<bar>` | Refused; no bid recorded, no hold taken |
| `expired` | 12000000 minor units, exactly `<bar>` | Refused; no bid recorded, no hold taken |
| `expired` | 12500000 minor units, above `<bar>` | Refused; no bid recorded, no hold taken |

**Steps:**

1. Enter the bid amount the row names in the bid field and select **Place Bid**.
2. Read the refusal.
3. Reload `<listing_1>` and read Highest bid and the bid count.

**Expected Results:**

* The bid is refused as needing a verified identity, and the refusal says to verify from the account.
* Highest bid and the bid count are unchanged — the auction records no bid.
* No hold is taken against `<card>`.

### grade10-site-auction-auction-US4-TC3-1: Bid below the bar asks nothing of any bidder

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
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* The user is signed in with `<card>` saved on an account whose standing is the one the row names, and is on `<listing_2>`.
* `<listing_2>` is live, inside its window, in HKD, and its minimum next bid is at or below the bid amount the row names.

**Test data:**

| Standing | Bid amount | Outcome |
| --- | --- | --- |
| `unverified` | 505000 minor units, below `<bar>` | Forwarded as any other; no standing read |
| `expired` | 505000 minor units, below `<bar>` | Forwarded as any other; no standing read |
| `verified` | 505000 minor units, below `<bar>` | Forwarded as any other; no standing read |

**Steps:**

1. Enter the bid amount the row names in the bid field and select **Place Bid**.
2. Read Highest bid.
3. Read the calls the run made to the identity store.

**Expected Results:**

* The bid is forwarded and accepted as any other, and Highest bid reads the bid amount the row names.
* No standing was read.
