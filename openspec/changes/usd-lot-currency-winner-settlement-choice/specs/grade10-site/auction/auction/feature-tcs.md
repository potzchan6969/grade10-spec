# grade10-site/auction/auction Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-10-13, tcs-rules r5

## g10.auction-auction.US4: Collector meets the identity bar on a high-value bid

**As a** collector bidding the bar or more on a lot,
**I want** to be told at once that a verified identity is needed and where to get one,
**so that** the auction records nothing for a bid it cannot take, and I can verify and bid again before the lot closes.

<!-- trace:case id=g10.auction-auction.TC-zsd rev=3 covers=g10.auction-auction.SC-d78 -->
### g10.auction-auction.US4-TC1: Verified bidder's bid at the bar is forwarded as any other

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
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
| `<bar>` | USD15,000 (fixed configured value), the bar Grade10 sets on a bid |
| `<listing_12>` | A live USD listing whose minimum next bid is `<bar>` |
| `<bid at the bar>` | USD15,000 (fixed boundary or equality), equal to `<bar>` |

**Steps:**

1. Enter `<bid at the bar>` in the bid field and select **Place Bid**.
2. Read Highest bid and the bid count.
3. Read `<card>`'s activity at the card provider.

**Expected Results:**

* The bid is forwarded and accepted as any other - no refusal names a verified identity.
* Highest bid reads `<bid at the bar>`, and the bid count rises by one.
* Step 3 shows nothing held or charged on `<card>`.

<!-- trace:case id=g10.auction-auction.TC-5gi rev=3 covers=g10.auction-auction.SC-uhh,g10.auction-auction.SC-l64 -->
### g10.auction-auction.US4-TC2: Bidder without a verified standing is held at the storefront at and above the bar

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
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
| `unverified` | USD15,000 (fixed boundary or equality), exactly `<bar>` | Refused; no bid recorded |
| `unverified` | USD15,200 (range: >1500000 minor units), above `<bar>` | Refused; no bid recorded |
| `expired` | USD15,000 (fixed boundary or equality), exactly `<bar>` | Refused; no bid recorded |
| `expired` | USD15,200 (range: >1500000 minor units), above `<bar>` | Refused; no bid recorded |

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<bar>` | USD15,000 (fixed configured value), the bar Grade10 sets on a bid |
| `<listing_12>` | A live USD listing whose minimum next bid is `<bar>` |

**Steps:**

1. Enter the bid amount the row names in the bid field and select **Place Bid**.
2. Read the refusal on the bid form.
3. Reload `<listing_12>` and read Highest bid and the bid count.
4. Navigate to `<my auctions url>` and look for `<listing_12>`.
5. Navigate to `<grade10 bids url>` and look for `<listing_12>`.

**Expected Results:**

* The bid is refused as needing a verified identity, and the form says: Bids this high need a verified identity. Verify from your account, then bid again.
* Highest bid and the bid count are unchanged; the auction records no bid.
* Step 4 shows no row for `<listing_12>`.
* Step 5 shows no entry for `<listing_12>`.

<!-- trace:case id=g10.auction-auction.TC-49i rev=2 covers=g10.auction-auction.SC-ndj,g10.auction-auction.SC-99a -->
### g10.auction-auction.US4-TC3: Bid below the bar asks nothing of any bidder

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

* The user is signed in with `<card>` saved on an account whose standing is the one the row names, and is on `<listing_13>`.
* `<listing_13>` is live, inside its window, in USD, and its minimum next bid is at or below the bid amount the row names.

**Test data:**

| Standing | Bid amount | Outcome |
| --- | --- | --- |
| `unverified` | USD520 (range: >0 and <1500000 minor units) | Forwarded; no standing read |
| `expired` | USD520 (range: >0 and <1500000 minor units) | Forwarded; no standing read |
| `verified` | USD520 (range: >0 and <1500000 minor units) | Forwarded; no standing read |
| `unverified` | USD14,999.00 (fixed boundary or equality), one dollar below `<bar>` | Forwarded; no standing read |
| `unverified` | USD14,999.99 (fixed boundary or equality), one cent below `<bar>` | Forwarded; no standing read |

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<bar>` | USD15,000 (fixed configured value), the bar Grade10 sets on a bid |

**Steps:**

1. Enter the bid amount the row names in the bid field and select **Place Bid**.
2. Read Highest bid.
3. Read the calls the run made to the identity store.

**Expected Results:**

* The bid is forwarded and accepted, and Highest bid reads the bid amount the row names.
* No standing was read.

## Settled

- None this run. The blind reading's one question, whether the US$15,000 figure is a requirement of this capability, went to `decisions.md` `## Raised` and landed as Q22.

## Reconciliation

See `openspec/changes/usd-lot-currency-winner-settlement-choice/qa2-site-shared.md` for this QA2 run’s full case and scenario dispositions, coverage limits, and remaining unchanged gap.
