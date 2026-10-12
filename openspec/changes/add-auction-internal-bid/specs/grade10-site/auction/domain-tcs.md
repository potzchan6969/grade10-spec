# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-auction-e2e-US13: Collectors bid against a house maximum through the close

**As a** collector,
**I want** to compete for a lot to its close, with each bid, extension, result and letter decided by the auction rules,
**so that** what I read, and what I am told, is what the auction decided.

<!-- trace:case id=g10.auction-domain.TC-88l rev=1 covers=g10.auction-auto-bidding.SC-99a,g10.auction-notifications.SC-kl5,g10.auction-auction.SC-a4f,g10.auction-notifications.SC-xy1,g10.auction-notifications.SC-14x -->
### grade10-site-auction-e2e-US13-TC01-1: The house outbids a collector and the lot closes sold under its pseudonym

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
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-notifications-US-03, grade10-site-auction-auction-US-01, grade10-site-auction-auction-US-11, grade10-site-auction-notifications-US-06, grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer A(card linked) leads <listing_17> at <starting price> with maximum <user A maximum>, email alerts on, and will not bid again.
* <listing_17> has an internal bid of <house maximum>, its <commit time> still ahead.
* customer D watches <listing_17>, email alerts on, and will not bid.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_17> | A published HKD listing, starting price <starting price>, extension duration <extension duration>, no cap |
| <starting price> | 400000 minor units (HK$4,000.00) |
| <house maximum> | 600000 minor units (HK$6,000.00) |
| <user A maximum> | 500000 minor units (HK$5,000.00), below <house maximum> |
| <final price> | 508000 minor units: <user A maximum> plus its 8000 increment |
| <commit time> | 5 minutes before the scheduled close |
| <extension duration> | 1800s (30mins) |

**Steps:**

1. Wait until <commit time> passes.
2. As customer A, read the standing, Highest bid and Recent bids on the lot page for <listing_17>.
3. Read the mail sent to customer A.
4. Wait through the scheduled close and the extended close, with no further bid.
5. As customer A, read the lot's state.
6. As customer A, navigate to <grade10 my auctions url>, select the Ended tab and find <listing_17>'s row.
7. Read the mail sent to customer A and customer D at the close.

**Expected Results:**

* Step 2 reads Outbid, Highest bid <final price>.
* Step 2: Recent bids lists customer A at <starting price>, then the house at <final price> under its listing pseudonym.
* Step 3: one You have been outbid letter, and no New bid letter.
* Step 4: the lot enters extended bidding at the scheduled close and closes <extension duration> after it.
* Step 5 reads Did not win, sold at <final price>, the crowned row the house's pseudonym.
* Step 6's row reads Didn't win, with Current bid <final price> and "Your card was not charged."
* Step 7: customer A gets one You did not win letter with Winning bid <final price>; customer D gets one Lot watched, sold letter with Sold for <final price>.

<!-- trace:case id=g10.auction-domain.TC-su0 rev=1 covers=g10.auction-auction.SC-fec -->
### grade10-site-auction-e2e-US13-TC02-1: A collector beats the house in extended bidding and wins

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
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-12, grade10-site-auction-auction-US-11, grade10-site-auction-auction-US-01

**Pre-conditions:**

* <listing_18>'s internal bid of <house maximum> is committed, and the house leads at <leader price> over customer A's maximum <user A maximum>.
* <listing_18> is in extended bidding with its recorded close <time left before bid> away.
* customer B(card linked) is signed in on the lot page for <listing_18>, on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_18> | A published HKD listing in extended bidding, extension duration <extension duration>, no cap |
| <house maximum> | 600000 minor units (HK$6,000.00) |
| <user A maximum> | 500000 minor units (HK$5,000.00) |
| <leader price> | 508000 minor units: <user A maximum> plus its 8000 increment |
| <user B maximum> | 700000 minor units, above <house maximum> |
| <final price> | 608000 minor units: <house maximum> plus its 8000 increment |
| <extension duration> | 1800s (30mins) |
| <time left before bid> | 5 minutes |

**Steps:**

1. As customer B, enter <user B maximum> in the custom maximum on the bid panel and confirm.
2. As customer B, read the standing, Highest bid and Time left.
3. Wait through the recorded close, with no further bid.
4. As customer B, read the lot's state.
5. As customer B, navigate to <grade10 my auctions url>, select the Ended tab and find <listing_18>'s row.

**Expected Results:**

* Step 2 reads Leading, Highest bid <final price>.
* Step 2: Time left reads <extension duration> from customer B's bid.
* Step 4 reads Won, with Highest bid <final price>.
* Step 5's row reads Won with View order, Current bid <final price>.

## Reconciliation

**Run:** QA2, 2026-10-08. QA1's levels pass composed these paths from every `user-journeys.md` in the domain and the domain's PRD pages, before the feature readings and without any `## Requirements` section, `tech-design.md` or the archive. QA2 joined each composed case to the scenarios its journeys accept, after Q26 to Q29 landed. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-e2e-US13-TC01-1` walks the house's commit, the outbid letter, extended bidding and the close, asserting `grade10-site-auction-auto-bidding-SC-33`, `grade10-site-auction-notifications-SC-49`, `grade10-site-auction-auction-SC-103`, `grade10-site-auction-notifications-SC-50` and `grade10-site-auction-notifications-SC-51`; `grade10-site-auction-e2e-US13-TC02-1` walks a collector beating the house in extended bidding, asserting `grade10-site-auction-auction-SC-02` and the durable extended-bidding rule
- **Anchors** - QA2 round 4: `grade10-site-auction-auction-SC-02` and `grade10-site-auction-auction-SC-103` now serve `grade10-site-auction-auction-US-01`, so both traces gain that journey; the paths and assertions are unchanged
- **Round 6** - QA2, 2026-10-12: Dev's round-6 reading opens the internal bidder's order at a house win and sends it no letter. `grade10-site-auction-e2e-US13-TC01-1` and `grade10-site-auction-e2e-US13-TC02-1` assert only collector reads and letters, which that leaves unchanged, so both keep their version; the internal order is walked by `grade10-admin-auction-e2e-US4-TC2-1`
- **Rejected** - none
- **Raised** - none
- **Uncovered anchors** - none
