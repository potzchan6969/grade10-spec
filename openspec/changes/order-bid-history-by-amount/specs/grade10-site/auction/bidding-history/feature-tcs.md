# grade10-site/auction/bidding-history Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-24, tcs-rules r7

## Walk 3: Collector reads one listing's combined history

**Starting state:**

**Steps 1–3 setup:**

- customer A(signed in) leads `<listing_42>` at `<opening price>`, with a maximum equal to `<opening price>`.
- customer B(signed in, card linked) is on `<listing_42 url>`.

**Steps 4–8 setup:**

- customer A(signed in) leads `<listing_45>` with maximum `<customer A maximum>`, above `<current bid>`.
- customer B(signed in, card linked) is on `<listing_45 url>`.
- The listing has current bid `<current bid>`.

**Steps 9–11 setup:**

- One listing has more public and private events than one page holds. No new event is added during the pass.

**Steps 12–15 setup:**

- customer A(signed in) has a combined history on `<listing_51>`.
- One decision on that history wrote customer A's maximum, their accepted price `<accepted price>`, customer B's response at `<response price>`, and customer A's outbid standing, between an older and a newer rival price.
- No new bid is placed on `<listing_51>` during the pass.

**Steps 16–18 setup:**

- Each row starts from the same fixture.
- customer A(signed in) leads `<listing_54>` with an accepted maximum `<customer A maximum>`.
- The current public bid is `<current bid>` and the increment is `<increment>`.
- customer B(signed in, card linked) has placed no bid on `<listing_54>` and is on `<listing_54 url>`.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_42 | An open HKD listing, opening price `<opening price>`; bind its identity only | · |
| customer B maximum | HK$520 | (range: 1000–79999 minor units) |
| opening price | HK$360 | (range: 1000–79999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_42 url | The URL of `<listing_42>`; bind its URL only |

**Steps 4–8 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_45 | An open HKD listing, current bid `<current bid>`; bind its identity only | · |
| customer A maximum | HK$650 | (range: 1000–79999 minor units) |
| customer B maximum | HK$410 | (range: 1000–79999 minor units) |
| current bid | HK$300 | (range: 1000–79999 minor units) |
| increment | The HKD tier increment at `<customer B maximum>`; bind its amount only | (fixed tier increment) |
| response price | `<customer B maximum>` plus `<increment>` | (derived) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_45 url | The URL of `<listing_45>`; bind its URL only |

**Steps 9–11 data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 12–15 data:**

| Field | Value |
| --- | --- |
| listing_51 | An open USD listing customer A and customer B both bid on; bind its identity only |
| split decision | The decision containing customer A's accepted price `<accepted price>`, customer B's response `<response price>` and customer A's outbid standing; bind its identity only |

| Field | Value | Fixture notes |
| --- | --- | --- |
| accepted price | USD320 | (range: 10000–49999 minor units) |
| response price | USD330 | (range: 10000–49999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps 16–18 data:**

| `<customer B maximum>` | `<public history>` | `<leader>` | `<account history>` | Fixture notes |
| --- | --- | --- | --- | --- |
| USD5 | customer B bids USD5, then customer A responds automatically at USD6, at the same time | customer A | customer B's maximum is retained at USD5 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 500, 600 |
| USD7 | customer B bids USD7, then customer A responds automatically at USD8, at the same time | customer A | customer B's maximum is retained at USD7 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 700, 800 |
| USD9.50 | customer B bids USD9.50, then customer A responds automatically at USD10 without exceeding USD10 | customer A | — | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 950, 1000 |
| USD10 | customer B bids USD10 first, then customer A responds automatically at USD10, at the same time | customer A | the maximum stays private; customer A's automatic response at USD10 reads above customer B's bid at USD10 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1000 |
| USD10.01 | customer B bids USD10.01 once; customer A has no new bid record | customer B | customer B's maximum is retained at USD10.01 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1001 |
| USD11 | customer B bids USD11 once, with no intermediate record or new bid record for customer A | customer B | — | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1100 |
| USD11.20 | customer B bids USD11 once, one increment above customer A's maximum; customer A has no new bid record | customer B | customer B's maximum is retained at USD11.20, and reads below customer B's bid at USD11 though it is the higher amount | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1100, 1120 |

| Field | Value | Fixture notes |
| --- | --- | --- |
| customer A maximum | USD10 | (fixed boundary for these history rows) |
| current bid | USD4 | (fixed starting state) |
| increment | USD1 | (fixed tier increment) |
| listing_54 | The listing with the retained activity described in the pre-conditions; bind its identity only | · |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_54 url | The URL of `<listing_54>`; bind its URL only |

### Route

1. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
2. As customer A, navigate to `<grade10 bids url>`.
3. Expand `<listing_42>`.
   - Customer B appears under the listing pseudonym. `g10.auction-bidding-history.US3-TC1`
   - That step shows customer A outbid at the public price. `g10.auction-bidding-history.US3-TC1`
   - The amounts shown are the public price. `g10.auction-bidding-history.US3-TC1`
   - Customer B's bid, at the higher amount, reads above customer A's earlier bid at `<opening price>`. `g10.auction-bidding-history.US3-TC1`
4. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
5. As customer A, navigate to `<grade10 bids url>`.
6. Expand `<listing_45>`.
   - Customer A's automatic response, at `<response price>`, reads above customer B's bid. `g10.auction-bidding-history.US3-TC2`
   - Customer A's response is marked automatic. `g10.auction-bidding-history.US3-TC2`
   - Both records read as one step. `g10.auction-bidding-history.US3-TC2`
7. As customer B, navigate to `<grade10 bids url>`.
8. Expand `<listing_45>`.
   - Customer B's maximum set, at `<customer B maximum>`, reads below customer B's bid. `g10.auction-bidding-history.US3-TC2`
9. Navigate to `<grade10 bids url>`.
10. Expand that listing's combined history.
11. Follow every returned cursor.
   - Every retained event visible to that collector appears exactly once in stable order. `g10.auction-bidding-history.US3-TC4`
12. Navigate to `<grade10 bids url>`.
13. Expand `<listing_51>`.
14. Follow every cursor at a page size of 1.
   - Step 14 returns every record of `<split decision>` on one page. `g10.auction-bidding-history.US3-TC5`
15. Read the same history as one page of 50.
   - Step 15 reads those records in the same order. `g10.auction-bidding-history.US3-TC5`
16. Enter `<customer B maximum>` in the custom maximum on the bid panel and place the bid.
17. Read the listing's public recent bids.
   - Step 17: public history reads as follows: `<public history>`, under listing pseudonyms. `g10.auction-bidding-history.US3-TC6`
18. Navigate to `<grade10 bids url>` and expand `<listing_54>`.
   - The leader is `<leader>`. `g10.auction-bidding-history.US3-TC6`
   - For rows with an account-history check, step 18 shows the following: `<account history>`. `g10.auction-bidding-history.US3-TC6`

## g10.auction-bidding-history.US3: Collector reads one listing's combined history

**As a** collector,
**I want** one history of public price movement and my private standing,
**so that** I can see how I was outbid without seeing anyone's hidden maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-sow rev=2 covers=g10.auction-bidding-history.SC-pbt -->
### g10.auction-bidding-history.US3-TC1: Competing bid shows customer A outbid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* customer A(signed in) leads `<listing_42>` at `<opening price>`, with a maximum equal to `<opening price>`.
* customer B(signed in, card linked) is on `<listing_42 url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_42 | An open HKD listing, opening price `<opening price>`; bind its identity only | · |
| customer B maximum | HK$520 | (range: 1000–79999 minor units) |
| opening price | HK$360 | (range: 1000–79999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_42 url | The URL of `<listing_42>`; bind its URL only |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
2. As customer A, navigate to `<grade10 bids url>`.
3. Expand `<listing_42>`.

**Expected Results:**

* Customer B appears under the listing pseudonym.
* That step shows customer A outbid at the public price.
* The amounts shown are the public price.
* Customer B's bid, at the higher amount, reads above customer A's earlier bid at `<opening price>`.

<!-- trace:case id=g10.auction-bidding-history.TC-i8u rev=2 covers=g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-m9q -->
### g10.auction-bidding-history.US3-TC2: Automatic response is attributed to customer A

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* customer A(signed in) leads `<listing_45>` with maximum `<customer A maximum>`, above `<current bid>`.
* customer B(signed in, card linked) is on `<listing_45 url>`.
* The listing has current bid `<current bid>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_45 | An open HKD listing, current bid `<current bid>`; bind its identity only | · |
| customer A maximum | HK$650 | (range: 1000–79999 minor units) |
| customer B maximum | HK$410 | (range: 1000–79999 minor units) |
| current bid | HK$300 | (range: 1000–79999 minor units) |
| increment | The HKD tier increment at `<customer B maximum>`; bind its amount only | (fixed tier increment) |
| response price | `<customer B maximum>` plus `<increment>` | (derived) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_45 url | The URL of `<listing_45>`; bind its URL only |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum and place the bid.
2. As customer A, navigate to `<grade10 bids url>`.
3. Expand `<listing_45>`.
4. As customer B, navigate to `<grade10 bids url>`.
5. Expand `<listing_45>`.

**Expected Results:**

* Step 3: customer A's automatic response, at `<response price>`, reads above customer B's bid.
* Step 3: customer A's response reads as You and is marked automatic.
* Step 3: both records read as one step.
* Step 3: customer B's bid reads above the earlier bid at `<current bid>`.
* Step 5: customer B's maximum set, at `<customer B maximum>`, reads below customer B's bid, though it is the higher amount.

<!-- trace:case id=g10.auction-bidding-history.TC-mug rev=1 covers=g10.auction-bidding-history.SC-k4s -->
### g10.auction-bidding-history.US3-TC4: Full retained history remains pageable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* One listing has more public and private events than one page holds. No new event is added during the pass.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Expand that listing's combined history.
3. Follow every returned cursor.

**Expected Results:**

* Every retained event visible to that collector appears exactly once in stable order.

<!-- trace:case id=g10.auction-bidding-history.TC-iuc rev=1 covers=g10.auction-bidding-history.SC-1rj -->
### g10.auction-bidding-history.US3-TC5: A history page never splits one auction decision

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) has a combined history on `<listing_51>`.
* One decision on that history wrote customer A's maximum, their accepted price `<accepted price>`, customer B's response at `<response price>`, and customer A's outbid standing, between an older and a newer rival price.
* No new bid is placed on `<listing_51>` during the pass.

**Test data:**

| Field | Value |
| --- | --- |
| listing_51 | An open USD listing customer A and customer B both bid on; bind its identity only |
| split decision | The decision containing customer A's accepted price `<accepted price>`, customer B's response `<response price>` and customer A's outbid standing; bind its identity only |

| Field | Value | Fixture notes |
| --- | --- | --- |
| accepted price | USD320 | (range: 10000–49999 minor units) |
| response price | USD330 | (range: 10000–49999 minor units) |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 bids url>`.
2. Expand `<listing_51>`.
3. Follow every cursor at a page size of 1.
4. Read the same history as one page of 50.

**Expected Results:**

* Step 3 returns every record of `<split decision>` on one page.
* Step 4 reads those records in the same order.

<!-- trace:case id=g10.auction-bidding-history.TC-mq5 rev=2 covers=g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg -->
### g10.auction-bidding-history.US3-TC6: Boundary maxima write the stated history

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* Each row starts from the same fixture.
* customer A(signed in) leads `<listing_54>` with an accepted maximum `<customer A maximum>`.
* The current public bid is `<current bid>` and the increment is `<increment>`.
* customer B(signed in, card linked) has placed no bid on `<listing_54>` and is on `<listing_54 url>`.

**Test data:**

| `<customer B maximum>` | `<public history>` | `<leader>` | `<account history>` | Fixture notes |
| --- | --- | --- | --- | --- |
| USD5 | customer B bids USD5, then customer A responds automatically at USD6, at the same time | customer A | customer B's maximum is retained at USD5 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 500, 600 |
| USD7 | customer B bids USD7, then customer A responds automatically at USD8, at the same time | customer A | customer B's maximum is retained at USD7 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 700, 800 |
| USD9.50 | customer B bids USD9.50, then customer A responds automatically at USD10 without exceeding USD10 | customer A | — | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 950, 1000 |
| USD10 | customer B bids USD10 first, then customer A responds automatically at USD10, at the same time | customer A | the maximum stays private; customer A's automatic response at USD10 reads above customer B's bid at USD10 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1000 |
| USD10.01 | customer B bids USD10.01 once; customer A has no new bid record | customer B | customer B's maximum is retained at USD10.01 | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1001 |
| USD11 | customer B bids USD11 once, with no intermediate record or new bid record for customer A | customer B | — | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1100 |
| USD11.20 | customer B bids USD11 once, one increment above customer A's maximum; customer A has no new bid record | customer B | customer B's maximum is retained at USD11.20, and reads below customer B's bid at USD11 though it is the higher amount | `<customer B maximum>`: (range: 100–9999 minor units); Exact recorded amounts in USD minor units: 1100, 1120 |

| Field | Value | Fixture notes |
| --- | --- | --- |
| customer A maximum | USD10 | (fixed boundary for these history rows) |
| current bid | USD4 | (fixed starting state) |
| increment | USD1 | (fixed tier increment) |
| listing_54 | The listing with the retained activity described in the pre-conditions; bind its identity only | · |

| Field | Value |
| --- | --- |
| grade10 bids url | The Grade10 Bids page URL; bind its URL only |
| listing_54 url | The URL of `<listing_54>`; bind its URL only |

**Steps:**

1. Enter `<customer B maximum>` in the custom maximum on the bid panel and place the bid.
2. Read the listing's public recent bids.
3. Navigate to `<grade10 bids url>` and expand `<listing_54>`.

**Expected Results:**

* Step 2: public history reads as follows: `<public history>`, under listing pseudonyms.
* The leader is `<leader>`.
* For rows with an account-history check, step 3 shows the following: `<account history>`.

<!-- trace:case id=g10.auction-bidding-history.TC-ybl rev=2 -->
### g10.auction-bidding-history.US3-TC3: Failed attempt sits beside unchanged auction state

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* A collector's attempt fails while another bidder remains leading.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Open that listing's combined history.
3. Check the accepted price and leading pseudonym.

**Expected Results:**

* The failed private event appears at its authoritative time with its safe reason.
* The auction's accepted price and leading pseudonym remain unchanged.

---

## Reconciliation

**Run:** QA2, 2026-10-24. QA1's blind pass read only the frozen Feature set, the journeys, the proposal, the decisions, the Bidding History page and the live suites; the requirement and scenarios were written apart from it.

- **Revised** - `g10.auction-bidding-history.US3-TC1`, `g10.auction-bidding-history.US3-TC2` and `g10.auction-bidding-history.US3-TC6`: each now verifies the amount order, so each moves up a revision and reads manual until the end-to-end test is updated
- **Added by QA2** - the maximum set reading below the bid it causes, though higher in amount, is asserted by `g10.auction-bidding-history.US3-TC2` step 5 and the USD11.20 row of `g10.auction-bidding-history.US3-TC6`; the higher-above-lower half is asserted by `g10.auction-bidding-history.US3-TC2` step 3
- **Corrected** - covers lists that claimed the whole journey were cut to the scenarios each case fully asserts
- **Contradicted** - none
- **Uncovered anchors** - none. The outbid standing and notification rows of `g10.auction-bidding-history.US3-TC6` stay as the live suite left them; this change does not touch them
- **Raised, answered** - Q7: a maximum set sorts with the bid it causes, whatever its own amount; answered in `## Settled`

## Settled

- Public recent bids keep their order; only the account's combined history on My bids changes.
- The admin Bids tab keeps its own order.
- A maximum set sorts with the bid it causes, so it reads below that bid even where its amount is higher.
